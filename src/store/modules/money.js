const money = {
	state: {
		moneyChangeCount: 0
	},
	mutations: {
		SET_MONEY_CHANGE_COUNT: (state) => {
			state.moneyChangeCount++
		}
	},
	actions: {
		changeMoneyCount({commit}){
			commit('SET_MONEY_CHANGE_COUNT')
		}
	}
}

export default money;