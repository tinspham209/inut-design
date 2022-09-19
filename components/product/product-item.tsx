import { urlFor } from '@/api-client/sanity-client'
import { Post } from '@/models/post'
import { Product } from '@/models/products'
import { Box, Button, Divider, Stack, Typography, Link as MuiLink } from '@mui/material'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import styles from './product-item.module.css'

export interface ProductItemProps {
	product: Product
}

export function ProductItem({ product }: ProductItemProps) {
	if (!product) return null
	return (
		<Link href={`/products/${product.slug.current}`} passHref>
			<MuiLink className={styles.product}>
				<Box>
					<Box>
						<Image
							src={urlFor(product.image[0]).width(250).url()}
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
					<Stack spacing={2} direction="row" justifyContent={'flex-end'} alignItems="center">
						<Button variant="text" color="primary">
							Xem thêm
						</Button>
					</Stack>
				</Box>
			</MuiLink>
		</Link>
	)
}
