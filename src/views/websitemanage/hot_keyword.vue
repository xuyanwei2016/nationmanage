<template>
  <div class="app-container">
    <div class="nav-buttons-container">
      <el-button @click="handleForm" v-if="authBtns.filter(i => i.idName=='addbtn').length>0">
        {{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns.filter(i => i.idName=='addbtn')[0].icon, 'el-icon--right']"></i>
      </el-button>
      <!--<el-button @click="handleBatching('audit')" v-if="authBtns.filter(i => i.idName=='batchaudit').length>0">
        {{authBtns.filter(i => i.idName=='batchaudit')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchaudit').length>0 && authBtns.filter(i => i.idName=='batchaudit')[0].icon" :class="[authBtns.filter(i => i.idName=='batchaudit')[0].icon, 'el-icon&#45;&#45;right']"></i>
      </el-button>-->
      <el-button @click="handleBatching('status',1)" v-if="authBtns.filter(i => i.idName=='batchup').length>0">
        {{authBtns.filter(i => i.idName=='batchup')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchup').length>0 && authBtns.filter(i => i.idName=='batchup')[0].icon" :class="[authBtns.filter(i => i.idName=='batchup')[0].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button @click="handleBatching('status',0)" v-if="authBtns.filter(i => i.idName=='batchdown').length>0">
        {{authBtns.filter(i => i.idName=='batchdown')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchdown').length>0 && authBtns.filter(i => i.idName=='batchdown')[0].icon" :class="[authBtns.filter(i => i.idName=='batchdown')[0].icon, 'el-icon--right']"></i>
      </el-button>
      <el-button @click="handleBatching('delete')" v-if="authBtns.filter(i => i.idName=='batchdelete').length>0">
        {{authBtns.filter(i => i.idName=='batchdelete')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchdelete').length>0 && authBtns.filter(i => i.idName=='batchdelete')[0].icon" :class="[authBtns.filter(i => i.idName=='batchdelete')[0].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-form inline>
      <el-form-item label="搜索词">
        <el-input placeholder="搜索词" v-model="listQuery.hotSearchWord" clearable></el-input>
      </el-form-item>
      <el-form-item label="审核">
        <el-select placeholder="审核"  v-model="listQuery.auditStatus">
          <el-option v-for="audit in status.audit" :key="audit.value" :label="audit.label" :value="audit.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上线状态">
        <el-select placeholder="上线状态" v-model="listQuery.showState">
          <el-option v-for="listing in status.listing" :key="listing.value" :label="listing.label" :value="listing.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column label="搜索词" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.hotSearchWord}}</span>
        </template>
      </el-table-column>
      <el-table-column label="搜索次数" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.searchCount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序号" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="审核状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.auditStatus ? '已审核' : '未审核'}}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="上线状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.showState ? '已上线' : '已下线'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="120" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" @click="handleForm(scope.row)" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i><!--
          --><i :class="authBtns.filter(i => i.idName=='deletebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='deletebtn').length > 0" @click="deleteItem([scope.row.hswId])" :title="authBtns.filter(i => i.idName=='deletebtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="dataForm" label-position="right" label-width="110px" style="margin-right:30px;">
        <el-form-item label="搜索词：" prop="hotSearchWord">
          <el-input v-model="form.hotSearchWord" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序号：" prop="sort">
          <el-col :span="11">
            <el-input v-model="form.sort" clearable></el-input>
          </el-col>
          <el-col :span="13" v-if="maxSort>-1" style="color:gray; padding-left:15px;">当前最大排序号为{{maxSort}}</el-col>
        </el-form-item>
        <el-form-item label="上下线状态：" prop="showState">
          <el-radio-group v-model="form.showState">
            <el-radio :label="1">上线</el-radio>
            <el-radio :label="0">下线</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" :loading="loading">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addKeyword, editKeywordAPI, getKeywords, batchingAuditAPI, batchingDeleteAPI, batchingListing, searchAPI, isExistAPI } from '@/api/website-management/hot_search'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  data() {
    const validateWord = (rule, value, callback) => {
      if (value.replace(/\s+/g,"") == ''){
        callback(new Error('未填写'));
      } else if (value.length > 8) {
        callback(new Error(`最多8个字！现${value.length}字！`))
      } else {
        let params = { hotSearchWord: value }
        this.dialogStatus === 'update' ? params.hswId = this.form.hswId : params
        isExistAPI(params).then(res => {
          res.data.code === 0 ? res.data.data === false ? callback() : callback(new Error(`热搜词${value}已存在！`)) : callback(new Error(`错误Error：${res.data.msg}`))
        })
      }
    };
    return {
      authBtns: [],
      multipleSelection: [],
      dialogFormVisible: false,
      rules: {
        hotSearchWord: [{ required: true, validator: validateWord, trigger: 'blur' }],
        sort: [{ required: true, pattern: /^([1-9]\d*|0)$/, message: '须为0或正整数', trigger: 'blur' }],
        showState: [{ required: true, message: '状态必选', trigger: 'blur' }]
      },
      form: {},
      status: {
        audit: [
          {value:null,label:'全部'},
          {value:0,label:'未审核'},
          {value:1,label:'已审核'}
        ],
        listing: [
          {value:null,label:'全部'},
          {value:0,label:'已下线'},
          {value:1,label:'已上线'}
        ],
      },
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        hotSearchWord: null,
        auditStatus: null,
        showState: null
      },
      batchData: {
        ids: [],
        showState: 0
      },
      maxSort: -1,
      textMap: {
        update: '修改热搜词',
        create: '添加热搜词'
      },
      dialogStatus: '',
      loading: false
    }
  },
  mounted() {
    if( ifUndefined(store.getters.hot_keywordSerKeys.pageNum) ){
      this.listQuery = store.getters.hot_keywordSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.getList()
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  methods: {
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.form.hswId ? this.invokeApi(editKeywordAPI) : this.invokeApi(addKeyword)
        }
      })
    },
    invokeApi(api){
      api(this.form).then(res => {
        operationMsg.apply(this, [ res.data.code, this.textMap[this.dialogStatus] ])
        res.data.code === 0 ? this.dialogFormVisible = false : true
        this.loading = false
      })
    },
    handleForm(row){
      this.list.length>0 ? this.maxSort = this.list.reduce((maxNum, item) => Math.max(maxNum, item.sort), 0) : this.maxSort = -1
      if (row.hswId) {
        this.form = Object.assign({}, row)
        this.dialogStatus = 'update'
      } else {
        this.resetForm()
        this.dialogStatus = 'create'
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm() {
      this.form = {
        hotSearchWord: '',
        sort: parseInt(this.maxSort)+1,
        auditStatus: 1,
        showState: 0
      }
    },
    batchAudit(){
      confirm.apply(this,['确定审核通过已选内容吗?']).then(() => {
        batchingAuditAPI(this.batchData.ids).then(res => {
          operationMsg.apply(this,[res.data.code,`批量审核${this.batchData.ids.length}项`])
        })
      })
    },
    deleteItem(idArr){
      confirm.apply(this,['确定删除已选内容吗?']).then(() => {
        batchingDeleteAPI(idArr).then(res => {
          operationMsg.apply(this,[res.data.code,`删除${idArr.length}项`])
        })
      })
    },
    setStatus(status){
      this.batchData.showState = status
      if (status === 1) {
        let allAudited = this.multipleSelection.every(item => item.auditStatus === 1)
        if (allAudited) {
          confirm.apply(this,['确定上线已选内容吗？']).then(() => {
            batchingListing(this.batchData).then(res => {
              operationMsg.apply(this,[res.data.code,`上线${this.batchData.ids.length}项`])
            })
          })
        } else {
          this.$message.warning('只能操作已审核的条目')
        }
      } else {
        confirm.apply(this,['确定下线已选内容吗？']).then(() => {
          batchingListing(this.batchData).then(res => {
            operationMsg.apply(this,[res.data.code,`下线${this.batchData.ids.length}项`])
          })
        })
      }
    },
    handleBatching(type, status){
      if (Array.isArray(this.multipleSelection) && this.multipleSelection.length > 0) {
        this.batchData.ids = this.multipleSelection.map(item => item.hswId)
        type === 'audit' ? this.batchAudit() : type === 'delete' ? this.deleteItem(this.batchData.ids) : this.setStatus(status)
      } else {
        this.$message.warning('请先选择需要操作的条目')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    resetFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        hotSearchWord: null,
        auditStatus: null,
        showState: null
      }
      this.getList()
    },
    handleFilter() {
      store.dispatch('SetHotKeywordSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      getKeywords(this.listQuery).then(res => {
        if (res.data.code === 0) {
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(`获取数据失败：${res.data.msg}`)
        }
        this.listLoading = false
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
