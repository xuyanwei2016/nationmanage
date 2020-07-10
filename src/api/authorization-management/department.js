import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
export function getListAPI() {
  return request({
    url: `${requestPath.common}/department/list`,
    method: 'get'
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.common}/department/delete`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.common}/department/update`,
    method: 'post',
    data
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.common}/department/save`,
    method: 'post',
    data
  })
}

export function updateModuleAPI(data) {
  return request({
    url: `${requestPath.common}/department/save/mtod`,
    method: 'post',
    data
  })
}

export function getModuleAPI(params) {
  return request({
    url: `${requestPath.common}/modulepower/list/dept`,
    method: 'get',
    params
  })
}

export function addFirstModuleAPI() {
  return request({
    url: `${requestPath.common}/modulepower/list`,
    method: 'get'
  })
}
