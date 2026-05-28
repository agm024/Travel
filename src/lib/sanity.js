import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {siteContent as fallbackSiteContent} from '../data/content'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET ?? 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION ?? '2025-01-01'
const isDevelopment = import.meta.env.DEV

const hasSanityConfig = Boolean(projectId)

const client = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null

const imageBuilder = client ? imageUrlBuilder(client) : null
const sanityProxyBase = '/sanity'

const travelContentQuery = `{
  "siteSettings": *[_type == "siteSettings"][0]{
    brand,
    heroTagline,
    heroHeadline,
    heroDescription,
    heroImage,
    heroVideo{
      asset->{url}
    },
    aboutDescription,
    destinations,
    months,
    stats[]{label, value},
    aboutPoints[]{icon, title, description}
  },
  "packages": *[_type == "travelPackage"] | order(title asc){
    title,
    "slug": slug.current,
    country,
    month,
    duration,
    price,
    description,
    image,
    gallery,
    highlights,
    itinerary
  },
  "reviews": *[_type == "review"] | order(_createdAt desc){
    _id,
    name,
    trip,
    rating,
    quote
  },
  "contact": *[_type == "contactDetails"][0]{
    phone,
    email,
    address,
    hours,
    whatsapp,
    intro,
    promises
  }
}`

const cleanStrings = (values) =>
  Array.from(new Set((values ?? []).map((value) => value?.trim()).filter(Boolean)))

const imageUrlFor = (source) => {
  if (!imageBuilder || !source) {
    return ''
  }

  return imageBuilder.image(source).auto('format').fit('max').url()
}

const mapStats = (stats) => {
  const mapped = (stats ?? [])
    .map((stat) => ({
      label: stat?.label?.trim(),
      value: stat?.value?.trim(),
    }))
    .filter((stat) => stat.label && stat.value)

  return mapped.length ? mapped : fallbackSiteContent.stats
}

const mapAboutPoints = (points) => {
  const mapped = (points ?? [])
    .map((point) => ({
      icon: point?.icon?.trim() || '✦',
      title: point?.title?.trim(),
      description: point?.description?.trim(),
    }))
    .filter((point) => point.title && point.description)

  return mapped.length ? mapped : fallbackSiteContent.about.points
}

const deriveOptionsFromPackages = (packages) => ({
  destinations: cleanStrings(packages.map((travelPackage) => travelPackage.country)),
  months: cleanStrings(packages.map((travelPackage) => travelPackage.month)),
})

const mapPackages = (packages) => {
  const mapped = (packages ?? [])
    .map((travelPackage) => ({
      slug: travelPackage?.slug?.trim(),
      title: travelPackage?.title?.trim(),
      country: travelPackage?.country?.trim(),
      month: travelPackage?.month?.trim(),
      duration: travelPackage?.duration?.trim(),
      price: travelPackage?.price?.trim(),
      description: travelPackage?.description?.trim(),
      image: imageUrlFor(travelPackage?.image),
      gallery: cleanStrings((travelPackage?.gallery ?? []).map((entry) => imageUrlFor(entry))),
      highlights: cleanStrings(travelPackage?.highlights),
      itinerary: cleanStrings(travelPackage?.itinerary),
    }))
    .filter((travelPackage) => travelPackage.slug && travelPackage.title)
    .map((travelPackage) => ({
      ...travelPackage,
      gallery:
        travelPackage.gallery.length > 0
          ? travelPackage.gallery
          : travelPackage.image
            ? [travelPackage.image]
            : [],
    }))

  return mapped.length ? mapped : fallbackSiteContent.packages
}

const mapReviews = (reviews) => {
  const mapped = (reviews ?? [])
    .map((review) => ({
      id: review?._id?.trim(),
      name: review?.name?.trim(),
      trip: review?.trip?.trim(),
      rating: Number(review?.rating),
      quote: review?.quote?.trim(),
    }))
    .filter((review) => review.id && review.name && review.trip && review.quote && Number.isFinite(review.rating))

  return mapped.length ? mapped : fallbackSiteContent.reviews
}

const mapContact = (contact) => ({
  phone: contact?.phone?.trim() || fallbackSiteContent.contact.phone,
  email: contact?.email?.trim() || fallbackSiteContent.contact.email,
  address: contact?.address?.trim() || fallbackSiteContent.contact.address,
  hours: contact?.hours?.trim() || fallbackSiteContent.contact.hours,
  whatsapp: contact?.whatsapp?.trim() || fallbackSiteContent.contact.whatsapp,
  intro: contact?.intro?.trim() || fallbackSiteContent.contact.intro,
  promises: cleanStrings(contact?.promises).length
    ? cleanStrings(contact?.promises)
    : fallbackSiteContent.contact.promises,
})

export async function fetchTravelContent() {
  if (!projectId) {
    return fallbackSiteContent
  }

  const data = isDevelopment
    ? await fetchDevSanityData()
    : await client.fetch(travelContentQuery)

  const siteSettings = data?.siteSettings ?? {}
  const packages = mapPackages(data?.packages)
  const packageOptions = deriveOptionsFromPackages(packages)

  return {
    brand: siteSettings.brand?.trim() || fallbackSiteContent.brand,
    heroImage: imageUrlFor(siteSettings.heroImage) || fallbackSiteContent.heroImage,
    heroVideo: siteSettings.heroVideo?.asset?.url?.trim() || fallbackSiteContent.heroVideo || '',
    heroTagline: siteSettings.heroTagline?.trim() || 'Bright luxury travel, made elegantly simple',
    heroHeadline:
      siteSettings.heroHeadline?.trim() ||
      'Discover minimal, polished journeys built for effortless travel days.',
    heroDescription:
      siteSettings.heroDescription?.trim() ||
      'Plan premium holidays with clear choices, smooth booking support, and vibrant stays across the world\'s most inspiring destinations.',
    destinations: packageOptions.destinations,
    months: packageOptions.months,
    stats: mapStats(siteSettings.stats),
    about: {
      description:
        siteSettings.aboutDescription?.trim() || fallbackSiteContent.about.description,
      points: mapAboutPoints(siteSettings.aboutPoints),
    },
    reviews: mapReviews(data?.reviews),
    contact: mapContact(data?.contact),
    packages,
  }
}

async function fetchDevSanityData() {
  const query = new URLSearchParams({query: travelContentQuery, returnQuery: 'false'})
  const response = await fetch(
    `${sanityProxyBase}/v${apiVersion}/data/query/${dataset}?${query.toString()}`,
  )

  if (!response.ok) {
    throw new Error(`Sanity query failed with status ${response.status}`)
  }

  const payload = await response.json()
  return payload?.result ?? {}
}