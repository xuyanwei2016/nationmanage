<template>
  <div class="app-container calendar-list-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <el-button icon="el-icon-back" @click="$router.go(-1)" style="margin-bottom: 20px">返回</el-button>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="12">
            <el-form-item style="margin-bottom: 40px;"  label-width="100px" label="公告标题：" prop="title">
                <el-input type="input" style="width:300px" placeholder="请输入标题" v-model="postForm.title" clearable>
                </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="来源：">
                <el-input type="input" style="width:300px" placeholder="请输入来源" v-model="postForm.source" clearable>
                </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="公告内容：" prop="content">
                <tinymce :height=300 ref="editor" v-model="postForm.content" style="width:800px"></tinymce>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="margin-bottom: 20px;text-align: center;">
          <el-button @click="submitForm" >保存</el-button>
          <el-button type="info" @click="back">取消</el-button>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/singleImage3";
import MDinput from "@/components/MDinput";
import Multiselect from "vue-multiselect"; // 使用的一个多选框组件，element-ui的select不能满足所有需求
import "vue-multiselect/dist/vue-multiselect.min.css"; // 多选框组件css
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validateURL } from "@/utils/validate";
import { getListAPI, updateAPI,addAPI,getOneAPI} from '@/api/website-management/footer'

export default {
  name: "articleDetail",
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const id = this.$route.params.id
    return {
      postForm: {
        title:'',
        source:'',
        content:'',
        creater:'',
        id: ''
      },
      fetchSuccess: true,
      loading: false,
      userLIstOptions: [],
      platformsOptions: [
        { key: "a-platform", name: "a-platform" },
        { key: "b-platform", name: "b-platform" },
        { key: "c-platform", name: "c-platform" }
      ],
      rules: {
        title: [{  required: true, trigger: 'change', message: '请填写公告标题' }],
        content: [{required: true, trigger: 'change',  message: '请填写公告内容' }]
      }
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length;
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.isedit()
  },
  methods: {
    isedit(){
      this.$route.meta.title = '添加网站页脚'
      const id = this.$route.query.id;
      if(id){//修改
        this.$route.meta.title = '修改网站页脚'
        this.canuse = true
      }
    },
    back(){
      this.$router.back();
    },
    fetchData() {
      if(this.$route.query.id){
        getOneAPI(this.$route.query.id).then(res=>{
            if(res.data.code ===0){
              this.postForm = res.data.data
            }
        })
      }

    },
    submitForm() {
       this.$refs["postForm"].validate(valid => {
          if (valid) {
            if(this.postForm.id == ''){
              addAPI(this.postForm).then(res => {
                  if(res.data.code === 0){
                      this.$message.success(`添加成功`)
                      this.$router.go(-1);
                    } else{
                      this.$message.error(`添加失败`)
                    }
              })
            }else{
              updateAPI(this.postForm).then(res => {
                if(res.data.code === 0){
                  this.$message.success(`修改成功`)
                  this.$router.go(-1);
                } else{
                  this.$message.error(`修改失败`)
                }
              })
            }
          }
       })

    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.title-prompt {
  position: absolute;
  right: 0px;
  font-size: 12px;
  top: 10px;
  color: #ff4949;
}
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
