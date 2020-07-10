import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-note/page`,
        method: 'get',
        params
    })
}

export function getStorageStatusAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-note/list/status`,
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

export function storageTypeAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-note/list/type`,
        method: 'get',
        params
    })
}

export function storageCanuseTypeAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-note/list/add-type`,
        method: 'get',
        params
    })
}

export function getCodeAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-note/get/new-code`,
        method: 'get',
        params
    })
}

export function goodsListAPI(params) {
    return request({
        url: `${requestPath.book}/book/page/storage`,
        method: 'get',
        params
    })
}

export function submitAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/save-submit`,
        method: 'post',
        data
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/save`,
        method: 'post',
        data
    })
}

export function detailsListAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-note/${params}`,
        method: 'get',
        params
    })
}

export function cancelAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-note/update/${params}/cancel`,
        method: 'post',
        params
    })
}

export function submitOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/update/${data}/submit`,
        method: 'post',
        data
    })
}

export function deleteAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/delete/${data}`,
        method: 'post',
        data
    })
}

export function confirmOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/update/${data}/confirm`,
        method: 'post',
        data
    })
}

export function pushAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/update/${data}/push-baishi/`,
        method: 'post',
        data
    })
}

export function cancelPushAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/delete/${data}/push-baishi`,
        method: 'post',
        data
    })
}

export function batchSubmitAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/batch/submit`,
        method: 'post',
        data
    })
}

export function batchPushAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/batch/push-baishi `,
        method: 'post',
        data
    })
}

export function batchConfirmtAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/batch/confirm `,
        method: 'post',
        data
    })
}

export function updataList(params) {
    return request({
        url: `${requestPath.stock}/storage-note/${params}`,
        method: 'get',
        params
    })
}

export function updataSaveAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/update`,
        method: 'post',
        data
    })
}

export function updataSubmitAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/update-submit `,
        method: 'post',
        data
    })
}

export function batchImportAPI(data) {
    return request({
        url: `${requestPath.stock}/storage-note/import`,
        method: 'post',
        data
    })
}

export function getCountAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-note/count`,
        method: 'get',
        params
    })
}