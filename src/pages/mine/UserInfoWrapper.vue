<template>
	<u-popup :overlay="true" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
		:safeAreaInsetTop="true" :show="showPopup" @close="close" @open="open">
		<scroll-view scroll-y class="mine-popup">
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
				<view class="right" v-if="userInfo.avatar">
					<u-icon name="camera-fill" color="#606266" @click="uploadImage" size="30"></u-icon>
					<image v-if="userInfo.avatar" @click="showAvatarView" :src="baseUrl + '/' + userInfo.avatar">
					</image>
				</view>
				<u-avatar v-else icon="camera-fill" @click="uploadImage" fontSize="20"></u-avatar>
			</view>
			<u-divider text="团队/家庭"></u-divider>
			<view class="user-team">
				<u-cell-group>
					<u-cell icon="home-fill" title="家庭/团队">
						<view slot="value" class="user-team-value" @click="showTeamModal">
							<text class="team-info">{{ userInfo.team_name || '暂无信息，请创建或邀请' }}</text>
							<view class="manage">
								<u-icon name="list-dot" color="#606266" size="16"></u-icon>
							</view>
						</view>
					</u-cell>
				</u-cell-group>
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
		</scroll-view>
		<u-modal :show="showModal" showCancelButton confirmColor="#ffbb00" @confirm="handleLogout"
			@cancel="showModal=false" content="确定退出登录吗？"></u-modal>
		<TeamManageModal @ok="$emit('change')" :userInfo="userInfo" ref="TeamManageModal"></TeamManageModal>
		<image-cropper :crop-width="200" :crop-height="200" :show-reset-btn="false" :show-rotate-btn="false"
			:src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {
		avatarUploadAction,
		logoutAction
	} from '@/service/service'
	import TeamManageModal from './TeamManageModal.vue';
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	export default Vue.extend({
		components: {
			TeamManageModal,
			ImageCropper
		},
		data() {
			return {
				showModal: false,
				customStyleIn: {
					width: '100vw'
				},
				showPopup: false,
				baseUrl: process.env.VUE_APP_API_BASE_URL,
				tempFilePath: '',
				cropFilePath: ''
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
						avatar: '',
						team_id: 0,
						team_name: ''
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
			showTeamModal() {
				(this.$refs.TeamManageModal as any).show();
			},
			showAvatarView() {
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + '/' + this.userInfo.avatar],
					indicator: 'none'
				});
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
						that.tempFilePath = imgUrl
					}.bind(this)
				})
			},
			confirm(e: {
				detail: {
					tempFilePath: string
				}
			}) {
				this.tempFilePath = ''
				this.cropFilePath = e.detail.tempFilePath
				avatarUploadAction(this.cropFilePath).then(res => {
					console.log('res', res)
					this.cropFilePath = ''
					this.$emit('change')
				}).catch(err => {
					console.log('err', err)
				})
			},
			cancel() {
				this.tempFilePath = ''
			},
			handleShowModal() {
				this.showModal = true
			},
			handleLogout() {
				logoutAction(this.userInfo).then(res => {
					this.showModal = false
					uni.removeStorageSync('SYS_USER_INFO')
					uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
					uni.removeStorageSync('SYS_SWITCH_TYPE')
					this.$emit('change')
					this.close()
				}).catch(err => {

				})
			}
		}
	})
</script>

<style lang="scss">
	.mine-popup {
		box-sizing: border-box;
		width: 100%;
		height: 100vh;
		padding-bottom: 40rpx;

		.user-team {
			box-sizing: border-box;
			width: 100%;

			.user-team-value {
				display: flex;
				align-items: center;

				.team-info {
					font-size: 14px;
					color: #999999;
				}

				.manage {
					display: flex;
					align-items: center;
					font-size: 12px;
					flex-direction: row;
					margin-right: 10rpx;
					margin-left: 30rpx;
				}
			}
		}

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
				display: flex;
				align-items: center;
				image{
					width: 76rpx;
					height: 76rpx;
					border-radius: 50%;
					flex-shrink: 0;
					margin-left: 30rpx;
				}
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

	.userinfo-bottom {
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}
</style>
