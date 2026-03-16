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
            { text: '1. Preface', link: '/PIPE/PIPE_7_1/1_Preface.md' },
            { text: '2. Introduction', link: '/PIPE/PIPE_7_1/2_Introduction.md' },
            { text: '3. PHY/MAC Interface', link: '/PIPE/PIPE_7_1/3_phymac_interface.md' },
            { text: '4. PCIe, USB, USB4, and DisplayPort PHY Functionality', link: '/PIPE/PIPE_7_1/3_phymac_interface.md' },
            { text: '5. SATA PHY Functionality', link: '/PIPE/PIPE_7_1/3_phymac_interface.md' },
            { text: '6. PIPE Interface Signal Descriptions', link: '/PIPE/PIPE_7_1/3_phymac_interface.md' },
            { text: '7. PIPE Message Bus Address Spaces', link: '/PIPE/PIPE_7_1/3_phymac_interface.md' },
            { text: '8. PIPE Operational Behavior', link: '/PIPE/PIPE_7_1/3_phymac_interface.md' },
            { text: '9. Sample Operational Sequences', link: '/PIPE/PIPE_7_1/3_phymac_interface.md' },
            { text: '10. Multi-Lane PIPE - PCIe Mode', link: '/PIPE/PIPE_7_1/3_phymac_interface.md' },
            { text: 'A. Appendix', link: '/PIPE/PIPE_7_1/3_phymac_interface.md' }

          ]
        }
      ],

      '/PIPE/PIPE_5_1/': [
        {
          text: 'PIPE 5.1',
          items: [
            { text: '2. Introduction', link: '/PIPE/PIPE_5_1/2_Introduction.md' },
            { text: 'Four', link: '/config/four' }
          ]
        }
      ],

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
