import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.order}/invoice/page`,
    method: 'get',
    params
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.order}/pm/save`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.order}/operatepower/update`,
    method: 'post',
    data
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.order}/pm/batch/delete`,
    method: 'post',
    data
  })
}

export function getMemberAPI(params) {
  return request({
    url: `${requestPath.order}/member/page/keyword`,
    method: 'get',
    params
  })
}
export function getListFuzzyAPI(params) {
  return request({
    url: `${requestPath.order}/invoice/page-fuzzy-query`,
    method: 'get',
    params
  })
}


