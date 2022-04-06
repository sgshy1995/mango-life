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
			<u-cell-group>
				<u-cell icon="info-circle-fill" title="用户名" :value="userInfo.username"></u-cell>
				<u-cell icon="account-fill" title="昵称" :value="userInfo.nickname"></u-cell>
				<u-cell icon="lock-fill" title="私钥" :value="userInfo.primary_key"></u-cell>
				<u-cell icon="phone-fill" title="手机" :value="userInfo.phone"></u-cell>
				<u-cell icon="email-fill" title="邮箱" :value="userInfo.email"></u-cell>
				<u-cell icon="man-add-fill" title="性别" :value="userInfo.gender"></u-cell>
				<u-cell icon="gift-fill" title="生日" :value="userInfo.birthday"></u-cell>
			</u-cell-group>
		</view>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	export default Vue.extend({
		data() {
			return {
				customStyleIn: {
					width: '100vw'
				},
				showPopup: false
			}
		},
		props: {
			userInfo: {
				type: Object,
				default:()=> {
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
				if(!this.showPopup) return
				this.showPopup = false;
			},
			open() {
			
			}
		}
	})
</script>

<style lang="scss">
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
