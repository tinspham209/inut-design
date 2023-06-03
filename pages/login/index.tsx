import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { Google, Lock } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";

const SignIn: NextPageWithLayout = () => {
	const [isLoading, setIsLoading] = React.useState(false);
	const router = useRouter();
	const [count, setCount] = React.useState(0);

	return (
		<Box>
			<Seo
				data={{
					title: "INUT Design | Skin laptop da nang",
					description:
						"Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			<Container maxWidth="xs">
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<Lock />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Card
						sx={{
							mt: 4,
						}}
					>
						<CardContent>
							<Button
								startIcon={<Google />}
								disabled={isLoading}
								onClick={() => {
									if (count < 4) {
										setCount((prev) => prev + 1);
									} else {
										setIsLoading(true);
										signIn("google")
											.then((callback) => {
												if (callback?.ok) {
													toast.success("Logged in successfully!");
													router.push("/admin");
												}
												if (callback?.error) {
													toast.error(`Login failed: ${callback.error}`);
												}
												setIsLoading(false);
											})
											.catch((error) => {
												toast.error(`Error when login with Google: ${error}`);
											});
									}
								}}
							>
								Continue with Google
							</Button>
						</CardContent>
					</Card>
				</Box>
			</Container>
		</Box>
	);
};

SignIn.Layout = MainLayout;

export default SignIn;
