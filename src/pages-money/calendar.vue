<template>
	<view class="calendar-wrapper">
		<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00"
			:title="`${chooseInfo.name} / ${showType==='spend'?'支出':'收入'}`" @leftClick="close" leftText="返回">
		</u-navbar>
		<view class="calendar-body">
			<view class="calendar-tip">
				选择日期以查看记录，点击 "+" 添加新纪录
			</view>
			<view class="calendar-in">
				<uni-calendar 
					:selected="selected"
					:insert="true"
					:lunar="true"
					@change="clickDate"
					:end-date="timeToday"
					 />
				<image class="calendar-in-icon" @click="showCalculator" src="https://eden-life.net.cn:9000/cdn/mango/images/添加.png"></u-icon>
			</view>
			<u-divider text="历史纪录" textSize="12"></u-divider>
			<view class="history-list">
				<view class="history-title">
					<text>{{ pickDate }}</text><text>{{ ` ${chooseInfo.name} ${showType==='spend'?'总支出: ':'总收入: '}` }}</text><text>{{ todayMoney }}</text>
				</view>
				<scroll-view scroll-anchoring scroll-y class="in-body" v-if="renderKey">
					<view class="cell-group" v-if="historyList.length">
						<view class="cell-item" v-for="(u,index) in historyList" :key="u.id" :class="{last: index === historyList.length - 1}">
							<view class="cell-item-left">
								<view class="cell-item-left-top">
									<text class="one">记于 </text>
									<text class="two">{{moment(u.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}}</text>
								</view>
								<view class="cell-item-left-bottom" v-if="u.remark">
									{{ u.remark }}
								</view>
							</view>
							<view class="cell-item-right">
								<text>{{ (showType === 'spend' ? '-' : '+') + u.charge_num }}</text>
								<u-icon style="margin-left: 30rpx;margin-right: 10rpx;" name="edit-pen-fill" color="#999" size="16" @click="handleEdit(u.id,u.charge_num,u.remark)"></u-icon>
								<u-icon @click="handleDelete(u.id)" name="trash-fill" color="#999" size="16" ></u-icon>
							</view>
						</view>
					</view>
					<u-empty text="没有记录,快去记账吧!" v-if="!historyList.length" :show="!historyList.length" mode="history" icon="http://cdn.uviewui.com/uview/empty/history.png"></u-empty>
				</scroll-view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
		<u-modal :show="showModal" showCancelButton @cancel="showModal = false;pickId = 0" @confirm="deleteHistoryData" confirmColor="#ffbb00"
			content="确定删除该记录吗？"></u-modal>
		<Calculator @ok="handleOk" :switchType="switchType" :chooseInfo="chooseInfo" :userInfo="userInfo" :showType="showType" ref="Calculator"></Calculator>
	</view>
	
</template>

<script>
	import Vue from 'vue';
	import moment from 'moment';
	import {lunar} from "@/utils/lunar";
	import Calculator from './Calculator.vue';
	import {
		getDatePersonalChargeAction,
		deletePersonalChargeAction,
		getDateTeamChargeAction,
		deleteTeamChargeAction
	} from '@/service/service';
	export default Vue.extend({
		components: {
			Calculator
		},
		data() {
			return {
				moment: moment,
				customStyleIn: {
					width: '100vw'
				},
				selected: [],
				showPopup: false,
				visible: true,
				showModal: false,
				themeColor: {
					'main-color': '#ffbb00'
				},
				timeToday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				pickDate: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				showType: 'spend',
				chooseInfo: {
					id: 0,
					name: '',
					src: '',
					money: 0
				},
				// id date type money remark
				historyList: [],
				historyListAll: [],
				todayMoney: 0,
				pickId: 0,
				userInfo: {
					username: '',
					nickname: '',
					primary_key: '',
					id: 0,
					email: '',
					phone: '',
					avatar: '',
					team_id: 0,
					team_name: ''
				},
				switchType: 'personal',
				renderKey: true
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
				if(data.switchType) that.switchType = data.switchType
				if(data.userInfo) that.userInfo = data.userInfo
				if(data.record) {
					that.chooseInfo = {
						...data.record
					}
				}
			})
		},
		onShow(){
			if(this.userInfo.id && this.chooseInfo.id){
				this.getHistoryData({charge_time: this.pickDate + ' 00:00:00', charge_type: this.chooseInfo.id})
				this.getHistoryDataAll({charge_type: this.chooseInfo.id})
			}
		},
		watch: {
			chooseInfo: {
				handler(){
					if(this.chooseInfo.id){
						this.getHistoryData({charge_time: this.pickDate + ' 00:00:00', charge_type: this.chooseInfo.id})
						this.getHistoryDataAll({charge_type: this.chooseInfo.id})
					}
				},
				deep: true
			},
			historyListAll:{
				handler(){
					this.selected = []
					if(this.historyListAll && this.historyListAll.length){
						this.historyListAll.map(item=>{
							const itemTime = moment(item.charge_time, 'YYYY-MM-DD').format('YYYY-MM-DD')
							if(this.selected.find(itemIn=>itemIn.date === itemTime)){
								this.selected[this.selected.findIndex(itemIn=>itemIn.date === itemTime)].info = Math.floor((Number(this.selected[this.selected.findIndex(itemIn=>itemIn.date === itemTime)].info) + item.charge_num) * 100) / 100
							}else{
								this.selected.push({
									date: itemTime,
									info: (Math.floor(item.charge_num * 100) / 100).toString()
								})
							}
						})
					}
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			getHistoryData(findOptions){
				this.switchType === 'personal' ?
					getDatePersonalChargeAction({...findOptions, created_by: this.userInfo.id}).then(res=>{
						this.historyList = res.data.result
						this.todayMoney = this.showType === 'spend' ? res.data.summary.total.spend : res.data.summary.total.income
					}) : getDateTeamChargeAction({...findOptions, team_id: this.userInfo.team_id}).then(res=>{
						this.historyList = res.data.result
						this.todayMoney = this.showType === 'spend' ? res.data.summary.total.spend : res.data.summary.total.income
					})
			},
			getHistoryDataAll(findOptions){
				this.switchType === 'personal' ?
					getDatePersonalChargeAction({...findOptions, created_by: this.userInfo.id}).then(res=>{
						this.historyListAll = res.data.result
					}) : getDateTeamChargeAction({...findOptions, team_id: this.userInfo.team_id}).then(res=>{
						this.historyListAll = res.data.result
					})
			},
			deleteHistoryData(){
				if(!this.pickId) {
					this.$toast('请选择记录');
					return
				}
				this.switchType === 'personal' ?
					deletePersonalChargeAction(this.pickId).then(res=>{
						this.$toast(res.message || '删除成功');
						this.handleOk();
						this.$store.dispatch('changeMoneyCount')
						this.showModal = false
					}) : deleteTeamChargeAction(this.pickId).then(res=>{
						this.$toast(res.message || '删除成功');
						this.handleOk();
						this.$store.dispatch('changeMoneyCount')
						this.showModal = false
					})
			},
			handleOk(){
				this.$emit('ok')
				this.$store.dispatch('changeMoneyCount')
				this.getHistoryData({charge_time: this.pickDate + ' 00:00:00', charge_type: this.chooseInfo.id});
				this.getHistoryDataAll({charge_type: this.chooseInfo.id});
				this.renderKey = false
				this.$nextTick(()=>{
					this.renderKey = true
				})
			},
			handleDelete(id){
				console.log('handleDelete', id)
				this.pickId = id
				this.showModal = true
			},
			handleEdit(id, charge_num, remark){
				this.$refs.Calculator.editInfo.id = id;
				this.$refs.Calculator.editInfo.charge_num = charge_num;
				this.$refs.Calculator.editInfo.remark = remark;
				this.$refs.Calculator.show(true);
				this.$refs.Calculator.pickDate = this.pickDate;
			},
			close() {
				uni.navigateBack()
			},
			show(record) {
				this.showPopup = true
			},
			clickDate(e) {
				this.pickDate = e.fulldate;
				this.getHistoryData({charge_time: this.pickDate + ' 00:00:00', charge_type: this.chooseInfo.id})
			},
			showCalculator(){
				this.$refs.Calculator.show();
				this.$refs.Calculator.pickDate = this.pickDate;
			},
			disabledDate(date) {
				let timestamp = date.getTime();
				if (timestamp > new Date().getTime()) {
					return true
				}
				return false
			},
			showLunar(date) {
				if (!date) return;

				const lunarObj = lunar.solar2lunar(date.year, date.month, date.day);

				return lunarObj.festival || lunarObj.lunarFestival || lunarObj.IDayCn;
			}
		}
	})
</script>

<style lang="scss">
	
	.calendar-wrapper{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
	
	.calendar-body{
		width: 100%;
		height: calc(100vh - 200rpx);
		display: flex;
		flex-direction: column;
	}
	
	.calendar-tip{
		padding: 20rpx;
		font-size: 12px;
		color: #909399;
		background: #f4f4f4;
	}

	.calendar-in{
		position: relative;
		z-index: 1;
		width: 100%;
		margin-bottom: 60rpx;
		background: #2C405A;
		
		.calendar-in-icon{
			width: 60rpx;
			height: 60rpx;
			box-sizing: border-box !important;
			position: absolute !important;
			z-index: 2 !important;
			bottom: 0 !important;
			left: 50% !important;
			transform: translate(-50%,125%) !important;
			background: #fff !important;
		}
	}
	
	.lunar-content {
		display: flex;
		align-items: center;
		flex-direction: column;

		.lunar {
			font-size: 12px;
			transform: scale(0.6);
			width: 10vw;
			text-align: center;
		}
	}
	
	.safe-bottom{
		height: 80rpx;
		width: 100%;
		flex-shrink: 0;
		background: #F7F7F7;
		position: relative;
		z-index: 1;
	}

	.history-list {
		width: 100%;
		box-sizing: border-box;
		padding: 10rpx 30rpx;
		
		/*  #ifndef  H5  */ 
		height: 480rpx;
		/*  #endif  */
		
		/*  #ifdef  H5  */
		height: 600rpx;
		/*  #endif  */
		
		
		.in-body{
			width: 100%;
			height: 100%;
			box-sizing: border-box;
		}
		
		.cell-group{
			width: 100%;
		}
		
		.cell-item{
			width: 100%;
			box-sizing: border-box;
			padding: 24rpx 14rpx;
			border-top: 1px solid #909399;
			
			display: flex;
			align-items: center;
			justify-content: space-between;
			&.last{
				border-bottom: 1px solid #909399;
			}
		}
		
		.cell-item-left{
			display: flex;
			flex-direction: column;
			.cell-item-left-top{
				font-size: 14px;
				.one {
					font-size: 12px;
					padding-right: 10rpx;
				}
				
			}
			
			.cell-item-left-bottom{
				font-size: 12px;
				color: #909399;
				padding-top: 14rpx;
			}
		}
		
		.cell-item-right{
			display: flex;
			align-items: center;
			font-size: 14px;
		}
		
		
		.history-title{
			font-size: 12px;
			color: #909399;
			padding: 0 20rpx 40rpx 20rpx;
		}
		
		.history-list-left{
			.one {
				font-size: 12px;
				padding-right: 10rpx;
			}
		}
		.history-list-right{
			display: flex;
			align-items: center;
		}
	}
</style>
