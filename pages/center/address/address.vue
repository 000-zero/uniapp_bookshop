<template>
	<view>
		<view class="item" v-for="(res, index) in siteList" :key="res.id">
			<view class="u-m-r-50" @click="choose(res.id)">
				<view class="top">
					<view class="name">{{ res.name }}</view>
					<view class="phone">{{ res.phone }}</view>
					<view class="tag">
						<text v-if="res.is_default == 1">默认</text>
					</view>
				</view>
				<view class="bottom">
					{{res.province+"-"+res.city+"-"+res.county+"-"+res.address}}
				</view>
			</view>
			<u-icon class="set" name="edit-pen" @click="toSite(res.id)" :size="40" color="#999999"></u-icon>
		</view>
		<view class="addSite" @tap="toSite">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>
	</view>
</template>

<script>
	import {address} from "@/config/api.js"
export default {
	data() {
		return {
			siteList: []
		};
	},
	onShow() {
		this.getData()
	},
	methods: {
		async getData() {
			const res = await address()
			this.siteList = res.data
		},
		choose(data) {
			if(this.$store.state.address_preview == "true") {
				let params = data
				// #ifdef MP-WEIXIN
				uni.$u.vuex('data', params)
				// #endif
				this.$u.route({
					type:'reLaunch',
					url: "/pages/cart/preview",
					params:{params}
				})
			}	
		},
		toSite(data){
			let params = ""
			if(typeof(data)=="number") {
				params = data
			}
			// #ifdef MP-WEIXIN
			uni.$u.vuex('addressInformation', params)
			// #endif
			this.$u.route({
				url:"pages/center/address/addSite",
				params:{params}
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.set {
	position: absolute;
	right: 20rpx;
	top: 70rpx;
}
.item {
	padding: 40rpx 20rpx;
	border-bottom: 1px solid #eee;
	position: relative;
	.top {
		display: flex;
		font-weight: bold;
		font-size: 34rpx;
		.phone {
			margin-left: 60rpx;
		}
		.tag {
			display: flex;
			font-weight: normal;
			align-items: center;
			text {
				display: block;
				width: 60rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: #ffffff;
				font-size: 20rpx;
				border-radius: 6rpx;
				text-align: center;
				margin-left: 30rpx;
				background-color:rgb(49, 145, 253);
			}
			.red{
				background-color:red
			}
		}
	}
	.bottom {
		display: flex;
		margin-top: 20rpx;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
}
.addSite {
	display: flex;
	justify-content: space-around;
	width: 600rpx;
	line-height: 100rpx;
	position: absolute;
	bottom: 30rpx;
	left: 80rpx;
	background-color: #2979ff;
	border-radius: 15rpx;
	font-size: 30rpx;
	.add{
		display: flex;
		align-items: center;
		color: #ffffff;
		.icon{
			margin-right: 10rpx;
		}
	}
}
</style>
