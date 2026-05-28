import {createClient} from '@sanity/client'

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2025-01-01'
const token = process.env.SANITY_WRITE_TOKEN
const client = projectId && token
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
      perspective: 'published',
    })
  : null

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
  body: JSON.stringify(body),
})

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, {ok: true})
  }

  if (event.httpMethod !== 'POST') {
    return json(405, {error: 'Method not allowed'})
  }

  if (!projectId || !token || !client) {
    return json(500, {error: 'Sanity is not configured for writes'})
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const numberOfGuests = Number(body.numberOfGuests)
    const numberOfChildren = Number(body.numberOfChildren)
    const message = String(body.message ?? '').trim()
    const travelPackage = String(body.travelPackage ?? '').trim()
    const sourcePage = String(body.sourcePage ?? '').trim()

    if (
      !name ||
      !email ||
      !message ||
      !Number.isFinite(numberOfGuests) ||
      numberOfGuests < 1 ||
      !Number.isFinite(numberOfChildren) ||
      numberOfChildren < 0
    ) {
      return json(400, {error: 'Missing required fields'})
    }

    const created = await client.create({
      _type: 'contactInquiry',
      name,
      email,
      phone,
      numberOfGuests,
      numberOfChildren,
      message,
      travelPackage,
      sourcePage,
      submittedAt: new Date().toISOString(),
      status: 'new',
    })

    return json(200, {ok: true, id: created._id})
  } catch (error) {
    return json(500, {error: 'Unable to save inquiry'})
  }
}