# 1. Preface（前言）

## 1.1 Scope of this Revision（本次修订范围）

本规范定义了 MAC 与 PHY 之间的 PIPE（PHY Interface for PCIe/SATA/USB/DisplayPort/USB4）接口。

在 **Revision 6.2.1** 中，规范重点覆盖以下协议族在统一 PIPE 接口下的实现方式：

- PCI Express（PCIe）
- SATA
- USB 3.x
- DisplayPort
- USB4

其核心目标是：

1. 给出跨协议可复用的 PHY/MAC 接口信号定义；
2. 支持 Original PIPE 与 SerDes 两类架构；
3. 统一电源管理、速率切换、链路训练与错误上报等行为。

## 1.2 使用建议

- 本规范是**接口行为规范**，并不强制内部电路实现细节。
- 具体参数（如时序、寄存器支持、可选特性）需结合对应协议 Base Spec 联合解读。
- 当不同协议的要求冲突时，应以当前工作模式对应的协议约束为准。

## 1.3 术语（简）

- **MAC**：协议层/控制层逻辑，负责链路状态机与协议处理。
- **PHY**：物理层实现，负责串并转换、均衡、CDR、发送/接收电气行为。
- **PIPE**：MAC 与 PHY 之间的并行控制/状态/数据接口定义。
