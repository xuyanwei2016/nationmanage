import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/recommend/page`,
        method: 'get',
        params: params
    })
}

//删除
export function deleteAPI(data) {
    return request({
        url: `${requestPath.resource}/recommend/delete`,
        method: 'post',
        data
    })
}

// 编辑
export function editAPI(data) {
    return request({
        url: `${requestPath.resource}/recommend/update`,
        method: 'post',
        data
    })
}

// 新增
export function saveAPI(data) {
    return request({
        url: `${requestPath.resource}/recommend/save`,
        method: 'post',
        data
    })
}

// 详情
export function detailsAPI(id) {
    return request({
        url: `${requestPath.resource}/recommend/${id}`,
        method: 'get',
    })
}

// 验重
export function isExistAPI(params) {
    return request({
        url: `${requestPath.resource}/recommend/isExist`,
        method: 'get',
        params
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
