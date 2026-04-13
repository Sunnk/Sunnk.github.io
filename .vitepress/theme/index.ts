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

    const renderIssueComments = () => {
      if (!containerRef.value) return
      containerRef.value.innerHTML = ''

      const script = document.createElement('script')
      script.src = 'https://utteranc.es/client.js'
      script.async = true
      script.crossOrigin = 'anonymous'
      script.setAttribute('repo', 'Sunnk/Sunnk.github.io')
      script.setAttribute('issue-term', 'pathname')
      script.setAttribute('label', 'comment')
      script.setAttribute('theme', isDark.value ? 'github-dark' : 'github-light')
      containerRef.value.appendChild(script)
    }

    onMounted(renderIssueComments)
    watch(() => route.path, renderIssueComments)
    watch(isDark, renderIssueComments)

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
