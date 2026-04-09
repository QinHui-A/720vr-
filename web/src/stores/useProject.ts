import {defineStore} from "pinia";
import {useStorage} from '@vueuse/core'
import type {ViewerType} from "./useDesign.ts";
import {
  AddProject, DeleteProject, EditProject, GetProjectById,
  GetProjectList,
  type ProjectItemResponse,
  type ProjectListResponse,
  type ProjectResponse
} from "../api/Project.ts";


export const useProjectStore = defineStore('project', {
  state: () => ({
    projectList: useStorage('project-list', []) as ProjectType[],
  }),
  actions: {
    async addProject(project: ProjectType) {
      return await AddProject({
        name: project.name,
        description: project.description,
        viewerJson: JSON.stringify(project.viewerList),
      }).then((res) => {
        console.log(res.data, '新增')
        this.projectList.unshift(handleProjectItem(res.data))
      })
    },
    getProjectById(id: number) {
      return this.projectList.find(item => item.id === Number(id))
    },
    async getProjectByIdAsync(id: number) {
      return await GetProjectById(id)
        .then((res) => {
          return {
            ...res,
            data: handleProjectItem(res.data)
          }
        })
    },
    async saveProject(id, project: ProjectType) {
      return await EditProject({
        id: project?.id,
        name: project?.name,
        description: project?.description,
        viewerJson: JSON.stringify(project?.viewerList),
        release: 0
      })
        .then((res) => {
          const currIndex = this.projectList.findIndex(item => item.id === id)
          if (currIndex > 0) this.projectList[currIndex] = project // TODO 用后端返回的

          return res
        })
      /* const currIndex = this.projectList.findIndex(item => item.id === id)
       if (currIndex > 0) this.projectList[currIndex] = project*/
    },
    async deleteProject(id: number) {
      return await DeleteProject(id)
        .then(() => {
          return this.getProjectList()
          // this.projectList = this.projectList.filter(item => item.id !== id)
        })
      //
    },
    async getProjectList(): Promise<ProjectListResponse> {
      console.log(12345)
      return await GetProjectList()
        .then(res => {
          console.log(res, 'getProjectList')
          this.projectList = res.data?.map((item) => {
            return handleProjectItem(item)
          })
          return this.projectList
        })
    }
  }
})


export interface ProjectType {
  id: number;
  name: string;
  description: string | null;
  createTime: number | null;
  viewerList: ViewerType[];
}

const handleProjectItem = (item: ProjectItemResponse): ProjectType => {
  console.log(item, 'item')
  return {
    id: item?.id,
    name: item?.name,
    description: item?.description,
    createTime: item?.createTime, // TODO 转化
    viewerList: item?.viewerJson ? JSON.parse(item?.viewerJson) : []
    // viewerList: []
  }
}