import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(data) {
  return request({
    url: `${requestPath.common}/memberlevel/page`,
    method: 'get',
    params: data
  })
}

export function batchChargeAPI(data) { /* 批量充值接口 */
  return request({
    url: `${requestPath.common}/memberlevel/batch/update/recharge`,
    method: 'post',
    data
  })
}

export function batchStatusAPI(data) { /* 批量设置等级状态接口 */
  return request({
    url: `${requestPath.common}/memberlevel/batch/update/status`,
    method: 'post',
    data
  })
}

export function updateAPI(data) { /* 修改会员接口 */
  return request({
    url: `${requestPath.common}/memberlevel/update`,
    method: 'post',
    data
  })
}
