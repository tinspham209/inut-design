import { ComparisonRow, ProductType } from "@/models/product-page";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
	Box,
	Grid,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";

export interface TypesSectionProps {
	title?: string;
	description?: string;
	items: ProductType[];
	specOptions?: string[];
	comparisonItems?: string[];
	comparisonRows?: ComparisonRow[];
	comparisonRecommendation?: string;
}

export const TypesSection: React.FC<TypesSectionProps> = ({
	title = "Các dòng sản phẩm",
	description,
	items,
	specOptions,
	comparisonItems,
	comparisonRows,
	comparisonRecommendation,
}) => {
	return (
		<Box>
			<Box sx={{ mb: 6, textAlign: "center" }}>
				<Typography
					variant="h3"
					fontWeight={900}
					gutterBottom
					sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}
				>
					{title}
				</Typography>
				{description && (
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{ maxWidth: 700, mx: "auto", fontWeight: 400, opacity: 0.8 }}
					>
						{description}
					</Typography>
				)}
			</Box>

			<Grid container spacing={{ xs: 3, md: 4 }}>
				{items.map((type, index) => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
						<Box
							sx={{
								height: "100%",
								bgcolor: "white",
								borderRadius: 4,
								overflow: "hidden",
								boxShadow: "0 12px 35px rgba(0,0,0,0.07)",
								transition: "all 0.3s ease",
								border: "1px solid",
								borderColor: "grey.200",
								"&:hover": {
									transform: "translateY(-8px)",
									boxShadow: "0 22px 45px rgba(0,0,0,0.12)",
									borderColor: "primary.main",
								},
							}}
						>
							<Box sx={{ position: "relative", pt: "100%", bgcolor: "grey.100" }}>
								<Image src={type.image} alt={type.name} layout="fill" objectFit="cover" />
							</Box>
							<Box sx={{ p: 3 }}>
								<Typography variant="h6" fontWeight={800} gutterBottom sx={{ fontSize: "1.15rem" }}>
									{type.name}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ lineHeight: 1.65, fontSize: "0.95rem" }}
								>
									{type.description}
								</Typography>
							</Box>
						</Box>
					</Grid>
				))}
			</Grid>

			{(specOptions || comparisonItems || comparisonRows) && (
				<Box sx={{ mt: { xs: 8, md: 12 } }}>
					<Grid container spacing={{ xs: 6, md: 8 }}>
						{(specOptions || comparisonItems) && (
							<Grid item xs={12} lg={5}>
								<Stack spacing={5}>
									{specOptions && (
										<Box
											sx={{
												p: { xs: 3, md: 4 },
												bgcolor: "grey.50",
												borderRadius: 4,
												border: "1px solid",
												borderColor: "grey.200",
											}}
										>
											<Typography variant="h6" fontWeight={800} gutterBottom sx={{ mb: 3 }}>
												Tùy chọn bổ sung
											</Typography>
											<Stack spacing={2.5}>
												{specOptions.map((spec, index) => (
													<Stack key={index} direction="row" spacing={2} alignItems="center">
														<CheckCircleIcon sx={{ color: "primary.main", fontSize: 22 }} />
														<Typography
															variant="body1"
															fontWeight={500}
															sx={{ fontSize: "1.05rem" }}
														>
															{spec}
														</Typography>
													</Stack>
												))}
											</Stack>
										</Box>
									)}

									{comparisonItems && (
										<Box sx={{ p: { xs: 2, md: 3 } }}>
											<Typography variant="h6" fontWeight={800} gutterBottom sx={{ mb: 3 }}>
												Hướng dẫn chọn lựa
											</Typography>
											<Stack spacing={3}>
												{comparisonItems.map((item, index) => (
													<Stack key={index} direction="row" spacing={2} alignItems="flex-start">
														<Box
															sx={{
																width: 10,
																height: 10,
																borderRadius: "50%",
																bgcolor: "primary.main",
																mt: 1.1,
																flexShrink: 0,
															}}
														/>
														<Typography
															variant="body1"
															sx={{
																color: "text.secondary",
																lineHeight: 1.7,
																fontSize: "1.05rem",
															}}
														>
															{item}
														</Typography>
													</Stack>
												))}
											</Stack>
										</Box>
									)}
								</Stack>
							</Grid>
						)}

						{comparisonRows && (
							<Grid item xs={12} lg={7}>
								<Box>
									<Typography variant="h5" fontWeight={800} gutterBottom sx={{ mb: 3 }}>
										Bảng so sánh chi tiết
									</Typography>
									<TableContainer
										sx={{
											bgcolor: "white",
											borderRadius: 4,
											boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
											border: "1px solid",
											borderColor: "grey.200",
											overflow: "hidden",
										}}
									>
										<Table>
											<TableHead>
												<TableRow sx={{ bgcolor: "grey.100" }}>
													<TableCell
														sx={{ fontWeight: 800, fontSize: "1rem", py: 2.5, px: 3 }}
													>
														Tiêu chí
													</TableCell>
													{Object.keys(comparisonRows[0])
														.filter((key) => key !== "criteria")
														.map((key) => (
															<TableCell
																key={key}
																align="center"
																sx={{
																	fontWeight: 800,
																	fontSize: "1rem",
																	py: 2.5,
																	px: 3,
																}}
															>
																{key.charAt(0).toUpperCase() + key.slice(1)}
															</TableCell>
														))}
												</TableRow>
											</TableHead>
											<TableBody>
												{comparisonRows.map((row, index) => (
													<TableRow
														key={index}
														sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
													>
														<TableCell
															component="th"
															scope="row"
															sx={{ fontWeight: 600, py: 2, px: 3 }}
														>
															{row.criteria}
														</TableCell>
														{Object.keys(row)
															.filter((key) => key !== "criteria")
															.map((key) => (
																<TableCell
																	key={key}
																	align="center"
																	sx={{ py: 2, px: 3 }}
																>
																	{typeof row[key] === "boolean" ? (
																		row[key] ? (
																			<CheckCircleIcon
																				sx={{ color: "success.main" }}
																			/>
																		) : (
																			"-"
																		)
																	) : (
																		<Typography variant="body2">
																			{row[key]}
																		</Typography>
																	)}
																</TableCell>
															))}
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
									{comparisonRecommendation && (
										<Box
											sx={{
												mt: 3,
												p: 3,
												bgcolor: "primary.light",
												borderRadius: 3,
												borderLeft: "4px solid",
												borderColor: "primary.main",
											}}
										>
											<Typography
												variant="body1"
												fontWeight={600}
												sx={{ color: "primary.darker" }}
											>
												{comparisonRecommendation}
											</Typography>
										</Box>
									)}
								</Box>
							</Grid>
						)}
					</Grid>
				</Box>
			)}
		</Box>
	);
};
