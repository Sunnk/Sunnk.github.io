---
title: PCIe TLP 包结构
layout: page
pageClass: tlp-full-page
sidebar: false
aside: false
outline: false

comments: false
---

# PCIe TLP 包结构

这个页面用静态图表展示常见 PCIe Transaction Layer Packet (TLP) Header 中各字段的 bit 起始/结束位置。鼠标悬停在字段上可以看到精确位置和简短说明，字段不再提供点击跳转。

<PcieTlpExplorer />

::: tip 使用说明
- 横向每一行都是一个 32-bit DW，顶部刻度从 bit 31 到 bit 0。
- 彩色块宽度与字段 bit 宽度一致，块上的 `bits m:n` 表示从高位 `m` 到低位 `n`。
- 每个 DW 使用固定 32 列网格；新增字段时建议按 bit31 到 bit0 排列，并用 `R` / Reserved 补齐空洞，避免显示错位。
- 目前页面覆盖 Memory Request 3DW/4DW、Completion 和 Configuration Request，后续可以继续在 Vue 组件的 `packets` 静态数据中扩展其他 TLP 类型。
:::
