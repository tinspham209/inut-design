import { urlFor } from '@/api-client/sanity-client';
import { Banner } from '@/models/banner';
import { Button, Container, Grid, Stack, Typography, Link as MuiLink } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import * as React from 'react';
import styles from './information.module.css';
import CountUp from 'react-countup';

type Props = {
	total: number;
};

export function InfoSection({ total }: Props) {
	return (
		<Box component={'section'} pb={{ xs: 4 }}>
			<Container>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={4}>
						<Stack justifyContent={'center'}>
							<Box sx={{ margin: '0 auto' }}>
								<Image
									src={
										'https://res.cloudinary.com/dmspucdtf/image/upload/v1663647671/inut/292635797_197003529328579_4330060878795101093_n_bjzhby.jpg'
									}
									width={200}
									height={200}
									alt="infor-image"
									priority={true}
									className={styles.infoImage}
								/>
							</Box>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={8}>
						<Box maxWidth={440}>
							<Stack flexDirection={'row'} alignItems="center" justifyContent={'space-between'}>
								<Typography variant="h5" sx={{ mr: 4 }}>
									inut_skin
								</Typography>
								<MuiLink
									href="https://www.facebook.com/profile.php?id=100063876652109"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button variant="contained" color="primary">
										Quan tâm
									</Button>
								</MuiLink>
							</Stack>

							<Typography variant="body1" sx={{ mt: 1 }} fontWeight="bold">
								I NÚT - Cửa Hàng Thời Trang Dành Cho Laptop Tại Đà Nẵng
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
							<Typography variant="body1" sx={{ mt: 1 }}>
								Có{' '}
								<MuiLink
									href="https://www.instagram.com/_tomchay_/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<b>_tomchay_</b>
								</MuiLink>
								,{' '}
								<MuiLink
									href="https://www.instagram.com/phamthitins/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<b>phamthitins</b>
								</MuiLink>{' '}
								và{' '}
								<b>
									<CountUp end={398} duration={3} />
								</b>{' '}
								đang theo dõi
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
