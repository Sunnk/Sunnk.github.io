# 2. Introduction（简介）

PIPE 规范将不同高速接口协议在 PHY/MAC 交互层抽象为统一接口，降低多协议 PHY 设计复杂度。

## 2.1 PCIe PHY Layer

PCIe 模式下，接口强调：

- Detect / Polling / Recovery 等链路阶段需要的控制与状态交互；
- 电源状态（P0/P1/P2/P3）与电气空闲（Electrical Idle）协同；
- 均衡、去加重、接收检测、回环等能力。

## 2.2 USB PHY Layer

USB 模式下，接口重点包括：

- LFPS 发送与检测；
- U0/U1/U2/U3 等低功耗状态切换需求对应的控制语义；
- 与并行数据路径相关的数据有效、状态编码与错误上报。

## 2.3 USB4 PHY Layer

USB4 模式在继承 USB 高速物理层基础上，进一步强调：

- 更严格的链路训练与时序一致性；
- 与隧道化数据路径相关的 PHY 控制能力；
- 与 DisplayPort/PCIe 复用链路时的模式切换行为。

## 2.4 SATA PHY Layer

SATA 模式采用其特定带宽与 OOB（带外）行为要求，PIPE 通过统一信号语义承载其基本控制与状态交互。

## 2.5 DisplayPort PHY Layer

DisplayPort 模式侧重链路训练、速率/通道参数控制与状态反馈，规范中定义了与其它模式共享和专用的控制路径。

## 2.6 Low Pin Count Interface and SerDes Architecture

规范定义了两类典型接口组织方式：

- **Original PIPE**：传统并行位宽接口；
- **SerDes Architecture**：更低引脚数、更高复用度的接口组织。

## 2.7 Support for Short Reach (SR) Applications

规范支持短距（SR）应用场景，允许在满足协议要求前提下采用更贴近系统实现的 PHY 参数与拓扑。

## 2.8 Configurable Pairs

针对多 Lane / 多协议复用场景，规范允许通过可配置差分对映射来适配不同 SoC/平台布线策略。
