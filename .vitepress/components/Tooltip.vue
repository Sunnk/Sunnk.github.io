<script setup lang="ts">
import { computeFieldBitRange, computeFieldBitWidth } from './tlpData/types'
import type { TlpField } from './tlpData/types'

const props = defineProps<{
  field: TlpField | null
  visible: boolean
}>()

const categoryLabels: Record<string, string> = {
  ctrl: 'Control',
  id: 'ID',
  addr: 'Address',
  size: 'Size',
  status: 'Status',
  data: 'Data',
  prefix: 'Prefix',
  rsvd: 'Reserved'
}
</script>

<template>
  <Transition name="slide-card">
    <div v-if="visible && field" class="field-info-card">
      <div class="info-row">
        <span class="info-name">{{ field.fullName }}</span>
        <span class="info-badge" :class="'badge-' + field.category">{{ categoryLabels[field.category] }}</span>
        <span class="info-sep">|</span>
        <span class="info-bits">Bits: {{ computeFieldBitRange(field.segments) }}</span>
        <span class="info-sep">|</span>
        <span class="info-width">{{ computeFieldBitWidth(field) }} bit{{ computeFieldBitWidth(field) > 1 ? 's' : '' }}</span>
      </div>
      <div class="info-desc">{{ field.description }}</div>
    </div>
  </Transition>
</template>

<style scoped>
.field-info-card {
  position: fixed;
  left: 50%;
  bottom: 24px;
  width: min(720px, calc(100vw - 32px));
  transform: translateX(-50%);
  z-index: 1000;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.16);
  padding: 12px 16px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.info-name {
  font-weight: 600;
}
.info-badge {
  font-size: 10px;
  padding: 1px 8px;
  border-radius: 10px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}
.info-sep {
  color: var(--vp-c-divider);
}
.info-bits, .info-width {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.info-desc {
  color: var(--vp-c-text-2);
  font-size: 12px;
  margin-top: 2px;
}

/* Transition */
.slide-card-enter-active, .slide-card-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-card-enter-from, .slide-card-leave-to {
  transform: translate(-50%, 16px);
  opacity: 0;
}
</style>
