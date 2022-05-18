<template>
	<scroll-view scroll-y class="index-wrapper">
		<u-navbar placeholder title="" leftIconSize="28" border bgColor="#fff" @leftClick="showCamera" leftIcon="camera">
			<view slot="center">
				<u-tabs :current="current" @change="changeTabs" :list="listTitle" :itemStyle="itemStyle" lineColor="#ffbb00"></u-tabs>
			</view>
			<view slot="right">
				<image class="add-icon" src="../../static/images/home/添加.png"></image>
			</view>
		</u-navbar>
		<index-community v-show="current === 0"></index-community>
	</scroll-view>
</template>

<script>
	import IndexCommunity from '@/pages-index/index-community.vue'
	export default {
		components: {
			IndexCommunity
		},
		data() {
			return {
				multipleSize: 70,
				itemStyle: {
					height: '38px',
					fontWeight: 'bold',
					fontSize: '18px'
				},
				listTitle: [
					{
						name: '社区',
						badge: {
							isDot: true
						}
					},
					{
						name: '看板'
					},
				],
				menuBaseUrl: 'https://cdn.uviewui.com/uview/menu/',
				title: 'Hello',
				current: 0
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
			},
			showCamera(){
				
			},
			showAvatar(url){
				// 预览图片
				uni.previewImage({
					urls: [url],
					indicator: 'none'
				});
			},
			changeTabs(info){
				console.log('info', info)
				this.current = info.index
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '@/static/fonts/custom_fonts.css';

	.index-wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		position: relative;
		padding-top: 24rpx;
		
		.add-icon{
			width: 28px;
			height: 28px;
		}
	}

	

	.home-sticky {
		top: 0 !important;
	}

</style>
