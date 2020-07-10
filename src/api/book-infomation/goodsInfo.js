import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'
export function getListAPI(params) {
  return request({
    url: `${requestPath.book}/book/page`,
    method: 'get',
    params
  })
}

export function getNavAPI() {
  return request({
    url: `${requestPath.resource}/diytype/tree`,
    method: 'get'
  })
}

export function getPublisherAPI() {
  return request({
    url: `${requestPath.book}/publisher/publisher`,
    method: 'get'
  })
}

export function batchHintAPI(data) {
  return request({
    url: `${requestPath.book}/book/batch/update/hint`,
    method: 'post',
    data
  })
}

export function massShelvesAPI(data) {
  return request({
    url: `${requestPath.book}/book/batch/update/status`,
    method: 'post',
    data
  })
}

export function massSaleAPI(data) {
  return request({
    url: `${requestPath.book}/book/batch/update/sale`,
    method: 'post',
    data
  })
}

export function presaleAPI(data) {
  return request({
    url: `${requestPath.book}/book/batch/update/presale`,
    method: 'post',
    data
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.book}/book/batch/delete`,
    method: 'post',
    data
  })
}

export function subtitleAPI(data) {
  return request({
    url: `${requestPath.book}/book/batch/update/subtitle`,
    method: 'post',
    data
  })
}

export function uploadFileAPI(data) {
  return request({
    url: `${requestPath.book}/book/batch/upload/file`,
    method: 'post',
    data
  })
}

export function relatePicAPI(data) {
  return request({
    url: `${requestPath.book}/book/batch/upload/relationPic`,
    method: 'post',
    data
  })
}

export function getInfoAPI(id) {
  return request({
    url: `${requestPath.book}/book/${id}`,
    method: 'get'
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.book}/book/save`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.book}/book/update`,
    method: 'post',
    data
  })
}

export function getOptionAPI() {
  return request({
    url: `${requestPath.common}/diytype/list`,
    method: 'get'
  })
}

export function getExpressAPI() {
  return request({
    url: `${requestPath.book}/express/express`,
    method: 'get'
  })
}
