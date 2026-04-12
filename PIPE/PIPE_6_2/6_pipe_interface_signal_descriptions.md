# 6. PIPE Interface Signal Descriptions

下列表格对 PHY 的输入输出信号进行了说明。需要注意的是，Input/Output的定义是从符合 PIPE 规范的 PHY 组件视角出发的：表中标注为“Output”的信号由 PHY 驱动，而标注为“Input”的信号由 PHY 接收。每个信号均提供基本描述，更详细的操作方式和时序信息将在后续章节中给出。在 PIPE 实现中，“parallel”侧的所有信号均与 PCLK 同步，例外情况会在表格中注明。在 SerDes 架构中，RxData 与 RxCLK 同步。仅支持 SerDes 架构的 PHY 无需实现标注为“not used in the SerDes architecture”的信号；同时支持原始 PIPE 与 SerDes 架构的 PHY 则必须实现所有信号。各信号表中还会标明适用的协议：USB 指 USB 3.2 及以下版本，USB4 将单独标出。

如第 2.8 节所述，任意时刻最多只有两对差分信号处于工作状态。与接收端（Rx）功能相关的 PIPE 控制信号，同时适用于 Rx 和 Rx2，除非针对每一对差分信号单独定义了控制信号。与发送端（Tx）功能相关的 PIPE 控制信号，同时适用于 Tx 和 Tx2，除非分别为两对差分信号定义了控制信号。


::: info
Note：对于 USB4 和 DisplayPort，低速侧通道不属于 PIPE 定义范围，但附录中列出了 DisplayPort 的 AUX 信号。
:::


## 6.1 PHY/MAC Interface Signals – Common for SerDes and Original PIPE

本节介绍同时适用于 SerDes 架构和Original PIPE 的信号。描述中会注明两种架构在使用上的差异。



### 6.1.1 Data Interface

<h3 align="center"> Table 6-1. Tx Data Interface Input Signals </h3>



| Name                                                                                                                                                                                                                                                                                                                                     | Active Level | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Relevant Protocols                       |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------- |
| **Original PIPE:**<br>TxData[31:0] 适用于32bit接口<br>TxData[15:0] 适用于16bit接口<br>TxData[7:0] 适用于8bit接口<br><br>**SerDes架构:**<br>TxData[79:0] 适用于80bit接口<br>TxData[39:0] 适用于40bit接口<br>TxData[19:0] 适用于20bit接口<br>TxData[9:0] 适用于10bit接口<br><br>**SerDes架构: (仅限USB4)**<br>TxData[55:0] 适用于56bit接口 | N/A          | Tx差分对的并行数据输入总线。<br><br>对于Original PIPE架构，TxData信号宽度选项为32、16和8bit。对于16bit接口，16bit代表两个Tx symbol。[7:0]是第一个要传输的symbol，[15:8]是第二个symbol。对于32bit接口，32bit代表4个Tx symbol。[23:16]是第三个要传输的symbol，[31:24]是第四个symbol。Bit 0是第一个被传输的。<br><br>对于SerDes架构，TxData信号宽度选项为80、40、20和10bit。对于80bit接口，80bit代表8个Tx数据symbol。[49:40]、[59:50]、[69:60]和[79:70]分别是第五、第六、第七和第八个symbol。对于块编码数据¹，每个10bit切片中只有8bit被使用，例如[7:0]代表字节0，[9:8]保留，[17:10]代表字节1，[19:18]保留，以此类推。Bit 0 是第一个被传输的。<br><br>此外，对于SerDes架构，USB4使用56bit接口而不是80bit接口。56bit接口的详细信息请参阅第8.34.3节。 | PCIe, SATA, USB, DisplayPort Tx, 和 USB4 |
| **SerDes架构:**<br>TxData2[55:0] 适用于56bit接口<br>TxData2[39:0] 适用于40bit接口<br>TxData2[19:0] 适用于20bit接口<br>TxData2[9:0] 适用于10bit接口                                                                                                                                                                                       | N/A          | Tx2差分对的并行数据输入总线。<br>对于SerDes架构，TxData信号宽度选项为56、40、20和10bit。对于40bit接口，40bit代表4个Tx数据symbol。[9:0]、[19:10]、[29:20]和[39:30]分别代表第一、第二、第三和第四个symbol。<br><br>56bit接口的详细信息请参阅第8.34.3节。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | DisplayPort Tx, USB4                     |
| TxDataValid                                                                                                                                                                                                                                                                                                                              | N/A          | PCI Express模式、SATA模式和USB模式（仅限Original PIPE）:<br>此信号允许MAC指示PHY忽略一个时钟周期的数据接口。值为1表示PHY将使用数据，值为0表示PHY将不使用数据。<br>当PHY处于不需要该信号的模式时，MAC必须在所有时候都断言TxDataValid。所有8 GT/s、16 GT/s、32 GT/s和64 GT/s的PCI Express模式以及所有10 GT/s的USB模式都使用TxDataValid。有关使用TxDataValid的其他模式列表，请参见表3-1、表3-2和表3-3。有关USB使用的详细信息，请参见第8.26节；此信号不适用于USB SerDes架构设计。                                                                                                                                                                                                                                                                   | PCIe, SATA, USB（仅限Original PIPE）     |

¹ 针对以 8 GT/s 或更高链路速率运行的 PCIe、USB4 以及链路速率为 10 GT/s 的 USB，其数据位均按照前面表格中所述的块编码数据描述进行使用。对于所有其他模式，则所有数据位均被使用。


<h3 align="center"> Table 6-2. Tx Data Interface Output Signals </h3>

| Name       | Active Level |  Description    | Relevant Protocols   |
| ---------- | ------------ | ---------- | ------------------ |
| Tx+, Tx-   | N/A          | Tx 差分对由 PHY 输出。所有发送端必须通过交流耦合（AC-coupled）方式连接至传输介质。具体请参见 PCI Express 基础规范中的第 4.3.1.2 节或 USB 3.2 规范中的第 6.2.2 节。 | PCIe, SATA, USB, DisplayPort Tx, and USB4 |
| Tx2+, Tx2- | N/A          | Tx2 差分对由 PHY 输出。所有发送端必须通过交流耦合（AC-coupled）方式连接至传输介质。                                                                                | DisplayPort Tx, USB4                      |



<h3 align="center"> Table 6-3. Rx Data Interface Input Signals </h3>

| Name       | Active Level | Description                            | Relevant Protocols                        |
| :--------- | :----------- | :------------------------------------- | :---------------------------------------- |
| Rx+, Rx-   | N/A          | PHY 的 Rx  差分对输入  | PCIe, SATA, USB, DisplayPort Rx, and USB4 |
| Rx2+, Rx2- | N/A          | PHY 的 Rx2 差分对输入  | DisplayPort Rx, USB4                      |


<h3 align="center"> Table 6-4. Rx Data Interface Output Signals </h3>


| Name | Active Level | Description | Relevant Protocols |
|------|--------------|-------------|--------------------|
| **Original PIPE**: RxData[31:0] for 32-bit interface,<br> RxData[15:0] for 16-bit interface,<br> RxData[7:0] for 8-bit interface <br> <br> **SerDes arch**: RxData[79:0] for 80-bit interface,<br> RxData[39:0] for 40-bit interface,<br> RxData[19:0] for 20-bit interface <br> <br> **SerDes arch (USB4 only)**: RxData[55:0] for 56-bit interface  | N/A | 接收差分对的并行数据输出总线。对于 16 bit接口，16 bit数据表示两个接收到的 symbol 。bit [7:0] 是接收到的第一个 symbol，bit [15:8] 是第二个 symbol。对于 32 bit接口，32 bit数据表示四个接收 symbol。bit [23:16] 是接收到的第三个 symbol，bit [31:24] 是第四个 symbol。bit 0 是接收到的第一个比特。<br> <br> 当 PHY 处于 SATA 模式时，跟在 ALIGN 原语之后的第一个有效数据必须出现在 Rx 数据的字节 0 位置上。<br> <br> 对于 SerDes 架构，RxData 信号的位宽可选为 80、40、20 和 10 bit。对于 80 bit接口，80 bit数据表示八个接收 symbol。bit [49:40]、bit [59:50]、bit [69:60] 和bit [79:70] 分别对应第五、第六、第七和第八个 symbol。对于块编码数据，每个 10 bit片（slice）中仅使用 8 bit，例如，[7:0] 表示字节 0，[9:8] 为保留bit，[17:10] 表示字节 1，[19:18] 为保留bit，依此类推。bit 0 是接收到的第一个比特。<br> <br> 此外，对于 SerDes 架构，USB4 使用 56 bit接口而非 80 bit接口。56 bit接口的详细信息请参考第 8.34.3 节。<br> <br> 在 SerDes 模式下，RxData 与 RxCLK 保持同步。 | PCIe, SATA, USB, DisplayPort Rx, USB4 |
| SerDes arch: RxData2[55:0] for 56-bit interface, RxData2[39:0] for 40-bit interface, RxData2[19:0] for 20-bit interface, or RxData2[9:0] for 10-bit interface | N/A | Parallel data output bus for Rx2 diff pair. <br><br>For SerDes architecture, the RxData signal width options are 56, 40, 20, and 10 bits. For the 40-bit interface, 40 bits represent 4 symbols of receive data. Bits [9:0], bits [19:10], bits [29:20], and bits [39:30] represent the first, second, third, and fourth symbols, respectively. <br><br>Please refer to [Section 8.34.3](#) for details of the 56-bit interface. <br><br>RxData2 is synchronous to RxCLK2 in SerDes mode. | DisplayPort RX, USB4 |


