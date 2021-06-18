/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const systemManageRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/privilege',
  alwaysShow: true, // will always show the root menu
  name: 'systemManage',
  meta: {
    title: '系统管理',
    icon: 'table'
  },
  children: [
    {
      path: 'privilege',
      component: () => import('@/views/system/privilege/index'),
      name: 'privilegeManage',
      meta: { title: '权限管理' }
    },
    {
      path: 'role',
      component: () => import('@/views/system/role/index'),
      name: 'roleManage',
      meta: { title: '角色管理' }
    },
    {
      path: 'organ',
      component: () => import('@/views/system/organ/index'),
      name: 'organManage',
      meta: { title: '机构管理' }
    },
    {
      path: 'user',
      component: () => import('@/views/system/user/index'),
      name: 'userManage',
      meta: { title: '用户管理' }
    },
    {
      path: 'sysConfig',
      component: () => import('@/views/system/config/index'),
      name: 'sysConfigManage',
      meta: { title: '参数配置' }
    }
  ]
}
export default systemManageRouter
