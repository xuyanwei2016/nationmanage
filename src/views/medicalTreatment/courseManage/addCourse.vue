<template>
  <div class="app-container addCaseBank" @click="authorStatus = 1">

    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <div class="title">基本信息</div>
      <el-form-item label="课程名称：" prop="name">
        <el-input v-model="resourceForm.name" clearable placeholder="建议在14个字以内，最多不超过50个字" style="width:300p;margin-right:10px " :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="作者：" prop="memberId" >
        <el-select v-model="resourceForm.memberId" style="width:300px;margin-right:10px"  :disabled="pageStatus == 1">
            <el-option v-for="item in memberList" :key="item.memberId" :label="item.userName" :value="item.memberId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程简介：">
        <tinymce :height=300 ref="editor" v-model="resourceForm.synopsis" style="width:800px"></tinymce>
      </el-form-item>
      <el-form-item label="详情封面：">
        <el-upload :disabled="$route.query.detailsId?true:false" class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`"  :show-file-list="false" :on-remove="handlePicRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.cover}&isOnLine=true`" v-if="resourceForm.cover" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon" style="width: 100%; height: 100%;">
          <div class="deleteImg" v-if="pageStatus != 1&&!$route.query.detailsId&&resourceForm.cover" @click.stop="deleteIMG">
            <i class="el-icon-close"></i>
          </div>
        </el-upload>
        <span class="tip">用于课程详情页面展示，750*420像素或16：9，支持PNG、JPG|CIF格式，小于5M</span>
      </el-form-item>
      <el-form-item label="宣传图：">
        <el-upload :disabled="$route.query.detailsId?true:false" class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePreview" :on-success="handleSuccess" :before-upload="beforeUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.img}&isOnLine=true`" v-if="resourceForm.img" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon" style="width: 100%; height: 100%;">
          <div class="deleteImg" v-if="pageStatus != 1&&!$route.query.detailsId&&resourceForm.img" @click.stop="deleteIMG2">
            <i class="el-icon-close"></i>
          </div>
        </el-upload>
        <span class="tip">用于内容列表缩略图展示，420*350像素或4：3，支持PNG、JPG|CIF格式，小于5M</span>
      </el-form-item>
      <el-form-item label="课程详情：">
        <tinymce :height=300 ref="editor" v-model="resourceForm.details" style="width:800px"></tinymce>
      </el-form-item>
      <el-form-item label="学习次数：" prop="learnTimes">
        <el-input v-model="resourceForm.learnTimes" clearable placeholder="" style="width:300px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="总课时：" prop="classHour">
        <el-input v-model="resourceForm.classHour" clearable placeholder="" style="width:300px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="排序号：" prop="sort">
        <el-input v-model="resourceForm.sort" clearable placeholder="" style="width:300px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <div class="title">课程状态</div>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="resourceForm.status" :disabled="pageStatus == 1">
          <el-radio :label="1">待审核</el-radio>
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="3">审核不通过</el-radio>
          <el-radio :label="4">上架</el-radio>
          <el-radio :label="5">下架</el-radio>
        </el-radio-group>
        <!-- <span class="tip">审核通过之后平台不显示</span> -->
      </el-form-item>
      <el-form-item label="有效期：" prop="valid">
        <el-radio-group v-model="resourceForm.valid" :disabled="pageStatus == 1" >
          <el-radio label="0">永久</el-radio>
          <el-radio label="1">固定日期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="indate">
        <el-date-picker  v-if="resourceForm.valid === '1'" v-model="resourceForm.indate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :disabled="pageStatus == 1"></el-date-picker>
      </el-form-item>
      <div class="title">参与方式</div>
      <el-form-item label="售价：" prop="priceOption" >
        <el-radio v-model="resourceForm.priceOption" :label="'0'" :disabled="pageStatus == 1">免费</el-radio>
        <el-radio v-model="resourceForm.priceOption" :label="'1'" :disabled="pageStatus == 1">付费</el-radio>
        <!-- <el-radio-group v-model="resourceForm.realPrice">
          <el-radio label="0">免费</el-radio>
          <el-radio label="1">付费</el-radio>
        </el-radio-group> -->
      </el-form-item>
      <el-form-item prop="realPrice" v-if="resourceForm.priceOption == '1'">
        <el-input v-model="resourceForm.realPrice" clearable placeholder="请输入售价" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
        <span >元</span>
      </el-form-item>
      <el-form-item label="划线价：" prop="price">
        <el-input v-model="resourceForm.price" clearable placeholder="请输入定价" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
        <span>元</span>
        <span class="tip">请设置资源划线价钱，不填写默认不显示</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button :loading="saveLoading" @click="dataSubmit">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { saveAPI, detailsAPI, editAPI ,getMemberListAPI} from '@/api/medicalTreatment/courseManage' //接口
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
const validateSort = (rule, value, callback) => {
      let reg = /^[0-9]*[1-9][0-9]*$/
      if( (value+'').replace(/\s+/g,"") == '' ){
        // callback(new Error('请填写排序号'));
        callback()
      } else if(!reg.test(value)){
        callback(new Error('排序号只能为正整数'));
      }else{
        callback()
      }
    };
export default {

  components:{ Tinymce },
  data() {
    return {
      resourceForm: {
        name:"",  // 资源名称
        synopsis:"",  // 简介
        learnTimes:'', // 学习次数
        cover:"", //  封面
        img:"", // 宣传图
        details:"",  // 详情
        classHour:"", // 总课时
        sort:"", // 排序号")
        status:1,// 状态：1：待审核  2：审核通过 3：审核不通过  4：已上架  5：已下架
        valid:"1",// 状态：0永久，1固定日期
        indate:"",// 有效期")
        memberId:"",// 会员ID（作者）
        priceOption:"1",//
        realPrice:"", // 售价
        price:"",// 划线价
      },
      memberList:[],
      uploading:false,
      pageStatus:0,

      options: [],
      navTree: [],
      rules:{
        name:[{ required: true, message: '请输入课程名称', trigger: 'change' }, { pattern:/^.{1,50}$/,message: '课程名称长度必须小于50位', trigger: 'change'} ],
        synopsis:[ { required: true, message: '请填写简介', trigger: 'change'}],
        // cover:"", //  封面
        // img:"", // 宣传图
        details:[ { required: true, message: '请填写课程详情', trigger: 'change'}],
        // classHour:"", // 总课时
        sort:[{validator:validateSort,trigger: 'change'}],
        // status:"5",// 状态：1：待审核  2：审核通过 3：审核不通过  4：已上架  5：已下架
        // valid:"1",// 状态：0永久，1固定日期
        learnTimes:[ { required: false,pattern:/^([1-9]\d{0,5})$/,message: '请输入1-99999之间的正整数', trigger: 'change' },],
        indate:[ { required: false, message: '请填写有效期', trigger: 'change'}],
        memberId:[ { required: true, message: '请选择作者', trigger: 'change'}],
        realPrice:[ { required: false,pattern:/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,message: '请输入价格,范围在0.1-99999之间', trigger: 'change' },],
        price:[ { required: false,pattern:/^\d+(\.\d{0,2})?$/,message: '请输入0-99999之间的数字，最多保留两位小数', trigger: 'change' },],
      },
      checkedKeys:[],
      fileName: '',
      resourceList: [],
      authorList:[],
      saveLoading:false

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
    //图片1
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
        // this.dialogImage = file
        // this.dialogPvVisible = true
      },
      handlePicRemove(){ // 图片删除
        this.resourceForm.cover = ''
      },
      deleteIMG(){
        this.resourceForm.cover = ''
      },
      //图片2
      beforeUpload(file){
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
      handleSuccess(response, file, fileList){
        this.uploading = false
        this.$message.success('上传成功');
        this.resourceForm.img = response
      },
      handlePreview(file){ // 图片预览
        // this.dialogImage = file
        // this.dialogPvVisible = true
      },
      handleRemove(){ // 图片删除
        this.resourceForm.img = ''
      },
      deleteIMG2(){
        this.resourceForm.img = ''
      },



    isEdit(){
        const id = this.$route.query.id; //修改id
        const detailsId = this.$route.query.detailsId; //查看id
        this.$route.meta.title = '添加课程'
        if(id){//修改
          this.$route.meta.title = '修改课程'
          this.pageDetails(id);
        }
        if(detailsId) {//查看
          this.pageStatus = 1
          this.$route.meta.title = '查看课程'
          this.pageDetails(detailsId);
        }
      },
    pageDetails(id){//查看和修改的页面信息
      detailsAPI(id).then(res => {
        if (res.data.code === 0) {
          if(res.data.data.realPrice == 0){//免费
            this.resourceForm = {...res.data.data,realPriceType:1}
          } else{ //付费
            this.resourceForm = {...res.data.data,realPriceType:0}
          }
          this.resourceForm.learnTimes = this.resourceForm.learnTimes ===0?'':this.resourceForm.learnTimes
        } else{
          this.$message.error('加载失败')
        }
      })
    },
    //保存
    dataSubmit() {

      console.log(this.resourceForm);
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {//必填名称--规则
          if((this.resourceForm.priceOption == '1' && this.resourceForm.realPrice != '') || this.resourceForm.priceOption == '0'){//售价---必填
            if(this.resourceForm.valid == '0' ||(this.resourceForm.valid == '1' && this.resourceForm.indate != '' )){
              if(this.resourceForm.realPrice === "") this.resourceForm.realPrice = 0  // 售价
              const id = this.$route.query.id; //修改id
              delete this.resourceForm.author;
              delete this.resourceForm.authorId;
              this.saveLoading = true
              if(id) {//修改
                this.resourceForm.id = id;
                editAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.saveLoading = false
                    this.$message.success('编辑成功')
                    this.$router.push({ path: '/medicalTreatment/courseManage' });
                  } else{
                    this.$message.error('编辑失败')
                  }
                })
              } else{
                saveAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.saveLoading = false
                    this.$message.success('添加成功')
                    confirm.apply(this,['立即去维护课程内容吗？']).then(() => {
                      this.$router.push({ path: '/medicalTreatment/linkCourse',query:{id:res.data.data} });
                    }).catch(()=>{
                      this.$router.push({ path: '/medicalTreatment/courseManage' });
                    })
                                  // this.$router.push({ path: '/medicalTreatment/linkCourse' });
                  } else{
                    this.$message.error('添加失败')
                  }
                })
              }
            }else{
                this.$message.error('请选择有效期');
            }
          } else{
            this.$message.error('请填写售价哦');
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
    /* margin-left: 30px; */
  }
  .t {
    color: #ccc;
    display: inline-block;
    margin-top: 10px;
  }
  .aa{
    display: block !important;
    width: 100%;
  }
  .title {
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: 10px;
  }
  .el-button {
    margin-bottom: 10px;
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

