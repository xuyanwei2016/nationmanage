<template>
  <el-container>
    <el-aside width="200px" class="tree-aside">
      <el-tree :data="navTree" ref="tree" :props="defaultProps" @node-click="handleNodeClick" node-key="id" show-checkbox check-on-click-node highlight-current :expand-on-click-node="false"></el-tree>
    </el-aside>

    <el-main>
      <div class="nav-buttons-container">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('uploadbtn') >= 0" @click="handleImport">{{authBtns.filter(i => i.idName=='uploadbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='uploadbtn').length>0 && authBtns.filter(i => i.idName=='uploadbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('uploadbtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('submitbtn') >= 0" @click="batchOperate('submit')">{{authBtns.filter(i => i.idName=='submitbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='submitbtn').length>0 && authBtns.filter(i => i.idName=='submitbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('submitbtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="batchOperate('delete')">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>

      </div>
      <el-form inline class="filter-form-inline">
        <el-form-item label="商品名称">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name"  clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('name')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="书代号">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.bookNo" clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('bookNo')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.isbn" clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('isbn')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="出版社">
          <el-select clearable v-model="listQuery.publisherid">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="publisher in publishers" :key="publisher.publisherid" :label="publisher.name" :value="publisher.publisherid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上下架状态">
          <el-select v-model="listQuery.bookstatus">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态">
          <el-radio-group v-model="listQuery.saleStatus">
            <el-radio :label="1">可售</el-radio>
            <el-radio :label="0">不可售</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="书刊类型">
          <el-radio-group v-model="listQuery.foreignJournalsStatus">
            <el-radio :label="1">外版书</el-radio>
            <el-radio :label="0">本版书</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预售状态">
          <el-radio-group v-model="listQuery.presaleStatus">
            <el-radio :label="1">预售</el-radio>
            <el-radio :label="0">不预售</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="listQuery.bookType">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="套餐" :value="2"></el-option>
            <el-option label="单书" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入时间">
          <el-date-picker v-model="daterange" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :key="tableKey" :data="list" @selection-change="handleSelectionChange" border highlight-current-row v-loading="listLoading" stripe element-loading-text="给我一点时间">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column label="商品名称" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="书代号" min-width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.bookNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="定价" min-width="55" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售价" min-width="55" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.salePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售状态" min-width="65" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.saleStatus===0" style="color:#CC6600;">不可售</span>
            <span v-else-if="scope.row.saleStatus===1" style="color:#008000;">可售</span>
          </template>
        </el-table-column>
        <el-table-column label="预售状态" min-width="65" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.presaleStatus===0" style="color:#CC6600;">不预售</span>
            <span v-else-if="scope.row.presaleStatus===1" style="color:#008000;">预售</span>
          </template>
        </el-table-column>
        <el-table-column label="书刊类型" min-width="70" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.foreignJournalsStatus===0">本版书</span>
            <span v-else-if="scope.row.foreignJournalsStatus===1" style="color:#008000;">外版书</span>
          </template>
        </el-table-column>
        <el-table-column label="上下架状态" min-width="75" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bookstatus===0" style="color:#CC6600;">下架</span>
            <span v-else-if="scope.row.bookstatus===1" style="color:#008000;">上架</span>
          </template>
        </el-table-column>
        <el-table-column class-name="small-padding fixed-width" label="操作" width="140" align="center">
          <template slot-scope="scope">
            <router-link v-if="authBtns.filter(i => i.idName=='editbtn').length > 0 && scope.row.booktype===0" :to="`import_goods/edit_import_data?booktype=0&id=${scope.row.id}`">
              <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
            </router-link><!--
             --><router-link v-else-if="authBtns.filter(i => i.idName=='editbtn').length > 0 && scope.row.booktype===2" :to="`import_goods/edit_import_data?booktype=1&id=${scope.row.id}`">
              <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
            </router-link><!--
             --><i v-if="authBtns.filter(i => i.idName=='downbtn').length > 0" :class="authBtns.filter(i => i.idName=='downbtn')[0].icon" :title="authBtns.filter(i => i.idName=='downbtn')[0].name" @click="singleSubmit(scope.row.id)" ></i><!--
             --><i v-if="authBtns.filter(i => i.idName=='removebtn').length > 0" :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)" ></i>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
        </el-pagination>
      </div>

      <el-dialog title="导入图书信息" :visible.sync="dialogFormVisible" width="40%">
        <el-form :model="fileTemp" ref="massForm" label-width="100px" style='margin-right:10px;'>
          <el-form-item label="导入内容：">
            <el-select v-model="fileTemp.dataType">
              <el-option label="批量导入图书元数据" :value="1"></el-option>
              <el-option label="批量导入图片集文件" :value="2"></el-option>
            </el-select>
            <a v-if="fileTemp.dataType===1" :href="`${baseUrl}/book/商品套餐导入模板.xls`" style="margin-left:10px; color:#409EFF; text-decoration: underline;" target="_blank" >下载元数据模板</a>
          </el-form-item>
          <el-form-item label="选择文件：" :rules="{required: true, message: '未上传', trigger: 'change'}">
            <input type="file" @change="fileSelect" ref="file" :accept="fileTemp.dataType===1 ? '.xls,.xlsx' : '.zip'">
            <!-- <input type="file" @change="fileSelect" v-else-if="fileTemp.dataType===2" ref="file" accept=".zip"> -->
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ImportSubmit" :loading="uploading">执行导入</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="`输入查询的${textTitle[titleStatus]}`" :visible.sync="showTextVisible">
        <el-input type="textarea" v-model="textarea" :autosize="{minRows: 6}" placeholder="请用回车enter键隔开"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="submitText">确定</el-button>
            <el-button @click="showTextVisible = false">取消</el-button>
          </span>
      </el-dialog>
    </el-main>

  </el-container>
</template>

<script>
import { getNavAPI, getPublisherAPI } from '@/api/book-infomation/package'
import { getListAPI, batchSubmitAPI, batchImportAPI, batchImportPicAPI, deleteAPI, uploadZipAPI } from '@/api/book-infomation/importGoods'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'

export default {
  data() {
    return {
      authBtns: [],
      textarea: '',
      showTextVisible: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        code: null,
        pageNum: 1,
        pageSize: 100,
        name: '',
        bookNo: '',
        isbn: '',
        publisherid: null,
        saleStatus: null,
        foreignJournalsStatus: null,
        presaleStatus: null,
        bookType: null,
        bookstatus: null
      },
      daterange: [],
      navTree: [],
      publishers: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      ids: [],
      textTitle: {
        name: '商品名称',
        bookNo: '书代号',
        isbn: 'ISBN'
      },
      titleStatus: '',
      fileTemp: {},
      uploading: false,
      dialogFormVisible: false,
      baseUrl: process.env.BASE_API,
      multipleSelection:[]
    }
  },
  mounted() {
    if( ifUndefined(store.getters.importGoodsSerKeys.pageNum) ){
      this.listQuery = store.getters.importGoodsSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.beginImportTime) || ifUndefined(this.listQuery.endImportTime)){
        this.daterange = []
        this.daterange[0] = this.listQuery.beginImportTime
        this.daterange[1] = this.listQuery.endImportTime
      }
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getNav()
    this.getList()
    this.getPublisher()
  },
  methods: {
    showTextarea(type){//显示文本域
      this.showTextVisible = true
      this.titleStatus = type
      this.textarea = this.listQuery[type]
    },
    submitText(){
      this.listQuery[this.titleStatus] = this.textarea
      this.showTextVisible = false
    },
    fileSelect(){
      if (this.$refs.file.files[0]) {
        let file = this.$refs.file.files[0]
        if (this.fileTemp.dataType===1) {
          if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.$message.warning('元数据只能上传 xls 或 xlsx 格式的excel！')
            this.$refs.file.value = null
          }
        } else {
          if (/(\.zip)$/.test(file.name)) {
            this.$message.warning('图片集文件只能是zip格式！')
            this.$refs.file.value = null
          }
        }
      }
    },
    ImportSubmit(){
      // console.log(this.$refs.file.files[0]);
      if (this.$refs.file.files[0]) {
        this.uploading = true
        this.$message.warning('导入中')
        let formData = new FormData()
        formData.append('file', this.$refs.file.files[0])
        if (this.fileTemp.dataType===2) {
          uploadZipAPI(formData).then(res => {
            this.fileTemp.cover = res.data.map(item => {
              return {url: item.uuid, name: item.fileName}
            })
            this.invokeUpload(batchImportPicAPI, this.fileTemp.cover)
          })
        } else {
          this.invokeUpload(batchImportAPI, formData)
        }
      } else {
        this.$message.warning('请选择文件后再执行导入！')
      }
    },
    invokeUpload(api, data){
      api(data).then(res => {
        this.uploading = false
        operationMsg.apply(this,[res.data.code, `导入`])
        res.data.status ? this.dialogFormVisible = false : true
      })
    },
    resetTemp(){
      this.fileTemp = {
        dataType: 1,
        cover: []
      }
      this.$refs.file ? this.$refs.file.value = null : true
    },
    handleImport(){
      this.dialogFormVisible = true
      this.resetTemp()
    },
    singleSubmit(id){
      this.massSetting('确定提交选择的条目吗？', batchSubmitAPI, [id], `提交`)
    },
    batchOperate(type){
      if(this.multipleSelection.length!=0){
        type === 'delete' ? this.massSetting('确定删除选择的条目吗？', deleteAPI, this.ids, `批量删除${this.multipleSelection.length}项`) : this.massSetting('确定提交选择的条目吗？', batchSubmitAPI, this.ids, `批量提交${this.multipleSelection.length}项`)
      } else {
        this.$message.warning('请先选择需要设置的条目')
      }
    },
    singleDelete(id){
      this.massSetting('确定删除选择的条目吗？', deleteAPI, [id], `删除`)
    },
    massSetting(msg, api, data, msgName){
      confirm.apply(this,[msg]).then(() => {
        api(data).then(res => {
          operationMsg.apply(this,[res.data.code, msgName])
        })
      });
    },
    handleNodeClick(data, node, tree){ //点击树节点获取table数据
      // console.log(data, node, tree)
      this.listQuery.code = data.code
      this.$refs.tree.setCheckedKeys([data.id])
      this.getList()
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
      })
    },
    getPublisher(){
      getPublisherAPI().then(res => {
        res.data.code === 0 ? this.publishers = res.data.data : this.$message.error('获取出版社数据失败')
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
      this.ids = getMultipleSelectionIDs(this.multipleSelection)
    },
    resetFilter(){
      this.listQuery = {
        code: this.listQuery.code,
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        name: '',
        bookNo: '',
        isbn: '',
        publisherid: null,
        saleStatus: null,
        foreignJournalsStatus: null,
        presaleStatus: null,
        bookType: null,
        bookstatus: null
      }
      this.daterange = null
      this.getList()
    },
    handleFilter(){
      store.dispatch('SetImportGoodsSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.code = this.$refs.tree.getCheckedNodes().map(node => node.code).join(' ')
      if (this.daterange) {
        this.listQuery.beginImportTime = this.daterange[0]
        this.listQuery.endImportTime = this.daterange[1]
      } else {
        this.listQuery.beginImportTime = null
        this.listQuery.endImportTime = null
      }
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
