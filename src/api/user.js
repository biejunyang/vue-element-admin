import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  const postData = {
    grant_type: 'password',
    client_id: 'client',
    client_secret: 'client',
    username: data.username,
    password: data.password
  }
  return request({
    // url: '/vue-element-admin/user/login',
    // url: '/oauth/token?grant_type=password&username=admin&password=123456&client_id=client&client_secret=client',
    url: '/oauth/token',
    method: 'post',
    data: qs.stringify(postData),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    baseURL: '/authApi'
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/userInfo',
    method: 'get',
    // params: { token },
    baseURL: '/authApi'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
