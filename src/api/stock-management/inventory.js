import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.stock}/inventory/page`, //inventory/page
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
        url: `${requestPath.stock}/inventory/list/status`,
        method: 'get',
        params
    })
}

export function deleteOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/inventory/delete/${data}`,
        method: 'post',
        data
    })
}

export function editNormalAPI(data) {
    return request({
        url: `${requestPath.stock}/inventory/update/normal`,
        method: 'post',
        data
    })
}

export function detailsListAPI(params) {
    return request({
        url: `${requestPath.stock}/inventory/get/${params}`,
        method: 'get',
        params
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.stock}/inventory/save`,
        method: 'post',
        data
    })
}

export function margeAPI(data) {
    return request({
        url: `${requestPath.stock}/inventory/marge`,
        method: 'post',
        data
    })
}

export function updateSaveAPI(data) {
    return request({
        url: `${requestPath.stock}/inventory/update/save`,
        method: 'post',
        data
    })
}

export function submitAPI(data) {
    return request({
        url: `${requestPath.stock}/inventory/update-submit`,
        method: 'post',
        data
    })
}

export function deliveryAPI(data) {
    return request({
        url: `${requestPath.stock}/inventory/create/${data}/delivery`,
        method: 'post',
        data
    })
}

export function storageAPI(data) {
    return request({
        url: `${requestPath.stock}/inventory/create/${data}/storage`,
        method: 'post',
        data
    })
}

export function batchImportAPI(data) {
    return request({
        url: `${requestPath.stock}/inventory/import`,
        method: 'post',
        data
    })
}