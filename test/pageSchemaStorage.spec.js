import assert from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';
import { exportPageSchema, importPageSchema, getRendererSchemaUrl } from '../src/pageSchemaStorage';

const validSchema = JSON.parse(readFileSync(join(__dirname, 'fixtures', 'validPageSchema.json'), 'utf8'));

describe('pageSchemaStorage', () => {
  it('exports schema via REST endpoint', async () => {
    const requests = [];
    const fetchImpl = async (url, options) => {
      requests.push({ url, options });
      return {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true })
      };
    };

    const response = await exportPageSchema({
      schema: validSchema,
      pageId: 'home',
      endpoint: '/api/pages',
      fetchImpl
    });

    assert.deepStrictEqual(response, { success: true });
    assert.strictEqual(requests[0].url, '/api/pages/home');
    assert.strictEqual(requests[0].options.method, 'PUT');
  });

  it('imports schema via REST endpoint', async () => {
    const fetchImpl = async () => ({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ schema: validSchema })
    });

    const schema = await importPageSchema({
      pageId: 'home',
      endpoint: '/api/pages',
      fetchImpl
    });

    assert.deepStrictEqual(schema.root, validSchema.root);
  });

  it('computes renderer URL', () => {
    assert.strictEqual(getRendererSchemaUrl('home'), '/api/pages/home');
    assert.strictEqual(getRendererSchemaUrl('home', 'https://example.com/'), 'https://example.com/api/pages/home');
  });

  it('supports GraphQL mode', async () => {
    const fetchImpl = async (_url, options) => {
      const body = JSON.parse(options.body);
      if (body.query.includes('GetPage')) {
        return {
          ok: true,
          status: 200,
          headers: new Map([['content-type', 'application/json']]),
          json: async () => ({ data: { page: { schema: validSchema } } })
        };
      }
      return {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ data: { upsertPage: { id: 'home', version: '1.0.0' } } })
      };
    };

    const graphqlSchema = await importPageSchema({
      pageId: 'home',
      endpoint: '/graphql',
      fetchImpl,
      mode: 'graphql'
    });
    assert.strictEqual(graphqlSchema.id, 'home');

    const mutation = await exportPageSchema({
      schema: validSchema,
      pageId: 'home',
      endpoint: '/graphql',
      fetchImpl,
      mode: 'graphql'
    });

    assert.deepStrictEqual(mutation, { id: 'home', version: '1.0.0' });
  });
});
