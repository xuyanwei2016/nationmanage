import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getFriendlink(data) {
  return request({
    url: `${requestPath.common}/friendsLinks/page`,
    method: 'get',
    params: data
  })
}

export function deleteFriendlink(data) {
  return request({
    url: `${requestPath.common}/friendsLinks/batch/delete`,
    method: 'post',
    data
  })
}

export function updateFriendlink(data) {
  return request({
    url: `${requestPath.common}/friendsLinks/update`,
    method: 'post',
    data
  })
}

export function addFriendlink(data) {
  return request({
    url: `${requestPath.common}/friendsLinks/save`,
    method: 'post',
    data
  })
}

export function getFriendlinkOid(params) {
  return request({
    url: `${requestPath.common}/friendsLinks/${params}`,
    method: 'get',
  })
}


// 查询最大排序号
export function getMaxSortAPI(params) {
  return request({
    url: `${requestPath.common}/friendsLinks/get/maxOrderNum`,
    method: 'get',
    params
  })
}
