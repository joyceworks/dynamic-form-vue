<template>
    <table :class="['swimlanes', mode]">
        <template v-if="direction === 'column'">
            <tr>
                <td v-for="(swimlane, i) in data.swimlanes" :key="i"
                    :class="['swimlane', direction]" :style="{width: swimlane.span + 'px'}"
                    @mouseup="handleSwimlaneMouseUp($event, swimlane, data)">
                    <template v-for="element in swimlane.elements">
                        <!--suppress HtmlUnknownTag -->
                        <cell :element="element" :key="element.id" :direction="direction"
                              @dragstart="handleDragStart" @mouseup="handleSwimlaneMouseUp"
                              :mode="mode" @active="handleActive" :swimlane="swimlane"
                              :active="active"></cell>
                    </template>
                </td>
            </tr>
        </template>
        <template v-else>
            <tr v-for="(swimlane, i) in data.swimlanes" :key="i">
                <td :class="['swimlane', direction]"
                    @mouseup="handleSwimlaneMouseUp($event, swimlane, data)">
                    <a-button type="link" @click="data.swimlanes.splice(i, 1)"
                              v-if="mode === 'edit' && i > 0" size="small">
                        <a-icon type="delete"/>
                    </a-button>
                    <template v-for="element in swimlane.elements">
                        <cell :element="element" :key="element.id" :direction="direction"
                              :labeled="i === 0" :inputed="i !== 0 || mode !== 'edit'" :mode="mode"
                              @dragstart="handleDragStart" @mouseup="handleSwimlaneMouseUp"
                              @active="handleActive" :swimlane="swimlane" :active="active"></cell>
                    </template>
                </td>
            </tr>
        </template>
    </table>
</template>

<script>
  import {Icon} from 'ant-design-vue';

  export default {
    name: 'Grid',
    props: {
      data: {
        type: Object,
        default: null,
      },
      active: {
        type: Object,
        default: null,
      },
      mode: {
        type: String,
        default: 'design',
      },
      direction: {
        type: String,
        default: 'column',
      },
    },
    data: function() {
      return {};
    },
    computed: {},
    methods: {
      handleDragStart(event) {
        this.$emit('dragstart', event);
      },
      handleSwimlaneMouseUp(event, swimlane, parent) {
        if (swimlane) {
          event.swimlane = swimlane;
          event.parent = parent;
        }
        this.$emit('mouseup', event);
      },
      handleActive(event) {
        this.$emit('active', event);
      },
      validate() {
        let result = {};
        let func = function(data, result) {
          data.swimlanes.forEach(swimlane => {
            swimlane.elements.forEach(element => {
              switch (element.type) {
                case 'grid':
                  func(element, result);
                  break;
                case 'list':
                  element.swimlanes.forEach(row => {
                    row.elements.forEach(listElement => {
                      if (listElement.required && !listElement.value) {
                        listElement.warning = '不能为空';
                        result[element.id + ':' + listElement.id] = '不能为空';
                      }
                    });
                  });
                  if (element.swimlanes.length === 1) {
                    element.warning = '不能为空';
                    result[element.id] = '不能为空';
                  }
                  break;
                default:
                  if (element.required && !element.value) {
                    element.warning = '不能为空';
                    result[element.id] = '不能为空';
                  }
                  break;
              }
            });
          });
        };
        func(this.data, result);
        return result;
      },
      getData() {
        let result = {};
        let func = function(data, result) {
          data.swimlanes.forEach(swimlane => {
            swimlane.elements.forEach(element => {
              switch (element.type) {
                case 'grid':
                  func(element, result);
                  break;
                case 'list':
                  result[element.id] = [];
                  element.swimlanes.forEach((row, index) => {
                    if (index > 0) {
                      let rowResult = {};
                      row.elements.forEach(listElement => {
                        rowResult[listElement.id] = listElement.value;
                      });
                      result[element.id].push(rowResult);
                    }
                  });
                  break;
                default:
                  result[element.id] = element.value;
                  break;
              }
            });
          });
        };
        func(this.data, result);
        return result;
      },
    },
    beforeCreate() {
      this.$options.components.Cell = () => import('./Cell.vue');
    },
    components: {
      Icon,
    },
  };
</script>

<style scoped>
    @import "../../assets/grid.css";
</style>