---
outline: deep
---
# 3. PHY/MAC Interface

图 3-1 显示了 PHY 与 MAC 层之间一对 TX 和 RX 组合情况下的**数据**、**命令**和**状态**信号。


![alt text](/PIPE/PIPE_7_1/image/Figure3_1.png)

图 3-2 和图 3-3 分别展示了 DisplayPort DPTX 和 DPRX 在 PHY 与 MAC 层之间的**数据**、**命令**和**状态**信号。如果想要在所有速率下完全支持 PCIe 模式、USB 模式、SATA 模式、DisplayPort 模式和 USB4 模式，需要实现不同数量的控制和状态信号。详见第 6.1 节，了解每种工作模式需要哪些具体信号。

![alt text](/PIPE/PIPE_7_1/image/Figure3_2.png)

![alt text](/PIPE/PIPE_7_1/image/Figure3_3.png)


本规范允许多种不同的 PHY/MAC 接口配置以支持多种信号速率。

对于仅支持 PCIe 2.5 GT/s 速率的 PIPE 实现，可以选择 16 位数据路径实现，PCLK 运行于 125 MHz，或 8 位数据路径，PCLK 运行 250 MHz。支持 5.0 GT/s 和 2.5 GT/s 的 PCIe 模式 PIPE 实现， 可以在 2.5 GT/s 和 5.0 GT/s 之间切换信号速率，实现方式多种。一种方法是选择在2.5 GT/s速率运行时固定PCLK为250 MHz并使用8-bit数据路径，而在5.0 GT/s速率运行时使用16-bit数据路径。另一种方法是选择是使用固定的数据路径宽度，并通过改变PCLK频率来调整速率。在这种情况下，具有8-bit数据路径的实现将为2.5 GT/s信令提供250 MHz的PCLK，为5.0 GT/s信令提供500 MHz的PCLK。类似地，具有16-bit数据路径的实现将为2.5 GT/s速率提供125 MHz的PCLK，为5.0 GT/s速率提供250 MHz的PCLK。可能的示例列表显示在表3‑1中。


对于支持5.0 GT/s USB模式和10 GT/s的PIPE，USB模式下可以从表3‑3中所示选项中选择一种实现。一个符合PIPE规范的MAC或PHY只需要支持它所支持的每种USB传输速率中的一个选项。

对于仅支持1.5 GT/s信号速率的SATA PIPE，实现者可以选择使用75 MHz运行的16-bit数据路径，或使用150、300或600 MHz运行的8-bit数据路径。300 MHz和600 MHz选项需要使用TXDataValid和RXDataValid信号来切换数据总线上的数据使用。


支持SATA模式下1.5 GT/s信号速率和3.0 GT/s信号速率的SATA PIPE实现，能够在1.5 GT/s和3.0 GT/s信号速率之间切换，可以以多种方式实现。一个方法是可以选择在1.5 GT/s信号速率下以150MHz固定的PCLK运行8-bit数据路径，在3.0 GT/s信号速率下运行16-bit数据路径。另一种方法选择是使用固定的数据路径宽度并改变PCLK频率来调整信号速率。在这种情况下，一个8-bit数据路径的实现可以为1.5 GT/s信号速率提供150 MHz的PCLK，为3.0 GT/s信号速率提供300 MHz的PCLK。类似地，一个16-bit数据路径的实现可以为1.5 GT/s信号速率提供75 MHz的PCLK，为3.0 GT/s模式提供150 MHz的PCLK。SATA的位宽和PCLK频率的示例列表显示在表3‑4中。一个符合PIPE规范的MAC或PHY只需要支持它所支持的每种SATA传输速率中的一个选项。

PCIe模式下的数据宽度与PCLK速率组合示例显示于表3‑1；只要符合PIPE定义，其他组合也是可行的，只要PCLK速率、数据宽度以及TXDataValid/RXDataValid的选通组合与串行链路的带宽匹配即可。符合PIPE标准的MAC或PHY只需支持其支持的每种PCIe传输速率中的一个选项。

**NOTE：**支持大于x4链路宽度的PHY必须提供32位或更小数据宽度的选项。


Table 3-1. PCIe Mode - Possible PCLK Rates and Data Width
| Mode      | PCLK     | Original PIPE Data Width (SerDes Data Width ) | TXDataValid and RXDataValid Strobe Rate |
| --------- | -------- | --------------------------------------------- | --------------------------------------- |
| 2.5 GT/s  | 4000 MHz | 8bits  (10 bits)                              | 1 in 16 PCLKS                           |
| 2.5 GT/s  | 4000 MHz | 8 bits (10 bits)                              | 1 in 16 PCLKs                           |
| 2.5 GT/s  | 2000 MHz | 8 bits (10 bits)                              | 1 in 8 PCLKs                            |
| 2.5 GT/s  | 1000 MHz | 8 bits (10 bits)                              | 1 in 4 PCLKs                            |
| 2.5 GT/s  | 500 MHz  | 8 bits (10 bits)                              | 1 in 2 PCLKs                            |
| 2.5 GT/s  | 250 MHz  | 8 bits (10 bits)                              | N/A                                     |
| 2.5 GT/s  | 2000 MHz | 16 bits (20 bits)                             | 1 in 16 PCLKs                           |
| 2.5 GT/s  | 500 MHz  | 16 bits (20 bits)                             | 1 in 4 PCLKs                            |
| 2.5 GT/s  | 250 MHz  | 16 bits (20 bits)                             | 1 in 2 PCLKs                            |
| 2.5 GT/s  | 125 MHz  | 16 bits (20 bits)                             | N/A                                     |
| 2.5 GT/s  | 250 MHz  | 32 bits (40 bits)                             | 1 in 4 PCLKs                            |
| 2.5 GT/s  | 62.5 MHz | 32 bits (40 bits)                             | N/A                                     |
| 2.5 GT/s  | 62.5 MHz | N/A (80 bits)                                 | 1 in 2 PCLKs                            |
| 5.0 GT/s  | 4000 MHz | 8 bits (10 bits)                              | 1 in 8 PCLKs                            |
| 5.0 GT/s  | 2000 MHz | 8 bits (10 bits)                              | 1 in 4 PCLKs                            |
| 5.0 GT/s  | 1000 MHz | 8 bits (10 bits)                              | 1 in 2 PCLKs                            |
| 5.0 GT/s  | 500 MHz  | 8 bits (10 bits)                              | N/A                                     |
| 5.0 GT/s  | 2000 MHz | 16 bits (20 bits)                             | 1 in 8 PCLKs                            |
| 5.0 GT/s  | 500 MHz  | 16 bits (20 bits)                             | 1 in 2 PCLKs                            |
| 5.0 GT/s  | 250 MHz  | 16 bits (20 bits)                             | N/A                                     |
| 5.0 GT/s  | 250 MHz  | 32 bits (40 bits)                             | 1 in 2 PCLKs                            |
| 5.0 GT/s  | 125 MHz  | 32 bits (40 bits)                             | N/A                                     |
| 5.0 GT/s  | 125 MHz  | N/A (80 bits)                                 | 1 in 2 PCLKs                            |
| 5.0 GT/s  | 62.5 MHz | N/A (80 bits)                                 | N/A                                     |
| 8.0 GT/s  | 4000 MHz | 8 bits (10 bits)                              | 1 in 4 PCLKs                            |
| 8.0 GT/s  | 2000 MHz | 8 bits (10 bits)                              | 1 in 2 PCLKs                            |
| 8.0 GT/s  | 2000 MHz | 32 bits (40 bits)                             | 1 in 8 PCLKs                            |
| 8.0 GT/s  | 1000 MHz | 8 bits (10 bits)                              | N/A                                     |
| 8.0 GT/s  | 1000 MHz | 16 bits (20 bits)                             | 1 in 2 PCLKs                            |
| 8.0 GT/s  | 1000 MHz | 32 bits (40 bits)                             | 1 in 4 PCLKs                            |
| 8.0 GT/s  | 500 MHz  | 16 bits (20 bits)                             | N/A                                     |
| 8.0 GT/s  | 500 MHz  | 32 bits (40 bits)                             | 1 in 2 PCLKs                            |
| 8.0 GT/s  | 250 MHz  | 32 bits (40 bits)                             | N/A                                     |
| 8.0 GT/s  | 250 MHz  | N/A (80 bits)                                 | 1 in 2 PCLKs                            |
| 8.0 GT/s  | 125 MHz  | N/A (80 bits)                                 | N/A                                     |
| 16.0 GT/s | 4000 MHz | 8 bits (10 bits)                              | 1 in 2 PCLKs                            |
| 16.0 GT/s | 2000 MHz | 8 bits (10 bits)                              | N/A                                     |
| 16.0 GT/s | 2000 MHz | 32 bits (40 bits)                             | 1 in 4 PCLKs                            |
| 16.0 GT/s | 1000 MHz | 16 bits (20 bits)                             | N/A                                     |
| 16.0 GT/s | 1000 MHz | 32 bits (40 bits)                             | 1 in 2 PCLKs                            |
| 16.0 GT/s | 500 MHz  | 32 bits (40 bits)                             | N/A                                     |
| 16.0 GT/s | 250 MHz  | N/A (80 bits)                                 | N/A                                     |
| 32 GT/s   | 4000 MHz | 8 bits (10 bits)                              | N/A                                     |
| 32 GT/s   | 2000 MHz | 16 bits (20 bits)                             | N/A                                     |
| 32 GT/s   | 2000 MHz | 32 bits (40 bits)                             | 1 in 2 PCLKs                            |
| 32 GT/s   | 1000 MHz | 32 bits (40 bits)                             | N/A                                     |
| 32 GT/s   | 500 MHz  | N/A (80 bits)                                 | N/A                                     |
| 64 GT/s   | 4000 MHz | N/A (20 bits)                                 | N/A                                     |
| 64 GT/s   | 2000 MHz | N/A (40 bits)                                 | N/A                                     |
| 64 GT/s   | 2000 MHz | N/A (80 bits)                                 | 1 in 2 PCLKs                            |
| 64 GT/s   | 1000 MHz | N/A (80 bits)                                 | N/A                                     |
| 128 GT/s  | 4000 MHz | N/A (40 bits)                                 | N/A                                     |
| 128 GT/s  | 2000 MHz | N/A (80 bits)                                 | N/A                                     |
| 128 GT/s  | 1000 MHz | N/A (160 bits)                                | N/A                                     |
   



Table 3-2. PCIe Mode (SerDes Only) - Possible RXCLK Rates and Data Widths

| Mode      | RXCLK     | Data Width |
| --------- | --------- | ---------- |
| 2.5 GT/s  | 250 MHz   | 10 bits    |
| 2.5 GT/s  | 125 MHz   | 20 bits    |
| 2.5 GT/s  | 62.5 MHz  | 40 bits    |
| 2.5 GT/s  | 31.25 MHz | 80 bits    |
| 5.0 GT/s  | 500 MHz   | 10 bits    |
| 5.0 GT/s  | 250 MHz   | 20 bits    |
| 5.0 GT/s  | 125 MHz   | 40 bits    |
| 5.0 GT/s  | 62.5 MHz  | 80 bits    |
| 8.0 GT/s  | 1000 MHz  | 10 bits    |
| 8.0 GT/s  | 500 MHz   | 20 bits    |
| 8.0 GT/s  | 250 MHz   | 40 bits    |
| 8.0 GT/s  | 125 MHz   | 80 bits    |
| 16.0 GT/s | 2000 MHz  | 10 bits    |
| 16.0 GT/s | 1000 MHz  | 20 bits    |
| 16.0 GT/s | 500 MHz   | 40 bits    |
| 16.0 GT/s | 250 MHz   | 80 bits    |
| 32 GT/s   | 4000 MHz  | 10 bits    |
| 32 GT/s   | 2000 MHz  | 20 bits    |
| 32 GT/s   | 1000 MHz  | 40 bits    |
| 32 GT/s   | 500 MHz   | 80 bits    |
| 64 GT/s   | 4000 MHz  | 20 bits    |
| 64 GT/s   | 2000 MHz  | 40 bits    |
| 64 GT/s   | 1000 MHz  | 80 bits    |
| 128 GT/s  | 4000 MHz  | 40 bits    |
| 128 GT/s  | 2000 MHz  | 80 bits    |
| 128 GT/s  | 1000 MHz  | 160 bits   |



Table 3-3. USB Mode – Possible PCLK or RXClk Rates and Data Widths

| Mode          | PCLK or RXClk | Original PIPE Data Width (SerDes Data Width) |
| ------------- | ------------- | -------------------------------------------- |
| 5.0 GT/s USB  | 125 MHz       | 32 bits (40 bits)                            |
| 5.0 GT/s USB  | 250 MHz       | 16 bits (20 bits)                            |
| 5.0 GT/s USB  | 500 MHz       | 8 bits (10 bits)                             |
| 10.0 GT/s USB | 312.5 MHz     | 32 bits (40 bits)                            |
| 10.0 GT/s USB | 625 MHz       | 16 bits (20 bits)                            |
| 10.0 GT/s USB | 1250 MHz      | 8 bits (10 bits)                             |





Table 3-4. SATA Mode – Possible PCLK Rates and Data Widths
| Mode          | PCLK     | Original PIPE Data Width (SerDes Data Width) | TXDataValid/RXDataValid Strobe Rate |
| ------------- | -------- | -------------------------------------------- | ----------------------------------- |
| 1.5 GT/s SATA | 600 MHz  | 8 bits (10 bits)                             | 1 in 4 PCLKs                        |
| 1.5 GT/s SATA | 300 MHz  | 8 bits (10 bits)                             | 1 in 2 PCLKs                        |
| 1.5 GT/s SATA | 150 MHz  | 8 bits (10 bits)                             | N/A                                 |
| 1.5 GT/s SATA | 75 MHz   | 16 bits (20 bits)                            | N/A                                 |
| 1.5 GT/s SATA | 37.5 MHz | 32 bits (40 bits)                            | N/A                                 |
| 3.0 GT/s SATA | 300 MHz  | 8 bits (10 bits)                             | N/A                                 |
| 3.0 GT/s SATA | 150 MHz  | 16 bits (20 bits)                            | N/A                                 |
| 3.0 GT/s SATA | 75 MHz   | 32 bits (40 bits)                            | N/A                                 |
| 3.0 GT/s SATA | 600 MHz  | 8 bits (10 bits)                             | 1 in 2 PCLKs                        |
| 6.0 GT/s SATA | 600 MHz  | 8 bits (10 bits)                             | N/A                                 |
| 6.0 GT/s SATA | 300 MHz  | 16 bits (20 bits)                            | N/A                                 |
| 6.0 GT/s SATA | 150 MHz  | 32 bits (40 bits)                            | N/A                                 |


**NOTE：** 在 SATA 模式下，如果 PHY 弹性缓冲区处于标称空闲模式，当 EB 为空且没有数据可用时，RXDataValid 也可能被使用

Table 3-5. SATA Mode (SerDes Only) – Possible RXCLK Rates and Data Widths
| Mode          | RXCLK    | Data Width |
| ------------- | -------- | ---------- |
| **1.5 GT/s SATA** | 150 MHz  | 10 bits    |
| **1.5 GT/s SATA** | 75 MHz   | 20 bits    |
| **1.5 GT/s SATA** | 37.5 MHz | 40 bits    |
| **3.0 GT/s SATA** | 300 MHz  | 10 bits    |
| **3.0 GT/s SATA** | 150 MHz  | 20 bits    |
| **3.0 GT/s SATA** | 75 MHz   | 40 bits    |
| **6.0 GT/s SATA** | 600 MHz  | 10 bits    |
| **6.0 GT/s SATA** | 300 MHz  | 20 bits    |
| **6.0 GT/s SATA** | 150 MHz  | 40 bits    |


表3‑6显示了DisplayPort实现的可能PCLK和数据宽度选项。

Table 3-6. DPTX and DPRX Mode – Possible PCLK or RXCLK Rates and Data Widths

| Mode | PCLK / RXCLK (MHz) | Data Width |
|------|-------------------|------------|
| **1.62 Gbps DisplayPort** | 162 | 10 bits |
| | 81 | 20 bits |
| | 40.5 | 40 bits |
| **2.16 Gbps DisplayPort (eDP)** | 216 | 10 bits |
| | 108 | 20 bits |
| | 54 | 40 bits |
| **2.43 Gbps DisplayPort (eDP)** | 243 | 10 bits |
| | 121.5 | 20 bits |
| | 60.75 | 40 bits |
| **2.7 Gbps DisplayPort** | 270 | 10 bits |
| | 135 | 20 bits |
| | 67.5 | 40 bits |
| **3.24 Gbps DisplayPort (eDP)** | 324 | 10 bits |
| | 162 | 20 bits |
| | 81 | 40 bits |
| **4.32 Gbps DisplayPort (eDP)** | 432 | 10 bits |
| | 216 | 20 bits |
| | 108 | 40 bits |
| **5.4 Gbps DisplayPort** | 540 | 10 bits |
| | 270 | 20 bits |
| | 135 | 40 bits |
| **8.1 Gbps DisplayPort** | 810 | 10 bits |
| | 405 | 20 bits |
| | 202.5 | 40 bits |
| **10 Gbps DisplayPort** | 312.5 | 40 bits¹ |
| **13.5 Gbps DisplayPort** | 421.875 | 40 bits² |
| **20 Gbps DisplayPort** | 625 | 40 bits² |

---


1. 40位数据宽度是为了与其他协议保持一致。对于块编码的DisplayPort模式（即10 Gbps、13.5 Gbps和20 Gbps），控制器仅使用每10位数据中的8位。更多详情请参见6.1.1节


Table 3-7. USB4 Mode – Possible PCLK or RXCLK Rates and Data Widths

| Mode | PCLK / RXCLK | Data Width |
|------|--------------|------------|
| **10 GT/s USB4** | 1.25 GHz | 10 bits |
| | 625 MHz | 20 bits |
| | 312.5 MHz | 40 bits |
| **20 GT/s USB4** | 2.5 GHz | 10 bits |
| | 1.25 GHz | 20 bits |
| | 625 MHz | 40 bits |
| **40 GT/s (25.6 GT/s PAM3)** | 914 MHz | 56 bits |
| **10.3125 GT/s USB4 (Thunderbolt™ 2)** | 1.2890625 GHz | 10 bits |
| | 644.53125 MHz | 20 bits |
| | 322.265625 MHz | 40 bits |
| **20.625 GT/s USB4 (Thunderbolt™ 2)** | 2.578125 GHz | 10 bits |
| | 1.2890625 GHz | 20 bits |
| | 644.53125 MHz | 40 bits |

---
1. 为了与其他协议保持一致，数据宽度为10、20或40比特，但USB4仅利用每10比特中的8比特进行数据传输，因为它使用块编码。更多详情请参见6.1.1节

**NOTE：** 当实现TXDataValid信号的MAC正在使用不使用TXDataValid的模式时，MAC应保持TXDataValid信号为高电平。当实现RXDataValid的PHY处于不使用RXDataValid的模式时，PHY必须保持
RXDataValid信号为高电平。
可能存在支持这些配置倍数的PIPE实现。支持相同速率下多个配置的PHY实现必须支持宽度和PCLK速率控制信号。在PCIe模式或SATA模式或USB模式下支持多种速率的PHY必须支持在所有支持的速率下以PCLK速率固定的配置。在PCIe模式或SATA模式下支持多种速率的PHY必须支持在所有支持的速率下以固定数据路径宽度配置。
