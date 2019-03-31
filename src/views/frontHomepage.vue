<style scoped>
	.layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
		/*border-style: dashed;*/
		/*border-color: red;*/
        width: 50px;
        height: 50px;
        background: white;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 8px;
        left:10px;
    }
    .layout-nav{
		/*border-style: dashed;*/
		/*border-color: red;*/
		float: right;
    }
    .layout-footer-center{
		/*border-style: dashed;*/
		/*border-color: red;*/
        text-align: center;
    }
</style>
<template>
    <div class="layout">
        <Layout>
            <Header style="position: fixed;width: 100%;background: white;z-index: 1">
                <Menu mode="horizontal" theme="light" active-name="1" style="height: 100%;" @on-select="menu=>{selectMenu(menu)}">
                    <div class="layout-logo">
                        <router-link :to="('/')">
                            <img style="width: 50px;height: 50px;" src="../images/logo.jpg" />
                        </router-link>
					</div>
                    <div v-if="isLogin" class="layout-nav">
						<MenuItem name="1">
							<img v-if="user.img" style="width: 30px;height: 30px;border-radius: 100%;vertical-align: middle" :src="user.img" />
                            {{user.name}}
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-contact" />
                            个人信息
                        </MenuItem>
						<MenuItem name="3">
							<Icon type="ios-folder" />
							收藏夹
						</MenuItem>
                        <!--<MenuItem name="4">-->
                            <!--<Icon type="ios-chatbubbles-outline" />-->
                            <!--论坛-->
                        <!--</MenuItem>-->
                        <Submenu name="4">
                            <template slot="title">
                                <Icon type="md-list-box" />
                                交流
                            </template>
                            <MenuItem name="40">
                                <Icon type="ios-chatboxes-outline" />
                                论坛
                            </MenuItem>
                            <MenuItem name="41">
                                <Icon type="md-create" />
                                发帖
                            </MenuItem>
                            <MenuItem name="42">
                                <Icon type="md-list" />
                                我的帖子
                            </MenuItem>
                        </Submenu>
                        <MenuItem name="5">
                            <Icon type="md-arrow-round-forward" />
                            退出登录
                        </MenuItem>
                    </div>
					<div v-if="!isLogin" class="layout-nav">
                        <MenuItem name="40">
                            <Icon type="ios-chatboxes-outline" />
                            论坛
                        </MenuItem>
						<MenuItem name="6">
							<Icon type="md-arrow-round-forward" />登录
						</MenuItem>
                        <MenuItem name="7">
                            <Icon type="md-arrow-round-forward" />注册
                        </MenuItem>
					</div>
                </Menu>
            </Header>
            <Content :style="{margin: '88px 20px 0', background: '#f5f7f9', minHeight: '500px'}">
                <router-view></router-view>
            </Content>
            <Footer class="layout-footer-center">2011-2019 &copy; STAN</Footer>
        </Layout>
		
		<Modal :mask-closable="false" :visible.sync="userInfo" v-model="userInfo" width="600" title="个人信息">
			<Table border :columns="columns1" :data="data1"></Table>
		</Modal>
		
		<Modal :mask-closable="false" :loading="loading" :visible.sync="modalUserInfo" v-model="modalUserInfo" width="600" title="修改信息" @on-ok="modalUserInfoOk('modalUser')">
			<div class="left" style="float: left;border-style: dashed;width: 100px;">
				<img style="width: 50px;height: 50px;border-radius: 100%;display: block;border-style: dashed;margin-left: 20px;" :src="user.img"><br>
				<Button type="success" style="margin-left: 5px;" @click="showSetImg()">设置头像</Button>
<!-- 				<Upload action="http://www.baidu.com">
					<Button icon="ios-cloud-upload-outline">上传头像</Button>
				</Upload> -->
				
			</div>
			<div class="right" style="border-style: dashed;margin-left: 120px;">
				<Form ref="modalUser" :model="modalUser" :rules="ruleInline">
					<div style="margin-top: -10px;">
						<FormItem prop="name">
							用户名：<Input type="text" v-model="modalUser.name" placeholder="请输入用户名..." />
						</FormItem>
						<FormItem prop="email">
							邮箱：<Input type="text" v-model="modalUser.email" placeholder="" />
						</FormItem>
					</div>
				</Form>		
			</div>			
		</Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                user: {
                	loginName: '',
                	email: '',
                	img: '',
                	name: '',
                	user_type: ''
                },
				modalUser: {
					loginName: '',
					img: '',
					name: '',
					email: ''
				},
				ruleInline: {
					name: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					],
					email: [
						{ type: 'email',message: '邮箱格式错误', trigger: 'blur'}
					]
				},
				isLogin: false,
				userInfo: false,
				modalUserInfo: false,
				loading: true,
				setImgVisible: false,
				columns1: [
					{
						title: '登录名',
						key: 'loginName'
					},
					{
						title: '用户名',
						key: 'name'
					},
					{
						title: '邮箱',
						key: 'email'
					},
					{
						title: '用户类型',
						key: 'user_type'
					},
					{
						title: '操作',
						align: 'center',
						key: 'action',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'info'
									},
									on: {
										click: () => {
											this.updateUserInfo(params.row)
										}
									}
								}, '修改信息')
							]);
						}
					}
				],
				data1: [
					{
						loginName: '',
						name: '',
						email: '',
						user_type: ''
					}	
				]
            }
        },
		mounted (){
			//获取github回调code
			var code = this.$route.query.code;
			//有带code则为github登录,否则为密码登录或者未登录
			if(code != null && code != '') {
				this.githubLogin(code);
			} else {
				this.getPublicUser();
			}
		},
        methods: {
			setUser(e) {
				this.user.loginName = e.loginName;
				this.user.email = e.email;
				this.user.img = e.github_avatar_img;
				this.user.name = e.name;
				this.user.email = e.email;
				this.user.user_type = e.usertype;
			},
			setUserInfo(e) {
				this.data1[0].loginName = e.loginName;
				this.data1[0].name = e.name;
				this.data1[0].email = e.email;
				this.data1[0].user_type = e.usertype?'管理员':'普通用户';
			},
			setModalUser(e) {
				this.modalUser.name = e.name;
				this.modalUser.email = e.email;
				this.modalUser.loginName = e.loginName;
				this.modalUser.img = e.img;
			},
			updateUserInfo(e) {
				this.setModalUser(e);
				this.modalUserInfo = true;
			},
			getPublicUser() {
				if(localStorage.getItem("currentUserName") != null && localStorage.getItem("currentUserName") != '') {
					this.axios({
						method: 'get',
						url: '/public/user',
						params: {
							"login_name": localStorage.getItem("currentUserName")
						}
					}).then(function(response) {
						if(response.data != null && response.data != '') {
							this.setUser(response.data);
							this.setUserInfo(response.data);
							this.$Message.info(this.user.name);
							this.isLogin = true;
							this.$Message.warning("登陆成功！密码登录！");
						} else {
							//return Promise.resolve(0);
							this.$Message.warning("未登录状态下，限制功能(password)！");
						}
					}.bind(this)).catch((error) => {
						alert("error1");
					});
				} else if (localStorage.getItem('currentUserAccessToken') != null && localStorage.getItem('currentUserAccessToken') != '') {
                    this.axios({
                        method: 'get',
                        url: '/public/user'
                    }).then(function (response) {
                        if (response.data != null && response.data != '') {
                            this.setUser(response.data);
                            this.setUserInfo(response.data);
                            this.$Message.info(this.user.name);
                            this.isLogin = true;
                            this.$Message.warning("登陆成功！GITHUB");
                        } else {
                            //return Promise.resolve(0);
                            this.$Message.warning("未登录状态下，限制功能(github)！");
                        }
                    }.bind(this)).catch((error) => {
                        alert("error2");
                    });
                } else {
				    this.$Message.warning("未登录状态下，限制功能");
                }
			},
			clearUser() {
				this.user.name = '',
				this.user.loginName = '',
				this.user.img = '',
				this.user.email = '',
				this.user.user_type = ''
			},
            /*github登录*/
            githubLogin(code) {
                    this.$Spin.show();
					localStorage.setItem('currentUserName', '');
            		this.axios({
            				method: 'post',
            				url: '/authentication/github',
            				params: {
            					'code': code
             				}
// 							auth: {
// 								username: 'client',
// 								password: 'secret'
// 							}
            		}).then(function (response) {
						var userid = response.data;
						this.axios({
							method: 'post',
							url: '/oauth/token',
							params: {
								"username" : userid,
								"password" : 'DEFAULT',
								"grant_type" : "password",
								"scope" : "all"
							},
							auth: {
								username: 'client',
								password: 'secret'
							}
						}).then((response) => {
            				localStorage.setItem('currentUserAccessToken', response.data.access_token);
            				localStorage.setItem('currentUserRefreshToken', response.data.refresh_token);
            				//this.axios.defaults.headers.common['Authorization'] = 'bearer ' + localStorage.getItem('currentUserAccessToken');
            				this.$router.push({path: '/'});
            				location.reload();//重新加载页面，去获取githubuser信息
						}).catch((error) => {
							this.$Message.error("发生错误！");
							this.$Spin.hide();
						});
						this.$Spin.hide();
					}.bind(this)).catch(function(error) {
            				this.$Message.error('登陆失败');
                            this.$Spin.hide();
            		}.bind(this));										
            },
			selectMenu(menu) {
				if (menu == 1) {
				} else if (menu == 2) {
					this.userInfo = true;
				} else if (menu == 3) {
					this.$router.push('/favorite');
					//this.$store.dispatch('users/loginOUt', {'router': this.$router});
				} else if (menu == 40) {
					this.$router.push('/forum');
				} else if (menu == 41) {
				    this.$router.push("/forum/create");
                } else if (menu == 42) {
				    this.$router.push("/forum/posts");
                } else if (menu == 5) {
					this.clearUser();
					this.isLogin = false;
					this.$router.push('/login');
					// localStorage.setItem('currentUserAccessToken', '');
                    // localStorage.setItem('currentUserRefreshToken', '');
                    // localStorage.setItem('currentUserName', '');
                    localStorage.clear();
				} else if (menu == 6) {
					this.$router.push('/login');
				} else if (menu == 7) {
				    this.$router.push("/registration");
                }
			},
			modalUserInfoOk(e) {
				this.$refs[e].validate((valid) => {
					if(valid) {
						this.axios({
							method: 'put',
							url: '/public/user/'+this.modalUser.loginName,
							data: this.modalUser
						}).then(function(response) {
							this.user.name = response.data.name;
							this.user.email = response.data.email;
							this.data1[0].name = response.data.name;
							this.data1[0].email = response.data.email;
							this.$Message.info("修改成功！");
							this.modalUserInfo = false;
						}.bind(this)).catch((error) => {
							this.$Message.error("修改失败！");
							setTimeout(() => {
								this.loading = false;
								this.$nextTick(() => {
									this.loading = true;
								});
							}, 1000);
						});
					} else {
						this.$Message.error('表单提交失败，请输入正确的格式！');
						setTimeout(() => {
							this.loading = false;
							this.$nextTick(() => {
								this.loading = true;
							});
						}, 1000);
					}
				});
			},
			showSetImg() {
				this.setImgVisible = true;
			}
        }
    }
</script>