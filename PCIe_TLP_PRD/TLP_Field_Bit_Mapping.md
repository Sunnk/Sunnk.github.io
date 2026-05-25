# TLP_Field_Bit_Mapping

# PCIe TLP 字段 Bit 位置映射

> **Byte 排列**：从左到右、从低地址到高地址（Byte 0, Byte 1, Byte 2, …），Byte 0 最先传输。
> 
> 
> **Byte 内 bit 顺序**：每个 byte 内按 bit 7 (MSB) 到 bit 0 (LSB) 显示。
> 
> **字段 bit 位置标注**：每个字段标出从 bit 0 开始累积的实际 bit 范围。
> 计算公式：TLP bit = Byte编号 × 8 + Byte内Bit编号。
> 示例：Byte 0 bit 7 = TLP bit 7，Byte 1 bit 7 = TLP bit 15，Byte 2 bit 0 = TLP bit 16。
> 

本文档总结了 PCIe TLP (Transaction Layer Packet) 在 Non-Flit Mode (NFM) 和 Flit Mode (FM) 下各字段的 bit 位置。数据来源于 PCI Express Base Specification Revision 6.4 第 2 章。

## 1. Non-Flit Mode (NFM) 通用字段

所有 NFM TLP 共有的字段位置：

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Fmt[2:0] | Byte 0 | bits 7:5 | bit 7:5 | 格式字段 |
| Type[4:0] | Byte 0 | bits 4:0 | bit 4:0 | 类型字段 |
| T9 | Byte 1 | bit 7 | bit 15 | 当Tag是10bit时，此bit作为 Tag[9] 使用 |
| TC[2:0] | Byte 1 | bits 6:4 | bit 14:12 | 流量类别 |
| T8 | Byte 1 | bit 3 | bit 11 | 当Tag是10bit时，此bit作为 Tag[8] 使用 |
| R | Byte 1 | bit 1 | bit 9 | 保留位 |
| TH | Byte 1 | bit 0 | bit 8 | TLP Hints |
| Attr[1:0] | Byte 2 | bits 5:4 | bit 21:20 | 属性位 |
| Attr[2] (A2) | Byte 1 | bit 2 | bit 10 | 属性位 2 |
| TD | Byte 2 | bit 7 | bit 23 | TLP Digest 指示 |
| EP | Byte 2 | bit 6 | bit 22 | Error Poisoned |
| AT | Byte2 | bits 3:2 | bit 19:18 | Address Translation指示 |
| Length[9:0] | Byte 2 bits 1:0 + Byte 3 bits 7:0 | Byte 2: bits 1:0Byte 3: bits 7:0 | bit 17:16 + bit 31:24 | 数据负载长度 |

## 2. Flit Mode (FM) 通用字段（第一 DW）

所有 FM TLP 第一 DW 共有的字段位置：

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Type[7:0] | Byte 0 | bits 7:0 | bit 7:0 | 类型字段（8位） |
| TC[2:0] | Byte 1 | bits 7:5 | bit 15:13 | 流量类别 |
| OHC[4:0] | Byte 1 | bits 4:0 | bit 12:8 | Orthogonal Header Content |
| TS[2:0] | Byte 2 | bits 7:5 | bit 23:21 | Trailer Size |
| Attr[2:0] | Byte 2 | bits 4:2 | bit 20:18 | 属性位 |
| Length[9:0] | Byte 2 bits 1:0 + Byte 3 bits 7:0 | Byte 2: bits 1:0  Byte 3: bits 7:0 | bit 17:16 + bit 31:24 | 数据负载长度 |

## 3. 各 TLP 类型字段位置

### 3.1 Memory Read Request (MRd) - NFM

**32-bit 地址格式（3 DW header，无数据）**

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Fmt[2:0] | Byte 0 | bits 7:5 | bit 7:5 | 格式字段 |
| Type[4:0] | Byte 0 | bits 4:0 | bit 4:0 | 类型字段 |
| T9 | Byte 1 | bit 7 | bit 15 | 当Tag是10bit时，此bit作为 Tag[9] 使用 |
| TC[2:0] | Byte 1 | bits 6:4 | bit 14:12 | 流量类别 |
| T8 | Byte 1 | bit 3 | bit 11 | 当Tag是10bit时，此bit作为 Tag[8] 使用 |
| R | Byte 1 | bit 1 | bit 9 | 保留位 |
| TH | Byte 1 | bit 0 | bit 8 | TLP Hints |
| Attr[1:0] | Byte 2 | bits 5:4 | bit 21:20 | 属性位 |
| Attr[2] (A2) | Byte 1 | bit 2 | bit 10 | 属性位 2 |
| TD | Byte 2 | bit 7 | bit 23 | TLP Digest 指示 |
| EP | Byte 2 | bit 6 | bit 22 | Error Poisoned |
| AT | Byte2 | bits 3:2 | bit 19:18 | Address Translation指示 |
| Length[9:0] | Byte 2 bits 1:0 + Byte 3 bits 7:0 | Byte 2: bits 1:0Byte 3: bits 7:0 | bit 17:16 + bit 31:24 | 数据负载长度 |
| Requester ID[15:0] | Byte 4-5 | Byte 4: bits 7:0 Byte 5: bits 7:0 | bit 47:32 |  |
| Tag[7:0] | Byte 6 bits 7:0  | Byte 6: bits 7:0 | bit 55:48  | 10-bit Tag 格式时此8bit对应Tag[7:0] |
| Last DW BE[3:0] | Byte 7 | bits 7:4 | bit 63:60 |  |
| First DW BE[3:0] | Byte 7 | bits 3:0 | bit 59:56 |  |
| Address[31:2] | Byte 8-11 | Byte 8: bits 7:0 Byte 9: bits 7:0 Byte 10: bits 7:0 Byte 11: bits 7:2 | bit 71:64 + bit 79:72 + bit 87:80 + bit 95:90 |  |
| PH[1:0] | Byte 11 | bits 1:0 | bit 89:88 | 仅当 TH=1 |

**64-bit 地址格式（4 DW header，无数据）**

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Fmt[2:0] | Byte 0 | bits 7:5 | bit 7:5 | 001b (4 DW header, no data) |
| Type[4:0] | Byte 0 | bits 4:0 | bit 4:0 | 0 0000b |
| … (通用字段同32-bit) | … | … | … | … |
| Address[63:32] | Byte 8-11 | Byte 8: bits 7:0   Byte 9: bits 7:0   Byte 10: bits 7:0  Byte 11: bits 7:0 | bit 71:64 + bit 79:72 + bit 87:80 + bit 95:88 | 高32位地址 |
| Address[31:2] | Byte 12-15 | Byte 12: bits 7:0  Byte 13: bits 7:0  Byte 14: bits 7:0 Byte 15: bits 7:2 | bit 103:96 + bit 111:104 + bit 119:112 + bit 127:122 | 低32位地址 |
| PH[1:0] | Byte 15 | bits 1:0 | bit 121:120 | 仅当 TH=1 |

### 3.2 Memory Write Request (MWr) - NFM

**32-bit 地址格式（3 DW header，有数据）**

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Fmt[2:0] | Byte 0 | bits 7:5 | bit 7:5 | 010b (3 DW header, with data) |
| Type[4:0] | Byte 0 | bits 4:0 | bit 4:0 | 0 0000b |
| … (通用字段同MRd) | … | … | … | … |
| Address[31:2] | Byte 8-11 | Byte 8: bits 7:0   Byte 9: bits 7:0   Byte 10: bits 7:0 Byte 11: bits 7:2 | bit 71:64 + bit 79:72 + bit 87:80 + bit 95:90 |  |
| PH[1:0] | Byte 11 | bits 1:0 | bit 89:88 | 仅当 TH=1 |

**64-bit 地址格式（4 DW header，有数据）**

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Fmt[2:0] | Byte 0 | bits 7:5 | bit 7:5 | 011b (4 DW header, with data) |
| Type[4:0] | Byte 0 | bits 4:0 | bit 4:0 | 0 0000b |
| … (通用字段同MRd) | … | … | … | … |
| Address[63:32] | Byte 8-11 | Byte 8: bits 7:0   Byte 9: bits 7:0   Byte 10: bits 7:0  Byte 11: bits 7:0 | bit 71:64 + bit 79:72 + bit 87:80 + bit 95:88 | 高32位地址 |
| Address[31:2] | Byte 12-15 | Byte 12: bits 7:0 Byte 13: bits 7:0 Byte 14: bits 7:0 Byte 15: bits 7:2 | bit 103:96 + bit 111:104 + bit 119:112 + bit 127:122 | 低32位地址 |
| PH[1:0] | Byte 15 | bits 1:0 | bit 121:120 | 仅当 TH=1 |

### 3.3 Completion without Data (Cpl) - NFM

**3 DW header 格式**

![图片.png](%E5%9B%BE%E7%89%87.png)

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Fmt[2:0] | Byte 0 | bits 7:5 | bit 7:5 | 000b (3 DW header, no data) |
| Type[4:0] | Byte 0 | bits 4:0 | bit 4:0 | 0 1010b |
| … (通用字段) | … | … | … | … |
| Completer ID[15:0] | Byte 4-5 | Byte 4: bits 7:0 Byte 5: bits 7:0 | bit 47:32 |  |
| Completion Status[2:0] | Byte 6 | bits 7:5 | bit 55:53 |  |
| BCM | Byte 6 | bit 4 | bit 52 |  |
| Byte Count[11:0] | Byte 6 bits 3:0 + Byte 7 bits 7:0 | Byte 6: bits 3:0 Byte 7: bits 7:0 | bit 51:48 + bit 63:56 |  |
| Requester ID[15:0] | Byte 8-9 | Byte 8: bits 7:0 Byte 9: bits 7:0 | bit 79:64 |  |
| Tag[7:0] | Byte 10  | bits 7:0 | bit 87:80 | 10-bit Tag 格式时此8bit对应Tag[7:0] |
| R | Byte 11 | bit 7 | bit 95 |  |
| Lower Address | Byte 11 | bits 6:0 | bits 94:88 |  |

### 3.4 Completion with Data (CplD) - NFM

**3 DW header 格式**

![图片.png](%E5%9B%BE%E7%89%87%201.png)

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Fmt[2:0] | Byte 0 | bits 7:5 | bit 7:5 | 010b (3 DW header, with data) |
| Type[4:0] | Byte 0 | bits 4:0 | bit 4:0 | 0 1010b |
| … (其他字段同Cpl) | … | … | … | … |
| Data | … | … | … | 取决于具体的数据 |

### 3.5 Message Request (Msg) - NFM

**无数据格式**

![图片.png](%E5%9B%BE%E7%89%87%202.png)

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Fmt[2:0] | Byte 0 | bits 7:5 | bit 7:5 | 001b (4 DW header, no data) |
| Type[4:0] | Byte 0 | bits 4:0 | bit 4:0 | 1 0r2r1r0b |
| … (通用字段) | … | … | … | … |
| Requester ID[15:0] | Byte 4-5 | Byte 4: bits 7:0  Byte 5: bits 7:0 | bit 47:32 |  |
| Message Code[7:0] | Byte 7 | bits 7:0 | bit 63:56 |  |

### 3.6 Configuration Read/Write Request (CfgRd0/CfgWr0) - NFM

**Type 0 Configuration Request (3 DW header)**

![图片.png](%E5%9B%BE%E7%89%87%203.png)

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Fmt[2:0] | Byte 0 | bits 7:5 | bit 7:5 | CfgRd0: 000b, CfgWr0: 010b |
| Type[4:0] | Byte 0 | bits 4:0 | bit 4:0 | 0 0100b |
| … (通用字段) | … | … | … | … |
| Requester ID[15:0] | Byte 4-5 | Byte 4: bits 7:0  Byte 5: bits 7:0 | bit 47:32 |  |
| Tag[7:0] | Byte 6 | bits 7:0 | 55:48 | 10-bit Tag 格式 |
| Last DW BE[3:0] | Byte 7 | bits 7:4 | bit 63:60 | must be 0000 |
| First DW BE[3:0] | Byte 7 | bits 3:0 | bit 59:56 |  |
| Bus Number[7:0] | Byte 8 | bits 7:0 | bit 71:64 |  |
| Device Number[4:0] | Byte 9 | bits 7:3 | bit 79:75 |  |
| Function Number[2:0] | Byte 9 | bits 2:0 | bit 74:72 |  |
| Reserved | Byte 10 | bits 7:4 | bit 87:84 |  |
| Extended Register Number[3:0] | Byte 10 | bits 3:0 | bit 83:80 |  |
| Register Number[5:0]  | Byte 11 | bits 7:2 | bit 95:90 |  |
| Reserved | Byte 11 | bits 1:0 | bit 89:88 |  |

## 4. Flit Mode (FM) TLP 类型字段位置

### 4.1 Memory Read Request (MRd) - FM

**32-bit 地址格式（3 DW header）**

![图片.png](%E5%9B%BE%E7%89%87%204.png)

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Type[7:0] | Byte 0 | bits 7:0 | bit 7:0 | 0 0000 0011b (#3) |
| TC[2:0] | Byte 1 | bits 6:4 | bit 14:12 |  |
| OHC[4:0] | Byte 1 | bits 4:0 | bit 12:8 |  |
| TS[2:0] | Byte 2 | bits 7:5 | bit 23:21 |  |
| Attr[2:0] | Byte 2 | bits 4:2 | bit 20:18 |  |
| Length[9:0] | Byte 2 bits 1:0 + Byte 3 bits 7:0 | Byte 2: bits 1:0   Byte 3: bits 7:0 | bit 17:16 + bit 31:24 |  |
| Requester ID[15:0] | Byte 4-5 | Byte 4: bits 7:0   Byte 5: bits 7:0 | bit 47:32 |  |
| EP | Byte 6 | bit 7 | bit 55 |  |
| R | Byte 6 | bit 6 | bit 54 |  |
| Tag[13:0] | Byte 6 bits 5:0 + Byte 7 bits 7:0  | Byte 6: bit 5:0       Byte 7: bits 7:0 | bit 53:48 + bit 63:56 | 14-bit Tag 格式 |
| Address[31:2] | Byte 8  - 10 + Byte 11 | Byte 8: bits 7:0       Byte 9: bits 7:0      Byte 10: bits 7:0      Byte 11: bits 7:2 | bit 71:64+bit 79:72+bit 87:80+bit 95:90 |  |
| AT[1:0] | Byte 7 | bits 1:0 | bit 33:32 |  |

**64-bit 地址格式（4 DW header）**

![图片.png](%E5%9B%BE%E7%89%87%205.png)

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Type[7:0] | Byte 0 | bits 7:0 | bit 7:0 |  |
| TC[2:0] | Byte 1 | bits 6:4 | bit 14:12 |  |
| OHC[4:0] | Byte 1 | bits 4:0 | bit 12:8 |  |
| TS[2:0] | Byte 2 | bits 7:5 | bit 23:21 |  |
| Attr[2:0] | Byte 2 | bits 4:2 | bit 20:18 |  |
| Length[9:0] | Byte 2 bits 1:0 + Byte 3 bits 7:0 | Byte 2: bits 1:0   Byte 3: bits 7:0 | bit 17:16 + bit 31:24 |  |
| Requester ID[15:0] | Byte 4-5 | Byte 4: bits 7:0   Byte 5: bits 7:0 | bit 47:32 |  |
| EP | Byte 6 | bit 7 | bit 55 |  |
| R | Byte 6 | bit 6 | bit 54 |  |
| Tag[13:0] | Byte 6 bits 5:0 + Byte 7 bits 7:0  | Byte 6: bit 5:0       Byte 7: bits 7:0 | bit 53:48 + bit 63:56 | 14-bit Tag 格式 |
| Address[63:32] | Byte 8-11 | Byte 8: bits 7:0       Byte 9: bits 7:0      Byte 10: bits 7:0      Byte 11: bits 7:0 | bit 95:64 |  |
| Address[31:2] | Byte 12  - 10 + Byte 11 bits 7:2 | Byte 8: bits 7:0       Byte 9: bits 7:0      Byte 10: bits 7:0      Byte 11: bits 7:2 | bit 103:96+bit 111:104+bit 119:112+bit 127:122 |  |
| AT[1:0] | Byte 7 | bits 1:0 | bit 121:120 |  |

### 4.2 Memory Write Request (MWr) - FM

**32-bit 地址格式（3 DW header）**

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Type[7:0] | Byte 0 | bits 7:0 | bit 7:0 | 0 1000 0000b (#64) |
| … (其他字段同MRd 32-bit) | … | … | … | … |

**64-bit 地址格式（4 DW header）**

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Type[7:0] | Byte 0 | bits 7:0 | bit 7:0 | 0 1100 0000b (#96) |
| … (其他字段同MRd 64-bit) | … | … | … | … |

### 4.3 Completion without Data (Cpl) - FM

**3 DW header 格式**

![图片.png](%E5%9B%BE%E7%89%87%206.png)

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Type[7:0] | Byte 0 | bits 7:0 | bit 7:0 | 0 0001 0100b (#10) |
| Completer ID[15:0] | Byte 4-5 | Byte 4: bits 7:0   Byte 5: bits 7:0 | bit 47:32 |  |
| EP | Byte 6 | bit 7 | bit 55 |  |
| LA6 | Byte 6 | bit 6 | bit 54 |  |
| Tag[13:0] | Byte 6 bits 5:0 + Byte 7 bits 7:0  | Byte 6: bit 5:0       Byte 7: bits 7:0 | bit 53:48 + bit 63:56 | 14-bit Tag 格式 |
| Destination BDF/BF | Byte 8-9 | Byte 8: bits 7:0   Byte 9: bits 7:0 | bits  79:64 |  |
| LA[5:2] | Byte 10  | bits 7:4 | bits 87:84 |  |
| Byte Count | Byte 10 3:0 + Byte 11 7:0 | Byte 10 3:0 + Byte 11 7:0 | bits 83:80 + bits 95:88 |  |

### 4.4 Completion with Data (CplD) - FM

**3 DW header 格式**

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Type[7:0] | Byte 0 | bits 7:0 | bit 7:0 | 0 1001 0100b (#74) |
| … (其他字段同Cpl) | … | … | … | … |

### 4.5 Message Request (Msg) - FM

![图片.png](%E5%9B%BE%E7%89%87%207.png)

**无数据格式（4 DW header）**

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Type[7:0] | Byte 0 | bits 7:0 | bit 7:0 | 取决于路由类型 |
| … (通用字段) | … | … | … | … |
| Requester ID[15:0] | Byte 4-5 | Byte 4: bits 7:0             Byte 5: bits 7:0 | bit 39:32 + bit 47:40 |  |
| EP | Byte 6 | bit 7 | bit 55 | 仅MsgD |
| Reserved | Byte 6 | bit 6:0 | bit 54:48 |  |
| Message Code[7:0] | Byte 7 | bits 7:0 | bit 63:56 |  |
| 路由特定字段 | Byte 8-15 等 | 取决于路由类型 | 取决于路由类型 |  |

### 4.6 Configuration Read/Write Request (CfgRd0/CfgWr0) - FM

![图片.png](%E5%9B%BE%E7%89%87%208.png)

**3 DW header 格式**

| 字段 | Byte 位置 | Byte 内 bit 范围 | 整个 TLP bit 范围 | 说明 |
| --- | --- | --- | --- | --- |
| Type[7:0] | Byte 0 | bits 7:0 | bit 7:0 | CfgRd0: 0 0000 0100b (#4)CfgWr0: 0 1000 0100b (#68) |
| Requester ID[15:0] | Byte 4-5 | Byte 4: bits 7:0   Byte 5: bits 7:0 | bit 47:32 |  |
| EP | Byte 6 | bit 7 | bit 55 |  |
| Reserved | Byte 6 | bit 6 | bit 54 |  |
| Tag[13:0] | Byte 6 bits 5:0 + Byte 7 bits 7:0  | Byte 6: bit 5:0       Byte 7: bits 7:0 | bit 53:48 + bit 63:56 | 14-bit Tag 格式 |
| Destination BDF/BF | Byte 8-9 | Byte 8: bits 7:0    Byte 9: bits 7:0 | 79:64 |  |
| Reserved | Byte 10 | bit 7:4 | bit 87:84 |  |
| Register Number | Byte 11 +  Byte 12 | Byte 8: bits 3:0    Byte 9: bits 7:2 | bit 83:80 + bit 95:90 |  |
| Reserved | Byte 12 | bit 1:0 | bit 89:88 |  |

## 5. 重要说明

1. **Byte 编号**：从 0 开始，从左到右递增。
2. **bit 编号**：每个 byte 内 bit 7 是最高有效位（MSB），bit 0 是最低有效位（LSB）。
3. **整个 TLP bit 范围**：从 TLP 开始（Byte 0 bit 7）为 bit 0，按字节顺序累加。
4. **字段位置变化**：某些字段在 NFM 和 FM 中的位置不同，需特别注意。
5. **OHC 字段**：仅在 FM 中存在，用于携带正交头部内容。
6. **路由特定字段**：Message 和 Configuration 请求的字段位置取决于路由类型

---