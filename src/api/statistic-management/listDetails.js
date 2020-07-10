import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
    return request({
        url: `${requestPath.order}/report/list-detail`,
        method: 'get',
        params
    })
}

export function getAllStatusAPI() { //订单所有状态
    return request({
        url: `${requestPath.order}/order/get-all-status`,
        method: 'get'
    })
}

export function getSummaryAPI(params) { //总数据
    return request({
        url: `${requestPath.order}/report/calculate-list-detail`,
        method: 'get',
        params
    })
}
