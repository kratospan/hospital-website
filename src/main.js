// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Router from 'vue-router';
import App from './App.vue';
import 'font-awesome/css/font-awesome.min.css';
import router from "./router";
import VCharts from 'v-charts'

Vue.use(ElementUI,{size: 'mini',align : 'center'});
Vue.use(Router);
Vue.use(VCharts);

Vue.config.productionTip = false
 /**
  * 判断当前是否登录，未登录不能跳转路由
  * 防止未登录状态下直接输入路由跳转
  */
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({
            path: '/login'
        });
    } else {
        next();
    }
});

// 引入路由
new Vue({
    el: '#app',
    store,
    router, // 注入到根实例中
    render: h => h(App)
});

//全局方法请求request
Vue.prototype.getToken = function (){
    return {
        code:400,
        msg : '请求错误',
        data : []
    }
}

// Vue.prototype.gRequest = function (url,data){
//     var return_data = '初始化数据'
//       //第一步：创建需要的对象
//       var httpRequest = new XMLHttpRequest();
//       //第二步:设置请求的url
//     //   var url = '/api/patient/add_patient'
//       //第三步：打开连接
//       httpRequest.open('POST', url, false)
//       //第四步：设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
//       httpRequest.setRequestHeader("Content-type","application/json")
//       //第六步：发送请求 将json写入send中
//       httpRequest.send(JSON.stringify(data))
//       //第七步：获取返回的信息  请求后的回调接口，可将请求成功后要执行的程序写在其中
//       httpRequest.onreadystatechange = function () {
//         //验证请求是否发送成功
//         if (httpRequest.readyState == 4 && httpRequest.status == 200) {
//           var res = httpRequest.responseText
//           res = JSON.parse(res)
//           return res
//         }else{
//             return_data = '没有数据'
//         }
//       }
// }

Vue.prototype.gRequest = function (url,data){
      return new Promise((resolve,reject) => {
          //第一步：创建需要的对象
        var httpRequest = new XMLHttpRequest();
        //第二步:设置请求的url

        //第三步：打开连接
        httpRequest.open('POST', url, true)
        //第四步：设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.setRequestHeader("Content-type","application/json")
        //第六步：发送请求 将json写入send中
        httpRequest.send(JSON.stringify(data))
        //第七步：获取返回的信息  请求后的回调接口，可将请求成功后要执行的程序写在其中
        httpRequest.onreadystatechange = function () {
            //验证请求是否发送成功
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var res = JSON.parse(httpRequest.responseText)
                resolve(res)//获取到服务端返回的数据
            }else{

            }
        }
        // break;
      })
}

Vue.prototype.returnMsg = function(content,type = 'success'){
    this.$message({
        message: content,
        type: type
      });
}

Vue.prototype.turnDateToTime = function(data){
    // console.log(123123,data)
    var year = 2020
    var month = data.getMonth() + 1
    var date = data.getDate()
    var time = year+'-'+month+'-'+date+' 8:0:0'
    var day = (new Date(time).getTime())/1000
    return day
}

