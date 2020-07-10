import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'
export function getListAPI(params, id) {
  return request({
    url: `${requestPath.stock}/ware/${id}/storage-bin/page`,
    method: 'get',
    params
  })
}

export function getNameAPI() {
  return request({
    url: `${requestPath.stock}/storage-bin/list/names`,
    method: 'get'
  })
}

export function addAPI(data, id) {
  return request({
    url: `${requestPath.stock}/ware/${id}/storage-bin/save`,
    method: 'post',
    data
  })
}

export function updateAPI(data, id) {
  return request({
    url: `${requestPath.stock}/ware/${id}/storage-bin/update`,
    method: 'post',
    data
  })
}

export function deleteAPI(data, id) {
  return request({
    url: `${requestPath.stock}/ware/${id}/storage-bin/delete`,
    method: 'post',
    data
  })
}
