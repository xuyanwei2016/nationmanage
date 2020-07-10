import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) { //获取标签列表
    return request({
        url: `${requestPath.resource}/label/page`,
        method: 'get',
        params
    })
}

export function deleteAPI(data) { //删除标签
    return request({
        url: `${requestPath.resource}/label/delete/${data}`,
        method: 'post',
        data
    })
}

export function saveAPI(data) { //新增标签
    return request({
        url: `${requestPath.resource}/label/save`,
        method: 'post',
        data
    })
}

export function getEditList(params) { //根据ID查询
    return request({
        url: `${requestPath.resource}/label/get/${params}`,
        method: 'get',
    })
}

export function updateAPI(data) { //更新标签
    return request({
        url: `${requestPath.resource}/label/update`,
        method: 'post',
        data
    })
}

export function resourceList(params) { //查询标签内容
    return request({
        url: `${requestPath.resource}/label/content/${params}`,
        method: 'get',
    })
}

export function createContentAPI(data) { //新增标签内容
    return request({
        url: `${requestPath.resource}/label/content/save`,
        method: 'post',
        data
    })
}

export function updateContentAPI(data) { //修改标签内容
    return request({
        url: `${requestPath.resource}/label/content/update`,
        method: 'post',
        data
    })
}

export function batchDelAPI(data) { //批量删除标签内容
    return request({
        url: `${requestPath.resource}/label/content/delete`,
        method: 'post',
        data
    })
}