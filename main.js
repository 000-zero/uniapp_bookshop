import App from './App';
import store from '@/store';


// #ifndef VUE3
import Vue from 'vue'

import uView from "uview-ui";
Vue.use(uView);
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})

require('./config/request.js')(app)
//自定义工具
require('./config/utils.js')(app)

let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);


app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif