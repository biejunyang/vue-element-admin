import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: `/user/${query.current}/${query.size}`,
    method: 'get',
    params: query,
    baseURL: '/roleApi'
  })
}

export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data,
    baseURL: '/roleApi'
  })
}

export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data,
    baseURL: '/roleApi'
  })
}

export function deleteUser(params) {
  return request({
    url: '/user',
    method: 'delete',
    params: params,
    baseURL: '/roleApi',
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function fetchRoles(query) {
  return request({
    url: '/user/roles',
    method: 'get',
    params: query,
    baseURL: '/roleApi'
  })
}

export function grantRoles(data) {
  return request({
    url: '/user/grantRole',
    method: 'post',
    data,
    baseURL: '/roleApi'
  })
}
