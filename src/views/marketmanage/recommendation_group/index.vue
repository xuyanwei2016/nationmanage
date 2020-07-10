<template>
  <div class="app-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleForm">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>
    <el-form inline class="filter-form-inline">
      <el-form-item label="推荐组名称">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.recommendName" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key="tableKey" :data="list" @selection-change="handleSelectionChange" border highlight-current-row v-loading="listLoading" stripe element-loading-text="给我一点时间">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="推荐组名称" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.recommendName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.introduction}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品数量" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="handleForm(scope.row)"></i>
          <router-link :to="{path:`recommendation_group/recommendation_group_management`,query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='setbtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='setbtn')[0].icon" :title="authBtns.filter(i => i.idName=='setbtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="right" label-width="120px" style="margin-right:10px;">
        <el-form-item label="推荐组名：" prop="recommendName">
          <el-input v-model="temp.recommendName" placeholder="最多20字符"></el-input>
        </el-form-item>
        <el-form-item label="推荐说明：" prop="introduction">
          <el-input v-model="temp.introduction" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="最多50字符"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formSubmit" :loading="loading">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getListAPI, addAPI, updateAPI, deleteAPI, checkNameAPI } from '@/api/marketing-management/recommendGroup'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if( value.replace(/\s+/g,"") == '' ){
        callback(new Error('未填写'));
      } else if (value.length>20){
        callback(new Error(`推荐组名称最多20字！现${value.length}字！`))
      } else {
        let params = {name: value}
        this.dialogStatus === 'update' ? params.oid = this.temp.id : params
        checkNameAPI(params).then(res => {
          res.data.code === 0 ? res.data.data === false ? callback() : callback(new Error(`推荐组"${value}"已存在！`)) : callback(new Error(`错误Error：${res.data.msg}`))
        })
      }
    };
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100
      },
      ids: [],
      temp: {},
      textMap: {
        create: '添加推荐组',
        update: '修改推荐组'
      },
      rules: {
        recommendName: [{ type: 'string', required: true, trigger: 'change', validator: validateName }],
        introduction: [{ type: 'string', trigger: 'change', max: 50, message: '最多50 个字符' }]
      },
      dialogStatus: '',
      loading: false,
      dialogFormVisible: false,
      multipleSelection:[]
    }
  },
  mounted() {
    if( ifUndefined(store.getters.recGroupSerKeys.pageNum) ){
      this.listQuery = store.getters.recGroupSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList()
  },
  methods: {
    invokeAPI(api, data){
      api(data).then(res => {
        operationMsg.apply(this,[res.data.code,  this.textMap[this.dialogStatus] ])
        res.data.code === 0 ? this.dialogFormVisible = false : true
        this.loading = false
      })
    },
    formSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp);
          this.loading = true
          this.dialogStatus === 'create' ? this.invokeAPI(addAPI, this.temp) : this.invokeAPI(updateAPI, this.temp)
        }
      })
    },
    handleForm(row){
      if (row.id) {
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
        recommendName: '',
        introduction: ''
      }
    },
    singleDelete(id){
      this.massSetting(`确定删除这个推荐组吗？`, deleteAPI, [id], `删除`)
    },
    massDelete(){
      if(this.ids.length>0){
        let len = this.ids.length
        this.massSetting(`确定删除这${len}个推荐组吗？`, deleteAPI, this.ids, `删除${len}项`)
      } else {
        this.$message.warning(`请先选择需要操作的条目`)
      }
    },
    massSetting(msg, api, data, msgName){
      confirm.apply(this,[msg]).then(() => {
        api(data).then(res => {
          operationMsg.apply(this,[res.data.code, msgName])
        })
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
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.ids = getMultipleSelectionIDs(this.multipleSelection) : this.multipleSelection
    },
    resetFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize
      }
      this.getList()
    },
    handleFilter() {
      store.dispatch('SetRecGroupSerKeys',this.listQuery).then(res => {
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
