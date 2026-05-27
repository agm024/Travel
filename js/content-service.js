import { cmsContent } from "/js/content.js";

const asPromise = (data) => Promise.resolve(data);

export const getSiteContent = () => asPromise(cmsContent);

export const getPackageBySlug = async (slug) => {
  const content = await getSiteContent();
  return content.packages.find((pkg) => pkg.slug === slug);
};
