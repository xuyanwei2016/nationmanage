import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 导出sql文件
export function exportSqlAPI(params) {
  return request({
    url: `${requestPath.resource}/database/sql`,
    method: 'get',
    params
  })
}

// 导出资源文件
export function exportResourceAPI(params) {
    return request({
      url: `${requestPath.resource}/database/file`,
      method: 'get',
      params
    })
}

// 获取百分比
export function getPercentageAPI() {
    return request({
      url: `${requestPath.resource}/database/percentage`,
      method: 'get'
    })
}