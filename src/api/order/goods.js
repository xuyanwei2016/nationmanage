import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
import { loadavg } from 'os';

// 查询退货单列表
export function getListAPI(params) {
    return request({
        url: `${requestPath.order}/sales-return/page`,
        method: 'get',
        params
    })
}

export function cancelAPI(data) { //取消
    return request({
        url: `${requestPath.order}/sales-return/update/${data.oid}/status-canceled`,
        method: 'post',
        data
    })
}

export function confirmAPI(data) { //确认
    return request({
        url: `${requestPath.order}/sales-return/update/${data.oid}/status-unchecked`,
        method: 'post',
        data
    })
}

export function checkSucAPI(data) { //审核通过
    return request({
        url: `${requestPath.order}/sales-return/update/${data.oid}/status-checked-success`,
        method: 'post',
        data
    })
}

export function checkFailAPI(data) { //审核不通过
    return request({
        url: `${requestPath.order}/sales-return/update/${data.oid}/status-checked-failure`,
        method: 'post',
        data
    })
}

export function getRemarkByIdAPI(params) { // 根据订单id查询备注历史列表
    return request({
        url: `${requestPath.order}/sales-return/page/remark-history`,
        method: 'get',
        params
    })
}

export function getStatusHisByIdAPI(params) { // 根据订单id查询状态改变历史列表
    return request({
        url: `${requestPath.order}/sales-return/page/status-history`,
        method: 'get',
        params
    })
}

export function remarkHistoryAPI(data) { // 订单添加备注历史
    return request({
        url: `${requestPath.order}/sales-return/save/remark-history`,
        method: 'post',
        data
    })
}

export function storageAPI(data) { // 入库
    return request({
        url: `${requestPath.order}/sales-return/update/status-put-storage`,
        method: 'post',
        data
    })
}

export function orderDetailAPI(params) { // 根据id查找订单详情
    return request({
        url: `${requestPath.order}/sales-return/${params}`,
        method: 'get',
        params
    })
}

export function changeOrderInfoAPI(data) { // 修改订单
    return request({
        url: `${requestPath.order}/sales-return/update`,
        method: 'post',
        data
    })
}


// /express100/get
// export function express100(data) { // 
//     return request({
//         url: `${requestPath.third}/express100/get`,
//         method: 'post',
//         data
//     })
// }

// /bg/company/page 获取快递公司列表
// /bg/company/page
export function getLogistListAPI(params) { // 获取快递公司列表
    return request({
        url: `${requestPath.common}/company/page`,
        method: 'get',
        params
    })
}
// /bg/sales-return/get-logistics
export function getLogisticsAPI(params) { // 根据id查找物流信息
    return request({
        url: `${requestPath.order}/sales-return/get-logistics`,
        method: 'get',
        params
    })
}
export function adoptAPI(data) { // 批量审核通过
    return request({
        url: `${requestPath.order}/sales-return/batch/update/status-checked`,
        method: 'post',
        data
    })
}
export function NoadoptAPI(data) { // 批量审核不通过
    return request({
        url: `${requestPath.order}/sales-return/batch/update/status-not-checked`,
        method: 'post',
        data
    })
}


