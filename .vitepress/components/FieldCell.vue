<script setup lang="ts">
import { computed } from 'vue'
import type { TlpField } from './tlpData/types'
import { computeFieldBitRange, computeFieldBitWidth } from './tlpData/types'

const props = defineProps<{
  field: TlpField
  label?: string
  totalBits: number
  selected?: boolean
}>()

defineEmits<{
  click: [field: TlpField]
}>()

const widthPercent = computed(() => (computeFieldBitWidth(props.field) / props.totalBits) * 100)
const isReserved = computed(() => props.field.reserved || false)
const category = computed(() => props.field.category)
const displayName = computed(() => props.label || props.field.name)
const bitRange = computed(() => computeFieldBitRange(props.field.segments))
</script>

<template>
  <div
    class="field-cell"
    :class="[`cat-${category}`, { reserved: isReserved, selected }]"
    :style="{ width: widthPercent + '%' }"
    @click="$emit('click', field)"
  >
    <div class="field-content">
      <span class="field-label">{{ displayName }}</span>
      <span class="field-bits">{{ bitRange }}</span>
    </div>
  </div>
</template>

<style scoped>
.field-cell {
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  background: var(--field-bg);
  color: var(--field-fg);
  border: 1px solid var(--field-border);
  border-top: 0;
  border-bottom: 0;
  border-left: 0;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: none;
}
.field-cell:last-child {
  border-right: 0;
}
.field-cell.selected {
  box-shadow: inset 0 0 0 2px currentColor;
}
.field-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  padding: 2px 4px;
  width: 100%;
  pointer-events: none;
}
.field-label {
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  line-height: 1.2;
}
.field-bits {
  display: block;
  font-size: 9px;
  font-family: var(--vp-font-family-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  opacity: 0.72;
  line-height: 1.2;
}

/* Category colors — set via CSS variables on the parent */
.cat-ctrl {
  --field-bg: var(--tlp-ctrl-bg);
  --field-fg: var(--tlp-ctrl-fg);
  --field-border: var(--tlp-ctrl-border);
}
.cat-id {
  --field-bg: var(--tlp-id-bg);
  --field-fg: var(--tlp-id-fg);
  --field-border: var(--tlp-id-border);
}
.cat-addr {
  --field-bg: var(--tlp-addr-bg);
  --field-fg: var(--tlp-addr-fg);
  --field-border: var(--tlp-addr-border);
}
.cat-size {
  --field-bg: var(--tlp-size-bg);
  --field-fg: var(--tlp-size-fg);
  --field-border: var(--tlp-size-border);
}
.cat-status {
  --field-bg: var(--tlp-status-bg);
  --field-fg: var(--tlp-status-fg);
  --field-border: var(--tlp-status-border);
}
.cat-data {
  --field-bg: var(--tlp-data-bg);
  --field-fg: var(--tlp-data-fg);
  --field-border: var(--tlp-data-border);
}
.cat-prefix {
  --field-bg: var(--tlp-prefix-bg);
  --field-fg: var(--tlp-prefix-fg);
  --field-border: var(--tlp-prefix-border);
}
.cat-rsvd {
  --field-bg: var(--tlp-rsvd-bg);
  --field-fg: var(--tlp-rsvd-fg);
  --field-border: var(--tlp-rsvd-border);
}
.reserved .field-label {
  font-style: italic;
  font-weight: normal;
}
.reserved .field-bits {
  font-style: normal;
}
</style>
