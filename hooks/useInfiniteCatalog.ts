import { useCallback, useEffect, useRef, useState } from "react";

type UseInfiniteCatalogOptions<T> = {
	initialItems: T[];
	initialPage: number;
	pageSize: number;
	total: number;
	resetKey?: string;
	loadPage: (page: number) => Promise<T[]>;
	onPageLoad?: (page: number) => void;
};

export function useInfiniteCatalog<T>({
	initialItems,
	initialPage,
	pageSize,
	total,
	resetKey = "",
	loadPage,
	onPageLoad,
}: UseInfiniteCatalogOptions<T>) {
	const [items, setItems] = useState(initialItems);
	const [page, setPage] = useState(initialPage);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [hasMore, setHasMore] = useState(initialItems.length < total);
	const requestInFlight = useRef(false);
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setItems(initialItems);
		setPage(initialPage);
		setError(null);
		setHasMore(initialItems.length < total);
	}, [initialItems, initialPage, resetKey, total]);

	const loadNextPage = useCallback(async () => {
		if (requestInFlight.current || !hasMore) return;

		const nextPage = page + 1;
		requestInFlight.current = true;
		setIsLoading(true);
		setError(null);

		try {
			const nextItems = await loadPage(nextPage);
			setItems((currentItems) => [...currentItems, ...nextItems]);
			setPage(nextPage);
			setHasMore(nextItems.length > 0 && nextPage * pageSize < total);
			onPageLoad?.(nextPage);
		} catch (loadError) {
			const normalizedError =
				loadError instanceof Error ? loadError : new Error("Failed to load more products.");
			console.error("Error loading more catalog items:", normalizedError);
			setError(normalizedError);
		} finally {
			requestInFlight.current = false;
			setIsLoading(false);
		}
	}, [hasMore, loadPage, onPageLoad, page, pageSize, total]);

	const retry = useCallback(() => {
		void loadNextPage();
	}, [loadNextPage]);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || !hasMore || isLoading || error) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					void loadNextPage();
				}
			},
			{ rootMargin: "600px 0px" }
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [error, hasMore, isLoading, loadNextPage]);

	return {
		items,
		sentinelRef,
		isLoading,
		error,
		hasMore,
		retry,
	};
}
