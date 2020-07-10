<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0"  @click="handleForm">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
    </div>
    <el-form inline class="form-inline">
      <el-form-item label="供应商编号">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.code" clearable></el-input>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column label="供应商编号" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
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
      <el-table-column label="操作时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.updaterName}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="80" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='edit')[0].icon" v-if="authBtns.filter(i => i.idName=='edit').length > 0" @click="handleForm(scope.row)" :title="authBtns.filter(i => i.idName=='edit')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style='margin-right:10px;'>
        <el-form-item label="供应商编号：" prop="code">
          <el-input v-model="temp.code" :disabled="dialogStatus === 'update'" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="供应商类型：" prop="type">
          <el-select v-model="temp.type">
            <el-option label="出版社" value="1"></el-option>
            <el-option label="批发商" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商名称：" prop="name">
          <el-input v-model="temp.name" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="供应商地址：" prop="address">
          <el-input v-model="temp.address" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码：" prop="zipCode">
          <el-input v-model="temp.zipCode" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="personName">
          <el-input v-model="temp.personName" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="传真：" prop="fax">
          <el-input v-model="temp.fax" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="开户行：" prop="bankName">
          <el-input v-model="temp.bankName" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="银行账号：" prop="bankCard">
          <el-input v-model="temp.bankCard" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="税号：" prop="taxNumber">
          <el-input v-model="temp.taxNumber" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="折扣：" prop="discount">
          <el-input v-model="temp.discount" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="退货地址：" prop="returnAddress">
          <el-input v-model="temp.returnAddress" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="note">
          <el-input v-model="temp.note" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="" maxlength="200"></el-input>
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
import { getListAPI, updateAPI, addAPI } from '@/api/stock-management/supplier'
import { requestMsg } from '@/utils/publicFunctions'
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
        code: [{ required:true, pattern:/^[0-9a-zA-Z]{1,50}$/, trigger: 'change', message:'请输入50字符以内数字和英文' }], 
        name: [{ required:true, pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}$/,trigger: 'change',message:'请输入50字符以内的汉字、字母和数字' }],
        address: [{ pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]{1,100}$/,trigger: 'change',message: `请输入100字符以内的汉字、字母和数字` }],
        zipCode: [{ pattern:/^\d{1,50}$/,trigger: 'change',message:'请输入50字符以内数字' }],
        personName: [{ pattern:/^[\u4e00-\u9fa5a-zA-Z]{0,50}$/,trigger: 'change',message:'请输入50字符以汉字和英文' }],
        phone: [{ pattern:/^(13\d|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18\d|19[89])\d{8}$/,trigger: 'change',message:'请输入正确的手机号码' }],
        fax: [{ pattern:/^\d{1,50}$/,trigger: 'change',message:'请输入50字符以内数字' }],
        bankName: [{ pattern:/^[\u4e00-\u9fa50-9]{0,50}$/,trigger: 'change',message:'请输入50字符以内汉字和数字' }],
        bankCard: [{ pattern:/^\d{1,50}$/,trigger: 'change',message:'请输入50字符以内数字' }],
        taxNumber: [{ pattern:/^[0-9a-zA-Z]{0,50}$/,trigger: 'change',message:'请输入50字符以数字和英文' }],
        discount: [{ pattern:/^\d{1,50}(\.\d+)?$/,trigger: 'change',message:'请输入50字符以内数字' }],
        returnAddress: [{ pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}$/,trigger: 'change',message:'请输入50字符以内的汉字、字母和数字' }],
        note: [{ type: 'string', trigger: 'change', max: 200, message: `最多200个字符` }],
        type:[{ required: true, message: '请选择调供应商类型', trigger: 'change' }],
      },
      textMap: {
        update: '编辑供应商',
        create: '添加供应商'
      },
      dialogStatus: '',
      dialogFormVisible: false,
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {    
    if( ifUndefined(store.getters.supplierSerKeys.pageNum) ){
      this.listQuery = store.getters.supplierSerKeys
      console.log(this.listQuery,'读取搜索条件成功')      
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
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
        type: '1',
        name: '',
        address: '',
        zipCode: '',
        personName: '',
        phone: '',
        fax: '',
        bankName: '',
        bankCard: '',
        taxNumber: '',
        discount: '',
        returnAddress: '',
        note: ''
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
        requestMsg.apply(this,[res.data, `${this.textMap[this.dialogStatus]}`])
        this.dialogFormVisible = false
      })
    },
    handleFilter(){
      store.dispatch('SetSupplierSerKeys',this.listQuery).then(res => {
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
