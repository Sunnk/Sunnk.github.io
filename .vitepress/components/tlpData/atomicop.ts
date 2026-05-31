import type { DwRow } from './types'

// Placeholder DW rows for AtomicOp types
const placeholderDw0: DwRow = {
  label: 'DW0',
  fields: [
    { name: 'Fmt', fullName: 'Format', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 5 }], description: 'Format field.' },
    { name: 'Type', fullName: 'Type', category: 'ctrl', segments: [{ byteIndex: 0, msb: 4, lsb: 0 }], description: 'AtomicOp type.' },
    { name: 'T9', fullName: 'Tag[9]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 7, lsb: 7 }], description: 'Bit 9 of Tag.' },
    { name: 'TC', fullName: 'Traffic Class', category: 'ctrl', segments: [{ byteIndex: 1, msb: 6, lsb: 4 }], description: 'Traffic Class.' },
    { name: 'T8', fullName: 'Tag[8]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 3, lsb: 3 }], description: 'Bit 8 of Tag.' },
    { name: 'Attr2', fullName: 'Attribute[2]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 2, lsb: 2 }], description: 'Attribute bit 2.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 1, msb: 1, lsb: 1 }], description: 'Reserved.', reserved: true },
    { name: 'TH', fullName: 'TLP Hints', category: 'ctrl', segments: [{ byteIndex: 1, msb: 0, lsb: 0 }], description: 'TLP Processing Hints.' },
    { name: 'Attr', fullName: 'Attribute[1:0]', category: 'ctrl', segments: [{ byteIndex: 2, msb: 5, lsb: 4 }], description: 'Attribute bits.' },
    { name: 'TD', fullName: 'TLP Digest', category: 'ctrl', segments: [{ byteIndex: 2, msb: 7, lsb: 7 }], description: 'TLP Digest.' },
    { name: 'EP', fullName: 'Error Poisoned', category: 'status', segments: [{ byteIndex: 2, msb: 6, lsb: 6 }], description: 'Poisoned.' },
    { name: 'AT', fullName: 'Address Translation', category: 'ctrl', segments: [{ byteIndex: 2, msb: 3, lsb: 2 }], description: 'Address Translation.' },
    { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Payload length in DW.' }
  ]
}
const placeholderDw1: DwRow = {
  label: 'DW1',
  fields: [
    { name: 'Req ID', fullName: 'Requester ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Requester ID.' },
    { name: 'Tag', fullName: 'Tag', category: 'id', segments: [{ byteIndex: 6, msb: 7, lsb: 0 }], description: 'Tag.' },
    { name: 'LastBE', fullName: 'Last DW Byte Enable', category: 'ctrl', segments: [{ byteIndex: 7, msb: 7, lsb: 4 }], description: 'Last DW Byte Enable.' },
    { name: '1stBE', fullName: 'First DW Byte Enable', category: 'ctrl', segments: [{ byteIndex: 7, msb: 3, lsb: 0 }], description: 'First DW Byte Enable.' }
  ]
}
const placeholderAddr32Dw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Addr', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 2 }], description: '32-bit address.' },
    { name: 'PH', fullName: 'Page Hash', category: 'ctrl', segments: [{ byteIndex: 11, msb: 1, lsb: 0 }], description: 'Page Hash.' }
  ]
}
const placeholderAddr64Dw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Addr[63:32]', fullName: 'Address[63:32]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 0 }], description: 'Upper 32 bits of 64-bit address.' }
  ]
}
const placeholderAddr64Dw3: DwRow = {
  label: 'DW3',
  fields: [
    { name: 'Addr[31:2]', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 12, msb: 7, lsb: 0 }, { byteIndex: 13, msb: 7, lsb: 0 }, { byteIndex: 14, msb: 7, lsb: 0 }, { byteIndex: 15, msb: 7, lsb: 2 }], description: 'Lower 30 bits of 64-bit address.' },
    { name: 'PH', fullName: 'Page Hash', category: 'ctrl', segments: [{ byteIndex: 15, msb: 1, lsb: 0 }], description: 'Page Hash.' }
  ]
}
const placeholder32OperandDw3: DwRow = {
  label: 'DW3',
  fields: [
    { name: 'Operand', fullName: 'Operand / Swap Value', category: 'data', segments: [{ byteIndex: 12, msb: 7, lsb: 0 }, { byteIndex: 13, msb: 7, lsb: 0 }, { byteIndex: 14, msb: 7, lsb: 0 }, { byteIndex: 15, msb: 7, lsb: 0 }], description: 'Atomic operand or swap value (placeholder).' }
  ]
}
const placeholder64OperandDw4: DwRow = {
  label: 'DW4',
  fields: [
    { name: 'Operand[63:32]', fullName: 'Operand[63:32]', category: 'data', segments: [{ byteIndex: 16, msb: 7, lsb: 0 }, { byteIndex: 17, msb: 7, lsb: 0 }, { byteIndex: 18, msb: 7, lsb: 0 }, { byteIndex: 19, msb: 7, lsb: 0 }], description: 'Upper 32 bits of 64-bit operand (placeholder).' }
  ]
}
const placeholder64OperandDw5: DwRow = {
  label: 'DW5',
  fields: [
    { name: 'Operand[31:0]', fullName: 'Operand[31:0]', category: 'data', segments: [{ byteIndex: 20, msb: 7, lsb: 0 }, { byteIndex: 21, msb: 7, lsb: 0 }, { byteIndex: 22, msb: 7, lsb: 0 }, { byteIndex: 23, msb: 7, lsb: 0 }], description: 'Lower 32 bits of 64-bit operand (placeholder).' }
  ]
}
const cas32Dw4: DwRow = {
  label: 'DW4',
  fields: [
    { name: 'Compare', fullName: 'Compare Value', category: 'data', segments: [{ byteIndex: 16, msb: 7, lsb: 0 }, { byteIndex: 17, msb: 7, lsb: 0 }, { byteIndex: 18, msb: 7, lsb: 0 }, { byteIndex: 19, msb: 7, lsb: 0 }], description: 'CAS Compare Value (placeholder).' }
  ]
}
const cas64Dw4: DwRow = {
  label: 'DW4',
  fields: [
    { name: 'Swap[63:32]', fullName: 'Swap Value[63:32]', category: 'data', segments: [{ byteIndex: 16, msb: 7, lsb: 0 }, { byteIndex: 17, msb: 7, lsb: 0 }, { byteIndex: 18, msb: 7, lsb: 0 }, { byteIndex: 19, msb: 7, lsb: 0 }], description: 'Upper 32 bits of Swap Value (placeholder).' }
  ]
}
const cas64Dw5: DwRow = {
  label: 'DW5',
  fields: [
    { name: 'Swap[31:0]', fullName: 'Swap Value[31:0]', category: 'data', segments: [{ byteIndex: 20, msb: 7, lsb: 0 }, { byteIndex: 21, msb: 7, lsb: 0 }, { byteIndex: 22, msb: 7, lsb: 0 }, { byteIndex: 23, msb: 7, lsb: 0 }], description: 'Lower 32 bits of Swap Value (placeholder).' }
  ]
}
const cas64Dw6: DwRow = {
  label: 'DW6',
  fields: [
    { name: 'Cmp[63:32]', fullName: 'Compare Value[63:32]', category: 'data', segments: [{ byteIndex: 24, msb: 7, lsb: 0 }, { byteIndex: 25, msb: 7, lsb: 0 }, { byteIndex: 26, msb: 7, lsb: 0 }, { byteIndex: 27, msb: 7, lsb: 0 }], description: 'Upper 32 bits of Compare Value (placeholder).' }
  ]
}
const cas64Dw7: DwRow = {
  label: 'DW7',
  fields: [
    { name: 'Cmp[31:0]', fullName: 'Compare Value[31:0]', category: 'data', segments: [{ byteIndex: 28, msb: 7, lsb: 0 }, { byteIndex: 29, msb: 7, lsb: 0 }, { byteIndex: 30, msb: 7, lsb: 0 }, { byteIndex: 31, msb: 7, lsb: 0 }], description: 'Lower 32 bits of Compare Value (placeholder).' }
  ]
}

export const atomicopTlpTypes = [
  {
    id: 'fetchadd32', label: 'FetchAdd32', group: 'atomicop' as const,
    nfmDws: [placeholderDw0, placeholderDw1, placeholderAddr32Dw2, placeholder32OperandDw3],
    fmDws: [],
    variants: [
      { id: '32', label: '32-bit', nfmDws: [placeholderDw0, placeholderDw1, placeholderAddr32Dw2, placeholder32OperandDw3], fmDws: [] },
      { id: '64', label: '64-bit', nfmDws: [placeholderDw0, placeholderDw1, placeholderAddr64Dw2, placeholder64OperandDw4, placeholder64OperandDw5], fmDws: [] }
    ]
  },
  {
    id: 'swap32', label: 'Swap32', group: 'atomicop' as const,
    nfmDws: [placeholderDw0, placeholderDw1, placeholderAddr32Dw2, placeholder32OperandDw3],
    fmDws: [],
    variants: [
      { id: '32', label: '32-bit', nfmDws: [placeholderDw0, placeholderDw1, placeholderAddr32Dw2, placeholder32OperandDw3], fmDws: [] },
      { id: '64', label: '64-bit', nfmDws: [placeholderDw0, placeholderDw1, placeholderAddr64Dw2, placeholder64OperandDw4, placeholder64OperandDw5], fmDws: [] }
    ]
  },
  {
    id: 'cas32', label: 'CAS32', group: 'atomicop' as const,
    nfmDws: [placeholderDw0, placeholderDw1, placeholderAddr32Dw2, placeholder32OperandDw3, cas32Dw4],
    fmDws: [],
    variants: [
      { id: '32', label: '32-bit', nfmDws: [placeholderDw0, placeholderDw1, placeholderAddr32Dw2, placeholder32OperandDw3, cas32Dw4], fmDws: [] },
      { id: '64', label: '64-bit', nfmDws: [placeholderDw0, placeholderDw1, placeholderAddr64Dw2, cas64Dw4, cas64Dw5, cas64Dw6, cas64Dw7], fmDws: [] }
    ]
  }
]
