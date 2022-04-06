<template>
	<view>
		<u-popup :overlay="false" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
			:safeAreaInsetTop="true" :show="showPopup" @close="close">
			<view style="width: 100%;">
				<u-button :customStyle="{color: '#333', borderColor: '#eee', marginBottom: '24rpx'}"
					:plain="true" type="primary" text="返回" @click="close"></u-button>
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
			
		</u-popup>
		<Calculator ref="Calculator"></Calculator>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	// @ts-ignore
	import {lunar} from "@/utils/lunar";
	import Calculator from'./Calculator.vue';
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
				}
			}
		},
		onLoad() {


		},
		methods: {
			close() {
				this.showPopup = false
			},
			show() {
				this.showPopup = true
			},
			clickDate(date: string) {
				(this.$refs.Calculator as any).show()
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
</style>
