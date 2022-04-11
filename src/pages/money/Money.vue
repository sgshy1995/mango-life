<template>
	<view class="money-view">
		<view class="money-body">
			<view class="money-body-top">
				<view @click="changeChargeType" v-if="switchType === 'personal'" class="top-switch">
					<image src="../../static/images/home/个人.png"></image>
					<view class="text">
						<image src="../../static/images/home/切换.png"></image>个人记账
					</view>
				</view>
				<view @click="changeChargeType" v-else class="top-switch">
					<image src="../../static/images/home/团队.png"></image>
					<view class="text">
						<image src="../../static/images/home/切换.png">团队/家庭记账
					</view>
				</view>
				<u-subsection style="width: 260rpx;color: #333 !important" :list="titleList" activeColor="#ffbb00"
					inactiveColor="#333" mode="subsection" @change="sectionChange" bgColor="#ffbb00" :current="curNow">
				</u-subsection>
				<u-button @click="handleShowAnalysis" type="primary" size="mini" color="#ffbb00" text="分析"
					:customStyle="buttonStyle" icon="grid-fill" iconColor="#333"></u-button>
			</view>
			
			<swiper @change="swiperChange" :current="swiperCurrent" v-if="switchType === 'personal'">
				<swiper-item>
					<view class="money-body-icons">
						<view class="money-body-icon" v-for="(u,index) in iconsListSpendPersonal" :key="u.id"
							@click="handleShowCalendar(u)">
							<image :src="u.src"></image>
							<text>{{ u.name + '\n' + u.money }}</text>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="money-body-icons">
						<view class="money-body-icon" v-for="(u,index) in iconsListIncomePersonal" :key="u.id"
							@click="handleShowCalendar(u)">
							<image :src="u.src"></image>
							<text>{{ u.name + '\n' + u.money }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<swiper @change="swiperChange" :current="swiperCurrent" v-else>
				<swiper-item>
					<view class="money-body-icons">
						<view class="money-body-icon" v-for="(u,index) in iconsListSpendTeam" :key="u.id"
							@click="handleShowCalendar(u)">
							<image :src="u.src"></image>
							<text>{{ u.name + ': ' + u.money }}</text>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="money-body-icons">
						<view class="money-body-icon" v-for="(u,index) in iconsListIncomeTeam" :key="u.id"
							@click="handleShowCalendar(u)">
							<image :src="u.src"></image>
							<text>{{ u.name + ': ' + u.money }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>

			<view class="money-body-bottom">
				<image src="../../static/back-money-people.jpg"></image>
				<view class="today" v-if="switchType==='personal'">
					<text>今日总<text>{{ curNow===0 ? '支出' : '收入' }}</text> ：<br> <text
							style="color: #ffbb00">{{ !showSwitch ? '***' : curNow === 0 ? todayTotalPersonal.spend : todayTotalPersonal.income }}</text></text>
					<u-switch style="margin-top: 20rpx;" v-model="showSwitch" size="20" activeColor="#ffbb00">
					</u-switch>
				</view>
				<view class="today" v-else>
					<text>今日总<text>{{ curNow===0 ? '支出' : '收入' }}</text> ：<br> <text
							style="color: #ffbb00">{{ !showSwitch ? '***' : curNow === 0 ? todayTotalTeam.spend : todayTotalTeam.income }}</text></text>
					<u-switch style="margin-top: 20rpx;" v-model="showSwitch" size="20" activeColor="#ffbb00">
					</u-switch>
				</view>
			</view>
		</view>
		<u-tabbar zIndex="1001" :value="selected" :fixed="true" :placeholder="true" @change="handleChangeIndex"
			:safeAreaInsetBottom="true" activeColor="#ffbb00" inactiveColor="#333">
			<u-tabbar-item text="首页" icon="home-fill"></u-tabbar-item>
			<u-tabbar-item text="记账" icon="red-packet-fill"></u-tabbar-item>
			<u-tabbar-item text="备忘" icon="calendar-fill"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account-fill"></u-tabbar-item>
		</u-tabbar>
		<CalendarWrapper @ok="handleOkCalendar" :switchType="switchType" :userInfo="userInfo" ref="CalendarWrapper"></CalendarWrapper>
		<AnalysisWrapper ref="AnalysisWrapper"></AnalysisWrapper>
		<u-modal :show="showModal" @confirm="showModal=false" confirmColor="#ffbb00"
			content="您暂未拥有团队或家庭，无法切换至团队/家庭记账模式。请在个人中心创建或由其他成员邀请后使用。"></u-modal>
		<u-overlay zIndex="1000" :show="showOverlay">
			<view class="warp" @tap.stop>
				<text>您还未登录，请前往登录</text>
				<u-button
					:customStyle="{width: '180rpx', background: 'transparent', height: '60rpx', marginTop: '40rpx'}"
					:plain="true" color="#ffbb00" type="primary" text="前往登录" @click="handleGotoLogin"></u-button>
			</view>
		</u-overlay>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import AnalysisWrapper from './AnalysisWrapper.vue'
	import CalendarWrapper from './CalendarWrapper.vue'
	import {
		getUserInfoByUsernameAction,
		getDatePersonalChargeAction,
		getDateTeamChargeAction
	} from '@/service/service'
	import moment from 'moment';
	export default Vue.extend({
		components: {
			CalendarWrapper,
			AnalysisWrapper
		},
		data() {
			return {
				switchType: 'personal',
				showModal: false,
				showOverlay: false,
				swiperCurrent: 0,
				todaySpendMoney: 0,
				todayIncomeMoney: 0,
				showSwitch: false,
				selected: 1,
				titleList: ['支出', '收入'],
				curNow: 0,
				urls: [
					'/pages/index/Index',
					'/pages/money/Money',
					'/pages/memo/Memo',
					'/pages/mine/Mine'
				],
				buttonStyle: {
					height: '42rpx',
					width: '50rpx',
					position: 'absolute',
					top: '26rpx',
					right: '26rpx',
					color: '#333',
					fontSize: '12px !important'
				},
				iconsListIncomePersonal: [],
				iconsListIncomeTeam: [],
				iconsListSpendPersonal: [],
				iconsListSpendTeam: [],
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
				todayListPersonal: [],
				todayTotalPersonal: {
					spend: 0,
					income: 0
				},
				todayListTeam: [],
				todayTotalTeam: {
					spend: 0,
					income: 0
				}
			};
		},
		created() {
			const switchHistory = uni.getStorageSync('SYS_SWITCH_TYPE')
			if(switchHistory && switchHistory === 'personal' || switchHistory === 'team'){
				this.switchType = switchHistory
			}
			this.iconsListIncomePersonal = require('@/static/json/default_icons.json').iconsListIncome.map((item: {
				id: string,
				name: string,
				src ? : string,
				money ? : number
			}) => {
				return {
					...item,
					src: require(`@/static/images/home/${item.name}.png`),
					money: 0
				}
			})
			this.iconsListIncomeTeam = JSON.parse(JSON.stringify(this.iconsListIncomePersonal))
			this.iconsListSpendPersonal = require('@/static/json/default_icons.json').iconsListSpend.map((item: {
				id: string,
				name: string,
				src ? : string,
				money ? : number
			}) => {
				return {
					...item,
					src: require(`@/static/images/home/${item.name}.png`),
					money: 0
				}
			})
			this.iconsListSpendTeam = JSON.parse(JSON.stringify(this.iconsListSpendPersonal))
		},
		watch: {
			userInfo: {
				handler() {
					this.showOverlay = !this.userInfo.id
					if (this.userInfo.id) {
						console.log('this.userInfo.id', this.userInfo.id)

					}
				},
				deep: true
			},
			switchType: {
				handler(){
					console.log('switchType change',this.switchType)
					this.switchType === 'personal' ? this.getTodayPersonalInfo() : this.getTodayTeamInfo()
				}
			}
		},
		onHide() {
			this.selected = 1
		},
		onLoad() {
			if (uni.getStorageSync('SYS_USER_INFO') && uni.getStorageSync('SYS_USER_INFO').id) {
				this.userInfo = uni.getStorageSync('SYS_USER_INFO')
				console.log('this.userInfo', this.userInfo)
				this.getUserInfo(this.userInfo)
			} else {
				this.userInfo.username = '1'
			}
		},
		methods: {
			handleOkCalendar(){
				this.switchType === 'personal' ? this.getTodayPersonalInfo() : this.getTodayTeamInfo()
			},
			handleGotoLogin() {
				uni.navigateTo({
					url: "/pages/mine/Mine"
				})
			},
			getTodayPersonalInfo() {
				getDatePersonalChargeAction({
					charge_time: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD') + ' 00:00:00',
					created_by: this.userInfo.id
				}).then(res1 => {
					this.todayListPersonal = res1.data.summary.items
					this.todayTotalPersonal = res1.data.summary.total
					this.iconsListSpendPersonal.forEach((item: {
						id: string,
						money: number
					}) => {
						const itemFind: {
							charge_type: string,
							money: number
						} | undefined = this.todayListPersonal.find((itemIn: {
							charge_type: string,
							money: number
						}) => itemIn.charge_type === item.id)
						if (itemFind) {
							// @ts-ignore
							item.money = itemFind.money
						}
					})
					this.iconsListIncomePersonal.forEach((item: {
						id: string,
						money: number
					}) => {
						const itemFind: {
							charge_type: string,
							money: number
						} | undefined = this.todayListPersonal.find((itemIn: {
							charge_type: string,
							money: number
						}) => itemIn.charge_type === item.id)
						if (itemFind) {
							// @ts-ignore
							item.money = itemFind.money
						}
					})
				})
			},
			getTodayTeamInfo(){
				getDateTeamChargeAction({
					charge_time: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD') + ' 00:00:00',
					team_id: this.userInfo.team_id
				}).then(res1 => {
					this.todayListTeam = res1.data.summary.items
					this.todayTotalTeam = res1.data.summary.total
					this.iconsListSpendTeam.forEach((item: {
						id: string,
						money: number
					}) => {
						const itemFind: {
							charge_type: string,
							money: number
						} | undefined = this.todayListTeam.find((itemIn: {
							charge_type: string,
							money: number
						}) => itemIn.charge_type === item.id)
						if (itemFind) {
							// @ts-ignore
							item.money = itemFind.money
						}
					})
					this.iconsListIncomeTeam.forEach((item: {
						id: string,
						money: number
					}) => {
						const itemFind: {
							charge_type: string,
							money: number
						} | undefined = this.todayListTeam.find((itemIn: {
							charge_type: string,
							money: number
						}) => itemIn.charge_type === item.id)
						if (itemFind) {
							// @ts-ignore
							item.money = itemFind.money
						}
					})
				})
			},
			getUserInfo(userInfo: Record < string, any > ) {
				return new Promise((reslove, reject) => {
					getUserInfoByUsernameAction(userInfo).then(res => {
						//this.close()
						uni.setStorageSync('SYS_USER_INFO', res.data)
						this.switchType === 'personal' ? this.getTodayPersonalInfo() : this.getTodayTeamInfo()
						this.userInfo = res.data
						reslove()
					}).catch(() => {
						this.userInfo = {
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
						uni.removeStorageSync('SYS_USER_INFO')
						reject()
					})
				})
			},
			changeChargeType() {
				switch (this.switchType) {
					case 'personal': {
						if (!this.userInfo.team_id) {
							this.showModal = true;
						} else {
							this.switchType = 'team'
						}
						break;
					};
					case 'team': {
						this.switchType = 'personal'
						break;
					};
				}
				uni.setStorageSync('SYS_SWITCH_TYPE',this.switchType)
			},
			handleShowAnalysis() {
				(this.$refs.AnalysisWrapper as any).showType = this.curNow === 0 ? 'spend' : 'income';
				(this.$refs.AnalysisWrapper as any).show();
			},
			swiperChange(evt: {
				detail: {
					current: number,
					source: string
				}
			}) {
				this.curNow = evt.detail.current;
				this.swiperCurrent = evt.detail.current;
			},
			sectionChange(index: number) {
				this.curNow = index;
				this.swiperCurrent = index;
			},
			handleShowCalendar(record: {
				id: number,
				name: string,
				src ? : string,
				money ? : number
			}) {
				(this.$refs.CalendarWrapper as any).showType = this.curNow === 0 ? 'spend' : 'income';
				(this.$refs.CalendarWrapper as any).show(record)
			},
			changeSwitch() {
				this.showSwitch = !this.showSwitch
			},
			handleChangeIndex(index: number) {
				console.log('12', index)
				this.selected = index
				uni.navigateTo({
					url: this.urls[index],
					fail: (e) => {
						alert(e.errMsg)
					}
				})
				console.log('1', index)
			}
		}
	})
</script>

<style lang="scss">
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		flex-direction: column;
		color: #fff;
		font-size: 14px;
	}

	.money-view {
		width: 100vw;
		height: 100vh;
		display: flex;
	}

	.money-body {
		width: 100vw;
		flex: 1 1 1;
		box-sizing: border-box;
		background: url(../../static/back-money.jpg) 60%;
		background-size: cover;
		position: relative;

		.money-body-top {
			height: 90rpx;
			width: 100vw;
			border-bottom: 1px solid #ffbb00;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;

			.top-switch {
				position: absolute;
				top: 10rpx;
				left: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				transform: scale(0.8);

				>image {
					width: 44rpx;
					height: 44rpx;
					background: #e8e8e8;
					border-radius: 50%;
				}

				.text {
					font-size: 12px;
					color: #333;
					display: flex;
					align-items: center;

					>image {
						width: 24rpx;
						height: 24rpx;
						margin-right: 6rpx;
					}
				}
			}

			.u-button__text {
				font-size: 12px !important;
			}
		}



		.money-body-icons {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			padding: 40rpx;
			box-sizing: border-box;
			justify-content: flex-start;
			height: 400rpx;

			.money-body-icon {
				width: 166rpx;
				height: 150rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 12px;
				margin-bottom: 10rpx;

				image {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 8rpx;
				}

				text {
					text-align: center;
				}
			}
		}

		.money-body-bottom {
			position: absolute;
			width: 100vw;
			bottom: 0;
			left: 0;
			height: 500rpx;
			display: flex;
			justify-content: space-between;

			image {
				width: 360rpx;
				height: 360rpx;
				border-radius: 50%;
				margin-top: 10rpx;
				margin-left: 30rpx;
			}

			.today {
				margin-top: 100rpx;
				margin-right: 40rpx;
				padding: 20rpx;
				box-sizing: border-box;
				background: rgba(255, 255, 255, 0.05);
				color: #fff;
				font-size: 16px;
				border-radius: 20rpx;
				width: 260rpx;
				height: 200rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
		}
	}
</style>
