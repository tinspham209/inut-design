import { urlFor } from "@/api-client/sanity-client";
import { LighterProduct, LighterType } from "@/models/cart";
import { useLightersCart } from "@/store";
import { getPriceTierOptions } from "@/utils/priceCalculator";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
	Box,
	Card,
	CardContent,
	IconButton,
	Link as MuiLink,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import toast from "react-hot-toast";

interface LighterCardProps {
	lighter: LighterProduct & {
		typeName: string;
		typeSlug: string;
	};
	lighterTypes: LighterType[];
	onCartOpen: () => void;
}

const LighterCard: React.FC<LighterCardProps> = ({ lighter, lighterTypes, onCartOpen }) => {
	const addItem = useLightersCart((state) => state.addItem);
	const [hovered, setHovered] = React.useState(false);

	const primaryImage = useMemo(() => lighter.image?.[0], [lighter.image]);
	const secondaryImage = useMemo(
		() => (lighter.image && lighter.image.length > 1 ? lighter.image[1] : undefined),
		[lighter.image]
	);
	const primaryUrl = useMemo(
		() => (primaryImage ? urlFor(primaryImage).width(500).url() : ""),
		[primaryImage]
	);
	const secondaryUrl = useMemo(
		() => (secondaryImage ? urlFor(secondaryImage).width(500).url() : undefined),
		[secondaryImage]
	);

	const lighterType = useMemo(
		() => lighterTypes.find((type) => type._id === lighter.lighterType?._ref),
		[lighter.lighterType, lighterTypes]
	);

	const priceTiers = useMemo(() => {
		const tiers = getPriceTierOptions(lighterType.priceTiers || []);
		return tiers;
	}, [lighterType]);

	const minimumPrice = useMemo(() => {
		return priceTiers.length > 0 ? priceTiers[priceTiers.length - 1].price : 0;
	}, [priceTiers]);

	const handleQuickAdd = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!lighterType) {
			console.error("Lighter type not found");
			return;
		}

		// Get the first tier quantity as default
		const defaultQuantity = priceTiers.length > 0 ? priceTiers[0].quantity : 1;

		// Add to cart
		addItem({
			productId: lighter._id,
			productName: lighter.name,
			productImage: lighter.image?.[0],
			productSlug: lighter.slug.current,
			lighterTypeId: lighterType._id,
			lighterTypeName: lighterType.name,
			priceTiers: lighterType.priceTiers || [],
			quantity: defaultQuantity,
			unitPrice: priceTiers.length > 0 ? priceTiers[0].price : 0,
		});
		toast.success(`${lighter.name} đã được thêm vào giỏ hàng!`);

		// Open cart drawer
		// onCartOpen();
	};

	return (
		<Card
			sx={{
				transition: "all 0.2s ease",
				transform: "scale(1)",
				"&:hover": {
					transform: "scale(1.01)",
				},
				borderRadius: { xs: "12px", md: "16px" },
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
			variant="outlined"
			id={lighter.slug.current}
		>
			<CardContent
				sx={{
					p: 0,
					"&:last-child": { pb: 0 },
					flex: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Link href={`/lighters/${lighter.slug.current}`} passHref>
					<MuiLink sx={{ textDecoration: "none" }}>
						<Box>
							<Box
								sx={{
									position: "relative",
									backgroundColor: "transparent",
									borderRadius: { xs: "12px 12px 0 0", md: "16px 16px 0 0" },
									overflow: "hidden",
									p: 1,
								}}
								onMouseEnter={() => secondaryUrl && setHovered(true)}
								onMouseLeave={() => secondaryUrl && setHovered(false)}
							>
								<Image
									src={hovered && secondaryUrl ? secondaryUrl : primaryUrl}
									width="100%"
									height={"100%"}
									unoptimized
									layout="responsive"
									alt={lighter.name}
									priority={true}
									style={{
										borderRadius: 8,
										transition: "opacity 0.3s ease",
									}}
								/>
							</Box>

							{/* Product Info Section */}
							<Box sx={{ px: 1 }}>
								<Typography
									variant="caption"
									sx={{
										fontSize: { xs: "0.7rem", md: "0.75rem" },
										color: "#8c8c8c",
										fontWeight: 600,
									}}
								>
									{lighter.typeName}
								</Typography>

								<Typography
									variant="h6"
									sx={{
										fontWeight: "bold",
										fontSize: { xs: "0.95rem", md: "1rem" },
										lineHeight: 1.3,
									}}
								>
									{lighter.name}
								</Typography>
							</Box>
						</Box>
					</MuiLink>
				</Link>

				{/* Add to Cart Button - Below Content */}
				<Stack
					sx={{
						p: 1,
						pt: 0,
					}}
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Box width="fit-content">
						<Typography
							variant="caption"
							sx={{
								fontSize: { xs: "0.75rem", md: "0.85rem" },
							}}
						>
							Giá chỉ từ: {minimumPrice.toLocaleString()}đ
						</Typography>
					</Box>
					<Stack justifyContent="flex-end">
						<Tooltip title="Thêm vào giỏ" arrow>
							<IconButton size="small" color="primary" onClick={handleQuickAdd}>
								<ShoppingCartIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default LighterCard;
