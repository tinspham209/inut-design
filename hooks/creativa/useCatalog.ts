/* eslint-disable camelcase */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useSWRInfinite from "swr/infinite";
import { creativaApi, CreativaRequestError } from "@/api-client/creativa-checkout";
import type { CreativaCatalogPage, CreativaProduct } from "@/models/creativa";
import { creativaSearchSchema } from "@/utils/creativa/forms";
import { trackCreativa } from "@/utils/creativa/analytics";

type Page = CreativaCatalogPage & { query: string };

export function useCreativaCatalog(
	initial: CreativaCatalogPage | null,
	initialError: string | null
) {
	const router = useRouter();
	const form = useForm({
		defaultValues: { query: "" },
		resolver: yupResolver(creativaSearchSchema),
	});
	const query = useWatch({ control: form.control, name: "query" });
	const [committed, setCommitted] = useState<string | null>(null);
	const [columns, setColumns] = useState(2);
	const currentQuery = useRef("");
	const currentColumns = useRef(columns);
	const impressed = useRef(new Set<string>());
	const batches = useRef(new Set<number>());
	const searchPending = useRef(false);
	const timer = useRef<ReturnType<typeof setTimeout>>();
	const additional = useRef<number | null>(null);
	const actionSequence = useRef(0);
	currentColumns.current = columns;

	const reportList = useCallback(
		(items: CreativaProduct[], price: number | null, page: number, offset = 0) => {
			const unseen = items
				.map((item, index) => ({ item, position: offset + index }))
				.filter(({ item }) => !impressed.current.has(item._id));
			if (!unseen.length) return;
			unseen.forEach(({ item }) => impressed.current.add(item._id));
			trackCreativa(
				"view_item_list",
				{
					item_count: unseen.length,
					page,
					columns: currentColumns.current,
					surface: "catalog",
					item_list_id: "creativa_skin_laptop",
					item_positions: unseen.map(({ position }) => position).join(","),
					price_basis: price !== null ? "from_active_coverage" : "unavailable",
				},
				unseen.map(({ item, position }) => ({
					item_id: item._id,
					item_name: item.name,
					item_category: "skin-laptop",
					item_list_id: "creativa_skin_laptop",
					index: position,
					quantity: 1,
					...(price !== null && { price }),
				}))
			);
		},
		[]
	);

	const commit = useCallback((value: string) => {
		const normalized = value.trim();
		if (currentQuery.current !== normalized) {
			searchPending.current = !!normalized || !!currentQuery.current;
			currentQuery.current = normalized;
			impressed.current.clear();
			batches.current.clear();
			additional.current = null;
		}
		setCommitted(normalized);
	}, []);

	const request = useSWRInfinite<Page>(
		(index, previous: Page | null) => {
			if (committed === null || (index > 0 && !previous?.cursor)) return null;
			return ["/api/creativa/catalog", committed, index === 0 ? null : previous.cursor];
		},
		async ([, value, cursor]: [string, string, string | null]) => ({
			...(await creativaApi.catalog(value, cursor)),
			query: value,
		}),
		{
			...(committed === "" && initial && { fallbackData: [{ ...initial, query: "" }] }),
			revalidateOnMount: true,
			revalidateOnFocus: false,
			revalidateFirstPage: false,
			shouldRetryOnError: false,
			persistSize: false,
			onError: () =>
				trackCreativa("catalog_load_error", {
					phase: additional.current ? "additional" : "initial",
					reason: "request_failed",
				}),
		}
	);
	useEffect(() => {
		if (committed !== null && committed !== currentQuery.current) return;
		const visible = request.data?.filter((page) => page.query === committed);
		const presented = visible?.length
			? visible
			: (committed === null || committed === "") && initial
			? [initial]
			: [];
		if (!presented.length) return;
		let offset = 0;
		const shown = new Set<string>();
		presented.forEach((page, index) => {
			const added = page.items.filter((item) => !shown.has(item._id));
			added.forEach((item) => shown.add(item._id));
			if (index > 0 && !batches.current.has(index))
				trackCreativa("catalog_pagination", { item_count: added.length, page: index + 1 });
			batches.current.add(index);
			reportList(added, page.fromPrice, index + 1, offset);
			offset += added.length;
		});
		if (searchPending.current) {
			searchPending.current = false;
			trackCreativa("search", {
				query_length: currentQuery.current.length,
				results_count: presented[0].items.length,
				surface: "catalog",
				search_context: "catalog",
			});
		}
	}, [request.data, committed, initial, reportList]);
	useEffect(() => {
		if (!router.isReady) return;
		clearTimeout(timer.current);
		const value = typeof router.query.q === "string" ? router.query.q.slice(0, 80) : "";
		form.setValue("query", value);
		commit(value);
		return () => clearTimeout(timer.current);
	}, [router.isReady, router.query.q, form.setValue, commit]);

	const pages = request.data?.filter((page) => page.query === committed);
	const active = pages?.length
		? pages
		: (committed === null || committed === "") && initial
		? [initial]
		: [];
	const items = [
		...new Map(active.flatMap((page) => page.items).map((item) => [item._id, item])).values(),
	];
	const last = active[active.length - 1];
	const data: CreativaCatalogPage = {
		items,
		cursor: last?.cursor || null,
		fromPrice: last?.fromPrice ?? null,
	};
	const loading = request.isValidating || committed === null || query.trim() !== committed;
	const error =
		request.error instanceof Error ? request.error.message : !request.data ? initialError : null;
	const additionalError = !!error && request.size > active.length && active.length > 0;
	async function loadMore() {
		if (!data.cursor || loading || additional.current) return;
		const action = ++actionSequence.current;
		additional.current = action;
		try {
			await request.setSize(request.size + 1);
		} catch (failure) {
			console.warn("[Creativa] Additional catalog request failed; see the retry message.", {
				code: failure instanceof CreativaRequestError ? failure.code : "CATALOG_UNAVAILABLE",
			});
		} finally {
			if (additional.current === action) additional.current = null;
		}
	}
	return {
		form,
		query,
		data,
		columns,
		loading,
		error,
		search: (value: string) => {
			clearTimeout(timer.current);
			timer.current = setTimeout(() => commit(value), 250);
		},
		changeColumns: (value: number) => {
			if (value === columns) return;
			trackCreativa("catalog_layout_change", { previous_columns: columns, columns: value });
			setColumns(value);
		},
		loadMore,
		retry: async () => {
			const action = ++actionSequence.current;
			if (additionalError) additional.current = action;
			try {
				await request.mutate((current) => current, { revalidate: true, throwOnError: false });
			} finally {
				if (additional.current === action) additional.current = null;
			}
		},
	};
}
