import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.stock}/stock/page`,
        method: 'get',
        params
    })
}

export function setLowNumAPI(data) {
    return request({
        url: `${requestPath.stock}/stock/update/${data.oid}/lower`,
        method: 'post',
        data: data.lower
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
        url: `${requestPath.book}/book/status`,
        method: 'get',
        params
    })
}

export function getCountAPI(params) {
    return request({
        url: `${requestPath.stock}/stock/count`,
        method: 'get',
        params
    })
}