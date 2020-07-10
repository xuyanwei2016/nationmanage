<template>
  <div class="app-container">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-form-item label="资源名称：" prop="name">
        <el-input v-model="resourceForm.name" clearable placeholder="请输入资源名称"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="售价：" prop="price">
        <el-input v-model="resourceForm.price" clearable placeholder="请输入售价" style="width:250px;margin-right:10px"></el-input>元
      </el-form-item>
      <el-form-item label="简介：">
          <tinymce :height=300 ref="editor" v-model="resourceForm.content" style="width:800px"></tinymce>
      </el-form-item>
      <el-form-item label="视频封面：">
        <el-upload :action="`${uploadUrl}${uploadPath}`" list-type="picture-card" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload" :disabled="uploading" :file-list="resourceForm.picList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
      <el-form-item label="商品视频：" prop="video">
        <el-upload class="video-uploader clearfix" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-success="handleVideoSuccess" :before-upload="beforeVideoUpload">
          <video v-if="resourceForm.video" :src="`${uploadUrl}?fileName=${resourceForm.video}&isOnLine=true`" controls>
            抱歉，您的浏览器不支持内嵌视频，你可以<a :href="`${uploadUrl}?fileName=${resourceForm.video}&isOnLine=true`" style="text-decoration:underline;">点击下载</a>查看
          </video>
          <span v-if="refresh == 3">{{refresh}}</span>
          <i v-else class="el-icon-plus video-uploader-icon"></i>
        </el-upload>

      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-if="isEdit != 1">
      <el-button @click="dataSubmit">保存</el-button>
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
import { saveAPI, editAPI, detailsAPI } from '@/api/resource/video'
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
          { required: true,pattern:/^.{1,50}$/,message: '请输入正确的资源名称', trigger: 'change' }
        ],
        price:[
          { required:true,pattern:/^(\d|[1-9]\d+)([.][0-9]{1,2})?$/,trigger: 'change',message:'请输入价格数字，小数点最多2位' }
        ],
      },
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
      this.$route.meta.title = '修改视频库'
      detailsAPI(id).then(res => {
        if(this.refresh == 0){
          this.refresh = 1
        }else{
          this.refresh = 0
        }
        this.editId = id
        this.resourceForm.name = res.data.data.name
        this.resourceForm.price = res.data.data.price 
        this.resourceForm.content = res.data.data.synopsis 
        this.resourceForm.video = res.data.data.video
        if(res.data.data.source){
          this.resourceForm.relationPic = res.data.data.source 
          this.resourceForm.picList = [{url:`${this.uploadUrl}?fileName=${res.data.data.source}&isOnLine=true`, response: res.data.data.source, name: res.data.data.source}]
          document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
        }
      })
    }
    const isEdit = this.$route.query.isEdit;
    if(isEdit == false) {//查看不能修改
      this.isEdit = 1
      this.$route.meta.title = '查看视频库'
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
    //视频
    beforeVideoUpload(file){ //beforeVideoUpload、handleVideoSuccess上传视频相关
      let type = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase()
      const isVideo = type === 'mp4';
      if (!isVideo) {
        this.$message.error('上传视频只能是 mp4 格式!');
        return isVideo
      }
      this.$message.warning('上传中');
    },
    handleVideoSuccess(response, file, fileList){
      this.$message.success('上传成功');
      if(this.refresh == 0){
        this.refresh = 1
      }else{
        this.refresh = 0
      }
      this.resourceForm.video = response
    },
    dataSubmit() {//保存
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {
          if(this.resourceForm.video){
            let videoInfo = {
              name: this.resourceForm.name, //视频名称
              price: this.resourceForm.price, // (string, optional): 定价 ,
              source: this.resourceForm.relationPic, // (string, optional): 来源 ,
              synopsis: this.resourceForm.content, // (string, optional): 简介 ,
              video: this.resourceForm.video, // (string, optional): video
              //id (integer, optional): 视频id，新增时不需要填写 ,
            }

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
            this.$message.error('请上传视频!');
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