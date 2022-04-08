<template>
	<view>
		<view class="mine-top">
			<view class="mine-top-one">
				<view v-if="userInfo.id" class="left" @click="handleShowUserInfo">
					<u-avatar style="border: 2px solid #fff;margin-right: 14rpx;background: #fff !important;" color="#ccc" :src="baseUrl + '/' + userInfo.avatar"
						size="44" fontSize="36" bg-color="#f6f6f6"></u-avatar>
					<text>{{ userInfo.nickname }}</text>
				</view>
				<view v-else class="left" @click="handleLoginOrRegister">
					<u-avatar style="border: 2px solid #fff;margin-right: 14rpx;" color="#ccc" icon="account-fill"
						size="44" fontSize="36" bg-color="#f6f6f6"></u-avatar>
					<text>登录 / 注册</text>
				</view>
				<view class="right">
					<view>
						<u-icon name="calendar-fill" color="#ffbb00" size="18"></u-icon>
						<text>打卡</text>
					</view>
				</view>
			</view>
			<view class="mine-top-two"></view>
		</view>
		<u-tabbar :value="selected" :fixed="true" :placeholder="true" @change="handleChangeIndex"
			:safeAreaInsetBottom="true" activeColor="#ffbb00" inactiveColor="#333">
			<u-tabbar-item text="首页" icon="home-fill"></u-tabbar-item>
			<u-tabbar-item text="记账" icon="red-packet-fill"></u-tabbar-item>
			<u-tabbar-item text="备忘" icon="calendar-fill"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account-fill"></u-tabbar-item>
		</u-tabbar>
		<LoginRegisterWrapper @ok="handleSuccess" ref="LoginRegisterWrapper"></LoginRegisterWrapper>
		<UserInfoWrapper @change="getUserInfo(userInfo)" ref="UserInfoWrapper" :userInfo="userInfo"></UserInfoWrapper>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import LoginRegisterWrapper from './LoginRegisterWrapper.vue'
	import UserInfoWrapper from './UserInfoWrapper.vue'
	import {
		registerAction,
		loginAction,
		getUserInfoByUsernameAction
	} from '@/service/service'
	export default Vue.extend({
		data() {
			return {
				baseUrl: process.env.VUE_APP_API_BASE_URL,
				showType: 'login',
				selected: 3,
				urls: [
					'/pages/index/Index',
					'/pages/money/Money',
					'/pages/memo/Memo',
					'/pages/mine/Mine'
				],
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
				}
			};
		},
		components:{
			LoginRegisterWrapper,
			UserInfoWrapper
		},
		onLoad() {
			//(this.$refs.Form! as any).setRules(this.formRules)
			if (uni.getStorageSync('SYS_USER_INFO') && uni.getStorageSync('SYS_USER_INFO').id) {
				
				this.userInfo = uni.getStorageSync('SYS_USER_INFO')
				console.log('this.userInfo',this.userInfo)
				this.getUserInfo(this.userInfo)
			}
		},
		onHide() {
			this.selected = 3
		},
		methods: {
			handleSuccess(userInfo:Record<string,any>){
				this.getUserInfo(userInfo)
			},
			getUserInfo(userInfo:Record<string,any>){
				return new Promise((reslove,reject)=>{
					getUserInfoByUsernameAction(userInfo).then(res => {
						//this.close()
						uni.setStorageSync('SYS_USER_INFO', res.data)
						this.userInfo = res.data
						reslove()
					}).catch(()=>{
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
			handleShowUserInfo(){
				(this.$refs.UserInfoWrapper as any).showPopup = true;
			},
			handleLoginOrRegister() {
				(this.$refs.LoginRegisterWrapper as any).showPopup = true;
				(this.$refs.LoginRegisterWrapper as any).tapCaptcha();
				uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
			},
			handleChangeIndex(index: number) {
				console.log('12', index)
				this.selected = index
				uni.navigateTo({
					url: this.urls[index],
					fail: (e) => {
						alert(e.errMsg)
					}
				})
				console.log('1', index)
			},
			
		}
	})
</script>

<style lang="scss">
	.mine-top {
		width: 100%;
		height: 300rpx;
		background: #ffbb00;

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
	}

	
</style>
