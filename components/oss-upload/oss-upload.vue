<template>
	<view>

		<u-upload  :fileList="fileList1" @afterRead="afterRead" name="1" :maxSize="5 * 1024 *1024" :maxCount="1" :previewFullImage="true">
			<image :src="acatar_url" style="width: 80px;height: 80px;border-radius: 50%;"></image>
			<!-- <u-avatar :slot="addBtn" shape="circle" :src="vuex_user.avatar_url" size="100"></u-avatar> -->
		</u-upload>

		<!-- <u-avatar :slot="addBtn" shape="circle" :src="vuex_user.avatar_url" size="100"></u-avatar> -->
	</view>
</template>

<script>
	import {
		uploadfile,
		getUser
	} from "@/config/api.js"
	// import {
	// 	OSS_Token,
	// 	avatar,
	// 	updateUser
	// } from '@/config/api.js'
	
	let _this={}
	export default {
		data() {
			return {
				fileList1: [],
				host:'',
				ossToken:{},
				upFileName:'',
				acatar_url:''
			}
		},
		async created(){
			_this = this
			const res = await getUser()
			const user = await getUser()
			this.acatar_url = user.acatar_url
		},
		methods: {
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				//请求api 获取osstoken
				// const ossToken = await OSS_Token()
				// this.ossToken = ossToken
				// // console.log(this.ossToken)
				// //设置上传域名
				// _this.host = ossToken.host
				// const params = {
				// 	file:event.file
				// }
				
				// const ossToken = await uploadfile(params)
				
				console.log(event.file)
				
				// console.log(event.file)
				//#ifdef H5
				const fileName= event.file.name
				//#endif 
				
				//#ifndef H5
				const fileName= event.file.path
				//#endif
				
				//唯一的文件名
				// const suffix = fileName.slice(fileName.lastIndexOf('.'))
				// const upFileName = _this.$u.guid(20) + suffix
				// this.upFileName = upFileName
				// console.log(upFileName)
				
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				
				// lists.map((item) => {
				// 	this[`fileList${event.name}`].push({
				// 		...item,
				// 		status: 'uploading',
				// 		message: '上传中'
				// 	})
				// })
				
				
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://114.55.94.207:3001/api/users/uploadfile', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							"user_id": this.$store.state.vuex_user.id
						},
						 success:async (res) => {
							 //请求api更新用户头像
							// await avatar({avatar:this.upFileName})
							const user = await getUser()
							this.acatar_url = user.acatar_url
						
							//更新用户信息
							// updateUserinfo()
							//更新缓存的用户信息
							this.$u.toast('更新成功')
						}
					});
				})
			},
		}

	}
</script>

<style>

</style>
