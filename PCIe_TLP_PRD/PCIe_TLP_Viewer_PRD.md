# PCIe_TLP_Viewer_PRD

# PCIe TLP Packet Format Viewer — Product Requirements Document

**版本:** v1.0

**日期:** 2026-05-25

**状态:** Draft — Pending Review

**参考规范:** PCI Express Base Specification Rev. 5.0 / 6.0

---

## 1. 背景与动机

PCIe TLP（Transaction Layer Packet）格式复杂，涵盖 Memory、I/O、Config、Message、Completion、AtomicOp 及 TLP Prefix 等多个大类，每个大类内部又因地址宽度、路由方式等存在多种变体。开发人员在调试 PCIe 抓包、编写 FPGA RTL 或分析协议行为时，频繁需要查阅各类 TLP 的字段布局与 bit 位置。

现有参考方式（PDF 规范）存在以下问题：
- 查阅路径长，定位某个字段需多次翻页
- 不同类型对比需同时打开多处表格
- 无法快速获取某字段的精确 bit 位置
- 在移动端或双屏环境下不便使用

本页面拟在现有 VitePress 文档站点中新增一个独立的交互式工具页，提供所有 TLP 类型的字段可视化查阅能力。

---

## 2. 目标

| # | 目标 |
| --- | --- |
| G1 | 覆盖 PCIe 5.0/6.0 规范中定义的全部 TLP 类型 |
| G2 | 以 DW 为单位逐行渲染字段布局，精确反映 byte 与 bit 顺序 |
| G3 | 鼠标悬停时展示字段的精确 bit 位置（累积 bit 编号） |
| G4 | 按字段语义分类配色，便于视觉扫描与类型对比 |
| G5 | 类型间切换流畅，支持变体（地址宽度、路由子类型）的快速选择 |
| G6 | 与 VitePress 主题（深色/浅色）兼容，无需额外依赖 |

## 3. 非目标

- 不提供 TLP 内容的实时解析或抓包导入功能
- 不生成可仿真的 TLP 字节流
- 不涵盖 PHY/Data Link Layer 的封装格式（LCRC、DLLP 等）
- 不涵盖 FLIT 模式下的 Compressed Header 格式（PCIe 6.0 特有）
- 不支持移动端横屏以外的小屏幕优化（最低支持宽度 768px）

---

## 4. 用户故事

| ID | 角色 | 场景 | 期望结果 |
| --- | --- | --- | --- |
| US-01 | FPGA 工程师 | 编写 MWr64 TLP 生成逻辑时，需要确认 Address 字段跨哪些 DW 以及具体 bit 范围 | 打开页面选择 MWr → 切换 64-bit 子标签 → 悬停 Address 字段，tooltip 显示 `[95:64]` (DW2) 和 `[127:96]` (DW3) |
| US-02 | 验证工程师 | 分析 CplD 时需要快速对比 Cpl 与 CplD 的 Header 差异 | 切换 Cpl/CplD 两个按钮，观察 DW 行数与字段变化，Data Payload 行在 CplD 中出现 |
| US-03 | 驱动开发者 | 调试 AtomicOp 时忘记 CAS64 Operand 的字段顺序 | 点击 CAS64 按钮，查看 DW3～DW5 的 Swap/Compare Value 布局 |
| US-04 | 协议分析师 | 学习 PCIe 6.0 TLP Prefix 格式 | 点击 Prefix 分组，选择 E2EPrefix（PASID），查看各字段含义 |
| US-05 | 任意用户 | 希望在白天/黑夜两种主题下都能清晰阅读 | 配色方案跟随 VitePress 深色/浅色主题自动适配 |

---

## 5. TLP 类型覆盖范围

覆盖所有的TLP 类型，具体类型和字段见  TLP_Field_Bit_Mapping.md

### 6. 功能需求

---

### 6.1 TLP 类型导航

**FR-NAV-01:** 导航栏固定在页面顶部（sticky），分组按钮水平排列，每个分组下方可展开该组所有类型的子按钮。

**FR-NAV-02:** 当前激活的类型按钮有高亮样式（实心背景），其所属分组按钮也同步高亮（带下划线或加粗）。

**FR-NAV-03:** 对于存在变体的类型（32/64-bit 地址、Msg 路由子类），在 DW 显示区顶部提供 **Variant Tab Bar**，切换时立即更新 DW 显示，不触发页面跳转。

**FR-NAV-04:** 类型切换时，页面滚动至 DW 显示区顶部（若导航栏在 DW 显示区上方则不额外滚动）。

**FR-NAV-05:** 当前选中的类型与变体组合应在 URL hash 中记录（如 `#mwr64`），支持直接链接共享与浏览器回退。

### 6.2 DW 网格显示引擎

**FR-DW-01:** 每行显示一个完整 DW（32 bits = 4 bytes），每个 DW 行左侧显示行号标签（DW0、DW1……），格式为固定宽度灰色文本。

**FR-DW-02:** Byte 从左至右按 Byte 0 → Byte 1 → Byte 2 → Byte 3 排列（低 Byte 在左）；每个 Byte 内从左至右按 Bit 7 → Bit 6 → … → Bit 0 排列（MSB 在左）。

**FR-DW-03:** 字段单元格宽度与其占用的 bit 数严格成比例，以单 bit 为最小单位，整行总宽度等于 32 个 bit 单位。

**FR-DW-04:** 跨 Byte 但不跨 DW 的字段（如 Length[9:0]）渲染为一个横向连续单元格。

**FR-DW-05:** 跨 DW 的字段（如 64-bit Address 的高低 32 位分别在 DW2/DW3）在不同 DW 行中分别显示为独立单元格，字段名加后缀标注（如 `Addr[63:32]` / `Addr[31:2]`）。

**FR-DW-06:** Data Payload 用一行特殊行表示，标注 `Data Payload (N DW)`，不绘制 bit 级字段（Length 决定实际大小），背景使用数据字段色。

**FR-DW-07:** DW 行顶部需绘制 bit 位置刻度尺，标注每个 byte 边界处的 bit 序号（在当前 DW 内的位置，0~31），以及每 byte 的 MSB（7、15、23、31）和 LSB（0、8、16、24）。

### 6.3 Bit 位置 Tooltip

**FR-TIP-01:** 鼠标悬停在任意字段单元格上时，在光标附近显示 Tooltip，内容包含：
- 字段全称（Full Name）
- 累积 bit 范围，格式为 `[H:L]`（若单 bit 则为 `[N]`）
- 单行简短说明（来自预定义字段描述，见 §7）
- 字段所属语义分类（见 §8.3）

**FR-TIP-02:** 累积 bit 编号规则：
`cumulative_bit(byte_index, bit_within_byte) = byte_index × 8 + bit_within_byte`
其中 `byte_index` 从 DW0 的 Byte 0 起跨全 Header 线性递增（Byte 0 = index 0，DW1 Byte 0 = index 4，以此类推）；`bit_within_byte` 为该 bit 在 byte 内的权重（MSB = 7，LSB = 0）。

**FR-TIP-03:** Tooltip 在字段边界内时不超出视口，靠近页面边缘时自动反向弹出。

**FR-TIP-04:** 移动端（touch 设备）通过点击触发 Tooltip，再次点击其他区域收起。

### 6.4 配色系统

**FR-COLOR-02:** 颜色值通过 CSS 变量定义，在 VitePress 的 `.dark` class 下切换深色值，不依赖 JavaScript 进行主题切换。

**FR-COLOR-03:** 字段名文字颜色在所有背景上保持可读性；Reserved 字段文字使用灰色斜体，其余字段使用正常字重。

### 6.5 Reserved 字段处理

**FR-RSVD-01:** Reserved 字段（标注为 `R` 或 `Rsvd`）显示为灰色单元格，标签文字为 `R`，宽度与实际 bit 数相符。

**FR-RSVD-02:** Reserved 字段的 Tooltip 显示 `Reserved — must be 0`，不展示额外描述。

**FR-RSVD-03:** 单 bit Reserved 字段若宽度过窄（< 8px），仍显示 `R` 但字体缩小或省略文字，Tooltip 保留。

### 6.6 Variant 子标签

**FR-VAR-01:** 以下 TLP 类型需要 Variant Tab Bar：

| TLP 类型 | Variant 维度 | 子标签 |
| --- | --- | --- |
| MRd / MWr / MRdLk | 地址宽度 | `32-bit` / `64-bit` |
| FetchAdd / Swap / CAS | 操作数宽度 | `32-bit` / `64-bit` |
| Msg / MsgD | 路由方式 | `Addr` / `ID` / `Broadcast` / `Local` / `Gather→RC` / `Local(Alt)` |
| LocalPrefix / E2EPrefix | Sub-type | `Vendor-Defined` / `PASID` / `TPH` / `Vendor(E2E)` 等 |

**FR-VAR-02:** Variant Tab Bar 位于 DW 显示区正上方，选中状态用实心下划线标示。

**FR-VAR-03:** 切换 Variant 时，仅更新 DW 显示区内容，导航栏状态不变。

---

## 7. 字段定义规范

具体类型和字段见  TLP_Field_Bit_Mapping.md

---

## 8. UI/UX 规格

### 8.1 整体布局

```
┌─────────────────────────────────────────────────────────┐
│  [页面标题: PCIe TLP Format Reference]                    │
│  spec: PCIe 5.0/6.0  ·  rev: Base Spec Table 2-x       ⨀ 用于开关tooltip的按钮 ⨀ 用于切换flit mode/non-flit mode按钮│
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────── 导航栏（sticky）─────────────────┐ │
│  │ [Memory▾] [I/O▾] [Config▾] [Msg▾] [Cpl▾] [AtomOp▾] [Prefix▾] │
│  │   MRd32  MRd64  MRdLk32  MRdLk64  MWr32  MWr64     │ │
│  └──────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  当前类型：MWr64                                          │
│  Variant: [32-bit] [64-bit ●]                            │
│                                                           │
│  ┌ bit ruler ────────────────────────────────────────┐   │
│  │  7 6 5 4 3 2 1 0 | 7 6 5 4 3 2 1 0 | ...         │   │
│  ├ DW0 ──────────────────────────────────────────────┤   │
│  │ Fmt │    Type    │T9│ TC  │T8│At│LN│TH│TD│EP│At│AT│ Len │
│  ├ DW1 ──────────────────────────────────────────────┤   │
│  │      Requester ID      │    Tag    │ LastBE │ 1stBE│
│  ├ DW2 ──────────────────────────────────────────────┤   │
│  │                  Address [63:32]                   │   │
│  ├ DW3 ──────────────────────────────────────────────┤   │
│  │             Address [31:2]            │  R  │  PH │   │
│  ├ Data ─────────────────────────────────────────────┤   │
│  │              Data Payload (Length DW)              │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 8.2 导航栏规格

- 高度：48px，背景与 VitePress 导航栏相同（`var(--vp-nav-bg-color)`）
- 分组按钮：有下拉箭头（▾），点击切换展开状态，当前分组激活时箭头朝上
- 子按钮：展开后排列在分组按钮下方，高度 36px，font-size 13px，等宽或自适应
- 激活态：`background: var(--vp-c-brand-1)`, `color: white`
- 悬停态：`background: var(--vp-c-default-soft)`

### 8.3 DW 网格组件规格

- **DW 标签列**：宽度固定 48px，右对齐，font: monospace, 12px, color: `var(--vp-c-text-2)`
- **bit ruler 行**：高度 20px，在 DW 网格上方；每个 byte 边界处标注 bit 序号（0、8、16、24 标在对应 byte 的 LSB 侧，7、15、23、31 标在 MSB 侧）
- **字段单元格**：
    - 高度：40px
    - border-radius：4px，相邻字段间 gap：2px
    - 字段名：font-size 11px，overflow: hidden，text-overflow: ellipsis，white-space: nowrap，居中对齐
    - 宽度：`(field_bit_width / 32) * (grid_total_width)px`，最小宽度不限（允许文字溢出被截断）
- **跨 byte 字段**：宽度正确延伸，不插入额外 border
- **Reserved 字段**：font-style: italic，text: `R`

### 8.4 Tooltip 规格

```
┌─────────────────────────────────┐
│ Length                    [size]│  ← 字段名 + 分类 badge
├─────────────────────────────────┤
│ Bits: [17:16, 31:24]            │  ← 累积 bit 范围
│ Width: 10 bits                  │  ← 字段宽度
├─────────────────────────────────┤
│ Payload length in DW units.     │  ← 简短描述（≤2行）
│ 0 encodes as 1024 DW.           │
└─────────────────────────────────┘
```

- 出现延迟：80ms（避免快速划过时闪烁）
- 消失延迟：100ms
- 最大宽度：240px
- z-index：1000
- 背景：`var(--vp-c-bg-elv)`，border：`1px solid var(--vp-c-divider)`，box-shadow：标准阴影

### 8.5 响应式行为

| 视口宽度 | 行为 |
| --- | --- |
| ≥1200px | 全功能布局，Tooltip 正常显示 |
| 768~1199px | 导航栏按钮换行或水平滚动，DW 网格横向滚动 |
| <768px | 不强制支持，可提示”建议横屏或使用桌面端查看” |

---

## 9. VitePress 集成规格

### 9.1 页面文件结构

```
docs/
├── tlp-viewer/
│   └── index.md          ← VitePress 页面入口（layout: page）
├── .vitepress/
│   └── components/
│       ├── TlpViewer.vue       ← 主容器组件
│       ├── DwGrid.vue          ← DW 网格渲染组件
│       ├── FieldCell.vue       ← 单个字段单元格
│       ├── Tooltip.vue         ← Tooltip 组件
│       └── tlpData/
│           ├── index.ts        ← 导出所有 TLP 定义
│           ├── memory.ts
│           ├── io.ts
│           ├── config.ts
│           ├── message.ts
│           ├── completion.ts
│           ├── atomicop.ts
│           └── prefix.ts
```

### 9.2 数据模型（TypeScript）

```tsx
// 单个字段描述
interface TlpField {
  name: string;           // 显示名，如 "Fmt", "Length"
  fullName: string;       // 全称，用于 Tooltip
  category: FieldCategory; // 颜色分类
  // 在单个 DW 内的 bit 范围（以 byte 为单位表达）
  // 支持多段（跨 byte 但在同一 DW 内）
  segments: Array<{
    byteIndex: number;    // 在 Header 中的 byte 绝对偏移
    msb: number;          // bit-in-byte, 7~0
    lsb: number;          // bit-in-byte, 7~0
  }>;
  description: string;    // Tooltip 描述文字
  reserved?: boolean;     // 是否为 Reserved 字段
}

type FieldCategory = 'ctrl' | 'id' | 'addr' | 'size' | 'status' | 'data' | 'prefix' | 'rsvd';

// 单个 DW 行定义
interface DwRow {
  label: string;    // "DW0", "DW1", "Data"
  isData?: boolean; // true = 数据载荷行，不渲染 bit 级字段
  fields: TlpField[];
}

// TLP 类型定义
interface TlpDefinition {
  id: string;             // 唯一 ID，如 "mwr64"
  label: string;          // 按钮显示名
  group: TlpGroup;        // 所属分组
  variants?: TlpVariant[];// 变体列表（无则不显示 variant bar）
  dws: DwRow[];           // DW 行列表
}

type TlpGroup = 'memory' | 'io' | 'config' | 'message' | 'completion' | 'atomicop' | 'prefix';

interface TlpVariant {
  id: string;
  label: string;
  dws: DwRow[];           // 该变体的完整 DW 定义
}
```

### 9.3 页面注册

在 `docs/.vitepress/config.ts` 的 `nav` 或 `sidebar` 中添加导航入口；`index.md` 使用 frontmatter `layout: page` 关闭默认文档布局，由组件全权控制渲染：

```yaml
---
layout: page
title: PCIe TLP Format Reference
---
```

### 9.4 样式策略

- 所有颜色使用 VitePress CSS 变量 + 自定义 CSS 变量，**不引入 Tailwind 或任何额外 CSS 框架**
- 字段颜色 CSS 变量定义在 `docs/.vitepress/theme/custom.css` 中，通过 `.dark` 选择器切换深色值
- 组件使用 `<style scoped>`，避免污染全局样式

---

## 10. 验收标准

| ID | 验收条件 |
| --- | --- |
| AC-01 | 全部 26 个 TLP 类型（含变体）可通过导航选中并正确渲染 DW 网格 |
| AC-02 | MRd32 的 DW0 字段布局与 §7.1 表格中的 bit 位置完全一致 |
| AC-03 | 悬停 Length 字段显示 `Bits: [17:16, 31:24]` 且描述正确 |
| AC-04 | 切换 MWr32 → MWr64 时 DW2/DW3 内容从 32-bit Address 变为 64-bit 上下半段 |
| AC-05 | Reserved 字段渲染为灰色 `R` 单元格，Tooltip 显示 `Reserved — must be 0` |
| AC-06 | 深色主题下所有字段单元格文字对比度 ≥ 4.5:1 |
| AC-07 | URL hash 正确记录当前类型（如 `#cpl-cplstatus` 不要求，至少 `#cpl` 级别） |
| AC-08 | 视口宽度 768px 下页面可水平滚动，导航栏不遮挡内容 |
| AC-09 | 页面在 VitePress build（`vitepress build`）后无 SSR 报错 |
| AC-10 | 不引入任何第三方运行时依赖（纯 Vue 3 + 原生 CSS） |

---