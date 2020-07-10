<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="nav-buttons-container">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleCreate">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('createbtn') >= 0" @click="massCreate">{{authBtns.filter(i => i.idName=='createbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='createbtn').length>0 && authBtns.filter(i => i.idName=='createbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('createbtn')].icon, 'el-icon--right']"></i></el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('downloadbtn') >= 0" @click="exportExcel">{{authBtns.filter(i => i.idName=='downloadbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='downloadbtn').length>0 && authBtns.filter(i => i.idName=='downloadbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('downloadbtn')].icon, 'el-icon--right']"></i></el-button>
      </div>
      <el-form inline class="filter-form-inline">
        <el-form-item label="名称">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.cardName" clearable></el-input>
        </el-form-item>
        <el-form-item label="充值卡号">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.cardCode" clearable></el-input>
        </el-form-item>
        <el-form-item label="出售">
          <el-select @change='handleFilter' clearable v-model="listQuery.sellStatus">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="未出售" value="0"></el-option>
            <el-option label="已出售" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用">
          <el-select @change='handleFilter' clearable v-model="listQuery.useStatus">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="未使用" value="0"></el-option>
            <el-option label="已使用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe
      @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="名称" >
        <template slot-scope="scope">
          <span>{{scope.row.cardName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值卡号">
        <template slot-scope="scope">
          <span>{{scope.row.cardCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="140" label="密码">
        <template slot-scope="scope">
          <span>{{scope.row.cardPwd}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="面值（元）">
        <template slot-scope="scope">
          <span>{{scope.row.parValue}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="支付金额（元）">
        <template slot-scope="scope">
          <span>{{scope.row.amountPayment}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="140" label="所属会员">
        <template slot-scope="scope">
          <span>{{scope.row.memberId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="140" label="到期时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="出售">
        <template slot-scope="scope">
          <span v-if="scope.row.sellStatus===0" style="color:#CC6600;">未出售</span>
          <span v-else-if="scope.row.sellStatus===1" style="color:#008000;">已出售</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="使用">
        <template slot-scope="scope">
          <span v-if="scope.row.useStatus===0" style="color:#CC6600;">未使用</span>
          <span v-else-if="scope.row.useStatus===1" style="color:#008000;">已使用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="handleUpdate(scope.row)"></i>
          <i :class="authBtns.filter(i => i.idName=='viewbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='viewbtn').length > 0" :title="authBtns.filter(i => i.idName=='viewbtn')[0].name" @click="handleView(scope.row)"></i>
          <i :class="authBtns.filter(i => i.idName=='addbtn2')[0].icon" v-if="scope.row.useStatus===0 && authBtns.filter(i => i.idName=='addbtn2').length > 0" :title="authBtns.filter(i => i.idName=='addbtn2')[0].name"></i>
          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :disabled="dialogStatus=='view'" label-position="right" label-width="120px" style='margin-left:40px;' :rules="rules">
        <el-form-item label="充值卡名称：" prop="cardName">
          <el-col :span="11">
            <el-input v-model="temp.cardName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="充值卡号：" prop="cardCode">
          <el-col :span="11">
            <el-input v-model="temp.cardCode"></el-input>
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">建议设为10~15位，使用字母、数字、_组成，唯一</el-col>
        </el-form-item>
        <el-form-item label="充值卡密码：" prop="cardPwd">
          <el-col :span="11">
            <el-input v-model="temp.cardPwd"></el-input>
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">建议设为6~10位，使用数字、字母组合</el-col>
        </el-form-item>
        <el-form-item label="充值卡面额：" prop="parValue">
          <el-col :span="11">
            <el-input v-model="temp.parValue" type="number" min="1" max="10000"></el-input>
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">元</el-col>
        </el-form-item>
        <el-form-item label="支付金额：" prop="amountPayment">
          <el-col :span="11">
            <el-input v-model="temp.amountPayment"></el-input>
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">元</el-col>
        </el-form-item>
        <el-form-item label="面向用户：" prop="memberType">
          <el-checkbox-group v-model="temp.memberType">
            <el-checkbox label="1">个人会员</el-checkbox>
            <el-checkbox label="2">专家会员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="充值截止日期：" prop="endTime">
          <el-col :span="11">
            <el-date-picker type="date" v-model="temp.endTime" value-format="yyyy-MM-dd" placeholder="年/月/日" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="是否出售：" prop="sellStatus">
          <el-radio-group v-model="temp.sellStatus">
            <el-radio :label="1">已出售</el-radio>
            <el-radio :label="0">未出售</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogStatus!=='view'" style="text-align:center;">
        <el-button v-if="dialogStatus=='create'" class="form-submit" @click="createData">保存</el-button>
        <el-button v-else-if="dialogStatus=='update'" class="form-submit" @click="updateData">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPvVisible">
      <el-form ref="massCreateForm" :model="massTemp" :disabled="dialogStatus=='view'" label-position="right" label-width="140px" style='margin-left:30px;' :rules="rules">
        <el-form-item label="充值卡名称：" prop="cardName">
          <el-col :span="11">
            <el-input v-model="massTemp.cardName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="充值卡数量：" prop="number">
          <el-col :span="11">
            <el-input-number v-model="massTemp.number" :min="1" :max="1000"></el-input-number>
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">最多一次生成1000张</el-col>
        </el-form-item>
        <el-form-item label="充值卡前缀：" prop="prefix">
          <el-col :span="11">
            <el-input v-model="massTemp.prefix"></el-input>
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">建议设为6~8位，使用数字、字母组合</el-col>
        </el-form-item>
        <el-form-item label="充值卡号码位数：" prop="codeLength">
          <el-col :span="11">
            <el-input-number v-model="massTemp.codeLength" :min="10" :max="15"></el-input-number>
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">建议设为10~15位</el-col>
        </el-form-item>
        <el-form-item label="充值卡密码位数：" prop="pwdLength">
          <el-col :span="11">
            <el-input-number v-model="massTemp.pwdLength" :min="6" :max="10"></el-input-number>
            <!-- <el-input v-model="massTemp.pwdLength"></el-input> -->
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">建议设为6~10位</el-col>
        </el-form-item>
        <el-form-item label="充值卡密码：" prop="pwdRules">
          <el-radio-group v-model="massTemp.pwdRules">
            <el-radio :label="1">纯数字</el-radio>
            <el-radio :label="2">数字与字母组合</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="充值卡面额：" prop="parValue">
          <el-col :span="11">
            <el-input v-model="massTemp.parValue"  type="number" min="1" max="10000"></el-input>
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">元</el-col>
        </el-form-item>
        <el-form-item label="支付金额：" prop="amountPayment">
          <el-col :span="11">
            <el-input v-model="massTemp.amountPayment"></el-input>
          </el-col>
          <el-col :span="13" style="padding-left: 15px;">元</el-col>
        </el-form-item>
        <el-form-item label="面向用户：" prop="memberType">
          <el-checkbox-group v-model="massTemp.memberType">
            <el-checkbox label="1">个人会员</el-checkbox>
            <el-checkbox label="2">专家会员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="充值截止日期：" prop="endTime">
          <el-col :span="11">
            <el-date-picker type="date" v-model="massTemp.endTime" value-format="yyyy-MM-dd" placeholder="年/月/日" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="是否出售：" prop="sellStatus">
          <el-radio-group v-model="massTemp.sellStatus">
            <el-radio :label="1">已出售</el-radio>
            <el-radio :label="0">未出售</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button class="form-submit" @click="massCreateSubmit">保存</el-button>
        <el-button @click="dialogPvVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getListAPI, deleteAPI, updateAPI, addAPI, batchAddAPI, isExistAPI } from '@/api/marketing-management/prepaidCard'
import {operationMsg} from '@/utils/publicFunctions'
import {getMultipleSelectionIDs} from '@/filters/getIds'
import { requestPath } from '@/utils/global.js'
import queryString from 'query-string'
import store from '@/store'

export default {
  name: 'complexTable',
  data() {
    const validateCode = (rule, value, callback) => {
      let reg = /^[a-zA-Z\d]{10,15}$/
      if ( !reg.test(value) ) {
        callback(new Error('请输入数字、字母组成的10-15位字符'))
      } else {
        let params = { cardCode: value }
        this.dialogStatus === 'update' ? params.id = this.temp.id : params
        isExistAPI(params).then(res => {
          res.data.status ? res.data.data === false ? callback() : callback(new Error(`卡号${value}已存在！`)) : callback(new Error(`错误Error：${res.data.msg}`))
        })
      }
    };
    return {
      authBtns: [],
      rules: {
        cardName: [{ required:true, pattern:/^([\w\d]|[\u4e00-\u9fa5]){1,20}$/,trigger: 'blur',message:'请输入20字符以内的汉字、字母和数字' }],
        cardCode: [{ required: true, trigger: 'blur', validator: validateCode }],
        cardPwd: [{ required:true, pattern:/^[a-zA-Z\d_]{6,10}$/,trigger: 'blur',message:'请输入6-10位，数字、字母或两者组合' }],
        parValue: [{ required:true, pattern:/^([1-9]\d{0,2}|1000)$/,trigger: 'blur',message:'请输入1-1000之间的数字' }],
        amountPayment: [{ required:false, pattern:/^([1-9]\d{0,2}|1000)$/,trigger: 'blur',message:'请输入1-1000之间的数字' }],
        memberType: [{ required:true, trigger: 'blur',message:'此为必选项' }],
        endTime: [{ required:true, trigger: 'blur',message:'此为必选项' }],
        sellStatus: [{ required:true, trigger: 'blur',message:'此为必选项' }],
        number: [{ required:true, pattern:/^([\d]{1,3}|1000)$/,trigger: 'blur',message:'最多一次生成1000张' }],
        prefix: [{ required:true, pattern:/^([a-zA-Z\d]{6,8})$/,trigger: 'blur',message:'建议设为6~8位，使用数字、字母组合' }],
        codeLength: [{ required:true, pattern:/^([\d]{1,2})$/,trigger: 'blur',message:'建议设为10~15位' }],
        pwdLength: [{ required:true,trigger: 'blur', pattern:/^([\d]{1,2})$/ ,message:'建议设为6～10位' }],
        pwdRules: [{required:true,message:'未填写'}]
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        orderBy: 'createTime desc',
        cardCode: null,
        sellStatus: null,
        useStatus:null,
        cardName: null
      },
      massQuery: {
        ids: []
      },
      allReviewed: false,
      temp: {
        id: null,
        cardName: '',
        cardCode: '',
        cardPwd: '',
        parValue:null,
        amountPayment:null,
        memberType: '',
        endTime: '',
        sellStatus: 0,
        memberId: null,
        useStatus: null
      },
      massTemp: {
        cardName: '',
        number: 1,
        prefix: '',
        codeLength: 12,
        pwdLength: 6,
        pwdRules: null,
        parValue:null,
        amountPayment:null,
        memberType: [],
        endTime: '',
        sellStatus: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        massCreate: '批量生成充值卡',
        view: '查看详情',
        update: '修改充值卡',
        create: '添加充值卡'
      },
      dialogPvVisible: false,
      newRules: {},
      multipleSelection:[],
    }
  },
  mounted() {
    if( ifUndefined(store.getters.prepaidCardSerKeys.pageNum) ){
      this.listQuery = store.getters.prepaidCardSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList()
  },
  methods: {
    exportExcel(){//导出excel
      let {pageNum, pageSize, ...params} = this.listQuery
      let tempParams = {}
      for (const key in params) {
        if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
          tempParams[key] = params[key]
        }
      }
      let paramStr = queryString.stringify(tempParams)
      paramStr ? window.open(`${process.env.BASE_API}${requestPath.common}/card/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.common}/card/export`)
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        orderBy: 'createTime desc',
        cardCode: null,
        sellStatus: null,
        useStatus:null,
        cardName: null
      }
      this.getList()
    },
    massDelete(){
      if(this.multipleSelection.length!=0){
        this.$confirm('确定要删除选择的充值卡吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(this.massQuery.ids)
          deleteAPI(this.massQuery.ids).then(response => {
            if(response.data.code === 0){
              this.getList()
              this.$message.success(`批量删除${this.multipleSelection.length}项成功`)
            } else {
              this.$message.error('批量删除失败')
            }
          })
        });
      } else {
        this.$message.warning('请先选择需要删除的内容')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection)
      this.allReviewed = this.multipleSelection.every(arg => arg.auditStatus === 1 )
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(response => {
        console.log(response)
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          console.log(response.data.data)
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      store.dispatch('SetPrepaidCardSerKeys',this.listQuery).then(res => {
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
    singleDelete(id) {
      this.$confirm('确定要删除选择的充值卡吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAPI([id]).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      });
    },
    resetMassTemp() {
      this.massTemp = {
        cardName: '',
        number: 1,
        prefix: '',
        codeLength: 12,
        pwdLength: 6,
        pwdRules: null,
        parValue:null,
        amountPayment:null,
        memberType: [],
        endTime: '',
        sellStatus: 0
      }
    },
    massCreate(){
      this.massTemp.prefix = null

      this.resetMassTemp()
      this.dialogStatus = 'massCreate'
      this.dialogPvVisible = true
      this.$nextTick(() => {
        this.$refs['massCreateForm'].clearValidate()
      })
      this.generateBig_1()
    },
    generateBig_1(){//生成充值卡前缀
      let str = [];
      for(let i=65;i<91;i++){
        str.push (String.fromCharCode(i));
      }
      for(let i=97;i<123;i++){
        str.push (String.fromCharCode(i));
      }
      str.push('1','2','3','4','5','6','7','8','9','0')
      for(let i=0; i<6; i++){
        this.massTemp.prefix += str[Math.round(Math.random()*68)]
      }
    },
    massCreateSubmit(){
      document.getElementsByClassName('form-submit').disabled = true
      let newTemp = Object.assign({}, this.massTemp)
      newTemp.memberType = newTemp.memberType.join(',')
      console.log(newTemp)
      this.$refs['massCreateForm'].validate((valid) => {
        if (valid) {
          batchAddAPI(newTemp).then(res => {
            console.log(res)
            operationMsg.apply(this,[res.data.code,'创建充值卡'])
            this.dialogPvVisible = false
            document.getElementsByClassName('form-submit').disabled = false
          })
        }
      })
    },
    resetTemp() {
      this.temp = {
        cardName: '',
        cardCode: '',
        cardPwd: '',
        parValue:null,
        amountPayment:null,
        memberType: [],
        endTime: '',
        sellStatus: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      document.getElementsByClassName('form-submit').disabled = true
      let dataTemp = Object.assign({}, this.temp)
      dataTemp.memberType = dataTemp.memberType.join(',')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addAPI(dataTemp).then(res => {
            // console.log(res)
            operationMsg.apply(this,[res.data.code,'创建充值卡'])
            this.dialogFormVisible = false
            document.getElementsByClassName('form-submit').disabled = false
          })
        }
      })
    },
    handleView(row){
      this.temp = Object.assign({}, row)
      this.temp.memberType = this.temp.memberType.split(',')
      // console.log(this.temp.memberType)
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.memberType = this.temp.memberType.split(',')
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      document.getElementsByClassName('form-submit').disabled = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData.memberType = tempData.memberType.join(',')
          console.log(tempData)
          updateAPI(tempData).then(res => {
            operationMsg.apply(this,[res.data.code,'充值卡更新'])
            this.dialogFormVisible = false
            document.getElementsByClassName('form-submit').disabled = false
          })
        }
      })
    }
  }
}
</script>
