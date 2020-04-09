import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'ant-design-vue/dist/antd.css';
import router from './router';

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  mounted() {
  },
});