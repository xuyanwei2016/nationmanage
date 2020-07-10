import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'


// 获取列表
export function getPublisherListAPI(params) {
    return request({
        url: `${requestPath.member}/online-publisher/page`,
        method: 'get',
        params
    })
}
// 批量审核
export function updateStatusAPI(data){
    return request({
        url:`${requestPath.member}/online-publisher/batch/update/status`,
        method:'post',
        data
    })
}
// 批量删除
export function bachDeleteAPI(data){
    return request({
        url:`${requestPath.member}/online-publisher/batch/delete`,
        method:'post',
        data
    })
}
//查询详情
export function getDetailsListAPI(params){
    return request({
        url:`${requestPath.member}/online-publisher/${params}`,
        method:'get'
    })
}



// 资源管理
// 获取列表
export function getResourceListAPI(params){
    return request({
        url:`${requestPath.resourceWap}/resource-manage/page`,
        method:'get',
        params
    })
}
// 获取下拉所属类型
export function getDictionaryResoursAPI(params){
    return request({
        url:`${requestPath.common}/dictionary/page`,
        method:'get',
        params
    })
}
// 根据作者获取下拉所属类型
export function getAutherResoursAPI(params){
    return request({
        url:`${requestPath.commonfg}/dictionary/ydcc`,
        method:'get',
        params
    })
}
// 批量审核、上架，下架
export function updataStatusAPI(data){
    return request({
        url:`${requestPath.resourceWap}/resource-manage/batch/update/status`,
        method:'post',
        data
    })
}
// 批量删除
export function bachDeleteResourAPI(data){
    return request({
        url:`${requestPath.resourceWap}/resource-manage/batch/delete`,
        method:'post',
        data
    })
}
// 添加
export function resourceSaveAPI(data){
    return request({
        url:`${requestPath.resourceWap}/resource-manage/save`,
        method:'post',
        data
    })
}
// 修改
export function resourceUpdataAPI(data){
    return request({
        url:`${requestPath.resourceWap}/resource-manage/update`,
        method:'post',
        data
    })
}
// 详情
export function getDetailAPI(oid){
    return request({
        url:`${requestPath.resourceWap}/resource-manage/get/${oid}`,
        method:'get'
    })
}
