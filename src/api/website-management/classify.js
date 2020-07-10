import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getClassify() {
    return request({
        url: `${requestPath.common}/diytype/tree`,
        method: 'get'
    })
}

export function getIdify(params) {
    return request({
        url: `${requestPath.common}/diytype/${params}`,
        method: 'get'
    })
}

export function deleteClassify(data) {
    return request({
        url: `${requestPath.common}/diytype/delete`,
        method: 'post',
        data
    })
}

export function updateClassify(data) {
    return request({
        url: `${requestPath.common}/diytype/update`,
        method: 'post',
        data
    })
}

export function addClassify(data) {
    return request({
        url: `${requestPath.common}/diytype/save`,
        method: 'post',
        data
    })
}

export function isExist(params) {
    return request({
        url: `${requestPath.common}/diytype/isExist/typeName`,
        method: 'get',
        params
    })
}

export function codeExist(params) {
    return request({
        url: `${requestPath.common}/diytype/isExist/oldCode/oldCode`,
        method: 'get',
        params
    })
}