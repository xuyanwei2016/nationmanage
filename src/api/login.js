import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
import md5 from 'blueimp-md5'

export function login(username, password, captcha,uuid) {
    console.log(md5(password) + captcha);

    const data = {
        name: username,
        password: md5(password),
        code:captcha,
        uuid:uuid
    }

    return request({
        url: `${requestPath.common}/permissions/login`,
        method: 'get',
        params: data
    })
}

export function getCapAPI(){
    return request({
        url:`${requestPath.common}/permissions/code`,
        method:'get'
    })
}

export function getRouterList(token) {
    return request({
        url: `${requestPath.common}/permissions/permissions`,
        method: 'get'
    })
}

export function loginByUsername(username, password) {
    const data = {
        username,
        password
    }
    return request({
        url: `/login/login`,
        method: 'post',
        data
    })

}

export function logout() {
    return request({
        url: '/login/logout',
        method: 'post'
    })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function getPageButtonList(pageCode) {
  const data = {
    mpCode: pageCode
  }
  return request({
    url: `${requestPath.common}/permissions/op`,
    method: 'get',
    params: data
  })
}

export function getDashboard() {
    return request({
        url: `${requestPath.order}/order/get-order-sum`,
        method: 'get'
    })
}
