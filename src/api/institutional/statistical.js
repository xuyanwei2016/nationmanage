import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getCakeAPI(params) { //获取饼状数据
    return request({
        url: `${requestPath.resource}/resource/pie/data`,
        method: 'get',
        params
    })
}

export function getBrokenAPI(params) { //获取折线数据
    return request({
        url: `${requestPath.resource}/resource/polyline/data`,
        method: 'get',
        params
    })
}