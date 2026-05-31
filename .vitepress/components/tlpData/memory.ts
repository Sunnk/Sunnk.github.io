import type { TlpField, DwRow } from './types'

// --- Shared NFM DW0 fields ---
const nfmFmt: TlpField = { name: 'Fmt', fullName: 'Format', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 5 }], description: 'TLP format: header length and whether data payload is present.' }
const nfmType: TlpField = { name: 'Type', fullName: 'Type', category: 'ctrl', segments: [{ byteIndex: 0, msb: 4, lsb: 0 }], description: 'TLP transaction type within the format category.' }
const nfmT9: TlpField = { name: 'T9', fullName: 'Tag[9]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 7, lsb: 7 }], description: 'Bit 9 of Tag when 10-bit Tag extended format is used.' }
const nfmTC: TlpField = { name: 'TC', fullName: 'Traffic Class', category: 'ctrl', segments: [{ byteIndex: 1, msb: 6, lsb: 4 }], description: 'Traffic Class for QoS differentiation.' }
const nfmT8: TlpField = { name: 'T8', fullName: 'Tag[8]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 3, lsb: 3 }], description: 'Bit 8 of Tag when 10-bit Tag extended format is used.' }
const nfmAttr2: TlpField = { name: 'Attr2', fullName: 'Attribute[2]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 2, lsb: 2 }], description: 'Attribute bit 2: No Snoop or ID-Based Ordering.' }
const nfmR1: TlpField = { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 1, msb: 1, lsb: 1 }], description: 'Reserved — must be 0.', reserved: true }
const nfmTH: TlpField = { name: 'TH', fullName: 'TLP Hints', category: 'ctrl', segments: [{ byteIndex: 1, msb: 0, lsb: 0 }], description: 'Indicates presence of TLP Processing Hints (TPH). TD must be set.' }
const nfmAttr1_0: TlpField = { name: 'Attr', fullName: 'Attribute[1:0]', category: 'ctrl', segments: [{ byteIndex: 2, msb: 5, lsb: 4 }], description: 'Attribute bits 1:0: Relaxed Ordering and No Snoop.' }
const nfmTD: TlpField = { name: 'TD', fullName: 'TLP Digest', category: 'ctrl', segments: [{ byteIndex: 2, msb: 7, lsb: 7 }], description: 'Indicates TLP contains a 32-bit Digest (ECRC).' }
const nfmEP: TlpField = { name: 'EP', fullName: 'Error Poisoned', category: 'status', segments: [{ byteIndex: 2, msb: 6, lsb: 6 }], description: 'Marks TLP as poisoned (contains error).' }
const nfmAT: TlpField = { name: 'AT', fullName: 'Address Translation', category: 'ctrl', segments: [{ byteIndex: 2, msb: 3, lsb: 2 }], description: 'Address Translation mode for ATS.' }
const nfmLenLo: TlpField = { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Payload length in DW. 0 = 1024 DW.' }

// --- Shared NFM DW1 fields ---
const nfmReqId: TlpField = { name: 'Req ID', fullName: 'Requester ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Bus/Device/Function of the request originator.' }
const nfmTag: TlpField = { name: 'Tag', fullName: 'Tag[7:0]', category: 'id', segments: [{ byteIndex: 6, msb: 7, lsb: 0 }], description: 'Transaction tag for matching completions.' }
const nfmLastBE: TlpField = { name: 'LastBE', fullName: 'Last DW Byte Enable', category: 'ctrl', segments: [{ byteIndex: 7, msb: 7, lsb: 4 }], description: 'Byte enables for the last DW of the payload.' }
const nfmFirstBE: TlpField = { name: '1stBE', fullName: 'First DW Byte Enable', category: 'ctrl', segments: [{ byteIndex: 7, msb: 3, lsb: 0 }], description: 'Byte enables for the first DW of the payload.' }

// --- FM shared DW0 fields ---
const fmType: TlpField = { name: 'Type', fullName: 'Type[7:0]', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 0 }], description: 'TLP type (8-bit in Flit Mode).' }
const fmTC: TlpField = { name: 'TC', fullName: 'Traffic Class', category: 'ctrl', segments: [{ byteIndex: 1, msb: 7, lsb: 5 }], description: 'Traffic Class for QoS differentiation.' }
const fmOHC: TlpField = { name: 'OHC', fullName: 'OHC[4:0]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 4, lsb: 0 }], description: 'Orthogonal Header Content — additional header info.' }
const fmTS: TlpField = { name: 'TS', fullName: 'Trailer Size', category: 'size', segments: [{ byteIndex: 2, msb: 7, lsb: 5 }], description: 'Trailer size in Flit Mode.' }
const fmAttr: TlpField = { name: 'Attr', fullName: 'Attribute[2:0]', category: 'ctrl', segments: [{ byteIndex: 2, msb: 4, lsb: 2 }], description: 'Attribute bits: RO, NS, and IDO.' }
const fmLen: TlpField = { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Payload length in DW. 0 = 1024 DW.' }

// --- FM shared DW1 fields ---
const fmReqId: TlpField = { name: 'Req ID', fullName: 'Requester ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Bus/Device/Function of the request originator.' }
const fmEP: TlpField = { name: 'EP', fullName: 'Error Poisoned', category: 'status', segments: [{ byteIndex: 6, msb: 7, lsb: 7 }], description: 'Marks TLP as poisoned.' }
const fmR2: TlpField = { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 6, msb: 6, lsb: 6 }], description: 'Reserved — must be 0.', reserved: true }
const fmTag14: TlpField = { name: 'Tag', fullName: 'Tag[13:0]', category: 'id', segments: [{ byteIndex: 6, msb: 5, lsb: 0 }, { byteIndex: 7, msb: 7, lsb: 0 }], description: '14-bit Transaction Tag.' }

// --- FM Memory DW2/DW3 fields ---
const fmAddr32: TlpField = { name: 'Addr', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 2 }], description: '32-bit word-aligned address.' }
const fmAT: TlpField = { name: 'AT', fullName: 'Address Translation', category: 'ctrl', segments: [{ byteIndex: 11, msb: 1, lsb: 0 }], description: 'Address Translation mode.' }
const fmAddr64Hi: TlpField = { name: 'Addr[63:32]', fullName: 'Address[63:32]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 0 }], description: 'Upper 32 bits of 64-bit address.' }
const fmAddr64Lo: TlpField = { name: 'Addr[31:2]', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 12, msb: 7, lsb: 0 }, { byteIndex: 13, msb: 7, lsb: 0 }, { byteIndex: 14, msb: 7, lsb: 0 }, { byteIndex: 15, msb: 7, lsb: 2 }], description: 'Lower 30 bits of 64-bit address.' }

// =============================================
// NFM MRd32
// =============================================
const nfmMrd32Dw0: DwRow = {
  label: 'DW0', fields: [nfmFmt, nfmType, nfmT9, nfmTC, nfmT8, nfmAttr2, nfmR1, nfmTH, nfmAttr1_0, nfmTD, nfmEP, nfmAT, nfmLenLo]
}
const nfmMrd32Dw1: DwRow = {
  label: 'DW1', fields: [nfmReqId, nfmTag, nfmLastBE, nfmFirstBE]
}
const nfmMrd32Dw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Addr', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 2 }], description: '32-bit word-aligned address, bits 31:2.' },
    { name: 'PH', fullName: 'Page Hash', category: 'ctrl', segments: [{ byteIndex: 11, msb: 1, lsb: 0 }], description: 'Page Hash bits (only when TH=1).' }
  ]
}

// =============================================
// NFM MRd64
// =============================================
const nfmMrd64Dw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Addr[63:32]', fullName: 'Address[63:32]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 0 }], description: 'Upper 32 bits of 64-bit address.' }
  ]
}
const nfmMrd64Dw3: DwRow = {
  label: 'DW3',
  fields: [
    { name: 'Addr[31:2]', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 12, msb: 7, lsb: 0 }, { byteIndex: 13, msb: 7, lsb: 0 }, { byteIndex: 14, msb: 7, lsb: 0 }, { byteIndex: 15, msb: 7, lsb: 2 }], description: 'Lower 30 bits of 64-bit address.' },
    { name: 'PH', fullName: 'Page Hash', category: 'ctrl', segments: [{ byteIndex: 15, msb: 1, lsb: 0 }], description: 'Page Hash bits (only when TH=1).' }
  ]
}

// =============================================
// NFM MWr32
// =============================================
const nfmMwr32Dw0: DwRow = {
  label: 'DW0', fields: [
    { ...nfmFmt, description: '010b: 3DW header with data.' },
    nfmType, nfmT9, nfmTC, nfmT8, nfmAttr2, nfmR1, nfmTH, nfmAttr1_0, nfmTD, nfmEP, nfmAT, nfmLenLo
  ]
}
const nfmMwr32Dw1: DwRow = {
  label: 'DW1', fields: [nfmReqId, nfmTag, nfmLastBE, nfmFirstBE]
}
const nfmMwr32Dw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Addr', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 2 }], description: '32-bit word-aligned address, bits 31:2.' },
    { name: 'PH', fullName: 'Page Hash', category: 'ctrl', segments: [{ byteIndex: 11, msb: 1, lsb: 0 }], description: 'Page Hash bits (only when TH=1).' }
  ]
}
const nfmMwr32Data: DwRow = { label: 'Data', isData: true, fields: [] }

// =============================================
// NFM MWr64
// =============================================
const nfmMwr64Dw0: DwRow = {
  label: 'DW0', fields: [
    { ...nfmFmt, description: '011b: 4DW header with data.' },
    nfmType, nfmT9, nfmTC, nfmT8, nfmAttr2, nfmR1, nfmTH, nfmAttr1_0, nfmTD, nfmEP, nfmAT, nfmLenLo
  ]
}
const nfmMwr64Dw1: DwRow = {
  label: 'DW1', fields: [nfmReqId, nfmTag, nfmLastBE, nfmFirstBE]
}
const nfmMwr64Dw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Addr[63:32]', fullName: 'Address[63:32]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 0 }], description: 'Upper 32 bits of 64-bit address.' }
  ]
}
const nfmMwr64Dw3: DwRow = {
  label: 'DW3',
  fields: [
    { name: 'Addr[31:2]', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 12, msb: 7, lsb: 0 }, { byteIndex: 13, msb: 7, lsb: 0 }, { byteIndex: 14, msb: 7, lsb: 0 }, { byteIndex: 15, msb: 7, lsb: 2 }], description: 'Lower 30 bits of 64-bit address.' },
    { name: 'PH', fullName: 'Page Hash', category: 'ctrl', segments: [{ byteIndex: 15, msb: 1, lsb: 0 }], description: 'Page Hash bits (only when TH=1).' }
  ]
}
const nfmMwr64Data: DwRow = { label: 'Data', isData: true, fields: [] }

// =============================================
// FM MRd32
// =============================================
const fmMrd32Dw0: DwRow = { label: 'DW0', fields: [fmType, fmTC, fmOHC, fmTS, fmAttr, fmLen] }
const fmMrd32Dw1: DwRow = { label: 'DW1', fields: [fmReqId, fmEP, fmR2, fmTag14] }
const fmMrd32Dw2: DwRow = { label: 'DW2', fields: [fmAddr32, fmAT] }

// =============================================
// FM MRd64
// =============================================
const fmMrd64Dw0: DwRow = { label: 'DW0', fields: [fmType, fmTC, fmOHC, fmTS, fmAttr, fmLen] }
const fmMrd64Dw1: DwRow = { label: 'DW1', fields: [fmReqId, fmEP, fmR2, fmTag14] }
const fmMrd64Dw2: DwRow = { label: 'DW2', fields: [fmAddr64Hi] }
const fmMrd64Dw3: DwRow = { label: 'DW3', fields: [fmAddr64Lo, fmAT] }

// =============================================
// FM MWr32
// =============================================
const fmMwr32Dw0: DwRow = { label: 'DW0', fields: [fmType, fmTC, fmOHC, fmTS, fmAttr, fmLen] }
const fmMwr32Dw1: DwRow = { label: 'DW1', fields: [fmReqId, fmEP, fmR2, fmTag14] }
const fmMwr32Dw2: DwRow = { label: 'DW2', fields: [fmAddr32, fmAT] }
const fmMwr32Data: DwRow = { label: 'Data', isData: true, fields: [] }

// =============================================
// FM MWr64
// =============================================
const fmMwr64Dw0: DwRow = { label: 'DW0', fields: [fmType, fmTC, fmOHC, fmTS, fmAttr, fmLen] }
const fmMwr64Dw1: DwRow = { label: 'DW1', fields: [fmReqId, fmEP, fmR2, fmTag14] }
const fmMwr64Dw2: DwRow = { label: 'DW2', fields: [fmAddr64Hi] }
const fmMwr64Dw3: DwRow = { label: 'DW3', fields: [fmAddr64Lo, fmAT] }
const fmMwr64Data: DwRow = { label: 'Data', isData: true, fields: [] }

// =============================================
// MRdLk (placeholder — same layout as MRd)
// =============================================
const nfmMrdLk32Dw0: DwRow = {
  label: 'DW0', fields: [
    { ...nfmFmt, description: 'Locked Memory Read format.' },
    { ...nfmType, description: '0 0001b: Locked Memory Read Request.' },
    nfmT9, nfmTC, nfmT8, nfmAttr2, nfmR1, nfmTH, nfmAttr1_0, nfmTD, nfmEP, nfmAT, nfmLenLo
  ]
}
const nfmMrdLk64Dw0: DwRow = { ...nfmMrdLk32Dw0 }

// =============================================
// Exports
// =============================================
export const memoryTlpTypes = [
  {
    id: 'mrd32', label: 'MRd32', group: 'memory' as const,
    nfmDws: [nfmMrd32Dw0, nfmMrd32Dw1, nfmMrd32Dw2],
    fmDws: [fmMrd32Dw0, fmMrd32Dw1, fmMrd32Dw2],
    variants: [
      { id: '32', label: '32-bit', nfmDws: [nfmMrd32Dw0, nfmMrd32Dw1, nfmMrd32Dw2], fmDws: [fmMrd32Dw0, fmMrd32Dw1, fmMrd32Dw2] },
      { id: '64', label: '64-bit', nfmDws: [nfmMrd32Dw0, nfmMrd32Dw1, nfmMrd64Dw2, nfmMrd64Dw3], fmDws: [fmMrd32Dw0, fmMrd32Dw1, fmMrd64Dw2, fmMrd64Dw3] }
    ]
  },
  {
    id: 'mrdlk32', label: 'MRdLk32', group: 'memory' as const,
    nfmDws: [nfmMrdLk32Dw0, nfmMrd32Dw1, nfmMrd32Dw2],
    fmDws: [],
    variants: [
      { id: '32', label: '32-bit', nfmDws: [nfmMrdLk32Dw0, nfmMrd32Dw1, nfmMrd32Dw2], fmDws: [] },
      { id: '64', label: '64-bit', nfmDws: [nfmMrdLk64Dw0, nfmMrd32Dw1, nfmMrd64Dw2, nfmMrd64Dw3], fmDws: [] }
    ]
  },
  {
    id: 'mwr32', label: 'MWr32', group: 'memory' as const,
    nfmDws: [nfmMwr32Dw0, nfmMwr32Dw1, nfmMwr32Dw2, nfmMwr32Data],
    fmDws: [fmMwr32Dw0, fmMwr32Dw1, fmMwr32Dw2, fmMwr32Data],
    variants: [
      { id: '32', label: '32-bit', nfmDws: [nfmMwr32Dw0, nfmMwr32Dw1, nfmMwr32Dw2, nfmMwr32Data], fmDws: [fmMwr32Dw0, fmMwr32Dw1, fmMwr32Dw2, fmMwr32Data] },
      { id: '64', label: '64-bit', nfmDws: [nfmMwr64Dw0, nfmMwr64Dw1, nfmMwr64Dw2, nfmMwr64Dw3, nfmMwr64Data], fmDws: [fmMwr64Dw0, fmMwr64Dw1, fmMwr64Dw2, fmMwr64Dw3, fmMwr64Data] }
    ]
  }
]
