---
title: TLP 包格式速查
layout: page
pageClass: tlp-format-page
aside: false
outline: [2, 3]
comments: false
---

# PCIe TLP 包格式速查

这个页面用于按 DW 对比常见 PCIe TLP 包格式。显示规则如下：

- 每一行代表一个 DW。
- Byte 从左到右按低地址到高地址排列，即 Byte 0、Byte 1、Byte 2、Byte 3。
- 每个 Byte 内仍按 MSB 到 LSB，也就是 bit7 到 bit0 的顺序显示。
- 将鼠标悬停在字段上，可以查看该字段从 bit0 累积后的实际 bit 范围，例如 `Fmt` 为 `7:5`，`Type` 为 `4:0`，`TH` 为 `8`，`LN` 为 `9`。

<PcieTlpFormatViewer />
