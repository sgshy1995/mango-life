import Vue from 'vue'
import App from './App.vue'

// @ts-ignore
import uView from "uview-ui";
Vue.use(uView);

Vue.prototype.$toast  = function(message:string){
	uni.showModal({
		content: message
	})	
}

Vue.config.productionTip = false

new App().$mount()
