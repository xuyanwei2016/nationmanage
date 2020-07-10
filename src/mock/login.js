import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  login: () => {
    return {
        code:0,
        data:{
          token:'MockData'
        }
    }
  },
  op: () => {
    return {
      "code": 0,
      "data": [
        "string"
      ],
      "msg": "string",
      "status": false,
      "timestamp": "2018-08-01T06:16:53.334Z"
    }
  },
  permissions: () => {
    return {
      data:{
        mList:['03','0301']
      }
    }
  },
  logout: () => 'success'
}
