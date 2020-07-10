import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.common}/card/page`,
    method: 'get',
    params
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.common}/card/delete`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.common}/card/update`,
    method: 'post',
    data
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.common}/card/save`,
    method: 'post',
    data
  })
}

export function batchAddAPI(data) {
  return request({
    url: `/card/batch/save`,
    method: 'post',
    data
  })
}

export function isExistAPI(params) {
  return request({
    url: `${requestPath.common}/card/isExist`,
    method: 'get',
    params
  })
}
