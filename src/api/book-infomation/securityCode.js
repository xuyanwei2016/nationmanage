import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.book}/security/page/book`,
    method: 'get',
    params
  })
}

export function getGoodsAPI(params) {
  return request({
    url: `${requestPath.book}/book/${params}`,
    method: 'get'
  })
}

export function getCodeAPI(params) {
  return request({
    url: `${requestPath.book}/security/page`,
    method: 'get',
    params
  })
}

export function exportQRCodeAPI(params) {
  return request({
    url: `${requestPath.book}/security/export/qrcode`,
    method: 'get',
    params
  })
}

export function batchImportAPI(data) {
  return request({
    url: `${requestPath.book}/security/batch/import`,
    method: 'post',
    data
  })
}

export function importAPI(data, id) {
  return request({
    url: `${requestPath.book}/security/batch/import/${id}`,
    method: 'post',
    data
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.book}/security/batch/save`,
    method: 'post',
    data
  })
}

export function invalidAPI(data) {
  return request({
    url: `${requestPath.book}/security/batch/update/invalid`,
    method: 'post',
    data
  })
}

export function addOneAPI(data) {
  return request({
    url: `${requestPath.book}/security/update/save`,
    method: 'post',
    data
  })
}

export function addIsbnAPI(data) {
  return request({
    url: `${requestPath.book}/security/batch/update/save`,
    method: 'post',
    data
  })
}

export function getIsbnListAPI(params) {
  return request({
    url: `${requestPath.book}/book/get/bg/book`,
    method: 'get',
    params
  })
}