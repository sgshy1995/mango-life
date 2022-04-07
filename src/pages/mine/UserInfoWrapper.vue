<template>

	<u-popup :overlay="true" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
		:safeAreaInsetTop="true" :show="showPopup" @close="close" @open="open">
		<view class="mine-popup">
			<view class="mine-popup-top">
				<view class="top-back" @click="close">
					<u-icon name="arrow-left" color="#333" size="18"></u-icon>
					<text>返回</text>
				</view>
				<text class="top-title">个人信息</text>
			</view>
			<view class="user-avatar">
				<view class="left">
					<u-icon name="photo-fill" color="#606266" size="22"></u-icon>用户头像
				</view>
				<image class="right" @click="uploadImage" :src="baseUrl + '/' + userInfo.avatar"></image>
			</view>
			<u-divider text="用户信息"></u-divider>
			<u-cell-group>
				<u-cell icon="info-circle-fill" title="用户名" :value="userInfo.username"></u-cell>
				<u-cell icon="account-fill" title="昵称" :value="userInfo.nickname"></u-cell>
				<u-cell icon="lock-fill" title="私钥" :value="userInfo.primary_key"></u-cell>
				<u-cell icon="phone-fill" title="手机" :value="userInfo.phone"></u-cell>
				<u-cell icon="email-fill" title="邮箱" :value="userInfo.email"></u-cell>
				<u-cell icon="man-add-fill" title="性别" :value="userInfo.gender"></u-cell>
				<u-cell icon="gift-fill" title="生日" :value="userInfo.birthday"></u-cell>
			</u-cell-group>
			<view class="userinfo-bottom">
				<u-button color="#ffbb00" type="primary" text="退出登录" @click="handleShowModal"></u-button>
			</view>
		</view>
		<u-modal :show="showModal" showCancelButton confirmColor="#ffbb00" @confirm="handleLogout" @cancel="showModal=true" content="确定退出登录吗？"></u-modal>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {
		avatarUploadAction,
		logoutAction
	} from '@/service/service'
	export default Vue.extend({
		data() {
			return {
				showModal: false,
				customStyleIn: {
					width: '100vw'
				},
				showPopup: false,
				baseUrl: process.env.VUE_APP_API_BASE_URL
			}
		},
		props: {
			userInfo: {
				type: Object,
				default: () => {
					return {
						username: '',
						nickname: '',
						primary_key: '',
						id: 0,
						email: '',
						phone: '',
						avatar: ''
					}
				}
			}
		},
		methods: {
			close() {
				if (!this.showPopup) return
				this.showPopup = false;
			},
			open() {
				
			},
			uploadImage() {
				const that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(result: any) {
						console.log('result path', result.tempFilePaths)
						const imgUrl = result.tempFilePaths[0]
						avatarUploadAction(imgUrl).then(res=>{
							console.log('res',res)
							that.$emit('change')
						}).catch(err=>{
							console.log('err',err)
						})
					}.bind(this)
				})
			},
			handleShowModal(){
				this.showModal = true
			},
			handleLogout(){
				logoutAction(this.userInfo).then(res=>{
					this.showModal = false
					uni.removeStorageSync('SYS_USER_INFO')
					uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
					this.$emit('change')
					this.close()
				}).catch(err=>{
					
				})
			}
		}
	})
</script>

<style lang="scss">
	.mine-popup {
		box-sizing: border-box;

		.user-avatar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 28rpx;
			height: 100rpx;

			.left {
				display: flex;
				flex-direction: row;
				font-size: 14px;
				flex-shrink: 0;
				color: #333;
				justify-content: center;
				align-items: center;
			}

			.right {
				width: 76rpx;
				height: 76rpx;
				border-radius: 50%;
			}
		}


		.mine-popup-top {
			box-sizing: border-box;
			width: 100%;
			height: 200rpx;
			background: #ffbb00;
			margin-bottom: 40rpx;
			display: flex;
			align-items: flex-end;
			padding-bottom: 30rpx;
			position: relative;

			.top-back {
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				left: 20rpx;
				bottom: 30rpx;
				font-size: 16px;
			}

			.top-title {
				text-align: center;
				width: 100%;
				font-size: 16px;
			}
		}

		.mine-popup-bottom {
			padding: 30rpx 60rpx;

			.bottom-lisence {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				margin-bottom: 20rpx;

				.a-lisence {
					text-decoration: underline;
					color: #808080;
					padding-left: 2rpx;
				}
			}
		}
	}
	
	.userinfo-bottom{
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}
</style>
