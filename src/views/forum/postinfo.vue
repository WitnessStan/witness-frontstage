<style scoped>

</style>
<template>
    <div class="post-info" style="background-color: #f5f7f9;padding: 20px;">
        <div class="cards" style="padding: 20px">
            <Card :bordered="true" v-if="pageInfo.page == 1" style="margin-bottom: 10px;">
                <p slot="title" class="title1" style="margin-bottom: 15px;font-size: 18px;">
                    {{postDetail.title}}
                </p>
                <p slot="title" class="title2" style="height: auto">
                    <router-link :to="('/')" style="color: #4d5669;">
                        <img style="width: 30px;height: 30px;border-radius: 100%;vertical-align: middle;" :src="postDetail.userImg" />
                        {{postDetail.userName}}
                    </router-link>
                    <font style="color: #2db7f5;">（楼主）</font>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    点击数：{{postDetail.clickCount}}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                   {{postDetail.createTime}}
                </p>
                <p v-html="postDetail.content">
                    {{postDetail.content}}
                </p>
            </Card>
            <Card :bordered="true" v-for="(reply, index) in postReply" :key="index" style="margin-bottom: 10px">
                <div>
                    <p style="margin-bottom: 10px">
                        <router-link :to="('/')" style="color: #4d5669;">
                            <img style="width: 30px;height: 30px;border-radius: 100%;vertical-align: middle;" :src="reply.userImg" />
                            {{reply.userName}}
                        </router-link>
                        <font style="color: #2db7f5;">（{{pageInfo.pageSize*(pageInfo.page-1)+index+1}}楼）</font>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button @click="childReplyToNullParent(reply)"><font style="color: #4d5669;">回复</font></Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button @click="showChildReplies(reply)"><font style="color: #4d5669;">查看回复({{reply.childList.length}})</font></Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{reply.createTime}}
                    </p>
                    <p v-html="reply.comment">
                        {{reply.comment}}
                    </p>
                    <div style="margin-left: 30px;" v-show="reply.showChild">
                        <Card style="width: auto;height: auto;font-size: 5px" dis-hover v-for="(child,index) in reply.childList" :key="index">
                            <p>
                                <router-link :to="('/')" style="color: #4d5669;">
                                    <img style="width: 25px;height: 25px;border-radius: 100%;vertical-align: middle;" :src="child.userImg" />
                                    {{child.userName}}
                                </router-link>
                                &nbsp;&nbsp;<font style="color: #2db7f5;">回复 @{{child.replyToName}}：</font>
                                &nbsp;{{child.comment}}
                                &nbsp;&nbsp;<a @click="childReply(child)" style="color: #2db7f5;">回复</a>
                            </p>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
        
				<div class="pages" style="margin-bottom: 50px">
            <Page :total="total" :page-size="pageInfo.pageSize" show-elevator show-total @on-change="e=>{changePage(e)}"/>
        </div>

        <div class="replyEditor">
             <texteditor v-if="isLogin" @editorChange="e=>{getEditorContent(e)}" :editContent="postReplyForm.comment">
						 </texteditor>
            <Alert type="warning" v-else>请登陆后再回复！</Alert>
            <Button v-if="isLogin" style="float: right;margin-top: 10px;font-size: 20px" @click="reply">回帖</Button>
        </div>

        <Modal :mask-closable="false" :visible.sync="postReplyFormVisible" v-model="postReplyFormVisible" width="500" title="回复" @on-ok="postReplyFormOK()">
            <Input v-model="childReplyComment" placeholder="Enter something..." style="width: 300px" />
        </Modal>
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
                    total: 0,
                    pageInfo: {
                        pageSize: 5,
                        page: 1
                    },
                    //帖子信息
                    postDetail: {},
                    //回帖与楼中楼
                    postReply: [],
                    isLogin: false,
                    postReplyFormVisible: false,
                    //回帖表单实体
                    postReplyForm: {
                        postId: this.postId,
                        parentId: null,
                        comment: null,
                        replyToId: null,
                        replyToName: null
                    },
                    //楼中楼回复
                    childReplyComment: ''
                }
            },
            mounted () {
                this.isLogin = this.checkLogin();
                // var postId = this.$route.fullPath.charAt(this.$route.fullPath.length - 1);
                this.initPage(this.postId, this.pageInfo);
            },
            methods: {
                getPostDetail(postId) {
                    this.axios({
                        method: 'get',
                        url: '/public/posts/'+postId
                    }).then(function (response) {
                        this.postDetail = response.data.data;
                        console.log(this.postDetail);
                    }.bind(this)).catch((error) => {
                        this.$Message.error("获取帖子失败！");
                    })
                },
                getPostReplys(postId, pageInfo) {
                    this.postReply = [];
                    this.axios({
                        method: 'get',
                        url: '/public/post/replies',
                        params: {
                            'postId': postId,
                            'page': pageInfo.page - 1,
                            'pageSize': pageInfo.pageSize
                        }
                    }).then(function (response) {
                        this.postReply = response.data.data.data;
                        this.total = response.data.data.totalCount;
                        console.log(this.postReply);
                    }.bind(this)).catch((error) => {
                        this.$Message.error("获取回帖失败！");
                        console.log(error);
                    })
                },
                changePage(page) {
                    this.pageInfo.page = page;
                    this.getPostReplys(this.postDetail.id, this.pageInfo);
                },
                checkLogin() {
                    if ((localStorage.getItem('currentUserName') != null && localStorage.getItem('currentUserName') != '')
                        || (localStorage.getItem('currentUserAccessToken') != null && localStorage.getItem('currentUserAccessToken') != ''))
                        return true;
                    return false;
                },
                showChildReplies(reply) {
                    if(reply.showChild){
                        reply.showChild = false;
                    }
                    else {
                        reply.showChild = true;
                    }
                },
                //直接回复层主(也属于楼中楼回复，但parentId为层主)
                childReplyToNullParent(reply) {
                    if (!this.isLogin) {
                        this.$Message.warning("请先登录！");
                    } else {
                        this.setChildPostReplyForm2(reply);
                    }
                },
                //楼中楼回复按钮判断是否登录
                childReply(child) {
                    if (!this.isLogin) {
                        this.$Message.warning("请先登录！");
                    } else {
                        this.setChildPostReplyForm(child);
                    }
                },
                initPostReplyForm() {
                    this.postReplyForm.postId = this.postId;
                    this.postReplyForm.parentId = null;
                    this.postReplyForm.replyToId = null;
                    this.postReplyForm.replyToName = null;
                    this.postReplyForm.comment = null;
                },
                //楼中楼回复(直接回复层主)初始化
                setChildPostReplyForm2(reply) {
                    this.postReplyForm.postId = reply.postId;
                    //层主的id
                    this.postReplyForm.parentId = reply.id,
                    this.postReplyForm.replyToId = reply.userId;
                    this.postReplyForm.replyToName = reply.userName;
                    console.log(this.postReplyForm);
                    this.postReplyFormVisible = true;
                },
                //楼中楼回复初始化
                setChildPostReplyForm(child) {
                    this.postReplyForm.postId = child.postId;
                    //被回复者的父id,就是层主id
                    this.postReplyForm.parentId = child.parentId
                    this.postReplyForm.replyToId = child.userId;
                    this.postReplyForm.replyToName = child.userName;
                    console.log(this.postReplyForm);
                    this.postReplyFormVisible = true;
                },
                //回复后点击确认
                postReplyFormOK() {
                    this.postReplyForm.comment = this.childReplyComment;
                    console.log(this.childReplyComment);
                    this.axios({
                        method: 'post',
                        url: '/post/replies',
                        data: this.postReplyForm
                    }).then(function (response) {
                        this.$Message.info(response.data.data);
                        this.getPostReplys(this.postId,this.pageInfo);
                    }.bind(this)).catch((error) => {
                        this.$Message.error("发生错误！回帖失败！");
                        console.log(error);
                    });
                },
                //获取编辑器内容
                getEditorContent(e) {
                    this.initPostReplyForm();
                    this.postReplyForm.parentId = null;
                    this.postReplyForm.replyToId = this.postDetail.userid;
                    this.postReplyForm.replyToName = null;
                    this.postReplyForm.comment = e;
                    console.log(this.postReplyForm);
                },
                reply() {
                    this.axios({
                        method: 'post',
                        url: '/post/replies',
                        data: this.postReplyForm
                    }).then(function (response) {
                        this.$Message.info(response.data.data);
                        this.getPostReplys(this.postId,this.pageInfo);
                        this.initPostReplyForm();
                    }.bind(this)).catch((error) => {
                        this.$Message.error("发生错误！回帖失败！");
                        console.log(error);
                    });
                },
                initPage(postId, pageInfo) {
                    this.axios({
                        method: 'patch',
                        url: '/public/post/'+postId
                    }).then(function (res) {
                        this.getPostDetail(postId);
                        this.getPostReplys(postId, pageInfo);
                    }.bind(this)).catch((error) => {
                        this.$Message.error("发生错误！阅读数更新失败！"+error);
                    })
                }
            }
         }
</script>