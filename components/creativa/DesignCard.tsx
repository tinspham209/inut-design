/* eslint-disable camelcase */
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { sanityImageUrl } from "@/api-client/sanity-image";
import type { CreativaProduct } from "@/models/creativa";
import { trackCreativa } from "@/utils/creativa/analytics";
import { formatCreativaPrice } from "@/utils/creativa/contracts";

export function CreativaDesignCard({
	product,
	fromPrice,
	position,
	surface = "catalog",
}: {
	product: CreativaProduct;
	fromPrice: number | null;
	position: number;
	surface?: "home" | "catalog";
}) {
	const [hover, setHover] = useState(false);
	const [failed, setFailed] = useState(false);
	const image = product.images[hover && product.images[1] ? 1 : 0];
	const listId = surface === "home" ? "creativa_home_skin_laptop" : "creativa_skin_laptop";
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
							surface,
							item_list_id: listId,
							item_position: position,
							price_basis: fromPrice !== null ? "from_active_coverage" : "unavailable",
						},
						[
							{
								item_id: product._id,
								item_name: product.name,
								item_category: "skin-laptop",
								item_list_id: listId,
								index: position,
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
					sx={{ bgcolor: "white", position: "relative", aspectRatio: "1", overflow: "hidden" }}
				>
					{image && !failed ? (
						<Image
							src={sanityImageUrl(image, "card")}
							alt={image.alt || product.name}
							layout="fill"
							objectFit="contain"
							sizes="(min-width: 1200px) 25vw, (min-width: 900px) 33vw, 50vw"
							onError={() => setFailed(true)}
						/>
					) : (
						<Stack alignItems="center" justifyContent="center" height="100%">
							<Typography variant="body2">Ảnh tạm thời chưa sẵn sàng</Typography>
						</Stack>
					)}
				</Box>
				<Typography
					component={surface === "home" ? "h3" : "h2"}
					sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 400, mt: 1, lineHeight: 1.4 }}
				>
					{product.name}
				</Typography>
				<Typography variant="body2" mt={0.25}>
					{fromPrice === null
						? "Chưa có tùy chọn đang bán"
						: `Từ ${formatCreativaPrice(fromPrice)}`}
				</Typography>
				{surface === "home" && (
					<Typography
						variant="caption"
						sx={{ display: "block", mt: 1, textDecoration: "underline" }}
					>
						Xem chi tiết →
					</Typography>
				)}
			</Box>
		</Link>
	);
}
