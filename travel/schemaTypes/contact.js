import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactDetails',
  title: 'Contact Details',
  type: 'document',
  fields: [
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'address', title: 'Address', type: 'text', rows: 3}),
    defineField({name: 'hours', title: 'Business Hours', type: 'string'}),
    defineField({name: 'whatsapp', title: 'WhatsApp URL', type: 'url'}),
    defineField({name: 'intro', title: 'Intro Copy', type: 'text', rows: 3}),
    defineField({name: 'promises', title: 'Promises', type: 'array', of: [defineArrayMember({type: 'string'})]}),
  ],
})