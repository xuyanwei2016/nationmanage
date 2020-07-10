<template>
  <div class="createPost-container">
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px" class="form-container">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <div class="createPost-main-container">
        <el-form-item label="链接标题：" prop="title">
        <el-col :span="11">
          <el-input v-model="temp.title" placeholder="请输入链接标题"></el-input>
        </el-col>
        </el-form-item>
        <el-form-item label="链接地址：" prop="url">
        <el-col :span="11">
          <el-input v-model="temp.url"></el-input>
        </el-col>
        </el-form-item>
        <el-form-item label="链接图片：" prop="img">
        <el-col :span="11">
          <el-input v-model="temp.img" disabled></el-input>
        </el-col>
        <el-col :span="13" style="padding-left:15px;">
          <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess">
            <el-button :disabled="uploading">上传图片</el-button>
            <img v-if="temp.img" style="height:36px;vertical-align: middle;" :src="`${domain}${requestPath.file}?fileName=${temp.img}&isOnLine=true`" :alt="`${temp.title}`">
          </el-upload>
        </el-col>
        </el-form-item>
        <el-form-item label="排序号：" prop="sort">
        <el-col :span="5">
          <el-input type="input" placeholder="请输入内容" v-model="temp.sort" clearable></el-input>
        </el-col>
        <el-col :span="19" style="color:gray; padding-left:15px;">当前最大排序号为{{maxSort}}，修改排序号会将当前内容插入到对应排序位置</el-col>
        </el-form-item>
        <el-form-item label="链接介绍：">
        <el-col :span="11">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description"></el-input>
        </el-col>
        </el-form-item>
      </div>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button  class="form-submit" @click="subData">保存</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>


<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 180px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      // .postInfo-container-item {
      //   float: left;
      // }
    }
  }

}

</style>

<script>
import { requestPath, uploadPath } from '@/utils/global.js'
import { getFriendlink, updateFriendlink, addFriendlink, getFriendlinkOid, getMaxSortAPI } from "@/api/website-management/friendlinkManagement"
import {operationMsg,confirm} from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'

export default {
  name: "complexTable",
  data() {
    const validateUrl = (rule, value, callback) => {
      let urlreg = /^(http(s)?:\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
      if ( !urlreg.test(value) ){
        callback(new Error('请输入真实合法的url，以http://或https://开始'));
      } else {
        callback()
      }
    };
    const validateSort = (rule, value, callback) => {
      let reg = /^([1-9]\d*|0)$/;
      if ( !reg.test(value) ){
        callback(new Error('请输入0及正整数表示的排序号'));
      } else {
        callback()
      }
    };
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        title: ''
      },
      massQuery: {
        ids: []
      },
      maxSort: null,
      temp: {
        id: null,
        url: 'http://',
        img: '',
        title: '',
        sort: 0,
        description: ''
      },
      dialogStatus: "",
      textMap: {
        update: "更新友情链接",
        create: "添加友情链接"
      },
      dialogPvVisible: false,
      rules: {
        title: [{ type: 'string', required: true, trigger: 'blur', message: '标题必填' }],
        url: [{ required: true, validator: validateUrl }],
        sort: [{ required: true, validator: validateSort }]
      },
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      uploading: false,
      multipleSelection:[]
    };
  },
  mounted() {
    this.getOid();
    this.isEdit()
    this.getMaxSort()
  },
  methods: {
    getMaxSort() {
      return getMaxSortAPI().then(res => {
        this.maxSort = res.data.data
      })
    },
    isEdit(){
      this.$route.meta.title = '添加友情链接'
      this.getMaxSort().then(res => {
        this.temp.sort = this.maxSort
      })
      const id = this.$route.query.id;
      if(id){//修改
        this.$route.meta.title = '修改友情链接'
        this.canuse = true
      }
    },

    beforeUpload(file){
      this.uploading = true
    },
    handleSuccess(response, file, fileList){
      this.temp.img = response
      this.uploading = false
    },
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection) : true
    },
    getOid(){
      if(this.$route.query.id){
        getFriendlinkOid(this.$route.query.id).then(res =>{
          res.data.code === 0 ? this.temp = res.data.data : this.$message.error('请求出错啦'); ;
        })
      }
    },


    resetTemp() {
      this.temp = {
        id: null,
        url: 'http://',
        img: '',
        title: '',
        sort: this.maxSort,
        description: ''
      };
    },
    subData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
            if(this.temp.id){
              updateFriendlink(this.temp).then(res => {
                if(res.data.code === 0){
                  this.$message.success(`修改成功`)
                  this.$router.go(-1);
                } else{
                  this.$message.error(`修改失败`)
                }

              });
            }else{
              addFriendlink(this.temp).then(res => {
                if(res.data.code === 0){
                  this.$message.success(`添加成功`)
                  this.$router.go(-1);
                } else{
                  this.$message.error(`添加失败`)
                }

              })
            }

        }
      });
    },

  }
};
</script>


