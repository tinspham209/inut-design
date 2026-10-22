/* eslint-disable camelcase */
import {
	Alert,
	Box,
	Button,
	Container,
	Grid,
	IconButton,
	Skeleton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";
import type { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { creativaApi } from "@/api-client/creativa-checkout";
import { sanityImageUrl } from "@/api-client/sanity-image";
import type { CreativaCatalogPage, CreativaProduct } from "@/models/creativa";
import type { NextPageWithLayout } from "@/models/common";
import { CreativaError, formatCreativaPrice } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";

function DesignCard({
	product,
	fromPrice,
}: {
	product: CreativaProduct;
	fromPrice: number | null;
}) {
	const [hover, setHover] = useState(false);
	const [failed, setFailed] = useState(false);
	const image = product.images[hover && product.images[1] ? 1 : 0];
	return (
		<Link href={`/creativa/skin-laptop/${product.slug.current}`} passHref>
			<Box
				component="a"
				sx={{ display: "block", color: "inherit", textDecoration: "none" }}
				onClick={() =>
					trackCreativa(
						"select_item",
						{
							product_id: product._id,
							product_name: product.name,
							product_type: "skin-laptop",
							surface: "catalog",
						},
						[
							{
								item_id: product._id,
								item_name: product.name,
								item_category: "skin-laptop",
								quantity: 1,
								...(fromPrice !== null && { price: fromPrice }),
							},
						]
					)
				}
			>
				<Box
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
					sx={{ bgcolor: "#fff", position: "relative", aspectRatio: "1", overflow: "hidden" }}
				>
					{image && !failed ? (
						<Image
							src={sanityImageUrl(image, "card")}
							alt={image.alt || product.name}
							layout="fill"
							objectFit="contain"
							onError={() => setFailed(true)}
						/>
					) : (
						<Stack alignItems="center" justifyContent="center" height="100%">
							<Typography variant="body2">Ảnh tạm thời chưa sẵn sàng</Typography>
						</Stack>
					)}
				</Box>
				<Typography
					component="h2"
					sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 400, mt: 1.5, lineHeight: 1.5 }}
				>
					{product.name}
				</Typography>
				<Typography variant="body2" mt={0.5}>
					{fromPrice === null
						? "Chưa có tùy chọn đang bán"
						: `Từ ${formatCreativaPrice(fromPrice)}`}
				</Typography>
			</Box>
		</Link>
	);
}

const SkinCatalog: NextPageWithLayout<{
	initial: CreativaCatalogPage | null;
	initialError: string | null;
}> = ({ initial, initialError }) => {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [data, setData] = useState<CreativaCatalogPage>(
		initial || { items: [], cursor: null, fromPrice: null }
	);
	const [columns, setColumns] = useState(2);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(initialError);
	const [errorPhase, setErrorPhase] = useState<"initial" | "additional" | null>(
		initialError ? "initial" : null
	);
	const [reload, setReload] = useState(0);
	const sequence = useRef(0);
	const activeQuery = useRef("");
	const presented = useRef(new Set<string>());
	const initialized = useRef(false);
	const additionalRequest = useRef<string | null>(null);
	const batch = useRef(1);
	const currentColumns = useRef(columns);
	const initialPage = useRef(initial);
	const impressed = useRef(new Set<string>());
	currentColumns.current = columns;
	const reportList = useCallback(
		(items: CreativaProduct[], fromPrice: number | null, page: number) => {
			const unseen = items.filter((item) => !impressed.current.has(item._id));
			if (!unseen.length) return;
			unseen.forEach((item) => impressed.current.add(item._id));
			trackCreativa(
				"view_item_list",
				{
					item_count: unseen.length,
					page,
					columns: currentColumns.current,
					surface: "catalog",
				},
				unseen.map((item) => ({
					item_id: item._id,
					item_name: item.name,
					item_category: "skin-laptop",
					quantity: 1,
					...(fromPrice !== null && { price: fromPrice }),
				}))
			);
		},
		[]
	);
	useEffect(() => {
		if (initialPage.current)
			reportList(initialPage.current.items, initialPage.current.fromPrice, 1);
	}, [reportList]);
	useEffect(() => {
		if (router.isReady)
			setQuery(typeof router.query.q === "string" ? router.query.q.slice(0, 80) : "");
	}, [router.isReady, router.query.q]);
	useEffect(() => {
		const generation = ++sequence.current;
		initialized.current = false;
		setLoading(true);
		const controller = new AbortController();
		const normalized = query.trim();
		const timer = window.setTimeout(() => {
			const previousQuery = activeQuery.current;
			if (activeQuery.current !== normalized) {
				impressed.current.clear();
				setData({ items: [], cursor: null, fromPrice: initial?.fromPrice ?? null });
			}
			activeQuery.current = normalized;
			setLoading(true);
			setError(null);
			void creativaApi
				.catalog(normalized, null, controller.signal)
				.then((page) => {
					if (generation !== sequence.current) return;
					setData(page);
					presented.current = new Set(page.items.map((item) => item._id));
					batch.current = 1;
					initialized.current = true;
					reportList(page.items, page.fromPrice, 1);
					if (normalized || previousQuery)
						trackCreativa("search", {
							query_length: normalized.length,
							results_count: page.items.length,
							surface: "catalog",
						});
				})
				.catch((failure: Error) => {
					if (controller.signal.aborted || generation !== sequence.current) return;
					setError(failure.message);
					setErrorPhase("initial");
					trackCreativa("catalog_load_error", { phase: "initial", reason: "request_failed" });
				})
				.finally(() => {
					if (generation === sequence.current) setLoading(false);
				});
		}, 250);
		return () => {
			window.clearTimeout(timer);
			controller.abort();
		};
		// Layout changes deliberately do not reset the query lifecycle.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query, reload, reportList]);
	async function loadMore() {
		if (!data.cursor || loading || !initialized.current || query.trim() !== activeQuery.current)
			return;
		const generation = sequence.current;
		const requestKey = `${generation}:${data.cursor}`;
		if (additionalRequest.current === requestKey) return;
		additionalRequest.current = requestKey;
		setLoading(true);
		setError(null);
		try {
			const next = await creativaApi.catalog(activeQuery.current, data.cursor);
			if (generation !== sequence.current) return;
			const added = next.items.filter((item) => !presented.current.has(item._id));
			added.forEach((item) => presented.current.add(item._id));
			const nextBatch = ++batch.current;
			setData((current) => ({
				...next,
				items: [...current.items, ...added],
			}));
			trackCreativa("catalog_pagination", { item_count: added.length, page: nextBatch });
			reportList(added, next.fromPrice, nextBatch);
		} catch (failure) {
			if (generation === sequence.current) {
				setError(failure instanceof Error ? failure.message : "Không thể tải thêm sản phẩm.");
				setErrorPhase("additional");
				trackCreativa("catalog_load_error", { phase: "additional", reason: "request_failed" });
			}
		} finally {
			if (additionalRequest.current === requestKey) additionalRequest.current = null;
			if (generation === sequence.current) setLoading(false);
		}
	}
	return (
		<>
			<CreativaSeo title="Skin MacBook" path="/creativa/skin-laptop" />
			<Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
				<Stack gap={2}>
					<Typography component="h1" sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 400 }}>
						Skin MacBook
					</Typography>
					<Stack direction="row" alignItems="center" gap={1} justifyContent="space-between">
						<TextField
							size="small"
							label="Tìm theo tên thiết kế"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							inputProps={{ maxLength: 80 }}
							sx={{ maxWidth: 380, flex: 1 }}
						/>
						<Stack direction="row" sx={{ display: { md: "none" } }}>
							{[1, 2].map((value) => (
								<IconButton
									key={value}
									aria-label={`${value} cột`}
									aria-pressed={columns === value}
									sx={{ bgcolor: columns === value ? "#eee1d9" : undefined }}
									onClick={() => {
										trackCreativa("catalog_layout_change", {
											previous_columns: columns,
											columns: value,
										});
										setColumns(value);
									}}
								>
									{value === 1 ? <CropPortraitIcon /> : <GridViewOutlinedIcon />}
								</IconButton>
							))}
						</Stack>
					</Stack>
					{error && (
						<Alert
							severity="error"
							action={
								<Button
									color="inherit"
									onClick={() =>
										errorPhase === "additional" && data.cursor
											? void loadMore()
											: setReload((value) => value + 1)
									}
								>
									Thử lại
								</Button>
							}
						>
							{error}
						</Alert>
					)}
					{!loading && !error && !data.items.length && (
						<Alert severity="info">
							{query.trim()
								? "Không tìm thấy thiết kế phù hợp."
								: "Bộ sưu tập đang được chuẩn bị. Sản phẩm sẽ hiển thị khi được công bố."}
						</Alert>
					)}
					<Grid container spacing={{ xs: 1.5, md: 2.5 }}>
						{data.items.map((product) => (
							<Grid item xs={columns === 1 ? 12 : 6} sm={6} md={4} lg={3} key={product._id}>
								<DesignCard product={product} fromPrice={data.fromPrice} />
							</Grid>
						))}
						{loading &&
							!data.items.length &&
							[1, 2, 3, 4].map((key) => (
								<Grid item xs={columns === 1 ? 12 : 6} md={3} key={key}>
									<Skeleton variant="rectangular" sx={{ aspectRatio: "1", height: "auto" }} />
								</Grid>
							))}
					</Grid>
					{data.cursor && (
						<Button
							disabled={loading}
							variant="outlined"
							onClick={() => void loadMore()}
							sx={{ alignSelf: "center", minWidth: 180, mt: 3 }}
						>
							{loading ? "Đang tải…" : "Xem thêm thiết kế"}
						</Button>
					)}
				</Stack>
			</Container>
		</>
	);
};
SkinCatalog.Layout = CreativaLayout;
export const getStaticProps: GetStaticProps = async () => {
	const { creativaCatalogApi } = await import("@/api-client/creativa-catalog");
	try {
		return {
			props: { initial: await creativaCatalogApi.getPage(), initialError: null },
			revalidate: 60,
		};
	} catch (failure) {
		console.error("[Creativa catalog] Rendering unavailable state.", {
			code: failure instanceof CreativaError ? failure.code : "CATALOG_UNAVAILABLE",
		});
		return {
			props: {
				initial: null,
				initialError:
					failure instanceof CreativaError
						? failure.message
						: "Không thể tải danh mục. Vui lòng thử lại.",
			},
			revalidate: 60,
		};
	}
};
export default SkinCatalog;
