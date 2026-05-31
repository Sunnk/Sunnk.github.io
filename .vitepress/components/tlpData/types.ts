export interface FieldSegment {
  byteIndex: number
  msb: number
  lsb: number
}

export interface TlpField {
  name: string
  fullName: string
  category: FieldCategory
  segments: FieldSegment[]
  description: string
  reserved?: boolean
}

export type FieldCategory = 'ctrl' | 'id' | 'addr' | 'size' | 'status' | 'data' | 'prefix' | 'rsvd'

export interface DwRow {
  label: string
  isData?: boolean
  fields: TlpField[]
}

export interface TlpVariant {
  id: string
  label: string
  dws: DwRow[]
}

export type TlpGroup = 'memory' | 'io' | 'config' | 'message' | 'completion' | 'atomicop' | 'prefix'

export interface TlpDefinition {
  id: string
  label: string
  group: TlpGroup
  variants?: TlpVariant[]
  nfmDws: DwRow[]
  fmDws?: DwRow[]
}

export interface NavGroup {
  id: TlpGroup
  label: string
  types: { id: string; label: string }[]
}

export function computeFieldBitRange(segments: FieldSegment[]): string {
  const sorted = [...segments].sort((a, b) => {
    const aBase = a.byteIndex * 8
    const bBase = b.byteIndex * 8
    return (bBase + b.msb) - (aBase + a.msb)
  })
  const parts = sorted.map(s => {
    const base = s.byteIndex * 8
    const h = base + s.msb
    const l = base + s.lsb
    return h === l ? `${h}` : `${h}:${l}`
  })
  return `[${parts.join(', ')}]`
}

export function computeFieldBitWidth(field: TlpField): number {
  return field.segments.reduce((sum, s) => sum + (s.msb - s.lsb + 1), 0)
}
