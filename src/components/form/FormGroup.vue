<template>
    <table v-if="layout === 'default'" :class="['form-group', layout]">
        <tr>
            <td class="label">
                <span v-if="required" class="required">*</span>
                <slot name="label"></slot>
            </td>
            <td>
                <slot name="element"></slot>
            </td>
        </tr>
        <tr v-if="warningable">
            <td></td>
            <td class="warning">
                <span v-if="warning">{{warning}}</span>
                <span v-else>&nbsp;</span>
            </td>
        </tr>
    </table>
    <table v-else :class="['form-group', layout]">
        <tr>
            <td class="label">
                <span v-if="required" class="required">*</span>
                <slot name="label"></slot>
            </td>
        </tr>
        <tr>
            <td>
                <slot name="element"></slot>
            </td>
        </tr>
        <tr v-if="warningable">
            <td class="warning">
                <span v-if="warning">{{warning}}</span>
                <span v-else>&nbsp;</span>
            </td>
        </tr>
    </table>
</template>

<script>
  export default {
    name: 'FormGroup',
    props: {
      layout: {
        type: String,
        default: 'default',
      },
      required: {
        type: Boolean,
        default: false,
      },
      warning: {
        type: String,
        default: null,
      },
      warningable: {
        type: Boolean,
        default: true
      }
    },
  };
</script>

<style scoped>
    .form-group {
        table-layout: fixed;
        width: 100%;
        min-height: 42px;
    }

    .form-group.inline {
        display: inline-block;
    }

    .form-group > tr > td.label {
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
        width: 100px;
    }

    .form-group.inline > tr > td.label {
        text-align: left;
        padding: 0;
    }

    .form-group > tr > td.label > .required {
        color: red;
    }

    .form-group > tr > td.warning {
        color: red;
        margin: 0;
    }
</style>