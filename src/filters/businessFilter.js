// 业务过滤器
export { parseTime, formatTime } from '@/utils'

// 用户性别过滤器
export function userSexFilter(sex) {
  if (sex === 1) {
    return '男'
  } else if (sex === 2) {
    return '女'
  } else if (sex === 3) {
    return '不明'
  }
  return ''
}

// 权限类型过滤器
export function privilegeTypeFilter(val) {
  if (val === 1) {
    return '目录'
  } else if (val === 2) {
    return '菜单'
  } else if (val === 3) {
    return '按钮'
  }
  return ''
}
