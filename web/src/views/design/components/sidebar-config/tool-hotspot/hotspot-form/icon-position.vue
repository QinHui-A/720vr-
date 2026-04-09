<script setup lang="ts">

import {NInputNumber, NButton} from "naive-ui";
import {useDesignStore} from "@/stores/useDesign.js";
import {storeToRefs} from "pinia";
import {EVENT_BUS, EVENT_NAME} from "../../../../../../../utils/mitt.ts";
const designStore = useDesignStore()
const { pointPosition } = storeToRefs(designStore)
const props = defineProps({
  latitude: Number,
  longitude: Number
})
const emit = defineEmits(['update:latitude' ,'update:longitude'])

const handleChange = (type, val) => {
  console.log(type, val)
  switch (type) {
    case 'latitude':
      emit('update:latitude', Number(val))
      break;
    case 'longitude':
      emit('update:longitude', Number(val))
      break;
    default:
      break;
  }
}

const getPointPosition = () => {
  emit('update:latitude', pointPosition.value.latitude)
  emit('update:longitude', pointPosition.value.longitude)
  EVENT_BUS.$emit(EVENT_NAME.toCenter, {
    yaw: pointPosition.value.latitude,
    pitch: pointPosition.value.longitude
  })
}
</script>

<template>
<div class="flex flex-col justify-center">
  <div class="mb-[10px] flex items-center justify-center">
    <span>x：</span> <n-input-number size="small" :show-button="false" :value="latitude" @input="(val) => handleChange('latitude', val.data)"/>
    <div class="w-[10px]"></div>
    <div>y： </div><n-input-number size="small" :show-button="false" :value="longitude" @input="(val) => handleChange('longitude', val.data)"/>
  </div>
  <n-button size="small" secondary type="info" @click="getPointPosition">填入当前点击位置</n-button>
</div>
</template>

<style scoped>

</style>