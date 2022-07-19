<template>
	<view class="index-wrapper">
		<u-status-bar></u-status-bar>
		<view class="index-wrapper-in">
			<view class="index-top">
				<view class="index-top-left">
					<view class="index-top-left-logo">
						<image class="index-top-left-logo-icon" src="@/static/lanbidan.png"></image>
						<text class="index-top-left-logo-text">懒比蛋生活</text>
					</view>
				</view>
				<view class="index-top-right">
					<view class="right-item" @click="handleShowNotice">
						<u-icon name="chat" color="#333" size="24"></u-icon>
						<view class="badge-box" :class="{'less99': message <= 99 && message >= 10, 'less10': message <10}" v-if="message">
							<u-badge numberType="overflow" type="error" max="99" :value="message"></u-badge>
						</view>
					</view>
					
					<view class="right-item" @click="handleScan">
						<u-icon name="scan" color="#333" size="24"></u-icon>
					</view>
					
					<view class="right-item avatar" @click="handleShowInfo">
						<image class="right-item-avatar" :src="baseUrl + '/' + userInfo.avatar"></image>
					</view>
				</view>
			</view>
			<view class="index-switch">
				<view class="index-switch-section" v-if="userInfo.team_id">
					<view class="index-switch-section-item" @click="handleChangeSwitch(0)">个人看板</view>
					<view class="index-switch-section-item" @click="handleChangeSwitch(1)">团队看板</view>
					<view class="index-switch-section-item" @click="handleChangeSwitch(2)">提醒事项</view>
					<view class="index-switch-section-wipe" :class="{'to-right': switchType === 2, 'to-middle': switchType === 1}">{{ switchType === 0 ? '个人看板' : switchType === 1 ? '团队看板' :'提醒事项' }}</view>
				</view>
				<view class="index-switch-section only-person" v-else>
					<view class="index-switch-section-item" @click="handleChangeSwitch(0)">个人看板</view>
					<view class="index-switch-section-item" @click="handleChangeSwitch(1)">提醒事项</view>
					<view class="index-switch-section-wipe" :class="{'to-right': switchType === 1}">{{ switchType === 0 ? '个人看板' :'提醒事项' }}</view>
				</view>
			</view>
			<MoneyDashboard switchType="personal" ref="MoneyPersonalDashboard" v-if="switchType === 0" :key="personalKey" />
			<MoneyDashboard switchType="team" ref="MoneyTeamDashboard" v-if="switchType === 1" :key="teamKey" />
			<RemindDashboard ref="RemindDashboard" v-if="switchType === 2" />
		</view>
	</view>
</template>

<script>
	import {
		getUserInfoByJWTAction
	} from '@/service/service'
	import MoneyDashboard from '@/pages-index/money-dashboard.vue'
	import RemindDashboard from '@/pages-index/remind-dashboard.vue'
	export default {
		components: {
			MoneyDashboard,
			RemindDashboard
		},
		data() {
			return {
				baseUrl: process.env.VUE_APP_API_BASE_URL,
				switchType: 0,
				itemStyle: {
					height: '38px',
					fontWeight: 'bold',
					fontSize: '18px'
				},
				menuBaseUrl: 'https://cdn.uviewui.com/uview/menu/',
				title: 'Hello',
				current: 0,
				message: 14,
				personalKey: 'x',
				teamKey: 'y'
			}
		},
		onShow(){
			console.log('index show ====================')
			this.$nextTick(()=>{
				/* if(this.switchType === 0){
					this.$refs.MoneyPersonalDashboard.refreshPieChart ++
					this.$refs.MoneyPersonalDashboard.refreshLineChart ++
				}else{
					this.$refs.MoneyTeamDashboard.refreshPieChart ++
					this.$refs.MoneyTeamDashboard.refreshLineChart ++
				} */
			})
			this.getUserInfo().then(res=>{
				const historyType = uni.getStorageSync('SYS_INDEX_SWITCH_TYPE')
				if(historyType !== null && historyType !== undefined){
					this.switchType = this.userInfo.team_id ? historyType : 0
				}
			}).catch((err)=>{
			})
		},
		watch: {
			switchType: {
				handler(){
					setTimeout(()=>{
						this.loadChildDatas()
					}, 0)
				},
				immediate: true
			},
			moneyChangeCount(){
				this.handleRefresh()
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			},
			moneyChangeCount(){
				return this.$store.state.money.moneyChangeCount
			}
		},
		methods: {
			handleRefresh(){
				console.log('refresh ========== refresh')
				this.switchType = 2
			},
			loadChildDatas(){
				console.log('触发了请求数据 ==== ')
				this.switchType === 0 ? this.$refs.MoneyPersonalDashboard.findDataAll() : this.switchType === 1 ? this.$refs.MoneyTeamDashboard.findDataAll() : null
			},
			getUserInfo() {
				return new Promise((reslove, reject) => {
					getUserInfoByJWTAction().then(res => {
						//this.close()
						uni.setStorageSync('SYS_USER_INFO', res.data)
						this.$store.dispatch('setUserInfo', res.data)
						reslove(res.data)
					}).catch((err) => {
						this.$store.dispatch('resetUserInfo')
						uni.removeStorageSync('SYS_USER_INFO')
						reject(err)
					})
				})
			},
			handleChangeSwitch(key){
				this.switchType = key;
				if(this.$refs.MoneyPersonalDashboard) this.$refs.MoneyPersonalDashboard.monthSwitch = 0
				if(this.$refs.MoneyTeamDashboard) this.$refs.MoneyTeamDashboard.monthSwitch = 0
				uni.setStorageSync('SYS_INDEX_SWITCH_TYPE', key)
				this.$nextTick(()=>{
					this.loadChildDatas()
				})
			},
			showCamera(){
				
			},
			changeTabs(info){
				console.log('info', info)
				this.current = info.index
			},
			handleShowNotice() {
				const that = this
				uni.navigateTo({
					url: "/pages_index/noticePage"
				})
			},
			handleScan(){
				// 调起条码扫描
				uni.scanCode({
					scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
					success: function (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						uni.showToast({
							icon: 'none',
							title: res.result
						})
					}
				});
			},
			handleShowInfo() {
				const that = this
				uni.navigateTo({
					url: "/pages_mine/userInfo",
					success: function(res) {
					    // 通过eventChannel向被打开页面传送数据
					    res.eventChannel.emit('show', { userInfo: that.userInfo })
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.index-wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		position: relative;
		background: #fff;
		
		.index-wrapper-in{
			width: 100%;
			
			.index-top{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 12rpx;
				box-sizing: border-box;
				padding: 0 24rpx;
				
				.index-top-left{
					width: 100%;
					display: flex;
					align-items: center;
					
					.index-top-left-logo{
						display: flex;
						align-items: center;
						
						.index-top-left-logo-icon{
							width: 44rpx;
							height: 44rpx;
							margin-right: 12rpx;
						}
						
						.index-top-left-logo-text{
							color: #ffbb00;
							font-size: 16px;
							font-weight: 700;
						}
					}
				}
				
				.index-top-right{
					display: flex;
					align-items: center;
				}
			}
		
			.index-switch{
				width: 100%;
				box-sizing: border-box;
				padding: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.index-switch-section{
					width: 420rpx;
					height: 60rpx;
					border-radius: 30rpx;
					background: #F3F3F6;
					position: relative;
					display: flex;
					align-items: center;
					
					.index-switch-section-item{
						width: 140rpx;
						height: 100%;
						color: #B0B3BC;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
					}
					
					.index-switch-section-wipe{
						width: 140rpx;
						height: 60rpx;
						box-sizing: border-box;
						border: 2px solid #fff;
						border-radius: 30rpx;
						box-shadow: rgba(255,187,0, 0.3) 0px 14px 24px, rgba(255,187,0, 0.22) 0px 9px 8px;
						background: #ffbb00;
						position: absolute;
						top: 0;
						left: 0;
						transition: all 0.3s;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #fff;
						font-weight: 700;
						font-size: 12px;
						
						&.to-middle{
							left: 140rpx;
						}
						
						&.to-right{
							left: 280rpx;
						}
					}
					
					&.only-person{
						width: 360rpx;
						
						.index-switch-section-item{
							width: 180rpx;
						}
						
						.index-switch-section-wipe{
							width: 180rpx;
							
							&.to-right{
								left: 180rpx;
							}
						}
					}
				}
			}
		}
		
		.right{
			display: flex;
			align-items: center;
		}
		
		.right-item{
			flex-shrink: 0;
			margin-left: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 10px;
			flex-direction: column;
			position: relative;
			
			&.avatar{
				border-radius: 50%;
				border: 2px solid #fff;
				box-sizing: border-box;
				box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
				
				.right-item-avatar{
					width: 58rpx;
					height: 58rpx;
					border-radius: 50%;
				}
			}
			
			.badge-box{
				position: absolute;
				right: -36rpx;
				top: -12rpx;
				
				&.less99{
					right: -24rpx;
				}
				
				&.less10{
					right: -12rpx;
				}
			}
		}
		
		.msg-icon{
			width: 18px;
			height: 18px;
		}
		
		.add-icon{
			width: 18px;
			height: 18px;
		}
	}
	
	
	
	.home-sticky {
		top: 0 !important;
	}
</style>
