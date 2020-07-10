import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/ebook/page`,
        method: 'get',
        params
    })
}


export function bookSeriesListAPI(params) {
    return request({
        url: `${requestPath.common}/dictionary/page`,
        method: 'get',
        params
    })
}
//批量上下架
export function editStatusAPI(data) {
    return request({
        url: `${requestPath.resource}/ebook/batch/update/updown`,
        method: 'post',
        data
    })
}

//批量审核
export function reviewAPI(data) {
    return request({
        url: `${requestPath.resource}/ebook/batch/update/review`,
        method: 'post',
        data
    })
}

//提交审核
export function submitReviewAPI(data) {
    return request({
        url: `${requestPath.resource}/ebook/batch/update`,
        method: 'post',
        data
    })
}

//单条删除
export function deleteAPI(data) {
    return request({
        url: `${requestPath.resource}/ebook/batch/delete`,
        method: 'post',
        data
    })
}

//保存
export function saveAPI(data) {
    return request({
        url: `${requestPath.resource}/ebook/save`,
        method: 'post',
        data
    })
}

//详情
export function detailsAPI(params) {
    return request({
        url: `${requestPath.resource}/ebook/${params}`,
        method: 'get',
    })
}

//pdf列表
export function pdfListAPI(params) {
    return request({
        url: `${requestPath.resource}/pdf-library/page`,
        method: 'get',
        params
    })
}

//筛选列表
export function optionListAPI() {
    return request({
        url: `${requestPath.resource}/ebook/option/list`,
        method: 'get',
    })
}

// 导入Epub
export function importAPI(data) {
    return request({
        url: `${requestPath.resource}/ebook/batch/uploadepub`,
        method: 'post',
        data
    })
}

//自定义标签
export function labelListAPI(params) {
    return request({
        url: `${requestPath.resource}/label/list/dataType`,
        method: 'get',
        params
    })
}