# 组件规范与验收标准（PetCare）

## 1) 设计令牌
### 色彩
- `brand.bg`: `#f6f8fc`
- `brand.surface`: `#ffffff`
- `brand.text`: `#111827`
- `brand.muted`: `#6b7280`
- `brand.border`: `#e5e7eb`
- `brand.primary`: `#2563eb`
- `brand.primaryHover`: `#1d4ed8`
- `brand.success`: `#16a34a`
- `brand.warning`: `#d97706`
- `brand.danger`: `#dc2626`
- `brand.focus`: `#93c5fd`

### 间距比例尺
`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48(px)`

### 字体比例尺
`12 / 14 / 16 / 20 / 28 / 34(px)`

### 字体搭配（3套）
1. Inter + Noto Sans SC
2. System UI + PingFang SC
3. IBM Plex Sans + Source Han Sans SC

## 2) 组件清单
- 基础组件：`Button`、`Input`、`Card`
- 业务组件：`StatusBanner`、`MetricCard`
- 布局组件：`AppShell`

## 3) 状态矩阵

### Button
| 状态 | 视觉 | 交互 | 验收 |
|---|---|---|---|
| default | 主色或描边 | 可点击 | Tab 可聚焦 |
| hover | 颜色加深 | 悬停反馈 | 对比度>=4.5 |
| focus | ring + offset | 键盘触发 | focus-visible 可见 |
| active | 按压反馈 | click | 文本可读 |
| disabled | 透明度降低 | 禁止点击 | `disabled` 生效 |
| loading | 禁用并提示处理中 | 防重复提交 | `aria-busy=true` |
| error | danger 语义色 | 支持重试 | 错误信息可读 |

### Input
| 状态 | 视觉 | 交互 | 验收 |
|---|---|---|---|
| default | 中性边框 | 可输入 | label 存在 |
| hover | 边框增强 | 悬停反馈 | 对比度达标 |
| focus | ring + 强化边框 | 键盘输入 | focus-visible 可见 |
| disabled | 灰底 | 不可编辑 | `disabled` 生效 |
| readonly | 中性样式 | 可复制不可改 | `readonly` 生效 |
| error | 红边 + 错误文案 | 引导修正 | `aria-invalid=true` |
| success | 绿色提示 | 输入通过 | 提示文案可读 |

### StatusBanner
| 状态 | 色彩 | 场景 | 验收 |
|---|---|---|---|
| default | 中性 | 正常提示 | `role=status` |
| loading | 蓝色 | 数据同步 | `aria-live=polite` |
| empty | 绿色 | 无数据 | 空状态文案明确 |
| error | 红色 | 异常告警 | 错误可恢复 |

## 4) 页面级原型范围
- `/login`：登录页（账号、密码、登录按钮、找回入口）
- `/user`：用户端（提醒列表、快捷操作）
- `/vet`：兽医端（接诊队列、开始接诊）
- `/cms`：CMS（稿件审核、发布设置、SEO）
- `/dashboard`：运营总览（指标卡与关键路径）

## 5) 验收标准
### 功能
1. 以上路由均可访问
2. 侧边导航切换正确并显示 active 态
3. 页面覆盖 loading/empty/error 至少一种状态

### 组件
1. `Button/Input/Card` 被复用，避免重复样式实现
2. `StatusBanner` 支持四态：default/loading/empty/error
3. 关键按钮支持键盘操作

### 无障碍（WCAG AA 基线）
1. 提供 Skip Link 并可键盘访问
2. 焦点样式清晰（focus-visible）
3. 对比度满足 AA（普通文本>=4.5:1）
4. 表单项具备可读 label

### 构建
1. `npm run build` 通过
2. 产物生成在 `dist/`
3. 无 TypeScript 编译错误
