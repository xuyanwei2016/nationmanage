

<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      
      <router-link :to="{ path:`authAdd`}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0"><el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button>
      </router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchExamBtn') >= 0" @click="batchExamBtn">{{authBtns.filter(i => i.idName=='batchExamBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchExamBtn').length>0 && authBtns.filter(i => i.idName=='batchExamBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchExamBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchSetBtn') >= 0" @click="massSetting">{{authBtns.filter(i => i.idName=='batchSetBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchSetBtn').length>0 && authBtns.filter(i => i.idName=='batchSetBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchSetBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('printBtn') >= 0" @click="printBtn">{{authBtns.filter(i => i.idName=='printBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='printBtn').length>0 && authBtns.filter(i => i.idName=='printBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('printBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>
    <el-form inline :model="listQuery">
      <el-form-item label="会员名称">
        <el-input v-model="listQuery.userName" placeholder="请输入会员名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="认证类型">
        <el-select v-model="listQuery.authenticationType" placeholder="请选择认证" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="医师资格认证" value="0"></el-option>
          <el-option label="医学院师生认证" value="1"></el-option>
          <el-option label="实名认证" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="认证状态">
        <el-select v-model="listQuery.authStatus" placeholder="请选择状态" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="审核未通过" value="0"></el-option>
          <el-option label="审核通过" value="1"></el-option>          
          <el-option label="待审核" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" :key='key' v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column label="UID" min-width="100" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="会员名称" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.userName}}</template>
      </el-table-column>
      <el-table-column label="认证类型" min-width="120" align="center" >
        <template slot-scope="scope">{{ typeObj[scope.row.authenticationType]}}</template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1" style="color: green">启用</span>
          <span v-else style="color: red">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" min-width="135" align="center" width="250">
        <template slot-scope="scope">{{ scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column label="认证状态" min-width="80" align="center">
        <template slot-scope="scope">{{ authStatus[scope.row.authStatus]}}</template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" width="120" label="操作" align="center">
        <template slot-scope="scope">
         <router-link :to="{ path:`authAdd`, query:{detailsId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i></router-link>
          <router-link :to="{ path:`authAdd`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='viewBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='viewBtn')[0].icon" :title="authBtns.filter(i => i.idName=='viewBtn')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0"  :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="设置状态" :visible.sync="dialogPvVisible" class="set-dialog" style="padding-left:15px">
      <el-form :model="memberStatus"  label-position="right" label-width="80px" style='margin-right:20px'>
        <el-form-item label="状态：">
          <el-radio-group v-model="memberStatus.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button class="form-submit" type="primary" @click="massSettingSubmit">确定</el-button>
        <el-button class="form-submit" @click="dialogPvVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量审核" :visible.sync="examDialog" class="examie" style="padding-left:15px">
      <el-form :model="memberStatus"  label-position="right" label-width="140px" style='margin-right:20px'>
        <el-form-item label="批量认证审核信息：">
          <el-radio-group v-model="memberStatus.status">
            <el-radio label="1">审核通过</el-radio>
            <el-radio label="0">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button class="form-submit" type="primary" @click="massSettingSubmit">确定</el-button>
        <el-button class="form-submit" @click="examDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import {operationMsg, confirm} from "@/utils/publicFunctions"
  import md5 from 'blueimp-md5'
  import {baseUrl} from '@/utils/global'
  import {getMultipleSelectionIDs, getMaxSort} from "@/filters/getIds"
  import { getListAPI, batchExamineAPI , batchDeleteAPI } from "@/api/member/authentication"
  import queryString from 'query-string'
  import store from '@/store'

  export default {
    data() {
      return {
        baseUrl:baseUrl,
        authBtns: [],
        // rules: {
        //   name: [{  type: "string", message: '请输入真实姓名,长度不超过10', trigger: "change", pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,10}$/ }],
        //   account: [{ type: "string", required: true, message: '用户名必填', trigger: "change" }],
        //   password: [{ required: true, trigger: "change", pattern: /^[0-9A-Za-z]{6,10}$/, message: "请输入以字母或数字开头，英文、数字组成的6-10位密码" }],
        //   phone: [{ type: "string", required: true, trigger: "change",  pattern:  /^1[3|5|7|8]\d{9}$/gi, message: '请输入有效的11位数字电话号码'}],
        //   email: [{trigger: "change", pattern: /(^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$)|^$/, required: false, message: '请输入英文、数字开关的邮箱'}],
        //   nickName: [{required: false,trigger: "change",pattern: /^[\w\u4e00-\u9fa5]{1,8}$/, message: '请输入8字以内的昵称'}],
        //   status: [{required: true, message: "状态必选", trigger: "change"}],
        //   organName: [{trigger: "change", pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/, message: "机构名称限制20个字符"}]
        // },
        time: [],
        list: [],
        listLoading: true,
        dialogPvVisible: false,
        examDialog:false,
        dialogStatus: "",
        total: null,
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          userName:'',
          authenticationType:'', // 认证类型 0医师资格认证 1医学院师生认证 2实名认证
          authStatus: '', // 认证状态 0：审核未通过 1：审核通过 2：待审核
          beginTime:'',
          endTime:""
        },
        typeObj:{
          '0':'医师资格认证',
          '1':'医学院师生认证',
          '2':'实名认证',
        },
        authStatus:{
          '0':'审核未通过',
          '1':'审核通过',
          '2':'待审核',
        },
        memberStatus: {
          ids: [],
          operational: '', // 操作 0：批量审批 1：批量设置 ,
          status:'1', // 状态 批量审批{0：审核未通过 1：审核通过} 批量设置{0：禁用 1：启用}
        },
        options: [],
        multipleSelection: [],
        key: 1,
      }
    },
    mounted() {
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
      this.getList()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.ids = getMultipleSelectionIDs(this.multipleSelection)
        this.memberStatus.ids = this.ids
      },

      // 批量设置状态
      massSettingSubmit() {
        console.log(this.memberStatus);
        if (this.memberStatus.status !== null) {
          batchExamineAPI(this.memberStatus).then(response => {
            if (response.data.code === 0) {
              this.getList()
              this.dialogPvVisible = false
              this.examDialog = false
              this.$message.success(`批量设置${this.multipleSelection.length}项成功`)
            } else {
              this.$message.error("批量设置失败")
            }
          })
          this.dialogPvVisible = false
        } else {
          this.$message.error("请选择批量设置状态后提交！")
        }
      },
      massSetting() {
        if (this.multipleSelection.length != 0) {
          this.memberStatus.operational = '1'
          this.dialogPvVisible = true
        } else {
          this.$message.warning("请先选择需要设置的内容")
        }
      },
      // 批量审核
      batchExamBtn() {
        if (this.multipleSelection.length != 0) {
          this.memberStatus.operational = '0'
          this.examDialog = true
        } else {
          this.$message.warning("请先选择需要设置的内容")
        }
      },

      printBtn(){
        console.log(this.list);
        if(this.list && this.list.length > 0){
          let obj = this.listQuery
          var test=this.baseUrl + '/member/bg/authenticate/export?token='+this.$store.state.user.token+'&'
          for(var prop in obj){
              if(obj[prop]||obj[prop] ===0){
                  test = test+prop+'='+obj[prop]+'&'
              }
          }
          test = test.substr(0,test.length-1)
          console.log(test);
          window.open(test,'_blank')
          this.$message.success("数据导出成功")
        }else{
            this.$message.error('当前暂无数据可供导出')
        }
      },

      

      // 批量删除
      // massDelete() {
      //   if (this.multipleSelection.length != 0) {
      //     this.$confirm("确定要删除选择的数据吗?", "提示", {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning"
      //     }).then(() => {
      //       batchDeleteAPI(this.ids).then(response => {
      //         if (response.data.code === 0) {
      //           this.getList()
      //           this.$message.success(`批量删除${this.multipleSelection.length}项成功`)
      //         } else {
      //           this.$message.error("批量删除失败")
      //         }
      //       })
      //     })
      //   } else {
      //     this.$message.warning("请先选择需要删除的内容")
      //   }
      // },

      // 单条删除
      singleDelete(id) {
        let ids = [id]
         confirm.apply(this,['确定要删除这条数据吗？']).then(() => {
          batchDeleteAPI(ids).then(res => {
            operationMsg.apply(this,[res.data.code,'删除'])
          })
        })
      },
      // 获取列表
      getList() {
        this.listLoading = true
        getListAPI(this.listQuery).then(response => {
          if (response.data.code === 0) {
            this.list = response.data.data.list || []
            this.total = response.data.data.total
          } else {
            this.$message.error("获取数据失败")
          }
          this.listLoading = false
        })
      },
      // 重置
      resetFilter() {
        this.listQuery = {
          pageNum: 1,
          status: null,
          pageSize: this.listQuery.pageSize,
          authenticationType:'', 
          authStatus: ''
        }
        this.time = null
        this.getList()
      },
      // 检索
      handleFilter() {
        store.dispatch('SetPersonMemberSerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        if (this.time) {
          this.listQuery.beginTime = this.time[0]
          this.listQuery.endTime = this.time[1]
        } else {
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }
        this.getList()
      },

      // 分页
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      },
      handleCurChange(val) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val)
      }
    }
  }
</script>

<style lang="less">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .query_button {
    border-radius: 5px;
  }

  
  .examie{
    .el-dialog{
      width: 520px;
    }
  }
  
</style>
