import { requestPath } from '@/utils/global.js'
import request from '@/utils/request'

export function getListAPI(params) {
    return request({
        url: `${requestPath.common}/user/page`,
        method: 'get',
        params
    })
}

export function addAPI(data) {
    return request({
        url: `${requestPath.common}/user/save`,
        method: 'post',
        data
    })
}

export function batchUpdateAPI(data) {
    return request({
        url: `${requestPath.common}/user/batch/update/status`,
        method: 'post',
        data
    })
}

export function getRolesAPI() {
    return request({
        url: `${requestPath.common}/role/list`,
        method: 'get'
    })
}

export function getDepartmentsAPI() {
    return request({
        url: `${requestPath.common}/department/list`,
        method: 'get'
    })
}

export function isExistAPI(params) {
    return request({
        url: `${requestPath.common}/user/isExist/userName`,
        method: 'get',
        params
    })
}