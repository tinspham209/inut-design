import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import {
	SearchPage as SearchResultPage,
	SearchResult,
	parseSearchParams,
	searchSite,
} from "@/server/search";
import { SEARCH_DEFAULT_PAGE_SIZE } from "@/server/search/domain";
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
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type SearchStatus = "prompt" | "success" | "error";

type Props = {
	query: string;
	page: SearchResultPage | null;
	status: SearchStatus;
};

const darkTextFieldSx = {
	"& .MuiInputLabel-root": {
		color: COLOR_CODE.TEXT_MUTED,
	},
	"& .MuiInputLabel-root.Mui-focused": {
		color: COLOR_CODE.PRIMARY,
	},
	"& .MuiOutlinedInput-root": {
		color: COLOR_CODE.WHITE,
		"& fieldset": {
			borderColor: COLOR_CODE.INK_4,
		},
		"&:hover fieldset": {
			borderColor: COLOR_CODE.TEXT_MUTED,
		},
		"&.Mui-focused fieldset": {
			borderColor: COLOR_CODE.PRIMARY,
		},
	},
	"& .MuiFormHelperText-root": {
		color: COLOR_CODE.TEXT_MUTED,
	},
};

const SearchResultCard = ({ result }: { result: SearchResult }) => (
	<Link href={result.url} passHref legacyBehavior>
		<Card
			component="a"
			onClick={() => trackSearchResultClick(result.kind)}
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
	</Link>
);

const Search: NextPageWithLayout<Props> = ({ query, page, status }) => {
	const router = useRouter();
	const knownUrls = React.useRef(new Set((page?.items || []).map((item) => item.url)));
	const [currentPage, setCurrentPage] = React.useState(page);
	const [isLoading, setIsLoading] = React.useState(false);
	const [loadError, setLoadError] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState(query);
	const [searchError, setSearchError] = React.useState(false);
	const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
	const requestInFlight = React.useRef(false);
	const activeFacet = typeof router.query.productType === "string" ? router.query.productType : "";

	React.useEffect(() => {
		setCurrentPage(page);
		knownUrls.current = new Set((page?.items || []).map((item) => item.url));
		setLoadError(false);
		setSearchValue(query);
	}, [activeFacet, page, query]);

	React.useEffect(() => {
		if (status !== "success" || !query) return;
		trackSearch(query, page?.total || 0);
	}, [query, status, page?.total]);

	const loadNextPage = React.useCallback(async () => {
		if (!currentPage?.hasMore || requestInFlight.current) return;
		requestInFlight.current = true;
		setIsLoading(true);
		setLoadError(false);
		try {
			const nextPage = currentPage.page + 1;
			const params = new URLSearchParams({
				q: query,
				page: String(nextPage),
				pageSize: String(currentPage.pageSize),
			});
			if (activeFacet) params.set("productType", activeFacet);

			const response = await fetch(`/api/search?${params.toString()}`);
			if (!response.ok) throw new Error("Search page unavailable");
			const result: SearchResultPage = await response.json();
			const newItems = result.items.filter((item) => {
				if (knownUrls.current.has(item.url)) return false;
				knownUrls.current.add(item.url);
				return true;
			});

			setCurrentPage({
				...result,
				items: [...(currentPage.items || []), ...newItems],
			});
			trackCatalogPagination("search", nextPage);
		} catch (error) {
			console.error("Error loading more search results:", error instanceof Error ? error.message : "unknown error");
			setLoadError(true);
		} finally {
			requestInFlight.current = false;
			setIsLoading(false);
		}
	}, [activeFacet, currentPage, query]);

	React.useEffect(() => {
		const sentinel = loadMoreRef.current;
		if (!sentinel || !currentPage?.hasMore || isLoading || loadError) return;

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
	}, [currentPage?.hasMore, isLoading, loadError, loadNextPage]);

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedValue = searchValue.trim().replace(/\s+/g, " ");
		if (!trimmedValue) {
			setSearchError(true);
			return;
		}

		setSearchError(false);
		void router.push(`/search?q=${encodeURIComponent(trimmedValue)}`);
	};

	return (
		<Box component="section" sx={{ bgcolor: COLOR_CODE.INK, color: COLOR_CODE.WHITE }} pt={4} pb={8}>
			<Seo
				data={{
					title: "Tìm kiếm - INUT Design",
					description:
						"Khám phá sản phẩm, dịch vụ, bài viết và thông tin hữu ích từ INUT Design.",
					url: "https://inutdesign.com/search",
					thumbnailUrl: "/branding/ogImage.jpg",
					noindex: true,
				}}
			/>
			<Container>
				<Breadcrumbs sx={{ color: COLOR_CODE.TEXT_MUTED }}>
					<Link href="/" passHref>
						<MuiLink sx={{ color: COLOR_CODE.TEXT_MUTED }}>Trang chủ</MuiLink>
					</Link>
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

				{status === "prompt" && (
					<Typography textAlign="center" sx={{ color: COLOR_CODE.TEXT_MUTED }} mt={6}>
						Nhập từ khóa để tìm sản phẩm, dịch vụ, bài viết hoặc thông tin trên INUT Design.
					</Typography>
				)}

				{status === "error" && (
					<Stack alignItems="center" spacing={2} mt={6}>
						<Typography textAlign="center" sx={{ color: COLOR_CODE.PRIMARY }}>
							Không thể tải kết quả tìm kiếm lúc này. Vui lòng thử lại.
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

				{status === "success" && currentPage && (
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
								Kết quả tìm kiếm{query ? ` cho “${query}”` : ""}
							</Typography>
							<Typography sx={{ color: COLOR_CODE.TEXT_MUTED }}>
								{currentPage.total} kết quả
							</Typography>
						</Stack>
						{currentPage.total === 0 ? (
							<Typography textAlign="center" sx={{ color: COLOR_CODE.TEXT_MUTED }} mt={6}>
								Không tìm thấy kết quả phù hợp.
							</Typography>
						) : (
							<Grid container spacing={{ xs: 2, md: 3 }}>
								{currentPage.items.map((result) => (
									<Grid item xs={12} sm={6} md={4} key={result.url}>
										<SearchResultCard result={result} />
									</Grid>
								))}
								{currentPage.hasMore && (
									<Grid item xs={12}>
										<Stack alignItems="center" py={2} ref={loadMoreRef}>
											{isLoading && (
												<Typography sx={{ color: COLOR_CODE.TEXT_MUTED }}>
													Đang tải thêm kết quả...
												</Typography>
											)}
											{loadError && (
												<Button
													onClick={loadNextPage}
													sx={{ color: COLOR_CODE.PRIMARY }}
												>
													Không tải được. Thử lại
												</Button>
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
	const parsed = parseSearchParams({
		q: query.q,
		productType: query.productType,
		page: query.page,
		pageSize: query.pageSize,
	});

	if (parsed.status !== "valid") {
		return {
			props: {
				query: "",
				page: null,
				status: "prompt",
			},
		};
	}

	try {
		const result = await searchSite({
			q: query.q,
			productType: query.productType,
			page: query.page,
			pageSize: query.pageSize || String(SEARCH_DEFAULT_PAGE_SIZE),
		});
		res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
		return {
			props: {
				query: parsed.request.query,
				page: result,
				status: "success",
			},
		};
	} catch (error) {
		console.error("Search source unavailable", error instanceof Error ? error.message : "unknown error");
		res.statusCode = 503;
		return {
			props: {
				query: parsed.request.query,
				page: null,
				status: "error",
			},
		};
	}
};

export default Search;
