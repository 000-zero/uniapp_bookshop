<template>
	<view>
		<u--form :errorType="errorType" labelPosition="left" :model="model1" :rules="rules" ref="form1">
			<u-form-item required="" label="姓名" prop="userInfo.name" borderBottom ref="item1">
				<u--input v-model="model1.userInfo.name" border="none"></u--input>
			</u-form-item>
		</u--form>
		<u-button @click="submit">提交</u-button>
	</view>
</template>

<script>
	import {
		updateUser,
		getUser
	} from "@/config/api.js"
	export default {
		data() {
			return {
				errorType: 'toast',
				model1: {
					userInfo: {
						name: '',
						sex: '',
					}
				},
				rules: {
					'userInfo.name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},

				}
			}
		},
		onReady() {
			this.model1.userInfo.name = this.vuex_user.name
		},
		methods: {

			async update() {
			
				const params = {
					name:this.model1.userInfo.name
				}
				//更新用户信息
				await updateUser(params)
				this.$u.utils.updateUserinfo()
			},
			submit() {
				this.$refs.form1.validate().then(res => {
					console.log(this.model1.userInfo)

					uni.$u.toast('校验通过')
					this.update()
				}).catch(errors => {
					uni.$u.toast('校验失败')
					console.log(errors)
				})
			}


		}
	}
</script>

<style>

</style>
