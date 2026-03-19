# 物理层接口（PHY Interface）

# 适用于

# PCI Express、SATA、USB 3.1、

# DisplayPort 与 Converged IO

# 架构

版本 5.1

©2007 - 2018 Intel Corporation—All rights reserved.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 知识产权免责声明

THIS SPECIFICATION IS PROVIDED “AS IS” WITH NO WARRANTIESWHATSOEVER INCLUDING ANY WARRANTY OF MERCHANTABILITY, FITNESSFOR ANY PARTICULAR PURPOSE, OR ANY WARRANTY OTHERWISE ARISINGOUT OF ANY PROPOSAL, SPECIFICATION, OR SAMPLE.

A COPYRIGHT LICENSE IS HEREBY GRANTED TO REPRODUCE ANDDISTRIBUTE THIS SPECIFICATION FOR INTERNAL USE ONLY. NO OTHERLICENSE, EXPRESS OR IMPLIED, BY ESTOPPEL OR OTHERWISE, TO ANYOTHER INTELLECTUAL PROPERTY RIGHTS IS GRANTED OR INTENDEDHEREBY.

INTEL CORPORATION AND THE AUTHORS OF THIS SPECIFICATION DISCLAIMALL LIABILITY, INCLUDING LIABILITY FOR INFRINGEMENT OFPROPRIETARY RIGHTS, RELATING TO IMPLEMENTATION OF INFORMATIONIN THIS DOCUMENT AND THE SPECIFICATION. INTEL CORPORATION ANDTHE AUTHORS OF THIS SPECIFICATION ALSO DO NOT WARRANT ORREPRESENT THAT SUCH IMPLEMENTATION(S) WILL NOT INFRINGE SUCHRIGHTS.

ALL SUGGESTIONS OR FEEDBACK RELATED TO THIS SPECIFICATIONBECOME THE PROPERTY OF INTEL CORPORATION UPON SUBMISSION.

INTEL CORPORATION MAY MAKE CHANGES TO SPECIFICATIONS, PRODUCTDESCRIPTIONS, AND PLANS AT ANY TIME, WITHOUT NOTICE.

Notice: Implementations developed using the information provided in this specification mayinfringe the patent rights of various parties including the parties involved in the development ofthis specification. No license, express or implied, by estoppel or otherwise, to any intellectualproperty rights (including without limitation rights under any party’s patents) are granted herein.

All product names are trademarks, registered trademarks, or service marks of their respectiveowners

# 贡献者

Jeff Morris

Andy Martwick

Brad Hosler

Matthew Myers

Bob Dunstan

Saleem Mohammad

Sue Vining

Tadashi Iwasaki

Yoichi Iizuka

Rahman Ismail

Ben Graniello

Jim Choate

Paul Mattos

Dan Froelich

Duane Quiet

Hajime Nozaki

Peter Teng

Karthi Vadivelu

Mineru Nishizawa

Takanori Saeki

Andrew Lillie

Frank Kavanagh

Michelle Jen

Bruce Tennant

Quinn Devine

Su Wei Lim

Hooi Kar Loo

Poh Thiam Teoh

Sathyanarayanan Gopal

Siang Lin Tan

Jake Li

Zeeshan Sarwar

Minxi Gao

Kaleb Ruof

John Watkins

Jamie Johnston

Todd Witter

Andrea Uguagliati

Efraim Kugman

Daniel Resnick

Tina Tahmoureszadeh

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Dedicated to the memory of Brad Hosler, the impactof whose accomplishments made the Universal SerialBus one of the most successful technologyinnovations of the Personal Computer era.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 目录

1 前言.. 10

1.1 Scope of this Revision . . 10

1.2 Revision History .. . 10

2 简介 .. . 13

2.1 PCI Express PHY Layer .. . 16

2.2 USB PHY Layer . . 17

2.3 Converged IO PHY Layer ... 17

2.4 SATA PHY Layer.. . 17

2.5 Low Pin Count Interface and SerDes Architecture. 18

3 PHY/MAC 接口 .. 19

4 PCI Express、USB 与 Converged IO 的 PHY 功能 .. . 28

4.1 Original PIPE Architecture . . 28

4.1.1 Transmitter Block Diagram (2.5 and 5.0 GT/s).. . 28

4.1.2 Transmitter Block Diagram (8.0/10/16 GT/s/32 GT/s) ... . 29

4.1.3 Receiver Block Diagram (2.5 and 5.0 GT/s) ... 29

4.1.4 Receiver Block Diagram (8.0/10.0/16/32 GT/s).... . 30

4.1.5 Clocking...... 32

4.2 SerDes Architecture.. . 32

4.2.1 SerDes Architecture: Transmitter Block Diagram. 32

4.2.2 SerDes Architecture: Receiver Block Diagram. . 33

5 SATA PHY 功能... 34

5.1 Transmitter Block Diagram (1.5, 3.0, and 6.0 GT/s) ... 35

5.2 Receiver Block Diagram (1.5, 3.0 and 6.0 GT/s) .... . 36

5.3 Clocking..... 36

6 PIPE 接口信号说明 .... 37

6.1 PHY/MAC Interface Signals – Common for SerDes and Original PIPE . . 37

6.1.1 Data Interface . 37

6.1.2 Command Interface .. . 40

6.1.3 Status Interface . . 57

6.1.4 Message Bus Interface..... . 64

6.1.4.1 Message Bus Interface Commands . . 64

6.1.4.2 Message Bus Interface Framing .... . 67

6.2 PHY/MAC Interface Signals – SerDes Architecture Only ... . 68

6.2.1 Data Interface ... 68

6.2.2 Command Interface .. . 68

6.3 PHY/MAC 接口 Signals – Original PIPE Only ...... 69

6.3.1 Data Interface . 69

6.3.2 Command Interface .. . 72

6.4 External Signals – Common for SerDes and Original PIPE . 77

7 PIPE 消息总线地址空间 ..... 80

7.1 PHY Registers.. . 82

7.1.1 Address 0h: RX Margin Control0.. 83

7.1.2 Address 1h: RX Margin Control1. 83

7.1.3 Address 2h: Elastic Buffer Control. 83

7.1.4 Address 3h: PHY RX Control0 . . 84

7.1.5 Address 4h: PHY RX Control1 . . 85

7.1.6 Address 5h: PHY RX Control2 . . 85

7.1.7 Address 6h: PHY RX Control3 . . 85

7.1.8 Address 7h: Elastic Buffer Location Update Frequency . . 86

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

7.1.9 Address 8h: PHY RX Control4 . . 86

7.1.10 Address 400h: PHY TX Control0.. . 87

7.1.11 Address 401h: PHY TX Control1.. . 87

7.1.12 Address 402h: PHY TX Control2.. . 88

7.1.13 Address 403h: PHY TX Control3.. 89

7.1.14 Address 404h: PHY TX Control4.. 89

7.1.15 Address 405h: PHY TX Control5.. 89

7.1.16 Address 406h: PHY TX Control6.. . 90

7.1.17 Address 407h: PHY TX Control7.. . 91

7.1.18 Address 408h: PHY TX Control8.. . 91

7.1.19 Address 409h: PHY TX Control9.. . 92

7.1.20 Address 800h: PHY Common Control0. . 92

7.2 MAC Registers.. . 93

7.2.1 Address 0h: RX Margin Status0.. . 94

7.2.2 Address 1h: RX Margin Status1. . 95

7.2.3 Address 2h: RX Margin Status2. . 95

7.2.4 Address 3h: Elastic Buffer Status . . 96

7.2.5 Address 4h: Elastic Buffer Location.. . 96

7.2.6 Address 5h: Reserved . . 96

7.2.7 Address 6h: RX Status0.. . 96

7.2.8 Address 7h: RX Status1. . 97

7.2.9 Address 8h: RX Status2. . 97

7.2.10 Address 9h: RX Status3. . 97

7.2.11 Address Ah: RX Link Evaluation Status0 . . 97

7.2.12 Address Bh: RX Link Evaluation Status1 . . 98

7.2.13 Address Ch: RX Status4 . . 99

7.2.14 Address Dh: RX Status5. . 99

7.2.15 Address 400h: TX Status0. . 99

7.2.16 Address 401h: TX Status1. 100

7.2.17 Address 402h: TX Status2. 100

7.2.18 Address 403h: TX Status3. 100

7.2.19 Address 404h: TX Status4. 100

7.2.20 Address 405h: TX Status5. 101

7.2.21 Address 406h: TX Status6. 101

8 PIPE 操作行为 .. .. 101

8.1 Clocking.... 101

8.1.1 Clocking Topologies..... 102

8.2 Reset... . 104

8.3 Power Management – PCI Express Mode . 105

8.4 Power Management – USB Mode . 107

8.5 Power Management – SATA Mode.. 109

8.6 Changing Signaling Rate, PCLK Rate, or Data Bus Width.. 110

8.6.1 PCI Express Mode . . 110

8.6.2 USB Mode . 111

8.6.3 SATA Mode . 111

8.6.4 Fixed data path implementations .. . 112

8.6.5 Fixed PCLK implementations . 113

8.7 Transmitter Margining – PCI Express Mode and USB Mode . 113

8.8 Selectable De-emphasis – PCI Express Mode . 114

8.9 Receiver Detection – PCI Express Mode and USB Mode. 114

8.10 Transmitting a beacon – PCI Express Mode . 115

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

8.11 Transmitting LFPS – USB Mode . 115

8.12 Detecting a beacon – PCI Express Mode . 116

8.13 Detecting Low Frequency Periodic Signaling – USB Mode..... . 116

8.14 Clock Tolerance Compensation . 117

8.15 Error Detection... 119

8.15.1 8B/10B Decode Errors. . 120

8.15.2 Disparity Errors .. . 120

8.15.3 Elastic Buffer Errors .. 121

8.15.3.1 Elastic Buffer Reset. 122

8.16 Loopback.. 122

8.17 Polarity Inversion – PCI Express and USBModes. 124

8.18 Setting negative disparity (PCI Express Mode) .. 124

8.19 Electrical Idle – PCI Express Mode . 125

8.20 Link Equalization Evaluation. 126

8.21 Implementation specific timing and selectable parameter support . 128

8.22 Control Signal Decode table – PCI Express Mode 137

8.23 Control Signal Decode table – USB Mode and Converged IO Mode.. 139

8.24 Control Signal Decode table – SATA Mode. 139

8.25 Required synchronous signal timings. . 140

8.26 128b/130b Encoding and Block Synchronization (PCI Express 8 GT/s, 16 GT/s, and32 GT/s)140

8.27 128b/132b Encoding and Block Synchronization (USB 10 GT/s).. . 142

8.28 Message Bus Interface . . 142

8.28.1 General Operational Rules. . 142

8.28.2 Message Bus Operations vs Dedicated Signals . 143

8.29 PCI Express Lane Margining at the Receiver ... 143Sample Operational Sequences .. 147

9.1 Active PM L0 to L0s and back to L0 – PCI Express Mode.... . 147

9.2 Active PM to L1 and back to L0 - – PCI Express Mode . 148

9.3 Downstream Initiated L1 Substate Entry Using Sideband Mechanism 150

9.4 Receivers and Electrical Idle – PCI Express Mode Example .... . 150

9.5 Using CLKREQ# with PIPE – PCI Express Mode... . 151

9.6 Block Alignment. 152

9.7 Message Bus: RX Margining Sequence.. 153

9.8 Message Bus: Updating LocalFS/LocalLF and LocalG4FS/LocalG4LF . 153

9.9 Message Bus: Updating TxDeemph . 154

9.10 Message Bus: Equalization ...... 155

9.11 Message Bus: BlockAlignControl.. 156

9.12 Message Bus: ElasticBufferLocation Update..... 157

10 多通道 PIPE —— PCI Express 模式... . 158

11 附录 ... . 160

11.1 DisplayPort AUX Signals .. 160

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 插图目录

Figure 2-1: Partitioning PHY Layer for PCI Express.. . 14

Figure 2-2 Partitioning PHY Layer for USB. 15

Figure 2-3. Partitioning PHY Layer for Converged IO.. .... 16

Figure 3-1. PHY/MAC Interface.. 19

Figure 3-2. DPTX PHY/MAC Interface . 20

Figure 3-3. DPRX PHY/MAC Interface . . 20

Figure 4-1: PHY Functional Block Diagram....... 28

Figure 4-2: Transmitter Block Diagram .. 29

Figure 4-3: Transmitter Block Diagram (8.0/10/16 GT/s) ......... 29

Figure 4-4: Receiver Block Diagram ...... . 30

Figure 4-5: Receiver Block Diagram (8.0/10/16 GT/s)......... 32

Figure 4-6: Clocking Block Diagram ....... 32

Figure 4-7. SerDes Architecture: PHY Transmitter Block Diagram... 33

Figure 4-8. SerDes Architecture: PHY Receiver Block Diagram ..... . 34

Figure 5-1: PHY Functional Block Diagram. 35

Figure 5-2: Transmitter Block Diagram (1.5, 3.0, and 6.0 GT/s)..... 35

Figure 5-3: Receiver Block Diagram (1.5, 3.0 and 6.0 GT/s) ...... . 36

Figure 5-4: Clocking Block Diagram ... 37

Figure 6-1. Command Only Message Bus Transaction Timing (NOP, write_ack)... . 66

Figure 6-2. Command+Address Message Bus Transaction Timing (Read).... ... 66

Figure 6-3. Command+Data Message Bus Transaction Timing (Read completion) .. . 67

Figure 6-4. Command+Address+Data Message Bus Transaction Timing (Write_uncommitted,Write_committed) . 67

Figure 6-5. Message Bus Transaction Framing..... . 68

Figure 7-1. Message Bus Address Space ....... .. 81

Figure 8-1. PCLK as PHY output.. . 102

Figure 8-2. PCLK as PHY Input w/PHY owned PLL. . 103

Figure 8-3. PCLK as PHY Input w/External PLL and PHY PLL. . 103

Figure 8-4. PCLK as PHY Input with External PLL. .. 104

Figure 8-5. Reset# Deassertion and PhyStatus for PCLK as PHY Output........... .... 104

Figure 8-6 PCI Express P2 Entry and Exit with PCLK as PHY Output .. .. 106

Figure 8-7 PCI Express P2 Entry and Exit with PCLK as PHY Input .. .. 107

Figure 8-8. L1 SubState Entry and Exit with PCLK as PHY Output.. .. 107

Figure 8-9. USB U1 Exit ... . 109

Figure 8-10 Change from PCI Express $2 . 5 \ : \mathrm { G t } / \mathrm { s }$ to $5 . 0 \mathrm { G t } / \mathrm { s }$ with PCLK as PHY Input. ............. 113

Figure 8-11 – PCI Express 3.0 TxDataValid Timings for Electrical Idle Exit and Entry. .......... 126

Figure 8-12. Data Throttling and TxElecIdle ... . 126

Figure 8-13 – PCI Express 8GT/s or higher Successful Equalization Evaluation Request......... 127

Figure 8-14 – PCI Express 3.0 Equalization Evaluation Request Resulting in Invalid Feedback127

Figure 8-15 – PCI Express 8 GT/s or higher TxDataValid Timing for 8 Bit Wide TxDataInterface . 141

Figure 8-16 – PCI Express 8 GT/s or higher TxDataValid Timing for 16 Bit Wide TxDataInterface . 141

Figure 8-17 – PCI Express 8 GT/s or higher RxDataValid Timing for 16 Bit Wide RxDataInterface . 141

Figure 9-1. L1 Substate Management using RxEIDetectDisable and TxCommonModeDisable 150

Figure 9-2. BlockAlignControl Example Timing.. .. 152

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Figure 9-3. Sample RX Margining Sequence.. . 153

Figure 9-4. LocalFS/LocalLF/LocalG4FS/LocalG4LF Updates Out of Reset and After RateChange ... . 154

Figure 9-5. LocalFS/LocalLF Update Due to GetLocalPresetCoefficients.. . 154

Figure 9-6. Updating TxDeemph after GetLocalPresetCoefficients Request ....... .. 155

Figure 9-7. Successful Equalization. . 155

Figure 9-8. Equalization with Invalid Request. . 155

Figure 9-9. Aborted Equalization, Scenario #1 . 156

Figure 9-10. Aborted Equalization, Scenario #2 . 156

Figure 9-11 Message Bus: BlockAlignControl Example . . 156

Figure 9-12. Message Bus: Updating ElasticBufferLocation. . 157

# 表格目录

dTable 2-1. PHY Requirements for Legacy Pin Interface vs Low Pin Count Interface and OriginalPIPE vs SerDes Architecture Support.. 19

Table 3-1. PCI Express Mode - Possible PCLK rates and data widths 22

Table 3-2. PCI Express Mode (SerDes only) -- Possible RxCLK Rates and Data Widths ........... 24

Table 3-3. USB Mode – Possible PCLK or RxClk rates and data widths. . 24

Table 3-4. SATA Mode – Possible PCLK rates and data widths. . 25

Table 3-5. SATA Mode (SerDes only) – Possible RxCLK Rates and Data Widths . . 25

Table 3-6 DPTX and DPRX Mode – Possible PCLK or RxCLK Rates and Data Widths ........... 26

Table 3-7. Converged IO Mode – Possible PCLK or RxCLK Rates and Data Widths.. . 27

Table 6-1. Transmit Data Interface Input Signals . 37

Table 6-2. Transmit Data Interface Output Signals.. 39

Table 6-3. Receive Data Interface Input Signals. 39

Table 6-4. Receive Data Interface Output Signals 39

Table 6-5. Command Interface Input Signals.. . 40

Table 6-6. Command Interface Output Signals. 55

Table 6-7. Status Interface Input Signals.... . 57

Table 6-8. Status Interface Output Signals... . 58

Table 6-9 Message Bus Interface Signals . . 64

Table 6-10 Message Bus Commands . 65

Table 6-11. SerDes Only: Receive Data Interface Output Signals. 68

Table 6-12. SerDes Only: Command Interface Input Signals .... . 68

Table 6-13. Original PIPE Only: Transmit Data Interface Input Signals..... 69

Table 6-14. Original PIPE Only: Receive Data Interface Output Signals....... ... 70

Table 6-15. Command Interface Input Signals.... 72

Table 6-16. Original PIPE Only: Command Interface Output Signals . 73

Table 6-17. Original PIPE only: Status Interface Output Signals ..... 75

Table 6-18. External Input Signals...... 77

Table 6-19. External Output Signals .... 78

Table 7-1 PHY Registers.. 82

Table 7-2 MAC Registers.. . 94

Table 8-1. PclkChangeOK/PclkChangeAck Requirements . . 110

Table 8-2 Parameters Advertised in PHY Datasheet. . 128

Table 8-3. Posted-to-Posted Writes. . 143

Table 8-4. Defined Register Groups.. . 143

Table 8-5. Lane Margining at the Receiver Sequences. .. 143

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Table 11-1. DisplayPort AUX Signals . 160

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

