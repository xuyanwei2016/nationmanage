import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function addKeyword(data) {
    return request({
        url: requestPath.common + '/hotsw/save',
        method: 'post',
        data
    })
}

export function editKeywordAPI(data) {
    return request({
        url: requestPath.common + '/hotsw/update',
        method: 'post',
        data
    })
}

export function getKeywords(params) {
    return request({
        url: requestPath.common + '/hotsw/page',
        method: 'get',
        params: params
    })
}

export function batchingAuditAPI(data) {
    return request({
        url: requestPath.common + '/hotsw/batch/auditStatus',
        method: 'post',
        data
    })
}

export function batchingDeleteAPI(data) {
    return request({
        url: requestPath.common + '/hotsw/delete',
        method: 'post',
        data
    })
}

export function batchingListing(data) {
    return request({
        url: requestPath.common + '/hotsw/batch/showState',
        method: 'post',
        data
    })
}

export function searchAPI(params) {
    return request({
        url: requestPath.common + '/hotsw/getListPageEntity',
        method: 'get',
        params: params
    })
}

export function isExistAPI(params) {
    return request({
        url: requestPath.common + '/hotsw/isExist',
        method: 'get',
        params: params
    })
}
