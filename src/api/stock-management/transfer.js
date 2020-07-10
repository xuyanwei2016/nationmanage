import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.stock}/allotion-note/page`,
        method: 'get',
        params
    })
}

export function batchSubmitAPI(data) {
    return request({
        url: `${requestPath.stock}/allotion-note/batch/submit`,
        method: 'post',
        data
    })
}

export function batchConfirmAPI(data) {
    return request({
        url: `${requestPath.stock}/allotion-note/batch/confirm`,
        method: 'post',
        data
    })
}

export function getNewCodeAPI(params) {
    return request({
        url: `${requestPath.stock}/allotion-note/get/new-code`,
        method: 'get',
        params
    })
}

export function saveTransferAPI(data) {
    return request({
        url: `${requestPath.stock}/allotion-note/save`,
        method: 'post',
        data
    })
}

export function submitTransferAPI(data) {
    return request({
        url: `${requestPath.stock}/allotion-note/save-submit`,
        method: 'post',
        data
    })
}

export function cancelOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/allotion-note/update/${data}/cancel`,
        method: 'post',
        data
    })
}

export function confirmOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/allotion-note/update/${data}/confirm`,
        method: 'post',
        data
    })
}

export function submitOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/allotion-note/update/${data}/submit`,
        method: 'post',
        data
    })
}

export function goodsListAPI(params) {
    return request({
        url: `${requestPath.stock}/stock/page`,
        method: 'get',
        params
    })
}

export function getCodeAPI(params) {
    return request({
        url: `${requestPath.stock}/allotion-note/get/new-code`,
        method: 'get',
        params
    })
}

export function getWareAPI(params) {
    return request({
        url: `${requestPath.stock}/ware/list/names`,
        method: 'get',
        params
    })
}


export function getWarePlace(params) {
    return request({
        url: `${requestPath.stock}/ware/${params}/storage-bin/list/names`,
        method: 'get',
        params
    })
}

export function getStatusAPI(params) {
    return request({
        url: `${requestPath.stock}/allotion-note/status`,
        method: 'get',
        params
    })
}

export function detailsListAPI(params) {
    return request({
        url: `${requestPath.stock}/allotion-note/${params}`,
        method: 'get',
        params
    })
}

export function getUpdataList(params) {
    return request({
        url: `${requestPath.stock}/allotion-note/${params}`,
        method: 'get',
        params
    })
}

export function updataSubmitAPI(data) {
    return request({
        url: `${requestPath.stock}/allotion-note/update-submit`,
        method: 'post',
        data
    })
}

export function updataSaveAPI(data) {
    return request({
        url: `${requestPath.stock}/allotion-note/update`,
        method: 'post',
        data
    })
}
export function getCountAPI(params) {
    return request({
        url: `${requestPath.stock}/allotion-note/count`,
        method: 'get',
        params
    })
}