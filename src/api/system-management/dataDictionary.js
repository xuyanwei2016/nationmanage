import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getData(data) {
  return request({
    url: `${requestPath.common}/dictionary/page`,
    method: 'get',
    params: data
  })
}

export function deleteData(data) {
  return request({
    url: `${requestPath.common}/dictionary/batch/delete`,
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: `${requestPath.common}/dictionary/update`,
    method: 'post',
    data
  })
}

export function createData(data) {
  return request({
    url: `${requestPath.common}/dictionary/save`,
    method: 'post',
    data
  })
}

export function getMsgAPI() {
  return request({
    url: `${requestPath.common}/dictionary/shortmessage`,
    method: 'get'
  })
}

export function batchUpdateAPI(data) {
  return request({
    url: `${requestPath.common}/dictionary/batch/update`,
    method: 'post',
    data
  })
}

export function getEmailAPI() {
  return request({
    url: `${requestPath.common}/dictionary/email`,
    method: 'get'
  })
}
