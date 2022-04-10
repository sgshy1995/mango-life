import Vue from 'vue'
import App from './App.vue'

// @ts-ignore
import uView from "uview-ui";
Vue.use(uView);

// @ts-ignore
import vueHashCalendar from 'vue-hash-calendar'
import 'vue-hash-calendar/lib/vue-hash-calendar.css'
Vue.use(vueHashCalendar)

// 引入vuex
import store from './store'
// 把vuex定义成全局组件
Vue.prototype.$store = store

Vue.prototype.$toast  = function(message: string,icon?: "none" | "success" | "loading" | "error" | undefined){
	uni.showToast({
		title: message,
		icon: icon ? icon : 'none'
	})
}

Vue.config.productionTip = false

new App().$mount()
