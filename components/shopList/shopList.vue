<template>
	<view class="cartItem u-flex">
		<view class="left">
			<u-image width="200rpx" height="240rpx" border-radius="20" :src="item.goods.cover"></u-image>
		</view>
		<view class="right">
			<view class="title">
				<text>《{{item.goods.title}}》</text>
			</view>
			<view class="bottom">
				<text class="price">￥{{item.goods.price}}</text>
				<text class="num">x{{item.num}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "shopList",
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cartItem {
		display: flex;
		border-bottom: 2px solid #eee;
		border-radius: 20rpx;
		padding-bottom: 10rpx;
		margin-bottom: 20rpx;
		background-color: #fff;

		.right {
			width: 100%;
			height: 120px;

			.title {
				margin-top: 20rpx;
				height: 80px;
				font-size: 20px;
				font-weight: bold;
			}

			.bottom {
				display: flex;
				.price {
					display: flex;
					flex: 9;
					font-size: 20px;
					font-weight: bold;
					color: #2979ff;
					margin-left: 15rpx;
				}

				.num {
					display: flex;
					flex: 1;
					margin-right: 30rpx;

					a {
						color: #2979ff;
						font-size: 20px;
						font-weight: bold;
						margin-left: 10rpx;
					}
				}
			}
		}
	}
</style>
