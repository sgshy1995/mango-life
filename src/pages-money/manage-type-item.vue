<template>
	<view class="manage-type-item">
		<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00"
			:title="showType === 'add' ? '添加类型' : '编辑类型'" @leftClick="leftClick" leftText="返回">
		</u-navbar>
		<view class="manage-item-body">
			<view class="manage-tips">
				选择图标
			</view>
			<scroll-view scroll-y class="manage-item-box">
				<u-grid col="5" :border="false" @click="clickGrid">
					<u-grid-item v-for="(baseListItem,baseListIndex) in iconsList" :key="baseListIndex">
						<image class="grid-image" :class="{selected: selectedInfo.icon===baseListItem.icon}" :src="baseListItem.src"></image>
					</u-grid-item>
				</u-grid>
			</scroll-view>
			<view class="manage-item-bottom">
				<view class="left">
					<u--input maxlength="6" fontSize="14" placeholder="请输入名称..." border="bottom" v-model="inputName"></u--input>
				</view>
				<view class="right" v-if="showType==='add'">
					<u-button @click="handleCreate" type="primary" color="#ffbb00" text="添加"
						:customStyle="buttonStyle" icon="checkbox-mark" iconColor="#fff"></u-button>
				</view>
				<view class="right" v-else>
					<u-button @click="handleEdit" type="primary" color="#ffbb00" text="修改"
						:customStyle="buttonStyle" icon="checkbox-mark" iconColor="#fff"></u-button>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
	</view>
</template>

<script>
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
					height: '60rpx',
					width: '122rpx',
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
				iconsList: require('@/static/json/default_icons.json').iconsListSpend.map((item) => {
					return {
						...item,
						src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
						money: 0
					}
				}).concat(require('@/static/json/default_icons.json').iconsListIncome.map((item) => {
					return {
						...item,
						src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
						money: 0
					}
				})).concat(require('@/static/json/default_icons.json').iconsListDefault.map((item) => {
					return {
						...item,
						src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
						money: 0
					}
				})),
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
				pickInfo: {
					name: '',
					id: '',
					src: '',
					created_type: '',
					origin_id: 0
				},
				balanceType: 'spend',
				existType: 'personal'
			};
		},
		onLoad() {
			this.selectedInfo = {
				id: this.iconsList[0].id,
				name: this.iconsList[0].name,
				icon: this.iconsList[0].icon
			}
			const that = this
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('show', function(data) {
			    console.log(data)
				if(data.showType) that.showType = data.showType
				if(data.balanceType) that.balanceType = data.balanceType
				if(data.existType) that.existType = data.existType
				if(data.pickInfo) that.pickInfo = data.pickInfo
				if(data.userInfo) that.userInfo = data.userInfo
				that.$nextTick(() => {
					if(that.showType === 'edit'){
						that.selectedInfo = {
							id: that.pickInfo.id,
							name: that.pickInfo.name,
							icon: that.pickInfo.icon
						}
						that.inputName = that.pickInfo.name
					}
				})
			})
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
						this.$toast(res.message || '创建成功');
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
						this.$toast(res.message || '创建成功');
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
						this.$toast(res.message || '更新成功');
						this.close();
					})
				}else{
					updateTeamChargeTypeAction(this.pickInfo.origin_id, {
						name: this.inputName,
						icon: this.selectedInfo.icon
					}).then(res=>{
						this.$toast(res.message || '更新成功');
						this.close();
					})
				}
			},
			close() {
				uni.navigateBack()
			},
			show() {
				this.showPopup = true
			},
			leftClick() {
				this.close()
			},
			clickGrid(index) {
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
	.manage-type-item{
		width: 100vw;
		height: 100vh;
	}
	
	.manage-item-body {
		width: 100%;
		height: calc(100vh - 88rpx);
		display: flex;
		flex-direction: column;
	}
	
	.manage-tips{
		padding: 0 20rpx;
		font-size: 12px;
		color: #909399;
		height: 60rpx;
		line-height: 60rpx;
		flex-shrink: 0;
	}


	.manage-item-box {
		width: 100%;
		flex-grow: 1;
		padding-bottom: 30rpx;
		box-sizing: border-box;
		overflow-y: auto;
	}

	.manage-item-bottom {
		width: 100%;
		height: 200rpx;
		box-sizing: border-box;
		border-top: 1px solid #333;
		background: #fff;
		display: flex;
		padding-bottom: 60rpx;
		flex-shrink: 0;
		
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
