<template>
	<view>
		<u-tabbar :value="selected" :fixed="true" :placeholder="true" @change="handleChangeIndex"
			:safeAreaInsetBottom="true" activeColor="#ffbb00" inactiveColor="#333">
			<u-tabbar-item text="首页" icon="home-fill"></u-tabbar-item>
			<u-tabbar-item text="记账" icon="red-packet-fill"></u-tabbar-item>	
			<u-tabbar-item text="备忘" icon="calendar-fill"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account-fill"></u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	export default Vue.extend({
		data() {
			return {
				selected: 1,
				urls: [
					'/pages/index/Index',
					'/pages/money/Money',
					'/pages/memo/Memo'
				]
			};
		},
		onHide(){
			this.selected = 1
		},
		methods:{
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

</style>
