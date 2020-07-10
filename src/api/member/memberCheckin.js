import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
export function getListAPI(params) {
  return request({
    url: `${requestPath.common}/membersigned/page`,
    method: 'get',
    params
  })
}

export function batchDeleteAPI(data) {
  return request({
    url: `${requestPath.common}/membersigned/batch/delete`,
    method: 'post',
    data
  })
}

export function deleteAllAPI() {
  return request({
    url: `${requestPath.common}/membersigned/batch/delete/all`,
    method: 'post'
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.common}/membersigned/batch/delete`,
    method: 'post',
    data
  })
}

export function getSignAPI() {
  return request({
    url: `${requestPath.common}/dictionary/membersigned`,
    method: 'get'
  })
}

export function updateSignAPI(data) {
  return request({
    url: `${requestPath.common}/dictionary/batch/update`,
    method: 'post',
    data
  })
}
