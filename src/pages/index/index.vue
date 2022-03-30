<template>
	<view class="home-content">
		<u-sticky>
			<view class="home-head">
				<text class="home-title">懒比蛋生活</text>
				<image class="home-img" src="../../static/lanbidan.png"></image>
			</view>
		</u-sticky>
		<!-- #ifndef APP-NVUE || MP-TOUTIAO -->
		    <view class="u-swiper-block">
		        <u-swiper
		                :list="list3"
		                previousMargin="30"
		                nextMargin="30"
		                circular
		                :autoplay="true"
		                radius="5"
		                bgColor="#ffffff"
		        ></u-swiper>
		    </view>
		    <!-- #endif -->
		<u-tabbar :value="value6" @change="name => value6 = name" :fixed="true" :placeholder="true"
			:safeAreaInsetBottom="true" activeColor="#ffbb00" inactiveColor="#333">
			<u-tabbar-item text="首页" icon="home-fill"></u-tabbar-item>
			<u-tabbar-item text="记账" icon="red-packet-fill"></u-tabbar-item>
			<u-tabbar-item text="备忘" icon="calendar-fill"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account-fill"></u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		data() {
			return {
				title: 'Hello',
				value6: 0,
				list3: [
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				]
			};
		},
		onLoad() {

		},
		methods: {}
	});
</script>

<style lang="scss" scoped>
	@import '@/static/fonts/custom_fonts.css';
	.home-content{
		
	}
	/* 轮播图 */
	.u-swiper{
		width: 100vw;
	}
	/* 头部 */
	.home-head{
		width: 100vw;
		height: 200rpx;
		position: relative;
		/*! Edit and share this gradient: https://html5kit.com/gradient-editor/?preset=10,100;100,0;ff0088,0;ffbb00,0 */
		background: -moz-linear-gradient(bottom, rgba(255,0,136,1) 0%, rgba(255,187,0,1) 0%, rgba(255,187,0,0.1) 100%); /* FF3.6+ */
		background: -webkit-linear-gradient(bottom, rgba(255,0,136,1) 0%, rgba(255,187,0,1) 0%, rgba(255,187,0,0.1) 100%); /* Chrome10-25, Safari5.1-6 */
		background: linear-gradient(to bottom, rgba(255,0,136,1) 0%, rgba(255,187,0,1) 0%, rgba(255,187,0,0.1) 100%); /* W3C, IE10+, Firefox16+, Chrome26+, Opera12+, Safari7+ */
		filter: progid:DXImageTransform.Microsoft.gradient(rgba(255,0,136,1) 0%,rgba(255,187,0,1) 0%,rgba(255,187,0,0.1) 100%, GradientType=0); /* IE6-9 */
		
		.home-title{
			color: #333;
			height: 200rpx;
			line-height: 200rpx;
			text-align: center;
			width: 100%;
			font-family: 'KiwiMaru', sans-serif;
			display: inline-block;
			vertical-align: middle;
		}
		
		.home-img{
			position: absolute;
			left: 18%;
			top: 60rpx;
			width: 80rpx;
			height: 80rpx;
		}
	}
	
	.u-swiper-block{
		margin-top: 40rpx;
	}
</style>
