import Vue from 'vue'
import App from './App.vue'

// @ts-ignore
import uView from "uview-ui";
Vue.use(uView);

// @ts-ignore
import vueHashCalendar from 'vue-hash-calendar'
import 'vue-hash-calendar/lib/vue-hash-calendar.css'
Vue.use(vueHashCalendar)

Vue.prototype.$toast  = function(message:string){
	uni.showModal({
		content: message
	})	
}

Vue.config.productionTip = false

new App().$mount()
