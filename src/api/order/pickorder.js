import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
import { loadavg } from 'os';

// 查询配货单列表
export function getListAPI(params) {
    return request({
        url: `${requestPath.order}/order-blank/page`,
        method: 'get',
        params
    })
}

export function pushBsAPI(data) { //推送百世
    return request({
        url: `${requestPath.order}/order-blank/push-to-foreign`,
        method: 'post',
        data: data
    })
}

export function cancelAPI(data) { //取消配货单
    return request({
        url: `${requestPath.order}/order-blank/batch-cancelled`,
        method: 'post',
        data
    })
}

export function sendFailAPI(data) { //发货失败
    return request({
        url: `${requestPath.order}/order-blank/batch-delivery-fail`,
        method: 'post',
        data
    })
}

export function cancelPushAPI(data) { //取消推送配货单
    return request({
        url: `${requestPath.order}/order-blank/batch-cancel-failed`,
        method: 'post',
        data
    })
}

export function refushAPI(data) { //拒收
    return request({
        url: `${requestPath.order}/order-blank/batch-refuse-to-accept`,
        method: 'post',
        data
    })
}

// /bg/order-blank/send-phone-message
export function sendMessageAPI(data) { // 发送短信
    return request({
        url: `${requestPath.order}/order-blank/send-phone-message`,
        method: 'post',
        data
    })
}
export function orderDetailAPI(params) { // 根据id查找订单详情
    return request({
        url: `${requestPath.order}/order-blank/get/${params}`,
        method: 'get'
    })
}

export function getStatusHisByIdAPI(params) { // 根据订单id查询状态改变历史列表
    return request({
        url: `${requestPath.order}/order-blank/page/status-history`,
        method: 'get',
        params
    })
}

export function getRemarkByIdAPI(params) { // 根据订单id查询备注历史列表
    return request({
        url: `${requestPath.order}/order-blank/page/remark-history`,
        method: 'get',
        params
    })
}

export function remarkHistoryAPI(data) { // 订单添加备注历史
    return request({
        url: `${requestPath.order}/order-blank/save/remark-history`,
        method: 'post',
        data
    })
}

export function changeOrderInfoAPI(data) { // 修改订单
    return request({
        url: `${requestPath.order}/order-blank/update/${data.id}`,
        method: 'post',
        data
    })
}

export function getListFuzzyAPI(params) { //模糊查询
    return request({
        url: `${requestPath.order}/order-blank/page-fuzzy-query`,
        method: 'get',
        params
    })
}


// 根据订单id获取配货单列表
export function getRationByIdAPI(params) {
    return request({
      url: `${requestPath.order}/order/page/order-blank`,
      method: 'get',
      params
    })
}

// /express100/get
// 快递100查询物流信息
export function express100(data) { // 
    return request({
        url: `${requestPath.third}/express100/get`,
        method: 'post',
        data
    })
}

// 根据订单id获取配货单物流信息
export function getLogisticsByIdAPI(params) {
    return request({
      url: `${requestPath.order}/order-blank/get-logistics`,
      method: 'get',
      params
    })
}

export function signInAPI(data) { // 签收
    return request({
        url: `${requestPath.order}/order-blank/batch/signed-in`,
        method: 'post',
        data
    })
}
// 查询短信列表 
export function getorderBlankPhoneloglistAPI(params) {
    return request({
      url: `${requestPath.order}/order-blank/get-phone-log`,
      method: 'get',
      params
    })
}