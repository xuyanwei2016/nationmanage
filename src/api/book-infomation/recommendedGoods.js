import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'

export function getInfoAPI(params) {
  return request({
    url: `${requestPath.common}/diytype/${params}`,
    method: 'get'
  })
}

export function getListAPI(params) {
  return request({
    url: `${requestPath.book}/dtrg/page`,
    method: 'get',
    params
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.book}/dtrg/batch/save`,
    method: 'post',
    data
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.book}/dtrg/batch/delete`,
    method: 'post',
    data
  })
}

export function topStatusAPI(data) {
  return request({
    url: `${requestPath.book}/dtrg/batch/update/istop`,
    method: 'post',
    data
  })
}

export function getGoodsAPI(params) {
  return request({
    url: `${requestPath.book}/dtrg/page/book`,
    method: 'get',
    params
  })
}
