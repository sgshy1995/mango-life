export function toDecimal2(x:number): string {
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

export function dateFormate(date:any, formate:any)   
{  
  const dic:any = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  }
  if(/(y+)/.test(formate))   
    formate=formate.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length))
  for(const k in dic)   
    if(new RegExp("("+ k +")").test(formate))   
  formate = formate.replace(RegExp.$1, (RegExp.$1.length==1) ? (dic[k]) : (("00"+ dic[k]).substr((""+ dic[k]).length)))   
  return formate
}