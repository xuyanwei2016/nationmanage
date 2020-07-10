import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'


export function getListAPI(params) {
    return request({
        url: `${requestPath.ydcc}/video/page`,
        method: 'get',
        params
    })
}
export function getMemberListAPI(params) {
  return request({
      url: `${requestPath.member}/authenticate/get/list`,
      method: 'get',
      params
  })
}

export function batchExamineAPI(data) { // 批量审核
    return request({
        url: `${requestPath.ydcc}/video/batch/update/status`,
        method: 'post',
        data
    })
}


export function batchDeleteAPI(data) { //批量删除
    return request({
        url: `${requestPath.ydcc}/video/batch/delete`,
        method: 'post',
        data
    })
}




// export function deleteAPI(data) { //单条删除
//     return request({
//         url: `${requestPath.ydcc}/article-library/delete/${data}`,
//         method: 'post',
//         data
//     })
// }



export function detailsAPI(id) {
    return request({
        url: `${requestPath.ydcc}/video/get/${id}`,
        method: 'get'
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.ydcc}/video/save`,
        method: 'post',
        data
    })
}

export function editAPI(data) {
    return request({
        url: `${requestPath.ydcc}/video/update`,
        method: 'post',
        data
    })
}
