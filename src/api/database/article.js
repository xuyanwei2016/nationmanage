import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'



export function resourceListAPI(params) { //资源类型列表
    return request({
        url: `${requestPath.resource}/resource/Type/list`,
        method: 'get',
        params
    })
}

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/article-library/page`,
        method: 'get',
        params
    })
}

export function batchExamineAPI(data) { // 批量审核
    return request({
        url: `${requestPath.resource}/article-library/batch/update/status`,
        method: 'post',
        data
    })
}

export function batchPriceAPI(data) { //批量修改价格
    return request({
        url: `${requestPath.resource}/article-library/batch/update/price`,
        method: 'post',
        data
    })
}

export function batchDeleteAPI(data) { //批量删除
    return request({
        url: `${requestPath.resource}/article-library/batch/delete`,
        method: 'post',
        data
    })
}


//批量修改阅读权限
export function editReadTypeAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/batch/update/resourceType`,
        method: 'post',
        data
    })
}

export function deleteAPI(data) { //单条删除
    return request({
        url: `${requestPath.resource}/article-library/delete/${data}`,
        method: 'post',
        data
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

export function detailsAPI(id) {
    return request({
        url: `${requestPath.resource}/article-library/get/${id}`,
        method: 'get'
    })
}

// export function saveAPI(data) {
//     return request({
//         url: `${requestPath.resource}/video-library/save`,
//         method: 'post',
//         data
//     })
// }

export function editAPI(data) {
    return request({
        url: `${requestPath.resource}/article-library/update`,
        method: 'post',
        data
    })
}

export function authorLibraryAPI(params) { //作者名字模糊查询
    return request({
        url: `${requestPath.resource}/authorLibrary/list/${params}`,
        method: 'get',
    })
}
export function translatorLibraryAPI(params) { //译者名字模糊查询
    return request({
        url: `${requestPath.resource}/authorLibrary/list/${params}`,
        method: 'get',
    })
}

export function updateTypeAPI(data) {
    return request({
        url: `${requestPath.resource}/resource/batch/update/diytype`,
        method: 'post',
        data
    })
}
export function getTreeAPI(params) {
    return request({
        url: `${requestPath.resource}/diytype/{name}/tree?name=`+params,
        method: 'get',
        params
    })
}