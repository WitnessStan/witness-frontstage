<template>
    <div class="edit_container" style="background-color: white;">
        <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
        </quill-editor>
		<input id="file-selector" type="file" v-show="false" @change="upload()">
    </div>
</template>

<script>
    export default {
        name: "texteditor",
		props: {
			abc: ''
		},
        data () {
            return {
				cos: null,
                Bucket: 'witnessstan-1253539867',
                Region: 'ap-guangzhou',
                responseData: null,
				content: ``,
				editorOption: {
					modules: {
						toolbar: {
							container: [
									['bold', 'italic', 'underline', 'strike'],        // toggled buttons
									['blockquote', 'code-block'],
								
									[{'header': 1}, {'header': 2}],               // custom button values
									[{'list': 'ordered'}, {'list': 'bullet'}],
									[{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
									[{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
									[{'direction': 'rtl'}],                         // text direction
								
									[{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
									[{'header': [1, 2, 3, 4, 5, 6, false]}],
								
									[{'color': []}, {'background': []}],          // dropdown with defaults from theme
									[{'font': []}],
									[{'align': []}],
									['link', 'image', 'video'],
									['clean']
							],
							handlers: {
								'image': function (value) {
									if (value) {
											document.querySelector('#file-selector').click()
									} else {
											this.quill.format('image', false);
									}
								}.bind(this)
							}
						}
					}
				}
            }
        },
		computed: {
			editor() {
				return this.$refs.myQuillEditor.quill;
			}
        },
		mounted () {
            this.cos = new COS({
                getAuthorization: function (options, callback) {
					var authorization = COS.getAuthorization({             
					SecretId: 'AKIDdAX9ZREaopb9ThevFLGxOdwOvIp7f4ix',
					SecretKey: 'EGN2SEm5IGRQTHuJcibSLzNeGJ7fy1oL', 
					Method: options.Method,
					Key: options.Key,
					Query: options.Query,
					Headers: options.Headers,
					Expires: 60
					});    
					callback(authorization);
                }
            });
		},
        methods: {
            onEditorBlur(){//失去焦点事件
				console.log("blur");
            },
            onEditorFocus(){//获得焦点事件
				console.log("focus");
			},
            onEditorChange(){//内容改变事件
				console.log("change");
			},
			upload() {
				var responseURL = null;
				var file = document.getElementById('file-selector').files[0];
				// 获取富文本组件实例
				var quill = this.$refs.myQuillEditor.quill;
				var mycos = this.cos;
				var mybucket = this.Bucket;
				var myregion = this.Region;
				if (!file) return;
				console.log("开始上传");    
				    // 分片上传文件
// 				    this.cos.sliceUploadFile({
// 				        Bucket: this.Bucket,
// 				        Region: this.Region,
// 				        Key: file.name,
// 				        Body: file,
// // 						onHashProgress: function (progressData) {
// // 							console.log('校验中', JSON.stringify(progressData));
// // 						},
// 				        onProgress: function (progressData) {
// 				            console.log('上传中', JSON.stringify(progressData));
// 				        },
// 				    }, function (err, data) {
// 				        console.log(err, data);
// 						console.log("上传了");
// 				    });
				mycos.putObject({
					Bucket: mybucket,
					Region: myregion,
					Key: file.name,
					Body: file,
					onProgress: function (progessData,callback){
						console.log(JSON.stringify(progessData));
					},
				},function(err, data){
					console.log(err, data);
					mycos.getObjectUrl({
						Key: file.name,
						Bucket: mybucket,
						Sign: false,
						Region: 'ap-guangzhou'
					}, function (err, data) {
						responseURL = data.Url;
						var currentMousePosition = quill.getSelection().index;
						quill.insertEmbed(currentMousePosition, 'image', responseURL);
					});
				});		
			}
        }
    }
</script>

<style scoped>

</style>