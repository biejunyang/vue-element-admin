import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/user',
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

export function deleteUser(userId) {
  return request({
    url: `/user/{userId}`,
    method: 'delete',
    // params: params,
    baseURL: '/roleApi',
    // paramsSerializer: params => {
    //   return qs.stringify(params, { indices: false })
    // }
  })
}

export function fetchPrivileges(query) {
  return request({
    url: '/user/privileges',
    method: 'get',
    params: query,
    baseURL: '/roleApi'
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