<template>
  <div class="app-container inputCss">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)" style="margin-bottom: 20px;">返回</el-button>
      <el-form-item label="关联民族：" prop="nationsType">
        <el-select v-model="resourceForm.nationsType" placeholder="请选择" :disabled="canuse" @change="isExist">
          <el-option v-for="(item,index) in nationsList" :key="index" :label="item" :value="index"></el-option>
        </el-select>
        <div style="color: #f56c6c; font-size: 12px;position: absolute; top: 28px;" v-if="cancelName">该关联民族已绑定</div>
      </el-form-item>

      <el-form-item label="封面：" prop="coverImg" ref="coverImg">
         <el-upload :disabled="$route.query.detailsId?true:false" class="avatar-uploader"  :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePreview" :on-success="handleSuccess" :before-upload="beforeUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.coverImg}&isOnLine=true`" v-if="resourceForm.coverImg" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon" style="width: 100%; height: 100%;">
        </el-upload>
        <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、gif、bmp格式，不超过2M；在网站首页和民族列表页展示</span>
      </el-form-item>

      <el-form-item label="背景图：" prop="backgroundImg" ref="backgroundImg">
        <el-upload :disabled="$route.query.detailsId?true:false" class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleBgRemove" :on-preview="handleBgPreview" :on-success="handleBgSuccess" :before-upload="beforeBgUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.backgroundImg}&isOnLine=true`" v-if="resourceForm.backgroundImg" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon" style="width: 100%; height: 100%;">
        </el-upload>
        <span class="tip">建议尺寸1920*420px，仅支持jpg、jpeg、png、gif、bmp格式，不超过2M；在民族主页展示</span>
      </el-form-item>
      <el-form-item label="简介：" prop="synopsis" ref="synopsis">
        <tinymce :height=300  v-model="resourceForm.synopsis" style="width:800px" @input="verifySynopsis"></tinymce>
        <div style="color: #f56c6c; font-size: 12px;position: absolute; top: 430px;" v-if="verifyS">简介200字以内</div>
        <div style="color: #f56c6c; font-size: 12px;position: absolute; top: 430px;" v-if="verifya">请输入简介</div>
      </el-form-item>
      <el-form-item label="排序号：" prop="sequence">
        <el-input v-model="resourceForm.sequence"  placeholder="请输入排序号" style="width:250px;margin-right:10px"  :disabled="canuse"></el-input>
      </el-form-item>
      <el-form-item label="选择模板：" prop="template">
          <el-radio v-model="resourceForm.template" :label=0 :disabled="canuse">楼层模板</el-radio>
          <el-radio v-model="resourceForm.template" :label=1 :disabled="canuse">模板2</el-radio>
          <el-radio v-model="resourceForm.template" :label=2 :disabled="canuse">模板3</el-radio>
        <div class="tip" v-if="!canuse">以下内容建议选择模板1时必填，选择其他模板时选填</div>
      </el-form-item>
      <el-form-item label="资源统计描述：" prop="resourceStatistics">
        <el-input type="textarea" :rows="2" clearable placeholder="建议50字以内" v-model="resourceForm.resourceStatistics" style="width:800px;margin-right:10px" :disabled="canuse"></el-input>
        <span class="tips" v-if="!canuse">如：汇集了4976本医药图书，54135个经典病案，19.64万条药物信息，8.50万个验方</span>
      </el-form-item>
       <el-form-item label="优势病种：" prop="advantagesDisease">
        <el-input v-model="resourceForm.advantagesDisease" clearable placeholder="建议最多10个标签，多个标签用逗号隔开" style="width:800px;margin-right:10px" @input="verify" :disabled="canuse"></el-input>
        <div style="color: #f56c6c; font-size: 12px;position: absolute; top: 28px;" v-if="verifys">建议最多10个标签</div>
      </el-form-item>
      <el-form-item label="特色疗法：" prop="particularTherapy">
        <el-input v-model="resourceForm.particularTherapy" clearable placeholder="建议最多10个标签，多个标签用逗号隔开" style="width:800px;margin-right:10px" @input="verify" :disabled="canuse"></el-input>
        <div style="color: #f56c6c; font-size: 12px;position: absolute; top: 28px;" v-if="verifyp">建议最多10个标签</div>
      </el-form-item>
      <el-form-item label="特色药物：" prop="characteristicsDrugs">
        <el-input v-model="resourceForm.characteristicsDrugs" clearable placeholder="建议最多10个标签，多个标签用逗号隔开" style="width:800px;margin-right:10px" @input="verify" :disabled="canuse"></el-input>
        <div style="color: #f56c6c; font-size: 12px;position: absolute; top: 28px;" v-if="verifyc">建议最多10个标签</div>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio v-model="resourceForm.status" :label=1 :disabled="canuse">上线</el-radio>
        <el-radio v-model="resourceForm.status" :label=0 :disabled="canuse">下线</el-radio>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button @click="dataSubmit" :loading="dataSubmitLoading">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { saveAPI, detailsAPI, editAPI, saveNationAPI, saveNationsAPI ,isExistAPI } from '@/api/website-management/nation'
import { nationsListAPI } from '@/api/website-management/position'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import Cookies from 'js-cookie'


export default {
  components:{ Tinymce },
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      resourceForm: {
        status:1,
        backgroundImg:null,
        coverImg:null,
        template:0,
        resourceStatistics:null,
        nationsType:'',
        nationalName:'',
        sequence: null
      },
      uploading: false,
      dialogVisible:false,
      editId: '',
      pageStatus:0,
      popoverVisible: false,
      diyTypeCode: [],
      options: [],
      canuse:false,
      cancelName: false,
      verifys: false,
      verifyp: false,
      verifyc: false,
      verifyS: false,
      verifya: false,
      rules:{
        nationsType:[
          { required: true,message: '请选择民族', trigger: 'change' }
        ],
        coverImg:[
          { required: true,message: '请添加封面图片', trigger: 'change' }
        ],
        backgroundImg:[
          { required: true,message: '请添加背景图片', trigger: 'change' }
        ],
        status:[
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        synopsis:[
          { required: true, message: '请输入简介'}
        ],
        sequence:[
          { required: true, message: '请输入排序号', trigger: 'change'},{pattern:/^(\d|[1-9]\d+)?$/, message: '请输入0及正整数表示的排序号'}
        ],
        template:[
          { required: true, message: '请选择模板', trigger: 'change'}
        ],
        resourceStatistics: [
          { required: false, message: '请输入50字以内的资源统计描述', pattern: /^.{1,50}$/}
        ],
        advantagesDisease: [
          { required: false, message: '请输入100字以内的优势病种', pattern: /^.{1,100}$/}
        ],
        particularTherapy: [
          { required: false, message: '请输入100字以内的特色疗法', pattern: /^.{1,100}$/}
        ],
        characteristicsDrugs: [
          { required: false, message: '请输入100字以内的特色药物', pattern: /^.{1,100}$/}
        ]
      },
      checkedKeys:[],
      nationsList: [],
      dataSubmitLoading:false,
    }
  },
  created(){
    console.log(22222,process.env.BASE_API)
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
  },
  mounted() {
    this.isEdit();
    this.getnationsList()
  },
  /*watch:{
    'resourceForm.synopsis'(n,o){
      console.log(n.length)
    },
  },*/
  methods: {

    // 获取民族类型列表
    getnationsList() {
      nationsListAPI().then(res => {
        res.data.code === 0 ? this.nationsList = res.data.data : this.$message.error('获取数据失败');
      })
    },
    isEdit(){
        this.$route.meta.title = '添加民族主页'
        const id = this.$route.query.id; //修改id
        const detailsId = this.$route.query.detailsId; //查看id
        if(id){//修改
          this.$route.meta.title = '修改民族主页'
          this.pageDetails(id);
        }
        if(detailsId) { //查看
          this.pageStatus = 1
          this.$route.meta.title = '查看民族主页'
          this.pageDetails(detailsId)
          this.canuse = true;
        }
    },
    // 民族验重
    isExist() {
      isExistAPI(this.resourceForm).then(res => {
        if(res.data.code === 2) {
          // this.$message.error(res.data.msg)
          this.cancelName = true;
        } else if(res.data.code === 0) {
          this.cancelName = false;
        }
      })
    },

    // 封面图片
    beforeUpload(file){
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp' || file.type === 'image/gif';
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

    handleSuccess(response, file, fileList){
      this.uploading = false
      this.$message.success('上传成功');
      this.resourceForm.coverImg = response
      this.$refs.coverImg.clearValidate();
      console.log(response);
    },

    handlePreview(file){ // 封面图片预览
      this.dialogImage = file
      this.dialogPvVisible = true
    },
    handleRemove(){ // 图片删除
      this.resourceForm.coverImg = ''
    },

    // 背景图片
    beforeBgUpload(file){
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


    handleBgSuccess(response, file, fileList){
      this.uploading = false
      this.$message.success('上传成功');
      this.resourceForm.backgroundImg = response
      this.$refs.backgroundImg.clearValidate();
      console.log(response);
    },

    handleBgPreview(file){ // 背景图片预览
      this.dialogImage = file
      this.dialogPvVisible = true
    },

    handleBgRemove(){ // 背景图片删除
      this.resourceForm.backgroundImg = ''
    },


    pageDetails(id){//查看和修改的页面信息
      detailsAPI(id).then(res => {
        this.resourceForm = {...res.data.data,nationsType:String(res.data.data.nationsType)}
        this.imageUrl = res.coverImg;
        this.imgUrl =  res.backgroundImg;
      })
    },

    // 验证简介的长度
    verifySynopsis() {
      if(this.resourceForm.synopsis.length == 0) {
        this.$refs.synopsis.clearValidate()
        this.verifya = true
      } else if(this.resourceForm.synopsis.length != 0) {
        this.$refs.synopsis.clearValidate()
        this.verifya = false
      }
       if(this.resourceForm.synopsis.length > 207) {
        this.verifyS = true
      } else {
        this.verifyS = false
      }
    },

    // 验证优势病种，特色疗法，特色药物最多十个标签
    verify() {
      let regex = /,|，|\\s+/;
      // 优势病种
      const advantagesDisease = this.resourceForm.advantagesDisease.split(regex)
      if(advantagesDisease.length > 10) {
        this.verifys = true
      } else {
        this.verifys = false
      }
      // 特色疗法
      const particularTherapy = this.resourceForm.particularTherapy.split(regex);
      if(particularTherapy.length > 10) {
        this.verifyp = true
      } else {
        this.verifyp = false
      }
      // 特色药物
      const characteristicsDrugs = this.resourceForm.characteristicsDrugs.split(regex);
      if(characteristicsDrugs.length > 10) {
        this.verifyc = true
      } else {
        this.verifyc = false
      }
    },

    dataSubmit() {//保存
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {//必填字段

          if(this.verifyS)return;
          const id = this.$route.query.id; //修改id
          const num = this.resourceForm.nationsType
          this.resourceForm.nationalName = this.nationsList[num]
          if(this.resourceForm.template === 0) {
            if(this.resourceForm.resourceStatistics != '' && this.resourceForm.advantagesDisease != null && this.resourceForm.particularTherapy != null && this.resourceForm.characteristicsDrugs != null ) {
              this.dataSubmitLoading= true;
              if(id) {//修改
                this.resourceForm.id = id;
                editAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('编辑成功')
                    this.$router.push({ path: '/websitemanage/nation'});
                    this.$router.go(-1);
                  } else{
                    this.$message.error('编辑失败')
                  }
                  this.dataSubmitLoading= false;
                })
              } else{
                // const name = 'NATION_0';
                // const nationName = '民族主页-汉族'
                saveAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('添加成功')
                    this.$router.go(-1);
                  } else{
                    this.$message.error('添加失败')
                  }
                  this.dataSubmitLoading= false;
                })
              }
            }else{
              this.$message.error('选择楼层模板时，楼层模板下的四项内容不能为空!')
            }
          } else{
            this.dataSubmitLoading= true;
            if(id) {//修改
                this.resourceForm.id = id
                editAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('编辑成功')
                    this.$router.push({ path: '/websitemanage/nation'});
                    this.$router.go(-1);
                  } else{
                    this.$message.error('编辑失败')
                  }
                  this.dataSubmitLoading= false;
                })
              } else{
                // const name = 'NATION_0';
                const nationName = '民族主页-汉族'
                // this.resourceForm = {
                //   code:this.nationsList,
                //   nationsType:this.nationsList,
                //   recommendType:3,
                //   name:nationName
                // }
                saveAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    // const name = 'NATION_0';
                    // const nationName = '民族主页-汉族'
                    // console.log(name+this.nationsType);
                    // saveNationAPI({code:name+this.nationsType,recommendType:3,name:nationName})
                    this.$message.success('添加成功')
                    this.$router.go(-1);
                  } else{
                    this.$message.error('添加失败,该关联民族已被绑定')
                  }
                  this.dataSubmitLoading= false;
                })
              }
          }
        }
      })
    },

    cancel() {//取消
      this.$router.go(-1);
    },

    // clearValidate(resourceForm) {
    //   this.$refs[resourceForm].clearValidate()
    // }
  }
}

</script>

<style scoped>
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
  .tips {
    display: inline-block;
    width: 300px;
    height: 20px;
    color: #ccc;
    line-height: 1.5;
  }

</style>
