import { Button, Container, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Element } from "react-scroll";

import { LaptopCanvas } from "@/components/canvas";

export const INFO_ID_ELEMENT = "information";
export function InfoSection() {
	return (
		<Element name={INFO_ID_ELEMENT}>
			<Box
				component={"section"}
				pt={2}
				pb={4}
				zIndex={999}
				bgcolor="secondary.dark"
				id={INFO_ID_ELEMENT}
			>
				<Container>
					<Stack
						justifyContent={"center"}
						flexDirection={{
							xs: "column",
							sm: "row",
						}}
					>
						<Stack
							justifyContent={"center"}
							mr={{
								sm: 6,
								md: 12,
							}}
						>
							<LaptopCanvas />
						</Stack>

						<Box maxWidth={440}>
							<Stack flexDirection={"row"} alignItems="center" justifyContent={"space-between"}>
								<Typography variant="h5" sx={{ mr: 4 }}>
									inut_design
								</Typography>
								<MuiLink
									href="https://www.facebook.com/inutdesign"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button variant="outlined" color="primary">
										Quan tâm
									</Button>
								</MuiLink>
							</Stack>

							<Typography variant="body1" sx={{ mt: 1 }} fontWeight="bold">
								INÚT - Cửa Hàng Thời Trang Dành Cho Laptop Tại Đà Nẵng
							</Typography>
							<Typography variant="body1" sx={{ mt: 1 }}>
								Custom skin laptop, cho tất cả các loại laptop có trên trái đất. Không giới hạn hình
								ảnh và idea!!!!
							</Typography>
							<MuiLink
								href="https://goo.gl/maps/hBKBhHvRAGMPUn3e9"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Typography variant="body1" sx={{ mt: 1 }}>
									Địa chỉ: K294/43 Điện Biên Phủ, Đà Nẵng, Việt Nam
								</Typography>
							</MuiLink>
							<MuiLink href="tel:+84792359996" target="_blank" rel="noopener noreferrer">
								<Typography variant="body1" sx={{ mt: 1 }}>
									Số điện thoại: 079 235 9996
								</Typography>
							</MuiLink>
						</Box>
					</Stack>
				</Container>
			</Box>
		</Element>
	);
}
