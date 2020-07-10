<template>
  <div class="app-container inputCss">
    <div class="nav-buttons-container">
      <router-link to="board_content/content_detail" v-if="authBtns.filter(i => i.idName=='addbtn').length>0">
        <el-button>
          {{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns.filter(i => i.idName=='addbtn')[0].icon, 'el-icon--right']"></i>
        </el-button>
      </router-link>
      <el-button @click="handleBatch('delete')" v-if="authBtns.filter(i => i.idName=='batchdelete').length>0">
        {{authBtns.filter(i => i.idName=='batchdelete')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchdelete').length>0 && authBtns.filter(i => i.idName=='batchdelete')[0].icon" :class="[authBtns.filter(i => i.idName=='batchdelete')[0].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button @click="handleBatch('top',1)" v-if="authBtns.filter(i => i.idName=='topbtn').length>0">
        {{authBtns.filter(i => i.idName=='topbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='topbtn').length>0 && authBtns.filter(i => i.idName=='topbtn')[0].icon" :class="[authBtns.filter(i => i.idName=='topbtn')[0].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button @click="handleBatch('top',0)" v-if="authBtns.filter(i => i.idName=='canceltop').length>0">
        {{authBtns.filter(i => i.idName=='canceltop')[0].name}}<i v-if="authBtns.filter(i => i.idName=='canceltop').length>0 && authBtns.filter(i => i.idName=='canceltop')[0].icon" :class="[authBtns.filter(i => i.idName=='canceltop')[0].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button @click="Upperandlower(1)" v-if="authBtns.filter(i => i.idName=='batchup').length>0">
        {{authBtns.filter(i => i.idName=='batchup')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchup').length>0 && authBtns.filter(i => i.idName=='batchup')[0].icon" :class="[authBtns.filter(i => i.idName=='batchup')[0].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button @click="Upperandlower(0)" v-if="authBtns.filter(i => i.idName=='batchdown').length>0">
        {{authBtns.filter(i => i.idName=='batchdown')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchdown').length>0 && authBtns.filter(i => i.idName=='batchdown')[0].icon" :class="[authBtns.filter(i => i.idName=='batchdown')[0].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-form inline>
      <el-form-item label="公告标题">
        <el-input v-model="listQuery.title"></el-input>
      </el-form-item>
      <el-form-item label="所属栏目">
        <el-select placeholder="所属栏目" v-model="listQuery.columnId">
          <el-option label="全部" :value="null"></el-option>
          <el-option v-for="item in boardItem" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker v-model="dateQuery" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="公告标题" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
          <span v-if="scope.row.topStatus === '1'" style="color: red;">[置顶]</span>
        </template>
      </el-table-column>
      <el-table-column label="所属栏目" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.releaseTime.substring(0,scope.row.releaseTime.length - 2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">上架</span>
          <span v-if="scope.row.status === 0">下架</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.source}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.releaser}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:`board_content/content_detail`,query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='viewbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='viewbtn').length > 0" @click="handleForm(scope.row, 1)" :title="authBtns.filter(i => i.idName=='viewbtn')[0].name"></i>
          <i :class="authBtns.filter(i => i.idName=='deletebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='deletebtn').length > 0" @click="deleteItem([scope.row.id])" :title="authBtns.filter(i => i.idName=='deletebtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' width="1000px">
      <el-form :model="form" ref="dataForm" disabled :rules="rules" label-position="right" label-width="120px" style='margin-right:30px;'>
        <el-form-item label="公告标题："  prop="title">
          <el-col :span="12">
            <el-input v-model="form.title" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="所属栏目：" prop="columnId">
          <el-col :span="12">
            <el-select placeholder="所属栏目" v-model="form.columnId" style="width:100%;">
              <el-option v-for="item in boardItem" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="置顶：" prop="topStatus">
          <el-radio-group v-model="form.topStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="发布时间：" prop="releaserTime">
          <el-col :span="12">
            <!-- <el-date-picker v-model="form.releaserTime" type="date" placeholder="年/月/日" format="yyyy/MM/dd" value-format="yyyy-MM-dd" style="width:100%;"></el-date-picker> -->
            <el-date-picker v-model="form.releaseTime" type="date" placeholder="选择日期" format="yyyy/MM/dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="来源：" prop="source">
          <el-col :span="12">
            <el-input v-model="form.source" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="发布人：" prop="releaser">
          <el-col :span="12">
            <el-input v-model="form.releaser" ></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="链接地址：" prop="linkType">
          <el-radio-group v-model="form.linkType">
            <el-radio label="0">默认</el-radio>
            <el-radio label="2">外部链接</el-radio>
            <el-radio label="1">内部链接</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item prop="linkUrl" v-if="form.linkType!=0">
          <el-col :span="12">
            <el-input v-model="form.linkUrl" clearable></el-input>
          </el-col>
          <el-col :span="12" style="padding-left: 15px;">默认http://，如需https://开头请手动输入。注：如有链接，则前台默认获取链接地址，不获取公告内容！</el-col>
        </el-form-item>
        <el-form-item label="公告内容：" prop="content">
          <tinymce :height=300 ref="editor" v-model="form.content" style="width:800px"></tinymce>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogStatus!=='view'">
        <el-button @click="submitForm" >确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addAPI, editAPI, getContent, batchingDeleteAPI, updateTopAPI, getList, searchAPI, getContentList, getAllList,updatestatusAPI } from '@/api/website-management/board'
import Tinymce from '@/components/Tinymce'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  components:{ Tinymce },
  data() {
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        title: null,
        columnId: null
      },
      boardItem: [],
      dateQuery: null,
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'change' }, { max: 50, message: '最多50个字符', trigger: 'change' }],
        columnId: [{ required: true, message: '请选择所属栏目', trigger: 'change' }],
        releaserTime: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        source: [{ max: 50, message: '最多50个字符', trigger: 'change' }],
        releaser: [{ max: 30, message: '最多30个字符', trigger: 'change' }],
        content: [{ required: true, message: '请填写公告内容', trigger: 'change' }]
      },
      batchData: {
        ids: [],
        topStatus: 0
      },
      form: {},
      textMap: {
        update: '修改公告',
        create: '添加公告',
        view: '查看公告'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      multipleSelection: []
    }
  },
  mounted() {
    if( ifUndefined(store.getters.boardContentSerkeys.pageNum) ){
      this.listQuery = store.getters.boardContentSerkeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.biginReleaserTime) || ifUndefined(this.listQuery.endReleaserTime)){
        this.dateQuery = []
        this.dateQuery[0] = this.listQuery.biginReleaserTime
        this.dateQuery[1] = this.listQuery.endReleaserTime
      }
    }
    this.getList()
    this.getBoardList()
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  methods: {
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.form.id ? this.invokeApi(editAPI) : this.invokeApi(addAPI)
        }
      })
    },
    invokeApi(api){
      api(this.form).then(res => {
        operationMsg.apply(this, [res.data.code, this.textMap[this.dialogStatus] ])
        res.data.code === 0 ? this.dialogFormVisible = false : this.dialogFormVisible = true
      })
    },
    handleForm(row, status){
      if (row.id) {
        getContent(row.id).then(res => {
          res.data.code === 0 ? this.form = res.data.data : this.$message.error(`获取内容详情失败：${res.data.msg}`)
          this.form.content = res.data.data.content
        })
        status ? this.dialogStatus = 'view' : this.dialogStatus = 'update'
      } else {
        this.resetForm()
        this.dialogStatus = 'create'
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm(){
      this.form = {
        columnId : null,
        content: '',
        releaser: '',
        releaserTime: new Date(),
        source: '',
        title: '',
        topStatus: 0
      }
    },
    setTopStatus(status){
      this.batchData.topStatus = status
      updateTopAPI(this.batchData).then(res => {
        status === 1 ? operationMsg.apply(this,[res.data.code,`置顶${this.batchData.ids.length}项`]) : operationMsg.apply(this,[res.data.code,`取消置顶${this.batchData.ids.length}项`])
      })
    },
    deleteItem(idArr){
      confirm.apply(this,['确定删除选择的条目吗?']).then(() => {
        batchingDeleteAPI(idArr).then(res => {
          operationMsg.apply(this,[res.data.code,`删除`])
        })
      })
    },
    handleBatch(type, status){
      if (this.multipleSelection.length > 0) {
        type === 'top' ? this.setTopStatus(status) : this.deleteItem(this.batchData.ids)
      } else {
        this.$message.warning('请先选择需要操作的条目')
      }
    },
    Upperandlower(status){//批量修改该上下架
      if (this.multipleSelection.length > 0) {
        updatestatusAPI({ ids: this.batchData.ids, status}).then(res=>{
          if(res.data.code === 0){
            this.$message.success('操作成功')
            this.getList()
          }else{
            this.$message.error("操作失败")
          }
        })
      } else {
        this.$message.warning('请先选择需要操作的条目')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      Array.isArray(this.multipleSelection) && this.multipleSelection.length>0 ? this.batchData.ids = this.multipleSelection.map(item => item.id) : this.batchData.ids = []
    },
    resetFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        title: null,
        columnId: null
      }
      this.dateQuery = null
      this.getList()
    },
    handleFilter() {
      if (this.dateQuery) {
        this.listQuery.biginReleaserTime = this.dateQuery[0]
        this.listQuery.endReleaserTime = this.dateQuery[1]
      } else {
        this.listQuery.biginReleaserTime = null
        this.listQuery.endReleaserTime = null
      }
      store.dispatch('SetBoardContentSerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      getContentList(this.listQuery).then(res => {
        if (res.data.code === 0) {
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(`获取数据失败：${res.data.msg}`);
        }
        this.listLoading = false
      })
    },
    getBoardList(){
      getAllList().then(res => {
        res.data.code === 0 ? this.boardItem = res.data.data : this.$message.error(`获取全部栏目失败：${res.data.msg}`)
      })
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleTable.toggleRowSelection(val)
    }
  }
}
</script>
<style scoped>

</style>
