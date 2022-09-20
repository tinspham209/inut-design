import { urlFor } from '@/api-client/sanity-client';
import { Post } from '@/models/post';
import { Product, ProductType } from '@/models/products';
import { Box, Button, Divider, Stack, Typography, Link as MuiLink } from '@mui/material';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import styles from './product-item.module.css';

export interface ProductItemProps {
	product: Product;
	productTypes: ProductType[];
}

export function ProductItem({ product, productTypes }: ProductItemProps) {
	if (!product) return null;

	const productType = productTypes.find((type) => type._id === product.productType._ref);
	return (
		<Link href={`/products/${product.slug.current}`} passHref>
			<MuiLink>
				<Box>
					<Box>
						<Image
							src={urlFor(product.image[0]).width(500).url()}
							width="100%"
							height={'100%'}
							layout="responsive"
							alt="avatar"
							priority={true}
							className={styles.productImage}
						/>
					</Box>
					<Typography variant="body1" fontWeight="bold" mt={2}>
						{product.name}
					</Typography>
					<Stack spacing={2} direction="row" justifyContent={'space-between'} alignItems="center">
						<Typography variant="body1" fontWeight="">
							#{productType.name}
						</Typography>
					</Stack>
					<Stack direction="row" justifyContent={'flex-end'}>
						<Button variant="text" color="primary">
							Xem chi tiết
						</Button>
					</Stack>
				</Box>
			</MuiLink>
		</Link>
	);
}
