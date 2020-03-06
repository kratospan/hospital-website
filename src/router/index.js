import Vue from "vue"
import VueRouter from "vue-router"

// 引入组件

import login from '../page/login.vue'
import home from '../page/home.vue'
import notFound from '../page/404.vue'
//就诊人管理
import addPatient from '../page/patient/addPatient.vue'
import selectPatient from '../page/patient/selectPatient.vue'
import deletePatient from '../page/patient/deletePatient.vue'
import updatePatient from '../page/patient/updatePatient.vue'
//医生管理
import addDoctor from '../page/doctor/addDoctor.vue'
import deleteDoctor from '../page/doctor/deleteDoctor.vue'
import selectDoctor from '../page/doctor/selectDoctor.vue'
import updateDoctor from '../page/doctor/updateDoctor.vue'
//用户管理
import addUser from '../page/user/addUser.vue'
import deleteUser from '../page/user/deleteUser.vue'
import selectUser from '../page/user/selectUser.vue'
import updateUser from '../page/user/updateUser.vue'
//体检套餐管理
import addMeal from '../page/meal/addMeal.vue'
import deleteMeal from '../page/meal/deleteMeal.vue'
import selectMeal from '../page/meal/selectMeal.vue'
import updateMeal from '../page/meal/updateMeal.vue'
//体检管理
import addTest from '../page/test/addTest.vue'
import deleteTest from '../page/test/deleteTest.vue'
import selectTest from '../page/test/selectTest.vue'
import updateTest from '../page/test/updateTest.vue'
//挂号管理
import addRegister from '../page/register/addRegister.vue'
import deleteRegister from '../page/register/deleteRegister.vue'
import selectRegister from '../page/register/selectRegister.vue'
import updateRegister from '../page/register/updateRegister.vue'
//排班管理
import addSchedul from '../page/schedul/addSchedul.vue'
import deleteSchedul from '../page/schedul/deleteSchedul.vue'
import selectSchedul from '../page/schedul/selectSchedul.vue'
import updateSchedul from '../page/schedul/updateSchedul.vue'

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
    name: '就诊人管理',
    iconCls: 'el-icon-message', //图标样式class
    children: [
      {
        path: 'addPatient',
        component: addPatient,
        name: '添加就诊人信息'
      },
      {
        path: 'deletePatient',
        component: deletePatient,
        name: '删除就诊人信息'
      },
      {
        path: 'selectPatient',
        component: selectPatient,
        name: '查询就诊人信息'
      },{
        path: 'updatePatient',
        component: updatePatient,
        name: '修改就诊人信息'
      }
    ]
  },
  {
    path: '/doctor',
    component: home,
    name: '医生管理',
    iconCls: 'el-icon-message',
    children: [
      {
        path: 'addDoctor',
        component: addDoctor,
        name: '添加医生信息'
      },
      {
        path: 'deleteDoctor',
        component: deleteDoctor,
        name: '删除医生信息'
      },
      {
        path: 'selectDoctor',
        component: selectDoctor,
        name: '查询医生信息'
      },
      {
        path: 'updateDoctor',
        component: updateDoctor,
        name: '修改医生信息'
      },
    ]
  },
  {
    path: '/register',
    component: home,
    name: '挂号管理',
    iconCls: 'el-icon-message',
    children: [
      {
        path: 'addRegister',
        component: addRegister,
        name: '添加挂号信息'
      },
      {
        path: 'deleteRegister',
        component: deleteRegister,
        name: '删除挂号信息'
      },
      {
        path: 'selectRegister',
        component: selectRegister,
        name: '查询挂号信息'
      },
      {
        path: 'updateRegister',
        component: updateRegister,
        name: '修改挂号信息'
      },
    ]
  },
  {
    path: '/meal',
    component: home,
    name: '体检套餐管理',
    iconCls: 'el-icon-message',
    children: [
      {
        path: 'addMeal',
        component: addMeal,
        name: '添加体检套餐信息'
      },
      {
        path: 'deleteMeal',
        component: deleteMeal,
        name: '删除体检套餐信息'
      },
      {
        path: 'selectMeal',
        component: selectMeal,
        name: '查询体检套餐信息'
      },
      {
        path: 'updateMeal',
        component: updateMeal,
        name: '修改体检套餐信息'
      },
    ]
  },
  {
    path: '/test',
    component: home,
    name: '体检管理',
    iconCls: 'el-icon-message',
    children: [
      {
        path: 'addTest',
        component: addTest,
        name: '添加体检信息'
      },
      {
        path: 'deleteTest',
        component: deleteTest,
        name: '删除体检信息'
      },
      {
        path: 'selectTest',
        component: selectTest,
        name: '查询体检信息'
      },
      {
        path: 'updateTest',
        component: updateTest,
        name: '修改体检信息'
      },
    ]
  },
  {
    path: '/schdul',
    component: home,
    name: '排班管理',
    iconCls: 'el-icon-message',
    children: [
      {
        path: 'addSchedul',
        component: addSchedul,
        name: '添加排班信息'
      },
      {
        path: 'deleteSchedul',
        component: deleteSchedul,
        name: '删除排班信息'
      },
      {
        path: 'selectSchedul',
        component: selectSchedul,
        name: '查询排班信息'
      },
      {
        path: 'updateSchedul',
        component: updateSchedul,
        name: '修改排班信息'
      },
    ]
  }
];
var router = new VueRouter({
    routes
})
export default router;
