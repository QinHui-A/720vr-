<script setup lang="ts">
import {HOTSPOT_ICONS} from '@/stores/useDesign.ts'
const icon = defineModel('value', {type: String, default: ''})
const handleChange = (value) => {
  icon.value = value
}
</script>

<template>
  <div class="icon-select flex flex-row flex-wrap justify-center">
    <div v-for="(o, i) in HOTSPOT_ICONS" :key="i" @click="handleChange(o)">
      <img
          class="icon"
          :class="icon === o ? 'active' : ''"
          :src="o"
          alt="icon"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.icon-select {
  background: rgba(51, 51, 51, 0.78);
  padding: 20px 10px;
  border-radius: 5px;
  box-sizing: border-box;

  .icon {
    margin-right: 10px;
    width: 35px;
    height: 35px;
    box-sizing: border-box;
    border-radius: 5px;
    &.active {
      border: 1px solid #2080F0;
    }
  }
}
</style>