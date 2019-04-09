<template>
    <div class="forum" style="background-color: #f5f7f9;padding: 20px;">
        <div class="title" style="text-align: center;margin-bottom: 10px">
            <h1>搜索结果</h1>
        </div>
        <div class="cards" style="margin-bottom: 30px;">
            <Card :bordered="true" style="margin-bottom: 10px;" v-for="(post,index) in postList" :key="index" v-if="postList.length > 0">
                <div class="post_title" style="font-size: 18px">
                    <router-link :to="('/forum/posts/details/'+post.id)">
                        {{post.title}}
                    </router-link>
                </div>
                <div class="post-info" style="margin-top: 10px;">
                    <p v-html="post.info">{{post.info}}</p>
                </div>
                <div class="post-others" style="margin-top: 20px;">
                    <Row>
                        <Col span="12">
                            <p style="text-align: left;color: #4d5669;">
                                <router-link :to="('/')" style="color: #4d5669;">
                                    <img style="width: 30px;height: 30px;border-radius: 100%;vertical-align: middle;" :src="post.userImg" />
                                    {{post.userName}}
                                </router-link>
                            </p>
                        </Col>
                        <Col span="12">
                            <p style="text-align: right;color: #2db7f5;font-size: 17px">点击数：{{post.clickCount}}&nbsp;&nbsp;回复数：{{post.commentCount}}</p>
                        </Col>
                    </Row>
                </div>
            </Card>
            <Card v-if="postList.length == 0">没有搜索到任何相关结果~~~</Card>
        </div>
        <div class="pages">
            <Page :total="total" :page-size="pageInfo.pageSize" show-elevator show-total @on-change="e=>{changePage(e)}"/>
        </div>
    </div>
</template>

<script>
    import Searchblank from "../utils/searchblank";

    export default {
        components: {Searchblank},
        name: "searchresult",
        data () {
            return {
                total: null,
                pageInfo: {
                    pageSize: 5,
                    page: 1
                },
                postList: [],
                //搜索栏传递过来的title
                text: null
            }
        },
        mounted () {
            this.text = this.$route.query.text;
            console.log(this.text);
            this.getPosts(this.text ,this.pageInfo);
        },
        methods: {
            getPosts(text, pageInfo) {
                this.axios({
                    method: 'get',
                    url: '/public/searchInfo',
                    params: {
                        'text': text,
                        'pageSize' : pageInfo.pageSize,
                        'page' : pageInfo.page - 1
                    }
                }).then(function (response){
                    if (response.data.code == 205) {
                        this.$Message.error(response.data.message);
                    } else {
                        this.postList = response.data.data.data;
                        this.total = response.data.data.totalCount;
                        console.log(this.postList);
                        console.log(this.total);
                    }
                }.bind(this)).catch((error) => {
                    alert("获取帖子详情失败"+error);
                });

            },
            changePage(page) {
                this.pageInfo.page = page;
                this.getPosts(this.text,this.pageInfo);
            }
        }
    }
</script>

<style scoped>

</style>