export type SchemaNode = {
  key: string
  props?: Record<string, any>
  slots?: Record<string, SchemaNode | SchemaNode[]>
  children?: SchemaNode[]
}

export type PageSchema = {
  title: string
  description?: string
  nodes: SchemaNode[]
  styles?: string
  context?: Record<string, any>
}
