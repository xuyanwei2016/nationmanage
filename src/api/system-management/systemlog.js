import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getData(data) {
  return request({
    url: `${requestPath.common}/log/page`,
    method: 'get',
    params: data
  })
}
