import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.book}/express/page`,
        method: 'get',
        params
    })
}

export function deleteAPI(data) {
    return request({
        url: `${requestPath.book}/express/delete/?id=${data}`,
        method: 'post',
        data
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.book}/express/save`,
        method: 'post',
        data
    })
}

export function getUpdataListAPI(params) {
    return request({
        url: `${requestPath.book}/express/${params}`,
        method: 'get',
        params
    })
}

export function updataSaveAPI(data) {
    return request({
        url: `${requestPath.book}/express/update`,
        method: 'post',
        data
    })
}