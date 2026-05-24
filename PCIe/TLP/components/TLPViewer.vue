<template>
  <div class="tlp-viewer">
    <!-- 顶部控制栏 -->
    <div class="controls">
      <div class="controls-left">
        <div class="mode-switch">
          <button
            v-for="m in modes"
            :key="m"
            :class="{ active: mode === m }"
            @click="switchMode(m)"
          >{{ m === 'NFM' ? 'Non-Flit Mode' : 'Flit Mode' }}</button>
        </div>
      </div>
      <div class="controls-right">
        <button
          class="tooltip-toggle"
          :class="{ active: tooltipOn }"
          @click="tooltipOn = !tooltipOn"
          :title="tooltipOn ? '隐藏字段说明' : '显示字段说明'"
        >&#9432;</button>
      </div>
    </div>

    <!-- 类型选择按钮 -->
    <div class="type-bar">
      <button
        v-for="t in filteredTypes"
        :key="t.id"
        :class="{ active: currentTypeId === t.id }"
        @click="currentTypeId = t.id"
      >{{ t.name }}</button>
    </div>

    <!-- 类型描述 -->
    <div class="type-header">
      <h3>{{ currentType.name }}</h3>
      <p v-if="currentType.description" class="type-desc">{{ currentType.description }}</p>
    </div>

    <!-- TLP DW 显示区域 -->
    <div class="tlp-display">
      <div v-for="(dw, dwIdx) in currentType.dwords" :key="dwIdx" class="dw-row">
        <!-- DW 标签 -->
        <div class="dw-label">
          {{ dw.label || `DW ${dwIdx}` }}<br v-if="!dw.label" />
          <span v-if="!dw.label" class="byte-hint">{{ dwIdx === 0 ? '(Byte 0-3)' : dwIdx === 1 ? '(Byte 4-7)' : dwIdx === 2 ? '(Byte 8-11)' : '(Byte 12-15)' }}</span>
          <span v-else class="byte-hint">&nbsp;</span>
        </div>

        <!-- 字段可视化条 -->
        <div class="dw-bar">
          <!-- 字节标签行 -->
          <div class="bit-header">
            <div v-for="b in 4" :key="b" class="byte-bits">
              <span class="byte-label">Byte {{ (dwIdx * 4) + b - 1 }}</span>
              <div class="bit-nums">
                <span v-for="n in 8" :key="n">{{ 8 - n }}</span>
              </div>
            </div>
          </div>

          <!-- 字段条 -->
          <div class="field-row">
            <div
              v-for="(f, fi) in dw.fields"
              :key="fi"
              class="field-block"
              :class="fieldClass(f.name)"
              :style="fieldStyle(f)"
              :title="tooltipOn ? f.desc : ''"
              @mouseenter="(e) => onFieldEnter(e, dwIdx, f)"
              @mouseleave="hoveredField = null"
              @mousemove="onFieldMove"
            >
              <span class="field-name">{{ f.name }}</span>
            </div>
            <!-- 字节分隔线 -->
            <div class="byte-divider" style="left:25%"></div>
            <div class="byte-divider" style="left:50%"></div>
            <div class="byte-divider" style="left:75%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 字段详情浮层（悬停时显示） -->
    <div
      v-if="tooltipOn && hoveredField"
      class="field-tooltip"
      :style="tooltipStyle"
    >
      <strong>{{ hoveredField.field.name }}</strong>
      <pre>{{ hoveredField.field.desc }}</pre>
    </div>

    <!-- 图例 -->
    <details class="legend-details">
      <summary>图例 / 字段颜色说明</summary>
      <div class="legend">
        <span class="legend-item"><i class="swatch c-fmt"></i>Fmt/Type</span>
        <span class="legend-item"><i class="swatch c-tc"></i>TC</span>
        <span class="legend-item"><i class="swatch c-attr"></i>Attr</span>
        <span class="legend-item"><i class="swatch c-th"></i>TH/TD/EP</span>
        <span class="legend-item"><i class="swatch c-at"></i>AT</span>
        <span class="legend-item"><i class="swatch c-len"></i>Length</span>
        <span class="legend-item"><i class="swatch c-rid"></i>Requester ID</span>
        <span class="legend-item"><i class="swatch c-cid"></i>Completer ID</span>
        <span class="legend-item"><i class="swatch c-tag"></i>Tag</span>
        <span class="legend-item"><i class="swatch c-be"></i>Byte Enables</span>
        <span class="legend-item"><i class="swatch c-addr"></i>Address</span>
        <span class="legend-item"><i class="swatch c-msg"></i>Message Code</span>
        <span class="legend-item"><i class="swatch c-cpl"></i>Cpl Status/Byte Count</span>
        <span class="legend-item"><i class="swatch c-cfg"></i>Config (BDF/Reg)</span>
        <span class="legend-item"><i class="swatch c-ohc"></i>OHC/Flit Mode</span>
        <span class="legend-item"><i class="swatch c-r"></i>Reserved (R)</span>
      </div>
    </details>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { nfmTypes, fmTypes } from '../data/tlpData.js'

const modes = ['NFM', 'FM']
const mode = ref('NFM')
const tooltipOn = ref(true)
const currentTypeId = ref('mrd32')
const hoveredField = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })

const filteredTypes = computed(() => (mode.value === 'NFM' ? nfmTypes : fmTypes))

const currentType = computed(() => {
  const list = mode.value === 'NFM' ? nfmTypes : fmTypes
  return list.find(t => t.id === currentTypeId.value) || list[0]
})

// 模式切换时自动选择第一个可用类型
watchEffect(() => {
  const list = mode.value === 'NFM' ? nfmTypes : fmTypes
  const exists = list.some(t => t.id === currentTypeId.value)
  if (!exists && list.length > 0) currentTypeId.value = list[0].id
})

function switchMode(m) {
  mode.value = m
  const list = m === 'NFM' ? nfmTypes : fmTypes
  if (list.length > 0) currentTypeId.value = list[0].id
}

const tooltipStyle = computed(() => ({
  left: tooltipPos.value.x + 'px',
  top: tooltipPos.value.y + 'px',
}))

function fieldStyle(f) {
  const left = (f.start / 32) * 100
  const width = ((f.end - f.start + 1) / 32) * 100
  return {
    left: left + '%',
    width: width + '%',
  }
}

// 根据字段名分配 CSS 类
function fieldClass(name) {
  const n = name.toUpperCase()
  if (n.startsWith('FMT') || n.startsWith('TYPE[')) return 'color-fmt'
  if (n.startsWith('R') && n.length <= 2) return 'color-r'
  if (n.startsWith('TC')) return 'color-tc'
  if (n.startsWith('ATTR')) return 'color-attr'
  if (n === 'TH' || n === 'TD' || n === 'EP') return 'color-th'
  if (n.startsWith('AT')) return 'color-at'
  if (n.startsWith('LENGTH')) return 'color-len'
  if (n.startsWith('REQUESTER')) return 'color-rid'
  if (n.startsWith('COMPLETER')) return 'color-cid'
  if (n.startsWith('TAG')) return 'color-tag'
  if (n.includes('DW BE') || n.includes('BYTE EN')) return 'color-be'
  if (n.startsWith('ADDRESS') || n.startsWith('I/O ADDRESS')) return 'color-addr'
  if (n.startsWith('MESSAGE')) return 'color-msg'
  if (n.startsWith('CPL STATUS') || n.startsWith('BYTE COUNT') || n === 'BCM') return 'color-cpl'
  if (n.startsWith('BUS') || n.startsWith('DEVICE') || n.startsWith('FUNCTION') || n.startsWith('REGISTER') || n.startsWith('EXT REG')) return 'color-cfg'
  if (n.startsWith('LOWER ADDR')) return 'color-la'
  if (n.startsWith('OHC')) return 'color-ohc'
  return 'color-other'
}

// 鼠标悬停事件
function onFieldEnter(e, dwIdx, f) {
  hoveredField.value = { dw: dwIdx, field: f }
  updateTooltipPos(e)
}

function onFieldMove(e) {
  if (hoveredField.value) updateTooltipPos(e)
}

function updateTooltipPos(e) {
  tooltipPos.value = {
    x: e.clientX,
    y: e.clientY + 18,
  }
}
</script>

<style scoped>
/* ===== 整体容器 ===== */
.tlp-viewer {
  font-family: var(--vp-font-family-mono, 'Cascadia Code', 'Fira Code', monospace);
  padding: 16px 0;
}

/* ===== 控制栏 ===== */
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.mode-switch {
  display: flex;
  gap: 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.mode-switch button {
  padding: 6px 16px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: background 0.15s, color 0.15s;
}

.mode-switch button.active {
  background: var(--vp-c-brand);
  color: var(--vp-c-bg);
  font-weight: 600;
}

.mode-switch button:not(.active):hover {
  background: var(--vp-c-bg-mute);
}

.tooltip-toggle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.tooltip-toggle.active {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-light);
}

/* ===== 类型选择按钮 ===== */
.type-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
}

.type-bar button {
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.12s;
}

.type-bar button:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.type-bar button.active {
  background: var(--vp-c-brand);
  color: var(--vp-c-bg);
  border-color: var(--vp-c-brand);
  font-weight: 600;
}

/* ===== 类型标题 ===== */
.type-header {
  margin-bottom: 20px;
}

.type-header h3 {
  margin: 0 0 4px;
  font-size: 18px;
  color: var(--vp-c-text-1);
}

.type-desc {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-base);
}

/* ===== DW 显示区域 ===== */
.tlp-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dw-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.dw-label {
  flex-shrink: 0;
  width: 90px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  padding-top: 22px;
  line-height: 1.3;
}

.byte-hint {
  font-size: 10px;
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.dw-bar {
  flex: 1;
  min-width: 0;
}

/* ===== 位标头 ===== */
.bit-header {
  display: flex;
  margin-bottom: 4px;
}

.byte-bits {
  flex: 1;
  text-align: center;
  border-left: 1px dashed var(--vp-c-divider);
}
.byte-bits:first-child {
  border-left: none;
}

.byte-label {
  display: block;
  font-size: 10px;
  color: var(--vp-c-text-3);
  margin-bottom: 2px;
}

.bit-nums {
  display: flex;
  justify-content: space-between;
  padding: 0 1px;
}

.bit-nums span {
  width: 12.5%;
  font-size: 9px;
  color: var(--vp-c-text-3);
  text-align: center;
}

/* ===== 字段条 ===== */
.field-row {
  position: relative;
  height: 36px;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  overflow: visible;
}

.field-block {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(255,255,255,0.3);
  overflow: hidden;
  cursor: default;
  transition: filter 0.1s, transform 0.1s;
  box-sizing: border-box;
}

.field-block:last-child {
  border-right: none;
}

.field-block:hover {
  filter: brightness(1.15);
  transform: scaleY(1.08);
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.field-name {
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 3px;
  line-height: 1;
}

/* 字节分隔线 */
.byte-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-divider);
  pointer-events: none;
  z-index: 3;
}

/* ===== 字段颜色 ===== */
.color-fmt  { background: #3b82f6; } /* blue - Fmt/Type */
.color-r    { background: #9ca3af; } /* gray - Reserved */
.color-tc   { background: #06b6d4; } /* cyan - TC */
.color-attr { background: #8b5cf6; } /* violet - Attr */
.color-th   { background: #f59e0b; } /* amber - TH/TD/EP */
.color-at   { background: #10b981; } /* emerald - AT */
.color-len  { background: #ef4444; } /* red - Length */
.color-rid  { background: #f97316; } /* orange - Requester ID */
.color-cid  { background: #ec4899; } /* pink - Completer ID */
.color-tag  { background: #a855f7; } /* purple - Tag */
.color-be   { background: #ca8a04; } /* yellow-dark - Byte Enables */
.color-addr { background: #16a34a; } /* green - Address */
.color-msg  { background: #4f46e5; } /* indigo - Message Code */
.color-cpl  { background: #0d9488; } /* teal - Cpl Status/Byte Count */
.color-cfg  { background: #0891b2; } /* deep cyan - Config */
.color-la   { background: #65a30d; } /* lime - Lower Address */
.color-ohc  { background: #6366f1; } /* indigo-light - OHC */
.color-other { background: #71717a; } /* zinc - other */

/* 暗色模式下稍微调整 */
html.dark .color-r    { background: #6b7280; }
html.dark .color-be   { background: #a16207; }
html.dark .color-addr { background: #15803d; }
html.dark .color-len  { background: #dc2626; }

/* ===== 字段详情浮层 ===== */
.field-tooltip {
  position: fixed;
  z-index: 1000;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand);
  border-radius: 6px;
  padding: 10px 14px;
  max-width: 360px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  pointer-events: none;
  transform: translate(-50%, 0);
}

.field-tooltip strong {
  display: block;
  font-size: 13px;
  color: var(--vp-c-brand);
  margin-bottom: 4px;
}

.field-tooltip pre {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
  font-family: inherit;
}

/* ===== 图例 ===== */
.legend-details {
  margin-top: 24px;
  font-size: 12px;
  font-family: var(--vp-font-family-base);
}

.legend-details summary {
  cursor: pointer;
  color: var(--vp-c-text-2);
  user-select: none;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
}

/* 图例色块 */
.c-fmt  { background: #3b82f6; }
.c-tc   { background: #06b6d4; }
.c-attr { background: #8b5cf6; }
.c-th   { background: #f59e0b; }
.c-at   { background: #10b981; }
.c-len  { background: #ef4444; }
.c-rid  { background: #f97316; }
.c-cid  { background: #ec4899; }
.c-tag  { background: #a855f7; }
.c-be   { background: #ca8a04; }
.c-addr { background: #16a34a; }
.c-msg  { background: #4f46e5; }
.c-cpl  { background: #0d9488; }
.c-cfg  { background: #0891b2; }
.c-ohc  { background: #6366f1; }
.c-r    { background: #9ca3af; }

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .dw-row {
    flex-direction: column;
    gap: 2px;
  }
  .dw-label {
    width: auto;
    text-align: left;
    padding-top: 0;
    font-size: 13px;
  }
  .field-name {
    font-size: 8px;
  }
  .field-row {
    height: 28px;
  }
  .type-bar {
    gap: 3px;
  }
  .type-bar button {
    padding: 3px 7px;
    font-size: 11px;
  }
}
</style>
