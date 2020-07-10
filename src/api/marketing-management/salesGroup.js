import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.marketing}/promotion/page`,
    method: 'get',
    params
  })
}

export function getTypeAPI() {
  return request({
    url: `${requestPath.marketing}/promotion/list/type`,
    method: 'get'
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.marketing}/promotion/save`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.marketing}/promotion/update`,
    method: 'post',
    data
  })
}

export function checkNameAPI(params) {
  return request({
    url: `${requestPath.marketing}/promotion/check/name`,
    method: 'get',
    params
  })
}

export function updateStatusAPI(data) {
  return request({
    url: `${requestPath.marketing}/promotion/batch/update/status`,
    method: 'post',
    data
  })
}
