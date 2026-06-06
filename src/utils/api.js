import request from './request'

/** 商品 */
export const getProducts = (params) => request.get('/products', { params })
export const getProductById = (id) => request.get(`/products/${id}`)
export const createProduct = (data) => request.post('/products', data)
export const updateProduct = (id, data) => request.put(`/products/${id}`, data)
export const deleteProduct = (id) => request.delete(`/products/${id}`)

/** 分类 */
export const getCategories = () => request.get('/categories')

/** 用户 */
export const login = (data) => request.post('/login', data)
export const getUserInfo = () => request.get('/user/info')

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
export const updateOrderStatus = (id, status) => request.put(`/orders/${id}/status`, { status })
