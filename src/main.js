import Vue from 'vue'
import VeeValidate from 'vee-validate';

const config = {
  //errorBagName: 'errorBags', // change if property conflicts.
  fieldsBagName: 'fieldBags',
};
Vue.use(VeeValidate, config);
import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'

// import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import { baseUrl } from "@/utils/global.js";

//main.js
if (process.env.NODE_ENV === 'development') {
  require('./mock') // simulation data
}

import * as filters from './filters' // global filters


Vue.use(Element, {
  size: 'medium', // set element-ui default size
  // i18n: (key, value) => i18n.t(key, value)
})
/*两行省略*/
Vue.prototype.subWord = function(str){
  var templen=0;
  for(var i=0;i<str.length;i++){
    console.log('CODE',str.charCodeAt(i))
    if(str.charCodeAt(i)>127){
      templen+=2;
    }else{
      templen++
    }
    if(templen == 68){
      if(str.charCodeAt(i)==32){
        return str.substring(0,i)+'...';
      }else{
        return str.substring(0,i+1)+'...';
      }
    }else if(templen >68){
      if(str.charCodeAt(i)==32){

        return str.substring(0,i-1)+'...';
      }else{
        return str.substring(0,i)+'...';
      }

    }
  }

  return str;
}

Vue.prototype.filterWord = function(str,num) {
  if(str){
    var msg = str.replace(/<\/?[^>]*>/g, '').replace(/&nbsp;/ig,''); //去除HTML Tag
    if(msg.length>num){
      var result=msg.slice(0,num)+'...';
      return result
    }else{
      return msg
    }
  }else{
    return ''
  }
}

// 图片
Vue.prototype.imgUrl = function(link) {
  return `${baseUrl}/file/file/?fileName=${link}&isOnLine=true`
}

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // i18n,
  template: '<App/>',
  components: { App }
})
