<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="140px" size="medium">
      <el-form-item label="会员登录奖励：">
        <el-col :span="8">
          <el-input-number v-model="form.data[0].value" :min="1"></el-input-number>&nbsp; 积分
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="form.data[1].value" :min="1"></el-input-number>&nbsp; 成长值
        </el-col>
      </el-form-item>

      <el-form-item label="会员注册奖励：">
        <el-col :span="8">
          <el-input-number v-model="form.data[2].value" :min="1"></el-input-number>&nbsp; 积分
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="form.data[3].value" :min="1"></el-input-number>&nbsp; 成长值
        </el-col>
      </el-form-item>

      <el-form-item label="会员评论奖励：">
        <el-col :span="8">
          <el-input-number v-model="form.data[4].value" :min="1"></el-input-number>&nbsp; 积分
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="form.data[5].value" :min="1"></el-input-number>&nbsp; 成长值
        </el-col>
      </el-form-item>

      <el-form-item label="会员注册站内信：">
        <el-col :span="11">
          <el-input v-model="form.data[6].value" type="textarea" rows="10"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="会员注册条款：">
        <el-col :span="18">
          <tinymce v-model="form.data[7].value"></tinymce>
        </el-col>
      </el-form-item>
      <el-form-item>
          <el-button @click="onSubmit">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import {getListMemberAPI} from '@/api/system-management/systemParameters'
import {batchUpdateAPI} from '@/api/system-management/dataDictionary'
import {operationMsg, confirm} from '@/utils/publicFunctions'
import tinymce from '@/components/Tinymce'
  export default {
    components:{tinymce},
    data() {
      return {
        form: {
            data:[{},{},{},{},{},{},{},{}]
        }
      };
    },
    
    methods: {
      onSubmit() {
        console.log(this.form);
        let data = this.form.data
        confirm.apply(this,['确认修改吗？']).then(()=>{
            batchUpdateAPI(data).then((res)=>{
                operationMsg.apply(this,[res.data.code,'修改'])
            })
        })
      },
      getList() {
          getListMemberAPI().then(res => {
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
    
</style>
