import type { TlpField, DwRow } from './types'

// --- NFM CfgRd0/CfgWr0 DW0 ---
const nfmCfgDw0: DwRow = {
  label: 'DW0',
  fields: [
    { name: 'Fmt', fullName: 'Format', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 5 }], description: 'CfgRd0: 000b (no data). CfgWr0: 010b (with data).' },
    { name: 'Type', fullName: 'Type', category: 'ctrl', segments: [{ byteIndex: 0, msb: 4, lsb: 0 }], description: '0 0100b: Type 0 Configuration Request.' },
    { name: 'T9', fullName: 'Tag[9]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 7, lsb: 7 }], description: 'Bit 9 of Tag.' },
    { name: 'TC', fullName: 'Traffic Class', category: 'ctrl', segments: [{ byteIndex: 1, msb: 6, lsb: 4 }], description: 'Traffic Class.' },
    { name: 'T8', fullName: 'Tag[8]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 3, lsb: 3 }], description: 'Bit 8 of Tag.' },
    { name: 'Attr2', fullName: 'Attribute[2]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 2, lsb: 2 }], description: 'Attribute bit 2.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 1, msb: 1, lsb: 1 }], description: 'Reserved — must be 0.', reserved: true },
    { name: 'TH', fullName: 'TLP Hints', category: 'ctrl', segments: [{ byteIndex: 1, msb: 0, lsb: 0 }], description: 'TLP Processing Hints.' },
    { name: 'Attr', fullName: 'Attribute[1:0]', category: 'ctrl', segments: [{ byteIndex: 2, msb: 5, lsb: 4 }], description: 'Attribute bits 1:0.' },
    { name: 'TD', fullName: 'TLP Digest', category: 'ctrl', segments: [{ byteIndex: 2, msb: 7, lsb: 7 }], description: 'TLP Digest present.' },
    { name: 'EP', fullName: 'Error Poisoned', category: 'status', segments: [{ byteIndex: 2, msb: 6, lsb: 6 }], description: 'Poisoned TLP.' },
    { name: 'AT', fullName: 'Address Translation', category: 'ctrl', segments: [{ byteIndex: 2, msb: 3, lsb: 2 }], description: 'Address Translation.' },
    { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Payload length in DW (typically 1 DW).' }
  ]
}

// --- NFM CfgRd0/CfgWr0 DW1 ---
const nfmCfgDw1: DwRow = {
  label: 'DW1',
  fields: [
    { name: 'Req ID', fullName: 'Requester ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Requester ID.' },
    { name: 'Tag', fullName: 'Tag', category: 'id', segments: [{ byteIndex: 6, msb: 7, lsb: 0 }], description: 'Transaction Tag.' },
    { name: 'LastBE', fullName: 'Last DW Byte Enable', category: 'ctrl', segments: [{ byteIndex: 7, msb: 7, lsb: 4 }], description: 'Must be 0000b for Config.' },
    { name: 'FirstBE', fullName: 'First DW Byte Enable', category: 'ctrl', segments: [{ byteIndex: 7, msb: 3, lsb: 0 }], description: 'Byte enables for Config data.' }
  ]
}

// --- NFM CfgRd0/CfgWr0 DW2 ---
const nfmCfgDw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Bus', fullName: 'Bus Number', category: 'id', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }], description: 'Target Bus Number.' },
    { name: 'Dev', fullName: 'Device Number', category: 'id', segments: [{ byteIndex: 9, msb: 7, lsb: 3 }], description: 'Target Device Number.' },
    { name: 'Func', fullName: 'Function Number', category: 'id', segments: [{ byteIndex: 9, msb: 2, lsb: 0 }], description: 'Target Function Number.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 10, msb: 7, lsb: 4 }], description: 'Reserved — must be 0.', reserved: true },
    { name: 'Ext Reg', fullName: 'Ext Register Number', category: 'ctrl', segments: [{ byteIndex: 10, msb: 3, lsb: 0 }], description: 'Extended Register Number (bits 11:8).' },
    { name: 'Reg', fullName: 'Register Number', category: 'ctrl', segments: [{ byteIndex: 11, msb: 7, lsb: 2 }], description: 'Register Number (bits 7:2).' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 11, msb: 1, lsb: 0 }], description: 'Reserved — must be 0.', reserved: true }
  ]
}

// --- CfgWr0 data ---
const nfmCfgWr0Data: DwRow = { label: 'Data', isData: true, fields: [] }

// --- FM CfgRd0/CfgWr0 DW0 ---
const fmCfgDw0: DwRow = {
  label: 'DW0',
  fields: [
    { name: 'Type', fullName: 'Type[7:0]', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 0 }], description: 'CfgRd0: #4. CfgWr0: #68.' },
    { name: 'TC', fullName: 'Traffic Class', category: 'ctrl', segments: [{ byteIndex: 1, msb: 7, lsb: 5 }], description: 'Traffic Class.' },
    { name: 'OHC', fullName: 'OHC[4:0]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 4, lsb: 0 }], description: 'Orthogonal Header Content.' },
    { name: 'TS', fullName: 'Trailer Size', category: 'size', segments: [{ byteIndex: 2, msb: 7, lsb: 5 }], description: 'Trailer Size.' },
    { name: 'Attr', fullName: 'Attribute[2:0]', category: 'ctrl', segments: [{ byteIndex: 2, msb: 4, lsb: 2 }], description: 'Attribute bits.' },
    { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Payload length in DW.' }
  ]
}

// --- FM CfgRd0/CfgWr0 DW1 ---
const fmCfgDw1: DwRow = {
  label: 'DW1',
  fields: [
    { name: 'Req ID', fullName: 'Requester ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Requester ID.' },
    { name: 'EP', fullName: 'Error Poisoned', category: 'status', segments: [{ byteIndex: 6, msb: 7, lsb: 7 }], description: 'Poisoned TLP.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 6, msb: 6, lsb: 6 }], description: 'Reserved — must be 0.', reserved: true },
    { name: 'Tag', fullName: 'Tag[13:0]', category: 'id', segments: [{ byteIndex: 6, msb: 5, lsb: 0 }, { byteIndex: 7, msb: 7, lsb: 0 }], description: '14-bit Tag.' }
  ]
}

// --- FM CfgRd0/CfgWr0 DW2 ---
const fmCfgDw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Dst BDF', fullName: 'Destination BDF', category: 'id', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }], description: 'Destination BDF.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 10, msb: 7, lsb: 4 }], description: 'Reserved — must be 0.', reserved: true },
    { name: 'Reg', fullName: 'Register Number', category: 'ctrl', segments: [{ byteIndex: 10, msb: 3, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 2 }], description: 'Register Number.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 11, msb: 1, lsb: 0 }], description: 'Reserved — must be 0.', reserved: true }
  ]
}

export const configTlpTypes = [
  {
    id: 'cfgrd0', label: 'CfgRd0', group: 'config' as const,
    nfmDws: [nfmCfgDw0, nfmCfgDw1, nfmCfgDw2],
    fmDws: [fmCfgDw0, fmCfgDw1, fmCfgDw2]
  },
  {
    id: 'cfgwr0', label: 'CfgWr0', group: 'config' as const,
    nfmDws: [nfmCfgDw0, nfmCfgDw1, nfmCfgDw2, nfmCfgWr0Data],
    fmDws: [fmCfgDw0, fmCfgDw1, fmCfgDw2]
  }
]
