import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function educationAPI() {
    return request({
        url: `${requestPath.resource}/authorLibrary/education/list`,
        method: 'get',
    })
}

export function departmentAPI() {
    return request({
        url: `${requestPath.resource}/authorLibrary/department/list`,
        method: 'get',
    })
}

export function titleAPI() {
    return request({
        url: `${requestPath.resource}/authorLibrary/title/list`,
        method: 'get',
    })
}

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/authorLibrary/page`,
        method: 'get',
        params
    })
}

//批量上下架
export function editStatusAPI(data) {
    return request({
        url: `${requestPath.resource}/authorLibrary/batch/update/status`,
        method: 'post',
        data
    })
}

//批量删除
export function batchDeleteAPI(data) {
    return request({
        url: `${requestPath.resource}/authorLibrary/batch/delete`,
        method: 'post',
        data
    })
}

//详情
export function detailsAPI(params) {
    return request({
        url: `${requestPath.resource}/authorLibrary/${params}`,
        method: 'get',
    })
}

//保存
export function saveAPI(data) {
    return request({
        url: `${requestPath.resource}/authorLibrary/save`,
        method: 'post',
        data
    })
}

//修改
export function editAPI(data) {
    return request({
        url: `${requestPath.resource}/authorLibrary/update`,
        method: 'post',
        data
    })
}