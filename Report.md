# 第四次作业报告

**姓名：** 曹棪  
**学号：** 23301002  
**作业名称：** React 商城系统（LUMIÈRE 极简生活美学商城）

---

## 1. 组员分工

| 姓名 | 学号 | 分工与产出 | 贡献占比 |
|------|------|-----------|---------|
| 曹棪（组长） | 23301002 | 整体架构设计与核心逻辑把控：Vite + React 19 工程搭建、React Router 路由规划、Zustand 全局状态设计、交易闭环与用户体系：商品详情页与 SKU 选购弹窗、购物车增删改查与结算，登录/注册与路由守卫、支付链路状态机（待支付/已支付/取消恢复购物车）、商品/分类/店铺/订单/用户 CRUD、PermissionGuard 权限控制、Vercel 部署与 GitHub 推送、项目集成联调与代码审查 | 30% |
| 鲍政多 | —— | 前台 UI 与交互体验：沉浸式首页、多级分类索引、高性能搜索页、首页金刚区与轮播、Tailwind CSS 视觉规范、移动端适配与组件动效 | 17.5% |
| 李依明 | —— | 收藏/足迹、创建订单流程、「我的」页登录/未登录条件渲染、订单列表与评价 | 17.5% |
| 黄光景 | —— | 后台管理系统：PC 端 AdminLayout、独立后台登录页 `/admin/login`、后台 Table 分页与表单校验 | 17.5% |
| 张韶卿 | —— | Mock 数据服务与私域交互：Mock.js 全站 50+ REST 接口定义、种子数据与 localStorage 持久化、200+ 商品静态素材库、店铺在线客服聊天、Vitest 测试与文档 | 17.5% |

**分工说明：** 除编码外，各成员参与答辩 PPT 制作、功能测试与 Report 撰写，非编码工作已计入贡献占比。  
**说明：** 组员学号请在提交前于 `metadata.json` 中补全。

---

## 2. 项目结构

本项目采用 **单仓库双端** 结构，前台商城与后台管理按业务域拆分，而非模板中的扁平 `pages/` 目录，便于协作与维护。

```
App（根组件，根据路径切换 antd-mobile / antd 主题，渲染 <Outlet />）
├── 前台商城 src/mall/
│   ├── pages/          Home、Category、Cart、My、ProductDetail、CreateOrder、Orders…
│   ├── components/     ProductCard、MallTabBar、PayOrderPopup、SkuPickerPopup…
│   ├── store/          useCartStore、useOrderStore、useMallUserStore…
│   └── hooks/          useAuthHydration、usePayCountdown…
├── 后台管理 src/admin/
│   ├── pages/          Product、Category、Shop、Order、User、Login
│   └── components/     AdminLayout、AuthGuard、PermissionGuard
├── 路由 src/router/    index.jsx + lazyRoute.jsx（懒加载）
├── 工具 src/utils/     api.js、request.js、auth.js
├── Mock  src/mock/     index.js、seedData.js、productImages.js
└── main.jsx            入口，import '@/mock' 启用 Mock 拦截
```

各页面/组件职责说明：

| 页面/组件 | 职责 |
|-----------|------|
| App | 根布局；根据 `/admin` 路径切换移动端/PC 端 UI 配置 |
| Home（`/`） | 搜索框、轮播图、金刚区、限时秒杀、商品瀑布流 |
| Auth（`/login`、`/register`） | 用户登录/注册，支持 redirect 回跳 |
| Category（`/category`） | 左侧一级分类 + 右侧子分类与商品列表 |
| ProductDetail（`/product/:id`） | 商品图集、SKU 选择、加购/立即购买（未登录拦截） |
| Cart（`/cart`） | 购物车列表、数量修改、删除、全选、跳转结算 |
| CreateOrder（`/checkout`） | 确认地址、商品清单、支付方式，唤起支付弹窗 |
| PayOrderPopup / PaySuccess | 扫码/密码支付模拟、15 分钟倒计时、支付成功页 |
| Orders / OrderDetail | 订单列表筛选、详情、物流、确认收货、评价 |
| My（`/my`） | 个人信息、订单入口、收藏/足迹/猜你喜欢；未登录展示引导 UI |
| AdminLayout + 各管理页 | 后台侧栏导航、商品/分类/店铺/订单/用户 CRUD |

---

## 3. 前台功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 商城主页面（搜索框/轮播图/热门商品） | `Home` 页组合 `GlassSearchNav`、`HomeSwiper`、`NavGrid`、`FlashSale`、`ProductWaterfall`；数据来自 Mock 接口 `getHomeBanners`、`getProducts` |
| 商品详情页 | `ProductDetail` + `SkuPickerPopup` 多规格选购；`DetailBottomBar` 触发加购/购买；未登录时 Toast 提示并跳转 `/login?redirect=…` |
| 购物车 | `useCartStore`（Zustand persist）管理条目；`Cart` 页支持改数量、删除、全选、结算；下单待支付时移除已选商品，取消支付后恢复 |
| 创建订单 | `CreateOrder` 页选择收货地址（`useAddressStore`）、展示商品清单、调用 `createOrder` API 生成待支付订单 |
| 支付页面 | `PayOrderPopup` 双 Tab（扫码/密码）；`PayQrMock` 展示本地收款码；`usePayCountdown` 15 分钟倒计时；密码校验后调用 `payOrder` |
| 订单列表 | `Orders` 页按状态 Tab 筛选，数据来自 `useOrderStore` + Mock `/api/orders` |
| 订单详情 | `OrderDetail` 展示状态时间线、物流轨迹、商品信息；支持确认收货、评价、取消待支付订单 |
| 用户登录/注册 | `Auth` 页 antd-mobile Form 校验；`useMallUserStore` 持久化 token；登录成功后 `resolveAuthRedirect` 回跳原页面 |

**购买链路：** 浏览商品 → 加购 → 购物车 → 结算 → 支付 → 支付成功 → 我的订单 → 确认收货 → 评价，全流程已打通。

**先逛后买：** 首页、分类、商品详情、我的页为公用路由；购物车、结算、订单等受 `MallAuthGuard` 保护，需登录后访问。

---

## 4. 后台管理端功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 后台登录 | 独立页面 `/admin/login`（`AdminLoginPage`）；`AdminGuestGuard` 已登录则跳转后台；`AuthGuard` 保护所有 `/admin/*` 路由 |
| 权限管理 | `useAdminStore.hasPermission(permission)` + `PermissionGuard` 包裹各模块路由；管理员拥有 product/category/shop/order/user 权限，运营角色可限制为只读订单 |
| 商品管理 | `/admin/products`：antd Table 分页（pageSize 10）、新增/编辑 Modal、上下架、图片 URL 校验 |
| 分类管理 | `/admin/categories`：两级分类树 CRUD，与前台分类页、Mock 数据联动 |
| 订单管理 | `/admin/orders`：列表筛选、修改订单状态、发货操作；前台订单状态同步更新 |
| 店铺管理 | `/admin/shops`：店铺信息 CRUD，与前台店铺主页联动 |
| 用户管理 | `/admin/users`：用户列表、角色分配、增删改 |

> 作业要求「商品/分类/订单至少完成一项」——本项目 **三项均已完整实现**，并额外完成店铺与用户管理。

---

## 5. 路由设计

前台与后台路由在 `src/router/index.jsx` 中统一配置，使用 `createBrowserRouter`：

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // 游客页
      { path: 'login', element: <MallGuestGuard><AuthPage /></MallGuestGuard> },
      { path: 'register', element: <MallGuestGuard><AuthPage /></MallGuestGuard> },

      // 公用路由（先逛后买）
      { index: true, element: lazyRoute(() => import('@/mall/pages/Home')) },
      { path: 'category', element: lazyRoute(() => import('@/mall/pages/Category')) },
      { path: 'product/:id', element: lazyRoute(() => import('@/mall/pages/ProductDetail')) },
      { path: 'my', element: lazyRoute(() => import('@/mall/pages/My')) },
      // …搜索、店铺、活动专区等

      // 受保护路由
      {
        element: <MallAuthGuard><Outlet /></MallAuthGuard>,
        children: [
          { path: 'cart', element: lazyRoute(() => import('@/mall/pages/Cart')) },
          { path: 'checkout', element: lazyRoute(() => import('@/mall/pages/CreateOrder')) },
          { path: 'orders', element: lazyRoute(() => import('@/mall/pages/Orders')) },
          { path: 'orders/:id', element: lazyRoute(() => import('@/mall/pages/OrderDetail')) },
          // …地址、消息、支付成功、店铺客服
        ],
      },

      // 后台管理
      {
        path: 'admin',
        children: [
          { path: 'login', element: <AdminGuestGuard><AdminLoginPage /></AdminGuestGuard> },
          {
            element: <AuthGuard><Outlet /></AuthGuard>,
            children: [
              { path: 'products', element: <PermissionGuard permission="product">…</PermissionGuard> },
              { path: 'orders', element: <PermissionGuard permission="order">…</PermissionGuard> },
              // …categories、shops、users
            ],
          },
        ],
      },
    ],
  },
])
```

`vercel.json` 配置 SPA 重写，保证部署后深链接可正常访问。

---

## 6. 状态管理与数据存储

- **全局状态管理方式：** Zustand + persist 中间件  
  - 前台：`useMallUserStore`（登录态）、`useCartStore`（购物车）、`useOrderStore`（订单）、`useUserStore`（收藏/足迹/评价）、`useAddressStore`（地址）  
  - 后台：`useAdminStore`（管理员登录与权限）

- **数据存储方式：** Mock.js + localStorage 双层持久化  
  1. **Mock 层：** `src/mock/index.js` 用 `Mock.mock(/\/api\/…/)` 拦截 Axios 请求（baseURL `/api`），读写 `mock_products`、`mock_orders` 等 localStorage 键  
  2. **Store 层：** Zustand persist 将购物车、登录 token 等写入 sessionStorage / localStorage，刷新不丢失

- **前后台数据联动方式：** 后台修改商品/订单状态 → Mock 写入 localStorage → 前台下次请求同一 Mock 数据源 → 页面展示同步更新。例如后台发货后，前台订单详情物流状态即时变化。

**Mock 使用流程：**

```
页面 → src/utils/api.js → Axios(/api/xxx) → Mock.js 拦截 → 读写 localStorage → 返回 JSON
```

入口 `main.jsx` 中 `import '@/mock'` 在开发与 Vercel 生产环境均生效。

---

## 7. 加分项完成情况

- [√] **后端联动**：使用 Mock.js 模拟 52 个 REST 接口（登录、商品 CRUD、订单、购物车、店铺客服等），统一响应格式 `{ code, data, message }`
- [√] **数据持久化**：登录 token、购物车、订单、地址、收藏、足迹刷新后保留；Mock 种子数据版本号 `MOCK_DATA_VERSION` 自动迁移旧缓存
- [√] **表单验证**：登录/注册（用户名 3–20 位、密码含字母+数字）、收货地址（姓名/手机/地区）、后台商品表单 antd Form rules；错误信息 Toast/表单项提示
- [√] **分页/无限滚动**：后台商品/订单/用户/店铺 Table `pageSize: 10`；前台首页商品瀑布流 + 懒加载图片
- [√] **支付模拟优化**：15 分钟倒计时、本地收款二维码（`public/pay-qrcode.jpg`）、扫码/密码双方式、待支付可取消并恢复购物车
- [√] **响应式布局**：前台 H5 `max-w-lg` 居中 + 底部 TabBar；后台 PC 宽屏 antd Layout
- [√] **性能优化**：路由懒加载（`lazyRoute` + `React.lazy`）、`PageSkeleton` 骨架屏、`GuessProductCard` 等使用 `React.memo`、商品图本地托管避免外链失效
- [√] **单元测试**：Vitest 测试 `validation.js` 中密码/手机号规则；运行 `npm test`
- [√] **部署上线**：已部署 Vercel，GitHub 仓库 https://github.com/QICY520/js ，`vercel.json` SPA 路由重写
域名：js-liard-nine.vercel.app
**演示账号：**
- 前台：`user` / `123456`（支付密码 `123456`）
- 后台：`admin` / `admin123`

---

## 8. 遇到的问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| Vercel 部署后登录报 405 Method Not Allowed | Mock 原先仅在 `import.meta.env.DEV` 下启用，生产环境请求未被拦截；去掉 DEV 限制，入口始终 `import '@/mock'` |
| 外链商品图大量加载失败 | Unsplash 部分 ID 无效；将 42 张核心商品图下载至 `public/product-assets/`，Mock 改用本地路径，`syncProductImage` 同步旧缓存 |
| 取消待支付订单后购物车商品丢失 | 下单时 `removeSelected()` 清除已选；取消支付 API 触发 `restoreFromOrderItems()` 按订单明细恢复购物车 |
| 登录成功后无法回到原商品页 | 跳转登录时携带 `redirect` 参数，`resolveAuthRedirect` 优先读取 URL 参数再回跳 |
---

## 附录：本地运行与提交

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm test
node tool/check.cjs  # 提交前自检
node tool/pack.cjs   # 生成 {学号}_{姓名}_{作业名称}.zip
```

**提交前请务必：** 在 `metadata.json` 中填写全部组员真实学号，并运行 `node tool/check.cjs` 确保通过。
