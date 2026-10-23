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
import { useState } from "react";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { useCreativaCatalog } from "@/hooks/creativa/useCatalog";
import { sanityImageUrl } from "@/api-client/sanity-image";
import type { CreativaCatalogPage, CreativaProduct } from "@/models/creativa";
import type { NextPageWithLayout } from "@/models/common";
import { CreativaError, formatCreativaPrice } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";

function DesignCard({
	product,
	fromPrice,
	position,
}: {
	product: CreativaProduct;
	fromPrice: number | null;
	position: number;
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
							item_list_id: "creativa_skin_laptop",
							item_position: position,
							price_basis: fromPrice !== null ? "from_active_coverage" : "unavailable",
						},
						[
							{
								item_id: product._id,
								item_name: product.name,
								item_category: "skin-laptop",
								item_list_id: "creativa_skin_laptop",
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
					sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 400, mt: 1, lineHeight: 1.4 }}
				>
					{product.name}
				</Typography>
				<Typography variant="body2" mt={0.25}>
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
	const { form, query, data, columns, loading, error, search, changeColumns, retry, loadMore } =
		useCreativaCatalog(initial, initialError);
	const { ref, ...queryField } = form.register("query", {
		onChange: (event) => search(event.target.value),
	});
	return (
		<>
			<CreativaSeo title="Skin MacBook" path="/creativa/skin-laptop" />
			<Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
				<CreativaBreadcrumbs current="Skin MacBook" />
				<Stack gap={1.5}>
					<Typography component="h1" sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 400 }}>
						Skin MacBook
					</Typography>
					<Stack direction="row" alignItems="center" gap={1} justifyContent="space-between">
						<TextField
							{...queryField}
							inputRef={ref}
							label="Tìm theo tên thiết kế"
							inputProps={{ maxLength: 80 }}
							error={!!form.formState.errors.query}
							helperText={form.formState.errors.query?.message}
							sx={{ maxWidth: 380, flex: 1 }}
						/>
						<Stack direction="row" sx={{ display: { md: "none" } }}>
							{[1, 2].map((value) => (
								<IconButton
									key={value}
									aria-label={`${value} cột`}
									aria-pressed={columns === value}
									sx={{ bgcolor: columns === value ? "action.selected" : undefined }}
									onClick={() => changeColumns(value)}
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
								<Button color="inherit" onClick={() => void retry()}>
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
					<Grid container spacing={{ xs: 1, md: 2 }}>
						{data.items.map((product, position) => (
							<Grid item xs={columns === 1 ? 12 : 6} sm={6} md={4} lg={3} key={product._id}>
								<DesignCard product={product} fromPrice={data.fromPrice} position={position} />
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
							sx={{ alignSelf: "center", minWidth: 180, mt: 1.5 }}
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
