import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) { //列表
    return request({
        url: `${requestPath.resource}/video-library/page`,
        method: 'get',
        params
    })
}

export function batchDeleteAPI(data) { //批量删除
    return request({
        url: `${requestPath.resource}/video-library/batch/delete`,
        method: 'post',
        data
    })
}

export function upDownAPI(data) { //上架
    return request({
        url: `${requestPath.resource}/video-library/batch/update/updown`,
        method: 'post',
        data
    })
}

export function saveAPI(data) { //新增
    return request({
        url: `${requestPath.resource}/video-library/save`,
        method: 'post',
        data
    })
}

export function editAPI(data) { //编辑
    return request({
        url: `${requestPath.resource}/video-library/update`,
        method: 'post',
        data
    })
}

export function detailsAPI(params) { //列表
    return request({
        url: `${requestPath.resource}/video-library/get/${params}`,
        method: 'get',
    })
}