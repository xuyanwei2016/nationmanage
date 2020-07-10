import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/article-library/page`,
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

// 批量审核
export function batchExamineAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/batch/update/status`,
        method: 'post',
        data
    })
}

// 批量删除
export function batchDeleteAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/batch/delete`,
        method: 'post',
        data
    })
}

//单条删除
export function deleteAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/delete/${data}`,
        method: 'post',
        data
    })
}


//批量修改阅读权限
export function editReadTypeAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/batch/update/read`,
        method: 'post',
        data
    })
}

//批量修改价格
export function editPriceTypeAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/batch/update/price`,
        method: 'post',
        data
    })
}

//批量上下架
export function editStatusAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/batch/update/updown`,
        method: 'post',
        data
    })
}

export function getOptionAPI() {
    return request({
        url: `${requestPath.common}/diytype/list`,
        method: 'get'
    })
}

export function detailsAPI(params) { //查看详情
    return request({
        url: `${requestPath.resource}/article-library/get/${params}`,
        method: 'get'
    })
}

// 新增功能
export function saveAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/save`,
        method: 'post',
        data
    })
}

export function editAPI(data) { //修改
    return request({
        url: `${requestPath.resource}/article-library/update`,
        method: 'post',
        data
    })
}

export function commonUploadAPI(data) { //公共上传资源
    return request({
        url: `${requestPath.resource}/resource/save`,
        method: 'post',
        data
    })
}