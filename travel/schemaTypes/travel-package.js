import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'travelPackage',
  title: 'Travel Package',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({name: 'country', title: 'Country', type: 'string'}),
    defineField({name: 'month', title: 'Best Month', type: 'string'}),
    defineField({name: 'duration', title: 'Duration', type: 'string'}),
    defineField({name: 'price', title: 'Price', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),
    defineField({name: 'highlights', title: 'Highlights', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'itinerary', title: 'Itinerary', type: 'array', of: [defineArrayMember({type: 'string'})]}),
  ],
})