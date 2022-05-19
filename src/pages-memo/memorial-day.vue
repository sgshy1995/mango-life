<template>
	<scroll-view scroll-y class="memorial-day-wrapper">
		<view class="memorial-day-wrapper-inner">
			<u-navbar placeholder leftIconSize="14" border bgColor="#F86A7F" title="纪念日" @leftClick="close" leftText="返回">
			</u-navbar>
			<view class="memorial-top">
				<image src="https://eden-life.net.cn:9000/cdn/mango/images/memo/纪念日.png"></image>
				<view class="right">
					<text>纪念日</text>
					<text>Memorial Day</text>
				</view>
			</view>
			<view class="memorial-body">
				<u-empty text="你还没有纪念日哦" :show="!historyList.length" mode="history"
					icon="http://cdn.uviewui.com/uview/empty/history.png"></u-empty>
				<view class="tips" v-if="historyList.length">您可以左滑来选择编辑或删除一个纪念日，包括设置它的提醒时间</view>
				<view class="manage-list" v-if="historyList.length">
					<uni-swipe-action>
						<uni-swipe-action-item :disabled="u.created_type === 'default'" @click="(info)=>handleClickIcon(info,u)"
							v-for="(u,index) in historyList" :key="u.id" :right-options="swiperOptions">
							<view class="swipe-action u-border-top"
								:class="[index === historyList.length - 1 && 'u-border-bottom']">
								<view class="swipe-action__content">
									<view class="swipe-action__content__text">
										<view class="swipe-action__content__tex__left">
											<view class="swipe-action__content__text__left__top">
												<image :src="u.remind ? remindImgList[0] : remindImgList[1]"></image>
												<text>{{ u.memorial_name }}</text>
												<text class="text-remind" :class="{'no-remind': u.remind === 0}">({{ columns[0][u.remind] }})</text>
											</view>
											<view class="swipe-action__content__text__left__bottom">
												<text>{{ u.memorial_remark }}</text>
											</view>
										</view>
										<view class="swipe-action__content__text__right">
											<text class="text-time">{{ u.memorial_day }}</text>
										</view>
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
				<view class="memorial-add" @click="handleShowMemorialDayInfo('add')">
					<u-icon name="plus" color="#F86A7F" size="20"></u-icon>
					<text>添加纪念日</text>
				</view>
			</view>
		</view>
		<u-modal :show="showModal" showCancelButton @cancel="showModal = false;deletingType = '';" @confirm="deleteTypeData"
			confirmColor="#ffbb00" content="确定删除该纪念日吗？">
		</u-modal>
	</scroll-view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import store from '@/store/index'
	import moment from 'moment'
	import 'moment/locale/zh-cn'
	// 使用中文时间
	moment.locale('zh-cn')
	import {
		findMemrialDaysAction,
		deleteMemrialDayAction
	} from '@/service/service';
	export default {
		data() {
			return {
				remindImgList: [
					require('@/static/images/days/提醒中.png'),
					require('@/static/images/days/待提醒.png')
				],
				historyList: [],
				showModal: false,
				memorialName: '',
				memorialRemark: '',
				chooseDate: '',
				inviteButtonStyle: {
					width: '100rpx',
					height: '50rpx',
					marginTop: '24rpx'
				},
				showPicker: false,
				showDatePicker: false,
				valuePicker: Number(new Date()),
				refreshKey: 0,
				remind: 0,
				columns: [
					['不提醒', '当天提醒', '提前一天提醒', '提前一周提醒', '提前一月提醒']
				],
				pickInfo: {},
				swiperOptions: [{
					text: '编辑',
					style: {
						backgroundColor: '#ffbb00',
						borderRadius: '50%',
						color: '#fff',
						fontSize: '12px',
						padding: '14rpx'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#f56c6c',
						borderRadius: '50%',
						color: '#fff',
						fontSize: '12px',
						marginLeft: '16rpx',
						padding: '14rpx'
					}
				}]
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			}),
		},
		onShow(){
			this.loadData()
		},
		methods: {
			loadData(){
				findMemrialDaysAction(this.userInfo.id).then(res=>{
					this.historyList = res.data
					this.historyList.map(item=>{
						item.memorial_day = moment(new Date(item.memorial_day), 'MMMM Do').format('MMMM Do')
					})
				}).catch(err=>{
					this.$toast(err && err.message)
				})
			},
			deleteTypeData() {
				deleteMemrialDayAction(this.pickInfo.id).then(res => {
					this.$toast(res.message || '删除成功');
					this.loadData()
					this.pickInfo = {};
					this.showModal = false;
					this.deletingType = '';
				}).catch(err=>{
					this.$toast(err.message || '删除失败');
				})
			},
			close() {
				uni.navigateBack()
			},
			handleShowModal() {
				this.showModal = true
			},
			closeModal() {
				this.showModal = false
				setTimeout(()=>{
					this.memorialName = ''
					this.chooseDate = ''
					this.valuePicker = Number(new Date())
					this.refreshKey ++
				},300)
				
			},
			handleShowMemorialDayInfo(type, record){
				const that = this
				uni.navigateTo({
					url: "/pages-memo/memorial-day-info",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							showType: type,
							record
						})
					}
				})
			},
			handleClickIcon(info, record) {
				console.log('click info', info)
				console.log('click record', record)
				this.pickInfo = record
				if(info.index === 1){
					this.deletingType = record.name
					this.showModal = true;
				}else{
					this.$nextTick(()=>{
						this.handleShowMemorialDayInfo('edit', this.pickInfo);
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.memorial-day-wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		
		.memorial-day-wrapper-inner{
			width: 100%;
			box-sizing: border-box;
			padding: 20rpx;
		}

		.memorial-top {
			width: 100%;
			height: 200rpx;
			border-radius: 20rpx;
			background: #F86A7F;
			/* fallback for old browsers */
			background: -webkit-linear-gradient(to right, #6A82FB, #F86A7F);
			/* Chrome 10-25, Safari 5.1-6 */
			background: linear-gradient(to right, #6A82FB, #F86A7F);
			/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 80rpx;
				height: 80rpx;
				margin-right: 40rpx;
			}

			text {
				color: #fff;
				font-size: 14px;
			}

			.right {
				display: flex;
				flex-direction: column;
			}
		}

		.memorial-body {
			width: 100%;

			.memorial-add {
				margin-top: 38rpx;
				width: 100%;
				box-sizing: border-box;
				padding: 14rpx 0;
				border: 2px dashed #F86A7F;
				display: flex;
				align-items: center;
				justify-content: center;

				text {
					font-size: 14px;
					padding-left: 38rpx;
				}
			}
			
			.tips{
				width: 100%;
				box-sizing: border-box;
				padding: 24rpx 12rpx 12rpx 12rpx;
				font-size: 12px;
				color: #C0C4CB;
			}
			
			.manage-list{
				width: 100%;
				box-sizing: border-box;
				padding: 24rpx 24rpx 24rpx 24rpx;
			}
		}
	}

	.modal-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;

		.tip {
			padding: 20rpx;
			font-size: 12px;
			color: #909399;
		}

		.modal-body {
			width: 100%;
			box-sizing: border-box;
			padding: 10rpx 24rpx;

			.modal-body-item {
				width: 100%;
				display: flex;
				align-items: center;
				line-height: 40px;
				height: 40px;

				view {
					margin-right: 10rpx;
				}

				text {
					font-size: 15px;
					padding-right: 10px;

					&.empty {
						color: #C0C4CB;
					}
				}
			}
		}

		.modal-button {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	
	.u-page {
		padding: 0;
	}
	
	.u-demo-block__title {
		padding: 10px 0 2px 15px;
	}
	
	.swipe-action {
		&__content {
			padding: 14rpx 0;
	
			&__text {
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				&__left{
					display: flex;
					flex-direction: column;
					
					&__top{
						display: flex;
						align-items: center;
						image {
							width: 34rpx;
							height: 34rpx;
							margin-right: 20rpx;
							border-radius: 50%;
						}
							
						text {
							font-size: 13px;
							color: $u-main-color;
						}
						
						.text-remind{
							padding-left: 20rpx;
							font-size: 12px;
							&.no-remind{
								color: #909399;
							}
						}
						margin-bottom: 6rpx;
					}
					
					&__bottom{
						font-size: 12px;
						color: #909399;
						display: inline-block;
						vertical-align: middle;
						max-width: 400rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
	
				&__right{
					display: flex;
					align-items: center;
					font-size: 13px;
				}
	
			}
		}
	}
</style>
