import type { TlpField, DwRow } from './types'

// --- NFM Cpl/CplD shared DW0 ---
const nfmCplDw0: DwRow = {
  label: 'DW0',
  fields: [
    { name: 'Fmt', fullName: 'Format', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 5 }], description: 'Cpl: 000b (no data). CplD: 010b (with data).' },
    { name: 'Type', fullName: 'Type', category: 'ctrl', segments: [{ byteIndex: 0, msb: 4, lsb: 0 }], description: '0 1010b: Completion.' },
    { name: 'T9', fullName: 'Tag[9]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 7, lsb: 7 }], description: 'Bit 9 of Tag (10-bit Tag).' },
    { name: 'TC', fullName: 'Traffic Class', category: 'ctrl', segments: [{ byteIndex: 1, msb: 6, lsb: 4 }], description: 'Traffic Class.' },
    { name: 'T8', fullName: 'Tag[8]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 3, lsb: 3 }], description: 'Bit 8 of Tag (10-bit Tag).' },
    { name: 'Attr2', fullName: 'Attribute[2]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 2, lsb: 2 }], description: 'Attribute bit 2.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 1, msb: 1, lsb: 1 }], description: 'Reserved — must be 0.', reserved: true },
    { name: 'TH', fullName: 'TLP Hints', category: 'ctrl', segments: [{ byteIndex: 1, msb: 0, lsb: 0 }], description: 'TLP Processing Hints.' },
    { name: 'Attr', fullName: 'Attribute[1:0]', category: 'ctrl', segments: [{ byteIndex: 2, msb: 5, lsb: 4 }], description: 'Attribute bits 1:0.' },
    { name: 'TD', fullName: 'TLP Digest', category: 'ctrl', segments: [{ byteIndex: 2, msb: 7, lsb: 7 }], description: 'TLP Digest present.' },
    { name: 'EP', fullName: 'Error Poisoned', category: 'status', segments: [{ byteIndex: 2, msb: 6, lsb: 6 }], description: 'Poisoned TLP.' },
    { name: 'AT', fullName: 'Address Translation', category: 'ctrl', segments: [{ byteIndex: 2, msb: 3, lsb: 2 }], description: 'Address Translation.' },
    { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Payload length in DW.' }
  ]
}

// --- NFM Cpl DW1 ---
const nfmCplDw1: DwRow = {
  label: 'DW1',
  fields: [
    { name: 'Cpl ID', fullName: 'Completer ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Bus/Device/Function of the Completer.' },
    { name: 'Cpl St', fullName: 'Completion Status', category: 'status', segments: [{ byteIndex: 6, msb: 7, lsb: 5 }], description: 'Completion status code (SC, UR, CRS, CA).' },
    { name: 'BCM', fullName: 'Byte Count Modified', category: 'ctrl', segments: [{ byteIndex: 6, msb: 4, lsb: 4 }], description: 'Byte Count Modified flag.' },
    { name: 'Byte Cnt', fullName: 'Byte Count', category: 'size', segments: [{ byteIndex: 6, msb: 3, lsb: 0 }, { byteIndex: 7, msb: 7, lsb: 0 }], description: 'Number of bytes remaining in the completion.' }
  ]
}

// --- NFM Cpl DW2 ---
const nfmCplDw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Req ID', fullName: 'Requester ID', category: 'id', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }], description: 'Requester ID from the original request.' },
    { name: 'Tag', fullName: 'Tag', category: 'id', segments: [{ byteIndex: 10, msb: 7, lsb: 0 }], description: 'Tag from the original request.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 11, msb: 7, lsb: 7 }], description: 'Reserved — must be 0.', reserved: true },
    { name: 'Low Addr', fullName: 'Lower Address', category: 'addr', segments: [{ byteIndex: 11, msb: 6, lsb: 0 }], description: 'Lower address bits for byte-level addressing.' }
  ]
}

// --- CplD data row ---
const nfmCplDData: DwRow = { label: 'Data', isData: true, fields: [] }

// --- FM Cpl DW0 ---
const fmCplDw0: DwRow = {
  label: 'DW0',
  fields: [
    { name: 'Type', fullName: 'Type[7:0]', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 0 }], description: 'Cpl: #10 (0001 0100b). CplD: #74 (0100 1010b).' },
    { name: 'TC', fullName: 'Traffic Class', category: 'ctrl', segments: [{ byteIndex: 1, msb: 7, lsb: 5 }], description: 'Traffic Class.' },
    { name: 'OHC', fullName: 'OHC[4:0]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 4, lsb: 0 }], description: 'Orthogonal Header Content.' },
    { name: 'TS', fullName: 'Trailer Size', category: 'size', segments: [{ byteIndex: 2, msb: 7, lsb: 5 }], description: 'Trailer Size.' },
    { name: 'Attr', fullName: 'Attribute[2:0]', category: 'ctrl', segments: [{ byteIndex: 2, msb: 4, lsb: 2 }], description: 'Attribute bits.' },
    { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Payload length in DW.' }
  ]
}

// --- FM Cpl DW1 ---
const fmCplDw1: DwRow = {
  label: 'DW1',
  fields: [
    { name: 'Cpl ID', fullName: 'Completer ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Completer ID.' },
    { name: 'EP', fullName: 'Error Poisoned', category: 'status', segments: [{ byteIndex: 6, msb: 7, lsb: 7 }], description: 'Poisoned TLP.' },
    { name: 'LA6', fullName: 'Lower Address[6]', category: 'addr', segments: [{ byteIndex: 6, msb: 6, lsb: 6 }], description: 'Bit 6 of Lower Address.' },
    { name: 'Tag', fullName: 'Tag[13:0]', category: 'id', segments: [{ byteIndex: 6, msb: 5, lsb: 0 }, { byteIndex: 7, msb: 7, lsb: 0 }], description: '14-bit Tag.' }
  ]
}

// --- FM Cpl DW2 ---
const fmCplDw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Dst BDF', fullName: 'Destination BDF/BF', category: 'id', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }], description: 'Destination BDF or Bus Function.' },
    { name: 'LA[5:2]', fullName: 'Lower Address[5:2]', category: 'addr', segments: [{ byteIndex: 10, msb: 7, lsb: 4 }], description: 'Bits 5:2 of Lower Address.' },
    { name: 'Byte Cnt', fullName: 'Byte Count', category: 'size', segments: [{ byteIndex: 10, msb: 3, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 0 }], description: 'Byte Count.' }
  ]
}

// --- FM CplD data row ---
const fmCplDData: DwRow = { label: 'Data', isData: true, fields: [] }

export const completionTlpTypes = [
  {
    id: 'cpl', label: 'Cpl', group: 'completion' as const,
    nfmDws: [nfmCplDw0, nfmCplDw1, nfmCplDw2],
    fmDws: [fmCplDw0, fmCplDw1, fmCplDw2]
  },
  {
    id: 'cpld', label: 'CplD', group: 'completion' as const,
    nfmDws: [nfmCplDw0, nfmCplDw1, nfmCplDw2, nfmCplDData],
    fmDws: [fmCplDw0, fmCplDw1, fmCplDw2, fmCplDData]
  }
]
