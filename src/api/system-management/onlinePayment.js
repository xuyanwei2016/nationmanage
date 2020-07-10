import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getData(data) {
  return request({
    url: `${requestPath.common}/pay/page`,
    method: 'get',
    params: data
  })
}

export function updateData(data) {
  return request({
    url: `${requestPath.common}/pay/update`,
    method: 'post',
    data
  })
}

