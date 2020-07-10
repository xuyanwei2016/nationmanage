import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.common}/role/page`,
    method: 'get',
    params
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.common}/role/delete`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.common}/role/update`,
    method: 'post',
    data
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.common}/role/save`,
    method: 'post',
    data
  })
}

export function authorityAPI(data) {
  return request({
    url: `${requestPath.common}/role/saveOperatepowerToRole`,
    method: 'post',
    data
  })
}

export function getModuleAPI() {
  return request({
    url: `${requestPath.common}/modulepower/list`,
    method: 'get'
  })
}

export function getRoleBtnAPI(params) {
  return request({
    url: `${requestPath.common}/operatepower/list/role/${params}`,
    method: 'get'
  })
}

export function getBtnsAPI() {
  return request({
    url: `${requestPath.common}/operatepower/list`,
    method: 'get'
  })
}

export function isExistAPI(params) {
  return request({
    url: `${requestPath.common}/role/isExist/roleName`,
    method: 'get',
    params
  })
}
