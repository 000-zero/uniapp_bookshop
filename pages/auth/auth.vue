<template>
	<view>

		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 top">
			<view class="">
				<oss-upload></oss-upload>
			</view>
			<view class="u-flex-1 top_text">
				<view v-if="vuex_user.name == null">
					<u-skeleton rows="1" title loading></u-skeleton>
				</view>
				<view v-else>
					<view class="u-font-18 u-p-b-20">{{vuex_user.name}}</view>
					<view class="u-font-14 u-tips-color">邮箱:{{vuex_user.email}}</view>
				</view>
			</view>

		</view>

		<view class="u-m-t-20 cex">
			<u-cell-group>
				<u-cell icon="setting" title="个人信息" @click="toBaseInfo"></u-cell>
			</u-cell-group>
		</view>

		<view class="u-m-t-20 cex">
			<u-cell-group>
				<u-cell icon="rmb-circle" @click="toPage(1)" title="所有订单"></u-cell>
				<u-cell icon="star" @click="toPage(2)" title="商品收藏"></u-cell>
				<u-cell icon="map" @click="toPage(3)" title="收获地址"></u-cell>
			</u-cell-group>
		</view>

		<view class="u-m-t-20 cex">
			<u-cell-group>
				<u-cell icon="reload" title="退出登录" @click="logout"></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import {
		Logout,
		getUser
	} from "@/config/api.js"
	export default {
		data() {
			return {
				pic: 'https://uviewui.com/common/logo.png',
				show: true
			}
		},
		onLoad() {
			if (this.$u.utils.isLogin()) return
			getUser()
		},
		methods: {
			//跳转到修改用户信息
			toBaseInfo() {
				uni.$u.route({
					url: 'pages/auth/baseInfo'
				})
			},
			//退出登录
			async logout() {
				//请求api退出登录
				await Logout()
				//清楚缓存的token和用户信息
				this.$u.vuex('vuex_Authorization', null)
				this.$u.vuex('vuex_user', {})

				this.$u.toast('退出成功')

				//跳转到首页
				setTimeout(() => {
					uni.$u.route({
						type: 'reLaunch',
						url: '/pages/index/index',

					})
				}, 2000)
			},
			toPage(data) {
				var path = ''
				if (data == 1) {
					path = 'pages/center/orders/myOrders'
				} else if (data == 2) {
					path = "/pages/center/orders/myOrders"
				} else if (data == 3) {
					uni.$u.vuex('address_preview', "false")
					path = "pages/center/address/address"
				}
				this.$u.route({
					url: path,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #ededed;
	}

	.top {
		display: flex;

	}

	.top_text {
		padding-top: 25px;
		padding-left: 15px;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #ffffff;
		margin: 10px 0;
	}

	.cex {
		background-color: #FFFFFF;
	}
</style>
