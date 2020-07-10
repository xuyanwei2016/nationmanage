import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
import { loadavg } from 'os';

export function getListAPI(params) { // 查询退款单列表
    return request({
        url: `${requestPath.order}/refund-order/page`,
        method: 'get',
        params
    })
}

export function cancelAPI(data) { //取消退款
    return request({
        url: `${requestPath.order}/refund-order/update/${data.oid}/status-canceled`,
        method: 'post',
        data
    })
}

export function refundAPI(data) { //退款
    return request({
        url: `${requestPath.order}/refund-order/update/${data.oid}/status-complete`,
        method: 'post',
        data
    })
}

export function checkAPI(data) { //审核
    return request({
        url: `${requestPath.order}/refund-order/update/${data.oid}/status-checked`,
        method: 'post',
        data
    })
}

export function batchCheckAPI(data) { //批量审核
    return request({
        url: `${requestPath.order}/refund-order/batch/update/status-checked`,
        method: 'post',
        data
    })
}

export function batchConfirmAPI(data) { //批量确认退款
    return request({
        url: `${requestPath.order}/refund-order/batch/update/status-complete`,
        method: 'post',
        data
    })
}

export function orderDetailAPI(params) { // 根据id查找订单详情
    return request({
        url: `${requestPath.order}/refund-order/${params}`,
        method: 'get'
    })
}

export function getRemarkByIdAPI(params) { // 根据订单id查询备注历史列表
    return request({
        url: `${requestPath.order}/refund-order/page/remark-history`,
        method: 'get',
        params
    })
}

export function getStatusHisByIdAPI(params) { // 根据订单id查询状态改变历史列表
    return request({
        url: `${requestPath.order}/refund-order/page/status-history`,
        method: 'get',
        params
    })
}

export function remarkHistoryAPI(data) { // 订单添加备注历史
    return request({
        url: `${requestPath.order}/refund-order/save/remark-history`,
        method: 'post',
        data
    })
}

// /bg/refund-order/update/refund
// 冲红失败继续进行退款操作
export function continueRefundsAPI(data) { // 订单添加备注历史
    return request({
        url: `${requestPath.order}/refund-order/update/refund`,
        method: 'post',
        data
    })
}

// /bg/refund-order/batch/update/refund
// 冲红失败继续执行批量退款
export function continuebatchRefundsAPI(data) { // 订单添加备注历史
    return request({
        url: `${requestPath.order}/refund-order/update/refund`,
        method: 'post',
        data
    })
}