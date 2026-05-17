<template>
  <div class="tlp-viewer">
    <!-- ====== Top Bar: FLIT toggle + tooltip toggle ====== -->
    <div class="tlp-top-bar">
      <button
        :class="['tlp-mode-toggle', { active: flitMode }]"
        @click="flitMode = !flitMode"
      >
        {{ flitMode ? 'FLIT Mode' : 'Standard TLP' }}
      </button>
      <div class="tlp-tooltip-ctrl">
        <span class="tlp-tooltip-q" @click="showTooltips = !showTooltips" title="字段说明">?</span>
        <label class="tlp-switch">
          <input type="checkbox" v-model="showTooltips" />
          <span class="tlp-switch-slider"></span>
        </label>
      </div>
    </div>

    <!-- ====== Categories (one row per major category) ====== -->
    <div class="tlp-categories">
      <div v-for="cat in orderedCategories" :key="cat" class="tlp-category-row">
        <span class="tlp-cat-label">{{ cat }}</span>
        <div class="tlp-cat-btns">
          <button
            v-for="t in typesByCategory[cat]"
            :key="t.id"
            :class="['tlp-type-btn', { active: selectedId === t.id }]"
            @click="selectedId = t.id"
          >
            {{ t.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- ====== TLP Name ====== -->
    <div class="tlp-current-label">
      {{ currentData.label }} — {{ currentData.desc }}
      <span v-if="flitMode" class="tlp-flit-badge">FLIT</span>
    </div>

    <!-- ====== FLIT Header Row (FLIT mode only) ====== -->
    <div v-if="flitMode" class="tlp-dws tlp-flit-header-section">
      <div class="tlp-dw">
        <div class="tlp-dw-label tlp-flit-dw-label">FLIT HDR</div>
        <div class="tlp-dw-body">
          <div class="tlp-byte-markers">
            <div
              v-for="bi in 4"
              :key="bi"
              class="tlp-byte-marker"
              :style="{ left: ((bi - 1) / 4) * 100 + '%', width: (1 / 4) * 100 + '%' }"
            >
              Byte {{ bi - 1 }}
            </div>
          </div>
          <div class="tlp-fields-track">
            <div
              v-for="(seg, segIdx) in flitHeaderSegs"
              :key="segIdx"
              class="tlp-field-seg"
              :style="{
                width: seg.widthPercent + '%',
                backgroundColor: seg.color + '22',
                borderLeftColor: seg.color,
              }"
              @mouseenter="hoveredSeg = seg"
              @mouseleave="hoveredSeg = null"
            >
              <span class="tlp-field-name">{{ seg.name }}</span>
              <span class="tlp-field-bits">{{ seg.bitsLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== DW Rows ====== -->
    <div class="tlp-dws">
      <div v-for="(dw, dwIdx) in displayDws" :key="dwIdx" class="tlp-dw">
        <div class="tlp-dw-label">DW{{ dwIdx }}</div>
        <div class="tlp-dw-body">
          <!-- Byte markers -->
          <div class="tlp-byte-markers">
            <div
              v-for="bi in 4"
              :key="bi"
              class="tlp-byte-marker"
              :style="{ left: ((bi - 1) / 4) * 100 + '%', width: (1 / 4) * 100 + '%' }"
            >
              Byte {{ bi - 1 }}
            </div>
          </div>
          <!-- Field segments -->
          <div class="tlp-fields-track">
            <div
              v-for="(seg, segIdx) in dw.segments"
              :key="segIdx"
              :class="['tlp-field-seg', { 'tlp-field-fixed': seg.value }]"
              :style="{
                width: seg.widthPercent + '%',
                backgroundColor: seg.color + '22',
                borderLeftColor: seg.color,
              }"
              @mouseenter="hoveredSeg = seg"
              @mouseleave="hoveredSeg = null"
            >
              <span class="tlp-field-name">{{ seg.name }}</span>
              <span class="tlp-field-bits">{{ seg.bitsLabel }}</span>
              <span v-if="seg.value" class="tlp-field-value">{{ seg.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== FLIT CRC Row (FLIT mode only) ====== -->
    <div v-if="flitMode" class="tlp-dws tlp-flit-crc-section">
      <div class="tlp-dw">
        <div class="tlp-dw-label tlp-flit-dw-label">CRC</div>
        <div class="tlp-dw-body">
          <div class="tlp-fields-track">
            <div
              class="tlp-field-seg"
              style="width: 100%; background-color: #9ca3af22; border-left-color: #9ca3af;"
              @mouseenter="hoveredSeg = flitCrcSeg"
              @mouseleave="hoveredSeg = null"
            >
              <span class="tlp-field-name">FLIT CRC</span>
              <span class="tlp-field-bits">31:0</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== Tooltip ====== -->
    <div v-if="showTooltips && hoveredSeg" class="tlp-tooltip">
      <strong>{{ hoveredSeg.name }}</strong> [{{ hoveredSeg.bitsLabel }}]
      <p>{{ hoveredSeg.desc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ============================================================
// COLOR PALETTE
// ============================================================
const C = {
  header:   '#4f8ef7',
  tc:       '#10b981',
  attr:     '#06b6d4',
  ctrl:     '#f59e0b',
  length:   '#8b5cf6',
  addr:     '#ef4444',
  reqTag:   '#14b8a6',
  be:       '#ec4899',
  status:   '#eab308',
  msg:      '#6366f1',
  rsvd:     '#9ca3af',
  bus:      '#f97316',
  cmpMisc:  '#84cc16',
  flit:     '#f43f5e',
  dlength:  '#a78bfa',
}

// ============================================================
// FIELD HELPERS
// ============================================================
type TlpField = {
  name: string
  start: number
  end: number
  desc: string
  color: string
  value?: string
}

const FMT = (desc: string) =>
  ({ name: 'Fmt', start: 5, end: 7, desc, color: C.header }) as TlpField
const FMT_FLIT = (desc: string) =>
  ({ name: 'Fmt', start: 4, end: 7, desc, color: C.header }) as TlpField // 4-bit in FLIT

const TYPE = (desc: string, val?: string) =>
  ({ name: 'Type', start: 0, end: 3, desc, color: C.header, value: val }) as TlpField // 4-bit Type in FLIT

const TYPE_STD = (desc: string, val?: string) =>
  ({ name: 'Type', start: 0, end: 4, desc, color: C.header, value: val }) as TlpField

const TC  = (desc?: string) => ({ name: 'TC', start: 12, end: 14, desc: desc ?? 'Traffic Class (TC0–TC7)', color: C.tc }) as TlpField
const T9  = (desc?: string) => ({ name: 'T9', start: 15, end: 15, desc: desc ?? 'T9 hint', color: C.tc }) as TlpField
const T8  = (desc?: string) => ({ name: 'T8', start: 11, end: 11, desc: desc ?? 'T8 hint', color: C.tc }) as TlpField
const ATTR_LO = (desc?: string) => ({ name: 'Attr', start: 9, end: 10, desc: desc ?? 'Attributes [1:0]', color: C.attr }) as TlpField
const LN  = (desc?: string) => ({ name: 'LN', start: 8,  end: 8,  desc: desc ?? 'Lightweight Notification', color: C.ctrl }) as TlpField
const TH  = (desc?: string) => ({ name: 'TH', start: 23, end: 23, desc: desc ?? 'TLP Processing Hint', color: C.ctrl }) as TlpField
const TD  = (desc?: string) => ({ name: 'TD', start: 22, end: 22, desc: desc ?? 'TLP Digest present', color: C.ctrl }) as TlpField
const EP  = (desc?: string) => ({ name: 'EP', start: 21, end: 21, desc: desc ?? 'Error / Poisoned', color: C.ctrl }) as TlpField
const ATTR_HI = (desc?: string) => ({ name: 'Attr', start: 19, end: 20, desc: desc ?? 'Attributes [3:2]', color: C.attr }) as TlpField
const AT  = (desc?: string) => ({ name: 'AT', start: 17, end: 18, desc: desc ?? 'Address Type', color: C.attr }) as TlpField

const LENGTH_LO = (desc?: string) => ({ name: 'Length', start: 16, end: 16, desc: desc ?? 'Length [0]', color: C.length }) as TlpField
const LENGTH_HI = (desc?: string) => ({ name: 'Length', start: 24, end: 31, desc: desc ?? 'Length [9:1]', color: C.length }) as TlpField

const DLENGTH_LO = (desc?: string) => ({ name: 'DLength', start: 16, end: 16, desc: desc ?? 'Data Length [0] (FLIT)', color: C.dlength }) as TlpField
const DLENGTH_HI = (desc?: string) => ({ name: 'DLength', start: 24, end: 31, desc: desc ?? 'Data Length [9:1] (FLIT)', color: C.dlength }) as TlpField

const REQ_ID = (desc?: string) => ({ name: 'Requester ID', start: 16, end: 31, desc: desc ?? 'Requester ID [15:0]', color: C.reqTag }) as TlpField
const TAG    = (desc?: string) => ({ name: 'Tag', start: 8, end: 15, desc: desc ?? 'Tag [7:0]', color: C.reqTag }) as TlpField
const LAST_BE  = (desc?: string) => ({ name: 'Last DW BE', start: 4, end: 7, desc: desc ?? 'Last DW Byte Enables [3:0]', color: C.be }) as TlpField
const FIRST_BE = (desc?: string) => ({ name: '1st DW BE', start: 0, end: 3, desc: desc ?? 'First DW Byte Enables [3:0]', color: C.be }) as TlpField

const ADDR_LO = (desc?: string) => ({ name: 'Address', start: 2, end: 31, desc: desc ?? 'Address [31:2]', color: C.addr }) as TlpField
const PH     = (desc?: string) => ({ name: 'PH', start: 0, end: 1, desc: desc ?? 'PH [1:0]', color: C.rsvd }) as TlpField
const ADDR_HI = (desc?: string) => ({ name: 'Address', start: 0, end: 31, desc: desc ?? 'Address [63:32]', color: C.addr }) as TlpField

const BYTE_CNT = (desc?: string) => ({ name: 'Byte Count', start: 0, end: 11, desc: desc ?? 'Byte Count [11:0]', color: C.cmpMisc }) as TlpField
const BCM      = (desc?: string) => ({ name: 'BCM', start: 12, end: 12, desc: desc ?? 'Byte Count Modified', color: C.cmpMisc }) as TlpField
const CPL_STATUS = (desc?: string) => ({ name: 'Cpl Status', start: 13, end: 15, desc: desc ?? 'Completion Status', color: C.status }) as TlpField
const CPLR_ID = (desc?: string) => ({ name: 'Completer ID', start: 16, end: 31, desc: desc ?? 'Completer ID [15:0]', color: C.reqTag }) as TlpField
const LOW_ADDR = (desc?: string) => ({ name: 'Lower Address', start: 0, end: 6, desc: desc ?? 'Lower Address [6:0]', color: C.cmpMisc }) as TlpField
const CPL_RSVD = (desc?: string) => ({ name: 'Rsvd', start: 7, end: 7, desc: desc ?? 'Reserved', color: C.rsvd }) as TlpField

const REG_NUM = (desc?: string) => ({ name: 'Register', start: 2, end: 9, desc: desc ?? 'Register Number [7:0]', color: C.bus }) as TlpField
const FUNC_NUM = (desc?: string) => ({ name: 'Function', start: 10, end: 12, desc: desc ?? 'Function Number [2:0]', color: C.bus }) as TlpField
const DEV_NUM  = (desc?: string) => ({ name: 'Device', start: 13, end: 17, desc: desc ?? 'Device Number [4:0]', color: C.bus }) as TlpField
const BUS_NUM  = (desc?: string) => ({ name: 'Bus', start: 18, end: 25, desc: desc ?? 'Bus Number [7:0]', color: C.bus }) as TlpField
const CFG_RSVD = (desc?: string) => ({ name: 'Rsvd', start: 26, end: 31, desc: desc ?? 'Reserved', color: C.rsvd }) as TlpField

const MSG_CODE = (desc?: string) => ({ name: 'Message Code', start: 0, end: 7, desc: desc ?? 'Message Code [7:0]', color: C.msg }) as TlpField

// --- IO fields ---
const IO_ADDR_LO = (desc?: string) => ({ name: 'IO Address', start: 2, end: 31, desc: desc ?? 'IO Address [31:2]', color: C.addr }) as TlpField
const IO_RSVD     = (desc?: string) => ({ name: 'Rsvd', start: 0, end: 1, desc: desc ?? 'Reserved', color: C.rsvd }) as TlpField

// --- FLIT-specific fields ---
const NS  = (desc?: string) => ({ name: 'NS', start: 23, end: 23, desc: desc ?? 'No Snoop (FLIT)', color: C.flit }) as TlpField
const RO  = (desc?: string) => ({ name: 'RO', start: 22, end: 22, desc: desc ?? 'Relaxed Ordering (FLIT)', color: C.flit }) as TlpField
const IDO = (desc?: string) => ({ name: 'IDO', start: 20, end: 21, desc: desc ?? 'ID-Based Ordering (FLIT)', color: C.flit }) as TlpField

// ============================================================
// TYPE DEFINITION
// ============================================================
interface TlpDwDef {
  fields: TlpField[]
}

interface TlpTypeDef {
  id: string
  label: string
  category: string
  desc: string
  dws: TlpDwDef[]
}

// ============================================================
// STANDARD TLP DATA
// ============================================================
const STD_TLP: Record<string, TlpTypeDef> = {

  MRD3: {
    id: 'MRD3', label: 'MRD (3DW)', category: 'Read/Write',
    desc: 'Memory Read Request — 32-bit addressing, 3DW header',
    dws: [
      { fields: [FMT('Format: 00=3DW no data. For MRD3: Fmt=00 or 01'), TYPE_STD('Type: 00000 = Memory Read Request', '0x00'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO(), PH()] },
    ],
  },
  MRD4: {
    id: 'MRD4', label: 'MRD (4DW)', category: 'Read/Write',
    desc: 'Memory Read Request — 64-bit addressing, 4DW header',
    dws: [
      { fields: [FMT('Format: 01=4DW no data. For MRD4: Fmt=01'), TYPE_STD('Type: 00000 = Memory Read Request', '0x00'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_HI('Address [63:32]')] },
      { fields: [ADDR_LO(), PH()] },
    ],
  },
  MWR3: {
    id: 'MWR3', label: 'MWR (3DW)', category: 'Read/Write',
    desc: 'Memory Write Request — 32-bit addressing, 3DW header',
    dws: [
      { fields: [FMT('Format: 10=3DW+data. For MWR3: Fmt=10'), TYPE_STD('Type: 00001 = Memory Write Request', '0x01'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO(), PH()] },
    ],
  },
  MWR4: {
    id: 'MWR4', label: 'MWR (4DW)', category: 'Read/Write',
    desc: 'Memory Write Request — 64-bit addressing, 4DW header',
    dws: [
      { fields: [FMT('Format: 11=4DW+data. For MWR4: Fmt=11'), TYPE_STD('Type: 00001 = Memory Write Request', '0x01'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_HI('Address [63:32]')] },
      { fields: [ADDR_LO(), PH()] },
    ],
  },
  IORD: {
    id: 'IORD', label: 'IORD', category: 'Read/Write',
    desc: 'I/O Read Request — 3DW header',
    dws: [
      { fields: [FMT('Format: 00=3DW no data'), TYPE_STD('Type: 00010 = I/O Read Request', '0x02'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [IO_ADDR_LO(), IO_RSVD()] },
    ],
  },
  IOWR: {
    id: 'IOWR', label: 'IOWR', category: 'Read/Write',
    desc: 'I/O Write Request — 3DW header',
    dws: [
      { fields: [FMT('Format: 10=3DW+data'), TYPE_STD('Type: 00011 = I/O Write Request', '0x03'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [IO_ADDR_LO(), IO_RSVD()] },
    ],
  },

  CFGRD0: {
    id: 'CFGRD0', label: 'CFGRD0', category: 'Config',
    desc: 'Configuration Read Type 0 — 3DW header',
    dws: [
      { fields: [FMT('Format: 00=3DW no data'), TYPE_STD('Type: 00100 = Config Read Type 0', '0x04'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [REG_NUM(), FUNC_NUM(), DEV_NUM(), BUS_NUM(), CFG_RSVD()] },
    ],
  },
  CFGWR0: {
    id: 'CFGWR0', label: 'CFGWR0', category: 'Config',
    desc: 'Configuration Write Type 0 — 3DW header',
    dws: [
      { fields: [FMT('Format: 10=3DW+data'), TYPE_STD('Type: 00101 = Config Write Type 0', '0x05'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [REG_NUM(), FUNC_NUM(), DEV_NUM(), BUS_NUM(), CFG_RSVD()] },
    ],
  },
  CFGRD1: {
    id: 'CFGRD1', label: 'CFGRD1', category: 'Config',
    desc: 'Configuration Read Type 1 — 3DW header',
    dws: [
      { fields: [FMT('Format: 00=3DW no data'), TYPE_STD('Type: 00100 = Config Read Type 1', '0x04'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [REG_NUM(), FUNC_NUM(), DEV_NUM(), BUS_NUM(), CFG_RSVD()] },
    ],
  },
  CFGWR1: {
    id: 'CFGWR1', label: 'CFGWR1', category: 'Config',
    desc: 'Configuration Write Type 1 — 3DW header',
    dws: [
      { fields: [FMT('Format: 10=3DW+data'), TYPE_STD('Type: 00101 = Config Write Type 1', '0x05'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [REG_NUM(), FUNC_NUM(), DEV_NUM(), BUS_NUM(), CFG_RSVD()] },
    ],
  },

  MSG: {
    id: 'MSG', label: 'MSG', category: 'Message',
    desc: 'Message Request — 4DW header, no data',
    dws: [
      { fields: [FMT('Format: 01=4DW no data. For MSG: Fmt=01'), TYPE_STD('Type: 10000 = Message Request', '0x10'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), MSG_CODE()] },
      { fields: [ADDR_HI('Message payload')] },
      { fields: [ADDR_LO('Message payload'), PH()] },
    ],
  },
  MSGD: {
    id: 'MSGD', label: 'MSGD', category: 'Message',
    desc: 'Message Request with Data — 4DW header',
    dws: [
      { fields: [FMT('Format: 11=4DW+data. For MSGD: Fmt=11'), TYPE_STD('Type: 10001 = Message with Data', '0x11'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), MSG_CODE()] },
      { fields: [ADDR_HI('Message payload')] },
      { fields: [ADDR_LO('Message payload'), PH()] },
    ],
  },

  CPL: {
    id: 'CPL', label: 'CPL', category: 'Completion',
    desc: 'Completion without Data — 3DW header',
    dws: [
      { fields: [FMT('Format: 00=3DW no data. For CPL: Fmt=00'), TYPE_STD('Type: 01010 = Completion', '0x0A'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [CPLR_ID(), CPL_STATUS(), BCM(), BYTE_CNT()] },
      { fields: [REQ_ID(), TAG(), CPL_RSVD(), LOW_ADDR()] },
    ],
  },
  CPLD: {
    id: 'CPLD', label: 'CPLD', category: 'Completion',
    desc: 'Completion with Data — 3DW header',
    dws: [
      { fields: [FMT('Format: 10=3DW+data. For CPLD: Fmt=10'), TYPE_STD('Type: 01010 = Completion with Data', '0x0A'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [CPLR_ID(), CPL_STATUS(), BCM(), BYTE_CNT()] },
      { fields: [REQ_ID(), TAG(), CPL_RSVD(), LOW_ADDR()] },
    ],
  },

  FETCHADD: {
    id: 'FETCHADD', label: 'FetchAdd', category: 'AtomicOp',
    desc: 'AtomicOp: Fetch and Add — 3DW/4DW header',
    dws: [
      { fields: [FMT('Format: 10=3DW+data (or 11=4DW+data)'), TYPE_STD('Type: 01100 = Fetch and Add', '0x0C'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO('Address [31:2]'), PH()] },
    ],
  },
  SWAP: {
    id: 'SWAP', label: 'Swap', category: 'AtomicOp',
    desc: 'AtomicOp: Unconditional Swap — 3DW/4DW header',
    dws: [
      { fields: [FMT('Format: 10=3DW+data (or 11=4DW+data)'), TYPE_STD('Type: 01101 = Swap', '0x0D'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO('Address [31:2]'), PH()] },
    ],
  },
  CAS: {
    id: 'CAS', label: 'CAS', category: 'AtomicOp',
    desc: 'AtomicOp: Compare and Swap — 3DW/4DW header',
    dws: [
      { fields: [FMT('Format: 10=3DW+data (or 11=4DW+data)'), TYPE_STD('Type: 01110 = Compare and Swap', '0x0E'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), TD(), EP(), ATTR_HI(), AT(), LENGTH_LO(), LENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO('Address [31:2]'), PH()] },
    ],
  },
}

// ============================================================
// FLIT-MODE TLP DATA
//   Key differences from Standard:
//   - Fmt field is 1 bit wider (depends on PCIe 6.0 encoding)
//   - DW0 byte 3 carries DLength (Data Length) instead of Length
//   - NS/RO/IDO fields in DW0 byte 2 (ordering attributes)
// ============================================================
const FLIT_TLP: Record<string, TlpTypeDef> = {

  MRD3: {
    id: 'MRD3', label: 'MRD (3DW)', category: 'Read/Write',
    desc: 'FLIT Mode: Memory Read Request — 32-bit addressing, 3DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Mem Read', '0x0'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO(), PH()] },
    ],
  },
  MRD4: {
    id: 'MRD4', label: 'MRD (4DW)', category: 'Read/Write',
    desc: 'FLIT Mode: Memory Read Request — 64-bit addressing, 4DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Mem Read', '0x0'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_HI('Address [63:32]')] },
      { fields: [ADDR_LO(), PH()] },
    ],
  },
  MWR3: {
    id: 'MWR3', label: 'MWR (3DW)', category: 'Read/Write',
    desc: 'FLIT Mode: Memory Write Request — 32-bit addressing, 3DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Mem Write', '0x1'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO(), PH()] },
    ],
  },
  MWR4: {
    id: 'MWR4', label: 'MWR (4DW)', category: 'Read/Write',
    desc: 'FLIT Mode: Memory Write Request — 64-bit addressing, 4DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Mem Write', '0x1'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_HI('Address [63:32]')] },
      { fields: [ADDR_LO(), PH()] },
    ],
  },

  CFGRD0: {
    id: 'CFGRD0', label: 'CFGRD0', category: 'Config',
    desc: 'FLIT Mode: Configuration Read Type 0 — 3DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Cfg Read 0', '0x4'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [REG_NUM(), FUNC_NUM(), DEV_NUM(), BUS_NUM(), CFG_RSVD()] },
    ],
  },
  CFGWR0: {
    id: 'CFGWR0', label: 'CFGWR0', category: 'Config',
    desc: 'FLIT Mode: Configuration Write Type 0 — 3DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Cfg Write 0', '0x5'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [REG_NUM(), FUNC_NUM(), DEV_NUM(), BUS_NUM(), CFG_RSVD()] },
    ],
  },

  MSG: {
    id: 'MSG', label: 'MSG', category: 'Message',
    desc: 'FLIT Mode: Message Request — 4DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Message', '0x8'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), MSG_CODE()] },
      { fields: [ADDR_HI('Message payload')] },
      { fields: [ADDR_LO('Message payload'), PH()] },
    ],
  },
  MSGD: {
    id: 'MSGD', label: 'MSGD', category: 'Message',
    desc: 'FLIT Mode: Message with Data — 4DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Msg w/ Data', '0x9'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), MSG_CODE()] },
      { fields: [ADDR_HI('Message payload')] },
      { fields: [ADDR_LO('Message payload'), PH()] },
    ],
  },

  CPL: {
    id: 'CPL', label: 'CPL', category: 'Completion',
    desc: 'FLIT Mode: Completion without Data — 3DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Completion', '0xA'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [CPLR_ID(), CPL_STATUS(), BCM(), BYTE_CNT()] },
      { fields: [REQ_ID(), TAG(), CPL_RSVD(), LOW_ADDR()] },
    ],
  },
  CPLD: {
    id: 'CPLD', label: 'CPLD', category: 'Completion',
    desc: 'FLIT Mode: Completion with Data — 3DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Completion', '0xA'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [CPLR_ID(), CPL_STATUS(), BCM(), BYTE_CNT()] },
      { fields: [REQ_ID(), TAG(), CPL_RSVD(), LOW_ADDR()] },
    ],
  },

  FETCHADD: {
    id: 'FETCHADD', label: 'FetchAdd', category: 'AtomicOp',
    desc: 'FLIT Mode: AtomicOp Fetch and Add — 3DW/4DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = FetchAdd', '0xC'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO('Address [31:2]'), PH()] },
    ],
  },
  SWAP: {
    id: 'SWAP', label: 'Swap', category: 'AtomicOp',
    desc: 'FLIT Mode: AtomicOp Swap — 3DW/4DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = Swap', '0xD'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO('Address [31:2]'), PH()] },
    ],
  },
  CAS: {
    id: 'CAS', label: 'CAS', category: 'AtomicOp',
    desc: 'FLIT Mode: AtomicOp CAS — 3DW/4DW header',
    dws: [
      { fields: [FMT_FLIT('Fmt[3:0] in FLIT mode'), TYPE('Type[3:0] = CAS', '0xE'), T9(), TC(), T8(), ATTR_LO(), LN(), TH(), NS(), RO(), ATTR_HI(), IDO(), AT(), DLENGTH_LO(), DLENGTH_HI()] },
      { fields: [REQ_ID(), TAG(), LAST_BE(), FIRST_BE()] },
      { fields: [ADDR_LO('Address [31:2]'), PH()] },
    ],
  },
}

// ============================================================
// COMPONENT STATE
// ============================================================
const selectedId = ref('MRD3')
const showTooltips = ref(true)
const flitMode = ref(false)
const hoveredSeg = ref<DisplaySegment | null>(null)

// ============================================================
// DERIVED DATA
// ============================================================
const CATEGORY_ORDER = ['Read/Write', 'Config', 'Message', 'Completion', 'AtomicOp']

const orderedCategories = computed(() => {
  const data = flitMode.value ? FLIT_TLP : STD_TLP
  const allTypes = Object.values(data)
  const available = new Set(allTypes.map(t => t.category))
  return CATEGORY_ORDER.filter(c => available.has(c))
})

const typesByCategory = computed(() => {
  const data = flitMode.value ? FLIT_TLP : STD_TLP
  const allTypes = Object.values(data)
  const map: Record<string, TlpTypeDef[]> = {}
  for (const t of allTypes) {
    (map[t.category] ??= []).push(t)
  }
  return map
})

const currentData = computed(() => {
  const data = flitMode.value ? FLIT_TLP : STD_TLP
  return data[selectedId.value]
})

// ============================================================
// FLIT HEADER SEGMENTS (shown above DW0 in FLIT mode)
// ============================================================
const flitHeaderSegs = computed<DisplaySegment[]>(() => [
  { name: 'SeqNum', bitsLabel: '23:12', desc: 'Sequence Number [11:0]', color: C.flit, widthPercent: (12 / 32) * 100 },
  { name: 'ND', bitsLabel: '11', desc: 'Non-Data (ND) flag', color: C.flit, widthPercent: (1 / 32) * 100 },
  { name: 'HdrFmt', bitsLabel: '10:8', desc: 'Header Format [2:0]', color: C.flit, widthPercent: (3 / 32) * 100 },
  { name: 'TLP Count', bitsLabel: '7:5', desc: 'Number of TLPs in this FLIT [2:0]', color: C.flit, widthPercent: (3 / 32) * 100 },
  { name: 'FCRC', bitsLabel: '4:2', desc: 'FLIT Header CRC [2:0]', color: C.flit, widthPercent: (3 / 32) * 100 },
  { name: 'Rsvd', bitsLabel: '1:0', desc: 'Reserved', color: C.rsvd, widthPercent: (2 / 32) * 100 },
  { name: 'DLLP/OOB', bitsLabel: '31:24', desc: 'DLLP Payload / OOB Info [7:0]', color: C.flit, widthPercent: (8 / 32) * 100 },
])

const flitCrcSeg: DisplaySegment = {
  name: 'FLIT CRC', bitsLabel: '31:0', desc: 'FLIT-level CRC-32 covering entire FLIT payload', color: C.rsvd, widthPercent: 100,
}

// ============================================================
// VISUAL LAYOUT COMPUTATION
// ============================================================
const BIT_ORDER: number[] = (() => {
  const order: number[] = []
  for (let byte = 0; byte < 4; byte++) {
    for (let bit = 7; bit >= 0; bit--) {
      order.push(byte * 8 + bit)
    }
  }
  return order
})()

interface DisplaySegment {
  name: string
  bitsLabel: string
  desc: string
  color: string
  value?: string
  widthPercent: number
}

interface DisplayDw {
  segments: DisplaySegment[]
}

const displayDws = computed<DisplayDw[]>(() => {
  const dws = currentData.value.dws

  return dws.map(dw => {
    const occupied: (number | null)[] = new Array(32).fill(null)
    const fieldData: { idx: number; field: TlpField }[] = []

    dw.fields.forEach((field, idx) => {
      fieldData.push({ idx, field })
      for (let b = field.start; b <= field.end; b++) {
        occupied[b] = idx
      }
    })

    const segments: DisplaySegment[] = []
    let i = 0
    while (i < 32) {
      const fieldIdx = occupied[BIT_ORDER[i]]
      if (fieldIdx === null) {
        segments.push({
          name: '',
          bitsLabel: '',
          desc: '',
          color: 'transparent',
          widthPercent: (1 / 32) * 100,
        })
        i++
        continue
      }

      let j = i
      while (j < 32 && occupied[BIT_ORDER[j]] === fieldIdx) j++

      const field = fieldData[fieldIdx].field
      const width = j - i

      const bitsInSeg = BIT_ORDER.slice(i, j)
      const minBit = Math.min(...bitsInSeg)
      const maxBit = Math.max(...bitsInSeg)
      const bitsLabel = minBit === maxBit ? `${minBit}` : `${maxBit}:${minBit}`

      segments.push({
        name: field.name,
        bitsLabel,
        desc: field.desc,
        color: field.color,
        value: field.value,
        widthPercent: (width / 32) * 100,
      })
      i = j
    }

    return { segments }
  })
})
</script>

<style scoped>
/* ============================================================
   TLP Viewer Styles
   ============================================================ */
.tlp-viewer {
  font-family: 'Segoe UI', system-ui, sans-serif;
  max-width: 100%;
  position: relative;
}

/* ---- Top Bar ---- */
.tlp-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.tlp-mode-toggle {
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all .15s;
}
.tlp-mode-toggle.active {
  background: #f43f5e;
  color: #fff;
  border-color: #f43f5e;
}

/* ---- Tooltip control: ? icon + slide switch ---- */
.tlp-tooltip-ctrl {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tlp-tooltip-q {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  cursor: pointer;
  user-select: none;
  transition: all .15s;
  line-height: 1;
}
.tlp-tooltip-q:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* Slide switch */
.tlp-switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
}

.tlp-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.tlp-switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  transition: all .2s;
}

.tlp-switch-slider::before {
  content: '';
  position: absolute;
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background: var(--vp-c-text-2);
  border-radius: 50%;
  transition: all .2s;
}

.tlp-switch input:checked + .tlp-switch-slider {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.tlp-switch input:checked + .tlp-switch-slider::before {
  transform: translateX(14px);
  background: #fff;
}

/* ---- Categories (one row per major category) ---- */
.tlp-categories {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.tlp-category-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tlp-cat-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: .5px;
  white-space: nowrap;
  min-width: 90px;
}

.tlp-cat-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tlp-type-btn {
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  white-space: nowrap;
  transition: all .15s;
}
.tlp-type-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.tlp-type-btn.active {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}

/* ---- Current label ---- */
.tlp-current-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  gap: 8px;
}

.tlp-flit-badge {
  display: inline-block;
  padding: 1px 7px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: #f43f5e;
  border-radius: 3px;
  letter-spacing: .5px;
}

/* ---- DW rows ---- */
.tlp-dws {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tlp-dw {
  display: flex;
  align-items: stretch;
  min-height: 60px;
}

.tlp-dw-label {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: 4px 0 0 4px;
  border: 1px solid var(--vp-c-divider);
  border-right: none;
}

.tlp-flit-dw-label {
  color: #f43f5e;
  font-size: 11px;
}

.tlp-flit-header-section,
.tlp-flit-crc-section {
  margin-bottom: 2px;
}

.tlp-dw-body {
  flex: 1;
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0 4px 4px 0;
  background: var(--vp-c-bg);
  overflow: hidden;
}

/* ---- Byte markers ---- */
.tlp-byte-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 18px;
  pointer-events: none;
  z-index: 1;
}

.tlp-byte-marker {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--vp-c-text-3);
  border-right: 1px dashed var(--vp-c-divider);
  box-sizing: border-box;
}

/* ---- Fields track ---- */
.tlp-fields-track {
  display: flex;
  height: 100%;
  min-height: 56px;
  padding-top: 20px;
}

.tlp-field-seg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 2px solid;
  box-sizing: border-box;
  padding: 4px 2px;
  position: relative;
  cursor: default;
  transition: filter .15s, transform .15s;
  overflow: hidden;
}
.tlp-field-seg:first-child {
  border-left: none;
}
.tlp-field-seg:hover {
  filter: brightness(0.92);
  z-index: 2;
}

.tlp-field-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.2;
  white-space: nowrap;
}

.tlp-field-bits {
  font-size: 9px;
  color: var(--vp-c-text-3);
  line-height: 1.2;
  white-space: nowrap;
}

.tlp-field-value {
  font-size: 8px;
  color: var(--vp-c-text-2);
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  line-height: 1.2;
  white-space: nowrap;
  margin-top: 1px;
}

/* ---- Tooltip ---- */
.tlp-tooltip {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 420px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .15);
  font-size: 13px;
  line-height: 1.5;
  z-index: 100;
  pointer-events: none;
}
.tlp-tooltip strong {
  color: var(--vp-c-brand-1);
}
.tlp-tooltip p {
  margin: 4px 0 0;
  color: var(--vp-c-text-1);
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .tlp-top-bar {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  .tlp-category-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  .tlp-cat-label {
    min-width: auto;
  }
  .tlp-dw-label {
    width: 36px;
    font-size: 11px;
  }
  .tlp-field-name {
    font-size: 10px;
  }
  .tlp-field-bits {
    font-size: 8px;
  }
}
</style>
