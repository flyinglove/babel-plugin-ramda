import type { H3Event } from 'h3'
import type { PageSchema } from '~/types/schema'

const pages: Record<string, PageSchema> = {
  index: {
    title: 'Welcome to the Schema Renderer',
    description: 'Render Vue components from structured schema definitions.',
    styles: `
      .schema-renderer [role="badge"] {
        display: inline-flex;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background: #0ea5e9;
        color: white;
        font-weight: 600;
      }
    `,
    context: {
      hero: {
        title: 'Composable schema-driven layouts'
      }
    },
    nodes: [
      {
        key: 'hero',
        props: {
          title: { __type: 'binding', path: 'context.hero.title' },
          subtitle: 'Build SEO friendly experiences from JSON schema.'
        },
        slots: {
          default: [
            {
              key: 'paragraph',
              props: {
                default: 'Nuxt 3 powers SSR and SSG out of the box with great DX.'
              }
            },
            {
              key: 'paragraph',
              props: {
                default: 'Component props support runtime bindings and expressions.'
              }
            }
          ]
        }
      },
      {
        key: 'heading',
        props: {
          level: 2,
          size: 'md',
          default: 'Dynamic data example'
        }
      },
      {
        key: 'paragraph',
        props: {
          default: {
            __type: 'expr',
            source: "`The current time is ${context.now}`"
          }
        }
      },
      {
        key: 'paragraph',
        props: {
          default: 'This badge uses runtime style injection:'
        },
        slots: {
          default: {
            key: 'badge',
            props: {
              label: 'Live',
              styleBlock: '[role="badge"] { background: #22c55e; }'
            }
          }
        }
      }
    ]
  },
  about: {
    title: 'About the Renderer',
    description: 'Additional page example for the sitemap.',
    nodes: [
      {
        key: 'heading',
        props: {
          level: 2,
          size: 'md',
          default: 'About this project'
        }
      },
      {
        key: 'paragraph',
        props: {
          default: 'The schema renderer maps keys to Vue components recursively.'
        }
      }
    ]
  }
}

function normalizeSlug(event: H3Event) {
  const slugParam = event.context.params?.slug
  if (!slugParam) return 'index'
  if (Array.isArray(slugParam)) {
    return slugParam.join('/')
  }
  return slugParam
}

export default defineEventHandler((event) => {
  const slug = normalizeSlug(event)
  const schema = pages[slug]
  if (!schema) {
    throw createError({ statusCode: 404, statusMessage: 'Schema not found' })
  }

  return schema
})
