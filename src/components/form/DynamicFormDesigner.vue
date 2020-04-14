<template>
    <table class="layout" @mousemove="handleMouseMove($event)"
           @mouseup="handleInstanceMouseUp(data.swimlanes[0].elements, data)">
        <tr>
            <td class="left" rowspan="2">
                <div>基础字段</div>
                <ul class="panel">
                    <li :class="['widget', (!item.enable ? 'disable': '')]"
                        @mousedown="handleWidgetMouseDown(item, $event)"
                        v-for="item in basicWidgets" :key="'widget' + item.type">
                        <span :class="['iconfont', item.icon]"></span>
                        {{item.name}}
                    </li>
                </ul>
                <div>高级字段</div>
                <ul class="panel">
                    <li :class="['widget', (!item.enable ? 'disable': '')]"
                        @mousedown="handleWidgetMouseDown(item, $event)"
                        v-for="item in advancedWidgets" :key="'widget' + item.type">
                        <span :class="['iconfont', item.icon]"></span>
                        {{item.name}}
                    </li>
                </ul>
                <div v-if="draggingInfo.target !== null" id="draggable"
                     :style="{top: draggingInfo.y + 'px', left: draggingInfo.x + 'px'}">
                </div>
            </td>

            <td class="toolbar">
                <a-button type="text" icon="a-icon-delete" @click="handleClickClear">
                    清空
                </a-button>
                <a-button type="text" icon="a-icon-view" @click="handleClickPreview">
                    预览
                </a-button>
                <a-button type="text">
                    <icon type="save"/>
                    保存
                </a-button>
            </td>

            <td class="right" rowspan="2">
                <div class="placeholder" v-if="active.target === null">
                    请选择字段
                </div>
                <div v-if="active.target !== null">
                    <div v-if="active.target.type === 'grid'">
                        <h4>列设置</h4>
                        <draggable v-model="active.target.swimlanes" handle=".iconsort">
                            <div v-for="(swimlane, i) in active.target.swimlanes"
                                 style="margin-bottom: 10px;" :key="'span-' + i">
                                <i class="iconfont iconsort" style="cursor: move"></i>
                                &nbsp;
                                <a-input v-model="swimlane.span" style="width: 200px;"
                                         size="small"></a-input>
                                &nbsp;
                                <a-button type="text" icon="a-icon-delete" style="cursor: pointer"
                                          @click="active.target.swimlanes.splice(i, 1)">
                                </a-button>
                            </div>
                        </draggable>
                        <a-button type="text" icon="a-icon-plus"
                                  @click="active.target.swimlanes.push({span: 50, elements: []})">
                            添加列
                        </a-button>
                    </div>
                    <div v-else-if="active.target.type === 'input'">
                        <a-form-model :label-col="{span: 4}" :wrapper-col="{span: 14}">
                            <h4>显示设置</h4>
                            <a-form-model-item label="标题">
                                <a-input v-model="active.target.label" size="small"></a-input>
                            </a-form-model-item>
                            <a-form-model-item label="水印">
                                <a-input v-model="active.target.placeholder"
                                         size="small"></a-input>
                            </a-form-model-item>
                            <h4>校验设置</h4>
                            <a-form-model-item label="必填">
                                <a-checkbox v-model="active.target.required"></a-checkbox>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <div v-else-if="active.target.type === 'textarea'">
                        <a-form-model :label-col="{span: 4}" :wrapper-col="{span: 14}">
                            <h4>显示设置</h4>
                            <a-form-model-item label="标题">
                                <a-input v-model="active.target.label" size="small"></a-input>
                            </a-form-model-item>
                            <a-form-model-item label="水印">
                                <a-input v-model="active.target.placeholder"
                                         size="small"></a-input>
                            </a-form-model-item>
                            <h4>校验设置</h4>
                            <a-form-model-item label="必填">
                                <a-checkbox v-model="active.target.required"></a-checkbox>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <div v-else-if="active.target.type === 'datetime'">
                        <a-form-model :label-col="{span: 4}" :wrapper-col="{span: 14}">
                            <h4>显示设置</h4>
                            <a-form-model-item label="标题">
                                <a-input v-model="active.target.label" size="small"></a-input>
                            </a-form-model-item>
                            <a-form-model-item label="水印">
                                <a-input v-model="active.target.placeholder"
                                         size="small"></a-input>
                            </a-form-model-item>
                            <h4>校验设置</h4>
                            <a-form-model-item label="必填">
                                <a-checkbox v-model="active.target.required"></a-checkbox>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <div v-else-if="active.target.type === 'list'">
                        <a-form-model :label-col="{span: 4}" :wrapper-col="{span: 14}">
                            <h4>显示设置</h4>
                            <a-form-model-item label="标题">
                                <a-input v-model="active.target.label" size="small"></a-input>
                            </a-form-model-item>
                            <h4>校验设置</h4>
                            <a-form-model-item label="必填">
                                <a-checkbox v-model="active.target.required"></a-checkbox>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <div v-else-if="active.target.type === 'dropdown'">
                        <a-form-model :label-col="{span: 4}" :wrapper-col="{span: 14}">
                            <h4>显示设置</h4>
                            <a-form-model-item label="标题">
                                <a-input v-model="active.target.label" size="small"></a-input>
                            </a-form-model-item>
                            <a-form-model-item label="水印">
                                <a-input v-model="active.target.placeholder"
                                         size="small"></a-input>
                            </a-form-model-item>
                            <h4>选项设置</h4>
                            <draggable v-model="active.target.options" handle=".iconsort">
                                <div v-for="(option, i) in active.target.options"
                                     style="margin-bottom: 10px;" :key="'span-' + i">
                                    <i class="iconfont iconsort" style="cursor: move"></i>
                                    &nbsp;
                                    <a-input v-model="option.label" style="width: 180px;"
                                             size="small"></a-input>
                                    &nbsp;
                                    <a-button type="text" icon="a-icon-delete"
                                              style="cursor: pointer" size="small"
                                              @click="active.target.options.splice(i, 1)">
                                        <a-icon type="delete"></a-icon>
                                    </a-button>
                                </div>
                            </draggable>
                            <a-button type="text" icon="a-icon-plus"
                                      @click="active.target.options.push({label: '新选项', value: new Date().getTime()})">
                                添加选项
                            </a-button>
                            <h4>校验设置</h4>
                            <a-form-model-item label="必填">
                                <a-checkbox v-model="active.target.required"></a-checkbox>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <div v-else-if="active.target.type === 'checkbox' || active.target.type === 'radio'">
                        <a-form-model :label-col="{span: 4}" :wrapper-col="{span: 14}">
                            <h4>显示设置</h4>
                            <a-form-model-item label="标题">
                                <a-input v-model="active.target.label" size="small"></a-input>
                            </a-form-model-item>
                            <h4>选项设置</h4>
                            <draggable v-model="active.target.options" handle=".iconsort">
                                <div v-for="(option, i) in active.target.options"
                                     style="margin-bottom: 10px;" :key="'span-' + i">
                                    <i class="iconfont iconsort" style="cursor: move"></i>
                                    &nbsp;
                                    <a-input v-model="option.label" style="width: 180px;"
                                             size="small"></a-input>
                                    &nbsp;
                                    <a-button type="text" icon="a-icon-delete"
                                              style="cursor: pointer" size="small"
                                              @click="active.target.options.splice(i, 1)">
                                        <a-icon type="delete"></a-icon>
                                    </a-button>
                                </div>
                            </draggable>
                            <a-button type="text" icon="a-icon-plus"
                                      @click="active.target.options.push({label: '新选项', value: new Date().getTime()})">
                                添加选项
                            </a-button>
                            <h4>校验设置</h4>
                            <a-form-model-item label="必填">
                                <a-checkbox v-model="active.target.required"></a-checkbox>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <!--                    {{active.target}}-->
                </div>
            </td>
        </tr>
        <tr>
            <td class="form" @mousemove="handleFormMouseMove($event)">
                <div style="height: 100%; overflow-y: auto;">
                    <div class="placeholder" v-if="data.swimlanes[0].elements.length === 0">
                        从左侧拖拽或点击来添加字段
                    </div>
                    <grid @mouseup.stop="handleInstanceMouseUp($event.swimlane.elements, $event.parent)"
                          style="height: 100%;" :active="active.target" id="content"
                          @dragstart.stop="handleInstanceDragStart" :data="data"
                          @active="handleInstanceMouseDown"></grid>
                    <a-modal title="预览" v-model="previewDialogVisible" width="50%">
                        <grid :data="previewData" mode="edit" ref="previewGrid"></grid>
                        <span slot="footer">
                            <a-button type="primary" @click="handleSaveClick">保存</a-button>
                        </span>
                    </a-modal>
                </div>
            </td>
        </tr>
    </table>
</template>

<script>
  import Grid from './Grid';
  import {clone, getIndex, removeAllChildNodes} from '../../utils/dom';
  import {Icon} from 'ant-design-vue';

  import draggable from 'vuedraggable';

  export default {
    name: 'DynamicFormDesigner',
    data() {
      return {
        draggingInfo: {
          target: null,
          offsetX: null,
          offsetY: null,
          x: null,
          y: null,
          html: null,
        },
        basicWidgets: [
          {type: 'input', icon: 'iconinput', name: '单行文本', enable: true},
          {type: 'textarea', icon: 'iconinput', name: '多行文本', enable: true},
          {type: 'dropdown', icon: 'icondropdown', name: '下拉选择', enable: true},
          {type: 'datetime', icon: 'icondatetime', name: '日期时间', enable: true},
          {type: 'tree', icon: 'icontree', name: '级联选择', enable: false},
          {type: 'checkbox', icon: 'iconcheckbox', name: '多选', enable: true},
          {type: 'radio', icon: 'iconradio', name: '单选', enable: true},
        ],
        advancedWidgets: [
          {type: 'grid', icon: 'icongrid', name: '布局', enable: true},
          {type: 'list', icon: 'iconlist', name: '列表', enable: true},
          {type: 'tab', icon: 'icontab', name: '标签页', enable: false},
          {type: 'separator', icon: 'iconsplit', name: '分割线', enable: false},
        ],
        data: {
          type: 'grid',
          id: new Date().getTime(),
          swimlanes: [{span: 100, elements: []}],
        },
        previewData: null,
        active: {
          target: null,
          parent: null,
        },
        previewDialogVisible: false,
      };
    },
    methods: {
      handleWidgetMouseDown(widget, event) {
        if (!widget.enable) { return; }

        this.draggingInfo.mode = 'copy';
        this.draggingInfo.target = widget;
        this.draggingInfo.offsetX = event.offsetX;
        this.draggingInfo.offsetY = event.offsetY;
        this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
        this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
        this.$nextTick(() => {
          let draggable = document.getElementById('draggable');
          draggable.appendChild(event.target.cloneNode(true));
        });
        this.initIndicator();
      },
      handleMouseMove(event) {
        if (this.draggingInfo.target) {
          this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
          this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
        }
      },
      handleFormMouseMove(event) {
        if (this.draggingInfo.target) {
          let container = this.findContainer(event);
          let indicator = this.initIndicator();
          let refNode = null;
          for (let childNode of container.children) {
            let top = childNode.getBoundingClientRect().top;
            if (event.clientY < top) {
              refNode = childNode;
              break;
            }
          }
          if (refNode === null) {
            container.appendChild(indicator);
          } else {
            container.insertBefore(indicator, refNode);
          }
        }
      },
      handleClickClear() {
        this.data.swimlanes[0].elements.splice(0, this.data.swimlanes[0].elements.length);
      },
      findContainer(event) {
        let target = event.target;
        let type = this.draggingInfo.target.type;
        let root = document.querySelector('#content > tr > td.swimlane');
        if (type === 'list') {
          return root;
        }

        let container;
        if (target.classList.contains('swimlane')) {
          container = target;
        } else {
          container = target.closest('.swimlane');
        }
        if (container && container.classList.contains('row') && type === 'grid') {
          container = null;
        }
        container = container || root;
        return container;
      },
      initIndicator() {
        let indicators = document.getElementsByClassName('indicator');
        let indicator;
        if (indicators.length > 0) {
          indicator = indicators[0];
        } else {
          indicator = document.createElement('div');
          indicator.classList.add('indicator');
        }
        document.getElementsByClassName('swimlane')[0].appendChild(indicator);
        return indicator;
      },
      handleInstanceMouseUp(elements, parent) {
        if (this.draggingInfo.target) {
          if (this.draggingInfo.target.type === 'list') {
            elements = this.data.swimlanes[0].elements;
          }

          if (parent.type === 'list' && this.draggingInfo.target.type === 'grid') {
            elements = this.data.swimlanes[0].elements;
          }

          let element = this.draggingInfo.mode === 'move'
              ? this.draggingInfo.target
              : this.createWidgetInstance(this.draggingInfo.target.type);
          elements.splice(this.getIndicatorIndex(), 0, element);
          this.active.target = element;
          this.draggingInfo.target = null;
          this.$nextTick(() => {
            this.removeIndicator();
          });
        }
      },
      handleInstanceMouseDown(event) {
        this.active.target = event.element;
      },
      handleClickPreview() {
        this.previewDialogVisible = true;
        this.previewData = JSON.parse(JSON.stringify(this.data));
      },
      handleInstanceDragStart(event) {
        this.active.target = event.element;
        this.active.parent = event.swimlane;

        this.draggingInfo.target = event.element;
        this.draggingInfo.offsetX = event.offsetX;
        this.draggingInfo.offsetY = event.offsetY;
        this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
        this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
        this.draggingInfo.mode = 'move';
        this.$nextTick(() => {
          let draggable = document.getElementById('draggable');
          removeAllChildNodes(draggable);
          draggable.appendChild(clone(event.target.closest('div')));
          let elements = event.swimlane.elements;
          elements.splice(elements.indexOf(event.element), 1);
        });
        this.initIndicator();
      },
      handleSaveClick() {
        let validateResult = this.$refs.previewGrid.validate();
        if (Object.keys(validateResult).length > 0) {
          this.$message({
            type: 'info',
            message: JSON.stringify(validateResult),
          });
          return;
        }

        let result = this.$refs.previewGrid.getData();
        this.$message({
          type: 'info',
          message: JSON.stringify(result),
        });
        this.previewDialogVisible = false;
      },
      getIndicatorIndex() {
        return getIndex(document.getElementsByClassName('indicator')[0]);
      },
      removeIndicator() {
        let indicators = document.getElementsByClassName('indicator');
        for (let element of indicators) {
          element.remove();
        }
      },
      createWidgetInstance(widgetType) {
        let element = {type: widgetType, id: widgetType + new Date().getTime(), warning: null};
        if (element.type === 'grid') {
          element.swimlanes = [{span: 50, elements: []}, {span: 50, elements: []}];
        } else if (element.type === 'input') {
          element.label = '单行文本';
          element.placeholder = '请填写';
          element.required = false;
        } else if (element.type === 'textarea') {
          element.label = '多行文本';
          element.placeholder = '请填写';
          element.required = false;
        } else if (element.type === 'dropdown') {
          element.label = '下拉选择';
          element.placeholder = '请选择';
          element.options = [];
          element.required = false;
        } else if (element.type === 'list') {
          element.label = '列表';
          element.swimlanes = [{elements: []}];
        } else if (element.type === 'datetime') {
          element.label = '日期时间';
          element.placeholder = '请选择';
          element.required = false;
        } else if (element.type === 'checkbox') {
          element.label = '多选';
          element.options = [];
          element.required = false;
        } else if (element.type === 'radio') {
          element.label = '单选';
          element.options = [];
          element.required = false;
        }
        return element;
      },
    },
    components: {Grid, draggable, Icon},
    mounted() {
      let that = this;
      document.onkeydown = function(event) {
        switch (event.keyCode) {
          case 27:
            if (that.active.target) {
              that.active.target = null;
              that.active.parent = null;
            }
            break;
          case 46:
            if (that.active.target) {
              let elements = that.active.parent
                  ? that.active.parent.elements
                  : that.data.swimlanes[0].elements;
              elements.splice(elements.indexOf(event.element), 1);
            }
            break;
          default:
            break;
        }
      };
    },
  };
</script>
<style scoped>
    @import "../../assets/dynamic-form-designer.css";
</style>