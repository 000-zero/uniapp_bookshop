<template>
	<view>
		<view>
			<view class="top">
				<view class="left">
					<view class="address">
						<text class="more">{{location}}</text>
						<u-tag class="tag" :text="text" mode="plain" />
					</view>
					<view class="info">
						<text>
							<a>{{name}}</a>
							<a>{{phone}}</a>
						</text>
					</view>
					<view>订单编号: {{order_no}}</view>
					<view>下单时间: {{created_at}}</view>
				</view>
			</view>
			<view class="container">
				<view v-for="(item,index) in shoplist" :key="index">
					<shopList :item="item"></shopList>
				</view>
				<u-empty class="empty" icon-size="100px" :show="totalPrice>0?false:true" mode="order"></u-empty>
			</view>
			<view class="footer">
				<view class="footer_container">
					<view class="card">
						<text class="title">共计</text>
						<text class="num">{{qq}}</text>
						<text class="title">商品</text>
					</view>
					<view class="tp card">
						<text class="title">合计:</text>
						<text class="price">￥{{totalPrice}}</text>
					</view>
					<view class="button">
						<u-button ref="submit" style="padding: 0 50rpx;width: 100%;margin: auto 0;margin-top: 5px;"
							:disabled="totalPrice>0?false:true" type="primary" :ripple="true" shape="square"
							@click="submit">{{btn}}</u-button>
					</view>
				</view>
			</view>
			<view>
				<payKeyboard class="payKeyboard" v-if="show" title="Mi安全键盘" @success="enterSuccess" @close="close">
				</payKeyboard>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ordersInfo,
		pay
	} from '@/config/api.js';
	import payKeyboard from '@/components/mi-payKeyboard/mi-payKeyboard.vue'
	export default {
		data() {
			return {
				location: "",
				name: "",
				phone: "",
				order_no: "",
				created_at: "",
				num: '',
				shoplist: [],
				text: "标签",
				btn: "按钮",
				status: 1,
				show: false,
				QR_code: "",
				id: "",
				timer: "",
				totalPrice: "",
				qq: '12'
			}
		},
		onLoad() {
			this.orderInfo()
		},
		components: {
			payKeyboard
		},
		methods: {
			async orderInfo() {
				// #ifdef MP-WEIXIN
				const orderID = this.$store.state.orderID
				// #endif
				// #ifdef H5
				const orderID = this.$route.query.params
				// #endif
				const res = await ordersInfo(orderID).catch(err => {
					if (err.statusCode == 500) {
						this.$u.toast('此地址已经被删除,订单失效')
						setTimeout(() => {
							this.$u.route({
								url: "pages/center/orders/myOrders"
							})
						}, 1500)
					}
				})
				if (res != undefined) {
					this.id = res.order.id
					this.status = res.order.status
					this.totalPrice = res.order.amount.toString()
					this.num = res.order_details.length.toString()
					console.log(res)

					this.shoplist = res.order_details
					this.location = res.address.province + "-" + res.address.city + "-" + res.address.county + "-" +
						res.address.address
					this.name = res.address.name
					this.phone = res.address.phone
					this.order_no = res.order.order_no
					console.log(typeof this.order_no)
					this.created_at = res.order.createdAt
					console.log(typeof this.created_at)

					if (res.order.status == 1) this.text = "未支付"
					else if (res.order.status == 2) this.text = "已付款"
					else if (res.order.status == 3) this.text = "已发货"
					else if (res.order.status == 4) this.text = "已收货"
					else if (res.order.status == 5) this.text = "已过期"

					if (res.order.status == 1) {
						this.btn = "支付订单"
					} else if (res.order.status < 5) {
						this.btn = "查看物流"
					} else {
						this.btn = "订单已过期"
					}
				}
			},
			async submit() {
				console.log(this.btn)
				if (this.btn === "支付订单") {
					this.show = true
				} else if (this.btn === "查看物流") {
					console.log("")
				}
			},
			async enterSuccess(password) {
				const params = {
					password,
					orders_id: this.id
				}
				await pay(params).then(
					this.$u.toast('支付成功')
					// this.$u.route({
					// 	url: "pages/auth/auth"
					// })
				)

				this.show = false
				this.orderInfo()
			},
			close() {
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.qrcode {
		padding: 20rpx;
	}

	.container {
		padding-left: 10px;
		padding-top: 25px;
		padding-right: 10px;

		height: calc(100vh - 97px);

		overflow-y: scroll;
		padding-top: 150px;
		background-color: #f5f5f5;
	}
	
	/* #ifdef H5 */
	.button {
		margin-right: 3px;
	}
	/* #endif */

	/* 	#ifdef MP-WEIXIN */
	.button {
		width: 30%;
		margin-right: 3px;
	}
	/* #endif */

	.payKeyboard {
		z-index: 9;
	}

	.top {
		position: fixed;
		display: flex;
		width: 100%;
		padding: 20rpx;
		z-index: 8;
		background-color: #fff;
		border-bottom: 2px solid #eee;

		.left {
			flex: 9;
			margin-left: 20rpx;

			view {
				margin-top: 15rpx;
			}

			.address {
				display: flex;
				font-weight: bold;
				font-size: 38rpx;

				.more {
					display: flex;
					flex-wrap: wrap;
					flex: 10;
					width: 90px;
					text-overflow: ellipsis;
					-o-text-overflow: ellipsis;
					overflow: hidden;
				}

				.tag {
					flex: 2;
					float: right;
					margin-top: 2px;
					margin-right: 9px;
				}
			}

			.info {
				a {
					margin-right: 20rpx;
					color: #82848A;
				}
			}
		}
	}

	.footer {
		position: fixed;
		// display: flex;
		height: 50px;
		bottom: 0;
		background-color: #fff;
		border-top: 2px solid #eee;
		line-height: 100rpx;
		width: 100%;

		.footer_container {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.tp {
				padding-right: 30px;
			}

			.card {
				height: 48px;
				line-height: 48px;
				margin-left: 20px;
			}

			.num {
				margin: 0 20rpx;
				width: 100px;
				color: #2979ff;
				font-weight: bold;
				font-size: 40rpx;
			}

			.price {
				width: 100px;
				color: #2979ff;
				font-weight: bold;
				font-size: 40rpx;
				margin-left: 10rpx;
			}
		}

	}
</style>
