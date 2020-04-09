import Vue from 'vue';
import VueRouter from 'vue-router';
import DynamicFormDesigner from '../components/form/DynamicFormDesigner';
import App from '../views/App';

Vue.use(VueRouter);

const routes = [
  {
    path: '/app', component: App, children: [
      {path: 'component/dynamicform/designer', component: DynamicFormDesigner},
    ],
  },
];

let router = new VueRouter({
  routes,
});
export default router;