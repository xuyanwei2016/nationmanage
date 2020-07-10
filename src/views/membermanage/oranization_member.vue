<template>
  <div class="app-container calendar-list-container xyw">

    <div class="nav-buttons-container">
      <el-button  v-if="authBtns.map(i => i.idName).indexOf('resetbtn') >= 0" @click="singleReset">{{authBtns.filter(i => i.idName=='resetbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='resetbtn').length>0 && authBtns.filter(i => i.idName=='resetbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('resetbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('setbtn') >= 0" @click="massSetting">{{authBtns.filter(i => i.idName=='setbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='setbtn').length>0 && authBtns.filter(i => i.idName=='setbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('setbtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>
      <!-- <el-button v-if="authBtns.map(i => i.idName).indexOf('exportbtn') >= 0" @click="exportFile">{{authBtns.filter(i => i.idName=='exportbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportbtn').length>0 && authBtns.filter(i => i.idName=='exportbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportbtn')].icon, 'el-icon--right']"></i></el-button> -->
    </div>
    <el-form inline class="form-inline" :model="listQuery">
      <el-form-item label="会员名称">
        <el-input placeholder="会员名称"  v-model="listQuery.account"></el-input>
      </el-form-item>
      <el-form-item label="机构名称">
        <el-input placeholder="机构名称" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="会员状态">
        <el-select placeholder="全部" v-model="listQuery.status">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select placeholder="全部" v-model="listQuery.type">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="正式" :value="1"></el-option>
          <el-option label="试用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker v-model="time" value-format="yyyy-MM-dd" format="yyyy-MM-dd"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">检索</el-button>
        <el-button type="primary" @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="UID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员名称">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="机构名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="会员状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1" style="color: green">启用</span>
          <span v-else style="color: red;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type===1" style="color: green">正式</span>
          <span v-else style="color: red;">试用</span>
        </template>
      </el-table-column>
      <el-table-column width="280px" align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime }}</span><!-- | parseTime('{y}-{m}-{d} {h}:{i}') -->
        </template>
      </el-table-column>
      <el-table-column width="280px" align="center" label="到期时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span> <!-- | parseTime('{y}-{m}-{d} {h}:{i}') -->
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='viewbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='viewbtn').length > 0"  :title="authBtns.filter(i => i.idName=='viewbtn')[0].name" @click="viewUserInfo(scope.row)" ></i>
          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0"  :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)" ></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" disabled label-width="100px" style='margin-left:50px;' width="400">
        <el-form-item label="会员名称" prop="account">
          <el-col :span="11">
            <el-input v-model="temp.account" placeholder="请输入会员名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-col :span="11">
            <el-input v-model="temp.password" placeholder="请输入会员密码"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-col :span="11">
            <el-input v-model="temp.name" placeholder="请输入机构名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="会员状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员类型" prop="type">
          <el-select placeholder="正式" v-model="temp.type">
            <el-option v-for="adType in adTypes" :key="adType.value" :label="adType.label" :value="adType.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间" prop="createTime">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="temp.createTime" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="到期时间" prop="endTime">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="temp.endTime" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="查看资源权限" prop="relatedResourceTypes">
          <el-col :span="11">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="temp.relatedResourceTypes"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPvVisible" width="25%">
      <el-form :model="memberStatus" label-position="right" label-width="100px" style='margin-right:20px'>
        <el-form-item label="会员状态：">
          <el-radio-group v-model="memberStatus.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button class="form-submit" @click="massSettingSubmit">确定</el-button>
        <el-button class="form-submit" @click="dialogPvVisible = false">取消</el-button>
      </span>
      <!-- <template>
        状态：
        <el-radio-group v-model="memberStatus.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="massSettingSubmit">确定</el-button>
      </span> -->
    </el-dialog>

  </div>
</template>

<script>
  import { getListAPI, batchDeleteAPI, addAPI, searchMemberAPI, viewUserInfoAPI, deleteAPI, batchUpdateStastusAPI, batchResetCodeAPI, exportAPI } from "@/api/organization/organizitionMember"
  import {operationMsg} from "@/utils/publicFunctions"
  import {getMultipleSelectionIDs} from "@/filters/getIds"
  import queryString from 'query-string'
  import store from '@/store'

  export default {
    data() {
      const validateTitle = (rule, value, callback) => {
        if (value.replace(/\s+/g, "") == "") {
          callback(new Error("广告位名称必填"));
        } else {
          callback();
        }
      };
      const validatePrice = (rule, value, callback) => {
        let priceReg = /^(\d|[1-9]\d+)(.\d)?$/;
        if (!priceReg.test(value)) {
          callback(new Error("请输入价格数字，小数点最多1位"));
        } else {
          callback();
        }
      };
      const validateValue = (rule, value, callback) => {
        let reg = /^[a-zA-Z0-9]\w*$/;
        if (!reg.test(value)) {
          callback(new Error("请输入英文或数字开头，英文、数字、_组成的广告位代码"))
        } else {
          callback();
        }
      };
      return {
        authBtns: [],
        time: [],
        tableKey: 0,
        list: null,
        total: null,
        ids: [],
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          account: null,
          organName: null,
          status: null,
          type: null,
          createTime : null,
          endTime: null
        },
        value7: "",
        memberStatus: {
          id: [],
          status: 1
        },
        adTypes: [{value: 0, label: "试用"},{value: 1, label: "正式"}],
        temp: {
          account: null,
          name: "",
          type: 1,
          password: '',
          status: 1,
          createTime : "",
          endTime: "",
          code: null,
          relatedResourceTypes: null
        },
        dialogFormVisible: false,
        dialogPvVisible: false,
        dialogStatus: '',
        textMap: {
          view: '查看用户信息',
          setting: "设置状态"
        },
        rules: {
          type: [{required: true, message: "类型必选", trigger: "change"}],
          signTitle: [{ type: "string", required: true, trigger: "blur", validator: validateTitle }],
          signValue: [{ type: "string", required: true, trigger: "blur", validator: validateValue }],
          price: [{required: true, trigger: "blur", validator: validatePrice}],
          status: [{required: true, message: "状态必选", trigger: "blur"}]
        },
        multipleSelection: []
      };
    },
    mounted() {      
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
      this.getList();
    },
    methods: {
      exportFile() {
        let {pageNum, pageSize, ...params} = this.listQuery
        let tempParams = {}
        for (const key in params) {
          if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
            tempParams[key] = params[key]
          }
        }
        let paramStr = queryString.stringify(tempParams)
        paramStr ? window.open(`${process.env.BASE_API}${requestPath.common}/organmember/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.common}/organmember/export`)
      },
      handleCurChange(val) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val);
      },
      resetFilter() {
        this.listQuery = {
          pageNum: 1,
          pageSize: this.listQuery.pageSize,
          account: "",
          name: "",
          status: null,
          type: null,
          createTime : null,
          endTime: null,
          code: null
        };
        this.time = null
        this.getList();
      },
      // 批量设置状态
      massSettingSubmit() {
        batchUpdateStastusAPI(this.memberStatus).then(res => {
          operationMsg.apply(this,[res.data.code,`批量设置${this.multipleSelection.length}项`])
          res.data.status ? this.dialogPvVisible = false : true
        })
      },
      
      massSetting() {
        if (this.multipleSelection.length != 0) {
          this.dialogStatus = "setting";
          this.dialogPvVisible = true;
        } else {
          this.$message.warning("请先选择需要设置的内容")
        }
      },
      // 批量删除
      massDelete() {
        if (this.multipleSelection.length != 0) {
          this.$confirm("确定要删除选择的数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            batchDeleteAPI(this.ids).then(res => {
              operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
            })
          });
        } else {
          this.$message.warning("请先选择需要设置的内容")
        }
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.ids = getMultipleSelectionIDs(this.multipleSelection);
        this.memberStatus.id = this.ids;
      },
      // 获取列表 
      getList() {
        this.listLoading = true
        getListAPI(this.listQuery).then(res => {
          console.log(res);
          
          if (res.data.code === 0) {
            this.list = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error("获取数据失败")
          }
          this.listLoading = false
        })
      },
      // 检索
      handleFilter() {
        store.dispatch('SetOrgMemberSerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        if (this.time) {
          this.listQuery.beginTime  = this.time[0];
          this.listQuery.endtime = this.time[1];
        } else {
          this.listQuery.beginTime  = null;
          this.listQuery.endtime = null
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
      // 单条删除
      singleDelete(id) {
        this.$confirm("确定要删除选择的会员吗?", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "warning"
        }).then(() => {
          batchDeleteAPI([id]).then(res => {
            operationMsg.apply(this, [res.data.code, "删除"]);
          });
        });
      },

      // 批量重置密码
      singleReset() {
        if (this.multipleSelection.length != 0) {
          this.$confirm("确定初始化用户密码吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning",
          }).then(() => {
            batchResetCodeAPI(this.ids).then(res => {
              operationMsg.apply(this, [res.data.code, "重置"])
            })
          });
        } else {
          this.$message.warning("请先选择需要设置的内容")
        }
      },
      // 查看当前信息
      viewUserInfo(row) {
        // this.temp = Object.assign({}, row); // copy obj
        searchMemberAPI(row.id).then(res => {
          console.log(res,'vvvvvvvv');
          this.temp = res.data.data
        })
        this.dialogStatus = "view";
        this.dialogFormVisible = true;
      },

      updateData() {
        document.getElementsByClassName("form-submit").disabled = true;
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            getListAPI(tempData).then(res => {
              operationMsg.apply(this, [res.data.code, '广告位更新'])
              res.data.status ? this.dialogFormVisible = false : true
              document.getElementsByClassName("form-submit").disabled = false;
            })
          }
        });
      }
    }
  };
</script>

<style scoped>
  /* .el-message-box__wrapper .el-message-box__btns button:nth-child(2) {
    float: left;
    margin-left: 115px;
  }

  .el-message-box__wrapper .el-message-box__btns button:nth-child(1) {
    margin-right: 115px;
  } */

  .el-dialog__body .el-form-item--medium .el-form-item__content .el-col .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #606266;
    /* color: #c0c4cc; */
    cursor: not-allowed;
  }

  .el-radio__input.is-disabled + span.el-radio__label {
    /* color: #c0c4cc; */
    cursor: not-allowed;
    color: #606266;
  }

  .el-select .el-input.is-disabled .el-input__inner {
    cursor: not-allowed;
    color: #606266;
  }

  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #606266;
    cursor: not-allowed;
  }

  .el-form--inline .el-form-item {
    margin-right: 0px !important;
  }

  /* .xyw .filter-container .el-form--inline .el-form-item--medium .el-form-item__content .el-button:not(:last-child) {
    margin-right: 10px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  } */

</style>
