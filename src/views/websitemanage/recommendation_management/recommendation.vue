<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="nav-buttons-container">
        <el-button class="filter-item" icon="el-icon-edit" @click="recommend">推荐内容</el-button>
        <el-button class="filter-item" icon="el-icon-edit" @click="edit">修改排序</el-button>
        <el-button class="filter-item" icon="el-icon-close" @click="cancel">批量取消</el-button>
      </div>

      <el-form inline class="form-inline">
        <el-form-item label="资源类型">
          <el-select @keyup.enter.native="handleFilter" v-model="listQuery.goodsType" placeholder="请选择资源类型">
            <el-option :label="item" :value="val" v-for='(item,val) in listStatus' :key="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @selection-change="chioceList">
      <el-table-column align="center" type="selection" > </el-table-column>
      <el-table-column type="index"  label="序号" width="50" align="center"></el-table-column>
      <el-table-column align="center" label="推荐内容标题">
        <template slot-scope="scope">
          <span>{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序号">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加人">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.typeName}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
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

    <el-dialog title="推荐内容" :visible.sync="dialogResourceVisible">
      <div class="filter-container">
        <el-form inline class="form-inline">
          <el-form-item label="商品分类" label-width="100px">
            <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
              <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
              <el-select v-model="resourceListQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="请选择">
                <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>
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
        <el-table-column prop="date" label="资源名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="上传时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="作者" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.author}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.bookstatus === 0'>下架</span>
            <span v-if='scope.row.bookstatus === 1'>上架</span>
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
import { getListAPI, statusAPI, batchCancelAPI, editAPI, getRecommendListAPI, relationAPI, getOptionAPI, getNavAPI } from '@/api/website-management/recommend'
import { parseTime } from '@/utils'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { requestMsg, confirm } from '@/utils/publicFunctions'


export default {
  data() {
    return {
      tableKey: 0,
      resourceTableKey:0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
      },
      listStatus:'',
      id: '',
      multipleSelection: [],
      multipleSelectionIDs: [],
      dialogVisible: false,
      editForm:{},
      rules:{
        num:[
          { pattern:/^\d{1,50}$/,trigger: 'change',message:'请输入正确的排序号' }
        ],
      },
      dialogResourceVisible: false,
      resourceTotal:0,
      resourceList:[],
      resourceListQuery: {
        pageNum: 1,
        pageSize: 10,
        code: null
      },
      goodsSelection: [],
      goodsSelectionIDs: [],
      newList: [],
      popoverVisible: false,
      navTree: [],
      options: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.getList()
    this.getListStatus()
    this.getNav()
    this.getOption()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.pid = this.id
      getListAPI(this.listQuery).then(res => {
        this.list = res.data.data.list
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    getListStatus() {//获取类型
      statusAPI().then(res => {
        if(res.data.code === 0){
          this.listStatus = res.data.data;
        }else{
          this.message.error('获取数据失败');
        }
      })
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败');
      })
    },
    checkChange(data, obj){
      this.resourceListQuery.code = data.code
      this.popoverVisible = false
    },
    clearCheckedKeys(){
      this.$refs.searchTree.setCheckedKeys([])
    },
    getOption(){
      getOptionAPI().then(res => {
        if (res.data.code === 0) {
          this.options = res.data.data
        } else {
          this.$message.error(`获取分类选择器选项失败`);
        }
      })
    },
    cancel() {//批量取消
      if(this.isSelected()){
        confirm.apply(this,['确定要批量取消吗？']).then(() => {
          batchCancelAPI(this.multipleSelectionIDs).then(res => {
            requestMsg.apply(this,[res.data,'批量取消'])
          })
        })
      }
    },
    edit() {//修改
      if(this.isOneList()){
        this.dialogVisible = true
      }
    },
    editNum() {//修改排序号
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          // confirm.apply(this,['确定要修改排序号吗？']).then(() => {
            editAPI({id:this.multipleSelectionIDs[0],num:this.editForm.num}).then(res => {
              res.data.code === 0 ? this.dialogVisible = false : true
              requestMsg.apply(this,[res.data,'修改'])
            })
          // })
        }
      })
    },
    recommend() {//推荐内容
      this.dialogResourceVisible = true
      this.listLoading = true
      getRecommendListAPI(this.resourceListQuery).then(res => {
        console.log(res);
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
    resourceConfirm() {//确认推荐
      if(this.resourceIsSelect()){
        this.goodsSelection.map((i,v) => {
          this.newList.push({
            goodsId:i.pbookid,
            goodsName:i.name,
            goodsType:i.booktype
          })
        })
        relationAPI({array:this.newList,id:this.id}).then(res => {
          this.dialogResourceVisible = false
          requestMsg.apply(this,[res.data,'操作'])
          this.getList()
          this.newList = [];
        })
      }
    },
    chioceList(val) {
      this.multipleSelection = val;
      this.multipleSelectionIDs = getMultipleSelectionIDs(val)
    },
    isSelected(){
      if (this.multipleSelectionIDs.length <= 0){
        this.$message.warning('已选不能为空')
        return false
      }
      return true
    },
    isOneList(){
      if (this.multipleSelectionIDs.length != 1){
        this.$message.warning('请选择一条数据进行修改')
        return false
      }
      return true
    },
    resourceIsSelect(){
      if (this.goodsSelectionIDs.length <= 0){
        this.$message.warning('已选不能为空')
        return false
      }
      return true
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
      this.recommend()
    },
    resetResourceFilter() {
      this.resourceListQuery = {
        pageNum: 1,
        pageSize: 10
      }
      this.recommend()
    },
    resourceSelectionChange(val) {
      this.goodsSelection = val;
      this.goodsSelectionIDs = getMultipleSelectionIDs(val)
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resourceCurrentChange(val){
      this.resourceListQuery.pageNum = val
      this.recommend()
    }
  }
}
</script>
