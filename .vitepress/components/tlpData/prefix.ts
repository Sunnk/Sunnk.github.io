import type { DwRow } from './types'

const placeholderDw: DwRow = {
  label: 'DW0',
  fields: [
    { name: 'Prefix Type', fullName: 'Prefix Type', category: 'prefix', segments: [{ byteIndex: 0, msb: 7, lsb: 5 }], description: 'Prefix type identifier.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 0, msb: 4, lsb: 0 }, { byteIndex: 1, msb: 7, lsb: 0 }, { byteIndex: 2, msb: 7, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Reserved / vendor-defined content (placeholder).', reserved: true }
  ]
}

export const prefixTlpTypes = [
  {
    id: 'local-prefix', label: 'LocalPrefix', group: 'prefix' as const,
    nfmDws: [placeholderDw],
    fmDws: [],
    variants: [
      { id: 'vendor', label: 'Vendor-Defined', nfmDws: [placeholderDw], fmDws: [] },
      { id: 'pasid', label: 'PASID', nfmDws: [placeholderDw], fmDws: [] },
      { id: 'tph', label: 'TPH', nfmDws: [placeholderDw], fmDws: [] }
    ]
  },
  {
    id: 'e2e-prefix', label: 'E2EPrefix', group: 'prefix' as const,
    nfmDws: [placeholderDw],
    fmDws: [],
    variants: [
      { id: 'vendor-e2e', label: 'Vendor(E2E)', nfmDws: [placeholderDw], fmDws: [] },
      { id: 'pasid-e2e', label: 'PASID(E2E)', nfmDws: [placeholderDw], fmDws: [] }
    ]
  }
]
