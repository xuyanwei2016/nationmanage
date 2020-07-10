import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.book}/recommend_book/page`,
    method: 'get',
    params
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.book}/recommend_book/save`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.book}/recommend_book/update`,
    method: 'post',
    data
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.book}/recommend_book/batch/delete`,
    method: 'post',
    data
  })
}

export function checkNameAPI(params) {
  return request({
    url: `${requestPath.book}/recommend_book/check/name`,
    method: 'get',
    params
  })
}
