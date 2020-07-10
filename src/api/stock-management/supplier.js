import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'
export function getListAPI(params) {
  return request({
    url: `${requestPath.stock}/supplier/page`,
    method: 'get',
    params
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.stock}/supplier/save`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.stock}/supplier/update`,
    method: 'post',
    data
  })
}
