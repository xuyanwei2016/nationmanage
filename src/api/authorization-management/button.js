import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
export function getListAPI(params) {
  return request({
    url: `${requestPath.common}/operatepower/list/${params}`,
    method: 'get'
  })
}

export function getModuleAPI() {
  return request({
    url: `${requestPath.common}/modulepower/list`,
    method: 'get'
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.common}/operatepower/save`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.common}/operatepower/update`,
    method: 'post',
    data
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.common}/operatepower/batch/delete`,
    method: 'post',
    data
  })
}
