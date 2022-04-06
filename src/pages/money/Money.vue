<template>
	<view class="money-view">
		<view class="money-body">
			<view class="money-body-top">
				<u-button type="primary" color="#ffbb00" text="分析" :customStyle="buttonStyle"></u-button>
			</view>
			<view class="money-body-icons">
				<view class="money-body-icon" v-for="(u,index) in iconsList" :key="u.id" @click="handleShowCalculator(u)">
					<image :src="u.src"></image>
					<text>{{ u.name + ': ' + u.money }}</text>
				</view>
			</view>
			<view class="money-body-bottom">
				<image src=""></image>
				<view class="today">
					<text>今日总支出：<br> <text style="color: #ffbb00">{{ showSwitch ? todayMoney : '***' }}</text></text>
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
				todayMoney: 0,
				showSwitch: false,
				selected: 1,
				urls: [
					'/pages/index/Index',
					'/pages/money/Money',
					'/pages/memo/Memo',
					'/pages/mine/Mine'
				],
				buttonStyle: {
					height: '50rpx',
					width: '110rpx',
					position: 'absolute',
					top: '22rpx',
					right: '22rpx',
					color: '#333'
				},
				iconsList: [
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
	//background: url(../../static/back-money.jpg) 60%;
	background-size: cover;
	position: relative;
	
	.money-body-top{
		height: 90rpx;
		width: 100vw;
		text-align: right;
		border-bottom: 1px solid #ffbb00;
		position: relative;
	}
	
	.money-body-icons{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		padding: 40rpx;
		box-sizing: border-box;
		justify-content: space-between;
		.money-body-icon{
			width: 150rpx;
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
