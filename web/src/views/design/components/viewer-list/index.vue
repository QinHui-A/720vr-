<script setup lang="ts">
import {NUpload, NUploadDragger, NIcon, NImage, NButton, useDialog} from 'naive-ui'
import {ArrowUp} from '@vicons/ionicons5'
import {useDesignStore, type ViewerType} from "@/stores/useDesign.ts";
import {storeToRefs} from "pinia";
import {useRoute} from 'vue-router'
import {computed, onBeforeMount, onMounted, ref} from "vue";
import axios from 'axios'
const dialog = useDialog()

import {useProjectStore} from "@/stores/useProject.ts";
import {authToken, getBase64FromFile, SERVE_URL} from "../../../../../utils";
import {Upload} from "@/api/Upload.js";

const route = useRoute()


const designStore = useDesignStore()
const {currProjectId, currViewerId} = storeToRefs(designStore)
const currProjectInfo = computed(() => {
  return designStore.getCurrProjectInfo()
})
onBeforeMount(() => {
  designStore.setProjectId(route.query.id ?? null)
})

const beforeUpload = async ({file}: any) => {
  try {
    let form = new FormData();
    form.append('file', file.file);
    form.append('projectId', currProjectId.value);
    const {data} = await axios.post('api/files/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + authToken.value
      },
    })
    if (!data || data.code !== 200) {
      console.log(data, 'ss')
      return new Error(data.msg)
    }
    const {url, filename} = data.data;
    designStore.buildViewer({
      name: file.name,
      sceneImg: `${url}`
    })
  } catch (e) {
    console.error(e, '?')
  } finally {

  }
}

/*const beforeUpload = async ({file}: UploadFileInfo) => {
  try {
    console.log(file)
    // return
    // const res = await getBase64FromFile(file.file)
    designStore.buildViewer({
      name: file.name,
      sceneImg: `vr${file.fullPath}`
    })
  } catch (e) {
    console.error(e, '?')
  } finally {

  }
}*/
const selectViewer = (item: ViewerType) => {
  console.log(item, 'selectViewer')
  designStore.setCurrViewerId(item.id)
}
const handleRemove = (item: ViewerType) => {
  console.log(item, 'handleRemove')
  dialog.warning({
    title: '警告',
    content: `确定移除该场景：${item.name}？`,
    positiveText: '确定',
    negativeText: '取消',
    draggable: true,
    onPositiveClick: () => {
      designStore.removeViewer(item)
    },
    onNegativeClick: () => {
    }
  })
}

</script>

<template>
  <div class="viewer-list">
    <div class="upload-box">
      <n-upload
          directory-dnd
          :show-file-list="false"
          :on-before-upload="beforeUpload"
      >
        <n-upload-dragger style="background: #292828">
          <n-icon size="30" :depth="1" color="#fff">
            <ArrowUp/>
          </n-icon>
          <div class="color-[#fff]">上传全景图</div>
        </n-upload-dragger>
      </n-upload>
    </div>
    <div class="scroll-view">
      <template v-if="currProjectInfo">
        <template v-for="(item) in currProjectInfo.viewerList" :key="item.id">
          <div
              class="view-item w-[200px] h-[130px] mx-[10px] shrink-0"
              :class="currViewerId === item.id ? 'active':''"
          >
            <div class="tool">
              <n-button size="small" type="info" @click="selectViewer(item)">编辑</n-button>
              <n-button size="small" type="warning" style="margin-left: 10px" @click.stop="handleRemove(item)">移除
              </n-button>
            </div>
            <div v-if="currViewerId === item.id" class="drop">当前编辑</div>
            <n-image :src="SERVE_URL + item.sceneImg" preview-disabled object-fit="fill" class="w-full h-full" width="100%"
                     height="100%"></n-image>
          </div>
        </template>

      </template>
    </div>
  </div>
</template>

<style scoped>
.n-upload-dragger {
  height: 130px;
  display: grid;
  place-items: center;
}

.viewer-list {
  height: 100%;
  padding: 20px;
  //background: #4762e2;
  box-sizing: border-box;
  display: flex;

  .upload-box {
    width: 200px;
    height: 130px;
    box-sizing: border-box;
  }

  .scroll-view {
    width: 1px;
    margin-left: 20px;
    //background: white;
    flex: 1;
    display: flex;
    flex-shrink: 0;
    overflow-x: auto;
    justify-content: flex-start;

    .view-item {
      position: relative;
      border-radius: 2px;
      overflow: hidden;

      &.active {
        border: 1px dashed #2080F0;
      }

      .drop {
        height: 22px;
        background: #2080F0;
        position: absolute;
        font-size: 12px;
        padding: 0 4px;
        line-height: 22px;
        left: 0;
        top: 0;
      }

      .tool {
        display: none;
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(71, 98, 226, 0.16);
      }

      &:hover .tool {
        display: flex;
        justify-content: center;
        place-items: center;

      }
    }
  }
}
</style>