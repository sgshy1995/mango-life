<template>
	<scroll-view scroll-y class="memo-wrapper">
		<u-navbar placeholder title="备忘生活" leftIconSize="28" border bgColor="#fff" leftIcon="camera">
			<view slot="left">
				<image class="i-icon" src="../../static/lanbidan.png"></image>
			</view>
		</u-navbar>
		<view class="notice">
			<u-notice-bar :text="textNotice" mode="closable"></u-notice-bar>
		</view>
		<view class="memo-body">
			<view class="memo-total">
				<view class="memo-total-title">- 汇 总 -</view>
				<view class="memo-total-body">
					<view class="body-item">
						<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/待办.png"></image>
						<text class="body-item-text">0</text>
					</view>
					<view class="body-item">
						<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/纪念日.png"></image>
						<text class="body-item-text">{{ memorialDayList.length }}</text>
					</view>
					<view class="body-item">
						<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/生日.png"></image>
						<text class="body-item-text">{{ birthdayList.length }}</text>
					</view>
					<view class="body-item">
						<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/记录.png"></image>
						<text class="body-item-text">0</text>
					</view>
				</view>
			</view>
			<view class="memo-recent">
				<view class="memo-recent-title">最近动态</view>
				<view class="memo-recent-tabs">
					<u-tabs :current="current" @change="changeTabs" :list="listTitle" :itemStyle="itemStyle" lineColor="#ffbb00"></u-tabs>
				</view>
				<view class="memo-recent-body" v-if="current === 0">
					<view class="memo-recent-empty" v-if="!backlogRecentList.length">
						<image src="../../static/images/days/nothing.png"></image>
						<text>暂无动态~</text>
					</view>
					<view class="memo-recent-body-item" v-for="(u,index) in backlogRecentList" :key="index">
						<view class="now" v-if="!u.interval"></view>
						<view class="recent-left">
							<view class="recent-left-top">{{ u.name }}</view>
							<view class="recent-left-center">
								<u-icon name="calendar" color="#333" size="22"></u-icon>
								<text>{{ u.show_time }}</text>
							</view>
							<view class="recent-left-bottom">{{ u.remark }}</view>
						</view>
						<view class="recent-right">
							<view class="recent-right-top" v-if="u.interval">
								<text>倒计时</text>
								{{ u.interval }} 天
							</view>
							<view class="recent-right-top" v-else>
								今天
							</view>
							<view class="recent-right-bottom" :class="{empty: !u.remind}"><u-icon name="bell-fill" :color="u.remind ? '#333333' : '#cdcdcd'" size="14"></u-icon>{{ columnsRemind[0][u.remind] }}</view>
						</view>
					</view>
				</view>
				<view class="memo-recent-body" v-if="current === 1">
					<view class="memo-recent-empty" v-if="!memorialDayRecentList.length">
						<image src="../../static/images/days/nothing.png"></image>
						<text>暂无动态~</text>
					</view>
					<view class="memo-recent-body-item" v-for="(u,index) in memorialDayRecentList" :key="index">
						<view class="now" v-if="!u.interval"></view>
						<view class="recent-left">
							<view class="recent-left-top">{{ u.memorial_name }}</view>
							<view class="recent-left-center">
								<u-icon name="calendar" color="#333" size="22"></u-icon>
								<text>{{ u.show_time }}</text>
							</view>
							<view class="recent-left-bottom">{{ u.memorial_remark }}</view>
						</view>
						<view class="recent-right">
							<view class="recent-right-top" v-if="u.interval">
								<text>倒计时</text>
								{{ u.interval }} 天
							</view>
							<view class="recent-right-top" v-else>
								今天
							</view>
							<view class="recent-right-bottom" :class="{empty: !u.remind}"><u-icon name="bell-fill" :color="u.remind ? '#333333' : '#cdcdcd'" size="14"></u-icon>{{ columnsRemind[0][u.remind] }}</view>
						</view>
					</view>
				</view>
				<view class="memo-recent-body" v-if="current === 2">
					<view class="memo-recent-empty" v-if="!birthdayRecentList.length">
						<image src="../../static/images/days/nothing.png"></image>
						<text>暂无动态~</text>
					</view>
					<view class="memo-recent-body-item" v-for="(u,index) in birthdayRecentList" :key="index">
						<view class="now" v-if="!u.interval"></view>
						<view class="recent-left">
							<view class="recent-left-top">{{ u.name }}</view>
							<view class="recent-left-center">
								<u-icon name="calendar" color="#333" size="22"></u-icon>
								<text>{{ u.show_time }}</text>
							</view>
							<view class="recent-left-bottom">{{ u.remark }}</view>
						</view>
						<view class="recent-right">
							<view class="recent-right-top" v-if="u.interval">
								<text>倒计时</text>
								{{ u.interval }} 天
							</view>
							<view class="recent-right-top" v-else>
								今天
							</view>
							<view class="recent-right-bottom" :class="{empty: !u.remind}"><u-icon name="bell-fill" :color="u.remind ? '#333333' : '#cdcdcd'" size="14"></u-icon>{{ columnsRemind[0][u.remind] }}</view>
						</view>
					</view>
				</view>
				<view class="memo-recent-body" v-if="current === 3">
					<view class="memo-recent-empty">
						<image src="../../static/images/days/nothing.png"></image>
						<text>暂无动态~</text>
					</view>
				</view>
			</view>
		</view>
		<view class="memo-bottom">
			<view class="memo-bottom-item" @click="handleShowBacklog">
				<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/待办.png"></image>
				<text class="text">待办</text>
			</view>
			<view class="memo-bottom-item" @click="handleShowMemorialDay">
				<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/纪念日.png"></image>
				<text class="text">纪念日</text>
			</view>
			<view class="memo-bottom-item" @click="handleShowBirthday">
				<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/生日.png"></image>
				<text class="text">生日</text>
			</view>
			<view class="memo-bottom-item">
				<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/记录.png"></image>
				<text class="text">记录</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import { mapState } from 'vuex'
	import store from '@/store/index'
	import moment from 'moment'
	import 'moment/locale/zh-cn'
	// 使用中文时间
	moment.locale('zh-cn')
	import {
		findBirthdaysAction,
		findMemrialDaysAction,
		findBacklogsAction
	} from '@/service/service';
	import {lunarToSolar} from '@/utils/lunarSolarConverter'
	export default {
		data() {
			return {
				current: 0,
				listTitle: [
					{
						name: '待办'
					},
					{
						name: '纪念日'
					},
					{
						name: '生日'
					},
					{
						name: '记录'
					}
				],
				itemStyle: {
					height: '38px',
					fontWeight: 'bold',
					fontSize: '18px'
				},
				showPopup: false,
				textNotice: '日期通知功能需要开启通知权限或接受消息提示，否则无效',
				columnsRemind: [
					['不提醒', '当天提醒', '提前一天提醒', '提前一周提醒', '提前一月提醒']
				],
				birthdayList: [],
				memorialDayList: [],
				backlogList: [],
				birthdayRecentList: [],
				memorialDayRecentList: [],
				backlogRecentList: []
			};
		},
		computed: {
			...mapState({
			    userInfo: state => state.user.userInfo
			}),
		},
		onShow(){
			this.loadInfo()
		},
		methods:{
			getDayNum(startTime, endTime){
			    const stTime=Date.parse(new Date(startTime))
			    const etTime=Date.parse(new Date(endTime))
			    const usedTime = etTime - stTime; 
			    const days=Math.floor(usedTime/(24*3600*1000));
			    return days			
			},
			loadInfo(){
				findBirthdaysAction(this.userInfo.id).then(res=>{
					this.birthdayList = res.data || []
					this.birthdayRecentList = this.birthdayList.filter(item=>{
						const time = item.is_lunar ? 
						moment(new Date(lunarToSolar(new Date().getFullYear(), item.lunar_month, item.lunar_day)), 'YYYY-MM-DD').format('YYYY-MM-DD') :
						new Date().getFullYear().toString() + '-' + moment(new Date(item.birthday), 'MM-DD').format('MM-DD')
						return new Date(new Date(time).toLocaleDateString()).getTime() <= (new Date(new Date().toLocaleDateString()).getTime() + 31 * 24 * 3600 * 1000) && new Date(new Date(time).toLocaleDateString()).getTime() >= (new Date(new Date().toLocaleDateString()).getTime())
					})
					this.birthdayRecentList.map(item=>{
						const timeEnd = item.is_lunar ? 
						moment(new Date(lunarToSolar(new Date().getFullYear(), item.lunar_month, item.lunar_day)), 'YYYY-MM-DD').format('YYYY-MM-DD') :
						new Date().getFullYear().toString() + '-' + moment(new Date(item.birthday), 'MM-DD').format('MM-DD')
						const timeStart = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
						item.show_time = item.is_lunar ? item.lunar_cn.split('年')[1] : moment(new Date(item.birthday), 'MMMMDo').format('MMMMDo')
						item.interval = this.getDayNum(timeStart, timeEnd)
					})
				})
				findMemrialDaysAction(this.userInfo.id).then(res=>{
					this.memorialDayList = res.data || []
					this.memorialDayRecentList = this.memorialDayList.filter(item=>{
						const time = new Date().getFullYear().toString() + '-' + moment(new Date(item.memorial_day), 'MM-DD').format('MM-DD')
						return new Date(new Date(time).toLocaleDateString()).getTime() <= (new Date(new Date().toLocaleDateString()).getTime() + 31 * 24 * 3600 * 1000) && new Date(new Date(time).toLocaleDateString()).getTime() >= (new Date(new Date().toLocaleDateString()).getTime())
					})
					this.memorialDayRecentList.map(item=>{
						const timeEnd = new Date().getFullYear().toString() + '-' + moment(new Date(item.memorial_day), 'MM-DD').format('MM-DD')
						const timeStart = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
						item.show_time = moment(new Date(item.memorial_day), 'MMMMDo').format('MMMMDo')
						item.interval = this.getDayNum(timeStart, timeEnd)
					})
				})
				findBacklogsAction(this.userInfo.id).then(res=>{
					this.backlogList = res.data || []
					this.backlogRecentList = this.backlogList.filter(item=>{
						const time = new Date().getFullYear().toString() + '-' + moment(new Date(item.backlog_day.replace(/\-/g, '/')), 'MM-DD').format('MM-DD')
						return new Date(new Date(time).toLocaleDateString()).getTime() <= (new Date(new Date().toLocaleDateString()).getTime() + 31 * 24 * 3600 * 1000) && new Date(new Date(time).toLocaleDateString()).getTime() >= (new Date(new Date().toLocaleDateString()).getTime())
					})
					this.backlogRecentList.map(item=>{
						const timeEnd = new Date().getFullYear().toString() + '-' + moment(new Date(item.backlog_day.replace(/\-/g, '/')), 'MM-DD').format('MM-DD')
						const timeStart = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
						item.show_time = moment(new Date(item.backlog_day.replace(/\-/g, '/')), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
						item.interval = this.getDayNum(timeStart, timeEnd)
					})
				})
			},
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
			},
			handleShowBirthday(){
				const that = this
				uni.navigateTo({
					url: "/pages-memo/birthday",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							userInfo: that.userInfo
						})
					}
				})
			},
			handleShowBacklog(){
				const that = this
				uni.navigateTo({
					url: "/pages-memo/backlog",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							userInfo: that.userInfo
						})
					}
				})
			},
			changeTabs(info){
				console.log('info', info)
				this.current = info.index
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
	
	.i-icon{
		width: 24px;
		height: 24px;
	}
	
	.notice{
		width: 100%;
	}
	
	.memo-top{
		width: 100%;
		height: 220rpx;
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		background: #F86A7F;
		color: #fff;
		position: relative;
		
		.title{
			font-size: 14px;
			position: absolute;
			top: 100rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		
	}
	
	.memo-body{
		box-sizing: border-box;
		padding-bottom: 200rpx;
		padding-top: 24rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
		width: 100%;
		
		.memo-recent{
			width: 100%;
			box-sizing: border-box;
			margin-top: 44rpx;
			.memo-recent-title{
				font-size: 12px;
				margin-bottom: 6rpx;
			}
			.memo-recent-body{
				width: 100%;
				box-sizing: border-box;
				padding-top: 24rpx;
				.memo-recent-empty{
					width: 100%;
					height: 290rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					
					text{
						font-size: 12px;
						color: #cdcdcd;
					}
					
					image{
						width: 50rpx;
						height: 50rpx;
						margin-bottom: 16rpx;
					}
				}
				
				.memo-recent-body-item{
					width: 100%;
					box-sizing: border-box;
					margin-bottom: 14rpx;
					box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
					padding: 12rpx 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-radius: 8rpx;
					position: relative;
					overflow: hidden;
					
					.now{
						position: absolute;
						width: 0;
						height: 0;
						border-top: 40rpx solid rgba(255,187,0,1);
						border-right: 40rpx solid rgba(255,187,0,1);
						border-bottom: 40rpx solid transparent;
						border-left: 40rpx solid transparent;
						top: 0;
						right: 0;
						z-index: 1;
					}
					
					.recent-left{
						box-sizing: border-box;
						padding-left: 6rpx;
						border-left: 3px solid rgba(255,187,0,1);
						position: relative;
						z-index: 2;
						
						.recent-left-top{
							font-size: 14px;
							font-weight: 800;
							padding-left: 8rpx;
							margin-bottom: 6rpx;
						}
						
						.recent-left-center{
							font-size: 14px;
							display: flex;
							align-items: center;
							
							text{
								padding-left: 6rpx;
							}
						}
						
						.recent-left-bottom{
							padding-left: 8rpx;
							font-size: 12px;
							color: #cdcdcd;
							max-width: 300rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
					
					.recent-right{
						font-size: 14px;
						display: flex;
						flex-direction: column;
						justify-content: flex-end;
						text-align: right;
						position: relative;
						z-index: 2;
						
						.recent-right-top{
							width: 100%;
							
							text{
								font-size: 12px;
								padding-right: 8rpx;
							}
							
							text-align: right;
						}
						
						.recent-right-bottom{
							margin-top: 8rpx;
							font-size: 12px;
							display: flex;
							align-items: center;
							text-align: right;
							
							&.empty{
								color: #cdcdcd;
							}
							
							text{
								padding-left: 6rpx;
							}
						}
					}
				}
			}
		}
		
		.memo-total{
			width: 100%;
			height: 200rpx;
			border-radius: 18rpx;
			box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
			box-sizing: border-box;
			padding: 14rpx;
			background: rgba(255,187,0,0.5);
			
			.memo-total-title{
				font-size: 12px;
				height: 40rpx;
				line-height: 40rpx;
				width: 100%;
				text-align: center;
			}
			
			.memo-total-body{
				width: 100%;
				height: 132rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				
				.body-item{
					width: 50%;
					height: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					
					image {
						width: 40rpx;
						height: 40rpx;
					}
					
					text{
						color: #fff;
						padding-left: 14rpx;
					}
				}
			}
		}
	}
	
	
	.memo-bottom{
		width: 100%;
		height: 140rpx;
		box-sizing: border-box;
		border-top: 1px dashed #333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background: rgba(255, 255, 255, 0.4);
		
		.memo-bottom-item{
			width: 80rpx;
			height: 80rpx;
			border-radius: 20rpx;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 10rpx;
			
			image{
				width: 34rpx;
				height: 34rpx;
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
