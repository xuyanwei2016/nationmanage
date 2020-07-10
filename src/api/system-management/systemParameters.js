import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getListBasicAPI(data) {
  return request({
    url: `${requestPath.common}/dictionary/site`,
    method: 'get',
    params: data
  })
}

export function getListMemberAPI(data) {
  return request({
    url: `${requestPath.common}/dictionary/member`,
    method: 'get',
    params: data
  })
}
