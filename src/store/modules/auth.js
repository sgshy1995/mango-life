const auth = {
	state: {
		authStatus: true
	},
	mutations: {
		SET_AUTH_STATUS: (state, status) => {
			state.authStatus = status
		}
	},
	actions: {
		setAuthStatus({commit}, status){
			commit('SET_AUTH_STATUS', status)
		}
	}
}

export default auth;