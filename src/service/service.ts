import {Result} from "./service.d";
import {doRequestAction,NoTokenJsonHeader,doUploadAction} from "./request";

// 注册
const registerUrl = '/user'
export const registerAction = (user: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: registerUrl,
    method: 'POST',
    header: NoTokenJsonHeader,
	data: user
  })
}

// 登录
const loginUrl = '/user/login'
export const loginAction = (user: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: loginUrl,
    method: 'POST',
    header: NoTokenJsonHeader,
	data: user
  })
}

// 根据 username 获取用户信息
const getUserInfoByUsernameUrl = (username:string)=>`/user/${username}`
export const getUserInfoByUsernameAction = (user: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getUserInfoByUsernameUrl(user.username),
    method: 'GET'
  })
}

// 头像上传
const avatarUploadUrl = '/user/upload'
export const avatarUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: avatarUploadUrl
	},path)
}

// 退出登录
const logoutUrl = '/user/logout'
export const logoutAction = (user: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: logoutUrl,
    method: 'POST',
	data: user
  })
}

// 创建团队/家庭
const createTeamUrl = '/team'
export const createTeamAction = (team: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createTeamUrl,
    method: 'POST',
	data: team
  })
}

// 根据 id 获取团队/家庭信息
const getTeamInfoByIdUrl = (id:number)=>`/team/${id}`
export const getTeamInfoByIdAction = (team: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getTeamInfoByIdUrl(team.id),
    method: 'GET'
  })
}

// 添加团队/家庭成员
const addTeamMemberUrl = (id:number)=>`/team/${id}`
export const addTeamMemberAction = (id:number, user: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: addTeamMemberUrl(id),
    method: 'POST',
	data: user
  })
}