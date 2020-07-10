import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-book/page`,
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

export function getStorageStatusAPI(params) {
    return request({
        url: `${requestPath.stock}/storage-note/list/status`,
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
        url: `${requestPath.stock}/storage-book/count`,
        method: 'get',
        params
    })
}