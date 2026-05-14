---
title: TLP 包结构
comments: false
---

# PCIe TLP 包结构

PCIe Transaction Layer Packet（TLP）通常由 Header、可选 Data Payload、可选 ECRC 组成。不同类型的 TLP 会复用通用 Header 字段，并在后续 DW 中定义各自的 Request、Completion 或 Message 字段。

## 速查入口

- [TLP 包格式速查](./formats)：按 DW / Byte 可视化查看 MRD、MWR、MSG、CPL 等常见包格式。
- [TLP 数据包解析](./parser)：用于解析已有 TLP DW 数据。
