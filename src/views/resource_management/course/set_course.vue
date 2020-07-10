<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline class="form-inline">
        <el-form-item label="资源名称：" label-width="100px">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.videoName" clearable placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container">
      <div class="nav-buttons-container">
        <el-button icon="el-icon-download" @click="relation">关联内容</el-button>
        <el-button icon="el-icon-download" @click="cancel">批量取消</el-button>
      </div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList">
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="资源名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>视频</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
         <span v-if='scope.row.status === 0'>已录入</span>
         <span v-if='scope.row.status === 1'>已上架</span>
         <span v-if='scope.row.status === 2'>已下架</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-edit" title="修改排序" @click="edit(scope.row.id)"></i>
        </template>
      </el-table-column>
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
        <el-button  @click="editNum">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="关联资源" :visible.sync="dialogResourceVisible">
      <div class="filter-container">
        <el-form inline class="form-inline">
          <el-form-item label="资源名称：" label-width="100px">
            <el-input @keyup.enter.native="handleResourceFilter" v-model="resourceListQuery.videoName" clearable placeholder="请输入资源名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleResourceFilter">检索</el-button><el-button @click="resetResourceFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :key='resourceTableKey' :data="resourceList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="resourceSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column prop="date" label="资源名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="上传时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.status === 0'>已录入</span>
            <span v-if='scope.row.status === 1'>已上架</span>
            <span v-if='scope.row.status === 2'>已下架</span>
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
import { getRelationListAPI, canceleRelationAPI, editNumAPI, getNotRelationListAPI, relationAPI } from '@/api/resource/course'
import { requestMsg, confirm } from '@/utils/publicFunctions'

export default {
  data() {
    return {
      tableKey: 0,
      resourceTableKey:0,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 100
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
      resourceList:null,
      resourceSelection: [],
      resourceSelectionIDs: [],
    }
  },
  mounted() {
    this.dataId = this.$route.query.id;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.courseId = this.dataId
      getRelationListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else if(res.data.code === -2){
          this.$message.error(res.data.data);
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    cancel() {//批量取消关联
      if(this.isSelected()){
        confirm.apply(this,['确定要批量取消吗？']).then(() => {
          canceleRelationAPI(this.multipleSelectionIDs).then(res => {
            requestMsg.apply(this,[res.data,'批量取消'])
          })
        })
      }
    },
    relation() {//关联内容
      this.dialogResourceVisible = true
      this.listLoading = true
      this.resourceListQuery.courseId = this.dataId
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
      if(this.resourceIsSelect()){
        confirm.apply(this,['确认关联吗？']).then(() => {
          relationAPI({ids:this.resourceSelectionIDs,id:this.dataId}).then(res => {
            this.dialogResourceVisible = false
            requestMsg.apply(this,[res.data,'关联'])
          })
        })
      }
    },
    edit(id) {//修改排序号
      this.dialogVisible = true
      this.editId = id
    },
    editNum() {//确认修改
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          editNumAPI({num:this.editForm.num,id:this.editId}).then(res => {
            this.dialogVisible = false
            requestMsg.apply(this,[res.data,'修改'])
          })
        }
      })
    },
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
