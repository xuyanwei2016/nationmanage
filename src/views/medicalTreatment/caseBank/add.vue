<template>
  <!--添加病例-->
  <div class="app-container addCaseBank">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px"
             class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <div class="title">基本信息</div>
      <el-form-item label="病例标题：" prop="name">
        <el-input v-model="resourceForm.name" clearable placeholder="建议在14字以内，最多不超过50个字"
                  style="width:400px;margin-right:10px"
                  :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="作者：">
        <el-input v-model="resourceForm.author" clearable style="width:400px;margin-right:10px"
                  :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="关键词：" prop="keyword">
        <el-input v-model="resourceForm.keyword" clearable placeholder="多个关键词用逗号隔开"
                  style="width:400px;margin-right:10px"
                  :disabled="pageStatus == 1"></el-input>
      </el-form-item>
      <el-form-item label="PDF文件：">
        <el-button v-if="resourceForm.pdfRoute&&pageStatus == 1" @click="queryPDF" style="margin-bottom: 10px;">查看
        </el-button>
        <span v-if="resourceForm.pdfRoute&&pageStatus == 1">{{resourceForm.pdf_zh}}</span>
        <span v-if="!resourceForm.pdfRoute&&pageStatus == 1" style="color: #606266;">未上传文件</span>

        <el-upload
          :disabled="$route.query.detailsId?true:false"
          :action="`${uploadUrl}${uploadPath}/info`"
          :on-exceed="handlePdfExceed"
          :fileList='fileList'
          :before-upload="beforePdfUpload"
          :on-success="handlePdfSuccess"
          multiple
          :limit="1"
          :on-remove="handlePdfRemove"
          v-if="pageStatus != 1">
          <el-button v-if="pageStatus == 0" :loading="uploading">选择文件</el-button>
        </el-upload>

        <span class="t" v-if="pageStatus != 1">上传PDF文件后不需要再填写正文内容和多媒体文件</span>
      </el-form-item>

      <el-form-item label="图片：">
        <el-upload :disabled="$route.query.detailsId?true:false" class="avatar-uploader"
                   :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove"
                   :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.imageRoute}&isOnLine=true`" v-if="resourceForm.imageRoute"
               class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc">
          <img src="../../../assets/img/bookDefault.png"
               v-if="($route.query.id||$route.query.detailsId)&&!resourceForm.imageRoute" class="avatar-uploader-icon"
               style="width: 100%; height: 100%;">
          <div class="addImg" v-if="pageStatus != 1&&!$route.query.id&&!resourceForm.imageRoute">
            <img src="../../../assets/img/entry/addImg.png">
          </div>
          <div class="deleteImg" v-if="pageStatus != 1&&!$route.query.detailsId&&resourceForm.imageRoute"
               @click.stop="deleteIMG">
            <i class="el-icon-close"></i>
          </div>

        </el-upload>
        <span class="tip" style="margin-left: 0">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、gif格式，不超过2M</span>
      </el-form-item>


      <el-form-item label="内容：">
        <tinymce :height=300 ref="editor1" v-model="resourceForm.content" style="width:800px"
                 :disabled="pageStatus == 1" :id="'editor1'"></tinymce>
      </el-form-item>

      <el-form-item label="解析：">
        <tinymce :height=300 ref="editor2" v-model="resourceForm.answer" style="width:800px"
                 :disabled="pageStatus == 1" :id="'editor2'"></tinymce>
      </el-form-item>

      <div class="title">商品信息</div>

      <el-form-item label="全文阅读权限：" prop="power">
        <el-radio v-model="resourceForm.power" label="0" :disabled="pageStatus == 1">游客可见</el-radio>
        <el-radio v-model="resourceForm.power" label="1" :disabled="pageStatus == 1">会员可见</el-radio>
        <span class="tip">可设置游客是否有阅读全文权限</span>
      </el-form-item>
      <el-form-item label="定价：" prop="price">
        <el-input v-model="resourceForm.price" clearable placeholder="请输入定价" style="width:250px;margin-right:10px"
                  :disabled="pageStatus == 1"></el-input>
        <span>元</span>
        <span class="tip">在前台展示为划线价格</span>
      </el-form-item>
      <el-form-item label="售价：" prop="payStatus">
        <el-radio v-model="resourceForm.payStatus" label="0" :disabled="pageStatus == 1">付费</el-radio>
        <el-radio v-model="resourceForm.payStatus" label="1" :disabled="pageStatus == 1">免费</el-radio>
      </el-form-item>
      <el-form-item :prop="resourceForm.payStatus==0?'realPrice':''" v-if="resourceForm.payStatus == 0">
        <el-input v-model="resourceForm.realPrice" clearable placeholder="请输入售价"
                  style="width:250px;margin-right:10px"></el-input>
        <span v-if="resourceForm.payStatus == 0">元</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button @click="dataSubmit">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js';
  import {saveAPI, detailsAPI, editAPI} from '@/api/medicalTreatment/caseBank';
  import {commonUploadAPI} from '@/api/database/theory'

  export default {
    name: 'HelloWorld',
    components: {Tinymce},
    data() {
      return {
        resourceForm: {
          name: "", // 资源名称
          author: '',
          keyword: '',
          pdfRoute: '',
          imageRoute: "", // 封面,
          content: "",// 简介
          answer: "", // 解析
          power: "1",
          price: null,
          payStatus: "1",
          realPrice: '',

        },
        rules: {
          name: [{required: true, message: '请输入病例标题', trigger: 'change'}, {
            pattern: /^.{1,50}$/,
            message: '病例标题长度必须小于50位',
            trigger: 'change'
          }],
          realPrice: [{required: true, message: '请输入价格', trigger: 'change'},
            {
              pattern: /^(^[1-9](\d{1,4})?(\.[1-9]{1,2})?$)|(^\d{1,4}\.\d{1,2}$)$/,
              message: '请输入价格,范围在0.1-99999之间',
              trigger: 'change'
            }],
          keyword: [{pattern: /^.{0,30}$/, message: '请输入30字内的关键词', trigger: 'change'}],
          power: [
            {required: true}
          ],
          payStatus: [{required: true}],
          price: [
            {pattern: /^\d+(\.\d{0,2})?$/, message: '请输入价格,范围在0.1-99999之间', trigger: 'change'},
          ],

        },
        pageStatus: 0,
        uploadUrl: uploadUrl,
        uploadPath: uploadPath,
        uploading: false,
        resourceList: [],
        isSubmit: true,
        fileList: [],
      }
    },
    created() {
      /*id 修改 detailsId查看*/
      this.$route.meta.title = this.$route.query.id ? '修改病例' : this.$route.query.detailsId ? '查看病例' : '添加病例';
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      if (id || detailsId) {//修改
        let detailId = detailsId || id;
        this.pageDetails(detailId);
      }
      if (detailsId) {
        this.pageStatus = 1;
      }
    },
    watch: {},
    methods: {
      /*查看详情*/
      pageDetails(id) {//查看和修改的页面信息
        detailsAPI(id).then(res => {
          if (res.data.code === 0) {
            this.resourceForm = res.data.data;
            if (res.data.data.pdfRoute) {
              this.fileList = [{name: res.data.data.pdf_zh, url: res.data.data.pdfRoute}];
            }

            /*if(res.data.data.payStatus == "0"){//免费
              this.resourceForm = {...res.data.data,payStatus:"0"}
            } else{ //付费
              this.resourceForm = {...res.data.data,payStatus:"1"}
            }*/
            this.resourceForm.price = this.resourceForm.price != null ? Number(this.resourceForm.price).toFixed(2) : null;
            this.resourceForm.realPrice = this.resourceForm.realPrice ? Number(this.resourceForm.realPrice).toFixed(2) : '0.00';
          } else {
            this.$message.error('加载失败')
          }
        })
      },


      // 查看pdf
      queryPDF() {
        window.open(uploadUrl + "?fileName=" + this.resourceForm.pdfRoute + "&isOnLine=true")
      },
      //pdf上传
      beforePdfUpload(file) {
        const isPDF = file.type === 'application/pdf'
        if (!isPDF) {
          this.$message.error('附件文件只能是 PDF 格式!')
          return isPDF;
        }
        this.uploading = true;
        this.resourceForm.pdf_zh = '';
      },
      handlePdfSuccess(response, file, fileList) {
        this.resourceForm.pdfRoute = response.fileName
        this.resourceForm.pdf_zh = response.originalFileName
        const pdf = {
          keywords: this.resourceForm.keywords,
          name: response.originalFileName,
          nationsType: this.resourceForm.nationsType,
          resourceCode: response.fileName,
          resourceType: 66,
          author: this.resourceForm.author,
          source: this.resourceForm.source,
        }
        this.resourceList.push(pdf);
        this.uploading = false
      },
      handlePdfExceed(files, fileList) {
        this.$message.warning(`单次上传最多1个文件`);
      },
      handlePdfRemove() {//删除pdf
        this.resourceForm.pdfRoute = null;
        this.resourceForm.pdf_zh = '';
        this.fileList = [];
      },

      //图片
      beforePicUpload(file) {
        const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif';/*|| file.type == 'image/gif'*/
        console.log(111111, file)
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/JPEG/PNG/GIF 格式!');
          return isJPG
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return isLt2M
        }
        /*this.uploading = true*/
        this.$message.warning('上传中');
      },
      handlePicSuccess(response, file, fileList) {
        /*this.uploading = false*/
        this.$message.success('上传成功');
        this.resourceForm.imageRoute = response;
      },
      handlePicPreview(file) { // 图片预览
        this.dialogImage = file
        this.dialogPvVisible = true
      },
      handleRemove() { // 图片删除
        this.resourceForm.imageRoute = ''
      },
      deleteIMG() {
        this.resourceForm.imageRoute = ''
      },


      //保存
      dataSubmit() {
        if (!this.isSubmit) return
        this.isSubmit = false;
        this.$refs['resourceForm'].validate((valid) => {
          if (valid) {//必填名称--规则 （pdf和正文内容至少填一项）

            if ((this.resourceForm.content != null && this.resourceForm.content != '') || (this.resourceForm.pdfRoute != null && this.resourceForm.pdfRoute != '')) {
              if ((this.resourceForm.payStatus == 0 && this.resourceForm.realPrice != '') || this.resourceForm.payStatus == 1) {//售价---必填
                if (this.resourceForm.payStatus != 0) this.resourceForm.realPrice = 0  // 售价
                const id = this.$route.query.id; //修改id

                this.resourceForm.price = this.resourceForm.price ? Number(this.resourceForm.price).toFixed(2) : null;
                this.resourceForm.realPrice = this.resourceForm.realPrice ? Number(this.resourceForm.realPrice).toFixed(2) : '0.00';
                if (id) {//修改
                  this.resourceForm.id = id;
                  editAPI(this.resourceForm).then(res => {
                    if (res.data.code === 0) {
                      this.$message.success('编辑成功')
                      //this.$router.push({ path: '/medicalTreatment/caseBank' });
                      /*this.commonUpload()*/
                      this.$router.go(-1);
                    } else {
                      this.$message.error('编辑失败')
                    }
                    this.isSubmit = true;
                  })
                } else {
                  saveAPI(this.resourceForm).then(res => {
                    if (res.data.code === 0) {
                      this.$message.success('添加成功')
                      //this.$router.push({ path: '/medicalTreatment/caseBank' });
                      /*this.commonUpload()*/
                      this.$router.go(-1);
                    } else {
                      this.$message.error('添加失败')
                    }
                    this.isSubmit = true;
                  })
                }
              } else {
                this.$message.error('请填写售价哦');
                this.isSubmit = true;
              }
            } else {
              this.$message.error('内容和pdf至少填一项');
              this.isSubmit = true;
            }
          } else {
            this.$message.error('请将信息补全!');
            this.isSubmit = true;
          }
        })
      },
      cancel() {//取消
        this.$router.go(-1);
      },
      // 提交公共资源
      commonUpload() {
        if (this.resourceList.length != 0) {
          commonUploadAPI(this.resourceList).then(res => {
          })
        }
      },

    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .addCaseBank {
    .title {
      font-weight: bold;
      margin-bottom: 20px;
      margin-top: 10px;
    }

    .tip {
      color: #ccc;
      margin-left: 30px;
    }

    .t {
      color: #ccc;
      display: inline-block;
      margin-top: 10px;
    }

    .addImg {
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      width: 140px;
      height: 140px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 30px;
        height: 30px;
      }
    }

    .deleteImg {
      font-size: 20px;
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
  }
</style>
