import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function add(data) {
  return request({
    url: requestPath.common + '/bulletin-column/save',
    method: 'post',
    data
  })
}

export function getList(params) {
  return request({
    url: requestPath.common + '/bulletin-column/page',
    method: 'get',
    params
  })
}

export function getAllList() {
  return request({
    url: requestPath.common + '/bulletin-column/list',
    method: 'get'
  })
}

export function isExistAPI(params) {
  return request({
    url: requestPath.common + '/bulletin-column/isExist',
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: requestPath.common + '/bulletin-column/update',
    method: 'post',
    data
  })
}

export function singleDeleteAPI(id) {
  return request({
    url: requestPath.common + '/bulletin-column/delete/' + id,
    method: 'post'
  })
}

export function getContentList(params) {
  return request({
    url: requestPath.common + '/bulletin-content/page',
    method: 'get',
    params
  })
}

// backups

export function addAPI(data) {
  return request({
    url: requestPath.common + '/bulletin-content/save',
    method: 'post',
    data
  })
}

export function editAPI(data) {
  return request({
    url: requestPath.common + '/bulletin-content/update',
    method: 'post',
    data
  })
}

export function getKeywords(params) {
  return request({
    url: requestPath.common + '/hotsw/getListPage',
    method: 'get',
    params: params
  })
}

export function batchingDeleteAPI(data) {
  return request({
    url: requestPath.common + '/bulletin-content/batch/delete',
    method: 'post',
    data
  })
}

export function batchingListing(data) {
  return request({
    url: requestPath.common + 'hotsw/update/showState',
    method: 'post',
    data
  })
}

export function updateTopAPI(data) {
  return request({
    url: requestPath.common + '/bulletin-content/batch/update/top-status',
    method: 'post',
    data
  })
}

export function getContent(params) {
  return request({
    url: requestPath.common + '/bulletin-content/' + params,
    method: 'get'
  })
}

export function getBulletins(){
  return request({
    url: requestPath.common + '/bulletin-column/page',
    method: 'get',
    params:{
      pageNum:1,
      pageSize:999
    }
  })
}



export function updatestatusAPI(data) {
  return request({
    url: requestPath.common + '/bulletin-content/batch/update/status',
    method: 'post',
    data
  })
}