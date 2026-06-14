# LUMIÈRE 商城 — 第四次作业报告

## 一、项目概述

**项目名称**：LUMIÈRE 极简生活美学商城  
**技术栈**：React 19 + Vite 6 + React Router 7 + Zustand + Tailwind CSS v4 + antd-mobile（前台）+ antd（后台）+ Mock.js  
**仓库**：Gerrit `LW-02-11`  
**演示账号**：
- 前台商城：`user` / `123456`（支付密码同为 `123456`）
- 后台管理：`admin` / `admin123`

本项目为单仓库双端应用：前台为移动端 H5 商城（`max-w-lg` 居中），后台为 PC 管理端。开发环境通过 Mock.js 拦截 Axios 请求，关键业务数据（购物车、登录态、订单、收藏等）持久化至 `localStorage`，实现前后台数据联动。

## 二、功能实现对照

### 2.1 前台功能

| 模块 | 路由 | 实现说明 |
|------|------|----------|
| 商城首页 | `/` | 搜索框、轮播图、分类入口、商品瀑布流 |
| 分类页 | `/category` | 左侧分类栏 + 子分类 + 商品列表 |
| 购物车 | `/cart` | 数量修改、删除、全选、结算 |
| 我的 | `/my` | 用户信息、订单入口、收藏/足迹、猜你喜欢、评价 |
| 商品详情 | `/product/:id` | SKU、加购、立即购买 |
| 创建订单 | `/checkout` | 地址选择、商品清单、支付方式 |
| 支付 | 结算弹窗 + `/pay/success/:id` | 15 分钟倒计时、模拟二维码、支付密码校验 |
| 订单详情 | `/orders/:id` | 订单状态、商品信息、物流轨迹、确认收货与评价 |

**购买链路**：购物车 → 结算 → 支付 → 支付成功 → 我的订单 → 确认收货 → 评价，全流程已打通。

### 2.2 后台功能

| 模块 | 路由 | 实现说明 |
|------|------|----------|
| 登录鉴权 | `/login`（统一入口） | 管理员账号登录后跳转 `/admin` |
| 权限管理 | 各模块路由 | 基于角色的模块访问控制（商品/店铺/订单/用户） |
| 商品管理 | `/admin/products` | 增删改查、上下架、表单校验 |
| 店铺管理 | `/admin/shops` | 店铺 CRUD |
| 订单管理 | `/admin/orders` | 列表、状态修改、发货 |
| 用户管理 | `/admin/users` | 用户列表与角色分配 |

> 说明：作业要求「独立后台登录页」，本项目采用统一登录页 `/login`，管理员使用 `admin` 账号登录后自动进入后台，可在答辩时演示并说明设计理由（单点登录、减少重复页面）。

### 2.3 通用功能

- **用户登录/注册**：`/login`、`/register`，未登录无法访问商城核心页面（`MallAuthGuard`）
- **数据联动**：Mock API + localStorage 持久化，前后台共享商品、订单、用户等数据

## 三、加分项说明

### 3.1 Mock / 后端联动（已实现）

使用 Mock.js 在 `src/mock/index.js` 中统一注册 REST 风格接口，Axios 请求在开发环境被拦截并读写 localStorage 种子数据，模拟真实后端 CRUD 与鉴权。

### 3.2 数据持久化（已实现）

以下状态在刷新页面后仍保留：
- 用户登录 Token（`mall-token` / `admin-token`）
- 购物车（`useCartStore` persist）
- 订单列表（`useOrderStore`）
- 收货地址、收藏、足迹、评价等（各 Zustand persist store）

**演示方式**：登录后加购商品 → 刷新页面 → 购物车与登录态仍在。

### 3.3 表单验证（已实现）

| 场景 | 位置 | 规则 |
|------|------|------|
| 注册/登录 | `src/mall/pages/Auth` | 用户名 3–20 位、密码含字母+数字 |
| 收货地址 | 结算页 / 地址页 | 姓名、手机号、地区、详细地址 |
| 后台表单 | 商品/用户/店铺管理 | antd Form rules + 必填校验 |

答辩时可截图表单错误提示作为佐证。

### 3.4 分页（已实现）

后台商品、订单、用户、店铺列表均使用 antd `Table`，`pageSize: 10`，支持翻页。

### 3.5 支付体验优化（已实现）

结算页支付弹窗包含：
- **15 分钟支付倒计时**（`usePayCountdown`），超时后禁止支付并提示重新下单
- **模拟支付二维码**（`PayQrMock`），按微信/支付宝展示不同样式
- **6 位支付密码**校验（测试密码 `123456`）

### 3.6 响应式布局（已实现）

- **前台商城**：移动端优先，`max-w-lg` 居中，适配手机浏览器
- **后台管理**：PC 宽屏布局，antd 表格与侧栏导航

可在报告中说明为「Mobile Mall + PC Admin」双端响应策略。

### 3.7 性能优化（已实现）

- **路由懒加载**：`src/router/lazyRoute.jsx` + `React.lazy`，各页面按需加载，配合 `PageSkeleton` 骨架屏
- **React.memo**：列表卡片组件（如 `GuessProductCard`）避免无效重渲染
- **useCallback**：部分交互密集组件中已使用

### 3.8 单元测试（已实现）

使用 Vitest 对核心工具函数编写测试：
- `validatePassword` / `validatePhone`（`src/mall/constants/validation.js`）
- `formatPayCountdown`（支付倒计时格式化）

运行：`npm test`

### 3.9 部署上线（可选）

项目已添加 `vercel.json` 支持 SPA 路由。部署步骤：

```bash
npm run build
# 将 dist 目录部署至 Vercel / Netlify
# 或使用 Vercel CLI: vercel --prod
```

部署后在报告或 metadata 中补充线上访问链接。

## 四、目录结构

```
src/
├── mall/          # 前台商城（pages / components / store / hooks）
├── admin/         # 后台管理
├── mock/          # Mock 数据与 API
├── router/        # 路由（含 lazyRoute 懒加载）
├── utils/         # api.js、request.js
├── App.jsx
└── main.jsx
tool/
├── check.cjs      # 提交前自检
└── pack.cjs       # 打包 zip
metadata.json      # 组员信息（提交前必填）
Report.md          # 本报告
```

## 五、本地运行

```bash
npm install
npm run dev      # 开发 http://localhost:5173
npm run build    # 生产构建
npm test         # 单元测试
node tool/check.cjs   # 提交自检
node tool/pack.cjs    # 生成提交 zip
```

## 六、小组分工（请按实际情况修改）

| 成员 | 主要负责模块 |
|------|--------------|
| 组长 | 路由架构、Mock、提交打包 |
| 组员 A | 前台首页、分类、商品详情 |
| 组员 B | 购物车、订单、支付流程 |
| 组员 C | 我的页面、用户中心 |
| 组员 D | 后台管理、权限 |

## 七、答辩演示建议

1. 前台完整购物流程（含支付倒计时与二维码）
2. 刷新页面验证数据持久化
3. 后台改商品/发货，前台订单状态同步
4. 展示表单校验错误提示截图
5. 说明路由懒加载与单元测试命令输出

---

**提交前请务必**：在 `metadata.json` 中填写真实姓名、学号及全部组员信息，并运行 `node tool/check.cjs` 确保通过。
