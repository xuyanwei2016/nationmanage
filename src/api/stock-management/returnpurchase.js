import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/page`,
        method: 'get',
        params
    })
}

export function getStatusAPI(params) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/list/status`,
        method: 'get',
        params
    })
}

export function cancelAPI(data) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/update/${data}/cancel`,
        method: 'post',
        data
    })
}

export function reviewAPI(data) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/update/${data.oid}/review`,
        method: 'post',
        data: data.code
    })
}

export function settleAPI(data) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/update/${data.oid}/settle`,
        method: 'post',
        data
    })
}

export function submitOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/update/${data}/submit`,
        method: 'post',
        data
    })
}

export function testCodeAPI(params) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/isExist/code`,
        method: 'get',
        params
    })
}

export function getCodeAPI(params) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/get/newCode`,
        method: 'get',
        params
    })
}

export function goodsListAPI(params) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/page/return-book`,
        method: 'get',
        params
    })
}

export function getUpdataListAPI(params) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/${params}`,
        method: 'get',
        params
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/save`,
        method: 'post',
        data
    })
}

export function submitAPI(data) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/save-submit`,
        method: 'post',
        data
    })
}

export function updataSaveAPI(data) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/update`,
        method: 'post',
        data
    })
}

export function updataSubmitAPI(data) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/update-submit`,
        method: 'post',
        data
    })
}

export function importAPI(data) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/import`,
        method: 'post',
        data
    })
}

export function detailsListAPI(params) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/${params}`,
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
export function getCountAPI(params) {
    return request({
        url: `${requestPath.stock}/returnpurchase-note/count`,
        method: 'get',
        params
    })
}