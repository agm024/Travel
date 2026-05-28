export default {
  name: 'travelPackage',
  title: 'Travel Package',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    { name: 'country', title: 'Country', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'month', title: 'Best Month', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'duration', title: 'Duration', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'price', title: 'Price', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'description', title: 'Description', type: 'text', rows: 4, validation: (Rule) => Rule.required() },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() },
    { name: 'gallery', title: 'Gallery Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
    { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
    { name: 'itinerary', title: 'Itinerary', type: 'array', of: [{ type: 'string' }] },
  ],
}
