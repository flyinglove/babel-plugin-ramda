# Page renderer schema API contract

The renderer obtains page definitions through a simple HTTP contract that wraps the
schema described in [`src/pageSchemaDefinition.js`](../src/pageSchemaDefinition.js).

## REST interface

- **Endpoint**: `GET /api/pages/:id`
- **Response body**:

```json
{
  "id": "home",
  "name": "Marketing homepage",
  "version": "1.0.0",
  "root": { "type": "Layout.Stack", "id": "root", "children": [] }
}
```

The renderer should treat the payload as the canonical schema document and feed it to
`assertValidPageSchema` before rendering. A `404` response indicates the page does not
exist and should surface an appropriate fallback UI.

### Back-office integration

The authoring (builder) interface persists the schema through the matching `PUT`
endpoint (`PUT /api/pages/:id` with body `{ "schema": <pageSchema> }`). Successful
requests should return the stored schema or an acknowledgement.

## GraphQL interface

When GraphQL is preferred, the renderer issues the following query against the
configured endpoint:

```graphql
query GetPage($id: ID!) {
  page(id: $id) {
    id
    version
    schema
  }
}
```

The builder uses the complementary mutation:

```graphql
mutation UpsertPage($id: ID!, $schema: JSON!, $version: String) {
  upsertPage(id: $id, schema: $schema, version: $version) {
    id
    version
    updatedAt
  }
}
```

Both workflows funnel the payload through the runtime validator in
[`pageSchemaValidator`](../src/pageSchemaValidator.js) prior to persisting or rendering
so that corrupted or outdated schemas are rejected early.
