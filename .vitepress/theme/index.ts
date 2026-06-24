import DefaultTheme from 'vitepress/theme'
import Home from '../components/Home.vue'
import type { App } from 'vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
      app.component('Home', Home)
    }
}
