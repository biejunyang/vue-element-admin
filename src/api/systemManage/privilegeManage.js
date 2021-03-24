import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/privilege',
    method: 'get',
    params: query,
    baseURL: '/roleApi'
  })
}

export function createPrivilege(data) {
  return request({
    url: '/privilege',
    method: 'post',
    data,
    baseURL: '/roleApi'
  })
}

export function updatePrivilege(data) {
  return request({
    url: '/privilege',
    method: 'put',
    data,
    baseURL: '/roleApi'
  })
}

export function deletePrivilege(id) {
  return request({
    url: `/privilege/${id}`,
    method: 'delete',
    baseURL: '/roleApi'
  })
}