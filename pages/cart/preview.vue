<template>
	<view>
		<view class="u-p-t-10">
			<view class="top" @click="toAddress">
				<view class="left u-flex-9">
					<view class="address">
						<text>{{location}}</text>
					</view>
					<view class="info">
						<text>
							<a>{{name}}</a>
							<a>{{phone}}</a>
						</text>
					</view>
				</view>
				<view class="right u-flex-1">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="container">
				<view v-for="(item,index) in shoplist" :key="index">
					<shopList :item="item"></shopList>
				</view>
			</view>
			<view class="footer">
				<view class="tp">
					<view style="width: 100%;padding-left: 60rpx;">
						<text class="title">合计:</text>
						<text class="price">￥{{totalPrice}}</text>
					</view>
					<u-button ref="submit" style="padding: 0 100rpx;line-height: 50px;margin: 0;margin-right: 40rpx;"
						:disabled="totalPrice>0?false:true" type="primary" :ripple="true" shape="square"
						@click="submit">提交订单并支付</u-button>
				</view>
			</view>
		</view>
		<view>
			<payKeyboard class="payKeyboard" v-if="show" title="Mi安全键盘" @success="enterSuccess" @close="close">
			</payKeyboard>
		</view>
		<u-empty class="empty" icon-size="100px" :show="totalPrice>0?false:true" mode="order"></u-empty>
	</view>
</template>

<script>
	import {
		preview,
		addressInfo,
		orders,
		pay
	} from "@/config/api.js"
	import payKeyboard from '@/components/mi-payKeyboard/mi-payKeyboard.vue'
	export default {
		data() {
			return {
				address: {},
				location: "",
				name: "",
				phone: "",
				shoplist: [],
				show: false,
				address_id: "",
				timer: "",
				password: "",
				orders_id:''
			}
		},
		components: {
			payKeyboard
		},
		onLoad() {
			this.cartPreview()
		},
		computed: {
			totalPrice() {
				return this.shoplist.reduce((pre, curr) => {
					return parseFloat(pre) + parseFloat(curr.goods.price) * curr.num
				}, 0)
			}
		},
		methods: {
			async cartPreview() {
				const res = await preview()
				console.log(res)
				this.shoplist = res.cart
				// #ifdef MP-WEIXIN
				const data = this.$store.state.data
				// #endif
				// #ifdef H5
				const data = this.$route.query.params
				// #endif
				if (data != undefined) {
					const addressData = await addressInfo(data)
					console.log(addressData)
					this.location = addressData.address.province + "-" + addressData.address.city + "-" + addressData
						.address.county + "-" +
						addressData.address.address
					this.name = addressData.address.name
					this.phone = addressData.address.phone
					this.address_id = addressData.address.id
				} else {
					this.address = res.address.filter(item => {
						return item.is_default ? true : false
					})
					this.location = this.address[0].province + "-" + this.address[0].city + "-" + this.address[0]
						.county + "-" + this.address[0].address
					this.name = this.address[0].name
					this.phone = this.address[0].phone
					this.address_id = this.address[0].id
				}
			},
			toAddress() {
				uni.$u.vuex('address_preview', "true")
				uni.navigateTo({
					url: '/pages/center/address/address'
				});
			},
			cancel() {
				clearInterval(this.timer)
				this.$u.toast('已取消,请在订单有效期内支付')
				this.show = false
				setTimeout(() => {
					this.$u.route({
						url: "pages/center/orders/myOrders"
					})
				}, 1500)
			},
			async submit() {
				const params = {
					address_id: this.address_id,
					totalPrice: this.totalPrice
				}
				const res = await orders(params)
				this.orders_id = res.order.id
				this.show = true
			},
			close() {
				this.$u.toast('已取消,请在订单有效期内支付')
				this.show = false
				setTimeout(() => {
					this.$u.route({
						type:'redirectTo',
						url: "pages/center/orders/myOrders"
					})
				}, 1500)
			},
			async enterSuccess(password) {
				const params = {
					password,
					orders_id:this.orders_id
				}
				const res = await pay(params)
				this.show = false
				this.password = password
				setTimeout(() => {
					this.$u.route({
						type:'redirectTo',
						url: "pages/center/orders/myOrders"
					})
				}, 1500)
			}
			// async Query(data) {
			// 	const status = await this.$u.api.status(data)
			// 	console.log(status);
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.qrcode {
		padding: 20rpx;
	}

	.empty {
		position: absolute;
		width: 100%;
		top: 0;
	}

	.top {
		position: fixed;
		display: flex;
		width: 100%;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		/* 	#ifdef MP-WEIXIN */
		top: 0px;
		/* #endif */
		margin-top: 5px;
		margin-bottom: 5px;
		height: 100rpx;
		z-index: 99;
		background-color: #fff;
		border-bottom: 2px solid #eee;
		z-index: 1;

		.left {
			display: flex;
			margin-left: 20rpx;

			.address {
				font-weight: bold;
				font-size: 29rpx;
			}

			.info {
				a {
					margin-right: 20rpx;
					color: #82848A;
				}
			}
		}

		.right {
			display: flex;
			flex: 1;
			text-align: right;
			margin-right: 20rpx;
			line-height: 44px;
		}
	}

	.payKeyboard {
		z-index: 9;
	}

	.container {
		padding-top: 25px;
		padding-left: 17px;
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top) - 105px);
		/* #endif  */
		overflow-y: scroll;
		margin-top: 50px;
	}

	.footer {
		position: fixed;
		display: flex;
		height: 50px;
		bottom: 0;
		background-color: #fff;
		border-top: 2px solid #eee;
		line-height: 100rpx;
		width: 100%;

		.tp {
			display: flex;
			flex: 1;
			align-items: center;
		}

		.price {
			width: 100px;
			line-height: 120rpx;
			overflow: hidden;
			color: #2979ff;
			font-weight: bold;
			font-size: 40rpx;
			margin-left: 10rpx;
		}
	}
</style>
