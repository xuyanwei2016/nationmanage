<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="140px" size="medium">
      <el-form-item label="SMTP服务器："  prop="data[0].value"  :rules="[{ required: true,pattern:/[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/, message: '请输入SMTP服务器', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[0].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">必须正确填写，如:smtp.163.com</el-col>
      </el-form-item>
      <el-form-item label="SMTP端口号：">
        <el-col :span="11">
          <el-input v-model="form.data[1].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">端口号，默认为25</el-col>
      </el-form-item>

      <el-form-item label="发件人邮箱："  prop="data[2].value"  :rules="[{ required: true,pattern:/^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入发件人邮箱', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[2].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">此邮件将显示为对方的发件人邮件</el-col>
      </el-form-item>
      <el-form-item label="邮件服务账号："  prop="data[3].value"  :rules="[{ required: true,pattern:/^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入邮件服务账号', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[3].value"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="邮件服务密码："  prop="data[4].value"  :rules="[{ required: true, message: '请输入邮件服务密码', trigger: 'blur' }]">
        <el-col :span="11">
          <el-input v-model="form.data[4].value"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
          <el-button @click="onSubmit">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEmailAPI, batchUpdateAPI } from '@/api/system-management/dataDictionary'
import {operationMsg} from '@/utils/publicFunctions'

export default {
  data() {
    return {
      form: {
        data:[{},{},{},{},{}]
      }
    };
  },
  mounted(){
    this.getList()
  },
  methods: {
    getList() {
      getEmailAPI().then(response=>{
        console.log(response)
        if(response.data.code === 0){
          this.form.data = response.data.data
        } else {
          this.$message.error('获取数据失败');
          console.log(response.data.data)
        }
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if(valid){
          batchUpdateAPI(this.form.data).then(res=>{
            operationMsg.apply(this,[res.data.code,'邮件参数设置'])
          })
        }
      })
    }
  }
};
</script>
