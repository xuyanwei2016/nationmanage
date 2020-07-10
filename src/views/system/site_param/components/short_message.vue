<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="140px" size="medium">
      <el-form-item label="供应商名称：">
        <el-col :span="11">
          <el-input v-model="form.data[0].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">如果开启那么系统后台只有管理员账号可以登录</el-col>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-col :span="11">
          <el-input v-model="form.data[1].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">可使用短信服务的账号</el-col>
      </el-form-item>

      <el-form-item label="密码（key）：">
        <el-col :span="11">
          <el-input v-model="form.data[2].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">账号对应的密码</el-col>
      </el-form-item>
      <el-form-item label="发送接口URL：">
        <el-col :span="11">
          <el-input v-model="form.data[3].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">获取短信服务接口地址</el-col>
      </el-form-item>
      
      <el-form-item label="发送参数：">
        <el-col :span="11">
          <el-input v-model="form.data[4].value"></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">发送参数的标签说明：{$user}用户名 {$pass}密码Key {$mobile}接收的手机号 {$content}发送的内容</el-col>
      </el-form-item>
      <el-form-item label="成功标识符：">
        <el-col :span="11">
          <el-input v-model="form.data[5].value"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
          <el-button @click="onSubmit">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMsgAPI, batchUpdateAPI } from '@/api/system-management/dataDictionary'
import {operationMsg} from '@/utils/publicFunctions'

export default {
  data() {
    return {
      form: {
        data:[{},{},{},{},{},{}]
      }
    };
  },
  mounted(){
    this.getList()
  },
  methods: {
    getList() {
      getMsgAPI().then(response=>{
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
      batchUpdateAPI(this.form.data).then(res=>{
        operationMsg.apply(this,[res.data.code,'短信参数设置'])
      })
    }
  }
};
</script>
