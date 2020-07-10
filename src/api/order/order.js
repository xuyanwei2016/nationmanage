import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListFuzzyAPI(data) {
    return request({
        url: `${requestPath.order}/order/page-fuzzy-query`,
        method: 'get',
        params: data
    })
}

// 批量修改订单状态为已取消
export function batchCancelOrderAPI(data) {
    return request({
        url: `${requestPath.order}/order/cancel-order`,
        method: 'post',
        data
    })
}


// 批量修改订单状态为已确认
export function batchConfirmOrderAPI(data) {
    return request({
        url: `${requestPath.order}/order/batch/confirmed`,
        method: 'post',
        data
    })
}


// 批量修改订单状态为已支付
export function batchOrderPaidAPI(data) {
    return request({
        url: `${requestPath.order}/order/batch/have-paid`,
        method: 'post',
        data
    })
}


// 批量修改订单状态为已缺货
export function batchSoldOutAPI(data) {
    return request({
        url: `${requestPath.order}/order/batch/stock-out`,
        method: 'post',
        data
    })
}


// 批量修改订单状态为待发货
export function batchSentAPI(data) {
    return request({
        url: `${requestPath.order}/order/batch/wait-send`,
        method: 'post',
        data
    })
}

export function returnPostGoods(data) {
    return request({
        url: `${requestPath.order}/order/return-goods`,
        method: 'post',
        data
    })
}



// 生成配货单
export function genRationAPI(data) {
    return request({
        url: `${requestPath.order}/order/save/order-blank`,
        method: 'post',
        data
    })
}


// 订单添加备注历史
export function remarkHistoryAPI(data) {
    return request({
        url: `${requestPath.order}/order/save/remark-history`,
        method: 'post',
        data
    })
}


// 发送短信
export function sendMessageAPI(data) {
    return request({
        url: `${requestPath.order}/order/send-phone-message`,
        method: 'post',
        data
    })
}


// 修改订单
export function changeOrderInfoAPI(data) {
    return request({
        url: `${requestPath.order}/order/update-order-invoice`,
        method: 'post',
        data
    })
}

// 查询订单列表
export function getListAPI(params) {
    return request({
        url: `${requestPath.order}/order/page`,
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
// 根据订单id查询备注历史列表
export function getRemarkByIdAPI(params) {
    return request({
        url: `${requestPath.order}/order/page/remark-history`,
        method: 'get',
        params
    })
}
// 根据订单id查询状态改变历史列表
export function getStatusHisByIdAPI(params) {
    return request({
        url: `${requestPath.order}/order/page/status-history`,
        method: 'get',
        params
    })
}

// 根据id查找订单详情
export function orderDetailAPI(params) {
    return request({
        url: `${requestPath.order}/order/${params}`,
        method: 'get'
    })
}

// 查询退货单分页数据
export function returnOrderlistAPI(params) {
    return request({
        url: `${requestPath.order}/order/page-sales-return`,
        method: 'get',
        params
    })
}
// 查询退款单分页数据
export function refundOrderlistAPI(params) {
    return request({
        url: `${requestPath.order}/order/page-refund-order`,
        method: 'get',
        params
    })
}
// 根据id查询信息列表
export function getPhoneloglistAPI(params) {
    return request({
        url: `${requestPath.order}/order/get-phone-log`,
        method: 'get',
        params
    })
}
// 推送发票
export function createinvoiceAPI(data) {
    return request({
        url: `${requestPath.order}/order/create-invoice`,
        method: 'post',
        data
    })
}

//批量推送发票

export function sumSendinvoiceAPI(data) {
    return request({
        url: `${requestPath.order}/order/batch-send-invoice`,
        method: 'post',
        data
    })
}

export function getNavAPI() { //树形自定义分类
    return request({
        url: `${requestPath.resource}/diytype/tree`,
        method: 'get'
    })
}

export function getOptionAPI() { //数组自定义分类
    return request({
        url: `${requestPath.resource}/diytype/list`,
        method: 'get'
    })
}

export function getAllStatusAPI() { //订单所有状态
    return request({
        url: `${requestPath.order}/order/list/status`,
        method: 'post'
    })
}

export function refundAPI(data) { //订单退款
    return request({
        url: `${requestPath.order}/order/batch-refunding`,
        method: 'post',
        data
    })
}

export function rejectionAPI(data) { //拒收
    return request({
        url: `${requestPath.order}/order/batch/rejection`,
        method: 'post',
        data
    })
}


//发票
export function getInvoiceListAPI(params) { //数组自定义分类
    return request({
        url: `${requestPath.order}/invoice/page`,
        method: 'get',
        params
    })
}