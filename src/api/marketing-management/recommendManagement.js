import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.book}/rcr/page`,
    method: 'get',
    params
  })
}

export function getInfoAPI(params) {
  return request({
    url: `${requestPath.book}/recommend_book/get/${params}`,
    method: 'get'
  })
}

export function getGoodsAPI(params) {
  return request({
    url: `${requestPath.book}/book/page/recommend`,
    method: 'get',
    params
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.book}/rcr/batch/delete`,
    method: 'post',
    data
  })
}

export function addAPI(data, id) {
  return request({
    url: `${requestPath.book}/rcr/save/${id}`,
    method: 'post',
    data
  })
}

export function topStatusAPI(data) {
  return request({
    url: `${requestPath.book}/rcr/update/top`,
    method: 'post',
    data
  })
}
