import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/role',
    method: 'get',
    params: query,
    baseURL: '/roleApi'
  })
}

export function createRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data,
    baseURL: '/roleApi'
  })
}

export function updateRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data,
    baseURL: '/roleApi'
  })
}

export function deleteRole(params) {
  return request({
    url: '/role',
    method: 'delete',
    params: params,
    baseURL: '/roleApi',
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function fetchRolePrivilegeIds(query) {
  return request({
    url: '/role/privileges',
    method: 'get',
    params: query,
    baseURL: '/roleApi'
  })
}

export function grantPrivileges(data) {
  return request({
    url: '/role/grant',
    method: 'post',
    data,
    baseURL: '/roleApi'
  })
}