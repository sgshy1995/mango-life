<template>
	<u-popup :overlay="true" bgColor="#f7f7f7" :duration="200" mode="right" :customStyle="customStyleIn"
		:safeAreaInsetTop="true" :safeAreaInsetBottom="true" :show="showPopup" @close="close">
		<scroll-view scroll-y class="manage-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00"
				:title="showType === 'spend' ? '支出类型管理' : '收入类型管理'" @leftClick="leftClick" leftText="返回">
			</u-navbar>
			<view class="manage-body">
				<view class="u-subsection-wrapper">
					<u-subsection :list="titleList" activeColor="#ffbb00" inactiveColor="#333" mode="subsection"
						@change="sectionChange" bgColor="#ffbb00" :current="curNow">
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
		<ManageTypeItemWrapper @ok="handleOkItem" ref="ManageTypeItemWrapper" :pickInfo="pickInfo" :userInfo="userInfo"></ManageTypeItemWrapper>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {
		deletePersonalChargeTypeAction,
		deleteTeamChargeTypeAction
	} from '@/service/service';
	import ManageTypeItemWrapper from './ManageTypeItemWrapper.vue'
	export default Vue.extend({
		components: {
			ManageTypeItemWrapper
		},
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
				}]
			};
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
			iconsListIncomePersonal: {
				type: Array,
				default: () => {
					return []
				}
			},
			iconsListIncomeTeam: {
				type: Array,
				default: () => {
					return []
				}
			},
			iconsListSpendPersonal: {
				type: Array,
				default: () => {
					return []
				}
			},
			iconsListSpendTeam: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		watch: {
			userInfo: {
				handler(){
					this.titleList = this.userInfo.team_id ? ['个人', '团队'] : ['个人']
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			handleOkItem(){
				this.$emit('ok')
			},
			handleShowItem(type: string){
				//balanceType
				//existType
				(this.$refs.ManageTypeItemWrapper as any).balanceType = this.showType;
				(this.$refs.ManageTypeItemWrapper as any).existType = this.curNow ? 'team' : 'personal';
				(this.$refs.ManageTypeItemWrapper as any).showType = type;
				(this.$refs.ManageTypeItemWrapper as any).show();
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
				(this as any).$loadingOn();
				this.curNow === 0 ? deletePersonalChargeTypeAction(this.pickInfo.origin_id).then(res => {
					(this as any).$toast(res.message || '删除成功');
					this.$emit('ok');
					this.clearPick();
					this.showModal = false;
					(this as any).$loadingOff();
				}).catch(err=>{
					(this as any).$loadingOff();
				}) : deleteTeamChargeTypeAction(this.pickInfo.origin_id).then(res => {
					(this as any).$toast(res.message || '删除成功');
					this.$emit('ok');
					this.clearPick();
					this.showModal = false;
					(this as any).$loadingOff();
				}).catch(err=>{
					(this as any).$loadingOff();
				})
			},
			handleClickIcon(info: {
				name: string,
				index: number
			}, record: {
				name: string,
				id: string,
				src: string,
				created_type: string,
				origin_id: number,
				icon: string
			}) {
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
				this.showPopup = false
				this.curNow = 0
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
			clickGrid(name: string) {

			}
		}
	})
</script>

<style lang="scss">
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
