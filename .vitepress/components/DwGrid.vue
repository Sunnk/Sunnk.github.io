<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import FieldCell from './FieldCell.vue'
import type { DwRow, TlpField } from './tlpData/types'
import { fieldDocs } from './tlpData/fieldDocs.generated'

const props = defineProps<{
  rows: DwRow[]
}>()

const selectedField = ref<TlpField | null>(null)

function selectField(field: TlpField) {
  selectedField.value = field
}


interface CellDisplay {
  field: TlpField
  left: number
  width: number
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

  cells.sort((a, b) => a.left - b.left)
  return { label: row.label, isData: false, byteOffset, cells }
}

const displayRows = computed(() => {
  return props.rows.map((row, index) => getRowDisplay(row, index))
})

const firstField = computed(() => {
  for (const row of displayRows.value) {
    const cell = row.cells.find(c => !c.field.reserved) || row.cells[0]
    if (cell) return cell.field
  }
  return null
})

watch(
  () => props.rows,
  () => {
    selectedField.value = firstField.value
  },
  { immediate: true }
)

</script>

<template>
  <div class="dw-grid">
    <div class="grid-table">
      <template v-for="(row, dwIndex) in displayRows" :key="dwIndex">
        <div class="dw-row byte-header">
          <div class="dw-label">
            <strong>{{ row.label }}</strong>
            <span>(Byte {{ row.byteOffset }} - {{ row.byteOffset + 3 }})</span>
          </div>
          <div class="byte-labels">
            <div v-for="b in 4" :key="b" class="byte-label">
              Byte {{ row.byteOffset + b - 1 }}
            </div>
          </div>
        </div>

        <div class="dw-row">
          <div class="dw-label bit-label">
            <span>bit 7</span>
            <span>0</span>
          </div>
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
                :selected="selectedField?.name === cell.field.name"
                @click="selectField"
              />
            </template>
          </div>
        </div>
      </template>
    </div>

    <section v-if="selectedField" class="field-detail">
      <h2>字段详情（当前选中：{{ selectedField.name }}）</h2>
      <div class="field-doc-container">
        <div v-if="fieldDocs[selectedField.name]?.html" class="field-doc" v-html="fieldDocs[selectedField.name].html" />
        <div v-else class="field-doc field-doc-placeholder">{{ selectedField.description || '（待补充）' }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dw-grid {
  width: 100%;
  font-family: var(--vp-font-family-base);
}

.grid-table {
  border-top: 1px solid #e5e7eb;
}
.dw-row {
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  align-items: stretch;
}
.byte-header {
  margin-top: 12px;
  color: #0f172a;
}
.dw-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding: 0 10px 0 0;
  color: #0f172a;
  font-size: 12px;
  line-height: 1.25;
}
.dw-label strong {
  font-size: 13px;
}
.dw-label span {
  color: #2563eb;
  font-size: 11px;
}
.bit-label {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #64748b;
}
.byte-labels {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  min-height: 22px;
}
.byte-label {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  border: 1px solid #d1d5db;
  border-bottom: 0;
  background: #f8fafc;
}
.byte-label + .byte-label {
  border-left: 0;
}

.fields-box {
  display: flex;
  align-items: stretch;
  gap: 0;
  min-height: 32px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  box-sizing: border-box;
}
.fields-box.data-box {
  justify-content: center;
  background: var(--tlp-data-bg);
  color: var(--tlp-data-fg);
  border-color: var(--tlp-data-border);
}
.data-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  font-size: 12px;
  color: var(--tlp-data-fg);
}

.field-detail {
  margin-top: 20px;
  border-top: 1px solid #e5e7eb;
  color: #0f172a;
}
.field-detail h2 {
  padding: 13px 0 7px;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.4;
}
.field-doc-container {
  border: 1px solid #e5e7eb;
  border-top: 0;
}
.field-doc {
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.7;
  color: #1f2937;
}
.field-doc-placeholder {
  color: #9ca3af;
  font-style: italic;
}
.field-doc :deep(h2) {
  margin: 16px 0 8px;
  padding-bottom: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 1px solid #e5e7eb;
}
.field-doc :deep(h2:first-child) {
  margin-top: 0;
}
.field-doc :deep(h3) {
  margin: 12px 0 6px;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}
.field-doc :deep(p) {
  margin: 6px 0;
}
.field-doc :deep(table) {
  margin: 10px 0;
  border-collapse: collapse;
  width: 100%;
}
.field-doc :deep(th),
.field-doc :deep(td) {
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  text-align: left;
  font-size: 12px;
}
.field-doc :deep(th) {
  background: #f1f5f9;
  font-weight: 700;
  color: #334155;
}
.field-doc :deep(td) {
  background: #ffffff;
}
.field-doc :deep(code) {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  background: #f1f5f9;
  padding: 1px 4px;
  border-radius: 3px;
}
.field-doc :deep(ul),
.field-doc :deep(ol) {
  margin: 6px 0;
  padding-left: 20px;
}
.field-doc :deep(li) {
  margin: 3px 0;
}
</style>
