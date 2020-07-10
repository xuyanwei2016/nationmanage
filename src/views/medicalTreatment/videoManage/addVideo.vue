<template>
  <div class="app-container addCaseBank">
    <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">

      <el-form-item label="资源名称：" prop="name">
        <el-input v-model="resourceForm.name" clearable placeholder="" style="width:300px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="作者：" prop="memberId" >
        <el-select v-model="resourceForm.memberId" style="width:300px;margin-right:10px" :disabled="pageStatus == 1">
            <el-option v-for="item in memberList" :key="item.memberId" :label="item.userName" :value="item.memberId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="售价：" prop="realPrice">
        <el-input v-model="resourceForm.realPrice" clearable placeholder="" style="width:300px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="简介：" >
        <tinymce :height=300 ref="editor" v-model="resourceForm.synopsis" style="width:800px" :disabled="pageStatus == 1"></tinymce>
      </el-form-item>
      <el-form-item label="视频封面：">
        <el-upload :disabled="pageStatus == 1" class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.cover}&isOnLine=true`" v-if="resourceForm.cover" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon" style="width: 100%; height: 100%;">
          <div class="deleteImg" v-if="pageStatus != 1&&!$route.query.detailsId&&resourceForm.cover" @click.stop="deleteIMG">
            <i class="el-icon-close"></i>
          </div>
        </el-upload>
        <span class="tip" style="margin-left: 0">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
      <el-form-item label="视频文件：" prop="video">
        <el-upload :disabled="pageStatus == 1" class="video-uploader clearfix" :action="`${uploadUrl}${uploadPath}/video`" :show-file-list="false" :on-success="handleVideoSuccess" :before-upload="beforeVideoUpload">
          <div class="el-upload__text my_change_upload" v-if="!$route.query.detailsId">点击上传</div>
          <video v-if="resourceForm.video" :src="`${uploadUrl}?fileName=${resourceForm.video}&isOnLine=true`" controls>
            抱歉，您的浏览器不支持内嵌视频，你可以<a :href="`${uploadUrl}?fileName=${resourceForm.video}&isOnLine=true`" style="text-decoration:underline;">点击下载</a>查看
          </video>
          <i v-else class="el-icon-plus video-uploader-icon"></i>
        </el-upload>
        <span>{{resourceForm.video_zh}}</span>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button :loading="saveLoading" @click="dataSubmit" >保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
  import queryString from 'query-string'
  import { saveAPI, detailsAPI, editAPI ,getMemberListAPI} from '@/api/medicalTreatment/videoManage' //接口
  import { requestMsg, confirm } from '@/utils/publicFunctions'
  import { getMultipleSelectionIDs } from '@/filters/getIds'

  export default {
    components:{ Tinymce },
    data() {
      return {
        memberList:[],
        resourceForm: {
          name:"", // 资源名称
          cover:"", // 封面 ,
          memberId:"", //  会员ID（作者）
          realPrice:"",// 售价
          size:"",// 文件大小
          synopsis:"",// 简介
          timeLength:"",// 时长
          video:"", // 视频
        },
        isSubmit:true,
        uploading:false,
        pageStatus:0,
        diyTypeCode: [],
        defaultProps: {
          children: 'list',
          label: 'showName'
        },
        // 自定义标签
        labelList: [],
        labelQuery: {
          dataType: this.$route.query.articleName,
          nationsType: this.$store.getters.getNation,
        },
        options: [],
        rules:{
          name:[{ required: true, message: '请输入资源名称', trigger: 'change' }, { pattern:/^.{1,50}$/,message: '资源名称长度必须小于50位', trigger: 'change'} ],
          realPrice:[ { required: true,pattern:/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)|0/,message: '请输入价格,范围在0-99999之间', trigger: 'change' },],
          memberId:[ { required: true, message: '请选择作者', trigger: 'change'}],
          synopsis:[ { required: true, message: '请填写简介', trigger: 'change'}],
          video:[ { required: true, message: '请上传视频', trigger: 'change blur'}],
        },
        saveLoading:false,
        resourceList: [],
      }
    },
    computed: {
    },
    watch: {
    },
    created(){
      this.uploadUrl = uploadUrl
      this.uploadPath = uploadPath
    },
    mounted() {
      this.getMemberList()

      this.isEdit();
    },
    methods: {
      // 获取会员列表
      getMemberList(){
        getMemberListAPI().then(res =>{
          if(res.data.code == 0){
            this.memberList= res.data.data
          }
        })
      },

      pageDetails(id){//查看和修改的页面信息
        detailsAPI(id).then(res => {
          if (res.data.code === 0) {
            let diyArr = res.data.data.diyType.map(el => {//自定义分类
              let {code, dtId} = el
              return {code,dtId}
            })
            this.diyTypeCode = diyArr;//自定义分类
            this.checkedKeys = getMultipleSelectionIDs(res.data.data.diyType,'dtId')
            if(res.data.data.priceOption == 0){//免费
              this.resourceForm = {...res.data.data,priceOption:0}
            } else{ //付费
              this.resourceForm = {...res.data.data,priceOption:1}
            }
            this.resourceForm.price=this.resourceForm.price!=null?Number(this.resourceForm.price).toFixed(2):null;
            this.resourceForm.realPrice=this.resourceForm.realPrice?Number(this.resourceForm.realPrice).toFixed(2):'0.00';
          } else{
            this.$message.error('加载失败')
          }
        })
      },
      //图片
      beforePicUpload(file){
        const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/bmp' || file.type == 'image/gif';
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
        this.resourceForm.cover = response
      },
      handlePicPreview(file){ // 图片预览
        this.dialogImage = file
        this.dialogPvVisible = true
      },
      handleRemove(){ // 图片删除
        this.resourceForm.cover = ''
      },
      deleteIMG(){
        this.resourceForm.cover = ''
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
        console.log(response);
        this.$message.success('上传成功');
        this.resourceForm.video = response.fileName
        this.resourceForm.video_zh = response.originalFileName
        // 转换时间
        var fileTime = response.time
        var hours = Math.floor(fileTime / 3600000)
        var fileTimeHours = fileTime % 3600000
        var minutes = Math.floor(fileTimeHours / 60000)
        var fileTimeMinutes = fileTimeHours % 60000
        var second = Math.floor(fileTimeMinutes / 1000)
        if(hours == '0' && minutes == '0') {
          var time =  second + '秒'
        } else if(hours == '0') {
          var time =  minutes + '分' + second + '秒'
        } else {
          var time = hours + '时'+ minutes + '分' + second + '秒'
        }

        // 转换大小
        var fileSize = response.size
        var convertFileSize = Math.round((fileSize / 1024 / 1024) * 100)/100.0
        var size =  convertFileSize + 'M'

        // const video = {
        //   keywords: this.resourceForm.keywords,
        //   name: response.originalFileName,
        //   nationsType: this.resourceForm.nationsType,
        //   resourceCode: response.fileName,
        //   resourceType:  61,
        //   size: size,
        //   source: this.resourceForm.source,
        //   timeLength: time
        // }
        this.resourceForm.size = size
        this.resourceForm.timeLength = time


        // this.resourceList.push(video);
        // this.resourceForm.names.push(response.originalFileName)
        // this.resourceForm.videos.push(response.fileName)

        this.$refs['resourceForm'].validate((valid) => {})
      },


      isEdit(){
        const id = this.$route.query.id; //修改id
        const detailsId = this.$route.query.detailsId; //查看id
        this.$route.meta.title = '添加视频'
        if(id){//修改
          this.$route.meta.title = '修改视频'
          this.pageDetails(id);
        }
        if(detailsId) {//查看
          this.pageStatus = 1
          this.$route.meta.title = '查看视频'
          this.pageDetails(detailsId);
        }
      },
      pageDetails(id){//查看和修改的页面信息
        detailsAPI(id).then(res => {
          if (res.data.code === 0) {
            this.resourceForm = res.data.data
            // this.resourceForm.realPrice=this.resourceForm.realPrice?Number(this.resourceForm.realPrice).toFixed(2):'0.00';

          } else{
            this.$message.error('加载失败')
          }
        })
      },

      //保存
      dataSubmit() {
        console.log(this.isSubmit);
        if(!this.isSubmit)return
        this.isSubmit=false;
        this.$refs['resourceForm'].validate((valid) => {
          console.log(valid);
          if (valid) {

                const id = this.$route.query.id; //修改id
                this.resourceForm.realPrice=this.resourceForm.realPrice?Number(this.resourceForm.realPrice).toFixed(2):'0.00';
                this.saveLoading = true
                if(id) {//修改
                  this.resourceForm.id = id;
                  editAPI(this.resourceForm).then(res => {
                    if (res.data.code === 0) {
                      this.saveLoading = false
                      this.$message.success('编辑成功')
                      this.$router.push({ path: '/medicalTreatment/videoManage' });
                    } else{
                      this.$message.error('编辑失败')
                    }
                    this.isSubmit=true;
                  })
                } else{
                  saveAPI(this.resourceForm).then(res => {
                    if (res.data.code === 0) {
                      this.saveLoading = false
                      this.$message.success('添加成功')
                      this.$router.push({ path: '/medicalTreatment/videoManage' });
                    } else{
                      this.$message.error('添加失败')
                    }
                    this.isSubmit=true;
                  })
                }

          }else{
            this.isSubmit=true;
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
.tip{
    color: #ccc;
    margin-left: 30px;
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
  .el-button {
    margin-bottom: 10px;
  }

  .audio-uploader,.video-uploader {
    position: relative;
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

  .deleteImg{
      font-size:20px;
      background: #000;
      color: #fff;
      width: 25px;
      height: 25px;
      line-height: 25px;
      position: absolute;
      top: 0;
      left: 150px;
      border-radius: 3px;
    }

</style>
