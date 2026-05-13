<script setup lang="ts">
interface TlpField {
  label: string
  bits: [number, number]
  description: string
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
  badge: string
  words: TlpWord[]
}

const bitColumns = Array.from({ length: 32 }, (_, index) => 31 - index)

/**
 * 静态维护说明：
 * 1. 新增包类型：在 packets 数组中复制一个 TlpPacket 对象，修改 id/title/subtitle/badge/words。
 * 2. 新增字段：在对应 DW 的 fields 中调用 field('Name', msb, lsb, '说明', '颜色')。
 * 3. 为避免显示错位，同一个 DW 内字段建议按 bit31 -> bit0 排列，并用 R/Reserved 补齐空洞。
 */
const field = (
  label: string,
  msb: number,
  lsb: number,
  description: string,
  color: TlpField['color'] = 'slate',
): TlpField => ({ label, bits: [msb, lsb], description, color })

const packets: TlpPacket[] = [
  {
    id: 'mem-request-3dw',
    title: 'Memory Read / Write Request',
    subtitle: '3DW Header，32-bit address，常见于低于 4GB 地址空间的 Memory 访问。',
    badge: '3DW / 32-bit Address',
    words: [
      {
        name: 'DW0',
        fields: [
          field('Fmt', 31, 29, '定义 TLP 是否包含数据以及 Header 长度。', 'blue'),
          field('Type', 28, 24, '定义请求类别：Memory、IO、Config 或 Message 等。', 'purple'),
          field('R', 23, 23, '保留位，按规范写入固定值。'),
          field('TC', 22, 20, 'Traffic Class，用于流量分类和 QoS。', 'green'),
          field('R', 19, 17, '保留位，按规范写入固定值。'),
          field('TH', 16, 16, 'TLP Processing Hints 相关标志。', 'rose'),
          field('TD', 15, 15, 'Digest 存在标志，置位表示 TLP 末尾带 ECRC。', 'cyan'),
          field('EP', 14, 14, 'Poisoned TLP 标志。', 'red'),
          field('Attr', 13, 12, 'No Snoop、Relaxed Ordering 等属性位。', 'amber'),
          field('R', 11, 10, '保留位，按规范写入固定值。'),
          field('Length', 9, 0, 'Payload 长度，单位为 DW。', 'indigo'),
        ],
      },
      {
        name: 'DW1',
        fields: [
          field('Requester ID', 31, 16, '发起请求的 Bus / Device / Function 编号。', 'blue'),
          field('Tag', 15, 8, '用于把 Completion 与 Request 匹配。', 'purple'),
          field('Last BE', 7, 4, '最后一个 DW 有效字节使能。', 'green'),
          field('First BE', 3, 0, '第一个 DW 有效字节使能。', 'amber'),
        ],
      },
      {
        name: 'DW2',
        fields: [
          field('Address[31:2]', 31, 2, '目标内存地址高位，低 2 位由字节使能表达。', 'cyan'),
          field('R', 1, 0, '保留位。'),
        ],
      },
      {
        name: 'Data',
        fields: [
          field('Payload DW0..N', 31, 0, 'Memory Write 携带数据；Memory Read 无 Payload。', 'rose'),
        ],
      },
    ],
  },
  {
    id: 'mem-request-4dw',
    title: 'Memory Read / Write Request',
    subtitle: '4DW Header，64-bit address，多一个 DW 承载完整地址。',
    badge: '4DW / 64-bit Address',
    words: [
      {
        name: 'DW0',
        fields: [
          field('Fmt', 31, 29, '定义 4DW Header 以及是否带 Payload。', 'blue'),
          field('Type', 28, 24, 'Memory Request 类型编码。', 'purple'),
          field('R', 23, 23, '保留位，按规范写入固定值。'),
          field('TC', 22, 20, 'Traffic Class。', 'green'),
          field('R', 19, 14, '保留 / 控制位，按具体协议版本确认。'),
          field('Attr', 13, 12, '请求属性。', 'amber'),
          field('R', 11, 10, '保留位，按规范写入固定值。'),
          field('Length', 9, 0, 'Payload 长度，单位为 DW。', 'indigo'),
        ],
      },
      {
        name: 'DW1',
        fields: [
          field('Requester ID', 31, 16, '请求者标识。', 'blue'),
          field('Tag', 15, 8, '事务标签。', 'purple'),
          field('Last BE', 7, 4, '最后 DW 字节使能。', 'green'),
          field('First BE', 3, 0, '首 DW 字节使能。', 'amber'),
        ],
      },
      {
        name: 'DW2',
        fields: [field('Address[63:32]', 31, 0, '64-bit 地址高 32 位。', 'cyan')],
      },
      {
        name: 'DW3',
        fields: [
          field('Address[31:2]', 31, 2, '64-bit 地址低位。', 'cyan'),
          field('R', 1, 0, '保留位。'),
        ],
      },
    ],
  },
  {
    id: 'completion',
    title: 'Completion / Completion with Data',
    subtitle: 'Completer 返回请求状态，CplD 同时携带读取数据。',
    badge: 'Cpl / CplD',
    words: [
      {
        name: 'DW0',
        fields: [
          field('Fmt', 31, 29, '区分 Completion 是否带数据。', 'blue'),
          field('Type', 28, 24, 'Completion 类型编码。', 'purple'),
          field('R', 23, 23, '保留位，按规范写入固定值。'),
          field('TC', 22, 20, 'Traffic Class。', 'green'),
          field('R', 19, 14, '保留 / 控制位，按具体协议版本确认。'),
          field('Attr', 13, 12, 'Completion 属性。', 'amber'),
          field('R', 11, 10, '保留位，按规范写入固定值。'),
          field('Length', 9, 0, 'CplD Payload 长度；Cpl 一般为 0。', 'indigo'),
        ],
      },
      {
        name: 'DW1',
        fields: [
          field('Completer ID', 31, 16, '返回 Completion 的设备标识。', 'blue'),
          field('Status', 15, 13, 'Completion 状态，例如 SC / UR / CRS / CA。', 'red'),
          field('BCM', 12, 12, 'Byte Count Modified 标志。', 'rose'),
          field('Byte Count', 11, 0, '本次 Completion 及后续剩余字节计数。', 'cyan'),
        ],
      },
      {
        name: 'DW2',
        fields: [
          field('Requester ID', 31, 16, '原始 Request 的 Requester ID。', 'blue'),
          field('Tag', 15, 8, '与原始 Request Tag 匹配。', 'purple'),
          field('R', 7, 7, '保留位。'),
          field('Lower Address', 6, 0, '首个有效字节的低地址。', 'green'),
        ],
      },
      {
        name: 'Data',
        fields: [field('Payload DW0..N', 31, 0, 'CplD 携带读取数据；Cpl 无 Payload。', 'rose')],
      },
    ],
  },
  {
    id: 'config-request',
    title: 'Configuration Read / Write Request',
    subtitle: '访问配置空间，常用于枚举和能力结构读取。',
    badge: 'CfgRd / CfgWr',
    words: [
      {
        name: 'DW0',
        fields: [
          field('Fmt', 31, 29, 'Config Read 不带数据，Config Write 带一个 DW 数据。', 'blue'),
          field('Type', 28, 24, 'Cfg0 / Cfg1 类型编码。', 'purple'),
          field('R', 23, 10, '保留 / 控制位，按具体协议版本确认。'),
          field('Length', 9, 0, '配置请求通常为 1DW。', 'indigo'),
        ],
      },
      {
        name: 'DW1',
        fields: [
          field('Requester ID', 31, 16, '发起配置访问的设备。', 'blue'),
          field('Tag', 15, 8, '事务标签。', 'purple'),
          field('Last BE', 7, 4, '最后 DW 字节使能。', 'green'),
          field('First BE', 3, 0, '首 DW 字节使能。', 'amber'),
        ],
      },
      {
        name: 'DW2',
        fields: [
          field('Completer ID', 31, 16, '目标设备的 Bus / Device / Function 编号。', 'blue'),
          field('R', 15, 12, '保留位。'),
          field('Ext Reg', 11, 8, '扩展配置空间寄存器编号高位。', 'rose'),
          field('Register Number', 7, 2, '配置空间 DW 偏移。', 'cyan'),
          field('R', 1, 0, '保留位。'),
        ],
      },
      {
        name: 'Data',
        fields: [field('Write Data', 31, 0, 'Config Write 携带一个 DW 数据；Config Read 无 Payload。', 'rose')],
      },
    ],
  },
]

const widthStyle = (tlpField: TlpField) => {
  const [msb, lsb] = tlpField.bits
  const span = msb - lsb + 1
  return {
    gridColumn: `${32 - msb} / span ${span}`,
  }
}

const bitRange = (tlpField: TlpField) => {
  const [msb, lsb] = tlpField.bits
  return msb === lsb ? `bit ${msb}` : `bits ${msb}:${lsb}`
}
</script>

<template>
  <section class="tlp-explorer" aria-label="PCIe TLP 结构浏览器">
    <div class="tlp-legend" aria-label="页面说明">
      <span>字段只展示说明，不再点击跳转</span>
      <span>每个 DW 固定 32 列，避免错位</span>
      <span>新增类型只需扩展 packets 静态数据</span>
    </div>

    <article v-for="packet in packets" :key="packet.id" :id="packet.id" class="tlp-card">
      <header class="tlp-card__header">
        <div>
          <span class="tlp-card__badge">{{ packet.badge }}</span>
          <h2>{{ packet.title }}</h2>
          <p>{{ packet.subtitle }}</p>
        </div>
      </header>

      <div class="tlp-map" role="table" :aria-label="packet.title">
        <div class="tlp-bit-axis" role="row" aria-hidden="true">
          <span class="tlp-axis-spacer"></span>
          <span v-for="bit in bitColumns" :key="bit">{{ bit }}</span>
        </div>

        <div class="tlp-words">
          <div v-for="word in packet.words" :key="`${packet.id}-${word.name}`" class="tlp-word" role="row">
            <div class="tlp-word__name" role="rowheader">{{ word.name }}</div>
            <div class="tlp-word__bits" role="cell">
              <div
                v-for="tlpField in word.fields"
                :key="`${packet.id}-${word.name}-${tlpField.label}-${tlpField.bits.join('-')}`"
                class="tlp-field"
                :class="`tlp-field--${tlpField.color}`"
                :style="widthStyle(tlpField)"
                :title="`${word.name} ${bitRange(tlpField)}：${tlpField.description}`"
              >
                <strong>{{ tlpField.label }}</strong>
                <small>{{ bitRange(tlpField) }}</small>
                <span>{{ tlpField.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
