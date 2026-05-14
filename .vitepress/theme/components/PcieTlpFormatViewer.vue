<script setup lang="ts">
import { computed, ref } from 'vue'

type Field = {
  label: string
  bits: string
  description?: string
  className?: string
  columns: number
}

type DwRow = {
  name: string
  note?: string
  fields: Field[]
}

type TlpFormat = {
  key: string
  title: string
  subtitle: string
  rows: DwRow[]
  notes: string[]
}

const dw0Common: Field[] = [
  { label: 'Fmt', bits: '7:5', description: 'Format：决定 3DW/4DW Header 以及是否带 Data Payload。', columns: 3, className: 'fmt' },
  { label: 'Type', bits: '4:0', description: 'TLP 类型编码。', columns: 5, className: 'type' },
  { label: 'T9', bits: '15', description: 'Length[9]，长度字段最高位。', columns: 1 },
  { label: 'TC', bits: '14:12', description: 'Traffic Class。', columns: 3 },
  { label: 'T8', bits: '11', description: 'Length[8]。', columns: 1 },
  { label: 'Attr', bits: '10', description: 'Attribute 扩展位。', columns: 1 },
  { label: 'LN', bits: '9', description: 'Lightweight Notification。', columns: 1 },
  { label: 'TH', bits: '8', description: 'TLP Processing Hints Present。', columns: 1 },
  { label: 'TD', bits: '23', description: 'TLP Digest Present。', columns: 1 },
  { label: 'EP', bits: '22', description: 'Poisoned TLP。', columns: 1 },
  { label: 'Attr', bits: '21:20', description: 'No Snoop / Relaxed Ordering 等 Attribute 位。', columns: 2 },
  { label: 'AT', bits: '19:18', description: 'Address Type。', columns: 2 },
  { label: 'Length', bits: '17:16', description: 'Length[7:6]，其余位在本 DW 的最后一个 Byte。', columns: 2, className: 'length' },
  { label: 'Length', bits: '31:24', description: 'Length[5:0] 与低位保留显示区域；按 Byte 从低到高展示。', columns: 8, className: 'length' },
]

const byteHeader = ['Byte 0', 'Byte 1', 'Byte 2', 'Byte 3']

const formats: TlpFormat[] = [
  {
    key: 'mrd',
    title: 'MRD — Memory Read Request',
    subtitle: '展示 3DW / 4DW Memory Read Request Header 的常用字段。',
    rows: [
      { name: 'DW0', note: '通用 Request Header；页面按 Byte0 → Byte3 显示。', fields: dw0Common },
      {
        name: 'DW1',
        fields: [
          { label: 'Requester ID', bits: '15:0', description: 'Bus / Device / Function。', columns: 16, className: 'id' },
          { label: 'Tag', bits: '23:16', description: 'Requester 分配的 Tag。', columns: 8, className: 'tag' },
          { label: 'Last DW BE', bits: '27:24', description: 'Last DW Byte Enable。', columns: 4 },
          { label: 'First DW BE', bits: '31:28', description: 'First DW Byte Enable。', columns: 4 },
        ],
      },
      {
        name: 'DW2',
        note: '3DW Header 使用 Address[31:2]；4DW Header 时该 DW 为 Address[63:32]。',
        fields: [
          { label: 'Address', bits: '31:2', description: 'Memory Address，高低 Byte 仍按左低右高展示。', columns: 30, className: 'addr' },
          { label: 'R', bits: '1:0', description: '低 2 bit 对齐保留。', columns: 2 },
        ],
      },
      {
        name: 'DW3',
        note: '仅 4DW Header 存在。',
        fields: [
          { label: 'Address[31:2]', bits: '31:2', description: '64-bit Address 的低 30 bit。', columns: 30, className: 'addr' },
          { label: 'R', bits: '1:0', description: '低 2 bit 对齐保留。', columns: 2 },
        ],
      },
    ],
    notes: ['MRD 不携带 Data Payload。', 'Fmt 决定 3DW/4DW Header；Type 决定 Memory Read 语义。'],
  },
  {
    key: 'mwr',
    title: 'MWR — Memory Write Request',
    subtitle: 'Memory Write 与 MRD Header 类似，但后续携带 Data Payload。',
    rows: [
      { name: 'DW0', note: '通用 Request Header。', fields: dw0Common },
      {
        name: 'DW1',
        fields: [
          { label: 'Requester ID', bits: '15:0', description: 'Bus / Device / Function。', columns: 16, className: 'id' },
          { label: 'Tag', bits: '23:16', description: 'Requester 分配的 Tag。', columns: 8, className: 'tag' },
          { label: 'Last DW BE', bits: '27:24', description: 'Last DW Byte Enable。', columns: 4 },
          { label: 'First DW BE', bits: '31:28', description: 'First DW Byte Enable。', columns: 4 },
        ],
      },
      {
        name: 'DW2/3',
        note: '3DW 或 4DW Address 字段，布局与 MRD 相同。',
        fields: [
          { label: 'Address', bits: '31:2', description: '写入目标 Memory Address。', columns: 30, className: 'addr' },
          { label: 'R', bits: '1:0', description: '低 2 bit 对齐保留。', columns: 2 },
        ],
      },
      {
        name: 'Data',
        note: 'Payload DW 个数由 Length 字段指示。',
        fields: [
          { label: 'Data Payload', bits: 'Length × 32 bits', description: '写入数据，按 DW 连续排列。', columns: 32, className: 'payload' },
        ],
      },
    ],
    notes: ['MWR 携带 Data Payload。', 'Byte Enable 字段用于指示首末 DW 中有效 Byte。'],
  },
  {
    key: 'cpl',
    title: 'CPL / CPLD — Completion',
    subtitle: 'Completion Header 用于返回 Request 的完成状态；CplD 额外携带 Data。',
    rows: [
      { name: 'DW0', note: 'Completion 的 DW0 仍复用通用格式字段。', fields: dw0Common },
      {
        name: 'DW1',
        fields: [
          { label: 'Completer ID', bits: '15:0', description: 'Completer 的 Bus / Device / Function。', columns: 16, className: 'id' },
          { label: 'Cpl Status', bits: '18:16', description: 'Completion Status。', columns: 3, className: 'status' },
          { label: 'BCM', bits: '19', description: 'Byte Count Modified。', columns: 1 },
          { label: 'Byte Count', bits: '31:20', description: '剩余 Byte Count。', columns: 12, className: 'length' },
        ],
      },
      {
        name: 'DW2',
        fields: [
          { label: 'Requester ID', bits: '15:0', description: '原 Requester ID。', columns: 16, className: 'id' },
          { label: 'Tag', bits: '23:16', description: '匹配原 Request 的 Tag。', columns: 8, className: 'tag' },
          { label: 'R', bits: '24', description: 'Reserved。', columns: 1 },
          { label: 'Lower Address', bits: '31:25', description: '首个有效 Byte 的低地址位。', columns: 7, className: 'addr' },
        ],
      },
      {
        name: 'Data',
        note: '仅 CplD 存在。',
        fields: [
          { label: 'Completion Data', bits: 'Length × 32 bits', description: 'Read Completion 返回的数据。', columns: 32, className: 'payload' },
        ],
      },
    ],
    notes: ['CPL 不带数据，CPLD 带数据。', 'Requester ID 与 Tag 用于匹配原始 Request。'],
  },
  {
    key: 'msg',
    title: 'MSG / MSGD — Message Request',
    subtitle: 'Message Header 包含 Routing、Message Code 与可选 Vendor / Address 字段。',
    rows: [
      { name: 'DW0', note: 'Type 中通常包含 Message Routing 信息。', fields: dw0Common },
      {
        name: 'DW1',
        fields: [
          { label: 'Requester ID', bits: '15:0', description: 'Message 发送者 ID。', columns: 16, className: 'id' },
          { label: 'Tag', bits: '23:16', description: 'Message Tag。', columns: 8, className: 'tag' },
          { label: 'Message Code', bits: '31:24', description: '具体 Message 编码。', columns: 8, className: 'status' },
        ],
      },
      {
        name: 'DW2',
        fields: [
          { label: 'Message Lower DW', bits: '31:0', description: '根据 Message Routing/Code 解释，可为 Address、Vendor 字段或保留。', columns: 32, className: 'msg' },
        ],
      },
      {
        name: 'DW3',
        note: '部分 Message 格式存在。',
        fields: [
          { label: 'Message Upper DW', bits: '31:0', description: '根据 Message 类型解释。', columns: 32, className: 'msg' },
        ],
      },
      {
        name: 'Data',
        note: '仅 MSGD 存在。',
        fields: [
          { label: 'Message Data', bits: 'Length × 32 bits', description: 'Message with Data 的 Payload。', columns: 32, className: 'payload' },
        ],
      },
    ],
    notes: ['MSG 与 MSGD 的主要差异是是否携带 Data Payload。', 'Message Routing 常由 Type 低位编码体现。'],
  },
]

const selectedKey = ref(formats[0].key)
const selectedFormat = computed(() => formats.find((format) => format.key === selectedKey.value) ?? formats[0])
</script>

<template>
  <section class="tlp-format-viewer" aria-labelledby="tlp-format-title">
    <div class="tlp-hero">
      <div>
        <p class="eyebrow">PCIe TLP Format Reference</p>
        <h2 id="tlp-format-title">按 DW / Byte 顺序查看 TLP 字段</h2>
        <p>
          每行显示一个 DW，Byte 按从左到右、从低到高排列；每个 Byte 内按 bit7 → bit0 显示。
          鼠标悬停字段可查看从 bit0 累积的实际 bit 范围。
        </p>
      </div>
    </div>

    <div class="tlp-tabs" role="tablist" aria-label="TLP 类型切换">
      <button
        v-for="format in formats"
        :key="format.key"
        class="tlp-tab"
        :class="{ active: selectedKey === format.key }"
        type="button"
        role="tab"
        :aria-selected="selectedKey === format.key"
        @click="selectedKey = format.key"
      >
        {{ format.key.toUpperCase() }}
      </button>
    </div>

    <article class="tlp-card">
      <header class="tlp-card-header">
        <div>
          <h3>{{ selectedFormat.title }}</h3>
          <p>{{ selectedFormat.subtitle }}</p>
        </div>
      </header>

      <div class="byte-ruler" aria-hidden="true">
        <span v-for="byteName in byteHeader" :key="byteName">{{ byteName }} · bit7→0</span>
      </div>

      <div class="dw-list">
        <section v-for="row in selectedFormat.rows" :key="row.name" class="dw-row">
          <div class="dw-label">
            <strong>{{ row.name }}</strong>
            <span v-if="row.note">{{ row.note }}</span>
          </div>
          <div class="dw-grid" role="list">
            <div
              v-for="(field, index) in row.fields"
              :key="`${row.name}-${field.label}-${field.bits}-${index}`"
              class="field-cell"
              :class="field.className"
              :style="{ gridColumn: `span ${field.columns}` }"
              role="listitem"
              :title="`${field.label}：bit ${field.bits}${field.description ? '；' + field.description : ''}`"
            >
              <span class="field-label">{{ field.label }}</span>
              <span class="field-bits">{{ field.bits }}</span>
            </div>
          </div>
        </section>
      </div>

      <ul class="tlp-notes">
        <li v-for="note in selectedFormat.notes" :key="note">{{ note }}</li>
      </ul>
    </article>
  </section>
</template>

<style scoped>
.tlp-format-viewer {
  margin: 32px 0;
}

.tlp-hero {
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.14), rgba(14, 165, 233, 0.05));
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tlp-hero h2,
.tlp-card h3 {
  margin: 0;
}

.tlp-hero p:not(.eyebrow),
.tlp-card-header p {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
}

.tlp-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.tlp-tab {
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.2s;
}

.tlp-tab:hover,
.tlp-tab.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.tlp-card {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  padding: 20px;
  background: var(--vp-c-bg);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.tlp-card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.byte-ruler {
  display: grid;
  grid-template-columns: repeat(4, 240px);
  min-width: 960px;
  margin-left: 104px;
  border: 1px solid var(--vp-c-divider);
  border-bottom: 0;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.byte-ruler span {
  padding: 8px 0;
  background: var(--vp-c-bg-soft);
}

.byte-ruler span + span {
  border-left: 1px solid var(--vp-c-divider);
}

.dw-list {
  min-width: 1064px;
}

.dw-row {
  display: grid;
  grid-template-columns: 92px 960px;
  gap: 12px;
  align-items: stretch;
  margin-bottom: 14px;
}

.dw-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 10px;
  background: var(--vp-c-bg-soft);
}

.dw-label strong {
  color: var(--vp-c-brand-1);
  font-size: 16px;
}

.dw-label span {
  margin-top: 4px;
  color: var(--vp-c-text-2);
  font-size: 11px;
  line-height: 1.35;
}

.dw-grid {
  display: grid;
  grid-template-columns: repeat(32, 30px);
  min-height: 72px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background-image: linear-gradient(to right, transparent 239px, var(--vp-c-divider) 240px);
  background-size: 240px 100%;
}

.field-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  padding: 6px 2px;
  background: rgba(100, 116, 139, 0.16);
  color: var(--vp-c-text-1);
  text-align: center;
  cursor: help;
}

.field-cell:hover {
  filter: saturate(1.2) brightness(1.04);
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.field-label {
  overflow: hidden;
  max-width: 100%;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field-bits {
  margin-top: 4px;
  color: var(--vp-c-text-2);
  font-size: 10px;
  font-family: var(--vp-font-family-mono);
}

.fmt { background: rgba(59, 130, 246, 0.22); }
.type { background: rgba(14, 165, 233, 0.24); }
.length { background: rgba(16, 185, 129, 0.22); }
.id { background: rgba(168, 85, 247, 0.20); }
.tag { background: rgba(236, 72, 153, 0.20); }
.addr { background: rgba(245, 158, 11, 0.22); }
.payload { background: rgba(34, 197, 94, 0.20); }
.status { background: rgba(239, 68, 68, 0.18); }
.msg { background: rgba(99, 102, 241, 0.20); }

.tlp-notes {
  margin: 18px 0 0;
  padding-left: 20px;
  color: var(--vp-c-text-2);
}

@media (max-width: 760px) {
  .tlp-hero,
  .tlp-card {
    padding: 16px;
  }
}
</style>
