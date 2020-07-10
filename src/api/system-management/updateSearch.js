import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getAddSearchAPI() {
    return request({
        url: `${requestPath.resource}/resource/create/index`,
        method: 'get'
    })
}

export function getUpdateSearchAPI() {
    return request({
        url: `${requestPath.resource}/resource/update/index`,
        method: 'get'
    })
}