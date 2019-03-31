<template>
    <div align="center">
        <div class="title" style="text-align: center;margin-bottom: 10px">
            <h1>我的贴子</h1>
        </div>
        <Card style="width:700px;text-align: left;margin-bottom: 10px;">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                我的贴子
            </p>
            <p style="text-align: left;color: #4d5669;">
                <router-link :to="('/')" style="color: #4d5669;">
                    <img style="width: 30px;height: 30px;border-radius: 100%;vertical-align: middle;" :src="user.github_avatar_img" />
                    &nbsp;&nbsp;{{user.name}}
                </router-link>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴子数：{{postList.length}}
            </p>
            <!--<ul>-->
                <!--<li v-for="item in randomMovieList" style="list-style: none">-->
                    <!--<a :href="item.url" target="_blank">{{ item.name }}</a>-->
                    <!--<span>-->
                    <!--<Icon type="ios-star" v-for="n in 4" :key="n"></Icon><Icon type="ios-star" v-if="item.rate >= 9.5"></Icon><Icon type="ios-star-half" v-else></Icon>-->
                    <!--{{ item.rate }}-->
                <!--</span>-->
                <!--</li>-->
            <!--</ul>-->
        </Card>
        <div>
            <Card v-if="postList.length != 0"  :bordered="true" style="width:700px;text-align: left;margin-bottom: 10px;" v-for="(post,index) in postList" :key="index">
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
                            <!--<p style="text-align: right;color: #2db7f5;font-size: 17px">点击数：{{post.clickCount}}&nbsp;&nbsp;回复数：{{post.commentCount}}</p>-->
                            <p style="text-align: right;color: #2db7f5;font-size: 17px">
                                <router-link :to="('/forum/posts/edit/'+post.id)">
                                    <Button type="warning" >编辑</Button>
                                </router-link>
                                <Button @click="deletePost(post.id)" type="error" >删除</Button>
                            </p>
                        </Col>
                    </Row>
                </div>
            </Card>
            <Card v-if="postList.length == 0" style="width:700px;text-align: left;margin-bottom: 10px;">
                <p>
                    你没有任何动态哦~~~
                </p>
            </Card>
        </div>
        <Page :total="total" :page-size="pageInfo.pageSize" show-elevator show-total @on-change="e=>{changePage(e)}"/>
    </div>
</template>
<script>
    export default {
        data () {
            return {
        //         movieList: [
        //             {
        //                 name: 'The Shawshank Redemption',
        //                 url: 'https://movie.douban.com/subject/1292052/',
        //                 rate: 9.6
        //             },
        //             {
        //                 name: 'Leon:The Professional',
        //                 url: 'https://movie.douban.com/subject/1295644/',
        //                 rate: 9.4
        //             },
        //             {
        //                 name: 'Farewell to My Concubine',
        //                 url: 'https://movie.douban.com/subject/1291546/',
        //                 rate: 9.5
        //             },
        //             {
        //                 name: 'Forrest Gump',
        //                 url: 'https://movie.douban.com/subject/1292720/',
        //                 rate: 9.4
        //             },
        //             {
        //                 name: 'Life Is Beautiful',
        //                 url: 'https://movie.douban.com/subject/1292063/',
        //                 rate: 9.5
        //             },
        //             {
        //                 name: 'Spirited Away',
        //                 url: 'https://movie.douban.com/subject/1291561/',
        //                 rate: 9.2
        //             },
        //             {
        //                 name: "Schindler'sList",
        //                 url: 'https://movie.douban.com/subject/1295124/',
        //                 rate: 9.4
        //             },
        //     {
        //         name: 'The Legend of 1900',
        //             url: 'https://movie.douban.com/subject/1292001/',
        //         rate: 9.2
        //     },
        //     {
        //         name: 'WALL·E',
        //             url: 'https://movie.douban.com/subject/2131459/',
        //         rate: 9.3
        //     },
        //     {
        //         name: 'Inception',
        //             url: 'https://movie.douban.com/subject/3541415/',
        //         rate: 9.2
        //     }
        // ],
                randomMovieList: [],
                total: null,
                pageInfo: {
                    pageSize: 8,
                    page: 1
                },
                postList: [],
                user: null
        }
        },
        methods: {
            // changeLimit () {
            //     function getArrayItems(arr, num) {
            //         const temp_array = [];
            //         for (let index in arr) {
            //             temp_array.push(arr[index]);
            //         }
            //         const return_array = [];
            //         for (let i = 0; i<num; i++) {
            //             if (temp_array.length>0) {
            //                 const arrIndex = Math.floor(Math.random()*temp_array.length);
            //                 return_array[i] = temp_array[arrIndex];
            //                 temp_array.splice(arrIndex, 1);
            //             } else {
            //                 break;
            //             }
            //         }
            //         return return_array;
            //     }
            //     this.randomMovieList = getArrayItems(this.movieList, 5);
            // },
            getPosts(pageInfo) {
                this.axios({
                    method: 'get',
                    url: '/posts',
                    params: {
                        'pageSize' : pageInfo.pageSize,
                        'page' : pageInfo.page - 1
                    }
                }).then(function (response){
                    this.postList = response.data.data.data;
                    this.total = response.data.data.totalCount;
                    console.log(this.postList);
                    console.log(this.total);
                }.bind(this)).catch((error) => {
                    alert("error");
                });
            },
            changePage(page) {
                this.pageInfo.page = page;
                this.getPosts(this.pageInfo);
            },
            getUserInfo() {
                this.axios({
                    method: 'get',
                    url: '/public/user'
                }).then(function (response){
                    this.user = response.data;
                    console.log(this.user);
                }.bind(this)).catch((error) => {
                    alert("error");
                });
            },
            editPost(postId) {

            },
            deletePost(postId) {
                console.log(postId);
                if(confirm("确认要删除吗？")) {
                    this.axios({
                        method: 'delete',
                        url: '/post/'+postId
                    }).then(function(response) {
                        this.$Message.info(response.data.data);
                        location.reload();
                    }.bind(this)).catch((error) => {
                        this.$Message.error(error);
                    });
                }
            }
        },
        mounted () {
            // this.changeLimit();
            this.getUserInfo();
            this.getPosts(this.pageInfo);
        }
    }
</script>