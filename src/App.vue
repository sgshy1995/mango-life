<script>
    import Vue from 'vue';
	import {
		getUserInfoByUsernameAction,
		getInfoByUserIdAction
	} from '@/service/service'
    export default {
        mpType: 'app',
		data(){
			return {
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
				info: {
					id: 0,
					money_avatar: '',
					money_background: '',
					user_id: 0
				},
			}
		},
		onShow(){
			if (uni.getStorageSync('SYS_USER_INFO') && uni.getStorageSync('SYS_USER_INFO').id) {
				this.userInfo = uni.getStorageSync('SYS_USER_INFO')
				console.log('this.userInfo', this.userInfo)
			}
			if (uni.getStorageSync('SYS_AUTH_TOKEN_KEY')) {
				this.getUserInfo(this.userInfo)
			}
		},
		methods:{
			getUserInfo(userInfo) {
				return new Promise((reslove, reject) => {
					getUserInfoByUsernameAction(userInfo).then(res => {
						//this.close()
						uni.setStorageSync('SYS_USER_INFO', res.data)
						this.userInfo = res.data
						this.$store.dispatch('setUserInfo', this.userInfo)
						getInfoByUserIdAction(this.userInfo).then(res=>{
							this.info = res.data
						})
						reslove()
					}).catch(() => {
						this.userInfo = {
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
						uni.removeStorageSync('SYS_USER_INFO')
						reject()
					})
				})
			},
		}
    };
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
</style>

<style>
    /*每个页面公共css */
</style>
