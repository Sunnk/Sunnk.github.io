---
title: TLP 数据包解析器
layout: page
pageClass: tlp-full-page
sidebar: false
aside: false
outline: false
comments: false
---

# PCIe TLP 数据包解析器

<PcieTlpParser />

::: info 相关页面
- 查看静态字段参考：[TLP 包结构](./)
:::

::: info 添加新包类型
解析器使用类型注册表架构。在 `PcieTlpParser.vue` 的 `tlpTypes` 数组中追加一个 `TlpTypeDef` 对象即可支持新的 TLP 类型：

- **match(fmt, type, dwCount)** — 根据 Fmt / Type 字段决定是否匹配
- **decode(dw[])** — 从原始 DW 数据中解析出字段结构

已有的辅助函数（`dw0MemIO`、`dw1Request`、`dw0Completion`、`dataPayload` 等）可直接复用，简化常见类型的解码。
:::
