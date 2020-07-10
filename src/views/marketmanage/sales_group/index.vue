<template>
  <div class="app-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleForm">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('closebtn') >= 0" @click="massDisable">{{authBtns.filter(i => i.idName=='closebtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='closebtn').length>0 && authBtns.filter(i => i.idName=='closebtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('closebtn')].icon, 'el-icon--right']"></i></el-button>
    </div>
    <el-form inline>
      <el-form-item label="促销标题">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key="tableKey" :data="list" @selection-change="handleSelectionChange" border highlight-current-row v-loading="listLoading" stripe element-loading-text="给我一点时间">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="促销标题" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.explains}}</span>
        </template>
      </el-table-column>
      <el-table-column label="促销类型" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{saleType[scope.row.type]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="65" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status===0" style="color:#CC6600;">禁用</span>
          <span v-else-if="scope.row.status===1" style="color:#008000;">启用</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="handleForm(scope.row)"></i>
          <router-link :to="{path:`sales_group/sales_management`,query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='setbtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='setbtn')[0].icon" :title="authBtns.filter(i => i.idName=='setbtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='checkbtn')[0].icon" v-if="scope.row.status===0 && authBtns.filter(i => i.idName=='checkbtn').length > 0" :title="authBtns.filter(i => i.idName=='checkbtn')[0].name" @click="updateStatus(scope.row)"></i>
          <i :class="authBtns.filter(i => i.idName=='closebtn2')[0].icon" v-else-if="scope.row.status===1 && authBtns.filter(i => i.idName=='closebtn2').length > 0" :title="authBtns.filter(i => i.idName=='closebtn2')[0].name"  @click="updateStatus(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="right" label-width="120px" style="margin-right:10px;">
        <el-form-item label="促销类型：" prop="type">
          <el-select v-model="temp.type" style="width:100%;">
            <el-option v-for="(type,key) in saleType" :key="key" :label="type" :value="Number(key)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="促销组名：" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="促销结束时间：" prop="endTime">
          <el-date-picker v-model="temp.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="促销说明：" prop="explains">
          <el-input v-model="temp.explains"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
import { getListAPI, addAPI, updateAPI, getTypeAPI, checkNameAPI, updateStatusAPI } from '@/api/marketing-management/salesGroup'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if( value.replace(/\s+/g,"") == '' ){
        callback(new Error('未填写'));
      } else {
        let params = {name: value}
        this.dialogStatus === 'update' ? params.oid = this.temp.id : params
        checkNameAPI(params).then(res => {
          res.data.code === 0 ? res.data.data === false ? callback() : callback(new Error(`促销组"${value}"已存在！`)) : callback(new Error(`错误Error：${res.data.msg}`))
        })
      }
    };
    const validateExp = (rule, value, callback) => {
      value.replace(/\s+/g,"") == '' ? callback(new Error('未填写')) : callback()
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
      statusData: {
        oids:[],
        statusCode: 0
      },
      ids: [],
      saleType: {},
      temp: {},
      textMap: {
        create: '添加促销组',
        update: '修改促销组'
      },
      rules: {
        name: [{ type: 'string', required: true, trigger: 'change', validator: validateName }],
        explains: [{ type: 'string', required: true, trigger: 'change', validator: validateExp }],
        status: [{ type: 'number', required: true, trigger: 'change', message: '未选择' }]
      },
      dialogStatus: '',
      loading: false,
      dialogFormVisible: false,
      multipleSelection:[]
    }
  },
  created() {
    this.getType()
  },
  mounted() {
    if( ifUndefined(store.getters.salesGroupSerKeys.pageNum) ){
      this.listQuery = store.getters.salesGroupSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList()
  },
  methods: {
    massDisable(){
      if(this.multipleSelection.length>0){
        let len = this.multipleSelection.length
        this.statusData.statusCode = 0
        this.massSetting(`确定禁用这${len}个促销组吗？`, updateStatusAPI, this.statusData, `禁用${len}项促销组`)
      } else {
        this.$message.warning(`请先选择需要操作的条目`)
      }
    },
    updateStatus(row){
      this.statusData = { oids: [row.id] }
      if (row.status === 1) {
        this.statusData.statusCode = 0
        this.massSetting('确定禁用此促销组吗？', updateStatusAPI, this.statusData, `禁用`)
      } else {
        this.statusData.statusCode = 1
        this.massSetting('确定启用此促销组吗？', updateStatusAPI, this.statusData, `启用`)
      }
    },
    invokeAPI(api, data){
      api(data).then(res => {
        operationMsg.apply(this,[res.data.code, `${this.textMap[this.dialogStatus]}`])
        res.data.code === 0 ? this.dialogFormVisible = false : true
        this.loading = false
      })
    },
    formSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // console.log(this.temp);
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
        type: 0,
        name: '',
        explains: '',
        status: 1,
        endTime: ''
      };
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
      this.multipleSelection.length>0 ? this.statusData.oids = getMultipleSelectionIDs(this.multipleSelection) : this.multipleSelection
    },
    resetFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize
      }
      this.getList()
    },
    handleFilter() {
      store.dispatch('SetSalesGroupSerKeys',this.listQuery).then(res => {
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
    },
    getType() {
      getTypeAPI().then(res => {
        res.data.code === 0 ? this.saleType = res.data.data : this.$message.error('获取促销类型失败')
      })
    }
  }
}
</script>
