import DefaultTheme from 'vitepress/theme'
import Home from '../components/Home.vue'
import Layout from './Layout.vue'
import type { App } from 'vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.component('Home', Home)
  },
}
