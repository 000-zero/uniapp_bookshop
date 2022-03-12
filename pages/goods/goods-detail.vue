<template>
	<view>
		<template class="wrap">
			<view class="goods-show">
				<!-- 商品图片显示 -->
				<view class="cover_url">
					<u-image height='250' :src="goods.cover" mode="aspectFit"></u-image>
				</view>
			</view>
			<view>
				<!-- 商品信息 -->
				<view class="goods-info">
					<view class="title">
						<view class="skeleton" v-if="goods.title == null">
							<u-skeleton rows="0" :title="true" titleWidth="100%" :loading="true"></u-skeleton>
						</view>
						<view v-else>
							<text>《{{goods.title}}》</text>
						</view>
					</view>
					<view class="info">
						<text style="color: red; font-size: 16px;">￥{{goods.price}}</text>
						<text class="small">库存:{{goods.stock}}</text>
						<text class="small">销量:{{goods.sales}}</text>
					</view>
				</view>
				<!-- tabs组件 -->
				<view class="u_tabs">
					<u-tabs :list="tabsList" :lineHeight='2.5' :lineWidth="35"
						itemStyle="{ width: 60px;height:40px;margin:30px}" @click="tabsChange">
					</u-tabs>
				</view>
				<view>
					<!-- 商品详情区 -->
					<template v-if="currentSort==0">
						<u-parse :content="goods.details"></u-parse>
					</template>
					<!-- 商品评论区 -->
					<template class="hb-comment" v-if="currentSort==1">
						<hb-comment @add="add" @del="del" @reply="reply" @like="like" @focusOn="focusOn"
							:deleteTip="'确认删除？'" :cmData="commentData" v-if="commentData"></hb-comment>
						<template v-if="commentData.commentSize == 0">
							<!-- 评论为空 -->
							<u-empty text="暂无评论" src="order"></u-empty>
						</template>
					</template>
					<!-- 商品推荐区 -->
					<template v-if="currentSort==2">
						<u-grid :border="false" col="2">
							<u-grid-item v-for="(item,index) in likeGoods" :key="index">
								<goods-card :item="item"></goods-card>
							</u-grid-item>
						</u-grid>
					</template>

				</view>
			</view>
			<!-- 提交订单栏 -->
			<view class="navigation">
				<view class="left">
					<view class="item collect" @tap="collect">
						<u-icon v-if="!collectNum" name="heart" size="28" :color="$u.color['contentColor']"></u-icon>
						<u-icon v-else name="heart-fill" :size="28" color="#2979ff"></u-icon>
						<view class="text u-line-1">{{collectNum?"已收藏":"收藏"}}</view>
					</view>
					<view class="item" @tap="toCart">
						<view class="box">
							<u-badge :value="cartNum" absolute :offset="[-9, -10]" :type="type"></u-badge>
						</view>
						<u-icon name="shopping-cart" :size="28" :color="$u.color['contentColor']"></u-icon>
						<view class="text u-line-1">购物车</view>
					</view>
				</view>
				<view class="right">
					<u-button :disabled="goods.stock?false:true" class="cart btn" @click="addCart" :ripple="true"
						type="primary">加入购物车</u-button>
				</view>
			</view>

		</template>
	</view>
</template>

<script>
	import {
		getGoodsDetail,
		cartGoods,
		isCollect,
		addCart,
		getcomments,
		addcomments,
		commentDelete,
		hasLike
	} from "@/config/api.js"
	export default {
		data() {
			return {
				goods: {},
				commentData: {},
				type: "warning",
				tabsList: [{
					name: '商品详情'
				}, {
					name: '商品评论',
					count: 0
				}, {
					name: '推荐商品'
				}],
				currentSort: 0,
				// 推荐商品
				likeGoods: {},
				commentList: {},
				collectNum: 0,
				cartNum: 0,
				goods_id: null,
				userID: null
			}
		},
		onLoad(option) {
			this.goods_id = option.id
			this.getgoodsInfo()
			this.cartLen()
			this.init()
		},
		methods: {

			init() {
				getcomments(this.goods_id).then(res => {
					console.log(res)
					this.commentData = {
						"commentSize": res.data.commentList.length,
						"comment": res.data.commentList
					}
				})
			},

			reply(x) {
				this.userID = x
			},

			focusOn() {},

			async add(data) {
				const {
					content
				} = data
				const params = {
					content,
					pId: this.userID,
					goods_id: this.goods_id
				}
				await addcomments(params)
				this.init()
			},

			async del(commentId) {
				console.log(commentId)
				await commentDelete(commentId).then(res => {
					console.log(res)
				})
				this.init()
			},

			async like(commentId) {
				await hasLike({
					commentId
				})
				this.init()
			},

			//api获取商品信息
			async getgoodsInfo() {
				const params = {}
				params.goods = this.goods_id
				const res = await getGoodsDetail(params)

				//商品的基本信息
				this.goods = res.goods
				// console.log(res)
				console.log(this.goods)
				// 商品评论
				this.commentList = res.goods.comments
				// this.tabsList[1].count = res.goods.comments.length
				// 推荐商品
				this.likeGoods = res.like_goods
				// 是否收藏
				this.collectNum = res.goods.is_collect
				// console.log(res)
			},
			tabsChange(item) {
				this.currentSort = item.index

			},
			//收藏节流
			collect() {
				this.$u.throttle(this.collectNot, 1500)
			},
			// 收藏和取消收藏
			async collectNot() {
				if (!this.$u.utils.isLogin()) {} // 如果没有登录先去登录
				else {
					// 收藏和取消收藏提示
					if (this.collectNum) {
						this.$u.toast("取消收藏成功")
					} else {
						this.$u.toast("收藏成功")
					}
					this.collectNum = !this.collectNum
					// 请求收藏接口
					const params = {}
					params.goods = this.goods_id
					const test1 = await isCollect(params)
				}
			},
			async addCart() {
				if (!this.$u.utils.isLogin()) {} // 如果没有登录先去登录
				else {
					this.$u.toast("添加购物车成功！")
					this.cartNum++
					// 准备参数
					const params = {
						goods_id: this.goods_id
					}
					// 发送请求
					const res = await addCart(params)
				}
			},
			async cartLen() {
				// 如果登录成功在调用这个接口
				const params = {
					include: "goods"
				}
				if (this.vuex_token) {
					// 获取购物车商品数量
					const res = await cartGoods(params)
					// 累加总的商品数量
					this.cartNum = res.data.reduce((pre, item) => {
						return parseInt(pre) + parseInt(item.num);
					}, 0)
				}
			},
			/* 跳转到购物车页面 */
			toCart() {
				if (!this.$u.utils.isLogin()) {} else {
					this.$u.route({
						type: 'switchTab',
						url: 'pages/cart/cart'
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.goods-show {
		display: flex;
		justify-content: center;
	}

	.hb-comment {
		padding-bottom: 35px;
	}

	.title {
		display: flex;
		justify-content: center;
		font-weight: bolder;
		font-size: 20px;
	}

	.box {
		position: absolute;
		color: white;
		width: 100%;
	}

	.info {
		display: flex;
		justify-content: space-around;

		.small {
			color: #a5a5a5;
		}
	}

	.u_tabs {
		display: flex;
		justify-content: space-around;
		margin-top: 10px;
	}

	.navigation {
		position: fixed;
		bottom: -6px;
		left: 0;
		right: 0;
		display: flex;
		border: solid 2rpx #f2f2f2;
		background-color: #ffffff;
		padding: 16rpx 0;
		justify-content: space-between;

		.left {
			flex: 3;
			display: flex;
			font-size: 20rpx;
			align-items: flex-end;
			justify-content: space-around;

			.collect {
				position: absolute;
				bottom: 0;
			}

			.item {
				position: relative;

			}
		}

		.right {
			flex: 9;
			display: flex;
			font-size: 28rpx;
			justify-content: flex-end;
			align-items: center;

			.btn {
				text-align: center;
				line-height: 66rpx;
				width: 90%;
				border-radius: 10rpx;
				color: #ffffff;
			}

			.cart {
				background-color: #2979ff;
				margin-right: 30rpx;
			}

			.buy {
				background-color: #ff7900;
			}
		}
	}
</style>
