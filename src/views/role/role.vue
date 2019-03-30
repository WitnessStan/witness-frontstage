<style>
</style>
<template>
	<div>
		<div>
			<ul>
				<li>
					<Button type="primary" icon="md-add" @click="addNewRole()">添加</Button>
					<Button type="warning" icon="md-build" @click="alterRole()">修改</button>
					<Button type="error" icon="md-alert" @click="deleteRole()">删除</Button>
				</li>
				<li>
					<div style="padding: 10px 0;">
						<Table border :columns="columns1" :data="data1" :height="280" @on-selection-change="s=>{selectRole(s)}" @on-row-dbclick=""></Table>
					</div>
				</li>
				<li>
					<div style="text-align: right;">
						<Page :total="total" :page-size="pageInfo.pageSize" show-elevator show-total @on-change="e=>{changePage(e)}"></Page>
					</div>
				</li>
			</ul>
		</div>
		<Modal :loading="loading" :mask-closable="false" v-model="newRoleVisiable" :visible.sync="newRoleVisiable" title="添加" @on-ok="newRoleOK('newRole')">
			<Form ref="newRole" :model="newRole" :rules="newRoleRule">
				<FormItem prop="name" label="角色名">
					<Input v-model="newRole.name" style="width: 200px" type="text"/>
				</FormItem>
				<FormItem prop="describe" label="描述">
					<Input v-model="newRole.describe" type="textarea" :rows="2"/>
				</FormItem>
				<Checkbox v-model="isAdmin" size="large">管理员</Checkbox>
			</Form>
		</Modal>
		<Modal :loading="loading" :mask-closable="false" v-model="alterRoleVisible" :visible.sync="alterRoleVisible" title="修改" @on-ok="alterRoleOK('oldToNewRole')">
			<Form ref="oldToNewRole" :model="oldToNewRole" :rules="oldToNewRoleRule">
				<FormItem prop="name" label="角色名">
					<Input v-model="oldToNewRole.name" style="width: 200px;" type="text"/>
				</FormItem>
				<FormItem prop="describe" label="描述">
					<Input v-model="oldToNewRole.describe" type="textarea" :rows="2"/>
				</FormItem>
				<Checkbox v-model="isAdmin" size="large">管理员</Checkbox>
			</Form>
		</Modal>
		<Modal :mask-closable="false" v-model="setRoleAuthorityVisible" :visible.sync="setRoleAuthorityVisible" title="权限设置" @on-ok="setAuthorityOK()">
			<Table border :columns="columns2" :data="data2"></Table>
		</Modal>
		<Modal :mask-closable="false" v-model="deleteRoleVisible" :visible.sync="deleteRoleVisible" title="删除角色" @on-ok="deleteRoleOK()">
			<p>确认要删除嘛？</p>
		</Modal>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				/*查出总记录数量*/
				total:null,
				/*选择的数量*/
				count:null,
				/*选中的组数据*/
				groupId:null,
				/*loading*/
				loading: true,
				/*新建role功能对话框是否显示*/
				newRoleVisiable: false,
				/*修改role功能对话框是否显示*/
				alterRoleVisible: false,
				/*设置权限功能对话框是否显示*/
				setRoleAuthorityVisible: false,
				/*删除role功能确认框是否显示*/
				deleteRoleVisible: false,
				/*是否是管理员*/
				isAdmin: false,
				/*newRole实体*/
				newRole: {
					id:null,
					role: null,
					name:null,
					modules:null,
					describe:null
				},
				/*newRole创建规则验证*/
				newRoleRule: {
					name: [
							{ type:'string',required: true, message: '请输入角色名', trigger: 'blur' }
					],
					describe: [
						{type:'string', required: true, message: '请输入描述', trigger: 'blur'}
					]
				},
				/*oldToNewRole实体*/
				oldToNewRole: {
					id:null,
					role: null,
					name:null,
					modules:null,
					describe:null
				},
				oldToNewRoleRule: {
					name: [
						{type: 'string', required: true, message: '请输入角色名', trigger: 'blur'}
					],
					describe: [
						{type:'string', required: true, message: '请输入描述', trigger: 'blur'}
					]
				},
				columns1: [
					{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: 'ROLE',
						key: 'role'
					},
					{
						title: '角色名称',
						key: 'name'
					},
					{
						title: '描述',
						key: 'describe'
					},
					{
						title: '权限',
						key: 'authority',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'primary'
									},
									on: {
										click: () => {
											//this.setRoleAuthorityVisible = true;
											this.setRoleAuthority(params.row);
										}
									}
								}, '权限设置')
							]);
						}
					}
				],
				/*用户信息table数据*/
				data1: [],
				/**/
				columns2: [
					{
						title: '权限',
						key: 'name'
					},
					{
						title: '操作',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('i-switch', {
									attrs: {
										'value' : params.row.value
									},
									on: {
										'on-change':(status) => {
											var i = this.moduleArr.indexOf(params.row.id+'');
											if(status) {
												if(i == -1) {
													this.moduleArr.push(params.row.id+'');
												}
											}else {
												if(i != -1) {
													this.moduleArr.splice(i,1);
												}
											}
										}
									}
								})
							]);
						}
					}
				],
				/*用户权限table数据*/
				data2: [],
				/*pageInfo实体*/
				pageInfo: {
					page:1,
					pageSize:6
				},
				//权限菜单
				submenusList: [],
				/*临时存储权限的数组*/
				moduleArr:[]
			}
		},
		mounted() {
			//初始化页面时获取用户表信息
			this.getTableInfo(this.pageInfo);
			//获取权限设置菜单(子菜单)
			this.axios({
				method: 'get',
				url: '/menus/submenus'
			}).then(function(response) {
				this.submenusList = response.data;
			}.bind(this)).catch((error) => {
				alert(this.submenusList);
			});
		},
		methods: {
			/*获取分页表数据*/
			getTableInfo(e) {
				this.axios({
					method: 'get',
					url: '/roles',
					params: {
						'page': e.page-1,
						'pageSize': e.pageSize
					}
				}).then(function(response) {
					this.data1 = response.data.data;
					this.total = response.data.totalCount;
				}.bind(this)).catch((error) => {
					alert(error);
				});
			},
			/*table左边的选择栏,传入的参数为selection即为已选项*/
			selectRole(e) {
				if(e.length == 1) {
					this.oldToNewRoleSet(e[0]);
				}
				this.setGroupId(e);
			},
			/*通过选中的行设置groupId的值*/
			setGroupId(e) {
				this.groupId = [];
				this.count = e.length;
				for(var i = 0; i < e.length; i++) {
					this.groupId.push(e[i].id);
				}
			},
			//点击页数切换页面,传入参数为点击的页面
			changePage(e) {
				this.pageInfo.page = e;
				this.getTableInfo(this.pageInfo);
			},
			/*newRole实体初始化*/
			initNewRole(){
				this.newRole.id = null;
				this.newRole.name = null;
				this.newRole.modules = null;
				this.newRole.describe = null;
				this.newRole.role = null;
			},
			/*oldToNewRole实体初始化*/
			initoldToNewRole(){
				this.oldToNewRole.id = null;
				this.oldToNewRole.name = null;
				this.oldToNewRole.modules = null;
				this.oldToNewRole.role = null;
				this.oldToNewRole.describe = null;
			},
			/*oldToNewRole设置*/
			oldToNewRoleSet(e){
				this.oldToNewRole.id = e.id;
				this.oldToNewRole.name = e.name;
				this.oldToNewRole.role = e.role;
				this.oldToNewRole.modules = e.modules;
				this.oldToNewRole.describe = e.describe;
				//判断修改前是否是admin
				this.isAdmin = ('ROLE_ADMIN' == this.oldToNewRole.role)?true:false;
			},
			/*点击添加newRole按钮*/
			addNewRole() {
				this.newRoleVisiable = true;
				this.initNewRole();
				//??????????????????????????????????????????
			},
			/*添加newRole,点击确认*/
			newRoleOK(newRole) {
				this.$refs[newRole].validate((valid) => {
					if(valid) {
						if (this.isAdmin == true) {
							this.newRole.role = 'ROLE_ADMIN';
						} else {
							this.newRole.role = 'ROLE_DEFAULT';
						}
						this.axios({
							method: 'post',
							url: '/roles/role',
							data: this.newRole
						}).then(function(response) {
							this.initNewRole();
							this.getTableInfo(this.pageInfo);
							this.$Message.info('创建成功！');
						}.bind(this)).catch((error) => {
							alert(error);
						});
						this.newRoleVisiable = false;
					}else{
						this.$Message.error('创建失败！请输入正确角色信息');
						setTimeout(() => {
							this.loading = false;
							//看不太懂
							this.$nextTick(function(){
								this.loading = true;
							});
						}, 1000);
					}
				});
			},
			/*点击修改Role按钮*/
			alterRole() {
				if(this.count < 1 || this.count > 1) {
					this.alterRoleVisible = false;
					this.$Message.warning('必须要选择一项，且只能选择一项');
				}else{
					this.alterRoleVisible = true;
				}
			},
			/*修改Role后点击确认按钮*/
			alterRoleOK(alterRole) {
				this.$refs[alterRole].validate((valid) => {
					if (this.isAdmin == true) {
						this.oldToNewRole.role = 'ROLE_ADMIN';
					} else {
						this.oldToNewRole.role = 'ROLE_DEFAULT';
					}
					if(valid) {
						this.axios({
							method: 'put',
							url: '/roles/'+this.oldToNewRole.id,
							data: this.oldToNewRole
						}).then(function(response) {
							this.initoldToNewRole();
							this.getTableInfo(this.pageInfo);
							this.$Message.info('修改成功！');
						}.bind(this)).catch((error) => {
							alert(error);
						});
						this.alterRoleVisible = false;
					}else {
						this.$Message.error('修改失败！请输入正确角色信息');
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
			deleteRole() {
				if(this.count < 1) {
					this.$Message.warning('至少要选择一项！');
				}else{
					this.deleteRoleVisible = true;
				}
			},
			/*确认删除*/
			deleteRoleOK() {
				if(this.groupId!=null && this.groupId!="") {
					this.axios({
						method: 'delete',
						url: '/roles',
						data: this.groupId
					}).then(function(response) {
						this.count = 0;
						this.groupId = null;
						this.getTableInfo(this.pageInfo);
						this.$Message.info('删除成功！');
						this.deleteRoleVisible = false;
					}.bind(this)).catch((error) => {
						alert(error);
					});
				}	
			},
			/*点击设置权限按钮,出现table信息*/
			setRoleAuthority(row) {
				//?????????????why sort data1?
				this.setRoleAuthorityVisible = true;
				this.oldToNewRoleSet(row);
				if(row.modules == null || row.modules == ''){
						this.moduleArr = [];
				}else{
						this.moduleArr = row.modules.split(";");
				}
				var data2Temp = [];
				for(var i = 0; i < this.submenusList.length; i++) {
					if(this.moduleArr.indexOf(this.submenusList[i].id+'') == -1){
							data2Temp.push({
									'id': this.submenusList[i].id,
									'name': this.submenusList[i].name,
									'value': false
							});
					}else{
                        data2Temp.push({
                            'id': this.submenusList[i].id,
                            'name': this.submenusList[i].name,
                            'value': true
                        });
                    }
				}
				this.data2 = data2Temp;
			},
			/*选择完权限,点击确认*/
			setAuthorityOK() {
				var authorities = "";
				if (this.oldToNewRole.role == "ROLE_ADMIN") {
					for(var i in this.moduleArr){
						if(this.moduleArr[i] != '' && this.moduleArr != null){
							authorities = authorities + this.moduleArr[i]+";";
						}
					}
					this.oldToNewRole.modules = authorities;
					this.axios({
						method: 'put',
						url: '/roles/'+this.oldToNewRole.id,
						data: this.oldToNewRole
					}).then(function(response) {
						this.initoldToNewRole();
						this.getTableInfo(this.pageInfo);
						this.$Message.info('修改角色权限成功！');
					}.bind(this)).catch((error) => {
						alert(error);
					});
				} else {
					if (this.moduleArr.indexOf("4") != -1 || this.moduleArr.indexOf("5") != -1 || this.moduleArr.indexOf("6") != -1) {
						this.$Message.error('非管理员(ROLE_ADMIN)不可获得以下权限（用户管理，菜单管理，角色管理）');
					} else {
							for(var i in this.moduleArr){
								if(this.moduleArr[i] != '' && this.moduleArr != null){
									authorities = authorities + this.moduleArr[i]+";";
								}
							}
							this.oldToNewRole.modules = authorities;
							this.axios({
								method: 'put',
								url: '/roles/'+this.oldToNewRole.id,
								data: this.oldToNewRole
							}).then(function(response) {
								this.initoldToNewRole();
								this.getTableInfo(this.pageInfo);
								this.$Message.info('修改角色权限成功！');
							}.bind(this)).catch((error) => {
								alert(error);
							});
					}
				}		
			}
		}
	};
</script>