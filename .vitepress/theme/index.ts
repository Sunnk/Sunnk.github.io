import DefaultTheme from 'vitepress/theme'
import TlpViewer from '../components/TlpViewer.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('TlpViewer', TlpViewer)
  }
}
