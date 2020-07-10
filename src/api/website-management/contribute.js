import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getListAPI(params) {
    return request({
        url: `${requestPath.common}/manuscript/page`,
        method: 'get',
        params: params
    })
}

//获取详情
export function detailsAPI(params) {
    return request({
        url: `${requestPath.common}/manuscript/${params}`,
        method: 'get',
    })
}

//修改
export function updataAPI(data) {
    return request({
        url: `${requestPath.common}/manuscript/update`,
        method: 'post',
        data
    })
}

//批量审核
export function batchExamineAPI(data) {
    return request({
        url: `${requestPath.common}/manuscript/batch/update`,
        method: 'post',
        data
    })
}