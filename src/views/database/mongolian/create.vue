<template>
  <div class="app-container inputCss" @click="authorStatus = 1">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <div class="title">基本信息</div>
      <el-form-item label="文章标题：" prop="title">
        <el-input v-model="resourceForm.title" clearable placeholder="建议在14个字以内，最多不超过50个字" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="作者：" prop="author" class="authoryizhu">
        <!-- <el-input v-model="resourceForm.author" clearable placeholder="请输入作者" style="width:250px;margin-right:10px"></el-input> -->
        <el-input v-model="resourceForm.author" clearable placeholder="请输入作者" style="width:250px;margin-right:10px" @input="authorLibrary" :disabled="pageStatus == 1"></el-input>
        <ul style="width:250px;background:#f5f5f5;list-style:none;padding-left:0px;max-height:200px;overflow-y:scroll;position:absolute;z-index:20;" v-if="authorList && authorList.length>0 && authorStatus == 0">
          <li style="cursor: pointer" v-for="item in authorList" :key='item.id' @click="choiceAuthor(item.name,item.id)">{{item.name}}</li>
        </ul>
      </el-form-item>
      <el-form-item label="关键词：" prop="keywords">
        <el-input v-model="resourceForm.keywords" clearable placeholder="多个关键词用逗号隔开" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="来源：" prop="source">
        <el-input v-model="resourceForm.source" clearable placeholder="请输入来源" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="PDF文件：">
        <el-button v-if="resourceForm.pdf" @click="queryPDF">查看</el-button>
        <el-upload  :disabled="$route.query.detailsId?true:false" :action="`${uploadUrl}${uploadPath}/info`" :on-exceed="handlePdfExceed" :before-upload="beforePdfUpload" :on-success="handlePdfSuccess"  multiple :limit="1" :on-remove="handlePdfRemove" v-if="!$route.query.detailsId">
          <el-button v-if="pageStatus == 0" :loading="uploading">选择文件</el-button>
          <span>{{resourceForm.pdf_zh}}</span>
        </el-upload>
        <span class="t"  v-if="!$route.query.detailsId">上传PDF文件后不需要再填写正文内容和多媒体文件</span>
        <span v-if="$route.query.detailsId">{{resourceForm.pdf?resourceForm.pdf_zh:'未上传文件'}}</span>
      </el-form-item>
      <el-form-item label="简介：">
        <tinymce :height=300 ref="editor" v-model="resourceForm.synopsis" style="width:800px"></tinymce>
      </el-form-item>
      <div class="title">商品信息</div>
      <el-form-item label="全文阅读权限：" prop="readTextPower">
        <el-radio v-model="resourceForm.readTextPower" :label=0 :disabled="pageStatus == 1">游客可见</el-radio>
        <el-radio v-model="resourceForm.readTextPower" :label=1 :disabled="pageStatus == 1">会员可见</el-radio>
        <span class="tip" v-if="pageStatus == 0">可设置游客是否有阅读全文权限</span>
      </el-form-item>
      <el-form-item label="定价：" prop="price">
        <el-input v-model="resourceForm.price" clearable placeholder="请输入定价" style="width:250px;margin-right:10px"  :disabled="pageStatus == 1"></el-input>
        <span>元</span>
        <span class="tip" v-if="pageStatus == 0">在前台展示为划线价格</span>
      </el-form-item>
      <el-form-item label="售价：" prop="realPriceType">
        <el-radio v-model="resourceForm.realPriceType" :label=1 :disabled="pageStatus == 1">付费</el-radio>
        <el-radio v-model="resourceForm.realPriceType" :label=0 :disabled="pageStatus == 1">免费</el-radio>
      </el-form-item>
      <el-form-item prop="realPrice">
        <el-input v-model="resourceForm.realPrice" clearable placeholder="请输入售价" v-if="resourceForm.realPriceType == 1" style="width:250px;margin-right:10px" :disabled="pageStatus == 1"></el-input>
        <span v-if="resourceForm.realPriceType == 1">元</span>
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
import { getOptionAPI, getNavAPI, getLabelAPI } from '@/api/database/video'
import { saveAPI, detailsAPI, editAPI, commonUploadAPI } from '@/api/database/theory' //接口
import { authorLibraryAPI } from '@/api/database/article' //接口
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { mapGetters } from 'vuex'

export default {
  components:{ Tinymce },
  data() {
    return {
      resourceForm: {
        video:null,
        audio:null,
        realPriceType:1,
        readTextPower:1,
        realPrice:'',
        nationsType: this.$store.getters.getNation,
        pdf_zh: ''
      },
      uploading:false,
      pageStatus:0,
      diyTypeCode: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      options: [],
      navTree: [],
      rules:{
        title:[
          { required: true, message: '请输入文章标题', trigger: 'change' },
          {
            pattern:/^.{1,50}$/,message: '文章标题长度必须小于50位', trigger: 'change'
          }
        ],
        realPrice:[
          { required: false,pattern:/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,message: '请输入0.1-99999之间的数字，最多保留两位小数', trigger: 'change' },
        ],
        price:[
          { required: false,pattern:/^\d+(\.\d{0,2})?$/,message: '请输入0-99999之间的数字，最多保留两位小数', trigger: 'change' },
        ],
        author:[
          { required: false, pattern: /^[\w\u4e00-\u9fa5]{1,10}$/, message: '作者长度必须小于10位', trigger: 'change'}
        ],
        source:[
          { required: false, pattern: /^.{1,50}$/, message: '来源长度必须小于50位', trigger: 'change'}
        ],
        keywords:[
          { required: false, pattern: /^.{1,30}$/, message: '关键词长度必须小于30位', trigger: 'change'}
        ],
        readTextPower:[
          { required: true}
        ],
        realPriceType: [{ required: true}]
      },
      checkedKeys:[],
      name:[
        '理论','药物','方剂','临床','医案','文化','机构','其他','未分类','蒙文'
      ],
      fileName: '',
      resourceList: [],
      authorList:[],

    }
  },
  computed: {
    ...mapGetters([
      'getNation'
    ])
  },
  watch: {
    getNation: function (val) {
      this.resourceForm.nationsType = val
    },
  },
  created(){
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
  },
  mounted() {
    this.isEdit();
  },
  methods: {
     // 查看pdf
    queryPDF() {
      window.open(uploadUrl+"?fileName="+this.resourceForm.pdf+"&isOnLine=true")
    },
    authorLibrary() {//查询
      this.authorList = [];
      this.resourceForm.authorId = '';
      if(this.resourceForm.author.split(" ").join("").length != 0){
        this.authorStatus = 0
        authorLibraryAPI(this.resourceForm.author.split(" ").join("")).then(res => {
          if(res.data.code==0){
            this.authorList = res.data.data;
            this.resourceForm.authorNameAndId=this.resourceForm.author.trim();
          }else{
            this.$message.error('获取数据失败');
          }
        })
      }
    },
    loseFocus(){
      this.authorStatus = 1;
    },
    choiceAuthor(name,id) {//选择模糊查询的作者
      this.resourceForm.author = name;
      this.resourceForm.authorId = id;
      this.resourceForm.authorNameAndId = `${name},${id}`;
      this.authorStatus = 1
    },
    // 提交公共资源
    commonUpload() {
      if(this.resourceList.length != 0) {
        commonUploadAPI(this.resourceList).then(res => {
        })
      }
    },
    isEdit(){
      this.resourceForm.resourceType = this.$route.query.articleType; //文章类型 0全部,1医著 2医家 31理论 32药物 33方剂 34临床 35医案 36文化 37机构 38医论 48其他 49未分类 50蒙文
      this.$route.meta.title = '添加蒙文文章'
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      if(id){//修改
        this.$route.meta.title = '修改蒙文文章'
        this.pageDetails(id);
      }
      if(detailsId) {//查看
        this.pageStatus = 1
        this.$route.meta.title = '查看蒙文文章'
        this.pageDetails(detailsId);
      }
    },
    pageDetails(id){//查看和修改的页面信息
      detailsAPI(id).then(res => {
        if (res.data.code === 0) {
          if(res.data.data.realPrice == 0 || res.data.data.realPrice == null){//免费
            this.resourceForm = {...res.data.data,realPriceType:0}
          } else{ //付费
            this.resourceForm = {...res.data.data,realPriceType:1}
          }
        } else{
          this.$message.error('加载失败')
        }
      })
    },
    //pdf上传
    beforePdfUpload(file){
      const isPDF = file.type === 'application/pdf'
      if (!isPDF) {
        this.$message.error('附件文件只能是 PDF 格式!')
        return isPDF;
      }
      this.uploading = true
    },
    handlePdfSuccess(response, file, fileList){
      this.resourceForm.pdf_zh = response.originalFileName;
      this.resourceForm.pdf = response.fileName
      const pdf = {
        keywords: this.resourceForm.keywords,
        name: response.originalFileName,
        nationsType: this.resourceForm.nationsType,
        resourceCode: response.fileName,
        resourceType:  66,
        author: this.resourceForm.author,
        source: this.resourceForm.source,
      }
      this.resourceList.push(pdf)
      this.uploading = false
    },
    handlePdfExceed(files, fileList) {
      this.$message.warning(`单次上传最多1个文件`);
    },
    handlePdfRemove() {//删除pdf
      this.resourceForm.pdf = null;
    },
    //保存
    dataSubmit() {
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {//必填名称--规则
          if((this.resourceForm.realPriceType == 1 && this.resourceForm.realPrice != '') || this.resourceForm.realPriceType == 0){//售价---必填
            if(this.resourceForm.realPriceType != 1) this.resourceForm.realPrice = 0  // 售价
            const id = this.$route.query.id; //修改id
            delete this.resourceForm.author;
            delete this.resourceForm.authorId;
              if(id) {//修改
                this.resourceForm.id = id;
                editAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('编辑成功')
                    this.$router.push({ path: '/database/mongolian' });
                    this.commonUpload()
                    this.$router.go(-1);
                  } else{
                    this.$message.error('编辑失败')
                  }
                })
              } else{
                saveAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('添加成功')
                    this.$router.push({ path: '/database/mongolian' });
                    this.commonUpload()
                    this.$router.go(-1);
                  } else{
                    this.$message.error('添加失败')
                  }
                })
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
    margin-left: 30px;
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
</style>
