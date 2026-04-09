import {API, type APIResponseType} from "../../utils/axios.ts";


export type UploadRequest = File
export type UploadResponse = APIResponseType<null>

export const Upload = (file: UploadRequest):Promise<UploadResponse> => {
  console.log(file, 'Upload')

  let form = new FormData();
  form.append('file', file);
  return API.post<UploadResponse>({
    method: 'POST',
    url: '/api/files/upload',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
 /* return API.post<UploadResponse>('/api/files/upload', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })*/
}