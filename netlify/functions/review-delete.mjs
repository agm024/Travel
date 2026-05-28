import {createClient} from '@sanity/client'

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2025-01-01'
const token = process.env.SANITY_WRITE_TOKEN
const adminKey = process.env.REVIEW_ADMIN_KEY

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
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
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

  if (!projectId || !token || !client || !adminKey) {
    return json(500, {error: 'Sanity delete access is not configured'})
  }

  const requestKey = event.headers['x-admin-key'] || event.headers['X-Admin-Key']
  if (requestKey !== adminKey) {
    return json(403, {error: 'Forbidden'})
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const id = String(body.id ?? '').trim()

    if (!id) {
      return json(400, {error: 'Missing review id'})
    }

    await client.delete(id)
    return json(200, {ok: true})
  } catch (error) {
    console.error('review delete error', error)
    return json(500, {error: 'Unable to delete review'})
  }
}