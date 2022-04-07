<template>
	<u-popup :overlay="true" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
		:safeAreaInsetTop="true" :show="showPopup" @close="close">
		<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00" :title="showType === 'spend' ? '支出分析' : '收入分析'" @leftClick="leftClick"
			leftText="返回">
		</u-navbar>
		<view class="analysis-body">
			<u-subsection style="width: 100%;color: #333 !important" :list="titleList" activeColor="#ffbb00"
				inactiveColor="#333" mode="subsection" @change="sectionChange" bgColor="#ffbb00" :current="curNow">
			</u-subsection>
			<u-grid style="margin-top: 40rpx;" v-if="showType === 'spend'" :border="true" @click="clickGrid">
				<u-grid-item v-for="(baseListItem,baseListIndex) in iconsListSpend" :key="baseListIndex">
					<image class="grid-image" :src="baseListItem.src"></image>
					<text class="grid-text">{{ baseListItem.name + ': ' + baseListItem.money }}</text>
				</u-grid-item>
			</u-grid>
			<u-grid style="margin-top: 40rpx;" v-else :border="true" @click="clickGrid">
				<u-grid-item v-for="(baseListItem,baseListIndex) in iconsListIncome" :key="baseListIndex">
					<image class="grid-image" :src="baseListItem.src"></image>
					<text class="grid-text">{{ baseListItem.name + ': ' + baseListItem.money }}</text>
				</u-grid-item>
			</u-grid>
			<u-divider text="图表统计"></u-divider>
			<view class="analysis-wrapper">
				<view class="charts-box">
					<qiun-data-charts type="line" :chartData="chartData" :loadingType="5" :disableScroll="true"
						background="none" :ontouch="true" />
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	export default Vue.extend({
		data() {
			return {
				showType: 'spend',
				curNow: 0,
				titleList: ['日', '周', '月', '年'],
				showPopup: false,
				customStyleIn: {
					width: '100vw'
				},
				chartData: {
					categories: [
						"周一",
						"周二",
						"周三",
						"周四",
						"周五",
						"周六",
						"周日"
					],
					series: [{
						"name": "成交量A",
						"data": [
							35,
							8,
							25,
							37,
							4,
							20,
							63
						]
					}],
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
		methods: {
			close() {
				this.showPopup = false
			},
			show() {
				this.showPopup = true
			},
			leftClick() {
				this.close()
			},
			sectionChange(index: number) {
				this.curNow = index;
			},
			clickGrid(name:string){
				
			}
		}
	})
</script>

<style lang="scss">
	.analysis-wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.analysis-body {
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 50rpx;
	}

	.charts-box {
		width: 100%;
		height: 300rpx;
	}
	
	.grid-text {
	        font-size: 14px;
	        color: #909399;
	        padding: 10rpx 0 20rpx 0rpx;
	        /* #ifndef APP-PLUS */
	        box-sizing: border-box;
	        /* #endif */
	}
	
	.grid-image{
		margin-top: 20rpx;
		width: 80rpx;
		height: 80rpx;
	}
</style>
