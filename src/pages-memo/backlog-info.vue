<template>
	<scroll-view scroll-y class="memorial-day-info-wrapper">
		<view class="memorial-day-info-wrapper-inner">
			<u-navbar placeholder leftIconSize="14" border bgColor="#E1BBC9" :title="showType === 'add' ? '新增待办' : '编辑待办'" @leftClick="close" leftText="返回">
			</u-navbar>
			<view class="modal-wrapper">
				<view class="tip">待办只支持阳历日期</view>
				<view class="modal-body">
					<view class="modal-body-item">
						<view>
							<u-icon name="edit-pen" color="#E1BBC9" size="18"></u-icon>
						</view>
						<u--input placeholder="请输入待办名称" border="none" v-model="name"></u--input>
					</view>
					<view class="modal-body-item remark">
						<view class="left-icon">
							<u-icon name="tags" color="#E1BBC9" size="18"></u-icon>
						</view>
						<uni-easyinput placeholderStyle="font-size: 15px" :inputBorder="false" :styles="{fontSize: '15px'}" borderColor="transparent" type="textarea" v-model="remark" placeholder="请输入待办内容(选填)" border="none"></uni-easyinput>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="calendar" color="#E1BBC9" size="18"></u-icon>
						</view>
						<text @click="handleChooseDate"
							:class="{empty: !chooseDate}">{{ chooseDate || '请选择Deadline' }}</text>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="warning" color="#E1BBC9" size="18"></u-icon>
						</view>
						<text>{{ columnsPriority[0][priority] }}</text>
						<u-rate activeColor="#E1BBC9" activeIcon="warning-fill" inactiveIcon="warning" :count="count" v-model="priority"></u-rate>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="bell" color="#E1BBC9" size="18"></u-icon>
						</view>
						<text @click="handleChooseRemind"
							:class="{empty: remind === 0 }">{{ columns[0][remind] }}</text>
					</view>
				</view>
				<view class="modal-button">
					<u-button :customStyle="inviteButtonStyle" type="primary" color="#E1BBC9" text="确定"
						@click="handleOk"></u-button>
				</view>
			</view>
		</view>
		<u-datetime-picker :minDate="-2209017943000" :overlayStyle="{zIndex: 10090}" zIndex="10091" :show="showDatePicker" @cancel="showDatePicker = false" v-model="valuePicker" confirmColor="#E1BBC9" @confirm="handleConfirmDate"></u-datetime-picker>
		<u-picker ref="uPicker" :defaultIndex="defaultIndex" :key="refreshKey" :overlayStyle="{zIndex: 10090}" zIndex="10091" :show="showPicker" :columns="columns" @close="showPicker = false" @cancel="showPicker = false" @confirm="handleConfirmRemind"></u-picker>
		<u-picker ref="uPicker" :defaultIndex="defaultIndexPriority" :key="refreshKeyPriority" :overlayStyle="{zIndex: 10090}" zIndex="10091" :show="showPickerPriority" :columns="columnsPriority" @close="showPickerPriority = false" @cancel="showPickerPriority = false" @confirm="handleConfirmPriority"></u-picker>
	</scroll-view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import store from '@/store/index'
	import moment from 'moment'
	import {
		createBacklogAction,
		updateBacklogAction
	} from '@/service/service';
	export default {
		data() {
			return {
				historyList: [],
				showModal: false,
				name: '',
				count: 4,
				remark: '',
				chooseDate: '',
				inviteButtonStyle: {
					width: '180rpx',
					height: '70rpx',
					marginTop: '40rpx'
				},
				showPicker: false,
				showDatePicker: false,
				showPickerPriority: false,
				valuePicker: Number(new Date()),
				refreshKey: 0,
				refreshKeyPriority: 'x',
				remind: 0,
				priority: 1,
				columns: [
					['不提醒', '当天提醒', '提前一天提醒', '提前一周提醒', '提前一月提醒']
				],
				columnsPriority: [
					['预置', '低优先级', '中优先级', '高优先级', '紧急']
				],
				showType: 'add',
				chooseInfo: {},
				defaultIndex: [0],
				defaultIndexPriority: [0]
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
					that.name = that.chooseInfo.name
					that.remark = that.chooseInfo.remark
					that.chooseDate = that.chooseInfo.backlog_day
					that.remind = that.chooseInfo.remind
					that.priority = that.chooseInfo.priority
					that.defaultIndex = [that.remind]
					that.defaultIndexPriority = [that.priority]
					that.refreshKey ++
					that.refreshKeyPriority += 'x'
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
				createBacklogAction({
					created_by: this.userInfo.id,
					name: this.name,
					remark: this.remark,
					backlog_day: this.chooseDate,
					remind: this.remind,
					priority: this.priority
				}).then(res=>{
					console.log('backlog_day add', this.chooseDate)
					this.$toast(res.message)
					this.close()
				}).catch(err=>{
					this.$toast(err && err.message)
				})
			},
			handleEdit(){
				updateBacklogAction({
					...this.chooseInfo,
					created_by: this.userInfo.id,
					name: this.name,
					remark: this.remark,
					backlog_day: this.chooseDate,
					remind: this.remind,
					priority: this.priority
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
				this.chooseDate = moment(new Date(e.value), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
				console.log('backlog_day confirm', this.chooseDate)
			},
			handleChooseRemind() {
				this.showPicker = true
			},
			handleChoosePriority(){
				this.showPickerPriority = true
			},
			handleConfirmRemind(e){
				console.log('e',e)
				this.showPicker = false
				this.remind = e.indexs[0]
			},
			handleConfirmPriority(e){
				console.log('e',e)
				this.showPickerPriority = false
				this.priority = e.indexs[0]
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
				
				&.remark{
					line-height: auto;
					height: 100px;
					align-items: flex-start;
					box-sizing: border-box;
					padding-top: 10rpx;
					
					.left-icon{
						padding-top: 10px;
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
