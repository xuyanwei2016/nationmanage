<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="nav-buttons-container">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0"  @click="handleForm">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
      </div>
      <el-form inline class="form-inline">
        <el-form-item label="库区名称">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column label="库号" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库区名称" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库区地址" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮政编码" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.zipCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.personName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" @click="handleForm(scope.row)" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
          <router-link :to="{path:`warehouse/storage_location`,  query: {wareid: scope.row.id} }" v-if="authBtns.filter(i => i.idName=='operationsbtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='operationsbtn')[0].icon" :title="authBtns.filter(i => i.idName=='operationsbtn')[0].name"></i>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style='margin-right:10px;'>
        <el-form-item label="库区编号：" prop="code">
          <el-input v-model="temp.code" :disabled="dialogStatus === 'update'"></el-input>
        </el-form-item>
        <el-form-item label="库区名称：" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="库区地址：" prop="address">
          <el-input v-model="temp.address"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码：" prop="zipCode">
          <el-input v-model="temp.zipCode"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="personName">
          <el-input v-model="temp.personName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="传真：" prop="fax">
          <el-input v-model="temp.fax"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataSubmit" >确定</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getListAPI, updateAPI, addAPI } from '@/api/stock-management/warehouse'
import { operationMsg } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  data() {
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
      temp: {},
      rules: {
        name: [{ type: 'string', required: true, trigger: 'change', pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}$/, message: '请输入50字符以内汉字、数字和英文' }],
        code: [{ required: true, trigger: 'change', pattern: /^[a-zA-Z0-9]{1,50}$/, message: '请输入50字符以内数字和英文' }],
        address: [{ type: 'string', required: true, trigger: 'change', pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,500}$/, message: '请输入500字符以内汉字、数字和英文' }],
        zipCode: [{ trigger: 'change', pattern: /^[0-9]{1,50}$/, message: '请输入50字符以内数字' }],
        personName: [{ trigger: 'change', pattern: /^[a-zA-Z\u4e00-\u9fa5]{1,50}$/, message: '请输入50字符以内汉字和英文' }],
        phone: [{ trigger: 'change', pattern:/^(13\d|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18\d|19[89])\d{8}$/, message:'请输入正确的手机号码' }],
        fax: [{ type: 'string', pattern: /^[0-9]{1,50}$/, message: '请输入50字符以内数字' }]
      },
      textMap: {
        update: '修改库区',
        create: '添加库区'
      },
      dialogStatus: '',
      dialogFormVisible: false,
    }
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {    
    if( ifUndefined(store.getters.warehouseSerKeys.pageNum) ){
      this.listQuery = store.getters.warehouseSerKeys
      console.log(this.listQuery,'读取搜索条件成功')      
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        console.log(res)
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        code: '',
        name: '',
        address: '',
        zipCode: '',
        personName: '',
        phone: '',
        fax: ''
      };
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
    dataSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogStatus === 'create' ? this.invokeAPI(addAPI, this.temp) : this.invokeAPI(updateAPI, this.temp)
        }
      })
    },
    invokeAPI(api, data){
      api(data).then(res => {
        operationMsg.apply(this,[res.data.code, `${this.textMap[this.dialogStatus]}`])
        res.data.code===0 ? this.dialogFormVisible = false : true
      })
    },
    handleFilter(){
      store.dispatch('SetWarehouseSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize
      }
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
