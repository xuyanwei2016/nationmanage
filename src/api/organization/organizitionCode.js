import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getMessAPI(data) { /* 获取表格数据 、查询*/
    return request({
        url: `${requestPath.member}/organ/{oid}`,
        method: 'get',
        params: data
    })
}

export function getListAPI(data) { /* 获取表格数据 、查询*/
    return request({
        url: `${requestPath.member}/organ/page`,
        method: 'get',
        params: data
    })
}

export function deleteAPI(data) { /* 单个删除接口 */
    return request({
        url: `${requestPath.member}/organ/delete/${data}`,
        method: 'post'
    })
}

export function addAPI(data) { /* 添加机构码接口 */
    return request({
        url: `${requestPath.member}/organ/save`,
        method: 'post',
        data
    })
}

export function updateAPI(data) { /* 接口 */
    return request({
        url: `${requestPath.member}/organ/update`,
        method: 'post',
        data
    })
}

export function searchCodeAPI(data) { /* 查询机构码是否存在 */
    return request({
        url: `${requestPath.member}/organ/isExist`,
        method: 'get',
        params: data
    })
}