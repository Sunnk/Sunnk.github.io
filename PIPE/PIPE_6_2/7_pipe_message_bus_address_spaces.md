# 7. PIPE Message Bus 地址空间

本章定义通过 Message Bus 访问的 PHY/MAC 寄存器地址空间。

## 7.1 PHY Registers
- Rx Margin / Elastic Buffer / PHY Rx Control / PHY Tx Control / Common Control 等地址块

## 7.2 MAC Registers
- Rx Status / Tx Status / Link Evaluation / Loopback Status 等地址块

## 7.3 翻译落地建议
- 用表格整理：地址、名称、位域、读写属性、复位值、模式适用性。
- 区分“规范要求（must）”与“实现可选（optional）”字段。
