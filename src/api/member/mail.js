import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 获取表格数据
export function getListAPI(params) {
  return request({
    url: `${requestPath.member}/pm/page`,
    method: 'get',
    params
  })
}

// 新增和编辑
export function addAPI(data) {
  return request({
    url: `${requestPath.member}/pm/save`,
    method: 'post',
    data
  })
}

// 删除
export function deleteAPI(data) {
  return request({
    url: `${requestPath.member}/pm/batch/delete`,
    method: 'post',
    data
  })
}

// 查询
export function viewAPI(data) {
  return request({
    url: `${requestPath.member}/pm/get/${data}`,
    method: 'get',
    data
  })
}

// 
// export function getAPI(data) {
//   return request({
//     url: `${requestPath.member}/bg/member/page`,
//     method: 'get',
//     data
//   })
// }




// export function getMemberAPI(params) {
//   return request({
//     url: `${requestPath.member}/member/page/keyword`,
//     method: 'get',
//     params
//   })
// }

// 指定会员查询
export function getMemberQueryAPI(params) {
  return request({
    url: `${requestPath.member}/pm/page/member`,
    method: 'get',
    params
  })
}

// export function updateAPI(data) {
//   return request({
//     url: `${requestPath.member}/pm/update`,
//     method: 'post',
//     data
//   })
// }
