import { Product } from '@/models/products'
import { Card, CardContent } from '@mui/material'
import { ProductItem } from '.'

export interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	if (!product) return null
	return (
		<Card>
			<CardContent>
				<ProductItem product={product} />
			</CardContent>
		</Card>
	)
}
