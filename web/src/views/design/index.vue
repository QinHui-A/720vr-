<script setup lang="ts">
import {NButton, } from 'naive-ui'
import ViewerCont from './components/viewer-cont/index.vue'
import ViewerList from './components/viewer-list/index.vue'
import SidebarConfig from './components/sidebar-config/index.vue'
import {useRouter} from "vue-router";
import {useDesignStore} from "@/stores/useDesign.ts";
import {useProjectStore} from "@/stores/useProject.ts";
const router = useRouter()
const designStore = useDesignStore()
const projectStore = useProjectStore()

const onPreview = async () => {
  if(!designStore.currProjectId) return
  await router.push({
    path: '/preview',
    query: {
      id: designStore.currProjectId,
      local: true
    }
  })
}

const onSave = async () => {
 try {
   await projectStore.saveProject(designStore.currProjectId, designStore.currProjectInfo)
   window['$message'].success('保存成功')
 } catch (e) {

 }
}
</script>

<template>
  <div class="page-min design-page w-screen h-screen">
    <div class="page__header flex flex-row justify-between border-shadow box-shadow--border-bottom">
      <div class="iconfont-alimama-bold text-4xl">720°全景编辑器</div>
      <div class="grid grid-cols-3 gap-x-[20px]">
        <n-button size="medium" type="tertiary" @click="router.replace('/')">返回首页</n-button>
        <n-button size="medium" type="success" @click="onSave">保 存</n-button>
        <n-button size="medium" type="info" @click="onPreview">预 览</n-button>
      </div>
    </div>
    <div class="page__content">
      <div class="viewer">
        <viewer-cont></viewer-cont>
        <viewer-list></viewer-list>
      </div>
      <div class="sidebar">
        <sidebar-config></sidebar-config>
      </div>
    </div>
  </div>
</template>

<style scoped>
.design-page {
  display: flex;
  flex-direction: column;
  background: #333333;
  .page__header {
    height: 100px;
    color: #ffffff;
    padding: 0 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-shadow: 0 0 1px #b6b3b3;
    border-bottom-width: 1px;
    border-style: solid;
    border-color: #000;
  }
  .page__content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 350px;
    grid-template-rows: 1fr;

    .viewer {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 200px;
      color: white;
      //width: 1px;
      //background: white;
      .viewer__cont {
        box-shadow: 0 0 1px #b6b3b3;
        border-bottom-width: 1px;
        border-style: solid;
        border-color: #000;
      }
      .viewer__list {
        flex-grow: 0;
        //width: 1px;
        //width: min-content;
      }
    }
  }
  .sidebar {
    box-shadow: 0 0 1px #b6b3b3;
    border-left-width: 1px;
    border-style: solid;
    border-color: #000;
    color: #ffffff;
  }
}
</style>