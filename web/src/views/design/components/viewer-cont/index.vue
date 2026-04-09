<script setup lang="ts">
import {MarkClassType, type MarkPropertiesType, useDesignStore} from '@/stores/useDesign.ts'
import {storeToRefs} from "pinia"
import {nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import {Viewer} from '@photo-sphere-viewer/core';
import {type MarkerConfig, MarkersPlugin} from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'
import {AutorotatePlugin} from '@photo-sphere-viewer/autorotate-plugin';
import {SERVE_URL, uuid} from "../../../../../utils";
import {EVENT_BUS, EVENT_NAME} from "../../../../../utils/mitt.ts";
// import {GyroscopePlugin} from '@photo-sphere-viewer/dist/plugins/gyroscope'
// import {StereoPlugin} from '@photo-sphere-viewer/dist/plugins/stereo'

const designStore = useDesignStore()
const {pointPosition, currViewerInfo} = storeToRefs(designStore)


const IMG_URL = ref(null)
const data = reactive({
  PSV: null as Viewer | null,
  PSV_MARK: null as MarkersPlugin | null,
})

const initViewer = async () => {
  try {
    if (!currViewerInfo.value) return
    if (data.PSV_MARK) {
      await data.PSV_MARK.clearMarkers(false)
      data.PSV_MARK = null;
    }
    if (data.PSV) {
      await data.PSV.destroy();
      data.PSV = null;
    }
    console.log(currViewerInfo.value.sceneImg, 'currViewerInfo.value.sceneImg')
    data.PSV = new Viewer({
      container: 'viewer',
      panorama: `${SERVE_URL}${currViewerInfo.value.sceneImg}`,
  /*    // 添加跨域配置
      requestHeaders: {
        'Cross-Origin': 'anonymous'
      },*/
      loadingTxt: '请稍后',
      defaultZoomLvl: 60,
      defaultYaw: currViewerInfo.value.visionPosition.latitude, // 方位角 (相当于之前的 defaultLong)，范围通常是 -Math.PI 到 Math.PI
      defaultPitch: currViewerInfo.value.visionPosition.longitude, // 仰角 (相当于之前的 defaultLat)，范围通常是 -Math.PI/2 到 Math.PI/2
      plugins: [
        MarkersPlugin.withConfig({
          // defaultHoverScale: true,
          markers: currViewerInfo.value.marks,
        })
      ],
    });
    data.PSV.addEventListener('click', ({data}) => {
      pointPosition.value = {
        latitude: data.yaw,
        longitude: data.pitch,
      }
    });
    data.PSV_MARK = data.PSV.getPlugin(MarkersPlugin);
    data.PSV_MARK.addEventListener('select-marker', (info) => {
      const marker: MarkPropertiesType<MarkerDataType> = info.marker
      console.log(`Clicked on marker ${marker.id}`);
      data.PSV_MARK.gotoMarker(marker.id)

      switch (marker.classification) {
        case MarkClassType.SCENE:
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

const addEventBus = () => {
  EVENT_BUS.$on(EVENT_NAME.addMarker, (mark: MarkerConfig) => {
    if (!data.PSV_MARK) return
    data.PSV_MARK.addMarker(mark, true)
    // data.PSV_MARK.gotoMarker(mark.id)
  })
  EVENT_BUS.$on(EVENT_NAME.updateMarker, (mark: MarkerConfig) => {
    if (!data.PSV_MARK) return
    data.PSV_MARK.setMarkers(designStore.currViewerInfo?.marks, true)
  })
  EVENT_BUS.$on(EVENT_NAME.removeMark, (id: string) => {
    if (!data.PSV_MARK) return
    data.PSV_MARK.setMarkers(designStore.currViewerInfo?.marks, true)
  })
  EVENT_BUS.$on(EVENT_NAME.gotoMarker, (id: string) => {
    if (!data.PSV_MARK) return
    data.PSV_MARK.gotoMarker(id)
  })
  EVENT_BUS.$on(EVENT_NAME.toCenter, ({yaw, pitch}) => {
    console.log(yaw, pitch)
    /*data.PSV.setOptions({
      defaultYaw: yaw,
      defaultPitch: pitch
    })*/
  })

}
const removeEventBus = () => {
  EVENT_BUS.$off(EVENT_NAME.addMarker)
  EVENT_BUS.$off(EVENT_NAME.updateMarker)
  EVENT_BUS.$off(EVENT_NAME.removeMark)
  EVENT_BUS.$off(EVENT_NAME.gotoMarker)
}

watch(() => currViewerInfo.value, (p, n) => {
/*  if(data.PSV && currViewerInfo?.value?.sceneImg) {
    data.PSV?.setPanorama(currViewerInfo.value?.sceneImg)
  }*/
  nextTick(() => {
    initViewer()
  })
}, {
  // immediate: true
})

onMounted(() => {
  initViewer()
})
onBeforeMount(() => {
  addEventBus()
})

onBeforeUnmount(() => {
  removeEventBus()
})
</script>

<template>
  <div class="viewer-cont">
    <div id="custom-marker-element" style="display: none"></div>
    <template v-if="currViewerInfo">
      <div id="viewer" class="w-full h-full"></div>
      <div class="location">当前点击位置：{{ pointPosition.latitude }}，{{ pointPosition.longitude }}</div>
    </template>
    <div v-else>请选择一个场景</div>
  </div>
</template>

<style scoped>
.viewer-cont {
  box-shadow: 0 0 1px #b6b3b3;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #000;
  position: relative;

  .location {
    position: absolute;
    z-index: 10;
    top: 3px;
    left: 3px;
  }
}
</style>