// ============================================================
// PCIe TLP 包格式数据定义
// 修改字段：直接编辑对应 TLP 类型的 dwords 数组即可
// 添加新类型：在对应模式的数组中追加新条目
// ============================================================

// ---------- 通用 DW0 字段（Non-Flit Mode，所有 TLP 共用）----------
// DW 内位置 = byte * 8 + (7 - bit)
// Byte 0: [7:5]=Fmt, [4:0]=Type
// Byte 1: [7]=R, [6:4]=TC, [3]=R, [2]=Attr2, [1]=R, [0]=TH
// Byte 2: [7]=TD, [6]=EP, [5:4]=Attr[1:0], [3:2]=AT, [1:0]=Len[9:8]
// Byte 3: [7:0]=Len[7:0]

const NFM_DW0 = [
  // Byte 0
  { name: 'Fmt[2:0]',    start: 0, end: 2,  desc: 'Format of TLP:\n000b=3DW, no data\n001b=4DW, no data\n010b=3DW, with data\n011b=4DW, with data\n100b=TLP Prefix' },
  { name: 'Type[4:0]',   start: 3, end: 7,  desc: 'Type of TLP — 与Fmt组合决定TLP类型，见Table 2-3' },
  // Byte 1
  { name: 'R',            start: 8, end: 8,  desc: 'Reserved' },
  { name: 'TC[2:0]',     start: 9, end: 11, desc: 'Traffic Class — 0-7，默认为TC0' },
  { name: 'R',            start: 12, end: 12, desc: 'Reserved' },
  { name: 'Attr[2]',     start: 13, end: 13, desc: 'Attribute[2] — 在Non-Flit Mode中不连续存放（另见Attr[1:0]）' },
  { name: 'R',            start: 14, end: 14, desc: 'Reserved (formerly LN — Lightweight Notification)' },
  { name: 'TH',           start: 15, end: 15, desc: 'TLP Processing Hints — 1b表示存在TPH信息' },
  // Byte 2
  { name: 'TD',           start: 16, end: 16, desc: 'TLP Digest — 1b表示TLP末尾有ECRC (1 DW)' },
  { name: 'EP',           start: 17, end: 17, desc: 'Error Poisoned — 1b表示TLP数据已损坏' },
  { name: 'Attr[1:0]',   start: 18, end: 19, desc: 'Attributes[1:0] — 见Section 2.2.6.3\n00=Normal, 01=Relaxed Ordering, 10=No Snoop, 11=RO+NS' },
  { name: 'AT[1:0]',     start: 20, end: 21, desc: 'Address Type — 00=Untranslated, 01=Translation Request, 10=Translated' },
  { name: 'Length[9:8]', start: 22, end: 23, desc: 'Data Payload Length (高2位), 单位DW' },
  // Byte 3
  { name: 'Length[7:0]', start: 24, end: 31, desc: 'Data Payload Length (低8位), 单位DW\n1=1DW, 0=1024DW' },
]

// ---------- 通用 DW0 字段（Flit Mode, 第一个DW的Header Base）----------
// 基于 Table 2-5 和 Figure 2-6
// Byte 0: Type[7:0]
// Byte 1: TC[6:4], R, OHC[4:0] ...
// 注意：Flit Mode 的格式根据具体 TLP 类型不同而有很大变化

const FM_DW0_BASE = [
  // Byte 0 — Type[7:0]
  { name: 'Type[7:0]',   start: 0, end: 7,  desc: 'Flit Mode TLP Type (8-bit全解码)\n见 Table 2-5' },
  // Byte 1 — 根据类型不同而变化
  { name: 'TC[2:0]',     start: 9, end: 11, desc: 'Traffic Class' },
  { name: 'R',            start: 8, end: 8,  desc: 'Reserved' },
  // Byte 1 低5位 + Byte 2-3 根据类型变化
  { name: 'OHC/Attr',    start: 12, end: 31, desc: '包含OHC[4:0]指示、Attr、Length等 — 具体布局依TLP类型而定' },
]

// ============================================================
// Non-Flit Mode (NFM) TLP 类型定义
// ============================================================

function makeNFMType(id, name, dw1Fields, dw2Fields, dw3Fields) {
  const dwords = [{ fields: NFM_DW0 }]
  if (dw1Fields) dwords.push({ label: 'DW 1 (Byte 4-7)', fields: dw1Fields })
  if (dw2Fields) dwords.push({ label: 'DW 2 (Byte 8-11)', fields: dw2Fields })
  if (dw3Fields) dwords.push({ label: 'DW 3 (Byte 12-15)', fields: dw3Fields })
  return { id, name, mode: 'NFM', dwords }
}

// 辅助：生成 DW1 字段（Byte 4-7, 在 DW 内的位置 0-31）
// ReqID[15:8]@Byte4 pos0-7, ReqID[7:0]@Byte5 pos8-15
// 其余字段由调用者指定
function reqidTagFields(tagOnly) {
  return [
    { name: 'Requester ID[15:8]', start: 0,  end: 7,  desc: 'Requester ID 高8位 (Bus Number + Device Number 高位)' },
    { name: 'Requester ID[7:0]',  start: 8,  end: 15, desc: 'Requester ID 低8位 (Device Number 低位 + Function Number)' },
  ]
}

// ============================================================
// Non-Flit Mode — 具体每种 TLP 类型
// ============================================================

export const nfmTypes = [

  // ========== Memory Read Request ==========
  makeNFMType('mrd32', 'MRd (32-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位 (10-bit Tag in NFM)' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW Byte Enables\n仅当TH=0时有意义；TH=1时作为ST[3:0]' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables\n仅当TH=0时有意义；TH=1时作为ST[7:4]' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '32-bit 目标地址 (bit 31:2)\n低2位由Byte Enables推导' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved (地址低2位对齐)' },
  ]),

  makeNFMType('mrd64', 'MRd (64-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW Byte Enables' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'Address[63:32]', start: 0,  end: 31, desc: '64-bit 地址高32位' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '64-bit 地址低30位 (bit 31:2)' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved' },
  ]),

  // ========== Memory Read Request - Locked ==========
  makeNFMType('mrdlk32', 'MRdLk (32-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW Byte Enables' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '32-bit 目标地址' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('mrdlk64', 'MRdLk (64-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW Byte Enables' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'Address[63:32]', start: 0,  end: 31, desc: '64-bit 地址高32位' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '64-bit 地址低30位' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved' },
  ]),

  // ========== Memory Write Request ==========
  makeNFMType('mwr32', 'MWr (32-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW Byte Enables\nTH=1时作为ST[3:0]' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables\nTH=1时作为ST[7:4]' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '32-bit 目标地址' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('mwr64', 'MWr (64-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW Byte Enables' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'Address[63:32]', start: 0,  end: 31, desc: '64-bit 地址高32位' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '64-bit 地址低30位' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved' },
  ]),

  // ========== I/O Requests ==========
  makeNFMType('iord', 'IORd', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位\nI/O Request: TC=000, Attr=00, AT=00, Length=1DW' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW BE — 必须为 0000b' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'I/O Address[31:2]', start: 0, end: 29, desc: '32-bit I/O 地址' },
    { name: 'R',                start: 30, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('iowr', 'IOWr', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW BE — 必须为 0000b' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'I/O Address[31:2]', start: 0, end: 29, desc: '32-bit I/O 地址' },
    { name: 'R',                start: 30, end: 31, desc: 'Reserved' },
  ]),

  // ========== Configuration Requests ==========
  makeNFMType('cfgr0', 'CfgRd (Type 0)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位\nConfig Request: TC=000, Attr=00, AT=00, Length=1DW' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW BE — 必须为 0000b' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'Bus Number[7:0]',      start: 0,  end: 7,  desc: '目标 Bus Number' },
    { name: 'Device Number[4:0]',   start: 8,  end: 12, desc: '目标 Device Number (5 bits)' },
    { name: 'Function Number[2:0]', start: 13, end: 15, desc: '目标 Function Number (3 bits)' },
    { name: 'R',                     start: 16, end: 16, desc: 'Reserved' },
    { name: 'Ext Reg Number[3:0]',  start: 17, end: 20, desc: 'Extended Register Number (PCIe扩展配置空间)' },
    { name: 'Register Number[5:0]', start: 21, end: 26, desc: 'Register Number (配置寄存器编号，4字节对齐)' },
    { name: 'R',                     start: 27, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('cfgw0', 'CfgWr (Type 0)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW BE — 必须为 0000b' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'Bus Number[7:0]',      start: 0,  end: 7,  desc: '目标 Bus Number' },
    { name: 'Device Number[4:0]',   start: 8,  end: 12, desc: '目标 Device Number' },
    { name: 'Function Number[2:0]', start: 13, end: 15, desc: '目标 Function Number' },
    { name: 'R',                     start: 16, end: 16, desc: 'Reserved' },
    { name: 'Ext Reg Number[3:0]',  start: 17, end: 20, desc: 'Extended Register Number' },
    { name: 'Register Number[5:0]', start: 21, end: 26, desc: 'Register Number' },
    { name: 'R',                     start: 27, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('cfgr1', 'CfgRd (Type 1)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW BE — 必须为 0000b' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'Bus Number[7:0]',      start: 0,  end: 7,  desc: '目标 Bus Number' },
    { name: 'Device Number[4:0]',   start: 8,  end: 12, desc: '目标 Device Number' },
    { name: 'Function Number[2:0]', start: 13, end: 15, desc: '目标 Function Number' },
    { name: 'R',                     start: 16, end: 16, desc: 'Reserved' },
    { name: 'Ext Reg Number[3:0]',  start: 17, end: 20, desc: 'Extended Register Number' },
    { name: 'Register Number[5:0]', start: 21, end: 26, desc: 'Register Number' },
    { name: 'R',                     start: 27, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('cfgw1', 'CfgWr (Type 1)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW BE — 必须为 0000b' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'Bus Number[7:0]',      start: 0,  end: 7,  desc: '目标 Bus Number' },
    { name: 'Device Number[4:0]',   start: 8,  end: 12, desc: '目标 Device Number' },
    { name: 'Function Number[2:0]', start: 13, end: 15, desc: '目标 Function Number' },
    { name: 'R',                     start: 16, end: 16, desc: 'Reserved' },
    { name: 'Ext Reg Number[3:0]',  start: 17, end: 20, desc: 'Extended Register Number' },
    { name: 'Register Number[5:0]', start: 21, end: 26, desc: 'Register Number' },
    { name: 'R',                     start: 27, end: 31, desc: 'Reserved' },
  ]),

  // ========== Message Requests (4 DW header) ==========
  // Type[4:3]=10 for Msg/MsgD, Type[2:0]=routing
  // Msg: Fmt=001 (4DW, no data); MsgD: Fmt=011 (4DW, with data)
  makeNFMType('msg', 'Msg (no data)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Tag[1:0]',     start: 24, end: 25, desc: 'Tag 低2位' },
    { name: 'R',             start: 26, end: 31, desc: 'Reserved' },
  ], [
    { name: 'Message Code[7:0]', start: 0, end: 7,  desc: 'Message Code — 标识具体消息类型\n见 Table 2-21~2-26' },
    { name: 'R',                 start: 8, end: 31, desc: 'Reserved (Bytes 9-11)' },
  ], [
    { name: 'R', start: 0, end: 31, desc: 'Reserved (Bytes 12-15)\n对于某些Message类型可能包含特定数据' },
  ]),

  makeNFMType('msgd', 'MsgD (with data)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Tag[1:0]',     start: 24, end: 25, desc: 'Tag 低2位' },
    { name: 'EP',            start: 26, end: 26, desc: 'Error Poisoned — 数据已损坏指示' },
    { name: 'R',             start: 27, end: 31, desc: 'Reserved' },
  ], [
    { name: 'Message Code[7:0]', start: 0, end: 7,  desc: 'Message Code — 标识具体消息类型' },
    { name: 'R',                 start: 8, end: 31, desc: 'Reserved (Bytes 9-11)' },
  ], [
    { name: 'R', start: 0, end: 31, desc: 'Reserved (Bytes 12-15)\n对于某些Message类型可能包含特定数据' },
  ]),

  // ========== Completion without Data ==========
  makeNFMType('cpl', 'Cpl (no data)', [
    { name: 'Completer ID[15:8]', start: 0,  end: 7,  desc: 'Completer ID 高8位 (Bus + Device 高位)' },
    { name: 'Completer ID[7:0]',  start: 8,  end: 15, desc: 'Completer ID 低8位 (Device 低位 + Function)' },
    { name: 'Cpl Status[2:0]',    start: 16, end: 18, desc: 'Completion Status:\n000=Successful Completion\n001=Unsupported Request\n010=Request Retry Status\n100=Completer Abort' },
    { name: 'BCM',                  start: 19, end: 19, desc: 'Byte Count Modified — PCI-X兼容位，PCIe必须为0' },
    { name: 'Byte Count[11:0]',    start: 20, end: 31, desc: '剩余需传输的字节数\n0=4096 bytes' },
  ], [
    { name: 'Requester ID[15:8]', start: 0,  end: 7,  desc: 'Requester ID 高8位 (对应原始Request)' },
    { name: 'Requester ID[7:0]',  start: 8,  end: 15, desc: 'Requester ID 低8位' },
    { name: 'Tag[9:2]',           start: 16, end: 23, desc: 'Tag 高8位 (对应原始Request)' },
    { name: 'Tag[1:0]',           start: 24, end: 25, desc: 'Tag 低2位' },
    { name: 'R',                   start: 26, end: 26, desc: 'Reserved' },
    { name: 'Lower Addr[6:0]',    start: 27, end: 31, desc: 'Lower Address[6:0] — 起始字节地址\nCpl(no data)必须为全0' },
    // Wait, that's 5 bits for lower addr + 1 R = 6 bits? No:
    // Tag[1:0]=2bits + R=1bit + LowerAddr[6:0]=7bits = 10 bits but Byte 11 only has 8.
    // Actually: Byte 11 layout: Tag[1:0], R, Lower Addr[6:2]...
    // Hmm, 2 + 1 + 5 = 8 bits. That works.
    // Lower Addr[6:2] = 5 bits, and Lower Addr[1:0] must be 00.
    // Let me fix: Lower Addr is 7 bits but only bits 6:2 are in Byte 11 (5 bits)
    // The lower 2 bits (1:0) are implied = 00 by alignment.
  ]),

  // ========== Completion with Data ==========
  makeNFMType('cpld', 'CplD (with data)', [
    { name: 'Completer ID[15:8]', start: 0,  end: 7,  desc: 'Completer ID 高8位' },
    { name: 'Completer ID[7:0]',  start: 8,  end: 15, desc: 'Completer ID 低8位' },
    { name: 'Cpl Status[2:0]',    start: 16, end: 18, desc: 'Completion Status:\n000=Successful Completion\n001=Unsupported Request\n010=Request Retry Status\n100=Completer Abort' },
    { name: 'BCM',                  start: 19, end: 19, desc: 'Byte Count Modified — 必须为0' },
    { name: 'Byte Count[11:8]',    start: 20, end: 23, desc: 'Byte Count 高4位' },
    { name: 'Byte Count[7:0]',     start: 24, end: 31, desc: 'Byte Count 低8位' },
  ], [
    { name: 'Requester ID[15:8]', start: 0,  end: 7,  desc: 'Requester ID 高8位' },
    { name: 'Requester ID[7:0]',  start: 8,  end: 15, desc: 'Requester ID 低8位' },
    { name: 'Tag[9:2]',           start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Tag[1:0]',           start: 24, end: 25, desc: 'Tag 低2位' },
    { name: 'R',                   start: 26, end: 26, desc: 'Reserved' },
    { name: 'Lower Addr[6:2]',    start: 27, end: 31, desc: 'Lower Address[6:2] — 起始字节地址高5位\n低2位由Byte Enables或数据对齐推导' },
  ]),

  // ========== Completion for Locked Memory Read ==========
  makeNFMType('cpllk', 'CplLk (no data)', [
    { name: 'Completer ID[15:8]', start: 0,  end: 7,  desc: 'Completer ID 高8位' },
    { name: 'Completer ID[7:0]',  start: 8,  end: 15, desc: 'Completer ID 低8位' },
    { name: 'Cpl Status[2:0]',    start: 16, end: 18, desc: 'Completion Status — 仅用于错误场景' },
    { name: 'BCM',                start: 19, end: 19, desc: 'Byte Count Modified' },
    { name: 'Byte Count[11:0]',   start: 20, end: 31, desc: 'Byte Count' },
  ], [
    { name: 'Requester ID[15:8]', start: 0,  end: 7,  desc: 'Requester ID 高8位' },
    { name: 'Requester ID[7:0]',  start: 8,  end: 15, desc: 'Requester ID 低8位' },
    { name: 'Tag[9:2]',           start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Tag[1:0]',           start: 24, end: 25, desc: 'Tag 低2位' },
    { name: 'R',                   start: 26, end: 26, desc: 'Reserved' },
    { name: 'Lower Addr[6:2]',    start: 27, end: 31, desc: 'Lower Address[6:2]' },
  ]),

  makeNFMType('cpldlk', 'CplDLk (with data)', [
    { name: 'Completer ID[15:8]', start: 0,  end: 7,  desc: 'Completer ID 高8位' },
    { name: 'Completer ID[7:0]',  start: 8,  end: 15, desc: 'Completer ID 低8位' },
    { name: 'Cpl Status[2:0]',    start: 16, end: 18, desc: 'Completion Status' },
    { name: 'BCM',                start: 19, end: 19, desc: 'Byte Count Modified' },
    { name: 'Byte Count[11:8]',   start: 20, end: 23, desc: 'Byte Count 高4位' },
    { name: 'Byte Count[7:0]',    start: 24, end: 31, desc: 'Byte Count 低8位' },
  ], [
    { name: 'Requester ID[15:8]', start: 0,  end: 7,  desc: 'Requester ID 高8位' },
    { name: 'Requester ID[7:0]',  start: 8,  end: 15, desc: 'Requester ID 低8位' },
    { name: 'Tag[9:2]',           start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Tag[1:0]',           start: 24, end: 25, desc: 'Tag 低2位' },
    { name: 'R',                   start: 26, end: 26, desc: 'Reserved' },
    { name: 'Lower Addr[6:2]',    start: 27, end: 31, desc: 'Lower Address[6:2]' },
  ]),

  // ========== AtomicOp Requests ==========
  makeNFMType('fetchadd32', 'FetchAdd (32-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'R',             start: 24, end: 27, desc: 'Reserved (AtomicOp: DW BE字段为Reserved)' },
    { name: 'R',             start: 28, end: 31, desc: 'Reserved' },
  ], [
    { name: 'Address[31:2]', start: 0,  end: 29, desc: '32-bit 目标地址\n必须自然对齐(32b/64b/128b)' },
    { name: 'R',             start: 30, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('fetchadd64', 'FetchAdd (64-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'R',             start: 24, end: 27, desc: 'Reserved' },
    { name: 'R',             start: 28, end: 31, desc: 'Reserved' },
  ], [
    { name: 'Address[63:32]', start: 0,  end: 31, desc: '64-bit 地址高32位' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '64-bit 地址低30位' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('swap32', 'Swap (32-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'R',             start: 24, end: 27, desc: 'Reserved' },
    { name: 'R',             start: 28, end: 31, desc: 'Reserved' },
  ], [
    { name: 'Address[31:2]', start: 0,  end: 29, desc: '32-bit 目标地址' },
    { name: 'R',             start: 30, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('swap64', 'Swap (64-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'R',             start: 24, end: 27, desc: 'Reserved' },
    { name: 'R',             start: 28, end: 31, desc: 'Reserved' },
  ], [
    { name: 'Address[63:32]', start: 0,  end: 31, desc: '64-bit 地址高32位' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '64-bit 地址低30位' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('cas32', 'CAS (32-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'R',             start: 24, end: 27, desc: 'Reserved' },
    { name: 'R',             start: 28, end: 31, desc: 'Reserved' },
  ], [
    { name: 'Address[31:2]', start: 0,  end: 29, desc: '32-bit 目标地址\nCAS操作数: 比较值+交换值' },
    { name: 'R',             start: 30, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('cas64', 'CAS (64-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'R',             start: 24, end: 27, desc: 'Reserved' },
    { name: 'R',             start: 28, end: 31, desc: 'Reserved' },
  ], [
    { name: 'Address[63:32]', start: 0,  end: 31, desc: '64-bit 地址高32位' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '64-bit 地址低30位' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved' },
  ]),

  // ========== Deferrable Memory Write Request ==========
  makeNFMType('dmwr32', 'DMWr (32-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW Byte Enables\nTH=1时作为ST[3:0]' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables\nTH=1时作为ST[7:4]' },
  ], [
    { name: 'Address[31:2]', start: 0,  end: 29, desc: '32-bit 目标地址' },
    { name: 'R',             start: 30, end: 31, desc: 'Reserved' },
  ]),

  makeNFMType('dmwr64', 'DMWr (64-bit)', [
    ...reqidTagFields(),
    { name: 'Tag[9:2]',     start: 16, end: 23, desc: 'Tag 高8位' },
    { name: 'Last DW BE[3:0]', start: 24, end: 27, desc: 'Last DW Byte Enables' },
    { name: '1st DW BE[3:0]',  start: 28, end: 31, desc: 'First DW Byte Enables' },
  ], [
    { name: 'Address[63:32]', start: 0,  end: 31, desc: '64-bit 地址高32位' },
  ], [
    { name: 'Address[31:2]',  start: 0,  end: 29, desc: '64-bit 地址低30位' },
    { name: 'R',              start: 30, end: 31, desc: 'Reserved' },
  ]),
]

// ============================================================
// Flit Mode (FM) TLP 类型定义
// 基于 Table 2-5 (Flit Mode TLP Header Type Encodings)
// Flit Mode 中的 Type 字段是完整8位编码
// ============================================================

function makeFMType(id, name, dwords, desc) {
  return { id, name, mode: 'FM', description: desc || '', dwords }
}

export const fmTypes = [

  // Flit Mode 的第0个 DW (Header Base DW0) 对于不同类型的布局差异很大
  // 这里给出各个类型的简化定义，后续可手动细化

  makeFMType('fm_nop', 'NOP', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x00 — No Operation\nLocal TLP, Terminate at Receiver' },
      { name: 'R', start: 8, end: 31, desc: 'Reserved — 所有其他字段均为Reserved' },
    ]},
  ], 'No Operation — Local TLP, Terminate at Receiver. NFM使用此编码表示MRd.'),

  makeFMType('fm_mrd32', 'MRd (32-bit)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x03 — Memory Read Request, 32b address routed' },
      { name: 'TC[2:0]', start: 9, end: 11, desc: 'Traffic Class' },
      { name: 'Attr[2:0] / R', start: 8, end: 15, desc: 'Attr[2:0] + 其他控制位 (具体布局见Figure 2-7+)' },
      { name: 'Length[9:0]', start: 22, end: 31, desc: 'Data Payload Length (10 bits, DW为单位)' },
      { name: 'R / TD / EP / AT', start: 16, end: 21, desc: 'TD, EP, AT[1:0] 等字段' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID[15:0] + Tag[13:0]', start: 0, end: 31, desc: 'Transaction ID (FM中Tag为14位)' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Address[31:2] + R', start: 0, end: 31, desc: '32-bit 目标地址' },
    ]},
  ], 'Memory Read Request, 32b address routed. #3 in Table 2-5. 3DW Header Base.'),

  makeFMType('fm_mrd64', 'MRd (64-bit)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x20 — Memory Read Request, 64b address routed' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0], 控制位' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: 'TD, EP, AT[1:0], Length高2位' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Length低8位' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID[15:0] + Tag[13:0] 部分', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Address[63:32]', start: 0, end: 31, desc: '64-bit 地址高32位' },
    ]},
    { label: 'DW 3', fields: [
      { name: 'Address[31:2] + R', start: 0, end: 31, desc: '64-bit 地址低30位' },
    ]},
  ], 'Memory Read Request, 64b address routed. #32 in Table 2-5. 4DW Header Base.'),

  makeFMType('fm_mwr32', 'MWr (32-bit)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x40 — Memory Write Request, 32b address routed' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0]' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: 'TD, EP, AT[1:0], Length高2位' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Length低8位' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID[15:0] + Tag[13:0] 部分', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Address[31:2] + R', start: 0, end: 31, desc: '32-bit 目标地址' },
    ]},
  ], 'Memory Write Request, 32b address routed. #64 in Table 2-5. 3DW Header Base.'),

  makeFMType('fm_mwr64', 'MWr (64-bit)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x60 — Memory Write Request, 64b address routed' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0]' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: 'TD, EP, AT[1:0], Length高2位' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Length低8位' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID[15:0] + Tag[13:0] 部分', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Address[63:32]', start: 0, end: 31, desc: '64-bit 地址高32位' },
    ]},
    { label: 'DW 3', fields: [
      { name: 'Address[31:2] + R', start: 0, end: 31, desc: '64-bit 地址低30位' },
    ]},
  ], 'Memory Write Request, 64b address routed. #96 in Table 2-5. 4DW Header Base.'),

  makeFMType('fm_iord', 'IORd', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x02 — I/O Read Request' },
      { name: 'TC[2:0] (必须为000b)', start: 9, end: 11, desc: 'Traffic Class — I/O必须为TC0' },
      { name: 'OHC指示 / Attr', start: 8, end: 15, desc: 'OHC[4:0] + Attr (I/O: Attr必须为00)' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: 'TD, EP, AT[1:0]=00, Length高2位=00' },
      { name: 'Length[7:0] (=0x01)', start: 24, end: 31, desc: 'Length低8位 — I/O必须为1DW' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'I/O Address[31:2] + R', start: 0, end: 31, desc: '32-bit I/O 地址 + OHC-A2 (Byte Enables)' },
    ]},
  ], 'I/O Read Request. #2 in Table 2-5. 3DW Header Base. 需要 OHC-A2.'),

  makeFMType('fm_iowr', 'IOWr', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x42 — I/O Write Request' },
      { name: 'TC[2:0] (必须为000b)', start: 9, end: 11, desc: 'Traffic Class — I/O必须为TC0' },
      { name: 'OHC指示 / Attr', start: 8, end: 15, desc: 'OHC[4:0] + Attr' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制 + Length高2位' },
      { name: 'Length[7:0] (=0x01)', start: 24, end: 31, desc: 'Length低8位 — 必须为1DW' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'I/O Address[31:2] + R', start: 0, end: 31, desc: '32-bit I/O 地址 + OHC-A2' },
    ]},
  ], 'I/O Write Request. #66 in Table 2-5. 3DW Header Base. 需要 OHC-A2.'),

  makeFMType('fm_cfgr0', 'CfgRd (Type 0)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x04 — Type 0 Configuration Read Request' },
      { name: 'TC[2:0] (必须为000b)', start: 9, end: 11, desc: 'TC — Config必须为TC0' },
      { name: 'OHC指示 / Attr', start: 8, end: 15, desc: 'OHC[4:0] + Attr[2:0] (Attr=00)' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制 + Length高2位 (=00)' },
      { name: 'Length[7:0] (=0x01)', start: 24, end: 31, desc: 'Length — 必须为1DW' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Bus/Device/Function + RegNum', start: 0, end: 31, desc: 'Config目标 + OHC-A3 (含Destination Segment)' },
    ]},
  ], 'Type 0 Configuration Read Request. #4 in Table 2-5. 3DW Header Base. 需要 OHC-A3.'),

  makeFMType('fm_cfgw0', 'CfgWr (Type 0)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x44 — Type 0 Configuration Write Request' },
      { name: 'TC[2:0] (必须为000b)', start: 9, end: 11, desc: 'TC — Config必须为TC0' },
      { name: 'OHC指示 / Attr', start: 8, end: 15, desc: 'OHC[4:0] + Attr' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制 + Length高2位' },
      { name: 'Length[7:0] (=0x01)', start: 24, end: 31, desc: 'Length — 必须为1DW' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Bus/Device/Function + RegNum', start: 0, end: 31, desc: 'Config目标 + OHC-A3' },
    ]},
  ], 'Type 0 Configuration Write Request. #68 in Table 2-5. 3DW Header Base. 需要 OHC-A3.'),

  makeFMType('fm_cfgr1', 'CfgRd (Type 1)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x05 — Type 1 Configuration Read Request' },
      { name: 'TC[2:0] (必须为000b)', start: 9, end: 11, desc: 'TC — Config必须为TC0' },
      { name: 'OHC指示 / Attr', start: 8, end: 15, desc: 'OHC[4:0] + Attr' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制 + Length高2位' },
      { name: 'Length[7:0] (=0x01)', start: 24, end: 31, desc: 'Length — 必须为1DW' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Bus/Device/Function + RegNum', start: 0, end: 31, desc: 'Config目标 + OHC-A3' },
    ]},
  ], 'Type 1 Configuration Read Request. #5 in Table 2-5. 3DW Header Base. 需要 OHC-A3.'),

  makeFMType('fm_cfgw1', 'CfgWr (Type 1)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x45 — Type 1 Configuration Write Request' },
      { name: 'TC[2:0] (必须为000b)', start: 9, end: 11, desc: 'TC — Config必须为TC0' },
      { name: 'OHC指示 / Attr', start: 8, end: 15, desc: 'OHC[4:0] + Attr' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制 + Length高2位' },
      { name: 'Length[7:0] (=0x01)', start: 24, end: 31, desc: 'Length — 必须为1DW' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Bus/Device/Function + RegNum', start: 0, end: 31, desc: 'Config目标 + OHC-A3' },
    ]},
  ], 'Type 1 Configuration Write Request. #69 in Table 2-5. 3DW Header Base. 需要 OHC-A3.'),

  makeFMType('fm_msg_rc', 'Msg (to Root Complex)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x30 — Message w/o Data, Routed to Root Complex' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0]' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制位 + Length高2位 (Reserved for Msg)' },
      { name: 'Length[7:0] (Reserved)', start: 24, end: 31, desc: 'Length — Msg无数据，Reserved' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID[15:0]', start: 0, end: 15, desc: 'Requester ID' },
      { name: 'Tag[13:0] 部分', start: 16, end: 31, desc: 'Tag (FM中为14位)' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Message Code[7:0]', start: 0, end: 7, desc: 'Message Code (与NFM相同)' },
      { name: 'R', start: 8, end: 31, desc: 'Reserved' },
    ]},
    { label: 'DW 3', fields: [
      { name: 'R', start: 0, end: 31, desc: 'Reserved (或特定Message的数据)' },
    ]},
  ], 'Message w/o Data, Routed to Root Complex. #48 in Table 2-5. 4DW Header Base.'),

  makeFMType('fm_msgd_rc', 'MsgD (to Root Complex)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x70 — Message with Data, Routed to Root Complex' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0]' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制位 + Length高2位' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Data Payload Length (DW)' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID[15:0]', start: 0, end: 15, desc: 'Requester ID' },
      { name: 'Tag[13:0] 部分', start: 16, end: 31, desc: 'Tag' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Message Code[7:0]', start: 0, end: 7, desc: 'Message Code' },
      { name: 'R', start: 8, end: 31, desc: 'Reserved' },
    ]},
    { label: 'DW 3', fields: [
      { name: 'R', start: 0, end: 31, desc: 'Reserved (或特定Message的数据)' },
    ]},
  ], 'Message with Data, Routed to Root Complex. #112 in Table 2-5. 4DW Header Base.'),

  makeFMType('fm_cpl', 'Cpl (no data)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x0A — Completion without Data' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0] (对应原始Request)' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制位 + Length高2位' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Length — Cpl(no data) 为 0' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Completer ID[15:0]', start: 0, end: 15, desc: 'Completer ID' },
      { name: 'Byte Count[11:0] + Cpl Status[2:0]', start: 16, end: 31, desc: 'Byte Count + Completion Status' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Requester ID[15:0]', start: 0, end: 15, desc: 'Requester ID' },
      { name: 'Tag[13:0] + Lower Addr', start: 16, end: 31, desc: 'Tag (14-bit in FM) + Lower Address部分' },
    ]},
  ], 'Completion without Data. #10 in Table 2-5. 3DW Header Base. OHC-A5 可能需要.'),

  makeFMType('fm_cpld', 'CplD (with data)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x4A — Completion with Data' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0] (对应原始Request)' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制位 + Length高2位' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Data Payload Length (DW)' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Completer ID[15:0]', start: 0, end: 15, desc: 'Completer ID' },
      { name: 'Byte Count[11:0] + Cpl Status[2:0]', start: 16, end: 31, desc: 'Byte Count + Completion Status[2:0]' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Requester ID[15:0]', start: 0, end: 15, desc: 'Requester ID' },
      { name: 'Tag[13:0] + Lower Addr', start: 16, end: 31, desc: 'Tag (14-bit) + Lower Address' },
    ]},
  ], 'Completion with Data. #74 in Table 2-5. 3DW Header Base. OHC-A5 可能需要.'),

  makeFMType('fm_fetchadd32', 'FetchAdd (32-bit)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x4C — Fetch and Add AtomicOp, 32b address' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0]' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制位 + Length高2位 (操作数大小)' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Length — 操作数大小 (1DW/2DW)' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Address[31:2] + R', start: 0, end: 31, desc: '32-bit 目标地址 (自然对齐)' },
    ]},
  ], 'Fetch and Add AtomicOp Request, 32b. #76 in Table 2-5. 3DW Header Base.'),

  makeFMType('fm_swap32', 'Swap (32-bit)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x4D — Unconditional Swap AtomicOp, 32b address' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0]' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制位 + Length高2位' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Length — 操作数大小' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Address[31:2] + R', start: 0, end: 31, desc: '32-bit 目标地址' },
    ]},
  ], 'Unconditional Swap AtomicOp Request, 32b. #77 in Table 2-5. 3DW Header Base.'),

  makeFMType('fm_cas32', 'CAS (32-bit)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x4E — Compare and Swap AtomicOp, 32b address' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0]' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制位 + Length高2位' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Length — 操作数大小 (2DW/4DW/8DW)' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Address[31:2] + R', start: 0, end: 31, desc: '32-bit 目标地址 (自然对齐)' },
    ]},
  ], 'Compare and Swap AtomicOp Request, 32b. #78 in Table 2-5. 3DW Header Base.'),

  makeFMType('fm_dmwr32', 'DMWr (32-bit)', [
    { fields: [
      { name: 'Type[7:0]', start: 0, end: 7, desc: 'Type=0x5B — Deferrable Memory Write Request, 32b' },
      { name: 'TC[2:0] / Attr[2:0]', start: 8, end: 15, desc: 'TC[2:0], Attr[2:0]' },
      { name: 'TD / EP / AT / Length[9:8]', start: 16, end: 23, desc: '控制位 + Length高2位' },
      { name: 'Length[7:0]', start: 24, end: 31, desc: 'Data Payload Length' },
    ]},
    { label: 'DW 1', fields: [
      { name: 'Requester ID + Tag', start: 0, end: 31, desc: 'Transaction ID' },
    ]},
    { label: 'DW 2', fields: [
      { name: 'Address[31:2] + R', start: 0, end: 31, desc: '32-bit 目标地址' },
    ]},
  ], 'Deferrable Memory Write Request, 32b. #91 in Table 2-5. 3DW Header Base.'),

]
