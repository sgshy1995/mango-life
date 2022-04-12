<template>
	<u-popup :overlay="true" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
		:safeAreaInsetTop="true" :show="showPopup" @close="close" @open="open">
		<view class="mine-popup">
			<view class="mine-popup-top">
				<view class="top-back" @click="close">
					<u-icon name="arrow-left" color="#333" size="18"></u-icon>
					<text>返回</text>
				</view>
				<text class="top-title">{{ showType === 'register' ? '注册' : '登录' }}</text>
			</view>
			<view class="user-form">
				<u--form border="none" abelPosition="left" :model="formModel" ref="Form">
					<u-form-item required labelWidth="70" label="用户名" prop="username" borderBottom>
						<u--input maxlength="18" placeholder="请输入用户名" v-model="formModel.username" border="none"></u--input>
					</u-form-item>
					<u-form-item v-if="showType==='register'" required labelWidth="70" label="昵称" prop="nickname"
						borderBottom>
						<u--input maxlength="12" placeholder="请输入昵称" v-model="formModel.nickname" border="none"></u--input>
					</u-form-item>
					<u-form-item required labelWidth="70" label="密码" prop="password" borderBottom>
						<u-input maxlength="20" placeholder="请输入密码" :type="showPassword ? 'text' : 'password'"
							v-model="formModel.password" border="none">
							<u-icon v-if="!showPassword" slot="suffix" name="eye-off" color="#aaa" size="18"
								@click="showPassword = true"></u-icon>
							<u-icon v-else slot="suffix" name="eye-fill" color="#aaa" size="18"
								@click="showPassword = false"></u-icon>
						</u-input>
					</u-form-item>
					<u-form-item required labelWidth="70" label="验证码" prop="code">
						<view class="form-item-code">
							<u--input maxlength="4" placeholder="请输入验证码" v-model="formModel.capture" border="none">
							</u--input>
							<image :src="captureCode" @tap="tapCaptcha"></image>
						</view>
					</u-form-item>
				</u--form>
			</view>
			<view class="mine-popup-bottom">
				<view class="bottom-lisence">
					<u-checkbox-group v-model="selectedLicense">
						<u-checkbox size="16" shape="circle" activeColor="#ffbb00" name="select"></u-checkbox>
					</u-checkbox-group>

					<text>已阅读并同意<text class="a-lisence">懒比蛋使用协议</text></text>
				</view>
				<u-button v-if="showType==='register'" color="#ffbb00" type="primary" text="注册" @click="handleRegister">
				</u-button>
				<u-button v-else color="#ffbb00" type="primary" text="登录" @click="handleLogin"></u-button>
				<u-button v-if="showType==='register'"
					:customStyle="{color: '#333', borderColor: '#eee', marginTop: '24rpx'}" :plain="true" type="primary"
					text="已有账号,立即登录" @click="changeShowType('login')"></u-button>
				<u-button v-else :customStyle="{color: '#333', borderColor: '#eee', marginTop: '24rpx'}" :plain="true"
					type="primary" text="没有账号,前往注册" @click="changeShowType('register')"></u-button>
			</view>
		</view>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {
		registerAction,
		loginAction,
		getUserInfoByUsernameAction,
		captureAction
	} from '@/service/service'
	export default Vue.extend({
		data() {
			const arr = [2, 3, 4, 5, 6, 7, 8, 9];
			for (var i = 65; i < 122; i++) {

				if (i > 90 && i < 97) {

					continue;
				}
				// @ts-ignore
				arr.push(String.fromCharCode(i));
			}
			return {
				customStyleIn: {
					width: '100vw'
				},
				showType: 'login',
				formModel: {
					username: '',
					nickname: '',
					password: '',
					capture: ''
				},
				captureCode: '',
				showPopup: false,
				formRules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: ['blur', 'change']
					}]
				},
				selectedLicense: [],
				showPassword: false,
				capValue: "",
				capShow: true,
				character: arr,
				userInfo: {
					username: '',
					nickname: '',
					primary_key: '',
					id: 0,
					email: '',
					phone: '',
					avatar: ''
				},
				device_id: ''
			}
		},
		created() {
			console.log('uni.getSystemInfoSync()', uni.getSystemInfoSync())
			this.device_id = uni.getSystemInfoSync().deviceId
			this.tapCaptcha()
		},
		methods: {
			getUserInfo(userInfo: Record < string, any > ) {
				return new Promise((reslove, reject) => {
					getUserInfoByUsernameAction(userInfo).then(res => {
						this.close()
						uni.setStorageSync('SYS_USER_INFO', res.data)
						this.userInfo = res.data
						reslove()
					}).catch(() => {
						this.userInfo = {
							username: '',
							nickname: '',
							primary_key: '',
							id: 0,
							email: '',
							phone: '',
							avatar: ''
						}
						uni.removeStorageSync('SYS_USER_INFO')
						reject()
					})
				})
			},
			validateForm() {
				let errorMessage = ''
				if (!this.formModel.username) {
					errorMessage = '请输入用户名'
				} else if (!this.formModel.nickname && this.showType === 'register') {
					errorMessage = '请输入昵称'
				} else if (!this.formModel.password) {
					errorMessage = '请输入密码'
				} else if (!this.formModel.capture) {
					errorMessage = '请输入验证码'
				}
				return errorMessage
			},
			changeShowType(showType: string) {
				this.tapCaptcha();
				this.showType = showType
				this.showPassword = false
			},
			handleRegister() {
				const errorMessage = this.validateForm()
				if (errorMessage) {
					uni.showToast({
						title: errorMessage,
						icon: 'none'
					})
				} else if (!this.selectedLicense.length) {
					uni.showToast({
						title: '请同意并勾选用户协议',
						icon: 'none'
					})
				} else {
					registerAction({
						...this.formModel,
						device_id: this.device_id
					}).then(res => {
						console.log('res', res)
						uni.setStorageSync('SYS_AUTH_TOKEN_KEY', res.data.token)
						this.$emit('ok', this.formModel)
						this.close()
						//this.getUserInfo(this.formModel)
					}).catch(err => {
						//this.tapCaptcha();
					})
				}
			},
			handleLogin() {
				const errorMessage = this.validateForm()
				if (errorMessage) {
					uni.showToast({
						title: errorMessage,
						icon: 'none'
					})
				} else if (!this.selectedLicense.length) {
					uni.showToast({
						title: '请同意并勾选用户协议',
						icon: 'none'
					})
				} else {
					loginAction({
						...this.formModel,
						device_id: this.device_id
					}).then(res => {
						console.log('res', res)
						uni.setStorageSync('SYS_AUTH_TOKEN_KEY', res.data.token)
						this.$emit('ok', this.formModel)
						this.close()
						//this.getUserInfo(this.formModel)
					}).catch(err => {
						//this.tapCaptcha();
					})
				}
			},
			close() {
				if (!this.showPopup) return
				this.showPopup = false;
				setTimeout(() => {
					(this.$refs.Form!as any).resetFields()
					this.showPassword = false
				}, 200)
			},
			open() {

			},
			// 点击画布重置初始化方法，达到切换验证码效果
			tapCaptcha() {
				captureAction(this.device_id).then(res => {
					if (typeof res === 'string') {
						this.captureCode = res
					}
				})
			}
		}
	})
</script>

<style lang="scss">
	.user-form {
		box-sizing: border-box;
		width: 100%;
		padding-left: 70rpx;
		padding-right: 70rpx;
		
		.form-item-code{
			width: 100%;
			display: flex;
			align-items: center;
			
			image{
				width: 178rpx; 
				height: 88rpx;
				margin-left: 20rpx;
			}
		}
	}

	.mine-popup {
		box-sizing: border-box;


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
</style>
