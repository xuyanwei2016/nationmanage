import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.common}/comment/page`,
        method: 'get',
        params
    })
}

//单条删除
export function deleteAPI(data) {
    return request({
        url: `${requestPath.common}/comment/delete/${data}`,
        method: 'post',
        data
    })
}

// 批量删除
export function batchDeleteAPI(data) {
    return request({
        url: `${requestPath.common}/comment/batch/delete`,
        method: 'post',
        data
    })
}

// 批量审核
export function batchExamineAPI(data) {
    return request({
        url: `${requestPath.common}/comment/batch/update`,
        method: 'post',
        data
    })
}

export function detailsAPI(params) { //查看详情
    return request({
        url: `${requestPath.common}/comment/get/${params}`,
        method: 'get'
    })
}

// 设为精彩书评/公开/隐藏
export function setStatusAPI(data) {
    return request({
        url: `${requestPath.common}/comment/content/update`,
        method: 'post',
        data
    })
}

// 回复
export function replayAPI(data) {
    return request({
        url: `${requestPath.common}/comment/content/save`,
        method: 'post',
        data
    })
}

// 批量审核
export function replayCheck(data) {
    return request({
        url: `${requestPath.common}/comment/content/batch/update/status`,
        method: 'post',
        data
    })
}