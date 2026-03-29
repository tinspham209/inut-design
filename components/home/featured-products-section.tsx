import { urlFor } from "@/api-client/sanity-client";
import { SanityImage } from "@/models/image";
import { COLOR_CODE, trackSelectProduct } from "@/utils";
import { Box, Button, Container, Grid, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { ProductCard } from "./product-card";

/**
 * Minimal shared shape satisfied by both LighterProduct and Product.
 * Both have _id, name, image[], and slug.current.
 */
type FeaturedItem = {
	_id: string;
	name: string;
	image: SanityImage[];
	slug: { current: string };
};

type Props = {
	title: string;
	/** Short uppercase eyebrow label above the section title */
	eyebrow?: string;
	items: FeaturedItem[];
	/** href for the "Xem thêm" button */
	viewAllHref: string;
	/** builds per-item detail href from slug */
	itemHref: (slug: string) => string;
	/** used in analytics events */
	analyticsCategory: string;
	/** slightly elevated bg variant (ink-2 vs ink) */
	darkMode?: boolean;
	/** number of items that receive priority image loading */
	priorityCount?: number;
	/** unique id for the section, used in analytics events */
	id?: string;
};

export function FeaturedProductsSection({
	title,
	eyebrow,
	items,
	viewAllHref,
	itemHref,
	analyticsCategory,
	darkMode = false,
	priorityCount = 0,
	id,
}: Props) {
	const bgColor = darkMode ? COLOR_CODE.INK_2 : COLOR_CODE.INK;

	return (
		<Box
			id={id}
			component="section"
			bgcolor={bgColor}
			sx={{ py: { xs: "60px", sm: "80px" }, px: { xs: 2, sm: "32px" } }}
		>
			<Container maxWidth="lg" disableGutters>
				{/* Section header */}
				<Box mb={4.5}>
					<Stack direction="row" alignItems="center" gap={1.25} mb={1.5}>
						<Box sx={{ width: 20, height: 2, bgcolor: COLOR_CODE.PRIMARY, flexShrink: 0 }} />
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: "0.68rem",
								letterSpacing: "0.18em",
								textTransform: "uppercase",
								color: COLOR_CODE.PRIMARY,
							}}
						>
							{eyebrow || title}
						</Typography>
					</Stack>
					<Typography
						component="h2"
						sx={{
							fontWeight: 800,
							fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
							lineHeight: 1.05,
							letterSpacing: "-0.04em",
							color: COLOR_CODE.WHITE,
							mt: 1.5,
						}}
					>
						{title}
					</Typography>
				</Box>

				<Grid container spacing={1.5}>
					{items?.map((item, index) => (
						<Grid item xs={6} sm={3} key={`${item._id}-${index}`}>
							<Box
								sx={{
									bgcolor: COLOR_CODE.INK_3,
									border: `1px solid ${COLOR_CODE.INK_4}`,
									borderRadius: "12px",
									overflow: "hidden",
									transition: "border-color 200ms, transform 200ms cubic-bezier(0.16,1,0.3,1)",
									"&:hover": {
										borderColor: "rgba(255,77,0,0.25)",
										transform: "translateY(-3px)",
									},
								}}
							>
								<ProductCard
									imageUrl={urlFor(item.image[0]).width(600).url()}
									href={itemHref(item.slug.current)}
									alt={item.name}
									priority={index < priorityCount}
									onSelect={() =>
										trackSelectProduct(
											{
												id: item._id,
												name: item.name,
												category: analyticsCategory,
											},
											"Homepage Featured",
											index
										)
									}
								/>
								<Box sx={{ px: 1.5, pt: 1, pb: 1.5 }}>
									<Typography
										sx={{
											fontWeight: 700,
											fontSize: "0.78rem",
											color: COLOR_CODE.WHITE,
											letterSpacing: "0.02em",
											lineHeight: 1.3,
										}}
									>
										{item.name}
									</Typography>
								</Box>
							</Box>
						</Grid>
					))}
				</Grid>

				<Stack flexDirection="row" justifyContent="center" mt={3}>
					<Link href={viewAllHref} passHref>
						<MuiLink underline="none">
							<Button variant="contained" color="primary" sx={{ fontWeight: 700 }}>
								Xem thêm sản phẩm
							</Button>
						</MuiLink>
					</Link>
				</Stack>
			</Container>
		</Box>
	);
}
