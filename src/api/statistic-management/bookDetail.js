import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.order}/report/single-book-detail`,
    method: 'get',
    params
  })
}

export function getSummaryAPI(params) { //总数据
  return request({
      url: `${requestPath.order}/report/calculate-single-book`,
      method: 'get',
      params
  })
}
