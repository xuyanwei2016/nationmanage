<template>
  <div class="app-container">
    <el-form :model='resourceForm' ref='resourceForm' :rules='rules' label-position='right' label-width='120px'>
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <div class="title">基本信息</div>
      <el-form-item label='资源标题：' prop='title'>
        <el-input v-model='resourceForm.title' placeholder="建议在14个字以内，最多不超过50个字" style='width:500px' :disabled="viewShow"></el-input>
      </el-form-item>
      <el-form-item label='作者：' prop='holder'>
        <el-select v-model='resourceForm.holder' :disabled="viewShow">
          <el-option v-for="item in memberList" :key="item.memberId" :label="item.userName"
                     :value="item.memberId" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='资源封面：'>
        <el-upload
          class="avatar-uploader"
          :action="`${uploadUrl}${uploadPath}`"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"  :disabled="viewShow">
          <img :src="`${uploadUrl}?fileName=${resourceForm.cover}&isOnLine=true`" v-if="resourceForm.cover"
               class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc">
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon"
               style="width: 100%; height: 100%;">
        </el-upload>
        <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
      <el-form-item label='分类：' prop='type'>
        <el-select v-model='resourceForm.type' @change='selectChang(cnkey)' :disabled="viewShow">
          <el-option v-for='(item,index) in statusList' :key='index' :value='item.enkey'
                     :label='item.cnkey'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='资源简介：'>
        <tinymce :height=300 :id="'editor1'" ref="editor" v-model="resourceForm.synopsis" style="width:800px" :disabled="viewShow"></tinymce>
      </el-form-item>
      <el-form-item label='资源详情：'>
        <tinymce :height=300  :id="'editor2'" ref="editor" v-model="resourceForm.text" style="width:800px" :disabled="viewShow" ></tinymce>
      </el-form-item>
      <el-form-item label='文章上传：'>
        <el-button v-if="resourceForm.pdf&&viewShow" @click="queryPDF" style="margin-bottom: 10px;">查看
        </el-button>
        <span v-if="resourceForm.pdf&&viewShow">{{resourceForm.pdfName}}</span>
        <span v-if="!resourceForm.pdf&&viewShow" style="color: #606266;">未上传文件</span>
        <el-upload
          v-if="!viewShow"
          class="upload-demo"
          :action="`${uploadUrl}${uploadPath}`"
          :on-preview="handlePreview"
          :on-remove="handleRemovePdf"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :before-upload="beforeArticleUpload"
          :on-success="handleAvatarSuccessArtical">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style='color:#ccc'>只能上传pdf/word文件，大小不超过1G</div>
        </el-upload>
        <!--<span>{{resourceForm.pdfName}}</span>-->
      </el-form-item>
      <el-form-item label='图集上传：' style='margin-bottom:40px'>
        <!--<template v-if="resourceForm.imgs&&resourceForm.imgs.length > 0">
          <div v-for='(item,index) in resourceForm.imgs' :key='index'>
            <div class="imgList" @mouseover="activeIndex = index">
              <img :src="`${uploadUrl}?fileName=${item}&isOnLine=true`" class="avatar">
              <div class="delete" v-if="activeIndex === index&&!viewShow" @mouseout="activeIndex = ''">
                <span><i class="el-icon-delete" @click="deleteImg(index)"></i></span>
              </div>
            </div>
          </div>
        </template>-->
        <div v-if="(!resourceForm.imgs||resourceForm.imgs.length==0)&&viewShow" style="color: #606266;">暂无图片集</div>
        <el-upload
          :action="`${uploadUrl}${uploadPath}`"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccessImgs"
          :file-list="imgList"
          :disabled="viewShow"
          :class="{hide:hideUpload}"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <span class="tips" style='color:rgba(216, 215, 215, 1)' v-if='!viewShow'>建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、gif、bmp格式，不超过2M</span>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label='视频文件：' prop='video ' ref='video'>
        <div v-if="!resourceForm.video&&viewShow" style="color: #606266;">暂无视频文件</div>
        <el-upload
          class=" clearfix"
          :action="`${uploadUrl}${uploadPath}/video`"
          :show-file-list="false"
          :on-success="handleVideoSuccess"
          :before-upload="beforeVideoUpload"
          accept=".AVI, .WMV, .RMVB, .MP4, .MOV, .FLV"
          v-if="!viewShow"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <!--<span v-if="resourceForm.video == null" style="color:#FC721F;margin-left:10px;">未选择文件</span>-->
          <span v-if="resourceForm.video">{{resourceForm.videoName}}</span>
        </el-upload>
        <video v-if="resourceForm.video" :src="`${uploadUrl}?fileName=${resourceForm.video}&isOnLine=true`" controls style="width:500px;height:300px;border:1px solid #ccc;margin-top:10px;"></video>
        <el-button type=primary v-if='this.resourceForm.video&&!viewShow' @click='deleteVideo' style='display: block'>删除视频
        </el-button>
      </el-form-item>
      <el-form-item label='音频资源：'>
        <div v-if="resourceForm.audio&&viewShow">
          <audio :src="`${uploadUrl}?fileName=${resourceForm.audio}&isOnLine=true`" controls></audio>
          <span style="display: block;height: 24px; line-height: 24px;">{{resourceForm.audioName}}</span>
        </div>
        <div v-if="!resourceForm.audio&&viewShow" style="color: #606266;">暂无音频资源</div>
        <el-upload
          class="upload-demo"
          :action="`${uploadUrl}${uploadPath}/video`"
          :on-preview="handlePreviewAudio"
          :on-remove="handleRemoveAudio"
          :before-remove="beforeRemoveAudio"
          :before-upload="beforeUploadAudio"
          :on-success="handleVideoSuccessAudio"
          multiple
          :limit="1"
          :on-exceed="handleExceedAudio"
          :file-list="fileListAudio" v-if="!viewShow">
          <span></span>
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style='color:#ccc'>只能上传mp3/oog文件，且不超过50mb</div>
        </el-upload>
      </el-form-item>
      <div class="title">资源状态</div>
      <el-form-item label='是否显示：'>
        <el-radio-group v-model='resourceForm.status' :disabled="viewShow">
          <el-radio :label='4'>上架</el-radio>
          <el-radio :label='5'>下架</el-radio>
        </el-radio-group>
        <span class="tip" v-if="!viewShow">审核通过之后平台不显示</span>
      </el-form-item>
      <el-form-item label='有效期：'>
        <el-radio-group v-model='resourceForm.valid' :disabled="viewShow">
          <el-radio label='0'>永久</el-radio>
          <el-radio label='1'>固定日期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-if="resourceForm.valid == '1'" v-model="resourceForm.indate" type="date" placeholder="选择日期"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <div class="title">参与方式</div>
      <el-form-item label='售价：'>
        <el-radio-group v-model='resourceForm.priceOption' :disabled="viewShow">
          <el-radio label='0'>免费</el-radio>
          <el-radio label='1'>付费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="resourceForm.priceOption == '1'" prop='realPrice'>
        <el-input v-model="resourceForm.realPrice" clearable placeholder="请输入售价" style="width:250px;margin-right:10px" :disabled="viewShow"></el-input>
        <span>元</span>
      </el-form-item>
      <el-form-item label='划线价：' prop='price'>
        <el-input v-model="resourceForm.price" clearable placeholder="请输入定价" style="width:250px;margin-right:10px"  :disabled="viewShow"></el-input>
        <span>元</span>
        <span class="tip"  v-if="!viewShow">请设置资源划线价钱，不填写默认不显示</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="dataSubmitLoading" @click="dataSubmit" v-if='!viewShow'>保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>
<script>
  import Tinymce from '@/components/Tinymce'
  import {getDictionaryResoursAPI,getAutherResoursAPI, resourceSaveAPI, resourceUpdataAPI, getDetailAPI} from '@/api/onlinePublishing/index'
  import {getMemberListAPI} from '@/api/medicalTreatment/videoManage'
  import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js'

  export default {
    components: {Tinymce},
    data() {
      return {
        resourceForm: {
          title: '',
          holder: '',
          cover: '',
          type: '',
          synopsis: '',
          text: '',
          video: '',
          status: 1,
          indate: '',
          priceOption: '1',
          valid: '1',
          price: '',
          realPrice: '',
          imgs: [],
          audio: '',
          pdf: null,
          pdfName: '',
          names: [],
          videos: [],
        },
        dataSubmitLoading: false,
        cnkey: '',
        selectType: '',
        memberList: [],
        uploading: false,
        statusList: [],
        fileList: [],
        dialogVisible: false,
        dialogImageUrl: '',
        fileListAudio: [],
        rules: {
          title: [{required: true, message: '请输入资源标题', trigger: 'change'}, {
            pattern: /^.{1,50}$/,
            message: '资源标题长度必须小于50位',
            trigger: 'change'
          }],
          holder: [{required: true, message: '请选择作者', trigger: 'change'}],
          realPrice: [{
            required: false,
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
            message: '请输入价格,范围在0.1-99999之间',
            trigger: 'change'
          },],
          price: [{
            required: false,
            pattern: /^\d+(\.\d{0,2})?$/,
            message: '请输入0-99999之间的数字，最多保留两位小数',
            trigger: 'change'
          },],
          type: [{required: true, message: '请选择分类', trigger: 'change'}]
        },

        videoFlag: false,
        videoUploadPercent: '0',
        pageStatus: 1,
        resourceList: [],
        imgList: [],
        viewShow: false,
        hideUpload: false,
        activeIndex: ''
      }
    },
    created() {
      this.uploadUrl = uploadUrl
      this.uploadPath = uploadPath
      let type = this.$route.query.type
      if (type == 'view') {
        this.viewShow = true;
        this.hideUpload = true;
        this.$route.meta.title = '查看资源'
      } else {
        this.viewShow = false
        this.$route.meta.title = '修改资源'
      }
    },
    mounted() {
      this.getMemberList()
      this.isEdit()
    },
    watch:{
    'resourceForm.holder'(n,o){
      this.resourceForm.type='';
      this.getDictionaryResours(n);
  },
    },
    methods: {
      deleteVideo() {
        this.resourceForm.video = ''
        this.resourceForm.videoName = ''
      },
      deleteImg(index) {
        this.resourceForm.imgs.splice(index, 1)
      },
      isEdit() {
        const id = this.$route.query.id  //修改
        const detailsId = this.$route.query.detailsId  //查看
        if (id) {
          this.$route.meta.title = '修改资源'
          this.pageDetails(id)
        }
        if (detailsId) {
          this.pageStatus = 1
          this.$route.meta.title = '查看资源'
          this.pageDetails(detailsId)
        }
      },
      pageDetails(id) {
        this.imgList=[];
        getDetailAPI(id).then(res => {
          if (res.data.code == 0) {
            this.resourceForm = res.data.data;
            if (res.data.data.pdf) {
              this.fileList = [{name: res.data.data.pdfName, url: res.data.data.pdf}];
            }
            if (res.data.data.audio) {
              this.fileListAudio = [{name: res.data.data.audioName, url: res.data.data.audio}];
            }
            if (res.data.data.imgs&&res.data.data.imgs.length>0) {
              res.data.data.imgs.map(item=>{
                this.imgList = [...this.imgList,{url:this.uploadUrl + "?fileName=" + item + "&isOnLine=true",response:item}];
              })
            }
            this.resourceForm.imgs=this.resourceForm.imgs||[];
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      dataSubmit() {
        this.$refs['resourceForm'].validate((valid) => {
          if (valid) {
            this.dataSubmitLoading = true;
            if (this.resourceForm.valid == '0' || (this.resourceForm.valid == '1' && this.resourceForm.indate != '')) {
              if (this.resourceForm.priceOption == '0' || (this.resourceForm.priceOption == '1' && this.resourceForm.realPrice != '')) {
                const id = this.$route.query.id
                if (id) { //修改
                  console.log(JSON.stringify(this.resourceForm))
                  resourceUpdataAPI(this.resourceForm).then(res => {
                    if (res.data.code == 0) {
                      this.$message.success('编辑成功')
                      this.$router.push({path: '/medicalTreatment/resources'})
                    } else {
                      this.$message.error('添加失败')
                    }
                    this.dataSubmitLoading = false;
                  })
                } else {  //添加
                  resourceSaveAPI(this.resourceForm).then(res => {
                    if (res.data.code == 0) {
                      this.$message.success('添加成功')
                      this.$router.push({path: '/medicalTreatment/resources'})
                    } else {
                      this.$message.error('添加失败')
                    }
                    this.dataSubmitLoading = false;
                  })
                }
              } else {
                this.$message.error('请填写售价')
              }
            } else {
              this.$message.error('请选择有效期')
            }
          } else {
            this.$message.error('请将信息补全')
          }
        })
      },
      // 音频上传
      handleVideoSuccessAudio(response) {
        this.resourceForm.audio = response.fileName;
      },
      beforeUploadAudio(file) {
        const isAudio = file.type == 'audio/mp3' || file.type == 'audio/oog';
        const isAu = file.size / 1024 / 1024 < 50;
        if (!isAudio) {
          this.$message.error('请上传正确的格式')
          return isAudio
        }
        if (!isAu) {
          this.$message.error('上传音频大小不能超过50MB')
          return isAudio
        }
      },
      handleRemoveAudio(file, fileList) {
        this.resourceForm.audio = null;
        this.resourceForm.audioName = '';
        this.fileListAudio=[];
      },
      handlePreviewAudio(file) {
        console.log(file);
      },
      handleExceedAudio(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，请删除后重新上传`);
      },
      beforeRemoveAudio(file, fileList) {
        if (file && file.status === 'success') {
          return this.$confirm(`确定移除 ${file.name}？`);
        }
      },

      //视频
      beforeVideoUpload(file) { //beforeVideoUpload、handleVideoSuccess上传视频相关
        let type = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()
        const isVideo = type === 'mp4';
        if (!isVideo) {
          this.$message.error('上传视频只能是 mp4 格式!');
          return isVideo
        }
        this.$message.warning('上传中');
      },

      handleVideoSuccess(response, file) {
        this.$message.success('上传成功');
        // this.$set(this.resourceForm,'video',response.fileName)
        this.$refs.video.clearValidate();
        this.resourceForm.video = response.fileName
        this.resourceForm.videoName = response.originalFileName
        this.fileName = response.fileName
        // 转换时间
        var fileTime = response.time
        var hours = Math.floor(fileTime / 3600000)
        var fileTimeHours = fileTime % 3600000
        var minutes = Math.floor(fileTimeHours / 60000)
        var fileTimeMinutes = fileTimeHours % 60000
        var second = Math.floor(fileTimeMinutes / 1000)
        if (hours == '0' && minutes == '0') {
          var time = second + '秒'
        } else if (hours == '0') {
          var time = minutes + '分' + second + '秒'
        } else {
          var time = hours + '时' + minutes + '分' + second + '秒'
        }
        // 转换大小
        var fileSize = response.size
        var convertFileSize = Math.round((fileSize / 1024 / 1024) * 100) / 100.0
        var size = convertFileSize + 'M'
        this.resourceForm.size = size
        this.resourceForm.timeLength = time
      },
      // 图集上传
      handleRemove(file, fileList) {
        this.resourceForm.imgs=[];
        fileList.map(item=>{
          this.resourceForm.imgs=[...this.resourceForm.imgs,item.response];
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleAvatarSuccessImgs(response, file) {
        let imgid = ''
        imgid = response
        this.resourceForm.imgs.push(imgid)
      },
      // 文章上传
      handleAvatarSuccessArtical(response, file) {
        this.resourceForm.pdf = file.response
        this.resourceForm.pdfName = file.name
      },
      beforeArticleUpload(file) {
        const isPDF = file.type == 'application/pdf' || file.type == 'application/msword';
        const isLT1G = file.size / 1024 / 1024 < 1024;
        if (!isPDF) {
          this.$message.error('只能上传 PDF/Word 格式')
          return isPDF
        }
        if (!isLT1G) {
          this.$message.error('文件大小不能超过1G')
          return isLT1G
        }
      },
      handleRemovePdf(file, fileList) {
        this.resourceForm.pdf = null;
        this.resourceForm.pdfName = '';
        this.fileList = [];
      },
      handlePreview(file) {
        console.log(file, 'kkk');
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，请删除重新上传`);
      },
      beforeRemove(file, fileList) {
        if (file && file.status === 'success') {
          return this.$confirm(`确定移除 ${file.name}？`);
        }
      },
      // 查看pdf
      queryPDF() {
        window.open(uploadUrl + "?fileName=" + this.resourceForm.pdf + "&isOnLine=true")
      },
      // 资源封面上传
      beforeAvatarUpload(file) {
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
      handleAvatarSuccess(response, file) {
        this.uploading = false
        this.$message.success('上传成功');
        this.resourceForm.cover = response
      },
      // 获取会员列表
      getMemberList() {
        getMemberListAPI().then(res => {
          if (res.data.code == 0) {
            this.memberList = res.data.data;
          }
        })
      },
      getDictionaryResours(memberId) {
        let data = {
          memberId: memberId,
        }
        getAutherResoursAPI(data).then(res => {
          if (res.data.code == 0) {
            this.statusList = res.data.data
          }
        })
      },
      selectChang(val) {
        this.selectType = val
      },
    }
  }
</script>
<style scoped lang='less'>
  .title {
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: 10px;
  }

  .tip {
    color: #ccc;
    margin-left: 30px;
  }

  .audio-uploader, .video-uploader {
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

  .imgList {
    display: inline-block;
    margin: 0 20px 20px 0;
    position: relative;
    width: 146px;
    height: 146px;
    float: left;

    .avatar {
      width: 146px;
      height: 146px;
    }

    .delete {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(100, 100, 100, 0.4);
      display: flex;
      justify-content: center;
      vertical-align: middle;

      span {
        display: inline-block;
        margin-top: 50px;
        height: 34px;
        padding: 10px;
        line-height: 14px;
        border-radius: 50%;
        background: rgba(100, 100, 100, 0.8);

        .el-icon-delete {

        }

        .el-icon-delete:hover {
          cursor: pointer;
        }
      }
    }
  }

  .tips {
    position: absolute;
    left: 0;
  }
</style>
