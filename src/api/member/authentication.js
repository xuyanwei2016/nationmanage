import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'




export function getListAPI(data) { /* 获取列表数据 */
    return request({
      url: `${requestPath.member}/authenticate/page`,
      method: 'get',
      params: data
    })
}

export function batchExamineAPI(data) { /* 批量更新状态接口 */
    return request({
        url: `${requestPath.member}/authenticate/batch/update/status`,
        method: 'post',
        data
    })
}


export function batchDeleteAPI(data) { //批量删除
    return request({
        url: `${requestPath.member}/authenticate/batch/delete`,
        method: 'post',
        data
    })
}



export function getMemberListAPI(data) { /* 获取会员列表数据 */
    return request({
      url: `${requestPath.member}/authenticate/get/member`,
      method: 'get',
      params: data
    })
}


export function uploadSchoolAPI(data) { /* 上传图片 */
    return request({
        url: `${requestPath.file}upload`,
        method: 'post',
        data
    })
}

export function saveAPI(data) { /* 添加接口 */
    return request({
        url: `${requestPath.member}/authenticate/save`,
        method: 'post',
        data
    })
}
export function editAPI(data) { /* 添加接口 */
    return request({
        url: `${requestPath.member}/authenticate/update`,
        method: 'post',
        data
    })
}


export function detailsAPI(data) { /* 详情接口 */
  return request({
      url: `${requestPath.member}/authenticate/get/${data}`,
      method: 'get',
  })
}


// 数据字典
export function getDataAPI(data) { /* 详情接口 */
    return request({
        url: `${requestPath.common}/dictionary/page`,
        method: 'get',
        params:data
    })
  }
