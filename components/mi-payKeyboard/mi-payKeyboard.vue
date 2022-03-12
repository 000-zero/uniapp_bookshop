<template>
	<view class="keyboard-content">
		<view class="content_">
			<view class="title">请输入支付密码</view>
			<view class="password-error">
				<text v-if="passwordError">对不起，您的支付密码不正确，请重新输入</text>
			</view>
			<view class="input-content">
				<view class="input_">
					<view v-for="item in inputArr">
						<view v-if="item === '·'" class="dot"></view>
						<text v-else></text>
					</view>
				</view>
			</view>
			<view class="forget" @tap="forgetPass">忘记密码</view>
			
			<view class="board-content">
				<view class="title_">
					<image src="https://z3.ax1x.com/2021/03/31/cApnN4.png" mode=""></image>
					<text> {{ title }} </text>
				</view>
				
				<view class="board">
					<view class="key" hover-class="hoverStyle" @tap="inputNum(item.id)" :class="{small: item.id === 'cancel' || item.id === 'del'}" v-for="item in boardArr">
						<image class="backspace" v-if="item.id === 'del'" src="https://z3.ax1x.com/2021/03/31/cAp1jx.png" mode=""></image>
						<text v-else>{{item.text}}</text>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '安全键盘',
			}
		},
		data() {
			return {
				inputArr: ['','','','','',''],
				passwordInput: '',
				
				passwordError: false,
				boardArr: [
					{
						id: '1',
						text: '1'
					},{
						id: '2',
						text: '2'
					},{
						id: '3',
						text: '3'
					},{
						id: '4',
						text: '4'
					},{
						id: '5',
						text: '5'
					},{
						id: '6',
						text: '6'
					},{
						id: '7',
						text: '7'
					},{
						id: '8',
						text: '8'
					},{
						id: '9',
						text: '9'
					},{
						id: 'cancel',
						text: '取消'
					},{
						id: '0',
						text: '0'
					},{
						id: 'del',
						text: 'del'
					},
				],
			};
		},
		
		methods: {
			// 输入密码
			inputNum(id) {
				if(id === 'del'){ // 点击[删除]按钮
					this.del()
					return
				}
				if(id === 'cancel'){ // 点击[取消]按钮
					this.cancel()
					return
				}
				if(this.passwordInput.length > 11){  // 6位密码输入完毕 
					return
				}
				
				let passwordInput = this.passwordInput
				this.passwordInput = passwordInput + id + '|'
				
				this.initPass()
				
				
				if(this.passwordInput.length === 12){ // 输入完毕
				
					this.testPassword()
				}
			},
			// 删除一位
			del() {
				this.passwordInput = this.passwordInput.substring(0, this.passwordInput.length - 2)
				this.initPass()
			},
			// 取消 可退出输入
			cancel() {
				this.inputArr = ['','','','','','']
				this.passwordInput = ''
				this.$emit('close')
			},
			
			initPass() {
				let arr = this.passwordInput.split('|');
				arr.pop()
				
				
				let arr_ = []
				for(let i = 0; i< 6; i++){
					if(i < arr.length){
						arr_.push('·')
					}else{
						arr_.push('')
					}
				}
				this.inputArr = arr_
			},
			
			// 输入完毕之后 验证密码是否正确
			testPassword() {
				let arr = this.passwordInput.split('|')
				arr.pop()
				let passStr = arr.join('')
				
				
				// 测试数据  在此处可添加个人的业务代码
				var isTrue = true
				if(isTrue) {
					this.$emit('success', passStr)
					this.passwordError = false
					this.inputArr = ['','','','','','']
					this.passwordInput = ''
				}else{
					this.passwordError = true
					this.inputArr = ['','','','','','']
					this.passwordInput = ''
				}
			},
			// 点击忘记密码 可跳转页面或自定义业务
			forgetPass() {
				this.cancel()
				uni.showToast({
					title: '忘记密码'
				})
			},
			

		}
	}
</script>

<style lang="scss" scoped>
	.hoverStyle{
		background: #e5e5e5;
	}
	.keyboard-content{
		background: rgba($color: #000000, $alpha: .7);
		height: 100vh;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-direction: column;
		.content_{
			background: #FFFFFF;
			width: 100%;
			.title{
				text-align: center;
				padding: 20rpx 0;
				font-weight: bold;
				border-bottom: 1px solid #dddddd;
				background: #f7f7f7;
				color: #1F2324;
				font-size: 30rpx;
				letter-spacing: 1rpx;
			}
			.password-error{
				background: #f7f7f7;
				padding: 10rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #F00;
				font-size: 12rpx;
			}
			.input-content{
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				background: #f7f7f7;
				.input_{
					display: flex;
					justify-content: center;
					align-items: center;
					border: 1px solid #D9D9D9;
					background: #ffffff;
					>view{
						width: 90rpx;
						height: 90rpx;
						border-right: 1px solid #dddddd;
						display: flex;
						justify-content: center;
						align-items: center;
						&:last-child{
							border-right: none;
						}
						.dot{
							width: 20rpx;
							height: 20rpx;
							background: #000000;
							border-radius: 50%;
						}
					}
				}
			}
			.forget{
				color: #666;
				font-size: 24rpx;
				background: #f7f7f7;
				padding: 20rpx 40rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			.board-content{
				.title_{
					display: flex;
					justify-content: center;
					align-items: center;
					color: #222;
					font-size: 20rpx;
					padding: 10rpx 0;
					>image{
						width: 22rpx;
						height: 26rpx;
						margin-right: 8rpx;
					}
				}
				.board{
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					border-top: 1px solid #f2f2f2;
					.key{
						height: 110rpx;
						flex: 33%;
						display: flex;
						justify-content: center;
						align-items: center;
						border: 1px solid #f2f2f2;
						color: #222;
						font-size: 50rpx;
						border-left: none;
						border-top: none;
					}
					.small{
						font-size: 34rpx;
						letter-spacing: 2rpx;
						background-color: #f7f7f7;
						color: #686868;
					}
				}
				
			}
			.backspace{
				width: 45rpx; 
				height: 33rpx;
			}
		}
	}
</style>
