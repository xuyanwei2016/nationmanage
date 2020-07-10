<template>

  <div class="app-container calendar-list-container xyw">
    <div class="filter-container">
      <div class="nav-buttons-container">
          <el-button type="primary"   v-if="authBtns.map(i => i.idName).indexOf('sendbtn') >= 0" @click="handleCreate">{{authBtns.filter(i => i.idName=='sendbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='sendbtn').length>0 && authBtns.filter(i => i.idName=='sendbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('sendbtn')].icon, 'el-icon--right']"></i></el-button>

          <el-button type="primary"   v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
      </div>
      <el-form :inline="true" class="form-inline">
        <el-form-item label="信息标题">
          <el-input style="width: 180px;" clearable v-model="listQuery.title">
          </el-input>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button  @click="handleFilter">检索</el-button>
          <el-button type="danger" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @current-change="handleCurChange" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column min-width="150" align="center" label="信息标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送方式" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sendType === 1" style="color:#008000;">手动发送</span>
          <span v-else style="color:#CC6600;">自动发送</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" align="center" label="发送时间">
        <template slot-scope="scope">
          <span>{{scope.row.sendTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='viewbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='viewbtn').length > 0" :title="authBtns.filter(i => i.idName=='viewbtn')[0].name" @click="checkDetail(scope.row)"></i>
          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="emptyFn">
      <el-dialog title="选择会员" :visible.sync="dialogPvVisible" append-to-body width="45%">
        <el-container>
          <el-header>
            <el-form inline>
              <el-form-item>
                <el-input @keyup.enter.native="memberFilter" v-model="memberQuery.a2p" placeholder="会员名或手机号" clearable @clear="clear">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="memberFilter">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-header>
          <el-container>
            <el-aside width="70%">
              <el-table :key='memberTableKey' stripe :data="member.list" v-loading="member.listLoading" element-loading-text="给我一点时间" border highlight-current-row ref="memberTable" @selection-change="memberSelectionChange" :row-key="getRowKeys">
                <el-table-column align="center" type="selection" reserve-selection></el-table-column>
                <el-table-column min-width="100" align="center" label="会员名">
                  <template slot-scope="scope">
                    <span>{{scope.row.account}}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="120" align="center" label="手机号">
                  <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination @current-change="memberCurrentChange" :current-page.sync="memberQuery.pageNum" :page-size="10" layout="total, prev, pager, next" :total="member.total" align="center"></el-pagination>
              </div>
            </el-aside>
            <el-main>
              <el-card class="box-card">
                <div v-for="id in member.ids" :key="id" class="text item">
                  {{id}}
                </div>
              </el-card>
            </el-main>
          </el-container>
        </el-container>
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectionCommit">确定</el-button>
          <el-button @click="dialogPvVisible = false">取消</el-button>
        </span>
      </el-dialog>

      <el-form ref="dataForm" :rules="rules" :model="temp" :disabled="dialogStatus==='check'" label-position="right" label-width="110px" style='margin-right:20px;'>
        <el-form-item label="站内信标题：" prop="title">
          <el-col :span="12">
            <el-input v-model="temp.title"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="收信人选择：" prop="acceptMember">
          <el-radio-group v-model="temp.acceptMember">
            <el-radio :label="0">全部会员</el-radio>
            <el-radio :label="1">指定会员组</el-radio>
            <el-radio :label="2">指定会员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.acceptMember===1" label="选择会员组：" >
          <el-checkbox-group v-model="typeMember">
            <el-checkbox label="0" name="typeMember">个人会员</el-checkbox>
            <el-checkbox label="1" name="typeMember">专家会员</el-checkbox>
            <el-checkbox label="2" name="typeMember">机构会员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="temp.acceptMember===2" label="已选择会员：">
          <el-col :span="12">
            <!-- <el-select v-model="temp.memberIds"  multiple popper-class="hidden-selection" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in temp.memberIds" :key="item" :label="item" :value="item.value"></el-option>
            </el-select> -->
            <el-input v-model="memberids"></el-input>
          </el-col>
          <el-col :span="12" style="padding-left:15px;">
            <el-button @click="chooseMember">选择会员</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="站内信内容：" prop="content" ref="editor">
          <tinymce :height=300  v-model="temp.content" style="width:800px;position:relative;" @input="verityContent" ref="tinymceChild"></tinymce>
          <el-col :span="8" style="position: absolute;top: 110px;right: -88px; color: #ccc;">
            可用标签：<br>{$UserName} -用户名<br>{$RealName} -姓名<br>{$Sex} -先生或是女士<br>{$SiteName} -网站名称<br>{$SendTime} -发送时间<br>{$SendDate} -发送日期
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogStatus!=='check'" align="center">
        <el-button class="form-submit" @click="createSubmit">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import { getListAPI, deleteAPI, addAPI, viewAPI, getMemberAPI, getMemberQueryAPI} from '@/api/member/mail'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'

export default {
  name: "complexTable",
  components:{ Tinymce },
  data() {
    return {
      authBtns: [],
      imageUrl:'',
      tableKey: 0,
      memberTableKey: 1,
      list: null,
      total: null,
      listLoading: true,
      time: null,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        title: null,
        biginReleaserTime: null,
        endReleaserTime: null
      },
      massQuery: {
        ids: [],
        status: null
      },
      memberQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      memberSelection:[],
      memberSelect: '',
      member:{
        listLoading: true,
        list: null,
        total: null,
        memberSelection:[],
        ids: []
      },
      temp: {
        acceptMember: null,
        title: '',
        content: '',
        memberGroup: null,
        memberIds: []
      },
      typeMember: [],
      memberids: '',
      dialogFormVisible: false,
      dialogPvVisible: false,
      dialogStatus: '',
      textMap: {
        check: '查看站内信',
        create: '发送站内信'
      },
      getRowKeys(row) {
        return row.account;
      },
      rules: {
        title: [{ type: 'string', required: true, trigger: 'change', message: '请输入站内信标题' },{trigger: 'change', pattern: /^.{1,35}$/, message: '站内信标题长度为35位'}],
        acceptMember: [{ type: 'number', required: true, trigger: 'blur', message: '未选择' }],
        memberGroup: [{required: true, trigger: 'change', message: '未选择' }],
        member: [{ type: 'array', required: true, trigger: 'change', message: '未选择' }],
        content: [{ required: true,  message: '请输入站内信内容' }]
      },
      multipleSelection:[]
    };
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList();
  },
  methods: {
    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === 'image/jpeg';
    //   const isLt2M = file.size / 1024 / 1024 < 2;

    //   if (!isJPG) {
    //     this.$message.error('Avatar picture must be JPG format!');
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('Avatar picture size can not exceed 2MB!');
    //   }
    //   return isJPG && isLt2M;
    // },
    emptyFn() {
      this.$refs.tinymceChild.setContent('')
    },
    clear() {
      this.getMember()
    },
    createSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.memberGroup = this.typeMember.join(',')
          addAPI(this.temp).then(res => {
            console.log(res, '33vvvvv');
            operationMsg.apply(this,[res.data.code,'站内信创建'])
            this.$refs.editor.clearValidate()
            res.data.code === 0 ? this.dialogFormVisible = false : true
          })
        }
      })
    },

    // 验证内容
    verityContent() {
      if(this.temp.content.length != 0) {
        this.$refs.editor.clearValidate()
      }
    },

    selectionCommit(){
      this.memberids = this.member.ids.join(',');
      if(this.temp.memberIds.length > 0) {
        this.dialogPvVisible = false
      } else {
        this.$message.warning('请至少选择一个会员')
      }
    },

    chooseMember(){
      this.memberQuery.a2p = ''
      this.getMember()
      this.dialogPvVisible = true
      this.$nextTick(() => {
        this.$refs['memberTable'].clearSelection()
      })
    },
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false;
      });
    },
    getMember(){
      this.member.listLoading = true
      getMemberQueryAPI(this.memberQuery).then(res => {
        if(res.data.code === 0){
          this.member.list = res.data.data.list
          this.member.total = res.data.data.total
        } else {
          this.$message.error('获取会员失败')
        }
        this.member.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection) : true
    },
    memberSelectionChange(val){
      this.member.memberSelection = val
      this.member.memberSelection.length>0 ? this.member.ids = getMultipleSelectionIDs(this.member.memberSelection,'account') : true
      this.member.memberSelection.length>0 ? this.temp.memberIds = getMultipleSelectionIDs(this.member.memberSelection,'id'): true
    },
    // 批量删除
    massDelete(){
      if(this.multipleSelection.length!=0){
        confirm.apply(this,['确定要删除选择的站内信吗？']).then(() => {
          deleteAPI(this.massQuery.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
          })
        })
      } else {
        this.$message.warning('请先选择需要删除的内容')
      }
    },
    // 删除单条
    singleDelete(id) {
      confirm.apply(this,['确定要删除这条站内信吗？']).then(() => {
        deleteAPI([id]).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      })
    },
    resetTemp() {
      this.temp = {
        acceptMember: 0,
        title: '',
        content: '',
        memberGroup: null,
        memberIds: []
      }
      this.typeMember = []
    },
    // 发送站内信
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.memberids = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        title: null,
        biginReleaserTime: null,
        endReleaserTime: null
      }
      this.time = null
      this.getList()
    },
    // 检索
    handleFilter() {
      store.dispatch('SetMailSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      if (this.time) {
        this.listQuery.biginReleaserTime = this.time[0]
        this.listQuery.endReleaserTime = this.time[1]
      } else {
        this.listQuery.biginReleaserTime = null
        this.listQuery.endReleaserTime = null
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
    },
    memberFilter(){
      this.memberQuery.pageNum = 1
      this.getMember()
    },
    memberCurrentChange(val){
      this.memberQuery.pageNum = val
      this.getMember()
    },

    checkDetail(row){
      this.temp = Object.assign({}, row) // copy obj
      this.temp.acceptMember === 1 ? this.temp.memberGroup = this.temp.memberGroup.split(',') : this.temp
      this.dialogStatus = 'check'
      this.dialogFormVisible = true
      viewAPI(row.id).then(res => {
        if(res.data.code === 0) {
          this.temp = res.data.data
        }
      })
    }
  }
};
</script>

<style>
  .box-card {
    width: 100%;
    height: 100%;
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }
  .inline{
    text-align: right
  }

  .xyw .el-textarea__inner {
    height: 210px !important;
  }
  /* .xyw .filter-container .el-form--inline .el-form-item--medium .el-form-item__content .el-button:not(:last-child) {
    margin-right: 10px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  } */
</style>
