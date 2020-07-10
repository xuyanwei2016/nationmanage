import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/recommend/page`,
        method: 'get',
        params
    })
}

export function deleteAPI(data) { //删除
    return request({
        url: `${requestPath.resource}/recommend/delete`,
        method: 'post',
        data
    })
}

export function saveAPI(data) { //保存
    return request({
        url: `${requestPath.resource}/recommend/save`,
        method: 'post',
        data
    })
}

export function updateAPI(data) { //修改
    return request({
        url: `${requestPath.resource}/recommend/update`,
        method: 'post',
        data
    })
}

export function detailsAPI(params) { //详情
    return request({
        url: `${requestPath.resource}/recommend/${params}`,
        method: 'get',
    })
}

//推荐内容

export function getConListAPI(params) { //内容
    return request({
        url: `${requestPath.resource}/recommend/res/page`,
        method: 'get',
        params
    })
}

//推荐剩余内容
export function ConRestListAPI(params) {
    return request({
        url: `${requestPath.resource}/resource/recommend/page`,
        method: 'get',
        params
    })
}


export function batchDeleteAPI(data) { //批量删除内容
    return request({
        url: `${requestPath.resource}/recommend/res/batch/delete`,
        method: 'post',
        data
    })
}

export function createContenAPI(data) { //添加内容
    return request({
        url: `${requestPath.resource}/recommend/res/save`,
        method: 'post',
        data
    })
}

//修改排序号
export function updateSortAPI(data) {
    return request({
        url: `${requestPath.resource}/recommend/res/update/${data.oid}`,
        method: 'post',
        data: data.sort
    })
}

//一个是推荐位内容详情
export function recomDetailsAPI(params) {
    return request({
        url: `${requestPath.resource}/recommend/res/${params}`,
        method: 'get',
    })
}

//一个是文章的详情
// export function articleDetailsAPI(params) {
//     return request({
//         url: `${requestPath.resource}/article-library/get/${params}`,
//         method: 'get',
//     })
// }
export function articleDetailsAPI(params) {
    return request({
        url: `${requestPath.resource}/resource/get/info`,
        method: 'get',
        params
    })
}


//修改推荐内容
export function updateContentAPI(data) {
    return request({
        url: `${requestPath.resource}/recommend/res/update`,
        method: 'post',
        data
    })
}


//修改文章内容
export function updateArticleAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/img/update`,
        method: 'post',
        data
    })
}