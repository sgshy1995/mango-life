<template>
	<scroll-view scroll-y class="memorial-day-info-wrapper">
		<view class="memorial-day-info-wrapper-inner">
			<u-navbar placeholder leftIconSize="14" border bgColor="#F86A7F" :title="showType === 'add' ? '新增纪念日' : '编辑纪念日'" @leftClick="close" leftText="返回">
			</u-navbar>
			<view class="modal-wrapper">
				<view class="tip">纪念日只支持阳历日期</view>
				<view class="modal-body">
					<view class="modal-body-item">
						<view>
							<u-icon name="edit-pen" color="#F86A7F" size="18"></u-icon>
						</view>
						<u--input placeholder="请输入纪念日名称" border="none" v-model="memorialName"></u--input>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="tags" color="#F86A7F" size="18"></u-icon>
						</view>
						<u--input placeholder="请输入备注(选填)" border="none" v-model="memorialRemark"></u--input>
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
							:class="{empty: remind === 0 }">{{ columns[0][remind] }}</text>
					</view>
				</view>
				<view class="modal-button">
					<u-button :customStyle="inviteButtonStyle" type="primary" color="#F86A7F" text="确定"
						@click="handleOk"></u-button>
				</view>
			</view>
		</view>
		<u-datetime-picker :minDate="-2209017943000" :overlayStyle="{zIndex: 10090}" zIndex="10091" :show="showDatePicker" @cancel="showDatePicker = false" v-model="valuePicker" confirmColor="#F86A7F" mode="date" @confirm="handleConfirmDate"></u-datetime-picker>
		<u-picker ref="uPicker" :defaultIndex="defaultIndex" :key="refreshKey" :overlayStyle="{zIndex: 10090}" zIndex="10091" :show="showPicker" :columns="columns" @close="showPicker = false" @cancel="showPicker = false" @confirm="handleConfirmRemind"></u-picker>
	</scroll-view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import store from '@/store/index'
	import moment from 'moment'
	import {
		createMemrialDayAction,
		updateMemrialDayAction
	} from '@/service/service';
	export default {
		data() {
			return {
				historyList: [],
				showModal: false,
				memorialName: '',
				memorialRemark: '',
				chooseDate: '',
				inviteButtonStyle: {
					width: '180rpx',
					height: '70rpx',
					marginTop: '40rpx'
				},
				showPicker: false,
				showDatePicker: false,
				valuePicker: Number(new Date()),
				refreshKey: 0,
				remind: 0,
				columns: [
					['不提醒', '当天提醒', '提前一天提醒', '提前一周提醒', '提前一月提醒']
				],
				showType: 'add',
				chooseInfo: {},
				defaultIndex: [0]
			}
		},
		onLoad(){
			const that = this
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('show', function(data) {
			    console.log(data)
				if(data.showType) that.showType = data.showType
				if(data.record) {
					that.chooseInfo = {
						...data.record
					}
					that.memorialName = that.chooseInfo.memorial_name
					that.memorialRemark = that.chooseInfo.memorial_remark
					that.chooseDate = that.chooseInfo.memorial_day
					that.remind = that.chooseInfo.remind
					console.log('that.remind',that.remind)
					that.defaultIndex = [that.remind]
					that.refreshKey ++
				}
			})
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
			handleOk(){
				this.showType === 'add' ? this.handleAdd() : this.handleEdit()
			},
			handleAdd() {
				createMemrialDayAction({
					created_by: this.userInfo.id,
					memorial_name: this.memorialName,
					memorial_remark: this.memorialRemark,
					memorial_day: this.chooseDate,
					remind: this.remind
				}).then(res=>{
					this.$toast(res.message)
					this.close()
				}).catch(err=>{
					this.$toast(err && err.message)
				})
			},
			handleEdit(){
				updateMemrialDayAction({
					...this.chooseInfo,
					created_by: this.userInfo.id,
					memorial_name: this.memorialName,
					memorial_remark: this.memorialRemark,
					memorial_day: this.chooseDate,
					remind: this.remind
				}).then(res=>{
					this.$toast(res.message)
					this.close()
				}).catch(err=>{
					this.$toast(err && err.message)
				})
			},
			handleChooseDate() {
				this.showDatePicker = true
			},
			handleConfirmDate(e){
				console.log('e',e)
				this.showDatePicker = false
				this.chooseDate = moment(new Date(e.value), 'YYYY-MM-DD').format('YYYY-MM-DD')
			},
			handleChooseRemind() {
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
	.memorial-day-info-wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		
		.memorial-day-info-wrapper-inner{
			width: 100%;
			box-sizing: border-box;
			padding: 40rpx;
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
