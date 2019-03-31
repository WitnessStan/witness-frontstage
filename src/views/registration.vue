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
        width:100%;height:100%;background-size:cover;
        overflow: hidden;
        background-image: url(../images/registration.jpg);
        background-position:center center;
        box-shadow: 0 0px 3px rgba(0,0,0,.5);
        text-align: center;
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
                        <li><h1>注册</h1></li>
                        <li>
                            <dl>
                                <FormItem prop="loginName">
                                    <Input type="text" v-model="formInline.loginName" placeholder="请输入登录名...">
                                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                                    </Input>
                                </FormItem>
                                <FormItem prop="name">
                                    <Input type="text" v-model="formInline.name" placeholder="请输入用户名...">
                                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                    </Input>
                                </FormItem>
                                <FormItem prop="password">
                                    <Input type="password" v-model="formInline.password" placeholder="请输入密码...">
                                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                    </Input>
                                </FormItem>
                                <FormItem prop="email">
                                    <Input type="email" v-model="formInline.email" placeholder="请输入邮箱...">
                                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                    </Input>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="registration('formInline')">注册</Button>
                                </FormItem>
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
                    loginName: '',
                    name: '',
                    password: '',
                    email: ''
                },
                ruleInline: {
                    loginName: [
                        { required: true, message: '请输入登录名', trigger: 'blur' },
                        { type: 'string', min: 6, message: '登录名不能小于6位', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { type: 'string', min: 3, message: '密码不能小于三位', trigger: 'blur' }
                    ],
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    email: [
                        { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            registration (formInline) {
                this.$refs[formInline].validate((valid) => {
                    if (valid) {
                        this.axios({
                            method: 'post',
                            url: '/registration',
                            data: this.formInline
                        }).then(function (response) {
                           this.$Message.info(response.data.data);
                           this.$router.push({ path: '/' });
                        }.bind(this)).catch((error) => {
                            this.$Message.error("发生错误，注册失败！"+error);
                        });
                    } else {
                        this.$Message.error('注册失败!请输入正确的格式');
                    }
                })
            }
        }
    }
</script>