import Vue from 'vue';
import iView from 'iview';
//import VueRouter from 'vue-router';
import router from './router';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import axios from './axios'
import VueAxios from 'vue-axios'
import store from './store/store';

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor);
Vue.use(VueAxios,axios);
Vue.use(iView);

new Vue({
    el: '#app',
    router: router,
	store: store,
    render: h => h(App)
});
