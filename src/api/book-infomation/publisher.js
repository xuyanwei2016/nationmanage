import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'
export function getListAPI(params) {
  return request({
    url: `${requestPath.book}/publisher/page`,
    method: 'get',
    params
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.book}/publisher/batch/delete`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.book}/publisher/update`,
    method: 'post',
    data
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.book}/publisher/save`,
    method: 'post',
    data
  })
}
