import {getUser} from "@/config/api.js"
module.exports = (vm) => {
	const isLogin = () =>{
		if (!vm.$store.state.vuex_Authorization) {
			//获取当前页面栈的实例
			const currentPage = getCurrentPages().pop()
			console.log(currentPage)
			//获取携带的参数
			const {options,route} = currentPage	
			
					
			
			//获取携带参数的key
			const optionsKeys = Object.keys(options)
			
			//获取携带参数的valueoptions[current]
			//获取携带的参数
			let params =''
			if(optionsKeys.length !==0){
				params = optionsKeys.reduce((pre,current) =>{
					return pre + current + "=" +options[current] + '&'
				},'?').slice(0,-1)
			}
			
			//保存路径和参数
			uni.setStorageSync('back_url',route+params)
			
			setTimeout(() => {
				vm.$u.route({
					type:'redirect',
					url: 'pages/auth/login',		
				})
			}, 2000)
			return false
		}
		return true
	}
	
	//更新用户信息
	const updateUserinfo = async () =>{
		//获取用户信息
		const userInfo = await getUser()
		//缓存用户信息
		vm.$u.vuex('vuex_user', userInfo)
		
	}
	
	vm.$u.utils = {
		isLogin,
		updateUserinfo
	}
}