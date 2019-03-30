<style>	
</style>
<template>
	<div>
		<div>
			<Row style="margin-bottom: 25px;">
				<Col span="8">菜单名称：
					<Select v-model="menuId" filterable clearable style="width: 200px">
						<Option v-for="item in menuList" :value="item.value" :key="item.value">{{item.label}}</Option>
					</Select>	
				</Col>
				<Col span="8"><Button type="primary" shape="circle" icon="ios-search" @click="search()">搜索</Button></Col>
			</Row>	
		</div>   
		<div>
			<ul>
				<li>
					<Button type="primary" icon="md-add" @click="addNewMenu()">添加</Button>
					<Button type="warning" icon="md-build" @click="alterMenu()">修改</button>
					<Button type="error" icon="md-alert" @click="deleteMenu()">删除</Button>
				</li>
				<li>
					<div style="padding: 10px 0;">
						<Table border :columns="columns1" :data="data1" :height="280" @on-selection-change="s=>{selectMenu(s)}" @on-row-dbclick=""></Table>
					</div>
				</li>
				<li>
					<div style="text-align: right;">
						<Page :total="total" :page-size="pageInfo.pageSize" show-elevator show-total @on-change="e=>{changePage(e)}"></Page>
					</div>
				</li>
			</ul>
		</div>
		<Modal :loading="loading" :mask-closable="false" v-model="newMenuVisiable" :visible.sync="newMenuVisiable" title="添加菜单" @on-ok="newMenuOK('newMenu')">
			<Form ref="newMenu" :model="newMenu" :rules="newMenuRules" :label-width="80">
				<Row>
					<Col span="12">
						<FormItem prop="name" label="菜单名">
							<Input type="text" v-model="newMenu.name"></Input>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem prop="url" label="url">
							<Input type="text" v-model="newMenu.url"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem prop="parentId" label="父菜单id">
							<Input type="text" v-model="newMenu.parentId"></Input>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem prop="sort" label="排序">
							<Input type="text" v-model="newMenu.sort"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<FormItem prop="icon" label="菜单图标">
						<Input type="text" v-model="newMenu.icon"></Input>
					</FormItem>	
				</Row>
				<Row>
					<FormItem prop="remark" label="菜单描述">
						<Input type="textarea" v-model="newMenu.remark"></Input>
					</FormItem>
				</Row>
			</Form>
		</Modal>
		<Modal :loading="loading" :mask-closable="false" v-model="oldToNewMenuVisiable" :visible.sync="oldToNewMenuVisiable" title="修改菜单" @on-ok="oldToNewMenuOK('oldToNewMenu')">
			<Form ref="oldToNewMenu" :model="oldToNewMenu" :rules="oldToNewMenuRules" :label-width="80">
				<Row>
					<Col span="12">
						<FormItem prop="name" label="菜单名">
							<Input type="text" v-model="oldToNewMenu.name"></Input>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem prop="url" label="url">
							<Input type="text" v-model="oldToNewMenu.url"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem prop="parentId" label="父菜单id">
							<Input type="text" v-model="oldToNewMenu.parentId"></Input>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem prop="sort" label="排序">
							<Input type="text" v-model="oldToNewMenu.sort"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<FormItem prop="icon" label="菜单图标">
						<Input type="text" v-model="oldToNewMenu.icon"></Input>
					</FormItem>	
				</Row>
				<Row>
					<FormItem prop="remark" label="菜单描述">
						<Input type="textarea" v-model="oldToNewMenu.remark"></Input>
					</FormItem>
				</Row>
			</Form>
		</Modal>
		<Modal :mask-closable="false" v-model="deleteMenuVisible" :visible.sync="deleteMenuVisible" title="删除菜单" @on-ok="deleteMenuOK()">
			<p>确认要删除嘛？</p>
		</Modal>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				/*选择的数量*/
				count:null,
				/*选中的组数据*/
				groupId:null,
				/*分页总记录数*/
				total: null,
				/*分页信息*/
				pageInfo: {
					page: 1,
					pageSize: 5
				},
				menuId: '',
				menuList: [],
				loading: true,
				columns1: [
					{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '菜单ID',
						key: 'id'
					},
					{
						title: '菜单名',
						key: 'name'
					},
					{
						title: 'url',
						key: 'url'
					},
					{
						title: '父类id',
						key: 'parentId'
					},
					{
						title: '排序',
						key: 'sort'
					},
					{
						title: '描述',
						key: 'remark'
					},
					{
						title: '图标',
						key: 'icon'
					}
				],
				data1: [],
				newMenu: {
					id:null,
					name:null,
					url:null,
					parentId:null,
					sort:null,
					remark:null,
					icon:null
				},
				newMenuVisiable: false,
				newMenuRules: {
					name: [
						{ type: 'string',required: true, message: '输入菜单名', trigger: 'blur' }
					],
// 					url: [
// 						{ type: 'string',required: true, message: '输入url', trigger: 'blur'}
// 					],
					parentId: [
						{ required: true, message: '输入父类ID', trigger: 'blur' },
						{ validator: (rule, value, callback) => {
							if (!Number.isInteger(+value)) {
								callback(new Error('请输入数字'));
							} else {
								callback();
							}
						}, trigger: 'blur'}
					],
					sort: [
						{ required: true, message: '输入排序', trigger: 'blur'},
						{ validator: (rule, value, callback) => {
							if (!Number.isInteger(+value)) {
								callback(new Error('请输入数字！'));
							}else {
								callback();
							}
						}, tirgger: 'blur'}
					],
					icon: [
						{ type:'string', required: true, message: '输入图标', trigger: 'blur' }
					]
				},
				oldToNewMenu: {
					id:null,
					name:null,
					url:null,
					parentId:null,
					sort:null,
					remark:null,
					icon:null
				},
				oldToNewMenuVisiable: false,
				oldToNewMenuRules: {
					name: [
						{ type: 'string',required: true, message: '输入菜单名', trigger: 'blur' }
					],
					parentId: [
						{ required: true, message: '输入父类ID', trigger: 'blur' },
						{ validator: (rule, value, callback) => {
							if (!Number.isInteger(+value)) {
								callback(new Error('请输入数字'));
							} else {
								callback();
							}
						}, trigger: 'blur'}
					],
					sort: [
						{ required: true, message: '输入排序', trigger: 'blur'},
						{ validator: (rule, value, callback) => {
							if (!Number.isInteger(+value)) {
								callback(new Error('请输入数字！'));
							}else {
								callback();
							}
						}, tirgger: 'blur'}
					],
					icon: [
						{ type:'string', required: true, message: '输入图标', trigger: 'blur' }
					]					
				},
				deleteMenuVisible: false
			}
		},
		mounted () {
			this.getTableInfo(this.pageInfo, this.menuId);
			//获取搜索栏列表(只获取顶层父级菜单)
			this.axios({
				method: 'get',
				url: '/menus/parentId',
				params: {
					'parentId': 0
				}
			}).then(function(response) {
				var menus = response.data;
				for(var i = 0; i < menus.length; i++) {
					this.menuList.push({
						'value': menus[i].id,
						'label': menus[i].name
					});
				}
			}.bind(this)).catch((error) => {
				alert(error);
			});
		},
		methods: {
			initPageInfo() {
				this.pageInfo.page = 1;
				this.pageInfo.pageSize = 5;
			},
			initNewMenu() {
				this.newMenu.id = null;
				this.newMenu.name = null;
				this.newMenu.url = null;
				this.newMenu.parentId = null;
				this.newMenu.sort = null;
				this.newMenu.remark = null;
				this.newMenu.icon = null;
			},
			oldToNewRoleSet(e) {
				this.oldToNewMenu.id = e.id;
				this.oldToNewMenu.name = e.name;
				this.oldToNewMenu.url = e.url;
				this.oldToNewMenu.parentId = e.parentId;
				this.oldToNewMenu.sort = e.sort;
				this.oldToNewMenu.remark = e.remark;
				this.oldToNewMenu.icon = e.icon;
			},
			getTableInfo(pageInfo, menuId) {
				this.axios({
					method: 'get',
					url: '/menus',
					params: {
						'pageSize': pageInfo.pageSize,
						'page': pageInfo.page - 1,
						'menuId': menuId
					}
				}).then(function(response) {
					this.data1 = response.data.data;
					this.total = response.data.totalCount;
				}.bind(this)).catch((error) => {
					alert(error);
				});
			},
			changePage(e) {
				this.pageInfo.page = e;
				this.getTableInfo(this.pageInfo, this.menuId);
			},
			selectMenu(e) {
				if (e.length == 1) {
					this.oldToNewRoleSet(e['0']);
				}
				this.setGroupId(e);
			},
			setGroupId(e){
				this.groupId=[];
				this.count=e.length;
				for (var i = 0; i <= e.length - 1; i++) {
					this.groupId.push(e[i].id);
				}	
			},
			search() {
				this.initPageInfo();
				this.getTableInfo(this.pageInfo, this.menuId);
			},
			addNewMenu() {
				this.initNewMenu();
				this.newMenuVisiable = true;
				this.count = 0;
				this.groupId = null;
			},
			newMenuOK(newMenu) {
				this.$refs[newMenu].validate((valid) => {
					if (valid) {
						this.axios({
							method: 'post',
							url: '/menus/menu',
							data: this.newMenu
						}).then(function (response) {
							this.getTableInfo(this.pageInfo, this.menuId);
							this.$Message.info('新建成功！');
							this.newMenuVisiable = false;
						}.bind(this)).catch((error) => {
							alert(error);
						});
					} else {
						setTimeout(() => {
							this.loading = false;
							this.$nextTick(() => {
								this.loading = true;
							});
						}, 1000);
					}
				});
			},
			alterMenu() {
				if (this.count > 1 || this.count < 1) {
					this.oldToNewMenuVisiable = false;
					this.$Message.warning('至少选择一项，且只能选择一项')
				} else {
					this.oldToNewMenuVisiable = true;
				}
			},
			oldToNewMenuOK(oldToNewMenu) {
				this.$refs[oldToNewMenu].validate((valid) => {
					if (valid) {
						this.axios({
							method: 'put',
							url: '/menus/'+this.oldToNewMenu.id,
							data: this.oldToNewMenu
						}).then(function (response) {
								this.getTableInfo(this.pageInfo, this.menuId);
								this.$Message.info('修改成功');
						}.bind(this)).catch(function (error) {
							alert(error);
						});  
						this.oldToNewMenuVisiable = false;	
					}else {
						this.$Message.error('表单验证失败!');
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
			deleteMenu() {
				if(this.count < 1) {
					this.$Message.warning('至少要选择一项！');
				}else{
					this.deleteMenuVisible = true;
				}
			},
			deleteMenuOK() {
				if(this.groupId!=null && this.groupId!=""){
					this.axios({
						method: 'delete',
						url: '/menus',
						data: this.groupId
					}).then(function (response) {
							this.getTableInfo(this.pageInfo, this.menuId);
							this.groupId=null;
							this.count=0;
							this.$Message.info('删除成功');
					}.bind(this)).catch(function (error) {
							alert(error);
					});	
				}
			}
		}
	};
</script>