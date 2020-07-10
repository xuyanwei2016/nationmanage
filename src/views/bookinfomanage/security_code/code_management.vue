<template>
  <div class="app-container calendar-list-container">
    <h3>所属图书：{{bookname}}</h3>
    <div class="nav-buttons-container">
      <el-button icon="el-icon-circle-plus" @click="handleForm(1)">批量创建</el-button>
      <el-button icon="el-icon-circle-plus-outline" @click="handleForm(5)">添加防伪码</el-button>
      <el-button icon="el-icon-download" @click="handleForm(2)">导出防伪码</el-button>
      <el-button icon="el-icon-download" @click="handleForm(3)">导出二维码</el-button>
      <el-button icon="el-icon-upload2" @click="handleForm(4)">导入防伪码</el-button>
      <el-button icon="el-icon-circle-close" @click="batchCancel">废置防伪码</el-button>
    </div>
    <el-form inline class="filter-form-inline">
      <el-form-item label="筛选">
        <el-select v-model="listQuery.status">
          <el-option v-for="filter in filters" :key="filter.status" :label="filter.name" :value="filter.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="明码">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.sort" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key="tableKey" :data="list" @selection-change="handleSelectionChange" border highlight-current-row v-loading="listLoading" stripe element-loading-text="给我一点时间">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="防伪码号" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.seCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定用户" min-width="55" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.member}}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定时间" min-width="55" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.buildDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="65" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.invalid===0" style="color:#CC6600;">未废置</span>
          <span v-else-if="scope.row.invalid===1" style="color:#008000;">已废置</span>
        </template>
      </el-table-column>
      <el-table-column label="验证数量" min-width="65" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.buildNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="序号" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="createTemp" ref="dataForm" v-if="dialogStatus==='create'" label-width="100px" style='margin-right:10px;'>
        <el-form-item label="生成数量：" prop="num" :rules="{required: true, message: '未填写', trigger: 'change'}">
          <el-input-number v-model="createTemp.num" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <el-form ref="dataForm" v-else-if="dialogStatus==='import'" label-width="100px" style='margin-right:10px;'>
        <el-form-item label="选择文件：" :rules="{required: true, message: '未上传', trigger: 'change'}">
          <input type="file" @change="fileSelect" ref="file" accept=".xls,.xlsx">
        </el-form-item>
      </el-form>
      <el-form :model="createForm" ref="dataForm" v-if="dialogStatus==='createOne'" label-width="110px" style='margin-right:20px;'>
        <el-form-item label="防伪码暗码：" prop="seCode" :rules="{required: true, message:'请输入防伪码', trigger: 'blur'}">
          <el-input v-model="createForm.seCode"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="exportTemp" ref="dataForm" v-else label-width="100px" style='margin-right:10px;'>
        <el-form-item :label="`${textMap[dialogStatus]}:`">
          <el-input-number v-model="exportTemp.num" @input="handleStartChange" :min="1" :max="total"></el-input-number> &nbsp; -- &nbsp; <!--
            --><el-input-number v-model="exportTemp.toNum" :min="exportTemp.num" :max="total"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus==='create' || dialogStatus==='createOne'" @click="formSubmit" :loading="uploading">创建</el-button>
        <el-button v-else-if="dialogStatus==='import'" @click="ImportSubmit" :loading="uploading">执行导入</el-button>
        <el-button v-else @click="formSubmit" :loading="uploading">导出</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import queryString from 'query-string'
import { requestPath } from '@/utils/global.js'
import { getCodeAPI, exportQRCodeAPI, importAPI, addAPI, invalidAPI, getGoodsAPI, addOneAPI } from '@/api/book-infomation/securityCode'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'

const filters = [
  { status: 0, name: '全部' },
  { status: 1, name: '未绑定用户' },
  { status: 2, name: '已绑定用户' },
  { status: 3, name: '已导出防伪码' },
  { status: 4, name: '未导出防伪码' },
  { status: 5, name: '已导出二维码' },
  { status: 6, name: '未导出二维码' },
  { status: 7, name: '被盗版倒序' },
  { status: 8, name: '被盗版顺序' }
]

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        bookid: this.$route.query.id,
        pageNum: 1,
        pageSize: 100,
        status: 0
      },
      bookname: '',
      navTree: [],
      publishers: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      ids: [],
      createTemp: {},
      exportTemp: {},
      fileTemp: {},
      createForm: {},
      textMap: {
        create: '批量创建防伪码',
        createOne: '添加防伪码',
        export: '导出防伪码',
        exportQR: '导出二维码',
        import: '导入防伪码'
      },
      filters: [],
      dialogStatus: '',
      uploading: false,
      dialogFormVisible: false,
      multipleSelection:[]
    }
  },
  created() {
    this.filters = filters
  },
  mounted() {
    this.getList()
    this.getGoodsInfo()
  },
  methods: {
    handleStartChange(){
      // console.log(this.exportTemp.num, this.exportTemp.toNum);
      this.exportTemp.toNum<=this.exportTemp.num ? this.exportTemp.toNum = this.exportTemp.num : this.exportTemp.toNum
    },
    invokeAPI(api, data){
      this.uploading = true
      api(data).then(res => {
        this.uploading = false
        requestMsg.apply(this,[res.data, this.textMap[this.dialogStatus] ])
        res.data.status ? this.dialogFormVisible = false : true
      })
    },
    formSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'create') {
            this.invokeAPI(addAPI, this.createTemp)
          } else if (this.dialogStatus === 'createOne') {
            this.createForm.sort = null
            this.invokeAPI(addOneAPI, this.createForm)
          } else if (this.dialogStatus === 'export') {
            window.open(`${process.env.BASE_API}${requestPath.book}/security/export?${queryString.stringify(this.exportTemp)}`)
            this.dialogFormVisible = false
          } else {
            this.uploading = true
            exportQRCodeAPI(this.exportTemp).then(res => {
              if (res.data.status) {
                this.dialogFormVisible = false
                window.open(`${process.env.BASE_API}${requestPath.file}download/zip?fileName=${res.data.data}`)
              } else {
                res.data.code === -2 ? this.$message.error(`${this.textMap[this.dialogStatus]}失败：${res.data.msg}`) : this.$message.error(`${this.textMap[this.dialogStatus]}失败`)
              }
              this.uploading = false
            })
          }
        }
      })
    },
    handleForm(type){
      if (type == 1) {
        this.createTemp = {
          num: null,
          bookid: this.$route.query.id
        }
        this.dialogStatus = 'create'
      } else if (type == 4){
        this.$refs.file ? this.$refs.file.value = null : true
        this.dialogStatus = 'import'
      } else if (type == 5){
        this.createForm = {
          seCode: null,
          bookid: this.$route.query.id
        }
        this.dialogStatus = 'createOne'
      } else {
        this.exportTemp = {
          num: 1,
          toNum: this.total,
          bookid: this.$route.query.id
        }
        type == 2 ? this.dialogStatus = 'export' : this.dialogStatus = 'exportQR'
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    fileSelect(){
      if (this.$refs.file.files[0]) {
        let file = this.$refs.file.files[0]
        // console.log(/(\.xls)$/.test(file.name))
        if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.$message.warning('导入文件只能是 xls或xlsx 格式！')
          this.$refs.file.value = null
        }
      }
    },
    ImportSubmit(){
      if (this.$refs.file.files[0]) {
        this.uploading = true
        // this.$message.warning('导入中')
        let formData = new FormData()
        formData.append('file', this.$refs.file.files[0])
        // this.invokeAPI(importAPI, formData)
        this.uploading = true
        importAPI(formData, this.listQuery.bookid).then(res => {
          if (res.data.status) {
            if (res.data.data.error.length>0) {
              this.$notify.error({
                title: res.data.data.msg,
                message: `未成功：${res.data.data.error.join('，')}`,
                duration: 0
              })
            } else {
              this.$message.success(res.data.data.msg)
            }
            this.getList()
            this.dialogFormVisible = false
          } else {
            res.data.code === -2 ? this.$message.error(`${this.textMap[this.dialogStatus]}失败：${res.data.msg}`) : this.$message.error(`${this.textMap[this.dialogStatus]}失败`)
          }
          this.uploading = false
        })
      } else {
        this.$message.warning('请选择文件后再执行导入！')
      }
    },
    batchCancel(){
      if(this.multipleSelection.length>0){
        this.massSetting('确定废置所选防伪码吗？', invalidAPI, this.ids, `废置${this.ids.length}项防伪码`)
      } else {
        this.$message.warning(`请先选择需要操作的条目`)
      }
    },
    massSetting(msg, api, data, msgName){
      confirm.apply(this,[msg]).then(() => {
        api(data).then(res => {
          operationMsg.apply(this,[res.data.code, msgName])
        })
      });
    },
    getList() {
      this.listLoading = true
      getCodeAPI(this.listQuery).then(res => {
        console.log(res)
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      })
    },
    getGoodsInfo(){
      getGoodsAPI(this.$route.query.id).then(res => {
        res.data.code === 0 ? this.bookname = res.data.data.book.name : this.$message.error('获取商品名称失败')
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.ids = getMultipleSelectionIDs(this.multipleSelection) : this.multipleSelection
    },
    resetFilter(){
      this.listQuery = {
        bookid: this.$route.query.id,
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        status: 0
      }
      this.getList()
    },
    handleFilter(){
      this.listQuery.pageNum = 1
      this.getList()
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
