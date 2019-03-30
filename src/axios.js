import axios from 'axios';
import router from './router';
import store from './store/store';

//axios发ajax请求时每次都会带的header信息里带上了accesstoken,来验证权限
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
//区分未获得token时与获得token后的Authorization
if(localStorage.getItem("currentUserAccessToken") == null || localStorage.getItem("currentUserAccessToken") == ''){
    axios.defaults.headers.common['Authorization'] ='';
}else{
    axios.defaults.headers.common['Authorization'] = 'bearer '+ localStorage.getItem("currentUserAccessToken");
}
axios.defaults.baseURL = '/wh';

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    store.commit('user/clearUser');
                    router.replace({
                        path: '/backstage',
                        query: {redirect: router.currentRoute.fullPath}
                    });
                    break;
                case 403:
                    // 403 无权限，跳转到首页
                    router.replace({
                        path: '/backstage/base/home',
                        query: {redirect: router.currentRoute.fullPath}
                    });
                    break;
            }
        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        /*return Promise.reject(error.response.data)*/
        return Promise.reject('');
    });

export default axios;
