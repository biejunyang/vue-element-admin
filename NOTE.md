1、请求统一封装处理/util/request.js

2、权限控制
    a、菜单路由权限控制,route.name作为路由的权限id
    b、页面按钮等元素权限控制
         v-if="checkPermission('admin')"或者v-permission="'admin'"    