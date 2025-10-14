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
	Tooltip,
	Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

	const handleQuickAdd = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// Find the lighter type
		const lighterType = lighterTypes.find((type) => type._id === lighter.lighterType?._ref);

		if (!lighterType) {
			console.error("Lighter type not found");
			return;
		}

		// Get the first tier quantity as default
		const priceTiers = getPriceTierOptions(lighterType.priceTiers || []);
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

		// Open cart drawer
		onCartOpen();
	};

	return (
		<Card
			sx={{
				animation: "all 2s ease-in-out",
				transform: "scale(1)",
				"&:hover": {
					transform: "scale(1.02)",
					boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
				},
				border: "none",
				borderRadius: { xs: "12px", md: "16px" },
				display: "flex",
				flexDirection: "column",
				height: "100%",
				position: "relative",
				overflow: "hidden",
				boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
				transition: "all 0.3s ease",
			}}
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
							{/* Image Container with Dark Background */}
							<Box
								sx={{
									position: "relative",
									backgroundColor: "transparent",
									borderRadius: { xs: "12px 12px 0 0", md: "16px 16px 0 0" },
									overflow: "hidden",
									p: 1,
								}}
							>
								<Image
									src={urlFor(lighter.image[0]).width(500).url()}
									width="100%"
									height={"100%"}
									unoptimized
									layout="responsive"
									alt={lighter.name}
									priority={true}
									style={{
										borderRadius: 8,
									}}
								/>
							</Box>

							{/* Product Info Section */}
							<Box sx={{ p: 1 }}>
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
				<Box
					sx={{
						p: 1,
						pt: 0,
						mt: "auto",
						position: "relative",
						overflow: "hidden",
						display: "flex",
						justifyContent: "flex-end",
					}}
				>
					<Tooltip title="Thêm vào giỏ" arrow>
						<IconButton variant="text" size="medium" color="primary" onClick={handleQuickAdd}>
							<ShoppingCartIcon />
						</IconButton>
					</Tooltip>
				</Box>
			</CardContent>
		</Card>
	);
};

export default LighterCard;
