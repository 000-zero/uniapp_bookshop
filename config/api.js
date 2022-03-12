const http = uni.$u.http

//获取首页数据
export const getindex = (params = {}) => http.get('/api/index',{params})

//测试需要的登录权限
export const gettoken = (params) =>http.post('/api/users/login',params)

//获取用户详情
export const getUser = () =>http.get('/api/users/information')

//注册
export const register = (params) =>http.post('/api/users/register',params)

//更新用户信息
export const updateUser = (params) =>http.put('/api/user',params)

//退出登录
export const Logout = () =>http.post('/api/users/logout')

//获取阿里云OSS Token
export const OSS_Token = () =>http.get('/api/auth/oss/token')

//更新头像
export const avatar = (params) =>http.post('/api/user/avatar',params)

//获取商品详情
export const getGoodsDetail = (params = {}) =>http.get('/api/goods',{params})

//购物车列表
export const cartGoods = (params = {}) =>http.get('/api/carts',{params})

//请求收藏
export const isCollect = (params = {}) => http.post('/api/collect/goods',params)

//添加到购物车
export const addCart = (params = {}) =>http.post('/api/carts',params)

//获取商品列表
export const getGoodsList = (params = {}) =>http.get('/api/goods',{params})

//改变购物车数量
export const numChange = (params = {}) =>http.put('/api/carts/num',params)

//移出购物车
export const delCartGoods = cart =>http.delete(`/api/carts/del/${cart}`)

//商品是否被选中
export const isCheck = carts_id =>http.post('/api/carts/checked',{carts_id})

//商品是否全部被选中
export const allCheck = allcheck =>http.post('/api/carts/allcheck',{allcheck})

//获取地址列表
export const address = () =>http.get('/api/address')

//添加地址
export const addAddress = (params = {}) =>http.post('/api/address',params)

//地址详情
export const addressInfo = (id) =>http.get(`/api/address/${id}`)

//更新地址信息
export const addressModify = (address,params={}) =>http.put(`/api/address/${address}`,params)

//删除地址
export const addressDelete = (address) =>http.delete(`/api/address/${address}`)

//商品预览
export const preview = () =>http.get(`/api/orders/preview`)

//提交订单
export const orders = (params = {}) =>http.post('/api/orders',params)

//支付
export const pay = (params = {}) =>http.post('/api/orders/pay',params)

//订单列表
export const ordersList = (params = {}) =>http.get('/api/orders',{params})

//获取订单详情
export const ordersInfo = (order) =>http.get(`/api/orders/${order}`)

//上传图片
export const uploadfile = (params = {}) =>http.post('/api/users/uploadfile',params)

//获取商品评论
export const getcomments = (goods_id) =>http.get(`/api/comments/${goods_id}`)

//添加评论
export const addcomments = (params = {}) =>http.post(`/api/comments/addComments`,params)

//删除评论
export const commentDelete = (commentId) =>http.delete(`/api/comments/${commentId}`)

//点赞评论
export const hasLike = (params = {}) =>http.post(`/api/comments/hasLike`,params)