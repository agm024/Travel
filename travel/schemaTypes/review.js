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
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Published', value: 'published'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'submittedAt', title: 'Submitted At', type: 'datetime'}),
  ],
})