<template>
	<view>
		<u-popup :overlay="false" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
			:safeAreaInsetTop="true" :show="showPopup" @close="close">
			<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00"
				:title="`${chooseInfo.name} / ${showType==='spend'?'支出':'收入'}`" @leftClick="close" leftText="返回">
			</u-navbar>
			<view style="padding: 20rpx;font-size: 12px;color: #909399;background: #f4f4f4;">
				选择日期以查看记录或添加新纪录
			</view>
			<view style="width: 100%;">
				<vue-hash-calendar :themeColor="themeColor" :disabled-date="disabledDate" @click="clickDate"
					pickerType="date" :visible.sync="visible">
					<template v-slot:day="scope">
						<view class="lunar-content">
							<view>{{ scope.date.day }}</view>
							<view class="lunar">{{ showLunar(scope.date) }}</view>
						</view>
					</template>
				</vue-hash-calendar>
			</view>
			<u-divider text="历史纪录" textSize="12"></u-divider>
			<view class="history-list">
				<u-cell-group>
					<u-cell v-for="(u,index) in historyList" :key="u.id" :title="u.date" :label="u.remark">
						<view slot="value" style="display: flex;align-items: center;">
							<text>{{ (u.type === 'spend' ? '-' : '+') + u.money }}</text>
							<u-icon style="margin-left: 30rpx;margin-right: 10rpx;" name="edit-pen-fill" color="#999" size="16"></u-icon>
							<u-icon name="trash-fill" color="#999" size="16"></u-icon>
						</view>
					</u-cell>
				</u-cell-group>
			</view>
		</u-popup>
		<Calculator :showType="showType" ref="Calculator"></Calculator>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import moment from 'moment';
	// @ts-ignore
	import {lunar} from "@/utils/lunar";
	import Calculator from './Calculator.vue';
	export default Vue.extend({
		components: {
			Calculator
		},
		data() {
			return {
				customStyleIn: {
					width: '100vw'
				},
				showPopup: false,
				visible: true,
				themeColor: {
					'main-color': '#ffbb00'
				},
				showType: 'spend',
				chooseInfo: {},
				historyList: [
					{
						id: '1',
						date: '2022-04-08',
						type: 'spend',
						money: '12.31',
						remark: '水费'
					},
					{
						id: '2',
						date: '2022-04-08',
						type: 'spend',
						money: '200.00',
						remark: '燃气费'
					},
					{
						id: '3',
						date: '2022-04-08',
						type: 'spend',
						money: '102.34',
						remark: '电费'
					}
				]
			}
		},
		methods: {
			close() {
				this.showPopup = false
			},
			show(record: {
				id: string,
				name: string,
				src ? : string,
				money ? : number
			}) {
				this.chooseInfo = {
					...record
				}
				this.showPopup = true
			},
			clickDate(date: string) {
				(this.$refs.Calculator as any).show();
				(this.$refs.Calculator as any).pickDate = moment(date, 'YYYY/MM/DD').format('YYYY/MM/DD');
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
	}
</style>
