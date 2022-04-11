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

// 个人记账
const personalChargeUrl = (id?:number | string)=>`/personal_charge${id ? ('/'+id) : ''}`
export const addPersonalChargeAction = (personalRecord: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: personalChargeUrl(),
	  method: 'POST',
	  data: personalRecord
	})
}

// 单个个人记账时间查询
export const getDatePersonalChargeAction = (findOptions: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: personalChargeUrl(),
	  method: 'GET',
	  data: findOptions
	})
}

// 个人记账删除
export const deletePersonalChargeAction = (id: number): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: personalChargeUrl(id),
	  method: 'DELETE'
	})
}

// 个人记账修改
export const changePersonalChargeAction = (id: number, personalRecord: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: personalChargeUrl(id),
	  method: 'PUT',
	  data: personalRecord
	})
}

// 团队记账
const teamChargeUrl = (id?:number | string)=>`/team_charge${id ? ('/'+id) : ''}`
export const addTeamChargeAction = (teamRecord: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: teamChargeUrl(),
	  method: 'POST',
	  data: teamRecord
	})
}

// 团队个人记账时间查询
export const getDateTeamChargeAction = (findOptions: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: teamChargeUrl(),
	  method: 'GET',
	  data: findOptions
	})
}

// 团队记账删除
export const deleteTeamChargeAction = (id: number): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: teamChargeUrl(id),
	  method: 'DELETE'
	})
}

// 团队记账修改
export const changeTeamChargeAction = (id: number, teamRecord: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: teamChargeUrl(id),
	  method: 'PUT',
	  data: teamRecord
	})
}