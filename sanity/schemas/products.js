export default {
	name: 'products',
	title: 'Products',
	type: 'document',
	fields: [
		{
			name: 'image',
			title: 'Image',
			type: 'array',
			of: [{ type: 'image' }],
			options: {
				hotspot: true,
			},
		},
		{
			name: 'name',
			title: 'Name',
			type: 'string',
		},
		{
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'name',
				maxLength: 90,
			},
		},
		{
			name: 'details',
			title: 'Details',
			type: 'string',
		},
		{
			name: 'special',
			title: 'Special',
			type: 'boolean',
			description: 'Highlight product in Homepage',
			initialValue: false,
		},
		{
			name: 'productType',
			title: 'Product Type',
			type: 'reference',
			to: { type: 'productType' },
		},
	],
	preview: {
		select: {
			title: 'name',
			media: 'image',
		},
    prepare(selection){
      const {title, media} = selection
      return {
        title: title,
        media: media && media[0]
      }
    }
	},
}
