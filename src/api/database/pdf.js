import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/pdf-library/page`,
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

export function getLabelAPI() {
    return request({
        url: `${requestPath.common}/diytype/list`,
        method: 'get'
    })
}

// 批量删除
export function batchDeleteAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/batch/delete`,
        method: 'post',
        data
    })
}

// 导入
export function importAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/import`,
        method: 'post',
        data
    })
}

// 查询
export function detailsAPI(id) { 
    return request({
        url: `${requestPath.resource}/pdf-library/get/${id}`,
        method: 'get'
    })
 }

//  编辑
export function editAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/update`,
        method: 'post',
        data
    })
}

// 保存
export function saveAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/save`,
        method: 'post',
        data
    })
}