import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getListAPI(params) {
  return request({
    url: `${requestPath.common}/dictionary/systemsafty`,
    method: 'get',
    params
  })
}
