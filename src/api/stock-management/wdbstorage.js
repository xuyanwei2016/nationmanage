import request from '@/utils/request'
import {requestPath} from '@/utils/global.js'
export function getListAPI(params) {
  return request({
    url: `${requestPath.stock}/stock/wdb/page`,
    method: 'get',
    params
  })
}

export function getSummaryAPI(params) { //总数据
  return request({
      url: `${requestPath.stock}/stock/wdb/count`,
      method: 'get',
      params
  })
}

export function getNavAPI() { //树形自定义分类
  return request({
      url: `${requestPath.resource}/diytype/tree`,
      method: 'get'
  })
}

export function getOptionAPI() { //数组自定义分类
  return request({
      url: `${requestPath.resource}/diytype/list`,
      method: 'get'
  })
}
