interface RequestBase {
  url: string,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS',
  data?: any,
  header?: RequestHeader,
  success?: (res: any) => void,
  fail?: (err: any) => void,
  complete?: () => void,
}

interface RequestHeader {
  'content-type'?: 'application/json' | string
  'Authorization'?: string
}

const DOMAIN_URL: string = process.env.VUE_APP_API_BASE_URL;

const getToken = (): string => {
  const token = 'Bearer ' + uni.getStorageSync('SYS_AUTH_TOKEN_KEY');
  return token
}

const NormalRequestData: RequestBase = {
  url: DOMAIN_URL,
  method: 'GET',
  data: {}
}

export const NoTokenJsonHeader: RequestHeader = {
  'content-type': 'application/json',
}

export const doRequestAction = (requestBase: RequestBase): Promise<any> => {
	let req: RequestBase = {...NormalRequestData, ...requestBase, url:DOMAIN_URL + requestBase.url}
	if (!req.header) {
	    req.header = {
	      'content-type': 'application/json',
	      'Authorization': getToken()
	    }
	}
	
	return new Promise(((resolve, reject) => {
	    
	    req.success = (res) => { 
			console.log(res.statusCode)
	      if (res && res.data && res.data.code && res.statusCode >= 200 && res.statusCode < 300) { //服务器请求的，就处理
				uni.showToast({title: res.data.message || '请求成功',icon:'none'})
			   resolve(res.data)
	      }else{
			uni.showToast({title: res.data.message || '请求失败',icon:'none'})
	        reject(res.message)
	      }
	    }
	
	    req.fail = (err) => {
	      uni.showToast({title: (err.data && err.data.message) || '请求失败',icon:'none'})
	      reject(err)
	    }
	
	    uni.request(req);
	  }))
}