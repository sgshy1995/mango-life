import {Result} from "./service.d";
import {doRequestAction,NoTokenJsonHeader,doUploadAction} from "./request";

// 注册
const captureUrl = '/auth/capture'
export const captureAction = (device_id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: captureUrl,
    method: 'GET',
    header: NoTokenJsonHeader,
	data: {device_id}
  })
}

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

// 单个个人记账自定义时间查询
const personalChargeCustomTimeUrl = '/personal_charge/time/find'
export const getDatePersonalChargeCustomTimeAction = (findOptions: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: personalChargeCustomTimeUrl,
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

// 团队个人记账自定义时间查询
const teamChargeCustomTimeUrl = '/team_charge/time/find'
export const getDateTeamChargeCustomTimeAction = (findOptions: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: teamChargeCustomTimeUrl,
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

// 个人分类
const personalChargeTypeUrl = (id?:number | string)=>`/personal_charge_type${id ? ('/'+id) : ''}`

// 个人分类查询
export const getPersonalChargeTypesAction = (findOptions: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: personalChargeTypeUrl(),
	  method: 'GET',
	  data: findOptions
	})
}

// 个人分类删除
export const deletePersonalChargeTypeAction = (id: number): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: personalChargeTypeUrl(id),
	  method: 'DELETE'
	})
}

// 个人分类更新
export const updatePersonalChargeTypeAction = (id: number, chargeType: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: personalChargeTypeUrl(id),
	  method: 'PUT',
	  data: chargeType
	})
}

// 个人分类新建
export const createPersonalChargeTypeAction = (chargeType: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: personalChargeTypeUrl(),
	  method: 'POST',
	  data: chargeType
	})
}

// 团队分类
const teamChargeTypeUrl = (id?:number | string)=>`/team_charge_type${id ? ('/'+id) : ''}`

// 团队分类查询
export const getTeamChargeTypesAction = (findOptions: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: teamChargeTypeUrl(),
	  method: 'GET',
	  data: findOptions
	})
}

// 团队分类删除
export const deleteTeamChargeTypeAction = (id: number): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: teamChargeTypeUrl(id),
	  method: 'DELETE'
	})
}

// 团队分类更新
export const updateTeamChargeTypeAction = (id: number, chargeType: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: teamChargeTypeUrl(id),
	  method: 'PUT',
	  data: chargeType
	})
}

// 团队分类新建
export const createTeamChargeTypeAction = (chargeType: Record<string,any>): Promise<Record<string,any>> => {
	return doRequestAction({
	  url: teamChargeTypeUrl(),
	  method: 'POST',
	  data: chargeType
	})
}