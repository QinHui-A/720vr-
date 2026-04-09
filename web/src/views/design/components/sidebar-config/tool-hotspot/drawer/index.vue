<script setup lang="ts">
import {NDrawer, NDrawerContent, NTag, NButton} from 'naive-ui'
import {getHotspotInfo, MarkClassType} from "@/stores/useDesign.ts";
import {computed} from "vue";
import HotspotScene from './../hotspot-type/hotspot-scene.vue'
import HotspotTip from './../hotspot-type/hotspot-tip.vue'
import HotspotWeb from './../hotspot-type/hotspot-web.vue'
import HotspotImage from './../hotspot-type/hotspot-image.vue'
const show = defineModel('show', {type: Boolean, default: false})
defineOptions({
  components: {
    HotspotScene,
    HotspotTip,
    HotspotWeb,
    HotspotImage
  }
})

interface Props {
  hotspotType: MarkClassType
  type: 'add'|'edit'
  markId: string
}

const { hotspotType = 'scene' } = defineProps<Props>()
const hotspotInfo = computed(() => {
  return getHotspotInfo(hotspotType)
})

</script>

<template>
  <n-drawer :mask-closable="false" :show-mask="false" :trap-focus="false" v-model:show="show" :auto-focus="false" :width="350" placement="right">
    <n-drawer-content :closable="true">
      <template #header>
        <div class="flex items-center">
          <div class="mr-[10px]">编辑热点</div>
          <n-tag :bordered="false" type="info">
            {{hotspotInfo?.label}}
          </n-tag>
        </div>
      </template>
      <div>
        <component :is="hotspotInfo.componentName" :mark-id="markId"></component>
      </div>
      <template #footer>
        <n-button type="tertiary" @click="show = false">关 闭</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
</style>