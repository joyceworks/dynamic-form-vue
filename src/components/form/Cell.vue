<template>
    <div :class="{instance: true, active: active === element}"
         @mousedown.stop="handleActive($event, element)">
        <a-icon type="drag" class="dragger"
                @mousedown.stop="handleDragStart($event, element, swimlane)"></a-icon>
        <span class="id">{{element.id}}</span>
        <grid v-if="element.type === 'grid'" :mode="mode" :data="element"
              @dragstart.stop="handleChildDragStart" :active="active"
              @active.stop="handleChildActive" @mouseup.stop="handleChildSwimlaneMouseUp"></grid>
        <form-group v-else-if="element.type === 'list'" class="list" :required="element.required"
                    :warning="element.warning">
            <span slot="label" :title="element.label">{{element.label}}</span>
            <div slot="element">
                <grid :mode="mode" direction="row" :data="element" :active="active"
                      @active.stop="handleChildActive" @dragstart.stop="handleChildDragStart"
                      @mouseup="handleSwimlaneMouseUp($event, element.swimlanes[0], element)"></grid>
                <a-button type="text" v-if="mode === 'edit'"
                          @click="addRow(element)">
                    添加行
                </a-button>
            </div>
        </form-group>
        <form-group :required="element.required" v-else :warningable="inputed"
                    :warning="element.warning" :layout="direction === 'row' ? 'inline' : 'default'">
            <span slot="label" v-if="labeled" :title="element.label">{{element.label}}</span>
            <template v-if="inputed">
                <template v-if="element.type === 'input'">
                    <a-input slot="element" v-model="element.value" :read-only="mode !== 'edit'"
                             :placeholder="element.placeholder"></a-input>
                </template>
                <template v-if="element.type === 'textarea'">
                    <a-input type="textarea" v-model="element.value" slot="element"
                             :placeholder="element.placeholder"
                             :read-only="mode !== 'edit'"></a-input>
                </template>
                <template v-if="element.type === 'datetime'">
                    <a-date-picker slot="element" :placeholder="element.placeholder"
                                   style="width: 100%;" v-model="element.value"
                                   :read-only="mode !== 'edit'"></a-date-picker>
                </template>
                <template v-if="element.type === 'dropdown'">
                    <a-select style="width: 100%;" :placeholder="element.placeholder"
                              v-model="element.value" :read-only="mode !== 'edit'" slot="element">
                        <a-select-option v-for="item in element.options" :key="item.value"
                                         :value="item.value">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </template>
                <template v-if="element.type === 'checkbox'">
                    <div slot="element">
                        <a-checkbox v-for="option in element.options" :key="option.value"
                                    v-model="element.value" :read-only="mode !== 'edit'">
                            {{option.label}}
                        </a-checkbox>
                    </div>
                </template>
                <template v-if="element.type === 'radio'">
                    <div slot="element">
                        <a-radio v-for="option in element.options" :label="option.label"
                                 :key="option.value" v-model="element.value"
                                 :read-only="mode !== 'edit'">
                            {{option.label}}
                        </a-radio>
                    </div>
                </template>
            </template>
        </form-group>
    </div>
</template>

<script>
  import FormGroup from './FormGroup';
  import Grid from './Grid';

  export default {
    name: 'Cell',
    components: {Grid, FormGroup},
    props: {
      element: {
        type: Object,
        default: null,
      },
      swimlane: {
        type: Object,
        default: null,
      },
      active: {
        type: Object,
        default: null,
      },
      direction: {
        type: String,
        default: 'column',
      },
      mode: {
        type: String,
        default: 'design',
      },
      labeled: {
        type: Boolean,
        default: true,
      },
      inputed: {
        type: Boolean,
        default: true,
      },
    },
    methods: {
      handleDragStart(event, element, parent) {
        event.element = element;
        event.swimlane = parent;
        this.$emit('dragstart', event);
      },
      handleSwimlaneMouseUp(event, swimlane, parent) {
        event.swimlane = swimlane;
        event.parent = parent;
        this.$emit('mouseup', event);
      },
      handleChildDragStart(event) {
        this.$emit('dragstart', event);
      },
      handleChildSwimlaneMouseUp(event) {
        this.$emit('mouseup', event);
      },
      handleActive(event, element) {
        event.element = element;
        this.$emit('active', event);
      },
      handleChildActive(event) {
        this.$emit('active', event);
      },
      addRow(listElement) {
        let json = JSON.stringify(listElement.swimlanes[0].elements);
        let swimlane = {elements: JSON.parse(json)};
        listElement.swimlanes.push(swimlane);
      },
    },
  };
</script>
