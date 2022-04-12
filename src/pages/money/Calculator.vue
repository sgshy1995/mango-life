<template>
	<u-popup :overlay="true" :overlayStyle="{zIndex: 20000}" zIndex="20000" :show="showCalculator" @close="close"
		class="calculator">
		<view class="calculator">
			<u-row justify="flex-start">
				<u-col class="note" textAlign="center" align="center" justify="center" span="6">
					<view class="calculator-info">
						<image src="../../static/images/home/备注.png">
						</image>
						<u--input maxlength="12" placeholder="请输入备注..." border="none" v-model="inputNote"></u--input>
					</view>
				</u-col>
				<u-col textAlign="center" align="flex-end" justify="center" span="6">
					<view class="money-num">
						{{ inputNum }}
					</view>
				</u-col>
			</u-row>
			
			<u-row justify="flex-start">
				<u-col @click="handleInputNumber('7')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-7">
						7
					</view>
				</u-col>
				<u-col @click="handleInputNumber('8')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-8">
						8
					</view>
				</u-col>
				<u-col @click="handleInputNumber('9')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-9">
						9
					</view>
				</u-col>
				<u-col textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-info">
						<view class="choose">
							<image src="../../static/images/home/日历.png" style="width: 18px;height: 18px;"></image>
							<text>{{ pickDate === todayDate ? '今日' : pickDate }}</text>
						</view>
						<view class="choose choose-bottom">
							<image :src="chooseInfo.src" style="width: 18px;height: 18px;"></image>
							<text>{{chooseInfo.name}}</text>
						</view>
					</view>
				</u-col>
			</u-row>
			<u-row justify="flex-start">
				<u-col @click="handleInputNumber('4')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-4">
						4
					</view>
				</u-col>
				<u-col @click="handleInputNumber('5')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-5">
						5
					</view>
				</u-col>
				<u-col @click="handleInputNumber('6')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-6">
						6
					</view>
				</u-col>
				<u-col @click="handleAdd" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-plus">
						+
					</view>
				</u-col>
			</u-row>
			<u-row justify="flex-start">
				<u-col @click="handleInputNumber('1')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-1">
						1
					</view>
				</u-col>
				<u-col @click="handleInputNumber('2')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-2">
						2
					</view>
				</u-col>
				<u-col @click="handleInputNumber('3')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-3">
						3
					</view>
				</u-col>
				<u-col @click="handleReduce" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-reduce">
						-
					</view>
				</u-col>
			</u-row>
			<u-row justify="flex-start">
				<u-col @click="handleInputPoint" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-point">
						.
					</view>
				</u-col>
				<u-col @click="handleInputNumber('0')" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-0">
						0
					</view>
				</u-col>
				<u-col textAlign="center" align="center" justify="center" span="3" @click="handleDelete">
					<view class="u-custom-col col-back">
						<image src="../../static/images/home/键盘回退.png" class="col-back"></image>
					</view>
				</u-col>
				<u-col v-if="cache" @click="handleEqual" textAlign="center" align="center" justify="center" span="3">
					<view class="u-custom-col col-equal">
						=
					</view>
				</u-col>
				<u-col v-else-if="editInfo.id" @click="handleOk" class="handle-submit" textAlign="center" align="center" justify="center"
					span="3">
					<view class="u-custom-col col-confirm">
						{{ showType === 'spend' ? '修改支出' : '修改收入' }}
					</view>
				</u-col>
				<u-col v-else @click="handleOk" class="handle-submit" textAlign="center" align="center" justify="center"
					span="3">
					<view class="u-custom-col col-confirm">
						{{ showType === 'spend' ? '确认支出' : '确认收入' }}
					</view>
				</u-col>
			</u-row>
		</view>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {
		toDecimal2
	} from '../../utils/utils';
	import {
		addPersonalChargeAction,
		changePersonalChargeAction,
		addTeamChargeAction,
		changeTeamChargeAction
	} from '@/service/service';
	import moment from 'moment';
	export default Vue.extend({
		data() {
			return {
				showCalculator: false,
				pickIcon: '../../static/images/home/礼物.png',
				inputNote: '',
				inputNum: '0',
				cache: '',
				editTag: '',
				isAddOrReduce: false,
				pickDate: '',
				todayDate: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				ifEdit: false,
				editInfo: {
					charge_num: 0,
					id: 0,
					remark: ''
				}
			}
		},
		props: {
			showType: {
				type: String,
				default: 'spend'
			},
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
			chooseInfo: {
				type: Object,
				default: () => {
					return {
						id: 0,
						name: '',
						src: '',
						money: 0
					}
				}
			},
			switchType: {
				type: String,
				default: 'personal'
			}
		},
		methods: {
			init() {
				this.inputNote = (this.editInfo.id && this.editInfo.remark) ? this.editInfo.remark : ''
				this.inputNum = (this.editInfo.id && this.editInfo.charge_num) ? this.editInfo.charge_num.toString() : '0'
				this.cache = ''
				this.editTag = ''
				this.pickDate = ''
				this.isAddOrReduce = false
			},
			close() {
				this.showCalculator = false
				this.init()
				this.editInfo = {
					charge_num: 0,
					id: 0,
					remark: ''
				}
			},
			show(edit: boolean = false) {
				this.ifEdit = edit
				this.showCalculator = true
				this.init()
			},
			handleInputNumber(num: string) {
				if (this.isAddOrReduce) {
					this.cache = this.inputNum
					this.isAddOrReduce = false
					this.inputNum = '0'
				}
				if (Number(this.inputNum) === 0 && this.inputNum.indexOf('.') <= -1) {
					this.inputNum = num
				} else if (Number(this.inputNum + num) >= 10000000) {
					return
				} else if (this.inputNum.indexOf('.') > -1 && this.inputNum.split('.')[1].length >= 2) {
					return
				} else {
					this.inputNum += num
				}
			},
			handleInputPoint() {
				if (this.isAddOrReduce) {
					this.cache = this.inputNum
					this.inputNum = '0.'
					this.isAddOrReduce = false
				}
				if (this.inputNum.indexOf('.') > -1) {
					return
				} else {
					this.inputNum += '.'
				}
			},
			handleDelete() {
				if (this.inputNum.length >= 2 && Number(this.inputNum) !== 0) {
					this.inputNum = this.inputNum.substr(0, this.inputNum.length - 1)
				} else {
					this.inputNum = '0'
				}
			},
			handleAdd() {
				if (this.cache) {
					switch (this.editTag) {
						case 'add': {
							if ((Number(this.inputNum) + Number(this.cache)) >= 10000000) {
								uni.showToast({
									title: '结果超出最大限制',
									icon: 'none'
								})
								this.inputNum = this.cache
							} else {
								this.inputNum = (Number(this.inputNum) + Number(this.cache)).toString()
							}
							break;
						}
						case 'reduce': {
							if ((Number(this.cache) - Number(this.inputNum)) < 0) {
								uni.showToast({
									title: '结果小于零',
									icon: 'none'
								})
								this.inputNum = this.cache
							} else {
								this.inputNum = (Number(this.cache) - Number(this.inputNum)).toString()
							}
							break;
						}
					}
					this.cache = ''
				}
				this.isAddOrReduce = true
				this.editTag = 'add'
			},
			handleReduce() {
				if (this.cache) {
					switch (this.editTag) {
						case 'add': {
							if ((Number(this.inputNum) + Number(this.cache)) >= 10000000) {
								uni.showToast({
									title: '结果超出最大限制',
									icon: 'none'
								})
								this.inputNum = this.cache
							} else {
								this.inputNum = (Number(this.inputNum) + Number(this.cache)).toString()
							}
							break;
						}
						case 'reduce': {
							if ((Number(this.cache) - Number(this.inputNum)) < 0) {
								uni.showToast({
									title: '结果小于零',
									icon: 'none'
								})
								this.inputNum = this.cache
							} else {
								this.inputNum = (Number(this.cache) - Number(this.inputNum)).toString()
							}
							break;
						}
					}
					this.cache = ''
				}
				this.isAddOrReduce = true
				this.editTag = 'reduce'
			},
			handleEqual() {
				if (this.cache) {
					switch (this.editTag) {
						case 'add': {
							if ((Number(this.inputNum) + Number(this.cache)) >= 10000000) {
								uni.showToast({
									title: '结果超出最大限制',
									icon: 'none'
								})
								this.inputNum = this.cache
							} else {
								this.inputNum = (Number(this.inputNum) + Number(this.cache)).toString()
							}
							break;
						}
						case 'reduce': {
							if ((Number(this.cache) - Number(this.inputNum)) < 0) {
								uni.showToast({
									title: '结果小于零',
									icon: 'none'
								})
								this.inputNum = this.cache
							} else {
								this.inputNum = (Number(this.cache) - Number(this.inputNum)).toString()
							}
							break;
						}
					}
					this.cache = ''
					this.editTag = ''
				}
			},
			handleOk() {
				if (Number(this.inputNum) === 0) {
					uni.showToast({
						title: '金额不能为0',
						icon: 'none'
					})
				} else if(this.editInfo.id) {
					this.switchType === 'personal' ?
						changePersonalChargeAction(this.editInfo.id,{
							charge_num: Number(this.inputNum),
							remark: this.inputNote || undefined
						}).then(res=>{
							(this as any).$toast(res.message || '更新成功')
							this.$emit('ok')
							this.close()
						}) : changeTeamChargeAction(this.editInfo.id,{
							charge_num: Number(this.inputNum),
							remark: this.inputNote || undefined
						}).then(res=>{
							(this as any).$toast(res.message || '更新成功')
							this.$emit('ok')
							this.close()
						})
					
				} else{
					this.switchType === 'personal' ?
						addPersonalChargeAction({
							charge_num: Number(this.inputNum),
							created_by: this.userInfo.id,
							charge_type: this.chooseInfo.id,
							balance_type: this.showType === 'spend' ? 0 : 1,
							remark: this.inputNote || undefined
						}).then(res=>{
							(this as any).$toast(res.message || '添加成功')
							this.$emit('ok')
							this.close()
						}) : addTeamChargeAction({
							charge_num: Number(this.inputNum),
							created_by: this.userInfo.id,
							charge_type: this.chooseInfo.id,
							balance_type: this.showType === 'spend' ? 0 : 1,
							remark: this.inputNote || undefined,
							team_id: this.userInfo.team_id
						}).then(res=>{
							(this as any).$toast(res.message || '添加成功')
							this.$emit('ok')
							this.close()
						})
				}
			}
		}
	})
</script>

<style lang="scss">
	.calculator {
		width: 100%;
		height: 100%;

		.calculator-info {
			width: 100%;
			height: 100rpx !important;
			background: #f3f3f3 !important;
			
			image{
				width: 18px;
				height: 18px;
				margin-right: 10rpx;
			}
			

			padding-left: 20rpx !important;
			flex-direction: row;
			display: flex;
			border-right: none;
			align-items: center;
			
		}
		
		.money-num {
			border-left: none;
			font-size: 18px;
			height: 100rpx !important;
			padding-right: 20rpx !important;
			background: #f3f3f3 !important;
			width: 100%;
			text-align: right;
			line-height: 100rpx !important;
			box-sizing: border-box;
		}

		.u-custom-col {
			background: #f3f3f3;
			box-sizing: border-box;
			border: 0.5rpx solid #d0d0d0;
			height: 100rpx;
			width: 100%;
			font-size: 14px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			
			&.col-7,&.col-8,&.col-9{
				border-right: none;
			}
			
			&.col-plus,&.col-reduce,&.col-confirm{
				border-top: none;
			}
			
			&.col-4,&.col-5,&.col-6{
				border-right: none;
				border-top: none;
			}
			
			&.col-1,&.col-2,&.col-3{
				border-right: none;
				border-top: none;
			}
			
			&.col-point,&.col-0,&.col-back{
				border-right: none;
				border-top: none;
			}

			&.handle-submit {
				background: #ffbb00;
			}
			
			.col-back{
				width: 18px;height: 18px;
			}

			.choose {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				box-sizing: border-box;

				text {
					padding-left: 4px;
				}
				
				image{
					width: 18px;
					height: 18px;
				}
			}
			
			.choose-bottom{
				border-top: 1rpx solid #999999;
				margin-top: 2px;
				padding-top: 2px;
			}
		}
	}
</style>
