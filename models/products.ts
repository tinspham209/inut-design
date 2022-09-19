import { SanityImage } from './image'

export type Product = {
	detail: string
	image: SanityImage[]
	name: string
	productType: {
		_ref: string
		_type: string
	}
  slug: {
    current: string,
    _type: string
  }
  special: boolean
  _createAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
}

export type Products = Product[]