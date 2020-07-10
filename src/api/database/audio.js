import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/audio-library/page`,
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

export function batchDeleteAPI(data) { // 批量删除
    return request({
        url: `${requestPath.resource}/audio-library/batch/delete`,
        method: 'post',
        data
    })
}

export function saveAPI(data) { // 保存
    return request({
        url: `${requestPath.resource}/audio-library/save`,
        method: 'post',
        data
    })
}

export function editAPI(data) { // 编辑
    return request({
        url: `${requestPath.resource}/audio-library/update`,
        method: 'post',
        data
    })
}

export function detailsAPI(id) { // 查询
    return request({
        url: `${requestPath.resource}/audio-library/get/${id}`,
        method: 'get'
    })
}

export function importAPI(data) { // 导入
    return request({
        url: `${requestPath.resource}/audio-library/import`,
        method: 'post',
        data
    })
}
