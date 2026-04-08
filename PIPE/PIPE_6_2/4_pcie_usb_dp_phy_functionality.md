# 4. PCIe、USB 与 DisplayPort PHY 功能

图 4-1 展示了发射差分对和接收差分对组合的 PHY 功能框图。所示的功能模块并非旨在定义合规 PHY 的内部架构或设计，而是为了辅助信号分组。图 4-2 和图 4-3 分别提供了功能性物理结构图，展示了 Tx+Tx 和 Rx+Rx 组合。请注意，虽然这些图示展示了相锁环（PLL）位于 PHY 中的场景，但如果 PLL 位于 PHY 外部，也存在其他拓扑结构，如第 8.1.1 节所述

``Section 4.1 and Section 4.2 provide descriptions of each of the blocks shown in Figure 4-1, Figure 4-2, Figure 4-3. These blocks represent high-level functionality that is required to exist in the PHY implementation. These descriptions and diagrams describe general architecture and behavioral characteristics. Different implementations are possible and acceptable.``

第 4.1 节和第 4.2 节对图 4-1、图 4-2、图 4-3 中所示的每个区块进行了描述。这些模块代表 PHY 实现中必须存在的高级功能。这些描述和图表描述了一般的架构和行为特征。不同的实现方式是可能且可接受的。