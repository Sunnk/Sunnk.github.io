# 4. PCIe、USB 与 DisplayPort PHY 功能

本章描述多协议 PHY 在 PIPE 下的发送、接收、编码、解码与关键控制路径。

## 4.1 Original PIPE 架构
- 典型并行数据路径组织
- 与命令/状态接口的时序关系

## 4.2 SerDes 架构
- 串并转换路径
- 低引脚数接口下的数据与控制映射
- 发射机/接收机功能框图解读

## 4.3 关键行为翻译摘要
- 发射端：并行数据打包、编码、发射控制（如 TxElecIdle、TxDetectRx）。
- 接收端：CDR、解串、弹性缓存、状态上报（如 RxValid/RxStatus）。
- 协议差异：PCIe/USB/DP 在训练、低功耗、唤醒信号上的语义差异。
