/* eslint-disable camelcase */
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Box,
	Button,
	Container,
	Grid,
	Stack,
	Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
	CREATIVA_HOME_DETAILS,
	CREATIVA_SKIN_CATALOG,
	type CreativaHomeStyle,
} from "@/data/creativa/homepage";
import type { CreativaCatalogPage } from "@/models/creativa";
import { trackCreativa } from "@/utils/creativa/analytics";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { CreativaDesignCard } from "@/components/creativa/DesignCard";

const sectionSpacing = { px: { xs: 2, md: 4 }, py: { xs: 4, md: 7 } };
const headingStyle = {
	fontSize: { xs: 30, md: 48 },
	fontWeight: 400,
	letterSpacing: "-.045em",
	lineHeight: 1.15,
};

function HomeLink({
	children,
	name,
	href = CREATIVA_SKIN_CATALOG,
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
				onClick={() => trackCreativa("cta_click", { surface: "home", cta_name: name })}
				sx={{
					borderRadius: 20,
					px: outlined ? 2.5 : 0,
					alignSelf: "flex-start",
					borderColor: "currentColor",
					...(outlined && { bgcolor: "rgba(246,243,237,.94)" }),
				}}
			>
				{children}
			</Button>
		</Link>
	);
}

export function CreativaConceptImage({
	src,
	alt,
	ratio = "1",
	priority = false,
}: {
	src: string;
	alt: string;
	ratio?: string;
	priority?: boolean;
}) {
	return (
		<Box
			component="figure"
			sx={{
				m: 0,
				position: "relative",
				width: "100%",
				aspectRatio: ratio,
				...(ratio === "auto" && { height: "100%" }),
				bgcolor: "#d7c7b5",
				overflow: "hidden",
			}}
		>
			<Image
				src={src}
				alt={`Ảnh concept AI: ${alt}`}
				layout="fill"
				objectFit="cover"
				priority={priority}
				sizes="(min-width: 900px) 100vw, 100vw"
			/>
			<Box
				component="figcaption"
				sx={{
					position: "absolute",
					right: 10,
					top: priority ? { xs: 10, md: 76 } : 10,
					bgcolor: "rgba(246,243,237,.94)",
					color: "#382a23",
					px: 1,
					py: 0.25,
					fontSize: 10,
					letterSpacing: ".035em",
					lineHeight: 1.8,
				}}
			>
				Ảnh concept AI
			</Box>
		</Box>
	);
}

function FeaturedStyle({ style }: { style: CreativaHomeStyle }) {
	const [expanded, setExpanded] = useState(false);
	return (
		<Box component="article">
			<Box sx={{ position: "relative" }}>
				<CreativaConceptImage src={style.image} alt={style.imageAlt} ratio="4 / 5" />
				<Stack alignItems="center" sx={{ position: "absolute", top: "42%", left: 16, right: 16 }}>
					<Button
						aria-expanded={expanded}
						aria-controls={`style-${style.id}`}
						onClick={() => {
							setExpanded(!expanded);
							trackCreativa("cta_click", {
								surface: "home_style",
								cta_name: "style_reveal",
								target: style.id,
								action: expanded ? "collapse" : "expand",
							});
						}}
						sx={{
							fontSize: { xs: 26, md: 34 },
							fontWeight: 400,
							letterSpacing: "-.04em",
							color: "#261e19",
							bgcolor: "rgba(246,243,237,.9)",
							borderRadius: 0,
							px: 2,
							"&:hover": { bgcolor: "#f6f3ed" },
						}}
						endIcon={
							<AddIcon
								sx={{
									transform: expanded ? "rotate(45deg)" : "none",
									transition: "transform .25s",
									"@media (prefers-reduced-motion: reduce)": { transition: "none" },
								}}
							/>
						}
					>
						{style.title}
					</Button>
					<Typography
						id={`style-${style.id}`}
						aria-hidden={!expanded}
						sx={{
							mt: 0.5,
							px: 2,
							py: 0.5,
							fontSize: { xs: 20, md: 26 },
							bgcolor: "#f6f3ed",
							opacity: expanded ? 1 : 0,
							transform: expanded ? "translateY(0)" : "translateY(8px)",
							transition: "opacity .25s, transform .25s",
							"@media (prefers-reduced-motion: reduce)": { transition: "none" },
						}}
					>
						({style.reveal})
					</Typography>
				</Stack>
				<Box
					sx={{
						position: "absolute",
						bottom: 24,
						left: 16,
						right: 16,
						display: "flex",
						justifyContent: "center",
					}}
				>
					<HomeLink href={style.href} name={`featured_${style.id}`} outlined>
						{style.cta}
					</HomeLink>
				</Box>
			</Box>
			<Typography sx={{ px: { xs: 2, md: 4 }, py: 2.5, maxWidth: 620 }}>
				{style.description}
			</Typography>
		</Box>
	);
}

function HomeProducts({
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
		<Box component="section" aria-labelledby="home-products" sx={sectionSpacing}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} mb={2}>
				<Typography component="h2" id="home-products" sx={headingStyle}>
					Dành cho bạn.
				</Typography>
				<HomeLink name="view_all_products">Xem tất cả</HomeLink>
			</Stack>
			<Typography sx={{ maxWidth: 650, mb: 3, color: "text.secondary" }}>
				Từ họa tiết nổi bật đến phong cách nhẹ nhàng. Xem các mẫu skin đang có trong bộ sưu tập,
				kiểm tra dòng máy, rồi chọn thiết kế dành cho bạn.
			</Typography>
			{error ? (
				<Alert severity="error">{error} Mở danh mục Skin MacBook để thử lại.</Alert>
			) : !catalog?.items.length ? (
				<Alert severity="info">
					Bộ sưu tập đang được chuẩn bị. Sản phẩm sẽ hiển thị khi được công bố.
				</Alert>
			) : (
				<Grid container spacing={{ xs: 1.5, md: 3 }}>
					{catalog.items.map((product, position) => (
						<Grid item xs={6} md={3} key={product._id}>
							<CreativaDesignCard
								product={product}
								fromPrice={catalog.fromPrice}
								position={position}
								surface="home"
							/>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
}

export function CreativaHomepage({
	styles,
	catalog,
	catalogError,
}: {
	styles: CreativaHomeStyle[];
	catalog: CreativaCatalogPage | null;
	catalogError: string | null;
}) {
	return (
		<Box sx={{ bgcolor: "#f6f3ed" }}>
			<Box
				component="section"
				aria-labelledby="home-title"
				sx={{
					position: "relative",
					height: { xs: 560, sm: 680, md: "min(53vw, 820px)" },
					minHeight: { md: 590 },
					bgcolor: "#e5ded4",
					isolation: "isolate",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						inset: { xs: "140px 0 auto", sm: "170px 0 auto", md: 0 },
						aspectRatio: { xs: "16 / 9", md: "auto" },
						zIndex: -2,
					}}
				>
					<CreativaConceptImage
						src="/creativa/homepage/hero-concept.jpg"
						alt="MacBook với skin tông trung tính, ánh sáng cửa sổ và nền đá ấm"
						ratio="auto"
						priority
					/>
				</Box>
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						zIndex: -1,
						background:
							"linear-gradient(180deg,rgba(246,243,237,.35),transparent 40%,rgba(246,243,237,.96))",
					}}
				/>
				<Typography
					component="h1"
					id="home-title"
					sx={{
						pt: { xs: 10, md: 11 },
						px: { xs: 2, md: 4 },
						fontSize: { xs: "15vw", md: "13vw" },
						fontWeight: 400,
						letterSpacing: "-.075em",
						lineHeight: 1,
						color: "primary.dark",
					}}
				>
					Skin MacBook.
				</Typography>
				<Stack
					gap={1.5}
					sx={{
						position: "absolute",
						left: { xs: 16, md: 32 },
						right: { xs: 16, md: "auto" },
						bottom: { xs: 28, md: 40 },
						maxWidth: 430,
					}}
				>
					<Typography variant="overline" sx={{ letterSpacing: ".14em" }}>
						INUT CREATIVA / MỘT DIỆN MẠO MỚI
					</Typography>
					<Typography sx={{ fontSize: { xs: 16, md: 18 }, maxWidth: 400 }}>
						Làm mới chiếc máy bạn dùng mỗi ngày, từ gam màu tinh tế đến họa tiết nổi bật.
					</Typography>
					<HomeLink name="shop_skin" outlined>
						Khám phá skin MacBook
					</HomeLink>
				</Stack>
			</Box>

			<Stack
				direction="row"
				justifyContent="space-around"
				gap={2}
				sx={{
					px: 2,
					py: 1.5,
					color: "primary.dark",
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				{["Chọn mẫu hợp gu", "Chọn đúng dòng máy", "Một dấu ấn riêng"].map((text) => (
					<Typography key={text} sx={{ fontSize: { xs: 10, sm: 12 }, textAlign: "center" }}>
						{text}
					</Typography>
				))}
			</Stack>

			<Box sx={{ bgcolor: "#dbe9e4", ...sectionSpacing, textAlign: "center" }}>
				<Container maxWidth="md">
					<Typography component="h2" sx={{ ...headingStyle, fontSize: { xs: 28, md: 40 } }}>
						Chiếc MacBook cũng là một phần phong cách của bạn.
					</Typography>
					<Typography sx={{ mt: 2, mb: 2, maxWidth: 650, mx: "auto" }}>
						Tối giản, giàu chất nghệ thuật hay nổi bật cá tính — mỗi phong cách là một cách để chiếc
						MacBook nói lên điều bạn thích.
					</Typography>
					<HomeLink href="#kham-pha" name="discover_styles" outlined>
						Bắt đầu từ gu của bạn
					</HomeLink>
				</Container>
			</Box>

			<Box
				component="section"
				id="kham-pha"
				aria-labelledby="home-explore"
				sx={{ ...sectionSpacing, scrollMarginTop: 16 }}
			>
				<CreativaBreadcrumbs ancestors={[{ label: "INUT Design", href: "/" }]} current="Creativa" />
				<Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} mb={3}>
					<Typography component="h2" id="home-explore" sx={headingStyle}>
						Khám phá.
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Cảm hứng phong cách
					</Typography>
				</Stack>
				<Box
					sx={{
						display: { xs: "flex", sm: "grid" },
						gridTemplateColumns: `repeat(${styles.length + 1}, minmax(0, 1fr))`,
						gap: { xs: 1.5, md: 2 },
						overflowX: "auto",
						scrollSnapType: "x mandatory",
						pb: 1,
					}}
				>
					{[
						...styles,
						{
							id: "all",
							title: "Tất cả skin MacBook",
							image: "/creativa/homepage/styles-concept.jpg",
							imageAlt: "Ba chiếc MacBook mang sắc kem, charcoal và xanh slate",
							href: CREATIVA_SKIN_CATALOG,
						},
					].map((style) => (
						<Link key={style.id} href={style.href} passHref>
							<Box
								component="a"
								onClick={() =>
									trackCreativa("cta_click", {
										surface: "home",
										cta_name: "style_inspiration",
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
								<CreativaConceptImage src={style.image} alt={style.imageAlt} />
								<Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5}>
									<Typography component="h3" sx={{ fontSize: 16, fontWeight: 400 }}>
										{style.title}
									</Typography>
									<ArrowForwardIcon fontSize="small" />
								</Stack>
								<Typography variant="caption">Xem bộ sưu tập</Typography>
							</Box>
						</Link>
					))}
				</Box>
			</Box>

			<Box
				component="section"
				aria-label="Hai cách thể hiện cá tính"
				sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" } }}
			>
				{styles.map((style) => (
					<FeaturedStyle key={style.id} style={style} />
				))}
			</Box>

			<Box
				component="section"
				aria-labelledby="home-story"
				sx={{
					...sectionSpacing,
					display: "grid",
					gridTemplateColumns: { md: "1fr 1fr" },
					gap: { xs: 3, md: 6 },
					alignItems: "center",
				}}
			>
				<CreativaConceptImage
					src="/creativa/homepage/story-concept.jpg"
					alt="Một người đặt chiếc MacBook tông ấm trên bàn làm việc"
					ratio="16 / 9"
				/>
				<Stack gap={2} alignItems="flex-start">
					<Typography variant="overline" sx={{ letterSpacing: ".12em" }}>
						MỘT CHÚT CẢM HỨNG MỖI NGÀY
					</Typography>
					<Typography component="h2" id="home-story" sx={headingStyle}>
						Một thay đổi nhỏ.
						<br />
						Một cảm hứng rất riêng.
					</Typography>
					<Typography>
						Một chiếc MacBook theo bạn qua nhiều công việc và ý tưởng. Đôi khi, chỉ một diện mạo hợp
						gu đã đủ để thấy mới mẻ hơn.
					</Typography>
					<HomeLink name="brand_story">Chọn skin hợp gu</HomeLink>
				</Stack>
			</Box>

			<HomeProducts catalog={catalog} error={catalogError} />

			<Box component="section" aria-labelledby="home-real-look">
				<Box sx={{ ...sectionSpacing, bgcolor: "#dbe9e4", textAlign: "center" }}>
					<Typography component="h2" id="home-real-look" sx={headingStyle}>
						Đẹp chưa nè?
					</Typography>
					<Typography sx={{ fontSize: { xs: 18, md: 24 }, mt: 1 }}>
						Một diện mạo mới cho góc làm việc quen thuộc.
					</Typography>
					<Typography sx={{ maxWidth: 600, mx: "auto", mt: 2, mb: 1 }}>
						Màu sắc, họa tiết và cách skin xuất hiện trên chiếc máy là những chi tiết đáng xem trước
						khi chọn. Ngắm kỹ từng mẫu trong bộ sưu tập để tìm đúng gu của bạn.
					</Typography>
					<HomeLink name="see_collection">Khám phá skin MacBook</HomeLink>
				</Box>
				<Box sx={{ aspectRatio: { xs: "4 / 3", md: "16 / 7" } }}>
					<CreativaConceptImage
						src="/creativa/homepage/lifestyle-concept.jpg"
						alt="MacBook màu terracotta trong một góc làm việc cạnh cửa sổ"
						ratio="auto"
					/>
				</Box>
			</Box>

			<Box component="section" aria-labelledby="home-details" sx={sectionSpacing}>
				<Typography component="h2" id="home-details" sx={{ ...headingStyle, maxWidth: 720, mb: 3 }}>
					Khác biệt bắt đầu từ những chi tiết bạn chọn.
				</Typography>
				<Box
					sx={{ display: "grid", gridTemplateColumns: { md: "1.2fr 1fr" }, gap: { xs: 3, md: 6 } }}
				>
					<Box>
						{CREATIVA_HOME_DETAILS.map((detail) => (
							<Accordion
								key={detail.id}
								disableGutters
								elevation={0}
								onChange={(_, expanded) =>
									trackCreativa("cta_click", {
										surface: "home_details",
										cta_name: "detail_toggle",
										target: detail.id,
										action: expanded ? "expand" : "collapse",
									})
								}
								sx={{
									bgcolor: "transparent",
									borderTop: "1px solid",
									borderColor: "divider",
									"&:before": { display: "none" },
									"&:last-child": { borderBottom: "1px solid", borderColor: "divider" },
								}}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									id={`detail-${detail.id}`}
									aria-controls={`detail-${detail.id}-content`}
									sx={{ px: 0, minHeight: 56 }}
								>
									<Typography component="h3" fontSize={16}>
										{detail.title}
									</Typography>
								</AccordionSummary>
								<AccordionDetails id={`detail-${detail.id}-content`} sx={{ px: 0, pb: 3 }}>
									<Typography color="text.secondary">{detail.description}</Typography>
								</AccordionDetails>
							</Accordion>
						))}
						<Box mt={2}>
							<HomeLink name="find_your_skin">Tìm skin phù hợp</HomeLink>
						</Box>
					</Box>
					<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
						<CreativaConceptImage
							src="/creativa/homepage/detail-concept.jpg"
							alt="Cận cảnh bề mặt và góc skin trên nắp MacBook"
						/>
						<CreativaConceptImage
							src="/creativa/homepage/application-concept.jpg"
							alt="Tấm skin xanh slate được đặt lên nắp MacBook"
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
