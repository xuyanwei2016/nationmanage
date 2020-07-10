<template>

  <div class="app-container calendar-list-container xyw">

    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('viewbtn') >= 0" @click="handleSetting">{{authBtns.filter(i => i.idName=='viewbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='viewbtn').length>0 && authBtns.filter(i => i.idName=='viewbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('viewbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('removebtn') >= 0" @click="deleteAll">{{authBtns.filter(i => i.idName=='removebtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='removebtn').length>0 && authBtns.filter(i => i.idName=='removebtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('removebtn')].icon, 'el-icon--right']"></i></el-button>
    </div>
    <el-form inline class="form-inline">
      <el-form-item label="会员名称：">
        <el-input placeholder="会员名称" v-model="listQuery.memberAccount" clearable></el-input>
      </el-form-item>
      <el-form-item label="签到时间">
        <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe
      @selection-change="handleSelectionChange" ref="multipleTable">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" width="200" label="UID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
     <el-table-column align="center" label="会员名称" width="280">
        <template slot-scope="scope">
          <span>{{scope.row.memberAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="获得奖励" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.score}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="IP地址">
        <template slot-scope="scope">
         <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="签到时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{path:`/membermanage/person_member?UID=${scope.row.id}&account=${scope.row.account}`}" v-if="authBtns.filter(i => i.idName=='seebtn').length > 0"><!-- UID=${scope.row.id}&name=${scope.row.account} -->
            <i :class="authBtns.filter(i => i.idName=='seebtn')[0].icon" :title="authBtns.filter(i => i.idName=='seebtn')[0].name"></i>
          </router-link>
          <!-- <i class="el-icon-edit" @click="handleUpdate(scope.row)" ></i> -->
          <i :class="authBtns.filter(i => i.idName=='removebtn2')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn2').length > 0"  :title="authBtns.filter(i => i.idName=='removebtn2')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>  
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="width:100%">
      <el-form ref="dataForm" :model="form" label-width="120px" style='margin-left:30px;'>
        <el-form-item label="每日签到积分：">
          <el-col :span="12">
            <el-input-number v-model="form.temp[0].value" :min="1"></el-input-number>&nbsp; 分
          </el-col>
          <el-col :span="12">独立获取，不和其他积分奖励冲突</el-col>
        </el-form-item>
        <el-form inline>
          <el-form-item label="连续签到奖励：">
            <el-radio-group v-model="form.temp[1].value">
              <el-radio :label="'1'">启用</el-radio>
              <el-radio :label="'0'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template v-if="form.temp[1].value == 1">
          <el-form v-for="(reward, index) in form.temp[2].value" inline label-width="120px" :key="index">
            <el-form-item label="累计签到：">
              <el-input-number v-model="reward.day" :min="1"></el-input-number>&nbsp; 天
            </el-form-item>
            <br>
            <el-form-item label="奖励积分：">
              <el-input-number v-model="reward.score" :min="1"></el-input-number>&nbsp; 分
            </el-form-item>
            <el-button v-if="index === 0" @click.prevent="addRule">增加新项</el-button>
            <el-button v-else @click.prevent="removeRule(reward)">删除此项</el-button>
          </el-form>
        </template>
        <el-form-item label="积分签到说明：">
          <el-col :span="12">
            <el-input type="textarea" v-model="form.temp[3].value" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="form-submit" @click="signSetting">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { getListAPI, deleteAPI, deleteAllAPI, getSignAPI, updateSignAPI } from '@/api/member/memberCheckin'
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
        memberAccount:'',
        pageNum: 1,
        pageSize: 100,
        beginTime:'',
        endTime:'',
        signTitle: ''
      },
      id:'',
      time:'',
      massQuery: {
        ids: [],
        status:null
      },
      form: {
        temp:[{},{},{},{}],
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        setting: '会员签到设置'
      },
      // rules: {
      //   bonus: [{ required: true, message: '必选', trigger: 'change' }],
      //   dailyPoints: [{ type: 'number', required: true, trigger: 'change', message: '未填写' }],
      //   description: [{ required: true, message: '未填写', trigger: 'change' }]
      // },
      multipleSelection:[]
    }
  },
  mounted() {   
    if( ifUndefined(store.getters.memberCheckinSerKeys.pageNum) ){
      this.listQuery = store.getters.memberCheckinSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.beginTime) || ifUndefined(this.listQuery.endTime)){
        this.time = []
        this.time[0] = this.listQuery.beginTime
        this.time[1] = this.listQuery.endTime
      }
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList()
    this.getSign()
  },
  methods: {
    removeRule(item) {
      var index = this.form.temp[2].value.indexOf(item)
      if (index !== -1) {
        this.form.temp[2].value.splice(index, 1)
      }
    },
    addRule(){
      this.form.temp[2].value.push({
        score: null,
        day: null
      })
    },
    handleSetting() {
      this.dialogStatus = 'setting'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    signSetting() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = JSON.parse( JSON.stringify(this.form.temp) ) //深拷贝简单粗暴法
          tempData[2].value = JSON.stringify(tempData[2].value)
          // console.log(this.form.temp);
          // console.log(tempData);
          updateSignAPI(tempData).then(res => {
            operationMsg.apply(this,[res.data.code,'签到设置'])
            res.data.code === 0 ? this.dialogFormVisible = false : true
          })
        }
      })
    },
    massDelete(){
      if(this.multipleSelection.length!=0){
        confirm.apply(this,['确定要删除选择的签到记录吗？']).then(() => {
          deleteAPI(this.massQuery.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
          })
        })
      } else {
        this.$message.warning('请先选择需要删除的内容')
      }
    },
    singleDelete(id) {
      confirm.apply(this,['确定要删除选择的签到记录吗？']).then(() => {
        deleteAPI([id]).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection) : true
    },
    getSign(){
      getSignAPI().then(res => {
        if(res.data.code === 0){
          this.form.temp = res.data.data
          this.form.temp[2].value = JSON.parse(this.form.temp[2].value)
          // console.log(this.form.temp[2].value);
        } else {
          this.$message.error('查询会员签到参数失败')
        }
      })
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res=>{
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
    resetFilter(){
      this.listQuery={
        memberAccount: null,
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        beginTime: null,
        endTime: null
      }
      this.time = null
      this.getList()
    },
    handleFilter() {
      if (this.time) {
        this.listQuery.beginTime = this.time[0]
        this.listQuery.endTime = this.time[1]
      } else {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }
      store.dispatch('SetMemberCheckinSerKeys',this.listQuery).then(res => {
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
    deleteAll(){
      confirm.apply(this,['确定清空所有会员签到记录吗？']).then(() => {
        deleteAllAPI().then(res => {
          operationMsg.apply(this,[res.data.code,'清空所有会员签到记录'])
        }) 
      })
    }
  }
}
</script>
<style scoped>
  .xyw .filter-container .el-form--inline .el-form-item--medium .el-form-item__content .el-button:not(:last-child) {
    margin-right: 10px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  }
</style>
