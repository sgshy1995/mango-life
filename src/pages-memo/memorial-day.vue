<template>
	<scroll-view scroll-y class="memorial-day-wrapper">
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
			<view class="memorial-add" @click="handleShowModal">
				<u-icon name="plus" color="#F86A7F" size="20"></u-icon>
				<text>添加纪念日</text>
			</view>
		</view>
		<u-modal :showConfirmButton="false" :closeOnClickOverlay="!(showDatePicker || showPicker)" @close="closeModal"
			:overlayStyle="{zIndex: 9000}" zIndex="10000" :show="showModal" title="添加纪念日">
			<view class="modal-wrapper">
				<view class="tip">纪念日只支持阳历日期</view>
				<view class="modal-body">
					<view class="modal-body-item">
						<view>
							<u-icon name="edit-pen" color="#F86A7F" size="18"></u-icon>
						</view>
						<u--input placeholder="请输入纪念日名称" :disabled="showDatePicker || showPicker" border="none" v-model="memorialName"></u--input>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="tags" color="#F86A7F" size="18"></u-icon>
						</view>
						<u--input placeholder="请输入备注(选填)" :disabled="showDatePicker || showPicker" border="none" v-model="memorialRemark"></u--input>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="calendar" color="#F86A7F" size="18"></u-icon>
						</view>
						<text @click="handleChooseDate"
							:class="{empty: !chooseDate}">{{ chooseDate || '请选择纪念日期' }}</text>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="bell" color="#F86A7F" size="18"></u-icon>
						</view>
						<text @click="handleChooseRemind"
							:class="{empty: remind === 0 }">{{ remind === 0 ? '不提醒' : remind === 1 ? '当天' : remind === 2 ? '提前一周' : '提前一月' }}</text>
					</view>
				</view>
				<view class="modal-button">
					<u-button :customStyle="inviteButtonStyle" type="primary" color="#F86A7F" text="确定"
						@click="handleAdd"></u-button>
				</view>
			</view>
		</u-modal>
		<u-datetime-picker :overlayStyle="{zIndex: 10090}" zIndex="10091" :key="refreshKey" :show="showDatePicker" @cancel="showDatePicker = false" v-model="valuePicker" confirmColor="#F86A7F" mode="date" @confirm="handleConfirmDate"></u-datetime-picker>
		<u-picker :overlayStyle="{zIndex: 10090}" zIndex="10091" :show="showPicker" :columns="columns" @close="showPicker = false" @cancel="showPicker = false" @confirm="handleConfirmRemind"></u-picker>
	</scroll-view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import store from '@/store/index'
	import moment from 'moment'
	export default {
		data() {
			return {
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
					['不提醒', '当天', '提前一周', '提前一月']
				]
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			}),
		},
		methods: {
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
			handleAdd() {
				if(this.showDatePicker || this.showPicker) return
				this.closeModal()
			},
			handleChooseDate() {
				if(this.showDatePicker || this.showPicker) return
				this.showDatePicker = true
			},
			handleConfirmDate(e){
				console.log('e',e)
				this.showDatePicker = false
				this.chooseDate = moment(new Date(e.value), 'YYYY-MM-DD').format('YYYY-MM-DD')
			},
			handleChooseRemind() {
				if(this.showDatePicker || this.showPicker) return
				this.showPicker = true
			},
			handleConfirmRemind(e){
				console.log('e',e)
				this.showPicker = false
				this.remind = e.indexs[0]
			}
		}
	}
</script>

<style lang="scss">
	.memorial-day-wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		padding: 20rpx;

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
</style>
