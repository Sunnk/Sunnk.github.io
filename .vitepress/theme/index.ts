// https://vitepress.dev/guide/custom-theme
import { h, ref, onMounted, watch, defineComponent } from 'vue'
import type { Theme } from 'vitepress'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { Notice } from '@theojs/lumen'
import { Underline } from '@theojs/lumen'
import type { EnhanceAppContext } from 'vitepress'

const CommentSection = defineComponent({
  setup() {
    const { frontmatter, page, isDark } = useData()
    const route = useRoute()
    const containerRef = ref<HTMLElement | null>(null)

    const renderGiscus = () => {
      if (!containerRef.value) return
      containerRef.value.innerHTML = ''

      const script = document.createElement('script')
      script.src = 'https://giscus.app/client.js'
      script.async = true
      script.crossOrigin = 'anonymous'
      script.setAttribute('data-repo', 'Sunnk/Sunnk.github.io')
      script.setAttribute('data-repo-id', 'R_kgDOOr6hgw')
      script.setAttribute('data-category', 'General')
      script.setAttribute('data-category-id', 'DIC_kwDOOr6hg84Cr0qy')
      script.setAttribute('data-mapping', 'pathname')
      script.setAttribute('data-strict', '0')
      script.setAttribute('data-reactions-enabled', '1')
      script.setAttribute('data-emit-metadata', '0')
      script.setAttribute('data-input-position', 'top')
      script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
      script.setAttribute('data-lang', 'zh-CN')
      script.setAttribute('data-loading', 'lazy')
      containerRef.value.appendChild(script)
    }

    onMounted(renderGiscus)
    watch(() => route.path, renderGiscus)
    watch(isDark, renderGiscus)

    return () => {
      if (frontmatter.value?.comments === false || page.value.isNotFound) {
        return null
      }
      return h('div', { class: 'comments-wrapper' }, [
        h('div', { ref: containerRef }),
      ])
    }
  },
})

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-before': () => h(Notice),
      'doc-after': () => h(CommentSection),
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },

  enhanceApp: ({ app }: EnhanceAppContext) => {
    app.component('Home', Underline)
  } 

} satisfies Theme
