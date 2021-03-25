import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/organ',
    method: 'get',
    params: query,
    baseURL: '/roleApi'
  })
}
export function fetchTree(query) {
  return request({
    url: '/organ/tree',
    method: 'get',
    params: query,
    baseURL: '/roleApi'
  })
}

export function createOrgan(data) {
  return request({
    url: '/organ',
    method: 'post',
    data,
    baseURL: '/roleApi'
  })
}

export function updateOrgan(data) {
  return request({
    url: '/organ',
    method: 'put',
    data,
    baseURL: '/roleApi'
  })
}

export function deleteOrgan(id) {
  return request({
    url: `/organ/${id}`,
    method: 'delete',
    baseURL: '/roleApi'
  })
}
