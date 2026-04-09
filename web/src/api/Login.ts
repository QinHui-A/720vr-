import {API, type APIResponseType} from "../../utils/axios.ts";


export type LoginRequest = {
  account: string | null
  password: string | null
}
export type LoginResponse = APIResponseType<null>

export const Login = (request: LoginRequest):Promise<LoginResponse> => {
  return API.post<LoginResponse>('/api/auth/login', request)
}