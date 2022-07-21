<template>
	<view class="money-dashboard">
		<view class="money-dashboard-top">
			<view class="money-month-spend">
				<view class="moeny-item-num">
					<text class="moeny-item-num-in">{{ monthInfo.spend.num }}</text>
					<view class="moeny-item-num-change change-rise" v-if="monthInfo.spend.rise">
						<image class="moeny-item-num-change-icon" src="@/static/images/index/rise.png"></image>
						<text class="moeny-item-num-change-text">{{ monthInfo.spend.rise }}%</text>
					</view>
					<view class="moeny-item-num-change change-fall" v-if="monthInfo.spend.fall">
						<image class="moeny-item-num-change-icon" src="@/static/images/index/fall.png"></image>
						<text class="moeny-item-num-change-text">{{ monthInfo.spend.fall }}%</text>
					</view>
				</view>
				<view class="moeny-item-text">
					本月总支出
				</view>
			</view>
			<view class="money-month-income">
				<view class="moeny-item-num">
					<text class="moeny-item-num-in">{{ monthInfo.income.num }}</text>
					<view class="moeny-item-num-change change-rise" v-if="monthInfo.income.rise">
						<image class="moeny-item-num-change-icon" src="@/static/images/index/rise.png"></image>
						<text class="moeny-item-num-change-text">{{ monthInfo.income.rise }}%</text>
					</view>
					<view class="moeny-item-num-change change-fall" v-if="monthInfo.income.fall">
						<image class="moeny-item-num-change-icon" src="@/static/images/index/fall.png"></image>
						<text class="moeny-item-num-change-text">{{ monthInfo.income.fall }}%</text>
					</view>
				</view>
				<view class="moeny-item-text">
					本月总收入
				</view>
			</view>
		</view>

		<view class="money-dashboard-charts">
			<view class="money-dashboard-charts-in">

				<view class="charts-switch" @click="handleChangeMonthSwitch">
					<view class="charts-switch-item">支出</view>
					<view class="charts-switch-item">收入</view>
					<view class="charts-switch-swip" :class="{'to-right': monthSwitch === 1}">
						{{ monthSwitch === 0 ? '支出' : '收入'}}</view>
				</view>

				<view class="charts-in-top">

					<view class="charts-in-top-left">
						<view class="charts-title">
							<view class="charts-title-img">
								<image class="charts-title-img-in" src="@/static/images/index/money.png"></image>
							</view>
							<view class="charts-title-info">
								<view class="charts-title-info-num">
									{{ monthNum }}
								</view>
								<view class="charts-title-info-text">
									{{ `${showTypes[chartsShowType].name}总${monthSwitch === 0 ? '支出' : '收入'}` }}
								</view>
							</view>
						</view>
					</view>
					<view class="charts-in-top-right" @click="showChartsPicker = true">
						<text class="charts-in-top-right-in">
							{{ showTypes[chartsShowType].name }}
						</text>
						<u-icon name="arrow-down" color="#777C86" size="16"></u-icon>
					</view>
				</view>
				
				<view class="charts-in-middle">
					<qiun-data-charts v-if="chartData.categories.length" :inScrollView="true" type="line" :reshow="showPopup" :chartData="chartData"
						:loadingType="5" :disableScroll="false" background="none" :ontouch="true" />
					<u-empty text="没有记账记录哦~" v-if="!chartData.categories.length" :show="!chartData.categories.length" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
				</view>
				
				<view class="charts-in-bottom">
					<view class="charts-in-bottom-title">
						<view class="charts-title-img">
							<image class="charts-title-img-in" src="@/static/images/index/top5.png"></image>
						</view>
						<view class="charts-title-info">
							<view class="charts-title-info-num">
								TOP5
							</view>
							<view class="charts-title-info-text">
								{{ `${showTypes[chartsShowType].name}前五` }}
							</view>
						</view>
					</view>
					<view class="charts-in-bottom-body">
						<qiun-data-charts v-if="chartDataRing.series[0].data.length" :inScrollView="true" type="ring" :reshow="showPopup" :chartData="chartDataRing"
							:loadingType="5" :disableScroll="false" background="none" :ontouch="true" />
						<u-empty :text="`${showTypes[chartsShowType].name}没有记账记录哦~`" v-if="!chartDataRing.series[0].data.length" :show="!chartDataRing.series[0].data.length" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
					</view>
				</view>
				
				<view class="charts-in-footer">
					<view class="charts-in-footer-title">
						<view class="charts-title-img">
							<image class="charts-title-img-in" src="@/static/images/index/history.png"></image>
						</view>
						<view class="charts-title-info">
							<view class="charts-title-info-num">
								最近动态
							</view>
							<view class="charts-title-info-text">
								暂只支持查看最近两个月30条
							</view>
						</view>
					</view>
					<view class="charts-in-footer-body" v-if="monthSwitch === 0 && recentSpendList.length">
						<view class="charts-in-footer-body-item" v-for="(u,index) in recentSpendList" :key="index" :class="{'last-one': index === recentSpendList.length - 1}">
							<view class="body-item-top">
								<view class="body-item-top-left">
									<image class="body-item-top-logo" :src="baseUrl + '/' + u.avatar"></image>
									<text class="body-item-top-name">{{ u.nickname }}</text>
								</view>
								<view class="body-item-top-right">
									<image class="body-item-top-logo" :src="u.src"></image>
									<text class="body-item-top-name">{{ u.name }}</text>
								</view>
							</view>
							<view class="body-item-bottom">
								<view class="body-item-bottom-left">
									{{ u.remark }}
								</view>
								<view class="body-item-bottom-right">
									<text class="body-item-bottom-right-time">{{ u.created_at }}</text>
									<text class="body-item-bottom-right-money">支出 <text class="inner-money-num">{{ u.charge_num }}</text> 元</text>
								</view>
								
							</view>
						</view>
					</view>
					<view class="charts-in-footer-body" v-if="monthSwitch === 1 && recentIncomeList.length">
						<view class="charts-in-footer-body-item" v-for="(u,index) in recentIncomeList" :key="index" :class="{'last-one': index === recentIncomeList.length - 1}">
							<view class="body-item-top">
								<view class="body-item-top-left">
									<image class="body-item-top-logo" :src="baseUrl + '/' + u.avatar"></image>
									<text class="body-item-top-name">{{ u.nickname }}</text>
								</view>
								<view class="body-item-top-right">
									<image class="body-item-top-logo" :src="u.src"></image>
									<text class="body-item-top-name">{{ u.name }}</text>
								</view>
							</view>
							<view class="body-item-bottom">
								<view class="body-item-bottom-left">
									{{ u.remark }}
								</view>
								<view class="body-item-bottom-right">
									<text class="body-item-bottom-right-time">{{ u.created_at }}</text>
									<text class="body-item-bottom-right-money">收入 <text class="inner-money-num">{{ u.charge_num }}</text> 元</text>
								</view>
								
							</view>
						</view>
					</view>
					<u-empty text="最近没有动态哦" v-if="!recentSpendList.length && !recentIncomeList.length" :show="!recentSpendList.length && !recentIncomeList.length" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
				</view>
			</view>
		</view>
		<u-picker ref="chartsPicker" @cancel="showChartsPicker = false" :show="showChartsPicker" :columns="columnsChartsPicker"
			@confirm="confirmChartsPick"></u-picker>
	</view>
</template>

<script>
	import {
		getWeeks
	} from '@/utils/week'
	import moment from 'moment';
	import {
		getDatePersonalChargeCustomTimeAction,
		getDateTeamChargeCustomTimeAction,
		getPersonalChargeTypesAction,
		getTeamChargeTypesAction,
		personalChargeRecentTimeAction,
		teamChargeRecentTimeAction
	} from '@/service/service';
	export default {
		data() {
			return {
				baseUrl: process.env.VUE_APP_API_BASE_URL,
				showChartsPicker: false,
				columnsChartsPicker: [
					['本周', '本月', '今年']
				],
				monthInfo: {
					spend: {
						num: 0,
						fall: '',
						rise: '0'
					},
					income: {
						num: 0,
						fall: '0',
						rise: ''
					}
				},
				chartsShowType: 0,
				showTypes: [{
						type: 'week',
						name: '本周'
					},
					{
						type: 'month',
						name: '本月'
					},
					{
						type: 'year',
						name: '今年'
					}
				],
				monthSwitch: 0,
				monthNum: 0,
				monthTop5List: [],
				showPopup: false,
				chartData: {
					categories: [],
					series: [{
						"name": "统计",
						"data": []
					}],
				},
				chartDataRing: {
					categories: [],
					series: [{
						data: []
					}],
				},
				yearPick: 0,
				monthPick: 0,
				yearPickHistory: 0,
				monthPickHistory: 0,
				weekPick: 0,
				totalWeekInfo: {},
				baseData: {
					total: {},
					items: {}
				},
				iconsListLocal: [],
				iconsListIncomePersonal: [],
				iconsListSpendPersonal: [],
				iconsListIncomeTeam: [],
				iconsListSpendTeam: [],
				recentSpendList: [],
				recentIncomeList: [],
				refreshPieChart: 0,
				refreshLineChart: 0,
				lineChart: null,
				pieChart: null
			}
		},
		props: {
			switchType: {
				type: String,
				default: 'personal'
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		watch: {
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
		mounted() {
			this.getTotalWeekInfo()
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
			},
			handleChangeMonthSwitch() {
				this.monthSwitch = this.monthSwitch === 0 ? 1 : 0
				this.$nextTick(()=>{
					this.findDataAll()
				})
			},
			confirmChartsPick(e) {
				const {
					columnIndex,
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.chartsPicker
				} = e
				console.log('e', e)
				this.chartsShowType = e.indexs[0]
				this.showChartsPicker = false
				this.$nextTick(()=>{
					this.findDataAll()
				})
			},
			findDataAll(){
				this.findDataMonth()
				if(this.switchType === 'personal'){
					this.getPersonalTypes().then(()=>{
						setTimeout(()=>{
							this.findData()
							this.findDataRecent()
						},100)
					})
				}else{
					this.getTeamTypes().then(()=>{
						setTimeout(()=>{
							this.findData()
							this.findDataRecent()
						},100)
					})
				}
			},
			findDataRecent(){
				// year
				const year = new Date().getFullYear()
				const daysList = [31, year / 4 ? 28 : 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				// month
				const monthNow = new Date().getMonth()
				if(this.switchType === 'personal'){
					personalChargeRecentTimeAction({
						created_by: this.userInfo.id,
						time_start: moment(`${monthNow === 0 ? year - 1 : year}-${monthNow === 0 ? 12 : monthNow}-1 00:00:00`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
						time_end: moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
					}).then(res=>{
						const totalList = res.data || []
						totalList.map(item=>{
							item.created_at = moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
							item.name = (this.iconsListLocal.find(itemIn=>itemIn.id === item.charge_type) || {}).name,
							item.src = (this.iconsListLocal.find(itemIn=>itemIn.id === item.charge_type) || {}).src
						})
						this.recentSpendList = totalList.filter(item=>item.balance_type === 0).slice(0, 30)
						this.recentIncomeList = totalList.filter(item=>item.balance_type === 1).slice(0, 30)
					}).catch(err=>{
						this.recentSpendList = []
						this.recentIncomeList = []
					})
				}else{
					teamChargeRecentTimeAction({
						team_id: this.userInfo.team_id,
						time_start: moment(`${monthNow === 0 ? year - 1 : year}-${monthNow === 0 ? 12 : monthNow}-1 00:00:00`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
						time_end: moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
					}).then(res=>{
						const totalList = res.data || []
						totalList.map(item=>{
							item.created_at = moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
							item.name = (this.iconsListLocal.find(itemIn=>itemIn.id === item.charge_type) || {}).name,
							item.src = (this.iconsListLocal.find(itemIn=>itemIn.id === item.charge_type) || {}).src
						})
						this.recentSpendList = totalList.filter(item=>item.balance_type === 0).slice(0, 30)
						this.recentIncomeList = totalList.filter(item=>item.balance_type === 1).slice(0, 30)
					}).catch(err=>{
						this.recentSpendList = []
						this.recentIncomeList = []
					})
				}
			},
			findDataMonth(){
				// year
				const yearNow = new Date().getFullYear()
				const yearPick = yearNow
				// month
				const monthNow = new Date().getMonth()
				const monthPick = monthNow + 1
				const monthPickHistory = monthPick === 1 ? 12 : monthPick - 1
				const yearPickHistory = monthPickHistory === 12 ? yearPick - 1 : yearPick
				
				if(this.switchType === 'personal'){
					Promise.all([
						getDatePersonalChargeCustomTimeAction({
							year: yearPick,
							created_by: this.userInfo.id,
							index: monthPick,
							time_type: 'month'
						}),
						getDatePersonalChargeCustomTimeAction({
							year: yearPickHistory,
							created_by: this.userInfo.id,
							index: monthPickHistory,
							time_type: 'month'
						}),
					]).then(responses=>{
						// 0
						const baseData1 = responses[0].data
						const dataPickSpend1 = baseData1.total.spend
						const dataPickIncome1 = baseData1.total.income
						this.monthInfo.spend.num = Math.round(dataPickSpend1.reduce((a, b) => a + b) * 100) / 100
						this.monthInfo.income.num = Math.round(dataPickIncome1.reduce((a, b) => a + b) * 100) / 100
						// 1
						this.monthInfo.spend.fall = ''
						this.monthInfo.spend.rise = ''
						this.monthInfo.income.fall = ''
						this.monthInfo.income.rise = ''
						const baseData2 = responses[1].data
						const dataPickSpend2 = baseData2.total.spend
						const dataPickIncome2 = baseData2.total.income
						const spendNumHistory = Math.round(dataPickSpend2.reduce((a, b) => a + b) * 100) / 100
						const incomeNumHistory = Math.round(dataPickIncome2.reduce((a, b) => a + b) * 100) / 100
						if(spendNumHistory && spendNumHistory > this.monthInfo.spend.num){
							this.monthInfo.spend.fall = ((spendNumHistory - this.monthInfo.spend.num) / spendNumHistory * 100).toFixed(2)
						}else if(spendNumHistory && spendNumHistory < this.monthInfo.spend.num){
							this.monthInfo.spend.rise = ((this.monthInfo.spend.num - spendNumHistory) / spendNumHistory * 100).toFixed(2)
						}
						if(incomeNumHistory && incomeNumHistory > this.monthInfo.income.num){
							this.monthInfo.income.fall = ((incomeNumHistory - this.monthInfo.income.num) / incomeNumHistory * 100).toFixed(2)
						}else if(incomeNumHistory && incomeNumHistory < this.monthInfo.income.num){
							this.monthInfo.income.rise = ((this.monthInfo.income.num - incomeNumHistory) / incomeNumHistory * 100).toFixed(2)
						}
					})
				}else{
					Promise.all([
						getDateTeamChargeCustomTimeAction({
							year: yearPick,
							team_id: this.userInfo.team_id,
							index: monthPick,
							time_type: 'month'
						}),
						getDateTeamChargeCustomTimeAction({
							year: yearPickHistory,
							team_id: this.userInfo.team_id,
							index: monthPickHistory,
							time_type: 'month'
						}),
					]).then(responses=>{
						// 0
						const baseData1 = responses[0].data
						const dataPickSpend1 = baseData1.total.spend
						const dataPickIncome1 = baseData1.total.income
						this.monthInfo.spend.num = Math.round(dataPickSpend1.reduce((a, b) => a + b) * 100) / 100
						this.monthInfo.income.num = Math.round(dataPickIncome1.reduce((a, b) => a + b) * 100) / 100
						// 1
						this.monthInfo.spend.fall = ''
						this.monthInfo.spend.rise = ''
						this.monthInfo.income.fall = ''
						this.monthInfo.income.rise = ''
						const baseData2 = responses[1].data
						const dataPickSpend2 = baseData2.total.spend
						const dataPickIncome2 = baseData2.total.income
						const spendNumHistory = Math.round(dataPickSpend2.reduce((a, b) => a + b) * 100) / 100
						const incomeNumHistory = Math.round(dataPickIncome2.reduce((a, b) => a + b) * 100) / 100
						if(spendNumHistory && spendNumHistory > this.monthInfo.spend.num){
							this.monthInfo.spend.fall = ((spendNumHistory - this.monthInfo.spend.num) / spendNumHistory * 100).toFixed(2)
						}else if(spendNumHistory && spendNumHistory < this.monthInfo.spend.num){
							this.monthInfo.spend.rise = ((this.monthInfo.spend.num - spendNumHistory) / spendNumHistory * 100).toFixed(2)
						}
						if(incomeNumHistory && incomeNumHistory > this.monthInfo.income.num){
							this.monthInfo.income.fall = ((incomeNumHistory - this.monthInfo.income.num) / incomeNumHistory * 100).toFixed(2)
						}else if(incomeNumHistory && incomeNumHistory < this.monthInfo.income.num){
							this.monthInfo.income.rise = ((this.monthInfo.income.num - incomeNumHistory) / incomeNumHistory * 100).toFixed(2)
						}
					})
				}
			},
			findData() {
				// year
				const yearNow = new Date().getFullYear()
				this.yearPick = yearNow
				// month
				const monthNow = new Date().getMonth()
				this.monthPick = monthNow + 1
				// week
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
				
				this.$loadingOn();
				this.switchType === 'personal' ?
					getDatePersonalChargeCustomTimeAction({
						year: this.yearPick,
						created_by: this.userInfo.id,
						index: this.chartsShowType === 0 ? this.weekPick : this.chartsShowType === 1 ? this.monthPick : 0,
						time_type: this.chartsShowType === 0 ? 'week' : this.chartsShowType === 1 ? 'month' : 'year'
					}).then(res => {
						this.baseData = res.data
						const topList = []
						Object.keys(this.baseData.items).map(key=>{
							topList.push({
								name: this.baseData.items[key].charge_name,
								spend: Math.round(this.baseData.items[key].spend.reduce((a, b) => a + b) * 100) / 100,
								income: Math.round(this.baseData.items[key].income.reduce((a, b) => a + b) * 100) / 100,
								balance_type: this.baseData.items[key].balance_type
							})
						})
						const topListSpend = topList.filter(item=>item.balance_type === 0).sort((a,b)=>b.spend - a.spend).map(item=>{return {name: item.name, value: item.spend}}).filter(item=>item.value !== 0).slice(0,5)
						const topListIncome = topList.filter(item=>item.balance_type === 1).sort((a,b)=>b.income - a.income).map(item=>{return {name: item.name, value: item.income}}).filter(item=>item.value !== 0).slice(0,5)
						this.chartDataRing.series[0].data = this.monthSwitch === 0 ? topListSpend : topListIncome
						if(this.curNow === 0){
							//this.totalNumWeek = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}else if(this.curNow === 1){
							//this.totalNumMonth = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}else{
							//this.totalNumYear = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}
						this.chartData.categories = this.baseData.total.times
						this.chartData.series[0].data = this.baseData.total[this.monthSwitch === 0 ? 'spend' : 'income']
						this.monthNum = Math.round(this.chartData.series[0].data.reduce((a, b) => a + b) * 100) / 100
						this.$loadingOff();
					}).catch(err=>{
						this.$loadingOff();
					}) : getDateTeamChargeCustomTimeAction({
						year: this.yearPick,
						team_id: this.userInfo.team_id,
						index: this.chartsShowType === 0 ? this.weekPick : this.chartsShowType === 1 ? this.monthPick : 0,
						time_type: this.chartsShowType === 0 ? 'week' : this.chartsShowType === 1 ? 'month' : 'year'
					}).then(res => {
						this.baseData = res.data
						const topList = []
						Object.keys(this.baseData.items).map(key=>{
							topList.push({
								name: this.baseData.items[key].charge_name,
								spend: Math.round(this.baseData.items[key].spend.reduce((a, b) => a + b) * 100) / 100,
								income: Math.round(this.baseData.items[key].income.reduce((a, b) => a + b) * 100) / 100,
								balance_type: this.baseData.items[key].balance_type
							})
						})
						const topListSpend = topList.filter(item=>item.balance_type === 0).sort((a,b)=>b.spend - a.spend).map(item=>{return {name: item.name, value: item.spend}}).filter(item=>item.value !== 0).slice(0,5)
						const topListIncome = topList.filter(item=>item.balance_type === 1).sort((a,b)=>b.income - a.income).map(item=>{return {name: item.name, value: item.income}}).filter(item=>item.value !== 0).slice(0,5)
						this.chartDataRing.series[0].data = this.monthSwitch === 0 ? topListSpend : topListIncome
						if(this.curNow === 0){
							//this.totalNumWeek = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}else if(this.curNow === 1){
							//this.totalNumMonth = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}else{
							//this.totalNumYear = Math.round(this.iconsListLocal.map(item=>item.money).reduce((a, b) => a + b) * 100) / 100
						}
						this.chartData.categories = this.baseData.total.times
						this.chartData.series[0].data = this.baseData.total[this.monthSwitch === 0 ? 'spend' : 'income']
						this.monthNum = Math.round(this.chartData.series[0].data.reduce((a, b) => a + b) * 100) / 100
						this.$loadingOff();
					}).catch(err=>{
						this.$loadingOff();
					})
			},
			getPersonalTypes() {
				return new Promise((resolve, reject)=>{
					getPersonalChargeTypesAction({
						balance_type: this.monthSwitch,
						created_by: this.userInfo.id
					}).then(res => {
						this.monthSwitch === 0 ? this.iconsListIncomePersonal = res.data.map((item) => {
							return {
								origin_id: item.id,
								id: item.realname,
								name: item.name,
								src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
								money: 0,
								created_type: item.created_type,
								icon: item.icon
							}
						}) : this.iconsListSpendPersonal = res.data.map((item) => {
							return {
								origin_id: item.id,
								id: item.realname,
								name: item.name,
								src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
								money: 0,
								created_type: item.created_type,
								icon: item.icon
							}
						})
						this.iconsListLocal = res.data.map((item) => {
							return {
								origin_id: item.id,
								id: item.realname,
								name: item.name,
								src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
								money: 0,
								created_type: item.created_type,
								icon: item.icon
							}
						})
						resolve(res)
					}).catch(err=>{
						reject(err)
					})
				})
				
			},
			getTeamTypes() {
				return new Promise((resolve, reject)=>{
					getTeamChargeTypesAction({
						balance_type: this.monthSwitch,
						team_id: this.userInfo.team_id
					}).then(res => {
						this.monthSwitch === 0 ? this.iconsListIncomeTeam = res.data.map((item) => {
							return {
								origin_id: item.id,
								id: item.realname,
								name: item.name,
								src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
								money: 0,
								created_type: item.created_type,
								icon: item.icon
							}
						}) : this.iconsListSpendTeam = res.data.map((item) => {
							return {
								origin_id: item.id,
								id: item.realname,
								name: item.name,
								src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
								money: 0,
								created_type: item.created_type,
								icon: item.icon
							}
						})
						this.iconsListLocal = res.data.map((item) => {
							return {
								origin_id: item.id,
								id: item.realname,
								name: item.name,
								src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
								money: 0,
								created_type: item.created_type,
								icon: item.icon
							}
						})
						resolve(res)
					}).catch(err=>{
						reject(err)
					})
				})
				
			},
		}
	}
</script>

<style lang="scss">
	.money-dashboard {
		width: 100%;
		margin-top: 24rpx;

		.money-dashboard-top {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 48rpx;

			.money-month-spend,
			.money-month-income {
				.moeny-item-num {
					margin-bottom: 12rpx;
					display: flex;
					align-items: center;

					.moeny-item-num-in {
						font-size: 16px;
						font-weight: 700;
					}

					.moeny-item-num-change {
						margin-left: 12rpx;
						box-sizing: border-box;
						padding: 2rpx 6rpx;
						border-radius: 12rpx;
						display: flex;
						align-items: center;

						.moeny-item-num-change-icon {
							width: 24rpx;
							height: 24rpx;
							margin-right: 6rpx;
						}

						.moeny-item-num-change-text {
							font-size: 10px;
						}

						&.change-rise {
							background: #EBF9F7;

							.moeny-item-num-change-text {
								color: #1C9C85;
							}
						}

						&.change-fall {
							background: #FFF3F2;

							.moeny-item-num-change-text {
								color: #F42132;
							}
						}
					}
				}

				.moeny-item-text {
					font-size: 12px;
					color: #999;
				}
			}
		}

		.money-dashboard-charts {
			width: 100%;
			margin-top: 24rpx;
			box-sizing: border-box;
			padding: 0 24rpx 24rpx 24rpx;

			.money-dashboard-charts-in {
				width: 100%;
				border: 1px solid #E4E4E6;
				border-radius: 24rpx;
				box-sizing: border-box;
				padding: 24rpx;

				.charts-switch {
					width: 200rpx;
					height: 50rpx;
					background: #F8F8F8;
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					position: relative;

					.charts-switch-item {
						width: 50%;
						height: 100%;
						border-radius: 12rpx;
						font-size: 12px;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #777C86;
					}

					.charts-switch-swip {
						width: 80rpx;
						height: 40rpx;
						position: absolute;
						top: 5rpx;
						left: 10rpx;
						background: #fff;
						color: #ffbb00;
						font-weight: 700;
						font-size: 12px;
						box-shadow: rgba(50, 50, 93, 0.1) 0px 6px 13px -2px, rgba(0, 0, 0, 0.15) 0px 4px 8px -4px;
						border-radius: 12rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						transition: all 0.3s;

						&.to-right {
							left: 110rpx;
						}
					}
				}

				.charts-in-top {
					width: 100%;
					display: flex;
					align-items: center;
					box-sizing: border-box;
					justify-content: space-between;

					.charts-in-top-left {

						.charts-title {
							margin-top: 12rpx;
							display: flex;
							align-items: center;

							.charts-title-img {
								width: 60rpx;
								height: 60rpx;
								border-radius: 50%;
								display: flex;
								align-items: center;
								justify-content: center;
								margin-right: 24rpx;
								background: rgba(255, 187, 0, 0.2);

								.charts-title-img-in {
									width: 32rpx;
									height: 32rpx;
								}
							}

							.charts-title-info {


								.charts-title-info-num {
									font-weight: 700;
									font-size: 14px;
									margin-bottom: 6rpx;
								}

								.charts-title-info-text {
									font-size: 10px;
									color: #999;
								}
							}
						}
					}

					.charts-in-top-right {

						display: flex;
						align-items: center;

						.charts-in-top-right-in {
							font-size: 12px;
							color: #777C86;
							margin-right: 4rpx;
						}

					}
				}
				
				.charts-in-middle{
					width: 100%;
					height: 330rpx;
					background: #fff;
					border-radius: 10rpx;
					border: 1rpx dashed #333;
					box-sizing: border-box;
					overflow: hidden;
					position: relative;
					z-index: 9999;
					margin-top: 24rpx;
				}
				
				.charts-in-bottom{
					width: 100%;
					margin-top: 24rpx;
					
					.charts-in-bottom-title{
						margin-top: 12rpx;
						display: flex;
						align-items: center;
						margin-bottom: 24rpx;
						
						.charts-title-img {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-right: 24rpx;
							background: rgba(255, 187, 0, 0.2);
						
							.charts-title-img-in {
								width: 32rpx;
								height: 32rpx;
							}
						}
						
						.charts-title-info {
						
						
							.charts-title-info-num {
								font-weight: 700;
								font-size: 14px;
								margin-bottom: 6rpx;
							}
						
							.charts-title-info-text {
								font-size: 10px;
								color: #999;
							}
						}
					}
					
					.charts-in-bottom-body{
						width: 100%;
						height: 400rpx;
						background: #fff;
						border-radius: 10rpx;
						border: 1rpx dashed #333;
						box-sizing: border-box;
						overflow: hidden;
						position: relative;
						z-index: 9999;
						
						.charts-in-bottom-body-item{
							width: 100%;
						}
					}
				}
				
				.charts-in-footer{
					width: 100%;
					margin-top: 24rpx;
					
					.charts-in-footer-title{
						margin-top: 12rpx;
						display: flex;
						align-items: center;
						margin-bottom: 24rpx;
						
						.charts-title-img {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-right: 24rpx;
							background: rgba(255, 187, 0, 0.2);
						
							.charts-title-img-in {
								width: 32rpx;
								height: 32rpx;
							}
						}
						
						.charts-title-info {
						
						
							.charts-title-info-num {
								font-weight: 700;
								font-size: 14px;
								margin-bottom: 6rpx;
							}
						
							.charts-title-info-text {
								font-size: 10px;
								color: #999;
							}
						}
					}
					
					.charts-in-footer-body{
						width: 100%;
						
						.charts-in-footer-body-item{
							width: 100%;
							margin-bottom: 12rpx;
							border-bottom: 1px solid #eee;
							box-sizing: border-box;
							padding: 12rpx 0;
							
							&.last-one{
								margin-bottom: 0;
							}
							
							.body-item-top{
								display: flex;
								align-items: center;
								width: 100%;
								margin-bottom: 12rpx;
								justify-content: space-between;
								
								.body-item-top-left, .body-item-top-right{
									display: flex;
									align-items: center;
									.body-item-top-logo{
										width: 32rpx;
										height: 32rpx;
										margin-right: 12rpx;
									}
									
									.body-item-top-name{
										font-size: 12px;
									}
									
									&.body-item-top-left{
										.body-item-top-logo{
											border-radius: 6rpx;
										}
									}
								}
								
								
							}
							
							.body-item-bottom{
								width: 100%;
								display: flex;
								align-items: center;
								justify-content: space-between;
								font-size: 10px;
								
								.body-item-bottom-left{
									color: #999;
									max-width: 200rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}
								
								.body-item-bottom-right{
									display: flex;
									align-items: center;
									
									.body-item-bottom-right-money{
										padding-left: 12rpx;
										font-size: 12px;
										
										.inner-money-num{
											font-weight: 700;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
