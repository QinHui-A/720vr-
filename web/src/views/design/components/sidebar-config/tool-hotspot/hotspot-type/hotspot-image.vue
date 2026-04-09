<script setup lang="ts">
import {NIcon, NInput, NUpload, NUploadDragger, UploadFileInfo} from 'naive-ui'
import FormItem from '../hotspot-form/form-item.vue'
import IconSelect  from '../hotspot-form/icon-select.vue'
import IconSize  from '../hotspot-form/icon-size.vue'
import IconAnimation  from '../hotspot-form/icon-animation.vue'
import IconPosition  from '../hotspot-form/icon-position.vue'
import {useDesignStore} from "@/stores/useDesign.js";
import {computed, ref, watch} from "vue";
import {EVENT_BUS, EVENT_NAME} from "../../../../../../../utils/mitt.ts";
import {ArrowUp} from "@vicons/ionicons5";
import {authToken, SERVE_URL, uuid} from "../../../../../../../utils";
import axios from "axios";
import {storeToRefs} from "pinia";
const designStore = useDesignStore()
const {currProjectId} = storeToRefs(designStore)

interface Props {
  markId: string
}
const {markId = ''} = defineProps<Props>()

const markInfo = computed(() => {
  return designStore.getMarkById(markId)
})

const fileList = ref([
  {
    id: uuid(),
    name: markInfo.value.data.image,
    url: markInfo.value.data.image,
    status: 'finished'
  }
])

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
    console.log(url, filename, '后端')
    markInfo.value.data.image = `${url}`
    fileList.value = [
      {
        ...file,
        fullPath: `${SERVE_URL}${file.fullPath}`,
        status: 'finished'
      }
    ]
  } catch (e) {
    console.error(e, '?')
  } finally {

  }
}
/*const beforeUpload = async ({file}: UploadFileInfo) => {
  try {
    console.log(file)
    markInfo.value.data.image = `resource${file.fullPath}`
    fileList.value = [
      {
        ...file,
        status: 'finished'
      }
    ]
  } catch (e) {
    console.error(e, '?')
  } finally {

  }
}*/
const onRemove = () => {
  markInfo.value.data.image = null
  fileList.value = []
}
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
    <FormItem label="图片">
      <n-upload
          directory-dnd
          :show-file-list="true"
          :file-list="fileList"
          list-type="image-card"
          :on-before-upload="beforeUpload"
          :on-remove="onRemove"
      >
        <n-upload-dragger>
          <div class="flex flex-col items-center justify-center">
            <n-icon size="30" :depth="1">
              <ArrowUp />
            </n-icon>
            <div class="color-[#fff]">上传热点图片</div>
          </div>
        </n-upload-dragger>
      </n-upload>
    </FormItem>
    <FormItem label="标题">
      <n-input v-model:value="markInfo.data.title" placeholder="请输入标题" maxlength="10"></n-input>
    </FormItem>
    <FormItem label="描述">
      <n-input v-model:value="markInfo.data.description" placeholder="请输入热点描述" maxlength="500"></n-input>
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