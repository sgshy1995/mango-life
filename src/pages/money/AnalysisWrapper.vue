<template>
	<u-popup :overlay="true" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
		:safeAreaInsetTop="true" :show="showPopup" @close="close">
		<scroll-view scroll-y class="analysis-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00" :title="showType === 'spend' ? '支出分析' : '收入分析'" @leftClick="leftClick"
				leftText="返回">
			</u-navbar>
			<view class="analysis-body">
				<view class="u-subsection-wrapper">
					<u-subsection :list="titleList" activeColor="#ffbb00"
						inactiveColor="#333" mode="subsection" @change="sectionChange" bgColor="#ffbb00" :current="curNow">
					</u-subsection>
				</view>
				<u-grid v-if="showType === 'spend'" :border="true" @click="clickGrid">
					<u-grid-item v-for="(baseListItem,baseListIndex) in iconsListSpend" :key="baseListIndex">
						<image class="grid-image" :src="baseListItem.src"></image>
						<text class="grid-text">{{ baseListItem.name + ': ' + baseListItem.money }}</text>
					</u-grid-item>
				</u-grid>
				<u-grid v-else :border="true" @click="clickGrid">
					<u-grid-item v-for="(baseListItem,baseListIndex) in iconsListIncome" :key="baseListIndex">
						<image class="grid-image" :src="baseListItem.src"></image>
						<text class="grid-text">{{ baseListItem.name + ': ' + baseListItem.money }}</text>
					</u-grid-item>
				</u-grid>
				<u-divider text="图表统计"></u-divider>
				<view class="analysis-wrapper">
					<view class="charts-box">
						<qiun-data-charts type="line" :reshow="showPopup" :chartData="chartData" :loadingType="5" :disableScroll="false"
							background="none" :ontouch="true" />
					</view>
				</view>
			</view>
		</scroll-view>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	export default Vue.extend({
		data() {
			return {
				showType: 'spend',
				curNow: 0,
				titleList: ['周', '月', '年'],
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
				iconsListIncome: [],
				iconsListSpend: []
			};
		},
		created(){
			this.iconsListIncome = require('@/static/json/default_icons.json').iconsListIncome.map((item: {id: string, name: string, src?: string, money?: number})=>{
				return {
					...item,
					src: require(`@/static/images/home/${item.name}.png`),
					money: 0
				}
			})
			this.iconsListSpend = require('@/static/json/default_icons.json').iconsListSpend.map((item: {id: string, name: string, src?: string, money?: number})=>{
				return {
					...item,
					src: require(`@/static/images/home/${item.name}.png`),
					money: 0
				}
			})
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
	
	.analysis-box{
		width: 100%;
		height: 100vh;
		padding-bottom: 60rpx;
		box-sizing: border-box;
	}

	.analysis-body {
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 50rpx;
		
		.u-subsection-wrapper{
			width: 100% !important;
			color: #333 !important;
			margin-bottom: 40rpx !important;
		}
	}

	.charts-box {
		width: 100%;
		height: 330rpx;
		background: #fff;
		padding: 20rpx 10rpx 0 10rpx;
		border-radius: 10rpx;
		border: 1rpx dashed #333;
		box-sizing: border-box;
		overflow: hidden;
		position: relative;
		z-index: 9999;
	}
	
	.grid-text {
	        font-size: 13px;
	        color: #909399;
	        padding: 10rpx 0 20rpx 0rpx;
	        /* #ifndef APP-PLUS */
	        box-sizing: border-box;
	        /* #endif */
	}
	
	.grid-image{
		margin-top: 20rpx;
		width: 60rpx;
		height: 60rpx;
	}
</style>
