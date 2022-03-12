// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = 'http://114.55.94.207:3006'; /* 根域名 */
		// config.dataType='json';
		config.header = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Methods': 'OPTIONS, GET, PUT, POST, DELETE',
			// 'Access-Control-Max-Age':"8080"
		}
		// header:{"Access-Control-Allow-Origin" : *};
		// responseType: 'text';
		validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
			return statusCode >= 200 && statusCode < 300
		}
		return config
	})

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}

		// config.header.Authorization = "Bearer" + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLnNob3AuZWR1d29yay5jblwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTY0NjgwMTc2NywiZXhwIjoxNjQ3MTYxNzY3LCJuYmYiOjE2NDY4MDE3NjcsImp0aSI6InVsa0dZVjhXcWhXeHBsUzEiLCJzdWIiOjYxMDksInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ._zTL226t-KOZkXXeAQcB2Fo1uksHfyLpg1obOcJblX0"
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		config.header.Authorization = "Bearer " + vm.$store.state.vuex_Authorization
		// console.log(config.header.Authorization)

		return config
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		const {
			statusCode,
			data,
			code
		} = response
		
		// vm.$u.vuex('statusCode', statusCode)

		if (statusCode < 400) {

			return data
		} 

		// 		// 自定义参数
		// 		const custom = response.config?.custom
		// 		if (data.code !== 200) { 
		// 			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
		// 			if (custom.toast !== false) {
		// 				uni.$u.toast(data.message)
		// 			}

		// 			// 如果需要catch返回，则进行reject
		// 			if (custom?.catch) {
		// 				return Promise.reject(data)
		// 			} else {
		// 				// 否则返回一个pending中的promise，请求不会进入catch中
		// 				return new Promise(() => { })
		// 			}
		// 		}
		// return data
	}, (response) => {
		// 对响应错误做点什么 （statusCode !== 200）
		const {
			statusCode,
			data
		} = response
		
		uni.$u.vuex('statusCode', statusCode)
		
		//登录授权过期处理
		if(data.code == 401){
			uni.$u.toast("登录授权过期请重新登录");
			setTimeout(() => {
				vm.$u.route({
					type:'redirect',
					url: 'pages/auth/login',		
				})
			}, 2000)
			return false;
		}
		
		if (statusCode == 400) {
			// 错误的请求
			uni.$u.toast("账号密码错误");
			return false;
		} else if (statusCode == 401) {

			if (data.message == "Unauthorized") {
				uni.$u.toast('密码错误');
				vm.$u.utils.isLogin()
			} else {
				// token过期，未登录权限
				// vm.$u.utils.isLogin()
			}
			return false;
		} else if (statusCode == 422) {
			uni.$u.toast(data.errors);
			return false;
		} else if (statusCode == 404) {
			uni.$u.toast("用户不存在")
			return false;
		} else {
			uni.$u.toast("请求超时")
			return false;
		}
	
	})

	// 增加patch请求
	vm.$u.http.patch = (url, params = {}, header = {}) => {
		// 模拟patch请求
		const _params = {
			...params,
			_method: 'PATCH'
		}
		return vm.$u.http.post(url, _params, header)
	}

}
