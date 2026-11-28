import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import {
	parseSearchParams,
	searchDocuments,
	SEARCH_DEFAULT_PAGE_SIZE,
	type SearchResult,
} from "@/server/search/client";
import {
	loadPublicSearchIndex,
	toSearchDocuments,
	type PublicSearchIndex,
} from "@/server/search/public-index";
import { COLOR_CODE, trackCatalogPagination, trackSearch, trackSearchResultClick } from "@/utils";
import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardContent,
	Chip,
	Container,
	Grid,
	Link as MuiLink,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type SearchStatus = "prompt" | "loading" | "success" | "error";

const darkTextFieldSx = {
	"& .MuiInputLabel-root": { color: COLOR_CODE.TEXT_MUTED },
	"& .MuiInputLabel-root.Mui-focused": { color: COLOR_CODE.PRIMARY },
	"& .MuiOutlinedInput-root": {
		color: COLOR_CODE.WHITE,
		"& fieldset": { borderColor: COLOR_CODE.INK_4 },
		"&:hover fieldset": { borderColor: COLOR_CODE.TEXT_MUTED },
		"&.Mui-focused fieldset": { borderColor: COLOR_CODE.PRIMARY },
	},
	"& .MuiFormHelperText-root": { color: COLOR_CODE.TEXT_MUTED },
};

const SearchResultCard = ({ result }: { result: SearchResult }) => (
	<Card
		onClick={() => trackSearchResultClick(result.kind)}
		component={Link}
		href={result.url}
		sx={{
			height: "100%",
			display: "block",
			textDecoration: "none",
			backgroundColor: COLOR_CODE.INK_3,
			transition: "transform 150ms ease, border-color 150ms ease",
			border: "1px solid",
			borderColor: COLOR_CODE.INK_4,
			"&:hover": {
				transform: "translateY(-2px)",
				borderColor: COLOR_CODE.PRIMARY,
				backgroundColor: COLOR_CODE.INK_2,
			},
		}}
	>
		<CardContent>
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1} mb={1}>
				<Typography
					variant="h6"
					component="h2"
					sx={{ color: COLOR_CODE.WHITE }}
					fontWeight="bold"
				>
					{result.title}
				</Typography>
				<Chip
					size="small"
					variant="outlined"
					label={result.kindLabel}
					sx={{ color: COLOR_CODE.PRIMARY, borderColor: COLOR_CODE.PRIMARY }}
				/>
			</Stack>
			<Typography sx={{ color: COLOR_CODE.TEXT_MUTED, lineHeight: 1.65 }}>
				{result.excerpt}
			</Typography>
		</CardContent>
	</Card>
);

const Search: NextPageWithLayout = () => {
	const router = useRouter();
	const query = typeof router.query.q === "string" ? router.query.q : "";
	const activeFacet = typeof router.query.productType === "string" ? router.query.productType : "";
	const [index, setIndex] = React.useState<PublicSearchIndex | null>(null);
	const [status, setStatus] = React.useState<SearchStatus>("prompt");
	const [searchValue, setSearchValue] = React.useState(query);
	const [searchError, setSearchError] = React.useState(false);
	const [loadedPages, setLoadedPages] = React.useState(1);
	const [isLoadingMore, setIsLoadingMore] = React.useState(false);
	const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
	const trackedSearch = React.useRef("");

	React.useEffect(() => {
		const controller = new AbortController();
		setStatus(query ? "loading" : "prompt");
		loadPublicSearchIndex(controller.signal)
			.then((value) => {
				setIndex(value);
				setStatus(query ? "success" : "prompt");
			})
			.catch((error) => {
				if (controller.signal.aborted) return;
				console.error("Public search index unavailable", error instanceof Error ? error.message : "unknown error");
				setStatus("error");
			});
		return () => controller.abort();
	}, [query]);

	React.useEffect(() => {
		setSearchValue(query);
		setLoadedPages(1);
	}, [activeFacet, query]);

	const parsed = React.useMemo(
		() =>
			parseSearchParams({
				q: query,
				productType: activeFacet || undefined,
				page: "1",
				pageSize: String(SEARCH_DEFAULT_PAGE_SIZE * loadedPages),
			}),
		[activeFacet, loadedPages, query],
	);
	const page = React.useMemo(() => {
		if (!index || parsed.status !== "valid") return null;
		return searchDocuments(toSearchDocuments(index), parsed.request, index.legacyTypeSlugs);
	}, [index, parsed]);

	React.useEffect(() => {
		if (!page || !query || parsed.status !== "valid") return;
		const key = `${query}:${activeFacet}`;
		if (trackedSearch.current === key) return;
		trackedSearch.current = key;
		trackSearch(query, page.total);
	}, [activeFacet, page, parsed.status, query]);

	const loadNextPage = React.useCallback(() => {
		if (!page?.hasMore || isLoadingMore) return;
		setIsLoadingMore(true);
		setLoadedPages((value) => value + 1);
		window.requestAnimationFrame(() => setIsLoadingMore(false));
		trackCatalogPagination("search", loadedPages + 1);
	}, [isLoadingMore, loadedPages, page?.hasMore]);

	React.useEffect(() => {
		const sentinel = loadMoreRef.current;
		if (!sentinel || !page?.hasMore || isLoadingMore) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) loadNextPage();
			},
			{ rootMargin: "600px 0px" },
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [isLoadingMore, loadNextPage, page?.hasMore]);

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedValue = searchValue.trim().replace(/\s+/g, " ");
		if (!trimmedValue) {
			setSearchError(true);
			return;
		}
		setSearchError(false);
		const params = new URLSearchParams({ q: trimmedValue });
		if (activeFacet) params.set("productType", activeFacet);
		void router.push(`/search?${params.toString()}`);
	};

	const visibleStatus: SearchStatus =
		status === "error" ? "error" : !query ? "prompt" : !index ? "loading" : "success";

	return (
		<Box component="section" sx={{ bgcolor: COLOR_CODE.INK, color: COLOR_CODE.WHITE }} pt={4} pb={8}>
			<Seo
				data={{
					title: "Tìm kiếm - INUT Design",
					description: "Khám phá sản phẩm, dịch vụ, bài viết và thông tin hữu ích từ INUT Design.",
					url: "https://inutdesign.com/search",
					thumbnailUrl: "/branding/ogImage.jpg",
					noindex: true,
				}}
			/>
			<Container>
				<Breadcrumbs sx={{ color: COLOR_CODE.TEXT_MUTED }}>
					<MuiLink sx={{ color: COLOR_CODE.TEXT_MUTED }} component={Link} href="/">
						Trang chủ
					</MuiLink>
					<Typography sx={{ color: COLOR_CODE.WHITE }}>Tìm kiếm</Typography>
				</Breadcrumbs>

				<Box mt={4}>
					<Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
						<SearchIcon color="primary" />
						<Typography
							variant="h3"
							component="h1"
							sx={{ color: COLOR_CODE.WHITE }}
							fontWeight="bold"
							textAlign="center"
						>
							Tìm kiếm
						</Typography>
					</Stack>
					<Stack
						component="form"
						onSubmit={handleSearchSubmit}
						direction={{ xs: "column", sm: "row" }}
						spacing={1}
						maxWidth={720}
						mx="auto"
						mt={3}
						width="100%"
					>
						<TextField
							fullWidth
							size="small"
							label="Từ khóa tìm kiếm"
							value={searchValue}
							sx={darkTextFieldSx}
							onChange={(event) => {
								setSearchValue(event.target.value);
								if (searchError) setSearchError(false);
							}}
							error={searchError}
							helperText={searchError ? "Vui lòng nhập từ khóa tìm kiếm." : " "}
							inputProps={{ "aria-label": "Từ khóa tìm kiếm" }}
						/>
						<Button
							type="submit"
							variant="contained"
							startIcon={<SearchIcon />}
							sx={{ minWidth: { xs: "100%", sm: 140 }, height: 40, flexShrink: 0 }}
						>
							Tìm kiếm
						</Button>
					</Stack>
				</Box>

				{visibleStatus === "prompt" && (
					<Typography textAlign="center" sx={{ color: COLOR_CODE.TEXT_MUTED }} mt={6}>
						Nhập từ khóa để tìm sản phẩm, dịch vụ, bài viết hoặc thông tin trên INUT Design.
					</Typography>
				)}
				{visibleStatus === "loading" && (
					<Typography textAlign="center" sx={{ color: COLOR_CODE.TEXT_MUTED }} mt={6}>
						Đang tải dữ liệu tìm kiếm...
					</Typography>
				)}
				{visibleStatus === "error" && (
					<Stack alignItems="center" spacing={2} mt={6}>
						<Typography textAlign="center" sx={{ color: COLOR_CODE.PRIMARY }}>
							Không thể tải dữ liệu tìm kiếm lúc này. Vui lòng thử lại.
						</Typography>
						<Button
							variant="outlined"
							onClick={() => router.reload()}
							sx={{ color: COLOR_CODE.PRIMARY, borderColor: COLOR_CODE.PRIMARY }}
						>
							Thử lại
						</Button>
					</Stack>
				)}
				{visibleStatus === "success" && page && (
					<>
						<Stack
							direction={{ xs: "column", sm: "row" }}
							justifyContent="space-between"
							alignItems={{ xs: "flex-start", sm: "center" }}
							gap={1}
							mt={4}
							mb={2}
						>
							<Typography variant="h5" component="h2" fontWeight="bold">
								Kết quả tìm kiếm cho “{query}”
							</Typography>
							<Typography sx={{ color: COLOR_CODE.TEXT_MUTED }}>{page.total} kết quả</Typography>
						</Stack>
						{page.total === 0 ? (
							<Typography textAlign="center" sx={{ color: COLOR_CODE.TEXT_MUTED }} mt={6}>
								Không tìm thấy kết quả phù hợp.
							</Typography>
						) : (
							<Grid container spacing={{ xs: 2, md: 3 }}>
								{page.items.map((result) => (
									<Grid item xs={12} sm={6} md={4} key={result.url}>
										<SearchResultCard result={result} />
									</Grid>
								))}
								{page.hasMore && (
									<Grid item xs={12}>
										<Stack alignItems="center" py={2} ref={loadMoreRef}>
											{isLoadingMore && (
												<Typography sx={{ color: COLOR_CODE.TEXT_MUTED }}>
													Đang tải thêm kết quả...
												</Typography>
											)}
										</Stack>
									</Grid>
								)}
							</Grid>
						)}
					</>
				)}
			</Container>
		</Box>
	);
};

Search.Layout = MainLayout;
export default Search;

// Keep request-dependent pages out of the shared prerender cache.
export const getServerSideProps = async () => ({ props: {} });
