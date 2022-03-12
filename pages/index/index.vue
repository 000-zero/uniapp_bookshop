<template>
	<view>
		<!-- <navigator class="goods-item" :url="`/pages/goods/goods-detail?id=${slides_id}`"> -->
			<u-swiper imgMode='aspectFit' :list="slides" keyName="url" :indicator="true" indicatorMode="dot"
				height="350rpx" >
			</u-swiper>
<!-- 		</navigator> -->

		<view class="u_tabs">
			<u-tabs :list="tabs" :lineHeight='1.5' :lineWidth="25" :itemStyle="{ width: '70px',height:'30px'}"
				@click="clicktabs">
			</u-tabs>
		</view>
		<u-grid :border="false" col="2">
			<u-grid-item v-for="item in goods">
				<goods-card :item="item"></goods-card>
			</u-grid-item>
		</u-grid>

		<!-- <view class="u-demo-block__content">
			<u-skeleton rows="3" title :loading="false"></u-skeleton>
		</view> -->
		<!-- <u-row gutter="16" class="row">
			<u-col span="6" v-for="item in goods">

				<navigator class="goods-item">
					<u--image width="100%" height="300rpx"
						:src="item.cover_url"></u--image>
					<view class="good-title">
						{{item.title}}
					</view>
					<view class="goods">
						<view class="price">{{item.price}}</view>
						<view class="sales">{{item.sales}}</view>
					</view>
				</navigator>

			</u-col>

		</u-row> -->
	</view>
</template>

<script>
	import {
		getindex,
		gettoken,
		getUser
	} from '@/config/api.js';
	export default {
		data() {

			return {
				title: 'Hello',
				slides: [],
				slides_id: null, //轮播图id索引
				goods: [],
				page: 1,
				currentSort: 0,
				tabs: [{
						name: '默认'
					},
					{
						name: '销量'
					},
					{
						name: '推荐'
					},
					{
						name: '最新'
					}
				]
			}
		},
		async onLoad() {
			// this.$u.utils.isLogin()
			const res = await getindex()
			// console.log(res)
			// const getuser = await getUser()
			// console.log(getuser)
			this.getData()
			// console.log(this.$store.state.vuex_user.name)
		},
		methods: {
			clicktabs(item) {
				this.currentSort = item.index
				this.goods = []
				this.page = 1
				this.getData()
			},

			// //轮播图事件
			// click_wiper(index) {
			// 	console.log(index)
			// 	console.log(this.slides[index])
			// 	// this.slides_id = this.slides[index].id
			// },

			async getData() {
				const params = {
					page: this.page,
				}
				//首页分类条件
				if (this.currentSort == 1) params.sales = 1
				else if (this.currentSort == 2) params.recommed = 1
				else if (this.currentSort == 3) params.new = 1
				const res = await getindex(params)
				// console.log(res.goods.data)
				this.slides = res.slides
				this.goods = [...this.goods, ...res.goods.data]
			}
		},
		onReachBottom() {
			this.page += 1
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
	.row {
		display: flex;
		flex-wrap: wrap;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.u_tabs {
		display: flex;
		justify-content: space-around;
		margin-top: 15px;

	}
</style>
