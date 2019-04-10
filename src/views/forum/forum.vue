<style>
</style>
<template>
    <div class="forum" style="background-color: #f5f7f9;padding: 20px;">
		<div class="title" style="text-align: center;margin-bottom: 10px">
			<h1>论坛</h1>
			<searchblank></searchblank>
		</div>
		<div class="cards" style="margin-bottom: 30px;">
			<Card :bordered="true" style="margin-bottom: 10px;" v-for="(post,index) in postList" :key="index">
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
							<p style="text-align: right;color: #2db7f5;font-size: 17px">点击数：{{post.clickCount}}&nbsp;&nbsp;回复数：{{post.commentCount}}&nbsp;&nbsp;Latest：{{post.replyTime}}</p>
						</Col>
					</Row>
				</div>
			</Card>
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
        data () {
            return {
				total: null,
                pageInfo: {
                    pageSize: 8,
                    page: 1
                },
                postList: []
            }
        },
		mounted () {
			this.getPosts(this.pageInfo);
		},
        methods: {
            getPosts(pageInfo) {
                this.axios({
					method: 'get',
					url: '/public/posts',
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
            }
        }
    }
</script>