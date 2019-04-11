# iView-project

This project is build for Vue.js 2 + vue-router + webpack2 + iView 3, just install and run.

### 简介
```bush
基于iview的前台系统，使用axios与后端（witness项目）通信
webpack build后部署到nginx
```

### 功能
```bush
前台：
  修改个人信息,上传头像(直接上传到腾讯云COS）
  发帖，回帖(回复）
  搜索帖子
  登陆（基于oauth2协议，使用的是usernamepassword授权模式,token存储到localstorage中）与第三方登录（github）
  注册
后台：
  用户管理，角色权限管理，菜单管理..
```
## Install
```bush
// install dependencies
npm install
```
## Run
### Development
```bush
// For the first time, run init to create index.html
npm run init
npm run dev
```
### Production(Build)
```bush
npm run build
```

