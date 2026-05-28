export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    { name: 'name', title: 'Guest Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'trip', title: 'Trip Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'rating', title: 'Rating', type: 'number', validation: (Rule) => Rule.required().min(1).max(5) },
    { name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (Rule) => Rule.required() },
    {
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
    },
    { name: 'submittedAt', title: 'Submitted At', type: 'datetime' },
  ],
}
