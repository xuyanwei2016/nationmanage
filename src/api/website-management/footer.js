import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getListAPI(params) {
  return request({
    url: `${requestPath.common}/footer/page`,
    method: 'get',
    params
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.common}/footer/update`,
    method: 'post',
    data
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.common}/footer/save`,
    method: 'post',
    data
  })
}

export function deletaAPI(data) {
  return request({
    url: `${requestPath.common}/footer/batch/delete`,
    method: 'post',
    data
  })
}

export function getOneAPI(id) {
  return request({
    url: `${requestPath.common}/footer/${id}`,
    method: 'get'
  })
}
