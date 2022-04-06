<template>
	<view class="money-view">
		<view class="money-body">
			<view class="money-body-top">
				<u-subsection style="width: 50%;color: #333 !important" :list="titleList" activeColor="#ffbb00" inactiveColor="#333" mode="subsection" @change="sectionChange" bgColor="#ffbb00" :current="curNow"></u-subsection>
				<u-button type="primary" size="mini" color="#ffbb00" text="分析" :customStyle="buttonStyle"></u-button>
			</view>
			<swiper @change="swiperChange" :current="swiperCurrent">
				<swiper-item>
					<view class="money-body-icons">
						<view class="money-body-icon" v-for="(u,index) in iconsListSpend" :key="u.id" @click="handleShowCalculator(u)">
							<image :src="u.src"></image>
							<text>{{ u.name + ': ' + u.money }}</text>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="money-body-icons">
						<view class="money-body-icon" v-for="(u,index) in iconsListIncome" :key="u.id" @click="handleShowCalculator(u)">
							<image :src="u.src"></image>
							<text>{{ u.name + ': ' + u.money }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			
			<view class="money-body-bottom">
				<image src="../../static/back-money-people.jpg"></image>
				<view class="today">
					<text>今日总<text>{{ curNow===0 ? '支出' : '收入' }}</text> ：<br> <text style="color: #ffbb00">{{ !showSwitch ? '***' : curNow===0 ? todaySpendMoney : todayIncomeMoney }}</text></text>
					<u-switch style="margin-top: 20rpx;" v-model="showSwitch" size="20" activeColor="#ffbb00"></u-switch>
				</view>
			</view>
		</view>
		<u-tabbar :value="selected" :fixed="true" :placeholder="true" @change="handleChangeIndex"
			:safeAreaInsetBottom="true" activeColor="#ffbb00" inactiveColor="#333">
			<u-tabbar-item text="首页" icon="home-fill"></u-tabbar-item>
			<u-tabbar-item text="记账" icon="red-packet-fill"></u-tabbar-item>	
			<u-tabbar-item text="备忘" icon="calendar-fill"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account-fill"></u-tabbar-item>
		</u-tabbar>
		<CalendarWrapper ref="CalendarWrapper"></CalendarWrapper>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	
	import CalendarWrapper from './CalendarWrapper.vue'
	export default Vue.extend({
		components: {
			CalendarWrapper
		},
		data() {
			return {
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
				iconsListIncome: [
					{
						id: '1',
						src: require('@/static/images/home/工资.png'),
						name: '工资',
						money: 0
					},
					{
						id: '2',
						src: require('@/static/images/home/理财.png'),
						name: '理财',
						money: 0
					},
					{
						id: '3',
						src: require('@/static/images/home/礼金.png'),
						name: '礼金',
						money: 0
					},
					{
						id: '4',
						src: require('@/static/images/home/兼职.png'),
						name: '兼职',
						money: 0
					},
					{
						id: '5',
						src: require('@/static/images/home/白嫖.png'),
						name: '白嫖',
						money: 0
					},
					{
						id: '6',
						src: require('@/static/images/home/其他.png'),
						name: '其他',
						money: 0
					}
				],
				iconsListSpend: [
					{
						id: '1',
						src: require('@/static/images/home/汉堡.png'),
						name: '吃饭',
						money: 0
					},
					{
						id: '2',
						src: require('@/static/images/home/荔枝.png'),
						name: '果蔬',
						money: 0
					},
					{
						id: '3',
						src: require('@/static/images/home/裙子.png'),
						name: '衣服',
						money: 0
					},
					{
						id: '4',
						src: require('@/static/images/home/奥迪.png'),
						name: '汽车',
						money: 0
					},
					{
						id: '5',
						src: require('@/static/images/home/淘宝.png'),
						name: '淘宝',
						money: 0
					},
					{
						id: '6',
						src: require('@/static/images/home/购物车.png'),
						name: '超市',
						money: 0
					},
					{
						id: '7',
						src: require('@/static/images/home/水滴.png'),
						name: '水费',
						money: 0
					},
					{
						id: '8',
						src: require('@/static/images/home/闪电.png'),
						name: '电费',
						money: 0
					},
					{
						id: '9',
						src: require('@/static/images/home/便利店.png'),
						name: '便利店',
						money: 0
					},
					{
						id: '10',
						src: require('@/static/images/home/地铁.png'),
						name: '交通',
						money: 0
					},
					{
						id: '11',
						src: require('@/static/images/home/礼物.png'),
						name: '礼物',
						money: 0
					},
					{
						id: '12',
						src: require('@/static/images/home/其他.png'),
						name: '其他',
						money: 0
					}
				]
			};
		},
		onHide(){
			this.selected = 1
		},
		methods:{
			swiperChange(evt:{detail:{current:number,source:string}}){
				this.curNow = evt.detail.current;
				this.swiperCurrent = evt.detail.current;
			},
			sectionChange(index:number){
				this.curNow = index;
				this.swiperCurrent = index;
			},
			handleShowCalculator(record: any){
				(this.$refs.CalendarWrapper as any).show()
			},
			changeSwitch(){
				this.showSwitch = !this.showSwitch
			},
			handleChangeIndex(index:number){
				console.log('12',index)
				this.selected = index
				uni.navigateTo({
					url: this.urls[index],
					fail: (e)=>{
						alert(e.errMsg)
					}
				})
				console.log('1',index)
			}
		}
	})
</script>

<style lang="scss">

	.money-view{
		width: 100vw;
		height: 100vh;
		display: flex;
	}
.money-body{
	width: 100vw;
	flex: 1 1 1;
	box-sizing: border-box;
	background: url(../../static/back-money.jpg) 60%;
	background-size: cover;
	position: relative;
	
	.money-body-top{
		height: 90rpx;
		width: 100vw;
		border-bottom: 1px solid #ffbb00;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.u-button__text{
			font-size: 12px !important;
		}
	}
	
	
	
	.money-body-icons{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		padding: 40rpx;
		box-sizing: border-box;
		justify-content: flex-start;
		height: 400rpx;
		.money-body-icon{
			width: 166rpx;
			height: 150rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			margin-bottom: 10rpx;
			image{
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 8rpx;
			}
			text{
				text-align: center;
			}
		}
	}
	
	.money-body-bottom{
		position: absolute;
		width: 100vw;
		bottom: 0;
		left: 0;
		height: 500rpx;
		display: flex;
		justify-content: space-between;
		
		image{
			width: 360rpx;
			height: 360rpx;
			border-radius: 50%;
			margin-top: 10rpx;
			margin-left: 30rpx;
		}
		
		.today{
			margin-top: 100rpx;
			margin-right: 40rpx;
			padding: 20rpx;
			box-sizing: border-box;
			background: rgba(255,255,255,0.05);
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
