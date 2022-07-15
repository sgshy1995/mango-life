<template>
	<view class="manage-types-wrapper">
		<view class="manage-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#ffbb00"
				:title="showType === 'spend' ? '支出类型管理' : '收入类型管理'" @leftClick="leftClick" leftText="返回">
			</u-navbar>
			<view class="manage-body">
				<view class="u-subsection-wrapper">
					<u-subsection :key="refreshKey" :list="titleList" activeColor="#ffbb00" inactiveColor="#333"
						mode="subsection" @change="sectionChange" bgColor="#fff" :current="curNow">
					</u-subsection>
				</view>
				<view class="manage-tips">
					长按名称可以选择编辑或删除记账类型，默认类型不可操作。长按右侧按钮可以拖动。点击下方添加按钮来添加记账类型。
				</view>
				<view class="manage-button">
					<u-button @click="handleShowItem('add')" type="primary" color="#ffbb00" text="添加"
						:customStyle="buttonStyle" icon="integral-fill" iconColor="#333"></u-button>
				</view>
				<view class="manage-list" v-if="showType === 'spend'">
					<view class="content" v-if="curNow===0">
						<HM-dragSorts :listHeight="iconsListSpendPersonal.length * 44" :list="iconsListSpendPersonal" :isLongTouch="true" :rowHeight="44" @change="changeMove" @confirm="(e)=>confirmMove(e, iconsListSpendPersonal)"
							@onclick="onclickMove">
							<template slot="rowContent" slot-scope="{ row }">
								<view class="row">
									<image v-if="row.icon" class="icon" :src="row.src"></image>
									<text class="text" v-show="row.created_type === 'default'">{{ row.name }}</text>
									<u-tooltip v-show="row.created_type === 'custom'" :text="row.name + ' (自定义)'" :showCopy="false" :buttons="['编辑', '删除']" bgColor="#e3e4e6" @click="(item_index)=>handleClickItem(item_index, row)"></u-tooltip>
								</view>
							</template>
						</HM-dragSorts>
					</view>
					<view class="content" v-else>
						<HM-dragSorts :listHeight="iconsListSpendTeam.length * 44" :list="iconsListSpendTeam" :isLongTouch="true" :rowHeight="44" @change="changeMove" @confirm="(e)=>confirmMove(e, iconsListSpendTeam)"
							@onclick="onclickMove">
							<template slot="rowContent" slot-scope="{ row }">
								<view class="row">
									<image v-if="row.icon" class="icon" :src="row.src"></image>
									<text class="text" v-show="row.created_type === 'default'">{{ row.name }}</text>
									<u-tooltip v-show="row.created_type === 'custom'" :text="row.name + ' (自定义)'" :showCopy="false" :buttons="['编辑', '删除']" bgColor="#e3e4e6" @click="(item_index)=>handleClickItem(item_index, row)"></u-tooltip>
								</view>
							</template>
						</HM-dragSorts>
					</view>
				</view>
				<view class="manage-list" v-if="showType === 'income'">
					<view class="content" v-if="curNow===0">
						<HM-dragSorts :listHeight="iconsListIncomePersonal.length * 44" :list="iconsListIncomePersonal" :isLongTouch="true" :rowHeight="44" @change="changeMove" @confirm="(e)=>confirmMove(e, iconsListIncomePersonal)"
							@onclick="onclickMove">
							<template slot="rowContent" slot-scope="{ row }">
								<view class="row">
									<image v-if="row.icon" class="icon" :src="row.src"></image>
									<text class="text" v-show="row.created_type === 'default'">{{ row.name }}</text>
									<u-tooltip v-show="row.created_type === 'custom'" :text="row.name + ' (自定义)'" :showCopy="false" :buttons="['编辑', '删除']" bgColor="#e3e4e6" @click="(item_index)=>handleClickItem(item_index, row)"></u-tooltip>
								</view>
							</template>
						</HM-dragSorts>
					</view>
					<view class="content" v-else>
						<HM-dragSorts :listHeight="iconsListIncomeTeam.length * 44" :list="iconsListIncomeTeam" :isLongTouch="true" :rowHeight="44" @change="changeMove" @confirm="(e)=>confirmMove(e, iconsListIncomeTeam)"
							@onclick="onclickMove">
							<template slot="rowContent" slot-scope="{ row }">
								<view class="row">
									<image v-if="row.icon" class="icon" :src="row.src"></image>
									<text class="text" v-show="row.created_type === 'default'">{{ row.name }}</text>
									<u-tooltip v-show="row.created_type === 'custom'" :text="row.name + ' (自定义)'" :showCopy="false" :buttons="['编辑', '删除']" bgColor="#e3e4e6" @click="(item_index)=>handleClickItem(item_index, row)"></u-tooltip>
								</view>
							</template>
						</HM-dragSorts>
					</view>
				</view>
				<u-safe-bottom></u-safe-bottom>
			</view>
		</view>
		<u-modal :show="showModal" showCancelButton @cancel="showModal = false;deletingType = '';"
			@confirm="deleteTypeData" confirmColor="#ffbb00">
			<text class="slot-content">
				{{ '确定删除记账类型“' + deletingType + '”吗？\n'}}
				<text class="delete-warning">⚠️ 警告：所有在该记账类型下的记录都将被删除！</text>
			</text>
		</u-modal>
		<!-- <ManageTypeItemWrapper @ok="handleOkItem" ref="ManageTypeItemWrapper" :pickInfo="pickInfo" :userInfo="userInfo"></ManageTypeItemWrapper> -->
	</view>
</template>

<script>
	import Vue from 'vue';
	import dragSorts from '@/uni_modules/HM-dragSorts/components/HM-dragSorts/HM-dragSorts.vue' // 组件符合easycom规范，默认这个可以不写
	import {
		deletePersonalChargeTypeAction,
		deleteTeamChargeTypeAction,
		getPersonalChargeTypesAction,
		getTeamChargeTypesAction,
		changePersonalSortAction,
		changeTeamSortAction
	} from '@/service/service';
	export default Vue.extend({
		components: {'HM-dragSorts':dragSorts},// 组件符合easycom规范，默认这个可以不写
		data() {
			return {
				list: [{
						"name": "花呗",
						"icon": require("@/static/lanbidan.png")
					},
					{
						"name": "余额宝",
						"icon": require("@/static/lanbidan.png")
					},
					{
						"name": "账户余额",
						"icon": require("@/static/lanbidan.png")
					},
					{
						"name": "交通银行信用卡(0001)",
						"icon": require("@/static/lanbidan.png")
					},
					{
						"name": "中国建设银行信用卡(4401)",
						"icon": require("@/static/lanbidan.png")
					},
					{
						"name": "网商储蓄卡(7223)",
						"icon": require("@/static/lanbidan.png")
					}
				],
				deletingType: '',
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
					text: '编辑',
					style: {
						backgroundColor: '#ffbb00',
						borderRadius: '50%',
						color: '#fff',
						fontSize: '12px',
						padding: '14rpx'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#f56c6c',
						borderRadius: '50%',
						color: '#fff',
						fontSize: '12px',
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
				if (data.showType) that.showType = data.showType
				if (data.userInfo) that.userInfo = data.userInfo
				if (data.iconsListIncomePersonal) that.iconsListIncomePersonal = data
					.iconsListIncomePersonal
				if (data.iconsListIncomeTeam) that.iconsListIncomeTeam = data.iconsListIncomeTeam
				if (data.iconsListSpendPersonal) that.iconsListSpendPersonal = data.iconsListSpendPersonal
				if (data.iconsListSpendTeam) that.iconsListSpendTeam = data.iconsListSpendTeam
				that.$nextTick(() => {

				})
			})
		},
		onShow() {
			if (this.readyHide) {
				this.handleOkItem()
				this.readyHide = false
			}
		},
		onHide() {
			this.readyHide = true
		},
		watch: {
			userInfo: {
				handler() {
					this.titleList = this.userInfo.team_id ? ['个人', '团队'] : ['个人'],
						this.refreshKey++
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			handleClickItem(index, record){
				console.log('click index', index)
				console.log('click record', record)
				this.pickInfo = {...record}
				if(index === 0){
					this.$nextTick(()=>{
						this.handleShowItem('edit')
					})
				}else if(index === 1){
					this.deletingType = record.name
					this.showModal = true;
				}
			},
			onclickMove(e) {
				
			},
			changeMove(e) {
				
			},
			confirmMove(e, originList) {
				console.log('=== confirm start ===');
				console.log('=== confirm event ===', e)
				console.log("被拖动行: " + JSON.stringify(e.moveRow));
				console.log('原始下标：', e.index);
				console.log('移动到：', e.moveTo);
				console.log('=== confirm end ===');
				if(e.index === e.moveTo) return
				const originId = originList[e.index].origin_id
				const moveToId = e.moveTo === 0 ? 0 : e.list[e.moveTo - 1].origin_id
				console.log('移动前的id', originId)
				console.log('移动后的id', moveToId)
				this.$loadingOn();
				if(this.curNow === 0){
					changePersonalSortAction({
						created_by: this.userInfo.id, 
						balance_type: this.showType === 'spend' ? 0 : 1, 
						origin_id: originId, 
						move_id: moveToId
					}).then(res=>{
						this.$loadingOff();
						this.handleOkItem()
					}).catch(err => {
						this.$loadingOff();
					})
				}else{
					changeTeamSortAction({
						team_id: this.userInfo.team_id, 
						balance_type: this.showType === 'spend' ? 0 : 1, 
						origin_id: originId, 
						move_id: moveToId
					}).then(res=>{
						this.$loadingOff();
						this.handleOkItem()
					}).catch(err => {
						this.$loadingOff();
					})
				}
			},  
			handleOkItem() {
				this.getPersonalTypes()
				if (this.userInfo.team_id) {
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
							src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
							money: 0,
							created_type: item.created_type,
							icon: item.icon
						}
					}) : this.iconsListSpendPersonal = res.data.map((item) => {
						return {
							origin_id: item.id,
							id: item.realname,
							name: item.name,
							src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
							money: 0,
							created_type: item.created_type,
							icon: item.icon
						}
					})
					this.$loadingOff();
				}).catch(err => {
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
							src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
							money: 0,
							created_type: item.created_type,
							icon: item.icon
						}
					}) : this.iconsListSpendTeam = res.data.map((item) => {
						return {
							origin_id: item.id,
							id: item.realname,
							name: item.name,
							src: `https://eden-life.net.cn:9000/cdn/mango/images/home/${item.icon}`,
							money: 0,
							created_type: item.created_type,
							icon: item.icon
						}
					})
					this.$loadingOff();
				}).catch(err => {
					this.$loadingOff();
				})
			},
			handleShowItem(type) {
				//balanceType
				//existType
				const that = this
				uni.navigateTo({
					url: "/pages-money/manage-type-item",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							balanceType: that.showType,
							existType: that.curNow ? 'team' : 'personal',
							showType: type,
							userInfo: that.userInfo,
							pickInfo: that.pickInfo
						}, )
					}
				})
			},
			clearPick() {
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
					this.deletingType = '';
					this.$store.dispatch('changeMoneyCount')
				}) : deleteTeamChargeTypeAction(this.pickInfo.origin_id).then(res => {
					this.$toast(res.message || '删除成功');
					this.handleOkItem();
					this.clearPick();
					this.showModal = false;
					this.deletingType = '';
					this.$store.dispatch('changeMoneyCount')
				})
			},
			handleClickIcon(info, record) {
				console.log('click info', info)
				console.log('click record', record)
				this.pickInfo = record
				if (info.index === 1) {
					this.deletingType = record.name
					this.showModal = true;
				} else {
					this.$nextTick(() => {
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
	.manage-types-wrapper {
		width: 100vw;

		.content {
			.row {
				display: flex;
				flex-direction: row;
				align-items: center;

				.icon {
					width: 30px;
					height: 30px;
					border-radius: 6px;
					margin-right: 13px;
				}

				.text {
					font-size: 13px;
				}
			}
		}
	}

	.slot-content {
		font-size: 15px;
		color: #606266;
		flex: 1;

		.delete-warning {
			color: #f56c6c;
			font-size: 12px;
		}
	}


	.manage-box {
		width: 100%;
		box-sizing: border-box;
	}

	.manage-body {
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 50rpx 0 50rpx;

		.u-subsection-wrapper {
			width: 100% !important;
			color: #333 !important;
			margin-bottom: 40rpx !important;
		}

		.manage-list {
			width: 100%;
		}

		.manage-tips {
			padding-bottom: 20rpx;
			font-size: 12px;
			color: #909399;
		}

		.manage-button {
			padding: 20rpx 0;
		}
	}
</style>
