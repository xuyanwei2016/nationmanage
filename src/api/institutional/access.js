import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) { //资源类型列表
    return request({
        url: `${requestPath.resource}/organ-member-record/page`,
        method: 'get',
        params
    })
}