<template>
	<view>
		<view class="mine-top">
			<view class="mine-top-one">
				<view v-if="userInfo.id" class="left" @click="handleShowUserInfo">
					<u-avatar class="user-avatar" color="#ccc" :src="baseUrl + '/' + userInfo.avatar" size="44"
						fontSize="36" bg-color="#f6f6f6"></u-avatar>
					<text>{{ userInfo.nickname }}</text>
				</view>
				<view v-else class="left" @click="handleLoginOrRegister">
					<u-avatar class="user-avatar" color="#ccc" icon="account-fill" size="44" fontSize="36"
						bg-color="#f6f6f6"></u-avatar>
					<text>登录 / 注册</text>
				</view>
				<view class="right">
					<view>
						<u-icon name="calendar-fill" color="#ffbb00" size="18"></u-icon>
						<text>打卡</text>
					</view>
				</view>
			</view>
		</view>
		<view class="mine-body">
			<view class="mine-pictures" v-if="userInfo.id">
				<u-collapse @change="changeCollapse" @close="closeCollapse" @open="openCollapse" accordion :value="valueCollapse">
					<u-collapse-item title="个人图片管理" icon="/static/images/图片管理.png" name="Docs guide">
						<view class="u-collapse-content">
							<view class="mine-pictures-title">上传和更改您的个人图片</view>
							<u-line></u-line>
							<view class="picture-item">
								<view class="upload">
									<u-icon name="camera-fill" @click="uploadBackground" color="#333" size="24"></u-icon>
									<image v-if="info.money_background" :src="baseUrl + '/' + info.money_background" @click="showMoneyBackgroundView"></image>
									<u-icon v-if="info.money_background" name="trash" @click="showModalBackground=true" color="#333" size="16"></u-icon>
								</view>
								<view class="tip">
									<view>记账页面背景图片</view>
									<view>推荐像素: 375*750</view>
								</view>
							</view>
							<u-line></u-line>
							<view class="picture-item">
								<view class="upload">
									<u-icon name="camera-fill" @click="uploadAvatar" color="#333" size="24"></u-icon>
									<image v-if="info.money_avatar" :src="baseUrl + '/' + info.money_avatar" @click="showMoneyAvatarView"></image>
									<u-icon v-if="info.money_avatar" name="trash" @click="showModalAvatar=true" color="#333" size="16"></u-icon>
								</view>
								<view class="tip">
									<view>记账页面头像</view>
									<view>推荐像素: 100*100</view>
								</view>
							</view>
							<u-line></u-line>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>
		</view>
		<image-cropper :crop-width="200" :crop-height="200" :show-reset-btn="false" :show-rotate-btn="false"
			:src="tempAvatarFilePath" @confirm="confirmAvatar" @cancel="cancelAvatar"></image-cropper>
		<u-modal :show="showModalBackground" showCancelButton confirmColor="#ffbb00" @confirm="deleteMoneyBackground"
			@cancel="showModalBackground=false" content="确定删除记账页面背景图片并还原默认吗？"></u-modal>
		<u-modal :show="showModalAvatar" showCancelButton confirmColor="#ffbb00" @confirm="deleteMoneyAvatar"
			@cancel="showModalAvatar=false" content="确定删除记账页面头像并还原默认吗？"></u-modal>
	</view>
</template>

<script>
	import Vue from 'vue';
	import {
		registerAction,
		loginAction,
		getUserInfoByUsernameAction,
		moneyAvatarUploadAction,
		moneyBackgroundUploadAction,
		getInfoByUserIdAction,
		updateInfoByUserIdAction
	} from '@/service/service'
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	export default Vue.extend({
		data() {
			return {
				baseUrl: process.env.VUE_APP_API_BASE_URL,
				showType: 'login',
				showPopup: false,
				userInfo: {
					username: '',
					nickname: '',
					primary_key: '',
					id: 0,
					email: '',
					phone: '',
					avatar: '',
					team_id: 0,
					team_name: ''
				},
				tempAvatarFilePath: '',
				cropAvatarFilePath: '',
				tempBackgroundFilePath: '',
				cropBackgroundFilePath: '',
				info: {
					id: 0,
					money_avatar: '',
					money_background: '',
					user_id: 0
				},
				valueCollapse: '',
				showModalBackground: false,
				showModalAvatar: false
			};
		},
		components: {
			ImageCropper
		},
		onShow() {
			if (uni.getStorageSync('SYS_SUCCESS_USER_INFO')) {
				this.userInfo = uni.getStorageSync('SYS_SUCCESS_USER_INFO')
				uni.removeStorageSync('SYS_SUCCESS_USER_INFO')
			}
			//(this.$refs.Form! as any).setRules(this.formRules)
			if (uni.getStorageSync('SYS_USER_INFO') && uni.getStorageSync('SYS_USER_INFO').id) {
				this.userInfo = uni.getStorageSync('SYS_USER_INFO')
				console.log('this.userInfo', this.userInfo)
			}
			if (uni.getStorageSync('SYS_AUTH_TOKEN_KEY')) {
				this.getUserInfo(this.userInfo)
			} else {
				this.userInfo = {
					username: '',
					nickname: '',
					primary_key: '',
					id: 0,
					email: '',
					phone: '',
					avatar: '',
					team_id: 0,
					team_name: ''
				}
			}
		},
		methods: {
			getUserInfo(userInfo) {
				return new Promise((reslove, reject) => {
					getUserInfoByUsernameAction(userInfo).then(res => {
						//this.close()
						uni.setStorageSync('SYS_USER_INFO', res.data)
						this.userInfo = res.data
						getInfoByUserIdAction(this.userInfo).then(res=>{
							this.info = res.data
						})
						reslove()
					}).catch(() => {
						this.userInfo = {
							username: '',
							nickname: '',
							primary_key: '',
							id: 0,
							email: '',
							phone: '',
							avatar: '',
							team_id: 0,
							team_name: ''
						}
						uni.removeStorageSync('SYS_USER_INFO')
						reject()
					})
				})
			},
			handleShowUserInfo() {
				console.log('show111111111')
				const that = this
				uni.navigateTo({
					url: "/pages/mine/userInfo",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							userInfo: that.userInfo
						})
					}
				})
				//(this.$refs.UserInfoWrapper as any).showPopup = true;
			},
			handleLoginOrRegister() {
				uni.navigateTo({
					url: "/pages/mine/loginRegister"
				})
				//(this.$refs.LoginRegisterWrapper as any).showPopup = true;
				//(this.$refs.LoginRegisterWrapper as any).tapCaptcha();
				uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
			},
			openCollapse(e) {
				// console.log('open', e)
				this.valueCollapse = ''
			},
			closeCollapse(e) {
				// console.log('close', e)
			},
			changeCollapse(e) {
				// console.log('change', e)
			},
			uploadBackground(){
				const that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(result) {
						console.log('result path', result.tempFilePaths)
						const imgUrl = result.tempFilePaths[0]
						moneyBackgroundUploadAction(imgUrl).then(res => {
							console.log('res', res)
							this.$toast(res.message || '上传成功')
							getInfoByUserIdAction(this.userInfo).then(res=>{
								this.info = res.data
							})
							this.$emit('change')
						}).catch(err => {
							console.log('err', err)
						})
					}.bind(this)
				})
			},
			uploadAvatar(){
				const that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(result) {
						console.log('result path', result.tempFilePaths)
						const imgUrl = result.tempFilePaths[0]
						that.tempAvatarFilePath = imgUrl
					}.bind(this)
				})
			},
			confirmAvatar(e) {
				this.cropAvatarFilePath = e.detail.tempFilePath
				moneyAvatarUploadAction(this.cropAvatarFilePath).then(res => {
					console.log('res', res)
					this.$toast(res.message || '上传成功')
					this.tempAvatarFilePath = ''
					this.cropAvatarFilePath = ''
					getInfoByUserIdAction(this.userInfo).then(res=>{
						this.info = res.data
					})
					this.$emit('change')
				}).catch(err => {
					console.log('err', err)
				})
			},
			cancelAvatar() {
				this.tempAvatarFilePath = ''
			},
			showMoneyAvatarView() {
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + '/' + this.info.money_avatar],
					indicator: 'none'
				});
			},
			showMoneyBackgroundView(){
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + '/' + this.info.money_background],
					indicator: 'none'
				});
			},
			deleteMoneyBackground(){
				updateInfoByUserIdAction(this.userInfo.id, {money_background: ''}).then(res=>{
					this.$toast(res.message || '更新成功')
					this.showModalBackground = false
					getInfoByUserIdAction(this.userInfo).then(res=>{
						this.info = res.data
					})
				})
			},
			deleteMoneyAvatar(){
				updateInfoByUserIdAction(this.userInfo.id, {money_avatar: ''}).then(res=>{
					this.$toast(res.message || '更新成功')
					this.showModalAvatar = false
					getInfoByUserIdAction(this.userInfo).then(res=>{
						this.info = res.data
					})
				})
			}
		}
	})
</script>

<style lang="scss">
	.mine-body{
		box-sizing: border-box;
		padding: 30rpx;
		
		.mine-pictures{
			width: 100%;
			box-sizing: border-box;
			border-left: 1px solid #EAEBEC;
			border-right: 1px solid #EAEBEC;
			
			.mine-pictures-title{
				font-size: 12px;
				padding-bottom: 14rpx;
			}
			
			.picture-item{
				display: flex;
				align-items: center;
				box-sizing: border-box;
				justify-content: space-between;
				padding: 14rpx;
				
				.upload{
					display: flex;
					align-items: center;
					
					image{
						width: 60rpx;
						height: 60rpx;
						border-radius: 10rpx;
						margin-left: 24rpx;
						margin-right: 24rpx;
					}
				}
				
				.tip{
					view{
						text-align: right;
						font-size: 13px;
						
						&:last-child{
							font-size: 12px;
							color: #9699a0;
						}
					}
					
				}
			}
		}
	}
	
	.mine-top {
		width: 100%;
		height: 290rpx;
		background: #ffbb00;
		padding-top: 100rpx;
		box-sizing: border-box;

		.mine-top-one {
			box-sizing: border-box;
			width: 100%;
			height: 200rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.u-avatar {
					border: 2px solid #fff !important;
					margin-right: 14rpx !important;
					background: #fff !important;
				}

				text {
					color: #333;
					font-weight: bold;
					font-size: 16px;
				}
			}

			.right {
				>view {
					background: #fff;
					display: flex;
					align-items: center;
					height: 22px;
					padding-left: 6px;

					text {
						padding-left: 2px;
						font-size: 12px;
						padding-right: 6px;
					}

					border-radius: 11px;
				}
			}
		}

		.mine-top-two {
			box-sizing: border-box;
			width: 100%;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;
				border-radius: 10rpx;
				background: #fff;

				text {
					color: #333;
					padding-right: 10rpx;
					font-size: 12px;
				}
			}
		}
	}
</style>
