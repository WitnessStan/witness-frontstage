<style>
</style>
<template>
    <div class="createpost">
        <texteditor v-if="isLogin" @editorChange="e=>{getEditorContent(e)}" :editContent="postForm.comment">
        </texteditor>
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
                isLogin: false,
                postForm: {
                    comment: null
                }
            }
        },
        mounted () {
            this.isLogin = this.checkLogin();
        },
        methods: {
            checkLogin() {
                if ((localStorage.getItem('currentUserName') != null && localStorage.getItem('currentUserName') != '')
                    && (localStorage.getItem('currentUserAccessToken') != null && localStorage.getItem('currentUserAccessToken') != ''))
                    return true;
                return false;
            }
        }
    }
</script>