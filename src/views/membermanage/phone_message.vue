<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <div class="nav-buttons-container">
          <el-button v-waves icon="el-icon-message" @click="dialogFormVisible = true">发送短信</el-button>
          <el-button v-waves icon="el-icon-delete" @click="corrected">批量删除</el-button>
      </div>
      <el-form inline class="form-inline">
        <el-form-item label="短信内容">
          <el-input @keyup.enter.native="handleFilter" style="width: 180px;" clearable v-model="listQuery.title">
          </el-input>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-col :span="11">
            <el-date-picker type="date" v-model="listQuery.biginCommitTimeTime" value-format="yyyy-MM-dd" placeholder="年/月/日" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">至</el-col>
          <el-col :span="11">
            <el-date-picker type="date" v-model="listQuery.endCommitTimeTime" value-format="yyyy-MM-dd" placeholder="年/月/日" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button style="margin-left: 10px;" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @current-change="handleCurChange" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column min-width="150px" align="center" label="短信内容">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="接收会员">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="发送时间">
        <template slot-scope="scope">
          <span>{{scope.row.commitTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送状态" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" style="color:#008000;">成功</span>
          <span v-else style="color:#CC6600;">失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,15,20, 30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="发送短信" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" style='margin-right:20px;'>
        <el-form-item label="收信人选择：" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio :label="0">全部会员</el-radio>
            <el-radio :label="1">指定会员组</el-radio>
            <el-radio :label="2">指定会员</el-radio>
            <el-radio :label="3">指定手机号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.type===1" label="选择会员组：" prop="memberType">
          <el-checkbox-group v-model="temp.memberType">
            <el-checkbox label="1">个人会员</el-checkbox>
            <el-checkbox label="2">机构会员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="temp.type===2" label="已选择会员：" prop="name">
          <el-col :span="12">
            <el-input v-model="temp.name"></el-input>
          </el-col>
          <!-- <el-col :span="12" style="padding-left:15px;">
            <el-button>选择会员</el-button>
          </el-col> -->
        </el-form-item>
        <el-form-item v-if="temp.type===3" label="输入手机号：" prop="phoneNumber">
          <el-col :span="12">
            <el-input v-model="temp.phoneNumber"></el-input>
          </el-col>
          <el-col :span="12" style="padding-left:15px;">多个手机号请用 英文逗号(,)分隔</el-col>
        </el-form-item>
        <el-form-item label="短信内容：" prop="content">
          <el-col :span="16">
            <el-input type="textarea" :autosize="{ minRows: 7}" v-model="temp.content"></el-input>
          </el-col>
          <el-col :span="8" style="padding-left:15px;">
            可用标签：{$UserName} -用户名<br>{$RealName} -姓名<br>{$Sex} -先生或是女士<br>{$SiteName} -网站名称<br>{$SendTime} -发送时间<br>{$SendDate} -发送日期
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button class="form-submit">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getData, deleteData, changeType } from "@/api/website-management/errorCorrection";
import waves from "@/directive/waves"; // 水波纹指令
import {operationMsg} from '@/utils/publicFunctions'
import {getMultipleSelectionIDs} from '@/filters/getIds'

export default {
  name: "complexTable",
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        status: null,
        title: null,
        biginCommitTimeTime: null,
        endCommitTimeTime: null,
        type: null
      },
      massQuery: {
        ids: [],
        status: null
      },
      temp: {
        commitTime: '',
        type: 0,
        status: null,
        name: '',
        memberType:[],
        title: '',
        content: ''
      },
      dialogFormVisible: false,
      dialogStatus: "",
      multipleSelection:[]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleCurChange(val){
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val)
      },
    getList() {
      this.listLoading = true;
      getData(this.listQuery).then(res => {
        console.log(res)
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          console.log(res.data.data)
          this.$message.error('获取数据失败');
        }
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection)
      console.log(this.massQuery)
    },
    massReview(){
      if (this.multipleSelection.length!=0) {
        const unreviewed = this.multipleSelection.every(arg => arg.status === 0 )
        if (unreviewed) {
          this.$confirm('确定标记为已审核状态?', '批量审核', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.massQuery.status = 1
            changeType(this.massQuery).then(res => {
              operationMsg.apply(this,[res.data.code,'审核'])
            })
          });
        } else {
          this.$message({
            message: '只能操作未审核数据！',
            type: 'warning'
          });
        }
      } else {
        this.$message({
          message: '请先选择需要审核的内容',
          type: 'warning'
        });
      }
    },
    corrected(){
      if (this.multipleSelection.length!=0) {
        const unreviewed = this.multipleSelection.every(arg => arg.status === 1 )
        if (unreviewed) {
          this.$confirm('确定标记为已纠错状态?', '完成纠错', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.massQuery.status = 2
            changeType(this.massQuery).then(res => {
              operationMsg.apply(this,[res.data.code,'纠错'])
            })
          });
        } else {
          this.$message({
            message: '只能操作已审核数据！',
            type: 'warning'
          });
        }
      } else {
        this.$message({
          message: '请先选择完成纠错的内容',
          type: 'warning'
        });
      }
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        status: null,
        title: null,
        biginCommitTimeTime: null,
        endCommitTimeTime: null,
        type: null
      }
      this.getList()
    },
    handleFilter() {
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
      this.$confirm('确定要删除这条纠错吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(id).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      });
    },
    checkDetail(row){
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.dialogFormVisible = true
    }
  }
};
</script>
<style>

</style>
