import type { TlpField, DwRow } from './types'

// --- NFM Msg common DW0 ---
const nfmMsgDw0: DwRow = {
  label: 'DW0',
  fields: [
    { name: 'Fmt', fullName: 'Format', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 5 }], description: '001b: 4DW header (Msg).' },
    { name: 'Type', fullName: 'Type', category: 'ctrl', segments: [{ byteIndex: 0, msb: 4, lsb: 0 }], description: '1 0r2r1r0b: Message with routing type.' },
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
    { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Message length (typically 0).' }
  ]
}

// --- NFM Msg DW1 ---
const nfmMsgDw1: DwRow = {
  label: 'DW1',
  fields: [
    { name: 'Req ID', fullName: 'Requester ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Requester ID.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 6, msb: 7, lsb: 0 }], description: 'Reserved.', reserved: true },
    { name: 'Msg Code', fullName: 'Message Code', category: 'ctrl', segments: [{ byteIndex: 7, msb: 7, lsb: 0 }], description: 'Message code identifying the message type.' }
  ]
}

// --- NFM Msg Address Routing DW2/DW3 ---
const nfmMsgAddrDw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Addr[63:32]', fullName: 'Address[63:32]', category: 'addr', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 0 }], description: 'Upper 32 bits of address (address-routed).' }
  ]
}
const nfmMsgAddrDw3: DwRow = {
  label: 'DW3',
  fields: [
    { name: 'Addr[31:2]', fullName: 'Address[31:2]', category: 'addr', segments: [{ byteIndex: 12, msb: 7, lsb: 0 }, { byteIndex: 13, msb: 7, lsb: 0 }, { byteIndex: 14, msb: 7, lsb: 0 }, { byteIndex: 15, msb: 7, lsb: 2 }], description: 'Lower 30 bits of address.' },
    { name: 'PH', fullName: 'Page Hash', category: 'ctrl', segments: [{ byteIndex: 15, msb: 1, lsb: 0 }], description: 'Page Hash (if TH=1).' }
  ]
}

// --- NFM Msg ID Routing DW2/DW3 (placeholder) ---
const nfmMsgIDDw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'Dst ID', fullName: 'Destination ID', category: 'id', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }], description: 'Target Bus/Device/Function.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 0 }], description: 'Reserved.', reserved: true }
  ]
}
const nfmMsgIDDw3: DwRow = {
  label: 'DW3',
  fields: [
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 12, msb: 7, lsb: 0 }, { byteIndex: 13, msb: 7, lsb: 0 }, { byteIndex: 14, msb: 7, lsb: 0 }, { byteIndex: 15, msb: 7, lsb: 0 }], description: 'Reserved.', reserved: true }
  ]
}

// --- NFM Msg Broadcast/Local DW2/DW3 (placeholder) ---
const nfmMsgBroadcastDw2: DwRow = {
  label: 'DW2',
  fields: [
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 8, msb: 7, lsb: 0 }, { byteIndex: 9, msb: 7, lsb: 0 }, { byteIndex: 10, msb: 7, lsb: 0 }, { byteIndex: 11, msb: 7, lsb: 0 }], description: 'Routing-specific fields (placeholder).', reserved: true }
  ]
}
const nfmMsgBroadcastDw3: DwRow = {
  label: 'DW3',
  fields: [
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 12, msb: 7, lsb: 0 }, { byteIndex: 13, msb: 7, lsb: 0 }, { byteIndex: 14, msb: 7, lsb: 0 }, { byteIndex: 15, msb: 7, lsb: 0 }], description: 'Routing-specific fields (placeholder).', reserved: true }
  ]
}

const nfmMsgLocalDw2 = nfmMsgBroadcastDw2
const nfmMsgLocalDw3 = nfmMsgBroadcastDw3
const nfmMsgGatherDw2 = nfmMsgBroadcastDw2
const nfmMsgGatherDw3 = nfmMsgBroadcastDw3
const nfmMsgLocalAltDw2 = nfmMsgBroadcastDw2
const nfmMsgLocalAltDw3 = nfmMsgBroadcastDw3

// --- FM Msg (placeholder, similar structure) ---
const fmMsgDw0: DwRow = {
  label: 'DW0',
  fields: [
    { name: 'Type', fullName: 'Type[7:0]', category: 'ctrl', segments: [{ byteIndex: 0, msb: 7, lsb: 0 }], description: 'Message type (Flit Mode).' },
    { name: 'TC', fullName: 'Traffic Class', category: 'ctrl', segments: [{ byteIndex: 1, msb: 7, lsb: 5 }], description: 'Traffic Class.' },
    { name: 'OHC', fullName: 'OHC[4:0]', category: 'ctrl', segments: [{ byteIndex: 1, msb: 4, lsb: 0 }], description: 'Orthogonal Header Content.' },
    { name: 'TS', fullName: 'Trailer Size', category: 'size', segments: [{ byteIndex: 2, msb: 7, lsb: 5 }], description: 'Trailer Size.' },
    { name: 'Attr', fullName: 'Attribute[2:0]', category: 'ctrl', segments: [{ byteIndex: 2, msb: 4, lsb: 2 }], description: 'Attribute bits.' },
    { name: 'Len', fullName: 'Length[9:0]', category: 'size', segments: [{ byteIndex: 2, msb: 1, lsb: 0 }, { byteIndex: 3, msb: 7, lsb: 0 }], description: 'Payload length in DW.' }
  ]
}
const fmMsgDw1: DwRow = {
  label: 'DW1',
  fields: [
    { name: 'Req ID', fullName: 'Requester ID', category: 'id', segments: [{ byteIndex: 4, msb: 7, lsb: 0 }, { byteIndex: 5, msb: 7, lsb: 0 }], description: 'Requester ID.' },
    { name: 'EP', fullName: 'Error Poisoned', category: 'status', segments: [{ byteIndex: 6, msb: 7, lsb: 7 }], description: 'Poisoned.' },
    { name: 'R', fullName: 'Reserved', category: 'rsvd', segments: [{ byteIndex: 6, msb: 6, lsb: 0 }], description: 'Reserved.', reserved: true },
    { name: 'Msg Code', fullName: 'Message Code', category: 'ctrl', segments: [{ byteIndex: 7, msb: 7, lsb: 0 }], description: 'Message Code.' }
  ]
}
const fmMsgDw2 = nfmMsgBroadcastDw2
const fmMsgDw3 = nfmMsgBroadcastDw3

export const messageTlpTypes = [
  {
    id: 'msg-addr', label: 'Msg (Addr)', group: 'message' as const,
    nfmDws: [nfmMsgDw0, nfmMsgDw1, nfmMsgAddrDw2, nfmMsgAddrDw3],
    fmDws: [fmMsgDw0, fmMsgDw1, fmMsgDw2, fmMsgDw3],
    variants: [
      { id: 'addr', label: 'Addr', nfmDws: [nfmMsgDw0, nfmMsgDw1, nfmMsgAddrDw2, nfmMsgAddrDw3], fmDws: [fmMsgDw0, fmMsgDw1, fmMsgDw2, fmMsgDw3] },
      { id: 'id', label: 'ID', nfmDws: [nfmMsgDw0, nfmMsgDw1, nfmMsgIDDw2, nfmMsgIDDw3], fmDws: [fmMsgDw0, fmMsgDw1, fmMsgDw2, fmMsgDw3] },
      { id: 'broadcast', label: 'Broadcast', nfmDws: [nfmMsgDw0, nfmMsgDw1, nfmMsgBroadcastDw2, nfmMsgBroadcastDw3], fmDws: [fmMsgDw0, fmMsgDw1, fmMsgDw2, fmMsgDw3] },
      { id: 'local', label: 'Local', nfmDws: [nfmMsgDw0, nfmMsgDw1, nfmMsgLocalDw2, nfmMsgLocalDw3], fmDws: [fmMsgDw0, fmMsgDw1, fmMsgDw2, fmMsgDw3] },
      { id: 'gather', label: 'Gather→RC', nfmDws: [nfmMsgDw0, nfmMsgDw1, nfmMsgGatherDw2, nfmMsgGatherDw3], fmDws: [fmMsgDw0, fmMsgDw1, fmMsgDw2, fmMsgDw3] },
      { id: 'local-alt', label: 'Local(Alt)', nfmDws: [nfmMsgDw0, nfmMsgDw1, nfmMsgLocalAltDw2, nfmMsgLocalAltDw3], fmDws: [fmMsgDw0, fmMsgDw1, fmMsgDw2, fmMsgDw3] }
    ]
  }
]
