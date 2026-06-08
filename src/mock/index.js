import Mock from 'mockjs'

// ─── 仅在开发环境启用 Mock 拦截 ───────────────────────────────
if (import.meta.env.DEV) {
  Mock.setup({ timeout: '200-600' })

  // ─── 工具函数 ─────────────────────────────────────────────
  const success = (data, message = 'success') => ({ code: 0, data, message })
  const fail = (message, code = 1) => ({ code, data: null, message })

  const parseBody = (options) => {
    try {
      return options.body ? JSON.parse(options.body) : {}
    } catch {
      return {}
    }
  }

  const parseToken = (options) => {
    const headers = options.headers || {}
    const auth =
      headers.Authorization ||
      headers.authorization ||
      headers['Authorization'] ||
      ''
    const fromHeader = auth.replace(/^Bearer\s+/i, '').trim()
    if (fromHeader) return fromHeader

    // Mock.js 拦截 XHR 时可能丢失 Authorization，从 storage 兜底
    return (
      sessionStorage.getItem('mall-token') ||
      localStorage.getItem('mall-token') ||
      localStorage.getItem('admin-token') ||
      ''
    )
  }

  const STORAGE_KEYS = {
    products: 'mock_products',
    categories: 'mock_categories',
    cart: 'mock_cart',
    orders: 'mock_orders',
    users: 'mock_users',
    tokens: 'mock_tokens',
  }

  const loadStore = (key, fallback) => {
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        /* fall through */
      }
    }
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }

  const saveStore = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  // ─── 种子数据：两级分类 ─────────────────────────────────────
  const defaultCategories = [
    {
      id: 1,
      name: '服饰',
      parentId: 0,
      children: [
        { id: 101, name: '男装', parentId: 1 },
        { id: 102, name: '女装', parentId: 1 },
        { id: 103, name: '配饰', parentId: 1 },
      ],
    },
    {
      id: 2,
      name: '数码',
      parentId: 0,
      children: [
        { id: 201, name: '手机', parentId: 2 },
        { id: 202, name: '电脑', parentId: 2 },
        { id: 203, name: '配件', parentId: 2 },
      ],
    },
    {
      id: 3,
      name: '家居',
      parentId: 0,
      children: [
        { id: 301, name: '家具', parentId: 3 },
        { id: 302, name: '家纺', parentId: 3 },
      ],
    },
    {
      id: 4,
      name: '美妆',
      parentId: 0,
      children: [
        { id: 401, name: '护肤', parentId: 4 },
        { id: 402, name: '彩妆', parentId: 4 },
      ],
    },
  ]

  // ─── 种子数据：商品列表 ─────────────────────────────────────
  const defaultProducts = [
    { id: 1, title: '极简亚麻衬衫', price: 299, stock: 120, categoryId: 101, image: 'https://picsum.photos/seed/p1/400/400', status: 1, desc: '透气亚麻，夏日首选' },
    { id: 2, title: '羊毛混纺大衣', price: 899, stock: 45, categoryId: 102, image: 'https://picsum.photos/seed/p2/400/400', status: 1, desc: '经典版型，保暖舒适' },
    { id: 3, title: '真皮编织腰带', price: 199, stock: 80, categoryId: 103, image: 'https://picsum.photos/seed/p3/400/400', status: 1, desc: '手工编织，质感出众' },
    { id: 4, title: '无线降噪耳机', price: 1299, stock: 200, categoryId: 203, image: 'https://picsum.photos/seed/p4/400/400', status: 1, desc: '主动降噪，续航 30h' },
    { id: 5, title: '轻薄笔记本电脑', price: 5999, stock: 30, categoryId: 202, image: 'https://picsum.photos/seed/p5/400/400', status: 1, desc: '14 英寸，1.2kg 超轻' },
    { id: 6, title: '智能手机 Pro', price: 4999, stock: 150, categoryId: 201, image: 'https://picsum.photos/seed/p6/400/400', status: 1, desc: '旗舰芯片，影像系统' },
    { id: 7, title: '北欧实木餐椅', price: 459, stock: 60, categoryId: 301, image: 'https://picsum.photos/seed/p7/400/400', status: 1, desc: '橡木材质，简约设计' },
    { id: 8, title: '纯棉四件套', price: 399, stock: 90, categoryId: 302, image: 'https://picsum.photos/seed/p8/400/400', status: 1, desc: '60 支长绒棉，亲肤柔软' },
    { id: 9, title: '保湿精华液', price: 268, stock: 300, categoryId: 401, image: 'https://picsum.photos/seed/p9/400/400', status: 1, desc: '深层补水，修护屏障' },
    { id: 10, title: '哑光唇釉套装', price: 158, stock: 500, categoryId: 402, image: 'https://picsum.photos/seed/p10/400/400', status: 1, desc: '三支装，持久不脱色' },
    { id: 11, title: '休闲运动卫衣', price: 259, stock: 0, categoryId: 101, image: 'https://picsum.photos/seed/p11/400/400', status: 0, desc: '已下架，库存清零' },
    { id: 12, title: '智能手表', price: 1999, stock: 75, categoryId: 203, image: 'https://picsum.photos/seed/p12/400/400', status: 1, desc: '健康监测，运动追踪' },
  ]

  // ─── 种子数据：用户与权限 ───────────────────────────────────
  const defaultUsers = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      nickname: '系统管理员',
      avatar: 'https://picsum.photos/seed/admin/100/100',
      permissions: ['product', 'category', 'order', 'user'],
    },
    {
      id: 2,
      username: 'operator',
      password: '123456',
      role: 'operator',
      nickname: '运营专员',
      avatar: 'https://picsum.photos/seed/operator/100/100',
      permissions: ['order'],
    },
    {
      id: 3,
      username: 'user',
      password: '123456',
      role: 'user',
      nickname: '商城用户',
      avatar: 'https://picsum.photos/seed/user/100/100',
      permissions: [],
    },
    {
      id: 4,
      username: 'test',
      password: '123456',
      role: 'test',
      nickname: '测试账号',
      avatar: 'https://picsum.photos/seed/test/100/100',
      permissions: ['product'],
    },
  ]

  const defaultOrders = [
    {
      id: 1,
      orderNo: '202603060001',
      userId: 3,
      status: 1,
      totalPrice: 299,
      address: '上海市浦东新区张江路 88 号',
      createTime: '2026-03-01 10:30:00',
      payTime: '2026-03-01 10:32:00',
      items: [{ productId: 1, title: '极简亚麻衬衫', price: 299, quantity: 1, image: 'https://picsum.photos/seed/p1/400/400' }],
    },
    {
      id: 2,
      orderNo: '202603060002',
      userId: 3,
      status: 0,
      totalPrice: 1299,
      address: '上海市浦东新区张江路 88 号',
      createTime: '2026-03-05 14:20:00',
      payTime: null,
      items: [{ productId: 4, title: '无线降噪耳机', price: 1299, quantity: 1, image: 'https://picsum.photos/seed/p4/400/400' }],
    },
  ]

  // 初始化内存仓库（localStorage 持久化，实现前后台数据联动）
  let categories = loadStore(STORAGE_KEYS.categories, defaultCategories)
  let products = loadStore(STORAGE_KEYS.products, defaultProducts)
  let cart = loadStore(STORAGE_KEYS.cart, [])
  let orders = loadStore(STORAGE_KEYS.orders, defaultOrders)
  let users = loadStore(STORAGE_KEYS.users, defaultUsers)
  let tokens = loadStore(STORAGE_KEYS.tokens, {})

  const getUserByToken = (token) => {
    if (!token) return null
    const tokenMap = loadStore(STORAGE_KEYS.tokens, {})
    const userId = tokenMap[token]
    if (!userId) return null
    return users.find((u) => u.id === userId) || null
  }

  const flattenCategories = () => {
    const flat = []
    categories.forEach((parent) => {
      flat.push({ id: parent.id, name: parent.name, parentId: parent.parentId })
      parent.children?.forEach((child) => flat.push(child))
    })
    return flat
  }

  const getProductById = (id) => products.find((p) => p.id === Number(id))

  // ─── 注册接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/register$/, 'post', (options) => {
    const { username, password, nickname } = parseBody(options)

    if (!username || !password) {
      return fail('用户名和密码不能为空')
    }
    if (username.length < 3) {
      return fail('用户名至少 3 个字符')
    }
    if (password.length < 6) {
      return fail('密码至少 6 位')
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return fail('密码需同时包含字母和数字')
    }
    if (users.some((u) => u.username === username)) {
      return fail('用户名已被注册，请更换')
    }

    const newId = Math.max(...users.map((u) => u.id), 0) + 1
    const newUser = {
      id: newId,
      username,
      password,
      role: 'user',
      nickname: nickname || username,
      avatar: `https://picsum.photos/seed/u${newId}/100/100`,
      permissions: [],
    }
    users.push(newUser)
    saveStore(STORAGE_KEYS.users, users)

    const token = Mock.Random.guid()
    tokens[token] = newUser.id
    saveStore(STORAGE_KEYS.tokens, tokens)

    const { password: _, ...safeUser } = newUser
    return success({
      token,
      user: safeUser,
      role: 'user',
      permissions: [],
    }, '注册成功')
  })

  // ─── 登录接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/login$/, 'post', (options) => {
    const { username, password } = parseBody(options)
    const user = users.find((u) => u.username === username && u.password === password)

    if (!user) {
      return fail('用户名或密码错误', 401)
    }

    const token = Mock.Random.guid()
    tokens[token] = user.id
    saveStore(STORAGE_KEYS.tokens, tokens)

    const { password: _, ...safeUser } = user
    return success({
      token,
      user: safeUser,
      role: user.role,
      permissions: user.permissions,
    }, '登录成功')
  })

  // ─── 用户信息 ───────────────────────────────────────────────
  Mock.mock(/\/api\/user\/info/, 'get', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('未登录或 Token 已失效', 401)
    const { password: _, ...safeUser } = user
    return success(safeUser)
  })

  // ─── 分类接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/categories/, 'get', () => {
    return success(categories)
  })

  Mock.mock(/\/api\/categories$/, 'post', (options) => {
    const body = parseBody(options)
    const newId = Math.max(...flattenCategories().map((c) => c.id), 0) + 1
    if (body.parentId && body.parentId !== 0) {
      const parent = categories.find((c) => c.id === body.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push({ id: newId, name: body.name, parentId: body.parentId })
      }
    } else {
      categories.push({ id: newId, name: body.name, parentId: 0, children: [] })
    }
    saveStore(STORAGE_KEYS.categories, categories)
    return success({ id: newId }, '分类创建成功')
  })

  // ─── 商品接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/products(\?.*)?$/, 'get', (options) => {
    const url = new URL(options.url, 'http://localhost')
    const categoryId = url.searchParams.get('categoryId')
    const keyword = url.searchParams.get('keyword')
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 10)
    const status = url.searchParams.get('status')

    let list = [...products]

    if (categoryId) {
      const cid = Number(categoryId)
      const parent = categories.find((c) => c.id === cid)
      if (parent?.children) {
        const childIds = parent.children.map((c) => c.id)
        list = list.filter((p) => childIds.includes(p.categoryId) || p.categoryId === cid)
      } else {
        list = list.filter((p) => p.categoryId === cid)
      }
    }

    if (keyword) {
      list = list.filter((p) => p.title.includes(keyword))
    }

    if (status !== null && status !== undefined && status !== '') {
      list = list.filter((p) => p.status === Number(status))
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const pageList = list.slice(start, start + pageSize)

    return success({ list: pageList, total, page, pageSize })
  })

  Mock.mock(/\/api\/products\/\d+/, 'get', (options) => {
    const id = options.url.match(/\/api\/products\/(\d+)/)?.[1]
    const product = getProductById(id)
    if (!product) return fail('商品不存在', 404)
    return success(product)
  })

  Mock.mock(/\/api\/products$/, 'post', (options) => {
    const body = parseBody(options)
    const newId = Math.max(...products.map((p) => p.id), 0) + 1
    const product = {
      id: newId,
      title: body.title,
      price: body.price,
      stock: body.stock ?? 0,
      categoryId: body.categoryId,
      image: body.image || `https://picsum.photos/seed/p${newId}/400/400`,
      status: body.status ?? 1,
      desc: body.desc || '',
    }
    products.push(product)
    saveStore(STORAGE_KEYS.products, products)
    return success(product, '商品创建成功')
  })

  Mock.mock(/\/api\/products\/\d+/, 'put', (options) => {
    const id = Number(options.url.match(/\/api\/products\/(\d+)/)?.[1])
    const body = parseBody(options)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return fail('商品不存在', 404)
    products[index] = { ...products[index], ...body, id }
    saveStore(STORAGE_KEYS.products, products)
    return success(products[index], '商品更新成功')
  })

  Mock.mock(/\/api\/products\/\d+/, 'delete', (options) => {
    const id = Number(options.url.match(/\/api\/products\/(\d+)/)?.[1])
    products = products.filter((p) => p.id !== id)
    saveStore(STORAGE_KEYS.products, products)
    return success(null, '商品删除成功')
  })

  // ─── 购物车接口 ─────────────────────────────────────────────
  Mock.mock(/\/api\/cart(\?.*)?$/, 'get', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const list = cart
      .filter((item) => item.userId === user.id)
      .map((item) => {
        const product = getProductById(item.productId)
        return { ...item, product }
      })
    return success(list)
  })

  Mock.mock(/\/api\/cart$/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const { productId, quantity = 1 } = parseBody(options)
    const product = getProductById(productId)
    if (!product) return fail('商品不存在', 404)
    if (product.stock < quantity) return fail('库存不足')

    const existing = cart.find((c) => c.userId === user.id && c.productId === Number(productId))
    if (existing) {
      existing.quantity += quantity
      existing.selected = true
    } else {
      cart.push({
        id: Mock.Random.integer(10000, 99999),
        userId: user.id,
        productId: Number(productId),
        quantity,
        selected: true,
      })
    }
    saveStore(STORAGE_KEYS.cart, cart)
    return success(null, '已加入购物车')
  })

  Mock.mock(/\/api\/cart\/\d+/, 'put', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const cartId = Number(options.url.match(/\/api\/cart\/(\d+)/)?.[1])
    const body = parseBody(options)
    const item = cart.find((c) => c.id === cartId && c.userId === user.id)
    if (!item) return fail('购物车项不存在', 404)

    if (body.quantity !== undefined) {
      const product = getProductById(item.productId)
      if (product && body.quantity > product.stock) return fail('库存不足')
      item.quantity = body.quantity
    }
    if (body.selected !== undefined) item.selected = body.selected

    saveStore(STORAGE_KEYS.cart, cart)
    return success(item, '购物车已更新')
  })

  Mock.mock(/\/api\/cart\/\d+/, 'delete', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const cartId = Number(options.url.match(/\/api\/cart\/(\d+)/)?.[1])
    cart = cart.filter((c) => !(c.id === cartId && c.userId === user.id))
    saveStore(STORAGE_KEYS.cart, cart)
    return success(null, '已从购物车移除')
  })

  // ─── 订单接口 ───────────────────────────────────────────────
  Mock.mock(/\/api\/orders(\?.*)?$/, 'get', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)

    let list = [...orders]
    if (user.role === 'user') {
      list = list.filter((o) => o.userId === user.id)
    }

    const url = new URL(options.url, 'http://localhost')
    const status = url.searchParams.get('status')
    if (status !== null && status !== '') {
      list = list.filter((o) => o.status === Number(status))
    }

    return success({ list, total: list.length })
  })

  Mock.mock(/\/api\/orders\/\d+/, 'get', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const id = Number(options.url.match(/\/api\/orders\/(\d+)/)?.[1])
    const order = orders.find((o) => o.id === id)
    if (!order) return fail('订单不存在', 404)
    if (user.role === 'user' && order.userId !== user.id) return fail('无权查看', 403)
    return success(order)
  })

  Mock.mock(/\/api\/orders$/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const { items, address } = parseBody(options)

    const newId = Math.max(...orders.map((o) => o.id), 0) + 1
    const orderItems = items.map((item) => {
      const product = getProductById(item.productId)
      return {
        productId: item.productId,
        title: product?.title || '',
        price: product?.price || 0,
        quantity: item.quantity,
        image: product?.image || '',
      }
    })
    const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const order = {
      id: newId,
      orderNo: `2026${String(Date.now()).slice(-8)}`,
      userId: user.id,
      status: 0,
      totalPrice,
      address: address || '默认地址',
      createTime: new Date().toLocaleString('zh-CN'),
      payTime: null,
      items: orderItems,
    }
    orders.push(order)
    saveStore(STORAGE_KEYS.orders, orders)
    return success(order, '订单创建成功')
  })

  Mock.mock(/\/api\/orders\/\d+\/pay/, 'post', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    const id = Number(options.url.match(/\/api\/orders\/(\d+)/)?.[1])
    const order = orders.find((o) => o.id === id)
    if (!order) return fail('订单不存在', 404)
    if (user.role === 'user' && order.userId !== user.id) return fail('无权操作', 403)
    if (order.status !== 0) return fail('订单状态不允许支付')

    const { paymentMethod = 'wechat' } = parseBody(options)
    order.status = 1
    order.paymentMethod = paymentMethod
    order.payTime = new Date().toLocaleString('zh-CN')

    // 支付成功后扣减商品库存（前后台数据联动）
    order.items.forEach((item) => {
      const product = getProductById(item.productId)
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity)
      }
    })
    saveStore(STORAGE_KEYS.products, products)
    saveStore(STORAGE_KEYS.orders, orders)
    return success(order, '支付成功')
  })

  Mock.mock(/\/api\/orders\/\d+\/status/, 'put', (options) => {
    const user = getUserByToken(parseToken(options))
    if (!user) return fail('请先登录', 401)
    if (!['admin', 'operator'].includes(user.role)) return fail('无权操作', 403)

    const id = Number(options.url.match(/\/api\/orders\/(\d+)/)?.[1])
    const { status } = parseBody(options)
    const order = orders.find((o) => o.id === id)
    if (!order) return fail('订单不存在', 404)

    order.status = status
    saveStore(STORAGE_KEYS.orders, orders)
    return success(order, '订单状态已更新')
  })

  console.info('[Mock] 数据中心已启动，Axios 请求将被拦截')
}

export default Mock
