import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value.length > 0) {
    const adminType = store.getters.adminType
    if (adminType === 1) {
      return true
    }
    const authorities = store.getters && store.getters.authorities
    const permissionId = value
    const hasPermission = authorities.some(authority => {
      return permissionId === authority
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need permissionId! Like v-permission="'permissionId'"`)
    return false
  }
}
