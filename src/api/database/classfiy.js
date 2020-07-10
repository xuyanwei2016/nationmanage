import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 获取自定义分类列表
export function getListAPI() {
    return request({
        url: `${requestPath.resource}/diytype/tree`,
        method: 'get'
    })
}

// 删除
export function deleteClassify(data) {
    return request({
        url: `${requestPath.resource}/diytype/delete`,
        method: 'post',
        data
    })
}

// 同级名称是否存在
export function isExist(data) {
    return request({
        url: `${requestPath.resource}/diytype/isExist/typeName?parentId=${data.parentId}&typeName=${data.typeName}`,
        method: 'get',
        data
    })
}

// 新增分类
export function addClassify(data) {
    return request({
        url: `${requestPath.resource}/diytype/save`,
        method: 'post',
        data
    })
}

// 修改分类
export function updateClassify(data) {
    return request({
        url: `${requestPath.resource}/diytype/update`,
        method: 'post',
        data
    })
}

