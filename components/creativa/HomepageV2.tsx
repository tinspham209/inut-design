/* eslint-disable camelcase */
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Box,
	Button,
	Grid,
	Stack,
	Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { CreativaDesignCard } from "@/components/creativa/DesignCard";
import { HOME_CATALOG, HOME_DETAILS, HOME_MODELS, HOME_STYLES } from "@/data/creativa/homepage-v2";
import type { CreativaCatalogPage } from "@/models/creativa";
import { trackCreativa } from "@/utils/creativa/analytics";

const orange = "#ae3500";
const blue = "#cbe7f7";
const brown = "#49261d";
const cream = "#fffcf2";
const section = { px: { xs: 2, sm: 3, md: 5 }, py: { xs: 5, md: 8 } };
const title = {
	fontFamily: "Poppins, Roboto, Arial, sans-serif",
	fontSize: { xs: 28, sm: 34, md: 46 },
	fontWeight: 700,
	letterSpacing: "-.045em",
	lineHeight: 1.15,
};

function HomeLink({
	children,
	name,
	href = HOME_CATALOG,
	outlined = false,
}: {
	children: ReactNode;
	name: string;
	href?: string;
	outlined?: boolean;
}) {
	return (
		<Link href={href} passHref>
			<Button
				component="a"
				variant={outlined ? "outlined" : "text"}
				endIcon={<ArrowForwardIcon />}
				onClick={() => trackCreativa("cta_click", { surface: "home_v2", cta_name: name })}
				sx={{
					color: brown,
					fontFamily: '"Be Vietnam Pro", Roboto, sans-serif',
					fontSize: { xs: 12, md: 13 },
					fontWeight: 700,
					borderColor: orange,
					borderRadius: 20,
					px: outlined ? 2.5 : 0,
					bgcolor: outlined ? cream : "transparent",
					"&:hover": { borderColor: orange, bgcolor: outlined ? "#fff" : "transparent" },
				}}
			>
				{children}
			</Button>
		</Link>
	);
}

function ConceptImage({
	src,
	alt,
	aspect = "1",
	priority = false,
	alternate,
}: {
	src: string;
	alt: string;
	aspect?: string;
	priority?: boolean;
	alternate?: string;
}) {
	return (
		<Box
			component="figure"
			sx={{
				m: 0,
				position: "relative",
				overflow: "hidden",
				aspectRatio: aspect,
				bgcolor: blue,
				"& .hover-image": { opacity: 0, transition: "opacity .35s ease" },
				"@media (hover: hover)": { "&:hover .hover-image": { opacity: 1 } },
				"@media (prefers-reduced-motion: reduce)": { "& .hover-image": { transition: "none" } },
			}}
		>
			<Image
				src={src}
				alt={`Ảnh concept AI: ${alt}`}
				layout="fill"
				objectFit="cover"
				priority={priority}
				sizes="(min-width: 900px) 50vw, 100vw"
			/>
			{alternate && (
				<Box className="hover-image" aria-hidden="true" sx={{ position: "absolute", inset: 0 }}>
					<Image
						src={alternate}
						alt=""
						layout="fill"
						objectFit="cover"
						sizes="(min-width: 900px) 33vw, 80vw"
					/>
				</Box>
			)}
			<Typography
				component="figcaption"
				sx={{
					position: "absolute",
					right: 8,
					top: 8,
					bgcolor: "rgba(255,252,242,.94)",
					px: 1,
					py: 0.25,
					color: brown,
					fontSize: 10,
				}}
			>
				Ảnh concept AI
			</Typography>
		</Box>
	);
}

function Products({
	catalog,
	error,
}: {
	catalog: CreativaCatalogPage | null;
	error: string | null;
}) {
	const impressed = useRef(new Set<string>());
	useEffect(() => {
		if (!catalog) return;
		const unseen = catalog.items
			.map((product, index) => ({ product, index }))
			.filter(({ product }) => !impressed.current.has(product._id));
		if (!unseen.length) return;
		unseen.forEach(({ product }) => impressed.current.add(product._id));
		trackCreativa(
			"view_item_list",
			{
				surface: "home",
				item_list_id: "creativa_home_skin_laptop",
				item_count: unseen.length,
				item_positions: unseen.map(({ index }) => index).join(","),
				price_basis: catalog.fromPrice !== null ? "from_active_coverage" : "unavailable",
			},
			unseen.map(({ product, index }) => ({
				item_id: product._id,
				item_name: product.name,
				item_category: "skin-laptop",
				item_list_id: "creativa_home_skin_laptop",
				index,
				quantity: 1,
				...(catalog.fromPrice !== null && { price: catalog.fromPrice }),
			}))
		);
	}, [catalog]);
	return (
		<Box component="section" aria-labelledby="v2-products" sx={section}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} mb={1}>
				<Typography component="h2" id="v2-products" sx={title}>
					Dành cho bạn.
				</Typography>
				<HomeLink name="view_all">Xem tất cả</HomeLink>
			</Stack>
			<Typography sx={{ maxWidth: 620, mb: 3 }}>
				Từ caro, kẻ sọc đến hoa lá. Chọn mẫu skin yêu thích, kiểm tra đúng dòng MacBook và phần máy
				muốn dán.
			</Typography>
			{error ? (
				<Alert severity="error">{error} Mở danh mục để thử lại.</Alert>
			) : !catalog?.items.length ? (
				<Alert severity="info">
					Bộ sưu tập đang được chuẩn bị. Sản phẩm sẽ hiển thị khi được công bố.
				</Alert>
			) : (
				<Grid container spacing={{ xs: 1.5, md: 3 }}>
					{catalog.items.map((product, index) => (
						<Grid item xs={6} md={3} key={product._id}>
							<CreativaDesignCard
								product={product}
								fromPrice={catalog.fromPrice}
								position={index}
								surface="home"
							/>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
}

export function CreativaHomepageV2({
	catalog,
	catalogError,
}: {
	catalog: CreativaCatalogPage | null;
	catalogError: string | null;
}) {
	return (
		<Box
			sx={{
				bgcolor: cream,
				color: brown,
				fontFamily: '"Nunito Sans", Roboto, Arial, sans-serif',
				"& .MuiTypography-root": { fontFamily: "inherit" },
				"& .MuiTypography-root:is(h1, h2)": {
					fontFamily: "Poppins, Roboto, Arial, sans-serif",
				},
				"& a:not(.MuiButton-root)": { color: brown },
			}}
		>
			<Box
				component="section"
				aria-labelledby="v2-hero"
				sx={{ position: "relative", bgcolor: "#e9e5e0" }}
			>
				<Box
					sx={{
						position: "relative",
						height: { xs: 440, sm: 560, md: "min(53vw, 760px)" },
						minHeight: { md: 580 },
					}}
				>
					<Image
						src="/creativa/homepage-v2/hero.jpg"
						alt="Ảnh concept AI: người ngồi trên sofa cùng các mẫu MacBook kẻ sọc, caro và hoa"
						layout="fill"
						objectFit="cover"
						objectPosition="center"
						priority
						sizes="100vw"
					/>
					<Box
						sx={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(180deg,rgba(255,252,242,.55),transparent 40%,rgba(73,38,29,.05))",
						}}
					/>
					<Box
						sx={{
							position: "absolute",
							top: { xs: 18, md: 26 },
							left: { xs: 16, md: 40 },
							right: 16,
						}}
					>
						<Typography
							component="h1"
							id="v2-hero"
							sx={{
								...title,
								fontSize: { xs: "12vw", sm: "11.5vw", md: "10.5vw" },
								whiteSpace: "nowrap",
								letterSpacing: "-.055em",
								color: "#fd4d01",
								lineHeight: 1,
							}}
						>
							Skin MacBook
						</Typography>
						<Typography
							sx={{ fontSize: { xs: 15, md: 23 }, fontWeight: 700, fontStyle: "italic", mt: 0.5 }}
						>
							MacBook cũng có gu riêng.
						</Typography>
					</Box>
					<Box sx={{ position: "absolute", left: { xs: 16, md: 40 }, bottom: { xs: 18, md: 35 } }}>
						<HomeLink name="hero_shop" outlined>
							Khám phá skin MacBook
						</HomeLink>
					</Box>
					<Typography
						sx={{
							position: "absolute",
							right: 8,
							bottom: 8,
							px: 1,
							bgcolor: "rgba(255,252,242,.94)",
							color: brown,
							fontSize: 10,
						}}
					>
						Ảnh concept AI
					</Typography>
				</Box>
				<Stack
					direction="row"
					justifyContent="space-around"
					gap={1}
					sx={{ py: 2, px: 1, bgcolor: "#fff" }}
				>
					{["Chọn mẫu hợp gu", "Chọn đúng dòng MacBook", "Chọn phần máy muốn dán"].map((item) => (
						<Typography
							key={item}
							sx={{
								textAlign: "center",
								fontSize: { xs: 10, sm: 12 },
								fontWeight: 700,
								lineHeight: 1.3,
								flex: 1,
							}}
						>
							{item}
						</Typography>
					))}
				</Stack>
			</Box>

			<Box component="section" sx={{ ...section, bgcolor: blue, textAlign: "center" }}>
				<Typography component="h2" sx={{ ...title, color: orange, maxWidth: 760, mx: "auto" }}>
					Để chiếc MacBook nói lên phong cách của bạn.
				</Typography>
				<Typography sx={{ maxWidth: 760, mx: "auto", mt: 2, mb: 2, fontSize: { xs: 14, md: 16 } }}>
					Chúng ta dành thời gian chọn một bộ trang phục, tìm một chiếc túi hợp gu hay trang trí góc
					làm việc theo cách mình thích. Vậy tại sao chiếc MacBook bạn sử dụng mỗi ngày lại phải
					trông giống hàng triệu chiếc máy khác? INUT Creativa mang đến những thiết kế skin MacBook
					sáng tạo mang màu sắc, cá tính và dấu ấn rất riêng của bạn.
				</Typography>
				<HomeLink name="manifesto" outlined>
					Tìm skin hợp gu
				</HomeLink>
			</Box>

			<Box component="section" aria-labelledby="v2-models" sx={section}>
				<CreativaBreadcrumbs ancestors={[{ label: "INUT Design", href: "/" }]} current="Creativa" />
				<Stack
					direction={{ xs: "column", sm: "row" }}
					justifyContent="space-between"
					alignItems={{ sm: "end" }}
					gap={1}
					mb={2.5}
				>
					<Typography component="h2" id="v2-models" sx={title}>
						Lựa skin theo dòng máy.
					</Typography>
					<Typography variant="caption">Chọn dòng máy trước. Chọn kích thước sau.</Typography>
				</Stack>
				<Typography sx={{ mb: 2, color: "text.secondary" }}>
					Khám phá thiết kế, sau đó chọn chính xác dòng máy và kích thước tại trang sản phẩm.
				</Typography>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))" },
						gap: { xs: 1, md: 2 },
					}}
				>
					{HOME_MODELS.map((model) => (
						<Link key={model.id} href={HOME_CATALOG} passHref>
							<Box
								component="a"
								onClick={() =>
									trackCreativa("cta_click", {
										surface: "home_v2",
										cta_name: "model_catalog",
										target: model.id,
									})
								}
								sx={{ textDecoration: "none" }}
							>
								<ConceptImage
									src={model.image}
									alt="Gợi ý phong cách skin MacBook"
									aspect="4 / 5"
								/>
								<Stack direction="row" justifyContent="space-between" gap={0.5} mt={1}>
									<Typography component="h3" sx={{ fontWeight: 700, fontSize: { xs: 12, md: 18 } }}>
										{model.name}
									</Typography>
									<ArrowForwardIcon sx={{ fontSize: { xs: 16, md: 22 }, color: orange }} />
								</Stack>
								<Typography variant="caption" sx={{ fontSize: { xs: 10, md: 12 } }}>
									Xem danh mục
								</Typography>
							</Box>
						</Link>
					))}
				</Box>
			</Box>

			<Box component="section" aria-labelledby="v2-style" sx={{ ...section, pt: { xs: 1, md: 3 } }}>
				<Stack direction="row" alignItems="end" justifyContent="space-between" gap={1} mb={2}>
					<Typography component="h2" id="v2-style" sx={title}>
						Khám phá theo gu của bạn.
					</Typography>
					<Typography variant="caption" sx={{ display: { xs: "none", sm: "block" } }}>
						Chọn phong cách thiết kế
					</Typography>
				</Stack>
				<Typography sx={{ mb: 2, color: "text.secondary" }}>
					Cảm hứng phong cách — xem toàn bộ thiết kế trong danh mục.
				</Typography>
				<Box
					sx={{
						display: { xs: "flex", sm: "grid" },
						gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
						gap: 1.5,
						overflowX: "auto",
						scrollSnapType: "x mandatory",
						pb: 1,
					}}
				>
					{HOME_STYLES.map((style) => (
						<Link key={style.id} href={HOME_CATALOG} passHref>
							<Box
								component="a"
								onClick={() =>
									trackCreativa("cta_click", {
										surface: "home_v2",
										cta_name: "style_catalog",
										target: style.id,
									})
								}
								sx={{
									flex: { xs: "0 0 78%", sm: "initial" },
									minWidth: 0,
									textDecoration: "none",
									scrollSnapAlign: "start",
								}}
							>
								<ConceptImage
									src={style.image}
									alternate={style.alternate}
									alt="Cảm hứng skin MacBook trong không gian hằng ngày"
								/>
								<Stack direction="row" justifyContent="space-between" gap={1} mt={1.5}>
									<Typography component="h3" sx={{ fontSize: 17, fontWeight: 700 }}>
										{style.title}
									</Typography>
									<ArrowForwardIcon sx={{ color: orange }} />
								</Stack>
								<Typography variant="caption">Xem tất cả mẫu</Typography>
							</Box>
						</Link>
					))}
				</Box>
			</Box>

			<Box
				component="section"
				aria-labelledby="v2-outfit"
				sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, bgcolor: "#e8f4fa" }}
			>
				<ConceptImage
					src="/creativa/homepage-v2/editorial.jpg"
					alt="MacBook họa tiết sọc được sử dụng tại bàn làm việc"
					aspect="4 / 3"
				/>
				<Stack alignItems="flex-start" justifyContent="center" gap={2} sx={section}>
					<Typography variant="overline" sx={{ letterSpacing: ".12em", fontWeight: 700 }}>
						INUT Design / Creativa
					</Typography>
					<Typography component="h2" id="v2-outfit" sx={title}>
						Chọn outfit hôm nay cho MacBook của bạn.
					</Typography>
					<Typography sx={{ maxWidth: 500 }}>
						INUT Creativa dành cho những người thích làm mới điều quen thuộc, bắt đầu từ chiếc
						MacBook bạn mang theo mỗi ngày.
					</Typography>
					<HomeLink name="outfit">Xem các mẫu skin</HomeLink>
				</Stack>
			</Box>

			<Products catalog={catalog} error={catalogError} />

			<Box component="section" sx={{ ...section, bgcolor: "#e8f4fa", textAlign: "center" }}>
				<Typography
					component="h2"
					sx={{ ...title, color: orange, maxWidth: 880, mx: "auto", fontSize: { xs: 25, md: 39 } }}
				>
					Thiết kế và công năng cùng hiện diện trong từng lựa chọn.
				</Typography>
				<Box mt={2}>
					<HomeLink name="brand_statement">Khám phá skin MacBook</HomeLink>
				</Box>
			</Box>

			<Box
				component="section"
				aria-labelledby="v2-details"
				sx={{
					...section,
					display: "grid",
					gridTemplateColumns: { md: "1.1fr 1fr" },
					gap: { xs: 3, md: 6 },
					alignItems: "start",
				}}
			>
				<Box>
					<Typography component="h2" id="v2-details" sx={{ ...title, mb: 3 }}>
						Điều gì khiến một chiếc skin của INUT đáng để lựa chọn?
					</Typography>
					{HOME_DETAILS.map((detail) => (
						<Accordion
							key={detail.id}
							disableGutters
							elevation={0}
							onChange={(_, expanded) =>
								trackCreativa("cta_click", {
									surface: "home_v2_details",
									cta_name: "detail_toggle",
									target: detail.id,
									action: expanded ? "expand" : "collapse",
								})
							}
							sx={{
								bgcolor: "transparent",
								borderTop: "1px solid #bca89e",
								"&:before": { display: "none" },
								"&:last-of-type": { borderBottom: "1px solid #bca89e" },
							}}
						>
							<AccordionSummary
								expandIcon={<AddIcon />}
								id={`v2-${detail.id}`}
								aria-controls={`v2-${detail.id}-content`}
								sx={{ px: 0, minHeight: 58 }}
							>
								<Typography component="h3" sx={{ fontWeight: 700, fontSize: { xs: 14, md: 16 } }}>
									{detail.title}
								</Typography>
							</AccordionSummary>
							<AccordionDetails sx={{ px: 0, pb: 3 }}>
								<Typography>{detail.content}</Typography>
							</AccordionDetails>
						</Accordion>
					))}
					<Box mt={2}>
						<HomeLink name="details">Tìm skin phù hợp</HomeLink>
					</Box>
				</Box>
				<ConceptImage
					src="/creativa/homepage-v2/creative.jpg"
					alt="Cận cảnh MacBook dán skin kẻ sọc bên ly cà phê"
					aspect="1"
				/>
			</Box>
		</Box>
	);
}
