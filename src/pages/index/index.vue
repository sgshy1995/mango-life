<template>
	<view class="home-content">
		<u-sticky class="home-sticky">
			<view class="home-head">
				<text class="home-title">懒比蛋生活</text>
				<image class="home-img" src="../../static/lanbidan.png"></image>
			</view>
		</u-sticky>
		<!-- #ifndef APP-NVUE || MP-TOUTIAO -->
		<view class="u-swiper-block">
			<u-swiper :list="list3" previousMargin="30" nextMargin="30" circular :autoplay="true" radius="5"
				bgColor="#ffffff"></u-swiper>
		</view>
		<!-- #endif -->
		<view class="scroll-wrapper">
			<u-scroll-list indicatorActiveColor="#ffbb00">
				<view class="scroll-list">
					<view class="scroll-list__line" v-for="(item, index) in menuArr" :key="index">
						<view class="scroll-list__line__item" v-for="(item1, index1) in item" :key="index1"
							:class="[(index1 === item.length - 1) && 'scroll-list__line__item--no-margin-right']">
							<image class="scroll-list__line__item__image" :src="menuBaseUrl + item1.icon" mode=""></image>
							<text class="scroll-list__line__item__text">{{ item1.name }}</text>
						</view>
					</view>
				</view>
			</u-scroll-list>
		</view>
	
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		data() {
			return {
				menuBaseUrl: 'https://cdn.uviewui.com/uview/menu/',
				title: 'Hello',
				list3: [
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				],
				menuArr: [
					[{
							name: '天猫新品',
							icon: '11.png'
						},
						{
							name: '今日爆款',
							icon: '9.png'
						}, {
							name: '天猫国际',
							icon: '17.png'
						}, {
							name: '饿了么',
							icon: '6.png'
						}, {
							name: '天猫超市',
							icon: '11.png'
						}, {
							name: '分类',
							icon: '2.png'
						}, {
							name: '天猫美食',
							icon: '3.png'
						}, {
							name: '阿里健康',
							icon: '12.png'
						}, {
							name: '口碑生活',
							icon: '7.png'
						}
					],
					[{
							name: '充值中心',
							icon: '8.png'
						},
						{
							name: '机票酒店',
							icon: '10.png'
						}, {
							name: '金币庄园',
							icon: '18.png'
						}, {
							name: '阿里拍卖',
							icon: '15.png'
						}, {
							name: '淘宝吃货',
							icon: '16.png'
						}, {
							name: '闲鱼',
							icon: '4.png'
						}, {
							name: '会员中心',
							icon: '6.png'
						}, {
							name: '造点新货',
							icon: '13.png'
						}, {
							name: '土货鲜食',
							icon: '14.png'
						}
					]
				]
			};
		},
		onLoad() {

		},
		methods: {
			left() {
				console.log('left');
			},
			right() {
				console.log('right');
			}
		}
	});
</script>

<style lang="scss" scoped>
	@import '@/static/fonts/custom_fonts.css';

	.home-content {}

	/* 轮播图 */
	.u-swiper {
		width: 100vw;
	}
	
	.home-sticky{
		top: 0 !important;
	}

	/* 头部 */
	.home-head {
		width: 100vw;
		height: 200rpx;
		position: relative;
		/*! Edit and share this gradient: https://html5kit.com/gradient-editor/?preset=10,100;100,0;ff0088,0;ffbb00,0 */
		background: -moz-linear-gradient(bottom, rgba(255, 0, 136, 1) 0%, rgba(255, 187, 0, 1) 0%, rgba(255, 187, 0, 0.1) 100%);
		/* FF3.6+ */
		background: -webkit-linear-gradient(bottom, rgba(255, 0, 136, 1) 0%, rgba(255, 187, 0, 1) 0%, rgba(255, 187, 0, 0.1) 100%);
		/* Chrome10-25, Safari5.1-6 */
		background: linear-gradient(to bottom, rgba(255, 0, 136, 1) 0%, rgba(255, 187, 0, 1) 0%, rgba(255, 187, 0, 0.1) 100%);
		/* W3C, IE10+, Firefox16+, Chrome26+, Opera12+, Safari7+ */
		filter: progid:DXImageTransform.Microsoft.gradient(rgba(255, 0, 136, 1) 0%, rgba(255, 187, 0, 1) 0%, rgba(255, 187, 0, 0.1) 100%, GradientType=0);
		/* IE6-9 */

		.home-title {
			color: #333;
			height: 200rpx;
			line-height: 200rpx;
			text-align: center;
			width: 100%;
			font-family: 'KiwiMaru', sans-serif;
			display: inline-block;
			vertical-align: middle;
		}

		.home-img {
			position: absolute;
			left: 18%;
			top: 60rpx;
			width: 80rpx;
			height: 80rpx;
		}
	}

	.u-swiper-block {
		margin-top: 40rpx;
	}
	
	.scroll-wrapper{
		width: 100%;
	}

	.scroll-list {
		@include flex(column);
		
		&__line {
		@include flex;
		margin-top: 10px;
		margin-left: 20rpx;

		&__item {
			margin-right: 20rpx;
			width: 160rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			&__image {
				width: 121rpx;
				height: 96rpx;
			}

			&__text {
				margin-top: 5px;
				color: $u-content-color;
				font-size: 12px;
				text-align: center;
			}

			&--no-margin-right {
				margin-right: 0;
			}
		}
	}
	}
</style>
