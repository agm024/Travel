import { cmsContent } from "/js/content.js";

const delay = (data) => Promise.resolve(data);

export const getSiteContent = () => delay(cmsContent);

export const getPackageBySlug = async (slug) => {
  const content = await getSiteContent();
  return content.packages.find((pkg) => pkg.slug === slug);
};
