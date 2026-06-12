import request from './request'

/** 商品 */
export const getProducts = (params) => request.get('/products', { params })
export const getProductById = (id) => request.get(`/products/${id}`)
export const createProduct = (data) => request.post('/products', data)
export const updateProduct = (id, data) => request.put(`/products/${id}`, data)
export const deleteProduct = (id) => request.delete(`/products/${id}`)

/** 分类 */
export const getCategories = () => request.get('/categories')

/** 店铺 */
export const getShops = () => request.get('/shops')
export const getShopById = (id) => request.get(`/shops/${id}`)
export const updateShop = (id, data) => request.put(`/shops/${id}`, data)
export const followShop = (id, follow = true) => request.post(`/shops/${id}/follow`, { follow })

/** 客服聊天 */
export const getChatMessages = (shopId) => request.get(`/chats/${shopId}`)
export const sendChatMessage = (shopId, data) => request.post(`/chats/${shopId}`, data)

/** 首页 */
export const getHomeBanners = () => request.get('/home/banners')
export const getHomeNavGrid = () => request.get('/home/nav-grid')
export const getHomeFlashSale = () => request.get('/home/flash-sale')

/** 金刚区二级页 */
export const getZoneFlashSale = () => request.get('/zone/flash-sale')
export const getZoneValueSale = () => request.get('/zone/value-sale')
export const getZoneRanking = () => request.get('/zone/ranking')
export const getZoneCoupons = () => request.get('/zone/coupons')
export const claimCoupon = (id) => request.post(`/zone/coupons/${id}/claim`)
export const getZoneNewArrivals = () => request.get('/zone/new-arrivals')
export const getZoneLifestyle = () => request.get('/zone/lifestyle')
export const getZoneGiftCards = () => request.get('/zone/gift-cards')
export const buyGiftCard = (data) => request.post('/zone/gift-cards/buy', data)
export const getZoneMore = () => request.get('/zone/more')

/** 搜索 */
export const getSearchHot = () => request.get('/search/hot')
export const getSearchGuess = () => request.get('/search/guess')
export const getSearchRankings = () => request.get('/search/rankings')
export const getSearchSuggest = (keyword) =>
  request.get('/search/suggest', { params: { keyword } })

/** 用户 */
export const login = (data) => request.post('/login', data)
export const register = (data) => request.post('/register', data)
export const getUserInfo = () => request.get('/user/info')

/** 用户管理（后台） */
export const getUsers = (params) => request.get('/users', { params })
export const getUserById = (id) => request.get(`/users/${id}`)
export const createUser = (data) => request.post('/users', data)
export const updateUser = (id, data) => request.put(`/users/${id}`, data)
export const deleteUser = (id) => request.delete(`/users/${id}`)

/** 购物车 */
export const getCart = () => request.get('/cart')
export const addToCart = (data) => request.post('/cart', data)
export const updateCartItem = (id, data) => request.put(`/cart/${id}`, data)
export const removeCartItem = (id) => request.delete(`/cart/${id}`)

/** 订单 */
export const getOrders = (params) => request.get('/orders', { params })
export const getOrderById = (id) => request.get(`/orders/${id}`)
export const createOrder = (data) => request.post('/orders', data)
export const payOrder = (id, data) => request.post(`/orders/${id}/pay`, data)
export const confirmOrderReceive = (id) => request.post(`/orders/${id}/receive`)
export const submitOrderReview = (id, data) => request.post(`/orders/${id}/review`, data)
export const updateOrderStatus = (id, status) => request.put(`/orders/${id}/status`, { status })
