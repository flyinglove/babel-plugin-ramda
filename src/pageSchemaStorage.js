import { assertValidPageSchema } from './pageSchemaValidator';

function normalizeEndpoint(endpoint) {
  if (!endpoint || typeof endpoint !== 'string') {
    throw new TypeError('A non-empty endpoint string is required.');
  }
  return endpoint.replace(/\/$/, '');
}

function ensureFetch(fetchImpl) {
  if (fetchImpl) {
    return fetchImpl;
  }
  if (typeof fetch !== 'undefined') {
    return fetch;
  }
  throw new Error('A fetch implementation must be provided.');
}

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Schema storage request failed (${response.status}): ${text}`);
  }
  if (response.status === 204) {
    return null;
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export async function exportPageSchema({
  schema,
  pageId,
  endpoint = '/api/pages',
  fetchImpl,
  mode = 'rest'
}) {
  const validSchema = assertValidPageSchema(schema);
  if (!pageId || typeof pageId !== 'string') {
    throw new TypeError('`pageId` must be a non-empty string.');
  }

  const fetcher = ensureFetch(fetchImpl);

  if (mode === 'graphql') {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation UpsertPage($id: ID!, $schema: JSON!, $version: String) {
          upsertPage(id: $id, schema: $schema, version: $version) {
            id
            version
            updatedAt
          }
        }`,
        variables: {
          id: pageId,
          schema: validSchema,
          version: validSchema.version
        }
      })
    });
    const payload = await handleResponse(response);
    return payload?.data?.upsertPage ?? payload;
  }

  const response = await fetcher(`${normalizeEndpoint(endpoint)}/${pageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schema: validSchema })
  });
  return handleResponse(response);
}

export async function importPageSchema({
  pageId,
  endpoint = '/api/pages',
  fetchImpl,
  mode = 'rest'
}) {
  if (!pageId || typeof pageId !== 'string') {
    throw new TypeError('`pageId` must be a non-empty string.');
  }

  const fetcher = ensureFetch(fetchImpl);

  if (mode === 'graphql') {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetPage($id: ID!) {
          page(id: $id) {
            id
            version
            schema
          }
        }`,
        variables: { id: pageId }
      })
    });
    const payload = await handleResponse(response);
    const schema = payload?.data?.page?.schema ?? payload;
    return assertValidPageSchema(schema);
  }

  const response = await fetcher(`${normalizeEndpoint(endpoint)}/${pageId}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  const payload = await handleResponse(response);
  const schema = payload?.schema ?? payload;
  return assertValidPageSchema(schema);
}

export const rendererSchemaEndpoint = '/api/pages';

export function getRendererSchemaUrl(pageId, baseUrl = '') {
  if (!pageId || typeof pageId !== 'string') {
    throw new TypeError('`pageId` must be a non-empty string.');
  }
  const normalizedBase = baseUrl.replace(/\/$/, '');
  return `${normalizedBase}${rendererSchemaEndpoint}/${pageId}`;
}

export default {
  exportPageSchema,
  importPageSchema,
  rendererSchemaEndpoint,
  getRendererSchemaUrl
};
