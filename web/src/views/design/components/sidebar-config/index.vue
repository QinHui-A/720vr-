<script setup lang="ts">
import {NTabs, NTabPane} from 'naive-ui'
import {computed, onMounted, reactive, watch} from "vue";
import ProjectSettings from './project-settings/index.vue'
import SceneSettings from './scene-settings/index.vue'
import ToolHotspot from './tool-hotspot/index.vue'
import {useDesignStore} from "@/stores/useDesign.ts";
import {storeToRefs} from "pinia";

const designStore = useDesignStore()
const {currProjectId, currProjectInfo, currViewerId} = storeToRefs(designStore)
let data = reactive({
  toolList: [
    {name: '项目设置', componentName: 'ProjectSettings'},
    {name: '场景设置', componentName: 'SceneSettings'},
    {name: '热点', componentName: 'ToolHotspot'},
  ],
  flg: false,
  currIndex: 0,
})

const checkTool = (i: number) => {
  data.currIndex = i;
}

let timer = null;
watch(() => data.currId, () => {
  console.log('==========让设置组件重新渲染一次，data重新赋值==============')
  clearTimeout(timer);
  data.flg = true;
  timer = setTimeout(() => {
    data.flg = false
  }, 100)
})

onMounted(() => {

  console.log(currProjectInfo.value, 'currProjectInfo.value')
  if (currProjectInfo.value &&  currProjectInfo.value.viewerList.length && !currViewerId.value) {
    currViewerId.value = currProjectInfo.value.viewerList[0].id
  }
})
</script>

<template>
  <div class="sidebar-config">
    <div class="tool-list">
      <div
          class="item"
          :class="i == data.currIndex ? 'active' : ''"
          :key="i"
          v-for="(o, i) in data.toolList"
          @click="checkTool(i)"
      >
        <span v-for="(t, _i) in o.name" :key="_i">{{ t }}</span>
      </div>
    </div>
    <div class="tool-component" v-if="!data.flg">
      <ProjectSettings v-if="data.toolList[data.currIndex].componentName === 'ProjectSettings'"></ProjectSettings>
      <SceneSettings v-if="data.toolList[data.currIndex].componentName === 'SceneSettings'"></SceneSettings>
      <ToolHotspot v-if="data.toolList[data.currIndex].componentName === 'ToolHotspot'"></ToolHotspot>
    </div>
  </div>
</template>

<style scoped>
.sidebar-config {
  display: flex;

  .tool-list {
    width: 35px;
    height: 100%;
    box-sizing: border-box;

    .item {
      cursor: pointer;
      margin-bottom: 10px;
      background-color: rgb(26, 25, 24);
      padding: 10px 5px;
      line-height: 30px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 18px;
      border-radius: 0 10px 10px 0;

      &.active {
        background-color: aliceblue;
        color: rgb(121, 123, 126);
        font-weight: bold;
        box-shadow: 3px 2px 5px rgb(172, 183, 219);
      }
    }
  }

  .tool-component {
    flex: 1;
    padding: 20px 30px;
  }
}
</style>