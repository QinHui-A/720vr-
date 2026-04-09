<script setup lang="ts">
import {NInput, NSelect}  from 'naive-ui'
import FormItem from '../hotspot-form/form-item.vue'
import IconSelect  from '../hotspot-form/icon-select.vue'
import IconSize  from '../hotspot-form/icon-size.vue'
import IconAnimation  from '../hotspot-form/icon-animation.vue'
import IconPosition  from '../hotspot-form/icon-position.vue'
import {useDesignStore} from "@/stores/useDesign.js";
import {computed, watch} from "vue";
import {EVENT_BUS, EVENT_NAME} from "../../../../../../../utils/mitt.ts";

const designStore = useDesignStore()

interface Props {
  markId: string
}
const {markId = ''} = defineProps<Props>()

const markInfo = computed(() => {
  return designStore.getMarkById(markId)
})
watch(markInfo.value, (value) => {
  EVENT_BUS.$emit(EVENT_NAME.updateMarker, value)
})
</script>

<template>
  <div class="w-full" v-if="markInfo">
    <FormItem label="请选择图标">
      <IconSelect v-model:value="markInfo.image"></IconSelect>
    </FormItem>
    <FormItem label="热点名称">
      <n-input v-model:value="markInfo.name" placeholder="请输入热点名称"></n-input>
    </FormItem>
    <FormItem label="图标位置">
      <IconPosition
          v-model:latitude="markInfo.position.yaw"
          v-model:longitude="markInfo.position.pitch"
      ></IconPosition>
    </FormItem>
    <FormItem label="超链接">
      <n-input v-model:value="markInfo.data.url" placeholder="请输入链接地址"></n-input>
    </FormItem>
    <FormItem label="提示语">
      <n-input v-model:value="markInfo.tooltip" placeholder="请输入热点提示语" maxlength="20"></n-input>
    </FormItem>
    <FormItem label="图标大小">
      <IconSize v-model:width="markInfo.size.width" v-model:height="markInfo.size.height"></IconSize>
    </FormItem>
    <FormItem label="图标动画">
      <IconAnimation v-model:className="markInfo.className" ></IconAnimation>
    </FormItem>
  </div>
</template>

<style scoped>

</style>