import Vue from 'vue'
import Router from 'vue-router'
import 'babel-polyfill'

const routerOptions = [
  { path: '/', component: 'UserManager' },
  { path: '/register', component: 'Register' },
  { path: '/login', component: 'Login' },
  { path: '/parkManager', component: 'ParkManager' },
  { path: '/reportManager', component: 'ReportManager' },
  { path: '/stats', component: 'Stats' },
  { path: '/config', component: 'Config' },
  { path: '/workTime', component: 'WorkTime' },
  { path: '/environment', component: 'Environment' },
  { path: '/qtest', component: 'QueryTest' }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes
})
