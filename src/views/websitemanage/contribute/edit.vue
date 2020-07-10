<template>
  <div class="app-container inputCss">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)" style="margin-bottom: 20px">返回</el-button>
      <div class="title">基本信息</div>
      <el-form-item label="文章标题：" prop="title">
        <el-input v-model="resourceForm.title"  clearable placeholder="建议在14个字以内，最多不超过50个字" style="width:300px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="作者：" prop="author">
        <el-input v-model="resourceForm.author" clearable style="width:300px;margin-right:10px" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="关键词：" prop="keywords">
        <el-input v-model="resourceForm.keywords" clearable placeholder="多个关键词用逗号隔开" style="width:300px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="文章封面：" prop="img">
        <el-upload :disabled="$route.query.detailsId?true:false" class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.img}&isOnLine=true`" v-if="resourceForm.img" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon"
               style="width: 100%; height: 100%;">
          <!--<i class="el-icon-plus avatar-uploader-icon" v-else></i>-->
        </el-upload>
        <span class="tip" v-if="pageStatus == 0">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、gif、bmp格式，不超过2M</span>
      </el-form-item>
      <el-form-item label="简介：" prop="synopsis">
        <tinymce :height=300 ref="editor" v-model="resourceForm.synopsis" style="width:800px"></tinymce>
      </el-form-item>
      <el-form-item label="正文：" prop="text">
        <tinymce :height=300 ref="editor" v-model="resourceForm.text" style="width:800px"></tinymce>
      </el-form-item>
      <el-form-item label="音频文件：">
        <el-upload :disabled="$route.query.detailsId?true:false" class="audio-uploader clearfix" :action="`${uploadUrl}${uploadPath}/video`" :show-file-list="false" :on-success="handleAudioSuccess" :before-upload="beforeAudioUpload" v-if="!pageStatus||resourceForm.audio">
          <div class="el-upload__text my_change_upload" v-if="pageStatus == 0">点击上传</div>
          <audio  v-if="resourceForm.audio" :src="`${uploadUrl}?fileName=${resourceForm.audio}&isOnLine=true`" controls>
            抱歉，您的浏览器不支持内嵌视频，你可以<a :href="`${uploadUrl}?fileName=${resourceForm.audio}&isOnLine=true`" style="text-decoration:underline;">点击下载</a>查看
          </audio>
          <i v-else class="el-icon-plus audio-uploader-icon"></i>
        </el-upload>
        <span>{{pageStatus&&!resourceForm.audio?'未上传音频':resourceForm.audio_zh}}</span>
        <!--<span>{{resourceForm.audio_zh}}</span>-->
      </el-form-item>
      <el-form-item label="视频文件：">
        <el-upload :disabled="$route.query.detailsId?true:false" class="video-uploader clearfix" :action="`${uploadUrl}${uploadPath}/video`" :show-file-list="false" :on-success="handleVideoSuccess" :before-upload="beforeVideoUpload" v-if="!pageStatus||resourceForm.video">
          <div class="el-upload__text my_change_upload" v-if="pageStatus == 0">点击上传</div>
          <video v-if="resourceForm.video" :src="`${uploadUrl}?fileName=${resourceForm.video}&isOnLine=true`" controls>
            抱歉，您的浏览器不支持内嵌视频，你可以<a :href="`${uploadUrl}?fileName=${resourceForm.video}&isOnLine=true`" style="text-decoration:underline;">点击下载</a>查看
          </video>
          <i v-else class="el-icon-plus video-uploader-icon"></i>
        </el-upload>
        <span>{{pageStatus&&!resourceForm.video?'未上传视频':resourceForm.video_zh}}</span>
      </el-form-item>
      <div class="title">附件信息</div>
      <el-form-item label="附件：">
        <span>{{resourceForm.accessories_zh?resourceForm.accessories_zh:'暂无信息'}}</span>
        <!-- <el-button @click="queryAccessories">查看</el-button> -->
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button @click="dataSubmit" >保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { updataAPI, detailsAPI } from '@/api/website-management/contribute' //接口
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import Cookies from 'js-cookie'

export default {
  components:{ Tinymce },
  data() {
    return {
      resourceForm: {
        video:null,
        audio:null,
        img: null
      },
      uploading:false,
      pageStatus:0,

      rules:{
        title:[
          { required: true, trigger: 'change', message: '请输入文章标题'},{pattern:/^.{1,50}$/,message: '文章标题长度必须小于50位', trigger: 'change' },
        ],
        author:[
          { required: true,pattern:/^.{1,10}$/,message: '请输入正确的作者', trigger: 'change' },
        ],
        keywords:[
          { required: true, trigger: 'change', message: '请输入关键词'},{pattern:/^.{1,30}$/,message: '关键词长度必须小于30位', trigger: 'change' },
        ],
        synopsis:[
          { required: true,message: '请输入简介', trigger: 'change' },
        ],
        text:[
          { required: true, message: '请输入正文', trigger: 'change' },
        ]
      },
    }
  },
  created(){
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
  },
  mounted() {
    this.isEdit();
  },
  methods: {
  //  queryAccessories() {
  //    window.open(uploadUrl+"?fileName="+this.resourceForm.accessories+"&isOnLine=true")
  //  },
    isEdit(){
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      if(id){//修改
        this.$route.meta.title = '修改稿件'
        this.pageDetails(id);
      }
      if(detailsId) {//查看
        this.pageStatus = 1
        this.$route.meta.title = '查看稿件'
        this.pageDetails(detailsId);
      }
    },

    pageDetails(id){//查看和修改的页面信息
      detailsAPI(id).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          this.resourceForm = res.data.data;
        } else{
          this.$message.error('加载失败')
        }
      })
    },

    //文章封面图片
    beforePicUpload(file){
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/bmp';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/JPEG/PNG/GIF/BMP 格式!');
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
      this.resourceForm.img = response
    },
    handlePicPreview(file){ // 图片预览
      this.dialogImage = file
      this.dialogPvVisible = true
    },
    handleRemove(){ // 图片删除
      this.resourceForm.img = ''
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
      this.resourceForm.video = response.fileName
      this.resourceForm.video_zh = response.originalFileName

    },
    //音频
    beforeAudioUpload(file){ //
      let type = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase()
      const isAideo = type === 'mp3';
      if (!isAideo) {
        this.$message.error('上传视频只能是 mp3 格式!');
        return isAideo
      }
      this.$message.warning('上传中');
    },
    handleAudioSuccess(response, file, fileList){
      this.$message.success('上传成功');
      this.resourceForm.audio = response.fileName
      this.resourceForm.audio_zh = response.originalFileName
    },
    //保存
    dataSubmit() {
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {//必填
          const id = this.$route.query.id; //修改id
          if(id) {//修改
            this.resourceForm.id = id
            updataAPI(this.resourceForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success('编辑成功')
                this.$router.back()
                this.isEdit();
              } else{
                this.$message.error('编辑失败')
              }
            })
          }
        } else{
          this.$message.error('请将信息补全!');
        }
      })
    },
    cancel() {//取消
      this.$router.go(-1);
    },
  }
}
</script>

<style scoped lang="less">
  .avatar[data-v-53d05e79] {
    width: 200px;
    height: 200px;
    display: block;
  }
  .title {
    color: #000;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .app-container{
  .el-upload:hover {
      .my_change_upload {
        display: block;
      }
    }

    .my_change_upload {
      position: absolute;
      top: 10px;
      right: 20px;
      z-index: 10;
      background: #409eff;
      padding: 0 4px;
      display: none;
      border-radius: 6px;
      color: #fff;
    }
  }
</style>
