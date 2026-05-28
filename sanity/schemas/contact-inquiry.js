export default {
  name: 'contactInquiry',
  title: 'Contact Inquiry',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'numberOfGuests', title: 'Number of Guests', type: 'number', validation: (Rule) => Rule.required().min(1) },
    { name: 'numberOfChildren', title: 'Number of Children', type: 'number', validation: (Rule) => Rule.required().min(0) },
    { name: 'message', title: 'Message', type: 'text', rows: 5, validation: (Rule) => Rule.required() },
    { name: 'travelPackage', title: 'Travel Package', type: 'string' },
    { name: 'sourcePage', title: 'Source Page', type: 'string' },
    { name: 'submittedAt', title: 'Submitted At', type: 'datetime' },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In progress', value: 'in-progress' },
          { title: 'Closed', value: 'closed' },
        ],
      },
      initialValue: 'new',
    },
  ],
}
