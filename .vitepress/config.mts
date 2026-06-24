import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sunky's Blog",
  description: "Sunky's Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'NVLINK', link: '/Interconnect/nvlink/nvlink.md' },

    ],

    footer:{
      copyright: "Copyright@2026 Sunky"

    },

        // 文档的最后更新时间
    lastUpdated: {
    text: "Updated at",
    formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },


    

  sidebar: {
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      '/Interconnect/nvlink/': [
        {
          text: 'NVLink',
          items: [
            { text: 'NVLink 1.0', link: '/Interconnect/nvlink/nvlink_1.md' }
          ]
        }
      ]


      // 当用户位于 `config` 目录时，会显示此侧边栏




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
