<template>
	<u-modal :showConfirmButton="false" :show="showModal" title="团队/家庭管理">
		<view class="team-manage-modal">
			<u-divider text="团队/家庭信息"></u-divider>
			<view class="not-exist" v-if="!userInfo.team_id">
				<text class="not-exist-text">您还未拥有团队或者家庭，请创建或被其他人邀请。</text>
				<view class="create-team">
					<u--input
					    placeholder="请输入团队/家庭名字"
					    border="bottom"
					    v-model="teamInfo.name"
					  ></u--input>
					<u-button :customStyle="createButtonStyle" type="primary" color="#ffbb00" text="创建" @click="handleCreate"></u-button>
				</view>
			</view>
			<view v-else class="ready-exist">
				<view class="ready-exist-text">TeamId: {{ teamInfo.id }}</view>
				<view class="ready-exist-text">团队/家庭名字: {{ teamInfo.name }}</view>
				<view class="ready-exist-text">团队/家庭人数: {{ teamInfo.members_num }} (上限: 5人)</view>
				<u-divider text="成员信息"></u-divider>
				<view class="members">
					<view class="members-item" v-for="(u,index) in teamInfo.members_detail" :key="index">
						<u-avatar @click="showAvatarView(u.avatar)" :src="baseUrl + '/' + u.avatar" size="20"></u-avatar>
						<view class="member-info">
							<text style="font-size: 14px;">{{ u.nickname }}</text>
							<view class="member-owner" v-if="u.id === teamInfo.owner">所有者</view>
							<view class="member-one" v-else>成员</view>
						</view>
						<u-icon v-if="u.id !== teamInfo.owner" name="trash-fill" color="#888" size="20" @click="handleRemoveMember"></u-icon>
						<u-icon v-else name="trash-fill" color="#eee" size="20"></u-icon>
					</view>
				</view>
				<view v-if="teamInfo.members_detail.length <= 5" class="invite-member">
					<u--input
					    placeholder="请输入邀请的成员昵称"
					    border="bottom"
					    v-model="inviteName"
					  ></u--input>
					<u-button :customStyle="inviteButtonStyle" type="primary" color="#ffbb00" text="邀请" @click="handleInvite"></u-button>
				</view>
			</view>
			<u-button :customStyle="confirmButtonStyle" type="primary" color="#ffbb00" text="确定" @click="close"></u-button>
		</view>
	</u-modal>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {
		createTeamAction,
		getTeamInfoByIdAction,
		addTeamMemberAction
	} from '@/service/service'
	export default Vue.extend({
		data() {
			return {
				showModal: false,
				teamInfo: {
					name: '',
					id: 0,
					members_num: 0,
					members_detail: [],
					owner: 0
				},
				inviteName: '',
				baseUrl: process.env.VUE_APP_API_BASE_URL,
				inviteButtonStyle: {
					width: '100rpx',
					height: '50rpx',
					marginLeft: '20rpx'
				},
				confirmButtonStyle: {
					width: '160rpx',
					height: '60rpx',
					marginTop: '40rpx'
				},
				createButtonStyle: {
					width: '100rpx',
					height: '50rpx',
					marginLeft: '20rpx'
				}
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
			}
		},
		watch: {
			userInfo: {
				handler(){
					if(this.userInfo.team_id){
						this.teamInfo.id = this.userInfo.team_id
						this.handleGetTeamInfo()
					}
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			showAvatarView(url: string) {
				// 预览图片
				if(url){
					uni.previewImage({
						urls: [this.baseUrl + '/' + url],
						indicator: 'none'
					});
				}
			},
			show(){
				this.showModal = true
				if(this.userInfo.team_id){
					this.teamInfo.id = this.userInfo.team_id
					this.handleGetTeamInfo()
				}
			},
			close(){
				this.showModal = false
				this.inviteName = ''
			},
			handleCreate(){
				createTeamAction({
					...this.teamInfo,
					owner: this.userInfo.id,
					members: this.userInfo.id.toString()
				}).then(res=>{
					uni.showToast({title: res.message || '创建成功',icon:'none'})
					this.$emit('ok')
				})
			},
			handleGetTeamInfo(){
				getTeamInfoByIdAction(this.teamInfo).then(res=>{
					this.teamInfo = {...res.data}
				})
			},
			handleInvite(){
				addTeamMemberAction(this.teamInfo.id, {nickname:this.inviteName}).then(res=>{
					uni.showToast({title: res.message || '邀请成功',icon:'none'})
					this.inviteName = ''
					this.handleGetTeamInfo()
				})
			},
			handleRemoveMember(){
				(this as any).$toast('暂不支持删除成员')
			}
		}
	})
</script>

<style lang="scss">
	.team-manage-modal{
		width: 100%;
		
		.not-exist{
			width: 100%;
		}
		
		.not-exist-text{
			padding: 20rpx;
			font-size: 14px;
			color: #909399;
		}
		
		.create-team{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		
		.ready-exist{
			width: 100%;
			
			.ready-exist-text{
				padding: 2rpx 20rpx;
				font-size: 14px;
				color: #333;
			}
		}
		
		.members{
			width: 100%;
			
			.members-item{
				border-bottom: 1px solid #edeff3;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 14rpx;
				padding-bottom: 14rpx;
				&:last-child{
					border-bottom: none;
				}
				
				.member-info{
					display: flex;
					align-items: center;
					
					.member-owner{
						font-size: 12px;
						color: #fff;
						background: #F56C6E;
						padding: 2rpx 8rpx;
						border-radius: 8rpx;
						margin-left: 8rpx;
					}
					.member-one{
						font-size: 12px;
						color: #fff;
						background: #61C63D;
						padding: 2rpx 8rpx;
						border-radius: 8rpx;
						margin-left: 8rpx;
					}
				}
			}
		}
		
		.invite-member{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		
	}
</style>
