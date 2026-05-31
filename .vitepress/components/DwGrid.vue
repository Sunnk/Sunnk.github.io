<script setup lang="ts">
import { ref, computed } from 'vue'
import FieldCell from './FieldCell.vue'
import Tooltip from './Tooltip.vue'
import type { DwRow, TlpField } from './tlpData/types'

const props = defineProps<{
  rows: DwRow[]
}>()

// Info bar state
const tooltipField = ref<TlpField | null>(null)
const tooltipVisible = ref(false)
let tooltipTimer: ReturnType<typeof setTimeout> | null = null

function onFieldEnter(_e: MouseEvent, field: TlpField) {
  if (tooltipTimer) clearTimeout(tooltipTimer)
  tooltipTimer = setTimeout(() => {
    tooltipField.value = field
    tooltipVisible.value = true
  }, 80)
}

function onFieldLeave() {
  if (tooltipTimer) clearTimeout(tooltipTimer)
  tooltipVisible.value = false
}

// Compute DW row display data
interface CellDisplay {
  field: TlpField
  left: number   // visual left edge in bits (0~31)
  width: number  // visual width in bits
}

interface RowDisplay {
  label: string
  isData: boolean
  byteOffset: number
  cells: CellDisplay[]
}

function getRowDisplay(row: DwRow, dwIndex: number): RowDisplay {
  const byteOffset = dwIndex * 4
  if (row.isData) {
    return { label: row.label, isData: true, byteOffset, cells: [] }
  }

  // Merge same-field segments within this DW into one cell
  const fieldMap = new Map<string, { field: TlpField; segments: Array<{ byteIndex: number; msb: number; lsb: number }> }>()
  for (const field of row.fields) {
    for (const seg of field.segments) {
      if (seg.byteIndex >= byteOffset && seg.byteIndex < byteOffset + 4) {
        const existing = fieldMap.get(field.name)
        if (existing) {
          existing.segments.push(seg)
        } else {
          fieldMap.set(field.name, { field, segments: [seg] })
        }
      }
    }
  }

  const cells: CellDisplay[] = []
  for (const [, { field, segments }] of fieldMap) {
    let left = 32
    let right = 0
    for (const seg of segments) {
      const segByteOffset = seg.byteIndex - byteOffset
      const l = segByteOffset * 8 + (7 - seg.msb)
      const r = segByteOffset * 8 + (7 - seg.lsb)
      left = Math.min(left, l)
      right = Math.max(right, r)
    }
    cells.push({
      field: {
        ...field,
        segments: segments.sort((a, b) => {
          if (a.byteIndex !== b.byteIndex) return a.byteIndex - b.byteIndex
          return b.msb - a.msb
        })
      },
      left,
      width: right - left + 1
    })
  }

  // Sort left to right
  cells.sort((a, b) => a.left - b.left)

  return { label: row.label, isData: false, byteOffset, cells }
}

// Compute DW rows with proper index
const displayRows = computed(() => {
  return props.rows.map((row, index) => getRowDisplay(row, index))
})
</script>

<template>
  <div class="dw-grid">
    <!-- Bit Ruler -->
    <div class="dw-row ruler">
      <div class="label-spacer"></div>
      <div class="ruler-content">
        <template v-for="b in 4" :key="b">
          <div class="byte-group">
            <span class="ruler-msb">{{ (b - 1) * 8 + 7 }}</span>
            <span class="ruler-lsb">{{ (b - 1) * 8 }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- DW Rows -->
    <template v-for="(row, dwIndex) in displayRows" :key="dwIndex">
      <div class="dw-row" :class="{ 'data-row': row.isData }">
        <div class="dw-label">{{ row.label }}</div>
        <div class="fields-box" :class="{ 'data-box': row.isData }">
          <template v-if="row.isData">
            <div class="data-placeholder">Data Payload (N DW)</div>
          </template>
          <template v-else>
            <FieldCell
              v-for="(cell, ci) in row.cells"
              :key="ci"
              :field="cell.field"
              :label="cell.field.name"
              :totalBits="32"
              @mouseenter="onFieldEnter"
              @mouseleave="onFieldLeave"
            />
          </template>
        </div>
      </div>
    </template>

    <Tooltip
      :field="tooltipField"
      :visible="tooltipVisible"
    />
  </div>
</template>

<style scoped>
.dw-grid {
  width: 100%;
  font-family: var(--vp-font-family-mono);
}

/* Ruler row */
.dw-row.ruler {
  display: flex;
  align-items: flex-end;
  height: 20px;
  margin-bottom: 2px;
}
.label-spacer {
  width: 48px;
  flex-shrink: 0;
}
.ruler-content {
  flex: 1;
  display: flex;
  border-left: 1px solid var(--vp-c-divider);
}
.byte-group {
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
  font-size: 10px;
  color: var(--vp-c-text-3);
  border-right: 1px solid var(--vp-c-divider);
}
.byte-group:last-child {
  border-right: none;
}

/* DW data rows */
.dw-row {
  display: flex;
  align-items: stretch;
  margin-bottom: 2px;
}
.dw-label {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.fields-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 2px;
  box-sizing: border-box;
}
.fields-box.data-box {
  background: var(--tlp-data-bg);
  color: var(--tlp-data-fg);
  border-color: var(--tlp-data-border);
  justify-content: center;
  border-radius: 4px;
}
.data-placeholder {
  font-size: 12px;
  color: var(--tlp-data-fg);
  opacity: 0.8;
  padding: 8px;
}
</style>
