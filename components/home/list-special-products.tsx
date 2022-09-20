import { Products, ProductType } from '@/models/products';
import { Button, Container, Grid, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import React from 'react';
import { ProductCard } from '../product/';

type Props = {
	products: Products;
	productTypes: ProductType[];
};

export function ListSpecialProducts({ products, productTypes }: Props) {
	return (
		<Box component={'section'} bgcolor="secondary.light" pt={2} pb={4}>
			<Container>
				<Stack
					direction="row"
					mb={2}
					justifyContent={{
						xs: 'center',
						md: 'space-between',
					}}
					alignItems={'center'}
				>
					<Typography variant="h5">Sản phẩm</Typography>
					<Link passHref href="/products">
						<MuiLink
							sx={{
								display: {
									xs: 'none',
									md: 'inline-block',
								},
							}}
						>
							<Button variant="text">Xem thêm sản phẩm</Button>
						</MuiLink>
					</Link>
				</Stack>

				<Grid container spacing={3}>
					{products.map((product) => (
						<Grid item xs={6} sm={4} md={3} key={product._id}>
							<ProductCard product={product} productTypes={productTypes} />
						</Grid>
					))}
					<Grid item xs={12} container justifyContent={'center'}>
						<MuiLink
							sx={{
								display: {
									xs: 'inline-block',
									md: 'none',
								},
							}}
						>
							<Button variant="contained">Xem thêm sản phẩm</Button>
						</MuiLink>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
