<template>
  <div class="app-container calendar-list-container">
    <router-link :to="{ path:`courseManage`}"><el-button icon="el-icon-back">返回</el-button></router-link>

    <div class="filter-right">
      <el-form inline class="form-inline">
        <el-form-item label="资源名称：" label-width="100px">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container m-top">
      <div class="nav-buttons-container">
        <el-button icon="el-icon-download" @click="relation">关联内容</el-button>
        <el-button icon="el-icon-download" @click="cancel">批量取消</el-button>
      </div>
    </div>

    <el-table :key='tableKey'  ref="dragTable" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList">
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
      <!--<el-table-column prop="sort" label="资源11名称" align="center"></el-table-column>-->

      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>视频</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" prop="realPrice"></el-table-column>
       <el-table-column prop="sort" label="排序号" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
         <span>{{statusObj[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-edit" title="修改排序" @click="edit(scope.row.id)"></i>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="修改排序号" :visible.sync="dialogVisible">
      <el-form inline class="form-inline" :model="editForm" ref="editForm" :rules="rules" label-position="right" label-width="120px">
        <el-form-item label="排序号：" prop="num">
          <el-input v-model="editForm.num" clearable placeholder="请输入排序号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button  @click="editNum">确定</el-button> -->
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="关联资源" :visible.sync="dialogResourceVisible" class="width800">
      <div class="filter-container">
        <el-form inline class="form-inline">
          <el-form-item label="资源名称：" label-width="100px">
            <el-input @keyup.enter.native="handleResourceFilter" v-model="resourceListQuery.name" clearable placeholder="请输入资源名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleResourceFilter">检索</el-button><el-button @click="resetResourceFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :key='resourceTableKey' :data="resourceList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="resourceSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="资源名称" align="center" min-width="200"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" align="center" width="200"></el-table-column>
        <el-table-column prop="date" label="状态" align="center" width="100">
          <template slot-scope="scope">
            <span>{{statusObj[scope.row.status]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="resourceCurrentChange" :current-page="resourceListQuery.pageNum" layout="total, prev, pager, next, jumper" :total="resourceTotal" align="center">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resourceConfirm">确定</el-button>
        <el-button @click="dialogResourceVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { getRelationListAPI, canceleRelationAPI, editNumAPI ,getNotRelationListAPI, relationAPI} from '@/api/medicalTreatment/courseManage'
import { requestMsg, confirm ,deBonce} from '@/utils/publicFunctions'
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      statusObj:{
          '1':'待审核',
          '2':'审核通过',
          '3':'审核不通过',
          '4':'已上架',
          '5':'已下架'
      },
      sortable: null,
      oldList: [],
      newList: [],
      nextSort:1110,
      preSort:0,

      tableKey: 0,
      resourceTableKey:0,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        name:'',
        sort:1
      },
      dialogVisible: false,
      uploading: false,
      multipleSelection: [],
      multipleSelectionIDs: [],
      dataId: '',
      editId:'',
      editForm:{},
      rules:{
        num:[
          { pattern:/^\d{1,50}$/,trigger: 'change',message:'请输入正确的排序号' }
        ],
      },
      dialogResourceVisible:false,
      resourceList:[],
      resourceListQuery: {
        pageNum: 1,
        pageSize: 10
      },
      resourceTotal:null,
      resourceSelection: [],
      resourceSelectionIDs: [],
      fn:null,
    }
  },
  inject:['reload'],
  mounted() {
    this.dataId = this.$route.query.id;
    this.getList();
    this.fn = deBonce(()=>{
      if(this.resourceIsSelect()){
        // confirm.apply(this,['确认关联吗？']).then(() => {
          let data = {
            ids:this.resourceSelectionIDs,
            courseId:this.dataId,
            memberId:this.$route.query.memberId
          }
          relationAPI(data).then(res => {
            this.dialogResourceVisible = false
            requestMsg.apply(this,[res.data,'关联'])
          })
        // })
      }
    },500)
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.courseId = this.dataId
      getRelationListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          let data = res.data.data
          console.log(data);
          this.list = data.list
          this.nextSort = data.nextPageSort
          this.preSort = data.prePageSort
          this.total =data.total

          this.oldList = this.list.map(v => v.id)
          this.newList = this.oldList.slice()
          this.$nextTick(() => {
            this.setSort()
          })

        } else if(res.data.code === -2){
          this.$message.error(res.data.data);
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },

    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          let len = this.list.length
          let pre = 0
          let next = 0
          if(evt.oldIndex === evt.newIndex) return
          if(evt.newIndex ===0){
            pre = this.preSort
            next = this.list[evt.newIndex].sort
          }else if(evt.newIndex === len-1){
            pre = this.list[evt.newIndex].sort
            next = this.nextSort
          }else{
            pre = this.list[evt.newIndex].sort
            next = this.list[evt.newIndex+1].sort
          }
          let data = {
            id:this.list[evt.oldIndex].rowId,
            sort: (pre + next)/2
          }
          editNumAPI(data).then(res=>{
            if(res.data.code == 0){
              this.reload()
              this.getList()
            }
          })
        }
      })
    },


    cancel() {//批量取消关联
      let data = {
        courseId:this.dataId,
        ids:this.multipleSelectionIDs
      }
      if(this.isSelected()){
        confirm.apply(this,['确定要批量取消吗？']).then(() => {
          canceleRelationAPI(data).then(res => {
            requestMsg.apply(this,[res.data,'批量取消'])
          })
        })
      }
    },
    relation() {//关联内容
      this.dialogResourceVisible = true
      this.listLoading = true
      this.resourceListQuery.courseId = this.dataId
      this.resourceListQuery.memberId=this.$route.query.memberId
      getNotRelationListAPI(this.resourceListQuery).then(res => {
        if(res.data.code === 0){
          this.resourceList = res.data.data.list
          this.resourceTotal = res.data.data.total
        } else if(res.data.code === -2){
          this.$message.error(res.data.data);
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    resourceConfirm() {//确认关联
    // console.log(this.fn);
      this.fn()
      // if(this.resourceIsSelect()){
      //   // confirm.apply(this,['确认关联吗？']).then(() => {
      //     relationAPI({ids:this.resourceSelectionIDs,courseId:this.dataId}).then(res => {
      //       this.dialogResourceVisible = false
      //       requestMsg.apply(this,[res.data,'关联'])
      //     })
      //   // })
      // }
    },
    edit(id) {//修改排序号
      this.dialogVisible = true
      this.editId = id
    },
    // editNum() {//确认修改
    //   this.$refs['editForm'].validate((valid) => {
    //     if (valid) {
    //       editNumAPI({num:this.editForm.num,id:this.editId}).then(res => {
    //         this.dialogVisible = false
    //         requestMsg.apply(this,[res.data,'修改'])
    //       })
    //     }
    //   })
    // },
    chioceList(val) {
      this.multipleSelection = val;
      this.multipleSelectionIDs = getMultipleSelectionIDs(val)
    },
    isSelected(){
      if (this.multipleSelectionIDs.length <= 0){
        this.$message('已选不能为空')
        return false
      }
      return true
    },
    resourceIsSelect() {
      if (this.resourceSelectionIDs.length <= 0){
        this.$message('已选不能为空')
        return false
      }
      return true
    },
    resourceSelectionChange(val){
      this.resourceSelection = val;
      this.resourceSelectionIDs = getMultipleSelectionIDs(val)
    },
    handleFilter(){
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: 100
      }
      this.getList()
    },
    handleResourceFilter() {
      this.resourceListQuery.pageNum = 1
      this.relation()
    },
    resetResourceFilter() {
      this.resourceListQuery = {
        pageNum: 1,
        pageSize: 10
      }
      this.relation()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    resourceCurrentChange(val) {
      this.resourceListQuery.pageNum = val
      this.relation()
    },
  }
}
</script>

<style lang="less" scoped>
.filter-right{
  position: absolute;
  right: 40px;
  top: 120px;
}
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
.m-top{
  margin-top: 20px;
}
</style>

<style lang="less">
.width800{
  .el-dialog{
    width: 800px;
  }
}
</style>
