import DefaultTheme from 'vitepress/theme'
import TlpViewer from '../components/TlpViewer.vue'
import Home from '../components/Home.vue'
import type { App } from 'vue'
// @ts-ignore: allow importing CSS without type declarations
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
      app.component('TlpViewer', TlpViewer)
      app.component('Home', Home)
    }
}
