# PHY Interface

# For the

# PCI Express, SATA, USB 3.1,

# DisplayPort, and Converged IO

# Architectures

Version 5.1

©2007 - 2018 Intel Corporation—All rights reserved.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# Intellectual Property Disclaimer

THIS SPECIFICATION IS PROVIDED “AS IS” WITH NO WARRANTIESWHATSOEVER INCLUDING ANY WARRANTY OF MERCHANTABILITY, FITNESSFOR ANY PARTICULAR PURPOSE, OR ANY WARRANTY OTHERWISE ARISINGOUT OF ANY PROPOSAL, SPECIFICATION, OR SAMPLE.

A COPYRIGHT LICENSE IS HEREBY GRANTED TO REPRODUCE ANDDISTRIBUTE THIS SPECIFICATION FOR INTERNAL USE ONLY. NO OTHERLICENSE, EXPRESS OR IMPLIED, BY ESTOPPEL OR OTHERWISE, TO ANYOTHER INTELLECTUAL PROPERTY RIGHTS IS GRANTED OR INTENDEDHEREBY.

INTEL CORPORATION AND THE AUTHORS OF THIS SPECIFICATION DISCLAIMALL LIABILITY, INCLUDING LIABILITY FOR INFRINGEMENT OFPROPRIETARY RIGHTS, RELATING TO IMPLEMENTATION OF INFORMATIONIN THIS DOCUMENT AND THE SPECIFICATION. INTEL CORPORATION ANDTHE AUTHORS OF THIS SPECIFICATION ALSO DO NOT WARRANT ORREPRESENT THAT SUCH IMPLEMENTATION(S) WILL NOT INFRINGE SUCHRIGHTS.

ALL SUGGESTIONS OR FEEDBACK RELATED TO THIS SPECIFICATIONBECOME THE PROPERTY OF INTEL CORPORATION UPON SUBMISSION.

INTEL CORPORATION MAY MAKE CHANGES TO SPECIFICATIONS, PRODUCTDESCRIPTIONS, AND PLANS AT ANY TIME, WITHOUT NOTICE.

Notice: Implementations developed using the information provided in this specification mayinfringe the patent rights of various parties including the parties involved in the development ofthis specification. No license, express or implied, by estoppel or otherwise, to any intellectualproperty rights (including without limitation rights under any party’s patents) are granted herein.

All product names are trademarks, registered trademarks, or service marks of their respectiveowners

# Contributors

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

# Table of Contents

1 Preface.. 10

1.1 Scope of this Revision . . 10

1.2 Revision History .. . 10

2 Introduction .. . 13

2.1 PCI Express PHY Layer .. . 16

2.2 USB PHY Layer . . 17

2.3 Converged IO PHY Layer ... 17

2.4 SATA PHY Layer.. . 17

2.5 Low Pin Count Interface and SerDes Architecture. 18

3 PHY/MAC Interface .. 19

4 PCI Express, USB, and Converged IO PHY Functionality .. . 28

4.1 Original PIPE Architecture . . 28

4.1.1 Transmitter Block Diagram (2.5 and 5.0 GT/s).. . 28

4.1.2 Transmitter Block Diagram (8.0/10/16 GT/s/32 GT/s) ... . 29

4.1.3 Receiver Block Diagram (2.5 and 5.0 GT/s) ... 29

4.1.4 Receiver Block Diagram (8.0/10.0/16/32 GT/s).... . 30

4.1.5 Clocking...... 32

4.2 SerDes Architecture.. . 32

4.2.1 SerDes Architecture: Transmitter Block Diagram. 32

4.2.2 SerDes Architecture: Receiver Block Diagram. . 33

5 SATA PHY Functionality... 34

5.1 Transmitter Block Diagram (1.5, 3.0, and 6.0 GT/s) ... 35

5.2 Receiver Block Diagram (1.5, 3.0 and 6.0 GT/s) .... . 36

5.3 Clocking..... 36

6 PIPE Interface Signal Descriptions .... 37

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

6.3 PHY/MAC Interface Signals – Original PIPE Only ...... 69

6.3.1 Data Interface . 69

6.3.2 Command Interface .. . 72

6.4 External Signals – Common for SerDes and Original PIPE . 77

7 PIPE Message Bus Address Spaces ..... 80

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

8 PIPE Operational Behavior .. .. 101

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

10 Multi-lane PIPE – PCI Express Mode... . 158

11 Appendix ... . 160

11.1 DisplayPort AUX Signals .. 160

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# Table of Figures

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

# Table of Tables

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

# 1 Preface

# 1.1 Scope of this Revision

The PCI Express, SATA, USB, DisplayPort, and Converged IO PHY Interface Specification hasdefinitions of all functional blocks and signals. This revision includes support for PCI Expressimplementations conforming to the PCI Express Base Specification, Revision 4.0, SATAimplementations conforming to the SATA specification, revision 3.0, USB implementationsconforming to the Universal Serial Bus Specification, Revision 3.1, DisplayPort implementationsconforming to the DisplayPort 1.4 Specification, and Converged IO implementations conformingto the Converged IO Base Specification, Revision 1.0

# 1.2 Revision History

<table><tr><td>Revision Number</td><td>Date</td><td>Description</td></tr><tr><td>0.1</td><td>7/31/02</td><td>Initial Draft</td></tr><tr><td>0.5</td><td>8/16/02</td><td>Draft for industry review</td></tr><tr><td>0.6</td><td>10/4/02</td><td>Provides operational detail</td></tr><tr><td>0.7</td><td>11/4/02</td><td>Includes timing diagrams</td></tr><tr><td>0.8</td><td>11/22/02</td><td>More operational detail. Receiver detection sequence changed.</td></tr><tr><td>0.9</td><td>12/16/02</td><td>Minor updates. Solid enough for implementations to be finalized.</td></tr><tr><td>0.95</td><td>4/25/03</td><td>Updates to reflect 1.0a Base Spec. Added multilane suggestions.</td></tr><tr><td>1.00</td><td>6/19/03</td><td>Stable revision for implementation.</td></tr><tr><td>1.70</td><td>11/6/05</td><td>First pass at Gen. 2 PIPE</td></tr><tr><td>1.81</td><td>12/4/2005</td><td>Fixed up areas based on feedback.</td></tr><tr><td>1.86</td><td>2/27/2006</td><td>Fixed up more areas based on feedback. Added a section on how to handle CLKREQ#.</td></tr><tr><td>1.87</td><td>9/28/2006</td><td>Removed references to Compliance Rate determination. Added sections for TX Margining and Selectable De-emphasis. Fixed up areas (6.4) based on feedback.</td></tr><tr><td>1.90</td><td>3/24/2007</td><td>Minor updates, mostly editorial.</td></tr><tr><td>2.00</td><td>7/21/2007</td><td>Minor updates, stable revision for implementation.</td></tr><tr><td>2.7</td><td>12/31/2007</td><td>Initial draft of updates to support the USB specification, revision 3.0.</td></tr><tr><td>2.71</td><td>1/21/2008</td><td>Updates for SKP handling and USB SuperSpeed PHY power management.</td></tr><tr><td>2.75</td><td>2/8/08</td><td>Additional updates for SKP handling.</td></tr><tr><td>2.90</td><td>8/11/08</td><td>Added 32 bit data interface support for USB SuperSpeed mode, support for USB SuperSpeed mode receiver equalization training, and support for USB SuperSpeed mode compliance patterns that are not 8b/10b encoded.Solid enough for implementation architectures to be finalized.</td></tr><tr><td>3.0</td><td>3/11/09</td><td>Final update</td></tr><tr><td>4.0</td><td>4/5/11</td><td>Draft 1 update adding SATA.</td></tr><tr><td>4.0</td><td>4/13/11</td><td>Draft 3 update adding PCI Express 3.0 rev .9.</td></tr><tr><td>4.0</td><td>9/1/11</td><td>Draft 6 update adding updates based on PCI Express 3.0 rev .9 feedback.</td></tr><tr><td>4.1</td><td>12/7/11</td><td>Initial draft with per lane clocking option</td></tr><tr><td>4.1</td><td>12/12/11</td><td>Draft 2. Updates for initial review feedback and addition of several example timing diagrams for PCI Express 3.0 related signals.</td></tr><tr><td>4.1</td><td>5/21/12</td><td>Updated for Draft 2 feedback from various reviewers.</td></tr><tr><td>4.2</td><td>7/1/13</td><td>Added support for USB 3.1 – preliminary review release based on</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td>USB 3.1 specification revision .9</td></tr><tr><td>4.3</td><td>1/31/14</td><td>Added support for PTM (preliminary for review), L1 Substates (preliminary for review), and PCI Express 4.0 (preliminary rev .3).</td></tr><tr><td>4.4</td><td>11/28/16</td><td>Added support for PCIe RX margin and elastic buffer depth control over a message bus interface. Support for PCIe Nominal Empty elastic buffer mode. Gen4 updates: LocalLF/FS, LF/FS, Rate, PCLK rates. SRIS support. RXStandby for USB. L1 substate clarifications. General cleanup.</td></tr><tr><td>4.4.1</td><td>1/12/17</td><td>Removed &quot;PCLK as an input&quot; requirement for message bus. Added wording to allow PHY to choose whether to support L1 substate management via PowerDown[3:0] exclusively or via RxEIDetectDisable and TxCommonModeDisable.</td></tr><tr><td>5.0</td><td>11/2/17</td><td>Clarified that margin NAK is only required for unsupported voltage margin offset requests that are within PHY advertised range. Added support for 64-bit data width for PCIe SerDes only. Mapped all eligible legacy PIPE signals into message bus registers. Added support for a SerDes architecture. Added requirements for support of low pin count vs legacy PIPE interface and SerDes vs original PIPE architecture. Added support for Converged IO and DisplayPort. Recommendation that USB Nominal Empty Operation should use RxDataValid. Added EB Error recovery mechanism controlled via a register bit. Added RefClkRequired signal to indicate when the reference clock can be safely removed. Reformatted signal tables into separate input and output tables and added a new column indicating relevant protocols. General cleanup and clarifications.</td></tr><tr><td>5.1</td><td>3/14/18</td><td>PCIe 5.0 formal rate definitions. General typo corrections and clarifications. Added back in external signals table that was inadvertently dropped in the 5.0 rev. ElasticBufferLocationUpdateFrequency moved to the PHY address space with min/max values to be specified in PHY datasheet. Clarified that RefClkRequired# is optional for the PHY. Updated TxDataValid description to reference usage in original PIPE architecture for USB due to block encoding. Clarified that PHYs must specify their own timing requirements for RxStandby. Added PHY parameters to specify whether PclkChangeOk/PclkChangeAck handshake is required for rate+width changes and for all rate changes. Clarified states for L1 substates in the PowerDown description and RxEIDetectDisable description. Allow receiver detection in P2 for PCIe. Add USB clarification for timing around LFPS, RxElecIdle and exit from P1 to P0. Added table of USB PowerDown state characteristics. Updated RxStatus description to reflect that &#x27;111b value indicates corrected SKP for USB. PclkChangeOk/PclkChangeAck handshake is required for all rate changes (not just those impacting PCLK). Add clarification on priority of LFPS transmission vs SuperSpeed data for USB. RxEIDetectDisable can be used to disable LFPS circuit for power savings. Moved GetLocalPresetCoefficients from bit 5 to bit 7 of the PHY TX Control5 register to allow growth of the LocalPresetIndex field. Deprecate TxElecIdle+TxCompliance method of turning off a lane. Updated PHY parameters table for USB 3.2 for Tx EQ. Disallow LFPS transmission in P2 and P3 for USB. Added eDP rates. Moved TX Control9 register contents to RX Control4 register. Moved RX Status0-3 register contents to TX Status3-6 registers. Updated LocalPresetIndex valid range for LocalG5LF register field. Updated various entries in &quot;Lane Marginating at Receiver Sequences&quot; table. Added PHY parameter AsynchReceiverDetectSupport to advertise whether the PHY support asynchronous receiver detection in PCIe P2 state. Updated message bus rules, including restrictions on posted-to-posted writes and defined register groups. Add PHY parameter to advertise the time to transition to a valid Electrical Idle after sending EIOS. Updated Converged IO interface to 40-bits. Added rate/width table for Converged IO. Add PHY parameters for datapath and control path support options. Disallow LFPS signaling in P2&amp;P3 for USB. RXTermination assertion during Reset for USB</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td>is changed to be implementation specific. Added sample clocking topologies compatible with PIPE.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 2 Introduction

The PHY Interface for the PCI Express, SATA, USB, DisplayPort and Converged IOArchitectures (PIPE) is intended to enable the development of functionally equivalent PCIExpress, SATA, USB, DisplayPort, and Converged IO PHY's. Such PHY's can be delivered asdiscrete IC's or as macrocells for inclusion in ASIC designs. The specification defines a set ofPHY functions which must be incorporated in a PIPE compliant PHY, and it defines a standardinterface between such a PHY and a Media Access Layer (MAC) & Link Layer ASIC. It is notthe intent of this specification to define the internal architecture or design of a compliant PHYchip or macrocell. The PIPE specification is defined to allow various approaches to be used.Where possible the PIPE specification references the PCI Express base specification, SATA 3.0Specification, USB 3.1 Specification, DisplayPort 1.4 specification or Converged IO 1.0specification rather than repeating its content. In case of conflicts, the PCI-Express BaseSpecification, SATA 3.0 specification, USB 3.1 Specification, DisplayPort 1.3 specification, andConverge IO 1.0 specification shall supersede the PIPE spec.

This spec provides some information about how the MAC could use the PIPE interface forvarious LTSSM states, Link states and other protocols. This information should be viewed as‘guidelines for’ or as ‘one way to implement’ base specification requirements. MACimplementations are free to do things in other ways as long as they meet the correspondingspecification requirements.

One of the intents of the PIPE specification is to accelerate PCI Express endpoint, SATA device,USB device, and Converged IO device development. This document defines an interface to whichASIC and endpoint device vendors can develop. Peripheral and IP vendors will be able to developand validate their designs, insulated from the high-speed and analog circuitry issues associatedwith the PCI Express, SATA, USB, DisplayPort, or Converged IO PHY interfaces, thusminimizing the time and risk of their development cycles.

The PIPE specification defines two clocking options for the interface. In the first alternative thePHY provides a clock (PCLK) that clocks the PIPE interface as an output. In the secondalternative PCLK is provided to each lane of the PHY as an input. The alternative, where PCLKis provided to each lane of the PHY, was added in the 4.1 revision of the PIPE specification. Itallows the controller or logic external to the PHY to more easily adjust timing of the PIPEinterface to meet timing requirements for silicon implementations. A PHY is only required tosupport one of the timing alternatives. The two clocking options shall be referenced as “PCLK asPHY Output” and “PCLK as PHY Input” respectively. DisplayPort only supports the “PCLK asPHY Input” clocking option. Note: “PCLK as PHY Output” mode is not supported for PCIe5.0 and beyond, Converged IO, or Displayport.

Figure 2-1: Partitioning PHY Layer for PCI Express shows the partitioning described in this spec forthe PCI Express Base Specification. Figure 2-2 shows the partitioning described in this spec forthe USB 3.1 Specification. Figure 2-3 shows the partitioning described in this spec for theConverged IO 1.0 Specification.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/322c318e48bd62c2a13b55d6dcba86cae04dd8adeba4c8036c8b9990b50bacb9.jpg)



Figure 2-1: Partitioning PHY Layer for PCI Express


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/a6dd49fa2ea83c9bbb25a1a29d1988627af4d969caa5feb447075c05bc9c8e55.jpg)



Figure 2-2 Partitioning PHY Layer for USB


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/abcc172df8dc406d46d74cae832b288db43dd00a23a011e87fe961331786334b.jpg)



Figure 2-3. Partitioning PHY Layer for Converged IO


# 2.1 PCI Express PHY Layer

The PCI Express PHY Layer handles the low level PCI Express protocol and signaling. Thisincludes features such as analog buffers, receiver detection, data serialization and de-serialization,8b/10b encoding/decoding, 128b/130b encoding/decoding (8 GT/s, 16 GT/s, 32 GT/s), and elasticbuffers. The primary focus of this block is to shift the clock domain of the data from the PCIExpress rate to one that is compatible with the general logic in the ASIC.

Some key features of the PCI Express PHY are:

Standard PHY interface enables multiple IP sources for PCI Express Logical Layer andprovides a target interface for PCI Express PHY vendors.

Supports 2.5GT/s only or 2.5GT/s and 5.0 GT/s, or 2.5 GT/s, 5.0 GT/s, and 8.0 GT/s, or 2.5GT/s, 5.0 GT/s, 8.0 GT/s, and 16 GT/s, or 2.5 GT/s, 5.0 GT/s, 8.0 GT/s and 16 GT/s and 32GT/s serial data transmission rate

Utilizes 8-bit, 16-bit or 32-bit parallel interface to transmit and receive PCI Express data.Additionally, supports 64-bit interface in SerDes architecture only.

Allows integration of high speed components into a single functional block as seen by theendpoint device designer

• Data and clock recovery from serial stream on the PCI Express bus

• Holding registers to stage transmit and receive data

• Supports direct disparity control for use in transmitting compliance pattern(s)

• 8b/10b encode/decode and error indication

• 128b/130b encode/decode and error indication

• Receiver detection

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

• Beacon transmission and reception

• Selectable Tx Margining, Tx De-emphasis and signal swing values

• Lane Margining at the Receiver

• Polarity

Electrical Idle Entry/Exit Detection (Squelch)

# 2.2 USB PHY Layer

The USB PHY Layer handles the low level USB protocol and signaling. This includes featuressuch as analog buffers, receiver detection, data serialization and de-serialization, 8b/10bencoding/decoding, 128b/132b encoding/decoding (10 GT/s), and elastic buffers. The primaryfocus of this block is to shift the clock domain of the data from the USB rate to one that iscompatible with the general logic in the ASIC.

Some key features of the USB PHY are:

Standard PHY interface enables multiple IP sources for USB Link Layer and provides atarget interface for USB PHY vendors.

• Supports 5.0 GT/s and/or 10 GT/s serial data transmission rate

• Utilizes 8-bit, 16-bit or 32-bit parallel interface to transmit and receive USB data

Allows integration of high speed components into a single functional block as seen by thedevice designer

• Data and clock recovery from serial stream on the USB bus

• Holding registers to stage transmit and receive data

• 8b/10b encode/decode and error indication

• 128b/132b encode/decode and error indication

• Receiver detection

• Low Frequency Periodic Signaling (LFPS)

# 2.3 Converged IO PHY Layer

The Converged IO PHY Layer handles the low level Converged IO protocol and signaling. Thisincludes features such as data serialization and de-serialization, analog buffers, and receiverdetection.

Some key features of the Converged IO PHY:

Standard PHY interface enables multiple IP sources for Converged IO Link Layer and providesa target interface for Converged IO PHY vendors.

• Supports 10 GT/s and/or 20 GT/s serial data transmission rate

• Implements a 40-bit parallel interface to transmit and receive converged IO data

• Data and clock recovery from serial stream on the Converged IO bus

• Holding registers to stage transmit and receive data

• Low Frequency Periodic Signaling (LFPS)

# 2.4 SATA PHY Layer

The SATA PHY Layer handles the low level SATA protocol and signaling. This includesfeatures such as analog buffers, data serialization and deserialization, 8b/10b encoding/decoding,and elastic buffers. The primary focus of this block is to shift the clock domain of the data fromthe SATA rate to one that is compatible with the general logic in the ASIC.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Some key features of the SATA PHY are:

Standard PHY interface enables multiple IP sources for SATA controllers and provides atarget interface for SATA PHY vendors.

Supports 1.5 GT/s only or $1 . 5 \mathrm { G T } / \mathrm { s }$ and 3.0 GT/s, or 1.5 GT/s, 3.0 GT/s and 6.0 GT/s serialdata transmission rate

• Utilizes 8-bit, 16-bit, or 32-bit parallel interface to transmit and receive SATA data

Allows integration of high speed components into a single functional block as seen by thedevice designer

• Data and clock recovery from serial stream on the SATA bus

• Holding registers to stage transmit and receive data

8b/10b encode/decode and error indication

• COMINIT and COMRESET transmission and reception

# 2.5 Low Pin Count Interface and SerDes Architecture

To address the issue of increasing signal count, the message bus interface was introduced in PIPE4.4 and utilized for PCIe lane margining at the receiver and elastic buffer depth control. In PIPE5.0, all legacy PIPE signals without critical timing requirements were mapped into message busregisters so that their associated functionality could be accessed via the message bus interfaceinstead of implementing dedicated signals. Any new features added in PIPE 4.4 and onwards areavailable only via message bus accesses unless they have critical timing requirements that needdedicated signals.

To facilitate the design of general purpose PHYs delivered as hard IPs and to provide the MACwith more freedom to do latency optimizations, a SerDes architecture was defined in PIPE 5.0.This architecture simplifies the PHY and shifts much of the protocol specific logic into the MAC.

To maximize interoperability between MAC and PHY IPs, PHY designs must adhere to therequirements stated in Table 2-1 for support of the legacy pin interface versus the low pin countinterface and for support of the original PIPE architecture versus the SerDes architecture.

The legacy pin interface refers to a pin interface that utilizes all the applicable dedicated signalsas well as the message bus interface for features not supported through dedicated signals. Thelow pin count interface refers to a pin interface that utilizes the message bus interface for allfeatures supported through the message bus, using dedicated signals only for features notsupported through the message bus. The legacy pin interface dedicated signals are defined inPIPE 4.4.1 and earlier and have been deprecated in PIPE 5.0.

The original PIPE architecture is represented in Figure 4-2, Figure 4-3, Figure 4-4 and Figure 4-5.The SerDes Architecture is represented in Figure 4-7 and Figure 4-8.

The legacy pin interface and the low pin count interface are not simultaneously operational, withthe exception of PCIe 4.0 lane margining at the receiver being controlled via the low pin countinterface while other operations are managed over the legacy interface. A PHY must be staticallyconfigured to utilize either the low pin count interface or the legacy pin interface, e.g. no dynamicswitching between the interfaces based on operational rate is permitted. Finally, a SerDesarchitecture datapath must always utilize the low pin count interface; using the legacy pininterface with SerDes architecture is considered illegal.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1


Table 2-1. PHY Requirements for Legacy Pin Interface vs Low Pin CountInterface and Original PIPE vs SerDes Architecture Support


<table><tr><td></td><td>Converged IO/DisplayPort</td><td>USB 3.2 andLess</td><td>PCIe 5.0</td><td>PCIe 4.0and Less</td><td>SATA</td></tr><tr><td>Legacy Pin Interface</td><td>Not allowed</td><td>Required (seeversion 4.4.1)</td><td>NotAllowed</td><td>Required(see version 4.4.1)</td><td>Required(se see version 4.4.1)</td></tr><tr><td>Low Pin Count Interface</td><td>Required</td><td>Optional</td><td>Required</td><td>Required for Gen4 RX marginaling only, optional for everything else</td><td>Optional</td></tr><tr><td>Original PIPE Architecture</td><td>Not allowed</td><td>Required</td><td>Recommend \(d^{1}\)</td><td>Required</td><td>Required</td></tr><tr><td>SerDes Architecture</td><td>Required</td><td>Optional</td><td>Required</td><td>Optional</td><td>Optional</td></tr></table>

1. To provide interoperability with PCIe and USB MACs that choose not to migrate to theSerDes architecture, PHYs are encouraged to provide support for original PIPE via amethod where the associated logic can be easily optimized out. With this, designs thatdo not require a PHY that supports original PIPE are not burdened with any unneededlogic.

# 3 PHY/MAC Interface

Figure 3-1 shows the data and logical command/status signals between the PHY and the MAClayer. Figure 3-2 and Figure 3-3 shows the data and command/status signals between the PHYand the MAC layer for DisplayPort DPTX and DPRX, respectively. Full support of PCI Expressmode, USB mode, Sata mode, DisplayPort mode, and Converged IO mode at all rates requiredifferent numbers of control and status signals to be implemented. Refer to Section 6.1 for detailson which specific signals are required for each operating mode.

# Figure 3-1. PHY/MAC Interface

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/5456bf105a1ed2518da7adb67bf89da681684b6934268856963dcea8eecd56b3.jpg)



Figure 3-2. DPTX PHY/MAC Interface


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/4aa2a53d49ed0aae83c8c91c3487a0f8f6ee634958091a189770f944546e4756.jpg)



Figure 3-3. DPRX PHY/MAC Interface


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/5adb9c0d532118251aaeb1df079735aa68cab24f14f85958487241171c9dec25.jpg)


This specification allows several different PHY/MAC interface configurations to support varioussignaling rates.

For PIPE implementations that support only the $2 . 5 \ : \mathrm { G T / s }$ signaling rate in PCI Express modeimplementers can choose to have 16 bit data paths with PCLK running at 125 MHz, or 8 bit datapaths with PCLK running at 250 MHz. PIPE implementations that support $5 . 0 \mathrm { G T } / \mathrm { s }$ signalingand 2.5 GT/s signaling in PCI Express mode, and therefore are able to switch between 2.5 GT/sand 5.0 GT/s signaling rates, can be implemented in several ways. An implementation maychoose to have PCLK fixed at $2 5 0 \mathrm { M H z }$ and use 8-bit data paths when operating at 2.5 GT/ssignaling rate, and 16-bit data paths when operating at $5 . 0 \mathrm { G T } / \mathrm { s }$ signaling rate. Anotherimplementation choice is to use a fixed data path width and change PCLK frequency to adjust thesignaling rate. In this case, an implementation with 8-bit data paths would provide PCLK at 250MHz for $2 . 5 \ : \mathrm { G T / s }$ signaling and provide PCLK at 500 MHz for 5.0 GT/s signaling. Similarly, animplementation with 16-bit data paths would provide PCLK at $1 2 5 \mathrm { M H z }$ for $2 . 5 \ : \mathrm { G T / s }$ signalingand 250 MHz for 5.0 GT/s signaling. The sample list of possibilities is shown in Table 3-1.

For PIPE implementations that support 5.0 GT/s USB mode and/or 10 GT/s USB modeimplementers can choose from options shown in Table 3-3. A PIPE compliant MAC or PHY isonly required to support one option for each USB transfer speed that it supports.

For SATA PIPE implementations that support only the $1 . 5 \mathrm { G T } / \mathrm { s }$ signaling rate implementers canchoose to have 16 bit data paths with PCLK running at 75 MHz, or 8 bit data paths with PCLKrunning at 150, 300 or ${ 6 0 0 } \mathrm { M H z }$ . The 300 and 600 Mhz options requires the use of TxDataValidand RxDataValid signals to toggle the use of data on the data bus.

SATA PIPE implementations that support $1 . 5 \ : \mathrm { G T / s }$ signaling and 3.0 GT/s signaling in SATAmode, and therefore are able to switch between 1.5 GT/s and 3.0 GT/s signaling rates, can beimplemented in several ways. An implementation may choose to have PCLK fixed at 150 MHz

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

and use 8-bit data paths when operating at $1 . 5 \mathrm { G T } / \mathrm { s }$ signaling rate, and 16-bit data paths whenoperating at $3 . 0 \mathrm { G T / s }$ signaling rate. Another implementation choice is to use a fixed data pathwidth and change PCLK frequency to adjust the signaling rate. In this case, an implementationwith 8-bit data paths could provide PCLK at 150 MHz for 1.5 GT/s signaling and provide PCLKat 300 MHz for 3.0 GT/s signaling. Similarly, an implementation with 16-bit data paths wouldprovide PCLK at 75 MHz for 1.5 GT/s signaling and 150 MHz for 3.0 mode are shown GT/ssignaling. A sample list of possible widths and PCLK rates for SATA is shown in Table 3-4. APIPE compliant MAC or PHY is only required to support one option for each SATA transferspeed that it supports.

The full set of possible widths and PCLK rates for PCI Express mode is shown in Table 3-1. APIPE compliant MAC or PHY is only required to support one option for each PCI Expresstransfer speed that it supports. Note that PHYs that support greater than x4 link widths mustprovide an option for 32-bit or less data width.


Table 3-1. PCI Express Mode - Possible PCLK rates and data widths


<table><tr><td>Mode</td><td>PCLK</td><td>Original PIPE Data Width (SerDes Data Width1)</td><td>TxDataValid and RxDataValid Strobe Rate</td></tr><tr><td>2.5 GT/s</td><td>4000 Mhz</td><td>8 bits (10 bits)</td><td>1 in 16 PCLKs</td></tr><tr><td>2.5 GT/s</td><td>2000 Mhz</td><td>8 bits (10 bits)</td><td>1 in 8 PCLKs</td></tr><tr><td>2.5 GT/s</td><td>1000 Mhz</td><td>8 bits (10 bits)</td><td>1 in 4 PCLKs</td></tr><tr><td>2.5 GT/s</td><td>500 Mhz</td><td>8 bits (10 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>2.5 GT/s</td><td>250 Mhz</td><td>8 bits (10 bits)</td><td>N/A</td></tr><tr><td>2.5 GT/s</td><td>250 Mhz</td><td>16 bits (20 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>2.5 GT/s</td><td>500 Mhz</td><td>16 bits (20 bits)</td><td>1 in 4 PCLKs</td></tr><tr><td>2.5 GT/s</td><td>125 Mhz</td><td>16 bits (20 bits)</td><td>N/A</td></tr><tr><td>2.5 GT/s</td><td>250 Mhz</td><td>32 bits (40 bits)</td><td>1 in 4 PCLKs</td></tr><tr><td>2.5 GT/s</td><td>62.5 Mhz</td><td>32 bits (40 bits)</td><td>N/A</td></tr><tr><td>2.5 GT/s</td><td>62.5 Mhz</td><td>N/A (80 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>2.5 GT/s</td><td>31.25 Mhz</td><td>N/A (80 bits)</td><td>N/A</td></tr><tr><td>5.0 GT/s</td><td>4000 Mhz</td><td>8 bits (10 bits)</td><td>1 in 8 PCLKs</td></tr><tr><td>5.0 GT/s</td><td>2000 Mhz</td><td>8 bits (10 bits)</td><td>1 in 4 PCLKs</td></tr><tr><td>5.0 GT/s</td><td>1000 Mhz</td><td>8 bits (10 bits)</td><td>1 in 2 PCLKs</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>5.0 GT/s</td><td>500 Mhz</td><td>8 bits (10 bits)</td><td>N/A</td></tr><tr><td>5.0 GT/s</td><td>500 Mhz</td><td>16 bits (20 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>5.0 GT/s</td><td>250 Mhz</td><td>16 bits (20 bits)</td><td>N/A</td></tr><tr><td>5.0 GT/s</td><td>250 Mhz</td><td>32 bits (40 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>5.0 GT/s</td><td>125 Mhz</td><td>32 bits (40 bits)</td><td>N/A</td></tr><tr><td>5.0 GT/s</td><td>125 Mhz</td><td>N/A (80 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>5.0 GT/s</td><td>62.5 Mhz</td><td>N/A (80 bits)</td><td>N/A</td></tr><tr><td>8.0 GT/s</td><td>4000 Mhz</td><td>8 bits (10 bits)</td><td>1 in 4 PCLKs</td></tr><tr><td>8.0 GT/s</td><td>2000 Mhz</td><td>8 bits (10 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>8.0 GT/s</td><td>1000 Mhz</td><td>8 bits (10 bits)</td><td>N/A</td></tr><tr><td>8.0 GT/s</td><td>1000 Mhz</td><td>16 bits (20 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>8.0 GT/s</td><td>500 Mhz</td><td>16 bits (20 bits)</td><td>N/A</td></tr><tr><td>8.0 GT/s</td><td>500 Mhz</td><td>32 bits (40 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>8.0 GT/s</td><td>250 Mhz</td><td>32 bits (40 bits)</td><td>N/A</td></tr><tr><td>8.0 GT/s</td><td>250 Mhz</td><td>N/A (80 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>8.0 GT/s</td><td>125 Mhz</td><td>N/A (80 bits)</td><td>N/A</td></tr><tr><td>16.0 GT/s</td><td>4000</td><td>8 bits (10 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>16.0 GT/s</td><td>2000 Mhz</td><td>8 bits (10 bits)</td><td>N/A</td></tr><tr><td>16.0 GT/s</td><td>1000 Mhz</td><td>16 bits (20 bits)</td><td>N/A</td></tr><tr><td>16.0 GT/s</td><td>500 Mhz</td><td>32 bits (40 bits)</td><td>N/A</td></tr><tr><td>16.0 GT/s</td><td>250 Mhz</td><td>N/A (80 bits)</td><td>N/A</td></tr><tr><td>32 GT/s</td><td>4000 Mhz</td><td>8 bits (10 bits)</td><td>N/A</td></tr><tr><td>32 GT/s</td><td>2000 Mhz</td><td>16 bits (20 bits)</td><td>N/A</td></tr><tr><td>32 GT/s</td><td>1000 Mhz</td><td>32 bits (40 bits)</td><td>N/A</td></tr><tr><td>32 GT/s</td><td>500 Mhz</td><td>N/A (80 bits)</td><td>N/A</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1


Table 3-2. PCI Express Mode (SerDes only) -- Possible RxCLK Rates andData Widths


<table><tr><td>Mode</td><td>RxCLK</td><td>Data Width</td></tr><tr><td>2.5 GT/s</td><td>250 Mhz</td><td>10 bits</td></tr><tr><td>2.5 GT/s</td><td>125 Mhz</td><td>20 bits</td></tr><tr><td>2.5 GT/s</td><td>62.5 Mhz</td><td>40 bits</td></tr><tr><td>2.5 GT/s</td><td>31.25 Mhz</td><td>80 bits</td></tr><tr><td>5.0 GT/s</td><td>500 Mhz</td><td>10 bits</td></tr><tr><td>5.0 GT/s</td><td>250 Mhz</td><td>20 bits</td></tr><tr><td>5.0 GT/s</td><td>125 Mhz</td><td>40 bits</td></tr><tr><td>5.0 GT/s</td><td>62.5 Mhz</td><td>80 bits</td></tr><tr><td>8.0 GT/s</td><td>1000 Mhz</td><td>10 bits</td></tr><tr><td>8.0 GT/s</td><td>500 Mhz</td><td>20 bits</td></tr><tr><td>8.0 GT/s</td><td>250 Mhz</td><td>40 bits</td></tr><tr><td>8.0 GT/s</td><td>125 Mhz</td><td>80 bits</td></tr><tr><td>16.0 GT/s</td><td>2000 Mhz</td><td>10 bits</td></tr><tr><td>16.0 GT/s</td><td>1000 Mhz</td><td>20 bits</td></tr><tr><td>16.0 GT/s</td><td>500 Mhz</td><td>40 bits</td></tr><tr><td>16.0 GT/s</td><td>250 Mhz</td><td>80 bits</td></tr><tr><td>32 GT/s</td><td>4000 Mhz</td><td>10 bits</td></tr><tr><td>32 GT/s</td><td>2000 Mhz</td><td>20 bits</td></tr><tr><td>32 GT/s</td><td>1000 Mhz</td><td>40 bits</td></tr><tr><td>32 GT/s</td><td>500 Mhz</td><td>80 bits</td></tr></table>


Table 3-3. USB Mode – Possible PCLK or RxClk rates and data widths


<table><tr><td>Mode</td><td>PCLK or RxClk</td><td>Original PIPE Data Width (SerDes Data Width)</td></tr><tr><td>5.0 GT/s USB</td><td>125 Mhz</td><td>32 bits (40 bits)</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>5.0 GT/s USB</td><td>250 Mhz</td><td>16 bits (20 bits)</td></tr><tr><td>5.0 GT/s USB</td><td>500 Mhz</td><td>8 bits (10 bits)</td></tr><tr><td>10.0 GT/s USB</td><td>312.5 Mhz</td><td>32 bits (40 bits)</td></tr><tr><td>10.0 GT/s USB</td><td>625 Mhz</td><td>16 bits (20 bits)</td></tr><tr><td>10.0 GT/s USB</td><td>1250 Mhz</td><td>8 bits (10 bits)</td></tr></table>


Table 3-4. SATA Mode – Possible PCLK rates and data widths


<table><tr><td>Mode</td><td>PCLK</td><td>Original PIPE Data Width (SerDes Data Width)</td><td>TxDataValid/RxDataValid Strobe Rate</td></tr><tr><td>1.5 GT/s SATA</td><td>600 Mhz</td><td>8 bits (10 bits)</td><td>1 in 4 PCLKs</td></tr><tr><td>1.5 GT/s SATA</td><td>300 Mhz</td><td>8 bits (10 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>1.5 GT/s SATA</td><td>150 Mhz</td><td>8 bits (10 bits)</td><td>N/A</td></tr><tr><td>1.5 GT/s SATA</td><td>75 Mhz</td><td>16 bits (20 bits)</td><td>N/A</td></tr><tr><td>1.5 GT/s SATA</td><td>37.5 Mhz</td><td>32 bits (40 bits)</td><td>N/A</td></tr><tr><td>3.0 GT/s SATA</td><td>300 Mhz</td><td>8 bits (10 bits)</td><td>N/A</td></tr><tr><td>3.0 GT/s SATA</td><td>150 Mhz</td><td>16 bits (20 bits)</td><td>N/A</td></tr><tr><td>3.0 GT/s SATA</td><td>75 Mhz</td><td>32 bits (40 bits)</td><td>N/A</td></tr><tr><td>3.0 GT/s SATA</td><td>600 Mhz</td><td>8 bits (10 bits)</td><td>1 in 2 PCLKs</td></tr><tr><td>6.0 GT/s SATA</td><td>600 Mhz</td><td>8 bits (10 bits)</td><td>N/A</td></tr><tr><td>6.0 GT/s SATA</td><td>300 Mhz</td><td>16 bits (20 bits)</td><td>N/A</td></tr><tr><td>6.0 GT/s SATA</td><td>150 Mhz</td><td>32 bits (40 bits)</td><td>N/A</td></tr></table>


Note: In SATA Mode if the PHY elasticity buffer is operating in nominal empty mode – thenRxDataValid may also be used when the EB is empty and no data is available.



Table 3-5. SATA Mode (SerDes only) – Possible RxCLK Rates and DataWidths


<table><tr><td>Mode</td><td>RxCLK</td><td>Data Width</td></tr><tr><td>1.5 GT/s SATA</td><td>150 Mhz</td><td>10 bits</td></tr><tr><td>1.5 GT/s SATA</td><td>75 Mhz</td><td>20 bits</td></tr><tr><td>1.5 GT/s SATA</td><td>37.5 Mhz</td><td>40 bits</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>3.0 GT/s SATA</td><td>300 Mhz</td><td>10 bits</td></tr><tr><td>3.0 GT/s SATA</td><td>150 Mhz</td><td>20 bits</td></tr><tr><td>3.0 GT/s SATA</td><td>75 Mhz</td><td>40 bits</td></tr><tr><td>6.0 GT/s SATA</td><td>600 Mhz</td><td>10 bits</td></tr><tr><td>6.0 GT/s SATA</td><td>300 Mhz</td><td>20 bits</td></tr><tr><td>6.0 GT/s SATA</td><td>150 Mhz</td><td>40 bits</td></tr></table>


Table 3-6 shows possible PCLK and data width options for DisplayPort implementations.



Table 3-6 DPTX and DPRX Mode – Possible PCLK or RxCLK Rates and DataWidths


<table><tr><td>Mode</td><td>PCLK/RxCLK</td><td>Data Width</td></tr><tr><td rowspan="3">1.62 Gbps DisplayPort</td><td>162 Mhz</td><td>10 bits</td></tr><tr><td>81 Mhz</td><td>20 bits</td></tr><tr><td>40.5 Mhz</td><td>40 bits</td></tr><tr><td rowspan="3">2.16 Gbps DisplayPort (eDP)</td><td>216 Mhz</td><td>10 bits</td></tr><tr><td>108 Mhz</td><td>20 bits</td></tr><tr><td>54 Mhz</td><td>40 bits</td></tr><tr><td>2.43 Gbps DisplayPort (eDP)</td><td>243 Mhz</td><td>10 bits</td></tr><tr><td></td><td>121.5 Mhz</td><td>20 bits</td></tr><tr><td></td><td>60.75 Mhz</td><td>40 bits</td></tr><tr><td rowspan="3">2.7 Gbps DisplayPort</td><td>270 Mhz</td><td>10 bits</td></tr><tr><td>135 Mhz</td><td>20 bits</td></tr><tr><td>62.52 Mhz</td><td>40 bits</td></tr><tr><td>3.24 Gbps DisplayPort (eDP)</td><td>324 Mhz</td><td>10 bits</td></tr><tr><td></td><td>162 Mhz</td><td>20 bits</td></tr><tr><td></td><td>81 Mhz</td><td>40 bits</td></tr><tr><td>4.32 Gbps DisplayPort (eDP)</td><td>432 Mhz</td><td>10 bits</td></tr><tr><td></td><td>216 Mhz</td><td>20 bits</td></tr><tr><td></td><td>108 Mhz</td><td>40 bits</td></tr><tr><td rowspan="3">5.4 Gbps DisplayPort</td><td>540 Mhz</td><td>10 bits</td></tr><tr><td>270 Mhz</td><td>20 bits</td></tr><tr><td>135 Mhz</td><td>40 bits</td></tr><tr><td rowspan="3">8.1 Gbps DisplayPort</td><td>810 Mhz</td><td>10 bits</td></tr><tr><td>405 Mhz</td><td>20 bits</td></tr><tr><td>202.5 Mhz</td><td>40 bits</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1


Table 3-7. Converged IO Mode – Possible PCLK or RxCLK Rates and DataWidths


<table><tr><td>Mode</td><td>PCLK/RxCLK</td><td>Data Width2</td></tr><tr><td rowspan="3">10 GT/s Converged IO</td><td>1.25 Ghz</td><td>10 bits</td></tr><tr><td>625 Mhz</td><td>20 bits</td></tr><tr><td>312.5 Mhz</td><td>40 bits</td></tr><tr><td rowspan="3">20 GT/s Converged IO</td><td>2.5 Ghz</td><td>10 bits</td></tr><tr><td>1.25 Ghz</td><td>20 bits</td></tr><tr><td>625 Mhz</td><td>40 bits</td></tr></table>

Note: When a MAC that implements the TxDataValid signal is using a mode that does not useTxDataValid the MAC shall keep TxDataValid asserted. When a PHY that implementsRxDataValid is in a mode that does not use RxDataValid the PHY shall keep RxDataValidasserted.

There may be PIPE implementations that support multiples of the above configurations. PHYimplementations that support multiple configurations at the same rate must support the width andPCLK rate control signals. A PHY that supports multiple rates in PCI Express Mode or SATAMode or USB Mode must support configurations across all supported rates that are fixed PCLKrate. A PHY that supports multiple rates in PCI Express Mode or SATA Mode must supportconfigurations across all supported rates that are fixed data path width.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 4 PCI Express, USB, and Converged IO PHY Functionality

Figure 4-1 shows the functional block diagram of the PHY. The functional blocks shown are notintended to define the internal architecture or design of a compliant PHY but to serve as an aid forsignal grouping.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/30717e992bf25e38dad6b22ece01b61148758ae4ecdca7a9270693f9da937ea7.jpg)



Figure 4-1: PHY Functional Block Diagram


Sections below provide descriptions of each of the blocks shown in Figure 4-1: PHY FunctionalBlock Diagram. These blocks represent high-level functionality that is required to exist in thePHY implementation. These descriptions and diagrams describe general architecture andbehavioral characteristics. Different implementations are possible and acceptable.

# 4.1 Original PIPE Architecture

# 4.1.1 Transmitter Block Diagram (2.5 and 5.0 GT/s)

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/725264f8181bfb00ce38a4a7f936dbf8001e725bc035ff7ddc8c6216ba1d1b01.jpg)



Figure 4-2: Transmitter Block Diagram


# 4.1.2 Transmitter Block Diagram (8.0/10/16 GT/s/32 GT/s)

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/0e84de2d217fcba6a59a45142872d3def6596654ea9c7b8e21020449aaee1713.jpg)



Figure 4-3: Transmitter Block Diagram (8.0/10/16 GT/s)


# 4.1.3 Receiver Block Diagram (2.5 and 5.0 GT/s)

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/2efedde6529d049a564bcf748fcc674fba6471035a01f7de353db0da15459f40.jpg)


# 4.1.4

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/fe8022f3420d3e8f0b5c37b48b432d67be0264df14f3a9f205997d4a8329fd5e.jpg)


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Figure 4-5: Receiver Block Diagram (8.0/10/16 GT/s)

# 4.1.5 Clocking

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/c9bd490f06ccfd12e900a289bf4e6a1efe2e728b7bdc7ff2bdaaa4bd6b9bcd37.jpg)



Figure 4-6: Clocking Block Diagram


# 4.2 SerDes Architecture

With the SerDes architecture, the PHY implements minimal digital logic compared to the originalPIPE architecture. Figure 4-7 shows the transmitter functionality implemented in the PHY. Thedata received from the MAC goes through a parallel to serial converter before being driven out ondifferential wires. Note that in the SerDes architecture, all loopback logic resides in the MAC.Figure 4-8 shows the receiver functionality implemented in the PHY. The data received on theinput differential wires goes through a serial to parallel converter before being forwarded to theMAC along with a recovered clock, RxCLK.

# 4.2.1 SerDes Architecture: Transmitter Block Diagram

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/5707e6d5adf635a75cd27fa8e3cda60589e8cd356365a9266cfcc62fd5280d0c.jpg)



Figure 4-7. SerDes Architecture: PHY Transmitter Block Diagram


4.2.2 SerDes Architecture: Receiver Block Diagram

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/5189b32a707c231c928bd327b9a545f3a75aa0075f250635c0d4b62d972797dd.jpg)



Figure 4-8. SerDes Architecture: PHY Receiver Block Diagram


# 5 SATA PHY Functionality

Figure 4-1 shows the functional block diagram of a SATA PHY. The functional blocks shown arenot intended to define the internal architecture or design of a compliant PHY but to serve as anaid for signal grouping.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/5605e611c1c57f239367c6dcfa2c745d136142fac64d1b09210fd20fe73e38d4.jpg)



Figure 5-1: PHY Functional Block Diagram


Sections below provide descriptions of each of the blocks shown in Figure 5-1. These blocksrepresent high-level functionality that is required to exist in the PHY implementation. Thesedescriptions and diagrams describe general architecture and behavioral characteristics. Differentimplementations are possible and acceptable.

# 5.1 Transmitter Block Diagram (1.5, 3.0, and 6.0 GT/s)

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/f88b5838d8337be270f6c4c70f4d85627efae8bc105ea9b10fa3b8dd66e6890e.jpg)



Figure 5-2: Transmitter Block Diagram (1.5, 3.0, and 6.0 GT/s)


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 5.2 Receiver Block Diagram (1.5, 3.0 and 6.0 GT/s)

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/26dc88f3b6fa47435f218b531093b44218167a37558d4d7e361d2ff5117456b9.jpg)



Figure 5-3: Receiver Block Diagram (1.5, 3.0 and 6.0 GT/s)


# 5.3 Clocking

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/962eccb367e6d09ad47c7906ec4245e0dc02c5599127d400acc7d55ea6df95e4.jpg)



Figure 5-4: Clocking Block Diagram


# 6 PIPE Interface Signal Descriptions

The PHY input and output signals are described in the following tables. Note that Input/Output isdefined from the perspective of a PIPE compliant PHY component. Thus a signal described as an“Output” is driven by the PHY and a signal described as an “Input” is received by the PHY. Abasic description of each signal is provided. More details on their operation and timing can befound in following sections. All signals on the ‘parallel’ side of a PIPE implementation aresynchronous with PCLK, with exceptions noted in the tables below. In SerDes architecture,RxData is synchronous with RxCLK. PHYs that only support SerDes architecture do not requirethe signals marked as “not used in the SerDes architecture”; however, PHYs that support bothoriginal PIPE and SerDes architecture must implement all the signals.

Notes: For Converged IO and DisplayPort, the low speed side channel is not part of the PIPEdefinition; however the appendix does list DisplayPort AUX signals.

6.1 PHY/MAC Interface Signals – Common for SerDes and Original PIPEThis section describes signals that are applicable to both SerDes architecture and Original PIPE.Any deltas in usage between the two architectures are noted in the description.

# 6.1.1 Data Interface

Table 6-1. Transmit Data Interface Input Signals

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>Original PIPE: 
TxData[31:0] 
for 32-bit 
interface 
TxData[15:0] 
for 16-bit 
interface 
TxData[7:0] for 
8-bit interface 
SerDes arch: 
TxData[79:0] 
for 80-bit 
interface 
TxData[39:0] 
for 40-bit 
interface 
TxData[19:0] 
for 20-bit 
interface 
TxData[9:0] for 
10-bit interface</td><td>N/A</td><td>Parallel data input bus. 
For Original PIPE architecture, the TxData signal width options are 32, 16, and 8 bits. For the 16-bit interface, 16 bits represent 2 symbols of transmit data. Bits [7:0] are the first symbol to be transmitted, and bits [15:8] are the second symbol. For the 32-bit interface, 32 bits represent the 4 symbols of transmit data. Bits [23:16] are the third symbol to be transmitted, and bits [31:24] are the fourth symbol. Bit zero is the first to be transmitted. 
For SerDes architecture, the TxData signal width options are 80, 40, 20, and 10 bits. For the 80-bit interface, 80 bits represent 8 symbols of transmit data. Bits [49:40], bits [59:50], bits[69:60], and bits[79:70] are the fifth, sixth, seventh, and eighth symbols, respectively. For block encoded data³, only 8 bits out of each 10-bit slice are used, e.g. [7:0] represent byte0, [9:8] are reserved, [17:10] represent byte1, and [19:18] are reserved, etc.</td><td>PCIe, SATA, USB, DisplayPort TX, Converged IO</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>TxDataValid</td><td>N/A</td><td>PCI Express Mode and SATA Mode and USB Mode (original PIPE only): This signal allows the MAC to instruct the PHY to ignore the data interface for one clock cycle. A value of one indicates the phy will use the data, a value of zero indicates the phy will not use the data.
It is recommended that the MAC assert TxDataValid at all times when the PHY is in a mode that does not require the signal. All PCI Express modes at 8 GT/s, 16 GT/s, and 32 GT/s and all USB modes at 10 GT/s use TxDataValid. Refer to Table 3-1, Table 3-2, and Table 3-3 for a list of other modes that use TxDataValid. Refer to section 8.27 for details on USB usage; this signal is not applicable to USB SerDes architecture designs.</td><td>PCIe, SATA, USB (original PIPE only)</td></tr></table>


Table 6-2. Transmit Data Interface Output Signals


<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>Tx+, Tx-</td><td>N/A</td><td>The differential outputs from the PHY. All transmitters shall be AC coupled to the media. See section 4.3.1.2 of the PCI Express Base Specification or section 6.2.2 of the USB 3.1 Specification.</td><td>PCIe, SATA, USB, DisplayPort TX, Converged IO</td></tr></table>


Table 6-3. Receive Data Interface Input Signals


<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>Rx+, Rx-</td><td>N/A</td><td>The differential inputs to the PHY.</td><td>PCIe, SATA, USB, DisplayPort RX, Converged IO</td></tr></table>


Table 6-4. Receive Data Interface Output Signals


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td rowspan="3">Original PIPE: 
RxData[31:0] 
for 32-bit 
interface 
RxData[15:0] 
for 16-bit 
interface or 
RxData[7:0] 
for 8-bit 
interface 
SerDes arch: 
RxData[79:0] 
for 80-bit 
interface 
RxData[39:0] 
for 40-bit 
interface 
RxData[19:0] 
for 20-bit 
interface or 
RxData[9:0] 
for 10-bit 
interface</td><td rowspan="3">N/A</td><td>Parallel data output bus. For 16-bit interface, 16 bits represents 2 symbols of receive data. Bits [7:0] are the first symbol received, and bits [15:8] are the second symbol. For the 32 bit interface, 32 bits represent the 4 symbols of receive data. Bits [23:16] are the third symbol received, and bits [31:24] are the fourth symbol received. Bit zero is the first bit received.</td><td rowspan="3">PCIe, SATA, USB, DisplayPort RX, Converged IO</td></tr><tr><td>When the PHY is in a SATA mode, the first valid data following an ALIGN primitive must appear as byte 0 in the receive data.</td></tr><tr><td>For SerDes architecture, the RxData signal width options are 80, 40, 20, and 10 bits. For the 80-bit interface, 80 bits represent 8 symbols of receive data. Bits [49:40], bits [59:50], bits[69:60], and bits[79:70] are the fifth, sixth, seventh, and eighth symbols, respectively. For block encoded data4, only 8 bits out of each 10-bit slice are used, e.g. [7:0] represent byte0, [9:8] are reserved, [17:10] represent byte1, and [19:18] are reserved, etc.</td></tr></table>

# 6.1.2 Command Interface


Table 6-5. Command Interface Input Signals


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td colspan="2">Description</td><td>Relevant Protocols</td></tr><tr><td rowspan="12">PHY Mode[3:0]</td><td rowspan="12">N/A</td><td colspan="2">Selects PHY operating mode.</td><td rowspan="12">PCIe, SATA, USB, Display Port, Converged IO</td></tr><tr><td>Value</td><td>Description</td></tr><tr><td>0</td><td>PCI Express</td></tr><tr><td>1</td><td>USB</td></tr><tr><td>2</td><td>SATA</td></tr><tr><td>3</td><td>DisplayPort</td></tr><tr><td>4</td><td>Reserved</td></tr><tr><td>5</td><td>Reserved</td></tr><tr><td>6</td><td>Reserved</td></tr><tr><td>7</td><td>Converged IO</td></tr><tr><td>All others</td><td>Reserved</td></tr><tr><td colspan="2">Implementation of this signal is not required for PHYs that only support only a single mode.</td></tr><tr><td>DP_Mode_TX_RX</td><td>N/A</td><td colspan="2">This signal is used to distinguish between DPTX and DPRX when PHY Mode=0x3. A value of ‘0’ specifies DPTX; a value of ‘1’ specifies DPRX.</td><td>Display Port</td></tr><tr><td>SerDesArch</td><td>N/A</td><td colspan="2">This signal indicates whether SerDes architecture is enabled. Displayport and Converged IO must always set this to ‘1’.</td><td>PCIe, SATA, USB, Display Port, Converged IO</td></tr><tr><td>SRISEnablen</td><td>Hig h</td><td colspan="2">Used to tell the PHY to configure itself to support SRIS for PCIe.SRISEnablen must be set by the MAC before the first receiver detection. The PHY internally does sequencing and gates the exit to P0 with having setup for SRIS if SRISEnablen is asserted.For PCLK as PHY output, this signal must be set before the PLL is configured.</td><td>PCIe</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>TxDetectRx/ Loopback</td><td>Hig h</td><td>Used to tell the PHY to begin a receiver detection operation or to begin loopback or to signal LFPS during P0 for USB Polling state. Refer to Sections 8.22 and 8.23 for details on the required values for all control signals to perform loopback and receiver detection operations and to signal Polling.LFPS.
For receive detect in PHY power states where PCLK can be gated, this signal is asynchronous; in all other states, it is synchronous to PCLK.
Converged IO Mode: Used to tell the PHY to signal LFPS.
Sata Mode:
Loopback support is optional for SATA PHYs.
Loopback is only valid in Sata Mode when EncodeDecodeBypass is asserted. The RX elasticity buffer must be active during loopback. If the PHY runs out of data to transmit during loopback – it must transmit ALIGNNs.
TxDetectRX is not used in SATA mode.</td><td>PCIe, SATA, USB</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>TxEleclde[3:0]</td><td>Hig h</td><td>Forces Tx output to electrical idle when asserted except in loopback. See Section 8.22 (PCI Express Mode) or Section 8.23 (USB mode and Converged IO Mode) or Section 8.24 (SATA Mode) for the full description and usage of this pin. Note: The MAC must always have TxDataValid asserted when TxEleclde transitions to either asserted or deasserted; TxDataValid is a qualifier for TxEleclde sampling. See section 8.3 for the definitions of PHY power states. For original PIPE architecture and for non-PCIe mode SerDes architecture, only bit 0 of this signal is used and all other bits are reserved. For SerDes architecture in PCIe mode, one bit is required per two symbols of interface data. For example, for an eight symbol wide interface, bit 0 would apply to symbols 0 and 1, bit 1 would apply to symbols 2 and 3, bit 2 would apply to symbols 4 and 5, bit 3 would apply to symbols 6 and 7. For narrower interfaces, unused bits of this signal are reserved. This is due to EIOS truncation rules in section 4.2.4.2 of the PCIe 4.0 Base specification and due to the maximum time to transition to a valid Electrical Idle after sending an EIOS.</td><td>PCIe, SATA USB, Converged IO</td></tr><tr><td>Reset#</td><td>Low</td><td>Resetset the transmitter and receiver. This signal is asynchronous. The PHY reports its default power state after reset as defined in section 8.2.</td><td>PCIe, SATA USB, Display Port</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="23">PowerDown[3:0]</td><td rowspan="23">N/A</td><td colspan="6">Power up or down the transceiver. Power states PCI Express Mode:</td><td rowspan="18">PCIe,USB,Converged IO</td></tr><tr><td>[3]</td><td>[2]</td><td>[1]</td><td>[0]</td><td colspan="2">Description</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td colspan="2">P0, normal operation</td></tr><tr><td>0</td><td>0</td><td>0</td><td>1</td><td colspan="2">P0s, low recovery time latency, power saving state</td></tr><tr><td>0</td><td>0</td><td>1</td><td>0</td><td colspan="2">P1, longer recovery time latency, lower power state</td></tr><tr><td>0</td><td>0</td><td>1</td><td>1</td><td colspan="2">P2, lowest power state</td></tr><tr><td>0</td><td>1</td><td>0</td><td>0</td><td colspan="2">POWER_STATE_4 Phy specific</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td><td colspan="2">POWER_STATE_5 Phy specific</td></tr><tr><td>0</td><td>1</td><td>1</td><td>0</td><td colspan="2">POWER_STATE_6 Phy specific</td></tr><tr><td>0</td><td>1</td><td>1</td><td>1</td><td colspan="2">POWER_STATE_7 Phy specific</td></tr><tr><td>1</td><td>0</td><td>0</td><td>0</td><td colspan="2">POWER_STATE_8 Phy specific</td></tr><tr><td>1</td><td>0</td><td>0</td><td>1</td><td colspan="2">POWER_STATE_9 Phy specific</td></tr><tr><td>1</td><td>0</td><td>1</td><td>0</td><td colspan="2">POWER_STATE_10 Phy specific</td></tr><tr><td>1</td><td>0</td><td>1</td><td>1</td><td colspan="2">POWER_STATE_11 Phy specific</td></tr><tr><td>1</td><td>1</td><td>0</td><td>0</td><td colspan="2">POWER_STATE_12 Phy specific</td></tr><tr><td>1</td><td>1</td><td>0</td><td>1</td><td colspan="2">POWER_STATE_13 Phy specific</td></tr><tr><td>1</td><td>1</td><td>1</td><td>0</td><td colspan="2">POWER_STATE_14 Phy specific</td></tr><tr><td>1</td><td>1</td><td>1</td><td>1</td><td colspan="2">POWER_STATE_15 Phy specific</td></tr><tr><td colspan="7">In PCLK as PHY output mode, when transitioning from P2 to P1, the signaling is asynchronous (since PCLK is not running).A PIPE phy that supports PCI Express L1 PM Substates managed exclusively via this PowerDown signal must support at least one PHY specific power state meeting each of the requirements shown in the following table in addition to the legacy power states. If the PHY supports multiple suitable states with different exit latencies it is the responsibility of the Mac to decide which states to use.</td></tr><tr><td>PCLK State</td><td colspan="2">TX Common Mode State</td><td>RxElecIdle Supported</td><td>When to return PhyStatus when exiting?</td><td colspan="2">Exit Latency to P0</td></tr><tr><td>Off</td><td colspan="2">Off</td><td>No</td><td>Before transmit common mode established</td><td colspan="2">Implementation Specific</td></tr><tr><td>Off</td><td colspan="2">On</td><td>No</td><td>N/A</td><td colspan="2">Implementation Specific</td></tr><tr><td colspan="7">When managing L1 substates via sideband signals, the PHY must define at least one PowerDown encoding where PCLK can be turned off and TxCommonModeState and RxElecIdle are</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

controlled through TxCommonModeDisable andRxEIDetectDisable; in this case, the MAC must holdthe PowerDown value constant when in L1substates.


USB Mode and Converged IO Mode:


<table><tr><td>[3]</td><td>[2]</td><td>[1]</td><td>[0]</td><td>Description</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>P0, normal operation</td></tr><tr><td>0</td><td>0</td><td>0</td><td>1</td><td>P1, low recovery time latency, power saving state</td></tr><tr><td>0</td><td>0</td><td>1</td><td>0</td><td>P2, longer recovery time latency, lower power state</td></tr><tr><td>0</td><td>0</td><td>1</td><td>1</td><td>P3, lowest power state</td></tr><tr><td>0</td><td>1</td><td>0</td><td>0</td><td>POWER_STATE_4 Phy specific</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td><td>POWER_STATE_5 Phy specific</td></tr><tr><td>0</td><td>1</td><td>1</td><td>0</td><td>POWER_STATE_6 Phy specific</td></tr><tr><td>0</td><td>1</td><td>1</td><td>1</td><td>POWER_STATE_7 Phy specific</td></tr><tr><td>1</td><td>0</td><td>0</td><td>0</td><td>POWER_STATE_8 Phy specific</td></tr><tr><td>1</td><td>0</td><td>0</td><td>1</td><td>POWER_STATE_9 Phy specific</td></tr><tr><td>1</td><td>0</td><td>1</td><td>0</td><td>POWER_STATE_10 Phy specific</td></tr><tr><td>1</td><td>0</td><td>1</td><td>1</td><td>POWER_STATE_11 Phy specific</td></tr><tr><td>1</td><td>1</td><td>0</td><td>0</td><td>POWER_STATE_12 Phy specific</td></tr><tr><td>1</td><td>1</td><td>0</td><td>1</td><td>POWER_STATE_13 Phy specific</td></tr><tr><td>1</td><td>1</td><td>1</td><td>0</td><td>POWER_STATE_14 Phy specific</td></tr><tr><td>1</td><td>1</td><td>1</td><td>1</td><td>POWER_STATE_15 Phy specific</td></tr></table>

When transitioning from P3 to P0, the signaling isasynchronous (since PCLK is not running).


For USB, below are the characteristics of the powerstates that must be minimally implemented:


<table><tr><td>PowerDown</td><td>PCLK State</td><td>TX Common Mode State</td><td>Operations</td></tr><tr><td>P0</td><td>On</td><td>On</td><td>Transmit/Receive high speed data Transmit/Receive LFPS Termination control</td></tr><tr><td>P1</td><td>On</td><td>On</td><td>Transmit/Receive LFPS Termination control</td></tr><tr><td>P2</td><td>On</td><td>Off</td><td>Receive LFPS Termination control Remote receiver detection</td></tr><tr><td>P3</td><td>Off</td><td>Off</td><td>Receive LFPS Termination</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td></td><td></td><td></td><td>controlRemote receiverdetection</td><td></td></tr><tr><td rowspan="18">PowerDown[3:0]Sata Mode</td><td rowspan="18">N/A</td><td colspan="6">Sata Mode:Power up or down the transceiver. Power states</td></tr><tr><td>[3]</td><td>[2]</td><td>[1]</td><td>[0]</td><td colspan="2">Description</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td colspan="2">POWER_STATE_0 Operational state</td></tr><tr><td>0</td><td>0</td><td>0</td><td>1</td><td colspan="2">POWER_STATE_1 Phy specific</td></tr><tr><td>0</td><td>0</td><td>1</td><td>0</td><td colspan="2">POWER_STATE_2 Phy specific</td></tr><tr><td>0</td><td>0</td><td>1</td><td>1</td><td colspan="2">POWER_STATE_3 Phy specific</td></tr><tr><td>0</td><td>1</td><td>0</td><td>0</td><td colspan="2">POWER_STATE_4 Phy specific</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td><td colspan="2">POWER_STATE_5 Phy specific</td></tr><tr><td>0</td><td>1</td><td>1</td><td>0</td><td colspan="2">POWER_STATE_6 Phy specific</td></tr><tr><td>0</td><td>1</td><td>1</td><td>1</td><td colspan="2">POWER_STATE_7 Phy specific</td></tr><tr><td>1</td><td>0</td><td>0</td><td>0</td><td colspan="2">POWER_STATE_8 Phy specific</td></tr><tr><td>1</td><td>0</td><td>0</td><td>1</td><td colspan="2">POWER_STATE_9 Phy specific</td></tr><tr><td>1</td><td>0</td><td>1</td><td>0</td><td colspan="2">POWER_STATE_10 Phy specific</td></tr><tr><td>1</td><td>0</td><td>1</td><td>1</td><td colspan="2">POWER_STATE_11 Phy specific</td></tr><tr><td>1</td><td>1</td><td>0</td><td>0</td><td colspan="2">POWER_STATE_12 Phy specific</td></tr><tr><td>1</td><td>1</td><td>0</td><td>1</td><td colspan="2">POWER_STATE_13 Phy specific</td></tr><tr><td>1</td><td>1</td><td>1</td><td>0</td><td colspan="2">POWER_STATE_14 Phy specific</td></tr><tr><td>1</td><td>1</td><td>1</td><td>1</td><td colspan="2">POWER_STATE_15 Phy specific</td></tr><tr><td colspan="8">A PIPE compliant SATA PHY is recommended to support at least 4 states other than POWER_STATE_0. There must be at least one power state meeting each of the requirements shown in the following table</td></tr><tr><td colspan="5">PCLK State</td><td>TX CommonMode State</td><td colspan="2">Exit Latency toPOWER_STATE_0</td></tr><tr><td colspan="5">Off</td><td>Off</td><td colspan="2">&lt; 10 ms</td></tr><tr><td colspan="5">Off</td><td>On</td><td colspan="2">&lt; 10 us</td></tr><tr><td colspan="5">On</td><td>On</td><td colspan="2">&lt; 10 us</td></tr><tr><td colspan="5">On</td><td>Off</td><td colspan="2">&lt; 300 us</td></tr><tr><td colspan="8">Exit latency to POWER_STATE_0 is measured from when the MAC changes the Power down value to when the PHY deasserts PHY status. The actual PHY latency must provide enough margin from the indicated limits to enable compliant device behavior per the SATA specification. A MAC must map the available PHY states to SATA states.Note: PLL shutdown is only possible if PowerDown is set to a state with PCLK off.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="24">PowerDown[3:0]DisplayPortMode</td><td rowspan="24">N/A</td><td colspan="5">DisplayPort mode power states:</td><td rowspan="18">DisplayPort</td></tr><tr><td>[3]</td><td>[2]</td><td>[1]</td><td>[0]</td><td>Description</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>POWER_STATE_0Operational state</td></tr><tr><td>0</td><td>0</td><td>0</td><td>1</td><td>POWER_STATE_1Phy specific</td></tr><tr><td>0</td><td>0</td><td>1</td><td>0</td><td>POWER_STATE_2Phy specific</td></tr><tr><td>0</td><td>0</td><td>1</td><td>1</td><td>POWER_STATE_3Phy specific</td></tr><tr><td>0</td><td>1</td><td>0</td><td>0</td><td>POWER_STATE_4Phy specific</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td><td>POWER_STATE_5Phy specific</td></tr><tr><td>0</td><td>1</td><td>1</td><td>0</td><td>POWER_STATE_6Phy specific</td></tr><tr><td>0</td><td>1</td><td>1</td><td>1</td><td>POWER_STATE_7Phy specific</td></tr><tr><td>1</td><td>0</td><td>0</td><td>0</td><td>POWER_STATE_8Phy specific</td></tr><tr><td>1</td><td>0</td><td>0</td><td>1</td><td>POWER_STATE_9Phy specific</td></tr><tr><td>1</td><td>0</td><td>1</td><td>0</td><td>POWER_STATE_10Phy specific</td></tr><tr><td>1</td><td>0</td><td>1</td><td>1</td><td>POWER_STATE_11Phy specific</td></tr><tr><td>1</td><td>1</td><td>0</td><td>0</td><td>POWER_STATE_12Phy specific</td></tr><tr><td>1</td><td>1</td><td>0</td><td>1</td><td>POWER_STATE_13Phy specific</td></tr><tr><td>1</td><td>1</td><td>1</td><td>0</td><td>POWER_STATE_14Phy specific</td></tr><tr><td>1</td><td>1</td><td>1</td><td>1</td><td>POWER_STATE_15Phy specific</td></tr><tr><td colspan="6">A PIPE compliant DPRX PHY is recommended to support the following power states, although the mapping to the above power state encodings is PHY implementation specific:</td></tr><tr><td colspan="2">MainLink RX</td><td colspan="2">Aux Link</td><td>ExitLatency</td><td>Required</td></tr><tr><td colspan="2">Enabled</td><td colspan="2">Enabled</td><td>N/A</td><td>Yes</td></tr><tr><td colspan="2">Disabled</td><td colspan="2">Enabledfordifferential signalmonitoring</td><td>&lt;1ms</td><td>Yes</td></tr><tr><td colspan="2">Disabled</td><td colspan="2">Enabledfordifferential signalmonitoring</td><td>&lt;80ms</td><td>No</td></tr><tr><td colspan="2">Disabled</td><td colspan="2">Enabled</td><td>&lt;0.5us</td><td>Yes foreDP</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td>Disabled</td><td>Enabled</td><td>&lt;20us</td><td>Yes for eDP only</td><td></td></tr><tr><td colspan="7">A PIPE compliant DPTX PHY is recommended to support the following power states, although the mapping to specific power state encodings is PHY implementation specific: (TBD: may want to specify exit latency)</td></tr><tr><td colspan="3">Main Link TX</td><td colspan="2">Aux Link</td><td colspan="2">DP_PWR</td></tr><tr><td colspan="3">Enabled</td><td colspan="2">Enabled</td><td colspan="2">Enabled</td></tr><tr><td colspan="3">Disabled</td><td colspan="2">Enabled</td><td colspan="2">Enabled</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="5">RxEIDetectDis able</td><td rowspan="5">Hig h</td><td colspan="5">PCIe: 
Optionally implemented to facilitate PCIe L1 
substate management. When asserted, this signal 
asynchronously disables the receiver Electrical Idle 
detect logic, forcing the RxEleclde PHY output to a 
value of ‘1’. If this signal transitions to deasserted 
after being asserted, the RxEleclde output shall be 
forced to a high value until the Electrical Idle 
detect logic is functional. 
The PHY may choose to support managing L1 
substates via this signal and the 
TxCommonModeDisable signal instead of the 
PowerDown[3:0] signal. In this case, the 
PowerDown[3:0] signal must be held at a constant 
value through the L1 substate transitions. 
In addition to legacy states, the following are the 
minimum combinations required to be implemented 
by designs that support L1 substates:</td><td>PCIe, 
USB</td></tr><tr><td>PC 
LK 
State 
e</td><td>TX Common 
Mode State</td><td>RxElecIdle 
Supported</td><td>When 
to 
return 
PhySt 
atus 
when 
exitin 
g?</td><td>Exit 
Latency 
to P0</td><td></td></tr><tr><td>Off</td><td>TxCommonMode 
Disable = ‘1’</td><td>RxEIDetectDi 
sable=&#x27;1&#x27;</td><td>Before 
transm 
it 
comm 
on 
mode 
establi 
shed</td><td>Impleme 
nation 
Specific</td><td></td></tr><tr><td>Off</td><td>TxCommonMode 
Disable=&#x27;0&#x27;</td><td>RxEIDetectDi 
sable=&#x27;1&#x27;</td><td>N/A</td><td>Impleme 
nation 
Specific</td><td></td></tr><tr><td colspan="5">USB: 
This signal may be optionally implemented by the PHY 
to allow the MAC to disable the LFPS circuit to provide 
power savings. The PHY datasheet specifies whether 
this usage is available.</td><td></td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>TxCommonModeDisable</td><td>Hig h</td><td>Optionally implemented by the PHY to facilitate L1 substate management. When asserted, this signal asynchronously disables the transmitter DC common mode logic. Note: The PHY may choose to support managing L1 substates via this signal and the RxEIDetectDisable signal instead of the PowerDown[3:0] signal.
This signal is only valid when PowerDown is at a value that supports L1 substate management via TxCommonModeDisable and RxEIDetectDisable.
This signal is only used by PHYs that support PCIe L1 substates.</td><td>PCIe</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="37">Rate[3:0]</td><td rowspan="37">N/A</td><td colspan="2">Control the link signaling rate. 
PCI Express Mode:</td><td rowspan="37">PCIe, SATA, USB, Display Port, Converged IO</td></tr><tr><td>Value</td><td>Description</td></tr><tr><td>0</td><td>Use 2.5 GT/s signaling rate</td></tr><tr><td>1</td><td>Use 5.0 GT/s signaling rate</td></tr><tr><td>2</td><td>Use 8.0 GT/s signaling rate</td></tr><tr><td>3</td><td>Use 16.0 GT/s signaling rate</td></tr><tr><td>4</td><td>Use 32.0 GT/ signaling rate</td></tr><tr><td>5 thru 15</td><td>Reserved</td></tr><tr><td colspan="2">Sata Mode:</td></tr><tr><td>Value</td><td>Description</td></tr><tr><td>0</td><td>Use 1.5 GT/s signaling rate</td></tr><tr><td>1</td><td>Use 3.0 GT/s signaling rate</td></tr><tr><td>2</td><td>Use 6.0 GT/s signaling rate</td></tr><tr><td>3 thru 15</td><td>Reserved</td></tr><tr><td colspan="2">USB Mode:</td></tr><tr><td>Value</td><td>Description</td></tr><tr><td>0</td><td>Use 5.0 GT/s signaling rate</td></tr><tr><td>1</td><td>Use 10.0 GT/s signaling rate</td></tr><tr><td>2</td><td>Reserved</td></tr><tr><td>3 thru 15</td><td>Reserved</td></tr><tr><td colspan="2">DisplayPort Mode:</td></tr><tr><td>Value</td><td>Description</td></tr><tr><td>0</td><td>Use 1.62 Gbps signaling rate</td></tr><tr><td>1</td><td>Use 2.7 Gbps signaling rate</td></tr><tr><td>2</td><td>Use 5.4 Gbps signaling rate</td></tr><tr><td>3</td><td>Use 8.1 Gbps signaling rate</td></tr><tr><td>4</td><td>Use 2.16 Gbps signaling rate</td></tr><tr><td>5</td><td>Use 2.43 Gbps signaling rate</td></tr><tr><td>6</td><td>Use 3.24 Gbps signaling rate</td></tr><tr><td>7</td><td>Use 4.32 Gbps signaling rate</td></tr><tr><td>8 thru 15</td><td>Reserved</td></tr><tr><td colspan="2">Converged IO Mode:</td></tr><tr><td>Value</td><td>Description</td></tr><tr><td>0</td><td>Use 10.0 GT/s signaling rate</td></tr><tr><td>1</td><td>Use 20.0 GT/s signaling rate</td></tr><tr><td>2 thru 15</td><td>Reserved</td></tr><tr><td colspan="2">PIPE implementations that only support one</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td colspan="2">signaling rate do not implement this signal.</td><td></td></tr><tr><td rowspan="15">Width[1:0]</td><td rowspan="15">N/A</td><td colspan="2">Controls the PIPE data path width. For SerDes architecture, this applies only to the transmit side and RxWidth[1:0] controls the receive side.</td><td rowspan="13">PCIe, SATA, USB, Display Port</td></tr><tr><td colspan="2">If EncodeDecodeBypass is &#x27;0&#x27;</td></tr><tr><td>Value</td><td>Datapath Width</td></tr><tr><td>0</td><td>8 bits</td></tr><tr><td>1</td><td>16 bits</td></tr><tr><td>2</td><td>32 bits</td></tr><tr><td>3</td><td>Reserved</td></tr><tr><td colspan="2">If EncodeDecodeBypass is &#x27;1&#x27; or in SerDes architecture</td></tr><tr><td>Value</td><td>Datapath Width</td></tr><tr><td>0</td><td>10 bits</td></tr><tr><td>1</td><td>20 bits</td></tr><tr><td>2</td><td>40 bits</td></tr><tr><td>3</td><td>80 bits (PCIe SerDes only)</td></tr><tr><td colspan="3">Note: PHYs that support greater than x4 link width must provide option of 32-bit data width or smaller.</td></tr><tr><td colspan="3">PIPE implementations that only support one option at each signaling rate do not implement this signal.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="44">PCLK Rate[4:0]</td><td rowspan="44">N/A</td><td colspan="2">Control the PIPE PCLK rate</td><td rowspan="44">PCIe, SATA, USB, Display Port</td></tr><tr><td colspan="2">SATA Mode:</td></tr><tr><td colspan="2">0 37.5 Mhz</td></tr><tr><td colspan="2">1 75 Mhz</td></tr><tr><td colspan="2">2 150 Mhz</td></tr><tr><td colspan="2">3 300 Mhz</td></tr><tr><td colspan="2">4 600 Mhrz</td></tr><tr><td colspan="2">All others Reserved</td></tr><tr><td colspan="2">PCI Express Mode:</td></tr><tr><td colspan="2">0 62.5 Mhz</td></tr><tr><td colspan="2">1 125 Mhz</td></tr><tr><td colspan="2">2 250 Mhz</td></tr><tr><td colspan="2">3 500 Mhz</td></tr><tr><td colspan="2">4 1000 Mhz</td></tr><tr><td colspan="2">5 2000 Mhz</td></tr><tr><td colspan="2">6 4000 Mhz</td></tr><tr><td colspan="2">All others Reserved</td></tr><tr><td colspan="2">USB Mode:</td></tr><tr><td colspan="2">0 125 Mhz</td></tr><tr><td colspan="2">1 250 Mhz</td></tr><tr><td colspan="2">2 312.5 Mhz (10 GT/s)</td></tr><tr><td colspan="2">3 500 Mhz</td></tr><tr><td colspan="2">4 625 Mhz (10 GT/s)</td></tr><tr><td colspan="2">5 1250 Mhz (10 GT/s)</td></tr><tr><td colspan="2">All others Reserved</td></tr><tr><td colspan="2">DisplayPort Mode:</td></tr><tr><td>Value</td><td>Rate</td></tr><tr><td>0</td><td>40.5 Mhz</td></tr><tr><td>1</td><td>62.52 Mhz</td></tr><tr><td>2</td><td>81 Mhz</td></tr><tr><td>3</td><td>135 Mhz</td></tr><tr><td>4</td><td>162 Mhz</td></tr><tr><td>5</td><td>202.5 Mhz</td></tr><tr><td>6</td><td>270 Mhz</td></tr><tr><td>7</td><td>405 Mhz</td></tr><tr><td>8</td><td>540 Mhz</td></tr><tr><td>9</td><td>810 Mhz</td></tr><tr><td>10</td><td>54 Mhz</td></tr><tr><td>11</td><td>60.75 Mhz</td></tr><tr><td>12</td><td>108 Mhz</td></tr><tr><td>13</td><td>121.5 Mhz</td></tr><tr><td>14</td><td>160 Mhz</td></tr><tr><td>15</td><td>216 Mhz</td></tr><tr><td>16</td><td>243 Mhz</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="4"></td><td rowspan="4"></td><td>17</td><td>324 Mhz</td><td></td></tr><tr><td>18</td><td>432 Mhz</td><td></td></tr><tr><td>All others</td><td>Reserved</td><td></td></tr><tr><td colspan="2">Converged IO Mode:This signal is not used.PIPE implementations that do not support morethan one PCLK rate for any analog signaling rate do not implement this signal.</td><td></td></tr><tr><td rowspan="5">RXTermination</td><td rowspan="5">Hig h</td><td colspan="2">Controls presence of receiver terminations:</td><td rowspan="5">USB,PCIe</td></tr><tr><td>Value</td><td>Description</td></tr><tr><td>0</td><td>Terminations removed</td></tr><tr><td>1</td><td>Terminations present</td></tr><tr><td colspan="2">Implementation of this signal is only required forPHYs that support USB mode; this signal is optionalfor other protocols.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="12">RxStandby</td><td rowspan="12">Low</td><td>SATA Mode: 
Controls whether the PHY RX is active when the PHY is in any power state with PCLK on. 
0 – Active 
1 – Standby</td><td rowspan="12">PCIe, SATA, USB, Converged IO</td></tr><tr><td>RxStandby is ignored when the PHY is in any power state where the high speed receiver is always off.</td></tr><tr><td>PCI Express Mode:</td></tr><tr><td>Controls whether the PHY RX is active when the PHY is in P0 or P0s.</td></tr><tr><td>0 – Active</td></tr><tr><td>1 – Standby</td></tr><tr><td>RxStandby is ignored when the PHY is in states other than P0 or P0s.</td></tr><tr><td>USB Mode and Converged IO Mode:</td></tr><tr><td>Controls whether the PHY RX is active when the PHY is in any power state with PCLK on.</td></tr><tr><td>0 – Active</td></tr><tr><td>1 – Standby</td></tr><tr><td>RxStandby is ignored when the PHY is in any power state where the high speed receiver is always off.</td></tr></table>


Table 6-6. Command Interface Output Signals


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>Ref_clkRequired #</td><td>Low</td><td>This signal is deasserted by the PHY when the reference clock can be safely removed in low power states. This signal shall remain asserted low in all states except P2 and PowerDown states assigned to L1 substate support. While in P2 or L1 substate PowerDown states, the PHY deasserts this signal when it is ready for reference clock removal. While in P2 or L1 substate PowerDown states, the PHY asserts this signal when it detects a P2 or L1 substate exit request. This signal is optionally implemented by the PHY. The MAC is required to prevent CLKREQ# from being deasserted if this signal is asserted.</td><td>PCIe</td></tr><tr><td>RxStandbyStatus</td><td>Low</td><td>SATA Mode and PCI Express Mode and Converged IO Mode: The PHY uses this signal to indicate its RxStandby state. 0 – Active 1 – Standby RxStandbyStatus reflects the state of the high speed receiver. The high speed receiver is always off in PHY states that do not provide PCLK. PCI Express Mode: RxStandbyStatus is undefined when the power state is P1 or P2. This signal is not applicable to USB mode.</td><td>PCIe, SATA, Converged IO</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 6.1.3 Status Interface


Table 6-7. Status Interface Input Signals


<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>PclkChangeAck</td><td>High</td><td>Only used when PCLK is a PHY input. Asserted by the MAC when a PCLK rate change or rate change or, if required, width change is complete and stable. After the MAC asserts PclkChangeAck the PHY responds by asserting PhyStatus for one cyle and de-asserts PclkChangeOk at the same time as PhyStatus. The controller shall deassert PclkChangeAck when PclkChangeOk is sampled low. This signal is not used by any PhyMode that does not perform dynamic rate changes.</td><td>PCIe, SATA, USB</td></tr><tr><td>AsyncPowerChangeAck</td><td>High</td><td>Only used when transitioning between two power states without PCLK. After the PHY asserts PhyStatus to acknowledge the power state change the MAC responds by asserting AsyncPowerChangeAck until it samples PhyStatus deasserted. Implementation of this signal is only required for PHYs that support PCI Express L1 PM Substates managed via the PowerDown signal.</td><td>PCIe</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Table 6-8. Status Interface Output Signals

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>RxValid</td><td>High</td><td>Indicates symbol lock and valid data on RxData and RxDataK and further qualifies RxDataValid when used.PCI Express Mode at 8 GT/s and 16 GT/s and 32 GT/s and USB Mode at 10 GT/s only: When BlockAlignControl=1: - RxValid indicates that the block aligner is conceptually in the &quot;Aligned&quot; state (see PCI Express or USB 3.1 Spec) - If the block aligner transitions &quot;Aligned&quot; -&gt; &quot;Unaligned&quot; state RxValid can deassert anywhere within a block- If the block aligner transitions &quot;Unaligned&quot; -&gt; &quot;Aligned&quot; state RxValid is asserted at the start of a blockNote that a PHY is not required to force its block aligner to the unaligned state when BlockAlignControl transitions to one.When BlockAlignControl=0:- RxValid is constantly high indicating that the block aligner is conceptually in the &quot;Locked&quot; state (see PCI Express or USB 3.1 Spec). RxValid can be dropped on detecting and elastic buffer underflow or overflow. If de-asserted it must not re-assert while BlockAlignControl is de-asserted.In the SerDes architecture, RxValid is used to indicate that the recovered clock is stable. The MAC can start symbol or block lock after RxValid is asserted.</td><td>PCIe, USB, SATA DisplayPort RX</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>PhyStatus</td><td>High</td><td>Used to communicate completion of several PHY functions including stable PCLK and/or Max PCLK (depending on clocking mode) after Reset# deassertion, power management state transitions, rate change, and receiver detection. When this signal transitions during entry and exit from any PHY state where PCLK is not provided, then the signaling is asynchronous. In error situations (where the PHY fails to assert PhyStatus) the MAC can take MAC-specific error recovery actions.</td><td>PCIe, SATA, USB, DisplayPort, Converged IO</td></tr><tr><td>RxEleclldle</td><td>High</td><td>Indicates receiver detection of an electrical idle. While deasserted with the PHY in P2 (PCI Express mode) or the PHY in P0, P1, P2, or P3 (USB Mode and Converged IO Mode), indicates detection of either: PCI Express Mode: a beacon. USB Mode and Converged IO Mode : LFPS This is an asynchronous signal. See RxEIDetectDisable for additional information. PCI Express Mode: It is required at the 5.0 GT/s, 8.0 GT/s, 16 GT/s, and 32 GT/s rates that a MAC uses logic to detect electrical idle entry instead of relying on the RxEleclldle signal. Sata Mode: The time the signal is asserted must match the actual idle time on the analog bus within -16/+0 ns.</td><td>PCIe, SATA, USB, Converged IO</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="6">RxStatus[2:0]</td><td rowspan="6">N/A</td><td colspan="4">Encodes receiver status and error codes for the received data stream when receiving data.</td><td rowspan="6">PCIe, SATA, USB</td></tr><tr><td>[2]</td><td>[1]</td><td>[0]</td><td>Description</td></tr><tr><td>0</td><td>0</td><td>0</td><td>Received data OK</td></tr><tr><td>0</td><td>0</td><td>1</td><td>PCI Express Mode: 1 
SKP added 
USB Mode: 1 
SKP 
Ordered Set added 
Sata Mode: 1 
ALIGN added 
Asserted with first byte of Align that was added. An align may only be added in conjunction with receiving one or more aligns in the data stream and only when the elasticity buffer is operating in half full mode</td></tr><tr><td>0</td><td>1</td><td>0</td><td>PCI Express Mode: 1 
SKP removed 
USB Mode: 1 
SKP 
Ordered Set removed 
SATA Mode: 1 or more 
ALIGNs removed 
This status is asserted with first non ALIGN byte following an 
ALIGN. This status message is applicable to both EB buffer modes.</td></tr><tr><td>0</td><td>1</td><td>1</td><td>PCI Express and USB Modes: 
Receiver detected 
SATA Mode: Misalign 
Signaled on the first symbol of an ALIGN that was received misaligned in elasticity buffer nominal half full mode. Signaled on the first data following an align in elasticity buffer nominal empty mode.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="5"></td><td rowspan="5"></td><td>1</td><td>0</td><td>0</td><td>Both 8B/10B(128B/130B5) decode error and (optionally)Receive Disparity error Note: This error is never reported if EncodeDecodeBypass is asserted.</td><td rowspan="5"></td></tr><tr><td>1</td><td>0</td><td>1</td><td>Elastic Buffer overflow</td></tr><tr><td>1</td><td>1</td><td>0</td><td>Elastic Buffer underflow.This error code is not used if the elasticity buffer is operating in the nominal buffer empty mode.</td></tr><tr><td>1</td><td>1</td><td>1</td><td>Receive disparity error(Reserved if Receive Disparity error is reported with code 0b100)Not used if EncodeDecodeBypass is asserted.For USB3 Gen2, indicates &quot;SKP Corrected&quot;.</td></tr><tr><td colspan="4">The only status applicable to SerDes architecture is &#x27;Receiver detected&#x27; (0x3).</td></tr><tr><td>PowerPresent</td><td>High</td><td colspan="4">USB Mode: Indicates the presence of VBUS.Implementation of this signal is only required for PHYs that support USB mode.</td><td>USB</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>PclkChangeOk</td><td>High</td><td>Only used when PCLK is a PHY input. Asserted by the PHY when it is ready for the MAC to change the PCLK rate or Rate or, if required, width. The PHY shall only assert this signal after the MAC has requested a PCLK rate change by changing PCLK_Rate or rate change by changing Rate or, if required, a width change by changing Width. This signal is not used for DisplayPort or Converged IO Mode.</td><td>PCIe, SATA, USB</td></tr></table>

# 6.1.4 Message Bus Interface

The message bus interface provides a way to initiate and participate in non-latency sensitive PIPEoperations using a small number of wires, and it enables future PIPE operations to be addedwithout adding additional wires. The use of this interface requires the device to be in a powerstate with PCLK running. Control and status bits used for PIPE operations are mapped into 8-bitregisters that are hosted in 12-bit address spaces in the PHY and the MAC. The registers areaccessed via read and write commands driven over the signals listed in Table 6-9. These signalsare synchronous with PCLK and are reset with Reset#. The specific commands and framing ofthe transactions sent over the message bus interface are described in the following subsections.


Table 6-9 Message Bus Interface Signals


<table><tr><td>Name</td><td>Direction</td><td>Description</td></tr><tr><td>M2P_MessageBus[7:0]</td><td>Input</td><td>The MAC multiplexes command, any required address, and any required data for sending read and write requests to access PHY PIPE registers and for sending read completion responses and write ack responses to PHY initiated requests.</td></tr><tr><td>P2M_MessageBus[7:0]</td><td>Output</td><td>The PHY multiplexes command, any required address, and any required data for sending read and write requests to access MAC PIPE registers and for sending read completion responses and write ack responses to MAC initiated requests.</td></tr></table>

# 6.1.4.1 Message Bus Interface Commands

The 4-bit commands used for accessing the PIPE registers across the message bus are defined inTable 6-10. A transaction consists of a command and any associated address and data, as

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

specified in the table. The table also specifies the number of PCLK cycles that it takes to transferthe transaction across the message bus interface. The order in which the bits are transferredacross the interface are illustrated in Figure 6-1, Figure 6-2, Figure 6-3, and Figure 6-4.

To address the case where multiple PIPE interface signals can change on the same PCLK, theconcept of write_uncommitted and write_committed is introduced. A series ofwrite_uncommitted transactions followed by one write_committed transaction provides amechanism by which all the uncommitted writes and the final committed write are executed in anatomic manner, thus taking effect during the same PCLK cycle.

To enable the write_uncommitted command, designs must implement a write buffer in the PHYand the MAC, where each write buffer entry can accommodate the three bytes worth ofinformation associated with each write transaction. The minimum write buffer depth required isfive; however, this number may increase in the future when new PIPE operations are mapped intothe message bus interface.


Table 6-10 Message Bus Commands


<table><tr><td>Encoding</td><td>Command</td><td>Description</td><td>Required Fields</td><td>Cycles to Transmit</td></tr><tr><td>4‘b0000</td><td>NOP</td><td>Idle. See Figure 6-1.</td><td>Command[3:0]</td><td>1</td></tr><tr><td>4‘b0001</td><td>write_uncommitted</td><td>The current write should be saved off into a write buffer and its associated data values are updated into the relevant PIPE register at a future time when a write_committed is received. This is useful for signals that must change in the same cycle but that are distributed among multiple registers. See Figure 6-4.</td><td>Command[3:0], Address[11:0], Data[7:0]</td><td>3</td></tr><tr><td>4‘b0010</td><td>write_committed</td><td>The current write as well as any previously uncommitted writes saved into the write buffer should be committed, i.e. their values should be updated into the PIPE registers. Once a write_committed is sent, no new writes, whether committed or uncommitted, may be sent until a write_ack is received. See Figure 6-4.</td><td>Command[3:0], Address[11:0], Data[7:0]</td><td>3</td></tr><tr><td>4‘b0011</td><td>read</td><td>Used to read contents of a PIPE register. Only one read can be outstanding at a time in each direction. See</td><td>Command[3:0], Address[11:0]</td><td>2</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td>Figure 6-2.</td><td></td><td></td></tr><tr><td>4‘b0100</td><td>read completion</td><td>Data response to a read.
See Figure 6-3.</td><td>Command[3:0],
Data[7:0]</td><td>2</td></tr><tr><td>4‘b0101</td><td>write_ACK</td><td>Used to acknowledge receipt of a write_committed and readiness to accept another write. The ack is sent when the write buffer is flushed and the resulting PIPE operation is guaranteed to start in a deterministic amount of time. Note: This does not provide confirmation that the PIPE operation triggered by the write has completed. See Figure 6-1.</td><td>Command[3:0]</td><td>1</td></tr><tr><td>All others</td><td>Reserved</td><td>N/A</td><td>N/A</td><td>N/A</td></tr></table>

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/dc48904512755c8e0cb590a81653eec5b097ebd6a990927c68658a30edefa198.jpg)



Figure 6-1. Command Only Message Bus Transaction Timing (NOP,write_ack)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/cd98cb0acd3f29e6c5f8fa7d2d1fdd8b4455a0e28321edb28900845d2ad3f5de.jpg)



Figure 6-2. Command+Address Message Bus Transaction Timing (Read)


<table><tr><td colspan="8">M2P/P2M_MessageBus</td></tr><tr><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>t</td><td>Cmd[3:0]</td><td>0000b</td></tr><tr><td>t+1</td><td colspan="2">Data[7:0]</td></tr></table>

Figure 6-3. Command+Data Message Bus Transaction Timing (Readcompletion)

<table><tr><td colspan="8">M2P/P2M_MessageBus</td></tr><tr><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td></tr><tr><td>t</td><td colspan="3">Cmd[3:0]</td><td colspan="4">Addr[11:8]</td></tr><tr><td>t+1</td><td colspan="7">Addr[7:0]</td></tr><tr><td>t+2</td><td colspan="7">Data[7:0]</td></tr></table>

Figure 6-4. Command+Address+Data Message Bus Transaction Timing(Write_uncommitted, Write_committed)

# 6.1.4.2 Message Bus Interface Framing

The framing of transactions is implicitly derived by adhering to the following rules:

1. All zeroes must be driven on the message bus when idle.

2. An idle to non-idle transition indicates the start of a transaction; a new transaction canstart immediately the cycle after the end of the previous transaction without anintervening idle.

3. The number of cycles to transmit a transaction depends on the command and isspecified in Table 6-10.

4. The cycles associated with one transaction must be transferred in contiguous cycles.

Figure 6-5 illustrates the framing of a couple of transactions on the message bus. The start of thefirst transaction is inferred by the idle to non-idle transition. The command is decoded as a write,which takes three cycles to transmit. Since the cycle following the end of the write is non-idle, itis inferred to be the start of the next transaction, which is decoded to be another write that takesthree cycles to transmit.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/d6107608fadc251bcef15b2588a2e5132253fc244ef55bf8c3d85cdf1948280f.jpg)



Figure 6-5. Message Bus Transaction Framing


# 6.2 PHY/MAC Interface Signals – SerDes Architecture Only

This section describes any signals for SerDes architecture that are required in addition to thosedefined in section 6.1.

# 6.2.1 Data Interface

Table 6-11. SerDes Only: Receive Data Interface Output Signals

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td rowspan="2">RxCLK</td><td rowspan="2">Rising Edge</td><td>This clock signal is only used in the SerDes architecture.</td><td rowspan="2">PCIe, USB, DisplayPort RX, Converged IO</td></tr><tr><td>Recovered clock used for RxData in the SerDes architecture.</td></tr></table>

# 6.2.2 Command Interface


Table 6-12. SerDes Only: Command Interface Input Signals


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td rowspan="7">RxWidth[1:0]</td><td rowspan="7">N/A</td><td>This signal is only used in the SerDes architecture.
Controls the PIPE receive data path width</td><td>PCIe, SATA, USB, DisplayPort</td></tr><tr><td>Value</td><td>Datapath Width</td></tr><tr><td>0</td><td>10 bits</td></tr><tr><td>1</td><td>20 bits</td></tr><tr><td>2</td><td>40 bits</td></tr><tr><td>3</td><td>80 bits (PCIe SerDes only)</td></tr><tr><td colspan="2">Note: PHYs that support greater than x4 link width must provide option of 32-bit data width or smaller.
PIPE implementations that only support one option at each signaling rate do not implement this signal.</td></tr></table>

# 6.3 PHY/MAC Interface Signals – Original PIPE Only

This section describes signals for Original PIPE that are required in addition to those define insection 6.1.

# 6.3.1 Data Interface

Table 6-13. Original PIPE Only: Transmit Data Interface Input Signals

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>TxDataK[7:0] for 64-bit interface TxDataK[3:0] for 32-bit interface TxDataK[1:0]for 16-bit interface TxDataK for 8-bit interface</td><td>N/A</td><td>This signal is not used in the SerDes architecture. Data/Control for the symbols of transmit data. For 64-bit interfaces, Bit 0 corresponds to the low-byte of TxData and bit 7 corresponds to the upper byte. For 32-bit interfaces, Bit 0 corresponds to the low-byte of TxData, Bit3 corresponds to the upper byte. For 16-bit interfaces, Bit 0 corresponds to the low-byte of TxData, Bit 1 to the upper byte. A value of zero indicates a data byte, a value of 1 indicates a control byte. Not used in PCI Express mode at 8 GT/s, 16 GT/s, or 32 GT/s. Not used in USB mode at 10 GT/s. Not used in Converged IO mode.</td><td>PCIe, SATA, USB</td></tr><tr><td>TxStartBlock</td><td>N/A</td><td>This signal is not used in the SerDes architecture. PCI Express Mode and USB Mode: Only used at the 8.0 GT/s, 16 GT/s, and 32 GT/s PCI Express signaling rates and the 10 GT/s USB signaling rate. This signals allow the MAC to tell the PHY the starting byte for a 128b block. The starting byte for a 128b block must always start with byte 0 of the data interface.</td><td>PCIe, USB</td></tr></table>


Table 6-14. Original PIPE Only: Receive Data Interface Output Signals


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>RxDataK[3:0] for 32-bit interface RxDataK[1:0] for 16-bit interface RxDataK for 8-bit interface</td><td>N/A</td><td>This signal is not used in the SerDes architecture. Data/Control bit for the symbols of receive data. For 32-bit interfaces, Bit 0 corresponds to the low-byte of RxData, Bit3 corresponds to the upper byte. For 16-bit interface, Bit 0 corresponds to the low-byte of RxData[15:0], Bit 1 to the upper byte. A value of zero indicates a data byte; a value of 1 indicates a control byte. Not used in PCI Express mode at 8 GT/s, 16 GT/s, or 32 GT/s or USB mode at 10 GT/s or Converged IO mode. When the PHY is in a SATA mode, the first valid data following an ALIGN primitive must appear as byte 0 in the receive data.</td><td>PCIe, SATA, USB</td></tr><tr><td>RxDataValid</td><td>N/A</td><td>This signal is not used in the SerDes architecture. PCI Express Mode and SATA Mode and USB Mode: This signal allows the PHY to instruct the MAC to ignore the data interface for one clock cycle. A value of one indicates the MAC will use the data, a value of zero indicates the MAC will not use the data. RxDataValid shall not assert when RXvalid is de-asserted in PHY modes that require the use of RxDataValid. If a PHY supports the RxDataValid signal it shall keep RxDataValid asserted when the PHY is in a mode that does not require the signal. The MAC may ignore RxDataValid when it is in a mode that does not require the signal.</td><td>PCIe, SATA, USB</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="3">RxStartBlock</td><td rowspan="3">N/A</td><td>This signal is not used in the SerDes architecture.</td><td>PCIe, USB</td></tr><tr><td>PCI Express Mode and USB Mode: Only used at the 8.0 GT/s, 16 GT/s, or 32 GT/s PCI Express signaling rates and the 10 GT/s USB signaling rate. This signal allows the PHY to tell the MAC the starting byte for a 128b block. The starting byte for a 128b block must always start with byte 0 of the data interface.</td><td rowspan="2">Note: If there is an invalid sync header decoded on RxSyncHeader[3:0] and block alignment is still present (RxCValid == 1), then the PHY will assert RxStartBlock with the invalid sync header on RxSyncHeader[3:0]</td></tr><tr><td>RxStartBlock shall not assert when RxValid is de-asserted</td></tr></table>

# 6.3.2 Command Interface


Table 6-15. Command Interface Input Signals


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>TxCompliance</td><td>High</td><td>This signal is not used in the SerDes architecture.PCI Express Mode: Sets the running disparity to negative. Used when transmitting the PCI Express compliance pattern. Implementation of this signal is only required for PHYs that support PCI Express mode. This signal is sampled by TxDataValid.</td><td>PCIe</td></tr><tr><td>TxSyncHeader[3:0]</td><td>N/A</td><td>This signal is not used in the SerDes architecture. PCI Express Mode: Only the lower two bits ([1:0]) are utilized. Provides the sync header for the PHY to use in the next 130b block. The PHY reads this value when the TXStartBlock signal is asserted. This signal is only used at the 8.0 GT/s, 16 GT/s, and 32 GT/s signaling rates. USB Mode: Provides the sync header for the PHY to use in the next 132b block. The PHY reads this value when the TXStartBlock signal is asserted. This signal is only used at the 10 GT/s signaling rate.</td><td>PCIe, USB</td></tr></table>


Table 6-16. Original PIPE Only: Command Interface Output Signals


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td rowspan="3">RxSyncHeader[3:0]</td><td rowspan="3">N/A</td><td>This signal is not used in the SerDes architecture.</td><td>PCIe, USB</td></tr><tr><td>PCI Express Mode: Only the lower two bits ([1:0]) are utilized. Provides the sync header for the MAC to use with the next 128b block. The MAC reads this value when the RxStartBlock signal is asserted. This signal is only used at the 8.0 GT/s, 16 GT/s, and 32 GT/s signaling rates.</td><td rowspan="2">USB Mode: Provides the sync header for the MAC to use with the next 128b block. The MAC reads this value when the RxStartBlock signal is asserted. This signal is only used at the 10.0 GT/s signaling rate.</td></tr><tr><td>Note: The PHY shall pass blocks and headers normally across the PIPE interface even if the decoded SyncHeader is invalid.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Table 6-17. Original PIPE only: Status Interface Output Signals

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>AlignDetect</td><td>High</td><td>This signal is not used in the SerDes architecture.Indicates receiver detection of an Align.A PHY is only required to assert this signal when the Elasticity Buffer is running in nominal empty mode.The PHY shall only toggle this signal after obtaining bit and symbol lock.Each ALIGN received shall map to AlignDetect being asserted for one PCLK.The spacing between PCLK pulses for ALIGNs should map analog spacing of received ALIGNs as closely as possible. However there is no guarantee to have PCLK domain spacing between back to back AlignDetect pulses match the analog spacing exactly due to differences in the receive clock domain and the PCLK domain.For example:1.5 GT/s with 8-bit data pathPCLK=150MHz, the nominal spacing is 4 PCLK&#x27;s.3.0 GT/s with 8-bit data pathPCLK=300MHz, the nominal spacing is 4 PCLK&#x27;s.6.0 GT/s with 16-bit data pathPCLK=300MHz, the nominal spacing is every other PCLK.Due to differences in the PCLK and receive clocks, the nominal spacing can be off by one PCLK in either direction. In the example with PCLK rate being equal to Gen3 received clock rate, clock domain crossing could lead to AlignDetect being asserted for consecutive PCLK cycles without gap.</td><td>SATA</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 6.4 External Signals – Common for SerDes and Original PIPETable 6-18. External Input Signals

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>CLK</td><td>Edge</td><td>This differential Input is used to generate the bit-rate clock for the PHY transmitter and receiver. Specs for this clock signal (frequency, jitter, ...) are implementation dependent and must be specified for each implementation. This clock may have a spread spectrum modulation.</td><td>PCIe, SATA, USB, DisplayPort, Converged IO</td></tr><tr><td>PCLK</td><td>Rising Edge</td><td>This signal is relevant for “PCLK as PHY Input” mode only.All data movement across the parallel interface is synchronized to this clock. This clock operates at a frequency set by PCLK Rate. The rising edge of the clock is the reference for all signals. Spread spectrum modulation on this clock is allowed.</td><td>PCIe, SATA, USB, DisplayPort, Converged IO</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Table 6-19. External Output Signals

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Name</td><td>Active Level</td><td>Description</td><td>Relevant Protocols</td></tr><tr><td>PCLK</td><td>Rising Edge</td><td>This signal is relevant for “PCLK as PHY Input” mode only.All data movement across the parallel interface is synchronized to this clock.This clock operates at a frequency set by PCLK Rate. The rising edge of the clock is the reference for all signals. Spread spectrum modulation on this clock is allowed.</td><td>PCIe,SATA,USB,DisplayPort,Converged IO</td></tr><tr><td>Max PCLK</td><td>Rising Edge</td><td>Parallel interface data clock. This fixed rate clock operates at the following rate:PCI Express Mode:Max rate supported Maximum Max PCLK 2.5 GT/s 250 MHz.5.0 GT/s 500 MHz.8.0 GT/s 1000 MHz.16.0 GT/s 2000 MHz.32.0 GT/s 4000 MhzThis clock is provided whenever PCLK is active.SATA Mode:Max rate supported Maximum Max PCLK 1.5 GT/s 150 MHz.3.0 GT/s 300 MHz.6.0 GT/s 600 MHz.This clock is provided whenever PCLK is active.USB Mode:Max rate supported Maximum Max PCLK 5.0 GT/s 500 MHz.10.0 GT/s 1250 MHz.This clock is provided whenever PCLK is active.Spread spectrum modulation on this clock is allowed.This signal is optional for most cases in “PCLK as PHY Output” mode and required for “PCLK as PHY Input” mode</td><td>PCIe,SATA,USB,DisplayPort,Converged IO</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="12">DataBusWidth[1:0]</td><td rowspan="12">N/A</td><td colspan="3">This field reports the width of the data bus that the PHY is configured for. This field is optional. For Original PIPE architecture:</td><td rowspan="12">PCIe, SATA, USB, DisplayPort, Converged IO</td></tr><tr><td>[1]</td><td>[0]</td><td>Description</td></tr><tr><td>0</td><td>0</td><td>32-bit mode</td></tr><tr><td>0</td><td>1</td><td>16-bit mode</td></tr><tr><td>1</td><td>0</td><td>8-bit mode</td></tr><tr><td>1</td><td>1</td><td>Reserved</td></tr><tr><td colspan="3">For SerDes architecture:</td></tr><tr><td>[1]</td><td>[0]</td><td>Description</td></tr><tr><td>0</td><td>0</td><td>10-bit mode</td></tr><tr><td>0</td><td>1</td><td>20-bit mode</td></tr><tr><td>1</td><td>0</td><td>40-bit mode</td></tr><tr><td>1</td><td>1</td><td>80-bit mode</td></tr></table>

# 7 PIPE Message Bus Address Spaces

The PIPE specification defines 12-bit address spaces to enable the message bus interface; theMAC and the PHY each implement unique 12-bit address spaces as shown in Figure 7-1. Theseaddress spaces are used to host registers associated with certain PIPE operations. The MAC andPHY access specific bits in the registers to initiate operations, to participate in handshakes, or toindicate status. The MAC initiates requests on the message bus interface to access registershosted in the PHY address space. The PHY initiates requests on the message bus interface toaccess registers hosted in the MAC address space.

Each 12-bit address space is divided into four main regions: receiver address region, transmitteraddress region, common address region, and vendor specific address region. The receiver addressregion is used to configure and report status related to receiver operation; it spans the 1024KBregion from $1 2 ^ { \circ } \mathrm { h } 0 0 0$ to $1 2 ^ { \circ } \mathrm { h } 3 \mathrm { F F }$ and supports up to two receivers with 512KB allocated to each.The transmitter address region is used to configure and report status related to transmitteroperation; it spans the 1024KB region from $1 2 ^ { \circ } \mathrm { h } 4 0 0$ to 12’h7FF and supports up to twotransmitters, TX1 and TX2, with a 512KB region associated with each. The common addressregion hosts registers relevant to both receiver and transmitter operation; it spans the 1024KBregion from $1 2 \mathrm { ^ { , } h 8 0 0 }$ to 12’hBFF and supports up two sets of Rx/Tx pairs with 512KB allocatedtoward the common registers for each pair. The vendor specific address region is the 1024Kregion from $1 2 \mathrm { { ^ { \circ } h C 0 0 } }$ to 12’hFFF and enables individual vendors to define registers as neededoutside of those defined in this PIPE specification.

As noted above, the address space is defined to support configurable Rx/Tx pairs. Up to twodifferential pairs are assumed to be operational at any one time. Supported combinations are oneRx and one Tx pair, two Tx pairs, or two Rx pairs.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1


Figure 7-1. Message Bus Address Space


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/24aa4ab0d516563f4b9d82c89764d4d44f00b30dfa881b55c4c5b2f0089bf23d.jpg)


The PCIe RX margining operations and elastic buffer depth are controlled via registers hosted inthese address spaces. Additionally, several legacy pipe control and status signals have beenmapped into registers hosted in these address spaces.

The following subsections define the PHY registers and the MAC registers. Individual registerfields are specified as required or optional. In addition, each field has an attribute description ofeither level or 1-cycle assertion. When a level field is written, the value written is maintained bythe hardware until the next write to that field or until a reset occurs. When a 1-cycle field is

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

written to assert the value high, the hardware maintains the assertion for only a single cycle andthen automatically resets the value to zero on the next cycle.

# 7.1 PHY Registers

Table 7-1 lists the PHY registers and their associated address. The details of each register areprovided in the subsections below.

To support configurable pairs, the same registers defined for RX1 are also defined for RX2, thesame registers defined for TX1 are defined for TX2, and the same registers defined for CMN1 aredefined for CMN2. Only two differential pairs are active at a time based on configuration; validcombinations correspond to registers defined in RX1+TX1+CMN1, RX1+RX2+CMN1+CMN2,or TX1+TX2+CMN1+CMN2.

A PHY that does not support configurable pairs only implements registers defined for RX1, TX1,and CMN1.


Table 7-1 PHY Registers


<table><tr><td>Byte Address</td><td>Register Name</td><td>Notes</td></tr><tr><td>12&#x27;h0</td><td>RX1: RX Margin Control0</td><td></td></tr><tr><td>12&#x27;h1</td><td>RX1: RX Margin Control1</td><td></td></tr><tr><td>12&#x27;h2</td><td>RX1: Elastic Buffer Control</td><td>N/A for SerDes Architecture</td></tr><tr><td>12&#x27;h3</td><td>RX1: PHY RX Control0</td><td>N/A for SerDes Architecture</td></tr><tr><td>12&#x27;h4</td><td>RX1: PHY RX Control1</td><td></td></tr><tr><td>12&#x27;h5</td><td>RX1: PHY RX Control2</td><td></td></tr><tr><td>12&#x27;h6</td><td>RX1: PHY RX Control3</td><td></td></tr><tr><td>12&#x27;h7</td><td>RX1: Elastic Buffer Location Update Frequency</td><td>N/A for SerDes Architecture</td></tr><tr><td>12&#x27;h8</td><td>RX1: PHY RX Control4</td><td>N/A for SerDes Architecture</td></tr><tr><td>12&#x27;h9-12&#x27;h1FF</td><td>RX1: Reserved</td><td></td></tr><tr><td>12&#x27;h200 to 12&#x27;h3FF</td><td>RX2: Same registers are defined in this region for RX2 as for RX1 above.</td><td></td></tr><tr><td>12&#x27;h400</td><td>TX1: PHY TX Control0</td><td>N/A for SerDes Architecture</td></tr><tr><td>12&#x27;h401</td><td>TX1: PHY TX Control1</td><td>N/A for SerDes Architecture</td></tr><tr><td>12&#x27;h402</td><td>TX1: PHY TX Control2</td><td></td></tr><tr><td>12&#x27;h403</td><td>TX1: PHY TX Control3</td><td></td></tr><tr><td>12&#x27;h404</td><td>TX1: PHY TX Control4</td><td></td></tr><tr><td>12&#x27;h405</td><td>TX1: PHY TX Control5</td><td></td></tr><tr><td>12&#x27;h406</td><td>TX1: PHY TX Control6</td><td></td></tr><tr><td>12&#x27;h407</td><td>TX1: PHY TX Control7</td><td></td></tr><tr><td>12&#x27;h408</td><td>TX1: PHY TX Control8</td><td></td></tr><tr><td>12&#x27;h409-12&#x27;h5FF</td><td>TX1: Reserved</td><td></td></tr><tr><td>12&#x27;h600-12&#x27;h7FF</td><td>TX2: Same registers are defined in this region for TX2 as for TX1 above</td><td></td></tr><tr><td>12&#x27;h800</td><td>CMN1: PHY Common Control0</td><td>N/A for SerDes Architecture</td></tr><tr><td>12&#x27;h801-12&#x27;h9FF</td><td>CMN1: Reserved</td><td></td></tr><tr><td>12&#x27;hA00-12&#x27;BFF</td><td>CMN2: Same registers are defined in this region for CMN2 as for CMN1 above</td><td></td></tr><tr><td>12&#x27;hC00-</td><td>VDR: Reserved</td><td></td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

12’hFFF

# 7.1.1 Address 0h: RX Margin Control0

This register is used along with RX Margin Control1 to control PCIe Lane Margining at theReceiver.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:4]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[3]</td><td>0h</td><td>1-cycle</td><td>PCIe
(Optional)</td><td>Sample Count Reset – This field is used to reset the ‘Sample Count[6:0]’ field of the RX Margin Status1 register.</td></tr><tr><td>[2]</td><td>0h</td><td>1-cycle</td><td>PCIe
(Optional)</td><td>Error Count Reset – This field is used to reset the ‘Error Count[5:0]’ field of the RX Margin Status2 register.</td></tr><tr><td>[1]</td><td>0h</td><td>Level</td><td>PCIe</td><td>Margin Voltage or Timing – This field is used to select between marginine voltage (1‘b0) or marginine timing (1‘b1). The value can be changed only when marginine is stopped.</td></tr><tr><td>[0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>Start Margin – This field is used to start and stop marginine. A transition from 1‘b0 to 1‘b1 starts the marginine process. A transition from 1‘b1 to 1‘b0 stops the marginine process.</td></tr></table>

# 7.1.2 Address 1h: RX Margin Control1

This register is used along with RX Margin Control0 to control PCIe RX margining.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7]</td><td>0h</td><td>Level</td><td>PCIe</td><td>Margin Direction – This field is used to control time or voltage direction for marginine. For timing marginine, this field steps time left (1’b0) or right (1’b1).6 For voltage marginine, this field steps voltage up (1’b0) or down (1’b1). This value can be changed only when marginine is stopped. This field should be ignored by PHYs that do not support individual time or voltage marginine as advertised in the PHY datasheet.</td></tr><tr><td>[6:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>Margin Offset – This field is used to change the margin offset a number of steps from the default position. This value can be changed even during the marginine process.</td></tr></table>

# 7.1.3 Address 2h: Elastic Buffer Control

This register is used to control the elastic buffer depth, enabling the controller to optimize latencyin nominal half full mode. The ability to control elastic buffer depth is an optional feature that

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

may be especially beneficial for retimers operating in PCIe SRIS mode.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:0]</td><td>0h</td><td>Level</td><td>PCIe (optional)</td><td>Elastic Buffer Depth Control – This field is used to set the elastic buffer depth. The MAC must choose from the supported values advertised in the PHY datasheet. This value can only be changed during transmission of TS1 ordered sets. The PHY performs the adjustment as quickly as possible without waiting for SKPs. The PHY signals completion of elastic buffer depth adjustment by setting the Elastic Buffer Status register.Note: This field is not used in the SerDes architecture.</td></tr></table>

# 7.1.4 Address 3h: PHY RX Control0

This register is used to control receiver functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:2]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td rowspan="5">[1]</td><td rowspan="5">0h</td><td rowspan="5">Level</td><td rowspan="5">PCIe,USB,SATA,Converged IO</td><td>RxPolarity -- This field is used to control polarity inversion on the received data.</td></tr><tr><td>Value Description</td></tr><tr><td>0 PHY does no polarity inversion</td></tr><tr><td>1 PHY does polarity inversion</td></tr><tr><td>Note: This field is not used in the SerDes architecture.</td></tr><tr><td rowspan="7">[0]</td><td rowspan="7">0h</td><td rowspan="7">Level</td><td rowspan="7">PCIe(optional),SATA(optional),USB(optional)</td><td>Elasticity Buffer Mode -- This field is used to select the Elasticity Buffer operating mode.</td></tr><tr><td>Value Description</td></tr><tr><td>0 Nominal Half Full Buffer mode</td></tr><tr><td>1 Nominal Empty Buffer Mode</td></tr><tr><td>This field can only be changed when the receiver is OFF and Pclk is running, e.g. P0 with RXStandby asserted or P1.</td></tr><tr><td>This field is not valid when TxDetectRx/Loopback is asserted. The PHY is responsible for switching to Nominal Half Full Buffer mode when loopback slave is requested. The PCS is responsible for making stream switch and abiding by PCIe base spec rules for slave loopback stream switching, e.g. switch on 10b boundary in 8b/10b modes, etc.</td></tr><tr><td>Note: This field is not used in the SerDes architecture.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 7.1.5 Address 4h: PHY RX Control1

This register is used to control receiver functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:1]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[0]</td><td>0h</td><td>Level</td><td>USB</td><td>RxEqTraining – This field is set to 1’b1 to instruct the receiver to bypass normal operation to perform equalization training. While performing training the state of the RxData interface is undefined.</td></tr></table>

# 7.1.6 Address 5h: PHY RX Control2

This register is used to control receiver functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:3]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[2:0]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr></table>

# 7.1.7 Address 6h: PHY RX Control3

This register is used to control receiver functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:3]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[2]</td><td>0h</td><td>Level</td><td>PCIe</td><td>InvalidRequest – This field is used to indicate that the Link Evaluation feedback requested a link partner TX EQ setting that was out of range. The MAC sets this bit to ‘1’ when it detects an out of range error locally based on calculated link partner transmitter coefficients based on the last valid link equalization feedback or it receives a NACK response from the link partner. The MAC resets this bit to ‘0’ the next time it asserts RxEQEval. When a MAC sets this bit, it shall subsequently ask the PHY to perform an RxEQ evaluation using the last valid setting a second time.
This field is only applicable at the 8.0 GT/s, 16 GT/s, and 32 GT/s signaling rates.</td></tr><tr><td>[1]</td><td>0h</td><td>Level</td><td>PCIe, Converged IO, DisplayPort RX (optional)</td><td>RxEqInProgress – This field is used by the MAC to indicate when link equalization evaluation is in progress.
The PHY may optionally use this field to enable and disable functionality that is only needed during link equalization evaluations.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td></td><td>For PCIe: The MAC sets this bit to ‘1’ at the same time as it sets RxEqEval to ‘1’ in phase 2 or phase 3 of the link equalization process. The MAC resets this bit to ‘0’ at the end of phase 2 or phase 3.</td></tr><tr><td>[0]</td><td>Oh</td><td>Level</td><td>PCIe, Converged IO, DisplayPort RX (optional)</td><td>RxEqEval -- This field is set to ‘1’ by the MAC to instruct the PHY to start evaluation of the far end transmitter TX EQ settings.For PCI Express, this field is only used at the 8.0 GT/s, 16 GT/s, and 32 GT/s signaling rates.</td></tr></table>

# 7.1.8 Address 7h: Elastic Buffer Location Update Frequency

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:0]</td><td>5h</td><td>Level</td><td>No</td><td>ElasticBufferLocationUpdateFrequency -- This field specifies the maximum update frequency to the ElasticBufferLocation field; the frequency of update should not exceed 16*N symbol times, where N is the value programmed in this register. 
Note: This field is not used in the SerDes architecture.</td></tr></table>

# 7.1.9 Address 8h: PHY RX Control4

This register is used to control receiver functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:2]</td><td>Oh</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[1]</td><td>Oh</td><td>1-cycle</td><td>PCIe,USB</td><td>ElasticBufferResetControl - When asserted, this signal causes the PHY to initiate an EB reset sequence. See section 8.15.3.1 for details.Note: This field is not used in the SerDes architecture</td></tr><tr><td>[0]</td><td>Oh</td><td>Level</td><td>PCIe,USB</td><td>BlockAlignControl -- This field controls whether the PHY performs block alignment. When BlockAlignControl=0 the PHY disables searching for EIEOS (PCIe)/SYNC OS (USB) on a bit boundary. When BlockAlignControl = 1 the PHY enables searching for EIEOS(PCIe)/SYNC OS (USB) on a bit boundary.A MAC shall set BlockAlignControl to the same value for all active lanes in a link. A MAC shall set BlockAlignControl to ‘0’ when in a datastream and shall set it to ‘1’ otherwise.This field is only used at the PCI Express 8.0 GT/s,</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td></td><td>16 GT/s, and 32 GT/s signaling rates and at the USB 10.0 GT/s signaling rate.
When the PHY is in Loopback Slave mode it ignores BlockAlignControl and is responsible for maintaining alignment.
Note: This field is not used in the SerDes architecture.</td></tr></table>

# 7.1.10 Address 400h: PHY TX Control0

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:2]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[1:0]</td><td>0h</td><td>Level</td><td>SATA</td><td>TX Pattern[1:0] – This field controls which pattern the PHY sends at the Gen 1 rate when sending OOB or initialization signaling. The PHY transmits this pattern at the Gen 1 rate regardless of what rate the PHY is configured at.
0 ALIGN
1 D24.3
2 D10.2
3 Reserved
See Section 8.24 for a more detailed description of the usage of these pins.
Note: This field is not used in the SerDes architecture.</td></tr></table>

# 7.1.11 Address 401h: PHY TX Control1

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:1]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[0]</td><td>0h</td><td>Level</td><td>USB</td><td>TxOnesZeros – This field is used when transmitting USB compliance patterns CP7 or CP8. When this field is set, the transmitter to transmit an alternating sequence of 50-250 ones and 50-250 zeros – regardless of the state of the TxData interface. This field is only applicable to 8b/10b modes.
Note: This field is not used in the SerDes architecture.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 7.1.12 Address 402h: PHY TX Control2

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td rowspan="7">[5:0]</td><td rowspan="7">1h</td><td rowspan="7">Level</td><td rowspan="7">PCIe,USB,ConvergedIO</td><td>TxDeemph[5:0] - This field is part ofTxDeemph[17:0], which selects transmitter de-emphasis.PCI Express Mode, when the rate is 2.5 or 5.0GT/s:</td></tr><tr><td>Value Description</td></tr><tr><td>0 -6dB de-emphasis</td></tr><tr><td>1 -3.5dB de-emphasis</td></tr><tr><td>2 No de-emphasis</td></tr><tr><td>3 Reserved</td></tr><tr><td>PIPE implementations that only support 2.5 GT/sdo not implement this field. PIPE PHYimplementations that do not support low swing arenot required to support the no-de-emphasis mode.PCI Express Mode, when the rate is 8.0 GT/s, 16GT/s, or 32 GT/s:[5:0] C-1[11:6] C0[17:12] C+1USB Mode, when the rate is 10.0 GT/s:[5:0] C-1[11:6] C0[17:12] C+1The field is not defined for USB Mode when therate is 5.0 GT/sConverged IO Mode, when the rate is 10 GT/sor20 GT/s:[5:0] C-1[11:6] C0[17:12] C+1Note: The MAC must ensure that only supportedvalues are used for TxDeemph. In cases where theimplementation is required to keep track of TXcoefficients from previous states, this shall be doneby the MAC.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 7.1.13 Address 403h: PHY TX Control3

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe, USB, Converged IO</td><td>TxDeemph[11:6] -- This field is part of TxDeemph[17:0], which selects transmitter de-emphasis. See TxDeemph[5:0] for detailed description.</td></tr></table>

# 7.1.14 Address 404h: PHY TX Control4

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe, USB, Converged IO</td><td>TxDeemph[17:12] -- This field is part of TxDeemph[17:0], which selects transmitter de-emphasis. See TxDeemph[5:0] for detailed description.</td></tr></table>

# 7.1.15 Address 405h: PHY TX Control5

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7]</td><td>Oh</td><td>1-cycle</td><td>PCIe</td><td>GetLocalPresetCoefficients – This field is used to request a preset to co-efficient mapping for the preset on LocalPresetIndex[5:0] to coefficients on LocalTxPresetCoefficient[17:0]Maximum Response time of PHY is 128 nSec.Note. A MAC can make this request any time after reset.Note. This field is only used with a PHY that requires dynamic preset coefficient updates</td></tr><tr><td>[6]</td><td>Oh</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>Oh</td><td>Level</td><td>PCIe</td><td>LocalPresetIndex[5:0] – This field is used to indicate the index for the local PHY preset coefficients requested by the MAC.The preset index value is encoded as follows:000000b – 8 GT/s Preset P0.000001b – 8 GT/s Preset P1.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td></td><td>000010b - 8 GT/s Preset P2.000011b - 8 GT/s Preset P3.000100b - 8 GT/s Preset P4.000101b - 8 GT/s Preset P5.000110b - 8 GT/s Preset P6.000111b - 8 GT/s Preset P7.001000b - 8 GT/s Preset P8.001001b - 8 GT/s Preset P9.001010b - 8 GT/s Preset P10.001011b - 16 GT/s Preset P0.001100b - 16 GT/s Preset P1.001101b - 16 GT/s Preset P2.001110b - 16 GT/s Preset P3.001111b - 16 GT/s Preset P4.010000b - 16 GT/s Preset P5.010001b - 16 GT/s Preset P6.010010b - 16 GT/s Preset P7.010011b - 16 GT/s Preset P8.010100b - 16 GT/s Preset P9.010101b - 16 GT/s Preset P10.010110b - 32 GT/s Preset P0.010111b - 32 GT/s Preset P1.011000b - 32 GT/s Preset P2.011001b - 32 GT/s Preset P3.011010b - 32 GT/s Preset P4.011011b - 32 GT/s Preset P5.011100b - 32 GT/s Preset P6.011101b - 32 GT/s Preset P7.011110b - 32 GT/s Preset P8.011111b - 32 GT/s Preset P9.100000b - 32 GT/s Preset P10. All others -- ReservedThis field is only used with a PHY that requires dynamic preset coefficient updates.</td></tr></table>

# 7.1.16 Address 406h: PHY TX Control6

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>FS[5:0] -- This field reflects the FS value advertised by the link partner. The MAC shall only change this value when a new FS value is captured during link training. A PHY may optionally consider this value when deciding how long to evaluate TX equalization settings of the link partner. The MAC shall only change this field when a new FS value is captured during link training or if there</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td></td><td>is a rate change. The MAC shall drive the relevant 8 GT/s values when the operational rate is 8 GT/s, it shall drive the relevant 16 GT/s values when the operational rate is 16 GT/s, and it shall drive the relevant 32 GT/s values when the operational rate is 32 GT/s.</td></tr></table>

# 7.1.17 Address 407h: PHY TX Control7

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LF[5:0] – This field reflects the LF value advertised by the link partner. The MAC shall only change this value when a new LF value is captured during link training or when there is a rate change. A PHY may optionally consider this value when deciding how long to evaluate TX equalization settings of the link partner.
The MAC shall drive the relevant 8 GT/s values when the operational rate is 8 GT/s, it shall drive the relevant 16 GT/s values when the operational rate is 16 GT/s, and it shall drive the relevant 32 GT/s values when the operational rate is 32 GT/s.</td></tr></table>

# 7.1.18 Address 408h: PHY TX Control8

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td colspan="3">Description</td></tr><tr><td>[7:4]</td><td>0h</td><td>N/A</td><td>N/A</td><td colspan="3">Reserved</td></tr><tr><td rowspan="5">[3]</td><td rowspan="5">0h</td><td rowspan="5">Level</td><td rowspan="5">PCIe</td><td colspan="3">TxSwing - This field controls transmitter voltage swing level.</td></tr><tr><td>Value</td><td colspan="2">Description</td></tr><tr><td>0</td><td colspan="2">Full swing</td></tr><tr><td>1</td><td colspan="2">Low swing (optional)</td></tr><tr><td colspan="3">Implementation of this signal is optional if only Full swing is supported. This field is not used at the 8.0 GT/s, 16 GT/s, or 32 GT/s signaling rates.</td></tr><tr><td rowspan="4">[2:0]</td><td rowspan="4">0h</td><td rowspan="4">Level</td><td rowspan="4">PCIe</td><td colspan="3">TxMargin[2:0] -- This field selects transmitter voltage levels.</td></tr><tr><td>[2]</td><td>[1]</td><td>[0]</td></tr><tr><td>0</td><td>0</td><td>0</td></tr><tr><td colspan="3">TxMargin value 0 = Normal</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="9"></td><td rowspan="9"></td><td rowspan="9"></td><td rowspan="9"></td><td></td><td></td><td></td><td>operating range</td></tr><tr><td>0</td><td>0</td><td>1</td><td>TxMargin value 1 = 800-1200mV for Full swing* OR 400-700mV for Half swing*</td></tr><tr><td>0</td><td>1</td><td>0</td><td>TxMargin value 2 = required and vendor defined</td></tr><tr><td>0</td><td>1</td><td>1</td><td>TxMargin value 3 = required and vendor defined</td></tr><tr><td>1</td><td>0</td><td>0</td><td>TxMargin value 4 = required and 200-400mV for Full swing* OR 100-200mV for Half swing* if the last value or vendor defined</td></tr><tr><td>1</td><td>0</td><td>1</td><td>TxMargin value 5 = optional and 200-400mV for Full swing* OR 100-200mV for Half swing* if the last value OR vendor defined OR Reserved if no other values supported</td></tr><tr><td>1</td><td>1</td><td>0</td><td>TxMargin value 6 = optional and 200-400mV for Full swing* OR 100-200mV for Half swing* if the last value OR vendor defined OR Reserved if no other values supported</td></tr><tr><td>1</td><td>1</td><td>1</td><td>TxMargin value 7 = optional and 200-400mV for Full swing* OR 100-200mV for Half swing* if the last value OR Reserved if no other values supported</td></tr><tr><td colspan="4">PIPE implementations that only support PCI Express mode and the 2.5GT/s signaling rate do not implement this field.</td></tr></table>

# 7.1.19 Address 409h: PHY TX Control9

This register is used to control transmitter functionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:0]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved (original contents moved to RX Control4)</td></tr></table>

# 7.1.20 Address 800h: PHY Common Control0

This register is used to control functionality relevant to both the receiver and the transmitterfunctionality.

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:1]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[0]</td><td>0h</td><td>Level</td><td>PCIe (optional),</td><td>EncodeDecodeBypass -- This field controls whether the PHY performs 8b/10b (or</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td>USB
(optional), SATA</td><td>128b/13xb) encode and decode.
0 – Encode/decode performed normally by the PHY.
1 – Encode/decode bypassed.
The MAC can only change this signal during reset or in a power state other than POWER_STATE_0 (SATA Mode) or P0 (PCI Express Mode).
SATA Mode:
.
When EncodeDecodeBypass is one the TxDataK and RxDataK interfaces are not used and the data bus width is 10, 20, or 40 bits.
PCI Express Mode and USB Mode:
When EncodeDecodeBypass is one the TxDataK and RxDataK interfaces are not used. The data bus width is 10, 20, or 40 bits if rate is 2.5 or 5.0 GT/s. The data bus width is 8, 16, or 32 bits if the rate is 8.0 GT/s, 16 GT/s, or 32 GT/s (PCI Express) or 10 GT/s (USB). The TxStartBlock and RxStartBlock signals are not used.
Note: This field is not used in the SerDes architecture.</td></tr></table>

# 7.2 MAC Registers

Table 7-2 lists the MAC registers and their associated address. The details of each register areprovided in the subsections below.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1


Table 7-2 MAC Registers


<table><tr><td>Byte Address</td><td>Register Name</td><td>Notes</td></tr><tr><td>12&#x27;h0</td><td>RX1: RX Margin Status0</td><td></td></tr><tr><td>12&#x27;h1</td><td>RX1: RX Margin Status1</td><td></td></tr><tr><td>12&#x27;h2</td><td>RX1: RX Margin Status2</td><td></td></tr><tr><td>12&#x27;h3</td><td>RX1: Elastic Buffer Status</td><td>N/A for SerDes Architecture</td></tr><tr><td>12&#x27;h4</td><td>RX1: Elastic Buffer Location</td><td>N/A for SerDes Architecture</td></tr><tr><td>12&#x27;h5</td><td>RX1: Reserved</td><td></td></tr><tr><td>12&#x27;h6</td><td>RX1: RX Status0</td><td></td></tr><tr><td>12&#x27;h7</td><td>RX1: RX Status1</td><td></td></tr><tr><td>12&#x27;h8</td><td>RX1: RX Status2</td><td></td></tr><tr><td>12&#x27;h9</td><td>RX1: RX Status3</td><td></td></tr><tr><td>12&#x27;hA</td><td>RX1: RX Link Evaluation Status0</td><td></td></tr><tr><td>12&#x27;hB</td><td>RX1: RX Link Evaluation Status1</td><td></td></tr><tr><td>12&#x27;hC</td><td>RX1: RX Status 4</td><td></td></tr><tr><td>12&#x27;hD</td><td>RX1: RX Status 5</td><td></td></tr><tr><td>12&#x27;hE-12&#x27;h1FF</td><td>RX1: Reserved</td><td></td></tr><tr><td>12&#x27;h200 to 12&#x27;h3FF</td><td>RX2: Same registers are defined in this region for RX2 as for RX1 above.</td><td>.</td></tr><tr><td>12&#x27;h400</td><td>TX1: TX Status0</td><td></td></tr><tr><td>12&#x27;h401</td><td>TX1: TX Status1</td><td></td></tr><tr><td>12&#x27;h402</td><td>TX1: TX Status2</td><td></td></tr><tr><td>12&#x27;h403-12&#x27;h5FF</td><td>TX1: Reserved</td><td></td></tr><tr><td>12&#x27;h600-12&#x27;h7FF</td><td>TX2: Same registers are defined in this region for TX2 as for TX1 above</td><td></td></tr><tr><td>12&#x27;h800-12&#x27;h9FF</td><td>CMN1: Reserved</td><td></td></tr><tr><td>12&#x27;hA00-12&#x27;hBFF</td><td>CMN2: Reserved</td><td></td></tr><tr><td>12&#x27;hC00-12&#x27;hFFF</td><td>VDR: Reserved</td><td></td></tr></table>

# 7.2.1 Address 0h: RX Margin Status0

Bit Default Attribute Required Description

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>[7:2]</td><td>Oh</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[1]</td><td>Oh</td><td>1-cycle</td><td>PCIe (optional)</td><td>Margin Nak – This field is used by the PHY to indicate that a voltage margin request corresponds to an unsupported offset that falls within the advertised range. This field may be asserted in response to a change to the ‘Start Margin’ field or ‘Margin Offset[6:0]’ field or ‘Margin Direction’ field during voltage margining only. This field is only written once per committed write affecting either of the above three fields. When this field is set, the ‘Margin Status’ should not be set. The design must support the minimum voltage offset requirement stated in the PCIe base specification. Note: If the voltage margin offset requested falls outside of the PHY advertised range, the PHY is not required to communicate a NAK by setting this field; this is assumed to be a MAC error and PHY behavior is undefined.</td></tr><tr><td>[0]</td><td>Oh</td><td>1-cycle</td><td>PCIe</td><td>Margin Status – This field is used by the PHY to acknowledge a valid change to the ‘Start Margin’ field or the ‘Margin Offset[6:0]’ field. This field is only written once per committed write affecting either of the above two fields. For example, if both ‘Start Margin’ and ‘Margin Offset[6:0]’ are changed, but one is changed with an uncommitted write and one is changed with a committed write, this ‘Margin Status’ field is only written once to acknowledge both changes.</td></tr></table>

# 7.2.2 Address 1h: RX Margin Status1

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[6:0]</td><td>0h</td><td>Level</td><td>PCIe (optional)</td><td>Sample Count – This field indicates the number of bits that have been margined and can increment only when ‘Start Margin’ is asserted. The value of this field is 3*log2(number of bits margined). This field stops incrementing when the ‘Error Count’ saturates. This field only resets on a PIPE reset or when the MAC writes to the ‘Sample Count Reset’ bit in the RX Margin Control1 register. This field is only required if the Sampling Rate is not reported in the PHY datasheet. If used, this field must be updated by the PHY every time the associated value changes; implementations may collapse multiple updates into a single write only to avoid creating a backlog of writes.</td></tr></table>

# 7.2.3 Address 2h: RX Margin Status2

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe (optional)</td><td>Error Count – This field is only required if errors do not happen in the data stream and thus an independent error sampler is implemented in the PHY. This field is used by the PHY to report actual bit errors to the MAC. This field can increment only when ‘Start Margin’ is asserted. This field only resets on a PIPE reset or when the MAC writes to the ‘Error Count Reset’ bit in the RX Margin Control1 register. If used, this field must be updated by the PHY every time the associated value changes; implementations may collapse multiple updates into a single write to avoid creating a backlog of writes.</td></tr></table>

# 7.2.4 Address 3h: Elastic Buffer Status

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:1]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[0]</td><td>0h</td><td>1-cycle</td><td>PCIe (optional)</td><td>Elastic Buffer Status – The PHY sets this status bit to 1‘b1 when it has completed its elastic buffer depth adjustment to the value specified in the Elastic Buffer Control register. 
Note: This field is not used in the SerDes architecture.</td></tr></table>

# 7.2.5 Address 4h: Elastic Buffer Location

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:0]</td><td>0h</td><td>Level</td><td>PCIe (optional), USB (optional)</td><td>ElasticBufferLocation -- This field reflects the number of entries currently in the elastic buffer. Whenever the number of entries in the elastic buffer changes the PHY schedules an update to this register, with the frequency of update not to exceed that programmed in the ElasticBufferLocationUpdateFrequency field. Note: This field is not used in the SerDes architecture.</td></tr></table>

# 7.2.6 Address 5h: Reserved

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:0]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr></table>

# 7.2.7 Address 6h: RX Status0

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalFS[5:0] -- This field reflects the FS value for the PHY. These signals are only used by a PHY that requires dynamic preset coefficient updates. The FS value is valid for 8 GT/s.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td></td><td>This field shall be updated by the PHY before PHYStatus deasserts after RESET# and before the first PHYStatus pulse after a rate change to 8 GT/s or in response to GetLocalPresetCoefficients when LocalPresetIndex[5:0] &lt; 11.</td></tr></table>

# 7.2.8 Address 7h: RX Status1

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalLF[5:0] -- This field reflects the LF value for the PHY. This signal is only used by a PHY that requires dynamic preset coefficient updates. The LF value is valid for 8GT/s.LocalLF[5:0] must updated whenever LocalFS[5:0] is updated</td></tr></table>

# 7.2.9 Address 8h: RX Status2

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalG4FS[5:0] This field reflects the FS value for the PHY. These signals are only used by a PHY that requires dynamic preset coefficient updates. The FS value is valid for 16 GT/s.
This field shall be updated by the PHY before the first PhyStatus pulse after a rate change to 16 GT/s or in response to GetLocalPresetCoefficients when LocalPresetIndex[5:0] &gt; 10 and &lt;=21.</td></tr></table>

# 7.2.10 Address 9h: RX Status3

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalG4LF[5:0] This field reflects the LF value for the PHY. This signal is only used by a PHY that requires dynamic preset coefficient updates. The LF value is valid for 16 GT/s.
LocalG4LF[5:0] must be sampled whenever LocalG4FS[5:0] is sampled.</td></tr></table>

# 7.2.11 Address Ah: RX Link Evaluation Status0

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:0]</td><td>0h</td><td>Level</td><td>PCIe, 
Converged 
IO, 
DisplayPort</td><td>LinkEvaluationFeedbackFigureMerit[7:0] – 
This field provides the PHY link equalization 
evaluation Figure of Merit value. The value is 
encoded as an unsigned integer from 0 to 255.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td>RX
(optional)</td><td>An encoding of 0 is the worst, and an encoding of 255 is the best.
A PHY does not update this field if it is does not provide link equalization evaluation feedback using the Figure of Merit format.
For PCIe, this field is only used at the 8.0 GT/s, 16 GT/s, and 32 GT/s signaling rates.
Note: The write_committed associated with an update to this field indicates that the RxEqEval has completed.</td></tr></table>

# 7.2.12 Address Bh: RX Link Evaluation Status1

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LinkEvaluationFeedbackDirectionChange[5:0] --This field provides the link equalization evaluation feedback in the direction change format. Feedback is provided for each coefficient:[1:0] C1[3:2] C0[5:4] C1The feedback value for each coefficient is encoded as follows:00 - No change01 - Increment10 - Decrement11 - ReservedA PHY does not update this field if it is does not provide link equalization evaluation feedback using the Direction Change format.Note: In 8.0 GT/s mode the MAC shall ignore the C0 value and use the correct value per the PCI Express specification.These signals are only used at the 8.0 GT/s, 16 GT/s, and 32 GT/s signaling rates.Note that C-1 and C1 are encoded as the absolute value of the actual FIR coefficient and thus incrementing or decrementing either value refers to the magnitude of the actual FIR coefficient.For example, if C-1 is 000001b the FIR coefficient</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td></td><td>is negative one and a request to increment C-1 will increase it in the direction of 000002b which decreases the FIR coefficient.</td></tr><tr><td></td><td></td><td></td><td></td><td>Note: The write_committed associated with an update to this field indicates that the RxEqEval has completed.</td></tr></table>

# 7.2.13 Address Ch: RX Status4

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalG5FS[5:0] This field reflects the FS value for the PHY. These signals are only used by a PHY that requires dynamic preset coefficient updates. The FS value is valid for 32 GT/s.
This field shall be updated by the PHY before the first PhyStatus pulse after a rate change to 32 GT/s or in response to GetLocalPresetCoefficients when LocalPresetIndex[5:0] &gt; 21 and &lt;=32.</td></tr></table>

# 7.2.14 Address Dh: RX Status5

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalG5LF[5:0] This field reflects the LF value for the PHY. This signal is only used by a PHY that requires dynamic preset coefficient updates. The LF value is valid for 32 GT/s.
LocalG5LF[5:0] must be sampled whenever LocalG5FS[5:0] is sampled.</td></tr></table>

# 7.2.15 Address 400h: TX Status0

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td rowspan="5">[5:0]</td><td rowspan="5">0h</td><td rowspan="5">level</td><td rowspan="5">PCIe</td><td>LocalTxPresetCoefficients[5:0] -- This field forms part of LocalTxPresetCoefficients[17:0], which are the coefficients for the preset on the LocalPresetIndex[5:0] after a GetLocalPresetCoefficients request:</td></tr><tr><td>[5:0] C-1</td></tr><tr><td>[11:6] C0</td></tr><tr><td>[17:12] C+1</td></tr><tr><td>The MAC will reflect these coefficient values on the TxDeemph bus when MAC wishes to apply this</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td></td><td>present.
These field is only updated by a PHY that requires dynamic preset coefficient updates</td></tr></table>

# 7.2.16 Address 401h: TX Status1

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>level</td><td>PCIe</td><td>LocalTxPresetCoefficients[11:6] -- This field forms part of LocalTxPresetCoefficients[17:0], which are the coefficients for the preset on the LocalPresetIndex[5:0] after a GetLocalPresetCoefficients request. See LocalTxPresetCoefficients[5:0] description for details.</td></tr></table>

# 7.2.17 Address 402h: TX Status2

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>level</td><td>PCIe</td><td>LocalTxPresetCoefficients[17:12] -- This field forms part of LocalTxPresetCoefficients[17:0], which are the coefficients for the preset on the LocalPresetIndex[5:0] after a GetLocalPresetCoefficients request. See LocalTxPresetCoefficients[5:0] description for details.</td></tr></table>

# 7.2.18 Address 403h: TX Status3

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalFS[5:0] -- This field reflects the FS value for the PHY. These signals are only used by a PHY that requires dynamic preset coefficient updates. The FS value is valid for 8 GT/s.
This field shall be updated by the PHY before PhyStatus deasserts after RESET# and before the first PhyStatus pulse after a rate change to 8 GT/s or in response to GetLocalPresetCoefficients when LocalPresetIndex[5:0] &lt; 11.</td></tr></table>

# 7.2.19 Address 404h: TX Status4

<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalLF[5:0] -- This field reflects the LF value for the PHY. This signal is only used by a PHY that requires dynamic preset coefficient updates. The LF value is valid for 8GT/s.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td></td><td>LocalLF[5:0] must updated whenever LocalFS[5:0] is updated</td></tr></table>


7.2.20 Address 405h: TX Status5


<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalG4FS[5:0] This field reflects the FS value for the PHY. These signals are only used by a PHY that requires dynamic preset coefficient updates. The FS value is valid for 16 GT/s.
This field shall be updated by the PHY before the first PhyStatus pulse after a rate change to 16 GT/s or in response to GetLocalPresetCoefficients when LocalPresetIndex[5:0] &gt; 10 and &lt;=21.</td></tr></table>


7.2.21 Address 406h: TX Status6


<table><tr><td>Bit</td><td>Default</td><td>Attribute</td><td>Required</td><td>Description</td></tr><tr><td>[7:6]</td><td>0h</td><td>N/A</td><td>N/A</td><td>Reserved</td></tr><tr><td>[5:0]</td><td>0h</td><td>Level</td><td>PCIe</td><td>LocalG4LF[5:0] This field reflects the LF value for the PHY. This signal is only used by a PHY that requires dynamic preset coefficient updates. The LF value is valid for 16 GT/s.
LocalG4LF[5:0] must be sampled whenever LocalG4FS[5:0] is sampled.</td></tr></table>

# 8 PIPE Operational Behavior

# 8.1 Clocking

There are three clock signals used by the PHY Interface component. The first (CLK) is areference clock that the PHY uses to generate internal bit rate clocks for transmitting andreceiving data. The specifications for this signal are implementation dependent and must be fullyspecified by vendors. The specifications may vary for different operating modes of the PHY.This clock may have spread spectrum modulation that matches a system reference clock (forexample, the spread spectrum modulation could come from REFCLK from the Card Electro-Mechanical Specification).

The second clock (PCLK) is an output from the PHY in “PCLK as PHY Output” mode and aninput to each PHY lane in “PCLK as PHY Input ” mode and is the parallel interface clock used tosynchronize data transfers across the parallel interface. This clock runs at a rate dependent on theRate, PCLK Rate, and PHY Mode control inputs and data interface width. The rising edge of thisclock is the reference point. This clock may also have spread spectrum modulation. CLK andPCLK must be sourced from the same reference clock and must contain the same clockingcharacteristics, i.e. mesochronous with each other.

The third clock (MAX PCLK) is a constant frequency clock with a frequency determined by themaximum signaling rate supported by the PHY and is only required in “PCLK as PHY Input ”

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

mode or in all modes for a PHY that supports PCI Express at 8GT/s or higher maximum speed.The Max PCLK value should be set to the maximum PCLK supported by the PHY.

# 8.1.1 Clocking Topologies

This section describes some clocking topologies that are compatible with PIPE. Figure 8-1 showsPCLK as a PHY output. This topology is only applicable for legacy PIPE implementations and isnot supported for PCIe Gen5 designs, Converged IO or Displayport. Figure 8-2 shows PCLK asa PHY input with the PLL residing in the PHY; the PHY provides a source for PCLK, in this caseMAX PCLK) that is mesochronous to the PHY’s bit rate clock. Figure 8-3 shows PCLK as aPHY input with the PLL that provides the PCLK source residing outside of the PHY; thereference clock for PLL that sources the bit rate clock and the PLL that provides the PCLKsource must be the same. Figure 8-4 shows CLK as a PHY input with a single PLL that providesthe source for PCLK as well as for the bit rate clock.


Figure 8-1. PCLK as PHY output


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/98b49ca06019a201c92a6408cd127cbcd3639022312ca4bad60ddd7d22129e1f.jpg)


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1


Figure 8-2. PCLK as PHY Input w/PHY owned PLL


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/161bd52e56ba53f0b1e1b59258ff3ba2b1dfc15934344680357a21ca1df7ccaa.jpg)



Figure 8-3. PCLK as PHY Input w/External PLL and PHY PLL


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/c97d1fb94e5b9a8fde13acbff76273376d6264d0e2ed09864cc4276462d06d96.jpg)


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1


Figure 8-4. PCLK as PHY Input with External PLL


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/6abc2944047748612bc6cafe703e4a7b669a46d247d6570b0fe65a19729f9336.jpg)


# 8.2 Reset

When the MAC wants to reset the PHY (e.g.; initial power on), the MAC must hold the PHY inreset until power and CLK to the PHY are stable. For PCLK as PHY output, the PHY signals thatPCLK and/or Max PCLK are valid (i.e. PCLK and/or Max PCLK has been running at itsoperational frequency for at least one clock) and the PHY is in the specified power state by thedeassertion of PhyStatus after the MAC has stopped holding the PHY in reset. The MAC mustnot perform any operational sequences until PhyStatus is returned for the Reset# deassertion.While Reset# is asserted the MAC should have TxDetectRx/Loopback deasserted, TxElecIdleasserted, TxCompliance deasserted, PowerDown $= { \bf P } 1$ (PCI Express mode) or PowerDown = P2(USB Mode) or PowerDown set to the default value reported by the PHY (SATA Mode), PHYMode set to the desired PHY operating mode, and Rate set to 2.5GT/s signaling rate for a PHY inPCI Express mode or 5.0 GT/s or 10 GT/s (highest supported) for a PHY in USB mode or anyrate supported by the PHY in SATA mode. The state of TxSwing during Reset# assertion isimplementation specific. RxTermination assertion in USB mode is implementation specific.


Figure 8-5. Reset# Deassertion and PhyStatus for PCLK as PHY Output


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/5ea43c8fbec1355d85584b3c4c9eb02f2254da1700a0c798dd73158ca87c6d23.jpg)


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 8.3 Power Management – PCI Express Mode

The power management signals allow the PHY to minimize power consumption. The PHY mustmeet all timing constraints provided in the PCI Express Base Specification regarding clockrecovery and link training for the various power states. The PHY must also meet all terminationsrequirements for transmitters and receivers.

Four standard power states are defined, P0, P0s, P1, and P2. P0 state is the normal operationalstate for the PHY. When directed from P0 to a lower power state, the PHY can immediately takewhatever power saving measures are appropriate. A PHY is allowed to implement additionalPHY specific power states; L1 substate support requires implementation of additional PHYspecific power states. A MAC may use any of the PHY specific states as long as the PCI Expressbase specification requirements are still met.

In states P0, P0s and P1, PCLK is required to be kept operational. For all state transitionsbetween these three states and any PHY specific states where PCLK is operational, the PHYindicates successful transition into the designated power state by a single cycle assertion ofPhyStatus. Transitions into and out of P2 or a PHY specific state where PCLK is not operationalare described below. For all power state transitions, the MAC must not begin any operationalsequences or further power state transitions until the PHY has indicated that the initial statetransition is completed.

Mapping of PHY power states to states in the Link Training and Status State Machine (LTSSM)found in the base specification are included below. A MAC may alternately use PHY specificstates as long as the base specification requirements are still met.

P0 state: All internal clocks in the PHY are operational. P0 is the only state where the PHYtransmits and receives PCI Express signaling.

P0 is the appropriate PHY power management state for most states in the Link Training andStatus State Machine (LTSSM). Exceptions are listed below for each lower power PHYstate.

P0s state: PCLK must stay operational. The MAC may move the PHY to this state onlywhen the transmit channel is idle.

P0s state can be used when the transmitter is in state Tx_L0s.Idle.

While the PHY is in either P0 or P0s power states, if the receiver is detecting an electricalidle, the receiver portion of the PHY can take appropriate power saving measures. Note thatthe PHY must be capable of obtaining bit and symbol lock within the PHY-specified time(N_FTS with/without common clock) upon resumption of signaling on the receive channel.

This requirement only applies if the receiver had previously been bit and symbol lockedwhile in P0 or P0s states.

P1 state: Selected internal clocks in the PHY can be turned off. PCLK must stay operational.The MAC will move the PHY to this state only when both transmit and receive channels areidle. The PHY must not indicate successful entry into P1 (by asserting PhyStatus) untilPCLK is stable and the operating DC common mode voltage is stable and withinspecification (as per the base spec).

P1 can be used for the Disabled state, all Detect states, and L1.Idle state (only if L1 substatesare not supported) of the Link Training and Status State Machine (LTSSM).

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

P2 state: Selected internal clocks in the PHY can be turned off. The parallel interface is inan asynchronous mode and PCLK is turned off. P2 can be used for the L1.Idle, L2.Idle andL2.TransmitWake states of the Link Training and Status State Machine (LTSSM).

PCLK as PHY Output: When transitioning into P2, the PHY must assert PhyStatus before PCLKis turned off and then deassert PhyStatus when PCLK is fully off and when the PHY is in the P2state. When transitioning out of P2, the PHY asserts PhyStatus as soon as possible and leaves itasserted until after PCLK is stable.

PCLK as PHY Input: When transitioning into P2, the PHY must assert PhyStatus for one inputPCLK cycle when it is ready for PCLK to be removed. When transitioning out of P2, the PHYmust assert PhyStatus for one input PCLK cycle as soon as possible once it has transitioned to P0and is ready for operation.

When transitioning out of a state that does not provide PCLK to another state that does notprovide PCLK, the PHY asserts PhyStatus as soon as the PHY state transition is complete andand leaves it asserted until the MAC asserts AsyncPowerChangeAck. Once the MAC assertsAsyncPowerChangeAck the PHY deasserts PhyStatus.

PHYs should be implemented to minimize power consumption during P2 as this is when thedevice will have to operate within Vaux power limits (as described in the PCI Express BaseSpecification).

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/16261c432f5cf48e2f6a1a3f17b7b2b798ef720b324a577e8dbf0ebc510e6557.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/8d32de0cad31e207a18aff7d2292076d0eeda3f44e7ec9af501257e27bec23c0.jpg)



Figure 8-6 PCI Express P2 Entry and Exit with PCLK as PHY Output


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/95de3efd9a280e40ae456943e71266f7eb48046bb738de36d91d511665ff4d8c.jpg)


# Figure 8-7 PCI Express P2 Entry and Exit with PCLK as PHY Input

There is a limited set of legal power state transitions that a MAC can ask the PHY to make.

Those legal transitions are: P0 to P0s, P0 to P1, P0 to P2, P0s to P0, P1 to P0, and P2 to P0. Thebase spec also describes what causes those state transitions.

Transitions to and from any pair of PHY power states including at least one PHY specific powerstate are also allowed by PIPE (unless otherwise prohibited). However, a MAC must ensure thatPCI Express specification timing requirements are met.

For L1 substate entry, the PHY must support a state where PCLK is disabled, REFCLK can beremoved, and RX electrical idle and TX common mode are on; this can be P2 or a P2-like state.Figure 8-4 illustrates how a transition into and out of an L1 substate could occur. P2 or a P2-likestate maps to L1.Idle; and PhyStatus and AsyncPowerChangeAck signals are used as describedearlier in this section. Alternatively, the PHY may implement L1 substate management using asingle PowerDown[3:0] encoding augmented with the RxEIDetectDisable and

TxCommonModeDisable signals; the PowerDown state must remain constant across L1 substatetransitions when this alternative mechanism is used. Using distinct PowerDown[3:0] encodingsto define the L1 substates allows flexibility to specify different exit latencies; while usingRxEIDetectDisable and TxCommonModeDisable may eliminate the need to do a handshake withAsyncPowerChangeAck. The PHY may support either mechanism or both; this capability mustbe advertised in the PHY datasheet. The sideband mechanism of L1 substate management viaRxEIDetectDisable and TxCommonModeDisable requires PCLK as PHY input mode.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/b2a8ebac0ad24a0499c31550191e82b1d99778a5cbdffe39e74b0ab5f9c05a14.jpg)



Figure 8-8. L1 SubState Entry and Exit with PCLK as PHY Output


# 8.4 Power Management – USB Mode

The power management signals allow the PHY to minimize power consumption. The PHY mustmeet all timing constraints provided in the USB 3.1 Specification regarding clock recovery andlink training for the various power states. The PHY must also meet all termination requirementsfor transmitters and receivers.

Four power states are defined, P0, P1, P2, and P3. The P0 state is the normal operational state forthe PHY. When directed from P0 to a lower power state, the PHY can immediately take

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

whatever power saving measures are appropriate.

In states P0, P1 and P2, the PCLK must be kept operational. For all state transitions betweenthese three states, the PHY indicates successful transition into the designated power state by asingle cycle assertion of PhyStatus. Transitions into and out of P3 are described below. For allpower state transitions, the MAC must not begin any operational sequences or further power statetransitions until the PHY has indicated that the initial state transition is completed.

Mapping of PHY power states to states in the Link Training and Status State Machine found inthe USB specification are included below. A MAC may alternately use PHY specific states aslong as the base specification requirements are still met.

• P0 state: All internal clocks in the PHY are operational. P0 is the only state where the PHYtransmits and receives USB signaling.P0 is the appropriate PHY power management state for all cases where the link is in U0 andall other link state except those listed below for P1, P2, and P3.

• P1 state: PCLK must stay operational. The MAC will move the PHY to this state only whenthe PHY is transmitting idles and receiving idles. The P1 state can be used for the U1 linkstate.

P2 state: Selected internal clocks in the PHY can be turned off. PCLK must stay operational.The MAC will move the PHY to this state only when both transmit and receive channels areidle. The PHY must not indicate successful entry into P2 (by asserting PhyStatus) untilPCLK is stable and the operating DC common mode voltage is stable and withinspecification (as per the base spec).

• P2 can be used for the U2, Rx.Detect, and SS.Inactive.

P3 state: Selected internal clocks in the PHY can be turned off. The parallel interface is inan asynchronous mode and PCLK output is turned off.

PCLK as PHY Output: When transitioning into P3, the PHY must assert PhyStatus beforePCLK is turned off and then deassert PhyStatus when PCLK is fully off and when the PHY isin the P3 state. When transitioning out of P3, the PHY asserts PhyStatus as soon as possibleand leaves it asserted until after PCLK is stable.

PCLK as PHY Input: When transitioning into P3, the PHY must assert PhyStatus for oneinput PCLK cycle when it is ready for PCLK to be removed. When transitioning out of P3,the PHY must assert PhyStatus for one input PCLK cycle as soon as possible once it hastransitioned to P0 and is ready for operation.

PHYs should be implemented to minimize power consumption during P3 as this is when thedevice will have to operate within power limits described in the USB 3.0 Specification.

• The P3 state shall be used in states SS.disabled and U3.

There is a limited set of legal power state transitions that a MAC can ask the PHY to make.Referencing the main state diagram in the USB spec and the mapping of link states to PHYpower states described in the preceding paragraphs, those legal transitions are: P0 to P1, P0 toP2, P0 to P3, P1 to P0, P2 to P0, P3 to P0, and P1 to P2. The base spec also describes whatcauses those state transitions.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

U1 has strict exit latency requirements as described in the USB base specification. Figure 8-5illustrates the timing requirements for PIPE signals associated with U1 exit with the followingexplanation:

• T2-T1: PHY decodes LFPS and reflects it through RxElecIdle (120ns max)

• T4-T3: P1 to P0 transition latency (300ns max)

• T6-T5: LFPS transmit latency (100ns max)

• T7-T1: 0.6 to 0.9us from USB Spec

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/bab21d6c051c0ce1c46f8522fbb0f5592777a8c748bb7b664d739e8388b7a7bb.jpg)



Figure 8-9. USB U1 Exit


# 8.5 Power Management – SATA Mode

The power management signals allow the PHY to minimize power consumption. The PHY mustmeet all timing constraints provided in the SATA Specification regarding clock recovery and linktraining for the various power states. The PHY must also meet all termination requirements fortransmitters and receivers.

A minimum of five power states are defined, POWER_STATE_0 and a minimum of four additionalstates that meet minimum requirements defined in section 6.1. POWER_STATE_0 state is thenormal operational state for the PHY. When directed from POWER_STATE_0 to a lower powerstate, the PHY can immediately take whatever power saving measures are appropriate.

For all state transitions between POWER_STATE_0 and lower power states that provide PCLK,the PHY indicates successful transition into the designated power state by a single cycle assertionof PhyStatus. The PHY must complete transmitting all data transferred across the PIPE interfacebefore the change in the PowerDown signals before assertion of PhyStatus. Transitions into andout of power states that do not provide PCLK are described below. For all power statetransitions, the MAC must not begin any operational sequences or further power state transitionsuntil the PHY has indicated that the initial state transition is completed. Power state transitionsbetween two power states that do not provide PCLK are not allowed.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Mapping of PHY power states to link states in the SATA specification is MAC specific.

POWER_STATE_0 : All internal clocks in the PHY are operational. POWER_STATE_0 is theonly state where the PHY transmits and receives SATA signaling.POWER_STATE_0 is the appropriate PHY power management state for most link states in theSATA specification. When transitioning into a power state that does not provide PCLK , thePHY must assert PhyStatus before PCLK is turned off and then deassert PhyStatus whenPCLK is fully off and when the PHY is in the low power state. The PHY must leave PCLKon for at least one cycle after asserting PhyStatus. For PCLK as PHY output, whentransitioning out of a state that does not provide PCLK , the PHY asserts PhyStatus as soon aspossible and leaves it asserted until after PCLK is stable.

Transitions between any pair of PHY power states (except two states that do not provide PCLK)are allowed by PIPE. However, a MAC must ensure that SATA specification timingrequirements are met.

# 8.6 Changing Signaling Rate, PCLK Rate, or Data Bus Width

# 8.6.1 PCI Express Mode

The signaling rate of the link, PCLK rate, or the Data Bus Width can be changed only when thePHY is in the P0 or P1 power state and TxElecIdle and RxStandby (P0 only) are asserted. Whenthe MAC changes the Rate signal, and/or the Width signal, and/or the PCLK rate signal in PCLKas PHY Output mode, the PHY performs the rate change and/or the width change and/or thePCLK rate change and signals its completion with a single cycle assertion of PhyStatus. TheMAC must not perform any operational sequences, power state transitions, deassert TxElecIdle orRxStandby, or further signaling rate changes until the PHY has indicated that the signaling ratechange has completed. The sequence is the same in PCLK as PHY Input mode except the MACneeds to know when the input PCLK rate or Rate, or potentially width, can be safely changed.After the MAC changes Rate and either PCLK_Rate, Data Width, or both, any change to thePCLK can happen only after the PclkChangeOk output has been driven high by the PHY. TheMAC changes the input PCLK, if necessary, and then handshakes by asserting PclkChangeAck.The PHY responds by asserting PhyStatus for one input PCLK cycle and de-assertsPclkChangeOk on the trailing edge of PhyStatus. Note: PclkChangeOk is used by the PHY if theMAC changes PCLK_Rate and Rate. The PHY datasheet indicates whether the same handshakeis also required for every rate change. Table 8-1 summarizes the handshake requirements. TheMAC de-asserts PclkChangeAck when PclkChangeOk is sampled low and may de-assertTxElecIdle and/or RxStandby after PhyStatus is sampled high. There are instances where LTSSMstate machine transitions indicate both a speed change and/or width and/or PCLK rate change anda power state change for the PHY. In these instances, the MAC must change (if necessary) thesignaling rate, width and/or PCLK rate before changing the power state.


Table 8-1. PclkChangeOK/PclkChangeAck Requirements


<table><tr><td>Rate</td><td>Width</td><td>PCLK Rate</td><td>PclkChangeOK /PclkChangeAck Handshake Required?</td></tr><tr><td>Stable</td><td>Don’t care</td><td>Don’t care</td><td>Don’t care</td></tr><tr><td>Change</td><td>Stable</td><td>Stable</td><td>Optional (parameter)</td></tr><tr><td>Change</td><td>Stable</td><td>Change</td><td>Required</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Change</td><td>Change</td><td>Stable</td><td>Optional (parameter)</td></tr><tr><td>Change</td><td>Change</td><td>Change</td><td>Required</td></tr></table>

Some PHY architectures may allow a speed change and a power state change to occur at the sametime as a rate and/or width and/or PCLK rate change. If a PHY supports this, the MAC mustchange the rate and/or width and/or PCLK rate at the same PCLK edge that it changes thePowerDown signals. This can happen when transitioning the PHY from P0 to either P1 or P2states. The completion mechanisms are the same as previously defined for the power statechanges and indicate not only that the power state change is complete, but also that the rate and/orwidth and/or PCLK rate change is complete.

# 8.6.2 USB Mode

The signaling rate of the link, PCLK rate, or the Data Bus Width can be changed only when thePHY is in the P0 or P2 power state and TxElecIdle and RxStandby are asserted. Anycombination of at least two of the rate and width and PCLK rate, can be changed simultaneously.The MAC is not allowed to change only one of the three. When the MAC changes the Ratesignal, and/or the Width signal, and/or the PCLK rate signal in PCLK as PHY Output mode, thePHY performs the rate change and/or the width change and/or the PCLK rate change and signalsits completion with a single cycle assertion of PhyStatus. The MAC must not perform anyoperational sequences, power state transitions, deassert TxElecIdle or RxStandby, or furthersignaling rate changes until the PHY has indicated that the signaling rate change has completed.The sequence is the same in PCLK as PHY Input mode except the MAC needs to know when theinput PCLK rate or Rate can be safely changed. After the MAC changes PCLK_Rate the changeto the PCLK can happen only after the PclkChangeOk output has been driven high by the PHY.The MAC changes the input PCLK, and then handshakes by asserting PclkChangeAck. The PHYresponds by asserting PhyStatus for one input PCLK cycle and de-asserts PclkChangeOk on thetrailing edge of PhyStatus. Note: PclkChangeOk is only used by the PHY if the MAC changesPCLK_Rate or Rate. The MAC de-asserts PclkChangeAck when PclkChangeOk is sampled lowand may de-assert TxElecIdle and/or RxStandby after PhyStatus is sampled high.

Some PHY architectures may allow a speed change and a power state change to occur at the sametime as a rate and/or width and/or PCLK rate change. If a PHY supports this, the MAC mustchange the rate and/or width and/or PCLK rate at the same PCLK edge that it changes thePowerDown signals. This can happen when transitioning the PHY from P0 to either P2 or P3states. The completion mechanisms are the same as previously defined for the power statechanges and indicate not only that the power state change is complete, but also that the rate and/orwidth and/or PCLK rate change is complete.

# 8.6.3 SATA Mode

The signaling rate of the link, PCLK rate, or the Data Bus Width can be changed only when thePHY is in POWER_STATE_0 and TxElecIdle and RxStandby are asserted, or in a lowpowerstate where PCLK is provided. When the MAC changes the Rate signal, and/or the Width signal,and/or the PCLK rate signal in PCLK as PHY Output mode, the PHY performs the rate changeand/or the width change and/or the PCLK rate change and signals its completion with a singlecycle assertion of PhyStatus. The MAC must not perform any operational sequences, power statetransitions, deassert TxElecIdle or RxStandby, or further signaling rate and/or width changes untilthe PHY has indicated that the change has completed.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

The sequence is the same in PCLK as PHY Input mode except the MAC needs to know when theinput PCLK rate can be safely changed. After the MAC changes PCLK_Rate the change to thePCLK can happen only after the PclkChangeOk output has been driven high by the PHY. TheMAC changes the input PCLK, and then handshakes by asserting PclkChangeAck. The PHYresponds by asserting PhyStatus for one input PCLK cycle and de-asserts PclkChangeOk on thetrailing edge of PhyStatus. Note: PclkChangeOk is only used by the PHY if the MAC changesPCLK_Rate. The MAC de-asserts PclkChangeAck when PclkChangeOk is sampled low andmay de-assert TxElecIdle and/or RxStandby after PhyStatus is sampled high.

There are instances where conditions indicate both a speed change and/or width and/or PCLK ratechange and a power state change for the PHY. In such cases the MAC must change thesignaling rate and/or width and/or PCLK rate, before changing the power state.

Some PHY architectures may allow a speed change and a power state change to occur at the sametime as a rate and/or width and/or PCLK rate change. If a PHY supports this, the MAC mustchange the rate and/or width and/or PCLK rate at the same PCLK edge that it changes the

PowerDown signals. The completion mechanisms are the same as previously defined for thepower state changes and indicate not only that the power state change is complete, but also thatthe rate and/or width and/or PCLK rate change is complete.

# 8.6.4 Fixed data path implementations

The figure below shows logical timings for implementations that change PCLK frequency whenthe MAC changes the signaling rate and PCLK is a PHY Output. Implementations that changethe PCLK frequency when changing signaling rates must change the clock such that the time theclock is stopped (if it is stopped) is minimized to prevent any timers using PCLK from exceedingtheir specifications. Also during the clock transition period, the frequency of PCLK must notexceed the PHY’s defined maximum clock frequency. The amount of time between when Rate ischanged and the PHY completes the rate change is a PHY specific value. These timings alsoapply to implementations that keep the data path fixed by using options that make use of theTxDataValid and RxDataValid signals.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/81d93b9d00fedbba98b497506be605607cc0a86bf74cbe3a729ced720d885b52.jpg)



Rate change with fixed data path



Figure 8-6 shows logical timings for an implementation that changes PCLK frequency when theMAC changes the signaling rate and PCLK is a PHY Input.


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/e23b28d4c20aaa87c6a657bc1f57f6a570e85c6787d398fa22d40fa815ef52fb.jpg)



Figure 8-10 Change from PCI Express $2 . 5 \ : \mathrm { G t } / \mathrm { s }$ to $5 . 0 \mathrm { G t } / \mathrm { s }$ with PCLK as PHY Input.


# 8.6.5 Fixed PCLK implementations

The figure below shows logical timings for implementations that change the width of the datapath for different signaling rates. PCLK may be stopped during a rate change. These timingsalso apply to fixed PCLK implementations that make use of the TxDataValid and RxDataValidsignals.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/520d78a13b5cf794815932b54d79253983a803c4a5fc1d023f0510f53f83e506.jpg)



Rate change with fixed PCLK frequency


# 8.7 Transmitter Margining – PCI Express Mode and USB Mode

While in the P0 power state, the PHY can be instructed to change the value of the voltage at thetransmitter pins. When the MAC changes TxMargin[2:0], the PHY must be capable oftransmitting with the new setting within 128 ns.

There is a limited set of legal TxMargin[2:0] and Rate combinations that a MAC can select.Refer to the PCIe Base Specification for a complete description of legal settings when the PHY isin PCI Express Mode. Refer to the USB specification for a complete description of the legalsettings when the PHY is in USB mode.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/5952e753c366fbd460d67350496244547f1f7c291cac02de0b8fafaf158dfa03.jpg)


# 8.8 Selectable De-emphasis – PCI Express Mode

While in the P0 power state and transmitting at 5.0GT/s, 8.0 GT/s, 16 GT/s or $3 2 \mathrm { G T } / \mathrm { s }$ , the PHYcan be instructed to change the value of the transmitter equalization. When the signaling rate is5.0 GT/s and the MAC changes TxDeemph, the PHY must be capable of transmitting with thenew setting within 128 ns. When the signaling rate is 8.0 GT/s, 16 GT/s, or $3 2 \mathrm { G T } / \mathrm { s }$ and theMAC changes TxDeemph, the PHY must be capable of transmitting with the new setting within256 ns.

There is a limited set of legal TxDeemph and Rate combinations that a MAC can select. Refer tothe PCIe Base Specification for a complete description.

The MAC must ensure that TxDeemph is selecting -3.5db whenever Rate is selecting 2.5 GT/s.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/8660dcb46f72f45e422f3b96dcdef211eff031627664bbab966c2836be6ccb88.jpg)


# 8.9 Receiver Detection – PCI Express Mode and USB Mode

While in the P1 or optionally P2 power state and PCI Express mode or in the P2 or P3 power stateand USB mode, the PHY can be instructed to perform a receiver detection operation to determineif there is a receiver at the other end of the link. Basic operation of receiver detection is that theMAC requests the PHY to do a receiver detect sequence by asserting TxDetectRx/Loopback.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

When the PHY has completed the receiver detect sequence, it asserts PhyStatus for one clock anddrives the RxStatus signals to the appropriate code. After the receiver detection has completed (assignaled by the assertion of PhyStatus), the MAC must deassert TxDetectRx/Loopback beforeinitiating another receiver detection, a power state transition, or signaling a rate change.Once the MAC has requested a receiver detect sequence (by asserting TxDetectRx/Loopback), theMAC must leave TxDetectRx/Loopback asserted until after the PHY has signaled completion bythe assertion of PhyStatus. When receiver detection is performed in USB mode with the PHY inP3 or PCIe in P2, the PHY asserts PhyStatus and signals the appropriate receiver detect valueuntil the MAC deasserts TxDetectRx/Loopback.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/3c5288aa0adf82b293af2956d17a0f410e2fbe4ec9156e148cb14952069b2f3e.jpg)


# 8.10 Transmitting a beacon – PCI Express Mode

When the PHY has been put in the P2 power state, and the MAC wants to transmit a beacon, theMAC deasserts TxElecIdle and the PHY should generate a valid beacon until TxElecIdle isasserted. The MAC must assert TxElecIdle before transitioning the PHY to P0.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/795b6ab5782e22cd5d71c02f5f4b062323153f6a372447b8a633c716c50708a3.jpg)


# 8.11 Transmitting LFPS – USB Mode

When the PHY is in P1 and the MAC wants to transmit LFPS, the MAC deasserts TxElecIdle andthe PHY should generate valid LFPS until TxElecIdle is asserted. The MAC must assertTxElecIdle before transitioning the PHY to P0. The length of time TxElecIdle is deasserted is

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

varied for different events. When the PHY is in P0 and the MAC wants to transmit LFPS, theMAC must assert both TxElecIdle and TxDetectRx/Loopback for the desired duration of an LFPSburst. The PHY is required to complete a full LFPS period before transitioning to SuperSpeeddata, and as a consequence may drop SuperSpeed data if these requests overlap. Thisrequirement does not apply to TxOnesZeros requests. Refer to chapter 6 in the USB 3.0specification for more details.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/51e88fc765a418092e08b1c4ccb4e726030d5fb3e9960d2ccf937c197bb85c5d.jpg)


# 8.12 Detecting a beacon – PCI Express Mode

The PHY receiver must monitor at all times (except during reset or when RxEIDetectDisable isset) for electrical idle. When the PHY is in the P2 power state, and RxElecIdle is deasserted, thena beacon is being detected.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/b5f1b4ffeaf893b837b066d3774e88b5a8a3c2fc74e85ab8dd4173681f73221f.jpg)


# 8.13 Detecting Low Frequency Periodic Signaling – USB Mode

The PHY receiver must monitor at all times (except during reset, when RX terminations areremoved, or when RxEIDetectDisable is set) for LFPS. When the PHY is in the P0, P1, P2, or P3power state, and RxElecIdle is deasserted, then LFPS is being detected. The length of timeRxElecIdle is deasserted indicates the length of time Low Frequency Periodic Signaling isdetected. Refer to chapter 6 in the USB 3.0 specification for more details on the length of LowFrequency Periodic Signaling (LFPS) for various events.

The PHY needs to differentiate LPFS received for Ping from Exit LFPS. When the PHY receivesLFPS for up to 2 cycles only, it should deassert RxElecIdle for a maximum of 200ns. For U1,there is a strict latency requirement for a USB controller to detect and respond back as defined inthe USB Spec chapter 6 LPFS section. The PHY should not take more than 120ns to deassertRxElecIdle after detecting LFPS in P0 and P1, and P2. For P3, the PHY is allowed to take us to10us to deassert RxElecIdle.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/411971a83ea9a57c5e767f0042b412c1c229273d15be70a9ecc3c77dc004e6f4.jpg)


# 8.14 Clock Tolerance Compensation

The PHY receiver contains an elastic buffer used to compensate for differences in frequenciesbetween bit rates at the two ends of a Link. The elastic buffer must be capable of holding enoughsymbols to handle worst case differences in frequency and worst case intervals between symbolsthat can be used for rate compensation for the selected PHY mode.

Two models are defined for the elastic buffer operation in the PHY. The PHY may support oneor both of these models. The Nominal Empty buffer model is only supported in PCI Express,USB or SATA Mode.

For the Nominal Empty buffer model the PHY attempts to keep the elasticity buffer as close toempty as possible. In Nominal Empty mode the PHY uses the RxDataValid interface to tell theMAC when no data is available. The Nominal Empty buffer model provides a smaller worst caseand average latency then the Nominal Half Full buffer model, but requires the MAC to supportthe RxDataValid signal. The PHY removes all SKP symbols in Nominal Empty buffer mode.

For the Nominal Half Full buffer model, the PHY is responsible for inserting or removing SKPsymbols, ordered sets, or ALIGNs in the received data stream to avoid elastic buffer overflow orunderflow. The PHY monitors the receive data stream, and when a Skip ordered-set or ALIGN isreceived, the PHY can add or remove one SKP symbol (PCI Express Mode at 2.5 or 5 GT/s) orfour SKP symbols (PCI Express Mode at 8 GT/s, 16 GT/s, or 32 GT/s) or one SKP ordered set(USB Mode at 5 GT/s) or one ALIGN from each SKP or ALIGN as appropriate to manage itselastic buffer to keep the buffer as close to half full as possible. In USBmode at 5 GT/S the PHYshall only add or remove SKP ordered sets. In USB mode at 10 GT/s the PHY shall only add orremove multiples of four SKP symbols. Whenever SKP symbol(s) or an ordered set is added to orremoved, the PHY will signal this to the MAC using the RxStatus[2:0] signals. These signalshave a non-zero value for one clock cycle and indicate whether a SKP symbol or ordered set wasadded to or removed from the received SKP ordered-set(s). For PCI Express, the timing ofRxStatus[2:0] assertion depends on the operational rate since SKP ordered sets are encodeddifferently in 8b/10b mode versus 128/130b mode. In PCI Express Mode at 2.5 or 5 GT/s,RxStatus[2:0] shall be asserted during the clock cycle when the COM symbol of the SKPordered-set is moved across the parallel interface. In PCI Express Mode at 8, 16 GT/s or 32GT/s, RxStatus[2:0] shall assert anytime between and including the start of the SKP ordered setand the SKP_END symbol. In SATA Mode whenever a ALIGN symbol is added or removed, thePHY will signal this to the MAC using the RxStatus[2:0] signals. These signals have a non-zerovalue for one clock cycle and indicate whether an ALIGN was added or removed. RxStatus shallbe asserted during the clock cycle when the first symbol of the added ALIGN is moved across theparallel interface.

In PCI Express mode, the rules for operating in Nominal Empty buffer mode are as follows:

Use of RxDataValid is required

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

• All SKP symbols of SOS are removed (8b/10b SKP or 128/130 AA)

• When an empty condition happens (caused by clock drift or SOS removal)

RxValid must remain high

RxValid should only be dropped for symbol alignment loss or blockalignment loss

• RxDataValid must be de-asserted

• RxStatus must be 0

• EB full can still occur and is considered an error

• Notification of an SOS coming through the EB must be reported in the following manner

8b/10b: COM of SOS must be passed with RxStatus $=$ SKP removed (010), SKPsymbols dropped

128/130: Start of SOS block, with first byte SKP_END or SKP_END_CTRL,must be passed with RxStatus $=$ SKP Removed (010), all AA SKP symbolsdropped

The EB is permitted to start RxDataValid as soon as data is available, but should neverassert faster than the usual RxDataValid rate

i.e. rate $^ { - 1 }$ , width $^ { = 2 }$ , pclk_rate $^ { - 2 }$ , RxDataValid should never assert for twoconsecutive pclk cycles

i.e. rate $^ { - 1 }$ , width $^ { = 2 }$ , pclk_rate $^ { - 3 }$ , RxDataValid assertions must always have atleast 3 pclk cycles of de-assertion between them

Example of valid optimization by EB:

• Rate $^ { = 1 }$ , width $^ { 1 = 2 }$ , pclk_rate=3

• RxDataValid $\scriptstyle \mathrm { { \tt t } = } 0 , \mathrm { { \tt t } = } 1$ , etc., E=EB Empty):

• 1000100010001000EE100010001

• Vs. non-optimized:

• 1000100010001000EE00100010001

Non-optimized design builds EB depth in-order to maintainRxDataValid fixed cycle rate

In USB mode for the Nominal Empty buffer model the PHY attempts to keep the elasticity bufferas close to empty as possible. This means that the PHY will be required to insert SKP orderedsets into the received data stream when no SKP ordered sets have been received, unless theRxDataValid signal is used. The Nominal Empty buffer model provides a smaller worst case andaverage latency then the Nominal Half Full buffer model, but requires the MAC to supportreceiving SKP ordered sets any point in the data stream.

In SATA mode for the Nominal Empty buffer model the PHY attempts to keep the elasticitybuffer as close to empty as possible. In Nominal Empty mode the PHY uses the RxDataValidinterface to tell the MAC when no data is available. The Nominal Empty buffer model provides asmaller worst case and average latency then the Nominal Half Full buffer model, but requires theMAC to support the RxDataValid signal.

It is recommended that a PHY and MAC support the Nominal Empty buffer model in USB modeusing the RxDataValid signal. The alternative of inserting SKPs in the data stream when noSKPs have been received is not recommended. The figure below shows a sequence where aPHY operating in PCI Express Mode added a SKP symbol in the data stream.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/313668355cfc1a3a47ac107d6609b799b5bb19292f12b7fe1d8b80139641f983.jpg)



Clock Correction - Add a SKP


The figure below shows a sequence where a PHY operating in PCI Express mode removed a SKPsymbol from a SKP ordered-set that only had one SKP symbol, resulting in a ‘bare’ COMtransferring across the parallel interface.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/2a76fdb7ddfd14d1933b6f032b82d7e6a83f40d2891bb5c73a4b87e6d3f06738.jpg)



Clock Correction - Remove a SKP


# 8.15 Error Detection

The PHY is responsible for detecting receive errors of several types. These errors are signaled tothe MAC layer using the receiver status signals (RxStatus[2:0]). Because of higher level errordetection mechanisms (like CRC) built into the Data Link layer there is no need to specificallyidentify symbols with errors, but reasonable timing information about when the error occurred inthe data stream is important. When a receive error occurs, the appropriate error code is assertedfor one clock cycle at the point in the data stream across the parallel interface closest to where theerror actually occurred. There are four error conditions (five for SATA mode) that can beencoded on the RxStatus signals. If more than one error should happen to occur on a receivedbyte (or set of bytes transferred across a 16-bit, 32-bit or 64-bit interface), the errors should besignaled with the priority shown below.

1. 8B/10B decode error or block decode error

2. Elastic buffer overflow

3. Elastic buffer underflow (Cannot occur in Nominal Empty buffer model)

4. Disparity errors

5. Misalign (SATA mode only)

If an error occurs during a SKP ordered-set or ALIGN, such that the error signaling and SKP orALIGN added/removed signaling on RxStatus would occur on the same PCLK, then the error

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

signaling has precedence.

Note that the PHY does not signal 128/130B (PCI Express) or 128/132B (USB) header errors.The raw received header bits are passed across the interface and the controller is responsible forany block header error detection/handling.

# 8.15.1 8B/10B Decode Errors

For a detected 8B/10B decode error, the PHY should place an EDB symbol (for PCIe or SATA) orSUB symbol (for USB) in the data stream in place of the bad byte, and encode RxStatus with adecode error during the clock cycle when the effected byte is transferred across the parallelinterface. In the example below, the receiver is receiving a stream of bytes Rx-a through Rx-z,and byte Rx-f has an 8B/10B decode error. In place of that byte, the PHY places an EDB (forPCIe or SATA) or SUB (for USB) on the parallel interface, and sets RxStatus to the 8B/10B decodeerror code. Note that a byte that can’t be decoded may also have bad disparity, but the 8B/10Berror has precedence. Also note that for greater than 8-bit interface, if the bad byte is on thelower byte lane, one of the other bytes may have bad disparity, but again, the 8B/10B error hasprecedence.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/56d8b66efdec58fda891ee167042e5da872a74f219bebe5932eb4f17ff2bbfd3.jpg)



8B/10B Decode Error


# 8.15.2 Disparity Errors

For a detected disparity error, the PHY should assert RxStatus with the disparity error code duringthe clock cycle when the affected byte is transferred across the parallel interface. For greater than8-bit interfaces, it is not possible to discern which byte (or possibly both) had the disparity error.In the example below, the receiver detected a disparity error on either (or both) Rx-e or Rx-f databytes, and indicates this with the assertion of RxStatus. Optionally, the PHY can signal disparityerrors as 8B/10B decode error (using code 0b100). (MACs often treat 8B/10B errors anddisparity errors identically.). When operating in USBmode signaling disparity errors is optional.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/f4aaf438e5fe76f61a22c920d01fcac57c4899e2e7017eec2c03c07529434516.jpg)



Disparity Error


# 8.15.3 Elastic Buffer Errors

For elastic buffer errors, an underflow should be signaled during the clock cycle or clock cycleswhen a spurious symbol is moved across the parallel interface. The symbol moved across theinterface should be the EDB symbol (for PCIe or SATA) or SUB symbol (for USB). In the timingdiagram below, the PHY is receiving a repeating set of symbols Rx-a thru Rx-z. The elasticbuffer underflows causing the EDB symbol (for PCIe) or SUB symbol (for USB) to be insertedbetween the Rx-g and Rx-h Symbols. The PHY drives RxStatus to indicate buffer underflowduring the clock cycle when the EDB (for PCIe) or SUB (for USB) is presented on the parallelinterface.

Note that underflow is not signaled when the PHY is operating in Nominal Empty buffer mode.In this mode SKP ordered sets are moved across the interface whenever data needs to be insertedor the RxDataValid signal is used. The RxDataValid method is preferred.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/59187c298c7610ca5df65cbdf156b271985f55d1c0604f3e946faf2960e66041.jpg)



Elastic Buffer Underflow


For an elastic buffer overflow, the overflow should be signaled during the clock cycle where thedropped symbol or symbols would have appeared in the data stream. For the 16-bit interface it isnot possible, or necessary, for the MAC to determine exactly where in the data stream the symbolwas dropped. In the timing diagram below, the PHY is receiving a repeating set of symbols Rx-athru Rx-z. The elastic buffer overflows causing the symbol Rx-g to be discarded. The PHYdrives RxStatus to indicate buffer overflow during the clock cycle when Rx-g would haveappeared on the parallel interface.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/ba99ff63ec88b3b486dc605cb674d0d02195eb514d2fae94086649ae1e017394.jpg)


# Elastic Buffer Overflow

# 8.15.3.1 Elastic Buffer Reset

The MAC can set the ElasticBufferResetControl bit (see section 7.1.9) to initiate an EB resetsequence in the PHY. The PHY must complete the EB reset sequence within 16 PCLK cycles asfollows:

• Assert RxStatus to value of 1xx with RxValid

• Hold RxStatus to 1xx while maintaining RxValid and RxDataValid

• Move pointers back to their initial state

Release RxStatus to indicate clean data is being forwarded again

# 8.16 Loopback

For USB and PCI Express Modes the PHY must support an internal loopback asdescribed in the corresponding base specification.

For SATA the PHY may optionally support an internal loopback mode whenEncodeDecodeBypass is asserted.

• In the SerDes architecture, loopback is handled in the MAC instead of the PHY.

The PHY begins to loopback data when the MAC asserts TxDetectRx/Loopback while doingnormal data transmission (i.e. when TxElecIdle is deasserted). The PHY must, within thespecified receive and transmit latencies, stop transmitting data from the parallel interface, andbegin to loopback received symbols. While doing loopback, the PHY continues to presentreceived data on the parallel interface.

The PHY stops looping back received data when the MAC deasserts TxDetectRx/Loopback.Transmission of data on the parallel interface must begin within the specified transmit latency.

The timing diagram below shows example timing for beginning loopback. In this example, thereceiver is receiving a repeating stream of bytes, Rx-a thru Rx-z. Similarly, the MAC is causingthe PHY to transmit a repeating stream of bytes Tx-a thru Tx-z. When the MAC assertsTxDetectRx/Loopback to the PHY, the PHY begins to loopback the received data to thedifferential $T x + / T x .$ - lines. Timing between assertion of TxDetectRx/Loopback and when Rx datais transmitted on the Tx pins is implementation dependent.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/9104f70341abd77b20bb46ec17653df4ac6263fbdced031fb768ce44e7cca266.jpg)


# Loopback start

The next timing diagram shows an example of switching from loopback mode to normal modewhen the PHY is operating in PCI Express Mode.

In PCI Express Mode, when the MAC detects an electrical idle ordered-set, the MAC deassertsTxDetectRx/Loopback and asserts TxElecIdle. The PHY must transmit at least three bytes of theelectrical idle ordered-set before going to electrical idle. (Note, transmission of the electrical idleordered-set should be part of the normal pipeline through the PHY and should not require thePHY to detect the electrical idle ordered-set). The base spec requires that a Loopback Slave beable to detect and react to an electrical idle ordered set within 1ms. The PHY’s contribution tothis time consists of the PHY’s Receive Latency plus the PHY’s Transmit Latency (see section6.13).

When the PHY is operating in USBMode, the device shall only transition out of loopback ondetection of LFPS signaling (reset) or when VBUS is removed. When valid LFPS signaling isdetected, the MAC transitions the PHY to the P2 power state in order to begin the LFPShandshake.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/a94703d6afef9a5afb71988c5e1d59a812518af1b5e62aa03e60d0656b432e63.jpg)


# 8.17 Polarity Inversion – PCI Express and USBModes

To support lane polarity inversion, the PHY must invert received data when RxPolarity isasserted. Inverted data must begin showing up on RxData[] within 20 PCLKs of whenRxPolarity is asserted.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/936c935835c2910bc3d72b30c3bf8991422bfe24452f08dd93c6acfbab3143d1.jpg)


# Polarity inversion

# 8.18 Setting negative disparity (PCI Express Mode)

To set the running disparity to negative, the MAC asserts TxCompliance for one clock cycle thatmatches with the data that is to be transmitted with negative disparity. For a 16-bit interface, thelow order byte will be the byte transmitted where running disparity is negative. The exampleshows how TxCompliance is used to transmit the PCI Express compliance pattern in PCI Expressmode. TxCompliance is only used in PCI Express mode and is qualified by TxDataValid whenTxDataValid is being used.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/59c5bf38b97d0c125d43ed8a045af67fc0786de740307ffd525ac068473b167b.jpg)



Loopback endSetting negative disparity


# 8.19 Electrical Idle – PCI Express Mode

The base spec requires that devices send an Electrical Idle ordered set before $\mathrm { T x } { + } / \mathrm { T x } { - }$ goes to theelectrical idle state. For a 16-bit interface or 32-bit interface, the MAC must always align theelectrical idle ordered set on the parallel interface so that the COM symbol is on the low-orderdata lines (TxDataK[7:0]). Figure 8-7 shows an example of electrical idle exit and entry for aPCI Express 8 GT/s or 16 GT/s interface. TxDataValid must be asserted whenever TxElecIdletoggles as it is used as a qualifier for sampling TxElecIdle. Note: For SerDes architecture, 1 bitof TxElecIdle is required per 16-bits of data.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/207750b9a2945f3fdb405e3b9e2180d7481a7a5baa789d9dde6ba8026385ffd3.jpg)



Electrical Idle


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/0dc4423325a8a5e62a55ff41ca5ec8451146a218823ff0e9d8f06b9a5f6500bd.jpg)



Note:



• TxDataValid can assert earlier before TxElecIdle toggles.



TxDataValid can de-assert anytime after TxElecIdle asserts as long as it does not overlap with the next Electrical Idle exit sequence.



TxElecIdle must de-assert at the same clock TxStartBlock asserts.


# Figure 8-11 – PCI Express 3.0 TxDataValid Timings for Electrical Idle Exitand Entry.

Note: Figure 8-7 only shows two blocks of TxData and thus TxDataValid does not de—assertduring the data. Other examples in the specification show longer sequences where TxDataValidde-asserts.

When data throttling is happening, TxElecIdle must be set long enough to be sampled byTxDataValid as shown in Figure 8-8.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/6e5e8535dedb5b2844580f2ab4427471c915073381447c1d4956a665ac7bb49f.jpg)



Figure 8-12. Data Throttling and TxElecIdle


The PIPE specification does not require RxStandby to be asserted within any amount of time afterElectrical Idle or that it be asserted at all. Individual PHYs must specify their own timingrequirements for RxStandby assertion, which may vary depending on whether they havestaggering requirements.

# 8.20 Link Equalization Evaluation

While in the P0 power state, the PHY can be instructed to perform evaluation of the current TXequalization settings of the link partner. Basic operation of the equalization evaluation is that

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

the MAC requests the PHY to evaluate the current equalization settings by asserting RxEqEval.When the PHY has completed evaluating the current equalization settings, it asserts PhyStatus forone clock and drives the LinkEvaluationFeedback signals to the appropriate feedback response.After link equalization evaluation has completed (as signaled by the assertion of PhyStatus), theMAC must deassert RxEqEval before initiating another evaluation. Figure 8-9 shows anexample of the timings for a successful link equalization evaluation request. Figure 8-10 showsan example of the timings for a link equalization evaluation request resulting in feedback that isan invalid request.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/4a096234b9f962b5c84856f59c074e3ce996b84e41cf0edd19aa623510441ef1.jpg)



Note:



• RxEqEval can de-assert at the same clock the corresponding PhyStatus de-asserts or later as long as RxEqEval de-asserts prior to the next RX Equalization Request.



Back-to-back RxEqEval request can happen as close as one clock apart (i.e. RxEqEval can de-assert for one clock before it re-asserts again to start the next RX Equalization request.



Figure 8-13 – PCI Express 8GT/s or higher Successful EqualizationEvaluation Request


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/983bab1c2eab044180728cbec51609d843ba88a857e8666064bc8c2e6c04f408.jpg)



Note:



InvalidRequest assertion happens after the de-assertion of RxEqEval.



InvalidRequest must de-assert at the same clock RxEqEval for the next RX Equalization request asserts.



InvalidRequest could be asserted for as little as one PCLK pulse.


# Figure 8-14 – PCI Express 3.0 Equalization Evaluation Request Resulting inInvalid Feedback

Once the MAC has requested link equalization evaluation (by asserting RxEqEval), the MACmust leave RxEqEval asserted until after the PHY has signaled completion by the assertion ofPhyStatus unless the MAC needs to abort the evaluation due to high level timeouts or errorconditions. To abort an evaluation the MAC de-asserts RxEqEval before the PHY has signaledcompletion. If the MAC aborts the evaluation the PHY must signal completion as quickly aspossible. The MAC ignores returned evaluation values in an abort scenario.

Note: If a race condition occurs where the MAC aborts by deasserting RxEqEval on same cycleas the PHY asserts PhyStatus then the PHY shall not take any further action.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 8.21 Implementation specific timing and selectable parameter support

PHY vendors (macrocell or discrete) must specify typical and worst case timings for the caseslisted in Table 8-1. Other implementation specific parameters listed in Table 8-1 must also bespecified advertised by the PHY in its datasheet.


Table 8-2 Parameters Advertised in PHY Datasheet


<table><tr><td>Transmit Latency</td><td>Time for data moving between the parallel interface and the PCI Express, SATA or USB serial lines. Timing is measured from when the data is transferred across the parallel interface (i.e. the rising edge of PCLK) and when the first bit of the equivalent 10-bit symbol is transmitted on the Tx+/Tx- serial lines. The PHY reports the latency for each operational mode the PHY supports.
Note: If the transmit latency is different when EncodeDecodeBypass is asserted – the PHY must report this latency separately.</td></tr><tr><td>Receive Latency</td><td>Time for data moving between the parallel interface and the PCI Express, SATA or USB serial lines. Timing is measured from when the first bit of a 10-bit symbol is available on the Rx+/Rx- serial lines to when the corresponding 8-bit data is transferred across the parallel interface (i.e. the rising edge of PCLK). The PHY reports the latency for each operational mode the PHY supports. The reported latency is the nominal latency assuming the elasticity buffer is full to its nominal operating level.
Note: If the receive latency is different when EncodeDecodeBypass is asserted – the PHY must report this latency separately. Additionally, the expected latency must be reported separately for both elasticity buffer operating modes.</td></tr><tr><td>Power State After Reset</td><td>The PHY power state immediately following reset. The state after reset needs to provide PCLK and have common mode off.
Reporting this parameter is required if the PHY supports either SATA mode or PCI Express mode at 8 GT/s.</td></tr><tr><td>Loopback enable latency</td><td>Amount of time it takes the PHY to begin looping back receive data. Timed from when TxDetectRx/Loopback is asserted until the receive data is being transmitted on the serial pins. The PHY reports the latency for each operational mode the pHY supports.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Transmit Beacon – PCI Express Mode.</td><td>Timed from when the MAC directs the PHY to send a beacon (power state is P2 and TxElecIdle is deasserted) until the beacon signaling begins at the serial pins.</td></tr><tr><td>Receive Beacon – PCI Express Mode</td><td>Timed from when valid beacon signaling is present at the receiver pins until RxElecIdle is deasserted.</td></tr><tr><td>Transmit LFPS – USB Mode</td><td>Timed from when the MAC directs the PHY to send LFPS signaling until the LFPS signaling begins at the serial pins. Times are reported for each possible P state if the times are different for different power states.</td></tr><tr><td>Receive LFPS – USB Mode</td><td>Timed from when valid LFPS signaling is present at the receiver pins until RxElecIdle is deasserted.</td></tr><tr><td>N_FTS with common clock (PCI Express Mode)</td><td>Number of FTS ordered sets required by the receiver to obtain reliable bit and symbol lock when operating with a common clock. Note: This value may be required to be reported separately per rate.</td></tr><tr><td>N_FTS without common clock (PCI Express Mode)</td><td>Number of FTS ordered sets required by the receiver to obtain reliable bit and symbol lock when operating without a common clock. Note: This value may be required to be reported separately per rate.</td></tr><tr><td>PHY lock time</td><td>Amount of time for the PHY receiver to obtain reliable bit and symbol lock after valid symbols are present at the receiver. The PHY reports the time for each operational mode the PHY supports.</td></tr><tr><td>P0s to P0 transition time PCI Express Mode.</td><td>Amount of time for the PHY to return to P0 state, after having been in the P0s state. Time is measured from when the MAC sets the PowerDown signals to P0 until the PHY asserts PhyStatus. PHY asserts PhyStatus when it is ready to begin data transmission and reception.</td></tr><tr><td>P1 to P0 transition time. PCI Express Mode.</td><td>Amount of time for the PHY to return to P0 state, after having been in the P1 state. Time is measured from when the MAC sets the PowerDown signals to P0 until the PHY asserts PhyStatus. PHY asserts PhyStatus when it is ready to begin data transmission and reception.</td></tr><tr><td>P2 to P0 transition time PCI Express Mode.</td><td>Amount of time for the PHY to go to P0 state, after having been in the P2 state. Time is measured from when the MAC sets the PowerDown signals to P1 until the PHY deasserts PhyStatus.</td></tr><tr><td>P1 to P0 transition time. USB Mode.</td><td>Amount of time for the PHY to return to P0 state, after having been in the P1 state. Time is</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td>measured from when the MAC sets the PowerDown signals to P0 until the PHY asserts PhyStatus. PHY asserts PhyStatus when it is ready to begin data transmission and reception.</td></tr><tr><td>P2 to P0 transition time. USB Mode.</td><td>Amount of time for the PHY to return to P0 state, after having been in the P2 state. Time is measured from when the MAC sets the PowerDown signals to P0 until the PHY asserts PhyStatus. PHY asserts PhyStatus when it is ready to begin data transmission and reception.</td></tr><tr><td>P3 to P0 transition time USB Mode.</td><td>Amount of time for the PHY to go to P0 state, after having been in the P3 state. Time is measured from when the MAC sets the PowerDown signals to P0 until the PHY deasserts PhyStatus. PHY asserts PhyStatus when it is ready to begin data transmission and reception.</td></tr><tr><td>Power state transition times between two power states that provide PCLK.</td><td>Amount of time for the PHY to transition to a new power state. Time is measured from when the MAC sets the PowerDown signals to POWER_STATE_X until the PHY asserts PhyStatus. PHY asserts PhyStatus when it is ready to begin data transmission and reception. The PHY reports this transition between each pair of power states it supports in each PHY mode it supports.</td></tr><tr><td>Power state transition times between a power state without PCLK and a power state with PCLK.</td><td>Amount of time for the PHY to go to a power state providing PCLK, after having been in a power state that does not provide PCLK. Time is measured from when the MAC sets the PowerDown signals to the new power state until the PHY deasserts PhyStatus. The PHY reports this time for each possible transition between a power state that does not provide PCLK and a power state that does provide PCLK. The PHY reports this transition time between each pair of power states it supports in each PHY mode it supports.</td></tr><tr><td>Power state transition times between a power state without PCLK and a power state without PCLK.</td><td>Amount of time for the PHY to go to a power state without PCLK, after having been in a power state that does not provide PCLK. Time is measured from when the MAC sets the PowerDown signals to the new power state until the PHY deasserts PhyStatus. The PHY reports this time for each possible transition between a power state that does not provide PCLK and a power state that does not provide PCLK. The PHY reports this transition time between each pair of power states it supports in each PHY mode it supports.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>Supported power states.</td><td colspan="4">The PHY lists each power state it supports for each PHY mode it supports. For each power state supported it reports whether PCLK is provided, the exit latency to the active power state, whether RxElecIdle is supported in the state, and the common mode state. Note: This is done for all states not already listed separately.</td></tr><tr><td>L1 Substate Management Mechanism</td><td colspan="4">The PHY reports which of the following mechanisms it supports for L1 substate management: 
1) Exclusively managed via 
PowerDown[3:0] 
2) Managed via RxEIDetectDisable and 
TxCommonModeDisable 
3) Both of the above mechanisms are supported</td></tr><tr><td>LFPS Circuit Disable for USB Mode</td><td colspan="4">The PHY reports whether the MAC can use RxEIDetectDisable to disable the LFPS circuit for power savings.</td></tr><tr><td>Simultaneous Rate and Power State Change</td><td colspan="4">The PHY reports if it supports simultaneous rate and power state changes for each PHY mode it supports.</td></tr><tr><td>Data Rate change time. PCI Express Mode and SATA Mode.</td><td colspan="4">Amount of time the PHY takes to perform a data rate change. Time is measured from when the MAC changes Rate to when the PHY signals rate change complete with the single clock assertion of PhyStatus. There may be separate values for each possible change between different supported rates for each supported PHY mode.</td></tr><tr><td rowspan="10">Transmit Margin values supported. PCI Express Mode and USB Mode.</td><td colspan="4">Transmitter voltage levels.</td></tr><tr><td>[2]</td><td>[1]</td><td>[0]</td><td>Description</td></tr><tr><td>0</td><td>0</td><td>0</td><td>TxMargin value 0 =</td></tr><tr><td>0</td><td>0</td><td>1</td><td>TxMargin value 1 =</td></tr><tr><td>0</td><td>1</td><td>0</td><td>TxMargin value 2 =</td></tr><tr><td>0</td><td>1</td><td>1</td><td>TxMargin value 3 =</td></tr><tr><td>1</td><td>0</td><td>0</td><td>TxMargin value 4 =</td></tr><tr><td>1</td><td>0</td><td>1</td><td>TxMargin value 5 =</td></tr><tr><td>1</td><td>1</td><td>0</td><td>TxMargin value 6 =</td></tr><tr><td>1</td><td>1</td><td>1</td><td>TxMargin value 7 =</td></tr><tr><td>Max Equalization Settings for C-1</td><td colspan="4">Reports the maximum number of settings supported by the PHY for the 8.0 GT/s, 16 GT/s, and 32 GT/s equalization. The maximum number of settings must be less than 64.</td></tr><tr><td>Max Equalization Settings for C0</td><td colspan="4">Reports the maximum number of settings supported by the PHY for the 8.0 GT/s, 16 GT/s, and 32 GT/s equalization. The maximum number of settings must be less than 64.</td></tr><tr><td>Max Equalization Settings for C1</td><td colspan="4">Reports the maximum number of settings supported by the PHY for the 8.0 GT/s, 16 GT/s, and 32 GT/s equalization. The maximum number of settings must be less than 64.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td>and 32 GT/s equalization. The maximum number of settings must be less than 64.</td></tr><tr><td>Default Equalization settings for full swing preset Pn.</td><td>Reports the recommended setting values for C-1, C0, C1 for each full swing preset. Note: This should be reported separately per rate.</td></tr><tr><td>Default Equalization settings for half swing preset Pn.</td><td>Reports the recommended setting values for C-1, C0, C1 for each half swing preset. Note: This should be reported separately per rate.</td></tr><tr><td>Default Equalization settings for recommended TX EQ value of 0 dB preshoot and -2.5 dB de-emphasis.</td><td>Reports the recommended setting values for C-1, C0, C1 for the USB 3.1 0 dB preshoot and -2.5 dB de-emphasis recommended TX EQ setting.</td></tr><tr><td>Default Equalization settings for recommended TX EQ value of 2.7 dB preshoot and -3.3 dB de-emphasis.</td><td>Reports the recommended setting values for C-1, C0, C1 for the USB 3.1 0 dB preshoot and -2.5 dB de-emphasis recommended TX EQ setting.</td></tr><tr><td>Default Equalization settings for recommended TX EQ value of 2.2 dB preshoot and -3.1 dB de-emphasis</td><td>Reports the recommended setting values for C-1, C0, C1 for the USB 3.2 2.2 dB preshoot and -3.1 dB de-emphasis.</td></tr><tr><td>Default Equalization settings for recommended TX EQ value of 0 dB preshoot and 0 dB de-emphasis</td><td>Reports the recommended setting values for C-1, C0, C1 for the USB 3.2 0 dB preshoot and 0 dB de-emphasis.</td></tr><tr><td>Default Equalization settings for recommended TX EQ value of 0 dB preshoot and -3.1 dB de-emphasis</td><td>Reports the recommended setting values for C-1, C0, C1 for the USB 3.2 0 dB preshoot and -3.1 dB de-emphasis.</td></tr><tr><td>Default Equalization settings for recommended TX EQ value of 2.2 dB preshoot and 0 dB de-emphasis</td><td>Reports the recommended setting values for C-1, C0, C1 for the USB 3.2 2.2 dB preshoot and 0 dB de-emphasis.</td></tr><tr><td>Dynamic Preset Coefficient Update Support</td><td>A PHY indicates if it dynamically updates coefficients.</td></tr><tr><td>Figure of Merit range</td><td>If the PHY reports link equalization feedback in the Figure of Merit format it reports the maximum value it will report. The maximum value must be less than 256.</td></tr><tr><td>Figure of Merit for BER target</td><td>If the PHY reports link equalization feedback in the Figure of Merit format it reports the minimum value that the PHY estimates corresponds to a link BER of E-12.</td></tr><tr><td>Default Link Partner Preset[3:0]</td><td>If the PHY prefers the link parter to start with a specific preset during link evaluation it reports the preferred starting preset.The default link partner preset value is encoded as follows:0000b – Preset P0.0001b – Preset P1.0010b – Preset P2.0011b – Preset P3.0100b – Preset P4.0101b – Preset P5.0110b – Preset P6.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td>0111b – Preset P7.
1000b – Preset P8.
1001b – Preset P9.
1010b – Preset P10.
1011b – Reserved
1100b – Reserved
1101b – Reserved
1110b – Reserved
1111b – No Preference.
Note: This should be reported separately per rate.</td></tr><tr><td>Beacon Support</td><td>The PHY indicates whether it supports beacon transmission. Beacon transmission is optional.
1: Beacon transmission is supported.
0: Beacon transmission is not supported.</td></tr><tr><td>EncodeDecodeBypassSupport[3:0]</td><td>The PHY indicates whether it supports optional EncodeDecodeBypass mode at each signaling rate.
[0] Rate[1:0] = 0
[1] Rate[1:0] = 1
[2] Rate[1:0] = 2
[3] Rate[1:0] = 3
The support value for each rate is encoded as follows:
0 - No support for EncodeDecodeBypass
1 - Support for EncodeDecodeBypass</td></tr><tr><td>NoDeemphasisSupport[1:0]</td><td>The PHY indicates whether it supports an optional No De-emphasis signaling mode at 2.5 and 5.0 GT/s signaling rates.
[0] Support at 2.5 GT/s
[1] Support at 5.0 GT/s
The support value for each rate is encoded as follows:
0 - No support for a no de-emphasis signaling mode.
1 - Support for a no de-emphasis signaling mode.</td></tr><tr><td>SupportedLFPresets</td><td>List of presets the PHY supports at 8 GT/s, 16 GT/s, and 32 GT/s for half swing in addition to the 5 required by the base spec.</td></tr><tr><td>PCLK Mode[1:0]</td><td>The PHY indicates whether it support PCLK as a PHY output or PCLK as a PHY input.
[0] Supports PCLK as an output
[1] Supports PCLK as an input</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td>The support value for each rate is encoded as follows:0 - No support.1 - Support.Configuration for a PHY that supports both PCLK modes is PHY specific.</td></tr><tr><td>PHYClockInsertionDelay</td><td>A PHY that supports “PCLK as an input” mode must report the maximum delay and the minimum delay (insertion delay) for any sequential logic at the MAC/PHY interface that will use PCLK in the PHY in picoseconds.</td></tr><tr><td>SupportedPhyModes</td><td>List of all modes the PHY supports for the PHY Mode[1:0] input.</td></tr><tr><td>MaximumPCIExpressRate</td><td>Value for DataRate input corresponding to the maximum rate the PHY supports while in PCI Express mode.This field is undefined if the PHY does not support PCI Express mode.</td></tr><tr><td>MaximumSataRate</td><td>Value for the DataRate input corresponding to the maximum rate the PHY supports while in Sata Mode.This field is undefined if the PHY does not support Sata mode.</td></tr><tr><td>ListofSupportedSataModes</td><td>List of all supported signaling rate, width, PCLK rate combinations supported in Table 3-2.</td></tr><tr><td>ListofSupportedPCIExpressModes</td><td>List of all supported signaling rate, width, PCLK rate combinations supported in Table 3-1.</td></tr><tr><td>MaximumEntriesInElasticityBuffer</td><td>Maximum number of entries that can be stored in the elasticity buffer. The PHY reports the maximum number of entries for each operational mode the PHY supports.</td></tr><tr><td>ElasticityBufferEntrySize</td><td>Size of a data entry in the elasticity buffer in bits. The PHY reports this size for each operation mode the PHY supports.</td></tr><tr><td>MaximumElasticBufferLocationUpdateFrequency</td><td>Maximum update frequency the PHY supports for updating the ElasticBufferLocation register. This field is only relevant for original PIPE architecture.</td></tr><tr><td>MinimumElasticBufferLocationUpdateFrequency</td><td>Minimum update frequency the PHY supports for updating the ElasticBufferLocation register. This field is only relevant for original PIPE architecture.</td></tr><tr><td>EnhancedPTMTimingSupport</td><td>The PHY indicates whether it supports optional elasticity buffer location information through the ElasticBufferLocation control signals to allow more accurate timing of received packets within the MAC.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td>The support value is encoded as follows:0 – No support.1 – Support.</td></tr><tr><td>L1PMSubStatesSupport</td><td>The PHY indicates whether it supports optional L1 PM Substates. A PHY which supports L1 PM Substates must support asynchronous power state transitions.The support value is encoded as follows:0 – No support.1 – Support.</td></tr><tr><td>RXMarginingVoltageSupported7</td><td>The PHY indicates whether it supports voltage marginng, encoded as follows:0 – No Support1 – Support.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingSamplingRateVoltage[5:0]7</td><td>Percentage of bits margined during voltage marginng mode is calculated as 1/64*(Sampling_Rate[5:0]+1). Allowable values: 0-63.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingSamplingRateTiming[5:0]7</td><td>Percentage of bits margined during timing marginng mode is calculated as 1/64*(Sampling_Rate[5:0]+1). Allowable values: 0-63.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingIndependentLeftRight7</td><td>The PHY indicates whether it supports independent left and right time marginng. The support value is encoded as follows:0 – No Support1 – Support.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingIndependentUpDown7</td><td>The PHY indicates whether it supports independent up and down voltage marginng. The support value is encoded as follows:0 – No Support1 – Support.The PHY needs to specify this value for PCI</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td>Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingIndependentErrorSampler7</td><td>The PHY indicates whether it supports an error sampler independent from the main sampler to allow higher BER&#x27;s to be measured. The support value is encoded as follows:0 - No Support1 - Support.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingVoltageSteps[6:0]7</td><td>Total number of voltage steps, minimum range +/- 50mV. A value of zero indicates that voltage marginin is not supported. Allowable non-zero values: 32-127.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingTimingSteps[5:0]7</td><td>Total number of timing steps, minimum range +/-0.2UI. Allowable values: 8-63.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingMaxVoltageOffset[6:0]7</td><td>Offset at maximum step value as percentage of one volt. Allowable values: 5-50.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingMaxTimingOffset[6:0]7</td><td>Offset at maximum step value as percentage of nominal UI. Allowable values: 20-50.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingMaxLanes[5:0]7</td><td>Maximum number of lanes that can be margined simultaneously. Allowable values: 1-32.Recommended value=number of lanes the PHY supports.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingSampleReportingMethod7</td><td>Indicates whether a sample frequency or a sample count is reported. This value is encoded as follows:0 - Sample Count Reported1 - Sample Frequency ReportedThe PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginingMaxTimingOffsetChange[6 :0]</td><td>Maximum number of steps margin offset can be changed with one command during timing marginin. Allowable values: 1-127.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td>The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMarginatingMaxVoltageOffsetChange[6:0]</td><td>Maximum number of steps margin offset can be changed with one command during voltage marginining. Allowable values: 1-127.The PHY needs to specify this value for PCI Express at 16 GT/s and 32 GT/s.</td></tr><tr><td>RXMessageBusWriteBufferDepth[3:0]</td><td>The PHY indicates the number of write buffer entries that it has implemented to receive writes from the MAC, where one entry can hold the three bytes of information associated with each write transaction.</td></tr><tr><td>TXMessageBusMinWriteBufferDepth[3:0]</td><td>The PHY indicates the minimum number of write buffer entries it expects the MAC to implement to receive writes from the PHY.Allowable values: 0-8. The MAC may choose to implement more than the minimum required by the PHY; however, there may not be any benefit in doing so.</td></tr><tr><td>WidthChangeHandshakeRequirement</td><td>The PHY indicates whether it needs the MAC to use the PclkChangeOk/PclkChangeAck handshake for rate plus width changes.</td></tr><tr><td>RateChangeHandshakeRequirement</td><td>The PHY indicates whether it needs the MAC to use the PclkChangeOK/PclkChangeAck handshake for all rate changes.</td></tr><tr><td>AsynchReceiverDetectSupport</td><td>The PHY indicates whether is supports asynchronous receiver detection in PCIe P2 power state.</td></tr><tr><td>EIOS to Valid Electrical Idle Transition Time (PCIe mode)</td><td>The PHY indicates the value of TTX-IDLE-SET-TO-IDLE.</td></tr><tr><td>Datapath Options Supported</td><td>The PHY indicates whether it supports SerDes architecture and/or Original PIPE. The PHY specifies how it should be configured to use one or the other option.</td></tr><tr><td>Control Path Options Supported</td><td>The PHY indicates whether it support the Low Pin Count signal interface and/or the legacy signal interface. The PHY specifies how it should be configured to use one or the other option.</td></tr></table>

# 8.22 Control Signal Decode table – PCI Express Mode

The following table summarizes the encodings of four of the seven control signals that causedifferent behaviors depending on power state. For the other three signals, Reset# alwaysoverrides any other PHY activity. TxCompliance and RxPolarity are only valid when the PHY isin P0 and is actively transmitting. Note that these rules only apply to lanes that have not been

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

‘turned off’ as described in section 8 (Multi-lane PIPE).

<table><tr><td>PowerDown[1:0]</td><td>TxDetectRx/ Loopback</td><td>TxElecIdle</td><td>Description</td></tr><tr><td rowspan="4">P0: 00b</td><td>0</td><td>0</td><td>PHY is transmitting data. MAC is providing data bytes to be sent every clock cycle.</td></tr><tr><td>0</td><td>1</td><td>PHY is not transmitting and is in electrical idle.</td></tr><tr><td>1</td><td>0</td><td>PHY goes into loopback mode.</td></tr><tr><td>1</td><td>1</td><td>Illegal. MAC should never do this.</td></tr><tr><td rowspan="2">P0s: 01b</td><td rowspan="2">Don’t care</td><td>0</td><td>Illegal. MAC should always have PHY doing electrical idle while in P0s. PHY behavior is undefined if TxElecIdle is deasserted while in P0s or P1.</td></tr><tr><td>1</td><td>PHY is not transmitting and is in electrical idle.
Note that any data transferred across the PIPE interface before TxElecIdle is asserted, but not yet signaled on the analog interface is signaled before the analog interface becomes idle.</td></tr><tr><td rowspan="3">P1: 10b</td><td>Don’t care</td><td>0</td><td>Illegal. MAC should always have PHY doing electrical idle while in P1. PHY behavior is undefined if TxElecIdle is deasserted while in P0s or P1.</td></tr><tr><td>0</td><td>1</td><td>PHY is idle.</td></tr><tr><td>1</td><td>1</td><td>PHY does a receiver detection operation.</td></tr><tr><td rowspan="3">P2: 11b</td><td>Don’t care</td><td>0</td><td>PHY transmits Beacon signaling</td></tr><tr><td>0</td><td>1</td><td>PHY is idle</td></tr><tr><td>1</td><td>1</td><td>PHY does a receiver detection operation</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 8.23 Control Signal Decode table – USB Mode and Converged IO Mode

The following table summarizes the encodings of four of the seven control signals that causedifferent behaviors depending on power state. For the other three signals, Reset# alwaysoverrides any other PHY activity. RxPolarity is only valid, and therefore should only be asserted,when the PHY is in P0 and is actively transmitting.

<table><tr><td>PowerDown[1:0]</td><td>TxDetectRx/ Loopback</td><td>TxElecIdle</td><td>Description</td></tr><tr><td rowspan="4">P0: 00b</td><td>0</td><td>0</td><td>PHY is transmitting data. MAC is providing data bytes to be sent every clock cycle.</td></tr><tr><td>0</td><td>1</td><td>PHY is not transmitting and is in electrical idle.
Note that any data transferred across the PIPE interface before TxElecIdle is asserted, but not yet signaled on the analog interface is signaled before the analog interface becomes idle.</td></tr><tr><td>1</td><td>0</td><td>PHY goes into loopback mode.</td></tr><tr><td>1</td><td>1</td><td>PHY transmits LFPS signaling.</td></tr><tr><td rowspan="2">P1: 01b</td><td rowspan="2">Don’t care</td><td>0</td><td>PHY transmits LFPS signaling</td></tr><tr><td>1</td><td>PHY is not transmitting and is in electrical idle.</td></tr><tr><td rowspan="3">P2: 10b or P3: 11b</td><td>Don’t care</td><td>0</td><td>Not allowed</td></tr><tr><td>0</td><td>1</td><td>PHY is idle.</td></tr><tr><td>1</td><td>1</td><td>PHY does a receiver detection operation.</td></tr></table>

# 8.24 Control Signal Decode table – SATA Mode

The following table summarizes the encodings of the control signals that cause differentbehaviors in POWER_STATE_0. For other control signals, Reset# always overrides any otherPHY activity.

Note: The PHY transmit latency reported in section 8.210must be consistent for all the differentbehaviors in POWER_STATE_0. This means that the amount of time OOB signaling is presenton the analog TX pair must be the same as the time OOB signaling was indicated on the PIPEinterface.

<table><tr><td>PowerDown[2:0]</td><td>TxDetectRx/ Loopback</td><td>TxElecIdle</td><td>Description</td></tr><tr><td rowspan="3">POWER_STATE_0: 00b</td><td>0</td><td>0</td><td>PHY is transmitting data. MAC is providing data bytes to be sent every clock cycle.</td></tr><tr><td>0</td><td>1</td><td>PHY is not transmitting and is in electrical idle.
Note that any data transferred across the PIPE interface before TxElecIdle is asserted, but not yet signaled on the analog interface is signaled before the analog interface becomes idle.</td></tr><tr><td>1</td><td>0</td><td>PHY goes into loopback mode.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td>1</td><td>1</td><td>PHY transmits OOB signaling with pattern determined by TX Pattern.
Note that a PHY must ensure the transition between OOB signaling and data signaling is performed smoothly on a symbol boundary on the analog interface.</td></tr><tr><td rowspan="2">Power Stater other than POWER_STATE_0</td><td rowspan="2">Don’t care</td><td rowspan="2">Don’t care</td><td>PHY is not transmitting and is in electrical idle.</td></tr><tr><td>PHY is not transmitting and is in electrical idle.</td></tr></table>

# 8.25 Required synchronous signal timings

To improve interoperability between MACs and PHYs from different vendors the followingtimings for synchronous signals are required:

<table><tr><td>Setup time for input signals</td><td>No greater than 25% of cycle time</td></tr><tr><td>Hold time for input signals</td><td>0ns</td></tr><tr><td>PCLK to data valid for outputs</td><td>No greater than 25% of cycle time</td></tr></table>

# 8.26 128b/130b Encoding and Block Synchronization (PCI Express 8 GT/s,16 GT/s, and 32 GT/s)

For every block (usually 128 bits – shorter/longer SKP blocks are sometimes transmitted byRetimers) that is moved across the PIPE TxData interface at the 8.0 GT/s rate, 16 GT/s rate, or 32GT/s rate, the PHY must transmit 2 extra bits. The MAC must use the TxDataValid signalperiodically to allow the PHY to transmit the built up backlog of data. For example – if theTxData bus is 16 bits wide and PCLK is 500 Mhz then every 8 blocks the MAC must deassertTxDataValid for one PCLK to allow the PHY to transmit the 16 bit backlog of built up data. Thebuffers used by the PHY to store TX data related to the 128/130b encoding rate mismatch mustbe empty when the PHY comes out of reset and must be empty whenever the PHY exits electricalidle (since TX buffers are flushed before entry to idle). The PHY must use RxDataValid in asimilar fashion. TxDataValid and RxDataValid must be de-asserted for one clock exactly everyN blocks when the PIPE interface is operating at 8 GT/s or $1 6 \mathrm { G T } / \mathrm { s }$ , where N is 4 for an 8 bitwide interface, 8 for a 16 bit wide interface, and 16 for a 32 bit wide interface. The MAC mustfirst de-assert TxDataValid immediately after the end of the Nth transmitted block following resetor exit from electrical idle. Examples of the timing for TxDataValid are shown in Figure 8-11 fora 8 bit interface and in Figure 8-12 for a 16 bit interface. The PHY must first de-assertRxDataValid immediately after the end of the Nth received block transmitted across the PIPEinterface following reset or exit from electrical idle. Examples of timings for RxDataValid andother Rx related signals for a 16 bit wide interface are shown in Figure 8-13.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/018289f46deab114c3b7de6567e96266d0ec1e76d7b0f1721f9d2568680445ed.jpg)



Figure 8-15 – PCI Express 8 GT/s or higher TxDataValid Timing for 8 BitWide TxData Interface


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/ddad48652d1e6f1f283fddf9ab1e35e355d32aae7c6cb8bc9c203fec50e36476.jpg)



Figure: TxDataValid Timing for 16-bit TxData Interface


Figure 8-16 – PCI Express 8 GT/s or higher TxDataValid Timing for 16 BitWide TxData Interface

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/3519a15aefaff547a420e813a3ea03ece954dc90bc593dbee127d8e56e594902.jpg)



Notes:



RxValid assertion indicates that PHY has achieved block alignment.



RxValid assertion aligns with the first RxStartBlock.



• RxDataValid can assert before RxValid toggles or at the latest the same clock when RxValid toggles.



• There is no required relationship between BlockAlignControl de-assertion and RxStartBlock.



Figure 8-17 – PCI Express 8 GT/s or higher RxDataValid Timing for 16 BitWide RxData Interface


There are situations, such as upconfigure, when a MAC must start transmissions on idle laneswhile some other lanes are already active. In any such situation the MAC must wait until thecycle after TxDataValid is de-asserted to allow the PHY to transmit the backlog of data due to

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

128b/130b to start transmissions on previously idle lanes.

# 8.27 128b/132b Encoding and Block Synchronization (USB 10 GT/s)

For every 128 bits that are moved across the PIPE TxData interface at the $1 0 . 0 \mathrm { G T / s }$ rate the PHYmust transmit 132 bits. The MAC must use the TxDataValid signal periodically to allow thePHY to transmit the built up backlog of data. For example – if the TxData bus is 16 bits wide andPCLK is $6 2 5 \mathrm { M h z }$ then every 4 blocks the MAC must deassert TxDataValid for one PCLK toallow the PHY to transmit the 16 bit backlog of built up data. The buffers used by the PHY tostore TX data related to the 128/132b encoding rate mismatch must be empty when the PHYcomes out of reset and must be empty whenever the PHY exits electrical idle (since TX buffersare flushed before entry to idle). The PHY must use RxDataValid in a similar fashion.TxDataValid and RxDataValid must be de-asserted for one clock exactly every N blocks whenthe PIPE interface is operating at $1 0 \mathrm { G T } / \mathrm { s }$ , where N is 2 for an 8 bit wide interface, 4 for a 16 bitwide interface, and 8 for a 32 bit wide interface. The MAC must first de-assert TxDataValidimmediately after the end of the Nth transmitted block following reset or exit from electrical idle.

# 8.28 Message Bus Interface

# 8.28.1 General Operational Rules

The message bus interface can be used after Reset# is deasserted and PCLK is stable. Themessage bus interface must return to its idle state immediately upon assertion of Reset# and mustremain idle until Reset# is deasserted and PhyStatus is deasserted . Since the MAC is aware ofwhen PCLK is stable, the requirement that PCLK must be an input to use the message bus allowsthe MAC to only issue transactions on the message bus after PCLK becomes stable.

For each write_committed issued, the initiator must wait for a write_ack response before issuingany new write_uncommitted or write_committed transactions. A sequence of write_uncommittedtransactions must always be followed by a write_committed transaction; only a single write_ackresponse is expected. The initiator must ensure that the total number of outstanding writes, i.e.writes issued since the last write_ack was received, must not exceed the write buffer storageimplemented by the receiver.

Transmission of a write_ack must not depend on receiving a write_ack.

Only one read can be outstanding at a time in each direction. The initiator must wait for a readcompletion before issuing a new read since there are no transaction IDs associated withoutstanding reads.

To facilitate design simplicity, reads and writes cannot be mixed. There must not be any readsoutstanding when a write is issued; conversely, there must not be any writes outstanding when aread is issued. An outstanding write is any write_committed that hasn’t received a write_ack orany write_uncommitted without a subsequent write_committed that has received a write_ack.

Posted-to-posted MAC to PHY writes are those that result in a PHY to MAC write to begenerated in response. For simplification of the verification space, the MAC must only have oneoutstanding post-to-posted write that is waiting for a write in response. Table 8-2 lists the posted-to-posted writes generated by the MAC. Additionally, any vendor defined writes with posted-to-posted properties most conform to the same restriction of only one outstanding.

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1


Table 8-3. Posted-to-Posted Writes


<table><tr><td>Post-to-Posted Register Write</td><td>PHY Write Generated in Response</td></tr><tr><td>RX Margin Control0 register to stop/start marginining</td><td>RX Margin Status0</td></tr><tr><td>PHY TX Control5 register to assert GetLocalPresetCoefficients</td><td>TX Status0, TX Status1, TX Status2</td></tr><tr><td>PHY RX Control3 register to assert RxEqEval</td><td>RX Link Evaluation Status0 and RX Link Evaluation Status1</td></tr><tr><td>Elastic Buffer Control</td><td>Elastic Buffer Status</td></tr></table>

Certain registers are defined as part of a register group. To simplify validation space, wheneverone register in a register group needs to be updated, all the registers in the register group must beupdated using a sequence of uncommitted writes and a single committed write. The definedregister groups are listed in Table 8-3, where each row corresponds to a register group.


Table 8-4. Defined Register Groups


<table><tr><td>Register Groups (one per row)</td></tr><tr><td>MAC TX Status 0/1/2</td></tr><tr><td>PHY TX Control 2/3/4</td></tr><tr><td>MAC RX Status 0/1</td></tr><tr><td>MAC RX Status 2/3</td></tr><tr><td>MAC RX Status 4/5</td></tr></table>

# 8.28.2 Message Bus Operations vs Dedicated Signals

For simplicity, dependencies between message bus operations and dedicated signals are kept to aminimum. The dependencies that do exist are there only because no acceptable workarounds foreliminating them have been identified; these dependencies are documented in this section:

The PHY must wait for the write_ack to come back for any write to LocalLF, LocalFS,LocalG4LF, or LocalG4FS, if any, before it asserts PhyStatus for a rate change.

# 8.29 PCI Express Lane Margining at the Receiver

Table 8-4 provides the sequence of PIPE message bus commands associated with various receivermargining operations; different sequences are shown for independent and dependent samplers.


Table 8-5. Lane Margining at the Receiver Sequences


<table><tr><td rowspan="2">Operation</td><td rowspan="2">Type of Sampler</td><td colspan="3">Sequence</td></tr><tr><td>Direction</td><td>Msg Bus</td><td>Description</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td></td><td></td><td></td><td>Cmd</td><td></td></tr><tr><td rowspan="15">StartMarginatingSuccess</td><td rowspan="9">independent</td><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl0=8&#x27;b000011?1 (clear error/sample and set start)</td></tr><tr><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>PHY clears its error and sample counters due to MAC setting Sample Count Reset and Error Count Reset bits in RxMarginControl0</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1SAMPLECount=0</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus2.ErrorCount=0</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0.MarginStatus=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td rowspan="6">dependent</td><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl0=8&#x27;b000011?1 (set start) (error/sample clears are a don&#x27;t care)</td></tr><tr><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0.MarginStatus=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td rowspan="16">OffsetChangeSuccess</td><td rowspan="7">independent</td><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl0=8&#x27;b000011?1 (clear error/sample counts)</td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>PHY clears its error and sample counters due to MAC setting Sample Count Reset and Error Count Reset bits in RxMarginControl0</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1SAMPLECount=0</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus2.ErrorCount=0</td></tr><tr><td rowspan="8">dependent</td><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0.MarginStatus=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1SAMPLECount=current</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus2.ErrorCount=0</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td>dependent</td><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td rowspan="6">ClearError</td><td rowspan="5">independent</td><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl0=8&#x27;b000001?1 (clear error, hold t vs v, maintain start)</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1SAMPLECount=current</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus2.ErrorCount=0</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td>dependent</td><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td>Stop</td><td>independent</td><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction,</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="12">Margining</td><td rowspan="7"></td><td></td><td></td><td>offset)</td></tr><tr><td>M--&gt;P</td><td>CWr</td><td>RxMarginControl0=8&#x27;b0000000 (stop, clear t vs v)</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1.SampleCount=Final</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus2.ErrorCount=Final</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0.MarginStatus=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td rowspan="5">dependent</td><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl0=8&#x27;b0000000 (stop, clear t vs v)</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0.MarginStatus=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td rowspan="20">Start Marginating NAK</td><td rowspan="11">independent</td><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl0=8&#x27;b00011?1 (clear error/sample and start)</td></tr><tr><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>PHY clears its error and sample counters due to MAC setting Sample Count Reset and Error Count Reset bits in RxMarginControl0</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1.SampleCount=0</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus2.ErrorCount=0</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0.MarginNak=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>MAC changes execution status to 11 (NAK)</td></tr><tr><td></td><td></td><td>The “Stop Marginating” sequence should be followed.</td></tr><tr><td rowspan="9">dependent</td><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl0=8&#x27;b000011?1 (set start) (error/sample clears are a don&#x27;t care)</td></tr><tr><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>PHY detects bad margin request, places/keeps margin logic in normal functional operation mode</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0.MarginNak=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>MAC changes execution status to 11 (NAK)</td></tr><tr><td></td><td></td><td>The “Stop Marginating” sequence should be followed.</td></tr><tr><td rowspan="2">Offset Change NAK</td><td rowspan="2">independent</td><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl0=8&#x27;b000011?1 (clear error/sample counts)</td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="17"></td><td rowspan="9"></td><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>&quot;PHY clears its error and sample counters due to MAC setting Sample Count Reset and Error Count Reset bits in RxMarginControl0. PHY detects bad offset, places/keeps margin logic in normal functional operation mode (margin off)&quot;</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1.SampleCount=0</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus2.ErrorCount=0</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0.MarginNak=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>MAC changes execution status to 11 (NAK)</td></tr><tr><td></td><td></td><td>The &quot;Stop Margining&quot; sequence should be followed.</td></tr><tr><td rowspan="8">dependent</td><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td></td><td></td><td>Mac clears its error count snapshot</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>PHY detects bad offset, places/keeps margin logic in normal functional operation mode (margin off)</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0.MarginNak=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>MAC changes execution status to 11 (NAK)</td></tr><tr><td></td><td></td><td>The &quot;Stop Margining&quot; sequence should be followed.</td></tr><tr><td rowspan="7">Error &amp; Sample Counts Update (under limit)</td><td rowspan="5">independent</td><td></td><td></td><td>PHY detects a change in error or sample count (note: multiple updates may be combined into single write to avoid backlog)</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1.SampleCount= new current</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus2.ErrorCount= new current</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>MAC changes execution status to new error/sample count</td></tr><tr><td rowspan="2">dependent</td><td></td><td></td><td>MAC detects a change in error count</td></tr><tr><td></td><td></td><td>MAC changes execution status to new error count</td></tr><tr><td rowspan="7">Error Limit Exceeded</td><td rowspan="7">independent</td><td></td><td></td><td>PHY detects a change in error or sample count</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1.SampleCount= current</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus2.ErrorCount= new current</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>MAC compares error update to limit, detects limit exceeded</td></tr><tr><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl0=8&#x27;b00000000 (stop, clear t vs v)</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="13"></td><td rowspan="6"></td><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1_SAMPLECount=Final</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus2_ErrorCount=Final</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0 MarginStatus=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>MAC changes execution status to 00 (error limit exceeded)</td></tr><tr><td rowspan="7">dependent</td><td></td><td></td><td>MAC observes error count has exceeded limit</td></tr><tr><td>M-&gt;P</td><td>UWr</td><td>RxMarginControl1={1&#x27;b?,7&#x27;b?} (direction, offset)</td></tr><tr><td>M-&gt;P</td><td>CWr</td><td>RxMarginControl0=8&#x27;b00000000 (stop, clear t vs v)</td></tr><tr><td>P-&gt;M</td><td>Ack</td><td></td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus0 MarginStatus=1</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td></td><td></td><td>MAC changes execution status to 00 (error limit exceeded)</td></tr><tr><td rowspan="5">Sample Count Saturated</td><td rowspan="4">independent</td><td></td><td></td><td>PHY detects a change in error or sample count</td></tr><tr><td>P-&gt;M</td><td>UWr</td><td>RxMarginStatus1/sampleCount===7&#x27;h7F</td></tr><tr><td>P-&gt;M</td><td>CWr</td><td>RxMarginStatus2.ErrorCount= new current</td></tr><tr><td>M-&gt;P</td><td>Ack</td><td></td></tr><tr><td>dependent</td><td></td><td></td><td>N/A</td></tr></table>

# 9 Sample Operational Sequences

These sections show sample timing sequences for some of the more common PCI Express, SATAand USB operations. These are sample sequences and timings and are not required operation.

# 9.1 Active PM L0 to L0s and back to L0 – PCI Express Mode

This example shows one way a PIPE PHY can be controlled to perform Active State PowerManagement on a link for the sequence of the link being in L0 state, transitioning to L0s state,and then transitioning back to L0 state.

When the MAC and higher levels have determined that the link should transition to L0s, theMAC transmits an electrical idle ordered set and then has the PHY transmitter go idle and enterP0s. Note that for a 16-bit or 32-bit interface, the MAC should always align the electrical idle onthe parallel interface so that the COM symbol is in the low-order position (TxDataK[7:0]).

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/911989bd85b5cc2541942ad15cf2f7c0cbf57f52dff36f04b22882e06f962d8a.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/fa669a6159b4a04276e1830623f78bb221d1ccc9e75d1b9b286c6c4d435f1af7.jpg)


# L0 to L0s

To cause the link to exit the L0s state, the MAC transitions the PHY from the P0s state to the P0state, waits for the PHY to indicate that it is ready to transmit (by the assertion of PhyStatus), andthen begins transmitting Fast Training Sequences (FTS). Note, this is an example of L0s to L0transition when the PHY is running at 2.5GT/s.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/4971e1f86f1556363faae171abd81613ae106687562369a27bcc8a36d54444c3.jpg)


# 9.2 Active PM to L1 and back to L0 - – PCI Express Mode

This example shows one way a PIPE PHY can be controlled to perform Active State PowerManagement on a link for the sequence of the link being in L0 state, transitioning to L1 state, andthen transitioning back to L0 state. This example assumes that the PHY is on an endpoint (i.e. itis facing upstream) and that the endpoint has met all the requirements (as specified in the basespec) for entering L1.

After the MAC has had the PHY send PM_Active_State_Request_L1 messages, and has receivedthe PM_Request_ACK message from the upstream port, it then transmits an electrical idle

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

ordered set, and has the PHY transmitter go idle and enter P1.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/137c48003be953699e7b8035b8dac6f9300467574dae8f79cffde0f88aa5167b.jpg)


To cause the link to exit the 1 state, the MAC transitions the PHY from the P1 state to the P0state, waits for the PHY to indicate that it is ready to transmit (by the assertion of PhyStatus), andthen begins transmitting training sequence ordered sets (TS1s). Note, this is an example when thePHY is running at 2.5GT/s.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/be437d1144dd117a4692fe8a6c559ff39453c9880d9c2a5ba947123f8fec4c6c.jpg)


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 9.3 Downstream Initiated L1 Substate Entry Using Sideband Mechanism


Figure 9-1. L1 Substate Management using RxEIDetectDisable andTxCommonModeDisable


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/56ae9975ac55c1e0305b2d51b42883a00a98bdba3479dcf9e3abe8082a9e4f94.jpg)


# 9.4 Receivers and Electrical Idle – PCI Express Mode Example

This section only applies to a PHY operating to 2.5GT/s. Note that when operating at 5.0 GT/s or8 GT/s signaling rates, RxElecIdle may not be reliable. MACs should refer to the PCI ExpressRevision 3.0 Base Specification or USB 3.0 Specification for methods of detecting entry into theelectrical idle condition. Refer to

Status Interface for the definition of RxElecIdle when operating at $5 . 0 \mathrm { G T } / \mathrm { s }$ . This section showssome examples of how PIPE interface signaling may happen as a receiver transitions from activeto electrical idle and back again. In these transitions there may be a significant time differencebetween when RxElecIdle transitions and when RxValid transitions.

The first diagram shows how the interface responds when the receive channel has been active andthen goes to electrical idle. In this case, the delay between RxElecIdle being asserted and RxValidbeing deasserted is directly related to the depth of the implementations elastic buffer and symbolsynchronization logic. Note that the transmitter that is going to electrical idle may transmit

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

garbage data and this data will show up on the RxData[] lines. The MAC should discard anysymbols received after the electrical idle ordered-set until RxValid is deasserted.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/74434f8405d3786ab27efb622aaf5e4993136ca35057cf6bd5e849464d5aabfc.jpg)



Receiver Active to Idle


The second diagram shows how the interface responds when the receive channel has been idleand then begins signaling again. In this case, there can be significant delay between thedeassertion of RxElecIdle (indicating that there is activity on the $R x { + } / R x { - }$ lines) and RxValidbeing asserted (indicating valid data on the RxData[] signals). This delay is composed of thetime required for the receiver to retrain as well as elastic buffer depth.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/50b7219056094b1210573a593a03d135dca906fd0b4a2323f1d4240bad13c945.jpg)



Receiver Idle to Active


# 9.5 Using CLKREQ# with PIPE – PCI Express Mode

CLKREQ# is used in some implementations by the downstream device to cause the upstreamdevice to stop signaling on REFCLK. When REFCLK is stopped, this will typically cause theCLK input to the PIPE PHY to stop as well. The PCI Express CEM spec allows the downstreamdevice to stop REFCLK when the link is in either L1 or L2 states. For implementations that useCLKREQ# to further manage power consumption, PIPE compliant PHYs can be used as follows:

The general usage model is that to stop REFCLK the MAC puts the PHY into the P2 power state,then deasserts CLKREQ#. To get the REFCLK going again, the MAC asserts CLKREQ#, and

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

then after some PHY and implementation specific time, the PHY is ready to use again.

# CLKREQ# in L1

If the MAC is moving the link to the L1 state and intends to deassert CLKREQ# to stopREFCLK, then the MAC follows the proper sequence to get the link to L1, but instead offinishing by transitioning the PHY to P1, the MAC transition the PHY to P2. Then the MACdeasserts CLKREQ#.

When the MAC wants to get the link alive again, it can:

• Assert CLKREQ#

• Wait for REFCLK to be stable (implementation specific)

• Wait for the PHY to be ready (PHY specific)

• Transition the PHY to P0 state and begin training.

# CLKREQ# in L2

If the MAC is moving the link to the L1 state and intends to deassert CLKREQ# to stopREFCLK, then the MAC follows the proper sequence to get the link to L2. Then the MACdeasserts CLKREQ#.

When the MAC wants to get the link alive again, it can:

• Assert CLKREQ#

• Wait for REFCLK to be stable (implementation specific)

• Wait for the PHY to be ready (PHY specific)

• Transition the PHY to P0 state and begin training.

# Delayed CLKREQ# in L1

The MAC may want to stop REFCLK after the link has been in L1 and idle for awhile. In thiscase, the PHY is in the P1 state and the MAC must transition the PHY into the P0 state, and thenthe P2 state before deasserting CLKREQ#. Getting the link operational again is the same as thepreceding cases.

# 9.6 Block Alignment

Figure 9-2 provides an example of a block alignment sequence using the BlockAlignControl pin.The PHY attempts to do alignment when BlockAlignControl is asserted and the PHY receiver isactive.

# Figure 9-2. BlockAlignControl Example Timing

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/f09f13069960e356fb0974a10aba5b167963c0378229ccaebc5382bc50ab895c.jpg)



Note:



• BlockAlignControl assertion and RxValid deassertion. The PHY will attempt to re-do block alignment.



• The BlockAlignControl assertion does not require the PHY to force the block aligner into the unaligned state.



• There is no requried relationship between the de-assertion of RxValid and RxStartBlock.


# 9.7 Message Bus: RX Margining Sequence

Figure 9-3 shows an example of an RX margining sequence. The MAC issues awrite_uncommitted to address 0x1 followed by a write_committed to address 0x0 to set up themargining parameters and to start margining in the RX Margin Control1 and RX Margin Control0registers. The PHY issues a write_ack to acknowledge that it has flushed the write buffer.Subsequently, upon processing a change in the ‘Start Margin’ bit of the RX Margin Control0register, the PHY issues a write_committed to address 0x0 to assert the ‘Margin Status’ bit.During the margining process, the PHY periodically issues write_committed transactions toaddress 0x2 to update the ‘Error Count[3:0]’ value. The MAC acknowledges receipt of thesewrites by issuing corresponding write_ack transactions. Finally, the MAC stops the marginingprocess by issuing a write_committed to address 0x0 to deassert the ‘Start Margin’ bit. The PHYissues a write_ack to acknowledge that it has flushed the write buffer. In response to the ‘StartMargin’ deassertion, the PHY pushes it’s final ‘Error Count[3:0]’ value to the MAC via awrite_uncommitted transaction to the ‘RX Margin Status2’ register, and then issues awrite_committed to assert ‘RX Margin Status0.Margin Status’.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/abbb39e2ef0f860bf079824a8cf1f2b355ba90ee601dfbbf6b10c6769d91de72.jpg)



Figure 9-3. Sample RX Margining Sequence


# 9.8 Message Bus: Updating LocalFS/LocalLF and LocalG4FS/LocalG4LF

Figure 9-4 shows a sequence where LocalFS and LocalLF are updated out of reset and,

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

subsequently, LocalG4FS and LocalG4LF are updated after a rate change. Note that PhyStatusdeasserts only after the write_ack returns for the LocalFS and LocalLF update out of reset.Similarly, the one cycle PhyStatus assertion occurs after the write_ack returns for the LocalG4FSand LocalG4LF update after a rate change. This is one of the rare cases where a dependencybetween a message bus operation and a dedicated signal exists. While this example showsLocalG4FS and LocalG4LF being updated after a rate change, it is not a requirement to wait untilafter the rate change to update these values; e.g. they can be updated out of reset if their valuesare already known by then. Note, this flexibility in timing of when updates can occur wasintentionally introduced with the low pin count interface by allocating separate Local $^ { * } \mathrm { F } \mathrm { S }$ andLocal*LF registers per data rate.


Figure 9-4. LocalFS/LocalLF/LocalG4FS/LocalG4LF Updates Out of Resetand After Rate Change


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/5bdc4cd8569400808ffec3668c5962720c499c7801ce064cf1387ff1d12dd644.jpg)



Figure 9-5 shows a sequence where LocalFS and LocalLF are updated in response to aGetLocalPresetCoefficients request where the LocalPresetIndex corresponds to an 8GT/s rate.Note that the LocalFS and LocalLF values must be updated before or at the same cycle as theLocalTxPresetCoefficents are returned.



Figure 9-5. LocalFS/LocalLF Update Due to GetLocalPresetCoefficients


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/32f185a46557b22ccd109c70dd6cf051007452d29c7315884e229ec46771fbb2.jpg)


# 9.9 Message Bus: Updating TxDeemph

Figure 9-6 shows a sequence where the MAC makes a GetLocalPresetCoefficients request forone or more values of LocalPresetIndex and the, subsequently, update the TxDeemph value.Note that for every GetLocalPresetCoefficients request, there is a 128ns maximum response timefor the PHY to return the LocalTxPresetCoefficients value; this time is shown in the diagram

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

from the end of the second write_committed to the end of the third write_committed. Thismaximum response time requirement only exists for designs that use just-in-time fetching ofGetLocalPresetCoefficients in response to Tx coefficients request from the link partner; designsthat fetch ahead of time can circumvent this requirement. Additionally, after the write_committedfor TxDeemph, the new TxDeemph value must be reflected on the pins within 128ns. Note thatwhile Figure 9-6 does not show LocalLF and LocalFS getting returned in response to aGetLocalPresetCoefficients request, they can be returned along with LocalTxPresetCoefficientssimilar to what is done in Figure 9-5.


Figure 9-6. Updating TxDeemph after GetLocalPresetCoefficients Request


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/e3031594658915154b2469fc72c8a9959989845a5444ce839a1448a7957bd667.jpg)


# 9.10 Message Bus: Equalization

Figure 9-7 shows a successful equalization sequence. RxEqInProgress is asserted for the entireduration of equalization. Multiple RxEqEval requests are made during the equalization processcorresponding to different coefficient requests to the far end transmitter. When all the RxEqEvalrequests are complete, RxEqInProcess is deasserted. Note, the PHY does not necessarily have towrite to both the LinkEvaluationFeedbackFigureMerit andLinkEvaluationFeedbackDirectionChange register fields; it could write to only to one.


Figure 9-7. Successful Equalization


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/0aaa23089139e8371e958c5a612c1d655f8984463e4517440f79535859c51e8b.jpg)



Figure 9-8 shows an equalization sequence where the feedback received indicates an invalidcoefficient request for the link partner. Note that the write to assert InvalidRequest must happenbefore a new request is initiated; the write to deassert InvalidRequest can happen in the samecycle as an RxEqEval request for a new coefficient.



Figure 9-8. Equalization with Invalid Request


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/770a47a5b2f52ca2fc4aa036e6774433f2dce3082494e076671bb7693b26faf7.jpg)


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

Figure 9-9 shows a sequence where the MAC aborts the RxEqEval request before the linkevaluation feedback is returned by the PHY. Figure 9-10 shows a sequence where the MACaborts the RxEqEval request while the link evaluation feedback is being returned by the PHY, i.e.there is an overlap. In both abort case, the MAC must ignore the feedback value returned by thePHY.


Figure 9-9. Aborted Equalization, Scenario #1


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/13f7973f40cd2e903b4297399f42af82ccbc875dd8191ca6bc981aa4dfd170a0.jpg)



Figure 9-10. Aborted Equalization, Scenario #2


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/9a3156288d974efb9f6693b2d782eead8c977ca1680a435985f7339fd1d39b1e.jpg)


# 9.11 Message Bus: BlockAlignControl

Figure 9-11 shows a sequence where BlockAlignControl is used to reestablish block alignmentafter a loss of alignment is detected. This sequence also shows how RxValid transitions duringthis process.


Figure 9-11 Message Bus: BlockAlignControl Example


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/7cbcca690567da9dd2d8e88026ac1c128e9a2f9565254ac4dfaf69d424d87c69.jpg)


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 9.12 Message Bus: ElasticBufferLocation Update

Figure 9-12 shows the update of ElasticBufferLocation across the message bus. The frequency ofupdate across the message bus is controlled by the MAC by setting the value in theElasticBufferLocationUpdateFrequency register.


Figure 9-12. Message Bus: Updating ElasticBufferLocation


![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/f2f39a5fb84b1e0427a5c46bed73769f92a50377c58c207dc1f1f275123eee6c.jpg)


PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

# 10 Multi-lane PIPE – PCI Express Mode

This section describes a suggested method for combining multiple PIPEs together to form amulti-lane implementation. It describes which PIPE signals can be shared between each PIPE ofa multi-lane implementation, and which signals should be unique for each PIPE. There are twotypes of PHYs. “Variable” PHYs that are designed to support multiple links of variablemaximum widths and “Fixed” PHYs that are designed to support a fixed number of links withfixed maximum widths.

The figure shows an example 4-lane implementation of a multilane PIPE solution with PCLK as aPHY input. The signals that can be shared are shown in the figure as “Shared Signals” whilesignals that must be replicated for each lane are shown as ‘Per-lane signals’.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-03-17/69f85a07-c052-4d29-8ce7-cef83cf3b978/54ab35a7aa1267e9425078fbf28cd2b0744c03aa942831dd0b3cf92d43fa80b6.jpg)



4-lane PIPE implementation


The MAC layer is responsible for handling lane-to-lane deskew and it may be necessary to usethe per-lane signaling of SKP insertion/removal to help perform this function.

<table><tr><td></td><td>Shared Signals</td><td>Per-Lane Signals or Shared Signals</td><td>Per-lane Signals</td></tr><tr><td></td><td>CLK</td><td>EncodeDecodeBypass</td><td>TxData[], TxDataK[]</td></tr><tr><td></td><td>Max PCLK</td><td>BlockAlignControl</td><td>RxData[], RxDataK[]</td></tr><tr><td></td><td></td><td>TxSwing</td><td>TxStartBlock</td></tr><tr><td></td><td></td><td>TxMargin[2:0]</td><td>TxEleclde</td></tr><tr><td></td><td></td><td>TxDetectRx/Loopback</td><td>TxCompliance</td></tr><tr><td></td><td></td><td>Rate</td><td>RxPolarity</td></tr><tr><td></td><td></td><td>Width[1:0]</td><td>RxValid</td></tr><tr><td></td><td></td><td>PCLK Rate[2:0]</td><td>RxEleclde</td></tr><tr><td></td><td></td><td>Reset#</td><td>RxStatus[2:0]</td></tr><tr><td></td><td></td><td>TxDataValid</td><td>RxDataValid</td></tr><tr><td></td><td></td><td>PCLK</td><td>RxStartBlock</td></tr><tr><td></td><td></td><td></td><td>TxDeemph[17:0]</td></tr><tr><td></td><td></td><td></td><td>PowerDown[1:0]</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td rowspan="2"></td><td rowspan="2"></td><td rowspan="2"></td><td>PhyStatus
RxPresetHint[2:0]</td></tr><tr><td>RxEqEval
LinkEvaluationFeedbackFigureMerit[7:0]
LinkEvaluationFeedbackDirectionChange[7:0]
InvalidRequest
TxSyncHeader[1:0]
RxSyncHeader[1:0]
RxStandby
RxStandbyStatus
FS[5:0]
LF[5:0]
PHYMode[1:0]
SRISEnable
Elasticity Buffer Mode
TxPattern[1:0]
TxOnesZeros
RxEqTraining
LocalTxPresetCoefficients[17:0]
LocalFS[5:0]
LocalLF[5:0]
LocalPresetIndex[5:0]
GetLocalPresetCoefficients
LocalTxCoefficientsValid
RxEqInProgress
RXTermination
AlignDetect
PowerPreset
PclkChangeOk
PclkChangeAck
ElasticBufferLocation[N:0]
AsyncPowerChangeAck
M2P_MessageBus[7:0]
P2M_MessageBus[7:0]
RxCLK</td></tr></table>

A MAC must use all “Per-Lane Signals or Shared Signals” that are inputs to the PHY consistentlyon all lanes in the link. A PHY in “PCLK as PHY Output ” mode must ensure that PCLK andMax PCLK are synchronized across all lanes in the link. A MAC must provide a synchronizedPCLK as an input for each lane when controlling a PHY in “PCLK as PHY Input ” mode with nomore than 300 ps of skew on PCLK across all lanes.

It is recommended that a MAC be designed to support both PHYs that implement all signals perlane and those that implement the “Per-Lane or Shared Signals” per link. A “Variable” PHYmust implement the signals in “Per-Lane Signals or Shared Signals” per lane. A “Fixed” PHYmay implement the signals in “Per-Lane Signals or Shared Signals” as either Shared or Per-Lane.A “Fixed” PHY should implement all the signals in “Per-Lane Signals or Shared Signals”consistently as either Shared or Per-Lane.

Note: The following method to turn off a lane using TxElecIdle and TxCompliance is deprecatedand will be removed in future spec revisions.

In cases where a multi-lane has been ‘trained’ to a state where not all lanes are in use (like a x4implementation operating in x1 mode), a special signaling combination is defined to ‘turn off’ the

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

unused lanes allowing them to conserve as much power as the implementation allows. Thisspecial ‘turn off’ signaling is done using the TxElecIdle and TxCompliance signals. When bothare asserted, that PHY can immediately be considered ‘turned off’ and can take whatever powersaving measures are appropriate. The PHY ignores any other signaling from the MAC (with theexception of Reset# assertion) while it is ‘turned off’. Similarly, the MAC should ignore anysignaling from the PHY when the PHY is ‘turned off’. There is no ‘handshake’ back to the MACto indicate that the PHY has reached a ‘turned off’ state.

There are two normal cases when a lane can get turned off:

1. During LTSSM Detect state, the MAC discovers that there is no receiver present and will‘turn off’ the lane.

2. During LTSSM Configuration state (specifically Configuration.Complete), the MAC will‘turn off’ any lanes that didn’t become part of the configured link.

As an example, both of these cases could occur when a x4 device is plugged into a $\mathbf { \boldsymbol { x } } 8$ slot. Theupstream device (the one with the x8 port) will not discover receiver terminations on four of itslanes so it will turn them off. Training will occur on the remaining 4 lanes, and let’s suppose thatthe $\mathbf { \boldsymbol { x } } 8$ device cannot operate in x4 mode, so the link configuration process will end up settling onx1 operation for the link. Then both the upstream and downstream devices will ‘turn off’ all butthe one lane configured in the link.

When the MAC wants to get ‘turned off’ lanes back into an operational state, there are two casesthat need to be considered:

1. If the MAC wants to reset the multi-lane PIPE, it asserts Reset# and drives other interfacesignals to their proper states for reset (see section 6.2). Note that this stops signaling‘turned off’ to all lanes because TxCompliance is deasserted during reset. The multi-lanePHY asserts PhyStatus in response to Reset# being asserted, and will deassert PhyStatuswhen PCLK is stable.

2. When normal operation on the active lanes causes those lanes to transition to the LTSSMDetect state, then the MAC sets the PowerDown[1:0] signals to the P1 PHY power stateat the same time that it deasserts ‘turned off’ signaling to the inactive lanes. Then as withnormal transitions to the P1 state, the multi-lane PHY will assert PhyStatus for one clockwhen all internal PHYs are in the P1 state and PCLK is stable.

# 11 Appendix

# 11.1 DisplayPort AUX Signals


Table 11-1. DisplayPort AUX Signals


<table><tr><td>Name</td><td>Direction</td><td>Active Level</td><td>Description</td></tr><tr><td>TxAuxData</td><td>Input</td><td>N/A</td><td>DisplayPort asynchronous transmit data for AUX CH</td></tr><tr><td>TxAuxOE</td><td>Input</td><td>High</td><td>DisplayPort asynchronous data output enable for AUX CH. Assertion of this signal must be mutually exclusive with assertion of RxAuxIE.</td></tr><tr><td>RxAuxIE</td><td>Input</td><td>High</td><td>DisplayPort asynchronous data input enable for AUX CH. Assertion of this signal must be mutually exclusive with assertion of TxAuxOE.</td></tr></table>

PHY Interface for PCI Express, SATA, USB 3.1, DisplayPort, and Converged IO Architectures,ver 5.1

<table><tr><td>RxAuxData</td><td>Output</td><td>N/A</td><td>DisplayPort asynchronous data output for AUX CH</td></tr><tr><td>DCAux+</td><td>Output</td><td>Low</td><td>Optional: DPRX asynchronous AUX+ pulldown status signal indicates a source is connected (DC voltage)</td></tr><tr><td>DCAux-</td><td>Output</td><td>High</td><td>Optional: DPRX asynchronous AUX- pullup status status signal indicates a connected source is powered up (DC voltage)</td></tr><tr><td>AuxRxElecIdle</td><td>Output</td><td>High</td><td>Indicates whether differential signaling is detected</td></tr></table>