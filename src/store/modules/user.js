const user = {
	state: {
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
		}
	},
	mutations: {
		SET_USER_INFO: (state, info) => {
			state.userInfo = info
		},
		SET_INFO: (state, info) => {
			state.info = info
		}
	},
	actions: {
		setUserInfo({commit}, info){
			commit('SET_USER_INFO', info)
		},
		setInfo({commit}, info){
			commit('SET_INFO', info)
		},
		resetUserInfo({commit}){
			commit('SET_USER_INFO', {
				username: '',
				nickname: '',
				primary_key: '',
				id: 0,
				email: '',
				phone: '',
				avatar: '',
				team_id: 0,
				team_name: ''
			})
		}
	}
}

export default user;