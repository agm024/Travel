export default {
  name: "travelPackage",
  title: "Travel Package",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title", maxLength: 96 } },
    { name: "country", type: "string" },
    { name: "month", type: "string" },
    { name: "duration", type: "string" },
    { name: "price", type: "string" },
    { name: "description", type: "text" },
    { name: "image", type: "image", options: { hotspot: true } },
    { name: "highlights", type: "array", of: [{ type: "string" }] },
    { name: "itinerary", type: "array", of: [{ type: "string" }] },
  ],
};
