import request from '@/utils/request'

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
    url: '/oauth/token?grant_type=passwordx&username=adminxx&password=123456aaaa&client_id=clienxt&client_secret=clientx',
    method: 'post',
    // data: postData,
    baseURL: '/authApi'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
