import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './modules/user'
import auth from './modules/auth'
import money from './modules/money'

const store = new Vuex.Store({
	modules :{
		user,
		auth,
		money
	}
})

export default store