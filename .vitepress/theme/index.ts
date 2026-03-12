// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { Notice } from '@theojs/lumen'
import { Underline } from '@theojs/lumen'
import type { EnhanceAppContext } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-before': () => h(Notice)
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },

  enhanceApp: ({ app }: EnhanceAppContext) => {
    app.component('Home', Underline)
  } 

} satisfies Theme
