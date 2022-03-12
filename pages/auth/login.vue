<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录</view>
			<input class="u-border-bottom" v-model="email" placeholder="请输入手机号" />
			<input class="u-border-bottom" type="password" v-model="password" placeholder="请输入手机号" />
			<button @click="submit" :style="[inputStyle]" class="getCaptcha">登录</button>
			<view class="alternative">
				<view class="password">忘记密码</view>
				<navigator url="./register"><view class="issue">注册</view></navigator>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		gettoken,
		getUser
	} from "@/config/api.js"
	export default {
		data() {
			return {
				email: '',
				password: ''
			}
		},
		computed: {
			inputStyle() {
				let style = {};
				if (uni.$u.test.email(this.email) && this.password) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color['warning'];
				}
				return style;
			}
		},
		async onLoad() {

		},
		methods: {
			async submit() {
				if (!uni.$u.test.email(this.email) || !this.password) return
				const params = {
					email: this.email,
					password: this.password,
				}
				const loginRes = await gettoken(params)
				// console.log((loginRes))
				uni.$u.vuex('vuex_Authorization', loginRes.token)
				// console.log(this.$store.state.vuex_Authorization)
				const userInfo = await getUser()
				// console.log(userInfo)
				uni.$u.vuex('vuex_user', userInfo)
				// console.log(this.$store.state.vuex_user)
				const backUrl = uni.getStorageSync('back_url') || 'pages/index/index'
				console.log(backUrl)
				setTimeout(() =>{
					this.$u.route({
						type: 'reLaunch',
						url: `${backUrl}`
					})
					
				},1500)
			}
		}
	};
</script>

<style lang="scss" scoped>
	.u-border-bottom {
		margin-bottom: 40rpx !important;
	}

	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
			}

			.getCaptcha {
				background-color: rgb(253, 243, 208);
				color: $u-tips-color;
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;

				&::after {
					border: none;
				}
			}

			.alternative {
				color: $u-tips-color;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.buttom {
			.loginType {
				display: flex;
				padding: 350rpx 150rpx 150rpx 150rpx;
				justify-content: space-between;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: $u-content-color;
					font-size: 28rpx;
				}
			}

		}
	}
</style>
