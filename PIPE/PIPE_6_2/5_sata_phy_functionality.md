# 5. SATA PHY 功能

本章定义 SATA 模式下 PHY 的发送与接收行为，以及与 MAC 的控制/状态交互。

## 5.1 功能框图
- TX BLOCK、RX BLOCK、PLL、并行接口与串行差分对关系

## 5.2 发射路径
- 并行数据输入、编码与串行发送
- TxElecIdle、TxDetectRx/Loopback 等控制语义

## 5.3 接收路径
- 差分接收、时钟恢复、数据恢复与并行输出
- Rx 状态码与链路事件上报

## 5.4 实现要点
- SATA 速率档位与时钟关系
- OOB/链路初始化期间的状态机约束
