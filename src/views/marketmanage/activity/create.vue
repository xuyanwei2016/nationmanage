<template>
  <div class="app-container">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-form-item label="活动名称：" prop="name">
        <el-input style="width:500px" v-model="resourceForm.name" clearable placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="促销规则：" prop="promotionRules">
        <el-radio-group v-model="resourceForm.promotionRules">
          <el-radio :label="1">统一折扣</el-radio>
          <el-radio :label="2">统一价格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="typeTitle[resourceForm.promotionRules]" prop="discountOrRealPrice">
        <el-input v-model="resourceForm.discountOrRealPrice" v-if="resourceForm.promotionRules == 1" clearable placeholder="请输入正确的折扣" style="width:250px;margin-right:10px"></el-input>
        <el-input v-model="resourceForm.discountOrRealPrice" v-else clearable placeholder="请输入正确的价格" style="width:250px;margin-right:10px"></el-input>
        <span v-if="resourceForm.promotionRules == 1">折</span>
        <span v-else>元</span>
      </el-form-item>
      <el-form-item label="活动说明：" prop="description">
        <el-input type="textarea" style="width:500px" :autosize="{ minRows: 6, maxRows: 6}" v-model="resourceForm.description" placeholder="最多300字"></el-input>
      </el-form-item>
      <el-form-item label="选择时间：" prop="timeLimit">
        <el-date-picker v-model="resourceForm.timeLimit" value-format="yyyy-MM-dd" type="daterange" :picker-options="dateRange"	range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="促销活动图：">
        <el-upload class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.img}&isOnLine=true`" v-if="resourceForm.img" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
        <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button @click="dataSubmit">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { saveAPI, detailsAPI, editAPI } from '@/api/marketing-management/activity' //接口
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import Cookies from 'js-cookie'

export default {
  components:{ Tinymce },
  data() {
    // const validateName = (rule, value, callback) => {
    //   let reg = /^(\d|10)(\.[1-9]{1})?$/

    // };
    return {
      resourceForm: {
        img:null,
        promotionRules: 1,
        timeLimit:null,
      },
      uploading:false,
      pageStatus:0,
      rules:{
        name:[
          { required: true,pattern:/^.{1,50}$/,message: '请输入50字以内的活动名称', trigger: 'change' },
        ],
        promotionRules:[
          { required: true,message: '请选择促销规则', trigger: 'change' },
        ],
        discountOrRealPrice:[
          // { required: true,pattern:/^\d+(\.\d{0,2})?$/,message: '请输入正确的折扣', trigger: 'change' },
          // { required: true,pattern:/^(\d|10)(\.\d)?$/,message: '请输入正确的折扣', trigger: 'change' },
          { required: true, message: '请输入正确的折扣或价格', trigger: 'change' },
          // { required: true,pattern:/^(^[1-9](\d{1}|10)?(\.[1-9]{1,2})?$)$/,message: '请输入正确的折扣', trigger: 'change' },
        ],
        description:[
          { pattern:/^.{1,300}$/,message: '请输入300字以内的活动说明', trigger: 'change' },
        ],
        timeLimit:[
          { required: true,message: '请选择时间', trigger: 'change' },
        ],
        // beginTime:[
        //   { required: true,message: '请选择时间', trigger: 'change' },
        // ],
        // endTime:[
        //   { required: true,message: '请选择时间', trigger: 'change' },
        // ]
      },
      typeTitle:[
        '全部',
        '统一折扣',
        '统一价格'
      ],
      errorInfo: 0,
      dateRange: {
        disabledDate: (time) => {
          var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
          var isOpera = userAgent.indexOf("Opera") > -1;
          //判断是否Opera浏览器
          // if (isOpera) {
          //     return "Opera"
          // }; 
          //判断是否Firefox浏览器
          if (userAgent.indexOf("Firefox") > -1) {
            const datetime = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate()-1);
            let date = Date.parse(datetime) 
            console.log(date,'asdhjasjkdjnksda');
            return time.getTime() < date
          } 
          //判断是否chorme浏览器
           else if (userAgent.indexOf("Chrome") > -1){
            const datetime = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate());
            let date = Date.parse(datetime) 
            console.log(date,'asdhjasjkdjnksda');
            return time.getTime() < date
          }
          else{
            const datetime = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate());
            let date = Date.parse(datetime) 
            console.log(date,'asdhjasjkdjnksda');
            return time.getTime() < date
          }
          // //判断是否Safari浏览器
          // if (userAgent.indexOf("Safari") > -1) {
          //     return "Safari";
          // } 
          // //判断是否IE浏览器
          // if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
          //     return "IE";
          // }
          // //判断是否Edge浏览器
          // if (userAgent.indexOf("Trident") > -1) {
          //     return "Edge";
          // }
          
        }
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
    isReg() {
      if(this.resourceForm.promotionRules == 1) { //折扣
        const reg = /^(\d|10)(\.[1-9]{1})?$/
        if(!reg.test(this.resourceForm.discountOrRealPrice) ){
          this.$message.error('请输入0.1-10之间的折扣')
          this.errorInfo = 1
        } else {
          this.errorInfo = 0
        }
      } else { //价格
        const reg1 = /(^[1-9]\d{0,4}$)|(^0\.\d{2}$)|(^[1-9]\d{0,4}\.\d{2}$)/
        if(!reg1.test(this.resourceForm.discountOrRealPrice) ){
          this.$message.error('请输入10000以内的价格')
          this.errorInfo = 1
        } else {
          this.errorInfo = 0
        }
      }
    },
    isEdit(){
      this.$route.meta.title = '设置销售策略'
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      if(id){//修改
        this.$route.meta.title = '修改销售策略'
        this.pageDetails(id);
      }
      if(detailsId) {//查看
        this.pageStatus = 1
        this.$route.meta.title = '查看销售策略'
        this.pageDetails(detailsId);
      }
    },
    pageDetails(id){//查看和修改的页面信息
      detailsAPI(id).then(res => {
        if (res.data.code === 0) {
          this.resourceForm = {...res.data.data,timeLimit:[res.data.data.beginTime,res.data.data.endTime]};
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
      this.resourceForm.img = response
    },
    handlePicPreview(file){ // 图片预览
      this.dialogImage = file
      this.dialogPvVisible = true
    },
    handleRemove(){ // 图片删除
      this.resourceForm.img = ''
    },
    //保存
    dataSubmit() {
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {//必填名称
          this.resourceForm.beginTime = this.resourceForm.timeLimit[0]
          this.resourceForm.endTime = this.resourceForm.timeLimit[1]
          this.sending = true
          const id = this.$route.query.id; //修改id
          this.isReg()
          if(this.errorInfo != 1) {
            if(id) {//修改
              this.resourceForm.id = id
              editAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('编辑成功')
                  this.$router.go(-1);
                }  else if(res.data.code == -2){
                  this.$message.error(res.data.msg)
                } else{
                  this.$message.error('编辑失败')
                }
                this.sending = true
              })
            } else{
              saveAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('添加成功')
                  this.$router.go(-1);
                } else if(res.data.code == -2){
                  this.$message.error(res.data.msg)
                } else{
                  this.$message.error('添加失败')
                }
                this.sending = true
              })
            }
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
  img {
    width: 600px;
    height: 420px;
  }
</style>