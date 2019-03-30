<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-logo img{
	width: 30px;
	height: 10px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <!-- <div class="layout-logo">
						jkl
					</div> -->
                    <div class="layout-nav">
						<Button type="primary" @click="logout()">登出</Button>
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            欢迎您!&nbsp;&nbsp;&nbsp;{{username}}
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
        <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']" @on-select="select">
                        <Submenu v-for="parentMenu in parentMenuList" :name="parentMenu.id" :key="parentMenu.id">
							<template slot="title">
								<Icon :type="parentMenu.icon"></Icon>
								{{parentMenu.name}}
							</template>
							<MenuItem v-for="childMenu in parentMenu.children" :name="childMenu.id" :key="childMenu.id">
								<Icon :type="childMenu.icon"></Icon>
								{{childMenu.name}}
							</MenuItem>
						</Submenu>
							
							
						<!-- <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                Item 1
                            </template>
                            <MenuItem name="1-1">Option 1</MenuItem>
                            <MenuItem name="1-2">Option 2</MenuItem>
                            <MenuItem name="1-3">Option 3</MenuItem>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                Item 2
                            </template>
                            <MenuItem name="2-1">Option 1</MenuItem>
                            <MenuItem name="2-2">Option 2</MenuItem>
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-analytics"></Icon>
                                Item 3
                            </template>
                            <MenuItem name="3-1">Option 1</MenuItem>
                            <MenuItem name="3-2">Option 2</MenuItem>
                        </Submenu> -->
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                	<Breadcrumb :style="{margin: '24px 0'}">
                		<BreadcrumbItem to="/base/home">Home</BreadcrumbItem>
                		<BreadcrumbItem v-for="item in breadcrumbData" :to="item.url" :key="item.id">{{item.name}}</BreadcrumbItem>
                	</Breadcrumb>
                	<Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                		<router-view></router-view>
                	</Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    export default {
		data () {
			return {
				username: null,
				parentMenuList: [],
				childMenuList: [],
				breadcrumbData: []
			}
		},
        methods: {
			logout() {
				this.$store.dispatch("user/logout",{"router":this.$router});
			},
			select(id){
				var filterMenu = this.childMenuList.filter(function(menu) {return (menu.url!=null && menu.url!='' && menu.id==id)});
				this.$router.push(filterMenu[0].url);
				this.breadcrumbData.splice(0,1,filterMenu[0]);
				//this.breadcrumbData.splice(0,1,filterMenu[0]);
			}
		},
		mounted () {
			this.axios({
				method: 'get',
				url: '/user/' + window.localStorage.getItem('currentUserName')
			}).then(function(response){
				this.username = response.data.name
			}.bind(this)).catch((error) => {
				alert(error);
			});
			
			this.axios({
				method: 'get',
				url: '/menu/' + window.localStorage.getItem('currentUserName')
			}).then(function(response){
				this.parentMenuList = response.data;
				for(var i in this.parentMenuList) {
					for(var j in this.parentMenuList[i].children) {
						this.childMenuList.push(this.parentMenuList[i].children[j]);
					}
				}
			}.bind(this)).catch((error) => {
				alert(error);
			});
		}
    }
</script>