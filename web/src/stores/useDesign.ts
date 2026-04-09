import {defineStore, storeToRefs} from "pinia";
import {type ProjectType, useProjectStore} from './useProject.ts'
import {uuid} from "../../utils";
import type {MarkerConfig} from "@photo-sphere-viewer/markers-plugin/index";

export const HOTSPOT_ICONS = {
  icon1: '/hotspot/new_spotd1.png',
  icon2: '/hotspot/new_spotd2.png',
  icon3: '/hotspot/new_spotd3.png',
  icon4: '/hotspot/new_spotd4.png',
  icon5: '/hotspot/new_spotd5.png',
  icon6: '/hotspot/new_spotd6.png',
  icon7: '/hotspot/new_spotd7.png',
  icon8: '/hotspot/new_spotd8.png',
  icon9: '/hotspot/new_spotd9.png',
  icon11: '/hotspot/new_spotd11.png',
  icon15: '/hotspot/new_spotd15.png',
  icon12: '/hotspot/new_spotd12.png',
  icon14: '/hotspot/new_spotd14.png',
  icon10: '/hotspot/new_spotd10.png',
}


export const useDesignStore = defineStore('design', {
  state: () => ({
    currProjectId: null,
    currViewerId: null,
    pointPosition: {
      latitude: 0,
      longitude: 0,
    },
  }),
  getters: {
    currProjectInfo: (state): ProjectType | null => {
      const projectStore = useProjectStore()
      return projectStore.getProjectById(state.currProjectId)
    },
    currViewerInfo: (state): ViewerType | null => {
      console.log(state.currProjectInfo, state.currViewerId, '???')
      return state.currProjectInfo?.viewerList?.find(item => item.id === state.currViewerId)
    },
    getMarkById: (state) => {
      return (id: string): MarkPropertiesType<MarkerDataType> => {
        return state.currViewerInfo?.marks?.find(mark => mark.id === id)
      }
    }
  },
  actions: {
    setProjectId(id: string) {
      this.currProjectId = id
    },
    setCurrViewerId(id: string) {
      this.currViewerId = id
    },
    getCurrProjectInfo(): ProjectType | null {
      const projectStore = useProjectStore()
      return projectStore.getProjectById(this.currProjectId)
    },
    async buildViewer(config: { name: string, id?: string, sceneImg: string }): ViewerType {
      if (!this.currProjectId) {
        window['$message'].warning('请选择编辑项目1')
        return
      }
      console.log(this.currProjectId, 'this.currProjectId')
      const id = uuid();
      const viewer: ViewerType = {
        name: config.name ?? id,
        id: config.id ?? uuid(),
        sceneImg: config.sceneImg,
        visionPosition: {
          latitude: 0,
          longitude: 0
        },
        marks: []
      }
      const projectStore = useProjectStore()
      const currProject = projectStore.getProjectById(Number(this.currProjectId))
      if (!currProject) {
        window['$message'].warning('请选择编辑项目2')
        return
      }
      await projectStore.saveProject(this.currProjectId, currProject.viewerList.push(viewer))
      return viewer
    },
    async removeViewer(viewer: ViewerType) {
      const projectStore = useProjectStore()
      const viewerList = this.currProjectInfo.viewerList.filter(item => item.id !== viewer.id)
      await projectStore.saveProject(this.currProjectId, {
        viewerList: viewerList
      })
        .then(() => {
          this.currProjectInfo.viewerList = this.currProjectInfo.viewerList.filter(item => item.id !== viewer.id)
        })
    },
    addMark(type: MarkClassType): MarkPropertiesType<MarkerDataType> {
      const id = uuid()
      const name = getHotspotInfo(type).label
      let mark: MarkPropertiesType<MarkerDataType> = {
        id: id,
        name: name,
        tooltip: null,
        classification: type,
        position: {
          yaw: 0, pitch: -0.3
        },
        visible: true,
        size: {
          width: 70,
          height: 70
        },
        className: ''
      }
      console.log(this.currViewerInfo, 'this.currViewer')

      switch (type) {
        case MarkClassType.SCENE:
          mark.tooltip = name;
          mark.image = HOTSPOT_ICONS.icon1;
          mark.data = {
            nextSceneId: null
          } as SceneMarkerDataType
          break;
        case MarkClassType.TIP:
          mark.image = HOTSPOT_ICONS.icon7;
          mark.tooltip = name;
          mark.data = {
            info: '',
            description: ''
          } as TipMarkerDataType
          break;
        case MarkClassType.RICH:
          mark.image = HOTSPOT_ICONS.icon14;
          mark.data = {
            title: '',
            html: ''
          } as RichMarkerDataType
          break;
        case MarkClassType.IMG:
          mark.image = HOTSPOT_ICONS.icon11;
          mark.size.width = 50;
          mark.size.height = 50;
          mark.tooltip = null;
          mark.data = {
            image: null,
            title: null,
            description: null,
          } as ImgMarkerDataType
          break;
        case MarkClassType.VID:
          mark.image = HOTSPOT_ICONS.icon15;
          mark.data = {
            list: []
          } as VidMarkerDataType
          break;
        case MarkClassType.WEB:
          mark.image = HOTSPOT_ICONS.icon12;
          mark.data = {
            url: '',
            width: '100%',
            height: '100%',
            openNew: true,
          } as WebMarkerDataType
          break;
      }
      if (this.currViewerInfo) this.currViewerInfo.marks.push(mark)

      return mark
    },
    updateMark(id: string, mark: any) {

    },
    removeMark(id: string) {
      console.log(this.currViewerInfo?.marks)
      this.currViewerInfo?.marks.splice(this.currViewerInfo?.marks.indexOf(id), 1)
      // this.currViewerInfo?.marks = this.currViewerInfo?.marks.filter(item => item.id !== id)
    }
  }
})

type SceneMarkerDataType = {
  nextSceneId: string | null,
}
type TipMarkerDataType = {
  info?: string | number | null,
  description?: string | null,
}
type RichMarkerDataType = {
  title: string | null,
  html: string | null
}
export type ImgMarkerDataType = {
  title: string | null,
  image: string | null,
  description: string | null,
}
type VidMarkerDataType = {
  list?: { name: string, url: string }[]
}
type WebMarkerDataType = {
  url?: string;
  width: string | number;
  height: string | number;
  openNew: false;
}
type MarkerDataType =
  SceneMarkerDataType
  | TipMarkerDataType
  | RichMarkerDataType
  | ImgMarkerDataType
  | VidMarkerDataType
  | WebMarkerDataType

export interface ViewerType {
  name: string;
  id: number;
  sceneImg: string;
  visionPosition: { latitude: number, longitude: number },
  marks: MarkPropertiesType<MarkerDataType>[]
}

export type MarkPropertiesType<T> = Partial<MarkerConfig> & {
  id: string,
  name: string,
  classification: MarkClassType,
  data?: T
}

export enum MarkClassType {
  SCENE = 'scene', // 切换场景
  TIP = 'tip', // 文字提示
  RICH = 'rich', // 富文本
  IMG = 'img', // 图片
  VID = 'video', // 视频
  WEB = 'web', // 网页
}

export const HOTSPOT_OPTION = [
  {label: '场景切换', value: MarkClassType.SCENE, componentName: 'hotspot-scene'},
  {label: '文字提示', value: MarkClassType.TIP, componentName: 'hotspot-tip'},
  // {label: '富文本', value: MarkClassType.RICH, componentName: 'hotspot-rich'},
  {label: '图片', value: MarkClassType.IMG, componentName: 'hotspot-image'},
  // {label: '视频', value: MarkClassType.VID, componentName: 'hotspot-video'},
  {label: '超链接', value: MarkClassType.WEB, componentName: 'hotspot-web'},
]

export const getHotspotInfo = (type: MarkClassType) => {
  return HOTSPOT_OPTION.find(o => o.value === type)
}