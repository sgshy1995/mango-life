import Vue from 'vue'
import App from './App.vue'

import uView from "uview-ui";
Vue.use(uView);

Vue.prototype.$toast  = function(message,icon){
	uni.showToast({
		title: message,
		icon: icon ? icon : 'none'
	})
}

Vue.prototype.$loadingOn  = function(){
	uni.showLoading({
		title: '',
		mask: true
	})
}

Vue.prototype.$loadingOff  = function(){
	uni.hideLoading()
}

Vue.config.productionTip = false

new App().$mount()
