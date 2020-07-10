import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/page`,
        method: 'get',
        params
    })
}

export function getDeliveryStatusAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/list/status`,
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

export function deliveryTypeAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/list/type`,
        method: 'get',
        params
    })
}

export function deliveryCanuseTypeAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/list/add-type`,
        method: 'get',
        params
    })
}

export function goodsListAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/page/stock`,
        method: 'get',
        params
    })
}

export function submitAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/save-submit`,
        method: 'post',
        data
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/save`,
        method: 'post',
        data
    })
}

export function detailsListAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/${params}`,
        method: 'get',
        params
    })
}

export function cancelOrderAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/update/${params}/cancel`,
        method: 'post',
        params
    })
}

export function cancelPushOrderAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/delete/${params}/push-baishi`,
        method: 'post',
        params
    })
}

export function submitOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/update/${data}/submit`,
        method: 'post',
        data
    })
}

export function deleteOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/delete/${data}`,
        method: 'post',
        data
    })
}

export function confirmOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/update/${data}/confirm`,
        method: 'post',
        data
    })
}

export function pushOrderAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/update/${data}/push-baishi/`,
        method: 'post',
        data
    })
}

export function batchSubmitAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/batch/submit`,
        method: 'post',
        data
    })
}

export function batchPushAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/batch/push-baishi`,
        method: 'post',
        data
    })
}

export function batchConfirmtAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/batch/confirm`,
        method: 'post',
        data
    })
}

export function updataList(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/${params}`,
        method: 'get',
        params
    })
}

export function updataSaveAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/update`,
        method: 'post',
        data
    })
}

export function updataSubmitAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/update-submit`,
        method: 'post',
        data
    })
}

export function batchImportAPI(data) {
    return request({
        url: `${requestPath.stock}/delivery-order/import`,
        method: 'post',
        data
    })
}

export function getCountAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/count`,
        method: 'get',
        params
    })
}
