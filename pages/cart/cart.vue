<template>
	<view class="wrap">
		<template v-if="vuex_Authorization">
			<view class="cartGoodsList" v-if="goodsList.length">
				<view class="cartGoods" v-for="goods in goodsList" :key="goods.id">
					<view>
						<u-checkbox-group placement="column" @change="checkChange(goods.id)">
							<u-checkbox :checked="goods.is_checked?true:false" :name="goods.id" size="25"
								shape="circle"></u-checkbox>
						</u-checkbox-group>
					</view>
					<view class="goodsInfo">
						<view @tap='jump(`/pages/goods/goods-detail`,goods.goods_id)'>
							<u-image mode="aspectFit" border-radius="15" width="200rpx" height="200rpx"
								:src="goods.goods.cover">
							</u-image>
						</view>
						<view class="goodsBaseInfo">
							<view class="priceNum" @tap='jump(`/pages/goods/goods-detail`,goods.goods_id)'>
								<text class="title">《{{goods.goods.title}}》</text>
								<br>
								<view class="stock">
									库存:<text style="color:red">{{goods.goods.stock}}</text>
								</view>
							</view>
							<view class="priceNum number">
								<text class="price u-font-34">￥{{goods.goods.price}}</text>
								<u-number-box v-model="goods.num" :min="1" :max="goods.goods.stock" :name="goods.id"
									@change="numChange"></u-number-box>
								<u-icon @tap="removeGoods(goods.id)" name="trash" color="#e83333" size="36">
								</u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="empty" v-else>
				<u-empty text="购物车空空如也" mode="car"></u-empty>
			</view>
			<view class="bottomFixed">
				<view class="checkbox">
					<u-checkbox-group  placement="column" @change="if_allCheck">
						<u-checkbox label="全选" :checked="allCheck" size="25" shape="circle"></u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="calculate_price u-flex-7 u-row-around">
					<view class="title_price">
						<text class="title">合计:</text>
						<text class="price">￥{{totalPrice}}</text>
					</view>
					<view class="button">
						<u-button type="primary" :ripple="true" shape="square" :disabled="totalPrice>0?false:true" @click="submit">去结算</u-button>
					</view>
				</view>

			</view>
		</template>
	</view>
</template>

<script>
	import {
		cartGoods,
		numChange,
		delCartGoods,
		isCheck,
		allCheck
	} from "@/config/api.js"
	export default {
		data() {
			return {
				goodsList: [],
				allCheck: false,
			}
		},
		onShow() {
			if (this.$u.utils.isLogin()) {
				this.getCartGoods()
			}
		},
		computed: {
			// 选中商品的总价
			totalPrice() {
				return this.goodsList.filter((goods) => { //过滤掉没有选中商品
					if (goods.is_checked) {
						return true
					}
				}).reduce((pre, goods) => { //价格累加
					return parseInt(pre) + parseInt(goods.goods.price) * goods.num //乘商品数量
				}, 0)
			}
		},
		methods: {
			// 商品详情跳转
			jump(url, id) {
				this.$u.route({
					url,
					params: {
						id
					}
				})
			},
			async getCartGoods() {
				const params = {
					include: "goods"
				}
				const data = await cartGoods(params)
				this.goodsList = data.data
			},
			// 商品数量改变
			async numChange(val) {
				// 通过设置index获取（购物车商品的id）既val中第二参数
				const {
					value,
					name
				} = val
				console.log(val)
				await numChange(val)
			},
			// 移出购物车
			async removeGoods(id) {
				const params = {
					carts_id: id
				}

				// delCartGoods
				await delCartGoods(id)
				// 删除商品后进行提示   再次调用获取商品列表
				this.$u.toast("移出购物车成功")
				this.getCartGoods()
			},
			//改变商品的选中状态
			async checkChange(id) {
				await isCheck(id)
				this.getCartGoods()
			},
			//购物车全选or全不选
			async if_allCheck() {
				this.allCheck = this.allCheck ? false : true
				await allCheck(this.allCheck)
				this.getCartGoods()
			},
			submit (){
				let cartArr = []
				//选中被选中的商品
				this.goodsList.every(item => {
					if (item.is_checked==1) {
						cartArr.push(item)
					}
					return item.is_checked
				})
				this.$u.vuex('vuex_cart',cartArr)
				this.$u.route({
					url:"pages/cart/preview",
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		min-height: 80vh;

		.empty {
			height: 80vh;
		}

		.loading {
			text-align: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		.title,
		.price {
			font-weight: 800;
		}

		.price {
			color: #e83333;
		}

		.cartGoodsList {
			.cartGoods {
				display: flex;
				padding: 8px;
				align-items: center;

				.goodsInfo {
					display: flex;
					padding: 5px;
					width: 100%;
					background-color: rgb(251, 250, 251);

					.goodsBaseInfo {
						display: flex;
						justify-content: space-between;
						width: 100%;
						height: 200rpx;
						flex-direction: column;

						.priceNum {
							width: 100%;

							.stock {
								text-align: right;
								position: relative;
								top: 14px;
								font-size: 14px;
								color: #cccccc;
							}

							.title {
								padding-left: 10rpx;
							}
						}

						.number {
							padding-top: 5px;
							display: flex;
							justify-content: space-between;
						}
					}
				}
			}
		}

		.bottomFixed {
			display: flex;
			padding: 7px;
			align-items: center;
			justify-content: space-around;
			position: fixed;
			left: 0;
			right: 0;
			background-color: #fff;
			
			.checkbox{
				flex: 5;
			}
			
			.calculate_price{
				display: flex;
				flex: 7;
				justify-content: space-around;
				align-items: center;

				.button{
					width: 90px;
				}
			}
		}

		/*#ifdef H5*/
		.bottomFixed {
			bottom: 100rpx;
		}

		/*#endif*/
		/*#ifdef MP-WEIXIN*/
		.bottomFixed {
			bottom: 0;
			z-index: 99999;
		}

		/*#endif*/

	}
</style>
