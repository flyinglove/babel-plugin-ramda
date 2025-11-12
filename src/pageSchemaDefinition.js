export const pageSchemaDefinition = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://example.com/schemas/page.json',
  title: 'Low-code Page Schema',
  description: 'Declarative description for a rendered page composed of components.',
  type: 'object',
  required: ['id', 'name', 'root'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      description: 'Stable identifier of the page within the design system.'
    },
    name: {
      type: 'string',
      description: 'Human friendly page name displayed to the editor.'
    },
    version: {
      type: 'string',
      description: 'Semantic version of the schema definition to help with migrations.'
    },
    locale: {
      type: 'string',
      description: 'Optional locale tag (BCP 47) the page was authored for.'
    },
    metadata: {
      type: 'object',
      description: 'Arbitrary metadata consumed by the runtime or backend.',
      additionalProperties: true
    },
    dataSources: {
      type: 'array',
      description: 'Remote or local data sources made available for bindings.',
      items: {
        type: 'object',
        required: ['id', 'type', 'config'],
        additionalProperties: false,
        properties: {
          id: { type: 'string', description: 'Unique identifier referenced by bindings.' },
          type: {
            type: 'string',
            description: 'Storage mechanism (rest, graphql, local-state, etc).'
          },
          config: {
            type: 'object',
            description: 'Connector configuration (endpoints, queries, auth, etc).',
            additionalProperties: true
          },
          provides: {
            type: 'array',
            description: 'Named entities exposed from the data source for binding.',
            items: { type: 'string' }
          }
        }
      }
    },
    root: {
      $ref: '#/definitions/component',
      description: 'Top level component rendered by the runtime.'
    }
  },
  definitions: {
    component: {
      type: 'object',
      required: ['id', 'type'],
      additionalProperties: false,
      properties: {
        id: {
          type: 'string',
          description: 'Unique identifier used by the editor for tracking selections.'
        },
        type: {
          type: 'string',
          description: 'Component type key resolved by the renderer component registry.'
        },
        variant: {
          type: 'string',
          description: 'Optional variant or sub-type to refine component appearance.'
        },
        props: {
          type: 'object',
          description: 'Plain props passed to the component at render time.',
          additionalProperties: true,
          default: {}
        },
        styles: {
          type: 'object',
          description: 'Component level style tokens mapped to CSS-in-JS or utility classes.',
          additionalProperties: true
        },
        layout: {
          type: 'object',
          description: 'Layout constraints for responsive composition.',
          additionalProperties: false,
          properties: {
            width: { anyOf: [{ type: 'string' }, { type: 'number' }] },
            height: { anyOf: [{ type: 'string' }, { type: 'number' }] },
            display: { type: 'string' },
            position: { type: 'string' },
            order: { type: 'number' },
            gridArea: { type: 'string' }
          }
        },
        dataBindings: {
          type: 'object',
          description: 'Map of prop keys to binding descriptors resolved at runtime.',
          additionalProperties: {
            type: 'object',
            required: ['sourceId', 'path'],
            additionalProperties: false,
            properties: {
              sourceId: {
                type: 'string',
                description: 'References dataSources[id] providing the bound data.'
              },
              path: {
                type: 'string',
                description: 'Lodash style path to the data inside the source payload.'
              },
              defaultValue: {
                description: 'Fallback value used when the binding resolves to nullish.',
                type: ['string', 'number', 'boolean', 'object', 'array', 'null']
              },
              transforms: {
                type: 'array',
                description: 'Optional pipeline of transforms applied to the resolved value.',
                items: {
                  type: 'object',
                  required: ['type'],
                  additionalProperties: true,
                  properties: {
                    type: { type: 'string' },
                    props: { type: 'object', additionalProperties: true }
                  }
                }
              }
            }
          }
        },
        events: {
          type: 'object',
          description: 'Event handlers declaratively wired to actions or state updates.',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'object',
              required: ['type'],
              additionalProperties: true,
              properties: {
                type: { type: 'string' },
                params: { type: 'object', additionalProperties: true }
              }
            }
          }
        },
        conditional: {
          type: 'object',
          description: 'Conditional visibility configuration for the component.',
          additionalProperties: false,
          properties: {
            visible: { type: 'boolean' },
            predicate: { type: 'string', description: 'Expression evaluated against data context.' }
          }
        },
        children: {
          type: 'array',
          description: 'Child components rendered inside the parent component.',
          items: { $ref: '#/definitions/component' },
          default: []
        }
      }
    }
  }
};

export default pageSchemaDefinition;
