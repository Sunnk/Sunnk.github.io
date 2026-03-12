import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sunky's Blog",
  description: "Sunky's Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'PIPE', 
        items: [
          { text: 'PIPE 7.1', link: '/PIPE/PIPE_7_1/PIPE7_1.md' },
          { text: 'PIPE 5.1', link: '/PIPE/PIPE_5_1/PIPE5_1.md' }
        ]
      },



    ],

    footer:{
      copyright: "Copyright@2025 Sunky"

    },
    

  sidebar: {
      // 当用户位于 `guide` 目录时，会显示此侧边栏

      // 当用户位于 `config` 目录时，会显示此侧边栏
      '/PIPE/PIPE_7_1/': [
        {
          text: 'PIPE 7.1',
          items: [
            { text: '1. Preface', link: '/PIPE/PIPE_7_1/Preface.md' },
            { text: '2. Introduction', link: '/PIPE/PIPE_7_1/Introduction.md' },
            { text: 'Four', link: '/config/four' }
          ]
        }
      ]
    },







    
    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    }

  }
})
