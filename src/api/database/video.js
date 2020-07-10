import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/video-library/page`,
        method: 'get',
        params
    })
}

export function getNavAPI(params) {
    return request({
        url: `${requestPath.resource}/diytype/{name}/tree?name=`+params,
        method: 'get',
        params
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
        url: `${requestPath.resource}/diytype/tree`,
        method: 'get'
    })
}

// 批量删除
export function batchDeleteAPI(data) {
    return request({
        url: `${requestPath.resource}/video-library/batch/delete`,
        method: 'post',
        data
    })
}

// 查询
export function detailsAPI(id) {
    return request({
        url: `${requestPath.resource}/video-library/get/${id}`,
        method: 'get'
    })
}

// 保存
export function saveAPI(data) {
    return request({
        url: `${requestPath.resource}/video-library/save`,
        method: 'post',
        data
    })
}

// 编辑
export function editAPI(data) {
    return request({
        url: `${requestPath.resource}/video-library/update`,
        method: 'post',
        data
    })
}

// 导入
export function importAPI(data) { 
    return request({
        url: `${requestPath.resource}/video-library/import`,
        method: 'post',
        data
    })
 }

