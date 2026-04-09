<script setup lang="ts">
import IconPosition from '@/views/design/components/sidebar-config/tool-hotspot/hotspot-form/icon-position.vue'
import {NForm, NFormItem, NInput, NImage, NButton, NUpload, UploadFileInfo} from "naive-ui";
import {useDesignStore} from "@/stores/useDesign.ts";
import {storeToRefs} from "pinia";
import axios from "axios";
import {authToken, SERVE_URL} from "../../../../../../utils";
const designStore = useDesignStore()
const { currProjectId, currViewerId, currProjectInfo, currViewerInfo} = storeToRefs(designStore)


const beforeUpload = async ({file}: UploadFileInfo) => {
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
    currViewerInfo.value.sceneImg = `${url}`
  } catch (e) {
    console.error(e, '?')
  } finally {

  }
}
</script>

<template>
<div>
  <template v-if="currViewerInfo">
    <n-form
        ref="formRef"
        :label-width="80"
    >
      <n-form-item label="场景名称" required>
        <n-input :maxlength="6" v-model:value="currViewerInfo.name" type="text" placeholder="请输入场景名称"></n-input>
      </n-form-item>
      <n-form-item label="初始视角">
        <IconPosition
            v-model:latitude="currViewerInfo.visionPosition.latitude"
            v-model:longitude="currViewerInfo.visionPosition.longitude"
        ></IconPosition>
      </n-form-item>
      <n-form-item label="场景图片">
        <div class="flex flex-col">
          <n-image :src="SERVE_URL + currViewerInfo.sceneImg"></n-image>
          <div class="h-[10px]"></div>
          <n-upload directory-dnd :show-file-list="false" :on-before-upload="beforeUpload">
            <n-button style="width: 100%" size="small" type="info" secondary @click="">更换场景图片</n-button>
          </n-upload>
        </div>
      </n-form-item>
    </n-form>
  </template>
  <template v-if="!currViewerInfo">
    <div class="text-center">请选择一张全景图</div>
  </template>
</div>
</template>

<style scoped>
:deep(.n-upload .n-upload-trigger) {
  width: 100%;
}
</style>