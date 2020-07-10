import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.marketing}/promotion/book/page`,
    method: 'get',
    params
  })
}

export function getInfoAPI(params) {
  return request({
    url: `${requestPath.marketing}/promotion/get/${params}`,
    method: 'get'
  })
}

export function getGoodsAPI(params) {
  return request({
    url: `${requestPath.book}/book/page/promotion`,
    method: 'get',
    params
  })
}

export function deleteAPI(data, id) {
  return request({
    url: `${requestPath.marketing}/promotion/${id}/book/batch/delete`,
    method: 'post',
    data
  })
}

export function addAPI(data, id) {
  return request({
    url: `${requestPath.marketing}/promotion/${id}/book/save`,
    method: 'post',
    data
  })
}

export function setDiscountAPI(data) {
  return request({
    url: `${requestPath.marketing}/promotion/book/batch/update/discount`,
    method: 'post',
    data
  })
}
