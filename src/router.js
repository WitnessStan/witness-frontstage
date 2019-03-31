import iView from 'iview';
import VueRouter from 'vue-router';
import Vue from 'vue';
import Util from './libs/util';

Vue.use(VueRouter);

const routers = [
	{
		path: '/',
		meta: {
			title: 'frontstage'
		},
		component: (resolve) => require(['./views/frontHomepage.vue'], resolve),
		children: [
            {
                path: '',
                meta: {
                    title: ''
                },
                component: (reslove) => require(['./views/favorite/favorite.vue'], reslove)
            },
			{
				path: 'favorite',
				meta: {
					title: 'favorite'
				},
				component: (reslove) => require(['./views/favorite/favorite.vue'], reslove)
			}
		]
	},
    {
        path: '/forum',
        meta: {
            title: 'forum'
        },
        component: (reslove) => require(['./views/frontHomepage.vue'], reslove),
        children: [
            {
                path: '',
                meta: {
                    title: '论坛'
                },
                component: (reslove) => require(['./views/forum/forum.vue'], reslove)
            },
            {
                path: 'create',
                meta: {
                    title: '发帖'
                },
                component: (reslove) => require(['./views/forum/createpost.vue'], reslove)
            },
            {
                path: 'posts',
                meta: {
                    title: '帖子列表'
                },
                component: (reslove) => require(['./views/forum/mypost.vue'], reslove)
            },
            {
                path: 'posts/details/*',
                meta: {
                    title: '帖子详情'
                },
                component: (reslove) => require(['./views/forum/postinfo.vue'], reslove)
            },
			{
				path: 'posts/edit/*',
				meta: {
					title: '编辑帖子'
				},
                component: (reslove) => require(['./views/forum/editpost.vue'], reslove)
			}
        ]
    },
	{
		path: '/login',
		meta: {
			title: 'login'
		},
		component: (resolve) => require(['./views/login.vue'], resolve)
	},
    {
        path: '/backstage',
        meta: {
            title: 'backstage'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
	{
		path: '/backstage/base',
		meta: {
			title: 'basepage',
			requiresAuth: true
		},
		component: (resolve) => require(['./views/base/base.vue'], resolve),
		children: [
			{
				path: 'home',
				meta: {
					title: 'homepage'
				},
				component: (reslove) => require(['./views/home/home.vue'], reslove)
			},
			{
				path: 'user',
				meta: {
					title: 'userpage'
				},
				component: (reslove) => require(['./views/user/user.vue'], reslove)
			},
			{
				path: 'menu',
				meta: {
					title: 'menupage'
				},
				component: (reslove) => require(['./views/menu/menu.vue'], reslove)
			},
			{
				path: 'role',
				meta: {
					title: 'rolepage'
				},
				component: (reslove) => require(['./views/role/role.vue'], reslove)
			}
		]
	},
	{
		path: '/successtest',
		meta: {
			title: 'successtest'
		},
		component: (resolve) => require(['./views/successtest.vue'], resolve)
	},
    {
        path: '*',
        component: (resolve) => require(['./views/error.vue'], resolve)
    }
];

// 路由配置
const RouterConfig = {
    mode: 'history',  //打包的时候用hash
    routes: routers
};
const router = new VueRouter(RouterConfig);
//每个路由跳转时检查是否带着requiresAuth为true的属性且带着accessToken
router.beforeEach((to, from, next) => {
	let token = window.localStorage.getItem("currentUserAccessToken");
	if(to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
		next({
			path: '/backstage',
			query: { redirect: to.fullPath }
		})
	}
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;