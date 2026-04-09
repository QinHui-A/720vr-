<script setup lang="ts">
import {NCard, NImage, NModal, NResult} from 'naive-ui'
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import {Viewer} from "@photo-sphere-viewer/core";
import {MarkersPlugin} from "@photo-sphere-viewer/markers-plugin";
import {type ImgMarkerDataType, MarkClassType, type MarkPropertiesType, type ViewerType} from "@/stores/useDesign.ts";
import {ProjectType} from "@/stores/useProject.ts";
import {getJson, RELEASE_IMAGE_URL} from "../../../utils";
let projectInfo = ref<ProjectType | null>(null)
const data = reactive({
  PSV: null as Viewer | null,
  PSV_MARK: null as MarkersPlugin | null,
})
const currViewerId = ref<string | null>(null)
const currViewerInfo = computed<ViewerType | null>(() => {
  return projectInfo?.value.viewerList.find(o => o.id === currViewerId.value)
})
const handleSceneMark = async (nextSceneId: string) => {
  try {
    if (!nextSceneId || (currViewerId.value === nextSceneId)) return;

    data.PSV_MARK?.clearMarkers()
    const nextViewer: ViewerType | null = projectInfo?.value.viewerList?.find(o => o.id === nextSceneId)
    if (!nextViewer) return;
    currViewerId.value = nextSceneId
    await data.PSV?.setPanorama(RELEASE_IMAGE_URL(currViewerInfo.value.sceneImg), {
      transition: false,
      position: {
        yaw: nextViewer.visionPosition.latitude,
        pitch: nextViewer.visionPosition.longitude,
      }
    })
    data.PSV_MARK.setMarkers(nextViewer.marks, true)
  } catch (e) {
    console.error(e)
  }
}
const currImageMarkInfo = ref<ImgMarkerDataType | null>(null)
const pop = ref(<{
  show: boolean,
  type: MarkClassType | null,
  info: MarkerDataType | null,
}>{
  show: false,
  type: null,
  info: null
})
const initViewer = async () => {
  try {
    data.PSV = new Viewer({
      container: 'viewer',
      panorama: RELEASE_IMAGE_URL(currViewerInfo.value.sceneImg),
      loadingTxt: '请稍后',
      defaultZoomLvl: 60,
      defaultYaw: currViewerInfo.value.visionPosition.latitude, // 方位角 (相当于之前的 defaultLong)，范围通常是 -Math.PI 到 Math.PI
      defaultPitch: currViewerInfo.value.visionPosition.longitude, // 仰角 (相当于之前的 defaultLat)，范围通常是 -Math.PI/2 到 Math.PI/2
      plugins: [
        MarkersPlugin.withConfig({
          markers: currViewerInfo.value?.marks,
        })
      ],
    });
    data.PSV_MARK = data.PSV.getPlugin(MarkersPlugin);
    data.PSV_MARK.addEventListener('select-marker', async (info) => {
      const marker: MarkPropertiesType<MarkerDataType> = info.marker.config
      data.PSV_MARK.gotoMarker(marker.id)

      switch (marker.classification) {
        case MarkClassType.SCENE:
          await handleSceneMark(marker.data.nextSceneId)
          break;
        case MarkClassType.WEB:
          window.open(marker.data.url)
          break;
        case MarkClassType.IMG:
          pop.value.show = true
          pop.value.type = MarkClassType.IMG
          pop.value.info = marker.data
          break;
        case MarkClassType.TIP:
          if (marker.data.description) {
            pop.value.type = MarkClassType.TIP
            pop.value.show = true
            pop.value.info = marker.data
          }
          break;
        default:
          break;
      }
    });
    console.log(`init PSV`);
  } catch (e) {
    console.error(e)
  } finally {

  }
}

let loading = ref(true)
onMounted(async () => {
  try {
    loading.value = true

    const PROJECT_JSON = window['PROJECT_JSON']
    console.log(PROJECT_JSON, 'PROJECT_JSON???')
    if (!PROJECT_JSON) return
    const viewerList = getJson(PROJECT_JSON?.viewerJson, [])
    if(!viewerList.length) return
    const {id, name, description, createTime} = PROJECT_JSON
    projectInfo.value = { id, name, description, createTime, viewerList }
    currViewerId.value = viewerList[0]?.id
    await nextTick()
    await initViewer()
  } catch (e) {
    console.log(e, '???11')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col w-screen h-screen" v-if="projectInfo">
    <div id="viewer" class="w-full flex-1"></div>
    <n-modal :z-index="99999999999" to="#viewer" v-model:show="pop.show" preset="dialog" closable
             :style="{ width: '50%' }"  :show-icon="false">
      <template #default v-if="pop.info">
        <div v-if="pop.type === MarkClassType.IMG">
          <div class="text-center text-xl mb-[10px]">{{pop.info?.title}}</div>
          <n-image :src="RELEASE_IMAGE_URL(pop.info.image)" style="max-height: 500px" :preview-disabled="true" object-fit="fill"></n-image>
          <div style="font-size: 16px;line-height: 32px">{{ pop.info.description }}</div>
        </div>
        <div v-if="pop.type === MarkClassType.TIP">
          <div class="indent-8 text-l" style="font-size: 16px;line-height: 32px">{{ pop.info.description }}</div>
        </div>
      </template>
    </n-modal>
    <div class="viewer-list">
      <template v-for="viewer in projectInfo.viewerList" :key="viewer.id">
        <div class="viewer-item relative" :class="currViewerId === viewer.id ? 'active':''"
             @click="handleSceneMark(viewer.id)">
          <n-image :src="RELEASE_IMAGE_URL(viewer.sceneImg)" width="180px" :preview-disabled="true" object-fit="fill"></n-image>
          <div v-if="currViewerId === viewer.id" class="drop">当前浏览</div>
          <div class="name absolute overflow-clip overflow-ellipsis break-words text-nowrap">{{ viewer.name }}</div>
        </div>
      </template>
    </div>
  </div>
  <div class="w-screen h-screen grid items-center" v-else>
    <n-result v-if="!loading" status="404" title="404 资源不存在" description="生活总归带点荒谬"></n-result>
    <n-result v-if="loading" status="info" title="加载中" description="请耐心等待"></n-result>
  </div>
</template>

<style scoped lang="less">
:deep(.n-dialog) {
  background-color: rgba(0, 0, 0, 0.4) !important;
  color: white;
  padding: 50px;
  .n-base-icon {
    color: white !important;
  }
}

.viewer-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px);
  background: rgba(0, 0, 0, 0.7);
  column-gap: 20px;
  overflow-x: auto;
  grid-template-rows: 1fr;
  grid-auto-flow: column;

  .viewer-item {
    width: 180px;

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
      color: #fff;
    }

    .name {
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      padding: 0 5px;
      font-size: 12px;
      background: rgba(55, 55, 55, 0.66);
      color: #fff;
      text-align: center;
      line-height: 30px;
    }
  }
}

@keyframes bounce-in {
  0% {
    bottom: -20px;
    opacity: 0;
  }
  50% {
    bottom: -10px;
    opacity: 0.5;
  }
  100% {
    bottom: 0;
    opacity: 1;
  }
}
</style>
