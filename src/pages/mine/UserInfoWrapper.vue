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
