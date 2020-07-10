<template>
  <div class="app-container">
    <el-form ref="forms" :model="form" label-width="140px" size="medium">
      <el-form-item label="网站名称：" prop="data[0].value"  :rules="[{ required: true, message: '请输入网站名称', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[0].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">将显示在站点位置导航等</el-col>
      </el-form-item>
      <el-form-item label="网站域名："  prop="data[1].value"  :rules="[{ required: true,pattern:/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/, message: '请输入正确的网站域名', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[1].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">后面不要带"/"。如：http://www.zhongdianyun.com</el-col>
      </el-form-item>

      <el-form-item label="网站LOGO：" prop="data[2].value"  :rules="[{ required: true, message: '请上传网站LOGO', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[2].value" disabled></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">
          <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess">
            <el-button :disabled="uploading">上传图片</el-button>
            <img v-if="form.data[2].value" style="height:36px;vertical-align: middle;" :src="`${domain}${requestPath.file}?fileName=${form.data[2].value}&isOnLine=true`" :alt="`${form.data[1].value}`">
          </el-upload>
        </el-col>
      </el-form-item>
      <el-form-item label="管理员姓名：" prop="data[3].value"  :rules="[{ required: true, message: '请输入管理员姓名', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[3].value"></el-input>
        </el-col>        
      </el-form-item>
      
      <el-form-item label="管理员联系方式：" prop="data[4].value"  :rules="[{ required: true, message: '请输入管理员联系方式', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[4].value"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="网站META关键词：" prop="data[5].value"  :rules="[{ required: true, message: '请输入网站META关键词', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[5].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">针对搜索引擎设置的网页关键词,多个关键词请用,号分隔</el-col>
      </el-form-item>
      <el-form-item label="网站META描述：" prop="data[6].value"  :rules="[{ required: true, message: '请输入网站META描述', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[6].value" type="textarea"></el-input>
        </el-col>
        
      </el-form-item>
      <el-form-item label="底部版权信息："  prop="data[7].value"  :rules="[{ required: true, message: '请输入底部版权信息', trigger: 'blur' }]">
        <el-col :span="24">
          <tinymce v-model="form.data[7].value"  style="width:800px" :height=300>
              
          </tinymce>
        </el-col>
      </el-form-item>
      <el-form-item>
          <el-button @click="onSubmit">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { uploadPath, requestPath } from '@/utils/global.js'
import {getListBasicAPI} from '@/api/system-management/systemParameters'
import {batchUpdateAPI} from '@/api/system-management/dataDictionary'
import {operationMsg, confirm} from '@/utils/publicFunctions'
import tinymce from '@/components/Tinymce'
  export default {
    components:{tinymce},
    data() {
      return {
        uploadPath: uploadPath,
        domain: process.env.BASE_API,
        requestPath: requestPath,
        form: {
          data:[{},{},{},{},{},{},{},{}]
        },
        uploading: false,
      }
    },
    methods: {
      beforeUpload(file){
        this.uploading = true
      },
      handleSuccess(response, file, fileList){
        this.form.data[2].value = response
        this.uploading = false
      },
      onSubmit() {
        console.log(this.$refs['forms']);
        this.$refs['forms'].validate((valid) => {
          if(valid){
            // confirm.apply(this,['确认修改吗？']).then(()=>{
              let data = this.form.data
              batchUpdateAPI(data).then((res)=>{
                operationMsg.apply(this,[res.data.code,'修改'])
                this.getList()
              })
            // })
          }else{
            this.$message.warning("请正确填写相关信息")
          }

        })
      },
      getList() {
        getListBasicAPI().then(res => {
          this.form = res.data
        })
      }
    },
    mounted(){
      this.getList()
    }
  };
</script>

<style>
    
</style>
