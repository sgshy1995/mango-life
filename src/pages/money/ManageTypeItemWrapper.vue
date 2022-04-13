<template>
	<u-popup :overlay="true" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
		:safeAreaInsetTop="true" :show="showPopup" @close="close">
		<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00"
			:title="showType === 'add' ? '添加类型' : '编辑类型'" @leftClick="leftClick" leftText="返回">
		</u-navbar>
		<view class="manage-item-wrapper">
			<view class="manage-tips">
				选择图标
			</view>
			<scroll-view scroll-y class="manage-item-box">
				<u-grid col="5" :border="false" @click="clickGrid">
					<u-grid-item v-for="(baseListItem,baseListIndex) in iconsList" :key="baseListIndex">
						<image class="grid-image" :class="{selected: selectedInfo.id===baseListItem.id}" :src="baseListItem.src"></image>
					</u-grid-item>
				</u-grid>
			</scroll-view>
			<view class="manage-item-bottom">
				<view class="left">
					<view class="manage-tips">输入类型名称，不可重复</view>
					<u--input maxlength="6" fontSize="14" placeholder="请输入名称..." border="bottom" v-model="inputName"></u--input>
				</view>
				<view class="right" v-if="showType==='add'">
					<u-button @click="handleCreate" type="primary" color="#ffbb00" text="确定"
						:customStyle="buttonStyle" icon="checkbox-mark" iconColor="#fff"></u-button>
				</view>
				<view class="right" v-else>
					<u-button @click="handleEdit" type="primary" color="#ffbb00" text="确定"
						:customStyle="buttonStyle" icon="checkbox-mark" iconColor="#fff"></u-button>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {
		createPersonalChargeTypeAction,
		updatePersonalChargeTypeAction,
		updateTeamChargeTypeAction,
		createTeamChargeTypeAction
	} from '@/service/service';
	export default Vue.extend({
		data() {
			return {
				buttonStyle: {
					height: '70rpx',
					width: '142rpx',
					color: '#fff',
					fontSize: '12px !important',
					background: '#ffbb00'
				},
				showType: 'add',
				showPopup: false,
				customStyleIn: {
					width: '100vw'
				},
				inputName: '',
				selectedInfo: {
					id: '',
					name: '',
					icon: ''
				},
				showModal: false,
				iconsList: require('@/static/json/default_icons.json').iconsListSpend.map((item: {
					origin_id: number,
					id: string,
					name: string,
					src ? : string,
					money ? : number,
					created_type ? : string,
					icon ? : string
				}) => {
					return {
						...item,
						src: require(`@/static/images/home/${item.name}.png`),
						money: 0
					}
				}).concat(require('@/static/json/default_icons.json').iconsListIncome.map((item: {
					origin_id: number,
					id: string,
					name: string,
					src ? : string,
					money ? : number,
					created_type ? : string,
					icon ? : string
				}) => {
					return {
						...item,
						src: require(`@/static/images/home/${item.name}.png`),
						money: 0
					}
				}))
			};
		},
		created(){
			this.selectedInfo = {
				id: this.iconsList[0].id,
				name: this.iconsList[0].name,
				icon: this.iconsList[0].icon
			}
		},
		props: {
			userInfo: {
				type: Object,
				default: () => {
					return {
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
				}
			},
			pickInfo: {
				type: Object,
				default: () => {
					return {
						name: '',
						id: '',
						src: '',
						created_type: '',
						origin_id: 0
					}
				}
			},
			balanceType: {
				type: String,
				default: 'spend'
			},
			existType: {
				type: String,
				default: 'personal'
			}
		},
		methods: {
			handleCreate(){
				if(this.existType === 'personal'){
					createPersonalChargeTypeAction({
						name: this.inputName,
						icon: this.selectedInfo.icon,
						created_by: this.userInfo.id,
						balance_type: this.balanceType === 'spend' ? 0 : 1
					}).then(res=>{
						(this as any).$toast(res.message || '创建成功');
						this.$emit('ok');
						this.close();
					})
				}else{
					createTeamChargeTypeAction({
						name: this.inputName,
						icon: this.selectedInfo.icon,
						created_by: this.userInfo.id,
						team_id: this.userInfo.team_id,
						balance_type: this.balanceType === 'spend' ? 0 : 1
					}).then(res=>{
						(this as any).$toast(res.message || '创建成功');
						this.$emit('ok');
						this.close();
					})
				}
			},
			handleEdit(){
				if(this.existType === 'personal'){
					updatePersonalChargeTypeAction(this.pickInfo.origin_id, {
						name: this.inputName,
						icon: this.selectedInfo.icon
					}).then(res=>{
						(this as any).$toast(res.message || '创建成功');
						this.$emit('ok');
						this.close();
					})
				}else{
					updateTeamChargeTypeAction(this.pickInfo.origin_id, {
						name: this.inputName,
						icon: this.selectedInfo.icon
					}).then(res=>{
						(this as any).$toast(res.message || '创建成功');
						this.$emit('ok');
						this.close();
					})
				}
			},
			close() {
				this.showPopup = false
				this.inputName = ''
				this.selectedInfo = {
					id:'',
					name: '',
					icon: ''
				}
			},
			show() {
				if(this.showType === 'edit'){
					this.inputName = this.pickInfo.name
				}
				this.showPopup = true
			},
			leftClick() {
				this.close()
			},
			clickGrid(index: number) {
				console.log('name click',index)
				this.selectedInfo = {
					id: this.iconsList[index].id,
					name: this.iconsList[index].name,
					icon: this.iconsList[index].icon
				}
			}
		}
	})
</script>

<style lang="scss">
	.manage-item-wrapper {
		width: 100%;
		height: 100vh;
		
		.manage-tips{
			padding: 20rpx 20rpx 0 20rpx;
			font-size: 12px;
			color: #909399;
		}
	}


	.manage-item-box {
		width: 100%;
		height: calc(100% - 276rpx);
		padding-bottom: 60rpx;
		box-sizing: border-box;
	}

	.manage-item-bottom {
		width: 100%;
		height: 140rpx;
		box-sizing: border-box;
		border-top: 1px solid #333;
		background: #fff;
		display: flex;
		
		.left{
			width: 70%;
			height: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			padding-left: 20rpx;
			flex-shrink: 0;
		}
		
		.right{
			width: 30%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-shrink: 0;
		}
	}

	.grid-image {
		margin-top: 30rpx;
		width: 60rpx;
		height: 60rpx;
		padding: 10rpx;
		background: #fff;
		border-radius: 50%;
		transition: all 0.3s;
		
		&.selected{
			background: #78858f;
		}
	}
</style>
