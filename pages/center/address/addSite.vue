<template>
	<view class="wrap">
		<view class="top">
			<view class="item">
				<view class="left">收货人</view>
				<input v-model="name" type="text" placeholder-class="line" placeholder="请填写收货人姓名" />
			</view>
			<view class="item">
				<view class="left">手机号码</view>
				<input v-model="phone" type="text" placeholder-class="line" placeholder="请填写收货人手机号" />
			</view>
			<!-- 			<view class="item" @tap="showRegionPicker">
				<view class="left">所在地区</view>
				<input v-model="location" disabled type="text" placeholder-class="line" placeholder="省市区县、乡镇等" />
			</view> -->
			<uni-data-picker placeholder="请选择所在地区" popup-title="请选择城市" collection="opendb-city-china"
				field="code as value, name as text" orderby="value asc" :step-searh="true" self-field="code"
				parent-field="parent_code" @change="onchange" @nodeclick="onnodeclick">
			</uni-data-picker>
			<view class="item address">
				<view class="left">详细地址</view>
				<textarea v-model="address" type="text" placeholder-class="line" placeholder="街道、楼牌等" />
			</view>
		</view>
		<view class="bottom">
			<view class="default">
				<view class="left">
					<view class="set">设置默认地址</view>
					<view class="tips">提醒：每次下单会默认推荐该地址</view>
				</view>
				<view class="right">
					<switch :checked="is_default" color="#2979ff" @change="setDefault" />
				</view>
			</view>
			<view v-if="!change">
				<u-button type="primary" class="btn" @click="add">确认并提交</u-button>
			</view>
			<view class="btn_grow" v-else>
				<u-button type="primary" class="btn" @click="dataModify">确认修改</u-button>

				<view class="btn-delete">
					<u-button type="warning " class="btn " @click="dataDelete">删除地址</u-button>
				</view>
			</view>
		</view>
		<!-- <u-picker mode="region" v-model="show" @confirm="confirm" /> -->
	</view>
</template>

<script>
	import {
		addAddress,
		addressInfo,
		addressModify,
		addressDelete
	} from "@/config/api.js"
	export default {
		data() {
			return {
				name: '',
				address: '',
				phone: '',
				location: '',
				province: "",
				city: "",
				area: "",
				is_default: false,
				show: false,
				change: false,
				data:null
			};
		},
		onLoad() {
			this.modify()
		},
		methods: {
			onchange(e) {
				const value = e.detail.value
				this.province = value[0].text
				this.city = value[1].text
				this.area = value[2].text
				this.location = value[0].text + "-" + value[1].text + "-" + value[2].text
			},
			onnodeclick(node) {},
			async modify() {
				// #ifdef MP-WEIXIN
				this.data = this.$store.state.addressInformation
				// #endif
				// #ifdef H5
				this.data = this.$route.query.params
				// #endif
				if (this.data != undefined) {
					this.change = true
					let address = this.data
					const res = await addressInfo(address)
						.catch(err => {
							if (err.statusCode == 404) {
								this.$u.toast('该地址并不存在')
								setTimeout(() => {
									this.$u.route({
										type: 'reLaunch',
										url: "/pages/center/address/address"
									})
								}, 1500)
							}
						})
					if (res) {
						this.name = res.address.name
						this.address = res.address.address
						this.phone = res.address.phone
						this.location = res.address.province + "-" + res.address.city + "-" + res.address.county
						this.province = res.province
						this.city = res.address.city
						this.area = res.address.county
						if (res.address.is_default == 1) {
							this.is_default = true
						}
					}
				}
			},
			async add() {
				let Default = 0
				if (this.is_default == true) {
					Default = 1
				}
				const params = {
					name: this.name,
					address: this.address,
					phone: this.phone,
					province: this.province,
					city: this.city,
					county: this.area,
					is_default: Default,
				}
				const res = await addAddress(params)
				if (this.$store.state.statusCode != 422) {
					this.$u.toast('添加地址成功')
					setTimeout(() => {
						this.$u.route({
							type: 'reLaunch',
							url: "/pages/auth/auth"
						})
					}, 1500)
				}
			},
			async dataModify() {
				let Default = 0
				if (this.is_default == true) {
					Default = 1
				}
				const params = {
					name: this.name,
					address: this.address,
					phone: this.phone,
					province: this.province,
					city: this.city,
					county: this.area,
					is_default: Default,
				}
				let address = this.data
				await addressModify(address, params)
				if (this.$store.state.statusCode != 422) {
					this.$u.toast('修改成功')
					setTimeout(() => {
						this.$u.route({
							type: 'reLaunch',
							url: "/pages/auth/auth"
						})
					}, 1500)
				}

			},
			async dataDelete() {
				await addressDelete(this.data)
					.then(() => {
						this.$u.toast('删除成功')
						setTimeout(() => {
							this.$u.route({
								type: 'reLaunch',
								url: "/pages/auth/auth"
							})
						}, 1500)
					})
			},
			setDefault() {
				this.is_default = !this.is_default
			},
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .line {
		color: $u-light-color;
		font-size: 28rpx;
	}

	.btn_grow {
		margin-top: 20px;
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	/* 	#ifdef MP-WEIXIN */
	.btn-delete {
		margin-top: 20px;
	}
	/* #endif */

	.btn {
		font-size: 20px;
		margin-top: 20px;
		height: 100rpx;
	}

	.wrap {
		background-color: #f2f2f2;

		.top {
			background-color: #ffffff;
			border-top: solid 2rpx $u-border-color;
			padding: 22rpx;

			.item {
				display: flex;
				font-size: 32rpx;
				line-height: 100rpx;
				align-items: center;
				border-bottom: solid 2rpx $u-border-color;

				.left {
					width: 180rpx;
				}

				input {
					text-align: left;
				}
			}

			.address {
				padding: 20rpx 0;

				textarea {
					// width: 100%;
					height: 150rpx;
					background-color: #f7f7f7;
					line-height: 60rpx;
					margin: 40rpx auto;
					padding: 20rpx;
				}
			}

			.site-clipboard {
				padding-right: 40rpx;

				textarea {
					// width: 100%;
					height: 150rpx;
					background-color: #f7f7f7;
					line-height: 60rpx;
					margin: 40rpx auto;
					padding: 20rpx;
				}

				.clipboard {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 26rpx;
					color: $u-tips-color;
					height: 80rpx;

					.icon {
						margin-top: 6rpx;
						margin-left: 10rpx;
					}
				}
			}
		}

		.bottom {
			padding: 20rpx;
			padding-top: 0;
			background-color: #ffffff;
			font-size: 28rpx;

			.default {
				display: flex;
				justify-content: space-between;
				border-bottom: solid 2rpx $u-border-color;
				line-height: 64rpx;

				.tips {
					font-size: 24rpx;
				}

				.right {
					padding-top: 20rpx;
				}
			}
		}
	}
</style>
