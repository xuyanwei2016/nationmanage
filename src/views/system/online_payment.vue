<template>
  <div class="app-container calendar-list-container">
      
    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row>
      <el-table-column class-name="img-column" align="center" label="LOGO">
        <template slot-scope="scope">
          <img :src="`${domain}${requestPath.file}?fileName=${scope.row.logo}&isOnLine=true`" :alt="`${scope.row.name}`">
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付平台名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="简介">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序号" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">启用</span>
          <span v-else style="color: red;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-edit-outline" @click="handleUpdate(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="150px">
        <el-form-item label="支付平台名称：" prop="name">
          <el-col :span="12">
            <el-input v-model="temp.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="支付平台LOGO：" prop="logo">
          <el-col :span="12">
            <el-input v-model="temp.logo" disabled></el-input>
          </el-col>
          <el-col :span="12" style="padding-left:15px;">
            <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess">
              <el-button :disabled="uploading">上传图片</el-button>
              <img style="height:36px;vertical-align: middle;" :src="`${domain}${requestPath.file}?fileName=${temp.logo}&isOnLine=true`" :alt="`${temp.name}`">
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-col :span="12">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="temp.description"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button class="form-submit" @click="updateBtn">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { uploadPath, requestPath } from '@/utils/global.js'
import { getData, updateData } from "@/api/system-management/onlinePayment";
import { operationMsg } from '@/utils/publicFunctions'

export default {
  name: "complexTable",
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        cnkey: '',
        enkey: '',
        value: '',
        code: ''
      },
      temp: {
        id: null,
        status: '',
        logo: '',
        name: '',
        description: ''
      },
      maxSort: 0,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: '修改支付描述'
      },
      rules: {
        name: [{ required: true, message: "支付平台名称必填", trigger: "blur" }],
        logo: [{ required: true, message: "支付平台LOGO必填", trigger: "blur" }],
        status: [{ required: true, message: "必选", trigger: "blur" }]
      },
      fileList: [],
      uploading: false,
      multipleSelection:[]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    beforeUpload(file){
      this.uploading = true
    },
    handleSuccess(response, file, fileList){
      this.temp.logo = response
      this.uploading = false
    },
    handleUpdate(row){
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateBtn(){
      document.getElementsByClassName('form-submit').disabled = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateData(tempData).then(res => {
            console.log(res)
            operationMsg.apply(this,[res.data.code,'更新'])
            this.dialogFormVisible = false
            document.getElementsByClassName('form-submit').disabled = false
          })
        }
      })
    },
    getList() {
      this.listLoading = true;
      getData(this.listQuery).then(response => {
        console.log(response)
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false;
      });
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
};
</script>
