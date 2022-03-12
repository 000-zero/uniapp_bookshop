<template>
	<view class="wrap u-p-t-80">
		<input v-model="name" label="昵称" placeholder="请输入昵称" focus required />
		<input v-model="email" label="邮箱" placeholder="请输入邮箱" required :error-message="emailMsg" />
		<input v-model="password" label="密码" placeholder="请输入密码" required :error-message="pwdMsg" password />
		<input v-model="password_confirmation" label="确认密码"  placeholder="请确认密码" required password :error-message="errorMessage" />
		<button @tap="submit" :loading="submitBtn" :disabled="submitBtn" :style="[inputStyle]" class="getCaptcha">注册</button>
	</view>
</template>

<script>
	import {
		register
	} from '@/config/api.js';
	export default {
		data() {
			return {
				// 用户注册参数
				name: "",
				email: "",
				password: "",
				password_confirmation: "",
				submitBtn:false,
			};
		},
		computed:{
			inputStyle() {
				let style = {};
				// 全部验证通过，激活注册
				if(this.$u.test.email(this.email) && this.password && this.password==this.password_confirmation && this.name) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color['primary'];
				}
				return style;
			},
			emailMsg(){
				if(!this.email){
					return ''
				}
				if(!this.$u.test.email(this.email)){
					return '邮箱格式错误'
				}else{
					return ''
				}
				
			},
			pwdMsg(){
				if(!this.password){
					return ''
				}
				if(!this.$u.test.rangeLength(this.password,[6,12])){
					return '密码长度需在6-12位'
				}else{
					return ''
				}
			},
			errorMessage(){
				if(this.password!==this.password_confirmation){
					return '两次密码不一致'
				}else{
					return ''
				}
			}
		},
		methods: {
			async toRegister() {
				try{
					//注册btn样式
					this.submitBtn=true
					// 准备提交参数
					const params = {
						name: this.name,
						email: this.email,
						password: this.password,
						password_confirmation: this.password_confirmation
					}
					// 注册接口
					const regRes = await register(params)
					this.submitBtn=false
					// 注册成功，重定向到登录（关闭注册页面）
					this.$u.toast('注册成功！')
					// 延时跳转
					setTimeout(()=>{
						this.$u.route({
							type:"redirect",
							url:"/pages/auth/login",
							// params:{email:this.email,password:this.password}
						})
					},1500)
				}catch(e){
					this.submitBtn=false
				}
			},
			submit(){
				if(this.$u.test.email(this.email) && this.password && this.password==this.password_confirmation && this.name){
					this.toRegister()
					
				}else{
					return false
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.wrap{
	.getCaptcha {
		background-color: #a2b8ff;
		color: $u-tips-color;
		border: none;
		font-size: 30rpx;
		padding: 12rpx 0;
		
		&::after {
			border: none;
		}
	}
}
</style>
