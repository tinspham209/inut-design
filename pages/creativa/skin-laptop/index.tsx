/* eslint-disable camelcase */
import {
	Alert,
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
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { CreativaDesignCard } from "@/components/creativa/DesignCard";
import { useCreativaCatalog } from "@/hooks/creativa/useCatalog";
import type { CreativaCatalogPage } from "@/models/creativa";
import type { NextPageWithLayout } from "@/models/common";
import { CreativaError } from "@/utils/creativa/contracts";

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
								<CreativaDesignCard
									product={product}
									fromPrice={data.fromPrice}
									position={position}
								/>
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
