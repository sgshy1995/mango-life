<template>
	<view class="index-guard">
		<view class="index-guard-in">
			<u-status-bar></u-status-bar>
			<view class="index-guard-top" :class="{scale: showLoginRegister}">
				<view class="index-guard-top-img">
					<image class="index-guard-top-img-in" src="@/static/lanbidan.png"></image>
				</view>
				<view class="index-guard-top-text">
					<view class="index-guard-top-text-top">懒比蛋生活</view>
					<view class="index-guard-top-text-bottom">我是一个懒比蛋，但是我热爱生活</view>
				</view>
			</view>
			<view class="index-guard-buttons">
				<view class="index-guard-button button-primary" @click="handleLogin">登录</view>
				<view class="index-guard-button" @click="handleRegister">注册</view>
			</view>
			<u-popup round="24rpx" overlayOpacity="0" :show="showLoginRegister" @close="close" @open="open">
				<LoginRegister @ok="handleOk" ref="LoginRegister"></LoginRegister>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import LoginRegister from '@/pages/guard/loginRegister.vue'
	export default {
		components: {
			LoginRegister
		},
		data() {
			return {
				showLoginRegister: false
			}
		},
		onLoad() {
			/* uni.navigateTo({
				url: "/pages/index/Index"
			}) */
			/* uni.switchTab({
				url: "/pages/index/Index"
			}) */
			if(uni.getStorageSync('SYS_AUTH_TOKEN_KEY')){
				uni.switchTab({
					url: "/pages/index/Index"
				})
			}
			setTimeout(() => {
				plus.navigator.closeSplashscreen();
			}, 1000)
		},
		methods: {
			open() {
				// console.log('open');
			},
			close() {
				this.showLoginRegister = false
				// console.log('close');
			},
			handleLogin(){
				this.showLoginRegister = true
			},
			handleRegister(){
				this.showLoginRegister = true
				this.$nextTick(()=>{
					this.$refs.LoginRegister.changeShowType('register')
				})
			},
			handleOk(){
				this.close()
				uni.switchTab({
					url: "/pages/index/Index"
				})
			}
		}
	}
</script>

<style lang="scss">
	.index-guard {
		width: 100vw;
		height: 100vh;
		background: url('../../static/images/guard/guard_back.jpg') no-repeat 100%/100%;
		background-size: cover;

		.index-guard-in {
			width: 100%;
			height: 100%;
			position: relative;
		}

		.index-guard-top {
			width: 100%;
			box-sizing: border-box;
			padding: 48rpx;

			.index-guard-top-img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 24rpx;
				background: rgba(255, 255, 255, 0.5);
				transition: all 0.3s;

				.index-guard-top-img-in {
					width: 60rpx;
					height: 60rpx;
				}
			}

			.index-guard-top-text {
				width: 100%;
				color: #fff;
				transition: all 0.3s;

				.index-guard-top-text-top {
					font-size: 22px;
					font-weight: 800;
				}

				.index-guard-top-text-bottom {
					font-size: 14px;
				}
			}
			
			&.scale{
				.index-guard-top-img{
					transform: scale(1.2) rotate(360deg);
				}
			}
		}

		.index-guard-buttons {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			position: absolute;
			bottom: 0;
			left: 0;
			box-sizing: border-box;
			padding-bottom: 120rpx;

			.index-guard-button {
				margin-bottom: 48rpx;
				width: 60%;
				height: 100rpx;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 16px;
				background: rgba(255,255,255,0.7);
				color: #ffbb00;
				font-weight: 700;

				&.button-primary {
					background: rgba(255,187,0,0.7);
					color: #fff;
				}
			}
		}
	}
</style>
