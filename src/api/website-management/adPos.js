import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getData(params) {
  return request({
    url: `${requestPath.common}/adsign/page`,
    method: 'get',
    params
  })
}

export function getAdSignAPI(params) {
  return request({
    url: `${requestPath.common}/adsign/${params}`,
    method: 'get'
  })
}

export function changeStatus(data) {
  return request({
    url: `${requestPath.common}/adsign/batch/update`,
    method: 'post',
    data
  })
}

export function massDeleteAPI(data) {
  return request({
    url: `${requestPath.common}/adsign/batch/delete`,
    method: 'post',
    data
  })
}

export function updateAdPos(data) {
  return request({
    url: `${requestPath.common}/adsign/update`,
    method: 'post',
    data
  })
}

export function createAdPos(data) {
  return request({
    url: `${requestPath.common}/adsign/save`,
    method: 'post',
    data
  })
}

export function getAds(params) {
  return request({
    url: `${requestPath.common}/adspace/page`,
    method: 'get',
    params
  })
}

export function deleteAd(data) {
  return request({
    url: `${requestPath.common}/adspace/batch/delete`,
    method: 'post',
    data
  })
}

export function addAd(data) {
  return request({
    url: `${requestPath.common}/adspace/save`,
    method: 'post',
    data
  })
}

export function updateAd(data) {
  return request({
    url: `${requestPath.common}/adspace/update`,
    method: 'post',
    data
  })
}

export function getOnead(params) {
  return request({
    url: `${requestPath.common}/adspace/${params}`,
    method: 'get'
  })
}

// 查询当前最大排序号
export function getMaxSortAPI(params) {
  return request({
    url: `${requestPath.common}/adspace/maxOrderNum`,
    method: 'get',
    params
  })
}

// 内链到内容弹窗左侧列表
export function getInnerListAPI() {
  return request({
    url: `${requestPath.common}/bulletin-column/list`,
    method: 'get'
  })
}

// 内链到内容弹窗右侧查询
export function getListAPI(params) {
  return request({
    url: `${requestPath.common}//bulletin-content/page`,
    method: 'get',
    params
  })
}



