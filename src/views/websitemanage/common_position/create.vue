<template>
  <div class="app-container">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-form-item label="推荐位名称：" prop="name">
        <el-select v-model="resourceForm.name" placeholder="请选择" :disabled="canuse" @change="changeName" style="width: 300px;">
            <el-option v-for="(index,item) in nameList" :key="index" :label="item.label" :value="index"></el-option>
            <el-option v-for="(index,item) in nationsList" :key="index" :label="item.label" :value="index"></el-option>
        </el-select>
        <div style="color: #f56c6c; font-size: 12px;position: absolute; top: 28px;" v-if="cancelName">推荐位名称已存在</div>
      </el-form-item>
      <br>
      <el-form-item label="推荐位代码：" prop="code">
        <el-input v-model="resourceForm.code" clearable placeholder="请输入推荐位代码" style="width:250px;margin-right:10px"></el-input><!-- :disabled="canuse"-->
        <span class="tip">建议使用英文、数字、_组成，唯一</span>
      </el-form-item>
       <el-form-item label="关联民族：">
          <el-input v-model="resourceForm.name" disabled></el-input>
          <span class="tip">民族医库推荐位必须关联民族，其他推荐位不需要关联民族，关联民族以后会在网站首页民族医库模块展示</span>
      </el-form-item>
      <el-form-item label="展示封面：">
        <el-upload class="avatar-uploader" :action="`${uploadUrl}${uploadPath}`" :show-file-list="false" :on-remove="handleRemove" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.img}&isOnLine=true`" v-if="resourceForm.img" class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc" >
          <!-- <i class="el-icon-plus avatar-uploader-icon" v-else></i> -->
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon" style="width: 100%; height: 100%;">
        </el-upload>
        <span class="tip xjs_tip">仅支持jpg、jpeg、png、gif、png格式，不超过2M，民族医库模块展示的封面在民族主页维护即可，请根据前台设计决定是否上传封面。</span>
      </el-form-item>
      <el-form-item label="排序号：" prop="sort">
        <el-input v-model="resourceForm.sort" clearable placeholder="请输入排序号" style="width:250px;margin-right:10px"></el-input><!-- :disabled="canuse"-->
      </el-form-item>
      <el-form-item label="备注：" prop="descriptions">
        <el-input type="textarea" :rows="2" clearable placeholder="请输入备注" v-model="resourceForm.descriptions" style="width:300px;margin-right:10px"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio v-model="resourceForm.status" :label=1>启用</el-radio>
        <el-radio v-model="resourceForm.status" :label=0>禁用</el-radio>
      </el-form-item>
      <el-form-item>
        <span>创建推荐位以后推荐位名称和关联民族字段不能修改，保存前请仔细审查填写内容</span>
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
import { saveAPI, editAPI, detailsAPI, isExistAPI, nationsListAPI} from '@/api/website-management/position'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import Cookies from 'js-cookie'

export default {
  components:{ Tinymce },
  data() {
    return {
      resourceForm: {
        status:1,
        img:null,
      },
      notEdit:false,
      uploading: false,
      editId: '',
      pageStatus:0,
      popoverVisible: false,
      diyTypeCode: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      options: [],
      navTree: [],
      rules:{
        name:[
          { required: true,message: '请选择推荐位名称', trigger: 'change' }
        ],
        code:[
          { required: true, trigger: 'change', message: '请输入推荐位代码'},{pattern:/^.{1,20}$/,message: '推荐位代码长度必须小于20位', trigger: 'change' }
        ],
        sort:[
          { required: true , message: '请输入排序号',trigger: 'change'},{pattern: /^\d+$/, message: '请输入整数排序号', trigger: 'change' }
        ],
        status:[
          { required: true,message: '请选择状态', trigger: 'change' }
        ],
        descriptions:[
          { pattern:/^.{1,200}$/,message: '请输入200字以内的备注', trigger: 'change' }
        ],

      },
      checkedKeys:[],
      nameList: ['首页-民族医库','首页-医家专区','首页-典型医案','首页-医著推荐','首页-特色疗法','首页-药材'],
      canuse: false,
      nationsType: null,
      nationsList: [],
      cancelName: false
    }
  },
  created(){
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath

  },
  mounted() {
    this.isEdit();
    this.getnationsList()
  },
  methods: {
    // 验重
    changeName() {
      this.resourceForm.nationalName = this.resourceForm.name
      const data = {
        recommendType:1,
        // nationsType:1,
        name:this.resourceForm.name,
        code:this.resourceForm.code
      }
      isExistAPI(data).then(res => {
        if(res.data.code === 2) {
          // this.$message.error(res.data.msg)
          this.cancelName = true
        } else if(res.data.code === 0) {
          this.cancelName = false
        }
      })
    },
    isEdit(){
      this.$route.meta.title = '添加推荐位'
      const id = this.$route.query.id;
      if(id){//修改
        this.$route.meta.title = '修改推荐位'
        this.canuse = true
        this.pageDetails(id);
      }
    },
    // 民族类型列表
    getnationsList() {
      nationsListAPI().then(res => {
        res.data.code === 0 ? this.nationsList = res.data.data : this.$message.error('获取数据失败');
      })
    },

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
    pageDetails(id){ //修改的页面信息
      detailsAPI(id).then(res => {
        this.resourceForm = res.data.data
      })
    },
    dataSubmit() {//保存
      this.$refs['resourceForm'].validate((valid) => {
        if (valid) {//必填字段
          const id = this.$route.query.id; //修改id
          if(id) {//修改
            this.resourceForm.id = id
            editAPI(this.resourceForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success('编辑成功')
                this.$router.go(-1);
              } else{
                this.$message.error('编辑失败')
              }
            })
          } else{
            this.resourceForm.recommendType = 1
            saveAPI(this.resourceForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success('添加成功')
                this.$router.go(-1);
              } else{
                this.$message.error('添加失败')
              }
            })
          }
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
    margin-left: 10px;
  }
  .aa{
    display: block !important;
    width: 100%;
  }
 .el-input {
    width: 300px !important;
  }
</style>
