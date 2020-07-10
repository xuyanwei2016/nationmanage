<template>
  <div class="app-container">
    <el-form :model="resourceForm" ref="resourceForm" label-position="right" label-width="120px" class="ib">
      <el-form-item label="文章名称：">
        <el-input v-model="resourceForm.resName" clearable placeholder="请输入文章标题" style="width:250px;margin-right:10px" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="资源类型：">
        <el-input v-model="typeList[resourceForm.resType]" clearable placeholder="资源类型" style="width:250px;margin-right:10px" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="文章封面：">
        <el-upload class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.resImg}&isOnLine=true`" v-if="resourceForm.resImg" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon"
               style="width: 100%; height: 100%;">
          <!--<i class="el-icon-plus avatar-uploader-icon" v-else></i>-->
        </el-upload>
        <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
    </el-form>
    <el-form :model="articleForm" ref="articleForm" label-position="right" label-width="120px" class="ib">
      <el-form-item label="所属民族：">
        <el-input v-model="articleForm.keywords" clearable placeholder="请输入所属民族" style="width:250px;margin-right:10px" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="作者：">
        <el-input v-model="articleForm.author" clearable placeholder="请输入作者" style="width:250px;margin-right:10px" disabled="disabled"></el-input>
      </el-form-item>
      <!-- 医著价格 -->
      <el-form-item label="价格：" v-if="list.resType == 1">
        <el-input v-model="articleForm.price" clearable placeholder="请输入价格" style="width:250px;margin-right:10px" disabled="disabled"></el-input>
      </el-form-item>
      <!-- else -->
      <el-form-item label="价格：" v-else>
        <el-input v-model="articleForm.realPrice" clearable placeholder="请输入价格" style="width:250px;margin-right:10px" disabled="disabled"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dataSubmit" >保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { recomDetailsAPI, articleDetailsAPI, updateContentAPI, updateArticleAPI } from '@/api/database/recommend' //接口
import { resourceListAPI } from '@/api/database/article'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'

export default {
  components:{ Tinymce },
  data() {
    return {
      resourceForm: {},
      articleForm:{},
      uploading:false,
      checkedKeys:[],
      contentId:'',
      articleId:null,
      type: null,
      typeList: [],
      list:{},
    }
  },
  created(){
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
  },
  mounted() {
    this.contentId = this.$route.query.id;//推荐内容id
    this.getResource();
  },
  methods: {
    getResource() {
      resourceListAPI({isMedia:0}).then(res => {
        if(res.data.code === 0){
          this.typeList = res.data.data
          this.pageDetails();
        } else {
          this.$message.error('获取数据失败');
        }
      })
    },
    pageDetails(){//一个是推荐位内容详情
      recomDetailsAPI(this.contentId).then(res => {
        if (res.data.code === 0) {
          this.resourceForm = res.data.data;
          this.list = res.data.data
          this.articleId = res.data.data.resId
          this.type = res.data.data.resType
          this.articleDetails(res.data.data.resId,res.data.data.resType)
        } else{
          this.$message.error('加载失败')
        }
      })
    },
    articleDetails(id,type) {//一个是文章的详情
      articleDetailsAPI({resourceId:id,resourceType:type}).then(res => {
        if (res.data.code === 0) {
          this.articleForm = res.data.data;
          this.articleForm.price=this.articleForm.price?Number(this.articleForm.price).toFixed(2):'0.00';
          this.articleForm.realPrice=this.articleForm.realPrice?Number(this.articleForm.realPrice).toFixed(2):'0.00';
        } else{
          this.$message.error('加载失败')
        }
      })
    },
    //图片
    beforePicUpload(file){
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
        return isJPG
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return isLt2M
      }
      this.uploading = true
      this.$message.warning('上传中');
    },
    handlePicSuccess(response, file, fileList){
      this.uploading = false
      this.$message.success('上传成功');
      this.resourceForm.resImg = response
    },
    handlePicPreview(file){ // 图片预览
      this.dialogImage = file
      this.dialogPvVisible = true
    },
    handleRemove(){ // 图片删除
      this.resourceForm.resImg = ''
    },
    //保存
    dataSubmit() {
      if(this.resourceForm.resImg){
        const img = this.resourceForm.resImg
        updateContentAPI(this.resourceForm).then(res => {
          if (res.data.code === 0) {
               if (res.data.code === 0) {
                 this.$message.success('保存成功!')
                 this.$router.go(-1)
               } else{
                 this.$message.error('保存失败!');
               }
          }
        })
      } else{
        this.$message.error('请选择一张图片哦!');
      }
    },
  }
}
</script>

<style scoped>
  form{
    float: left;
    width: 100%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .ib{
    display:inline-block;
  }
  .tip{
    color: #ccc;
  }
  .aa{
    display: block !important;
    width: 100%;
  }
</style>
