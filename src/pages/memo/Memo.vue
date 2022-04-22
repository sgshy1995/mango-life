<template>
	<view class="memo">
		<u-button @click="handleShowPopup">测试弹窗</u-button>
		<u-button @click="handleShow">测试页面</u-button>
		<mango-popup @close="handleClosePopup" :show="showPopup"></mango-popup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import MangoPopup from '@/components/popup/mango-popup.vue'
	export default Vue.extend({
		data() {
			return {
				showPopup: false
			};
		},
		components: {
			MangoPopup
		},
		methods:{
			handleShowPopup(){
				this.showPopup = true
			},
			handleClosePopup(){
				this.showPopup = false
			},
			handleShow(){
				uni.navigateTo({
					url: "/pages/memo/test"
				})
			}
		}
	})
</script>

<style lang="scss">
.memo{
	padding-top: 200rpx;
	box-sizing: border-box;
}
</style>
