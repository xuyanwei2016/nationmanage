import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(data) { /* 获取表格数据 、查看用户信息、查询*/
    return request({
        url: `${requestPath.member}/o-member/page`,
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

export function batchUpdateStastusAPI(data) { /* 批量修改状态接口 */
    return request({
        url: `${requestPath.member}/member/batch/update/status/${data.status}`,
        method: 'post',
        data: data.id
    })
}

export function batchResetCodeAPI(data) { /* 批量重置密码接口 */
    return request({
        url: `${requestPath.member}/o-member/batch/update`,
        method: 'post',
        data
    })
}


/* export function viewUserInfo(data) {  分页查看用户信息接口
    return request({
        url: `${requestPath.member}/organmember/export`,
        method: 'get',
        params: data
    })
} */

export function exportAPI(data) { /* 导出会员接口 */
    return request({
        url: `${requestPath.member}/organmember/export`,
        method: 'get',
        params: data
    })
}

export function searchMemberAPI(oid) { /* 查询机构会员 */
    return request({
        url: `${requestPath.member}/o-member/${oid}`,
        method: 'get'
    })
}