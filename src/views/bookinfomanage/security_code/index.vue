<template>
  <el-container>
    <el-aside width="200px" class="tree-aside">
      <el-tree :data="navTree" ref="tree" :props="defaultProps" @node-click="handleNodeClick" node-key="id" default-expand-all highlight-current :expand-on-click-node="false"></el-tree>
    </el-aside>

    <el-main>
      <div class="nav-buttons-container">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('uploadbtn') >= 0" @click="importCode">{{authBtns.filter(i => i.idName=='uploadbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='uploadbtn').length>0 && authBtns.filter(i => i.idName=='uploadbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('uploadbtn')].icon, 'el-icon--right']"></i></el-button>
        <!-- 批量绑定防伪码 -->
        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchBindingbtn') >= 0" @click="bindISBN">{{authBtns.filter(i => i.idName=='batchBindingbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchBindingbtn').length>0 && authBtns.filter(i => i.idName=='batchBindingbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchBindingbtn')].icon, 'el-icon--right']"></i></el-button>
      </div>
      <el-form inline class="filter-form-inline">
        <el-form-item label="图书名称">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.author" clearable></el-input>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.isbn" clearable></el-input>
        </el-form-item>
        <el-form-item label="明码">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.sort" clearable></el-input>
        </el-form-item>
        <el-form-item label="暗码">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.seCode" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :key="tableKey" :data="list" @selection-change="handleSelectionChange" border highlight-current-row v-loading="listLoading" stripe element-loading-text="给我一点时间" empty-text="">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column label="图书封面" class-name="img-column" min-width="80" align="center">
          <template slot-scope="scope">
            <img :src="`${domain}${requestPath.file}?fileName=${scope.row.url}&isOnLine=true`" :alt="`${scope.row.name}`">
          </template>
        </el-table-column>
        <el-table-column label="图书名称" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="ISBN" min-width="125" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isbn}}</span>
          </template>
        </el-table-column>
        <el-table-column label="出版时间" width="95" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.publishTime">{{scope.row.publishTime.slice(0,10)}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="small-padding fixed-width" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <router-link :to="{path:`security_code/code_management?id=${scope.row.id}`}" v-if="authBtns.filter(i => i.idName=='setbtn').length > 0">
              <i :class="authBtns.filter(i => i.idName=='setbtn')[0].icon" :title="authBtns.filter(i => i.idName=='setbtn')[0].name"></i>
            </router-link>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
        </el-pagination>
      </div>

      <el-dialog title="导入防伪码" :visible.sync="dialogFormVisible" width="40%">
        <el-form ref="dataForm" label-width="130px">
          <el-form-item label="选择excel文件：" :rules="{required: true, message: '未上传', trigger: 'change'}">
            <input type="file" @change="fileSelect" ref="file" accept=".xls">
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ImportSubmit" :loading="uploading">导入</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="批量绑定防伪码" :visible.sync="dialogbindVisible">
        <el-form label-width="130px">
          <el-form-item label="关联商品ISBN">
            <el-input type="text" v-model="bindISBNdata.isbn" @blur="chaISBN"></el-input>
          </el-form-item>
          <el-form-item label="关联商品名称">
            <el-input type="text" v-model="oneDataname" disabled></el-input>
          </el-form-item>
          <el-form-item label="明码起始">
            <input class="inputstyle" type="text" v-model="bindISBNdata.minSort">—
            <input class="inputstyle" type="text" v-model="bindISBNdata.maxSort">
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="IsbnSubmit" :loading="uploading">确定</el-button>
          <el-button @click="Isbnnone">取消</el-button>
        </span>
      </el-dialog>

    </el-main>
  </el-container>
</template>
<style>
.inputstyle{
  width: 160px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  padding-left:10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>

<script>
import { requestPath } from '@/utils/global.js'
import { getNavAPI } from '@/api/book-infomation/package'
import { getListAPI, batchImportAPI,addIsbnAPI,getIsbnListAPI } from '@/api/book-infomation/securityCode'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'

export default {
  data() {
    return {
      authBtns: [],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      bindISBNdata:{
        isbn: "",
        maxSort: 0,
        minSort: 0
      },
      listQuery: {
        code: null,
        pageNum: 1,
        pageSize: 100
      },
      oneDataname:null,
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      ids: [],
      dialogFormVisible: false,
      dialogbindVisible: false,
      uploading: false,
      multipleSelection:[]
    }
  },
  mounted() {
    if( ifUndefined(store.getters.securityCodeSerKeys.pageNum) ){
      this.listQuery = store.getters.securityCodeSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getNav()
    this.getList()
  },
  methods: {
    invokeAPI(api, data) {
      this.uploading = true
      api(data).then(res => {
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
          res.data.code === -2 ? this.$message.error(`导入失败：${res.data.msg}`) : this.$message.error(`导入失败`)
        }
        this.uploading = false
        // operationMsg.apply(this,[res.data.code, '导入防伪码' ])
        // res.data.code === 0 ? this.dialogFormVisible = false : true
      })
    },
    chaISBN(){
      getIsbnListAPI({isbn:this.bindISBNdata.isbn}).then(res=>{
          if(res.data.code === 0){
            this.oneDataname = res.data.data
          }else{
            this.oneDataname = ''
            this.$message.warning("此isbn号码没有关联商品，请检查输入的内容！")
          }
      })
    },
    IsbnSubmit(){
      addIsbnAPI(this.bindISBNdata).then(res=>{
        if(res.data.code === 0){
          this.$message.success('批量绑定成功')
          this.Isbnnone();
        } else {
          this.$message.error('批量绑定失败')
        }
      })
      this.dialogbindVisible =false;
      this.getList();
    },
    Isbnnone(){
      this.bindISBNdata={
        isbn: "",
        maxSort: 0,
        minSort: 0
      }
      this.oneDataname = ''
      this.dialogbindVisible = false
    },
    ImportSubmit() {
      if (this.$refs.file.files[0]) {
        // this.$message.warning('导入中')
        let formData = new FormData()
        formData.append('file', this.$refs.file.files[0])
        this.invokeAPI(batchImportAPI, formData)
      } else {
        this.$message.warning('请选择文件后再执行导入！')
      }
    },
    fileSelect() {
      if (this.$refs.file.files[0]) {
        let file = this.$refs.file.files[0]
        if (file.type !== 'application/vnd.ms-excel') {
          this.$message.warning('导入文件只能是 xls 格式！')
          this.$refs.file.value = null
        }
      }
    },
    importCode() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    bindISBN(){
      this.dialogbindVisible = true
    },
    handleNodeClick(data, node, tree) { //点击树节点获取table数据
      this.listQuery.code = data.code
      this.getList()
    },
    getNav() {
      getNavAPI().then(res => {
        res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
      })
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    resetFilter() {
      let { pageSize, code } = this.listQuery
      this.listQuery = { pageNum: 1, pageSize, code }
      this.getList()
    },
    handleFilter() {
      store.dispatch('SetSecurityCodeSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
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
