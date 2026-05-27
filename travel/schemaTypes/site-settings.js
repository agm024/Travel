import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'brand', title: 'Brand Name', type: 'string'}),
    defineField({name: 'heroTagline', title: 'Hero Tagline', type: 'string'}),
    defineField({name: 'heroHeadline', title: 'Hero Headline', type: 'string'}),
    defineField({name: 'heroDescription', title: 'Hero Description', type: 'text', rows: 4}),
    defineField({name: 'heroImage', title: 'Hero Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'aboutDescription', title: 'About Description', type: 'text', rows: 4}),
    defineField({name: 'destinations', title: 'Destinations', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'months', title: 'Months', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'stat',
          title: 'Stat',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'aboutPoints',
      title: 'About Points',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'aboutPoint',
          title: 'About Point',
          type: 'object',
          fields: [
            defineField({name: 'icon', title: 'Icon', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          ],
        }),
      ],
    }),
  ],
})