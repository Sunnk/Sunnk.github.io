import type { DwRow } from './types'

// I/O Read/Write (placeholder — same header format as MRd/MWr 32-bit but Type = 0 0010b)
const ioDw0: DwRow = {
  label: 'DW0',
  fields: [
    { name: 'Fmt', fullName: 'Format', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 5 }], description: 'IORd: 000b (no data). IOWr: 010b (with data).' },
    { name: 'Type', fullName: 'Type', category: 'ctrl', segments: [{ byteIndex: 0, msb: 4, lsb: 0 }], description: '0 0010b: I/O Request.' },
    { name: 'T9', fullName: 'Tag[9]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 7, lsb: 7 }], description: 'Bit 9 of Tag.' },
    { name: 'TC', fullName: 'Traffic Class', category: 'ctrl', segments: [{ byteIndex: 1, msb: 6, lsb: 4 }], description: 'Traffic Class (must be 0 for I/O).' },
    { name: 'T8', fullName: 'Tag[8]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 3, lsb: 3 }], description: 'Bit 8 of Tag.' },
    { name: 'Attr2', fullName: 'Attribute[2]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 2, lsb: 2 }], description: 'Attribute bit 2.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 1, msb: 1, lsb: 1 }], description: 'Reserved.', reserved: true },
    { name: 'TH', fullName: 'TLP Hints', category: 'ctrl', segments: [{ byteIndex: 1, msb: 0, lsb: 0 }], description: 'TLP Processing Hints.' },
    { name: 'Attr', fullName: 'Attribute[1:0]', category: 'ctrl', segments: [{ byteIndex: 2, msb: 5, lsb: 4 }], description: 'Attribute bits.' },
    { name: 'TD', fullName: 'TLP Digest', category: 'ctrl', segments: [{ byteIndex: 2, msb: 7, lsb: 7 }], description: 'TLP Digest.' },
    { name: 'EP', fullName: 'Error Poisoned', category: 'status', segments: [{ byteIndex: 2, msb: 6, lsb: 6 }], description: 'Poisoned.' },
    { name: 'AT', fullName: 'Address Translation', category: 'ctrl', segments: [{ byteIndex: 2, msb: 3, lsb: 2 }], description: 'Address Translation.' },
    { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Length in DW.' }
  ]
}
const ioDw1: DwRow = {
  label: 'DW1',
  fields: [
    { name: 'Req ID', fullName: 'Requester ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Requester ID.' },
    { name: 'Tag', fullName: 'Tag', category: 'id', segments: [{ byteIndex: 6, msb: 7, lsb: 0 }], description: 'Tag.' },
    { name: 'LastBE', fullName: 'Last DW Byte Enable', category: 'ctrl', segments: [{ byteIndex: 7, msb: 7, lsb: 4 }], description: 'Last DW Byte Enable (must be 0 for I/O).' },
    { name: 'FirstBE', fullName: 'First DW Byte Enable', category: 'ctrl', segments: [{ byteIndex: 7, msb: 3, lsb: 0 }], description: 'First DW Byte Enable.' }
  ]
}
const ioDw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Addr', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 2 }], description: 'I/O Address (32-bit only).' },
    { name: 'PH', fullName: 'Page Hash', category: 'ctrl', segments: [{ byteIndex: 11, msb: 1, lsb: 0 }], description: 'Page Hash.' }
  ]
}
const ioWrData: DwRow = { label: 'Data', isData: true, fields: [] }

export const ioTlpTypes = [
  {
    id: 'iord', label: 'IORd', group: 'io' as const,
    nfmDws: [ioDw0, ioDw1, ioDw2],
    fmDws: []
  },
  {
    id: 'iowr', label: 'IOWr', group: 'io' as const,
    nfmDws: [ioDw0, ioDw1, ioDw2, ioWrData],
    fmDws: []
  }
]
