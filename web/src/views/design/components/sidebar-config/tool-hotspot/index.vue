<script setup lang="ts">
import {getHotspotInfo, HOTSPOT_OPTION, type MarkPropertiesType, useDesignStore} from "@/stores/useDesign.ts";
import {storeToRefs} from "pinia";
import {ref} from "vue";
import {NSelect, NButton, NTag} from 'naive-ui'
import Drawer from './drawer/index.vue'
import {EVENT_BUS, EVENT_NAME} from "../../../../../../utils/mitt.ts";

const designStore = useDesignStore()
const {currProjectId, currViewerId, currProjectInfo, currViewerInfo} = storeToRefs(designStore)


const pop = ref({
  hotspotType: null,
  markId: '',
  type: 'add',
  show: false
})
const handleAdd = () => {
  if (!pop.value.hotspotType) {
    window['$message'].warning('请选择热点类型')
    return
  }
  const mark = designStore.addMark(pop.value.hotspotType)
  EVENT_BUS.$emit(EVENT_NAME.addMarker, mark)
  pop.value.markId = mark.id
  pop.value.show = true
  pop.value.type = 'add'
}

const removeMark = (mark: MarkPropertiesType<MarkerDataType>) => {
  designStore.removeMark(mark.id)
  EVENT_BUS.$emit(EVENT_NAME.removeMark, mark.id)
}
const goMark = (mark: MarkPropertiesType<MarkerDataType>) => {
  EVENT_BUS.$emit(EVENT_NAME.gotoMarker, mark.id)
}
const editMark = (mark: MarkPropertiesType<MarkerDataType>) => {
  goMark(mark)
  pop.value.markId = mark.id
  pop.value.hotspotType = mark.classification
  pop.value.show = true
  pop.value.type = 'edit'
}

</script>

<template>
  <div>
    <template v-if="currViewerInfo">
      <div>
        <div class="flex items-center justify-between">
          <n-select class="mr-[10px]" v-model:value="pop.hotspotType" :options="HOTSPOT_OPTION"  placeholder="请选择热点"/>
          <n-button type="info" @click="handleAdd">添加热点</n-button>
        </div>
        <div class="my-[10px]">
          热点数量：{{ currViewerInfo.marks.length }}
        </div>
        <template v-for="(o, i) in currViewerInfo.marks" :key="o.id">
          <div class="mark-item">
            <div class="flex items-center justify-between mb-[10px]">
              <div>{{ o.name }}</div>
            </div>
            <div class="flex items-center justify-end">
              <n-tag class="mr-auto" size="tiny" round :bordered="false" type="default" disabled>{{getHotspotInfo(o.classification).label}}</n-tag>
              <n-button size="tiny" type="warning" secondary @click="removeMark(o)">移除</n-button>
              <div class="w-[10px]"></div>
              <n-button size="tiny" type="success" secondary @click="editMark(o)">编辑</n-button>
              <div class="w-[10px]"></div>
              <n-button size="tiny" type="info" secondary @click="goMark(o)">转到热点</n-button>
            </div>
          </div>
        </template>
      </div>
      <Drawer v-if="pop.show" v-model:show="pop.show"
              :hotspotType="pop.hotspotType"
              :type="pop.type"
              :mark-id="pop.markId"
      ></Drawer>
    </template>
    <template v-if="!currViewerInfo">
      <div class="text-center">请选择一张全景图</div>
    </template>
  </div>
</template>

<style scoped lang="less">
.mark-item {
  background: rgba(188, 188, 188, 0.12);
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 10px;
}
</style>