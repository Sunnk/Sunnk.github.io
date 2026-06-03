<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DwGrid from './DwGrid.vue'
import { allTlpTypes, navGroups } from './tlpData'
import type { DwRow } from './tlpData'

const selectedTypeId = ref<string>('')
const selectedVariantId = ref<string>('')
const mode = ref<'nfm' | 'fm'>('nfm')
const activeGroupId = ref<string>('')

const selectedType = computed(() =>
  allTlpTypes.find(t => t.id === selectedTypeId.value) || null
)

const hasVariants = computed(() =>
  (selectedType.value?.variants?.length ?? 0) > 1
)

const selectedVariant = computed(() => {
  if (!selectedType.value?.variants) return null
  return selectedType.value.variants.find(v => v.id === selectedVariantId.value)
    || selectedType.value.variants[0]
})

const currentDws = computed((): DwRow[] => {
  const t = selectedType.value
  if (!t) return []
  if (hasVariants.value && selectedVariant.value) {
    return mode.value === 'fm'
      ? (selectedVariant.value.fmDws?.length ? selectedVariant.value.fmDws : selectedVariant.value.nfmDws)
      : selectedVariant.value.nfmDws
  }
  return mode.value === 'fm' && t.fmDws?.length ? t.fmDws : t.nfmDws
})

const currentLabel = computed(() => {
  if (!selectedType.value) return ''
  let label = selectedType.value.label
  if (hasVariants.value && selectedVariant.value) {
    label += ' - ' + selectedVariant.value.label
  }
  return label
})

const hasFmData = computed(() => {
  const t = selectedType.value
  if (!t) return false
  if (hasVariants.value && selectedVariant.value) {
    return !!(selectedVariant.value.fmDws?.length)
  }
  return !!(t.fmDws?.length)
})

function selectGroup(groupId: string) {
  activeGroupId.value = groupId
}

function selectType(typeId: string) {
  const t = allTlpTypes.find(t => t.id === typeId)
  if (!t) return
  selectedTypeId.value = typeId
  activeGroupId.value = t.group
  selectedVariantId.value = t.variants?.length ? t.variants[0].id : ''
  if (mode.value === 'fm' && !currentDws.value.length) {
    mode.value = 'nfm'
  }
  updateHash()
}

function selectVariant(variantId: string) {
  selectedVariantId.value = variantId
  updateHash()
}

function updateHash() {
  if (selectedTypeId.value) {
    window.history.replaceState(null, '', '#' + selectedTypeId.value)
  }
}

function loadFromHash() {
  const hash = window.location.hash.slice(1)
  if (hash && allTlpTypes.find(t => t.id === hash)) {
    selectType(hash)
  } else if (allTlpTypes.length) {
    selectType(allTlpTypes[0].id)
  }
}

onMounted(() => {
  loadFromHash()
  window.addEventListener('hashchange', loadFromHash)
})

if (!selectedTypeId.value && allTlpTypes.length) {
  selectedTypeId.value = allTlpTypes[0].id
  selectedVariantId.value = allTlpTypes[0].variants?.length ? allTlpTypes[0].variants[0].id : ''
  activeGroupId.value = allTlpTypes[0].group
}
</script>

<template>
  <div class="tlp-viewer">
    <aside class="tlp-sidebar">
      <div class="sidebar-title">
        <strong>PCIe TLP 包格式查询</strong>
        <span>按 DW 展示一次完整字段布局</span>
      </div>

      <nav class="tlp-nav">
        <section v-for="group in navGroups" :key="group.id" class="nav-section">
          <button
            class="group-btn"
            :class="{ active: activeGroupId === group.id }"
            @click="selectGroup(group.id)"
          >
            {{ group.label }}
          </button>
          <div v-show="activeGroupId === group.id" class="type-panel">
            <button
              v-for="t in group.types"
              :key="t.id"
              class="type-btn"
              :class="{ active: selectedTypeId === t.id }"
              @click="selectType(t.id)"
            >
              {{ t.label }}
            </button>
          </div>
        </section>
      </nav>

      <div class="sidebar-note">
        <strong>说明</strong>
        <span>单击字段可查看详情。</span>
      </div>
    </aside>

    <div class="small-screen-hint">
      此工具建议在桌面端或横屏模式下使用（最小 900px）。
    </div>

    <main v-if="selectedType" class="viewer-content">
      <header class="viewer-toolbar">
        <div class="current-type">
          <span>当前类型:</span>
          <strong>{{ currentLabel }}</strong>
        </div>

        <div class="header-actions">
          <div v-if="hasVariants" class="variant-bar" aria-label="地址格式">
            <button
              v-for="v in selectedType!.variants"
              :key="v.id"
              class="variant-btn"
              :class="{ active: selectedVariantId === v.id }"
              @click="selectVariant(v.id)"
            >
              {{ v.label }}
            </button>
          </div>
          <div class="mode-toggle">
            <button
              :class="{ active: mode === 'nfm' }"
              @click="mode = 'nfm'"
            >Non-Flit Mode</button>
            <button
              :class="{ active: mode === 'fm', disabled: !hasFmData }"
              :title="hasFmData ? '' : '当前类型暂无 Flit Mode 数据'"
              @click="hasFmData && (mode = 'fm')"
            >Flit Mode</button>
          </div>
        </div>
      </header>

      <div class="grid-heading">
        <span>展示格式：按 DW（32 bits）</span>
        <div class="legend">
          <span class="legend-item ctrl">Header</span>
          <span class="legend-item addr">Address</span>
          <span class="legend-item data">Data</span>
          <span class="legend-item status">Digest</span>
          <span class="legend-item rsvd">其他</span>
        </div>
      </div>

      <DwGrid :rows="currentDws" />
    </main>
  </div>
</template>

<style scoped>
.tlp-viewer {
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  margin: 0;
  display: grid;
  grid-template-columns: 224px minmax(0, 1fr);
  --tlp-surface: color-mix(in srgb, var(--vp-c-bg-soft) 82%, transparent);
  --tlp-surface-strong: color-mix(in srgb, var(--vp-c-bg-elv) 92%, transparent);
  --tlp-line: color-mix(in srgb, var(--vp-c-divider) 78%, transparent);
  border: 0;
  border-radius: 0;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: none;
}

.tlp-sidebar {
  min-height: 100%;
  padding: 16px 12px;
  color: #dbeafe;
  background: #10243a;
}
.sidebar-title {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 2px 4px 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.24);
}
.sidebar-title strong {
  color: #f8fafc;
  font-size: 16px;
  line-height: 1.3;
}
.sidebar-title span,
.sidebar-note span {
  color: #9fb4ce;
  font-size: 12px;
  line-height: 1.55;
}
.tlp-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 14px;
}
.nav-section {
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  padding-bottom: 10px;
}
.group-btn,
.type-btn {
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 30px;
  border: 0;
  background: transparent;
  color: #cbd5e1;
  text-align: left;
  cursor: pointer;
}
.group-btn {
  padding: 5px 7px;
  font-size: 12px;
  font-weight: 700;
}
.group-btn.active {
  color: #ffffff;
  box-shadow: inset 3px 0 0 #60a5fa;
}
.type-panel {
  display: grid;
  gap: 3px;
  margin-top: 5px;
}
.type-btn {
  padding: 5px 9px;
  border-radius: 5px;
  font-size: 12px;
}
.type-btn:hover {
  background: rgba(59, 130, 246, 0.14);
  color: #ffffff;
}
.type-btn.active {
  background: #2563eb;
  color: #ffffff;
  box-shadow: inset 3px 0 0 #60a5fa;
}
.sidebar-note {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 18px;
  padding: 12px 8px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.24);
}
.sidebar-note strong {
  color: #f8fafc;
  font-size: 12px;
}

.viewer-content {
  min-width: 0;
  padding: 16px 18px 22px;
  background: #ffffff;
}
.viewer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 38px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}
.current-type {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #334155;
  font-size: 13px;
}
.current-type strong {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 4px 12px;
  border-radius: 6px;
  background: #2563eb;
  color: #ffffff;
  font-size: 12px;
  line-height: 1.2;
}
.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}
.mode-toggle,
.variant-bar {
  display: flex;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  overflow: hidden;
}
.mode-toggle button,
.variant-btn {
  min-height: 28px;
  padding: 5px 10px;
  border: 0;
  border-right: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
.mode-toggle button:last-child,
.variant-btn:last-child {
  border-right: 0;
}
.mode-toggle button.active,
.variant-btn.active {
  background: #eff6ff;
  color: #1d4ed8;
}
.mode-toggle button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.grid-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 14px 0 8px;
  color: #334155;
  font-size: 13px;
}
.legend {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  font-size: 11px;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.legend-item::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #e0f2fe;
  border: 1px solid #7dd3fc;
}
.legend-item.addr::before {
  background: #d1fae5;
  border-color: #6ee7b7;
}
.legend-item.data::before {
  background: #ccfbf1;
  border-color: #5eead4;
}
.legend-item.status::before {
  background: #fee2e2;
  border-color: #fca5a5;
}
.legend-item.rsvd::before {
  background: #f3f4f6;
  border-color: #d1d5db;
}

:global(.VPDoc.has-aside .content-container),
:global(.VPDoc:not(.has-sidebar) .content-container) {
  max-width: none;
}
:global(.VPDoc:has(.tlp-viewer)) {
  padding: 0;
}
:global(.VPDoc:has(.tlp-viewer) .container) {
  max-width: none;
  margin: 0;
}
:global(.VPDoc:has(.tlp-viewer) .content) {
  max-width: none;
  padding: 0;
}
:global(.VPDoc:has(.tlp-viewer) .content-container) {
  max-width: none;
}
:global(.vp-doc:has(.tlp-viewer)) {
  min-height: calc(100vh - var(--vp-nav-height, 64px));
}
:global(.vp-doc .tlp-viewer h1),
:global(.vp-doc .tlp-viewer h2),
:global(.vp-doc .tlp-viewer h3),
:global(.vp-doc .tlp-viewer p) {
  margin: 0;
}

.small-screen-hint {
  display: none;
}
@media (max-width: 899px) {
  .tlp-viewer {
    display: block;
    border: 0;
    box-shadow: none;
  }
  .tlp-sidebar,
  .viewer-content {
    display: none;
  }
  .small-screen-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    color: var(--vp-c-text-2);
    font-size: 14px;
    border: 1px dashed var(--vp-c-divider);
    border-radius: 8px;
    margin-top: 20px;
  }
}
</style>
