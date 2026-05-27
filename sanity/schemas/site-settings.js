export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'brand', title: 'Brand Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'aboutDescription', title: 'About Description', type: 'text', rows: 4 },
    { name: 'destinations', title: 'Destinations', type: 'array', of: [{ type: 'string' }] },
    { name: 'months', title: 'Months', type: 'array', of: [{ type: 'string' }] },
  ],
}
