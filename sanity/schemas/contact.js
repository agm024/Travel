export default {
  name: 'contactDetails',
  title: 'Contact Details',
  type: 'document',
  fields: [
    { name: 'phone', title: 'Phone', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'address', title: 'Address', type: 'text', rows: 3, validation: (Rule) => Rule.required() },
    { name: 'hours', title: 'Business Hours', type: 'string' },
    { name: 'whatsapp', title: 'WhatsApp URL', type: 'url' },
    { name: 'intro', title: 'Intro Copy', type: 'text', rows: 3 },
    { name: 'promises', title: 'Promises', type: 'array', of: [{ type: 'string' }] },
  ],
}
