import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding

    if (value && value.length > 0) {
      const adminType = store.getters.adminType
      let hasPermission = false
      if (adminType === 1) {
        hasPermission = true
      } else {
        const authorities = store.getters && store.getters.authorities
        const permissionId = value
        hasPermission = authorities.some(authority => {
          return permissionId === authority
        })
      }
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permissionId! Like v-permission="'permissionId'"`)
    }
  }
}
