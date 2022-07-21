<template>
	<view class="login-register-wrapper">
		<view class="mine-popup">
			<view class="mine-popup-top">
				<text class="mine-popup-top-text">{{ showType === 'register' ? '注册' : loginType === 'email' ? '邮箱登录' : '账号登录' }}</text>
				<!-- <view class="mine-popup-top-switch" v-if="showType === 'login'">
					<view class="mine-popup-top-switch-text">登录方式</view>
					<view class="mine-popup-top-switch-in" @click="handleChangeLoginType">
						<view class="mine-popup-top-switch-item">用户名</view>
						<view class="mine-popup-top-switch-item">邮箱</view>
						<view class="mine-popup-top-switch-swip" :class="{'to-right': loginType === 'email'}">{{ loginType === 'username' ? '用户名' : '邮箱' }}</view>
					</view>
				</view> -->
			</view>
			<view class="user-form">
				<u--form v-if="showType==='register'" border="none" abelPosition="left" :model="formModel" ref="Form">
					<u-form-item required labelWidth="80" label="用户名" prop="username" borderBottom>
						<u--input maxlength="18" placeholder="请输入用户名" v-model="formModel.username" border="none"></u--input>
					</u-form-item>
					<u-form-item required labelWidth="80" label="昵称" prop="nickname"
						borderBottom>
						<u--input maxlength="12" placeholder="请输入昵称" v-model="formModel.nickname" border="none"></u--input>
					</u-form-item>
					<u-form-item required labelWidth="80" label="邮箱" prop="email"
						borderBottom>
						<u--input maxlength="40" placeholder="请输入邮箱" v-model="formModel.email" border="none"></u--input>
					</u-form-item>
					<u-form-item required labelWidth="80" label="邮箱验证码" prop="capture_email">
						<view class="form-item-email-code">
							<u-code-input v-model="formModel.capture_email" :maxlength="6" size="24" fontSize="14"></u-code-input>
						</view>
					</u-form-item>
					<view class="form-item-email-code-tap" @tap="tapEmailCaptcha" :class="{disabled: email_cooling}">
						{{ email_cooling ? `${emailIntervalNum}秒后获取` : '获取验证码' }}
					</view>
					<u-form-item required labelWidth="80" label="密码" prop="password" borderBottom>
						<u-input maxlength="20" placeholder="请输入密码" :type="showPassword ? 'text' : 'password'"
							v-model="formModel.password" border="none">
							<u-icon v-if="!showPassword" slot="suffix" name="eye-off" color="#aaa" size="18"
								@click="showPassword = true"></u-icon>
							<u-icon v-else slot="suffix" name="eye-fill" color="#aaa" size="18"
								@click="showPassword = false"></u-icon>
						</u-input>
					</u-form-item>
					<u-form-item required labelWidth="80" label="内测码" prop="nickname"
						borderBottom>
						<u--input maxlength="12" placeholder="请输入内测码" v-model="formModel.private_yard" border="none"></u--input>
					</u-form-item>
					<u-form-item required labelWidth="80" label="验证码" prop="code">
						<view class="form-item-code">
							<u-code-input v-model="formModel.capture" :maxlength="4" size="24" fontSize="14"></u-code-input>
							<image :src="captureCode" @tap="tapCaptcha"></image>
						</view>
					</u-form-item>
				</u--form>
				<u--form v-if="showType==='login'" border="none" abelPosition="left" :model="formModel" ref="Form">
					<u-form-item v-if="loginType === 'username'" required labelWidth="80" label="用户名" prop="username" borderBottom>
						<u--input maxlength="18" placeholder="请输入用户名" v-model="formModel.username" border="none"></u--input>
					</u-form-item>
					<u-form-item v-if="loginType === 'email'" required labelWidth="80" label="邮箱" prop="email"
						borderBottom>
						<u--input maxlength="40" placeholder="请输入邮箱" v-model="formModel.email" border="none"></u--input>
					</u-form-item>
					<u-form-item required labelWidth="80" label="密码" prop="password" borderBottom>
						<u-input maxlength="20" placeholder="请输入密码" :type="showPassword ? 'text' : 'password'"
							v-model="formModel.password" border="none">
							<u-icon v-if="!showPassword" slot="suffix" name="eye-off" color="#aaa" size="18"
								@click="showPassword = true"></u-icon>
							<u-icon v-else slot="suffix" name="eye-fill" color="#aaa" size="18"
								@click="showPassword = false"></u-icon>
						</u-input>
					</u-form-item>
					<u-form-item required labelWidth="80" label="验证码" prop="code">
						<view class="form-item-code">
							<u-code-input v-model="formModel.capture" :maxlength="4" size="24" fontSize="14"></u-code-input>
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

					<text>已阅读并同意<text @click="handleShowAgreement" class="a-lisence">懒比蛋使用协议</text></text>
				</view>
				<view class="bottom-others" v-if="showType==='login'">
					<view class="bottom-others-text">其他登录方式</view>
					<view class="bottom-others-icons">
						<view class="bottom-others-icon" v-if="loginType === 'username'" @click="handleChangeLoginType">
							<image class="bottom-others-icon-img" src="@/static/images/guard/email.png"></image>
						</view>
						<view class="bottom-others-icon" v-if="loginType === 'email'" @click="handleChangeLoginType">
							<image class="bottom-others-icon-img" src="@/static/images/guard/account.png"></image>
						</view>
						<view class="bottom-others-icon">
							<image class="bottom-others-icon-img" src="@/static/images/guard/wechat.png"></image>
						</view>
						<view class="bottom-others-icon" v-if="os === 'ios'">
							<image class="bottom-others-icon-img" src="@/static/images/guard/apple.png"></image>
						</view>
					</view>
				</view>
				<u-button v-if="showType==='register'" color="#ffbb00" type="primary" text="注册" @click="handleRegister">
				</u-button>
				<u-button v-else color="#ffbb00" type="primary" text="登录" @click="handleLogin"></u-button>
				<u-button v-if="showType==='register'"
					:customStyle="{color: '#333', borderColor: '#eee', marginTop: '36rpx'}" :plain="true" type="primary"
					text="已有账号,立即登录" @click="changeShowType('login')"></u-button>
				<u-button v-else :customStyle="{color: '#333', borderColor: '#eee', marginTop: '36rpx'}" :plain="true"
					type="primary" text="没有账号,前往注册" @click="changeShowType('register')"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { isEmail } from '@/utils/validate.js'
	import Vue from 'vue';
	import {
		registerAction,
		loginAction,
		getUserInfoByUsernameAction,
		captureAction,
		captureEmailAction
	} from '@/service/service'
	export default Vue.extend({
		data() {
			const arr = [2, 3, 4, 5, 6, 7, 8, 9];
			for (var i = 65; i < 122; i++) {

				if (i > 90 && i < 97) {

					continue;
				}
				arr.push(String.fromCharCode(i));
			}
			return {
				loginType: 'username',
				customStyleIn: {
					width: '100vw'
				},
				showType: 'login',
				formModel: {
					username: '',
					nickname: '',
					password: '',
					capture: '',
					private_yard: '',
					email: '',
					capture_email: ''
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
				device_id: '',
				email_cooling: false,
				emailInterval: null,
				emailIntervalNum: 0,
				os: ''
			}
		},
		created() {
			console.log('uni.getSystemInfoSync()', uni.getSystemInfoSync())
			this.device_id = uni.getSystemInfoSync().deviceId
			this.os = uni.getSystemInfoSync().platform
			this.tapCaptcha()
		},
		methods: {
			handleChangeLoginType(){
				this.loginType = this.loginType === 'username' ? 'email' : 'username'
				this.formModel = {
					username: '',
					nickname: '',
					password: '',
					capture: '',
					private_yard: '',
					email: '',
					capture_email: ''
				}
			},
			getUserInfo(userInfo) {
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
				if(this.showType === 'register'){
					if (!this.formModel.username) {
						errorMessage = '请输入用户名'
					} else if (!this.formModel.nickname) {
						errorMessage = '请输入昵称'
					} else if (!this.formModel.email) {
						errorMessage = '请输入邮箱'
					} else if (!isEmail(this.formModel.email)) {
						errorMessage = '请输入正确格式的邮箱'
					} else if (!this.formModel.capture_email) {
						errorMessage = '请输入邮箱验证码'
					} else if (!this.formModel.password) {
						errorMessage = '请输入密码'
					} else if (!this.formModel.capture) {
						errorMessage = '请输入验证码'
					} else if (!this.formModel.private_yard) {
						errorMessage = '请输入内测码'
					}
				}else{
					if (!this.formModel.username && this.loginType === 'username') {
						errorMessage = '请输入用户名'
					} else if (!this.formModel.email && this.loginType === 'email') {
						errorMessage = '请输入邮箱'
					} else if (this.loginType === 'email' && !isEmail(this.formModel.email)) {
						errorMessage = '请输入正确格式的邮箱'
					} else if (!this.formModel.password) {
						errorMessage = '请输入密码'
					} else if (!this.formModel.capture) {
						errorMessage = '请输入验证码'
					}
				}
				
				return errorMessage
			},
			changeShowType(showType) {
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
					this.$loadingOn();
					registerAction({
						user: {...this.formModel},
						option: {
							capture: this.formModel.capture,
							device_id: this.device_id,
							capture_email: this.formModel.capture_email
						}
					}).then(res => {
						console.log('res', res);
						uni.setStorageSync('SYS_AUTH_TOKEN_KEY', res.data.token);
						this.close(this.formModel);
						this.$loadingOff();
						//this.getUserInfo(this.formModel)
					}).catch(err => {
						this.formModel.capture = '';
						this.tapCaptcha();
						this.$loadingOff();
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
					this.$loadingOn();
					loginAction({
						user: {...this.formModel},
						option: {
							capture: this.formModel.capture,
							device_id: this.device_id,
							login_type: this.loginType
						}
					}).then(res => {
						console.log('res', res);
						uni.setStorageSync('SYS_AUTH_TOKEN_KEY', res.data.token);
						this.close(this.formModel);
						this.$loadingOff();
						//this.getUserInfo(this.formModel)
					}).catch(err => {
						this.formModel.capture = '';
						this.tapCaptcha();
						this.$loadingOff();
					})
				}
			},
			close(formModel) {
				if(formModel){
					uni.setStorageSync('SYS_SUCCESS_USER_INFO', formModel);
				}
				this.$emit('ok')
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
			},
			tapEmailCaptcha() {
				if(this.email_cooling) return
				let errorMessage = ''
				if (!this.formModel.email) {
					errorMessage = '请输入邮箱'
				} else if (!isEmail(this.formModel.email)) {
					errorMessage = '请输入正确格式的邮箱'
				}
				if(errorMessage){
					uni.showToast({
						title: errorMessage,
						icon: 'none'
					})
					return
				}
				this.$loadingOn();
				captureEmailAction(this.device_id, this.formModel.email).then(res=>{
					this.$loadingOff();
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
					this.emailStartInterval()
				}).catch(err=>{
					this.$loadingOff();
				})
			},
			emailStartInterval() {
				this.email_cooling = true
				this.emailInterval && clearInterval(this.emailInterval)
				this.emailIntervalNum = 60
				this.emailInterval = setInterval(()=>{
					if(this.emailIntervalNum === 1){
						this.emailInterval && clearInterval(this.emailInterval)
						this.emailIntervalNum = 0
						this.email_cooling = false
					}else{
						this.emailIntervalNum -= 1
					}
				}, 1000)
			},
			handleShowAgreement(){
				uni.navigateTo({
					url: "/pages-mine/agreement-of-usage"
				})
			}
		}
	})
</script>

<style lang="scss">
	.login-register-wrapper{
		width: 100vw;
	}
	
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
		
		.form-item-email-code{
			width: 100%;
		}
		
		.form-item-email-code-tap{
			display: inline-block;
			box-sizing: border-box;
			padding: 4rpx 8rpx;
			font-size: 12px;
			border: 1px solid #999;
			border-radius: 12rpx;
			
			&.disabled{
				background: #ddd;
				color: #999;
			}
		}
	}

	.mine-popup {
		box-sizing: border-box;
		padding-top: 48rpx;

		.mine-popup-top {
			width: 100%;
			margin-bottom: 24rpx;
			box-sizing: border-box;
			padding: 0 70rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.mine-popup-top-text{
				font-weight: 800;
				font-size: 20px;
			}
			
			.mine-popup-top-switch{
				display: flex;
				align-items: center;
				flex-shrink: 0;
				
				.mine-popup-top-switch-text{
					font-size: 12px;
				}
				
				.mine-popup-top-switch-in{
					margin-left: 12rpx;
					display: flex;
					align-items: center;
					position: relative;
					width: 180rpx;
					height: 48rpx;
					border-radius: 24rpx;
					background: #eee;
					
					.mine-popup-top-switch-item{
						width: 50%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						color: #999;
					}
					
					.mine-popup-top-switch-swip{
						width: 50%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						color: #fff;
						font-weight: 700;
						background: rgba(255,187,0,1);
						position: absolute;
						top: 0;
						left: 0;
						transition: all 0.3s;
						box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
						border-radius: 24rpx;
						
						&.to-right{
							left: 50%;
						}
					}
				}
			}
		}

		.mine-popup-bottom {
			padding: 30rpx 60rpx;

			.bottom-lisence {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				margin-bottom: 48rpx;

				.a-lisence {
					text-decoration: underline;
					color: #808080;
					padding-left: 2rpx;
				}
			}
			
			.bottom-others{
				margin-bottom: 48rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.bottom-others-text{
					font-size: 12px;
					color: #333;
					padding-right: 24rpx;
				}
				
				.bottom-others-icons{
					display: flex;
					align-items: center;
					
					.bottom-others-icon{
						margin-right: 24rpx;
						box-sizing: border-box;
						width: 72rpx;
						height: 72rpx;
						border-radius: 50%;
						background: #fff;
						box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
						display: flex;
						align-items: center;
						justify-content: center;
						
						.bottom-others-icon-img{
							width: 48rpx;
							height: 48rpx;
						}
					}
				}
			}
		}
	}
</style>
