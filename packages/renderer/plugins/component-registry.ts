import Heading from '~/components/elements/Heading.vue'
import Paragraph from '~/components/elements/Paragraph.vue'
import Hero from '~/components/elements/Hero.vue'
import Badge from '~/components/elements/Badge.vue'

export default defineNuxtPlugin(() => {
  const registry = {
    heading: Heading,
    paragraph: Paragraph,
    hero: Hero,
    badge: Badge
  }

  return {
    provide: {
      componentRegistry: registry
    }
  }
})

export type ComponentRegistry = ReturnType<typeof useNuxtApp>['$componentRegistry']
