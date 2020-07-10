import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'


export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/topic-library/page`,
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

export function batchExamineAPI(data) { // 批量上线下线
    return request({
        url: `${requestPath.resource}/topic-library/batch/update/status`,
        method: 'post',
        data
    })
}


export function batchDeleteAPI(data) { //批量删除
    return request({
        url: `${requestPath.resource}/topic-library/batch/delete`,
        method: 'post',
        data
    })
}

export function detailsAPI(id) {
    return request({
        url: `${requestPath.resource}/topic-library/get/${id}`,
        method: 'get'
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.resource}/topic-library/save`,
        method: 'post',
        data
    })
}

export function editAPI(data) {
    return request({
        url: `${requestPath.resource}/topic-library/update`,
        method: 'post',
        data
    })
}


