---
title: PCIe TLP 字段解释
comments: false
---

# PCIe TLP 字段解释

本页用于承接 TLP 结构图中的字段跳转，按字段说明其用途和常见注意点。

## Fmt {#fmt}

Fmt 字段描述 Header 长度和 TLP 是否带 Data Payload。例如 Memory Request 可以使用 3DW 或 4DW Header，Write 类请求通常带 Payload，Read 类请求通常不带 Payload。

## Type {#type}

Type 字段与 Fmt 一起决定 TLP 的实际类型，例如 Memory Request、Configuration Request、Completion 或 Message。

## TC {#tc}

Traffic Class 用于区分不同流量类别，便于系统根据 QoS 或虚通道策略进行调度。

## Attr {#attr}

Attr 字段承载事务属性，例如 Relaxed Ordering、No Snoop 等。字段的具体含义会随 PCIe 版本和 TLP 类型扩展。

## TH {#th}

TH 表示 TLP Processing Hints 相关控制位。没有启用对应机制时通常保持默认值。

## TD {#td}

TD 置位表示 TLP 尾部带有 Digest，即 ECRC。接收方需要按规则校验 Digest。

## EP {#ep}

EP 表示 Poisoned TLP。该标志用于提示数据可能无效或发生错误，软件和硬件需要按错误处理策略响应。

## Length {#length}

Length 表示 Payload 长度，单位通常为 DW。对于不带 Payload 的请求或 Completion，Length 的使用需结合 TLP 类型判断。

## Requester ID {#requester-id}

Requester ID 标识发起请求的 Bus、Device、Function。Completion 会带回该字段以便路由并匹配原始请求。

## Tag {#tag}

Tag 由请求方分配，用于把返回的 Completion 与未完成请求关联起来。

## First BE {#first-be}

First Byte Enable 描述第一个 DW 中哪些字节有效。它与地址低位共同确定实际访问的起始字节。

## Last BE {#last-be}

Last Byte Enable 描述最后一个 DW 中哪些字节有效。单 DW 访问时需要结合 First BE 一起判断。

## Address {#address}

Address 字段描述 Memory Request 的目标地址。3DW Header 承载 32-bit 地址，4DW Header 承载 64-bit 地址；低位通常由对齐和 Byte Enable 规则表达。

## Reserved {#reserved}

Reserved 位应按规范要求写入固定值，接收方通常不应依赖这些位表达语义。

## Payload {#payload}

Payload 是 TLP 可选的数据部分。Memory Write、Completion with Data、Configuration Write 等类型会携带数据。

## Completer ID {#completer-id}

Completer ID 标识产生 Completion 或被配置访问的目标 Function。

## Completion Status {#completion-status}

Completion Status 表示请求完成结果，例如成功完成、Unsupported Request、Configuration Request Retry Status 或 Completer Abort。

## BCM {#bcm}

BCM 是 Byte Count Modified 标志，主要用于特定桥接场景。

## Byte Count {#byte-count}

Byte Count 表示本 Completion 以及后续 Completion 中还会返回的字节数量，用于拆分返回时的边界判断。

## Lower Address {#lower-address}

Lower Address 表示 Completion Data 中第一个有效字节对应的低地址位。

## Register Number {#register-number}

Register Number 表示配置空间中的 DW 偏移，用于定位目标配置寄存器。

## Extended Register Number {#extended-register}

Extended Register Number 扩展配置空间访问的寄存器编号范围，使请求可以覆盖更大的配置空间。
