<template>
	<view class="manage-types-wrapper">
		<scroll-view scroll-y class="manage-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00"
				:title="showType === 'spend' ? '支出类型管理' : '收入类型管理'" @leftClick="leftClick" leftText="返回">
			</u-navbar>
			<view class="manage-body">
				<view class="u-subsection-wrapper">
					<u-subsection :key="refreshKey" :list="titleList" activeColor="#ffbb00" inactiveColor="#333" mode="subsection"
						@change="sectionChange" bgColor="#fff" :current="curNow">
					</u-subsection>
				</view>
				<view class="manage-tips">
					左滑可以选择编辑或删除记账类型，默认类型不可操作。点击下方添加按钮来添加记账类型。
				</view>
				<view class="manage-button">
					<u-button @click="handleShowItem('add')" type="primary" color="#ffbb00" text="添加"
						:customStyle="buttonStyle" icon="integral-fill" iconColor="#333"></u-button>
				</view>
				<view class="manage-list" v-if="showType === 'spend'">
					<u-swipe-action v-if="curNow===0">
						<u-swipe-action-item :disabled="u.created_type === 'default'" @click="(info)=>handleClickIcon(info,u)"
							v-for="(u,index) in iconsListSpendPersonal" :key="u.id" :options="swiperOptions">
							<view class="swipe-action u-border-top"
								:class="[index === iconsListSpendPersonal.length - 1 && 'u-border-bottom']">
								<view class="swipe-action__content">
									<view class="swipe-action__content__text">
										<image :src="u.src"></image>
										<text>{{ u.created_type === 'default' ? u.name : u.name + ' (自定义)' }}</text>
									</view>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
					<u-swipe-action v-else>
						<u-swipe-action-item :disabled="u.created_type === 'default'" @click="(info)=>handleClickIcon(info,u)"
							v-for="(u,index) in iconsListSpendTeam" :key="u.id" :options="swiperOptions">
							<view class="swipe-action u-border-top"
								:class="[index === iconsListSpendTeam.length - 1 && 'u-border-bottom']">
								<view class="swipe-action__content">
									<view class="swipe-action__content__text">
										<image :src="u.src"></image>
										<text>{{ u.created_type === 'default' ? u.name : u.name + ' (自定义)' }}</text>
									</view>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>
				<view class="manage-list" v-if="showType === 'income'">
					<u-swipe-action v-if="curNow===0">
						<u-swipe-action-item :disabled="u.created_type === 'default'" @click="(info)=>handleClickIcon(info,u)"
							v-for="(u,index) in iconsListIncomePersonal" :key="u.id" :options="swiperOptions">
							<view class="swipe-action u-border-top"
								:class="[index === iconsListIncomePersonal.length - 1 && 'u-border-bottom']">
								<view class="swipe-action__content">
									<view class="swipe-action__content__text">
										<image :src="u.src"></image>
										<text>{{ u.created_type === 'default' ? u.name : u.name + ' (自定义)' }}</text>
									</view>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
					<u-swipe-action v-else>
						<u-swipe-action-item :disabled="u.created_type === 'default'" @click="(info)=>handleClickIcon(info,u)"
							v-for="(u,index) in iconsListIncomeTeam" :key="u.id" :options="swiperOptions">
							<view class="swipe-action u-border-top"
								:class="[index === iconsListIncomeTeam.length - 1 && 'u-border-bottom']">
								<view class="swipe-action__content">
									<view class="swipe-action__content__text">
										<image :src="u.src"></image>
										<text>{{ u.created_type === 'default' ? u.name : u.name + ' (自定义)' }}</text>
									</view>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>
			</view>
		</scroll-view>
		<u-modal :show="showModal" showCancelButton @cancel="showModal = false;" @confirm="deleteTypeData"
			confirmColor="#ffbb00">
			<text class="slot-content">
				{{ '确定删除该记账类型吗？\n'}}
				<text class="delete-warning">⚠️ 警告：所有在该记账类型下的记录都将被删除！</text>
			</text>
		</u-modal>
		<!-- <ManageTypeItemWrapper @ok="handleOkItem" ref="ManageTypeItemWrapper" :pickInfo="pickInfo" :userInfo="userInfo"></ManageTypeItemWrapper> -->
	</view>
</template>

<script>
	import Vue from 'vue';
	import {
		deletePersonalChargeTypeAction,
		deleteTeamChargeTypeAction,
		getPersonalChargeTypesAction,
		getTeamChargeTypesAction
	} from '@/service/service';
	export default Vue.extend({
		data() {
			return {
				showType: 'spend',
				curNow: 0,
				titleList: ['个人', '团队'],
				showPopup: false,
				customStyleIn: {
					width: '100vw'
				},
				buttonStyle: {
					height: '54rpx',
					width: '120rpx',
					color: '#333',
					fontSize: '12px !important',
					background: '#ffbb00',
					marginLeft: 0
				},
				showModal: false,
				pickInfo: {
					name: '',
					id: '',
					src: '',
					created_type: '',
					origin_id: 0,
					icon: ''
				},
				swiperOptions: [{
					icon: 'edit-pen-fill',
					style: {
						backgroundColor: '#ffbb00',
						borderRadius: '50%',
						color: '#fff',
						fontSize: '30rpx',
						padding: '14rpx'
					}
				}, {
					icon: 'trash-fill',
					style: {
						backgroundColor: '#f56c6c',
						borderRadius: '50%',
						color: '#fff',
						fontSize: '30rpx',
						marginLeft: '16rpx',
						padding: '14rpx'
					}
				}],
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
					iconsListIncomePersonal: [],
					iconsListIncomeTeam: [],
					iconsListSpendPersonal: [],
					iconsListSpendTeam: [],
					refreshKey: 0,
					readyHide: false
			};
		},
		onLoad() {
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
				if(data.userInfo) that.userInfo = data.userInfo
				if(data.iconsListIncomePersonal) that.iconsListIncomePersonal = data.iconsListIncomePersonal
				if(data.iconsListIncomeTeam) that.iconsListIncomeTeam = data.iconsListIncomeTeam
				if(data.iconsListSpendPersonal) that.iconsListSpendPersonal = data.iconsListSpendPersonal
				if(data.iconsListSpendTeam) that.iconsListSpendTeam = data.iconsListSpendTeam
				that.$nextTick(() => {
					
				})
			})
		},
		onShow(){
			if(this.readyHide){
				this.handleOkItem()
				this.readyHide = false
			}
		},
		onHide(){
			this.readyHide = true
		},
		watch: {
			userInfo: {
				handler(){
					this.titleList = this.userInfo.team_id ? ['个人', '团队'] : ['个人'],
					this.refreshKey ++
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			handleOkItem(){
				this.getPersonalTypes()
				if(this.userInfo.team_id){
					this.getTeamTypes()
				}
			},
			getPersonalTypes() {
				this.$loadingOn();
				getPersonalChargeTypesAction({
					balance_type: this.curNow,
					created_by: this.userInfo.id
				}).then(res => {
					this.curNow === 1 ? this.iconsListIncomePersonal = res.data.map((item) => {
						return {
							origin_id: item.id,
							id: item.realname,
							name: item.name,
							src: require(`@/static/images/home/${item.icon}`),
							money: 0,
							created_type: item.created_type,
							icon: item.icon
						}
					}) : this.iconsListSpendPersonal = res.data.map((item) => {
						return {
							origin_id: item.id,
							id: item.realname,
							name: item.name,
							src: require(`@/static/images/home/${item.icon}`),
							money: 0,
							created_type: item.created_type,
							icon: item.icon
						}
					})
					this.$loadingOff();
				}).catch(err=>{
					this.$loadingOff();
				})
			},
			getTeamTypes() {
				this.$loadingOn();
				getTeamChargeTypesAction({
					balance_type: this.curNow,
					team_id: this.userInfo.team_id
				}).then(res => {
					this.curNow ? this.iconsListIncomeTeam = res.data.map((item) => {
						return {
							origin_id: item.id,
							id: item.realname,
							name: item.name,
							src: require(`@/static/images/home/${item.icon}`),
							money: 0,
							created_type: item.created_type,
							icon: item.icon
						}
					}) : this.iconsListSpendTeam = res.data.map((item) => {
						return {
							origin_id: item.id,
							id: item.realname,
							name: item.name,
							src: require(`@/static/images/home/${item.icon}`),
							money: 0,
							created_type: item.created_type,
							icon: item.icon
						}
					})
					this.$loadingOff();
				}).catch(err=>{
					this.$loadingOff();
				})
			},
			handleShowItem(type){
				//balanceType
				//existType
				const that = this
				uni.navigateTo({
					url: "/pages/money/manage-type-item",
					success: function(res) {
					    // 通过eventChannel向被打开页面传送数据
					    res.eventChannel.emit('show', { 
								balanceType: that.showType, 
								existType: that.curNow ? 'team' : 'personal', 
								showType: type,
								userInfo: that.userInfo,
								pickInfo: that.pickInfo
							},
						)
					}
				})
			},
			clearPick(){
				this.pickInfo = {
					name: '',
					id: '',
					src: '',
					created_type: '',
					origin_id: 0,
					icon: ''
				}
			},
			deleteTypeData() {
				this.curNow === 0 ? deletePersonalChargeTypeAction(this.pickInfo.origin_id).then(res => {
					this.$toast(res.message || '删除成功');
					this.handleOkItem();
					this.clearPick();
					this.showModal = false;
				}) : deleteTeamChargeTypeAction(this.pickInfo.origin_id).then(res => {
					this.$toast(res.message || '删除成功');
					this.handleOkItem();
					this.clearPick();
					this.showModal = false;
				})
			},
			handleClickIcon(info, record) {
				console.log('click info', info)
				console.log('click record', record)
				this.pickInfo = record
				if(info.index === 1){
					this.showModal = true;
				}else{
					this.$nextTick(()=>{
						this.handleShowItem('edit');
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
			sectionChange(index) {
				this.curNow = index;
			},
			clickGrid(name) {

			}
		}
	})
</script>

<style lang="scss">
	.manage-types-wrapper{
		width: 100vw;
		height: 100vh;
	}
	
	.slot-content{
		font-size: 15px;
		color: #606266;
		flex: 1;
		
		.delete-warning{
			color: #f56c6c;
			font-size: 12px;
		}
	}
	
	
	.manage-box {
		width: 100%;
		height: 100vh;
		padding-bottom: 60rpx;
		box-sizing: border-box;
	}

	.manage-body {
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 50rpx;

		.u-subsection-wrapper {
			width: 100% !important;
			color: #333 !important;
			margin-bottom: 40rpx !important;
		}

		.manage-list {
			width: 100%;
		}
		
		.manage-tips{
			padding-bottom: 20rpx;
			font-size: 12px;
			color: #909399;
		}
		
		.manage-button{
			padding: 20rpx 0;
		}
	}

	.u-page {
		padding: 0;
	}

	.u-demo-block__title {
		padding: 10px 0 2px 15px;
	}

	.swipe-action {
		&__content {
			padding: 14rpx 0;

			&__text {
				display: flex;
				align-items: center;

				image {
					width: 44rpx;
					height: 44rpx;
					margin-left: 30rpx;
					border-radius: 50%;
				}

				text {
					font-size: 13px;
					color: $u-main-color;
					padding-left: 30rpx;
				}

			}
		}
	}
</style>
