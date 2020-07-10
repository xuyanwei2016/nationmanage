<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <div class="nav-buttons-container">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleCreate">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchaudit') >= 0" @click="massSetting">{{authBtns.filter(i => i.idName=='batchaudit')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchaudit').length>0 && authBtns.filter(i => i.idName=='batchaudit')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchaudit')].icon, 'el-icon--right']"></i></el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchreply') >= 0" @click="massReply">{{authBtns.filter(i => i.idName=='batchreply')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchreply').length>0 && authBtns.filter(i => i.idName=='batchreply')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchreply')].icon, 'el-icon--right']"></i></el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchdelete') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='batchdelete')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchdelete').length>0 && authBtns.filter(i => i.idName=='batchdelete')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchdelete')].icon, 'el-icon--right']"></i></el-button>
      </div>
      <el-form inline class="form-inline">
        <el-form-item label="用户名">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.userName" clearable></el-input>
        </el-form-item>
        <el-form-item label="留言标题">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-select clearable v-model="listQuery.source">
            <el-option label="全部" value=""></el-option>
            <el-option label="在线留言" value="1"></el-option>
            <el-option label="专家答疑" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select clearable v-model="listQuery.auditStatus">
            <el-option label="全部" value=""></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="已审核" value="1"></el-option>
            <el-option label="已回复" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @current-change="handleCurChange" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center"  label="序号" width="60"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="留言标题" >
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="回复内容">
        <template slot-scope="scope">
          <el-popover
            ref="popover1"
            placement="top-start"
            width="300"
            trigger="hover"
            content="">
            {{scope.row.replyContent}}
          </el-popover>
          <span v-popover:popover1>{{filterWord(scope.row.replyContent,40)}}</span>
          <!-- <span>{{scope.row.replyContent}}</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" width="140" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="留言时间">
        <template slot-scope="scope">
          <span>{{scope.row.releaseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="来源">
        <template slot-scope="scope">
          <span v-if="scope.row.source == 1">在线留言</span>
          <span v-else>专家答疑</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.auditStatus ===0" style="color:#CC6600;">未审核</span>
          <span v-else-if="scope.row.auditStatus ===1" style="color:#008000;">已审核</span>
          <span v-else-if="scope.row.auditStatus ===2" style="color:rgba(22, 155, 213, 1);">已回复</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" @click="handleUpdate(scope.row)" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
          <i :class="authBtns.filter(i => i.idName=='deletebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='deletebtn').length > 0" @click="singleDelete(scope.row.id)" :title="authBtns.filter(i => i.idName=='deletebtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="110px" style='margin-left:50px;'>
        <el-form-item label="留言标题：" prop="title">
          <el-col :span="16">
            <el-input v-model="temp.title" :disabled="dialogStatus!='create'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'update'" label="发表时间：" prop="releaseTime">
          <el-col :span="16">
            <el-input v-model="temp.releaseTime" :disabled="dialogStatus!='create'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选择留言人：" prop="userName">
          <el-col :span="16">
            <el-input v-model="temp.userName" :disabled="dialogStatus!='create'"></el-input>
          </el-col>
          <el-col :span="8" style="padding-left: 15px;">
            <el-button v-if="dialogStatus === 'create'" @click="selectMembers">选择会员</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="联系方式：" prop="contactInformation">
          <el-col :span="16">
            <el-input v-model="temp.contactInformation" :disabled="dialogStatus!='create'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="留言内容：" prop="content">
          <el-col :span="16">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.content" :disabled="temp.auditStatus !== 0"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="temp.auditStatus < 2" label="审核状态：" prop="auditStatus">
          <el-radio-group v-model="temp.auditStatus">
            <el-radio :label="1">已审核</el-radio>
            <el-radio :label="0">未审核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.auditStatus === 2" label="回复时间：" prop="replyTime">
          <el-col :span="16">
            <el-input v-model="temp.replyTime" :disabled="dialogStatus!='create'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="temp.auditStatus" label="回复内容：" prop="replyContent">
          <el-col :span="16">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp.replyContent"></el-input>
          </el-col>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" class="form-submit" @click="createData" :loading="saveLoading">保存</el-button>
        <el-button v-else-if="dialogStatus=='update'" class="form-submit" @click="updateData" :loading="saveLoading">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择会员" :visible.sync="membersVisible" width="60%" border>
      <el-table :data="membersList" border highlight-current-row stripe v-loading="memberLoading" element-loading-text="请稍等">
        <el-table-column prop="account" label="会员账号" align="center" width="180"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="180"></el-table-column>
        <el-table-column prop="email" align="center" label="邮箱地址"></el-table-column>
        <el-table-column label="操作" class-name="small-padding fixed-width"  align="center">
          <template slot-scope="scope">
            <i class="el-icon-circle-check-outline" @click="copyName(scope.row.account)" title="选择"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="membershandleCurrentChange" :current-page="memberslistQuery.pageNum" :page-size="memberslistQuery.pageSize" layout="total, prev, pager, next" :total="memberTotal" align="center">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPvVisible" width="30%">
      <el-form>
        <el-form-item v-if="dialogStatus=='setting'" label="审核状态：">
          <el-radio-group v-model="massQuery.auditStatus">
            <el-radio :label="1">已审核</el-radio>
            <el-radio :label="0">未审核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-else style="margin-bottom: 0;">
          <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 10}" v-model="massQuery.replyContent" placeholder="请输入回复内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='setting'" @click="massSettingSubmit">确定</el-button>
        <el-button v-else-if="dialogStatus=='reply'" @click="massReplySubmit">确定</el-button>
        <el-button @click="dialogPvVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getMessage, deleteMessage, updateMessage, addMessage, massReview, massReply,getMemberAPI } from '@/api/website-management/message'
import {operationMsg, errorMsg} from '@/utils/publicFunctions'
import store from '@/store'

export default {
  name: 'complexTable',
  data() {
    var validateTitle = (rule, value, callback) => {
      if (value.replace(/\s+/g,"") == ''){
        callback(new Error('留言标题必填'));
      } else if(value.length > 50){
        callback(new Error(`标题最多50字！现${value.length}字！`))
      } else {
        callback()
      }
    };
    var validateContent = (rule, value, callback) => {
      if(value.length > 1000) {
        callback(new Error(`内容最多1000字！现${value.length}字！`))
      } else {
        callback()
      }
    };
    return {
      authBtns: [],
      tableKey: 0,
      membersVisible:false,
      membersList:[],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        auditStatus: '',
        source:'',
        title: null,
        userName: null
      },
      massQuery: {
        ids: [],
        replyContent: null,
        auditStatus: 1
      },
      allReviewed: false,
      temp: {
        id: 0,
        title: '',
        auditStatus: 0,
        contactInformation: '',
        content:'',
        releaseTime:'',
        replyContent: '',
        replyTime: '',
        userName: ''
      },
      memberslistQuery: {
        pageNum: 1,
        pageSize: 10
      },
      memberLoading: true,
      memberTotal: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        setting: '批量审核',
        reply: '批量回复',
        update: '修改',
        create: '创建留言内容'
      },
      dialogPvVisible: false,
      rules: {
        userName: [{ required: true, message: '请选择留言人，限制10字', trigger: 'change', pattern: /^.{1,10}$/ }],
        title: [{ type: 'string', required: true, trigger: 'change', validator: validateTitle }],
        content: [{ type: 'string', trigger: 'change', validator: validateContent }],
        auditStatus: [{ required: true, message: '状态必选', trigger: 'change' }],
        contactInformation: [{ required: false, message: '请输入有效的11位数字联系方式', trigger: 'change', pattern: /^1[3|5|7|8]\d{9}$/gi}]
      },
      multipleSelection:[],
      saveLoading: false
    }
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    if( ifUndefined(store.getters.msg_managementSerKeys.pageNum) ){
      this.listQuery = store.getters.msg_managementSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.getList()
  },
  methods: {
    copyName(name){
      this.temp.userName = name
      this.membersVisible = false
    },
    selectMembers(){
      this.membersVisible = true
      this.memberLoading = true
      getMemberAPI(this.memberslistQuery).then(res=>{
        if (res.data.status) {
          this.membersList = res.data.data.list
          this.memberTotal = res.data.data.total
        } else {
          errorMsg.apply(this, [ res.data, `获取会员` ])
        }
        this.memberLoading = false
      })
    },
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        auditStatus: '',
        source:'',
        title: null,
        id: null
      }
      this.getList()
    },
    massSettingSubmit(){
      console.log(this.massQuery)
      if (this.massQuery.auditStatus === null) {
        this.$message.error('请先选择审核状态再提交！')
      } else {
        massReview(this.massQuery).then(res => {
          operationMsg.apply(this,[res.data.code,`批量审核${this.multipleSelection.length}项`])
          res.data.code === 0 ? this.dialogPvVisible = false : true
        })
      }
    },
    massSetting(){
      if(this.multipleSelection.length!=0){
        const allUnreplied = this.multipleSelection.every(arg => arg.auditStatus !== 2 )
        if(allUnreplied){
          this.dialogPvVisible = true
          this.dialogStatus = 'setting'
          this.massQuery.auditStatus = 1
        } else {
          this.$message.warning('只能对已审核和未审核的内容批量审核')
        }
      } else {
        this.$message.warning('请先选择需要操作的条目')
      }
    },
    massReplySubmit(){
      console.log()
      this.massQuery.replyContent = this.massQuery.replyContent.replace(/(^\s*)|(\s*$)/g,'')
      if (this.replyContent === null || this.replyContent === '' ) {
        this.$message.warning('请先填写回复内容再提交！')
      } else {
        massReply(this.massQuery).then(res => {
          operationMsg.apply(this,[res.data.code,'批量留言回复'])
        })
        this.dialogPvVisible = false
      }
    },
    massReply(){
      if(this.multipleSelection.length!=0){
        if (this.allReviewed) {
          this.dialogPvVisible = true
          this.dialogStatus = 'reply'
          this.massQuery.replyContent = null
        } else {
          this.$message.warning('只能选择已审核的内容进行回复！')
        }
      } else {
        this.$message.warning('请先选择需要操作的条目')
      }
    },
    massDelete(){
      if(this.multipleSelection.length!=0){
        this.$confirm('确定要删除选择的留言吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMessage(this.massQuery.ids).then(res => {
            operationMsg.apply(this, [res.data.code, `批量删除${this.multipleSelection.length}项`])
          })
        })
      } else {
        this.$message.warning('请先选择需要删除的内容')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if(Array.isArray(this.multipleSelection) && this.multipleSelection.length>0) {
        this.massQuery.ids = this.multipleSelection.map(item => item.id)
        this.allReviewed = this.multipleSelection.every(arg => arg.auditStatus === 1)
      }
    },
    getList() {
      this.listLoading = true
      getMessage(this.listQuery).then(response=>{
        console.log(response)
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          console.log(response.data.data)
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      store.dispatch('SetMsgManagementSerKeys',this.listQuery).then(res => {
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
      this.$confirm('确定要删除选择的留言吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMessage([id]).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      });
    },
    resetTemp() {
      this.temp = {
        id: 0,
        title: '',
        auditStatus: 0,
        contactInformation: '',
        content:'',
        releaseTime:'',
        replyContent: '',
        replyTime: '',
        userName: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.saveLoading = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.saveLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const newTemp = Object.assign({}, this.temp)
          addMessage(newTemp).then(res => {
            operationMsg.apply(this,[res.data.code,'创建留言'])
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.saveLoading = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          document.getElementsByClassName('form-submit').disabled = true
          updateMessage(tempData).then(res => {
            operationMsg.apply(this,[res.data.code,'留言更新'])
            this.dialogFormVisible = false
            document.getElementsByClassName('form-submit').disabled = false
          })
        }
      })
    },
    membershandleSizeChange(val){
      this.memberslistQuery.pageNum = val
      this.selectMembers()
    },
    membershandleCurrentChange(val){
      this.memberslistQuery.pageNum = val
      this.selectMembers()
    }
  }
}
</script>
``
