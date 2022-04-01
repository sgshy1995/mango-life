<template>
	<view>
		<view class="mine-top">
			<view class="mine-top-one">
				<view class="left" @click="handleLoginOrRegister">
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
		<u-popup :overlay="true" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
			:safeAreaInsetTop="true" :show="showPopup" @close="close" @open="open">
			<view class="mine-popup">
				<view class="mine-popup-top">
					<view class="top-back" @click="close">
						<u-icon name="arrow-left" color="#333" size="18"></u-icon>
						<text>返回</text>
					</view>
					<text class="top-title">注册</text>
				</view>
				<u--form border="none" style="border: none;padding-left: 100rpx;padding-right: 100rpx;"
					labelPosition="left" :model="formModel" ref="Form">
					<u-form-item required labelWidth="70" label="用户名" prop="username" borderBottom>
						<u--input placeholder="请输入用户名" v-model="formModel.username" border="none"></u--input>
					</u-form-item>
					<u-form-item required labelWidth="70" label="昵称" prop="nickname" borderBottom>
						<u--input placeholder="请输入昵称" v-model="formModel.nickname" border="none"></u--input>
					</u-form-item>
					<u-form-item required labelWidth="70" label="密码" prop="password" borderBottom>
						<u-input placeholder="请输入密码" :type="showPassword ? 'text' : 'password'"
							v-model="formModel.password" border="none">
							<u-icon v-if="!showPassword" slot="suffix" name="eye-off" color="#aaa" size="18"
								@click="showPassword = true"></u-icon>
							<u-icon v-else slot="suffix" name="eye-fill" color="#aaa" size="18"
								@click="showPassword = false"></u-icon>
						</u-input>
					</u-form-item>
					<u-form-item required labelWidth="70" label="验证码" prop="code">
						<u--input placeholder="请输入验证码" style="width: 70%;" v-model="formModel.code" border="none">
						</u--input>
						<canvas style="width: 168rpx; height: 68rpx;background:white" canvas-id="js-captcha"
							@tap="tapCaptcha"></canvas>
					</u-form-item>
				</u--form>
				<view class="mine-popup-bottom">
					<view class="bottom-lisence">
						<u-checkbox-group v-model="selectedLicense">
							<u-checkbox size="16" shape="circle" activeColor="#ffbb00" name="select"></u-checkbox>
						</u-checkbox-group>

						<text>已阅读并同意<text class="a-lisence">懒比蛋使用协议</text></text>
					</view>
					<u-button color="#ffbb00" type="primary" text="注册" @click="handleRegister"></u-button>
					<u-button :customStyle="{color: '#333', borderColor: '#eee', marginTop: '24rpx'}" :plain="true"
						type="primary" text="已有账号,立即登录"></u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {
		registerAction
	} from '@/service/service'
	export default Vue.extend({
		data() {
			// 验证码字符集
			const arr = [2, 3, 4, 5, 6, 7, 8, 9];
			for (var i = 65; i < 122; i++) {

				if (i > 90 && i < 97) {

					continue;
				}
				// @ts-ignore
				arr.push(String.fromCharCode(i));
			}
			return {
				selected: 3,
				urls: [
					'/pages/index/Index',
					'/pages/money/Money',
					'/pages/memo/Memo',
					'/pages/mine/Mine'
				],
				showPopup: false,
				customStyleIn: {
					width: '100vw'
				},
				formModel: {
					username: '',
					nickname: '',
					password: '',
					code: ''
				},
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
				character: arr
			};
		},
		onLoad() {
			//(this.$refs.Form! as any).setRules(this.formRules)
		},
		onHide() {
			this.selected = 3
		},
		methods: {
			validateForm() {
				let errorMessage = ''
				if (!this.formModel.username) {
					errorMessage = '请输入用户名'
				} else if (!this.formModel.nickname) {
					errorMessage = '请输入昵称'
				} else if (!this.formModel.password) {
					errorMessage = '请输入密码'
				} else if (!this.formModel.code) {
					errorMessage = '请输入验证码'
				}else if (this.formModel.code.toLowerCase() !== this.capValue.toLowerCase()) {
					errorMessage = '验证码错误'
				}
				return errorMessage
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
					registerAction(this.formModel).then(res => {
						console.log('res', res)
					})
				}
			},
			handleLoginOrRegister() {
				this.showPopup = true
				this.tapCaptcha();
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
			close() {
				this.showPopup = false;
				setTimeout(() => {
					(this.$refs.Form!as any).resetFields()
					this.showPassword = false
				}, 200)
			},
			open() {

			},
			// 初始化canvas
			creatCanvas() {

				let str = "";
				this.capValue = "";

				// 随机字符
				for (var i = 0; i < 4; i++) {

					var a = this.character[
						Math.floor(Math.random() * this.character.length)
					];
					str += a;
					this.capValue += a;
				}

				// 随机颜色
				function setColor() {

					var colorValue = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
					var colorArray = colorValue.split(",");
					var color = "#";
					for (var i = 0; i < 6; i++) {

						color += colorArray[Math.floor(Math.random() * 16)];
					}
					return color;
				}
				// console.log(Math.floor(Math.random() * 8 - 4));

				// 创建画布
				var ctx = uni.createCanvasContext("js-captcha");

				// 数字字母
				ctx.setFontSize(24 + Math.floor(Math.random() * 4 - 2));
				ctx.setFillStyle(setColor());
				for (let i = 0; i < 4; i++) {

					ctx.setFontSize(24 + Math.floor(Math.random() * 4 - 2));
					ctx.fillText(str[i], 20 * i + 10, 32);
					ctx.setFillStyle(setColor());
					// 旋转随机在-3到3之间
					ctx.rotate((Math.floor(Math.random() * 6 - 3) * Math.PI) / 180);
				}

				// 直线
				// begin path
				for (let i = 0; i < 10; i++) {

					ctx.beginPath();
					ctx.setStrokeStyle(setColor());
					// x/-10~110 y/-10~50
					ctx.moveTo(
						Math.floor(Math.random() * 100) + Math.floor(Math.random() * 20 - 10),
						Math.floor(Math.random() * 40) + Math.floor(Math.random() * 20 - 10)
					);
					ctx.lineTo(
						Math.floor(Math.random() * 100) + Math.floor(Math.random() * 20 - 10),
						Math.floor(Math.random() * 40) + Math.floor(Math.random() * 20 - 10)
					);
					ctx.stroke();
				}

				ctx.draw();
			},
			// 点击画布重置初始化方法，达到切换验证码效果
			tapCaptcha() {

				this.capShow = false;

				this.$nextTick(() => {

					this.capShow = true;
					this.creatCanvas();
				});
			}
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
