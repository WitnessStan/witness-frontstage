<template>
    <div id="search" style="margin: 0 auto;text-align: center;">
        <input type="text" class="search" placeholder="搜索帖子" v-model.trim="title" style="width: 300px;" />
        <Button type="primary" @click="searchByButton(title)">搜索</Button><br/>
        <ul style="list-style: none;display: inline-block;">
            <li v-for="(value,index) in search" v-html="value.highlight_content" @click="redirectToPostInfo(value.id)"
                v-on:mouseenter="addClassLoad(index)" v-on:mouseover="removeClassLoad(index)"
                v-bind:class="{ classRed: classEnable && index == current}" style=" border: 1px solid #ddd;width: 300px">
            </li>
        </ul>
        <!--<input list="browsers" v-model.trim="title" type="text" class="search" placeholder="搜索"/>-->
        <!--<datalist id="browsers">-->
            <!--<option v-html="value.highlight_content" v-for="(value,index) in search" onclick="redirectToPostInfo(value.id)">-->
            <!--</option>-->
        <!--</datalist>-->
    </div>
</template>

<script>
    const delay = (function() {
        let timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
    export default {
        name: 'searchblank',
        data () {
            return {
                current:0,
                title: '',
                search: null,
                classEnable:false
            }
        },
        watch: {
            //watch title change
            title() {
                delay(() => {
                    this.fetchData();
                }, 300);
            },
        },
        methods: {
            async fetchData(val) {
                // const res = await this.fetch({
                //     url: '/',
                //     method: 'GET',
                //     params: { title: this.title },
                // });
                this.axios({
                    url: '/test/search',
                    method: 'get',
                    params: { text: this.title}
                }).then(function (res) {
                    this.search = res.data.data;
                    console.log(this.search);
                }.bind(this)).catch((error) => {
                    alert(error);
                });
            },
            redirectToPostInfo(id) {
                this.$router.push({path: '/forum/posts/details/'+id});
            },
            addClassLoad(index){
                this.classEnable=true
                this.current=index;
            },
            removeClassLoad(index){
                this.classEnable=false
                this.current=index;
            },
            searchByButton (title) {
                this.$router.push({path: '/forum/search', query: { text: title }});
            }
        },
        mounted() {},
    };
</script>

<style scoped>
    .classRed{
        /*color: red;*/
        background-color: #bcbcbc;
        cursor: pointer
    }
</style>