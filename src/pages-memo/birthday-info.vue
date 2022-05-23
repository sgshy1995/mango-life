<template>
	<scroll-view scroll-y class="birthday-info-wrapper">
		<view class="birthday-info-wrapper-inner">
			<u-navbar placeholder leftIconSize="14" border bgColor="#FAB876" :title="showType === 'add' ? '新增生日' : '编辑生日'" @leftClick="close" leftText="返回">
			</u-navbar>
			<view class="modal-wrapper">
				<view class="tip">生日支持阳历和农历两种日期</view>
				<view class="modal-body">
					<view class="modal-body-item">
						<view>
							<u-icon name="edit-pen" color="#FAB876" size="18"></u-icon>
						</view>
						<u--input placeholder="请输入姓名" border="none" v-model="name"></u--input>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="tags" color="#FAB876" size="18"></u-icon>
						</view>
						<u--input placeholder="请输入备注(选填)" border="none" v-model="remark"></u--input>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="coupon" color="#FAB876" size="18"></u-icon>
						</view>
						<text class="item-title">农历模式</text>
						<switch class="lunar-switch" color="#FAB876" :checked="isLunar" @change="changeSwitch"></switch>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="calendar" color="#FAB876" size="18"></u-icon>
						</view>
						<text @click="handleChooseDate"
							:class="{empty: !chooseDate && !chooseDateLunar}">{{ (isLunar ? chooseDateLunar : chooseDate) || '请选择生日' }}</text>
					</view>
					<view class="modal-body-item">
						<view>
							<u-icon name="bell" color="#FAB876" size="18"></u-icon>
						</view>
						<text @click="handleChooseRemind"
							:class="{empty: remind === 0 }">{{ columns[0][remind] }}</text>
					</view>
				</view>
				<view class="modal-button">
					<u-button :customStyle="inviteButtonStyle" type="primary" color="#FAB876" text="确定"
						@click="handleOk"></u-button>
				</view>
			</view>
		</view>
		<u-datetime-picker :minDate="-2209017943000" :overlayStyle="{zIndex: 10090}" zIndex="10091" :show="showDatePicker" @cancel="showDatePicker = false" v-model="valuePicker" confirmColor="#FAB876" mode="date" @confirm="handleConfirmDate"></u-datetime-picker>
		<u-picker ref="uPicker" :defaultIndex="defaultIndex" :key="refreshKey" :overlayStyle="{zIndex: 10090}" zIndex="10091" :show="showPicker" :columns="columns" @close="showPicker = false" @cancel="showPicker = false" @confirm="handleConfirmRemind"></u-picker>
		<u-picker ref="uPickerLunar" :defaultIndex="defaultIndexLunar" :key="refreshKey1" :overlayStyle="{zIndex: 10090}" zIndex="10091" :show="showPickerLunar" :columns="columnsLunar" @close="showPickerLunar = false" @cancel="showPickerLunar = false" @confirm="handleConfirmLunar"></u-picker>
	</scroll-view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import store from '@/store/index'
	import moment from 'moment'
	const years = []
	for(let i = 1900; i <= new Date().getFullYear();i++){
		years.push(i.toString())
	}
	import {
		createBirthdayAction,
		updateBirthdayAction
	} from '@/service/service';
	export default {
		data() {
			return {
				isLunar: false,
				historyList: [],
				showModal: false,
				showPickerLunar: false,
				name: '',
				remark: '',
				chooseDate: '',
				chooseDateLunar: '',
				lunarYear: 0,
				lunarMonth: 0,
				lunarDay: 0,
				inviteButtonStyle: {
					width: '180rpx',
					height: '70rpx',
					marginTop: '40rpx'
				},
				showPicker: false,
				showDatePicker: false,
				valuePicker: Number(new Date()),
				refreshKey: 0,
				refreshKey1: 'x',
				remind: 0,
				columns: [
					['不提醒', '当天提醒', '提前一天提醒', '提前一周提醒', '提前一月提醒']
				],
				columnsLunar: [
					[...years],
					['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'],
					['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九', '三十']
				],
				showType: 'add',
				chooseInfo: {},
				defaultIndex: [0],
				defaultIndexLunar: [years.length - 1, 0, 0]
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
					that.chooseDate = that.chooseInfo.birthday
					that.isLunar = !!that.chooseInfo.is_lunar
					that.chooseDateLunar = that.chooseInfo.lunar_cn
					that.lunarYear = that.chooseInfo.lunar_year
					that.lunarMonth = that.chooseInfo.lunar_month
					that.lunarDay = that.chooseInfo.lunar_day
					that.remind = that.chooseInfo.remind
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
			changeSwitch(e){
				console.log('eeee',e)
				this.isLunar = e.detail.value
				this.chooseDate = ''
				this.chooseDateLunar = ''
				this.lunarYear = 0
				this.lunarMonth = 0
				this.lunarDay = 0
			},
			close() {
				uni.navigateBack()
			},
			handleOk(){
				if(this.validateForm()){
					this.$toast(this.validateForm())
				}else{
					this.showType === 'add' ? this.handleAdd() : this.handleEdit()
				}
			},
			validateForm(){
				if(this.isLunar){
					if(!this.chooseDateLunar || !this.lunarYear){
						return '请选择农历生日'
					}
				}else{
					if(!this.chooseDate){
						return '请选择阳历生日'
					}
				}
			},
			handleAdd() {
				createBirthdayAction({
					created_by: this.userInfo.id,
					name: this.name,
					remark: this.remark,
					is_lunar: this.isLunar ? 1 : 0,
					birthday: this.isLunar ? undefined : this.chooseDate,
					lunar_cn: this.isLunar ? this.chooseDateLunar : undefined,
					lunar_year: this.isLunar ? this.lunarYear : undefined,
					lunar_month: this.isLunar ? this.lunarMonth : undefined,
					lunar_day: this.isLunar ? this.lunarDay : undefined,
					remind: this.remind
				}).then(res=>{
					this.$toast(res.message)
					this.close()
				}).catch(err=>{
					this.$toast(err && err.message)
				})
			},
			handleEdit(){
				updateBirthdayAction({
					...this.chooseInfo,
					created_by: this.userInfo.id,
					name: this.name,
					remark: this.remark,
					is_lunar: this.isLunar ? 1 : 0,
					birthday: this.isLunar ? undefined : this.chooseDate,
					lunar_cn: this.isLunar ? this.chooseDateLunar : undefined,
					lunar_year: this.isLunar ? this.lunarYear : undefined,
					lunar_month: this.isLunar ? this.lunarMonth : undefined,
					lunar_day: this.isLunar ? this.lunarDay : undefined,
					remind: this.remind
				}).then(res=>{
					this.$toast(res.message)
					this.close()
				}).catch(err=>{
					this.$toast(err && err.message)
				})
			},
			handleChooseDate() {
				this.isLunar ? this.showPickerLunar = true : this.showDatePicker = true
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
			},
			handleConfirmLunar(e){
				console.log('e',e)
				this.showPickerLunar = false
				this.chooseDateLunar = `${this.columnsLunar[0][e.indexs[0]]}年${this.columnsLunar[1][e.indexs[1]]}${this.columnsLunar[2][e.indexs[2]]}`
				this.lunarYear = Number(this.columnsLunar[0][e.indexs[0]])
				this.lunarMonth = e.indexs[1] + 1
				this.lunarDay = e.indexs[2] + 1
			}
		}
	}
</script>

<style lang="scss">
	.birthday-info-wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		
		.lunar-switch{
			transform:scale(0.7);
		}
		
		.birthday-info-wrapper-inner{
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
				
				.item-title{
					font-size: 14px;
					color: #909399;
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
