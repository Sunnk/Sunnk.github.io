# 2. Transaction Layer Specification §

# 2.1 Transaction Layer Overview §

![](images/9eec632335e86c2cbe9ee939f73c120aa3bc8ec63577160e9cb3107629403588.jpg)



OM14295



Figure 2-1 Layering Diagram Highlighting the Transaction Layer §


At a high level, the key aspects of the Transaction Layer are: 

• A pipelined full Split-Transaction protocol 

• Mechanisms for differentiating the ordering and processing requirements of Transaction Layer Packets (TLPs) 

• Credit-based flow control 

• Optional support for data poisoning and end-to-end data integrity detection. 

The Transaction Layer comprehends the following: 

• TLP construction and processing 

• Association of transaction-level mechanisms with device resources including: 

◦ Flow Control 

◦ Virtual Channel management 

• Rules for ordering and management of TLPs 

◦ PCI/PCI-X compatible ordering 

◦ Traffic Class differentiation 

◦ UIO Ordering 

This chapter specifies the behaviors associated with the Transaction Layer. 

# 2.1.1 Address Spaces, Transaction Types, and Usage §

Transactions form the basis for information transfer between a Requester and Completer. Four address spaces are defined, and different Transaction types are defined, each with its own unique intended usage, as shown in § Table 2-1. 


Table 2-1 Transaction Types for Different Address Spaces §


<table><tr><td>Address Space</td><td>Transaction Types</td><td>Basic Usage</td></tr><tr><td>Memory</td><td>ReadWrite</td><td>Transfer data to/from a memory-mapped location</td></tr><tr><td>I/O</td><td>ReadWrite</td><td>Transfer data to/from an I/O-mapped location</td></tr><tr><td>Configuration</td><td>ReadWrite</td><td>Device Function configuration/setup</td></tr><tr><td>Message</td><td>Baseline(including Vendor-Defined)</td><td>From event signaling mechanism to general purpose messaging</td></tr></table>

Details about the rules associated with usage of these address formats and the associated TLP formats are described later in this chapter. 

# 2.1.1.1 Memory Transactions §

Memory Transactions include the following types: 

• Read Request/Completion 

• Write Request (and Completions for UIO) 

• Deferrable Memory Write Request/Completion 

• AtomicOp Request/Completion 

Memory Transactions use two different address formats: 

• Short Address Format 32-bit address 

• Long Address Format 64-bit address 

Certain Memory Transactions can optionally include a PASID TLP Prefix (NFM) or OHC-A1/OHC-A4 (FM) containing the Process Address Space ID (PASID). See § Section 6.20 for details. 

Certain Memory Transactions are required to use only 64-bit address formats. 

# 2.1.1.2 I/O Transactions §

PCI Express supports I/O Space for compatibility with legacy devices that require their use. Future revisions of this specification may deprecate the use of I/O Space. I/O Transactions include the following types: 

• Read Request/Completion 

• Write Request/Completion 

I/O Transactions use a single address format: 

• Short Address Format 32-bit address 

# 2.1.1.3 Configuration Transactions §

Configuration Transactions are used to access configuration registers of Functions within devices. 

Configuration Transactions include the following types: 

• Read Request/Completion 

• Write Request/Completion 

# 2.1.1.4 Message Transactions §

The Message Transactions, or simply Messages, are used to support in-band communication of events between devices. 

In addition to specific Messages defined in this document, PCI Express provides support for Vendor-Defined Messages using specified Message codes. Except for Vendor-Defined Messages that use the PCI-SIG® Vendor ID (0001h), the definition of specific Vendor-Defined Messages is outside the scope of this document. 

This specification establishes a standard framework within which vendors can specify their own Vendor-Defined Messages tailored to fit the specific requirements of their platforms (see § Section 2.2.8.6 ). 

Note that these Vendor-Defined Messages are not guaranteed to be interoperable with components from different vendors. 

# 2.1.2 Packet Format Overview §

Transactions consist of Requests and Completions, which are communicated using packets. § Figure 2-2 shows a high level serialized view of a Non-Flit Mode TLP, consisting of one or more optional TLP Prefixes, a TLP header, a data payload (for some types of packets), and an optional TLP Digest. § Figure 2-3 shows a more detailed view of the TLP. The following sections of this chapter define the detailed structure of the packet headers and digest. 

PCI Express conceptually transfers information as a serialized stream of bytes as shown in § Figure 2-2. Note that at the byte level, information is transmitted/received over the interconnect with the left-most byte of the TLP as shown in § Figure 2-2 being transmitted/received first (byte 0 if one or more optional TLP Prefixes are present else byte H). Refer to § Section 4.2 for details on how individual bytes of the packet are encoded and transmitted over the physical media. 

Detailed layouts of the TLP Prefix, TLP Header and TLP Digest (presented in generic form in § Figure 2-3) are drawn with the lower numbered bytes on the left rather than on the right as has traditionally been depicted in other PCI specifications. The header layout is optimized for performance on a serialized interconnect, driven by the requirement that the most time critical information be transferred first. For example, within the TLP header, the most significant byte of the address field is transferred first so that it may be used for early address decode. 

The data payload within a TLP is depicted with the lowest addressed byte (byte J in § Figure 2-3) shown to the upper left. Detailed layouts depicting data structure organization (such as the Configuration Space depictions in § Chapter 7. ) retain the traditional PCI byte layout with the lowest addressed byte shown on the right. Regardless of depiction, all bytes are conceptually transmitted over the Link in increasing byte number order. 

Depending on the type of a packet, the header for that packet will include some of the following types of fields: 

• Format of the packet 

• Type of the packet 

• Length for any associated data 

• Transaction Descriptor, including: 

◦ Transaction ID 

◦ Attributes 

◦ Traffic Class 

• Address/routing information 

• Byte Enables 

• Message encoding 

• Completion status 

# 2.2 Transaction Layer Protocol - Packet Definition §

PCI Express uses a packet based protocol to exchange information between the Transaction Layers of the two components communicating with each other over the Link. PCI Express supports the following basic transaction types: Memory, I/O, Configuration, and Messages. Two addressing formats for Memory Requests are supported: 32 bit and 64 bit. 

A UIO TLP is a TLP that is associated with a UIO Virtual Channel. 

Transactions are carried using Requests and Completions. Completions are used only where required, for example, to return read data, or to acknowledge Completion of I/O and Configuration Write Transactions. All UIO Requests require Completions. Completions are associated with their corresponding Requests by the value in the Transaction ID field of the Packet header. 

All TLP fields marked Reserved (sometimes abbreviated as R) must be filled with all 0's when a TLP is formed. Values in such fields must be ignored by Receivers and forwarded unmodified by Switches. Note that for certain fields there are both specified and Reserved values - the handling of Reserved values in these cases is specified separately for each case. 

There are different header formats for Non-Flit Mode (NFM) and Flit Mode (FM). Routing elements must translate between the FM and NFM TLP formats when the Ingress Port and Egress Port are in different modes. In some cases, translation is not possible, and the handling of such cases is also defined in this chapter. 

# 2.2.1 Common Packet Header Fields §

# 2.2.1.1 Common Packet Header Fields for Non-Flit Mode §

All TLP prefixes and headers contain the following fields (see § Figure 2-4): 

• Fmt[2:0] - Format of TLP (see § Table 2-2) - bits 7:5 of byte 0 

• Type[4:0] - Type of TLP - bits 4:0 of byte 0 

![](images/aadb84b6c81678cb3cd20ea2d6111ea0ce78a786e5445b31bf2d0b57367a78b8.jpg)



Figure 2-4 Fields Present in All Non-Flit Mode TLPs §


The Fmt field(s) indicates the presence of one or more TLP Prefixes and the Type field(s) indicates the associated TLP Prefix type(s). 

The Fmt and Type fields of the TLP Header provide the information required to determine the size of the remaining part of the TLP Header, and if the packet contains a data payload following the header. 

The Fmt, Type, TD, and Length fields of the TLP Header contain all information necessary to determine the overall size of the non-prefix portion of the TLP. The Type field, in addition to defining the type of the TLP also determines how the TLP is routed by a Switch. Different types of TLPs are discussed in more detail in the following sections. 

• Permitted Fmt[2:0] and Type[4:0] field values are shown in § Table 2-3. 

◦ All other encodings are Reserved (see § Section 2.3 ). 

• TC[2:0] - Traffic Class (see § Section 2.2.6.6 ) - bits [6:4] of byte 1 

• R (byte 1 bit 1) - Reserved; formerly was the Lightweight Notification (LN) bit, but is now available for reassignment. 

• TLP Hints (TH) - 1b indicates the presence of TLP Processing Hints (TPH) in the TLP header and optional TPH TLP Prefix (if present) - bit 0 of byte 1 (see § Section 2.2.7.1.1 ) 

• Attr[1:0] - Attributes (see § Section 2.2.6.3 ) - bits [5:4] of byte 2 

• Attr[2] - Attribute (see § Section 2.2.6.3 ) - bit 2 of byte 1 (shown as A2 in figures) 

• TD - 1b indicates presence of TLP Digest in the form of a single Double Word (DW) at the end of the TLP (see § Section 2.2.3 ) - bit 7 of byte 2 

• Error Poisoned (EP) - indicates the TLP is poisoned (see § Section 2.7 ) - bit 6 of byte 2 

• Length[9:0] - Length of data payload, or of data referenced, in DW (see § Table 2-4) - bits 1:0 of byte 2 concatenated with bits 7:0 of byte 3 

◦ TLP data must be 4-byte naturally aligned and in increments of 4-byte DW. 

◦ Reserved for TLPs that do not contain or refer to data payloads, including Cpl, CplLk, and Messages (except as specified) 


Table 2-2 Fmt[2:0] Field Values §


<table><tr><td>Fmt[2:0]</td><td>Corresponding TLP Format</td></tr><tr><td>000b</td><td>3 DW header, no data</td></tr><tr><td>001b</td><td>4 DW header, no data</td></tr><tr><td>010b</td><td>3 DW header, with data</td></tr><tr><td>011b</td><td>4 DW header, with data</td></tr><tr><td>100b</td><td>TLP Prefix</td></tr><tr><td></td><td>All encodings not shown above are Reserved (see § Section 2.3).</td></tr></table>


Table 2-3 Non-Flit Mode Fmt[2:0] and Type[4:0] Field Encodings §


<table><tr><td>Name</td><td>Fmt [2:0]<eq>^4</eq>(b)</td><td>Type [4:0] (b)</td><td>Description</td></tr><tr><td>MRd</td><td>000001</td><td>0 0000</td><td>Memory Read Request</td></tr><tr><td>Name</td><td>Fmt [2:0] (b)</td><td>Type [4:0] (b)</td><td>Description</td></tr><tr><td>MRdLk</td><td>000001</td><td>0 0001</td><td>Memory Read Request-Locked</td></tr><tr><td>MWr</td><td>010011</td><td>0 0000</td><td>Memory Write Request</td></tr><tr><td>IORd</td><td>000</td><td>0 0010</td><td>I/O Read Request</td></tr><tr><td>IOWr</td><td>010</td><td>0 0010</td><td>I/O Write Request</td></tr><tr><td>CfgRd0</td><td>000</td><td>0 0100</td><td>Type 0 Configuration Read Request</td></tr><tr><td>CfgWr0</td><td>010</td><td>0 0100</td><td>Type 0 Configuration Write Request</td></tr><tr><td>CfgRd1</td><td>000</td><td>0 0101</td><td>Type 1 Configuration Read Request</td></tr><tr><td>CfgWr1</td><td>010</td><td>0 0101</td><td>Type 1 Configuration Write Request</td></tr><tr><td>TCfgRd</td><td>000</td><td>1 1011</td><td>Deprecated TLP Type<eq>^5</eq></td></tr><tr><td>DMWr</td><td>010011</td><td>1 1011</td><td>Deferrable Memory Write Request<eq>^6</eq></td></tr><tr><td>Msg</td><td>001</td><td><eq>10r_2r_1r_0</eq></td><td>Message Request - The sub-field r[2:0] specifies the Message routing mechanism (see § Table 2-20).</td></tr><tr><td>MsgD</td><td>011</td><td><eq>10r_2r_1r_0</eq></td><td>Message Request with data payload - The sub-field r[2:0] specifies the Message routing mechanism (see § Table 2-20).</td></tr><tr><td>Cpl</td><td>000</td><td>0 1010</td><td>Completion without Data - Used for I/O, Configuration Write, and Deferrable Memory Write Completions with any Completion Status. Also used for AtomicOp Completions and Read Completions (I/O, Configuration, or Memory) with Completion Status other than Successful Completion.</td></tr><tr><td>CplD</td><td>010</td><td>0 1010</td><td>Completion with Data - Used for Memory, I/O, and Configuration Read Completions. Also used for AtomicOp Completions.</td></tr><tr><td>CplLk</td><td>000</td><td>0 1011</td><td>Completion for Locked Memory Read without Data - Used only in error case.</td></tr><tr><td>CplDLk</td><td>010</td><td>0 1011</td><td>Completion for Locked Memory Read - Otherwise like CplD.</td></tr><tr><td>FetchAdd</td><td>010011</td><td>0 1100</td><td>Fetch and Add AtomicOp Request</td></tr><tr><td>Swap</td><td>010011</td><td>0 1101</td><td>Unconditional Swap AtomicOp Request</td></tr><tr><td>CAS</td><td>010011</td><td>0 1110</td><td>Compare and Swap AtomicOp Request</td></tr><tr><td>LPrfx</td><td>100</td><td><eq>0L_3L_2L_1L_0</eq></td><td>Local TLP Prefix - The sub-field L[3:0] specifies the Local TLP Prefix type (see § Table 2-38).</td></tr><tr><td>EPrfx</td><td>100</td><td><eq>1E_3E_2E_1E_0</eq></td><td>End-End TLP Prefix - The sub-field E[3:0] specifies the End-End TLP Prefix type (see § Table 2-39).</td></tr></table>

5. Deprecated TLP Types: previously used for Trusted Configuration Space (TCS), which is no longer supported by this specification. If a Receiver does not implement TCS, the Receiver must treat such Requests as Malformed TLPs. 

6. This TLP Type value was previously used for Trusted Configuration Space (TCS) Writes, which are no longer supported by this specification. 

<table><tr><td>Name</td><td>Fmt [2:0] (b)</td><td>Type [4:0] (b)</td><td>Description</td></tr><tr><td></td><td></td><td></td><td>All encodings not shown above are Reserved (see § Section 2.3).</td></tr></table>


Table 2-4 Length[9:0] Field Encoding §


<table><tr><td>Length[9:0]</td><td>Corresponding TLP Data Payload Size</td></tr><tr><td>00 0000 0001b</td><td>1 DW</td></tr><tr><td>00 0000 0010b</td><td>2 DW</td></tr><tr><td>...</td><td>...</td></tr><tr><td>11 1111 1111b</td><td>1023 DW</td></tr><tr><td>00 0000 0000b</td><td>1024 DW</td></tr></table>

# 2.2.1.2 Common Packet Header Fields for Flit Mode §

The TLP grammar is defined as: 

• zero or more 1DW Local TLP prefixes 7 

• TLP Header Base with size indicated by Type[7:0] field, followed by zero to 7 DW of Orthogonal Header Content (OHC) as indicated by OHC[4:0] field 

• TLP data payload of 0 to 1024DW 

• TLP Trailer, if present as indicated by TS[2:0] field 

It is required to transmit NOP TLPs while TLP transmission is active if there are no other TLPs to transmit. NOP TLPs must be discarded without effect by the Receiver. All header fields other than the Type field are Reserved for NOP TLPs. 

Other notable differences between Flit Mode and Non-Flit Mode TLPs include the following: 

• Content that in Non-Flit Mode is included in End-to-End TLP prefixes is now incorporated within the header, as OHC. 

• In Flit Mode, Steering Tags are not overlayed with the Byte Enables. The PH, Steering Tags, and AMA/AV fields are consolidated in OHC. 

All Flit Mode TLPs contain the same fields in the first DW of the Header Base (see § Figure 2-6). 

![](images/65907cf4685f55c2a976dd3f5bd563eb32e97e3ec472e953ca5122581f37b363.jpg)



Figure 2-6 First DW of Header Base §


§ Table 2-5 defines the values for the Type[7:0] field for Flit Mode. 

7. Sequencing requirements between Local Vendor Defined TLP Prefixes and the Flit Mode Local TLP Prefix are implementation specific. 

• The Type[7:0] field must be fully decoded by all Receivers regardless of which specific encodings are supported. 

• All Receivers must handle Flow Control for all Type[7:0] field encodings as specified. 

◦ For TLPs, where the FC Type is none, Receivers are not required to buffer the TLP, and must silently discard the TLP; for other FC Types: 

▪ Switch Ports must buffer and route TLPs, including Reserved entries, as specified. 

Endpoint Upstream Ports and Root Ports are required to buffer, including for Header Logging, up to the largest Header Base size plus all OHC content, but are permitted, after accounting for Flow Control, to discard Header Base and OHC content that is not supported by the Port and not include that information in header logging. 

• For all Reserved entries, TLP routing must be handled as indicated in the Description field, and the Header Base fields used for routing are at the same location within the Header as with the non-Reserved Header Base formats. 

◦ Entries marked “Local … Terminate at Receiver” must be discarded at the Receiving Port. 

• A Receiver targeted by a TLP with a Reserved Type[7:0] encoding of FC Type PR or NPR is strongly recommended 8 to discard the Request following the update of flow control credits, and must handle a TLP with Reserved Type[7:0] encoding of FC Type CPL as an Unexpected Completion. 

• A Routing Element that receives a TLP to be forwarded with a Reserved Type[7:0] encoding of FC Type PR or NPR, but is unable to forward it due to a problem like the Egress Port being in DL_Down, is strongly recommended 9 to discard the Request following the update of flow control credits. 

• UIO Requests using FC Type PR are referred to as UIO PR-FC TLPs; UIO Requests using FC Type NPR are referred to as UIO NPR-FC TLPs. 

In the Translation Rule column, an entry of “1:1” indicates that there is no change in meaning or behavior when translating between Non-Flit Mode and Flit Mode in either direction. For TLPs that cannot be translated, those not handled by the Ingress Port must be handled by the Egress Port as follows, logging a TLP Translation Egress Blocked error when an error is reported. 

Egress Port errors are handled according to one of the following rules: 

• Egress Rule P – PR FC Type: block at Egress Port; if TLP is UIO, report no error, else handle as Uncorrectable 

• Egress Rule NP – NPR FC Type: block at Egress Port; report no error 

• Egress Rule CPL – CPL FC Type: block at Egress Port; handle as Uncorrectable 

UIO is defined only for FM, and no translation of UIO TLPs to NFM is permitted. UIO TLPs targeting an Egress Port in NFM must be handled as described in the preceding paragraph. Note that error cases involving UIO VC mis-matches are addressed in § Section 2.5.2 . 

UIO TLPs are indicated as UIO in the Description column. Entries marked Reserved in the description column do not have an assigned VC restriction. A restriction, if required, will be specified when those entries become defined. Entries #0, #141-143 do not have an assigned VC restriction. All other entries are non-UIO TLPs. 


Table 2-5 Flit Mode TLP Header Type Encodings §


<table><tr><td rowspan="2">#</td><td colspan="8">Type</td><td rowspan="2">Description</td><td rowspan="2">Name</td><td rowspan="2">FC Type</td><td rowspan="2">Data Payload?</td><td rowspan="2">Header Base Size (DW)</td><td rowspan="2">New for Flit Mode</td><td rowspan="2">Translation Rule</td></tr><tr><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>No Operation - Local TLP - Terminate at Receiver</td><td>NOP</td><td>none</td><td>n</td><td>1</td><td>y</td><td>NFM uses this Type code for MRd (see #3)</td></tr><tr><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>Memory Read Request Locked, 32b address routed</td><td>MRdLk</td><td>NPR</td><td>n</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>I/O Read Request</td><td>IORd</td><td>NPR</td><td>n</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>3</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>Memory Read Request, 32b address routed</td><td>MRd</td><td>NPR</td><td>n</td><td>3</td><td>y/n</td><td>Requires change of Type field value</td></tr><tr><td>4</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>Type 0 Configuration Read Request</td><td>CfgRd0</td><td>NPR</td><td>n</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>5</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>Type 1 Configuration Read Request</td><td>CfgRd1</td><td>NPR</td><td>n</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>6</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td rowspan="2">Reserved - ID routed</td><td></td><td>CPL</td><td>Length</td><td>4</td><td>y</td><td rowspan="2">Block at NFM Egress - Uncorrectable</td></tr><tr><td>7</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td></td><td>CPL</td><td>Length</td><td>4</td><td>y</td></tr><tr><td>8</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td rowspan="2">Reserved - ID routed</td><td></td><td>PR</td><td>n</td><td>3</td><td>y</td><td rowspan="2">Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>9</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td></td><td>PR</td><td>n</td><td>3</td><td>y</td></tr><tr><td>10</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>Completion without Data</td><td>Cpl</td><td>CPL</td><td>n</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>11</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>Completion without Data, Locked (only for error cases)</td><td>Cpllk</td><td>CPL</td><td>n</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>12</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>UIO Write Completion</td><td>UIOWrCpl</td><td>CPL</td><td>n</td><td>3</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>13</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>UIO Read Completion - No Data</td><td>UIORdCpl</td><td>CPL</td><td>n</td><td>3</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>14-15</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>CPL</td><td>n</td><td>3</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>16-19</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>Length</td><td>5</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>20-21</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>Length</td><td>5</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>22-23</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>Length</td><td>7</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>24</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td rowspan="3">Reserved - ID routed</td><td></td><td>CPL</td><td>n</td><td>7</td><td>y</td><td rowspan="4">Block at NFM Egress - Uncorrectable</td></tr><tr><td>25</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td></td><td>CPL</td><td>n</td><td>7</td><td>y</td></tr><tr><td>26</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td></td><td>CPL</td><td>Length</td><td>7</td><td>y</td></tr><tr><td>27</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>Reserved - ID routed {was: Trusted Configuration Read (deprecated)}</td><td></td><td>CPL</td><td>Length</td><td>7</td><td>y</td></tr><tr><td>28-29</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>NPR</td><td>n</td><td>3</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>30-31</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>NPR</td><td>n</td><td>6</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>32</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>Memory Read Request, 64b address routed</td><td>MRd</td><td>NPR</td><td>n</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>33</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>Memory Read Request Locked, 64b address routed</td><td>MRdLk</td><td>NPR</td><td>n</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>34</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>UIO Memory Read Request</td><td>UIOMRd</td><td>NPR</td><td>n</td><td>4</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>35</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td rowspan="2">Reserved - 64b address routed</td><td></td><td>NPR</td><td>n</td><td>4</td><td>y</td><td rowspan="2">Block at NFM Egress - report no error</td></tr><tr><td>36-39</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>X</td><td>X</td><td></td><td>NPR</td><td>n</td><td>4</td><td>y</td></tr><tr><td>40-43</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>X</td><td>X</td><td>Reserved - ID routed</td><td></td><td>CPL</td><td>n</td><td>4</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>44-45</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>n</td><td>4</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>46-47</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>n</td><td>5</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>48</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>Message w/o Data, Routed to Root Complex</td><td>Msg</td><td>PR</td><td>n</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>49</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>Message w/o Data, Routed by Address (64b) - NONE DEFINED</td><td>Msg</td><td>PR</td><td>n</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>50</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>Message w/o Data, Routed by ID</td><td>Msg</td><td>PR</td><td>n</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>51</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>Message w/o Data, Broadcast from Root Complex</td><td>Msg</td><td>PR</td><td>n</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>52</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>Message w/o Data, Local - Terminate at Receiver</td><td>Msg</td><td>PR</td><td>n</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>53</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>Message w/o Data, Gathered and routed to RC (PME_TO_Ack)</td><td>Msg</td><td>PR</td><td>n</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>54</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td rowspan="2">Message w/o Data -- RESERVED</td><td>Msg</td><td>PR</td><td>n</td><td>4</td><td>n</td><td rowspan="2">N/A</td></tr><tr><td>55</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>Msg</td><td>PR</td><td>n</td><td>4</td><td>n</td></tr><tr><td>56-59</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>n</td><td>4</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>60-61</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>NPR</td><td>n</td><td>4</td><td>y</td><td rowspan="2"></td></tr><tr><td>62-63</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>NPR</td><td>n</td><td>5</td><td>y</td></tr><tr><td>64</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>Memory Write Request, 32b address routed</td><td>MWr</td><td>PR</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>65</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>Length</td><td>6</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>66</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>I/O Write Request</td><td>IOWr</td><td>NPR</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>67</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>Length</td><td>6</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>68</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>Type 0 Configuration Write Request</td><td>CfgWr0</td><td>NPR</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>69</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>Type 1 Configuration Write Request</td><td>CfgWr1</td><td>NPR</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>70</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td rowspan="2">Reserved - ID routed</td><td></td><td>NPR</td><td>Length</td><td>3</td><td>y</td><td rowspan="2">Block at NFM Egress - report no error</td></tr><tr><td>71</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td></td><td>NPR</td><td>Length</td><td>3</td><td>y</td></tr><tr><td>72</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>UIO Read Completion with Data</td><td>UIORdCplD</td><td>CPL</td><td>Length</td><td>3</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>73</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>Reserved - ID routed</td><td></td><td>CPL</td><td>Length</td><td>3</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>74</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>Completion with Data</td><td>CplD</td><td>CPL</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>75</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>Completion with Data, Locked</td><td>CplDLk</td><td>CPL</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>76</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>Fetch and Add AtomicOp Request, 32baddress routed</td><td>FetchAdd</td><td>NPR</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>77</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>Unconditional Swap AtomicOp Request, 32b address routed</td><td>Swap</td><td>NPR</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>78</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>Compare and Swap AtomicOp Request, 32b address routed</td><td>CAS</td><td>NPR</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>79</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>n</td><td>4</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>80-83</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>Length</td><td>6</td><td>y</td><td rowspan="3">Block at NFM Egress - report no error</td></tr><tr><td>84-85</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>Length</td><td>6</td><td>y</td></tr><tr><td>86-87</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>Length</td><td>7</td><td>y</td></tr><tr><td>88-89</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>Length</td><td>3</td><td>y</td><td rowspan="2">Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>90</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>Length</td><td>4</td><td>y</td></tr><tr><td>91</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>Deferrable Memory Write Request, 32b address routed {was: Trusted Configuration Write (deprecated)}</td><td>DMWr</td><td>NPR</td><td>Length</td><td>3</td><td>n</td><td>1:1</td></tr><tr><td>92-93</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>Length</td><td>4</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no</td></tr><tr><td>94-95</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>Length</td><td>5</td><td>y</td><td>error, else handle as Uncorrectable</td></tr><tr><td>96</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>Memory Write Request, 64b address routed</td><td>MWr</td><td>PR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>97</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>UIO Memory Write Request</td><td>UIOMWr</td><td>PR</td><td>Length</td><td>4</td><td>y</td><td rowspan="3">Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>98-99</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>X</td><td rowspan="2">Reserved - 64b address routed</td><td></td><td>PR</td><td>Length</td><td>4</td><td>y</td></tr><tr><td>100-103</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>X</td><td>X</td><td></td><td>PR</td><td>Length</td><td>4</td><td>y</td></tr><tr><td>104-107</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>Length</td><td>4</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>108</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>Fetch and Add AtomicOp Request, 64b address routed</td><td>FetchAdd</td><td>NPR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>109</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>Unconditional Swap AtomicOp Request, 64b address routed</td><td>Swap</td><td>NPR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>110</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>Compare and Swap AtomicOp Request, 64b address routed</td><td>CAS</td><td>NPR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>111</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>Length</td><td>4</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>112</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>Message with Data, Routed to Root Complex</td><td>MsgD</td><td>PR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>113</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>Message with Data, Routed by Address (64b) - NONE DEFINED</td><td>MsgD</td><td>PR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>114</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>Message with Data, Routed by ID</td><td>MsgD</td><td>PR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>115</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>Message with Data, Broadcast from Root Complex</td><td>MsgD</td><td>PR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>116</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>Message with Data, Local - Terminate at Receiver</td><td>MsgD</td><td>PR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>117</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>Message with Data, Gathered and routed to RC (MsgD NOT USED)</td><td>MsgD</td><td>PR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>118</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td rowspan="2">Message with Data -- RESERVED</td><td>MsgD</td><td>PR</td><td>Length</td><td>4</td><td>n</td><td rowspan="2">N/A</td></tr><tr><td>119</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>MsgD</td><td>PR</td><td>Length</td><td>4</td><td>n</td></tr><tr><td>120</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td rowspan="3">Reserved - 64b address routed</td><td></td><td>NPR</td><td>Length</td><td>4</td><td>y</td><td rowspan="3">Block at NFM Egress - report no error</td></tr><tr><td>121</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td></td><td>NPR</td><td>Length</td><td>4</td><td>y</td></tr><tr><td>122</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td></td><td>NPR</td><td>Length</td><td>4</td><td>y</td></tr><tr><td>123</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>Deferrable Memory Write Request, 64b address routed</td><td>DMWr</td><td>NPR</td><td>Length</td><td>4</td><td>n</td><td>1:1</td></tr><tr><td>124-127</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>Length</td><td>4</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>128-135</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>X</td><td>X</td><td>X</td><td>Reserved - Local TLP Prefix - Terminate at Receiver</td><td></td><td>none</td><td>n</td><td>1</td><td>n</td><td>N/A</td></tr><tr><td>136-139</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>X</td><td>X</td><td rowspan="2">Reserved - Local TLP Prefix - Terminate at Receiver</td><td></td><td>none</td><td>n</td><td>1</td><td>n</td><td rowspan="2">N/A</td></tr><tr><td>140</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td></td><td>none</td><td>n</td><td>1</td><td>n</td></tr><tr><td>141</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>Flit ModeLocal TLPPrefix</td><td>FlitModePrefix</td><td>none</td><td>n</td><td>1</td><td>n</td><td>N/A</td></tr><tr><td>142</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1 DW Prefix -Vendor Defined Local 0</td><td>VendPrefixL0</td><td>none</td><td>n</td><td>1</td><td>n</td><td>N/A</td></tr><tr><td>143</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1 DW Prefix -Vendor Defined Local 1</td><td>VendPrefixL1</td><td>none</td><td>n</td><td>1</td><td>n</td><td>N/A</td></tr><tr><td>144-147</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>n</td><td>4</td><td>y</td><td rowspan="2">Strongly Recommended: Block at NFM Egress / Permitted: Terminate at FM Ingress Port. If UIO TLP report no error, else handle as Uncorrectable<eq>^{10}</eq></td></tr><tr><td>148-151</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>n</td><td>5</td><td>y</td></tr><tr><td>152-155</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>n</td><td>6</td><td>y</td><td rowspan="2">Strongly Recommended: Block at NFM Egress / Permitted: Terminate at FM Ingress Port. If UIO TLP report no error, else handle as Uncorrectable<eq>^{11}</eq></td></tr><tr><td>156-159</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>n</td><td>7</td><td>y</td></tr><tr><td>160-167</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>X</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>n</td><td>5</td><td>y</td><td>Block at NFM Egress – report no error</td></tr><tr><td>168-169</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>n</td><td>6</td><td>y</td><td>Block at NFM Egress – if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>170-171</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>n</td><td>7</td><td>y</td><td>Block at NFM Egress – if UIO TLP report noerror, else handle as Uncorrectable</td></tr><tr><td>172-173</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>CPL</td><td>n</td><td>5</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>174-175</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>CPL</td><td>n</td><td>6</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>176-183</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>X</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>Length</td><td>5</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>184-191</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>X</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>Length</td><td>5</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>192-199</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>X</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>n</td><td>6</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>200-201</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>NPR</td><td>n</td><td>7</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>202-203</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>CPL</td><td>Length</td><td>5</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>204-205</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>CPL</td><td>Length</td><td>6</td><td>y</td><td>Block at NFM Egress - Uncorrectable</td></tr><tr><td>206-207</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>PR</td><td>Length</td><td>7</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>208-215</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>X</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>Length</td><td>6</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr><tr><td>216-223</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>X</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>Length</td><td>6</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no</td></tr><tr><td>224-225</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>X</td><td>Reserved - Local TLP - Terminate at Receiver</td><td></td><td>none</td><td>n</td><td>4</td><td>y</td><td>N/A</td></tr><tr><td>226-227</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>X</td><td>Reserved - Local TLP - Terminate at Receiver</td><td></td><td>none</td><td>n</td><td>6</td><td>y</td><td>N/A</td></tr><tr><td>228-229</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>X</td><td>Reserved - Local TLP - Terminate at Receiver</td><td></td><td>none</td><td>Length</td><td>4</td><td>y</td><td>N/A</td></tr><tr><td>230-231</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>X</td><td>Reserved - Local TLP - Terminate at Receiver</td><td></td><td>none</td><td>Length</td><td>6</td><td>y</td><td>N/A</td></tr><tr><td>232-239</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>X</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>NPR</td><td>n</td><td>7</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>240-241</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>NPR</td><td>Length</td><td>4</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>242-243</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>NPR</td><td>Length</td><td>5</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>244-245</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>X</td><td>Reserved - ID routed</td><td></td><td>NPR</td><td>Length</td><td>6</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>246-247</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>X</td><td>Reserved - ID routed</td><td></td><td>NPR</td><td>Length</td><td>7</td><td>y</td><td>Block at NFM Egress - report no error</td></tr><tr><td>248-255</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>X</td><td>X</td><td>X</td><td>Reserved - 64b address routed</td><td></td><td>PR</td><td>Length</td><td>7</td><td>y</td><td>Block at NFM Egress - if UIO TLP report no error, else handle as Uncorrectable</td></tr></table>


The TS[2:0] field indicates Trailer Size and is encoded as: 


• 000b – No Trailer 

• 001b – 1DW Trailer – Content Reserved if OHC-C is present and the Sub-Stream field indicates an IDE TLP; Else 1DW Trailer containing an ECRC 12 . 

• 010b – 1DW Trailer – Content Reserved 

• 011b – 2DW Trailer – Content Reserved 

• 100b – 2DW Trailer – Content Reserved 

• 101b – 3DW Trailer with IDE MAC if an OHC-C is present and the Sub-Stream field indicates an IDE TLP; Else 3DW Trailer – Content Reserved 

• 110b – 4DW Trailer with IDE MAC and PCRC if an OHC-C is present and the Sub-Stream field indicates an IDE TLP; Else 4DW Trailer – Content Reserved 

• 111b – 5DW Trailer – Content Reserved 

The definitions of the TC, Attr and Length fields in Flit Mode are the same as in Non-Flit Mode. 

Bit 1 in byte 1 of Non-Flit Mode is now Reserved, but it was the LN bit associated with the now deprecated Lightweight Notification (LN) protocol. This bit is not supported in Flit Mode. Thus, it must be ignored when translating from Non-Flit Mode to Flit Mode, and it must be set to 0b when translating from Flit Mode to Non-Flit Mode. 

The OHC[4:0] field indicates the presence of “Orthogonal Header Content” (OHC) encoded as: 

• 0 0000b = No OHC present 

• x xxx1b = OHC-Ax present 

• x xx1xb = OHC-B present 

• x x1xxb = OHC-C present 

• 0 0xxxb = No OHC-E present 

• 0 1xxxb = OHC-E1 present 

• 1 0xxxb = OHC-E2 present 

• 1 1xxxb = OHC-E4 present 

When present, OHC must follow the Header Base. It is permitted for any combination of OHC content to be present, but, when present, must follow the Header Base, in A-B-C-E order. The contents of the OHC in some cases varies depending on the TLP type. 

For specific TLP types, as defined in this specification, specific OHC content must be included by the Transmitter. Receivers must check for violations of these rules. If a Receiver determines that a Request violates a rule requiring specific OHC content, the Request must be handled as an Unsupported Request. If a Receiver determines that a Completion violates a rule requiring specific OHC content, the Completion must be handled as an Unexpected Completion. 


Table 2-6 OHC-Ax Included Fields for OHC-A1 through OHC-A5 (see § Figure 2-7 through § Figure 2-11) §


<table><tr><td>Name</td><td>Required for</td><td>Byte Enables</td><td>PASID, PV</td><td>ER, PMR</td><td>Destination Segment, DSV</td><td>Completer Segment</td><td>Completion Status</td><td>Lower Address[1:0]</td><td>NW Flag</td></tr><tr><td>OHC-A1</td><td>Memory Requests with explicit Byte Enables and/or PASIDAddress Routed Messages with PASID and Route to Root Complex Messages with PASID</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td><td></td><td></td><td>Y</td></tr></table>


12. Earlier versions of this specification defined this combination as always containing an ECRC, even for IDE TLPs. Receiver behavior is undefined for implementations compliant to those earlier specifications 


<table><tr><td>Name</td><td>Required for</td><td>Byte Enables</td><td>PASID, PV</td><td>ER, PMR</td><td>Destination Segment, DSV</td><td>Completer Segment</td><td>Completion Status</td><td>Lower Address[1:0]</td><td>NW Flag</td></tr><tr><td></td><td>Translation Requests</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>OHC-A2</td><td>I/O Requests</td><td>Y</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>OHC-A3</td><td>Configuration Requests</td><td>Y</td><td></td><td></td><td>Y</td><td></td><td></td><td></td><td></td></tr><tr><td>OHC-A4</td><td>ID-Routed Messages that require Destination Segment and/or PASID</td><td></td><td>Y</td><td></td><td>Y</td><td></td><td></td><td></td><td></td></tr><tr><td>OHC-A5</td><td>Completions when required as defined in § Section 2.2.9.2 .</td><td></td><td></td><td></td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td></tr><tr><td>OHC-Ax</td><td>Others</td><td colspan="8">When OHC-A is present on other TLPs, all OHC-A bits are Reserved</td></tr></table>

# In OHC-A1

• The ER bit is Execute Requested, and the PMR bit is Privileged Mode Requested (see § Section 6.20 ). These bits are Reserved for all Requests other than Translation Requests (see § Section 10.2.2 ) and Page Requests (see § Section 10.4 ). 

• When OHC-A1 is included with a TLP, if the PASID is not known or has not been assigned, then the PV ("PASID Valid") bit must be Clear. 

• The ER and PMR bits are Reserved if PV is Clear. 

• The PASID field is Reserved if PV is Clear. 

• The NW bit is No Write. This bit is Reserved for all Requests other than Translation Requests. 

• OHC-A1 is required as specified in § Section 2.2.5.2 . 

![](images/7fe09173c32a5296f84005bd32717feecc2835856b0f6fb5d9317d68091543c9.jpg)



Figure 2-8 OHC-A2 §


In OHC-A2: 

# 1. OHC-A2 is required as specified in § Section 2.2.5.2 .

# In OHC-A3:

• Destination Segment is Reserved if DSV is Clear. 

• OHC-A3 is required as specified in § Section 2.2.5.2 . 

# In OHC-A4:

• When OHC-A4 is included with a TLP, if the PASID is not known or has not been assigned, then the PV ("PASID Valid") bit must be Clear. 

• The PASID field is Reserved if PV is Clear. 

• The Destination Segment field is Reserved if DSV is Clear. 

• OHC-A4 must be included in ID Routed Messages when Destination Segment or PASID is required. 

![](images/427d27f0d440b0bf845b27c90e8126fe7c121e1ce7686ad262a537ca68077fc6.jpg)



Figure 2-11 OHC-A5 §


# In OHC-A5:

• LA[1:0] is Lower Address[1:0]. 

• The Destination Segment field is Reserved if DSV is Clear. 

• OHC-A5 is required as specified in § Section 2.2.9.2 . 

# In OHC-B:

• OHC-B is defined for Address Routed Requests only. When OHC-B is present on other TLPs, all OHC-B bits are Reserved. 

• When TLP Processing Hints (TPH) are used OHC-B must be included with the appropriate PH and ST values. 

• The PH and ST fields are qualified by the HV[1:0] ("Hints Valid") field, are encoded as: 

◦ 00b: PH[1:0], ST[15:0] are not valid and are Reserved 

◦ 01b: PH[1:0] and ST[7:0] are valid, ST[15:8] is not valid and is Reserved 

◦ 10b: Reserved encoding, Receivers must treat as 00b. 

◦ 11b: PH[1:0] and ST[15:0] are valid 

• The AMA field is Reserved when AV is Clear. 

# For OHC-C:

• The Requester Segment field is Reserved when RSV is Clear. 

• IDE TLPs must include OHC-C. 

◦ If Sub-Stream is 000b, 001b, or 010b, the PR_Sent_Counter, Stream_ID, K, XT, and T fields are meaningful (see § Section 6.33.5 ) 

◦ If Sub-Stream is 011b to 110b, Receiver behavior is undefined. 

◦ For IDE Completion TLPs, the RSV bit must be Clear. 

• Non-IDE Request TLPs must, in some cases, also include OHC-C to indicate the Requester Segment (see Segment Rules below). When a non-IDE Completion TLP includes OHC-C, the RSV bit must be Clear. 

◦ Non-IDE TLPs with OHC-C are identified by the Sub Stream value of 111b. (see § Section 6.33.5 ) 

◦ If Sub-Stream is 111b, the PR_Sent_Counter, Stream_ID, K, XT, and T fields are Reserved. 

• Note: OHC-C does not include the M and P bits present in the IDE TLP Prefix. In Flit Mode, the presence of a MAC/PCRC is indicated using the TS field. 

Since IDE TLPs cannot be modified between the two Partner Ports, the IDE Partner Ports and the path between them must operate entirely in Non-Flit Mode or in Flit Mode. Root Complexes that support peer-to-peer and Switches cannot modify IDE TLPs associated with Flow-Through Selective IDE Streams, making TLP Translation impossible. If an IDE TLP is directed out an Egress Port operating in a different mode from the Ingress Port, the IDE TLP must be dropped, and the result must be reported as a Misrouted IDE TLP error. 

It is permitted to configure a Root Complex or Switch such that the Ingress Port is a terminus for an IDE connection and the Egress Port another terminus, such that the TLP is passed through the RC/Switch unprotected by IDE. Doing this requires that the RC/Switch to be trusted, and requires the Root/Switch Ports to have the ability to act as an IDE Terminus, not simply to support Flow-Through IDE. 

In Flit Mode, NOP TLPs must never be transmitted as IDE TLPs. Receivers are not required to check for violations of this rule, but, if checked, Receivers must handle NOP TLPs received as IDE TLPs as Malformed TLPs. 

# Segment Rules:

In Flit Mode, it is possible, and in some cases required, to include Segment fields in TLPs. One benefit of the Segment fields is to enable routing Route-by-ID TLPs between Hierarchies, which are, by definition, in different Segments. Root Complexes are the only place where peer-to-peer Requests will traverse from one Hierarchy to another. Peer-to-peer Route-by-ID Message Requests can traverse Hierarchies when the Requester includes a valid Destination Segment field. Memory Requests are address routed between Hierarchies, but the associated Completions are ID routed. To aid in Root Complex routing of Completions between Hierarchies, FM Completions can include the Destination Segment field which reflects the value of the Requester Segment field from the associated NP or UIO Memory Request. This allows a Root Complex to route Non-Posted or UIO Memory Requests between Hierarchies without the need to assume ownership of each outstanding transaction for the purpose of routing the associated Completions back to the Hierarchy of the original Requester. This can lead to performance improvements for peer-to-peer transfers between Hierarchies. 

A second use of the Segment fields is to improve error logging. When FM TLP headers are logged in the AER Extended Capability structure the Segment fields will be included. The Segment fields improve traceability when identical Requester/Completer IDs exist in different Hierarchies. The rules in this section allow the Segment fields to be omitted in some cases to reduce FM TLP overhead. It should be noted that omitting the Segment fields in these cases could forfeit the improved error-logging traceability benefit. It is permitted to use implementation specific mechanisms to select when optional Segment fields are included (e.g., during debug) while still achieving optimal performance during normal operation by omitting non-required Segment fields. 

These fields, which exist only in FM, are used to communicate Segment information: 

• The Requester Segment field indicates the Hierarchy in which the Requester is located. This field exists in OHC-C and is sometimes included in Memory and Message Requests. 

◦ The Requester Segment Valid (RSV) bit, when Set, indicates that the Requester Segment field is valid. 

◦ When Requester Segment Valid (RSV) is Clear then the Requester Segment field is Reserved. 

◦ For TLPs with OHC-C that are not IDE TLPs, the Sub-Stream[2:0] field must be 111b, and the Stream_ID, PR_Sent_Counter, K, XT, and T fields/bits are Reserved. 

◦ In earlier versions of this specification, Sub-Stream was 4 bits in Symbol 3, bits 7:4. See § Section 6.33.5 for additional details. 

◦ IDE Requests (see § Section 6.33 ) other than Configuration Requests must include Requester Segment in OHC-C. 

• The Completer Segment field indicates the Hierarchy in which the Completer is located. This field exists in OHC-A5 and is sometimes included in Completions. 

• The Destination Segment field indicates the Hierarchy to which the TLP should be routed for ID Based Routing. In Configuration Write Requests this field is also used to configure the Segment of the completing Function. Configuration Requests in FM always include this field in OHC-A3 unless the Request had previously traversed a 

NFM Link. Route-by-ID Message Requests sometimes include this field in OHC-A4. Completions sometimes include this field in OHC-A5. 

◦ The Destination Segment Valid (DSV) bit, when Set, indicates that the Destination Segment field is valid. 

◦ When Destination Segment Valid (DSV) is Clear then the Destination Segment field is Reserved. 

In addition to the following rules that apply specifically to Root Complexes, Requesters and Completers within Root Complexes must also follow the rules later in this section that apply to Requesters and Completers. 

• All Configuration Requests transmitted by a Root Port in Flit Mode, including those initiated through the SFI Configuration Access Method, must include OHC-A3 with the DSV bit set and a valid Destination Segment. The Destination Segment is necessary for the Completer to capture its Segment as described in § Section 2.2.6.2 

◦ The Root Complex must indicate the correct Segment value in the Destination Segment field, even if only one Segment is implemented. 

◦ By definition, a Root Port and its hierarchy domain share the same Segment number. 

• Completions associated with Configuration Requests must be identifiable solely by Transaction ID when received at a RP. Such Completions will not include a Destination Segment field because Configuration Requests do not include a Requester Segment field. 

# IMPLEMENTATION NOTE:

# ROOT COMPLEX SUPPORT FOR PEER-TO-PEER NON-POSTED MEMORY TRANSACTIONS THAT TRAVERSE HIERARCHIES §

Since Segment fields aren't communicated across Links in NFM, Root Complexes take on an additional burden for peer-to-peer non-UIO NP Memory Requests that cross from one Hierarchy to another. With the loss of the Requester Segment field when a Request is translated to NFM, the Requester ID that remains in the original NP Memory Request might be indistinguishable from that of other Requesters within the hierarchy domain. Unless all Links along the path from the egress RP to the Completer are known to be in FM, Root Complexes must replace the Requester ID in peer-to-peer NP Memory Requests that cross from one Hierarchy to another. The Requester ID supplied by the Root Complex must be an ID associated with the Root Complex itself. This action is sometimes called "taking ownership" of the NP Request. It is necessary for the Root Complex to take ownership of such Requests to ensure that the Requester ID remains unique within the hierarchy domain of the egress RP, and that the associated Completions can be routed correctly by any Switches within that hierarchy domain. The egress RP also must track all such outstanding NP Memory Requests in order to route the associated Completion(s) to the Hierarchy of the original Requester within the Root Complex, as well as to restore the original Requester ID (Destination BDF/BF in FM) within the Completion(s). 

![](images/ed70441c67bd688854aec7e44412a019c78d4e256047a3ec63fcf45e0f32911f.jpg)



Figure 2-14 Example Topology Illustrating Multiple Segments and NFM Subtrees


The No NFM Subtree Below This Root Port bit defaults to Clear to indicate that one or more NFM subtree(s) may exist below a Root Port. Referring to the example shown in § Figure 2-14, each Root Port is in a unique Segment/ Hierarchy, and RP 1 through RP 3 have NFM subtrees below the Root Port. For RP 2, the Link immediately below the Root Port is in NFM, but for RP 1 and RP 3 the Root Port cannot directly determine the existence of a NFM subtree within its hierarchy domain, and so the default value of the No NFM Subtree Below This Root Port bit ensures that the Root Complex will take ownership of NP Requests egressing from those Root Ports. In all cases, it is necessary that system software ensure the No NFM Subtree Below This Root Port bit for a Root Port is Clear in cases where the Root Port has one or more NFM Links or subtrees below it. 

Since RP 4 does not have any NFM Links below it, and therefore it is not necessary for the Root Complex to take ownership of NP Requests egressing that Root Port. It is strongly recommended that system software Set the No NFM Subtree Below This Root Port bit in such cases, and it is strongly recommended that Root Complex implementations use the value in the No NFM Subtree Below This Root Port bit to avoid taking ownership of NP Requests when it is not necessary to do so. 

Note that for non-IDE Requests directed Upstream to the RC, the existence of a NFM Link between the original Requester and the Root Port is not a factor, because the RC inherently knows the Hierarchy of the Requester based on the Ingress RP of the Request, and can add the Requester Segment if needed. 

Regardless of the value of the No NFM Subtree Below This Root Port bit, a Root Complex need not apply NP Memory Request tracking mechanisms for peer-to-peer Selective IDE Stream transactions that cross from one Hierarchy to another, and IDE TLPs cannot in any case be modified between the two IDE Partner Ports. When a Selective IDE Stream is established passing peer-to-peer between Hierarchies, software must ensure that the RC supports such routing, and that the entire path between the two Partner Ports is entirely in FM. 

A NFM device could be hot-added into a subtree for which the No NFM Subtree Below This Root Port bit had previously been Set. In such cases it is necessary for system software to Clear the No NFM Subtree Below This Root Port bit prior to allowing the hot-added NFM device to act as a Completer for any NP Memory Request passing peer-to-peer through the RC. 

• It is not permitted to configure a Selective IDE Stream passing peer-to-peer between different Hierarchies unless it is known that the RC supports flow-through IDE between the two Root Ports, and that all Links on the path between the two Partner Ports, including both the Root Ports, are in FM. 

◦ Root Complexes are not required to support Selective IDE Streams passing peer-to-peer through the RC. 

◦ If a condition exists that precludes the RC from passing an IDE TLP associated with a Selective IDE Stream configured to flow-through the RC, then the RC must treat the TLP as a Misrouted IDE TLP error at either the Ingress Port or the Egress Port. 

• If a Message or Memory Request received at a RP includes a Requester Segment that does not match the Hierarchy associated with the receiving RP, the Request must be handled by the RP as an Unsupported Request. 

• A RP is permitted to add a Requester Segment indication to a non-IDE Memory Write Request, or a non-IDE Route by Address Message Request, passing peer-to-peer through the RC if that TLP did not include a Requester Segment at the ingress RP, where the Requester Segment must correspond to the Segment of the Ingress RP. 

• Route by ID Message Requests received at a RP without a Destination Segment, or received in NFM, are implied to be destined for a Completer within the same Hierarchy as the Ingress RP. 

• When taking ownership of an NP or UIO Memory Request passing peer-to-peer through the RC: ◦ The Requester ID in the Request must be replaced with one associated with the Root Complex. 

◦ The Request must either use the Requester Segment value associated with the hierarchy domain of the Egress RP, or must not include a Requester Segment. 

◦ The RC is permitted to replace the Tag in the Request, and when doing so must ensure that the Transaction ID satisfies uniqueness requirements for Requests associated with the same Requester ID used for taking ownership. 

▪ For non-UIO Requests, the RC is permitted to change the size of the Tag. If this is done, it is permitted to use implementation specific means to determine what size of Tag is appropriate. 

▪ The Tag in the Completion(s) must be restored to the Tag from the original Request, as received at the Ingress RP, before returning those Completion(s). 

◦ Completions associated with the Request must be identifiable solely by Transaction ID when received at the RP. Such Completions will not include a Destination Segment if the RP did not include a Requester Segment in the Request or if a NFM Link exists between the RP and the Completer. 

◦ The Requester ID value in the Completion(s) must be restored to the Requester ID from the original Request, as received at the Ingress RP, before returning those Completion(s). 

◦ If the RP that received the Request is in FM and OHC-A5 is returned to the Requester with the Completion(s): 

▪ The Destination Segment must be set to 00h and the DSV bit must be Clear in OHC-A5 that is returned to the original Requester. 

The Completer Segment field must not be modified if the RP receiving the Completion is in FM and OHC-A5 was received with the Completion. The Completer Segment in OHC-A5 returned to the Requester must be set to 00h if the RP receiving the Completion is in NFM or if OHC-A5 was not received with the Completion. 

• When passing an NP or UIO Memory Request peer-to-peer through the RC without taking ownership: 

◦ The Requester ID and Tag in the Request must not be modified. 

◦ For non-IDE NP Memory Requests passing peer-to-peer through the RC that do not include a Requester Segment at the Ingress RP, the RC must add a Requester Segment indication at the Egress RP, using the Segment value associated with the Ingress RP. 

◦ Any Completion received with the DSV bit set and a Destination Segment not matching the value associated with the hierarchy domain of the receiving RP must be routed through the RC to the specified Hierarchy. 

◦ The Requester ID and Tag fields returned to the Requester must not be modified from the values received with the Completion in the destination hierarchy domain. 

◦ If the RP that received the Request is in FM and OHC-A5 is returned to the Requester with the Completion(s) the DSV bit, Destination Segment, and Completer Segment fields must not be modified from the values received with OHC-A5 in the destination hierarchy domain. 

RP Segment Exceptions – There are specific cases where a RP is not required to include Segment information: 

◦ A RP is not required to include the Requester Segment field in any non-IDE Memory Request initiated by a Requester within the Root Complex. 

◦ A RP is not required to include a Requester Segment field with Memory Write Requests passing peer-to-peer through the RC. 

◦ A RP is not required to include a Requester Segment field with NP Memory Requests passing peer-to-peer through the RC if the Egress RP is taking ownership of the Request. 

◦ A RP is not required to include the Completer Segment or Destination Segment fields in Completions associated with NP Memory Requests targeting system memory or another element of the Root Complex itself. OHC-A5 must be included if required as described in § Section 2.2.9.2 . 

◦ A RP is not required to include the Completer Segment or Destination Segment fields in Completions associated with NP Memory Requests passing peer-to-peer through the RC. OHC-A5 must be included if required as described in § Section 2.2.9.2 . 

Each Switch exists entirely within a single Hierarchy by definition. However, Switches are required to comprehend Segment fields in some TLP types for routing purposes. The following rules apply to Switches: 

• For TLPs in FM for both the Ingress and Egress Ports, Switches must never modify, add, or remove any Segment field or the DSV/RSV bit(s) within the TLP. 

• For Configuration Requests initiated in FM through the SFI Configuration Access Method on a Switch Downstream Port, the Destination Segment and DSV fields must reflect the values received in the associated Configuration Write or Read Request to the SFI CAM Data Register. 

• A Switch for which the Segment Captured bit is Set must handle as a TLP Translation Egress Blocked error an NP Memory Request received at the Upstream Port destined for a Downstream Port in NFM that includes a Requester Segment that does not match the Switch’s captured Segment value. 

◦ The Request must not be forwarded to the Downstream Port. 

• If a condition exists that precludes the Switch from passing an IDE TLP associated with a Selective IDE Stream configured to flow-through the Switch without modification, then the Switch must handle the TLP as a Misrouted IDE TLP error at either the Ingress Port or the Egress Port. 

• When a Switch must translate a TLP from NFM to FM: 

◦ If the Segment Captured bit is Clear, OHC-C must not be added to a Request. 

◦ If the Segment Captured bit is Set, the Switch is permitted to add OHC-C to Memory and Message Requests with the Requester Segment containing the value established when the Switch itself was configured. 

◦ OHC-C must not be added to Configuration Requests. 

◦ If any OHC-A with DSV and Destination Segment fields is added, the DSV bit must be Clear and the Destination Segment must be 00h. 

◦ For a Completion that requires OHC-A5 (see § Section 2.2.9.2 ), 

▪ if the Segment Captured bit is Set, then the Switch must set the Completer Segment field to the Segment value established when the Switch itself was configured, 

▪ if the Segment Captured bit is Clear, then the Switch must set the Completer Segment field to 00h. 

• Switches must route Configuration Requests solely by the BDF fields (Destination BDF/BF in FM); the Destination Segment field must not be considered for routing. 

• A Switch for which the Segment Captured bit is Set must route Completions and Route by ID Message Requests Upstream if DSV is Set and the Destination Segment does not match the Switch’s captured Segment value. 

• Completions and Route by ID Message Requests must be routed solely by Requester ID / Destination BDF / Destination Device ID if the Ingress Port is in NFM, a Destination Segment is not included (DSV bit is clear), or the included Destination Segment matches the Switch’s captured Segment value. 

• A Switch for which the Segment Captured bit is Clear must signal a TLP Translation Egress Blocked error if a Completion or Route by ID Message Request is received with DSV Set, and the TLP must not be forwarded. 

• A Switch for which the Segment Captured bit is Clear must signal a TLP Translation Egress Blocked error if a received Message or Memory Request includes a Requester Segment. The Request must not be forwarded. 

• A Switch for which the Segment Captured bit is Set must signal a TLP Translation Egress Blocked error if a Message or Memory Request received on a Downstream Port includes a Requester Segment that does not match the Switch’s captured Segment value. The Request must not be forwarded. 

• When reordering Completions with other Completions, Switches are permitted to consider Destination Segment fields included in the Completions as effectively part of the Transaction ID. When not included, the Destination Segment is implied to be the same Segment where the Completion exists. 

• When reordering TLPs based on ID Based Ordering (IDO), Switches must consider Requester Segment fields included in Requests, and Destination Segment fields included in Completions, as effectively part of the Transaction ID. When the Destination Segment is not included, for reordering purposes the Destination Segment must be considered to be the same Segment where the Completion exists. When the Requester Segment is not included in a Request, Switches must assume a matching value for IDO purposes. 

The following rules apply to Requesters: 

• When the Requester Segment field is included in a Request it must be set to the value captured from a Configuration Write Request as described in § Section 2.2.6.2 . 

• When the Segment Captured bit is Clear all non-IDE Message and Memory Requests initiated by the Requester must not include OHC-C. 

• When the Segment Captured bit is Set all Message Requests initiated by the Requester must include OHC-C with Requester Segment. 

• When the Segment Captured bit is Set a Requester is permitted to include OHC-C with Requester Segment in Memory Requests. 

• When the Segment Captured bit is Clear, Route by ID Message Requests initiated by the Requester must not include a Destination Segment (the DSV bit must be Clear). 

• When the Segment Captured bit is Set a Requester is required to include a Destination Segment, and set the DSV bit, in Route by ID Message Requests destined for a different Hierarchy. Requesters use implementation specific means to determine the Hierarchy to which a Route by ID Message Request should be routed. When the Segment Captured bit is Set the Destination Segment is required in ATS Invalidate Request, Invalidate Completion, and PRG Response Messages even if the target is in the same Hierarchy. For other Route by ID Message Requests the Destination Segment is optional when the Segment Captured bit is Set and the Requester knows, by definition or through programming, that the target of the Request is in the same Hierarchy. 

• Requesters must accept any value in the Destination Segment field (if present) in received Completions. 

• A Requester is not required to include the Requester Segment field in any non-IDE Memory Request. 

The following rules apply to Completers: 

• Completers must capture their Segment value from Configuration Write Requests as described in § Section 2.2.6.2 . 

• When the Segment Captured bit is Clear, Completers must set the Completer Segment field to 00h in any OHC-A5 that is included in a Completion. 

• When the Segment Captured bit is Set, Completers must set the Completer Segment field in any OHC-A5 that is included in a Completion to the Segment value that was captured as described in § Section 2.2.6.2 . 

◦ If the Completion associated with the first Configuration Write Request includes OHC-A5, the Completer Segment field must be set to the value captured from that Request. 

• Completers must clear the DSV bit and set the Destination Segment field to 00h in any OHC-A5 that is included with a Completion associated with a Configuration Request. 

• For an NP or UIO Memory Request received without a Requester Segment field, Completers must clear the DSV bit and set the Destination Segment field to 00h in any OHC-A5 that is included with the associated Completion(s). 

• For an NP or UIO Memory Request received with a Requester Segment field, Completers must set the DSV bit and set the Destination Segment field to the value of the received Requester Segment in any OHC-A5 that is 

included with the associated Completion(s). See RP Segment Exceptions for cases where RPs are not required to include Segment information. 

• When the Segment Captured bit is Set and an NP Memory Request is received with a Requester Segment value not matching the Completer’s captured Segment value, all Completions associated with the Request must include OHC-A5. 

• Completers must not qualify the acceptance of a Route by ID Message Request based on the value of the Destination Segment field in the Request. 

• Completers must include OHC-A5 with a Completion if required as described in § Section 2.2.9.2 and § Section 6.33.4 . 

• Completers must not include OHC-A5 with a Completion when all of the following are true: 

◦ Completion Status is Successful Completion. 

◦ Lower Address[1:0] equal to 00b. 

◦ The Completer’s Segment Captured bit is Clear. 

• Completers are permitted to not include OHC-A5 with a Completion when all of the following are true: 

◦ Completion Status is Successful Completion. 

◦ Lower Address[1:0] equal to 00b. 

◦ The Completer’s Segment Captured bit is Set. 

◦ The associated Request either did not include a Requester Segment field or included a Requester Segment field matching the Completer’s captured Segment value. 

◦ The TEE-IO Supported bit is Clear or Completion is not on a Selective IDE Stream. See § Section 6.33.4 . 

# 2.2.2 TLPs with Data Payloads - Rules §

• Length is specified as an integral number of DW 

• Length[9:0] is Reserved for all Messages except those that explicitly refer to a data length 

◦ Refer to the Message Code tables in § Section 2.2.8 . 

• A Function transmitting a TLP with a data payload must not allow the data payload length as indicated by the TLP's Length field to exceed the Function's applicable MPS setting. If the Function's Mixed_MPS_Supported bit is Clear or the target is host memory, the applicable MPS setting must be the Function's computed Tx_MPS_Limit, as defined below. If the Mixed_MPS_Supported bit is Set, the Function must have an implementation specific mechanism capable of supporting different MPS settings for different targets, and must handle both Request and Completion TLPs. Target-specific MPS settings are permitted to be above or below the Function's Tx_MPS_Limit, but they must never exceed the Function's Max_Payload_Size Supported field value. The Function's Tx_MPS_Limit is determined as follows: 

◦ For a Single-Function Device, the Tx_MPS_Limit must be its Max_Payload_Size field value, its "MPS setting". 

◦ Otherwise, for an ARI Device, the Tx_MPS_Limit must be the MPS setting in Function 0. The MPS settings in other Functions of an MFD must be ignored. 

◦ Otherwise, for a Function in a non-ARI MFD whose MPS settings are identical across all Functions, the Tx_MPS_Limit must be the common MPS setting. 

◦ Otherwise, for a Function in a non-ARI MFD whose MPS settings are not identical across all Functions, the Tx_MPS_Limit must be the MPS setting in an implementation specific Function. 

▪ Transmitter implementations are encouraged to use the MPS setting from the Function that generated the transaction, or else the smallest MPS setting across all Functions. 

▪ Software should not configure the MPS setting in different Functions to different values unless software is aware of the specific implementation. 

◦ MPS settings apply only to TLPs with data payloads; Memory Read Requests are not restricted in length by MPS settings. The size of the Memory Read Request is controlled by the TLP's Length field. 

• The data payload size in a Received TLP as indicated by the TLP's Length field must not exceed a computed Rx_MPS_Limit for the receiving Function, as determined by MPS-related parameters as indicated below. 

◦ Receivers must check for violations of this rule. If a Receiver determines that a TLP violates this rule, the TLP must be handled as a Malformed TLP. 

▪ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

◦ In Flit Mode, Receivers must handle the full range of the Length field for the purpose of determining the total size of each TLP and deciding which symbol is the start of the next TLP. 

◦ In the receiving Function, if the Rx_MPS_Fixed bit is Set, the Rx_MPS_Limit must be the Max_Payload_Size Supported field. Otherwise, the Rx_MPS_Limit must be determined by the Max_Payload_Size field (the "MPS setting") in one or more Functions as follows: 

▪ For a Single-Function Device, the Rx_MPS_Limit must be its MPS setting. 

▪ Otherwise, for an ARI Device, the Rx_MPS_Limit must be the MPS setting in Function 0. MPS settings in other Functions must be ignored. 

▪ Otherwise, for an Upstream Port associated with a non-ARI MFD whose MPS settings are identical across all Functions, the Rx_MPS_Limit must be the common MPS setting. 

Otherwise, for an Upstream Port associated with a non-ARI MFD whose MPS settings are not identical across all Functions, the Rx_MPS_Limit must be the MPS setting in an implementation specific Function. 

▪ Receiver implementations are encouraged to use the MPS setting from the Function targeted by the transaction, or else the largest MPS setting across all Functions. 

▪ Software should not configure the MPS setting in different Functions to different values unless software is aware of the specific implementation. 

• For TLPs that include data, the value in the Length field and the actual amount of data included in the TLP must match. 

◦ In NFM, Receivers must check for violations of this rule. If a Receiver determines that a TLP violates this rule, the TLP is a Malformed TLP. 

▪ This is a Reported Error associated with the Receiving Port (see § Section 6.2 ). 

• The value in the Length field applies only to data - the TLP Digest is not included in the Length. 

• When a data payload associated with a byte address is included in a TLP other than an AtomicOp Request or an AtomicOp Completion, the first byte of data following the header corresponds to the byte address closest to zero and the succeeding bytes are in increasing byte address sequence. 

◦ Example: For a 16-byte write to location 100h, the first byte following the header would be the byte to be written to location 100h, and the second byte would be written to location 101h, and so on, with the final byte written to location 10Fh. 

• The data payload in AtomicOp Requests and AtomicOp Completions must be formatted such that the first byte of data following the TLP header is the least significant byte of the first data value, and subsequent bytes of data are strictly increasing in significance. With Compare And Swap (CAS) Requests, the second data value immediately follows the first data value, and must be in the same format. 

◦ The endian format used by AtomicOp Completers to read and write data at the target location is implementation specific, and is permitted to be whatever the Completer determines is appropriate for the target memory (e.g., little endian, big endian, etc.). Endian format capability reporting and controls for AtomicOp Completers are outside the scope of this specification. 

◦ Little endian example: For a 64-bit (8-byte) Swap Request targeting location 100h with the target memory in little endian format, the first byte following the header is written to location 100h, the second byte is written to location 101h, and so on, with the final byte written to location 107h. Note that before performing the writes, the Completer first reads the target memory locations so it can return the original value in the Completion. The byte address correspondence to the data in the Completion is identical to that in the Request. 

◦ Big endian example: For a 64-bit (8-byte) Swap Request targeting location 100h with the target memory in big endian format, the first byte following the header is written to location 107h, the second byte is written to location 106h, and so on, with the final byte written to location 100h. Note that before performing the writes, the Completer first reads the target memory locations so it can return the original value in the Completion. The byte address correspondence to the data in the Completion is identical to that in the Request. 

◦ § Figure 2-15 shows little endian and big endian examples of Completer target memory access for a 64-bit (8-byte) FetchAdd. The bytes in the operands and results are numbered 0-7, with byte 0 being least significant and byte 7 being most significant. In each case, the Completer fetches the target memory operand using the appropriate endian format. Next, AtomicOp compute logic in the Completer performs the FetchAdd operation using the original target memory value and the “add” value from the FetchAdd Request. Finally, the Completer stores the FetchAdd result back to target memory using the same endian format used for the fetch. 

![](images/7d0f8df6e409b45fde346d8ff67666aa8a443e8cb73e73501fb8e55bef509796.jpg)



Figure 2-15 Examples of Completer Target Memory Access for FetchAdd §


# IMPLEMENTATION NOTE:

# ENDIAN FORMAT SUPPORT BY RC ATOMICOP COMPLETERS §

One key reason for permitting an AtomicOp Completer to access target memory using an endian format of its choice is so that PCI Express devices targeting host memory with AtomicOps can interoperate with host software that uses atomic operation instructions (or instruction sequences). Some host environments have limited endian format support with atomic operations, and by supporting the “right” endian format(s), an RC AtomicOp Completer may significantly improve interoperability. 

For an RC with AtomicOp Completer capability on a platform supporting little-endian-only processors, there is little envisioned benefit for the RC AtomicOp Completer to support any endian format other than little endian. For an RC with AtomicOp Completer capability on a platform supporting bi-endian processors, there may be benefit in supporting both big endian and little endian formats, and perhaps having the endian format configurable for different regions of host memory. 

There is no PCI Express requirement that an RC AtomicOp Completer support the host processor's “native” format (if there is one), nor is there necessarily significant benefit to doing so. For example, some processors can use load-link/store-conditional or similar instruction sequences to do atomic operations in non-native endian formats and thus not need the RC AtomicOp Completer to support alternative endian formats. 

# IMPLEMENTATION NOTE:

# MAINTAINING ALIGNMENT IN DATA PAYLOADS §

§ Section 2.3.1.1 discusses rules for forming Read Completions respecting certain natural address boundaries. Memory Write performance can be significantly improved by respecting similar address boundaries in the formation of the Write Request. Specifically, forming Write Requests such that natural address boundaries of 64 or 128 bytes are respected will help to improve system performance. 

# 2.2.3 TLP Digest Rules - Non-Flit Mode Only §

• For any TLP, a value of 1b in the TD bit indicates the presence of the TLP Digest field including an end-to-end CRC (ECRC) value at the end of the TLP. 

◦ A TLP where the TD bit value does not correspond with the observed size (accounting for the data payload, if present) is a Malformed TLP. 

▪ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• If an intermediate or ultimate PCI Express Receiver of the TLP does not support ECRC checking, the Receiver must ignore the TLP Digest 13 . 

◦ If the Receiver of the TLP supports ECRC checking, the Receiver interprets the value in the TLP Digest field as an ECRC value, according to the rules in § Section 2.7.1 . 

# 2.2.4 Routing and Addressing Rules §

There are three principal mechanisms for TLP routing: address, ID, and implicit. This section defines the rules for the address and ID routing mechanisms. Implicit routing is used only with Message Requests, and is covered in § Section 2.2.8 . 

# 2.2.4.1 Address Based Routing Rules §

• Address routing is used with Memory, I/O Requests and Address Routed Messages. 

• in NFM, two address formats are specified: 

◦ a 32-bit format with a 3 DW header (see § Figure 2-16) 

◦ a 64-bit format with a 4 DW header (see § Figure 2-17) 

• In FM, five address formats are specified: 

◦ a 32-bit format with a 3 DW header (see § Figure 2-18) 

◦ a 64-bit format with a 4 DW header (see § Figure 2-19) 

◦ a 64-bit format with a 5 DW header (see § Figure 2-20) 

◦ a 64-bit format with a 6 DW header (see § Figure 2-21) 

◦ a 64-bit format with a 7 DW header (see § Figure 2-22) 

• For Memory Read, Memory Write, DMWr, and AtomicOp Requests, the Address Type (AT) field is encoded as shown in § Table 10-1. For Address Routed Messages in Flit Mode, the Address Type (AT) field is encoded as shown in § Table 10-1 with the exception that the value of 01b is reserved. For all other Requests, the AT field is Reserved unless explicitly stated otherwise. 

• If TH is Set, the PH field is encoded as shown in § Table 2-18. If TH is Clear, the PH field is Reserved. 

• Address mapping to the TLP header is shown in § Table 2-7. 


Table 2-7 Address Field Mapping §


<table><tr><td>Address Bits</td><td>32-bit Addressing</td><td>64-bit Addressing</td></tr><tr><td>63:56</td><td>Not Applicable</td><td>Bits 7:0 of Byte 8</td></tr><tr><td>55:48</td><td>Not Applicable</td><td>Bits 7:0 of Byte 9</td></tr><tr><td>47:40</td><td>Not Applicable</td><td>Bits 7:0 of Byte 10</td></tr><tr><td>39:32</td><td>Not Applicable</td><td>Bits 7:0 of Byte 11</td></tr><tr><td>31:24</td><td>Bits 7:0 of Byte 8</td><td>Bits 7:0 of Byte 12</td></tr><tr><td>23:16</td><td>Bits 7:0 of Byte 9</td><td>Bits 7:0 of Byte 13</td></tr><tr><td>15:8</td><td>Bits 7:0 of Byte 10</td><td>Bits 7:0 of Byte 14</td></tr><tr><td>7:2</td><td>Bits 7:2 of Byte 11</td><td>Bits 7:2 of Byte 15</td></tr></table>

• The following address routed Requests must use 64-bit addressing (when addressing below 4 GB the upper 32 address bits must be to 0000 0000h): 

◦ All Address Routed UIO Requests 

◦ IDE TLPs with partial header encryption 

◦ This MUST@FLIT include Address Routed Messages 1 4 

• Except when explicitly required otherwise, non-UIO Memory Read, Memory Write, DMWr, and AtomicOp Requests use both formats. 

◦ For Addresses below 4 GB, Requesters must use the 32-bit format. The behavior of the Receiver is not specified if a 64-bit format Request addressing below 4 GB (i.e., with the upper 32 bits of address all 0) is received. 

• I/O Read Requests and I/O Write Requests use the 32-bit format. 

• All agents must decode all address bits in the header - address aliasing is not allowed. 

# IMPLEMENTATION NOTE: PREVENTION OF ADDRESS ALIASING §

For correct software operation, full address decoding is required even in systems where it may be known to the system hardware architect/designer that fewer than 64 bits of address are actually meaningful in the system. 

# 2.2.4.2 ID Based Routing Rules §

• ID routing is used with Configuration Requests, with ID Routed Messages, and with Completions. This specification defines several Messages that are ID Routed (see § Table F-1). Other specifications are permitted to define additional ID Routed Messages. 

• ID routing uses the Bus, Device, and Function Numbers (as applicable) to specify the destination for the TLP: 

◦ For non-ARI Routing IDs, Bus, Device, and (3-bit) Function Number to TLP header mapping is shown in § Table 2-8. 

◦ For ARI Routing IDs, the Bus and (8-bit) Function Number to TLP header mapping is shown in § Table 2-9. 

• In FM, Completions and ID Routed Messages with a different destination Hierarchy than the Hierarchy in which they originate must be routed to the destination Hierarchy using the Destination Segment field and then routed within the destination Hierarchy by the destination Bus, Device, and Function Numbers. 

• In NFM, two ID routing formats are specified, one used with a 4 DW header (see § Figure 2-23 and § Figure 2-24) and one used with a 3 DW header (see § Figure 2-25 and § Figure 2-26). 

◦ Header field locations are the same for both formats (see § Table 2-8 and § Table 2-9). 

• In FM, five ID routing formats are specified: 

◦ One with a 3 DW header (see § Figure 2-27) 

◦ One with a 4 DW header (see § Figure 2-28) 

◦ One with a 5 DW Header (see § Figure 2-29) 

◦ One with a 6 DW Header (see § Figure 2-30) 

◦ One with a 7 DW Header (see § Figure 2-31) 


Table 2-8 Header Field Locations for non-ARI ID Routing - Non-Flit Mode §


<table><tr><td>Field</td><td>Header Location</td></tr><tr><td>Bus Number[7:0]</td><td>Bits 7:0 of Byte 8</td></tr><tr><td>Device Number[4:0]</td><td>Bits 7:3 of Byte 9</td></tr><tr><td>Function Number[2:0]</td><td>Bits 2:0 of Byte 9</td></tr></table>


Table 2-9 Header Field Locations for ARI ID Routing - Non-Flit Mode §


<table><tr><td>Field</td><td>Header Location</td></tr><tr><td>Bus Number[7:0]</td><td>Bits 7:0 of Byte 8</td></tr><tr><td>Function Number[7:0]</td><td>Bits 7:0 of Byte 9</td></tr></table>

§ 

# 2.2.5 First/Last DW Byte Enables Rules §

The general function of TLP Byte Enables is similar in Non-Flit Mode and Flit Mode, however the detailed rules differ. 

# IMPLEMENTATION NOTE:

# SECURITY ISSUES ASSOCIATED WITH NON-ENABLED BYTES §

The data included with a Write or Read Completion necessarily is DW aligned, and so in cases where some bytes are not enabled, the content of the non-enabled bytes is undefined. To optimize platform security, it is strongly recommended that non-enabled bytes be filled with zeros to avoid data being inadvertently leaked (“leaky bytes”). 

As a best practice, it is strongly recommended that devices receiving non-enabled bytes also ensure that the values provided in those bytes are discarded by hardware, such that the values cannot be visible to software. Hardware that fails to do so can provide a path for an attacker to observe confidential data without the need for physical access to a system. 

# 2.2.5.1 Byte Enable Rules for Non-Flit Mode §

Byte Enables are included with Memory, I/O, and Configuration Requests. This section defines the corresponding rules. Byte Enables, when present in the Request header, are located in byte 7 of the header (see § Figure 2-32). For Memory Read Requests and DMWr Requests that have the TH bit Set, the Byte Enable fields are repurposed to carry the ST[7:0] field (refer to § Section 2.2.7.1.1 for details), and values for the Byte Enables are implied as defined below. The TH bit must only be Set in Memory Read Requests and DMWr Requests when it is acceptable to complete those Requests as if all bytes for the requested data were enabled. 

• For Memory Read Requests and DMWr Requests that have the TH bit Set, the following values are implied for the Byte Enables. See § Section 2.2.7 for additional requirements. 

◦ If the Length field for this Request indicates a length of 1 DW, then the value for the First DW Byte Enables is implied to be 1111b and the value for the Last DW Byte Enables is implied to be 0000b. 

◦ If the Length field for this Request indicates a length of greater than 1 DW, then the value for the First DW Byte Enables and the Last DW Byte Enables is implied to be 1111b. 

# IMPLEMENTATION NOTE:

# READ REQUEST WITH TPH TO DWORDS WITH SIDE EFFECTS §

Memory Read Requests with the TH bit Set and that target DWORDs with side effects should only be issued when the Requester knows that completion of such reads will not create unintended side effects due to implied Byte Enable values. 

• The First DW BE[3:0] field contains Byte Enables for the first (or only) DW referenced by a Request. 

◦ If the Length field for a Request indicates a length of greater than 1 DW, this field must not equal 0000b. 

• The Last DW BE[3:0] field contains Byte Enables for the last DW of a Request. 

◦ If the Length field for a Request indicates a length of 1 DW, this field must equal 0000b. 

◦ If the Length field for a Request indicates a length of greater than 1 DW, this field must not equal 0000b. 

• For each bit of the Byte Enables fields: 

◦ a value of 0b indicates that the corresponding byte of data must not be written or, if Read Side Effects exist, must not be read at the Completer. 

◦ a value of 1b indicates that the corresponding byte of data must be written or read at the Completer. 

◦ See special rules in this section regarding Memory Read Requests and DMWr Requests that have the TH bit Set. 

• Non-contiguous Byte Enables (enabled bytes separated by non-enabled bytes) are permitted in the First DW BE field for all Requests with length of 1 DW. 

◦ Non-contiguous Byte Enable examples: 1010b, 0101b, 1001b, 1011b, 1101b 

• Non-contiguous Byte Enables are permitted in both Byte Enables fields for Quad Word (QW) aligned Memory Requests with length of 2 DW (1 QW). 

• All non-QW aligned Memory Requests with length of 2 DW (1 QW) and Memory Requests with length of 3 DW or more must enable only bytes that are contiguous with the data between the first and last DW of the Request. 

◦ Contiguous Byte Enables examples: 

First DW BE: 1100b, Last DW BE: 0011b 

First DW BE: 1000b, Last DW BE: 0111b 

• § Table 2-10 shows the correspondence between the bits of the Byte Enables fields, their location in the Request header, and the corresponding bytes of the referenced data. 


Table 2-10 Byte Enables Location and Correspondence §


<table><tr><td>Byte Enables</td><td>Header Location</td><td>Affected Data Byte<eq>^{15}</eq></td></tr><tr><td>First DW BE[0]</td><td>Bit 0 of Byte 7</td><td>Byte 0</td></tr><tr><td>First DW BE[1]</td><td>Bit 1 of Byte 7</td><td>Byte 1</td></tr><tr><td>First DW BE[2]</td><td>Bit 2 of Byte 7</td><td>Byte 2</td></tr><tr><td>First DW BE[3]</td><td>Bit 3 of Byte 7</td><td>Byte 3</td></tr><tr><td>Last DW BE[0]</td><td>Bit 4 of Byte 7</td><td>Byte N-4</td></tr><tr><td>Last DW BE[1]</td><td>Bit 5 of Byte 7</td><td>Byte N-3</td></tr><tr><td>Last DW BE[2]</td><td>Bit 6 of Byte 7</td><td>Byte N-2</td></tr><tr><td>Last DW BE[3]</td><td>Bit 7 of Byte 7</td><td>Byte N-1</td></tr></table>

• A Write Request with a length of 1 DW with no bytes enabled is permitted, and has no effect at the Completer unless otherwise specified. 

# IMPLEMENTATION NOTE: ZERO-LENGTH WRITE §

A Memory Write Request of 1 DW with no bytes enabled, or “zero-length Write,” may be used by devices under certain protocols, in order to achieve an intended side effect. 

• If a Read Request of 1 DW specifies that no bytes are enabled to be read (First DW BE[3:0] field = 0000b), the corresponding Completion must specify a length of 1 DW, and include a data payload of 1 DW. 

The contents of the data payload within the Completion packet is unspecified and may be any value. 

• Receiver/Completer behavior is undefined for a TLP violating the Byte Enables rules specified in this section. 

Receivers are permitted to check for violations of the Byte Enable rules specified in this section. If a Receiver implementing such checks determines that a TLP violates one or more Byte Enable rules, the TLP is a Malformed TLP. These checks are independently optional (see § Section 6.2.3.4 ). 

◦ If Byte Enable rules are checked, a violation is a reported error associated with the Receiving Port (see § Section 6.2 ). 

◦ Byte Enable rules cannot be meaningfully checked by intermediate Receivers, and therefore must not be performed on Flow-Through IDE TLPs. 

# IMPLEMENTATION NOTE: ZERO-LENGTH READ §

A Memory Read Request of 1 DW with no bytes enabled, or “zero-length Read,” may be used by devices as a type of flush Request. For a Requester, the flush semantic allows a device to ensure that previously issued Posted Writes have been completed at their PCI Express destination. To be effective in all cases, the address for the zero-length Read must target the same device as the Posted Writes that are being flushed. One recommended approach is using the same address as one of the Posted Writes being flushed. 

The flush semantic has wide application, and all Completers must implement the functionality associated with this semantic. Since a Requester may use the flush semantic without comprehending the characteristics of the Completer, Completers must ensure that zero-length reads do not have side-effects. Note that the flush applies only to traffic in the same Traffic Class as the zero-length Read. 

# 2.2.5.2 Byte Enable Rules for Flit Mode §

Except as defined in this section, all Byte Enable Rules in Flit Mode are the same as in Non-Flit Mode. 

For all Memory Requests, it is permitted for OHC-A1 (see § Figure 2-7) to be present. OHC-A1 must be included for Requests that require any of the fields included in OHC-A1. For a Memory Request without OHC-A1 and when the Request’s Byte Enable fields are not Reserved, the implied field values for a 1 DW Request are 1111b for First DW Byte Enable and 0000b for Last DW Byte Enable, and for a greater than 1 DW Request is 1111b for both First DW Byte Enable and Last DW Byte Enable. If a Request requires non-Reserved BE field values other than these, then OHC-A1 must be present. When OHC-A1 is present, the PASID, PMR and ER fields are valid if and only if the PV bit is Set. 

As defined in § Section 2.2.7.1 , the Byte Enable fields for AtomicOp Requests are Reserved or implied to be Reserved. If an AtomicOp Request includes OHC-A1, its Byte Enable fields must be Reserved. 

OHC-A2 must be included for all I/O Requests. 

OHC-A3 must be included for all Configuration Requests. 

In all cases where OHC-Ax is present, with Byte Enable fields, these fields must be handled as defined in § Section 2.2.5.1 

If a FM Requester uses ST[7:0] and also sets the Byte Enables to values that do not match the implied Byte Enable values specified in § Section 2.2.5.1 , the Request will not be translatable into NFM. If translation is necessary by any Routing Element between the Requester and Completer, the result will usually be a TLP Translation Egress Blocked error, subject to architected error handling rules. FM Requesters are permitted not to match the implied Byte Enable values, but are strongly recommended to consider the resulting configuration limitations. 

# 2.2.6 Transaction Descriptor §

# 2.2.6.1 Overview §

The Transaction Descriptor is a mechanism for carrying Transaction information between the Requester and the Completer. Transaction Descriptors are composed of three fields: 

• Transaction ID - identifies outstanding Transactions 

• Attributes field - specifies characteristics of the Transaction 

• Traffic Class (TC) field - associates Transaction with type of required service 


§ Figure 2-33 shows the fields of the Transaction Descriptor. Note that these fields are shown together to highlight their relationship as parts of a single logical entity. The fields are not contiguous in the packet header.


![](images/6a6ea92285a3a754dd4ab212f93cbb668094aadfd84faa0863a85d60fc560b6c.jpg)



Figure 2-33 Transaction Descriptor §


# 2.2.6.2 Transaction Descriptor - Transaction ID Field §

The Transaction ID field consists of two major sub-fields: Requester ID and Tag as shown in § Figure 2-34. 

![](images/de79d3896621d37552ffe5ac45a06245d3ec487858381274a665b33bbe06ee19.jpg)



Figure 2-34 Transaction ID §


In some cases (defined below) the Traffic Class (TC) is also included in the Transaction ID. 

The Transaction ID is used to associate Completions with Requests. There are three groups of Request/Completion types for which the Transaction ID has differing rules. The groups are distinguished by the Completion Type expected for the Request type(s) in that group. Each group forms a distinct namespace, and there is no requirement for Transaction ID uniqueness between groups. These groups and their high-level requirements are: 

• Group I: Cpl / CplD, which apply to Non-UIO Requests: 

◦ The Transaction ID consists of Requester ID[15:0] and Tag[13:0] 16 

◦ Requesters must assign Tag values such that Transaction ID values are unique for all outstanding Non-Posted Requests in Group I, without regard to TC or any other field. 

• Group II: UIOWrCpl, which applies to UIO Memory Write (UIOMWr) Requests: 

◦ The Transaction ID consists of the TC[2:0], Requester ID[15:0] and Tag[13:0]. 

◦ Requesters are permitted to assign Tag values such that multiple outstanding Requests in Group II have the same Transaction ID (see § Section 2.2.9.2 ) 

• Group III: UIORdCplD and UIORdCpl, which apply to UIO Memory Read (UIOMRd) Requests: 

◦ The Transaction ID consists of the TC[2:0], Requester ID[15:0] and Tag[13:0]. 

◦ Requesters must assign Tag values such that Transaction ID values are unique for all outstanding Requests in Group III. 

Four Tag sizes are architected for non-UIO channel operation: 14-bit, 10-bit, 8-bit, and 5-bit. One Tag size is architected for UIO channel operation: 14-bit. § Section 2.2.6.2.1 contains rules for Tags under non-UIO channel operation. § Section 2.2.6.2.2 contains rules for Tags under UIO channel rules. 

# 2.2.6.2.1 Tag Rules for Non-UIO Channel Operation §

A given Function may support different Tag sizes when operating as a Requester versus operating as a Completer. Below are the rules regarding operational Tag sizes. Also see the “Considerations for Implementing Larger-Tag Capabilities” Implementation Note later in this section. 

• 14-Bit Tags and 10-Bit Tags are referred to as “larger” Tags. 

◦ A Request containing a 10-bit or 14 bit Tag is called larger-Tag Request. 

◦ The 10-bit Tag Requester Enable and 14-bit Tag Requester Enable bits are called the larger-Tag Requester Enable bits. 

◦ The VF 10-bit Tag Requester Enable and VF 14-bit Tag Requester Enable bits are called the VF larger-Tag Requester Enable bits. 

• 8-Bit Tags and 5-Bit Tags are referred to as “smaller” Tags. 

• All Functions must support 8-Bit Tag Completer capability. 

• A Function that supports Flit Mode must support 14-Bit Tag Completer capability, and thus it automatically supports 10-Bit Tag Completer capability. 

• Functions 17 (including those in Switches) that support 16.0 GT/s or higher data rates must support 10-Bit Tag Completer capability. 

• A Function must not support 14-Bit Tag Requester capability unless it supports 14-Bit Tag Completer capability. 

• A Function must not support 10-Bit Tag Requester capability unless it supports 10-Bit Tag Completer capability. 

In Non-Flit Mode, Tag[8] and Tag[9], are not contiguous with other Tag field bits in the TLP Header. These bits were Reserved prior to 10-Bit Tags being architected. Requesters in Non-Flit Mode that do not support 10-Bit Tag Requester capability must set Tag[9:8] to 00b. 

RCs containing elements that indicate support for 14-Bit Tag Completer capability or 10-Bit Tag Completer capability must handle supported Tag-sized Requests correctly by all registers and memory regions supported as targets of PCIe Requesters (e.g., host memory targeted by DMA Requests or MMIO regions in RCiEPs). 

◦ Each RP indicating support must handle such Requests received by its Ingress Port. 

◦ Each RCiEP indicating support must handle such Requests coming from supported internal paths, including those coming through RPs. 

• If an RC contains RCiEPs that indicate support for 14-Bit Tag Requester capability or 10-Bit Tag Requester capability, the RC must handle Requests from those RCiEPs correctly by all registers and memory regions supported as targets of those RCiEPs (e.g., host memory targeted by DMA Requests or MMIO regions in RCiEPs). 

• Receivers/Completers must handle 8-bit Tag values correctly regardless of the setting of their Extended Tag Field Enable bit (see § Section 7.5.3.4 ). Refer to [PCIe-to-PCI-PCI-X-Bridge] for details on the bridge handling of Extended Tags. 

• Receivers/Completers that support 14-Bit Tag Completer capability or 10-Bit Tag Completer capability must handle the supported Tag-size values correctly, regardless of the setting of their corresponding Tag Requester Enable bits (see § Section 7.5.3.16 and § Section 7.7.9.3 ). 

• 14-Bit Tag capability and 10-Bit Tag capability are not architected for PCI Express to PCI/PCI-X Bridges, and they must not indicate the associated Tag Requester capability or Tag Completer capability. 

• If one or both larger-Tag Requester Enable bits are Set, the following rules apply. 

◦ If both larger-Tag Requester Enable bits are Set in an Endpoint 18 , then 14-Bit Tags are permitted for Requests that target host memory. An implementation specific hardware mechanism in the Endpoint is permitted to limit those Requests to 10-Bit Tags or smaller Tags, but generic software or firmware should not Set the 14-Bit Tag Requester Enable bit unless the host supports 14-Bit Tag Completer capability for host memory. 

◦ If an Endpoint 19 supports sending Requests to other Endpoints (as opposed to host memory), the Endpoint must not send larger-Tag Requests to another given Endpoint unless an implementation specific mechanism determines that the Endpoint supports the corresponding larger Tag Completer capability. Not sending larger-Tag Requests to other Endpoints at all may be acceptable for some implementations. More sophisticated mechanisms are outside the scope of this specification. 

◦ If a PIO Requester has larger-Tag Requester capability, how the Requester determines when to use larger Tags versus smaller Tags is outside the scope of this specification. One example approach is to use smaller Tags for all PIO Requests and use larger Tags for integrated data-mover engines that use the same Requester ID. A similar approach might be used for integrated hardware that takes ownership of P2P requests. 

◦ With 14-Bit Tags, determination of valid Tag values is complicated by inconsistencies in previous versions of this specification. The strongly recommended behavior is for all Tag[13:10] values except 0000b to be valid, and for 14-Bit Requesters not to generate Tag values with Tag[13:10] equal to 0000b. This enables a Requester to determine if a Completion it receives that should have a 14-Bit Tag contains an invalid Tag value. However, for backward compatibility with previous versions of this specification, 14-bit Requesters are permitted to generate any Tag[13:8] values except 00 0000b, and such Tag values are valid. 

◦ With 10-Bit Tags, all Tag[9:8] values except 00b are valid. 10-Bit Tag values with Tag[9:8] equal to 00b are invalid, and must not be generated by the Requester. This enables a Requester to determine if a Completion it receives that should have a 10-Bit Tag contains an invalid Tag value, usually caused by the Completer not supporting 10-Bit Tag Completer capability. 

◦ If a Requester sends a larger-Tag Request to a Completer that lacks the associated larger-Tag Completer capability, the returned Completion(s) will have Tags with invalid Tag values. Such Completions will be handled as Unexpected Completions 20 , which by default are Advisory Non-Fatal Errors. The Requester must follow standard PCI Express error handling requirements. 

◦ When a Requester handles a Completion with an invalid Tag as an Unexpected Completion, the original Request will likely incur a Completion Timeout. If the Requester handles the Completion Timeout condition in some device-specific manner that avoids data corruption, the Requester is permitted to suppress handling the Completion Timeout by standard PCI Express error handling mechanisms as required otherwise. 

◦ If a Requester supports sending larger-Tag Requests to some Completers and smaller-Tag Requests to other Completers concurrently, the Requester must honor the Extended Tag Field Enable bit setting for the smaller-Tag Requests. That is, if the bit is Clear, only the lower 5 bits of the Tag field may be non-Zero; if the bit is Set, only the lower 8 bits of the Tag field may be non-Zero. 

◦ If a Requester supports sending larger-Tag Requests to some Completers and smaller-Tag Requests to other Completers concurrently, the Requester must ensure that no outstanding larger Tags can alias to an outstanding smaller Tag if any larger-Tag Request is completed by a Completer that lacks larger-Tag Completer capability. See the "Using Larger Tags and Smaller Tags Concurrently" Implementation Note later in this section. 

◦ The default value of the Extended Tag Field Enable bit is implementation specific. The default value of the 14-Bit Tag Requester Enable bit and the 10-Bit Tag Requester Enable bit is 0b. 

◦ Receiver/Completer behavior is undefined if multiple uncompleted Requests, are issued from the same Requester with non-unique Transaction ID values. In FM, Completers must be designed to handle simultaneous uncompleted Requests with non-unique Transaction ID values from Requesters that reside in different Hierarchies, as indicated by implied or explicit Segment numbers associated with each Request. 

◦ If Phantom Function Numbers are used to extend the number of outstanding Requests, the combination of the Phantom Function Number and the Tag field must be unique for all outstanding Requests that require a Completion for that Requester, without regard to TC or any other field. 

◦ If Shadow Functions are used to extend the number of outstanding Requests, the combination of the Shadow Function Number and the Tag field must be unique for all outstanding Requests that require a Completion for that Requester, without regard to TC or any other field. 

§ Table 2-11 indicates how the three tag enable bits determine the maximum tag size and permitted tag value ranges a Requester must use for different Completers and their associated paths. For a given combination of Tag enable settings, a Requester must use a Tag size within its enabled maximum and within the Tag capabilities of the Completer and its associated path. For each Request, the Requester is permitted to use a Tag size smaller than the greatest common Tag size supported by the Completer/path, but the Requester must still abide by the permitted Tag value range for the Tag size that it uses. 


Table 2-11 Tag Enables, Sizes, and Permitted Ranges for non-UIO Transactions §


<table><tr><td>14-bit Tag Requester Enable</td><td>10-bit Tag Requester Enable</td><td>Extended Tag Field Enable</td><td>Maximum Request Tag size</td><td>Permitted range for an 8-bit Tag Completer/path</td><td>Permitted range for a 10-bit Tag Completer/path</td><td>Permitted range for a 14-bit Tag Completer/path</td></tr><tr><td>0</td><td>0</td><td>0</td><td>5 bits</td><td>0 to 31</td><td>0 to 31</td><td>0 to 31</td></tr><tr><td>0</td><td>0</td><td>1</td><td>8 bits</td><td>0 to 255</td><td>0 to 255</td><td>0 to 255</td></tr><tr><td>0</td><td>1</td><td>0</td><td>10 bits</td><td>0 to 31</td><td>256 to 1023</td><td>256 to 1023</td></tr><tr><td>0</td><td>1</td><td>1</td><td>10 bits</td><td>0 to 255</td><td>256 to 1023</td><td>256 to 1023</td></tr><tr><td>1</td><td>0</td><td>0</td><td>14 bits</td><td>0 to 31</td><td>0 to 31</td><td>1024 to 16383</td></tr><tr><td>1</td><td>0</td><td>1</td><td>14 bits</td><td>0 to 255</td><td>0 to 255</td><td>1024 to 16383</td></tr><tr><td>1</td><td>1</td><td>0</td><td>14 bits</td><td>0 to 31</td><td>256 to 1023</td><td><eq>1024 \text{ to } 16383^{21}</eq></td></tr><tr><td>1</td><td>1</td><td>1</td><td>14 bits</td><td>0 to 255</td><td>256 to 1023</td><td><eq>1024 \text{ to } 16383^{22}</eq></td></tr></table>

# Notes:

21. The permitted range of 1024 to 16383 is strongly recommended, but for backward compatibility with previous versions of this specification, 256 to 16383 is permitted. 

22. The permitted range of 1024 to 16383 is strongly recommended, but for backward compatibility with previous versions of this specification, 256 to 16383 is permitted. 

1. The permitted range for a 5-bit Tag Completer/path is always 0 to 31, so there is no column in the table to indicate this. 

2. The "X-bit Tag Completer/path" is the greatest common Tag size capability of the Completer and all routing elements along the path between the Requester and the targeted Completer. If a routing element is not the targeted Completer, but detects an Uncorrectable Error with a Request, the routing element may serve as the Completer for the Request. 

3. If a Requester supports sending larger-Tag Requests to some Completers and smaller-Tag Requests to other Completers concurrently, the Requester must ensure that no outstanding larger Tags can alias to an outstanding smaller Tag if any larger-Tag Request is completed by a Completer that lacks larger-Tag Completer capability. 

• For Posted Requests, the Tag[13:8] field is Reserved in Non-Flit Mode, and Tag[13:0] is Reserved in Flit Mode. 

◦ An exception to this rule is allowed for the uses defined in [MCTP-VDM]. 

• In Non-Flit Mode, for Posted Requests with the TH bit Set, the Tag[7:0] field is repurposed for the ST[7:0] field (refer to § Section 2.2.7.1.1 for details). For Posted Requests with the TH bit Clear, the Tag[7:0] field is undefined and may contain any value. (Refer to § Table F-1 for exceptions to this rule for certain Vendor-Defined Messages.) 

◦ For Posted Requests with the TH field Clear, the value in the Tag[7:0] field must not affect Receiver processing of the Request. 

◦ For Posted Requests with the TH bit Set, the value in the ST[7:0] field may affect Completer processing of the Request (refer to § Section 2.2.7.1 for details). 

• A Transaction ID must be unique for each pending Transaction within a Hierarchy. 

• Transaction ID is included with all Requests and Completions. 

• The Requester ID is a 16-bit value that is unique for every PCI Express Function within a Hierarchy. 

Functions must capture the Bus and Device Numbers 23 supplied with all Type 0 Configuration Write Requests completed by the Function and supply these numbers in the Bus and Device Number fields of the Requester ID 24 for all Requests initiated without the use of Shadow Functions by the Device/Function. See § Section 7.9.25 , for details of how the Requester ID may be modified by the use of Shadow Functions. It is recommended that Numbers are captured for successfully completed Requests only. 

Exception: The assignment of Bus and Device Numbers to the Devices within a Root Complex, and Device Numbers to the Downstream Ports within a Switch, may be done in an implementation specific way. 

Note that the Bus Number and Device Number 25 may be changed at run time, and so it is necessary to re-capture this information with each and every Type 0 Configuration Write Request to the Device. 

Configuration Write Requests addressed to unimplemented Functions MUST@FLIT not affect captured Bus and Device Numbers for implemented Functions. 

• When generating Requests on their own behalf (for example, for error reporting), Switches must use the Requester ID associated with the primary side of the bridge logically associated with the Port (see § Section 7.1 ) causing the Request generation. 

• Prior to the initial Configuration Write to a Function, the Function is not permitted to initiate Non-Posted Requests. (A valid Requester ID is required to properly route the resulting completions.) 

◦ Exception: Functions within a Root Complex are permitted to initiate Requests prior to software-initiated configuration for accesses to system boot device(s). 

Note that this rule and the exception are consistent with the existing PCI model for system initialization and configuration. 

Each Function associated with a Device must be designed to respond to a unique Function Number for Configuration Requests addressing that Device. Note: Each non-ARI Device may contain up to eight Functions. Each ARI Device may contain up to 256 Functions. 

• A Switch must forward Requests without modifying the Transaction ID, except when this is not possible due to any non-zero Tag[13:10] bits. For a Request from an Ingress Port operating in FM targeting an Egress Port operating in NFM, the presence of any non-zero Tag[13:10] bits must be handled by the Egress Port first by blocking the TLP and then reporting a TLP Translation Egress Blocked error for a Posted Request or reporting no error for a Non-Posted Request or a UIO Request. Such Tag bits cannot be conveyed in NFM. 

• In some circumstances, a PCI Express to PCI/PCI-X Bridge is required to generate Transaction IDs for Requests it forwards from a PCI or PCI-X bus. 

In Flit Mode, Functions must capture the value of the Destination Segment supplied with all Type 0 Configuration Write Requests successfully completed by the Function. It is permitted for each Function of a Device to independently capture the Destination Segment value, or for all Functions of a Device to use the value captured by Function 0. All Functions within a Switch share a common Segment value that is captured by Functions associated with the Upstream Port. Functions also must capture the DSV bit in Type 0 Configuration Write Requests as described in the Segment Captured bit description in § Section 7.7.9.4 . 

◦ The Segment is effectively an extension of the Requester ID, but is formally defined as a distinct field to avoid confusion with the use of the term Transaction ID in Non-Flit Mode operation. 

◦ In systems that support multiple Segments, each Hierarchy must be associated with a single Segment. It is permitted for multiple hierarchy domains to be associated with a single Segment. 

◦ The Segment Number in the Configuration Write Request must be set to the Downstream Port’s Segment Number. 

• In Flit-Mode, in some circumstances, the captured Segment is also explicitly indicated in a TLP, which enables the Completer to distinguish identical Transaction IDs in Requests coming from different Hierarchies. 

# IMPLEMENTATION NOTE:

# INCREASING THE NUMBER OF OUTSTANDING REQUESTS

# USING PHANTOM FUNCTIONS OR SHADOW FUNCTIONS §

To increase the maximum possible number of outstanding Requests requiring Completion beyond that possible using Tag bits alone, a device may, if the Phantom Functions Enable bit is Set (see § Section 7.5.3.4 ), or the Shadow Functions Enable bit is Set (see § Section 7.9.25.3 ), use Function Numbers not assigned to implemented Functions to logically extend the Tag identifier. For a Single-Function Device, this can allow a significant increase in the maximum number of outstanding Requests. 

When the Phantom Functions Enable bit is Set, unclaimed Function Numbers are referred to as Phantom Function Numbers. 

Phantom Functions have a number of architectural limitations, including a lack of support by ARI Devices, Virtual Functions (VFs), and Physical Functions (PFs) when VFs are enabled. In addition, Address Translation Services (ATS) and ID-Based Ordering (IDO) do not comprehend Phantom Functions. Shadow Functions have fewer limitations. Thus, for many implementations, the use of larger Tags and Shadow Functions are better ways to increase the number of outstanding Non-Posted Requests. 

# IMPLEMENTATION NOTE:

# CONSIDERATIONS FOR IMPLEMENTING LARGER-TAG

# CAPABILITIES §

The use of "larger" (i.e., 10-bit or 14-bit) Tags enables a Requester to increase its number of outstanding Non-Posted Requests (NPRs) substantially, which for very high rates of NPRs or very large round-trip times can avoid Tag availability from becoming a bottleneck. The following formula gives the basic relationship between payload bandwidth, number of outstanding NPRs, and other factors: 

BW = S * N / RTT, where 

BW = payload bandwidth 

S = transaction payload size 

N = number of outstanding NPRs 

RTT = transaction round-trip time 

Generally, only high-speed Requesters on high-speed Links using relatively small transactions will benefit from increasing their number of outstanding NPRs beyond 256, although this can also help maintain performance in configurations where the transaction round-trip time is high. 

In configurations where a Requester with larger-Tag Requester capability needs to target multiple Completers, one needs to ensure that the Requester sends larger-Tag Requests only to Completers that have sufficient larger-Tag Completer capability. This is greatly simplified if all Completers have larger-Tag capability. 

For general industry enablement of larger Tags, it is strongly recommended that all Functions 26 support larger-Tag Completer capability. With new implementations, Completers that don't need to operate on higher numbers of NPRs concurrently themselves can generally track larger Tags internally and return them in Completions with modest incremental investment. 

Completers that actually process higher numbers of NPRs concurrently may require substantial additional hardware resources, but the full performance benefits of larger Tags generally can't be realized unless Completers actually do process higher numbers of NPRs concurrently. 

For platforms where the RC supports larger-Tag Completer capability, it is strongly recommended for platform firmware or operating system software that configures PCIe hierarchies to Set one of the larger-Tag Requester Enable bits automatically in Endpoints with larger-Tag Requester capability. This enables the important class of larger-Tag capable adapters that send Memory Read Requests only to host memory. 

For Endpoints other than RCiEPs, one can determine if the RC supports larger-Tag Completer capability for each one by checking the larger-Tag Completer Supported bits in its associated RP. RCiEPs have no associated RP, so for this reason they are not permitted to have one of their larger-Tag Requester Supported bits Set unless the RC supports sufficient larger-Tag Completer capability for them. Thus, software does not need to perform a separate check for RCiEPs. 

Non-Flit Mode Switches that lack 10-bit Tag Completer capability are still able to forward NPRs and Completions carrying 10-bit Tags correctly, since the two new Tag bits are in TLP Header bits that were formerly Reserved, and Switches are required to forward Reserved TLP Header bits without modification. However, if such a Switch detects an error with an NPR carrying a 10-bit Tag, and that Switch handles the error by acting as the Completer for the NPR, the resulting Completion will have an invalid 10-bit Tag. Thus, it is strongly recommended that Non-Flit Mode Switches between any components using 10-bit Tags support 10-bit Completer capability. Note that Switches supporting 16.0 GT/s or higher data rates must support 10-bit Tag Completer capability. 

For configurations where a Requester with larger-Tag Requester capability targets Completers where some do and some do not have sufficient larger-Tag Completer capability, how the Requester determines which NPRs include larger Tags is outside the scope of this specification. 

# IMPLEMENTATION NOTE:

# USING LARGER TAGS AND SMALLER TAGS CONCURRENTLY §

As stated earlier in this section, if a Requester supports sending larger-Tag Requests to some Completers and smaller-Tag Requests to other Completers concurrently, the Requester must ensure that no outstanding larger Tags can alias to an outstanding smaller Tag if any larger-Tag Request is completed by a Completer that lacks sufficient larger-Tag Completer capability. 

For 10-bit Tags, one implementation approach is to have the Requester partition its 8-bit Tag space into 2 regions: one that will only be used for smaller Tags (8-bit or 5-bit Tags), and one that will only be used for the lower 8 bits of 10-bit Tags. Note that this forces a tradeoff between the Tag space available for 10-bit Tags and smaller Tags. 

For example, if a Requester partitions its 8-bit Tag space to use only the lowest 4 bits for smaller Tags, this supports up to 16 outstanding smaller Tags, and it reduces the 10-bit Tag space by 3*16 values, supporting 768-48=720 outstanding 10-bit Tags. Many other partitioning options are possible, all of which reduce the total number of outstanding Requests. In general, reserving N values for smaller Tags reduces 10-bit Tag space by 3*N values, and the total for smaller Tags plus 10-bit Tags ends up being 768 - 2*N. 

Similar implementation approaches for 14-Bit Tags are possible, and they are straight-forward if only 14-Bit and 8-Bit/5-Bit Tags are supported. If a Requester implementation needs to handle 14-Bit, 10-Bit, and 8-Bit/5-Bit Tag sizes concurrently, the general approach of partitioning the Requester’s Tag spaces still works, but the complexity increases significantly. 

# 2.2.6.2.2 Tag Rules for UIO Channel Operation §

UIO transactions must follow the Tag namespace requirements for Group II and Group III in § Section 2.2.6.2 . Additional Tag rules under UIO channel operation are much simpler compared to non-UIO channel operation: 

• UIO Completers must support 14-Bit Tags, i.e., returning each UIO Request’s entire 14-bit Tag value in any UIO Completions resulting from the Request. 

• UIO Requesters are permitted to use 14-bit Tags including all Tag[13:0] values, regardless of Tag size enable settings. See Extended Tag Field Enable, 10-Bit Tag Requester Enable, and 14-Bit Tag Requester Enable. 

• UIO Completers must be designed to handle simultaneous uncompleted Requests with identical Transaction ID values coming from Requesters that reside in different Hierarchies, as indicated by implied or explicit Segment numbers associated with each Request. 

# 2.2.6.3 Transaction Descriptor - Attributes Field §

The Attributes field is used to provide additional information that allows modification of the default handling of Transactions. These modifications apply to different aspects of handling the Transactions within the system, such as: 

• Ordering 

• Hardware coherency management (snoop) 

Attributes are hints that allow, but do not require, optimizations in the handling of traffic. The level of optimization support is dependent on the target applications of particular PCI Express peripherals and platform building blocks. In Flit Mode the Attributes Field is contiguous in the TLP Header. In Non-Flit Mode, attribute bit 2 is sometimes labeled A2 and is not adjacent to bits 1 and 0 (see § Figure 2-36 and § Figure 2-37). 

![](images/69bb76dce7dbb1e2c4c1268b6f1fe5051a5ab2fcb3e90d638689fd9e206893c6.jpg)



Figure 2-35 Attributes Field of Transaction Descriptor §


# 2.2.6.4 Relaxed Ordering and ID-Based Ordering Attributes §

§ Table 2-12 defines the states of the Relaxed Ordering and ID-Based Ordering attribute Bit-wise. These attributes are discussed in § Section 2.4 . Note that Relaxed Ordering and ID-Based Ordering attributes are not adjacent in location (see § Figure 2-5). 


Table 2-12 Ordering Attributes §


<table><tr><td>Attribute Bit [2]</td><td>Attribute Bit [1]</td><td>Ordering Type</td><td>Ordering Model</td></tr><tr><td>0</td><td>0</td><td>Default Ordering</td><td>PCI Strongly Ordered Model</td></tr><tr><td>0</td><td>1</td><td>Relaxed Ordering</td><td>PCI-X Relaxed Ordering Model</td></tr><tr><td>1</td><td>0</td><td>ID-Based Ordering</td><td>Independent ordering based on Requester/Completer ID</td></tr><tr><td>1</td><td>1</td><td>Relaxed Ordering plus ID-Based Ordering</td><td>Logical “OR” of Relaxed Ordering and IDO</td></tr></table>

Attribute bit [1] is not applicable and must be Clear for Configuration Requests, I/O Requests, Memory Requests that are Message Signaled Interrupts, and Message Requests (except where specifically permitted). 

Attribute bit [2], IDO, is Reserved for Configuration Requests and I/O Requests. IDO is not Reserved for all Memory Requests, including Message Signaled Interrupts (MSI/MSI-X). IDO is not Reserved for Message Requests unless specifically prohibited. A Requester is permitted to Set IDO only if the IDO Request Enable bit in the Device Control 2 register is Set. 

The value of the IDO bit must not be considered by Receivers when determining if a TLP is a Malformed TLP. 

A Completer is permitted to Set IDO only if the IDO Completion Enable bit in the Device Control 2 register is Set. It is not required to copy the value of IDO from the Request into the Completion(s) for that Request. If the Completer has IDO enabled, it is recommended that the Completer set IDO for all Completions, unless there is a specific reason not to (see § Appendix E. ). 

A Root Complex that supports forwarding TLPs peer-to-peer between Root Ports is not required to preserve the IDO bit from the Ingress to Egress Port. 

# 2.2.6.5 No Snoop Attribute §

§ Table 2-13 defines the states of the No Snoop attribute field. Note that the No Snoop attribute does not alter Transaction ordering. 


Table 2-13 Cache Coherency Management Attribute §


<table><tr><td>No Snoop Attribute (b)</td><td>Cache Coherency Management Type</td><td>Coherency Model</td></tr><tr><td>0</td><td>Default</td><td>Hardware enforced cache coherency expected</td></tr><tr><td>1</td><td>No Snoop</td><td>Hardware enforced cache coherency not expected</td></tr></table>

This attribute is not applicable and must be Clear for Configuration Requests, I/O Requests, Memory Requests that are Message Signaled Interrupts, and Message Requests (except where specifically permitted). 

# 2.2.6.6 Transaction Descriptor - Traffic Class Field §

The Traffic Class (TC) is a 3-bit field that allows differentiation of transactions into eight traffic classes. 

Together with the PCI Express Virtual Channel support, the TC mechanism is a fundamental element for enabling differentiated traffic servicing. Every PCI Express Transaction Layer Packet uses TC information as an Invariant label that is carried end to end within the PCI Express fabric. As the packet traverses across the fabric, this information is used at every Link and within each Switch element to make decisions with regards to proper servicing of the traffic. A key aspect of servicing is the routing of the packets based on their TC labels through corresponding Virtual Channels. § Section 2.5 covers the details of the VC mechanism. 

§ Table 2-14 defines the TC encodings. 


Table 2-14 Definition of TC Field Encodings §


<table><tr><td>TC Field Value (b)</td><td>Definition</td></tr><tr><td>000</td><td>TC0: Best Effort service class (General Purpose I/O)(Default TC - must be supported by every PCI Express device)</td></tr><tr><td>001 to 111</td><td>TC1 to TC7: Differentiated service classes(Differentiation based on Weighted-Round-Robin (WRR) and/or priority)</td></tr></table>

It is up to the system software to determine TC labeling and TC/VC mapping in order to provide differentiated services that meet target platform requirements. 

The concept of Traffic Class applies only within the PCI Express interconnect fabric. Specific requirements of how PCI Express TC service policies are translated into policies on non-PCI Express interconnects is outside of the scope of this specification. 

# 2.2.7 Memory, I/O, and Configuration Request Rules §

The general requirements for Memory, I/O, and Configuration Requests are similar in Non-Flit Mode and Flit Mode, however some specific rules differ. Rules that are common between Non-Flit Mode and Flit Mode follow, with rules that are specific to each in subsequent sub-sections. 

# 2.2.7.1 Non-Flit Mode §

The following rule applies to all Memory, I/O, and Configuration Requests. Additional rules specific to each type of Request follow. 

• All Memory, $^ { 1 / 0 , }$ and Configuration Requests include the following fields in addition to the common header fields: 

◦ Requester ID[15:0] and Tag[9:0], forming the Transaction ID. In Non-Flit Mode, the Tag field is 10 bits. 

◦ Last DW BE[3:0] and First DW BE[3:0]. For Memory Read Requests, DMWr Requests, and AtomicOp Requests with the TH bit Set, the byte location for the Last DW BE[3:0] and First DW BE [3:0] fields in the header are repurposed to carry ST[7:0] field. 

◦ For Memory Read Requests and DMWr Requests with the TH bit Clear, see § Section 2.2.5 for First/Last DW Byte Enable Rules. 

◦ For AtomicOp Requests and DMWr Requests with TH bit Set, the values for the DW BE fields are implied to be Reserved. For AtomicOp Requests with TH bit Clear, the DW BE fields are Reserved. 

For Memory Requests, the following rules apply: 

• Memory Requests route by address, using either 64-bit or 32-bit Addressing (see § Figure 2-36 and § Figure 2-37). 

• For Memory Read Requests, Length must not exceed the value specified by Max_Read_Request_Size (see § Section 7.5.3.4 ). 

• For AtomicOp Requests, architected operand sizes and their associated Length field values are specified in § Table 2-15. If a Completer supports AtomicOps, the following rules apply. The Completer must check the Length field value. If the value does not match an architected value, the Completer must handle the TLP as a Malformed TLP. Otherwise, if the value does not match an operand size that the Completer supports, the Completer must handle the TLP as an Unsupported Request (UR). This is a reported error associated with the Receiving Port (see § Section 6.2 ). 


Table 2-15 Length Field Values for AtomicOp Requests §


<table><tr><td rowspan="2">AtomicOp Request</td><td colspan="3">Length Field Value for Architected Operand Sizes</td></tr><tr><td>32 Bits</td><td>64 Bits</td><td>128 Bits</td></tr><tr><td>FetchAdd, Swap</td><td>1 DW</td><td>2 DW</td><td>N/A</td></tr><tr><td>CAS</td><td>2 DW</td><td>4 DW</td><td>8 DW</td></tr></table>

• A FetchAdd Request contains one operand, the “add” value. 

• A Swap Request contains one operand, the “swap” value. 

• A CAS Request contains two operands. The first in the data area is the “compare” value, and the second is the “swap” value. 

• For AtomicOp Requests, the Address must be naturally aligned with the operand size. The Completer must check for violations of this rule. If a TLP violates this rule, the TLP is a Malformed TLP. This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• Requests must not specify an Address/Length combination that causes a Memory Space access to cross a 4-KB boundary. 

◦ Receivers may optionally check for violations of this rule. If a Receiver implementing this check determines that a TLP violates this rule, the TLP is a Malformed TLP. 

▪ If checked, this is a reported error associated with the Receiving Port (see § Section 6.2 ). 

▪ It is recommended that this optional check only occur in Completers and never in intermediate Receivers. 

Intermediate Receivers are not permitted to implement this check for TLPs with Reserved Type values (see § Table 2-5). The relationship between the TLP Length field and the length of the affected memory range depends on the Request Type (for an example where they are different, see AtomicOp CAS Request). 

◦ For AtomicOp Requests, the mandatory Completer check for natural alignment of the Address (see above) already guarantees that the access will not cross a 4-KB boundary, so a separate 4-KB boundary check is not necessary. 

◦ If a 4-KB boundary check is performed for AtomicOp CAS Requests, this check must comprehend that the TLP’s Length field value is based on the size of two operands, whereas the access to Memory Space is based on the size of one operand. 

# IMPLEMENTATION NOTE:

# GENERATION OF 64-BIT ADDRESSES §

It is strongly recommended that PCI Express Endpoints be capable of generating the full range of 64-bit addresses. However, if a PCI Express Endpoint supports a smaller address range, and is unable to reach the full address range required by a given platform environment, the corresponding device driver must ensure that all Memory Transaction target buffers fall within the address range supported by the Endpoint. The exact means of ensuring this is platform and operating system specific, and beyond the scope of this specification. 

# For I/O Requests, the following rules apply:

• I/O Requests route by address, using 32-bit Addressing (see § Figure 2-38) 

• I/O Requests have the following restrictions: 

◦ TC[2:0] must be 000b 

◦ TH is not applicable to I/O Request and the bit is Reserved 

◦ Attr[2] is Reserved 

◦ Attr[1:0] must be 00b 

◦ AT[1:0] must be 00b. Receivers are not required or encouraged to check this. 

◦ Length[9:0] must be 00 0000 0001b 

◦ Last DW BE[3:0] must be 0000b 

Receivers may optionally check for violations of these rules (but must not check Reserved bits). These checks are independently optional (see § Section 6.2.3.4 ). If a Receiver implementing these checks determines that a TLP violates these rules, the TLP is a Malformed TLP. 

◦ If checked, this is a reported error associated with the Receiving Port (see § Section 6.2 ). 

For Configuration Requests, the following rules apply: 

• Configuration Requests route by ID, and use a 3 DW header. 

• In addition to the header fields included in all Memory, I/O, and Configuration Requests and the ID routing fields, Configuration Requests contain the following additional fields (see § Figure 2-39). 

◦ Register Number[5:0] 

◦ Extended Register Number[3:0] 

• Configuration Requests have the following restrictions: 

◦ TC[2:0] must be 000b 

◦ TH is not applicable to Configuration Requests and the bit is Reserved 

◦ Attr[2] is Reserved 

◦ Attr[1:0] must be 00b 

◦ AT[1:0] must be 00b. Receivers are not required or encouraged to check this. 

◦ Length[9:0] must be 00 0000 0001b 

◦ Last DW BE[3:0] must be 0000b 

Receivers may optionally check for violations of these rules (but must not check Reserved bits). These checks are independently optional (see § Section 6.2.3.4 ). If a Receiver implementing these checks determines that a TLP violates these rules, the TLP is a Malformed TLP. 

◦ If checked, this is a reported error associated with the Receiving Port (see § Section 6.2 ). 

MSI/MSI-X mechanisms use Memory Write Requests to represent interrupt Messages (see § Section 6.1.4 ). The Request format used for MSI/MSI-X transactions is identical to the Memory Write Request format defined above, and MSI/MSI-X Requests are indistinguishable from memory writes with regard to ordering, Flow Control, and data integrity. 

# 2.2.7.1.1 TPH Rules – Non-Flit Mode §

• Two formats are specified for TPH. The baseline TPH format without the TPH TLP Prefix (see § Figure 2-41, § Figure 2-42, § Figure 2-43, and § Figure 2-44) must be used for all Requests that provide TPH. The Extended TPH format with the TPH TLP Prefix extends the TPH fields (see § Figure 2-40) to provide additional bits for the Steering Tag (ST) field. 

![](images/ba5c9aa321f4e67e633e156c8fee8126f0a246e28920a92369f9bb1efca2181e.jpg)



Figure 2-40 TPH TLP Prefix - Non-Flit Mode §


• The optional TPH TLP Prefix is used to provide additional TPH information. 

◦ The presence of a TPH TLP Prefix is determined by decoding byte 0. 


Table 2-16 TPH TLP Prefix Bit Mapping - Non-Flit Mode §


<table><tr><td>Fields</td><td>TPH TLP Prefix</td></tr><tr><td>ST[15:8]</td><td>Bits 7:0 of byte 1</td></tr><tr><td>AMA</td><td>Bits 7:5 of byte 2</td></tr><tr><td>AV</td><td>Bit 4 of byte 2</td></tr><tr><td>Reserved</td><td>Bits 3:0 of byte 2</td></tr><tr><td>Reserved</td><td>Bits 7:0 of byte 3</td></tr></table>

• The TPH TLP Prefix is used to send a non-Zero value for any of: 

◦ AMA 

◦ ST[15:8] 

• For Requests that target Memory Space, a value of 1b in the TH bit indicates the presence of TPH in the TLP header and optional TPH TLP Prefix (if present). 

◦ The TH bit must be Set for Requests that provide TPH. 

◦ The TH bit is permitted to be Set for Requests with a TPH TLP Prefix. When the TH bit is 1b, then ST[15:8] is present and meaningful in the TPH TLP Prefix. 

◦ When the TH bit is Clear, the PH field is Reserved. 

◦ The TH bit and the PH field are not applicable and are Reserved for all other Requests. 

• For Requests that target Memory Space, the TPH TLP Prefix may be present if the value of the TH bit is 0b. When the AV bit is 1b and the TPH TLP Prefix is present, AMA is present and meaningful in the TPH TLP Prefix. 

• For Requests that target Memory Space with the AT field not set to 10b, the AMA field in the TPH TLP Prefix is Reserved. 

• The Processing Hints (PH) fields mapping is shown in § Figure 2-41, § Figure 2-42 and § Table 2-17. 


Table 2-17 Location of PH[1:0] in TLP



Header - Non-Flit Mode §


<table><tr><td>PH</td><td>32-bit Addressing</td><td>64-bit Addressing</td></tr><tr><td>1:0</td><td>Bits 1:0 of Byte 11</td><td>Bits 1:0 of Byte 15</td></tr></table>

• The PH[1:0] field provides information about the data access patterns and is defined as described in § Table 2-18. 


Table 2-18 Processing Hint Encoding §


<table><tr><td>PH[1:0](b)</td><td>Processing Hint</td><td>Description</td></tr><tr><td>00</td><td>Bi-directional data structure</td><td>Indicates frequent read and/or write access to data by Host and device</td></tr><tr><td>01</td><td>Requester</td><td>Indicates frequent read and/or write access to data by device</td></tr><tr><td>10</td><td>Target</td><td>Indicates frequent read and/or write access to data by Host</td></tr><tr><td>11</td><td>Target with Priority</td><td>Indicates frequent read and/or write access by Host and indicates high temporal locality for accessed data</td></tr></table>

The Steering Tag (ST) fields are mapped to the TLP header as shown in § Figure 2-43, § Figure 2-44 and § Table 2-19. 


Table 2-19 Location of ST[7:0] in TLP Headers – Non-Flit Mode §


<table><tr><td>ST Bits</td><td>Memory Write Request</td><td>Memory Read Request or AtomicOp Request</td></tr><tr><td>7:0</td><td>Bits 7:0 of Byte 6</td><td>Bits 7:0 of Byte 7</td></tr></table>

• ST[7:0] field carries the Steering Tag value 

◦ A value of Zero indicates no Steering Tag preference 

◦ A total of 255 unique Steering Tag values are provided 

• A Function that does not support the TPH Completer or Routing capability and receives a transaction with the TH bit Set is required to ignore the TH bit and handle the Request in the same way as Requests of the same transaction type without the TH bit Set. 

# 2.2.7.2 Flit Mode §

Except as stated, rules that apply in Non-Flit Mode also apply in Flit Mode. 

• All Memory, I/O, and Configuration Requests include the following fields in addition to the common header fields: 

◦ A Transaction ID, consisting of Requester ID[15:0] and Tag[13:0], and, for Memory Requests, sometimes also including the Requester Segment[7:0] 

• Byte Enable rules for Flit Mode are covered in § Section 2.2.5.2 . There are several notable differences from the Byte Enable rules for Non-Flit Mode covered in § Section 2.2.5.1 . 

• For non-UIO Memory Requests, including AtomicOp and DMWr, the rules for the formation and processing of Header Fields are the same as in Non-Flit Mode. 

• For UIO Requests, the rules for the formation and processing of Header Fields are the same as in Non-Flit Mode with the following exceptions: 

◦ Attr[2:1] are Reserved 

◦ AT[1:0] value of 01b is Reserved (See § Section 10.2.2 ) 

◦ When multiple outstanding Group II UIO Requests are issued using the same Transaction ID (see § Section 2.2.6.2 ), such Requests must have the same value for Attr[0] (i.e., No Snoop). 

• For I/O Requests, the rules for the formation and processing of Header Fields are the same as in Non-Flit Mode. 

• Configuration Requests must include OHC-A3. 

• Configuration Requests must only include OHC-C when they are associated with an IDE stream. 

• UIO Requests are only defined for Flit Mode. 

• The TH bit, present in Non-Flit Mode Requests, is not supported in Flit Mode. 

• The following figures illustrate currently defined Flit Mode Request Headers: 

◦ Reserved Requests (as indicated in § Table 2-5), are defined in § Section 2.2.4.1 and § Section 2.2.4.2 . 

# 2.2.8 Message Request Rules §

This document defines the following groups of Messages: 

• INTx Interrupt Signaling 

• Power Management 

• Error Signaling 

• Locked Transaction Support 

• Slot Power Limit Support 

• Vendor-Defined Messages 

• Latency Tolerance Reporting (LTR) Messages 

• Optimized Buffer Flush/Fill (OBFF) Messages 

• Device Readiness Status (DRS) Messages 

• Function Readiness Status (FRS) Messages 

• Hierarchy ID Messages 

• Precision Time Measurement (PTM) Messages 

• Integrity and Data Encryption (IDE) Messages 

The following rules apply to all Message Requests. Additional rules specific to each type of Message follow. 

• All Message Requests include the following fields in addition to the common header fields (see § Figure 2-49 and § Figure 2-50): 

◦ Requester ID[15:0] 

◦ Message Code[7:0] - Indicates the particular Message embodied in the Request. 

◦ EP - For Messages with data only, indicates data payload is poisoned (see § Section 2.7 ); Reserved for Messages without data. 

• All Message Requests use the Msg or MsgD TLP Type. 

• The Message Code field must be fully decoded (Message aliasing is not permitted). 

• The Attr[2] field is not Reserved unless specifically indicated as Reserved. 

• Except as noted, the Attr[1:0] field is Reserved. 

• Except as noted, TH is not applicable to Message Requests and the bit is Reserved. 

• AT[1:0] must be 00b except for Routed by Address Messages in Flit Mode (see § Table 2-20). Receivers are not required or encouraged to check this. 

• Bytes 8 through 15 are Reserved unless specifically defined. 

• Bytes 8 through 15 must be copied intact during Translation between Flit Mode and Non-Flit Mode, regardless of Message Code. 

• Byte 6, bits 6:0 must be copied intact during Translation between Flit Mode and Non-Flit Mode, regardless of Message Code. 

• Message Requests are posted and do not require Completion. 

• Message Requests follow the same ordering rules as Memory Write Requests. 

Many types of Messages, including Vendor-Defined Messages, are potentially usable in non-D0 states, and it is strongly recommended that the handling of Messages by Ports be the same when the Port's Bridge Function is in D1, D2, and ${ \sf D } 3 _ { \sf H o t }$ as it is in D0. It is strongly recommended that Type 0 Functions support the generation and reception of Messages in non-D0 states. 

In addition to address and ID routing, Messages support several other routing mechanisms. These mechanisms are referred to as “implicit” because no address or ID specifies the destination, but rather the destination is implied by the routing type. The following rules cover Message routing mechanisms: 

• Message routing is determined using the r[2:0] sub-field of the Type field 

◦ Message Routing r[2:0] values are defined in § Table 2-20 

◦ Permitted values are defined in the following sections for each Message 


Table 2-20 Message Routing §


<table><tr><td>r[2:0] (b)</td><td>Description</td><td>Bytes 8 to 15<eq>^{27}</eq></td></tr><tr><td>000</td><td>Routed to Root Complex</td><td>Reserved</td></tr><tr><td>001</td><td>Routed by Address + AT, in Flit Mode<eq>^{28}</eq></td><td>Address/AT</td></tr><tr><td>010</td><td>Routed by ID</td><td>See § Section 2.2.4.2</td></tr><tr><td>011</td><td>Broadcast from Root Complex</td><td>Reserved</td></tr><tr><td>100</td><td>Local - Terminate at Receiver</td><td>Reserved</td></tr><tr><td>101</td><td>Gathered and routed to Root Complex<eq>^{29}</eq></td><td>Reserved</td></tr><tr><td>110 to 111</td><td>Reserved - Terminate at Receiver</td><td>Reserved</td></tr></table>

In Flit Mode, when Route by ID is used and the Destination Segment is different from the Requester Segment, OHC-A4 must be present and include the Destination Segment in byte 0 and DSV must be Set. DSV is permitted to be Set when the Destination Segment is the same as the Requester Segment. DSV must be Clear when Route by ID is not used. When DSV is clear, the Destination Segment field must be set to 00h. OHC-A4 must be present for Route by ID Messages that require PASID. OHC-A1 must be present for Routed to Root Complex Messages that require PASID, ER or PMR. 

# 2.2.8.1 INTx Interrupt Signaling - Rules §

A Message Signaled Interrupt (MSI or MSI-X) is the preferred interrupt signaling mechanism in PCI Express (see § Section 6.1 ). However, in some systems, there may be Functions that cannot support the MSI or MSI-X mechanisms, or it is possible that system firmware/software does not enable MSI or MSI-X. The INTx virtual wire interrupt signaling mechanism, when implemented, can be used to support cases where the MSI or MSI-X mechanisms cannot be used. Switches must support passing interrupts via this mechanism. The following rules apply to the INTx Interrupt Signaling mechanism: 

• The INTx mechanism uses eight distinct Messages (see § Table 2-21). 

• Assert_INTx/Deassert_INTx Messages do not include a data payload (TLP Type is Msg). 

• The Length field is Reserved. 

• With Assert_INTx/Deassert_INTx Messages, the Function Number field in the Requester ID must be 0. Note that the Function Number field is a different size for non-ARI and ARI Requester IDs. 

• Assert_INTx/Deassert_INTx Messages are only issued by Upstream Ports. 

◦ Receivers may optionally check for violations of this rule. If a Receiver implementing this check determines that an Assert_INTx/Deassert_INTx violates this rule, it must handle the TLP as a Malformed TLP. 

▪ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• Assert_INTx and Deassert_INTx interrupt Messages must use the default Traffic Class designator (TC0). Receivers must check for violations of this rule. If a Receiver determines that a TLP violates this rule, it must handle the TLP as a Malformed TLP. 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 


Table 2-21 INTx Mechanism Messages §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0](b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4"><eq>Support^{30}</eq></td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td rowspan="4">Assert_INTA</td><td rowspan="4">00100000</td><td rowspan="4">100</td><td colspan="4">All:</td><td rowspan="4">Assert INTA virtual wireNote: These Messages are used for Conventional PCI-compatible INTx emulation.</td></tr><tr><td>r</td><td></td><td>tr</td><td></td></tr><tr><td colspan="4">As Required:</td></tr><tr><td></td><td>t</td><td></td><td>t</td></tr><tr><td rowspan="4">Assert_INTB</td><td rowspan="4">00100001</td><td rowspan="4">100</td><td colspan="4">All:</td><td rowspan="4">Assert INTB virtual wire</td></tr><tr><td>r</td><td></td><td>tr</td><td></td></tr><tr><td colspan="4">As Required:</td></tr><tr><td></td><td>t</td><td></td><td>t</td></tr><tr><td rowspan="4">Assert_INTC</td><td rowspan="4">00100010</td><td rowspan="4">100</td><td colspan="4">All:</td><td rowspan="4">Assert INTC virtual wire</td></tr><tr><td>r</td><td></td><td>tr</td><td></td></tr><tr><td colspan="4">As Required:</td></tr><tr><td></td><td>t</td><td></td><td>t</td></tr><tr><td rowspan="4">Assert_INTD</td><td rowspan="4">00100011</td><td rowspan="4">100</td><td colspan="4">All:</td><td rowspan="4">Assert INTD virtual wire</td></tr><tr><td>r</td><td></td><td>tr</td><td></td></tr><tr><td colspan="4">As Required:</td></tr><tr><td></td><td>t</td><td></td><td>t</td></tr><tr><td rowspan="4">Deassert_INTA</td><td rowspan="4">00100100</td><td rowspan="4">100</td><td colspan="4">All:</td><td rowspan="4">Deassert INTA virtual wire</td></tr><tr><td>r</td><td></td><td>tr</td><td></td></tr><tr><td colspan="4">As Required:</td></tr><tr><td></td><td>t</td><td></td><td>t</td></tr><tr><td rowspan="4">Deassert_INTB</td><td rowspan="4">00100101</td><td rowspan="4">100</td><td colspan="4">All:</td><td rowspan="4">Deassert INTB virtual wire</td></tr><tr><td>r</td><td></td><td>tr</td><td></td></tr><tr><td colspan="4">As Required:</td></tr><tr><td></td><td>t</td><td></td><td>t</td></tr><tr><td rowspan="3">Deassert_INTC</td><td rowspan="3">00100110</td><td rowspan="3">100</td><td colspan="4">All:</td><td rowspan="3">Deassert INTC virtual wire</td></tr><tr><td>r</td><td></td><td>tr</td><td></td></tr><tr><td colspan="4">As Required:</td></tr></table>


30. Abbreviations: RC = Root Complex Sw = Switch (only used with “Link” routing) Ep = Endpoint Br = PCI Express (primary) to PCI/PCI-X (secondary) Bridge r = Supports as Receiver t = Supports as Transmitter 


<table><tr><td rowspan="3">Name</td><td rowspan="3">Code[7:0](b)</td><td rowspan="3">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="3">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td></td><td>t</td><td></td><td>t</td></tr><tr><td rowspan="4">Deassert_INTD</td><td rowspan="4">00100111</td><td rowspan="4">100</td><td colspan="4">All:</td><td rowspan="4">Deassert INTD virtual wire</td></tr><tr><td>r</td><td></td><td>tr</td><td></td></tr><tr><td colspan="4">As Required:</td></tr><tr><td></td><td>t</td><td></td><td>t</td></tr></table>

The Assert_INTx/Deassert_INTx Message pairs constitute four “virtual wires” for each of the legacy PCI interrupts designated A, B, C, and D. The following rules describe the operation of these virtual wires: 

• The components at both ends of each Link must track the logical state of the four virtual wires using the Assert_INTx/Deassert_INTx Messages to represent the active and inactive transitions (respectively) of each corresponding virtual wire. 

◦ An Assert_INTx represents the active going transition of the INTx (x = A, B, C, or D) virtual wire 

◦ A Deassert_INTx represents the inactive going transition of the INTx (x = A, B, C, or D) virtual wire 

• When the local logical state of an INTx virtual wire changes at an Upstream Port, the Port must communicate this change in state to the Downstream Port on the other side of the same Link using the appropriate Assert_INTx or Deassert_INTx Message. 

Note: Duplicate Assert_INTx/Deassert_INTx Messages have no effect, but are not errors. 

• INTx Interrupt Signaling is disabled when the Interrupt Disable bit of the Command register (see § Section 7.5.1.1.3 ) is Set. 

◦ Any INTx virtual wires that are active when the Interrupt Disable bit is Set must be deasserted by transmitting the appropriate Deassert_INTx Message(s). 

• Virtual and actual PCI to PCI Bridges must map the virtual wires tracked on the secondary side of the Bridge according to the Device Number of the device on the secondary side of the Bridge, as shown in § Table 2-22. 

• Switches must track the state of the four virtual wires independently for each Downstream Port, and present a “collapsed” set of virtual wires on its Upstream Port. 

• If a Switch Downstream Port goes to DL_Down status, the INTx virtual wires associated with that Port must be deasserted, and the Switch Upstream Port virtual wire state updated accordingly. 

◦ If this results in deassertion of any Upstream INTx virtual wires, the appropriate Deassert_INTx Message(s) must be sent by the Upstream Port. 

• The Root Complex must track the state of the four INTx virtual wires independently for each of its Downstream Ports, and map these virtual signals to system interrupt resources. 

◦ Details of this mapping are system implementation specific. 

• If a Downstream Port of the Root Complex goes to DL_Down status, the INTx virtual wires associated with that Port must be deasserted, and any associated system interrupt resource request(s) must be discarded. 


Table 2-22 Bridge Mapping for INTx Virtual Wires §


<table><tr><td>Requester ID[7:3] from the Assert_INTx/Deassert_INTx Message received on Secondary Side of Bridge (Interrupt Source<eq>^{31}</eq>)If ARI Forwarding is enabled, the value 0 must be used instead of Requester ID[7:3].</td><td>INTx Virtual Wire on Secondary Side of Bridge</td><td>Mapping to INTx Virtual Wire on Primary Side of Bridge</td></tr><tr><td rowspan="4">0,4,8,12,16,20,24,28</td><td>INTA</td><td>INTA</td></tr><tr><td>INTB</td><td>INTB</td></tr><tr><td>INTC</td><td>INTC</td></tr><tr><td>INTD</td><td>INTD</td></tr><tr><td rowspan="4">1,5,9,13,17,21,25,29</td><td>INTA</td><td>INTB</td></tr><tr><td>INTB</td><td>INTC</td></tr><tr><td>INTC</td><td>INTD</td></tr><tr><td>INTD</td><td>INTA</td></tr><tr><td rowspan="4">2,6,10,14,18,22,26,30</td><td>INTA</td><td>INTC</td></tr><tr><td>INTB</td><td>INTD</td></tr><tr><td>INTC</td><td>INTA</td></tr><tr><td>INTD</td><td>INTB</td></tr><tr><td rowspan="4">3,7,11,15,19,23,27,31</td><td>INTA</td><td>INTD</td></tr><tr><td>INTB</td><td>INTA</td></tr><tr><td>INTC</td><td>INTB</td></tr><tr><td>INTD</td><td>INTC</td></tr></table>

# IMPLEMENTATION NOTE:

# SYSTEM INTERRUPT MAPPING §

Note that system software (including BIOS and operating system) needs to comprehend the remapping of legacy interrupts (INTx mechanism) in the entire topology of the system (including hierarchically connected Switches and subordinate PCI Express/PCI Bridges) to establish proper correlation between PCI Express device interrupt and associated interrupt resources in the system interrupt controller. The remapping described by § Table 2-22 is applied hierarchically at every Switch. In addition, PCI Express/PCI and PCI/PCI Bridges perform a similar mapping function. 

# IMPLEMENTATION NOTE: VIRTUAL WIRE MAPPING FOR INTX INTERRUPTS FROM ARI DEVICES §

The implied Device Number for an ARI Device is 0. When ARI-aware software (including BIOS and operating system) enables ARI Forwarding in the Downstream Port immediately above an ARI Device in order to access its Extended Functions, software must comprehend that the Downstream Port will use Device Number 0 for the virtual wire mappings of INTx interrupts coming from all Functions of the ARI Device. If non-ARI-aware software attempts to determine the virtual wire mappings for Extended Functions, it can come up with incorrect mappings by examining the traditional Device Number field and finding it to be non-0. 

# 2.2.8.2 Power Management Messages §

These Messages are used to support PCI Express power management, which is described in detail in § Chapter 5. . The following rules define the Power Management Messages: 

• § Table 2-23 defines the Power Management Messages. 

• Power Management Messages do not include a data payload (TLP Type is Msg). 

• The Length field is Reserved. 

• With PM_Active_State_Nak Messages, the Function Number field in the Requester ID must contain the Function Number of the Downstream Port that sent the Message, or else 000b for compatibility with earlier revisions of this specification. 

• With PME_TO_Ack Messages, the Function Number field in the Requester ID must be Reserved, or else for compatibility with earlier revisions of this specification must contain the Function Number of one of the Functions associated with the Upstream Port. Note that the Function Number field is a different size for non-ARI and ARI Requester IDs. 

• Power Management Messages must use the default Traffic Class designator (TC0). Receivers must check for violations of this rule. If a Receiver determines that a TLP violates this rule, it must handle the TLP as a Malformed TLP. 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 


Table 2-23 Power Management Messages §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>PM_Active_State_Nak</td><td>0001 0100</td><td>100</td><td>t</td><td>r</td><td>tr</td><td>r</td><td>Terminate at Receiver</td></tr><tr><td rowspan="4">PM_PME</td><td rowspan="4">0001 1000</td><td rowspan="4">000</td><td colspan="4">All:</td><td rowspan="4">Sent Upstream by PME-requesting component. Propagates Upstream.</td></tr><tr><td>r</td><td></td><td>tr</td><td>t</td></tr><tr><td colspan="4">If PME supported:</td></tr><tr><td></td><td>t</td><td></td><td></td></tr><tr><td>PME_Turn_Off</td><td>00011001</td><td>011</td><td>t</td><td>r</td><td></td><td>r</td><td>Broadcast Downstream</td></tr><tr><td rowspan="2">PME_TO_Ack</td><td rowspan="2">00011011</td><td rowspan="2">101</td><td>r</td><td>t</td><td></td><td>t</td><td rowspan="2">Sent Upstream by Upstream Port. See § Section5.3.3.2.1 .</td></tr><tr><td colspan="4">(Note: Switch handling is special)</td></tr></table>

# 2.2.8.3 Error Signaling Messages

![](images/af111933d160d16395a3739b147bcf4ce08e1f97fa4f42a9ad5988d27cd9f690.jpg)


Error Signaling Messages are used to signal errors that occur on specific transactions and errors that are not necessarily associated with a particular transaction. These Messages are initiated by the agent that detected the error. 

• § Table 2-24 defines the Error Signaling Messages. 

• Error Signaling Messages do not include a data payload (TLP Type is Msg). 

• The Length field is Reserved. 

• With Error Signaling Messages, the Function Number field in the Requester ID must indicate which Function is signaling the error. Note that the Function Number field is a different size for non-ARI and ARI Requester IDs. 

• Error Signaling Messages must use the default Traffic Class designator (TC0) Receivers must check for violations of this rule. If a Receiver determines that a TLP violates this rule, it must handle the TLP as a Malformed TLP. 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 


Table 2-24 Error Signaling Messages §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0](b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>ERR_COR</td><td>00110000</td><td>000</td><td>r</td><td>t</td><td>tr</td><td>t</td><td>This Message is issued when the Function or Device detects a correctable error on the PCI Express interface.</td></tr><tr><td>ERR_NONFATAL</td><td>00110001</td><td>000</td><td>r</td><td>t</td><td>tr</td><td>t</td><td>This Message is issued when the Function or Device detects a Non-Fatal, uncorrectable error on the PCI Express interface.</td></tr><tr><td>ERR_FATAL</td><td>00110011</td><td>000</td><td>r</td><td>t</td><td>tr</td><td>t</td><td>This Message is issued when the Function or Device detects a Fatal, uncorrectable error on the PCI Express interface.</td></tr></table>

The initiator of the Message is identified with the Requester ID of the Message header. The Root Complex translates these error Messages into platform level events. Refer to § Section 6.2 for details on uses for these Messages. 

• ERR_COR Messages have an ERR_COR Subclass (ECS) field in the Message header that enables different subclasses to be distinguished from each other. See § Figure 2-51 and § Figure 2-52. ERR_NONFATAL and ERR_FATAL Messages do not have the ECS field. 

• The ERR_COR Subclass (ECS) field is encoded as shown in § Table 2-25, indicating the ERR_COR Message subclass. 


Table 2-25 ERR_COR Subclass (ECS) Field Encodings §


<table><tr><td>ECS Coding (b)</td><td>Description</td></tr><tr><td>00</td><td>ECS Legacy- The value inherently used if a Requester does not support ECS capability. ECS-capable Requesters must not use this value. See § Section 7.5.3.3 .</td></tr><tr><td>01</td><td>ECS SIG_SFW- Must be used by an ECS-capable Requester when signaling a DPC or SFI event with an ERR_COR Message.</td></tr><tr><td>10</td><td>ECS SIG_OS- Must be used by an ECS-capable Requester when signaling an AER or RP PIO event with an ERR_COR Message.</td></tr><tr><td>11</td><td>ECS Extended- Intended for possible future use. Requesters must not use this value. Receivers must handle the signal internally the same as ECS SIG_OS.</td></tr></table>

# 2.2.8.4 Locked Transactions Support §

The Unlock Message is used to support Lock Transaction sequences. Refer to § Section 6.5 for details on Lock Transaction sequences. The following rules apply to the formation of the Unlock Message: 

• § Table 2-26 defines the Unlock Messages. 

• The Unlock Message does not include a data payload (TLP Type is Msg). 

• The Length field is Reserved. 

• With Unlock Messages, the Function Number field in the Requester ID is Reserved. 

• The Unlock Message must use the default Traffic Class designator (TC0). Receivers must check for violations of this rule. If a Receiver determines that a TLP violates this rule, it must handle the TLP as a Malformed TLP. 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 


Table 2-26 Unlock Message §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>Unlock</td><td>0000 0000</td><td>011</td><td>t</td><td>r</td><td>tr</td><td>r</td><td>Unlock Completer</td></tr></table>

# 2.2.8.5 Slot Power Limit Support §

This Message is used to convey a slot power limitation value from a Downstream Port (of a Root Complex or a Switch) to an Upstream Port of a component (with Endpoint, Switch, or PCI Express-PCI Bridge Functions) attached to the same Link. 

• § Table 2-27 defines the Set_Slot_Power_Limit Message. 

• The Set_Slot_Power_Limit Message includes a 1 DW data payload (TLP Type is MsgD). 

• The Set_Slot_Power_Limit Message must use the default Traffic Class designator (TC0). Receivers must check for violations of this rule. If a Receiver determines that a TLP violates this rule, it must handle the TLP as a Malformed TLP. 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 


Table 2-27 Set_Slot_Power_Limit Message §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>Set_Slot_Power_Limit</td><td>0101 0000</td><td>100</td><td>t</td><td>r</td><td>tr</td><td>r</td><td>Set Slot Power Limit in Upstream Port</td></tr></table>

The Set_Slot_Power_Limit Message includes a one DW data payload. The data payload is copied from the Slot Capabilities register of the Downstream Port and is written into the Device Capabilities register of the Upstream Port on the other side of the Link. Bits 1:0 of Byte 1 of the data payload map to the Slot Power Limit Scale field and bits 7:0 of Byte 0 map to the Slot Power Limit Value field. Bits 7:0 of Byte 3, 7:0 of Byte 2, and 7:2 of Byte 1 of the data payload must all be set to zero by the Transmitter and ignored by the Receiver. This Message must be sent automatically by the Downstream Port (of a Root Complex or a Switch) when one of the following events occurs: 

• On a Configuration Write to the Slot Capabilities register (see § Section 7.5.3.9 ) when the Data Link Layer reports DL_Up status. 

• Any time when a Link transitions from a non-DL_Up status to a DL_Up status (see § Section 2.9.2 ) and the Auto Slot Power Limit Disable bit is Clear in the Slot Control Register. This transmission is optional if the Slot Capabilities register has not yet been initialized. 

The component on the other side of the Link (with Endpoint, Switch, or Bridge Functions) that receives Set_Slot_Power_Limit Message must copy the values in the data payload into the Device Capabilities register associated with the component's Upstream Port. PCI Express components that are targeted exclusively for integration on the system planar (e.g., system board) as well as components that are targeted for integration on an adapter where power consumption of the entire adapter is below the lowest power limit specified for the adapter form factor (as defined in the corresponding form factor specification) are permitted to hardwire the value of all 0's in the Captured Slot Power Limit Scale and Captured Slot Power Limit Value fields of the Device Capabilities Register, and are not required to copy the Set_Slot_Power_Limit Message payload into that register. 

For more details on Power Limit control mechanism see § Section 6.9 . 

# 2.2.8.6 Vendor-Defined Messages

![](images/67d81037ffccac148b287976fdffb57c78e07c818a4d07508ff4044dfaa7a8fd.jpg)


The Vendor-Defined Messages allow expansion of PCI Express messaging capabilities, either as a general extension to [PCIe] or a vendor-specific extension. This section defines the rules associated with these Messages generically. 

• The Vendor-Defined Messages (see § Table 2-28) use the header format shown in § Figure 2-53 and § Figure 2-54. 

◦ The Requester ID is implementation specific. The Requester ID field MUST@FLIT contain the value associated with the Requester. 32 

◦ If the Route by ID routing is used, bytes 8 and 9 form a 16-bit field for the destination ID 

▪ otherwise these bytes are Reserved. 

◦ Bytes 10 and 11 form a 16-bit field for the Vendor ID, as defined by ${ \mathsf { P C l - S l G } } ^ { \otimes }$ , of the vendor defining the Message. 

◦ Bytes 12 through 15 are available for vendor definition. 

◦ The low 7 bits of byte 6 is available for vendor definition. Byte 6, bit 7 is Reserved in Non-Flit Mode and is the EP bit in Flit Mode. 


Table 2-28 Vendor-Defined Messages §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0](b)</td><td rowspan="2">Routing r[2:0](b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>Vendor-Defined Type 0</td><td>0111 1110</td><td>000, 010, 011, 100</td><td colspan="4">See Note 1.</td><td>Triggers detection of UR by Completer if not implemented.</td></tr><tr><td>Vendor-Defined Type 1</td><td>0111 1111</td><td>000, 010, 011, 100</td><td colspan="4">See Note 1.</td><td>Silently discarded by Completer if not implemented.</td></tr></table>

# Notes:

1. Transmission by Endpoint/Root Complex/Bridge is implementation specific. Switches must forward received Messages using Routing r[2:0] field values of 000b, 010b, and 011b. 

• A data payload may be included with either type of Vendor-Defined Message (TLP type is Msg if no data payload is included or MsgD if a data payload is included). 

• For both types of Vendor-Defined Messages, the Attr[1:0] and Attr[2] fields are not Reserved. 

• Messages defined by different vendors or by PCI-SIG are distinguished by the value in the Vendor ID field. 

◦ The further differentiation of Messages defined by a particular vendor is beyond the scope of this document. 

◦ Support for Messages defined by a particular vendor is implementation specific, and beyond the scope of this document. 

• Completers silently discard Vendor-Defined Type 1 Messages that they are not designed to receive - this is not an error condition. 

◦ When an ID Routed Message targeting a Function that is not implemented is detected, it is implementation specific whether that message is silently discarded or signals Unsupported Request. 

• Completers handle the receipt of an unsupported Vendor-Defined Type 0 Message as an Unsupported Request, and the error is reported according to § Section 6.2 . 

[PCIe-to-PCI-PCI-X-Bridge] defines additional requirements for Vendor-Defined Messages that are designed to be interoperable with PCI-X Device ID Messages. This includes restrictions on the contents of the Tag[7:0] field and the Length[9:0] field as well as specific use of Bytes 12 through 15 of the message header. Vendor-Defined Messages intended for use solely within a PCI Express environment (i.e., not intended to address targets behind a PCI Express to 

PCI/PCI-X Bridge) are not subject to the additional rules. Refer to [PCIe-to-PCI-PCI-X-Bridge] for details. Refer to § Section 2.2.6.2 for considerations regarding larger-Tag capabilities. 

# 2.2.8.6.1 PCI-SIG Defined VDMs §

PCI-SIG-Defined VDMs are Vendor-Defined Type 1 Messages that use the PCI-SIG® Vendor ID (0001h). As a Vendor-Defined Type 1 Message, each is silently discarded by a Completer if the Completer does not implement it. 

Beyond the rules for other Vendor-Defined Type 1 Messages, the following rules apply to the formation of the PCI-SIG-Defined VDMs: 

• PCI-SIG-Defined VDMs use the Header format shown in § Figure 2-55 and § Figure 2-56. 

• The Requester ID field must contain the value associated with the Requester. 

• The Message Code must be 0111 1111b. 

• The Vendor ID must be 0001h, which is assigned to the PCI-SIG. 

• The Subtype field distinguishes the specific PCI-SIG-Defined VDMs. See § Appendix F. for a list of PCI-SIG-Defined VDMs. 

# 2.2.8.6.2 Device Readiness Status (DRS) Message §

The Device Readiness Status (DRS) protocol (see § Section 6.22.1 ) uses the PCI-SIG-Defined VDM mechanism (see § Section 2.2.8.6.1 ). The DRS Message is a PCI-SIG-Defined VDM (Vendor-Defined Type 1 Message) with no data payload. 

Beyond the rules for other PCI-SIG-Defined VDMs, the following rules apply to the formation of DRS Messages: 

• § Table 2-29, § Figure 2-57, and § Figure 2-58 illustrate and define the DRS Message. 

• The TLP Type must be Msg. 

• The TC[2:0] field must be 000b. 

• The Attr[2:0] field is Reserved. 

• The Tag field is Reserved. 

• The Subtype field must be 08h. 

• The Message Routing field must be 100b - Local - Terminate at Receiver. 

Receivers may optionally check for violations of these rules (but must not check Reserved bits). These checks are independently optional (see § Section 6.2.3.4 ). If a Receiver implementing these checks determines that a TLP violates these rules, the TLP is a Malformed TLP. 

• If checked, this is a reported error associated with the Receiving Port (see § Section 6.2 ). 


$\mathit { T a b l e 2 - 2 9 D R S M e s s a g e } ~ \mathit { \mathcal { S } }$


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>DRS Message</td><td>0111 1111</td><td>100</td><td>r</td><td>t</td><td>tr</td><td></td><td>Device Readiness Status</td></tr></table>

The format of the DRS Message is shown in § Figure 2-57 and § Figure 2-58: 

# 2.2.8.6.3 Function Readiness Status Message (FRS Message) §

The Function Readiness Status (FRS) protocol (see § Section 6.22.2 ) uses the PCI-SIG-Defined VDM mechanism (see § Section 2.2.8.6.1 ). The FRS message is a PCI-SIG-Defined VDM (Vendor-Defined Type 1 Message) with no data payload. 

Beyond the rules for other PCI-SIG-Defined VDMs, the following rules apply to the formation of FRS Messages: 

• § Table 2-30, § Figure 2-59, and § Figure 2-60 illustrate and define the FRS Message. 

• The TLP Type must be Msg. 

• The TC[2:0] field must be 000b. 

• The Attr[2:0] field is Reserved. 

• The Tag field is Reserved. 

• The Subtype field must be 09h. 

• The FRS Reason[3:0] field indicates why the FRS Message was generated. Encodings are: 

# 0001b: DRS Message Received

The Downstream Port indicated by the Message Requester ID received a DRS Message and has the DRS Signaling Control field in the Link Control Register set to DRS to FRS Signaling Enabled 

# 0010b: D3Hot to D0 Transition Completed

A D3Hot to D0 transition has completed, and the Function indicated by the Message Requester ID is now Configuration-Ready and has returned to the D0uninitialized or D0active state depending on the setting of the No_Soft_Reset bit (see § Section 7.5.2.2 ) 

# 0011b: FLR Completed

An FLR has completed, and the Function indicated by the Message Requester ID is now Configuration-Ready 

# 1000b: VF Enabled

The Message Requester ID indicates a Physical Function (PF) - All Virtual Functions (VFs) associated with that PF are now Configuration-Ready 

# 1001b: VF Disabled

The Message Requester ID indicates a PF - All VFs associated with that PF have been disabled and the Single Root I/O Virtualization (SR-IOV) data structures in that PF may now be accessed. 

# Others:

All other encodings are Reserved 

• The Message Routing field must be 000b - Routed to Root Complex 

Receivers may optionally check for violations of these rules (but must not check Reserved bits). These checks are independently optional (see § Section 6.2.3.4 ). If a Receiver implementing these checks determines that a TLP violates these rules, the TLP is a Malformed TLP. 

• If checked, this is a reported error associated with the Receiving Port (see § Section 6.2 ). 


Table 2-30 FRS Message §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>FRS Message</td><td>0111 1111</td><td>000</td><td>r</td><td>t</td><td>tr</td><td></td><td>Function Readiness Status</td></tr></table>

The format of the FRS Message is shown in § Figure 2-59 and § Figure 2-60 below: 

# 2.2.8.6.4 Hierarchy ID Message §

Hierarchy ID uses the PCI-SIG-Defined VDM mechanism (see § Section 2.2.8.6.1 ). The Hierarchy ID Message is a PCI-SIG-Defined VDM (Vendor-Defined Type 1 Message) with payload (MsgD). 

Beyond the rules for other PCI-SIG-Defined VDMs, the following rules apply to the formation of Hierarchy ID Messages: 

• § Table 2-31, § Figure 2-61, and § Figure 2-62 illustrate and define the Hierarchy ID Message. 

• The TLP Type must be MsgD. 

• Each Message must include a 4-DWORD data payload. 

• The Length field must be 4. 

• The TC[2:0] field must be 000b. 

• The Attr[2:0] field is Reserved. 

• The Tag field is Reserved. 

• The Subtype field is 01h. 

• The Message Routing field must be 011b - Broadcast from Root Complex. 

Receivers may optionally check for violations of these rules (but must not check Reserved bits). These checks are independently optional (see § Section 6.2.3.4 ). If a Receiver implementing these checks determines that a TLP violates these rules, the TLP is a Malformed TLP. 

• If checked, this is a reported error associated with the Receiving Port (see § Section 6.2 ). 

The payload of each Hierarchy ID Message contains the lower 128-bits of the System GUID. 

For details of the Hierarchy ID, GUID Authority ID, and System GUID fields see § Section 6.25 . 


Table 2-31 Hierarchy ID Message §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>Hierarchy ID Message</td><td>0111 1111</td><td>011</td><td>t</td><td>r</td><td>tr</td><td></td><td>Hierarchy ID</td></tr></table>

The format of the Hierarchy ID Message is shown in § Figure 2-61 and § Figure 2-62 below: 

# 2.2.8.7 Ignored Messages §

The messages listed in § Table 2-32 were previously used for a mechanism (Hot-Plug Signaling) that is no longer supported. Transmitters MUST@FLIT not transmit these messages. If message transmission is implemented, it must conform to the requirements of [PCIe-1.0a]. 

Beyond normal Link-Layer processing and mandatory checking for properly-formed TLPs, Receivers MUST@FLIT not process these messages further (i.e., carry out their originally architected Transaction-Layer functionality). If complete processing of these messages is implemented, Receivers must process these messages in conformance with the requirements [PCIe-1.0a]. 

Ignored messages listed in § Table 2-32 are handled by the Receiver as follows: 

• The Physical and Data Link Layers must handle these messages identical to handling any other TLP. 

• The Transaction Layer must account for flow control credit but take no other action in response to these messages. 


Table 2-32 Ignored Messages §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>Ignored Message</td><td>0100 0001</td><td>100</td><td colspan="4"></td><td></td></tr><tr><td>Ignored Message</td><td>0100 0011</td><td>100</td><td colspan="4"></td><td></td></tr><tr><td>Ignored Message</td><td>0100 0000</td><td>100</td><td colspan="4"></td><td></td></tr><tr><td>Ignored Message</td><td>0100 0101</td><td>100</td><td colspan="4"></td><td></td></tr><tr><td>Ignored Message</td><td>0100 0111</td><td>100</td><td colspan="4"></td><td></td></tr><tr><td>Ignored Message</td><td>0100 0100</td><td>100</td><td colspan="4"></td><td></td></tr><tr><td>Ignored Message</td><td>0100 1000</td><td>100</td><td colspan="4"></td><td></td></tr></table>

# 2.2.8.8 Latency Tolerance Reporting (LTR) Message §

The LTR Message is optionally used to report device behaviors regarding its tolerance of Read/Write service latencies. Refer to § Section 6.18 for details on LTR. The following rules apply to the formation of the LTR Message: 

• § Table 2-33, § Figure 2-63, and § Figure 2-64 defines the LTR Message. 

• The LTR Message does not include a data payload (the TLP Type is Msg). 

• The Length field is Reserved. 

• The LTR Message must use the default Traffic Class designator (TC0). Receivers that implement LTR support must check for violations of this rule. If a Receiver determines that a TLP violates this rule, it must handle the TLP as a Malformed TLP. 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 


Table 2-33 LTR Message §


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4"><eq>Support^1</eq></td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>LTR</td><td>0001 0000</td><td>100</td><td>r</td><td>t</td><td>tr</td><td></td><td>Latency Tolerance Reporting</td></tr></table>


Notes: 


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4"><eq>Support^1</eq></td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr></table>

1. Support for LTR is optional. Functions that support LTR must implement the reporting and enable mechanisms described in § Chapter 7. . 

# 2.2.8.9 Optimized Buffer Flush/Fill (OBFF) Message §

The OBFF Message is optionally used to report platform central resource states to Endpoints. This mechanism is described in detail in § Section 6.19 . 

The following rules apply to the formation of the OBFF Message: 

• § Table 2-34, § Figure 2-65, and § Figure 2-66 defines the OBFF Message. 

• The OBFF Message does not include a data payload (TLP Type is Msg). 

• The Length field is Reserved. 

• The Requester ID must be set to the Transmitting Port's ID. 

• The OBFF Message must use the default Traffic Class designator (TC0). Receivers that implement OBFF support must check for violations of this rule. If a Receiver determines that a TLP violates this rule, it must handle the TLP as a Malformed TLP. 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 


${ \cal T } a b l e { 2 } { - } 3 4 { \cal O } B F F M e s s a g e \ S$


<table><tr><td rowspan="2">Name</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4"><eq>Support^1</eq></td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>Ep</td><td>Sw</td><td>Br</td></tr><tr><td>OBFF</td><td>0001 0010</td><td>100</td><td>t</td><td>r</td><td>tr</td><td></td><td>Optimized Buffer Flush/Fill</td></tr></table>

Notes: 

1. Support for OBFF is optional. Functions that support OBFF must implement the reporting and enable mechanisms described in § Chapter 7. . 

# 2.2.8.10 Precision Time Measurement (PTM) Messages

![](images/51c8beda21075fd5cbe0f531b224d0a9f1234297bfd25ae6c3fc4cf064f9b91e.jpg)


§ Table 2-35, § Figure 2-67, § Figure 2-68, § Figure 2-69, and § Figure 2-70 define the PTM Messages. 

• The PTM Request and PTM Response Messages must use a TLP Type of Msg, and must not include a data payload. The Length field is reserved. 

◦ § Figure 2-67 illustrates the format of the PTM Request and Response Messages. 

• The PTM ResponseD Message must use a TLP Type of MsgD, and must include a 64 bit PTM Master Time field in bytes 8 through 15 of the TLP header and a 1 DW data payload containing the 32 bit Propagation Delay field. 

◦ § Figure 2-68 illustrates the format of the PTM ResponseD Message. 

◦ Refer to § Section 6.21.3.2 for details regarding how to populate the PTM ResponseD Message. 

• The Requester ID must be set to the Transmitting Port's ID. 

• A PTM dialog is defined as a matched pair of messages consisting of a PTM Request and the corresponding PTM Response or PTM ResponseD message. 

• The PTM Messages must use the default Traffic Class designator (TC0). Receivers implementing PTM must check for violations of this rule. If a Receiver determines that a TLP violates this rule, it must handle the TLP as a Malformed TLP. 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 


Table 2-35 Precision Time Measurement Messages §


<table><tr><td rowspan="2">Name</td><td rowspan="2">TLP Type</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4">Support</td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>EP</td><td>Sw</td><td>Br</td></tr><tr><td>PTM Request</td><td>Msg</td><td>0101 0010</td><td>100</td><td>r</td><td>t</td><td>tr</td><td></td><td>Initiates PTM dialog</td></tr><tr><td>PTM Response</td><td>Msg</td><td>0101 0011</td><td>100</td><td>t</td><td>r</td><td>tr</td><td></td><td>Completes current PTM dialog - does not carry timing information</td></tr><tr><td>PTM ResponseD</td><td>MsgD</td><td>0101 0011</td><td>100</td><td>t</td><td>r</td><td>tr</td><td></td><td>Completes current PTM dialog - carries timing information</td></tr></table>

# IMPLEMENTATION NOTE: PROPAGATION DELAY[31:0] ENDIANNESS §

The bytes within the Propagation Delay[31:0] field (shown in § Figure 2-68) are such that: 

• Data Byte 0 contains Propagation Delay [31:24] 

• Data Byte 1 contains Propagation Delay [23:16] 

• Data Byte 2 contains Propagation Delay [15:8] 

• Data Byte 3 contains Propagation Delay [7:0] 

Due to ambiguity in previous versions of this document, some implementations made this interpretation: 

• Data Byte 0 contains Propagation Delay [7:0] 

• Data Byte 1 contains Propagation Delay [15:8] 

• Data Byte 2 contains Propagation Delay [23:16] 

• Data Byte 3 contains Propagation Delay [31:24] 

As a result, it is recommended that implementations provide mechanisms for adapting to either byte interpretation. One such mechanism is the optional PTM Propagation Delay Adaptation Capability. 

# 2.2.8.11 Integrity and Data Encryption (IDE) Messages §

IDE Messages are used with the optional Integrity and Data Encryption (IDE) mechanism (see § Section 6.33 ). The following rules apply to the formation of IDE Messages: 

• § Table 2-36 defines the IDE Messages. 

• The IDE Messages do not include a data payload (TLP Type is Msg). 

• The Length field is Reserved. 

• The Requester ID must be set to the RID of the Function implementing IDE at the Transmitting Port. 

• IDE Sync and IDE Fail Messages associated with a Link IDE Stream must use Local - Terminate at Receiver routing (100b). 

• IDE Sync and IDE Fail Messages associated with a Selective IDE Stream must use Routed by ID (010b), and the Destination ID must contain the value in the RID Base field of the Selective IDE RID Association Register Block. 

These Messages must only be Transmitted if the Valid bit is Set in the Selective IDE RID Association Register for the Selective IDE Stream. 

IDE Sync and IDE Fail Messages must use the same Traffic Class designator as the associated IDE Stream, if the Traffic Class designator maps to a non-UIO VC. IDE Fail and IDE Sync messages are not architected for Traffic Class designators that map to a UIO VC. 

• IDE Sync Messages are implicitly associated with the same IDE Stream as indicated in the IDE Prefix applied to the IDE Sync Message . 


Table 2-36 IDE Messages §


<table><tr><td rowspan="2">Name</td><td rowspan="2">TLP Type</td><td rowspan="2">Code[7:0] (b)</td><td rowspan="2">Routing r[2:0] (b)</td><td colspan="4"><eq>Support^1</eq></td><td rowspan="2">Description/Comments</td></tr><tr><td>RC</td><td>EP</td><td>Sw</td><td>Br</td></tr><tr><td>IDE Sync</td><td>Msg</td><td>0101 0100</td><td>010 / 100</td><td>tr</td><td>tr</td><td>tr</td><td></td><td>Synchronization of IDE PR Count for the associated IDE Stream</td></tr><tr><td>IDE Fail</td><td>Msg</td><td>0101 0101</td><td>010 / 100</td><td>tr</td><td>tr</td><td>tr</td><td></td><td>Notification of IDE failure for a specific IDE Stream from the detecting Port to the IDE Partner Port</td></tr></table>


Notes: 



1. Support for these messages is required when the optional IDE mechanism is implemented 


# 2.2.9 Completion Rules §

All Read, Non-Posted Write, UIO, DMWR, and AtomicOp Requests require Completion. Completions include a Completion header that, for some types of Completions, will be followed by some number of DWs of data. The rules for each of the fields of the Completion header are defined in the following sections. 

# 2.2.9.1 Completion Rules for Non-Flit Mode §

• Completions route by ID, and use a 3 DW header. 

◦ Note that the routing ID fields correspond directly to the Requester ID supplied with the corresponding Request. Thus, for Completions these fields will be referred to collectively as the Requester ID instead of the distinct fields used generically for ID routing. 

• In addition to the header fields included in all TLPs and the ID routing fields, Completions contain the following additional fields (see § Figure 2-79): 

◦ Completer ID[15:0] - Identifies the Completer - described in detail below 

◦ Completion Status[2:0] - Indicates the status for a Completion (see § Table 2-37) 

▪ Rules for determining the value in the Completion Status[2:0] field are in § Section 2.3.1 and § Section 10.2.3 

◦ BCM - Byte Count Modified - this bit must not be set by PCI Express Completers, and may only be set by PCI-X completers 

◦ Byte Count - The remaining Byte Count for Request 

▪ The Byte Count value is specified as a binary number, with 0000 0000 0001b indicating 1 byte, 1111 1111 1111b indicating 4095 bytes, and 0000 0000 0000b indicating 4096 bytes. 

▪ For Memory Read Completions, Byte Count is set according to the rules in § Section 2.3.1.1 . 

▪ For AtomicOp Completions, the Byte Count value must equal the associated AtomicOp operand size in bytes. 

▪ For all other types of Completions, the Byte Count value must be 4. 

◦ Tag[9:0] - in combination with the Requester ID field, corresponds to the Transaction ID. In Non-Flit Mode, the Tag field is 10 bits. 

◦ Lower Address[6:0] - lower byte address for starting byte of Completion 

▪ For Memory Read Completions, the value in this field is the byte address for the first enabled byte of data returned with the Completion (see the rules in § Section 2.3.1.1 ). 

▪ For AtomicOp Completions, the Lower Address field is Reserved. 

▪ This field is set to all 0's for all remaining types of Completions. Receivers may optionally check for violations of this rule. See § Section 2.3.2 , second bullet, for details. 


Table 2-37 Completion Status Field Values §


<table><tr><td>Cpl. Status[2:0]Field Value (b)</td><td>Completion Status</td></tr><tr><td>000</td><td>Successful Completion (SC)</td></tr><tr><td>001</td><td>Unsupported Request (UR)</td></tr><tr><td>010</td><td>Request Retry Status (RRS)</td></tr><tr><td>100</td><td>Completer Abort (CA)</td></tr><tr><td>all others</td><td>Reserved</td></tr></table>

• The Completer ID[15:0] is a 16-bit value that is unique for every PCI Express Function within a Hierarchy (see § Figure 2-80 and § Figure 2-81) 

![](images/1bba34c942c7fa7611e37d7d93941a311b9302efded033efe2684675c3fed474.jpg)



Figure 2-80 (Non-ARI) Completer ID §


![](images/b04241a7c927330fb9cda290524876a814504702c22b14ad7040d8113e2201cc.jpg)



Figure 2-81 ARI Completer ID §


• Functions must capture the Bus and Device Numbers 33 supplied with all Type 0 Configuration Write Requests completed by the Function, and supply these numbers in the Bus and Device Number fields of the Completer ${ | \mathsf { D } ^ { 3 4 } }$ for all Completions generated by the Device/Function. 

◦ If a Function must generate a Completion prior to the initial device Configuration Write Request, 0's must be entered into the Bus Number and Device Number fields 

◦ Note that Bus Number and Device Number may be changed at run time, and so it is necessary to re-capture this information with each and every Configuration Write Request. 

◦ Exception: The assignment of Bus Numbers to the Devices within a Root Complex may be done in an implementation specific way. 

• In some cases, a Completion with UR Completion Status may be generated by an MFD without associating the Completion with a specific Function within the device - in this case, the Function Number field 35 is Reserved. 

◦ Example: An MFD receives a Read Request that does not target any resource associated with any of the Functions of the device - the device generates a Completion with UR status and sets a value of all 0's in the Function Number field of the Completer ID. 

• Completion headers must supply the same values for the Requester ID, Tag, and Traffic Class as were supplied in the header of the corresponding Request. 

• Completion headers must supply the same values for the Attribute as were supplied in the header of the corresponding Request, except as explicitly allowed: 

◦ when IDO is used (see § Section 2.2.6.4 ) 

◦ when RO is used in a Translation Completion (see § Section 10.2.3 ) 

• For Completions, the TH bit is Reserved. 

• AT[1:0] must be 00b. Receivers are not required or encouraged to check this. 

• The Completer ID field is not meaningful prior to the software initialization and configuration of the completing device (using at least one Configuration Write Request), and for this case the Requester must ignore the value returned in the Completer ID field. 

• A Completion including a data payload must specify the actual amount of data returned in that Completion, and must include the amount of data specified. 

◦ It is a TLP formation error to include more or less data than specified in the Length field, and the resulting TLP is a Malformed TLP. 

Note: This is simply a specific case of the general rule requiring the TLP data payload length to match the value in the Length field. 

# 2.2.9.2 Completion Rules for Flit Mode §

In Flit Mode, the rules for non-UIO Completions are the same as in Non-Flit Mode, except as defined in this section. In Flit Mode, non-UIO Completions must use the Completion Header Base Format shown in § Figure 2-82. UIO Write Completions and UIO Read Completions with Completion Status other than Successful Completion (i.e., without Data) must use the Completion Header Base Format shown in § Figure 2-83. UIO Read Completions with Data must use the UIO Completion Header Base Format shown in § Figure 2-84. 

In Flit Mode, the Tag field is 14 bits. 

In Flit Mode, Lower Address[6], Lower Address[5:2], and Lower Address[1:0], are not contiguous field bits in the TLP. In § Figure 2-82 to § Figure 2-84, LA6 is Lower Address[6] and LA[5:2] is Lower Address[5:2]. 

Reserved Completions (as indicated in § Table 2-5), are ID Routed TLPs as defined in § Section 2.2.4.2 . 

# OHC-A5 (see § Figure 2-11) is required for all:

• Unsuccessful Completions 

• Non-UIO Completions with Lower Address[1:0] not equal to 00b 

• Completions that require the Destination Segment due to the associated Non-Posted Request or UIO Request containing a Requester Segment that does not match the Completer's captured Segment. 

When OHC-A5 is not present it is implied that the Completion Status is Successful Completion, that Completer Segment and Destination Segment need not be explicitly indicated (see Segment rules in § Section 2.2.1.2 ), and that, for non-UIO Completions, the Lower Address[1:0] = 00b. 

When OHC-A5 is present: 

• The Completion Status and, for non-UIO Completions, Lower Address[1:0] fields must contain valid values. ◦ For UIO Completions, Lower Address[1:0] is Reserved. 

• If the Segment Captured bit is Set, the Completer Segment field must contain the Segment value captured by the Function as described in § Section 2.2.6.2 ; if the Segment Captured bit is Clear, the Completer Segment field must be 00h. 

• if the associated Request did not include a Requester Segment, the Destination Segment field must be 00h and the DSV bit must be Clear. If the associated Request included a Requester Segment, the Destination Segment field must reflect the value of the Requester Segment and the DSV bit must be Set. See RP Segment Exceptions for cases where RPs are not required to include Segment information. 

The BCM field, present in Non-Flit Mode Completions, is not supported in Flit Mode. 

For all UIO Completions: 

• The Read Completion Boundary and Write Completion Boundary rules defined in § Section 2.3.1.2 and § Section 2.3.1.3 , respectively, must be followed. 

• Length[9:0] indicates the total number of DW represented by this Completion. See § Table 2-4 for values. 

◦ Regardless of Completion Status, Completers must return Completions corresponding to all DW in a UIO Request. 

◦ Byte Enables must not be considered when determining the Length value for UIO Completions. 

▪ For a Zero Length UIO Write (where in the Request, Length is 00_0000_0001b and First Byte Enable 0000b), one DW must be considered to have been written. 

• The Tag field value must match the Tag field value for the corresponding UIO Request(s) 

◦ UIO Write Completions are permitted to be coalesced or split, for a given Transaction ID, provided all DW Completion accounting remains accurate (see § Section 2.3.1.3 ). 

◦ UIO Read Completions are permitted to be split, for a given Transaction ID, provided all DW Completion accounting remains accurate (see § Section 2.3.1.2 ). 

• For UIO Completions without Data (see § Figure 2-83) 

◦ Lower Address is Reserved. 

• For UIO Completions with Data (see § Figure 2-84): 

◦ Lower Address[11:2] must contain valid values. 

◦ Lower Address[1:0] is Reserved. 

• The CDL[1:0] field is assigned for use by [CXL]; this field must be treated as Reserved for use cases not covered by [CXL]. 

• UIO Requesters must accept UIO Completions in any order. 

• UIO Memory Request(s) associated with a Transaction ID are considered completed only when the sum of all DW completed, as indicated by the Length[9:0] field value(s) in the Completion(s), equals the sum of all DW expected for the associated Request(s). 

◦ Only UIO Memory Writes are allowed to have multiple outstanding Requests with the same Transaction ID. If it is necessary for a Requester to ensure that UIO Memory Write Requests issued with a given Transaction ID have completed, the Requester must delay issuing additional Requests with that Transaction ID until it has received Completions accounting for all outstanding UIO Memory Write Requests using that Transaction ID. 

• When fully completed, all Requests associated with the same Transaction ID are represented by the same Completion Status. However, individual Completions of a UIO Request may indicate different Completion 

Status values. At any point where UIO Completions are coalesced, including at the Requester, the coalesced Completion Status is determined according to the following rules: 

◦ UR if any of the UIO Completions have UR Completion Status 

◦ CA if none of the UIO Completions have UR Completions Status, and any have CA Completion Status 

◦ RRS if none of the UIO Completions have UR or CA Completions Status, and any have RRS Completion Status 

◦ SC if all UIO Completions have Successful Completion Status 

◦ Any completion status not defined in § Table 2-37 should be treated as a UR (see § Section 2.3.2 ) 

• UIO Completions for UIO Read Requests that have a Completion Status other than Successful Completion must use TLP Type UIORdCpl 

◦ The Length value for UIORdCpl is not constrained by Max Payload Size or Max Read Request Size. 

• Attr[2:0], corresponding to IDO, RO and NS in non-UIO Memory Requests, are Reserved 

• The EP bit is Reserved for UIOWrCpl and UIORdCpl. 

# 2.2.10 TLP Prefix Rules §

# 2.2.10.1 TLP Prefix General Rules - Non-Flit Mode §

In NFM, the following rules apply to any TLP that contains a TLP Prefix: 

• For any TLP, a value of 100b in the Fmt[2:0] field in byte 0 of the TLP indicates the presence of a TLP Prefix and the Type[4] bit indicates the type of TLP Prefix. 

◦ A value of 0b in the Type[4] bit indicates the presence of a Local TLP Prefix 

◦ A value of 1b in the Type[4] bit indicates the presence of an End-End TLP Prefix 

• The format for bytes 1 through 3 of a TLP Prefix is defined by its TLP Prefix type. 

• A TLP that contains a TLP Prefix must have an underlying TLP Header. A received TLP that violates this rule is handled as a Malformed TLP. This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• It is permitted for a TLP to contain more than one TLP Prefix of any type 

◦ When a combination of Local and End-End TLP Prefixes are present in TLP, it is required that all the Local TLP Prefixes precede any End-End TLP Prefixes. A received TLP that violates this rule is handled as a Malformed TLP. This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• The size of each TLP Prefix is 1 DW. A TLP Prefix may be repeated to provide space for additional data. 

• If the value in the Fmt and Type field indicates the presence of a Local TLP Prefix, handle according to the Local TLP Prefix handling (see § Section 2.2.10.2 ). 

• If the value in the Fmt and Type field indicates the presence of an End-End TLP Prefix, handle according to the End-End TLP Prefix handling (see § Section 2.2.10.4 ). 

# 2.2.10.2 Local TLP Prefix Processing §

The following rules apply to Local TLP Prefixes: 

• In Flit Mode, TLP Prefix types are determined using the Type[7:0] field (see § Table 2-5) 

• In Non-Flit Mode, Local TLP Prefix types are determined using the L[3:0] sub-field of the Type field 

◦ Type[4] must be 0b 

Local TLP Prefix L[3:0] values are defined in § Table 2-38. 


Table 2-38 Local TLP Prefix Types §


<table><tr><td>Local TLP Prefix Type</td><td>L[3:0] (b)</td><td>Description</td></tr><tr><td>MR-IOV</td><td>0000</td><td>MR-IOV TLP Prefix - Refer to [MR-IOV] for details.</td></tr><tr><td>FlitModePrefix</td><td>1101</td><td>Flit Mode Local TLP Prefix - See § Section 2.2.10.3</td></tr><tr><td>VendPrefixL0</td><td>1110</td><td>Vendor Defined Local TLP Prefix - Refer to § Section 2.2.10.2.1 for further details.</td></tr><tr><td>VendPrefixL1</td><td>1111</td><td>Vendor Defined Local TLP Prefix - Refer to § Section 2.2.10.2.1 for further details.</td></tr><tr><td></td><td></td><td>All other encodings are Reserved.</td></tr></table>

• The size, routing, and flow control rules are specific to each Local TLP Prefix type. 

• It is an error to receive a TLP with a Local TLP Prefix type not supported by the Receiver. If the Extended Fmt Field Supported bit is Set, TLPs in violation of this rule are handled as a Malformed TLP unless explicitly stated differently in another specification. This is a reported error associated with the Receiving Port (see § Section 6.2 ). If the Extended Fmt Field Supported bit is Clear, behavior is device specific. 

• No Local TLP Prefixes are protected by ECRC even if the underlying TLP is protected by ECRC. 

# 2.2.10.2.1 Vendor Defined Local TLP Prefix §

As described in § Table 2-38, Types VendPrefixL0 and VendPrefixL1 are defined for use as Vendor Defined Local TLP Prefixes. To maximize interoperability and flexibility the following rules are applied to such prefixes: 

• Components must not send TLPs containing Vendor Defined Local TLP Prefixes unless this has been explicitly enabled (using vendor-specific mechanisms). 

• Components that support any usage of Vendor Defined Local TLP Prefixes must support the 3-bit definition of the Fmt field and have the Extended Fmt Field Supported bit Set (see § Section 7.5.3.15 ). 

• It is recommended that components be configurable (using vendor-specific mechanisms) so that all vendor defined prefixes can be sent using either of the two Vendor Defined Local TLP Prefix encodings. Such configuration need not be symmetric (for example each end of a Link could transmit the same Prefix using a different encoding). 

# 2.2.10.3 Flit Mode Local TLP Prefix §

This prefix (see § Figure 2-85) is only permitted when operating in Flit Mode. 

![](images/c5cea7e1a10c9881c91d6b49b348cf4d447f0a2f071a14d88d76e922b11c0819.jpg)



Figure 2-85 Flit Mode Local TLP Prefix §


If the Flit Mode Local TLP Prefix is applied to a NFM TLP, this is an error that MUST@FLIT be handled as a Malformed TLP. It is permitted to apply the Flit Mode Local TLP Prefix to any FM TLP, but it is strongly recommended that the Flit Mode Local TLP Prefix is only applied to TLPs that specifically require the Prefix to be present. 

The Flit Mode Local TLP Prefix includes: 

• TLP Uses Dedicated Credits – This bit when Set indicates that the associated TLP must be handled using dedicated flow control credits. If this bit is Clear, or if the Flit Mode Local TLP Prefix is not present, the associated TLP must be handled using shared flow control credits. 

# 2.2.10.4 End-End TLP Prefix Processing - Non-Flit Mode §

The following rules apply to End-End TLP Prefixes 

• End-End TLP Prefix types are determined using the E[3:0] sub-field of the Type field 

◦ Type[4] must be 1b 

◦ End-End TLP Prefix E[3:0] values are defined in § Table 2-39 


Table 2-39 End-End TLP Prefix Types §


<table><tr><td>End-End TLP Prefix Type</td><td>E[3:0] (b)</td><td>Description</td></tr><tr><td>TPH</td><td>0000</td><td>TPH - Refer to § Section 2.2.7.1.1 and § Section 6.17 for further details.</td></tr><tr><td>PASID</td><td>0001</td><td>PASID - Refer to § Section 6.20.2.1 for further details.</td></tr><tr><td>IDE</td><td>0010</td><td>Identifies an IDE TLP - Refer to § Section 6.33 for further details.</td></tr><tr><td>VendPrefixE0</td><td>1110</td><td>Vendor Defined End-End TLP Prefix - Refer to § Section 2.2.10.4.1 for further details.</td></tr><tr><td>VendPrefixE1</td><td>1111</td><td>Vendor Defined End-End TLP Prefix - Refer to § Section 2.2.10.4.1 for further details.</td></tr><tr><td></td><td></td><td>All other encodings are Reserved.</td></tr></table>

• The maximum number of End-End TLP Prefixes permitted in a TLP is 4: 

◦ A Receiver supporting TLP Prefixes must check this rule. If a Receiver determines that a TLP violates this rule, the TLP is a Malformed TLP. This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• The presence of an End-End TLP Prefix does not alter the routing of a TLP. TLPs are routed based on the routing rules covered in § Section 2.2.4 . 

• Functions indicate how many End-End TLP Prefixes they support by the Max End-End TLP Prefixes field in the Device Capabilities 2 register (see § Section 7.5.3.15 ). 

◦ For Root Ports, the Max End-End TLP Prefixes field is permitted to return a value indicating support for fewer End-End TLP Prefixes than what the Root Port hardware actually implements; however, the error handling semantics must still be based on the value contained in the field. TLPs received that contain more End-End TLP Prefixes than are supported by the Root Port must be handled as follows. It is recommended that Requests be handled as Unsupported Requests, but otherwise they must be handled as Malformed TLPs. It is recommended that Completions be handled as Unexpected Completions, but otherwise they must be handled as Malformed TLPs. For TLPs received by the Ingress Port, this is a reported error associated with the Ingress Port. For TLPs received internally to be transmitted out the Egress Port, this is a reported error associated with the Egress Port. See § Section 6.2 . 

◦ For all other Function types, TLPs received that contain more End-End TLP Prefixes than are supported by a Function must be handled as Malformed TLPs. This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

Advanced Error Reporting (AER) logging (if supported) occurs as specified in § Section 6.2.4.4 . 

• Switches must support forwarding of TLPs with up to 4 End-End TLP Prefixes if the End-End TLP Prefix Supported bit is Set. 

• Different Root Ports with the End-End TLP Prefix Supported bit Set are permitted to report different values for Max End-End TLP Prefixes. 

• All End-End TLP Prefixes are protected by ECRC if the underlying TLP is protected by ECRC. 

• It is an error to receive a TLP with an End-End TLP Prefix by a Receiver that does not support End-End TLP Prefixes. A TLP in violation of this rule is handled as a Malformed TLP. This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• Software should ensure that TLPs containing End-End TLP Prefixes are not sent to components that do not support them. Components where the Extended Fmt Field Supported bit is Clear may misinterpret TLPs containing TLP Prefixes. 

• If one Function of an Upstream Port has the End-End TLP Prefix Supported bit Set, all Functions of that Upstream Port must handle the receipt of a Request addressed to them that contains an unsupported End-End TLP Prefix type as an Unsupported Request. This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• If one Function of an Upstream Port has the End-End TLP Prefix Supported bit Set, all Functions of that Upstream Port must handle the receipt of a Completion addressed to them that contains an unsupported End-End TLP Prefix type as an Unexpected Completion. This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• For Routing Elements, the End-End TLP Prefix Blocking bit in each Egress Port determines whether TLPs containing End-End TLP Prefixes can be transmitted via that Egress Port (see § Section 7.5.3.16 ). If forwarding is blocked the entire TLP is dropped and a TLP Prefix Blocked Error is reported. If the blocked TLP is a Non-Posted Request, the Egress Port returns a Completion with Unsupported Request Completion Status. The TLP Prefix Blocked Error is a reported error associated with the Egress Port (see § Section 6.2 ). 

• For routing elements where Multicast is enabled (see § Section 6.14 ). End-End TLP Prefixes are replicated in all Multicast copies of a TLP. TLP Prefix Egress Blocking of Multicast packets is performed independently at each Egress Port. 

# 2.2.10.4.1 Vendor Defined End-End TLP Prefix §

As described in § Table 2-39, Types VendPrefixE0 and VendPrefixE1 are defined for use as Vendor Defined End-End TLP Prefixes. To maximize interoperability and flexibility the following rules are applied to such prefixes: 

• Components must not send TLPs containing Vendor Defined End-End TLP Prefixes unless this has been explicitly enabled (using vendor-specific mechanisms). 

• It is recommended that components be configurable (using vendor-specific mechanisms) to use either of the two Vendor Defined End-End TLP Prefix encodings. Doing so allows two different Vendor Defined End-End TLP Prefixes to be in use simultaneously within a single PCI Express topology while not requiring that every source understand the ultimate destination of every TLP it sends. 

# 2.2.10.4.2 Root Ports with End-End TLP Prefix Supported §

Support for peer-to-peer routing of TLPs containing End-End TLP Prefixes between Root Ports is optional and implementation dependent. If an RC supports End-End TLP Prefix routing capability between two or more Root Ports, it must indicate that capability in each associated Root Port via the End-End TLP Prefix Supported bit in the Device Capabilities 2 register. 

An RC is not required to support End-End TLP Prefix routing between all pairs of Root Ports that have the End-End TLP Prefix Supported bit Set. A Request with End-End TLP Prefixes that would require routing between unsupported pairs of Root Ports must be handled as a UR. A Completion with End-End TLP Prefixes that would require routing between unsupported pairs of Root Ports must be handled as an Unexpected Completion (UC). In both cases, this error is reported by the “sending” Port. 

The End-End TLP Prefix Supported bit must be Set for any Root Port that supports forwarding of TLPs with End-End TLP Prefixes initiated by host software or Root Complex Integrated Endpoints (RCiEPs). The End-End TLP Prefix Supported bit must be Set for any Root Ports that support forwarding of TLPs with End-End TLP Prefixes received on their Ingress Port to RCiEPs. 

Different Root Ports with the End-End TLP Prefix Supported bit Set are permitted to report different values for Max End-End TLP Prefixes. 

An RC that splits a TLP into smaller TLPs when performing peer-to-peer routing between Root Ports must replicate the original TLP's End-End TLP Prefixes in each of the smaller TLPs (see § Section 1.3.1 ). 

# 2.2.11 OHC-E Rules - Flit Mode §

End-End TLP Prefixes in Non-Flit Mode are replaced by OHC-E in Flit Mode (see § Figure 2-86, § Figure 2-87, and § Figure 2-88). 

![](images/8a6ebd271cb6c57644f7b868badedc801b9664661fcb7791259e3bd7bb858c3f.jpg)



Figure 2-86 OHC-E1 §


![](images/eb92786721b522f900ff9d349d7c4454e2f35eaf570b10ad0c08ead89a78e3ea.jpg)



Figure 2-87 OHC-E2 §


OHC-E is used to convey content that would otherwise use End-End TLP Prefixes 0011b to 1111b. 

• For each DW of OHC-E, Byte 0, bits [7:4] indicate the format of the remainder of the DW and are encoded: 

◦ 0000b - No Entry - The reminder of the DW is Reserved 

◦ 0001b - End-End TLP Prefix DW - The reminder of the DW is defined as follows: 

▪ Byte 0, bits [3:0] take the value of E[3:0] in the corresponding End-End TLP Prefix (see § Table 2-39), with the exception that encodings 0000b-0010b are Reserved. 

▪ Bytes 1, 2 and 3 take the value of bytes 1, 2 and 3 in the corresponding End-End TLP Prefix. 

◦ 0010b-1111b - Reserved - Receivers must handle as No Entry 

OHC-E must be populated without gaps, starting with the first DW. Any No Entry DWs must be populated at the end. Transmitters must use the smallest possible OHC-E and avoid unnecessary No Entry DWs. When translating VendPrefixE0 or VendPrefixE1 from NFM to FM or vice-versa, the same relative sequence must be preserved. 

RC support for peer-to-peer routing of TLPs containing OHC-E content between Root Ports is optional and implementation dependent. 

If a Function sets does not support OHC-E, and it is the targeted Completer for a received TLP that has OHC-E, it must handle the TLP as an Unsupported Request or an Unexpected Completion. Such a Function is permitted to drop OHC-E content during header logging for the error. This behavior is consistent with the rules stated in § Section 2.2.1.2 for Endpoint Upstream Ports and Root Ports, but with an extension of the rule for Switch Ports as well when they don’t support OHC-E. 

If a Switch Function or RP Function does not support OHC-E and it receives a TLP with OHC-E to be forwarded, the TLP must be handled as below. 

• PR FC Type: Block at Ingress; if TLP is UIO, report no error, else handle as a TLP Prefix Blocked Error 

• NPR FC Type: Block at Ingress; report no error 

• CPL FC Type: Block at Ingress; handle as a TLP Prefix Blocked Error 

If a Function sets its OHC-E Support field to 001b or 010b, it must handle a received TLP that targets it and that has OHC-E containing more DWs than it supports as an Unsupported Request or an Unexpected Completion. 

# 2.3 Handling of Received TLPs §

This section describes how all Received TLPs are handled when they are delivered to the Receive Transaction Layer from the Receive Data Link Layer, after the Data Link Layer has validated the integrity of the received TLP. The rules are diagrammed in the flowchart shown in § Figure 2-89. 

• Values in Reserved fields must be ignored by the Receiver. 

• In Non-Flit Mode, if the value in the Fmt field indicates the presence of at least one TLP Prefix: 

◦ Detect if additional TLP Prefixes are present in the header by checking the Fmt field in the first byte of subsequent DWs until the Fmt field does not match that of a TLP Prefix. 

◦ Handle all received TLP Prefixes according to TLP Prefix Handling Rules (see § Section 2.2.10.1 ). 

• In Flit Mode, if the value in the Type field indicates the presence of at least one Local TLP Prefix: 

◦ Detect if additional Local TLP Prefixes are present in subsequent DWs. 

◦ Handle all received Local TLP Prefixes according to TLP Prefix Handling Rules (see § Section 2.2.10.3 ). 

• In Non-Flit Mode, if the Extended Fmt Field Supported bit is Set, Received TLPs that use encodings of Fmt and Type that are Reserved are Malformed TLPs (see § Table 2-2 and § Table 2-3). 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• In Non-Flit Mode, if the Extended Fmt Field Supported bit is Clear, processing of Received TLPs that have Fmt[2] Set is undefined. 36 

• In Non-Flit Mode, all Received TLPs with Fmt[2] Clear and that use undefined Type field values are Malformed TLPs. 

◦ This is a reported error associated with the Receiving Port (see § Section 6.2 ). 

• All Received Malformed TLPs must be discarded. 

◦ Received Malformed TLPs that are ambiguous with respect to which buffer to release or are mapped to an uninitialized or disabled Virtual Channel must be discarded without updating Receiver Flow Control information. 

◦ All other Received Malformed TLPs must be discarded, optionally not updating Receiver Flow Control information. 

• Otherwise, update Receiver Flow Control tracking information (see § Section 2.6 ). 

• If the value in the Type field indicates the TLP is a Request, handle according to Request Handling Rules, otherwise the TLP is a Completion so handle according to Completion Handling Rules (see § Section 2.3.2 ). 