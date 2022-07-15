<template>
	<view>
		<view class="mine-top-back">
			<u-status-bar></u-status-bar>
			<view class="mine-top-back-one"></view>
			<view class="mine-top-back-two"></view>
			<view class="mine-top-back-three"></view>
		</view>
		<view class="mine-info-title">
			<view class="mine-info-title-in">我的</view>
			<view class="mine-info-title-icon" @click="handleShowUserInfo">
				<u-icon name="setting" color="#fff" size="24"></u-icon>
			</view>
		</view>
		<view class="mine-top">
			<view class="mine-top-one">
				<view v-if="userInfo.id" class="left" @click="showAvatarView">
					<u-avatar class="user-avatar" color="#ccc" :src="baseUrl + '/' + userInfo.avatar" size="60"
						fontSize="50" bg-color="#f6f6f6"></u-avatar>
				</view>
				<view v-else class="left" @click="handleLoginOrRegister">
					<u-avatar class="user-avatar" color="#ccc" icon="account-fill" size="60" fontSize="50"
						bg-color="#f6f6f6"></u-avatar>
				</view>
				<view class="right">
					<view class="right-one">{{ userInfo.nickname }}</view>
					<view class="right-two">ID: {{ userInfo.primary_key.split('-')[0] }}</view>
					<view class="right-three">IP属地: {{ ipLocation }}</view>
				</view>
			</view>
		</view>
		<view class="mine-body">
			<view class="mine-pictures" v-if="userInfo.id">
				<u-collapse ref="collapse" @change="changeCollapse" @close="closeCollapse" @open="openCollapse" accordion
					:value="valueCollapse">
					<u-collapse-item title="个人图片管理" icon="https://eden-life.net.cn:9000/cdn/mango/images/图片管理.png"
						name="Docs guide">
						<view class="u-collapse-content">
							<view class="mine-pictures-title">上传和更改您的个人图片</view>
							<u-line></u-line>
							<view class="picture-item">
								<view class="upload">
									<u-icon name="camera-fill" @click="uploadBackground" color="#333" size="24">
									</u-icon>
									<image v-if="info.money_background" :src="baseUrl + '/' + info.money_background"
										@click="showMoneyBackgroundView"></image>
									<u-icon v-if="info.money_background" name="trash" @click="showModalBackground=true"
										color="#333" size="16"></u-icon>
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
									<image v-if="info.money_avatar" :src="baseUrl + '/' + info.money_avatar"
										@click="showMoneyAvatarView"></image>
									<u-icon v-if="info.money_avatar" name="trash" @click="showModalAvatar=true"
										color="#333" size="16"></u-icon>
								</view>
								<view class="tip">
									<view>记账页面头像</view>
									<view>推荐像素: 100*100</view>
								</view>
							</view>
							<u-line></u-line>
						</view>
					</u-collapse-item>
					<u-collapse-item title="生活小助手" :icon="lifeIcon" name="Ass guide">
						<view class="u-collapse-content">
							<view class="u-collapse-content-title">
								<image class="u-collapse-content-title-icon" src="@/static/images/mine/gas.png"></image>
								<text class="u-collapse-content-title-text">油价查询</text>
							</view>
							<view class="u-collapse-content-in">
								<view class="u-collapse-content-in-top">
									<text>当前省份： </text>
									<view class="u-collapse-content-in-top-text">
										<text>{{ inProvince }}</text>
									</view>
									<view @click="handleShowProvincePicker" class="u-collapse-content-in-top-select">
										<text>选择其他省份</text>
										<u-icon name="arrow-right" color="#999" size="10"></u-icon>
									</view>
								</view>
								<view class="u-collapse-content-in-bottom">
									<view class="content-in-table">
										<!-- 表头行 -->
										<view class="content-in-table-head">
											<view class="content-in-table-head-th">地区</view>
											<view class="content-in-table-head-th">92号汽油</view>
											<view class="content-in-table-head-th">95号汽油</view>
											<view class="content-in-table-head-th">98号汽油</view>
											<view class="content-in-table-head-th last-th">0号柴油</view>
										</view>
										<!-- 表格数据行 -->
										<view class="content-in-table-body" v-if="gasInfo.province && !gasLoading">
											<view class="content-in-table-body-td">{{ gasInfo.province }}</view>
											<view class="content-in-table-body-td">{{ gasInfo.gas92 }}</view>
											<view class="content-in-table-body-td">{{ gasInfo.gas95 }}</view>
											<view class="content-in-table-body-td">{{ gasInfo.gas98 }}</view>
											<view class="content-in-table-body-td last-th">{{ gasInfo.gas0 }}</view>
										</view>
										<view class="content-in-table-body-loading" v-if="gasLoading">
											<u-loading-icon text="加载中" size="12" textSize="12"></u-loading-icon>
										</view>
										<view class="content-in-table-body-empty" v-if="!gasInfo.province && !gasLoading">
											<image class="body-empty-img" src="@/static/images/days/nothing.png">
											</image>
											<text class="body-empty-text">暂无信息~</text>
										</view>
									</view>
								</view>
								<view class="u-collapse-content-in-top">油价动态</view>
								<view class="u-collapse-content-in-footer">
									<text class="u-collapse-content-in-footer-normal" v-if="!gasDynamicInfo.normal && !gasDynamicInfo.dynamic">--</text>
									<text class="u-collapse-content-in-footer-normal" v-if="gasDynamicInfo.normal">{{ gasDynamicInfo.normal }}</text>
									<text class="u-collapse-content-in-footer-red" v-if="gasDynamicInfo.dynamic">{{ gasDynamicInfo.dynamic }}</text>
								</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>

			<view class="mine-assistant">

			</view>
		</view>
		<image-cropper :crop-width="200" :crop-height="200" :show-reset-btn="false" :show-rotate-btn="false"
			:src="tempAvatarFilePath" @confirm="confirmAvatar" @cancel="cancelAvatar"></image-cropper>
		<u-modal :show="showModalBackground" showCancelButton confirmColor="#ffbb00" @confirm="deleteMoneyBackground"
			@cancel="showModalBackground=false" content="确定删除记账页面背景图片并还原默认吗？"></u-modal>
		<u-modal :show="showModalAvatar" showCancelButton confirmColor="#ffbb00" @confirm="deleteMoneyAvatar"
			@cancel="showModalAvatar=false" content="确定删除记账页面头像并还原默认吗？"></u-modal>
		<u-picker confirmColor="#ffbb00" @cancel="cancelProvince" :key="pickerKey" :show="showProvince" :defaultIndex="defaultIndex" :columns="columnsProvince" @confirm="confirmProvince"></u-picker>
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
		updateInfoByUserIdAction,
		getGasInfoByProvinceAction
	} from '@/service/service'
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	export default Vue.extend({
		data() {
			return {
				gasLoading: false,
				pickerKey: 0,
				loadingTable: false,
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
				valueCollapse: 'Ass guide',
				showModalBackground: false,
				showModalAvatar: false,
				ipLocation: '',
				lifeIcon: require('@/static/images/mine/ass.png'),
				inProvince: '',
				gasInfo: {
					province: '',
					gas92: '',
					gas95: '',
					gas98: '',
					gas0: ''
				},
				gasDynamicInfo: {
					normal: '',
					dynamic: ''
				},
				showProvince: false,
				columnsProvince: [
					['北京', '上海', '江苏', '天津', '河北', '山东', '重庆', '江西', '辽宁', '安徽', '内蒙古', '福建', '宁夏', '甘肃', '青海', '广东', '广西', '山西', '贵州', '陕西', '海南', '四川', '西藏', '河南', '新疆', '黑龙江', '吉林', '云南', '湖北', '浙江', '湖南']
				],
				defaultIndex: [0]
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
			this.getIpInfo()
			this.getLocationInfo()
		},
		methods: {
			handleShowProvincePicker(){
				this.showProvince = true
			},
			cancelProvince(){
				this.showProvince = false
			},
			confirmProvince(e) {
				console.log('confirm', e)
				this.inProvince = e.value[0]
				this.showProvince = false
				this.getGasInfo(true)
			},
			getLocationInfo() {
				const that = this
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						console.log('当前位置的res：', res);
						that.inProvince = that.columnsProvince[0].find(name=>res.address.province.indexOf(name)>-1)
						that.defaultIndex = [that.columnsProvince[0].findIndex(name=>res.address.province.indexOf(name)>-1)]
						that.pickerKey++
						that.getGasInfo()
					}
				});
			},
			getGasInfo(ifLoading){
				if(ifLoading) this.gasLoading = true
				getGasInfoByProvinceAction(this.inProvince).then(res=>{
					console.log('油价 res', res)
					this.gasInfo = res.data.gasInfo
					this.gasDynamicInfo = res.data.gasDynamicInfo
					this.gasLoading = false
					this.$nextTick(()=>{
						this.$refs.collapse.init()
					})
				}).catch(err=>{
					this.gasInfo = {
						province: '',
						gas92: '',
						gas95: '',
						gas98: '',
						gas0: ''
					}
					this.gasDynamicInfo = {
						normal: '',
						dynamic: ''
					}
					this.gasLoading = false
					this.$nextTick(()=>{
						this.$refs.collapse.init()
					})
				})
			},
			getIpInfo() {
				uni.request({
					url: 'http://pv.sohu.com/cityjson?ie=utf-8',
					method: 'POST',
					success: (res) => {
						console.log('ip res ====', res)
						console.log(res.data.split('var returnCitySN = ')[1])
						const jsonData = res.data.split('var returnCitySN = ')[1]
						if (jsonData) {
							this.ipLocation = JSON.parse(jsonData).cname
						}
					}
				})
			},
			getUserInfo(userInfo) {
				return new Promise((reslove, reject) => {
					getUserInfoByUsernameAction(userInfo).then(res => {
						//this.close()
						uni.setStorageSync('SYS_USER_INFO', res.data)
						this.userInfo = res.data
						this.$store.dispatch('setUserInfo', this.userInfo)
						getInfoByUserIdAction(this.userInfo).then(res => {
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
					url: "/pages-mine/userInfo",
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
					url: "/pages-mine/loginRegister"
				})
				//(this.$refs.LoginRegisterWrapper as any).showPopup = true;
				//(this.$refs.LoginRegisterWrapper as any).tapCaptcha();
				uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
			},
			openCollapse(e) {
				// console.log('open', e)
				this.valueCollapse = e
			},
			closeCollapse(e) {
				// console.log('close', e)
			},
			changeCollapse(e) {
				// console.log('change', e)
			},
			uploadBackground() {
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
							getInfoByUserIdAction(this.userInfo).then(res => {
								this.info = res.data
							})
							this.$emit('change')
						}).catch(err => {
							console.log('err', err)
						})
					}.bind(this)
				})
			},
			uploadAvatar() {
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
					getInfoByUserIdAction(this.userInfo).then(res => {
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
			showAvatarView() {
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + '/' + this.userInfo.avatar],
					indicator: 'none'
				});
			},
			showMoneyAvatarView() {
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + '/' + this.info.money_avatar],
					indicator: 'none'
				});
			},
			showMoneyBackgroundView() {
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + '/' + this.info.money_background],
					indicator: 'none'
				});
			},
			deleteMoneyBackground() {
				updateInfoByUserIdAction(this.userInfo.id, {
					money_background: ''
				}).then(res => {
					this.$toast(res.message || '更新成功')
					this.showModalBackground = false
					getInfoByUserIdAction(this.userInfo).then(res => {
						this.info = res.data
					})
				})
			},
			deleteMoneyAvatar() {
				updateInfoByUserIdAction(this.userInfo.id, {
					money_avatar: ''
				}).then(res => {
					this.$toast(res.message || '更新成功')
					this.showModalAvatar = false
					getInfoByUserIdAction(this.userInfo).then(res => {
						this.info = res.data
					})
				})
			}
		}
	})
</script>

<style lang="scss">
	.mine-body {
		box-sizing: border-box;
		padding: 30rpx;

		.mine-pictures {
			width: 100%;
			box-sizing: border-box;
			border-left: 1px solid #EAEBEC;
			border-right: 1px solid #EAEBEC;
			margin-top: 24rpx;

			.u-collapse-content-title {
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;

				.u-collapse-content-title-icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 12rpx;
				}

				.u-collapse-content-title-text {
					font-size: 14px;
					font-weight: 700;

				}
			}

			.u-collapse-content-in {
				width: 100%;

				.u-collapse-content-in-top {
					font-size: 13px;
					margin-bottom: 24rpx;
					display: flex;
					align-items: center;
					
					.u-collapse-content-in-top-text{
						display: flex;
						font-weight: 700;
						margin-left: 12rpx;
						align-items: center;
					}
					
					.u-collapse-content-in-top-select{
						display: flex;
						font-size: 10px;
						box-sizing: border-box;
						padding: 2rpx 6rpx;
						border-radius: 4rpx;
						border: 1px solid #999;
						margin-left: 24rpx;
					}
				}
				
				.u-collapse-content-in-footer{
					width: 100%;
					font-size: 13px;
					
					.u-collapse-content-in-footer-normal{
						color: #333;
					}
					
					.u-collapse-content-in-footer-red{
						color: #E06C75;
					}
				}

				.u-collapse-content-in-bottom {
					width: 100%;
					margin-bottom: 24rpx;

					.content-in-table {
						width: 100%;

						.content-in-table-head {
							width: 100%;
							display: flex;
							align-items: center;

							.content-in-table-head-th {
								width: 20%;
								box-sizing: border-box;
								border-top: 1px solid #999;
								border-bottom: 1px solid #999;
								border-left: 1px solid #999;
								font-size: 12px;
								height: 60rpx;
								display: flex;
								align-items: center;
								justify-content: center;

								&.last-th {
									border-right: 1px solid #999;
								}
							}
						}

						.content-in-table-body {
							width: 100%;
							display: flex;
							align-items: center;

							.content-in-table-body-td {
								width: 20%;
								box-sizing: border-box;
								border-bottom: 1px solid #999;
								border-left: 1px solid #999;
								font-size: 12px;
								height: 60rpx;
								display: flex;
								align-items: center;
								justify-content: center;

								&.last-th {
									border-right: 1px solid #999;
								}
							}
						}

						.content-in-table-body-empty {
							width: 100%;
							height: 60rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							box-sizing: border-box;
							border-bottom: 1px solid #999;
							border-left: 1px solid #999;
							border-right: 1px solid #999;

							.body-empty-text {
								font-size: 10px;
								color: #cdcdcd;
							}

							.body-empty-img {
								width: 36rpx;
								height: 36rpx;
								margin-left: 12rpx;
							}
						}
						
						.content-in-table-body-loading{
							width: 100%;
							height: 60rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							box-sizing: border-box;
							border-bottom: 1px solid #999;
							border-left: 1px solid #999;
							border-right: 1px solid #999;
						}

					}
				}
			}

			.mine-pictures-title {
				font-size: 12px;
				padding-bottom: 14rpx;
			}

			.picture-item {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				justify-content: space-between;
				padding: 14rpx;

				.upload {
					display: flex;
					align-items: center;

					image {
						width: 60rpx;
						height: 60rpx;
						border-radius: 10rpx;
						margin-left: 24rpx;
						margin-right: 24rpx;
					}
				}

				.tip {
					view {
						text-align: right;
						font-size: 13px;

						&:last-child {
							font-size: 12px;
							color: #9699a0;
						}
					}

				}
			}
		}

		.mine-assistant {
			width: 100%;
			margin-top: 24rpx;
		}
	}

	.mine-top-back {
		width: 100%;
		height: 400rpx;
		position: relative;
		background-image: linear-gradient(180deg, #ffbb00 0%, rgba(255, 187, 0, 0.7) 100%);

		.mine-top-back-one {
			width: 320rpx;
			height: 320rpx;
			position: absolute;
			left: -50rpx;
			top: -50rpx;
			border-radius: 50%;
			background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
			z-index: 2;
		}

		.mine-top-back-two {
			width: 220rpx;
			height: 220rpx;
			position: absolute;
			bottom: 0;
			left: 140rpx;
			border-radius: 50%;
			background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
			z-index: 1;
		}

		.mine-top-back-three {
			width: 100rpx;
			height: 100rpx;
			position: absolute;
			right: 120rpx;
			bottom: 120rpx;
			border-radius: 50%;
			background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
			z-index: 1;
		}
	}

	.mine-info-title {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: -280rpx;
		margin-bottom: 128rpx;
		position: relative;
		z-index: 3;

		.mine-info-title-in {
			font-size: 18px;
			font-weight: 800;
			color: #fff;
		}

		.mine-info-title-icon {
			position: absolute;
			right: 24rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.mine-top {
		width: 100%;
		height: 220rpx;
		background: transparent;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 3;

		.mine-top-one {
			box-sizing: border-box;
			width: 84%;
			height: 220rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background: #fff;
			border-radius: 24rpx;
			box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
			position: relative;

			.left {
				display: flex;
				align-items: center;
				align-items: center;
				position: absolute;
				left: 50%;
				top: 0;
				transform: translate(-50%, -50%);

				.u-avatar {
					border: 2px solid #fff !important;
					background: #fff !important;
				}
			}

			.right {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				.right-one {
					font-size: 16px;
					font-weight: 800;
					margin-top: 24rpx;
					white-space: nowrap;
					margin-bottom: 6rpx;
				}

				.right-two {
					font-size: 10px;
					color: #888;
					white-space: nowrap;
				}

				.right-three {
					font-size: 10px;
					color: #888;
					white-space: nowrap;
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
