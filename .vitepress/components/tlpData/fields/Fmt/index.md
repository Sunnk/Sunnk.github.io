---
description: TLP 的格式字段，决定头部长度和是否携带数据。
---

## Non-Flit Mode

`Fmt` 是 Non-Flit Mode TLP byte 0 的高 3 bit，即 `Fmt[2:0]`，位置为 byte 0 bits `[7:5]`。它用来判断当前 TLP 的基本头格式，以及 TLP 是否包含 data payload 或 TLP Prefix。

`Fmt` 与 `Type` 一起提供解析 TLP Header 所需的关键信息。两者共同决定剩余 TLP Header 的大小，并判断 header 后是否跟随 data payload。进一步地，`Fmt`、`Type`、`TD` 和 `Length` 字段共同提供确定 TLP 非 prefix 部分整体大小所需的信息。

### Fmt[2:0] 编码

| Fmt[2:0] | 含义 |
| --- | --- |
| `000b` | 3 DW header, no data |
| `001b` | 4 DW header, no data |
| `010b` | 3 DW header, with data |
| `011b` | 4 DW header, with data |
| `100b` | TLP Prefix |

未列出的 `Fmt` 编码均为 Reserved。对于 Memory Request，3 DW header 通常对应 32-bit address 格式，4 DW header 通常对应 64-bit address 格式；是否携带 data 则区分 Read/Write、Message/Message with Data 等具体 TLP 形态。

当 `Fmt[2:0] = 100b` 时，表示该 DW 是 TLP Prefix。此时 `Type[4]` 用于进一步区分 Local TLP Prefix 和 End-End TLP Prefix：`Type[4] = 0b` 表示 Local TLP Prefix，`Type[4] = 1b` 表示 End-End TLP Prefix。

## Flit Mode

Flit Mode 不再使用 `Fmt[2:0]` 字段。TLP 格式信息完全由 `Type[7:0]` 指示 Header Base 类型，并通过 `OHC[4:0]` 和 `TS[2:0]` 表达 Orthogonal Header Content 与 Trailer Size 等信息。
