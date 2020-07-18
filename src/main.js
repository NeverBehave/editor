import Vue from 'vue'
import App from './App.vue'
import store from './store'

import input from './components/components/controlInput'

Vue.config.productionTip = false
Vue.component('controlInput', input)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
