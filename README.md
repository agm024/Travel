# Travel Luxe

Bright, minimal travel website rebuilt with React.js, Vite, React Router, and Tailwind CSS.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Create a production build:

   ```bash
   npm run build
   ```

4. Run linting:

   ```bash
   npm run lint
   ```

## What changed

- Converted the previous static HTML/CSS/JS site into a React single-page app.
- Rebuilt the interface with Tailwind CSS and a brighter, more minimal visual style.
- Added a glassmorphism search area, About Us section, fake reviews, and smoother package browsing.
- Kept the package inquiry and contact flows ready for future CMS-backed content.

## Project structure

- `src/App.jsx` — app routes and UI sections
- `src/data/content.js` — current local content source
- `src/index.css` — Tailwind import plus global base styles
- `sanity/schemas/` — starter Sanity schemas aligned with the current content model

## Sanity CMS integration guide

1. Create a Sanity project:

   ```bash
   npm create sanity@latest
   ```

2. In the Sanity Studio project, copy the schema files from `sanity/schemas/` into the Studio schema folder and register them.

3. Add environment variables to this app in a `.env` file:

   ```bash
   VITE_SANITY_PROJECT_ID=your_project_id
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2025-01-01
   ```

4. Install the Sanity client in this app:

   ```bash
   npm install @sanity/client @sanity/image-url
   ```

5. Replace the local data file with a Sanity data layer:
   - Create a client in `src/lib/sanity.js`
   - Query `siteSettings`, `contactDetails`, `travelPackage`, and `review`
   - Map those results into the same shape currently used by `src/data/content.js`

6. Swap route components to use fetched CMS data:
   - Home page: hero copy, About Us content, reviews, featured packages
   - Packages page: package list and filters
   - Package details page: package hero, highlights, itinerary, pricing
   - Contact page: contact details and inquiry copy

7. If you deploy to a static host, configure SPA rewrites so routes like `/packages/tokyo-sakura` resolve to `index.html`.
