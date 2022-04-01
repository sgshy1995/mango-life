import {Result} from "./service.d";
import {doRequestAction,NoTokenJsonHeader} from "./request";

// 注册
const registerUrl = '/user'
export const registerAction = (user: Record<string,any>): Promise<string> => {
  return doRequestAction({
    url: registerUrl,
    method: 'POST',
    header: NoTokenJsonHeader,
	data: user
  })
}

// 登录
const loginUrl = '/user/login'
export const loginAction = (user: Record<string,any>): Promise<string> => {
  return doRequestAction({
    url: loginUrl,
    method: 'POST',
    header: NoTokenJsonHeader,
	data: user
  })
}