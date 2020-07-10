import request from '@/utils/request'
import {requestPath, uploadPath } from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.book}/import/page`,
    method: 'get',
    params
  })
}

export function batchSubmitAPI(data) {
  return request({
    url: `${requestPath.book}/import/batch/update/submit`,
    method: 'post',
    data
  })
}

export function batchImportAPI(data) {
  return request({
    url: `${requestPath.book}/import/batch/import`,
    method: 'post',
    data
  })
}

export function batchImportPicAPI(data) {
  return request({
    url: `${requestPath.book}/import/batch/import/cover`,
    method: 'post',
    data
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.book}/import/batch/delete`,
    method: 'post',
    data
  })
}

export function getInfoAPI(id) {
  return request({
    url: `${requestPath.book}/import/${id}`,
    method: 'get'
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.book}/import/update`,
    method: 'post',
    data
  })
}

export function uploadZipAPI(data) {
  return request({
    url: `${requestPath.file}${uploadPath}/zip`,
    method: 'post',
    data
  })
}
