import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery_book/page`,
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

export function getDeliveryStatusAPI(params) {
    return request({
        url: `${requestPath.stock}/delivery-order/list/status`,
        method: 'get',
        params
    })
}

export function getpublisherAPI(params) {
    return request({
        url: `${requestPath.book}/publisher/publisher`,
        method: 'get',
        params
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
        url: `${requestPath.stock}/delivery_book/count`,
        method: 'get',
        params
    })
}