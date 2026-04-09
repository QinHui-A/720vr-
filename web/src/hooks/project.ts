import {ref} from 'vue'
import { useStorage } from '@vueuse/core'

export function useProject() {
  let projectList = useStorage('project-list', []);
  console.log(projectList.value, 'projectList')
  const addProject = (project: ProjectType) => {
    projectList.value.push(project)
    console.log(projectList.value, 'projectList')
  }

  return {
    addProject,
  }
}

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  createTime: number;
}