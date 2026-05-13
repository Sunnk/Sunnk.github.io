<script setup lang="ts">
interface TlpField {
  label: string
  bits: [number, number]
  description: string
  href: string
  color: string
}

interface TlpWord {
  name: string
  fields: TlpField[]
}

interface TlpPacket {
  id: string
  title: string
  subtitle: string
  words: TlpWord[]
}

const bitColumns = Array.from({ length: 32 }, (_, index) => 31 - index)

const packets: TlpPacket[] = [
  {
    id: 'mem-read-3dw',
    title: 'Memory Read / Write Request (3DW Header)',
    subtitle: '32-bit address请求头，常见于低于4GB地址空间的Memory访问。',
    words: [
      {
        name: 'DW0',
        fields: [
          { label: 'Fmt', bits: [31, 29], description: '定义TLP是否包含数据以及Header长度。', href: '/PCIe/TLP/fields.html#fmt', color: 'blue' },
          { label: 'Type', bits: [28, 24], description: '定义请求类别：Memory、IO、Config或Message等。', href: '/PCIe/TLP/fields.html#type', color: 'purple' },
          { label: 'TC', bits: [22, 20], description: 'Traffic Class，用于流量分类和QoS。', href: '/PCIe/TLP/fields.html#tc', color: 'green' },
          { label: 'Attr', bits: [13, 12], description: 'No Snoop、Relaxed Ordering等属性位。', href: '/PCIe/TLP/fields.html#attr', color: 'amber' },
          { label: 'TH', bits: [16, 16], description: 'TLP Processing Hints相关标志。', href: '/PCIe/TLP/fields.html#th', color: 'rose' },
          { label: 'TD', bits: [15, 15], description: 'Digest存在标志，置位表示TLP末尾带ECRC。', href: '/PCIe/TLP/fields.html#td', color: 'cyan' },
          { label: 'EP', bits: [14, 14], description: 'Poisoned TLP标志。', href: '/PCIe/TLP/fields.html#ep', color: 'red' },
          { label: 'Length', bits: [9, 0], description: 'Payload长度，单位为DW。', href: '/PCIe/TLP/fields.html#length', color: 'indigo' },
        ],
      },
      {
        name: 'DW1',
        fields: [
          { label: 'Requester ID', bits: [31, 16], description: '发起请求的Bus/Device/Function编号。', href: '/PCIe/TLP/fields.html#requester-id', color: 'blue' },
          { label: 'Tag', bits: [15, 8], description: '用于把Completion与Request匹配。', href: '/PCIe/TLP/fields.html#tag', color: 'purple' },
          { label: 'Last BE', bits: [7, 4], description: '最后一个DW有效字节使能。', href: '/PCIe/TLP/fields.html#last-be', color: 'green' },
          { label: 'First BE', bits: [3, 0], description: '第一个DW有效字节使能。', href: '/PCIe/TLP/fields.html#first-be', color: 'amber' },
        ],
      },
      {
        name: 'DW2',
        fields: [
          { label: 'Address[31:2]', bits: [31, 2], description: '目标内存地址高位，低2位由字节使能表达。', href: '/PCIe/TLP/fields.html#address', color: 'cyan' },
          { label: 'R', bits: [1, 0], description: '保留位。', href: '/PCIe/TLP/fields.html#reserved', color: 'slate' },
        ],
      },
      {
        name: 'Data',
        fields: [
          { label: 'Payload DW0..N', bits: [31, 0], description: 'Memory Write携带数据；Memory Read无Payload。', href: '/PCIe/TLP/fields.html#payload', color: 'rose' },
        ],
      },
    ],
  },
  {
    id: 'mem-read-4dw',
    title: 'Memory Read / Write Request (4DW Header)',
    subtitle: '64-bit address请求头，多一个DW承载完整地址。',
    words: [
      {
        name: 'DW0',
        fields: [
          { label: 'Fmt', bits: [31, 29], description: '定义4DW Header以及是否带Payload。', href: '/PCIe/TLP/fields.html#fmt', color: 'blue' },
          { label: 'Type', bits: [28, 24], description: 'Memory Request类型编码。', href: '/PCIe/TLP/fields.html#type', color: 'purple' },
          { label: 'TC', bits: [22, 20], description: 'Traffic Class。', href: '/PCIe/TLP/fields.html#tc', color: 'green' },
          { label: 'Attr', bits: [13, 12], description: '请求属性。', href: '/PCIe/TLP/fields.html#attr', color: 'amber' },
          { label: 'Length', bits: [9, 0], description: 'Payload长度，单位为DW。', href: '/PCIe/TLP/fields.html#length', color: 'indigo' },
        ],
      },
      {
        name: 'DW1',
        fields: [
          { label: 'Requester ID', bits: [31, 16], description: '请求者标识。', href: '/PCIe/TLP/fields.html#requester-id', color: 'blue' },
          { label: 'Tag', bits: [15, 8], description: '事务标签。', href: '/PCIe/TLP/fields.html#tag', color: 'purple' },
          { label: 'Last BE', bits: [7, 4], description: '最后DW字节使能。', href: '/PCIe/TLP/fields.html#last-be', color: 'green' },
          { label: 'First BE', bits: [3, 0], description: '首DW字节使能。', href: '/PCIe/TLP/fields.html#first-be', color: 'amber' },
        ],
      },
      {
        name: 'DW2',
        fields: [
          { label: 'Address[63:32]', bits: [31, 0], description: '64-bit地址高32位。', href: '/PCIe/TLP/fields.html#address', color: 'cyan' },
        ],
      },
      {
        name: 'DW3',
        fields: [
          { label: 'Address[31:2]', bits: [31, 2], description: '64-bit地址低位。', href: '/PCIe/TLP/fields.html#address', color: 'cyan' },
          { label: 'R', bits: [1, 0], description: '保留位。', href: '/PCIe/TLP/fields.html#reserved', color: 'slate' },
        ],
      },
    ],
  },
  {
    id: 'completion',
    title: 'Completion / Completion with Data',
    subtitle: 'Completer返回请求状态，CplD同时携带读取数据。',
    words: [
      {
        name: 'DW0',
        fields: [
          { label: 'Fmt', bits: [31, 29], description: '区分Completion是否带数据。', href: '/PCIe/TLP/fields.html#fmt', color: 'blue' },
          { label: 'Type', bits: [28, 24], description: 'Completion类型编码。', href: '/PCIe/TLP/fields.html#type', color: 'purple' },
          { label: 'TC', bits: [22, 20], description: 'Traffic Class。', href: '/PCIe/TLP/fields.html#tc', color: 'green' },
          { label: 'Attr', bits: [13, 12], description: 'Completion属性。', href: '/PCIe/TLP/fields.html#attr', color: 'amber' },
          { label: 'Length', bits: [9, 0], description: 'CplD Payload长度；Cpl一般为0。', href: '/PCIe/TLP/fields.html#length', color: 'indigo' },
        ],
      },
      {
        name: 'DW1',
        fields: [
          { label: 'Completer ID', bits: [31, 16], description: '返回Completion的设备标识。', href: '/PCIe/TLP/fields.html#completer-id', color: 'blue' },
          { label: 'Status', bits: [15, 13], description: 'Completion状态，例如SC/UR/CRS/CA。', href: '/PCIe/TLP/fields.html#completion-status', color: 'red' },
          { label: 'BCM', bits: [12, 12], description: 'Byte Count Modified标志。', href: '/PCIe/TLP/fields.html#bcm', color: 'rose' },
          { label: 'Byte Count', bits: [11, 0], description: '本次Completion及后续剩余字节计数。', href: '/PCIe/TLP/fields.html#byte-count', color: 'cyan' },
        ],
      },
      {
        name: 'DW2',
        fields: [
          { label: 'Requester ID', bits: [31, 16], description: '原始Request的Requester ID。', href: '/PCIe/TLP/fields.html#requester-id', color: 'blue' },
          { label: 'Tag', bits: [15, 8], description: '与原始Request Tag匹配。', href: '/PCIe/TLP/fields.html#tag', color: 'purple' },
          { label: 'Lower Address', bits: [6, 0], description: '首个有效字节的低地址。', href: '/PCIe/TLP/fields.html#lower-address', color: 'green' },
        ],
      },
      {
        name: 'Data',
        fields: [
          { label: 'Payload DW0..N', bits: [31, 0], description: 'CplD携带读取数据；Cpl无Payload。', href: '/PCIe/TLP/fields.html#payload', color: 'rose' },
        ],
      },
    ],
  },
  {
    id: 'config',
    title: 'Configuration Read / Write Request',
    subtitle: '访问配置空间，常用于枚举和能力结构读取。',
    words: [
      {
        name: 'DW0',
        fields: [
          { label: 'Fmt', bits: [31, 29], description: 'Config Read不带数据，Config Write带一个DW数据。', href: '/PCIe/TLP/fields.html#fmt', color: 'blue' },
          { label: 'Type', bits: [28, 24], description: 'Cfg0/Cfg1类型编码。', href: '/PCIe/TLP/fields.html#type', color: 'purple' },
          { label: 'Length', bits: [9, 0], description: '配置请求通常为1DW。', href: '/PCIe/TLP/fields.html#length', color: 'indigo' },
        ],
      },
      {
        name: 'DW1',
        fields: [
          { label: 'Requester ID', bits: [31, 16], description: '发起配置访问的设备。', href: '/PCIe/TLP/fields.html#requester-id', color: 'blue' },
          { label: 'Tag', bits: [15, 8], description: '事务标签。', href: '/PCIe/TLP/fields.html#tag', color: 'purple' },
          { label: 'Last BE', bits: [7, 4], description: '最后DW字节使能。', href: '/PCIe/TLP/fields.html#last-be', color: 'green' },
          { label: 'First BE', bits: [3, 0], description: '首DW字节使能。', href: '/PCIe/TLP/fields.html#first-be', color: 'amber' },
        ],
      },
      {
        name: 'DW2',
        fields: [
          { label: 'Completer ID', bits: [31, 16], description: '目标设备的Bus/Device/Function编号。', href: '/PCIe/TLP/fields.html#completer-id', color: 'blue' },
          { label: 'Ext Reg', bits: [11, 8], description: '扩展配置空间寄存器编号高位。', href: '/PCIe/TLP/fields.html#extended-register', color: 'rose' },
          { label: 'Register Number', bits: [7, 2], description: '配置空间DW偏移。', href: '/PCIe/TLP/fields.html#register-number', color: 'cyan' },
          { label: 'R', bits: [1, 0], description: '保留位。', href: '/PCIe/TLP/fields.html#reserved', color: 'slate' },
        ],
      },
      {
        name: 'Data',
        fields: [
          { label: 'Write Data', bits: [31, 0], description: 'Config Write携带一个DW数据；Config Read无Payload。', href: '/PCIe/TLP/fields.html#payload', color: 'rose' },
        ],
      },
    ],
  },
]

const widthStyle = (field: TlpField) => {
  const [msb, lsb] = field.bits
  const span = msb - lsb + 1
  return {
    gridColumn: `${32 - msb} / span ${span}`,
  }
}

const bitRange = (field: TlpField) => {
  const [msb, lsb] = field.bits
  return msb === lsb ? `bit ${msb}` : `bits ${msb}:${lsb}`
}
</script>

<template>
  <section class="tlp-explorer" aria-label="PCIe TLP结构浏览器">
    <div class="tlp-legend" aria-label="交互说明">
      <span>悬停字段查看bit范围</span>
      <span>点击字段跳转解释页面</span>
      <span>每行宽度对应DW[31:0]</span>
    </div>

    <article v-for="packet in packets" :key="packet.id" :id="packet.id" class="tlp-card">
      <header class="tlp-card__header">
        <div>
          <h2>{{ packet.title }}</h2>
          <p>{{ packet.subtitle }}</p>
        </div>
        <a class="tlp-card__anchor" :href="`#${packet.id}`">#</a>
      </header>

      <div class="tlp-bit-axis" aria-hidden="true">
        <span v-for="bit in bitColumns" :key="bit">{{ bit }}</span>
      </div>

      <div class="tlp-words">
        <div v-for="word in packet.words" :key="`${packet.id}-${word.name}`" class="tlp-word">
          <div class="tlp-word__name">{{ word.name }}</div>
          <div class="tlp-word__bits">
            <a
              v-for="field in word.fields"
              :key="`${packet.id}-${word.name}-${field.label}-${field.bits.join('-')}`"
              class="tlp-field"
              :class="`tlp-field--${field.color}`"
              :style="widthStyle(field)"
              :href="field.href"
              :title="`${word.name} ${bitRange(field)}：${field.description}`"
            >
              <strong>{{ field.label }}</strong>
              <small>{{ bitRange(field) }}</small>
            </a>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
