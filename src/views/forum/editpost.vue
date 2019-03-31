<template>
    <div class="createpost">
        <div class="title" style="text-align: center;margin-bottom: 10px">
            <h1>编辑帖子</h1>
        </div>
        <Form ref="postForm" :model="postForm" :rules="postFormRules" v-if="isLogin">
            <FormItem prop="title" label="标题">
                <Input type="text" v-model="postForm.title" placeholder="输入标题..."/>
            </FormItem>
            <FormItem prop="content" style="margin-top: 30px">
                <Input type="textarea" v-model="postForm.content" v-show="false"/>
            </FormItem>
            <texteditor v-if="isLogin" @editorChange="e=>{getEditorContent(e)}" :editContent="postForm.content">
            </texteditor>
            <FormItem>
                <Button type="primary" @click="post('postForm')" style="float: right;margin-top: 50px;font-size: 20px">发帖</Button>
            </FormItem>
        </Form>
        <Alert type="warning" v-else>请登陆后再发帖！</Alert>
    </div>
</template>

<script>
    import texteditor from "../utils/texteditor";

    export default {
        components: {
            texteditor
        },
        data () {
            return {
                postId: this.$route.fullPath.split("/")[this.$route.fullPath.split("/").length - 1],
                isLogin: false,
                postForm: {
                    title: null,
                    content: null
                },
                postFormRules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'},
                        { type: 'string', min: 5, max: 20, message: '标题必须在5-20个字符之间', trigger: 'blur' }
                    ],
                    content: [
                        {required: true, message: '请输入内容',trigger: 'blur'},
                        { type: 'string', min: 30, message: '内容不得少于30个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted () {
            //检查登陆状态
            this.isLogin = this.checkLogin();
            //登录则获取帖子信息
            if (this.isLogin) {
                this.getPostDetailById(this.postId);
            }
        },
        methods: {
            checkLogin() {
                if ((localStorage.getItem('currentUserName') != null && localStorage.getItem('currentUserName') != '')
                    || (localStorage.getItem('currentUserAccessToken') != null && localStorage.getItem('currentUserAccessToken') != ''))
                    return true;
                return false;
            },
            initPostForm() {
                this.postForm.title = null;
                this.postForm.content = null
            },
            //发帖
            post(postForm) {
                this.$refs[postForm].validate((valid) => {
                    if (valid) {
                        this.axios({
                            method: 'put',
                            url: '/post/'+this.postId,
                            data: this.postForm
                        }).then(function (response) {
                            this.$Message.info(response.data.data);
                            this.initPostForm();
                        }.bind(this)).catch((error) => {
                            this.$Message.error("未知错误！"+error);
                        })
                    } else {
                        this.$Message.error('发帖失败!标题不符合规范或者内容过短！');
                    }
                });
            },
            //获取编辑器内容
            getEditorContent(e) {
                this.postForm.content = e;
                console.log(this.postForm.content);
            },
            //获取帖子标题和内容
            getPostDetailById(postId) {
                this.axios({
                    method: 'get',
                    url: '/public/posts/'+postId
                }).then(function (response) {
                    this.postForm.title = response.data.data.title;
                    this.postForm.content = response.data.data.content;
                    console.log(this.postDetail);
                }.bind(this)).catch((error) => {
                    this.$Message.error("获取帖子失败！");
                })
            }
        }
    }
</script>

<style scoped>

</style>