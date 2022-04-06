<template>
	<u-popup zIndex="20000" :show="showCalculator" @close="close" class="calculator">
		<u-row justify="flex-start" class="calculator-info">
			<u-col class="note" textAlign="center" align="center" justify="center" span="6">
				<image src="../../static/images/home/备注.png" style="width: 18px;height: 18px;margin-right: 10rpx;"></image>
				<u--input
				    placeholder="请输入备注..."
				    border="none"
				    v-model="inputNote"
				></u--input>
			</u-col>
			<u-col class="money-num" textAlign="center" align="flex-end" justify="center" span="6">
				{{ inputNum }}
			</u-col>
		</u-row>
		<u-row justify="flex-start">
			<u-col @click="handleInputNumber('7')" textAlign="center" align="center" justify="center" span="3">
				7
			</u-col>
			<u-col @click="handleInputNumber('8')" textAlign="center" align="center" justify="center" span="3">
				8
			</u-col>
			<u-col @click="handleInputNumber('9')" textAlign="center" align="center" justify="center" span="3">
				9
			</u-col>
			<u-col textAlign="center" align="center" justify="center" span="3">
				<view class="choose">
					<image src="../../static/images/home/日历.png" style="width: 18px;height: 18px;"></image>
					<text>今日</text>
				</view>
				<view class="choose" style="border-top: 1rpx solid #999999;margin-top: 2px;padding-top: 2px;">
					<image :src="pickIcon" style="width: 18px;height: 18px;"></image>
					<text>礼物</text>
				</view>
			</u-col>
		</u-row>
		<u-row justify="flex-start">
			<u-col @click="handleInputNumber('4')" textAlign="center" align="center" justify="center" span="3">
				4
			</u-col>
			<u-col @click="handleInputNumber('5')" textAlign="center" align="center" justify="center" span="3">
				5
			</u-col>
			<u-col @click="handleInputNumber('6')" textAlign="center" align="center" justify="center" span="3">
				6
			</u-col>
			<u-col @click="handleAdd" textAlign="center" align="center" justify="center" span="3">
				+
			</u-col>
		</u-row>
		<u-row justify="flex-start">
			<u-col @click="handleInputNumber('1')" textAlign="center" align="center" justify="center" span="3">
				1
			</u-col>
			<u-col @click="handleInputNumber('2')" textAlign="center" align="center" justify="center" span="3">
				2
			</u-col>
			<u-col @click="handleInputNumber('3')" textAlign="center" align="center" justify="center" span="3">
				3
			</u-col>
			<u-col @click="handleReduce" textAlign="center" align="center" justify="center" span="3">
				-
			</u-col>
		</u-row>
	    <u-row justify="flex-start">
			<u-col @click="handleInputPoint" textAlign="center" align="center" justify="center" span="3">
				.
			</u-col>
			<u-col @click="handleInputNumber('0')" textAlign="center" align="center" justify="center" span="3">
				0
			</u-col>
			<u-col textAlign="center" align="center" justify="center" span="3" @click="handleDelete">
				<image src="../../static/images/home/键盘回退.png" style="width: 18px;height: 18px;"></image>
			</u-col>
			<u-col v-if="cache" @click="handleEqual" textAlign="center" align="center" justify="center" span="3">
				=
			</u-col>
			<u-col @click="handleOk" class="handle-submit" textAlign="center" align="center" justify="center" span="3">
				确认
			</u-col>
		</u-row>
	</u-popup>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {toDecimal2} from '../../utils/utils'
	export default Vue.extend({
		data() {
			return {
				showCalculator: false,
				pickIcon: '../../static/images/home/礼物.png',
				inputNote: '',
				inputNum: '0',
				cache: '',
				editTag: '',
				isAddOrReduce: false
			}
		},
		methods: {
			init(){
				this.inputNote = ''
				this.inputNum = '0'
				this.cache = ''
				this.editTag = ''
				this.isAddOrReduce = false
			},
			close(){
				this.showCalculator = false
				this.init()
			},
			show(){
				this.showCalculator = true
				this.init()
			},
			handleInputNumber(num:string){
				if(this.isAddOrReduce){
					this.cache = this.inputNum
					this.isAddOrReduce = false
					this.inputNum = '0'
				}
				if(Number(this.inputNum) === 0 && this.inputNum.indexOf('.') <= -1){
					this.inputNum = num
				}else if(Number(this.inputNum + num) >= 10000000){
					return
				}else if(this.inputNum.indexOf('.')>-1 && this.inputNum.split('.')[1].length >= 2){
					return
				}else{
					this.inputNum += num
				}
			},
			handleInputPoint(){
				if(this.isAddOrReduce){
					this.cache = this.inputNum
					this.inputNum = '0.'
					this.isAddOrReduce = false
				}
				if(this.inputNum.indexOf('.')>-1){
					return
				}else{
					this.inputNum += '.'
				}
			},
			handleDelete(){
				if(this.inputNum.length >= 2 && Number(this.inputNum)!==0){
					this.inputNum = this.inputNum.substr(0,this.inputNum.length-1)
				}else{
					this.inputNum = '0'
				}
			},
			handleAdd(){
				if(this.cache){
					switch(this.editTag){
						case 'add': {
							if((Number(this.inputNum) + Number(this.cache)) >= 10000000){
								uni.showToast({title: '结果超出最大限制',icon:'none'})
								this.inputNum = this.cache
							}else{
								this.inputNum = (Number(this.inputNum) + Number(this.cache)).toString()
							}
							break;
						}
						case 'reduce':{
							if((Number(this.cache) - Number(this.inputNum))<0){
								uni.showToast({title: '结果小于零',icon:'none'})
								this.inputNum = this.cache
							}else{
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
			handleReduce(){
				if(this.cache){
					switch(this.editTag){
						case 'add': {
							if((Number(this.inputNum) + Number(this.cache)) >= 10000000){
								uni.showToast({title: '结果超出最大限制',icon:'none'})
								this.inputNum = this.cache
							}else{
								this.inputNum = (Number(this.inputNum) + Number(this.cache)).toString()
							}
							break;
						}
						case 'reduce':{
							if((Number(this.cache) - Number(this.inputNum))<0){
								uni.showToast({title: '结果小于零',icon:'none'})
								this.inputNum = this.cache
							}else{
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
			handleEqual(){
				if(this.cache){
					switch(this.editTag){
						case 'add': {
							if((Number(this.inputNum) + Number(this.cache)) >= 10000000){
								uni.showToast({title: '结果超出最大限制',icon:'none'})
								this.inputNum = this.cache
							}else{
								this.inputNum = (Number(this.inputNum) + Number(this.cache)).toString()
							}
							break;
						}
						case 'reduce':{
							if((Number(this.cache) - Number(this.inputNum))<0){
								uni.showToast({title: '结果小于零',icon:'none'})
								this.inputNum = this.cache
							}else{
								this.inputNum = (Number(this.cache) - Number(this.inputNum)).toString()
							}
							break;
						}
					}
					this.cache = ''
					this.editTag = ''
				}
			},
			handleOk(){
				if(Number(this.inputNum)===0){
					uni.showToast({title: '金额不能为0',icon:'none'})
				}else{
					uni.showToast({title: 'submit',icon:'none'})
					this.close()
				}
			}
		}
	})
</script>

<style lang="scss">
	.calculator{
		
		.calculator-info{
			width: 100%;
			height: 100rpx;
			background: #f3f3f3;
			
			.note{
				padding-left: 20rpx !important;
				flex-direction: row;
				display: flex;
				border-right: none;
			}
			
			.money-num{
				border-left: none;
				font-size: 18px;
				padding-right: 20rpx !important;
			}
		}
		
		.u-col{
			background: #f3f3f3;
			box-sizing: border-box;
			border: 1rpx solid #d0d0d0;
			height: 100rpx;
			font-size: 14px;
			
			&.handle-submit{
				background: #ffbb00;
			}
			
			.choose{
				display: flex;
				align-items: center;
				font-size: 12px;
				box-sizing: border-box;
				text{
					padding-left: 4px;
				}
			}
		}
	}
</style>
