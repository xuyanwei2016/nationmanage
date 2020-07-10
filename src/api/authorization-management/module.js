import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI() {
  return request({
    url: `${requestPath.common}/modulepower/list`,
    method: 'get'
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.common}/modulepower/batch/delete`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.common}/modulepower/update`,
    method: 'post',
    data
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.common}/modulepower/save`,
    method: 'post',
    data
  })
}
