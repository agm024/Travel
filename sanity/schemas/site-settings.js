export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'brand', title: 'Brand Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'heroTagline', title: 'Hero Tagline', type: 'string' },
    { name: 'heroHeadline', title: 'Hero Headline', type: 'string' },
    { name: 'heroDescription', title: 'Hero Description', type: 'text', rows: 4 },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'aboutDescription', title: 'About Description', type: 'text', rows: 4 },
    { name: 'destinations', title: 'Destinations', type: 'array', of: [{ type: 'string' }] },
    { name: 'months', title: 'Months', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'aboutPoints',
      title: 'About Points',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
          ],
        },
      ],
    },
  ],
}
