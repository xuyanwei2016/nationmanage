<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchExamineBtn') >= 0" @click="batchExamine"> {{authBtns.filter(i => i.idName=='batchExamineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchExamineBtn').length>0 && authBtns.filter(i => i.idName=='batchExamineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchExamineBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDeleteBtn') >= 0" @click="batchDeleteBtn"> {{authBtns.filter(i => i.idName=='batchDeleteBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchDeleteBtn').length>0 && authBtns.filter(i => i.idName=='batchDeleteBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDeleteBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="用户名">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.userName" clearable></el-input>
      </el-form-item>
      <el-form-item label="检索内容">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.content" clearable placeholder="评论/资源名称"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select @keyup.enter.native="handleFilter" v-model="listQuery.status" placeholder="请选择出库类型">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item" :value="val" v-for='(item,val) in status' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="用户名" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="评分" width="150" align="center">
        <template slot-scope="scope">
          <!-- <el-rate v-model="scope.row.score" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate> -->
          <el-rate v-model="scope.row.score" disabled text-color="#ff9900"></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="评论内容" min-width="200" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.essence  == '1'" style="color: red;">[精彩]</span>
          <el-popover
            ref="popover1"
            placement="top-start"
            width="200"
            trigger="hover"
            content="">
            {{scope.row.content}}
          </el-popover>
          <span v-popover:popover1>{{filterWord(scope.row.content,30)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.resourceName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源类型" width="130" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.resourceClass_zh}}</span>
        </template>
      </el-table-column>

      <el-table-column label="资源来源" min-width="140" align="center" prop="accessMedium">
        <!--<template slot-scope="scope">
          &lt;!&ndash;<span>{{scope.row.releaseTime}}</span>&ndash;&gt;
        </template>-->
      </el-table-column>
      <el-table-column label="评论时间" min-width="140" align="center">

        <template slot-scope="scope">
          <span>{{scope.row.releaseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="待审核信息" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.notReview}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{status[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" width="80" label="操作"  align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`resource/review`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='review').length > 0"><i :class="authBtns.filter(i => i.idName=='review')[0].icon" :title="authBtns.filter(i => i.idName=='review')[0].name"></i></router-link>
          <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0" @click="deleteBtn(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="450px" title="审核操作">
      <el-form>
        <el-form-item label="审核：" >
          <el-radio v-model="reviewStatus" label="1">审核通过</el-radio>
          <el-radio v-model="reviewStatus" label="2">审核不通过</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataReview">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getListAPI, batchExamineAPI, batchDeleteAPI, deleteAPI } from '@/api/society-manage/resource'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { mapGetters } from 'vuex'
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
        pageSize: 100,
        status: null,
        nationsType: this.$store.getters.getNation
      },
      batchList: [],
      readType: null,
      status:[ //0未审核，1已通过，2未通过
        '未审核',
        '已通过',
        '未通过'
      ],
      reviewStatus:'1',
      dialogVisible:false,
      resourceType:[
        '全部',
        '理论',
        '药物',
        '方剂',
        '临床',
        '医案',
        '文化',
        '机构',
        '医论',
        '其他',
        '医著'
      ]
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
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
    deleteBtn(id){//单条删除
      confirm.apply(this,['确定要删除吗？']).then(() => {
        deleteAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
          this.getList()
        })
      })
    },
    batchDeleteBtn(){//批量删除--不能删除已上架的资源
      if(this.batchList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const ids = getMultipleSelectionIDs(this.batchList);
        confirm.apply(this,['确认删除吗？']).then(() => {
          batchDeleteAPI(ids).then(res => {
            requestMsg.apply(this,[res.data,'删除'])
            this.getList()
          })
        })
      }
    },
    batchExamine(){//批量审核 ---待审核状态
      if(this.batchList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{ //待审核状态
        const status = this.batchList.every(el => el.status == 0)
        if(status) {
          this.dialogVisible = true
        } else{
          this.$message.error('只有未审核状态数据才能进行审核哦');
        }
      }
    },
    updataReview() {//审核
      const ids = getMultipleSelectionIDs(this.batchList);
        const data ={
          ids:ids,
          status:this.reviewStatus
        }
        this.dialogVisible = false
        batchExamineAPI(data).then(res => {
          if(res.data.code === 0){
            this.$message.success('审核成功');
            this.getList();
          } else {
            this.$message.error('审核失败');
          }
        })
    },
    chioceList(val) {//勾选
      this.batchList = val;
    },
    handleFilter(){
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){//重置
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        nationsType:  this.listQuery.nationsType
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

<style scoped>
.el-tabs__header,.el-tabs--card>.el-tabs__header{
  border: 0;
  margin-bottom: 0;
}
.aa{
  margin-left: 80px;
}
.aa input{
  height: 30px;
}
.dialog-footer {
  margin-top: 0px;
}
</style>
