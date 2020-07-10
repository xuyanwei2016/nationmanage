import request from '@/utils/request'
import { requestPath } from '@/utils/global'

// 获取列表
export function getListAPI(params) {
  return request({
    url: `${requestPath.resource}/image-library/page`,
    method: 'get',
    params
  })
}

// 导入图片
export function importAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/batch/save`,
    method: 'post',
    data
  })
}

// 批量审核
export function batchExamineAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/batch/update/status`,
    method: 'post',
    data
  })
}

// 批量修改价格
export function editPriceTypeAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/batch/update/price`,
    method: 'post',
    data
  })
}

// 修改销售方式
export function editReadTypeAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/batch/update/read`,
    method: 'post',
    data
  })
}

// 修改上架/下架
export function editStatusAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/batch/update/updown`,
    method: 'post',
    data
  })
}

// 批量删除
export function batchDeleteAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/batch/delete`,
    method: 'post',
    data
  })
}

// 新增
export function saveAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/save`,
    method: 'post',
    data
  })
}

// 详情
export function detailsAPI(id) {
  return request({
    url: `${requestPath.resource}/image-library/get/${id}`,
    method: 'get'
  })
}

// 修改
export function editAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/update`,
    method: 'post',
    data
  })
}