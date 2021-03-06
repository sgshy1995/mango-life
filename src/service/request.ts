// @ts-ignore
import store from '@/store/index'

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
			if (res && (res.statusCode === 401 || res.statusCode === 403)) { //服务器请求的，就处理
				uni.showToast({title: res.data.message || '请重新登录',icon:'none'})
				// @ts-ignore
				store.dispatch('setAuthStatus', false)
				reject(res.message)
			}else if (res && res.data && res.statusCode >= 200 && res.statusCode < 300) { //服务器请求的，就处理
			   resolve(res.data)
	      }else{
			uni.showToast({title: res.data.message || '请求失败',icon:'none'})
	        reject(res.message)
	      }
	    }
	
	    req.fail = (err) => {
			if (err && (err.statusCode === 401 || err.statusCode === 403)) {
				// @ts-ignore
				store.dispatch('setAuthStatus', false)
			}
	      uni.showToast({title: (err.data && err.data.message) || '请求失败',icon:'none'})
	      reject(err)
	    }
	
	    uni.request(req);
	  }))
}

export const doUploadAction = (requestBase: RequestBase, path: string): Promise<any> => {
	let req: RequestBase = {...NormalRequestData, ...requestBase, url:DOMAIN_URL + requestBase.url, method: 'POST'}
	req.header = {
	  'Authorization': getToken()
	}
	
	return new Promise((resolve,reject) => {
		uni.uploadFile({
		          url: req.url,
		          filePath: path,
		          name: "file",
		          header: {
		            'Accept': "application/json",
		            'Authorization': getToken(),
		          },
		          success: (uploadFileRes) => {
		            console.log('uploadFileRes', uploadFileRes);
					resolve(uploadFileRes)
		          },
		          fail: (err) => {
		            console.log('err', err);
					reject(err)
		          },
		        });
	})
	
}