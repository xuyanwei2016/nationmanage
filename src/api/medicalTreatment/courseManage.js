import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'


export function getListAPI(params) {
    return request({
        url: `${requestPath.ydcc}/course/page`,
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
        url: `${requestPath.ydcc}/course/batch/update/status`,
        method: 'post',
        data
    })
}


export function batchDeleteAPI(data) { //批量删除
    return request({
        url: `${requestPath.ydcc}/course/batch/delete`,
        method: 'post',
        data
    })
}

export function detailsAPI(id) {
    return request({
        url: `${requestPath.ydcc}/course/get/${id}`,
        method: 'get'
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.ydcc}/course/save`,
        method: 'post',
        data
    })
}

export function editAPI(data) {
    return request({
        url: `${requestPath.ydcc}/course/update`,
        method: 'post',
        data
    })
}


/* 关联 */
export function getRelationListAPI(params) {  // 关联列表
    return request({
        url: `${requestPath.ydcc}/course/list/binding`,
        method: 'get',
        params
    })
}

export function getNotRelationListAPI(params) {   // 关联内容列表
    return request({
        url: `${requestPath.ydcc}/course/page/binding`,
        method: 'get',
        params
    })
}
export function relationAPI(data) {   // 关联
    return request({
        url: `${requestPath.ydcc}/course/add/binding`,
        method: 'post',
        data
    })
}
export function editNumAPI(data) {  //修改排序
    return request({
        url: `${requestPath.ydcc}/course/modify/sort`,
        method: 'post',
        data
    })
}

export function canceleRelationAPI(data) {  //取消关联
    return request({
        url: `${requestPath.ydcc}/course/cancel/binding`,
        method: 'post',
        data
    })
}
