<style>
</style>
<template>
	<div>
		<div>
			<Row style="margin-bottom: 25px;">
				<Col span="8">登录名：
					<Input v-model="loginName" placeholder="输入登录名..." style="width: 300px" />
				</Col>
				<Col span="8"><Button type="primary" shape="circle" icon="ios-search" @click="search()">搜索</Button></Col>
			</Row>	
		</div>
		<div>
			<ul>
				<li>
					<Button type="primary" icon="md-add" @click="addNewUser()">添加</Button>
					<Button type="warning" icon="md-build" @click="alterUser()">修改</button>
					<Button type="error" icon="md-alert" @click="deleteUser()">删除</Button>
				</li>
				<li>
					<div style="padding: 10px 0;">
						<Table border :columns="columns1" :data="data1" :height="280" @on-selection-change="s=>{selectUser(s)}" @on-row-dbclick=""></Table>
					</div>
				</li>
				<li>
					<div style="text-align: right;">
						<Page :total="total" :page-size="pageInfo.pageSize" show-elevator show-total @on-change="e=>{changePage(e)}"></Page>
					</div>
				</li>
			</ul>
		</div>
		<Modal :loading="loading" :mask-closable="false" v-model="newUserVisiable" :visible.sync="newUserVisiable" title="添加" @on-ok="newUserOK('newUser')">
			<Form ref="newUser" :model="newUser" :rules="newUserRules" :label-width="80">
				<Row>
					<Col span="12">
						<FormItem prop="loginName" label="登录名">
							<Input v-model="newUser.loginName" type="text"/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem prop="name" label="用户名">
							<Input v-model="newUser.name" type="text"/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem prop="password" label="密码">
							<Input v-model="newUser.password" type="password"/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem prop="password_confirm" label="确认密码">
							<Input v-model="newUser.password_confirm" type="password"/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem prop="email" label="邮箱">
							<Input v-model="newUser.email" type="email"/>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</Modal>
		<Modal :loading="loading" :mask-closable="false" v-model="oldToNewUserVisiable" :visible.sync="oldToNewUserVisiable" title="添加" @on-ok="alterUserOK('oldToNewUser')">
			<Form ref="oldToNewUser" :model="oldToNewUser" :rules="oldToNewUserRules" :label-width="80">
				<Row>
					<Col span="12">
						<FormItem prop="loginName" label="登录名">
							<Input v-model="oldToNewUser.loginName" type="text"/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem prop="name" label="用户名">
							<Input v-model="oldToNewUser.name" type="text"/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem prop="password" label="密码">
							<Input v-model="oldToNewUser.password" type="password"/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem prop="password_confirm" label="确认密码">
							<Input v-model="oldToNewUser.password_confirm" type="password"/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem prop="email" label="邮箱">
							<Input v-model="oldToNewUser.email" type="email"/>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</Modal>
		<Modal :mask-closable="false" v-model="deleteUserVisiable" :visible.sync="deleteUserVisiable" title="删除用户" @on-ok="deleteUserOK()">
			<p>确认要删除嘛？</p>
		</Modal>
		<Modal v-model="roleVisiable" :visible.sync="roleVisiable" width="500" title="配置角色" @on-ok="setRoleOk()">
			<div>
				<Table border :columns="columns2" :data="data2" :height="260"  @on-selection-change="s=>{selectRoles(s)}"></Table>
			</div>
		</Modal>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				count: 0,
				groupId: null,
				/*登录名*/
				loginName: null,
				/*总页数*/
				total: null,
				/**/
				pageInfo: {
					pageSize: 5,
					page: 1
				},
				loading: true,
				columns1: [
					{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '登录名',
						key: 'loginName'
					},
					{
						title: '用户名',
						key: 'name'
					},
					{
						title: '电子邮箱',
						key: 'email'
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
											this.setRelation(params.row)
										}
									}
								}, '配置角色')
							]);
						}
					}
				],
				data1: [],
				/*新建user*/
				newUser: {
					id:null,
					loginName: null,
					name: null,
					password: null,
					password_confirm: null,
					email: null
				},
				/*显示新建user窗口*/
				newUserVisiable: false,
				/*验证新建user*/
				newUserRules: {
					loginName: [
						{ type: 'string', required: true, message: '请输入登录名', trigger: 'blur'}
					],
					name: [
						{ type: 'string', required: true, message: '请输入用户名', trigger: 'blur'}
					],
					password: [
						{ type:'string',required: true, message: '输入密码', trigger: 'blur' }
					],
					password_confirm: [
						{ type:'string',required: true, message: '再次输入密码', trigger: 'blur' }
					],
					email: [
						{ required: true, message: '邮箱不能为空', trigger: 'blur' },
						{ type: 'email',message: '邮箱格式错误', trigger: 'blur'}
					]
				},
				oldToNewUser: {
					id:null,
					loginName: null,
					name: null,
					password: null,
					password_confirm: null,
					email: null
				},
				oldToNewUserVisiable: false,
				oldToNewUserRules: {
					loginName: [
						{ type: 'string', required: true, message: '请输入登录名', trigger: 'blur'}
					],
					name: [
						{ type: 'string', required: true, message: '请输入用户名', trigger: 'blur'}
					],
					password: [
						{ type:'string',required: true, message: '输入密码', trigger: 'blur' }
					],
					password_confirm: [
						{ type:'string',required: true, message: '再次输入密码', trigger: 'blur' }
					],
					email: [
						{ required: true, message: '邮箱不能为空', trigger: 'blur' },
						{ type: 'email',message: '邮箱格式错误', trigger: 'blur'}
					]
				},
				deleteUserVisiable: false,
				columns2: [
					{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '角色名称',
						width: 120,
						key: 'name'
					},
					{
						title: '描述',
						key: 'describe'
					}	
				],
				/*表数据*/
				data2:[],
				/*读取所有角色数据,为data2提供角色配置*/
				allRoles: [],
				/*role与user的关系list*/
				relationList: [],
				/*显示配置角色对话框*/
				roleVisiable: false
			}
		},
		mounted() {
			this.getTableInfo(this.pageInfo, this.loginName);
			this.axios({
				method: 'get',
				url: '/roles/all'
			}).then(function (response) {
					this.allRoles = response.data;
			}.bind(this)).catch(function (error) {
				alert(error);
			});
		},
		methods: {
			getTableInfo(pageInfo, loginName) {
				this.axios({
					method: 'get',
					url: '/users',
					params: {
						'pageSize': pageInfo.pageSize,
						'page': pageInfo.page - 1,
						'loginName': loginName
					}
				}).then(function(response) {
					this.data1 = response.data.data;
					this.total = response.data.totalCount;
				}.bind(this)).catch((error) => {
					alert(error);
				});
			},
			search() {
				this.pageInfo.page = 1;
				this.getTableInfo(this.pageInfo, this.loginName);
			},
			addNewUser() {
				this.newUserVisiable = true;
			},
			newUserOK(newUser) {
				this.$refs[newUser].validate((valid) => {
					if(valid) {
						if(this.newUser.password == this.newUser.password_confirm) {
							this.axios({
								method: 'post',
								url: '/users/user',
								data: this.newUser
							}).then(function(response) {
								//this.loginName = null;
								this.getTableInfo(this.pageInfo, this.loginName);
								this.$Message.info('新建成功');
							}.bind(this)).catch((error) => {
								alert(error);
							});
							this.newUserVisiable = false;
						} else {
							this.$Message.error('两次输入的密码不匹配！');
							this.loading = false;
							this.$nextTick(() => {
								this.loading = true;
							});
						}
					} else {
						setTimeout(() => {
							this.$Message.error("表单提交失败，请输入正确的格式！");
							this.loading = false;
							this.$nextTick(() => {
								this.loading = true;
							});	
						}, 1000);
					}
				});
			},
			alterUser() {
				if(this.count != 1) {
					this.$Message.warning("至少选择一项，且只能选择一项！")
					this.oldToNewUserVisiable = false;
				} else {
					this.oldToNewUserVisiable = true;
				}
			},
			initOldToNewUser() {
				this.oldToNewUser.id = null;
				this.oldToNewUser.loginName = null;
				this.oldToNewUser.name = null;
				this.oldToNewUser.email = null;
				this.oldToNewUser.password = null;
				this.oldToNewUser.password_confirm = null;
			},
			setOldToNewUser(oldUser) {
				this.oldToNewUser.id = oldUser.id;
				this.oldToNewUser.loginName = oldUser.loginName;
				this.oldToNewUser.name = oldUser.name;
				this.oldToNewUser.password = oldUser.password;
				this.oldToNewUser.email = oldUser.email;
			},
			alterUserOK(oldToNewUser) {
				this.$refs[oldToNewUser].validate((valid) => {
					if(valid) {
						if(this.oldToNewUser.password == this.oldToNewUser.password_confirm) {
							this.axios({
								method: 'put',
								url: '/users/'+this.oldToNewUser.id,
								data: this.oldToNewUser
							}).then(function(response) {
								this.$Message.info('修改成功');
								this.initOldToNewUser();
								this.getTableInfo(this.pageInfo, this.loginName);
							}.bind(this)).catch((error) => {
								alert(error);
							});
							this.oldToNewUserVisiable = false;
						} else {
							this.$Message.error('两次输入的密码不匹配！');
							this.loading = false;
							this.$nextTick(() => {
								this.loading = true;
							});
						}
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
			/*删除Role*/
			deleteUser() {
				if(this.count < 1) {
					this.$Message.warning('至少要选择一项！');
				}else{
					this.deleteUserVisiable = true;
				}
			},
			deleteUserOK() {
				if(this.groupId != null && this.groupId != "") {
					this.axios({
						method: 'delete',
						url: '/users',
						data: this.groupId
					}).then(function(resposne) {
						this.count = 0;
						this.groupId = null;
						this.$Message.info('删除成功');
						this.getTableInfo(this.pageInfo, this.loginName);
					}.bind(this)).catch((error) => {
						alert(error);
					});
				} else {
					this.$Message.error("发生错误！");
				}
			},
			/*左侧勾选栏数量记录*/
			selectUser(e) {
				if(e.length == 1){
					this.setOldToNewUser(e[0]);
				}
				this.setGroupId(e);   
			},
			/*用于记录删除组数*/ 
			setGroupId(e) {
				this.groupId=[];
				this.count=e.length;
				for (var i = 0; i < e.length; i++) {
					this.groupId.push(e[i].id);
				}
			},
			changePage(page) {
				this.pageInfo.page = page;
				this.getTableInfo(this.pageInfo, this.loginName);
			},
			/*点击配置角色按钮后*/
			setRelation(row) {
				this.roleVisiable = true;
				var roleList = [];
				this.data2 = [];
				this.axios({
					method: 'get',
					url: '/relations/'+row.id
				}).then(function(response) {
					//获取属于该用户的角色id
					for(var i = 0; i < response.data.length; i++) {
						roleList.push(response.data[i].roleId);
					}
					//data2根据情况push入用户已拥有的和未拥有的角色（打✔)
					for(var i = 0; i < this.allRoles.length; i++) {
						if(roleList.indexOf(this.allRoles[i].id) != -1) {
							this.data2.push({
								"id": this.allRoles[i].id,
								"name": this.allRoles[i].name,
								"describe": this.allRoles[i].describe,
								"userId": row.id,
								//check属性选中
								"_checked": true
							});
						} else {
							this.data2.push({
								"id": this.allRoles[i].id,
								"name": this.allRoles[i].name,
								"describe": this.allRoles[i].describe,
								"userId": row.id,
								"_checked": false
							});
						}
					}
				}.bind(this)).catch((error) => {
					alert(error);
				});
			},
			selectRoles(e) {
				this.relationList = [];
				if(e.length == 0) {
					this.relationList.push({
						"userId": this.data2[0].userId
					});
				}
				for (var i in e) {
					this.relationList.push({
						"userId": e[i].userId,
						"roleId": e[i].id
					});	  
				}
			},
			setRoleOk() {
				if(this.relationList != null){
					this.axios({
						method: 'post',
						url: '/relations',
						data: this.relationList
					}).then(function (response) {
							this.$Message.info('配置成功'); 
					}.bind(this)).catch(function (error) {
						alert(error);
					});
					this.relationList = null;	
				}
			}
		}
	};
</script>