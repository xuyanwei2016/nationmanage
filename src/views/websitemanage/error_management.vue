<template>
  <div class="app-container calendar-list-container inputCss">

    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('reviewbtn') >= 0" @click="massReview">{{authBtns.filter(i => i.idName=='reviewbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='reviewbtn').length>0 && authBtns.filter(i => i.idName=='reviewbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('reviewbtn')].icon, 'el-icon--right']"></i></el-button>

      <el-button v-if="authBtns.map(i => i.idName).indexOf('checkbtn') >= 0" @click="corrected">{{authBtns.filter(i => i.idName=='checkbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='checkbtn').length>0 && authBtns.filter(i => i.idName=='checkbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('checkbtn')].icon, 'el-icon--right']"></i></el-button>

    </div>
    <el-form inline>
      <el-form-item label="资源名称">
        <el-input @keyup.enter.native="handleFilter" clearable v-model="listQuery.title">
        </el-input>
      </el-form-item>
      <el-form-item label="资源类型">
        <el-select clearable v-model="listQuery.type" placeholder="资源类型">
          <el-option label="全部" value=""></el-option>
          <el-option label="电子书" :value="1"></el-option>
          <el-option label="文章" :value="2"></el-option>
          <el-option label="视频" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="commitTime" type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="年/月/日" end-placeholder="年/月/日"></el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-select clearable v-model="listQuery.status" placeholder="状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="未审核" :value="0"></el-option>
          <el-option label="已审核" :value="1"></el-option>
          <el-option label="已纠错" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @current-change="handleCurChange" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column min-width="150px" align="center" label="资源名称">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="纠错内容">
        <template slot-scope="scope">
          <el-popover
            ref="popover1"
            placement="top-start"
            width="200"
            trigger="hover"
            content="">
            {{scope.row.content}}
          </el-popover>
          <span v-popover:popover1>{{filterWord(scope.row.content,30)}}</span>
          <!-- <span>{{scope.row.content}}</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="资源类型" width="90">
        <template slot-scope="scope">
          <span>{{scope.row.type === 1 ? '电子书' : scope.row.type === 2 ? '文章' : '视频'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{scope.row.commitTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" style="color:#CC6600;">未审核</span>
          <span v-else-if="scope.row.status === 1" style="color:#008000;">已审核</span>
          <span v-else-if="scope.row.status === 2" style="color:rgba(22, 155, 213, 1);">已纠错</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='viewbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='viewbtn').length > 0" :title="authBtns.filter(i => i.idName=='viewbtn')[0].name" @click="checkDetail(scope.row.id)"></i><!--
          --><i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0" :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="查看纠错内容" :visible.sync="dialogFormVisible" width="40%" @close="close">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" disabled style='margin-right:20px;'>
        <el-form-item label="资源名称：" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="资源类型：" prop="type">
          <el-input v-if="temp.type === 1" value="电子书"></el-input>
          <el-input v-else-if="temp.type === 2" value="文章"></el-input>
          <el-input v-else-if="temp.type === 3" value="视频"></el-input>
        </el-form-item>
        <el-form-item label="纠错人：" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="提交时间：" prop="commitTime">
          <el-input v-model="temp.commitTime"></el-input>
        </el-form-item>
        <el-form-item label="审核状态：" prop="status">
          <el-input v-if="temp.status === 0" value="未审核"></el-input>
          <el-input v-else-if="temp.status === 1" value="已审核"></el-input>
          <el-input v-else-if="temp.status === 2" value="已纠错"></el-input>
        </el-form-item>
        <el-form-item label="纠错内容：" prop="content">
          <el-input type="textarea" :autosize="{ minRows: 2}" v-model="temp.content"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import { getData, deleteData, changeType, detailsAPI } from "@/api/website-management/errorCorrection";
import { operationMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'

export default {
  name: "complexTable",
  data() {
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        status: '',
        title: null,
        biginCommitTimeTime: null,
        endCommitTimeTime: null,
        type: ''
      },
      massQuery: {
        ids: [],
        status: null
      },
      temp: {
        commitTime: '',
        type: null,
        status: null,
        name: '',
        title: '',
        content: ''
      },
      commitTime: null,
      dialogFormVisible: false,
      dialogStatus: "",
      multipleSelection:[]
    };
  },
  mounted() {
    if( ifUndefined(store.getters.error_managementSerKeys.pageNum) ){
      this.listQuery = store.getters.error_managementSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.biginCommitTimeTime) || ifUndefined(this.listQuery.endCommitTimeTime)){
        this.commitTime = []
        this.commitTime[0] = this.listQuery.biginCommitTimeTime
        this.commitTime[1] = this.listQuery.endCommitTimeTime
      }
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
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
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection) : true
    },
    massReview(){
      if (this.multipleSelection.length!=0) {
        const unreviewed = this.multipleSelection.every(arg => arg.status === 0 )
        if (unreviewed) {
          confirm.apply(this,['确定标记为已审核状态?', '批量审核']).then(() => {
            this.massQuery.status = 1
            changeType(this.massQuery).then(res => {
              operationMsg.apply(this,[res.data.code,'审核'])
            })
          });
        } else {
          this.$message.warning('只能操作未审核数据！')
        }
      } else {
        this.$message.warning('请先选择需要审核的内容')
      }
    },
    corrected(){
      if (this.multipleSelection.length!=0) {
        const reviewed = this.multipleSelection.every(arg => arg.status === 1 )
        if (reviewed) {
          confirm.apply(this,['确定标记为已纠错状态?', '完成纠错']).then(() => {
            this.massQuery.status = 2
            changeType(this.massQuery).then(res => {
              operationMsg.apply(this,[res.data.code,'纠错'])
            })
          });
        } else {
          this.$message.warning('只能操作已审核数据！')
        }
      } else {
        this.$message.warning('请先选择需要操作的内容')
      }
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        status: '',
        title: null,
        biginCommitTimeTime: null,
        endCommitTimeTime: null,
        type: ''
      }
      this.commitTime = null
      this.getList()
    },
    handleFilter() {
      if (this.commitTime) {
        this.listQuery.biginCommitTimeTime = this.commitTime[0]
        this.listQuery.endCommitTimeTime = this.commitTime[1]
      } else {
        this.listQuery.biginCommitTimeTime = null
        this.listQuery.endCommitTimeTime = null
      }
      store.dispatch('SetErrorManagementSerKeys',this.listQuery).then(res => {
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
      confirm.apply(this,['确定要删除这条纠错吗?']).then(() => {
        deleteData(id).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      });
    },
    checkDetail(id) {
      this.dialogFormVisible = true;
      detailsAPI(id).then(res => {
        this.temp = res.data.data
      })
    },
    close() {
      this.getList()
    }
  }
};
</script>
<style>

</style>
