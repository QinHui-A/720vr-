import {API, type APIResponseType} from "../../utils/axios.ts";


export type ProjectRequest = {
  id?: number
  name?: string
  description?: string
  viewerJson?: string
}
export type ProjectItemResponse = {
  id: number
  name: string
  description: string
  viewerJson: string
  createTime: number
  release: number
}
export type ProjectResponse = APIResponseType<ProjectItemResponse>
export type ProjectListResponse = APIResponseType<ProjectItemResponse[]>

export const AddProject = (request: ProjectRequest):Promise<ProjectResponse> => {
  return API.post<ProjectResponse>('/api/project', request)
}

export const DeleteProject = (id: number):Promise<null> => {
  return API.delete<ProjectResponse>(`/api/project/${id}`)
}

export const EditProject = (request: ProjectRequest):Promise<ProjectResponse> => {
  return API.put<ProjectResponse>(`/api/project`, request)
}

export const GetProjectList = ():Promise<ProjectListResponse> => {
  return API.get<ProjectResponse>(`/api/project`)
}

export const GetProjectById = (id: number):Promise<ProjectResponse> => {
  return API.get<ProjectResponse>(`/api/project/${id}`)
}

export const DownloadJSON = (id: number):Promise<null> => {
  return API.get<APIResponseType<null>>(`/api/project/download/${id}`)

}