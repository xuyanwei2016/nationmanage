import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) { //列表
    return request({
        url: `${requestPath.resource}/course-library/page`,
        method: 'get',
        params
    })
}

export function batchDeleteAPI(data) { //批量删除
    console.log(data);

    return request({
        url: `${requestPath.resource}/course-library/batch/delete`,
        method: 'post',
        data
    })
}

export function upDownAPI(data) { //上架
    return request({
        url: `${requestPath.resource}/course-library/batch/update/updown?status=${data.status}`,
        method: 'post',
        data: data.ids
    })
}

export function saveAPI(data) { //新增
    console.log(data);
    return request({
        url: `${requestPath.resource}/course-library/save`,
        method: 'post',
        data
    })
}

export function editAPI(data) { //编辑
    console.log(data);
    return request({
        url: `${requestPath.resource}/course-library/update`,
        method: 'post',
        data
    })
}

export function detailsAPI(params) { //详情列表
    return request({
        url: `${requestPath.resource}/course-library/get/${params}`,
        method: 'get',
    })
}

export function getRelationListAPI(params) { //已关联列表
    return request({
        url: `${requestPath.resource}/course-library/relation-resource/page`,
        method: 'get',
        params
    })
}

export function getNotRelationListAPI(params) { //未关联列表
    return request({
        url: `${requestPath.resource}/course-library/relation-resource/pop-page`,
        method: 'get',
        params
    })
}

export function relationAPI(data) { //关联
    return request({
        url: `${requestPath.resource}/course-library/relation-resource/save?courseId=${data.id}`,
        method: 'post',
        data: data.ids
    })
}

export function canceleRelationAPI(data) { //取消关联
    return request({
        url: `${requestPath.resource}/course-library/relation-resource/batch/delete`,
        method: 'post',
        data
    })
}

export function editNumAPI(data) { //修改排序号
    return request({
        url: `${requestPath.resource}/course-library/relation-resource/update?sort=${data.id}`,
        method: 'post',
        data: data.num
    })
}