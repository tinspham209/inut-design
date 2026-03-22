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
	items: FeaturedItem[];
	/** href for the "Xem thêm" button */
	viewAllHref: string;
	/** builds per-item detail href from slug */
	itemHref: (slug: string) => string;
	/** used in analytics events */
	analyticsCategory: string;
	/** dark background (e.g. Skin Laptop); default is light */
	darkMode?: boolean;
	/** number of items that receive priority image loading */
	priorityCount?: number;
	/** unique id for the section, used in analytics events */
	id?: string;
};

export function FeaturedProductsSection({
	title,
	items,
	viewAllHref,
	itemHref,
	analyticsCategory,
	darkMode = false,
	priorityCount = 0,
	id,
}: Props) {
	const bgColor = darkMode ? COLOR_CODE.BACKGROUND_CARD : COLOR_CODE.BACKGROUND;
	const titleColor = darkMode ? COLOR_CODE.WHITE : COLOR_CODE.TEXT_DARK;

	return (
		<Box id={id} component="section" bgcolor={bgColor} pt={2} pb={4}>
			<Container>
				<Stack direction="row" py={3} justifyContent="center" alignItems="center">
					<Typography variant="h3" fontWeight="bold" textAlign="center" color={titleColor}>
						{title}
					</Typography>
				</Stack>

				<Grid container spacing={2}>
					{items?.map((item, index) => (
						<Grid item xs={6} sm={3} key={`${item._id}-${index}`}>
							<ProductCard
								imageUrl={urlFor(item.image[0]).width(600).url()}
								href={itemHref(item.slug.current)}
								alt={item.name}
								priority={index < priorityCount}
								onSelect={() =>
									trackSelectProduct(
										{ id: item._id, name: item.name, category: analyticsCategory },
										"Homepage Featured",
										index
									)
								}
							/>
						</Grid>
					))}
				</Grid>

				<Stack flexDirection="row" justifyContent="center" mt={3}>
					<Link href={viewAllHref} passHref>
						<MuiLink>
							<Button variant="contained">Xem thêm sản phẩm</Button>
						</MuiLink>
					</Link>
				</Stack>
			</Container>
		</Box>
	);
}
