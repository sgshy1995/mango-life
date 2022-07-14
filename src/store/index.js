import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './modules/user'
import auth from './modules/auth'

const store = new Vuex.Store({
	modules :{
		user,
		auth
	}
})

export default store