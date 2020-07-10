<template>
  <div class="app-container">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <span v-if="refresh === 3">{{refresh}}</span>
      <el-form-item label="课程名称：" prop="name">
        <el-input v-model="resourceForm.name" clearable placeholder="请输入课程名称"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="共：" prop="period">
        <el-input v-model="resourceForm.period" clearable placeholder="请输入期数" style="width:250px;margin-right:10px"></el-input>期
      </el-form-item>
      <el-form-item label="作者：">
        <el-input v-model="resourceForm.author" clearable placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item label="关键词：">
        <el-input v-model="resourceForm.keyword" clearable placeholder="请输入关键词"></el-input>
      </el-form-item>
      <el-form-item label="视频封面：">
        <el-upload :action="`${uploadUrl}${uploadPath}`" list-type="picture-card" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload" :disabled="uploading" :file-list="resourceForm.picList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
       <el-form-item label="售价：" prop="price">
        <el-input v-model="resourceForm.price" clearable placeholder="请输入售价"></el-input>
      </el-form-item>
      <el-form-item label="划线价格：">
        <el-input v-model="resourceForm.previousPrice" clearable placeholder="请输入划线价格"></el-input>
      </el-form-item>
      <el-form-item label="课程简介：">
        <el-input v-model="resourceForm.Introduct" clearable placeholder="请输入课程简介"></el-input>
      </el-form-item>
      <el-form-item label="课程详情：">
          <tinymce :height=300 ref="editor" v-model="resourceForm.content" style="width:800px"></tinymce>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="isEdit != 1">
      <el-button @click="dataSubmit" >保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

    <el-dialog :title="dialogImage.name" :visible.sync="dialogPvVisible" custom-class="image-preview">
      <img :src="`${dialogImage.url}`" :alt="`${dialogImage.name}`">
    </el-dialog>

  </div>
</template>

<style scoped>
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

<script>
import Tinymce from '@/components/Tinymce'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { saveAPI, editAPI, detailsAPI } from '@/api/resource/course'
import { requestMsg, confirm } from '@/utils/publicFunctions'

export default {
  components:{ Tinymce },
  data() {
    return {
      resourceForm: {},
      uploading:false,
      dialogVisible:false,
      dialogPvVisible:false,
      dialogImage: {},
      refresh: 0,
      editId: '',
      isEdit:0,
      rules:{
        name:[
          { required: true,pattern:/^.{1,50}$/,message: '请输入正确的课程名称', trigger: 'change' }
        ],
        period:[
          { required: true,pattern:/^([1]?\d{1,3})$/,message: '请输入正确的期数', trigger: 'change' }
        ],
        price:[
          { required:true,pattern:/^(\d|[1-9]\d+)([.][0-9]{1,2})?$/,trigger: 'change',message:'请输入价格数字，小数点最多2位' }
        ],
      },
      refresh:0,
    }
  },
  created(){
    this.dialogStatus = this.$route.query.type
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
  },
  mounted() {
    const id = this.$route.query.id;
    if(id){//修改 -- 查看
      this.$route.meta.title = '修改课程库'
      detailsAPI(id).then(res => {
        if(this.refresh == 0){
          this.refresh = 1
        }else{
          this.refresh = 0
        }
        console.log(res.data.data);
        this.editId = id
        
        this.resourceForm.author = res.data.data.author
        this.resourceForm.name = res.data.data.courseName
        this.resourceForm.content = res.data.data.detail
        this.resourceForm.keyword = res.data.data.keywords
        this.resourceForm.previousPrice = res.data.data.linePrice
        this.resourceForm.price = res.data.data.price
        this.resourceForm.Introduct = res.data.data.synopsis
        this.resourceForm.period = res.data.data.totalPeriods
        if(res.data.data.cover){
          this.resourceForm.relationPic = res.data.data.cover 
          this.resourceForm.picList = [{url:`${this.uploadUrl}?fileName=${res.data.data.cover}&isOnLine=true`, response: res.data.data.cover, name: res.data.data.cover}]
          document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
        }
      })
    }
    const isEdit = this.$route.query.isEdit;
    if(isEdit == false) {//查看不能修改
      this.isEdit = 1
      this.$route.meta.title = '查看课程库'
    }
  },
  methods: {
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
      document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
      this.resourceForm.relationPic = response
    },
    handlePicPreview(file){ // 图片预览
      this.dialogImage = file
      this.dialogPvVisible = true
    },
    handleRemove(){ // 图片删除
      document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
      this.resourceForm.relationPic = ''
    },
 
    dataSubmit() {//保存
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {
            let videoInfo = {
              author: this.resourceForm.author,//(string, optional): 作者 ,
              courseName: this.resourceForm.name, // (string): 课程名称 ,
              cover: this.resourceForm.relationPic, // (string, optional): 封面 ,
              detail: this.resourceForm.content, //  (string, optional): 课程详情 ,
              keywords: this.resourceForm.keyword, //  (string, optional): 关键词 ,
              linePrice: this.resourceForm.previousPrice, //  (number, optional): 划线价格 ,
              price: this.resourceForm.price, //  (number, optional): 售价 ,
              synopsis: this.resourceForm.Introduct, //  (string, optional): 课程简介 ,
              totalPeriods: this.resourceForm.period, //  (integer, optional): 总期数 ,
              //id (integer, optional): 课程id，新增时不需要填写 ,
            }
            const isEdit = this.$route.query.isEdit;
            if(this.editId) {//修改
              videoInfo.id = this.editId
              editAPI(videoInfo).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('编辑成功')
                  this.dialogVisible = false
                  this.$router.go(-1);
                } else{
                  this.$message.error('编辑失败')
                }
              })
            } else{
              saveAPI(videoInfo).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('添加成功')
                  this.dialogVisible = false
                  this.$router.go(-1);
                } else{
                  this.$message.error('添加失败')
                }
              })
            }
        } else{
          this.$message.error('请将基础信息补全!');
        }
      })
    },
    cancel() {//取消
      this.$router.go(-1);
    },
  }
}
</script>