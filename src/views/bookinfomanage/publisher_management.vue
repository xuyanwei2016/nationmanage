<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleForm">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>

      <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="出版社LOGO" class-name="img-column" min-width="160" align="center">
        <template slot-scope="scope">
          <img :src="`${domain}${requestPath.file}?fileName=${scope.row.logo}&isOnLine=true`" :alt="`${scope.row.name}`">
        </template>
      </el-table-column>
      <el-table-column label="出版社名称" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出版社链接地址" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="handleForm(scope.row)" ></i>

          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0"  :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.publisherid)" ></i>

        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style='margin-right:10px;'>
        <el-form-item label="出版社名称：" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="出版社logo：" prop="logo">
          <el-col :span="11">
            <el-input v-model="temp.logo" disabled></el-input>
          </el-col>
          <el-col :span="13" style="padding-left:15px;">
            <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess">
              <el-button :loading="uploading">上传图片</el-button>
              <img v-if="temp.logo" style="height:36px;vertical-align: middle;" :src="`${domain}${requestPath.file}?fileName=${temp.logo}&isOnLine=true`" :alt="`${temp.name}`">
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="出版社链接：" prop="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
        <el-form-item label="排序号：" prop="sort">
          <el-col :span="11">
            <el-input v-model="temp.sort" clearable></el-input>
          </el-col>
          <el-col :span="13" v-if="maxSort>-1" style="color:gray; padding-left:15px;">当前最大排序号为{{maxSort}}</el-col>
        </el-form-item>
        <el-form-item label="出版社简介：" prop="description">
          <el-input v-model="temp.description" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="最多300字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formSubmit">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import Upload from "@/components/Upload/singleImage3";
// import MDinput from "@/components/MDinput";
import { requestPath, uploadPath } from '@/utils/global.js'
import { getListAPI, deleteAPI, updateAPI, addAPI } from '@/api/book-infomation/publisher'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'

export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (value.replace(/\s+/g,"") == ''){
        callback(new Error('未填写'));
      } else if( value.length > 100 ) {
        callback(new Error(`最多100字符！已输入${value.length}字符`));
      }else{
        callback();
      }
    };
    var validateUrl = (rule, value, callback) => {
      let urlreg = /^(http(s)?:\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
      if ( !urlreg.test(value) ){
        callback(new Error('请输入真实合法的url，以http://或https://开始'));
      } else {
        callback()
      }
    };
    var validateSort = (rule, value, callback) => {
      let reg = /^([1-9]\d?|0)$/;
      if ( !reg.test(value) ){
        callback(new Error('请输入0-99之间正整数表示的排序号'));
      } else {
        callback()
      }
    };
    return {
      authBtns: [],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100
      },
      maxSort: -1,
      ids: [],
      temp: {},
      rules: {
        name: [{ type: 'string', required: true, trigger: 'change', validator: validateName }],
        logo: [{ type: 'string', required: true, trigger: 'change', message: 'LOGO图片必传' }],
        url: [{ type: 'string', required: true, trigger: 'change', validator: validateUrl }],
        sort: [{ trigger: 'change', validator: validateSort }],
        description: [{ type: 'string', trigger: 'change', max: 300, message: `最多300个字符` }]
      },
      dialogVisible: false,
      textMap: {
        update: '修改出版社',
        create: '添加出版社'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      uploading: false,
      uploadPath: uploadPath,
      multipleSelection:[]
    }
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList()
  },
  methods: {
    //beforeUpload、handleSuccess图片上传相关
    beforeUpload(file){
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
        return isJPG
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!')
        return isLt3M
      }
      this.uploading = true
    },
    handleSuccess(response, file, fileList){
      this.temp.logo = response
      this.uploading = false
    },
    formSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.publisherid ? this.invokeApi(updateAPI) : this.invokeApi(addAPI)
        }
      })
    },
    invokeApi(api){
      api(this.temp).then(res => {
        operationMsg.apply(this,[res.data.code, this.textMap[this.dialogStatus] ])
        res.data.code === 0 ? this.dialogFormVisible = false : true
      })
    },
    handleForm(row){
      this.list.length>0 ? this.maxSort = this.list.reduce((maxNum, item) => Math.max(maxNum, item.sort), 0) : this.maxSort = -1
      if (row.publisherid) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
      } else {
        this.resetTemp()
        this.dialogStatus = 'create'
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        name: '',
        logo: '',
        url: 'http://',
        sort: parseInt(this.maxSort)+1,
        status: 1,
        istop: 0,
        description: ''
      };
    },
    massDelete(){
      if(this.multipleSelection.length!=0){
        confirm.apply(this,['确认删除选择的出版社吗？']).then(() => {
          deleteAPI(this.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.ids.length}项`])
          })
        });
      } else {
        this.$message.warning('请先选择需要删除的内容')
      }
    },
    singleDelete(id){
      confirm.apply(this,['确认要删除选择的出版社吗？']).then(() => {
        deleteAPI([id]).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multipleSelection.length>0 ? this.ids = getMultipleSelectionIDs(this.multipleSelection,'publisherid') : true
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
</script>
