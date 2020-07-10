import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.book}/express/page/settle`,
        method: 'get',
        params
    })
}

export function deleteAPI(data) {
    return request({
        url: `${requestPath.book}/express/delete/settle/?id=${data}`,
        method: 'post',
        data
    })
}

export function saveAPI(data) {
    return request({
        url: `${requestPath.book}/express/save/settle`,
        method: 'post',
        data
    })
}

export function getUpdataListAPI(params) {
    return request({
        url: `${requestPath.book}/express/settle/${params}`,
        method: 'get',
        params
    })
}

export function updataSaveAPI(data) {
    return request({
        url: `${requestPath.book}/express/update/settle`,
        method: 'post',
        data
    })
}