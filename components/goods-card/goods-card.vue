<template>
	<navigator class="goods-item" :url="`/pages/goods/goods-detail?id=${item.id}`">
		<u--image width="120px" height="300rpx"
			:src="item.cover"></u--image>
		<view class="good-title">
			{{item.title}}
		</view>
		<view class="goods">
			<view class="price">价格:{{item.price}}</view>
			<view class="sales">销售量：{{item.sales}}</view>
		</view>
	</navigator>
</template>

<script>
	export default {
		name:"goods-card",
		props:{
			item:{
				type:Object,
				default(){
					return{}
				}
			}
		},
		onLoad() {
			// console.log(item.id)
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.goods-item {
		padding: 30rpx;

		.goods {
			display: flex;
			justify-content: space-between;

			.price {
				color: red;
			}

			.sales {
				color: #888;
			}
		}

		.good-title {
			margin-top: 30rpx;
			box-shadow: 10rpx 12rpx 20rpx 0 rgba(0, 0, 0, .1);
			margin: 20rpx 0;
			color: black;
			font-size: 32rpx;
			text-align: center;
		}

	}
</style>
