<template>
	<view class="home-content">
		<!-- #ifndef APP-NVUE || MP-TOUTIAO -->
		<view class="u-swiper-block">
			<u-swiper :list="list3" previousMargin="30" nextMargin="30" circular :autoplay="true" radius="5"
				bgColor="#ffffff"></u-swiper>
		</view>
		<!-- #endif -->
		<view class="home-album">
			<view class="home-album-item" v-for="(u,index) in listInfo" :key="index" :class="{'last-child': index === listInfo.length-1}">
				<view class="album-left">
					<image @click="showAvatar(u.avatar)" class="album-avatar" :src="u.avatar"></image>
				</view>
				<view class="album-right">
					<view class="album-nickname">{{ u.nickname }}</view>
					<view class="album-content">{{ u.content }}</view>
					<u-album multipleSize="190rpx" space="12rpx" :urls="u.imgs"></u-album>
					<view class="album-bottom">
						<view class="album-bottom-in">
							<text class="comment-time">{{ u.created_time }}</text>
						</view>
						<view class="album-bottom-in">
							<view class="album-bottom-item">
								<u-icon v-if="!u.praise" name="thumb-up" color="#333" size="24"></u-icon>
								<u-icon v-else name="thumb-up-fill" color="#333" size="24"></u-icon>
								<text class="item-text">{{ u.praise ? u.praise : '点赞' }}</text>
							</view>
							<view class="album-bottom-item">
								<u-icon name="chat" color="#333" size="24"></u-icon>
								<text class="item-text">{{ u.comments ? u.comments : '评论' }}</text>
							</view>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<view class="no-more">没有更多了~</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				list3: [
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				],
				listInfo: [
					{
						avatar: 'https://img2.woyaogexing.com/2022/05/17/a33db496af3d4d64a3194e2d9408f78e!400x400.jpeg',
						nickname: '帅王子',
						content: '哈哈，我发社区记录啦！😄😊🍨👌🏻🚗 快来评论我吧，给我点赞！',
						imgs: [
							'https://cdn.uviewui.com/uview/album/1.jpg'
							],
						praise: 12,
						comments: 3,
						created_time: '5分钟前'
					},
					{
						avatar: 'https://img2.woyaogexing.com/2022/05/17/9635e23b9ddd4d32bb20ac2c22d71d37!400x400.jpeg',
						nickname: '小美女',
						content: '不是春水初生，春林初盛，春风十里不如你。而是遇见你，微风起，新柳生绿意，蜂蝶翻飞花丛里，眼上眉梢皆是喜。',
						imgs: [
							'https://cdn.uviewui.com/uview/album/1.jpg',
							'https://cdn.uviewui.com/uview/album/2.jpg',
							'https://cdn.uviewui.com/uview/album/3.jpg'
							],
						praise: 4,
						comments: 0,
						created_time: '昨天'
					},
					{
						avatar: 'https://img2.woyaogexing.com/2022/05/17/33b2b7c3c3144c07927b0afdef846e8f!400x400.jpeg',
						nickname: '帅拉拉',
						content: '爱让悬崖变平地，生出森林。 一整片森林，你在树荫里。 ——《你是我的风景》',
						imgs: [
							'https://cdn.uviewui.com/uview/album/1.jpg',
							'https://cdn.uviewui.com/uview/album/2.jpg',
							'https://cdn.uviewui.com/uview/album/3.jpg',
							'https://cdn.uviewui.com/uview/album/4.jpg',
							'https://cdn.uviewui.com/uview/album/5.jpg',
							'https://cdn.uviewui.com/uview/album/6.jpg'
							],
						praise: 0,
						comments: 3,
						created_time: '5天前'
					},
					{
						avatar: 'https://img2.woyaogexing.com/2022/05/17/0430eda2cd6e47529bdead819e2aae51!400x400.jpeg',
						nickname: '美无比',
						content: '对待自己温柔一点。你只不过是宇宙的孩子，与植物、星辰没什么两样。',
						imgs: [
							'https://cdn.uviewui.com/uview/album/1.jpg',
							'https://cdn.uviewui.com/uview/album/2.jpg',
							'https://cdn.uviewui.com/uview/album/3.jpg',
							'https://cdn.uviewui.com/uview/album/4.jpg',
							'https://cdn.uviewui.com/uview/album/5.jpg',
							'https://cdn.uviewui.com/uview/album/6.jpg',
							'https://cdn.uviewui.com/uview/album/7.jpg',
							'https://cdn.uviewui.com/uview/album/8.jpg',
							'https://cdn.uviewui.com/uview/album/9.jpg',
							'https://cdn.uviewui.com/uview/album/10.jpg',
						],
						praise: 11,
						comments: 12,
						created_time: '5-1'
					}
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.home-content {
		width: 100%;
		position: relative;
		
		.no-more{
			width: 100%;
			position: absolute;
			top: 100%;
			text-align: center;
			font-size: 14px;
			color: #aaa;
			height: 140rpx;
			line-height: 140rpx;
		}
		
		.home-album{
			width: 100%;
			box-sizing: border-box;
			margin-top: 30rpx;
			
			.home-album-item{
				width: 100%;
				display: flex;
				padding: 10rpx 8rpx;
				box-sizing: border-box;
				border-bottom: 1px solid rgba(144, 144, 144, 0.1);
				&.last-child {
					border-bottom: none;
				}
				
				.album-left{
					width: 110rpx;
					flex-shrink: 0;
					box-sizing: border-box;
					padding-top: 10rpx;
					display: flex;
					justify-content: center;
					
					.album-avatar{
						width: 74rpx;
						height: 74rpx;
						border-radius: 10rpx;
					}
				}
				
				.album-right{
					flex-grow: 1;
					box-sizing: border-box;
					padding: 10rpx;
					
					.album-nickname{
						font-size: 16px;
						font-weight: bold;
					}
					
					.album-content{
						font-size: 15px;
						font-weight: normal;
						margin-bottom: 12rpx;
						line-height: 1.2;
						padding-right: 14rpx;
						box-sizing: border-box;
						text-align: initial;
					}
					
					.album-bottom{
						width: 100%;
						margin-top: 14rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-right: 14rpx;
						box-sizing: border-box;
						
						.album-bottom-in{
							display: flex;
							align-items: center;
							justify-content: flex-end;
							
							.comment-time{
								font-size: 14px;
								color: #aaa;
							}
							
							.album-bottom-item {
								margin-left: 30rpx;
								display: flex;
								align-items: center;
								
								.item-text{
									font-size: 14px;
									padding-left: 6rpx;
								}
							}
						}
						
					}
				}
			}
			
		}
	}
	
	/* 轮播图 */
	.u-swiper {
		width: 100vw;
	}
</style>