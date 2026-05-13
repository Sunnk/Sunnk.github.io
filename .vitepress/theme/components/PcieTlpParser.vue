<script setup lang="ts">
import { ref, computed } from 'vue'

// ============================================================
// Interfaces
// ============================================================

interface TlpField {
  label: string
  bits: [number, number]
  description: string
  color: string
  value?: string
}

interface TlpWord {
  name: string
  fields: TlpField[]
}

interface TlpResult {
  id: string
  title: string
  subtitle: string
  badge: string
  words: TlpWord[]
  dwHex: string[]
}

/**
 * TLP 类型定义 —— 添加新包类型只需在 tlpTypes 数组中新增一个条目即可。
 *
 * match(fmt, type, dwCount): 返回值决定是否匹配此类型。
 *   - fmt:  DW0 bits[31:29], 3'b000~3'b011
 *   - type: DW0 bits[28:24], 5'b00000~5'b11111
 *   - dwCount: 用户输入的 DW 个数
 *
 * decode(dw[]): 接收全部 DW，返回此类型的字段解析结果。
 */
interface TlpTypeDef {
  id: string
  title: string
  subtitle: string
  badge: string
  match: (fmt: number, typeVal: number, dwCount: number) => boolean
  decode: (dw: number[]) => TlpWord[]
}

/**
 * FLIT 模式 TLP 类型定义（PCIe 6.0+）。
 * 与非 FLIT 模式不同，FLIT 模式使用 8-bit Packet Type 而非 Fmt+Type 组合。
 * match(pktType, dwCount): pktType 为 DW0[31:24] 的 8-bit 操作码。
 */
interface FlitTlpTypeDef {
  id: string
  title: string
  subtitle: string
  badge: string
  /** 该类型的 8-bit Packet Type 操作码 (DW0[31:24]) */
  opcode: number
  match: (pktType: number, dwCount: number) => boolean
  decode: (dw: number[]) => TlpWord[]
}

// ============================================================
// 位域工具函数
// ============================================================

function field(
  label: string,
  msb: number,
  lsb: number,
  description: string,
  color = 'slate',
  value?: string,
): TlpField {
  return { label, bits: [msb, lsb], description, color, value }
}

function extract(dw: number, msb: number, lsb: number): number {
  return (dw >>> lsb) & ((1 << (msb - lsb + 1)) - 1)
}

function hex(v: number, width: number): string {
  return '0x' + v.toString(16).toUpperCase().padStart(width, '0')
}

function fmtLabel(fmt: number): string {
  const map: Record<number, string> = {
    0: '3DW, no data',
    1: '4DW, no data',
    2: '3DW, with data',
    3: '4DW, with data',
  }
  return `${fmt.toString(2).padStart(3, '0')} (${map[fmt] ?? 'Reserved'})`
}

function typeLabel(typeVal: number): string {
  const map: Record<number, string> = {
    0: 'Memory Request',
    1: 'Memory Locked',
    2: 'IO Request',
    4: 'Config Type 0',
    5: 'Config Type 1',
    10: 'Completion',
    11: 'Completion Locked',
  }
  const t = typeVal
  if (map[t]) return `0_${t.toString(2).padStart(5, '0')} → ${map[t]}`
  if ((t >>> 3) === 2) return `1_${(t & 7).toString(2).padStart(3, '0')} → Message`
  return `${t.toString(2).padStart(5, '0')}`
}

// ============================================================
// 共用 DW0 字段 —— Memory / IO 类请求
// ============================================================

function dw0MemIO(dw0: number, extraBits: TlpField[] = []): TlpField[] {
  const fmt = extract(dw0, 31, 29)
  const typ = extract(dw0, 28, 24)
  const fields: TlpField[] = [
    field('Fmt', 31, 29, 'Header 格式与数据负载指示', 'blue', fmtLabel(fmt)),
    field('Type', 28, 24, 'TLP 类型编码', 'purple', typeLabel(typ)),
    field('TC', 22, 20, 'Traffic Class，用于流量分类', 'green', `${extract(dw0, 22, 20)}`),
    field('Reserved', 19, 17, '保留位', 'slate'),
    field('TH', 16, 16, 'TLP Processing Hints', 'rose', `${extract(dw0, 16, 16)}`),
    field('TD', 15, 15, 'TLP Digest (ECRC) 标志', 'cyan', `${extract(dw0, 15, 15)}`),
    field('EP', 14, 14, 'Poisoned TLP 标志', 'red', `${extract(dw0, 14, 14)}`),
    field('Attr', 13, 12, 'No Snoop / Relaxed Ordering', 'amber', extract(dw0, 13, 12).toString(2).padStart(2, '0')),
    field('AT', 11, 10, 'Address Type', 'slate', extract(dw0, 11, 10).toString(2).padStart(2, '0')),
    field('Length', 9, 0, 'Payload 长度 (DW)', 'indigo', hex(extract(dw0, 9, 0), 3)),
    ...extraBits,
  ]
  return fields
}

// ============================================================
// 共用 DW0 字段 —— Completion
// ============================================================

function dw0Completion(dw0: number): TlpField[] {
  const fmt = extract(dw0, 31, 29)
  const typ = extract(dw0, 28, 24)
  return [
    field('Fmt', 31, 29, 'Fmt=0 → Cpl, Fmt=2 → CplD', 'blue', fmtLabel(fmt)),
    field('Type', 28, 24, 'Completion 类型', 'purple', typeLabel(typ)),
    field('TC', 22, 20, 'Traffic Class', 'green', `${extract(dw0, 22, 20)}`),
    field('Reserved', 19, 17, '保留位', 'slate'),
    field('TH', 16, 16, 'TLP Processing Hints', 'rose', `${extract(dw0, 16, 16)}`),
    field('TD', 15, 15, 'TLP Digest', 'cyan', `${extract(dw0, 15, 15)}`),
    field('EP', 14, 14, 'Poisoned TLP', 'red', `${extract(dw0, 14, 14)}`),
    field('Attr', 13, 12, 'Completion 属性', 'amber', extract(dw0, 13, 12).toString(2).padStart(2, '0')),
    field('Reserved', 11, 10, '保留位', 'slate'),
    field('Length', 9, 0, 'CplD Payload 长度 (DW)', 'indigo', hex(extract(dw0, 9, 0), 3)),
  ]
}

// ============================================================
// 共用 DW1 字段 —— 请求类 (Requester ID, Tag, BE)
// ============================================================

function dw1Request(dw1: number): TlpField[] {
  return [
    field('Requester ID', 31, 16, 'Bus / Device / Function', 'blue', bdf(extract(dw1, 31, 16))),
    field('Tag', 15, 8, '事务 Tag', 'purple', hex(extract(dw1, 15, 8), 2)),
    field('Last BE', 7, 4, 'Last DW Byte Enable', 'green', `${extract(dw1, 7, 4).toString(2).padStart(4, '0')}`),
    field('First BE', 3, 0, 'First DW Byte Enable', 'amber', `${extract(dw1, 3, 0).toString(2).padStart(4, '0')}`),
  ]
}

function bdf(id: number): string {
  const bus = (id >>> 8) & 0xff
  const dev = (id >>> 3) & 0x1f
  const fn = id & 0x7
  return `BDF ${bus.toString(16).toUpperCase().padStart(2, '0')}:${dev.toString(16).toUpperCase().padStart(2, '0')}.${fn}`
}

function statusLabel(st: number): string {
  const map: Record<number, string> = { 0: 'SC (Successful)', 1: 'UR (Unsupported)', 2: 'CRS (Config Retry)', 4: 'CA (Completer Abort)' }
  return map[st] ?? `Reserved (${st})`
}

// ============================================================
// FLIT 模式专用工具函数（PCIe 6.0+）
// ============================================================

function pktTypeLabel(pt: number): string {
  const map: Record<number, string> = {
    0x00: 'NOP',
    0x03: 'Mem Read 32',
    0x22: 'UIO Mem Read (64-bit)',
    0x30: 'Msg to RC',
    0x40: 'Mem Write 32',
    0x42: 'I/O Write',
    0x44: 'Cfg Write Type 0',
    0x4C: 'FetchAdd AtomicOp (32)',
    0x4E: 'CompareSwap AtomicOp (32)',
    0x5B: 'Deferrable Mem Write 32',
    0x61: 'UIO Mem Write (64-bit)',
    0x70: 'MsgD to RC',
    0x8D: 'Local TLP Prefix',
  }
  if (map[pt]) return `0x${pt.toString(16).toUpperCase().padStart(2, '0')} → ${map[pt]}`
  return `0x${pt.toString(16).toUpperCase().padStart(2, '0')} (Reserved/未定义)`
}

function ohcLabel(ohc: number): string {
  if (ohc === 0) return '0b00000 (无 OHC)'
  const parts: string[] = []
  if (ohc & 0x01) parts.push('OHC-A')
  if (ohc & 0x02) parts.push('OHC-B')
  if (ohc & 0x04) parts.push('OHC-C')
  const e = (ohc >>> 3) & 0x3
  if (e === 1) parts.push('OHC-E1')
  else if (e === 2) parts.push('OHC-E2')
  else if (e === 3) parts.push('OHC-E4')
  return `0b${ohc.toString(2).padStart(5, '0')}` + (parts.length ? ` (${parts.join(', ')})` : '')
}

/** FLIT 模式 DW0 通用字段 (PCIe 6.0 Base Spec Section 2.2) */
function dw0Flit(dw0: number, extraDesc = ''): TlpField[] {
  const pt = extract(dw0, 31, 24)
  return [
    field('Packet Type', 31, 24, `8-bit 操作码，完全解码${extraDesc}`, 'blue', pktTypeLabel(pt)),
    field('TC', 23, 21, 'Traffic Class', 'green', `${extract(dw0, 23, 21)}`),
    field('OHC[4:0]', 20, 16, 'Orthogonal Header Content 指示位', 'purple', ohcLabel(extract(dw0, 20, 16))),
    field('Attrib/TS', 15, 12, 'Attr + Tag Status', 'amber', extract(dw0, 15, 12).toString(2).padStart(4, '0')),
    field('AT', 11, 10, 'Address Type', 'slate', extract(dw0, 11, 10).toString(2).padStart(2, '0')),
    field('Length', 9, 0, 'Payload 长度 (DW)', 'indigo', `0x${extract(dw0, 9, 0).toString(16).toUpperCase()} (${extract(dw0, 9, 0)})`),
  ]
}

/** FLIT 模式 DW1 请求类字段 (Requester ID + 14-bit Tag) */
function dw1FlitReq(dw1: number): TlpField[] {
  const tag14 = ((extract(dw1, 15, 8) << 6) | extract(dw1, 7, 2)) & 0x3FFF
  return [
    field('Requester ID', 31, 16, 'Bus / Device / Function', 'blue', bdf(extract(dw1, 31, 16))),
    field('Tag[13:6]', 15, 8, '14-bit Tag 高 8 位', 'purple', hex(extract(dw1, 15, 8), 2)),
    field('Tag[5:0]', 7, 2, '14-bit Tag 低 6 位', 'purple', hex(extract(dw1, 7, 2), 2)),
    field('Tag (14-bit)', 0, 0, `完整 14-bit Tag: 0x${tag14.toString(16).toUpperCase().padStart(4, '0')}`, 'purple', `0x${tag14.toString(16).toUpperCase().padStart(4, '0')} (${tag14})`),
  ]
}

/** FLIT 模式 OHC-A 解析 */
function decodeOhcA(dw: number, label: string): TlpWord {
  return { name: `OHC-A (${label})`, fields: [field(`OHC-A ${label}`, 31, 0, '正交头内容 A', 'amber', hex(dw, 8))] }
}

// ============================================================
// TLP 类型注册表
// 添加新类型：在此数组中追加一个 TlpTypeDef 对象。
// match() 返回 true → 调用 decode() 解析字段。
// ============================================================

const tlpTypes: TlpTypeDef[] = [

  // ---- Memory Read / Write (32-bit, 3DW) ----
  {
    id: 'mrd32',
    title: 'Memory Read Request (32-bit)',
    subtitle: '3DW Header，32-bit 地址，无数据负载',
    badge: 'MRd(32)',
    match: (fmt, typeVal) => fmt === 0 && typeVal === 0,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0MemIO(dw[0]) },
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('Address[31:2]', 31, 2, '32-bit 目标地址高位', 'cyan', hex(extract(dw[2], 31, 2), 8)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
    ],
  },

  {
    id: 'mwr32',
    title: 'Memory Write Request (32-bit)',
    subtitle: '3DW Header，32-bit 地址，携带数据负载',
    badge: 'MWr(32)',
    match: (fmt, typeVal) => fmt === 2 && typeVal === 0,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0MemIO(dw[0]) },
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('Address[31:2]', 31, 2, '32-bit 目标地址高位', 'cyan', hex(extract(dw[2], 31, 2), 8)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
      ...dataPayload(dw.slice(3), extract(dw[0], 9, 0)),
    ],
  },

  // ---- Memory Read / Write (64-bit, 4DW) ----
  {
    id: 'mrd64',
    title: 'Memory Read Request (64-bit)',
    subtitle: '4DW Header，64-bit 地址，无数据负载',
    badge: 'MRd(64)',
    match: (fmt, typeVal) => fmt === 1 && typeVal === 0,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0MemIO(dw[0]) },
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('Address[63:32]', 31, 0, '64-bit 地址高 32 位', 'cyan', hex(dw[2], 8)),
      ]},
      { name: 'DW 3', fields: [
        field('Address[31:2]', 31, 2, '64-bit 地址低位', 'cyan', hex(extract(dw[3], 31, 2), 8)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
    ],
  },

  {
    id: 'mwr64',
    title: 'Memory Write Request (64-bit)',
    subtitle: '4DW Header，64-bit 地址，携带数据负载',
    badge: 'MWr(64)',
    match: (fmt, typeVal) => fmt === 3 && typeVal === 0,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0MemIO(dw[0]) },
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('Address[63:32]', 31, 0, '64-bit 地址高 32 位', 'cyan', hex(dw[2], 8)),
      ]},
      { name: 'DW 3', fields: [
        field('Address[31:2]', 31, 2, '64-bit 地址低位', 'cyan', hex(extract(dw[3], 31, 2), 8)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
      ...dataPayload(dw.slice(4), extract(dw[0], 9, 0)),
    ],
  },

  // ---- Configuration Read / Write Type 0 ----
  {
    id: 'cfgr0',
    title: 'Configuration Read Request Type 0',
    subtitle: '3DW Header，访问 Endpoint 配置空间',
    badge: 'CfgRd0',
    match: (fmt, typeVal) => fmt === 0 && typeVal === 4,
    decode: (dw) => [
      { name: 'DW 0', fields: [
        field('Fmt', 31, 29, '3DW, no data', 'blue', fmtLabel(extract(dw[0], 31, 29))),
        field('Type', 28, 24, 'Config Type 0', 'purple', typeLabel(extract(dw[0], 28, 24))),
        field('Reserved', 23, 10, '保留位', 'slate'),
        field('Length', 9, 0, '通常为 1DW', 'indigo', hex(extract(dw[0], 9, 0), 3)),
      ]},
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('Completer ID', 31, 16, '目标设备 BDF', 'blue', bdf(extract(dw[2], 31, 16))),
        field('Reserved', 15, 12, '', 'slate'),
        field('Ext Reg', 11, 8, '扩展配置空间寄存器号高位', 'rose', hex(extract(dw[2], 11, 8), 1)),
        field('Register Number', 7, 2, '配置空间 DW 偏移', 'cyan', hex(extract(dw[2], 7, 2), 2)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
    ],
  },

  {
    id: 'cfgw0',
    title: 'Configuration Write Request Type 0',
    subtitle: '3DW Header + 1DW Data，写入 Endpoint 配置空间',
    badge: 'CfgWr0',
    match: (fmt, typeVal) => fmt === 2 && typeVal === 4,
    decode: (dw) => [
      { name: 'DW 0', fields: [
        field('Fmt', 31, 29, '3DW, with data', 'blue', fmtLabel(extract(dw[0], 31, 29))),
        field('Type', 28, 24, 'Config Type 0', 'purple', typeLabel(extract(dw[0], 28, 24))),
        field('Reserved', 23, 10, '保留位', 'slate'),
        field('Length', 9, 0, '通常为 1DW', 'indigo', hex(extract(dw[0], 9, 0), 3)),
      ]},
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('Completer ID', 31, 16, '目标设备 BDF', 'blue', bdf(extract(dw[2], 31, 16))),
        field('Reserved', 15, 12, '', 'slate'),
        field('Ext Reg', 11, 8, '扩展配置空间寄存器号高位', 'rose', hex(extract(dw[2], 11, 8), 1)),
        field('Register Number', 7, 2, '配置空间 DW 偏移', 'cyan', hex(extract(dw[2], 7, 2), 2)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
      ...(dw.length > 3 ? [{ name: 'Data', fields: [field('Write Data', 31, 0, '写入配置空间的数据', 'rose', hex(dw[3], 8))] }] : []),
    ],
  },

  // ---- Configuration Read / Write Type 1 ----
  {
    id: 'cfgr1',
    title: 'Configuration Read Request Type 1',
    subtitle: '3DW Header，访问 Switch / Bridge 下游设备',
    badge: 'CfgRd1',
    match: (fmt, typeVal) => fmt === 0 && typeVal === 5,
    decode: (dw) => [
      { name: 'DW 0', fields: [
        field('Fmt', 31, 29, '3DW, no data', 'blue', fmtLabel(extract(dw[0], 31, 29))),
        field('Type', 28, 24, 'Config Type 1', 'purple', typeLabel(extract(dw[0], 28, 24))),
        field('Reserved', 23, 10, '保留位', 'slate'),
        field('Length', 9, 0, '通常为 1DW', 'indigo', hex(extract(dw[0], 9, 0), 3)),
      ]},
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('Completer ID', 31, 16, '目标设备 BDF', 'blue', bdf(extract(dw[2], 31, 16))),
        field('Reserved', 15, 12, '', 'slate'),
        field('Ext Reg', 11, 8, '扩展配置空间寄存器号高位', 'rose', hex(extract(dw[2], 11, 8), 1)),
        field('Register Number', 7, 2, '配置空间 DW 偏移', 'cyan', hex(extract(dw[2], 7, 2), 2)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
    ],
  },

  {
    id: 'cfgw1',
    title: 'Configuration Write Request Type 1',
    subtitle: '3DW Header + 1DW Data，写入 Switch / Bridge 下游设备',
    badge: 'CfgWr1',
    match: (fmt, typeVal) => fmt === 2 && typeVal === 5,
    decode: (dw) => [
      { name: 'DW 0', fields: [
        field('Fmt', 31, 29, '3DW, with data', 'blue', fmtLabel(extract(dw[0], 31, 29))),
        field('Type', 28, 24, 'Config Type 1', 'purple', typeLabel(extract(dw[0], 28, 24))),
        field('Reserved', 23, 10, '保留位', 'slate'),
        field('Length', 9, 0, '通常为 1DW', 'indigo', hex(extract(dw[0], 9, 0), 3)),
      ]},
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('Completer ID', 31, 16, '目标设备 BDF', 'blue', bdf(extract(dw[2], 31, 16))),
        field('Reserved', 15, 12, '', 'slate'),
        field('Ext Reg', 11, 8, '扩展配置空间寄存器号高位', 'rose', hex(extract(dw[2], 11, 8), 1)),
        field('Register Number', 7, 2, '配置空间 DW 偏移', 'cyan', hex(extract(dw[2], 7, 2), 2)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
      ...(dw.length > 3 ? [{ name: 'Data', fields: [field('Write Data', 31, 0, '写入配置空间的数据', 'rose', hex(dw[3], 8))] }] : []),
    ],
  },

  // ---- Completion / Completion with Data ----
  {
    id: 'cpl',
    title: 'Completion without Data',
    subtitle: '3DW Header，返回请求完成状态，无数据',
    badge: 'Cpl',
    match: (fmt, typeVal) => fmt === 0 && typeVal === 10,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0Completion(dw[0]) },
      { name: 'DW 1', fields: [
        field('Completer ID', 31, 16, '返回 Completion 的设备 BDF', 'blue', bdf(extract(dw[1], 31, 16))),
        field('Status', 15, 13, 'Completion 状态', 'red', statusLabel(extract(dw[1], 15, 13))),
        field('BCM', 12, 12, 'Byte Count Modified', 'rose', `${extract(dw[1], 12, 12)}`),
        field('Byte Count', 11, 0, '剩余字节计数', 'cyan', hex(extract(dw[1], 11, 0), 3)),
      ]},
      { name: 'DW 2', fields: [
        field('Requester ID', 31, 16, '原始请求者 BDF', 'blue', bdf(extract(dw[2], 31, 16))),
        field('Tag', 15, 8, '匹配原始 Request Tag', 'purple', hex(extract(dw[2], 15, 8), 2)),
        field('Reserved', 7, 7, '', 'slate'),
        field('Lower Address', 6, 0, '首个有效字节低地址', 'green', hex(extract(dw[2], 6, 0), 2)),
      ]},
    ],
  },

  {
    id: 'cpld',
    title: 'Completion with Data',
    subtitle: '3DW Header，返回数据负载',
    badge: 'CplD',
    match: (fmt, typeVal) => fmt === 2 && typeVal === 10,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0Completion(dw[0]) },
      { name: 'DW 1', fields: [
        field('Completer ID', 31, 16, '返回 Completion 的设备 BDF', 'blue', bdf(extract(dw[1], 31, 16))),
        field('Status', 15, 13, 'Completion 状态', 'red', statusLabel(extract(dw[1], 15, 13))),
        field('BCM', 12, 12, 'Byte Count Modified', 'rose', `${extract(dw[1], 12, 12)}`),
        field('Byte Count', 11, 0, '剩余字节计数', 'cyan', hex(extract(dw[1], 11, 0), 3)),
      ]},
      { name: 'DW 2', fields: [
        field('Requester ID', 31, 16, '原始请求者 BDF', 'blue', bdf(extract(dw[2], 31, 16))),
        field('Tag', 15, 8, '匹配原始 Request Tag', 'purple', hex(extract(dw[2], 15, 8), 2)),
        field('Reserved', 7, 7, '', 'slate'),
        field('Lower Address', 6, 0, '首个有效字节低地址', 'green', hex(extract(dw[2], 6, 0), 2)),
      ]},
      ...dataPayload(dw.slice(3), extract(dw[0], 9, 0)),
    ],
  },

  // ---- I/O Read / Write ----
  {
    id: 'iord',
    title: 'I/O Read Request',
    subtitle: '3DW Header，访问 I/O 空间',
    badge: 'IORd',
    match: (fmt, typeVal) => fmt === 0 && typeVal === 2,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0MemIO(dw[0]) },
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('I/O Address[31:2]', 31, 2, '32-bit I/O 地址', 'cyan', hex(extract(dw[2], 31, 2), 8)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
    ],
  },

  {
    id: 'iowr',
    title: 'I/O Write Request',
    subtitle: '3DW Header + 1DW Data，写入 I/O 空间',
    badge: 'IOWr',
    match: (fmt, typeVal) => fmt === 2 && typeVal === 2,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0MemIO(dw[0]) },
      { name: 'DW 1', fields: dw1Request(dw[1]) },
      { name: 'DW 2', fields: [
        field('I/O Address[31:2]', 31, 2, '32-bit I/O 地址', 'cyan', hex(extract(dw[2], 31, 2), 8)),
        field('Reserved', 1, 0, '', 'slate'),
      ]},
      ...(dw.length > 3 ? [{ name: 'Data', fields: [field('Write Data', 31, 0, 'I/O 写入数据', 'rose', hex(dw[3], 8))] }] : []),
    ],
  },

  // ---- Message Request ----
  {
    id: 'msg',
    title: 'Message Request',
    subtitle: '4DW Header，无数据负载，用于边带信令',
    badge: 'Msg',
    match: (fmt, typeVal) => fmt === 1 && (typeVal >>> 3) === 2,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0Message(dw[0]) },
      { name: 'DW 1', fields: [
        field('Requester ID', 31, 16, '消息发起者 BDF', 'blue', bdf(extract(dw[1], 31, 16))),
        field('Tag', 15, 8, '消息 Tag', 'purple', hex(extract(dw[1], 15, 8), 2)),
        field('Message Code', 7, 0, '消息代码', 'amber', hex(extract(dw[1], 7, 0), 2)),
      ]},
      { name: 'DW 2', fields: [field('Message Payload / Reserved', 31, 0, '消息特定数据', 'slate', hex(dw[2], 8))] },
      { name: 'DW 3', fields: [field('Message Payload / Reserved', 31, 0, '消息特定数据', 'slate', hex(dw[3], 8))] },
    ],
  },

  {
    id: 'msgd',
    title: 'Message Request with Data',
    subtitle: '4DW Header + Data，携带数据负载的消息',
    badge: 'MsgD',
    match: (fmt, typeVal) => fmt === 3 && (typeVal >>> 3) === 2,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0Message(dw[0]) },
      { name: 'DW 1', fields: [
        field('Requester ID', 31, 16, '消息发起者 BDF', 'blue', bdf(extract(dw[1], 31, 16))),
        field('Tag', 15, 8, '消息 Tag', 'purple', hex(extract(dw[1], 15, 8), 2)),
        field('Message Code', 7, 0, '消息代码', 'amber', hex(extract(dw[1], 7, 0), 2)),
      ]},
      { name: 'DW 2', fields: [field('Message Payload / Reserved', 31, 0, '消息特定数据', 'slate', hex(dw[2], 8))] },
      { name: 'DW 3', fields: [field('Message Payload / Reserved', 31, 0, '消息特定数据', 'slate', hex(dw[3], 8))] },
      ...dataPayload(dw.slice(4), extract(dw[0], 9, 0)),
    ],
  },

  // ---- Completion Locked ----
  {
    id: 'cpllk',
    title: 'Completion for Locked Request',
    subtitle: '3DW Header，锁定事务的完成响应',
    badge: 'CplLk',
    match: (fmt, typeVal) => fmt === 0 && typeVal === 11,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0Completion(dw[0]) },
      { name: 'DW 1', fields: [
        field('Completer ID', 31, 16, '返回 Completion 的设备 BDF', 'blue', bdf(extract(dw[1], 31, 16))),
        field('Status', 15, 13, 'Completion 状态', 'red', statusLabel(extract(dw[1], 15, 13))),
        field('BCM', 12, 12, 'Byte Count Modified', 'rose', `${extract(dw[1], 12, 12)}`),
        field('Byte Count', 11, 0, '剩余字节计数', 'cyan', hex(extract(dw[1], 11, 0), 3)),
      ]},
      { name: 'DW 2', fields: [
        field('Requester ID', 31, 16, '原始请求者 BDF', 'blue', bdf(extract(dw[2], 31, 16))),
        field('Tag', 15, 8, '匹配原始 Request Tag', 'purple', hex(extract(dw[2], 15, 8), 2)),
        field('Reserved', 7, 7, '', 'slate'),
        field('Lower Address', 6, 0, '首个有效字节低地址', 'green', hex(extract(dw[2], 6, 0), 2)),
      ]},
    ],
  },
]

// ============================================================
// FLIT 模式 TLP 类型注册表（PCIe 6.0+）
// 8-bit Packet Type 参考: PCIe 6.0 Base Spec Section 2.2 + rtlp-lib
// 添加新的 FLIT 类型：在此数组中追加一个 FlitTlpTypeDef 对象。
// ============================================================

const flitTlpTypes: FlitTlpTypeDef[] = [

  // ---- NOP (1DW) ----
  {
    id: 'flit-nop',
    title: 'NOP TLP',
    subtitle: '1 DW Base Header，最小 FLIT 填充对象',
    badge: 'NOP (0x00)',
    opcode: 0x00,
    match: (pktType) => pktType === 0x00,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0Flit(dw[0], ' — NOP') },
    ],
  },

  // ---- Memory Read 32-bit (3DW base) ----
  {
    id: 'flit-mrd32',
    title: 'Memory Read Request (32-bit) — FLIT',
    subtitle: '3 DW Base Header，32-bit 地址，无数据负载',
    badge: 'MRd32 (0x03)',
    opcode: 0x03,
    match: (pktType) => pktType === 0x03,
    decode: (dw) => {
      const ohc = extract(dw[0], 20, 16)
      const words: TlpWord[] = [
        { name: 'DW 0', fields: dw0Flit(dw[0]) },
        { name: 'DW 1', fields: dw1FlitReq(dw[1]) },
        { name: 'DW 2', fields: [
          field('Address[31:2]', 31, 2, '32-bit 目标地址高位', 'cyan', hex(extract(dw[2], 31, 2), 8)),
          field('Reserved', 1, 0, '', 'slate'),
        ]},
      ]
      if (ohc & 0x01 && dw.length > 3) words.push(decodeOhcA(dw[3], 'A1: Byte Enable / PASID'))
      return words
    },
  },

  // ---- Memory Write 32-bit (3DW base + data) ----
  {
    id: 'flit-mwr32',
    title: 'Memory Write Request (32-bit) — FLIT',
    subtitle: '3 DW Base Header，32-bit 地址，携带数据负载',
    badge: 'MWr32 (0x40)',
    opcode: 0x40,
    match: (pktType) => pktType === 0x40,
    decode: (dw) => {
      const ohc = extract(dw[0], 20, 16)
      let nextDw = 3
      const words: TlpWord[] = [
        { name: 'DW 0', fields: dw0Flit(dw[0]) },
        { name: 'DW 1', fields: dw1FlitReq(dw[1]) },
        { name: 'DW 2', fields: [
          field('Address[31:2]', 31, 2, '32-bit 目标地址高位', 'cyan', hex(extract(dw[2], 31, 2), 8)),
          field('Reserved', 1, 0, '', 'slate'),
        ]},
      ]
      if (ohc & 0x01 && dw.length > nextDw) { words.push(decodeOhcA(dw[nextDw], 'A1: BE/PASID')); nextDw++ }
      if (dw.length > nextDw) words.push(...dataPayload(dw.slice(nextDw), extract(dw[0], 9, 0)))
      return words
    },
  },

  // ---- UIO Memory Read (64-bit, 4DW base, PCIe 6.1+) ----
  {
    id: 'flit-uiomrd',
    title: 'UIO Memory Read (64-bit) — FLIT',
    subtitle: '4 DW Base Header，64-bit 地址，PCIe 6.1+ UIO',
    badge: 'UIO MRd (0x22)',
    opcode: 0x22,
    match: (pktType) => pktType === 0x22,
    decode: (dw) => {
      const ohc = extract(dw[0], 20, 16)
      let nextDw = 4
      const words: TlpWord[] = [
        { name: 'DW 0', fields: dw0Flit(dw[0]) },
        { name: 'DW 1', fields: dw1FlitReq(dw[1]) },
        { name: 'DW 2', fields: [field('Address[63:32]', 31, 0, '64-bit 地址高 32 位', 'cyan', hex(dw[2], 8))] },
        { name: 'DW 3', fields: [
          field('Address[31:2]', 31, 2, '64-bit 地址低位', 'cyan', hex(extract(dw[3], 31, 2), 8)),
          field('Reserved', 1, 0, '', 'slate'),
        ]},
      ]
      if (ohc & 0x01 && dw.length > nextDw) { words.push(decodeOhcA(dw[nextDw], 'A1: BE/PASID')); nextDw++ }
      return words
    },
  },

  // ---- UIO Memory Write (64-bit, 4DW base + data, PCIe 6.1+) ----
  {
    id: 'flit-uiomwr',
    title: 'UIO Memory Write (64-bit) — FLIT',
    subtitle: '4 DW Base Header，64-bit 地址，PCIe 6.1+ UIO',
    badge: 'UIO MWr (0x61)',
    opcode: 0x61,
    match: (pktType) => pktType === 0x61,
    decode: (dw) => {
      const ohc = extract(dw[0], 20, 16)
      let nextDw = 4
      const words: TlpWord[] = [
        { name: 'DW 0', fields: dw0Flit(dw[0]) },
        { name: 'DW 1', fields: dw1FlitReq(dw[1]) },
        { name: 'DW 2', fields: [field('Address[63:32]', 31, 0, '64-bit 地址高 32 位', 'cyan', hex(dw[2], 8))] },
        { name: 'DW 3', fields: [
          field('Address[31:2]', 31, 2, '64-bit 地址低位', 'cyan', hex(extract(dw[3], 31, 2), 8)),
          field('Reserved', 1, 0, '', 'slate'),
        ]},
      ]
      if (ohc & 0x01 && dw.length > nextDw) { words.push(decodeOhcA(dw[nextDw], 'A1: BE/PASID')); nextDw++ }
      if (dw.length > nextDw) words.push(...dataPayload(dw.slice(nextDw), extract(dw[0], 9, 0)))
      return words
    },
  },

  // ---- I/O Write (3DW base + OHC-A2 mandatory) ----
  {
    id: 'flit-iowr',
    title: 'I/O Write Request — FLIT',
    subtitle: '3 DW Base Header + 1DW Data + 强制 OHC-A2',
    badge: 'IOWr (0x42)',
    opcode: 0x42,
    match: (pktType) => pktType === 0x42,
    decode: (dw) => {
      let nextDw = 3
      const words: TlpWord[] = [
        { name: 'DW 0', fields: dw0Flit(dw[0]) },
        { name: 'DW 1', fields: dw1FlitReq(dw[1]) },
        { name: 'DW 2', fields: [
          field('I/O Address[31:2]', 31, 2, 'I/O 地址', 'cyan', hex(extract(dw[2], 31, 2), 8)),
          field('Reserved', 1, 0, '', 'slate'),
        ]},
      ]
      if (dw.length > nextDw) { words.push(decodeOhcA(dw[nextDw], 'A2: I/O 必选')); nextDw++ }
      if (dw.length > nextDw) words.push({ name: 'Data', fields: [field('Write Data', 31, 0, 'I/O 写入数据', 'rose', hex(dw[nextDw], 8))] })
      return words
    },
  },

  // ---- Cfg Write Type 0 (3DW base + OHC-A3 mandatory) ----
  {
    id: 'flit-cfgw0',
    title: 'Configuration Write Type 0 — FLIT',
    subtitle: '3 DW Base Header + 1DW Data + 强制 OHC-A3',
    badge: 'CfgWr0 (0x44)',
    opcode: 0x44,
    match: (pktType) => pktType === 0x44,
    decode: (dw) => {
      let nextDw = 3
      const words: TlpWord[] = [
        { name: 'DW 0', fields: dw0Flit(dw[0]) },
        { name: 'DW 1', fields: dw1FlitReq(dw[1]) },
        { name: 'DW 2', fields: [
          field('Completer ID', 31, 16, '目标设备 BDF', 'blue', bdf(extract(dw[2], 31, 16))),
          field('Ext Reg', 15, 8, '扩展配置寄存器号', 'rose', hex(extract(dw[2], 15, 8), 2)),
          field('Register', 7, 2, '配置空间 DW 偏移', 'cyan', hex(extract(dw[2], 7, 2), 2)),
          field('Reserved', 1, 0, '', 'slate'),
        ]},
      ]
      if (dw.length > nextDw) { words.push(decodeOhcA(dw[nextDw], 'A3: Cfg 必选')); nextDw++ }
      if (dw.length > nextDw) words.push({ name: 'Data', fields: [field('Write Data', 31, 0, '配置写入数据', 'rose', hex(dw[nextDw], 8))] })
      return words
    },
  },

  // ---- FetchAdd AtomicOp (32-bit) ----
  {
    id: 'flit-fetchadd32',
    title: 'FetchAdd AtomicOp (32-bit) — FLIT',
    subtitle: '3 DW Base Header + 1DW Operand + 强制 OHC-A1',
    badge: 'FetchAdd (0x4C)',
    opcode: 0x4C,
    match: (pktType) => pktType === 0x4C,
    decode: (dw) => {
      let nextDw = 3
      const words: TlpWord[] = [
        { name: 'DW 0', fields: dw0Flit(dw[0]) },
        { name: 'DW 1', fields: dw1FlitReq(dw[1]) },
        { name: 'DW 2', fields: [
          field('Address[31:2]', 31, 2, '目标地址', 'cyan', hex(extract(dw[2], 31, 2), 8)),
          field('Reserved', 1, 0, '', 'slate'),
        ]},
      ]
      if (dw.length > nextDw) { words.push(decodeOhcA(dw[nextDw], 'A1: BE/PASID')); nextDw++ }
      if (dw.length > nextDw) words.push({ name: 'Data', fields: [field('Operand', 31, 0, 'Atomic 操作数', 'rose', hex(dw[nextDw], 8))] })
      return words
    },
  },

  // ---- CompareSwap AtomicOp (32-bit) ----
  {
    id: 'flit-cmpswap32',
    title: 'CompareSwap AtomicOp (32-bit) — FLIT',
    subtitle: '3 DW Base Header + 2DW (Compare + Swap) + 强制 OHC-A1',
    badge: 'CmpSwap (0x4E)',
    opcode: 0x4E,
    match: (pktType) => pktType === 0x4E,
    decode: (dw) => {
      let nextDw = 3
      const words: TlpWord[] = [
        { name: 'DW 0', fields: dw0Flit(dw[0]) },
        { name: 'DW 1', fields: dw1FlitReq(dw[1]) },
        { name: 'DW 2', fields: [
          field('Address[31:2]', 31, 2, '目标地址', 'cyan', hex(extract(dw[2], 31, 2), 8)),
          field('Reserved', 1, 0, '', 'slate'),
        ]},
      ]
      if (dw.length > nextDw) { words.push(decodeOhcA(dw[nextDw], 'A1: BE/PASID')); nextDw++ }
      if (dw.length > nextDw) words.push({ name: 'Data', fields: [field('Compare Value', 31, 0, '比较值', 'rose', hex(dw[nextDw], 8))] }); nextDw++
      if (dw.length > nextDw) words.push({ name: 'Data', fields: [field('Swap Value', 31, 0, '交换值', 'amber', hex(dw[nextDw], 8))] })
      return words
    },
  },

  // ---- Deferrable Memory Write (32-bit) ----
  {
    id: 'flit-dmw32',
    title: 'Deferrable Memory Write (32-bit) — FLIT',
    subtitle: '3 DW Base Header，可延迟写入',
    badge: 'DMWr32 (0x5B)',
    opcode: 0x5B,
    match: (pktType) => pktType === 0x5B,
    decode: (dw) => {
      const ohc = extract(dw[0], 20, 16)
      let nextDw = 3
      const words: TlpWord[] = [
        { name: 'DW 0', fields: dw0Flit(dw[0]) },
        { name: 'DW 1', fields: dw1FlitReq(dw[1]) },
        { name: 'DW 2', fields: [
          field('Address[31:2]', 31, 2, '目标地址', 'cyan', hex(extract(dw[2], 31, 2), 8)),
          field('Reserved', 1, 0, '', 'slate'),
        ]},
      ]
      if (ohc & 0x01 && dw.length > nextDw) { words.push(decodeOhcA(dw[nextDw], 'A1: BE/PASID')); nextDw++ }
      if (dw.length > nextDw) words.push(...dataPayload(dw.slice(nextDw), extract(dw[0], 9, 0)))
      return words
    },
  },

  // ---- Message to RC ----
  {
    id: 'flit-msgtorc',
    title: 'Message to Root Complex — FLIT',
    subtitle: '消息路由至 RC，无数据负载',
    badge: 'MsgToRC (0x30)',
    opcode: 0x30,
    match: (pktType) => pktType === 0x30,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0Flit(dw[0]) },
      { name: 'DW 1', fields: [
        field('Requester ID', 31, 16, '消息发起者 BDF', 'blue', bdf(extract(dw[1], 31, 16))),
        field('Message Code', 15, 8, '消息代码', 'amber', hex(extract(dw[1], 15, 8), 2)),
        field('Reserved', 7, 0, '', 'slate'),
      ]},
      { name: 'DW 2', fields: [field('Msg Payload', 31, 0, '消息特定数据', 'slate', hex(dw[2], 8))] },
      { name: 'DW 3', fields: [field('Msg Payload', 31, 0, '消息特定数据', 'slate', hex(dw[3], 8))] },
    ],
  },

  // ---- Message with Data to RC ----
  {
    id: 'flit-msgdtorc',
    title: 'Message with Data to Root Complex — FLIT',
    subtitle: '消息路由至 RC，携带数据负载',
    badge: 'MsgDToRC (0x70)',
    opcode: 0x70,
    match: (pktType) => pktType === 0x70,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0Flit(dw[0]) },
      { name: 'DW 1', fields: [
        field('Requester ID', 31, 16, '消息发起者 BDF', 'blue', bdf(extract(dw[1], 31, 16))),
        field('Message Code', 15, 8, '消息代码', 'amber', hex(extract(dw[1], 15, 8), 2)),
        field('Reserved', 7, 0, '', 'slate'),
      ]},
      { name: 'DW 2', fields: [field('Msg Payload', 31, 0, '消息特定数据', 'slate', hex(dw[2], 8))] },
      { name: 'DW 3', fields: [field('Msg Payload', 31, 0, '消息特定数据', 'slate', hex(dw[3], 8))] },
      ...dataPayload(dw.slice(4), extract(dw[0], 9, 0)),
    ],
  },

  // ---- Local TLP Prefix (1DW) ----
  {
    id: 'flit-ltp',
    title: 'Local TLP Prefix Token — FLIT',
    subtitle: '1 DW Base Header，FLIT 本地前缀标记',
    badge: 'LTP (0x8D)',
    opcode: 0x8D,
    match: (pktType) => pktType === 0x8D,
    decode: (dw) => [
      { name: 'DW 0', fields: dw0Flit(dw[0], ' — Local TLP Prefix') },
    ],
  },
]
function dw0Message(dw0: number): TlpField[] {
  const fmt = extract(dw0, 31, 29)
  const typ = extract(dw0, 28, 24)
  return [
    field('Fmt', 31, 29, '4DW Header', 'blue', fmtLabel(fmt)),
    field('Type', 28, 24, 'Message', 'purple', typeLabel(typ)),
    field('TC', 22, 20, 'Traffic Class', 'green', `${extract(dw0, 22, 20)}`),
    field('Reserved', 19, 17, '保留位', 'slate'),
    field('TH', 16, 16, 'TLP Processing Hints', 'rose', `${extract(dw0, 16, 16)}`),
    field('TD', 15, 15, 'TLP Digest', 'cyan', `${extract(dw0, 15, 15)}`),
    field('EP', 14, 14, 'Poisoned TLP', 'red', `${extract(dw0, 14, 14)}`),
    field('Attr', 13, 12, '消息属性', 'amber', extract(dw0, 13, 12).toString(2).padStart(2, '0')),
    field('AT', 11, 10, 'Address Type', 'slate', extract(dw0, 11, 10).toString(2).padStart(2, '0')),
    field('Length', 9, 0, 'Payload 长度 (DW)', 'indigo', hex(extract(dw0, 9, 0), 3)),
  ]
}

// ---- Data payload fields ----
function dataPayload(dwList: number[], length: number): TlpWord[] {
  if (!dwList.length) return []
  const words: TlpWord[] = []
  const show = Math.min(dwList.length, Math.max(length, 4))
  for (let i = 0; i < show; i++) {
    words.push({ name: `Data[${i}]`, fields: [field(`Payload DW ${i}`, 31, 0, `数据负载第 ${i} 个 DW`, 'rose', hex(dwList[i], 8))] })
  }
  return words
}

// ============================================================
// 解析引擎
// ============================================================

const hexInput = ref('')
const result = ref<TlpResult | null>(null)
const error = ref('')
const showRaw = ref(false)
const tlpMode = ref<'non-flit' | 'flit'>('non-flit')

function parseHexInput(raw: string): number[] {
  const cleaned = raw.replace(/[^0-9a-fA-F]/g, '')
  if (cleaned.length === 0) throw new Error('输入为空')
  if (cleaned.length % 8 !== 0) throw new Error(`十六进制长度不是 DW 的整数倍（当前 ${cleaned.length} 个半字节，应输入 8 的倍数）`)

  const dw: number[] = []
  for (let i = 0; i < cleaned.length; i += 8) {
    dw.push(parseInt(cleaned.substring(i, i + 8), 16))
  }
  return dw
}

function parse() {
  error.value = ''
  result.value = null
  try {
    const dw = parseHexInput(hexInput.value.trim())
    const dw0 = dw[0]

    if (tlpMode.value === 'flit') {
      // ---- FLIT 模式：8-bit Packet Type 匹配 ----
      const pktType = extract(dw0, 31, 24)
      if (dw.length < 1) {
        error.value = 'FLIT 模式至少需要 1 个 DW'
        return
      }
      for (const def of flitTlpTypes) {
        if (def.match(pktType, dw.length)) {
          result.value = {
            id: def.id,
            title: def.title,
            subtitle: def.subtitle,
            badge: def.badge,
            words: def.decode(dw),
            dwHex: dw.map((d) => hex(d, 8)),
          }
          return
        }
      }
      error.value = `未找到匹配的 FLIT TLP 类型（Packet Type=${pktTypeLabel(pktType)}）。请确认输入的十六进制数据正确，或考虑在 flitTlpTypes 注册表中添加此类型。`
    } else {
      // ---- 非 FLIT 模式：Fmt + Type 匹配 ----
      if (dw.length < 3) {
        error.value = 'TLP Header 至少需要 3 个 DW（96 bits），请检查输入'
        return
      }
      const fmt = extract(dw0, 31, 29)
      const typeVal = extract(dw0, 28, 24)

      for (const def of tlpTypes) {
        if (def.match(fmt, typeVal, dw.length)) {
          result.value = {
            id: def.id,
            title: def.title,
            subtitle: def.subtitle,
            badge: def.badge,
            words: def.decode(dw),
            dwHex: dw.map((d) => hex(d, 8)),
          }
          return
        }
      }
      error.value = `未找到匹配的 TLP 类型（Fmt=${fmtLabel(fmt)}, Type=${typeLabel(typeVal)}）。请确认输入的十六进制数据正确，或考虑在类型注册表中添加此类型。`
    }
  } catch (e: any) {
    error.value = e.message ?? '解析失败'
  }
}

function switchMode(mode: 'non-flit' | 'flit') {
  tlpMode.value = mode
  result.value = null
  error.value = ''
}

function clear() {
  hexInput.value = ''
  result.value = null
  error.value = ''
}

// ============================================================
// 示例数据
// ============================================================

const examples = [
  { label: 'MRd(32)', hex: '00000001 0000000F 00000000' },
  { label: 'MWr(32)', hex: '40000001 0000000F 00000000 DEADBEEF' },
  { label: 'MRd(64)', hex: '20000001 0000000F 00000000 00000000' },
  { label: 'MWr(64)', hex: '60000001 0000000F 00000000 00000000 CAFEBABE' },
  { label: 'CfgRd0', hex: '00000004 00000000 00000000' },
  { label: 'CfgWr0', hex: '40000004 00000000 00000000 12345678' },
  { label: 'CfgRd1', hex: '00000005 00000000 00000000' },
  { label: 'Cpl', hex: '0000000A 01000004 00000100' },
  { label: 'CplD', hex: '4A000001 01000004 00000100 00000000 DEADBEEF' },
  { label: 'Msg', hex: '20000030 00000000 00000000 00000000' },
  { label: 'IORd', hex: '00000002 00000000 00000000' },
  { label: 'IOWr', hex: '40000002 00000000 00000000 DEADBEEF' },
]

const flitExamples = [
  { label: 'MRd32', hex: '03000001 0000000F 00000000' },
  { label: 'MWr32', hex: '40004001 0000000F 00000000 DEADBEEF' },
  { label: 'UIO MRd', hex: '22002001 0000000F 00000000 00000001' },
  { label: 'UIO MWr', hex: '61006001 0000000F 00000000 00000001 CAFEBABE' },
  { label: 'IOWr', hex: '42000001 0000000F 00000000 A2000000 DEADBEEF' },
  { label: 'CfgWr0', hex: '44000001 0000000F 00000000 A3000000 12345678' },
  { label: 'FetchAdd', hex: '4C000001 0000000F 00000000 A1000001 00000005' },
  { label: 'CmpSwap', hex: '4E000002 0000000F 00000100 A1000001 00000003 00000007' },
  { label: 'MsgToRC', hex: '30000001 00000000 00000000 00000000' },
  { label: 'MsgDToRC', hex: '70000001 00000000 00000000 00000000 DEADBEEF' },
  { label: 'NOP', hex: '00000000' },
  { label: 'LTP', hex: '8D000000' },
]

function loadExample(ex: { label: string; hex: string }) {
  hexInput.value = ex.hex
  parse()
}

// ============================================================
// 显示辅助（复用 PcieTlpExplorer 的样式）
// ============================================================

const bitColumns = Array.from({ length: 32 }, (_, i) => 31 - i)

function widthStyle(f: TlpField) {
  const [msb, lsb] = f.bits
  return { gridColumn: `${32 - msb} / span ${msb - lsb + 1}` }
}

function bitRange(f: TlpField) {
  const [msb, lsb] = f.bits
  return msb === lsb ? `bit ${msb}` : `bits ${msb}:${lsb}`
}
</script>

<template>
  <section class="tlp-parser" aria-label="TLP 数据包解析器">

    <!-- 模式切换 -->
    <div class="parser-mode-bar">
      <button
        class="parser-mode-btn"
        :class="{ 'parser-mode-btn--active': tlpMode === 'non-flit' }"
        @click="switchMode('non-flit')"
      >Non-FLIT 模式 (PCIe 1.0~5.0)</button>
      <button
        class="parser-mode-btn"
        :class="{ 'parser-mode-btn--active': tlpMode === 'flit' }"
        @click="switchMode('flit')"
      >FLIT 模式 (PCIe 6.0+)</button>
    </div>

    <!-- 输入区域 -->
    <div class="parser-input-area">
      <label class="parser-label" for="tlp-hex-input">
        <template v-if="tlpMode === 'flit'">
          输入 FLIT TLP 十六进制数据（DW0[31:24] 为 8-bit Packet Type 操作码）
        </template>
        <template v-else>
          输入 TLP 十六进制数据（每 8 位十六进制字符为一个 DW，可用空格/换行分隔）
        </template>
      </label>
      <textarea
        id="tlp-hex-input"
        v-model="hexInput"
        class="parser-textarea"
        rows="4"
        :placeholder="tlpMode === 'flit' ? '例如：03000001 0000000F 00000000' : '例如：40000001 0000000F 00000000 DEADBEEF'"
        spellcheck="false"
        @keydown.ctrl.enter="parse"
      ></textarea>
      <div class="parser-actions">
        <button class="parser-btn parser-btn--parse" @click="parse">解析</button>
        <button class="parser-btn parser-btn--clear" @click="clear">清空</button>
        <span class="parser-hint">Ctrl + Enter 快捷解析</span>
        <span v-if="tlpMode === 'flit'" class="parser-mode-hint">FLIT: DW0[31:24] = 8-bit Opcode</span>
      </div>

      <!-- 示例按钮 -->
      <div class="parser-examples">
        <span class="parser-examples__label">快速示例：</span>
        <button
          v-for="ex in (tlpMode === 'flit' ? flitExamples : examples)"
          :key="ex.label"
          class="parser-btn parser-btn--example"
          :class="{ 'parser-btn--example--flit': tlpMode === 'flit' }"
          @click="loadExample(ex)"
        >{{ ex.label }}</button>
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="parser-error" role="alert">{{ error }}</div>

    <!-- 解析结果 -->
    <article v-if="result" :id="result.id" class="tlp-card">
      <header class="tlp-card__header">
        <div>
          <span class="tlp-card__badge">{{ result.badge }}</span>
          <h2>{{ result.title }}</h2>
          <p>{{ result.subtitle }}</p>
        </div>
        <button class="parser-raw-toggle" @click="showRaw = !showRaw">
          {{ showRaw ? '隐藏' : '显示' }}原始 DW 值
        </button>
      </header>

      <!-- 原始 DW 值 -->
      <div v-if="showRaw" class="parser-raw-dw">
        <span v-for="(h, i) in result.dwHex" :key="i" class="parser-raw-dw__item">
          DW{{ i }}: <code>{{ h }}</code>
        </span>
      </div>

      <!-- TLP 字段网格（复用 PcieTlpExplorer 的 CSS 类） -->
      <div class="tlp-map" role="table" :aria-label="result.title">
        <div class="tlp-bit-axis" role="row" aria-hidden="true">
          <span class="tlp-axis-spacer"></span>
          <span v-for="bit in bitColumns" :key="bit">{{ bit }}</span>
        </div>

        <div class="tlp-words">
          <div v-for="word in result.words" :key="`${result.id}-${word.name}`" class="tlp-word" role="row">
            <div class="tlp-word__name" role="rowheader">{{ word.name }}</div>
            <div class="tlp-word__bits" role="cell">
              <div
                v-for="f in word.fields"
                :key="`${result.id}-${word.name}-${f.label}-${f.bits.join('-')}`"
                class="tlp-field"
                :class="`tlp-field--${f.color}`"
                :style="widthStyle(f)"
                :title="`${word.name} ${bitRange(f)}：${f.description}${f.value ? ' → ' + f.value : ''}`"
              >
                <strong>{{ f.label }}</strong>
                <small>{{ bitRange(f) }}</small>
                <span v-if="f.value" class="tlp-field__value">{{ f.value }}</span>
                <span v-if="f.description">{{ f.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

  </section>
</template>

<style scoped>
/* --- 模式切换 --- */
.parser-mode-bar {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  width: fit-content;
}

.parser-mode-btn {
  padding: 8px 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: none;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s;
}

.parser-mode-btn:first-child { border-right: 1px solid var(--vp-c-divider); }

.parser-mode-btn:hover { color: var(--vp-c-brand); }

.parser-mode-btn--active {
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
}

.parser-mode-btn--active:hover {
  color: var(--vp-c-white);
  opacity: 0.9;
}

.parser-mode-hint {
  font-size: 0.75rem;
  color: var(--vp-c-brand);
  font-weight: 600;
  padding: 2px 8px;
  background: var(--vp-c-brand-soft);
  border-radius: 4px;
}

/* --- 网格布局变量（需与全局 style.css 中的 .tlp-explorer 保持一致）--- */
.tlp-parser {
  --tlp-name-width: 5.8rem;
  --tlp-bit-min: 2.2rem;
  --tlp-gap: 3px;
}

/* --- 输入区域 --- */
.parser-input-area {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.parser-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
}

.parser-textarea {
  width: 100%;
  padding: 12px 16px;
  font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.parser-textarea:focus {
  border-color: var(--vp-c-brand);
}

.parser-textarea::placeholder {
  color: var(--vp-c-text-3);
  opacity: 0.6;
}

.parser-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.parser-btn {
  padding: 7px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.15s;
}

.parser-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.parser-btn--parse {
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand);
}

.parser-btn--parse:hover {
  opacity: 0.85;
  color: var(--vp-c-white);
}

.parser-btn--example {
  font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace;
  font-size: 0.78rem;
  padding: 4px 11px;
}

.parser-btn--example--flit {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
}

.parser-hint {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  margin-left: 4px;
}

.parser-examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.parser-examples__label {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-right: 4px;
}

/* --- 错误 --- */
.parser-error {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
  border: 1px solid var(--vp-c-danger);
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

/* --- 原始 DW --- */
.parser-raw-toggle {
  font-size: 0.8rem;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.parser-raw-toggle:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.parser-raw-dw {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 16px;
  margin-bottom: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  font-size: 0.85rem;
}

.parser-raw-dw__item {
  font-weight: 500;
}

.parser-raw-dw__item code {
  font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace;
  color: var(--vp-c-brand);
}

/* --- 解析值在字段中的显示 --- */
.tlp-field__value {
  display: block;
  font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace;
  font-size: 0.7rem;
  opacity: 0.85;
  margin-top: 1px;
  word-break: break-all;
}
</style>
