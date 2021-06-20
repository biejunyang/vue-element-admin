import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: `/sysConfig/${query.page}/${query.size}`,
    method: 'get',
    params: query,
    baseURL: '/roleApi'
  })
}

export function createConfig(data) {
  return request({
    url: '/sysConfig',
    method: 'post',
    data,
    baseURL: '/roleApi'
  })
}

export function updateConfig(data) {
  return request({
    url: '/sysConfig',
    method: 'put',
    data,
    baseURL: '/roleApi'
  })
}

export function deleteConfig(params) {
  return request({
    url: '/sysConfig',
    method: 'delete',
    params: params,
    baseURL: '/roleApi',
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}
