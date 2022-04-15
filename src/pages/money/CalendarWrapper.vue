<template>
	<view>
		<u-popup :overlay="false" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
			:safeAreaInsetTop="true" :show="showPopup" @close="close">
			<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00"
				:title="`${chooseInfo.name} / ${showType==='spend'?'支出':'收入'}`" @leftClick="close" leftText="返回">
			</u-navbar>
			<view class="calendar-tip">
				选择日期以查看记录，点击 "+" 添加新纪录
			</view>
			<view class="calendar-in">
				<uni-calendar 
					:insert="true"
					:lunar="true"
					@change="clickDate"
					:end-date="timeToday"
					 />
				<image class="calendar-in-icon" @click="showCalculator" src="../../static/images/添加.png"></u-icon>
			</view>
			<u-divider text="历史纪录" textSize="12"></u-divider>
			<view class="history-list">
				<view class="history-title">
					<text>{{ pickDate }}</text><text>{{ ` ${chooseInfo.name} ${showType==='spend'?'总支出: ':'总收入: '}` }}</text><text>{{ todayMoney }}</text>
				</view>
				<u-cell-group v-if="historyList.length">
					<u-cell v-for="(u,index) in historyList" :key="u.id" :title="moment(u.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')" :label="u.remark">
						<view slot="value" style="display: flex;align-items: center;">
							<text>{{ (showType === 'spend' ? '-' : '+') + u.charge_num }}</text>
							<u-icon style="margin-left: 30rpx;margin-right: 10rpx;" name="edit-pen-fill" color="#999" size="16" @click="handleEdit(u.id,u.charge_num,u.remark)"></u-icon>
							<u-icon @click="handleDelete(u.id)" name="trash-fill" color="#999" size="16" ></u-icon>
						</view>
					</u-cell>
				</u-cell-group>
				<u-modal :show="showModal" showCancelButton @cancel="showModal = false;pickId = 0" @confirm="deleteHistoryData" confirmColor="#ffbb00"
					content="确定删除该记录吗？"></u-modal>
			</view>
		</u-popup>
		<Calculator @ok="handleOk" :switchType="switchType" :chooseInfo="chooseInfo" :userInfo="userInfo" :showType="showType" ref="Calculator"></Calculator>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import moment from 'moment';
	// @ts-ignore
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
				todayMoney: 0,
				pickId: 0
			}
		},
		props: {
			userInfo: {
				type: Object,
				default: () => {
					return {
						username: '',
						nickname: '',
						primary_key: '',
						id: 0,
						email: '',
						phone: '',
						avatar: '',
						team_id: 0,
						team_name: ''
					}
				}
			},
			switchType: {
				type: String,
				default: 'personal'
			}
		},
		watch: {
			pickDate: {
				handler(){
					this.getHistoryData({charge_time: this.pickDate + ' 00:00:00', charge_type: this.chooseInfo.id})
				}
			},
			chooseInfo: {
				handler(){
					if(this.chooseInfo.id){
						this.getHistoryData({charge_time: this.pickDate + ' 00:00:00', charge_type: this.chooseInfo.id})
					}
				},
				deep: true
			}
		},
		methods: {
			getHistoryData(findOptions: Record<string,any>){
				this.switchType === 'personal' ?
					getDatePersonalChargeAction({...findOptions, created_by: this.userInfo.id}).then(res=>{
						this.historyList = res.data.result
						this.todayMoney = this.showType === 'spend' ? res.data.summary.total.spend : res.data.summary.total.income
					}) : getDateTeamChargeAction({...findOptions, team_id: this.userInfo.team_id}).then(res=>{
						this.historyList = res.data.result
						this.todayMoney = this.showType === 'spend' ? res.data.summary.total.spend : res.data.summary.total.income
					})
			},
			deleteHistoryData(){
				if(!this.pickId) {
					(this as any).$toast('请选择记录');
					return
				}
				this.switchType === 'personal' ?
					deletePersonalChargeAction(this.pickId).then(res=>{
						(this as any).$toast(res.message || '删除成功');
						this.handleOk();
						this.showModal = false
					}) : deleteTeamChargeAction(this.pickId).then(res=>{
						(this as any).$toast(res.message || '删除成功');
						this.handleOk();
						this.showModal = false
					})
			},
			handleOk(){
				this.$emit('ok')
				this.getHistoryData({charge_time: this.pickDate + ' 00:00:00', charge_type: this.chooseInfo.id});
			},
			handleDelete(id: number){
				this.pickId = id
				this.showModal = true
			},
			handleEdit(id: number, charge_num: number, remark: string){
				(this.$refs.Calculator as any).editInfo.id = id;
				(this.$refs.Calculator as any).editInfo.charge_num = charge_num;
				(this.$refs.Calculator as any).editInfo.remark = remark;
				(this.$refs.Calculator as any).show(true);
				(this.$refs.Calculator as any).pickDate = this.pickDate;
			},
			close() {
				this.showPopup = false
				this.pickDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
			},
			show(record: {
				id: number,
				name: string,
				src: string,
				money: number
			}) {
				this.chooseInfo = {
					...record
				}
				this.showPopup = true
			},
			clickDate(e: {fulldate: string}) {
				this.pickDate = e.fulldate;
			},
			showCalculator(){
				(this.$refs.Calculator as any).show();
				(this.$refs.Calculator as any).pickDate = this.pickDate;
			},
			disabledDate(date: Date) {
				let timestamp = date.getTime();
				if (timestamp > new Date().getTime()) {
					return true
				}
				return false
			},
			showLunar(date: {
				year: string,
				month: string,
				day: string
			}) {
				if (!date) return;

				const lunarObj = lunar.solar2lunar(date.year, date.month, date.day);

				return lunarObj.festival || lunarObj.lunarFestival || lunarObj.IDayCn;
			}
		}
	})
</script>

<style lang="scss">
	
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
		margin-bottom: 44rpx;
		background: #2C405A;
		
		.calendar-in-icon{
			width: 76rpx;
			height: 76rpx;
			box-sizing: border-box !important;
			position: absolute !important;
			z-index: 2 !important;
			bottom: 0 !important;
			left: 50% !important;
			transform: translate(-50%,79%) !important;
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

	.history-list {
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx;
		
		.history-title{
			font-size: 12px;
			color: #909399;
			padding: 0 20rpx 40rpx 20rpx;
		}
	}
</style>
