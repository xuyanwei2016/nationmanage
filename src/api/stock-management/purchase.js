import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.stock}/purchase-note/page`,
        method: 'get',
        params
    })
}

export function statusAPI(params) {
    return request({
        url: `${requestPath.stock}/purchase-note/list/status`,
        method: 'get',
        params
    })
}

export function supportListAPI(params) {
    return request({
        url: `${requestPath.stock}/supplier/page`,
        method: 'get',
        params
    })
}

export function goodsListAPI(params) {
    return request({
        url: `${requestPath.book}/book/page`,
        method: 'get',
        params
    })
}

export function testCodeAPI(params) {
    return request({
        url: `${requestPath.stock}/purchase-note/isExist/code`,
        method: 'get',
        params
    })
}

export function discountAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-book/batch/get/discount`,
        method: 'post',
        data
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/save`,
        method: 'post',
        data
    })
}

export function submitAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/save-submit`,
        method: 'post',
        data
    })
}

export function updataSaveAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/update`,
        method: 'post',
        data
    })
}

export function updataSubmitAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/update-submit`,
        method: 'post',
        data
    })
}

export function getUpdataListAPI(params) {
    return request({
        url: `${requestPath.stock}/purchase-note/${params}`,
        method: 'get',
        params
    })
}

export function cancelAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/update/${data}/cancel`,
        method: 'post',
        data
    })
}

export function submitOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/update/${data}/submit`,
        method: 'post',
        data
    })
}

export function reviewAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/update/${data.oid}/review`,
        method: 'post',
        data: data.code
    })
}

export function settleAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/update/${data.oid}/settle`,
        method: 'post',
        data
    })
}

export function wareListAPI(params) {
    return request({
        url: `${requestPath.stock}/ware/list/names`,
        method: 'get',
        params
    })
}

export function warePlaceListAPI(params) {
    return request({
        url: `${requestPath.stock}/ware/${params}/storage-bin/list/names`,
        method: 'get',
        params
    })
}

export function confirmStorageAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/update/${data.oid}/storage`,
        method: 'post',
        data
    })
}

export function batchImportAPI(data) {
    return request({
        url: `${requestPath.stock}/purchase-note/import`,
        method: 'post',
        data
    })
}

export function getNavAPI() {
    return request({
        url: `${requestPath.resource}/diytype/tree`,
        method: 'get'
    })
}

export function getOptionAPI() {
    return request({
        url: `${requestPath.resource}/diytype/list`,
        method: 'get'
    })
}


export function getCountAPI(params) {
    return request({
        url: `${requestPath.stock}/purchase-note/count`,
        method: 'get',
        params
    })
}

