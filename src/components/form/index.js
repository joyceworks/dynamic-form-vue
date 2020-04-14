import DynamicFormDesigner from './DynamicFormDesigner';
import DynamicForm from './DynamicForm';

const components = [
  DynamicFormDesigner,
  DynamicForm,
];

const install = function(Vue) {
  components.map(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  DynamicFormDesigner,
  DynamicForm
};
