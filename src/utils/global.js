export const requestPath = {
    common: '/sysuser/bg',
    commonfg: '/sysuser/fg',
    member: '/member/bg',
    book: '/book/bg',
    stock: '/repertory/bg',
    marketing: '/marketing/bg',
    order: '/order/bg',
    resource: '/resource/bg',
    ydcc: '/resource/ydcc',
    third: '/third',
    file: '/file/file/',
    pay: '/pay/bg',
    payment: '/pay/fg',
    resourceWap:'/resource/wap'
        // ipPort:'http://122.14.50.6:8096',
        // ipPort:'http://192.168.2.7:8096',
}

// export const uploadUrl = `http://rsks.class.com.cn/file/`
// export const uploadUrl = `http://122.14.50.6:8096/file/`
// export const uploadUrl = `http://192.168.2.231/file/file/`

//export const uploadEbook = `http://test16.zhongdianyun.com/file/`
/*<<<<<<< HEAD
export const uploadEbook = `${process.env.BASE_API}file/`
//export const uploadUrl = `http://test16.zhongdianyun.com/file/file/`
export const uploadUrl = `${process.env.BASE_API}file/file/`

export const uploadZip = 'http://test16.zhongdianyun.com:2018/'
=======*/
export const uploadEbook = `${process.env.BASE_API}/file/`
//export const uploadUrl = `http://test16.zhongdianyun.com/file/file/`
export const uploadUrl = `${process.env.BASE_API}/file/file/`

    // BASE_API: '"http://rsks.class.com.cn"'
export const uploadZip = '${process.env.BASE_API}'

export const downloadPath = 'download'
export const uploadPath = 'upload'
export const baseUrl = `${process.env.BASE_API}`

