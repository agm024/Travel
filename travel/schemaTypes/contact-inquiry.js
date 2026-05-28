import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactInquiry',
  title: 'Contact Inquiry',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({
      name: 'numberOfGuests',
      title: 'Number of Guests',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'numberOfChildren',
      title: 'Number of Children',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({name: 'message', title: 'Message', type: 'text', rows: 5, validation: (Rule) => Rule.required()}),
    defineField({name: 'travelPackage', title: 'Travel Package', type: 'string'}),
    defineField({name: 'sourcePage', title: 'Source Page', type: 'string'}),
    defineField({name: 'submittedAt', title: 'Submitted At', type: 'datetime'}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'In progress', value: 'in-progress'},
          {title: 'Closed', value: 'closed'},
        ],
      },
      initialValue: 'new',
    }),
  ],
})