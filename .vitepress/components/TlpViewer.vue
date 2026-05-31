<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import DwGrid from './DwGrid.vue'
import { allTlpTypes, navGroups } from './tlpData'
import type { TlpDefinition, DwRow } from './tlpData'

// --- State ---
const selectedTypeId = ref<string>('')
const selectedVariantId = ref<string>('')
const mode = ref<'nfm' | 'fm'>('nfm')
const expandedGroup = ref<string>('')

// --- Derived ---
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
    label += ' — ' + selectedVariant.value.label
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

// --- Navigation ---
function toggleGroup(groupId: string) {
  if (expandedGroup.value === groupId) {
    expandedGroup.value = ''
  } else {
    expandedGroup.value = groupId
  }
}

function selectType(typeId: string) {
  const t = allTlpTypes.find(t => t.id === typeId)
  if (!t) return
  selectedTypeId.value = typeId
  // Default variant
  if (t.variants?.length) {
    selectedVariantId.value = t.variants[0].id
  } else {
    selectedVariantId.value = ''
  }
  // Switch to NFM if FM not available
  if (mode.value === 'fm' && !currentDws.value.length) {
    mode.value = 'nfm'
  }
  updateHash()
  expandedGroup.value = ''
}

function selectVariant(variantId: string) {
  selectedVariantId.value = variantId
  updateHash()
}

function getGroupForType(typeId: string) {
  return allTlpTypes.find(t => t.id === typeId)?.group || ''
}

// --- URL hash ---
function updateHash() {
  if (selectedTypeId.value) {
    window.history.replaceState(null, '', '#' + selectedTypeId.value)
  }
}

function loadFromHash() {
  const hash = window.location.hash.slice(1)
  if (hash && allTlpTypes.find(t => t.id === hash)) {
    selectType(hash)
    expandedGroup.value = getGroupForType(hash)
  } else if (allTlpTypes.length) {
    selectType(allTlpTypes[0].id)
    expandedGroup.value = allTlpTypes[0].group
  }
}

onMounted(() => {
  loadFromHash()
  window.addEventListener('hashchange', loadFromHash)
})

// Initialize with first type
if (!selectedTypeId.value && allTlpTypes.length) {
  selectedTypeId.value = allTlpTypes[0].id
  if (allTlpTypes[0].variants?.length) {
    selectedVariantId.value = allTlpTypes[0].variants[0].id
  }
  expandedGroup.value = allTlpTypes[0].group
}
</script>

<template>
  <div class="tlp-viewer">
    <!-- Page Header -->
    <div class="viewer-header">
      <span class="spec-badge">PCIe 5.0 / 6.0</span>
      <div class="mode-toggle">
        <button
          :class="{ active: mode === 'nfm' }"
          @click="mode = 'nfm'"
        >NFM</button>
        <button
          :class="{ active: mode === 'fm', disabled: !hasFmData }"
          @click="hasFmData && (mode = 'fm')"
          :title="hasFmData ? '' : 'FM data not available for this type'"
        >FM</button>
      </div>
    </div>

    <!-- Small screen hint -->
    <div class="small-screen-hint">
      此工具建议在桌面端或横屏模式下使用（最低 768px）
    </div>

    <!-- Navigation Bar -->
    <nav class="tlp-nav">
      <div class="nav-groups">
        <div
          v-for="group in navGroups"
          :key="group.id"
          class="nav-group"
        >
          <button
            class="group-btn"
            :class="{ expanded: expandedGroup === group.id }"
            @click="toggleGroup(group.id)"
          >
            {{ group.label }}
            <span class="arrow">{{ expandedGroup === group.id ? '▲' : '▼' }}</span>
          </button>
          <div v-if="expandedGroup === group.id" class="group-dropdown">
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
        </div>
      </div>
    </nav>

    <!-- Content Area -->
    <div v-if="selectedType" class="viewer-content">
      <!-- Current type label -->
      <div class="current-type">
        <span class="type-name">{{ currentLabel }}</span>
        <span v-if="mode === 'fm'" class="mode-badge">Flit Mode</span>
      </div>

      <!-- Variant Tab Bar -->
      <div v-if="hasVariants" class="variant-bar">
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

      <!-- DW Grid -->
      <DwGrid :rows="currentDws" />
    </div>
  </div>
</template>

<style scoped>
.tlp-viewer {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.viewer-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}
.spec-badge {
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  padding: 4px 10px;
  border-radius: 12px;
}
.mode-toggle {
  display: flex;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}
.mode-toggle button {
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.mode-toggle button.active {
  background: var(--vp-c-brand-1);
  color: #fff;
}
.mode-toggle button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Navigation Bar */
.tlp-nav {
  position: sticky;
  top: var(--vp-nav-height, 64px);
  z-index: 99;
  background: var(--vp-nav-bg-color, var(--vp-c-bg));
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 8px 0;
  margin-bottom: 20px;
}
.nav-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.nav-group {
  position: relative;
}
.group-btn {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.group-btn:hover {
  background: var(--vp-c-default-soft);
}
.group-btn.expanded {
  background: var(--vp-c-default-soft);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.arrow {
  font-size: 10px;
  opacity: 0.6;
}
.group-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  z-index: 101;
  min-width: 120px;
}
.type-btn {
  padding: 5px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.type-btn:hover {
  background: var(--vp-c-default-soft);
}
.type-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* Content */
.viewer-content {
  margin-top: 8px;
}
.current-type {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.type-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.mode-badge {
  font-size: 11px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-warning-soft);
  padding: 2px 8px;
  border-radius: 10px;
}

/* Variant Bar */
.variant-bar {
  display: flex;
  gap: 2px;
  margin-bottom: 16px;
  border-bottom: 2px solid var(--vp-c-divider);
  padding-bottom: 0;
}
.variant-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}
.variant-btn:hover {
  color: var(--vp-c-text-1);
}
.variant-btn.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* Responsive: small screens */
.small-screen-hint {
  display: none;
}
@media (max-width: 767px) {
  .tlp-nav, .viewer-content {
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
