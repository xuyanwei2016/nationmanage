import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(data) { /* 获取表格数据 */
    return request({
        url: `${requestPath.member}/member/page`,
        method: 'get',
        params: data
    })
}

export function batchDeleteAPI(data) { /* 批量删除接口 */
    return request({
        url: `${requestPath.member}/member/batch/delete`,
        method: 'post',
        data
    })
}

export function batchRechargeAPI(data) { /* 批量充值接口 */
    return request({
        url: `${requestPath.member}/member/batch/update/recharge`,
        method: 'post',
        data
    })
}

export function updateAPI(data) { /* 批量更新状态接口 */
    return request({
        url: `${requestPath.member}/member/batch/update/status/${data.status}`,
        method: 'post',
        data: data.id
    })
}

export function addAPI(data) { /* 新增接口 */
    return request({
        url: `${requestPath.member}/e-member/save`,
        method: 'post',
        data
    })
}

export function getUserByIdAPI(data) {
    return request({
        url: `${requestPath.member}/e-member/get/${data}`,
        method: 'get'
    })
}

export function searchBalanceAPI(data) { /* 查询会员余额接口 */
    return request({
        url: `${requestPath.member}/member/balance/page`,
        method: 'get',
        params: data
    })
}

export function searchExistAPI(data) {
    return request({
        url: `${requestPath.member}/member/isExist`,
        method: 'get',
        params: data
    })
}

export function searchAPI(data) { /* 获取表格数据 */
    return request({
        url: `${requestPath.member}/member/page/keyword`,
        method: 'get',
        params: data
    })
}

export function deleteAPI(data) { /* 删除接口 */
    return request({
        url: `${requestPath.member}/member/delete/{oid}`,
        method: 'post',
        data
    })
}

export function exportAPI(data) { /* 导出会员接口 */
    return request({
        url: `${requestPath.member}/member/export`,
        method: 'get',
        params: data
    })
}

export function exportMemberInfoAPI(data) {
    return request({
        url: `${requestPath.member}/member/export`,
        method: 'get',
        params: data
    })
}

export function searchScoreAPI(data) { /* 查询账户积分接口 */
    return request({
        url: `${requestPath.member}/member/score/page`,
        method: 'get',
        params: data
    })
}

export function searchExportAPI(data) { /* 导出会员接口 */
    return request({
        url: `${requestPath.member}/member/export`,
        method: 'get',
        params: data
    })
}

export function changeAPI(data) { /* 修改用户信息接口 */
    return request({
        url: `${requestPath.member}/member/update`,
        method: 'post',
        data
    })
}

export function authorLibraryAPI(params) { /* 模糊查询 */
    return request({
        url: `${requestPath.resource}/authorLibrary/other/${params}`,
        method: 'get',
    })
}