import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/promotion/page`,
        method: 'get',
        params
    })
}

export function batchDeleteAPI(data) { //批量删除
    return request({
        url: `${requestPath.resource}/promotion/batch/delete`,
        method: 'post',
        data
    })
}

//删除
export function deleteAPI(data) {
    return request({
        url: `${requestPath.resource}/promotion/delete/${data}`,
        method: 'post',
        data
    })
}

export function changeStatusAPI(data) { //批量上下线
    return request({
        url: `${requestPath.resource}/promotion/batch/update/status`,
        method: 'post',
        data
    })
}

export function detailsAPI(params) { //详情
    return request({
        url: `${requestPath.resource}/promotion/get/${params}`,
        method: 'get',
        params
    })
}

export function saveAPI(data) { //添加
    return request({
        url: `${requestPath.resource}/promotion/save`,
        method: 'post',
        data
    })
}

export function editAPI(data) { //修改
    return request({
        url: `${requestPath.resource}/promotion/update`,
        method: 'post',
        data
    })
}

export function getConListAPI(params) { //内容列表
    return request({
        url: `${requestPath.resource}/promotion/content/page`,
        method: 'get',
        params
    })
}

//推荐剩余内容
export function ConRestListAPI(params) {
    return request({
        url: `${requestPath.resource}/resource/promotion/page`,
        method: 'get',
        params
    })
}

export function saveConAPI(data) { //内容添加
    return request({
        url: `${requestPath.resource}/promotion/content/save`,
        method: 'post',
        data
    })
}

export function deleteConAPI(data) { //内容删除
    return request({
        url: `${requestPath.resource}/promotion/content/batch/delete`,
        method: 'post',
        data
    })
}