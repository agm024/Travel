import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Guest Name', type: 'string'}),
    defineField({name: 'trip', title: 'Trip Name', type: 'string'}),
    defineField({name: 'rating', title: 'Rating', type: 'number'}),
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4}),
  ],
})