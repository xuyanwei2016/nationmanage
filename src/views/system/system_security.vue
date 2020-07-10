<template>
    <div class="app-container">
        
       <el-form ref="form" :model="form" label-width="140px" size="medium">
            <el-form-item label="仅管理员登录">
                <el-radio-group v-model="form.data[1].value" size="medium">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
                </el-radio-group>
                <span class="tips">如果开启那么系统后台只有管理员账号可以登录</span>
            </el-form-item>
             <el-form-item label="后台登录过期时间">
                <div class="input-text">
                    <el-input type="number"  min="5" max="30" v-model="form.data[2].value"></el-input><span> 分钟</span>                    
                </div>
                <span class="tips">登录后台的用户长时间不操作后自动退出，建议设置为30分钟</span>
            </el-form-item>

            <el-form-item label="后台登录验证码">
                <el-radio-group v-model="form.data[3].value" size="medium">
                    <el-radio label="1">启用</el-radio>
                    <el-radio label="0">禁用</el-radio>
                </el-radio-group>
                <span class="tips">启用后用户在系统登录时必须要输入页面验证码</span>
            </el-form-item>
            <el-form-item label="后台账号错误锁定" prop="data[0].value"  :rules="[{ required: true, message: '请填写后台账号错误锁定错误或时间', trigger: 'blur' }]">
                <div class="input-text-lock">
                    <el-input v-model="form.data[0].value" type="number"></el-input><span> 次，锁定</span>
                    <el-input v-model="form.data[4].value"></el-input><span> 分钟</span>
                </div>
                <span class="tips">输入0则不做限制</span>
            </el-form-item>
            
            <el-form-item label="后台账号登录唯一">
                <el-radio-group v-model="form.data[5].value" size="medium">
                    <el-radio label="1">启用</el-radio>
                    <el-radio label="0">禁用</el-radio>
                </el-radio-group>
                <span class="tips">开启则每个后台账号不可以多人重复登录</span>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSubmit">保存设置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {getListAPI} from '@/api/system-management/systemSecurity'
import {batchUpdateAPI} from '@/api/system-management/dataDictionary'
import {operationMsg, confirm} from '@/utils/publicFunctions'
  export default {
    data() {
      return {
        form: {
            data:[{},{},{},{},{},{}]
        }
      };
    },
    methods: {
      onSubmit() {
        console.log(this.form);
        this.$refs['form'].validate((valid) => {
            if(valid){
            let data = this.form.data
                confirm.apply(this,['确认修改吗？']).then(()=>{
                    batchUpdateAPI(data).then((res)=>{
                        operationMsg.apply(this,[res.data.code,'修改'])
                    })
                })
            }else{
                this.$message.warning("请填写锁定次数或分钟")
            }
        })
      },
      getList() {
          getListAPI().then(res => {
              console.log(res.data.data)
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
    .input-text{
        width: 250px;
        display: inline-block;
    }
    .input-text .el-input{
        display: inline-block;
        width: 80%;
    }
    .input-text-lock{
        width: 600px;
        display: inline-block;
    }
    .input-text-lock .el-input{
        display: inline-block;
        width: 40%;
    }
    .tips{
        float:right;
        margin-right: 100px;
    }
</style>
