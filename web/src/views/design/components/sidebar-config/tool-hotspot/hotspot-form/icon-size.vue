<script setup lang="ts">
import {NInputNumber} from 'naive-ui'
const width = defineModel('width', {type: Number, default: 0})
const height = defineModel('height', {type: Number, default: 0})
const handleChangeWidth = () => {

}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="flex items-center justify-center">
      <span>宽：</span>
      <n-input-number v-model:value="width"></n-input-number>
      <div class="w-[20px]"></div>
      <span>高：</span>
      <n-input-number v-model:value="height"></n-input-number>
    </div>
  </div>
</template>

<style scoped>

</style>