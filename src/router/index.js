import Vue from "vue"
import VueRouter from "vue-router"

// 引入组件

import login from '../page/login.vue'
import home from '../page/home.vue'
import notFound from '../page/404.vue'

//信息管理
import patient from '../page/menu/patient.vue'
import doctor from '../page/menu/doctor.vue'
import meal from '../page/menu/meal.vue'
import register from '../page/menu/register.vue'
import schedul from '../page/menu/schedul.vue'
import test from '../page/menu/test.vue'
import user from '../page/menu/user.vue'
import office from '../page/menu/office.vue'
import upload from '../page/menu/upload.vue'

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

let routes = [
  {
    path: "/",
    redirect: '/login',
    hidden: true
  },
  {
    path: '/login',
    component: login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: notFound,
    name: '',
    hidden: true
  },
  {
    path: '/patient',
    component: home,
    name: '信息管理',
    iconCls: 'el-icon-menu', //图标样式class
    children: [
      {
        path: 'patient',
        component: patient,
        name: '就诊人管理'
      },
      {
        path: 'doctor',
        component: doctor,
        name: '医生管理'
      },
      {
        path: 'register',
        component: register,
        name: '挂号管理'
      },
      {
        path: 'meal',
        component: meal,
        name: '体检套餐管理'
      },
      {
        path: 'schedul',
        component: schedul,
        name: '排班管理'
      },
      {
        path: 'test',
        component: test,
        name: '体检管理'
      },
      {
        path: 'office',
        component: office,
        name: '部门和科室管理'
      },
      {
        path: 'user',
        component: user,
        name: '用户管理'
      },
      {
        path: 'upload',
        component: upload,
        name: '上传文件'
      },
    ]
  },
];
var router = new VueRouter({
    routes
})
export default router;
