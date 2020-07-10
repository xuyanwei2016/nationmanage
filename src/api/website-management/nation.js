import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 获取列表
export function getListAPI(params) {
    return request({
        url: `${requestPath.common}/national-home-page/page`,
        method: 'get',
        params
    })
}

// 保存
export function saveAPI(data) {
    return request({
        url: `${requestPath.common}/national-home-page/save`,
        method: 'post',
        data
    })
}

export function saveNationAPI(data) {
    return request({
        url: `${requestPath.resource}/recommend/save`,
        method: 'post',
        data
    })
}



// 批量上下线
export function editStatusAPI(data) {
    return request({
        url: `${requestPath.common}/national-home-page/batch/update/status`,
        method: 'post',
        data
    })
}

// 单条删除
export function deleteAPI(data) {
    return request({
        url: `${requestPath.common}/national-home-page/delete/${data}`,
        method: 'post',
        data
    })
}

export function deleteNationAPI(data) {
    return request({
        url: `${requestPath.resource}/recommend/delete`,
        method: 'post',
        data
    })
}

// 详情
export function detailsAPI(id) {
    return request({
        url: `${requestPath.common}/national-home-page/${id}`,
        method: 'get'
    })
}

// 修改
export function editAPI(data) {
    return request({
        url: `${requestPath.common}/national-home-page/update`,
        method: 'post',
        data
    })
}

// 获取民族列表
export function nationsListAPI(params) {
    return request({
        url: `${requestPath.common}/national-home-page/Type/list`,
        method: 'get',
        params
    })
}

// 民族验重
export function isExistAPI(data) {
    return request({
        url: `${requestPath.common}/national-home-page/isExist?nationsType=${data.nationsType}`,
        method: 'get',
        data
    })
}




