<script setup lang="ts">
import _ from "lodash";
import {NInput, NSelect}  from 'naive-ui'
import FormItem from './../hotspot-form/form-item.vue'
import IconSelect  from './../hotspot-form/icon-select.vue'
import IconSize  from './../hotspot-form/icon-size.vue'
import IconAnimation  from './../hotspot-form/icon-animation.vue'
import IconPosition  from './../hotspot-form/icon-position.vue'
import {type MarkPropertiesType, useDesignStore} from '@/stores/useDesign.ts'
import {computed, reactive, watch} from "vue";
import {EVENT_BUS, EVENT_NAME} from "../../../../../../../utils/mitt.ts";
const designStore = useDesignStore()

interface Props {
  markId: string
}
const {markId = ''} = defineProps<Props>()

const markInfo = computed(() => {
  return designStore.getMarkById(markId)
})

const sceneOptions = computed(() => {
  return designStore.currProjectInfo?.viewerList?.map(o => {
    return {
      label: o.name,
      value: o.id,
      disabled: o.id === designStore.currViewerInfo?.id
    }
  })
})

watch(markInfo.value, (value) => {
  EVENT_BUS.$emit(EVENT_NAME.updateMarker, value)
})
// const markInfo: MarkPropertiesType<MarkerDataType>|null = reactive(_.cloneDeep(oldMarkInfo));
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
  <FormItem label="选择场景">
    <n-select v-model:value="markInfo.data.nextSceneId" :options="sceneOptions" placeholder="请选择目标场景"/>
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