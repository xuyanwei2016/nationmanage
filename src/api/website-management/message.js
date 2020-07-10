import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getMessage(params) {
    return request({
        url: `${requestPath.common}/message/page`,
        method: 'get',
        params: params
    })
}

export function deleteMessage(data) {
    return request({
        url: `${requestPath.common}/message/batch/delete`,
        method: 'post',
        data
    })
}

export function updateMessage(data) {
    return request({
        url: `${requestPath.common}/message/update`,
        method: 'post',
        data
    })
}

export function addMessage(data) {
    return request({
        url: `${requestPath.common}/message/save`,
        method: 'post',
        data
    })
}

export function massReview(data) {
    return request({
        url: `${requestPath.common}/message/batch/update/audit-status`,
        method: 'post',
        data
    })
}

export function massReply(data) {
    return request({
        url: `${requestPath.common}/message/batch/update/reply-status`,
        method: 'post',
        data
    })
}

//查询会员列表
export function getMemberAPI(params) {
    return request({
        url: `${requestPath.member}/pm/page/member`,
        method: 'get',
        params
    })
}