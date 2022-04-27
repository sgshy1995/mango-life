<template>
	<view class="memo-wrapper">		
		<view class="memo-top">
			<u-notice-bar bgColor="#F86A7F" color="#fff" :text="textNotice"></u-notice-bar>
		</view>
		<view class="memo-body"></view>
		<view class="memo-bottom">
			<view class="memo-bottom-item" @click="handleShowMemorialDay">
				<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/纪念日.png"></image>
				<text class="text">纪念日</text>
			</view>
			<view class="memo-bottom-item">
				<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/生日.png"></image>
				<text class="text">生日</text>
			</view>
			<view class="memo-bottom-item">
				<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/待办.png"></image>
				<text class="text">待办</text>
			</view>
			<view class="memo-bottom-item">
				<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/记录.png"></image>
				<text class="text">记录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import store from '@/store/index'
	export default {
		data() {
			return {
				showPopup: false,
				textNotice: '日期通知功能需要开启通知权限或接受消息提示，否则无效'
			};
		},
		computed: {
			...mapState({
			    userInfo: state => state.user.userInfo
			}),
		},
		methods:{
			handleShowMemorialDay(){
				const that = this
				uni.navigateTo({
					url: "/pages-memo/memorial-day",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							userInfo: that.userInfo
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.memo-wrapper{
	box-sizing: border-box;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	
	.memo-top{
		width: 100%;
		height: 200rpx;
	}
	
	.memo-body{
		flex-grow: 1;
		width: 100%;
	}
	
	
	.memo-bottom{
		width: 100%;
		height: 200rpx;
		box-sizing: border-box;
		border-top: 1px dashed #333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		
		.memo-bottom-item{
			width: 100rpx;
			height: 100rpx;
			border-radius: 20rpx;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 10rpx;
			
			image{
				width: 50rpx;
				height: 50rpx;
				margin-bottom: 14rpx;
			}
			
			text{
				font-size: 12px;
				color: #fff;
			}
		}
	}
}
</style>
