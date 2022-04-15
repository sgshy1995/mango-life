<template>
	<u-popup :overlay="true" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
		:safeAreaInsetTop="true" :show="showPopup" @close="close">
		<scroll-view scroll-y class="analysis-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00"
				:title="showType === 'spend' ? `${switchType==='personal'?'个人':'团队/家庭'} 支出分析` : `${switchType==='personal'?'个人':'团队/家庭'} 收入分析`"
				@leftClick="leftClick" leftText="返回">
			</u-navbar>
			<view class="analysis-body">
				<view class="u-subsection-wrapper">
					<u-subsection :list="titleList" activeColor="#ffbb00" inactiveColor="#333" mode="subsection"
						@change="sectionChange" bgColor="#ffbb00" :current="curNow">
					</u-subsection>
				</view>
				<view class="analysis-time">
					<text>当前选择</text>
					<image src="../../static/images/home/日历.png" style="width: 18px;height: 18px;"></image>
					<text class="date" @click="handleShowPicker" v-if="curNow === 0">{{yearPick2}} 年 {{monthPick}} 月</text>
					<text class="date" @click="handleShowPicker" v-if="curNow === 1">{{yearPick3}} 年</text>
				</view>
				<u-divider text="图表统计"></u-divider>
				<view class="analysis-wrapper">
					<view class="charts-box">
						<qiun-data-charts :inScrollView="true" type="line" :reshow="showPopup" :chartData="chartData" :loadingType="5"
							:disableScroll="false" background="none" :ontouch="true" />
					</view>
				</view>
				<view class="analysis-back" v-if="chooseInfo.id">
					<text @click="backToAll"><< 返回全部统计</text>
				</view>
				<u-divider text="选择分类统计"></u-divider>
				<u-grid col="4" :border="true" @click="clickGrid">
					<u-grid-item v-for="(baseListItem,baseListIndex) in iconsList" :key="baseListIndex">
						<view class="grid-wrapper" :class="{selected: baseListItem.id === chooseInfo.id}">
							<image class="grid-image" :src="baseListItem.src"></image>
							<text class="grid-text">{{ baseListItem.name + '\n' + baseListItem.money }}</text>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</scroll-view>
		<u-picker confirmColor="#ffbb00" v-if="curNow === 0" :defaultIndex="defaultIndexMonth" :show="showPicker" ref="uPicker" :loading="loading" :columns="columnsMonth" @confirm="handleConfirmMonthPicker" @cancel="handleClosePicker">
		</u-picker>
		<u-picker confirmColor="#ffbb00" v-if="curNow === 1" :defaultIndex="defaultIndexYear" :show="showPicker" ref="uPicker" :loading="loading" :columns="columnsYear" @confirm="handleConfirmYearPicker" @cancel="handleClosePicker">
		</u-picker>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {
		getDatePersonalChargeCustomTimeAction,
		getDateTeamChargeCustomTimeAction
	} from '@/service/service';
	import moment from 'moment';
	export default Vue.extend({
		data() {
			return {
				showPicker: false,
				loading: false,
				showType: 'spend',
				curNow: 0,
				switchType: 'personal',
				titleList: ['月', '年'],
				showPopup: false,
				customStyleIn: {
					width: '100vw'
				},
				defaultIndexWeek: [],
				defaultIndexMonth: [],
				defaultIndexYear: [],
				columnsWeek: [[],[]],
				columnDataWeek: [],
				columnsMonth: [[],[]],
				columnDataMonth: [],
				columnsYear: [[],[]],
				columnDataYear: [],
				chartData: {
					categories: [],
					series: [{
						"name": "统计",
						"data": []
					}],
				},
				iconsListIncome: [],
				iconsListSpend: [],
				chooseInfo: {
					icon: '',
					id: ''
				},
				yearPick1: 0,
				yearPick2: 0,
				yearPick3: 0,
				monthPick: 0,
				baseData: {
					total: {},
					items: {}
				}
			};
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
			iconsList: {
				type: Array,
				default: () => {
					return [];
				}
			}
		},
		methods: {
			handleShowPicker(){
				this.showPicker = true
			},
			handleClosePicker(){
				this.showPicker = false
			},
			handleConfirmMonthPicker(e:{indexs: number[], value: number[]}){
				// @ts-ignore
				this.defaultIndexMonth = e.indexs
				this.yearPick2 = e.value[0]
				this.monthPick = e.value[1]
				this.handleClosePicker()
				this.findData()
			},
			handleConfirmYearPicker(e:{indexs: number[], value: number[]}){
				// @ts-ignore
				this.defaultIndexYear = e.indexs
				this.yearPick3 = e.value[0]
				this.handleClosePicker()
				this.findData()
			},
			backToAll(){
				this.chooseInfo = {
					id: '',
					icon: ''
				}
				// @ts-ignore
				this.chartData.categories = this.baseData.total.times
				// @ts-ignore
				this.chartData.series[0].data = this.baseData.total[this.showType === 'spend' ? 'spend' : 'income']
			},
			renderAllColumns(){
				const yearNow = new Date().getFullYear()
				this.yearPick1 = yearNow
				this.yearPick2 = yearNow
				this.yearPick3 = yearNow
				const monthNow  = new Date().getMonth()
				this.monthPick = monthNow + 1
				for(let i=2000;i<=yearNow;i++){
					// @ts-ignore
					this.columnsWeek[0].push(i)
					// @ts-ignore
					this.columnsMonth[0].push(i)
					// @ts-ignore
					this.columnsYear[0].push(i)
				}
				// @ts-ignore
				this.columnsMonth[1] = []
				for(let i=1;i<=12;i++){
					// @ts-ignore
					this.columnsMonth[1].push(i)
				}
				// @ts-ignore
				this.defaultIndexMonth = [this.columnsMonth[0].findIndex((year:number)=>year===yearNow),monthNow]
				// @ts-ignore
				this.defaultIndexYear = [this.columnsYear[0].findIndex((year:number)=>year===yearNow)]
			},
			findData() {
				this.switchType === 'personal' ?
				getDatePersonalChargeCustomTimeAction({
					year: this.curNow === 0 ? this.yearPick2 : this.yearPick3,
					created_by: this.userInfo.id,
					index: this.curNow === 0 ? this.monthPick : 0,
					time_type: this.curNow === 0 ? 'month' : 'year'
				}).then(res => {
					// @ts-ignore
					this.baseData = res.data
					// @ts-ignore
					this.iconsList.map(item=>item.money=0)
					this.iconsList.forEach((item:any)=>{
						// @ts-ignore
						Object.keys(this.baseData.items).map(key=>{
							if(item.id === key){
								// @ts-ignore
								this.showType === 'spend' ? item.money = this.baseData.items[key].spend.reduce((a:number,b:number)=>a+b) : item.money = this.baseData.items[key].income.reduce((a:number,b:number)=>a+b)
							}
						})
					})
					if(this.chooseInfo.id){
						// @ts-ignore
						if(this.baseData.items.hasOwnProperty(this.chooseInfo.id)){
							// @ts-ignore
							this.chartData.series[0].data = this.baseData.items[this.chooseInfo.id][this.showType === 'spend' ? 'spend' : 'income']
						}else{
							// @ts-ignore
							this.chartData.series[0].data = this.chartData.series[0].data.map(num=>0)
						}
					}else{
						// @ts-ignore
						this.chartData.categories = this.baseData.total.times
						// @ts-ignore
						this.chartData.series[0].data = this.baseData.total[this.showType === 'spend' ? 'spend' : 'income']
					}
				}) : getDateTeamChargeCustomTimeAction({
					year: this.curNow === 0 ? this.yearPick2 : this.yearPick3,
					team_id: this.userInfo.team_id,
					index: this.curNow === 0 ? this.monthPick : 0,
					time_type: this.curNow === 0 ? 'month' : 'year'
				}).then(res => {
					console.log('find results res', res)
					// @ts-ignore
					this.baseData = res.data
					// @ts-ignore
					this.iconsList.map(item=>item.money=0)
					this.iconsList.forEach((item:any)=>{
						// @ts-ignore
						Object.keys(this.baseData.items).map(key=>{
							if(item.id === key){
								// @ts-ignore
								this.showType === 'spend' ? item.money = this.baseData.items[key].spend.reduce((a:number,b:number)=>a+b) : item.money = this.baseData.items[key].income.reduce((a:number,b:number)=>a+b)
							}
						})
					})
					if(this.chooseInfo.id){
						// @ts-ignore
						if(this.baseData.items.hasOwnProperty(this.chooseInfo.id)){
							// @ts-ignore
							this.chartData.series[0].data = this.baseData.items[this.chooseInfo.id][this.showType === 'spend' ? 'spend' : 'income']
						}else{
							// @ts-ignore
							this.chartData.series[0].data = this.chartData.series[0].data.map(num=>0)
						}
					}else{
						// @ts-ignore
						this.chartData.categories = this.baseData.total.times
						// @ts-ignore
						this.chartData.series[0].data = this.baseData.total[this.showType === 'spend' ? 'spend' : 'income']
					}
				})
			},
			changeHandler(e: {columnIndex:number, index: number, picker: any}) {
				
			},
			close() {
				this.showPopup = false
				this.chooseInfo = {
					id: '',
					icon: ''
				}
				this.curNow = 0
			},
			show() {
				this.showPopup = true
				this.$nextTick(()=>{
					this.renderAllColumns()
					this.findData()
				})
			},
			leftClick() {
				this.close()
			},
			sectionChange(index: number) {
				this.curNow = index;
				this.findData()
			},
			clickGrid(index: number) {	
				this.chooseInfo = {
					// @ts-ignore
					icon: this.iconsList[index].icon,
					// @ts-ignore
					id: this.iconsList[index].id
				}
				console.log('index',index)
				console.log('chooseInfo',this.chooseInfo)
				// @ts-ignore
				if(this.baseData.items.hasOwnProperty(this.chooseInfo.id)){
					// @ts-ignore
					this.chartData.series[0].data = this.baseData.items[this.chooseInfo.id][this.showType === 'spend' ? 'spend' : 'income']
				}else{
					// @ts-ignore
					this.chartData.series[0].data = this.chartData.series[0].data.map(num=>0)
				}
			}
		}
	})
</script>

<style lang="scss">
	.analysis-wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
		margin-bottom: 20rpx;
	}
	
	.analysis-back{
		width: 100%;
		text-align: right;
		margin-bottom: 20rpx;
		
		text{
			font-size: 14px;
			color: #ffbb00;
		}
	}

	.analysis-box {
		width: 100%;
		height: 100vh;
		padding-bottom: 60rpx;
		box-sizing: border-box;
	}

	.analysis-body {
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 50rpx;
		
		.analysis-time{
			font-size: 14px;
			display: flex;
			align-items: center;
			justify-content: center;
			
			image{
				width: 30rpx;
				height: 30rpx;
				margin-left: 20rpx;
				margin-right: 20rpx;
			}
			
			.date{
				text-decoration: underline;
			}
		}

		.u-subsection-wrapper {
			width: 100% !important;
			color: #333 !important;
			margin-bottom: 40rpx !important;
		}
	}

	.charts-box {
		width: 100%;
		height: 330rpx;
		background: #fff;
		border-radius: 10rpx;
		border: 1rpx dashed #333;
		box-sizing: border-box;
		overflow: hidden;
		position: relative;
		z-index: 9999;
	}

	.grid-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 20rpx;
		min-width: 100rpx;
		margin: 20rpx 0;
		transition: all 0.3s;
		
		&.selected{
			background: #515a60;
			.grid-text{
				color: #fff;
			}
			
		}

		.grid-text {
			font-size: 13px;
			color: #909399;
			padding: 10rpx 0 20rpx 0rpx;
			box-sizing: border-box;
			text-align: center;
			transition: all 0.3s;
		}

		.grid-image {
			margin-top: 20rpx;
			width: 40rpx;
			height: 40rpx;
		}
	}
</style>
