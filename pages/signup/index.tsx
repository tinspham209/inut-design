import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { Lock } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Container,
	TextField,
	Typography,
	Link as MuiLink,
	Grid,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";

const SignUp: NextPageWithLayout = () => {
	const [isLoading, setIsLoading] = React.useState(false);

	const router = useRouter();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const email = data.get("email");
		const password = data.get("password");
		const _data = {
			email,
			password,
		};

		axios
			.post(`/api/register`, _data)
			.then(() => {
				toast.success("Register account successfully!");
				router.push("/login");
			})
			.catch((error) => {
				toast.error(error?.message || "Something went wrong!");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

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
						Sign Up
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={isLoading}
						>
							Sign Up
						</Button>

						<Grid container>
							<Grid item>
								<Link key={`login`} href={`/login`} passHref>
									<MuiLink
										sx={{
											ml: 1,
										}}
										variant="body2"
										underline="hover"
									>
										{"Already have an account? Sign In"}
									</MuiLink>
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

SignUp.Layout = MainLayout;

export default SignUp;
