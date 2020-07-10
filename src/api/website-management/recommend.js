import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getRecommends(params) {
    return request({
        url: `${requestPath.common}/recommend/page`,
        method: 'get',
        params
    })
}

export function deleteAPI(data) {
    return request({
        url: `${requestPath.common}/recommend/delete/${data}`,
        method: 'post'
    })
}

export function addRecommend(data) {
    return request({
        url: `${requestPath.common}/recommend/save`,
        method: 'post',
        data
    })
}

export function updateRecommend(data) {
    return request({
        url: `${requestPath.common}/recommend/update`,
        method: 'post',
        data
    })
}

export function getListAPI(params) {
    return request({
        url: `${requestPath.common}/recommend/goods/page`,
        method: 'get',
        params
    })
}

export function batchCancelAPI(data) { //批量取消
    return request({
        url: `${requestPath.common}/recommend/goods/batch/delete`,
        method: 'post',
        data
    })
}

export function editAPI(data) { //批量修改排序号
    return request({
        url: `${requestPath.common}/recommend/goods/update/${data.id}`,
        method: 'post',
        data: data.num
    })
}

export function getRecommendListAPI(params) { //推荐商品-内容
    return request({
        url: `${requestPath.book}/book/page/featured`,
        method: 'get',
        params: params
    })
}

export function relationAPI(data) { //添加推荐商品
    return request({
        url: `${requestPath.common}/recommend/save/${data.id}`,
        method: 'post',
        data: data.array
    })
}

export function statusAPI(params) { //所有类型
    return request({
        url: `${requestPath.common}/recommend/get/type`,
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