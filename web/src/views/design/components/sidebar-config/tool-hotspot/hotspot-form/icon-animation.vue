<script setup lang="ts">
import {NRadio, NRadioGroup, NSpace} from 'naive-ui'
const className = defineModel('className', {type: String, default: ''})
</script>

<template>
  <n-radio-group v-model:value="className">
    <n-space>
      <n-radio v-for="(o, i) in [
          {name: '关闭', className: ''},
          {name: '开启', className: 'vr-mark-around-animation'}
      ]" :key="i" :value="o.className">
        {{ o.name }}
      </n-radio>
    </n-space>
  </n-radio-group>
</template>

<style scoped>

</style>