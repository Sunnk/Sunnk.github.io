export type { TlpField, FieldSegment, FieldCategory, DwRow, TlpVariant, TlpDefinition, NavGroup } from './types'
export { computeFieldBitRange, computeFieldBitWidth } from './types'

import type { TlpDefinition, NavGroup } from './types'
import { memoryTlpTypes } from './memory'
import { completionTlpTypes } from './completion'
import { configTlpTypes } from './config'
import { messageTlpTypes } from './message'
import { atomicopTlpTypes } from './atomicop'
import { prefixTlpTypes } from './prefix'
import { ioTlpTypes } from './io'

export const allTlpTypes: TlpDefinition[] = [
  ...memoryTlpTypes,
  ...ioTlpTypes,
  ...configTlpTypes,
  ...messageTlpTypes,
  ...completionTlpTypes,
  ...atomicopTlpTypes,
  ...prefixTlpTypes
]

export const navGroups: NavGroup[] = [
  { id: 'memory', label: 'Memory', types: memoryTlpTypes.map(t => ({ id: t.id, label: t.label })) },
  { id: 'io', label: 'I/O', types: ioTlpTypes.map(t => ({ id: t.id, label: t.label })) },
  { id: 'config', label: 'Config', types: configTlpTypes.map(t => ({ id: t.id, label: t.label })) },
  { id: 'message', label: 'Msg', types: messageTlpTypes.map(t => ({ id: t.id, label: t.label })) },
  { id: 'completion', label: 'Cpl', types: completionTlpTypes.map(t => ({ id: t.id, label: t.label })) },
  { id: 'atomicop', label: 'AtomOp', types: atomicopTlpTypes.map(t => ({ id: t.id, label: t.label })) },
  { id: 'prefix', label: 'Prefix', types: prefixTlpTypes.map(t => ({ id: t.id, label: t.label })) }
]
