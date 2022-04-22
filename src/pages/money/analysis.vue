<template>
	<view class="analysis-wrapper">
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
					<text class="date" @click="handleShowPicker" v-if="curNow === 0">{{yearPick1}} 年 第 {{weekPick}} 周</text>
					<text class="date" @click="handleShowPicker" v-if="curNow === 1">{{yearPick2}} 年 {{monthPick}} 月</text>
					<text class="date" @click="handleShowPicker" v-if="curNow === 2">{{yearPick3}} 年</text>
				</view>
				<view class="analysis-total">
					<view v-if="curNow === 0">当前周 ({{weekPickFrom}} ~ {{weekPickTo}})<br />总{{showType === 'spend'?'支出':'收入'}}: {{ totalNumWeek }}</view>
					<view v-if="curNow === 1">当前月 ({{monthPickFrom}} ~ {{monthPickTo}})<br />总{{showType === 'spend'?'支出':'收入'}}: {{ totalNumMonth }}</view>
					<view v-if="curNow === 2">当前年 ({{yearPickFrom}} ~ {{yearPickTo}})<br />总{{showType === 'spend'?'支出':'收入'}}: {{ totalNumYear }}</view>
				</view>
				<u-divider text="图表统计"></u-divider>
				<view class="analysis-charts" @tap.stop.prevent>
					<view class="charts-box" @tap.stop.prevent>
						<qiun-data-charts @tap.stop.prevent :inScrollView="true" type="line" :reshow="showPopup" :chartData="chartData"
							:loadingType="5" :disableScroll="false" background="none" :ontouch="true" />
					</view>
				</view>
				<view class="analysis-back" v-if="chooseInfo.id">
					<text @click="backToAll">
						<< 返回全部统计</text>
				</view>
				<u-divider text="选择分类统计"></u-divider>
				<u-grid col="4" :border="true" @click="clickGrid">
					<u-grid-item v-for="(baseListItem,baseListIndex) in iconsListLocal" :key="baseListIndex">
						<view class="grid-wrapper" :class="{selected: baseListItem.id === chooseInfo.id}">
							<image class="grid-image" :src="baseListItem.src"></image>
							<text class="grid-text">{{ baseListItem.name + '\n' + baseListItem.money }}</text>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</scroll-view>
		<u-picker confirmColor="#ffbb00" v-if="curNow === 0" :defaultIndex="defaultIndexWeek" :show="showPicker"
			ref="uPicker" :loading="loading" :columns="columnsWeek" @confirm="handleConfirmWeekPicker" @change="changeHandler"
			@cancel="handleClosePicker">
		</u-picker>
		<u-picker confirmColor="#ffbb00" v-if="curNow === 1" :defaultIndex="defaultIndexMonth" :show="showPicker"
			:loading="loading" :columns="columnsMonth" @confirm="handleConfirmMonthPicker"
			@cancel="handleClosePicker">
		</u-picker>
		<u-picker confirmColor="#ffbb00" v-if="curNow === 2" :defaultIndex="defaultIndexYear" :show="showPicker"
			:loading="loading" :columns="columnsYear" @confirm="handleConfirmYearPicker"
			@cancel="handleClosePicker">
		</u-picker>
	</view>
</template>

<script>
	import Vue from 'vue';
	import {
		getDatePersonalChargeCustomTimeAction,
		getDateTeamChargeCustomTimeAction
	} from '@/service/service';
	import moment from 'moment';
	import {
		getWeeks
	} from '@/utils/week'
	export default Vue.extend({
		data() {
			return {
				totalNumWeek: 0,
				totalNumMonth: 0,
				totalNumYear: 0,
				iconsListLocal: [],
				showPicker: false,
				loading: false,
				showType: 'spend',
				curNow: 0,
				switchType: 'personal',
				titleList: ['周', '月', '年'],
				showPopup: false,
				customStyleIn: {
					width: '100vw'
				},
				defaultIndexWeek: [],
				defaultIndexMonth: [],
				defaultIndexYear: [],
				columnsWeek: [
					[],
					[]
				],
				columnDataWeek: [],
				columnsMonth: [
					[],
					[]
				],
				columnDataMonth: [],
				columnsYear: [
					[],
					[]
				],
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
				weekPick: 0,
				baseData: {
					total: {},
					items: {}
				},
				totalWeekInfo: {},
				weekPickFrom: '',
				weekPickTo: '',
				monthPickFrom: '',
				monthPickTo: '',
				yearPickFrom: '',
				yearPickTo: '',
				iconsList: [],
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
				}
			};
		},
		onLoad() {
			this.getTotalWeekInfo()
			const that = this
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('show', function(data) {
			    console.log(data)
				if(data.switchType) that.switchType = data.switchType
				if(data.showType) that.showType = data.showType
				if(data.iconsList) that.iconsList = data.iconsList
				if(data.userInfo) that.userInfo = data.userInfo
				that.$nextTick(() => {
					that.renderAllColumns()
					that.findData()
				})
			})
		},
		watch: {
			iconsList: {
				handler() {
					this.iconsListLocal = JSON.parse(JSON.stringify(this.iconsList))
				},
				deep: true,
				immediate: true
			},
			showPopup(){
				if(this.showPopup){
					uni.hideTabBar()
				}else{
					this.$nextTick(()=>{
						uni.showTabBar()
					})
				}
			}
		},
		methods: {
			getTotalWeekInfo() {
				const year = new Date().getFullYear()
				const arr = []
				this.columnsWeek = [[],[]]
				for (let i = 2000; i <= year; i++) {
					arr.push(i)
				}
				this.totalWeekInfo = getWeeks(arr)
				Object.keys(this.totalWeekInfo).map((year,index)=>{
					this.columnDataWeek[index] = Object.keys(this.totalWeekInfo[year])
				})
			},
			handleShowPicker() {
				this.showPicker = true
			},
			handleClosePicker() {
				this.showPicker = false
			},
			handleConfirmWeekPicker(e) {
				this.defaultIndexWeek = e.indexs
				this.yearPick1 = e.value[0]
				this.weekPick = e.value[1]
				const todayYearInfo = this.totalWeekInfo[this.yearPick1.toString()]
				this.weekPickFrom = todayYearInfo[this.weekPick.toString()].from
				this.weekPickTo = todayYearInfo[this.weekPick.toString()].to
				this.handleClosePicker()
				this.findData()
			},
			handleConfirmMonthPicker(e) {
				this.defaultIndexMonth = e.indexs
				this.yearPick2 = e.value[0]
				this.monthPick = e.value[1]
				this.monthPickFrom = moment(`${this.yearPick2}-${this.monthPick}-01`, 'YYYY-MM-DD').format('YYYY-MM-DD')
				this.monthPickTo = moment(`${this.yearPick2}-${this.monthPick}-${[1,3,5,7,8,10,12].includes(this.monthPick) ? 31 : [4,6,9,11].includes(this.monthPick) ? 30 : this.yearPick2 / 4 ? 28 : 29}`, 'YYYY-MM-DD').format('YYYY-MM-DD')
				this.handleClosePicker()
				this.findData()
			},
			handleConfirmYearPicker(e) {
				this.defaultIndexYear = e.indexs
				this.yearPick3 = e.value[0]
				this.yearPickFrom = moment(`${this.yearPick3}-01`, 'YYYY-MM').format('YYYY-MM')
				this.yearPickTo = moment(`${this.yearPick3}-12`, 'YYYY-MM').format('YYYY-MM')
				this.handleClosePicker()
				this.findData()
			},
			backToAll() {
				this.chooseInfo = {
					id: '',
					icon: ''
				}
				this.chartData.categories = this.baseData.total.times
				this.chartData.series[0].data = this.baseData.total[this.showType === 'spend' ? 'spend' : 'income']
			},
			renderAllColumns() {
				const yearNow = new Date().getFullYear()
				this.yearPick1 = yearNow
				this.yearPick2 = yearNow
				this.yearPick3 = yearNow
				this.yearPickFrom = moment(`${this.yearPick3}-01`, 'YYYY-MM').format('YYYY-MM')
				this.yearPickTo = moment(`${this.yearPick3}-12`, 'YYYY-MM').format('YYYY-MM')
				// 月
				const monthNow = new Date().getMonth()
				this.monthPick = monthNow + 1
				this.monthPickFrom = moment(`${this.yearPick2}-${this.monthPick}-01`, 'YYYY-MM-DD').format('YYYY-MM-DD')
				this.monthPickTo = moment(`${this.yearPick2}-${this.monthPick}-${[1,3,5,7,8,10,12].includes(this.monthPick) ? 31 : [4,6,9,11].includes(this.monthPick) ? 30 : this.yearPick2 / 4 ? 28 : 29}`, 'YYYY-MM-DD').format('YYYY-MM-DD')
				// 周
				let weekTodayIndex = 0
				let weekTodayStart = ''
				let weekTodayEnd = ''
				const todayYearInfo = this.totalWeekInfo[new Date().getFullYear().toString()]
				const todayMoment = moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD')
				Object.keys(todayYearInfo).map((key)=>{
					if(todayYearInfo[key].days.includes(todayMoment)){
						weekTodayIndex = Number(key)
						weekTodayStart = todayYearInfo[key].from
						weekTodayEnd = todayYearInfo[key].to
					}
				})
				this.weekPick = weekTodayIndex
				this.weekPickFrom = weekTodayStart
				this.weekPickTo = weekTodayEnd
				//
				for (let i = 2000; i <= yearNow; i++) {
					this.columnsWeek[0].push(i)
					this.columnsMonth[0].push(i)
					this.columnsYear[0].push(i)
				}
				this.columnsMonth[1] = []
				for (let i = 1; i <= 12; i++) {
					this.columnsMonth[1].push(i)
				}
				// week
				this.columnsWeek[1] = Object.keys(this.totalWeekInfo[yearNow.toString()]).map(i=>Number(i))
				this.defaultIndexWeek = [this.columnsWeek[0].findIndex((year) => year === yearNow), weekTodayIndex - 1]
				this.defaultIndexMonth = [this.columnsMonth[0].findIndex((year) => year === yearNow), monthNow]
				this.defaultIndexYear = [this.columnsYear[0].findIndex((year) => year === yearNow)]
			},
			findData() {
				this.$loadingOn();
				this.switchType === 'personal' ?
					getDatePersonalChargeCustomTimeAction({
						year: this.curNow === 0 ? this.yearPick1 : this.curNow === 1 ? this.yearPick2 : this
							.yearPick3,
						created_by: this.userInfo.id,
						index: this.curNow === 0 ? this.weekPick : this.curNow === 1 ? this.monthPick : 0,
						time_type: this.curNow === 0 ? 'week' : this.curNow === 1 ? 'month' : 'year'
					}).then(res => {
						this.baseData = res.data
						this.iconsListLocal.map(item => item.money = 0)
						this.iconsListLocal.forEach((item) => {
							Object.keys(this.baseData.items).map(key => {
								if (item.id === key) {
									this.showType === 'spend' ? item.money = Math.round(this.baseData.items[key].spend.reduce((a, b) => a + b) * 100) / 100 : item.money = Math.round(this.baseData.items[key].income.reduce((a, b) => a + b) * 100) / 100
								}
							})
						})
						
						if(this.curNow === 0){
							this.totalNumWeek = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}else if(this.curNow === 1){
							this.totalNumMonth = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}else{
							this.totalNumYear = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}
						this.chartData.categories = this.baseData.total.times
						if (this.chooseInfo.id) {
							console.log('this.chooseInfo.id',this.chooseInfo.id)
							if (this.baseData.items.hasOwnProperty(this.chooseInfo.id)) {
								this.chartData.series[0].data = this.baseData.items[this.chooseInfo.id][this.showType === 'spend' ? 'spend' : 'income']
							} else {
								this.chartData.series[0].data = this.chartData.series[0].data.map(num => 0)
							}
						} else {
							this.chartData.series[0].data = this.baseData.total[this.showType === 'spend' ? 'spend' : 'income']
						}
						this.$loadingOff();
					}).catch(err=>{
						this.$loadingOff();
					}) : getDateTeamChargeCustomTimeAction({
						year: this.curNow === 0 ? this.yearPick1 : this.curNow === 1 ? this.yearPick2 : this
							.yearPick3,
						team_id: this.userInfo.team_id,
						index: this.curNow === 0 ? this.weekPick : this.curNow === 1 ? this.monthPick : 0,
						time_type: this.curNow === 0 ? 'week' : this.curNow === 1 ? 'month' : 'year'
					}).then(res => {
						console.log('find results res', res)
						this.baseData = res.data
						this.iconsListLocal.map(item => item.money = 0)
						this.iconsListLocal.forEach((item) => {
							Object.keys(this.baseData.items).map(key => {
								if (item.id === key) {
									this.showType === 'spend' ? item.money = Math.round(this.baseData.items[key].spend.reduce((a, b) => a + b) * 100) / 100 : item.money = Math.round(this.baseData.items[key].income.reduce((a, b) => a + b) * 100) / 100
								}
							})
						})
						
						if(this.curNow === 0){
							this.totalNumWeek = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}else if(this.curNow === 1){
							this.totalNumMonth = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}else{
							this.totalNumYear = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}
						this.chartData.categories = this.baseData.total.times
						if (this.chooseInfo.id) {
							if (this.baseData.items.hasOwnProperty(this.chooseInfo.id)) {
								this.chartData.series[0].data = this.baseData.items[this.chooseInfo.id][this.showType === 'spend' ? 'spend' : 'income']
							} else {
								this.chartData.series[0].data = this.chartData.series[0].data.map(num => 0)
							}
						} else {
							this.chartData.series[0].data = this.baseData.total[this.showType === 'spend' ? 'spend' : 'income']
						}
						this.$loadingOff();
					}).catch(err=>{
						this.$loadingOff();
					})
			},
			changeHandler(e) {
				const {
				    columnIndex,
				    index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					// @ts-ignore
					picker = this.$refs.uPicker
				} = e
				if (columnIndex === 0) {
				    // 模拟网络请求
					// @ts-ignore
				    picker.setColumnValues(1, this.columnDataWeek[index])
				}
			},
			close() {
				uni.navigateBack()
			},
			leftClick() {
				this.close()
			},
			sectionChange(index) {
				this.curNow = index;
				this.findData()
			},
			clickGrid(index) {
				this.chooseInfo = {
					icon: this.iconsListLocal[index].icon,
					id: this.iconsListLocal[index].id
				}
				console.log('index', index)
				console.log('chooseInfo', this.chooseInfo)
				if (this.baseData.items.hasOwnProperty(this.chooseInfo.id)) {
					this.chartData.series[0].data = this.baseData.items[this.chooseInfo.id][this.showType ===
						'spend' ? 'spend' : 'income'
					]
				} else {
					this.chartData.series[0].data = this.chartData.series[0].data.map(num => 0)
				}
			}
		}
	})
</script>

<style lang="scss">
	.analysis-wrapper{
		width: 100vw;
		height: 100vh;
	}
	
	.analysis-charts {
		width: 100%;
		height: 100%;
		overflow: auto;
		margin-bottom: 20rpx;
	}

	.analysis-back {
		width: 100%;
		text-align: right;
		margin-bottom: 20rpx;

		text {
			font-size: 14px;
			color: #ffbb00;
		}
	}

	.analysis-box {
		width: 100%;
		height: 100vh;
		padding-bottom: 20rpx;
		box-sizing: border-box;
	}

	.analysis-body {
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 50rpx;
		
		.analysis-total{
			width: 100%;
			text-align: center;
			font-size: 12px;
			color: #3A3A3A;
			padding-top: 20rpx;
		}

		.analysis-time {
			font-size: 14px;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 30rpx;
				height: 30rpx;
				margin-left: 20rpx;
				margin-right: 20rpx;
			}

			.date {
				text-decoration: underline;
				flex-shrink: 0;
				white-space: nowrap;
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

		&.selected {
			background: #515a60;

			.grid-text {
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
