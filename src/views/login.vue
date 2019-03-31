<style scoped lang="less">
    .index{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
        .ivu-row-flex{
            height: 100%;
        }
    }
	.index_background{
		width:100%;height:100%;background-size:cover;overflow: hidden;background-image: url(../images/logo.png);background-position:center center;box-shadow: 0 0px 3px rgba(0,0,0,.5);text-align: center;
	}
	.name-password-error{
		text-align: left;
		color: #E13D13;
	}
	.index_login ul{position:relative;width:400px;border-radius:50px;box-shadow: 0 0px 5px rgba(0,0,0,.2); margin-top: 15%; margin-left: 40%; text-align:center;}
	.index_login li{text-align:center;color:#fff;font-size:12px;line-height:30px; padding:0 25px 5px 25px;width: 100%;}
	.index_login li h1{color:#000000;font-size:20px;line-height:40px; display:block; text-align:center; padding:20px 0 5px 0}
	.index_login li dl{width:100%;}
</style>
<template>
    <div class="index">
		<div class="index_background">
			<Form ref="formInline" :model="formInline" :rules="ruleInline">
				<div class="index_login">
					<ul style="list-style: none">
						<li><h1>登录</h1></li>
						<li>
							<div class="name-password-error" v-if="this.$store.state.ifSign">用户名或密码错误</div>
							<dl>
								<FormItem prop="user">
									<Input type="text" v-model="formInline.user" placeholder="Username">
										<Icon type="ios-person-outline" slot="prepend"></Icon>
									</Input>
								</FormItem>
								<FormItem prop="password">
									<Input type="password" v-model="formInline.password" placeholder="Password">
										<Icon type="ios-lock-outline" slot="prepend"></Icon>
									</Input>
								</FormItem>
								<FormItem>
									<Button type="primary" @click="login('formInline')">登录</Button>
								</FormItem>
								 <a href="https://github.com/login/oauth/authorize?client_id=2f429f7f8a930ba27041"> <!--&state=github-->
								 	<img class="icon" src="../images/GitHub.svg" style="width: 35px;height: 40px;"/>
								 </a>
							</dl>
						</li>
					</ul>
				</div>
			</Form>		
		</div>	
    </div>
</template>
<script>
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { type: 'string', min: 3, message: '密码不能小于三位', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            login(formInline) {
            	this.$refs[formInline].validate((valid) => {
            		if (valid) {
						this.$store.dispatch("user/loginToFront",{"userName":this.formInline.user,"userPasword":this.formInline.password,"router":this.$router});
            		} else {
            			this.$Message.error('登陆失败!');
            		}
            	})
            }
		}
    }
</script>