<template>
  <div class="app-container calendar-list-container">
    <h3>促销组：{{saleGroup.name}}</h3>
    <div class="nav-buttons-container">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <el-button icon="el-icon-circle-plus" @click="handleCreate">添加图书</el-button>
      <el-button icon="el-icon-delete" @click="massDelete">批量删除</el-button>
      <el-button @click="batchDiscount">批量折扣</el-button>
    </div>

    <el-form inline>
      <el-form-item label="商品分类">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
          <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
          <el-select v-model="listQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="书代号">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.bookNo" clearable></el-input>
      </el-form-item>
      <el-form-item label="ISBN">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.isbn" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" stripe element-loading-text="给我一点时间" border highlight-current-row>
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="商品名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="ISBN号" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isbn}}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" min-width="75" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣" min-width="65" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.discount!==0">{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="版次" min-width="65" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.revision}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出版时间" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.publishTime">{{scope.row.publishTime.slice(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" min-width="70" align="center">
        <template slot-scope="scope">
          <i class="el-icon-edit" title="折扣" @click="singleDiscount(scope.row)"></i>
          <i class="el-icon-delete" title="删除" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="添加促销商品" :visible.sync="dialogFormVisible">
      <el-form inline>
        <el-form-item label="商品分类">
          <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="goodsVisible" @show="clearGoodsCheckedKeys">
            <el-tree :data="navTree" ref="goodsTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
            <el-select v-model="goodsQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearGoodsCheckedKeys" placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
            </el-select>
          </el-popover>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsQuery.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="书代号">
          <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsQuery.bookNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsQuery.isbn" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleGoodsFilter">检索</el-button><el-button @click="resetGoodsFilter">重置</el-button>
        </el-form-item>
        <el-form-item><span style="color: #E59728;">已在本促销组下的商品将不显示在下方的列表中</span></el-form-item>
      </el-form>

      <el-table :key='1' stripe :data="goods.list" v-loading="goods.listLoading" element-loading-text="给我一点时间" border highlight-current-row ref="goodsTable" @selection-change="goodsSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column label="商品名称" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="ISBN号" min-width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isbn}}</span>
          </template>
        </el-table-column>
        <el-table-column label="书代号" min-width="65" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.bookNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="作者" min-width="55" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.author}}</span>
          </template>
        </el-table-column>
        <el-table-column label="出版时间" min-width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.publishTime">{{scope.row.publishTime.slice(0,10)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="handleGoodsChange" :current-page.sync="goodsQuery.pageNum" :page-size="10" layout="total, prev, pager, next" :total="goods.total" align="center"></el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="selectSubmit">确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置折扣" :visible.sync="dialogPvVisible" width="30%">
      <el-form ref="dataForm" label-position="right" label-width="110px" style='margin-right:20px;'>
        <el-form-item label="促销折扣：" :rules="{ required: true, trigger: 'change', message: '未填写' }">
          <el-input-number v-model="batchData.discount" :precision="1" :step="0.1" :min="0.1" :max="10"></el-input-number> 折
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="discountSubmit" >确认</el-button>
        <el-button @click="dialogPvVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getNavAPI, getOptionAPI } from '@/api/book-infomation/package'
import { getInfoAPI, getListAPI, addAPI, deleteAPI, setDiscountAPI, getGoodsAPI } from '@/api/marketing-management/saleManagement'
import {operationMsg, confirm} from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      groupId: this.$route.query.id,
      listQuery: {
        promotionId: this.$route.query.id,
        code: null,
        pageNum: 1,
        pageSize: 100
      },
      batchData: {
        discount: 10,
        oids: []
      },
      goodsId: [],
      saleGroup: {},
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      options: [],
      popoverVisible: false,
      goodsVisible: false,
      goods: {
        list: null,
        total: null,
        listLoading: true,
      },
      goodsQuery: {},
      dialogFormVisible: false,
      dialogPvVisible: false,
      goodsSelection: [],
      multipleSelection:[]
    };
  },
  mounted() {
    this.getInfo()
    this.getList()
    this.getNav()
    this.getOption()
  },
  methods: {
    selectSubmit(){
      if (this.goodsSelection.length>0) {
        let tempData = this.goodsSelection.map(book => {
          const { pbookid: bookId, ...temp } = book
          return {bookId, discount: 0, ...temp}
        })
        addAPI(tempData, this.groupId).then(res => {
          operationMsg.apply(this,[res.data.code,`添加${this.goodsSelection.length}项商品`])
          res.data.code === 0 ? this.dialogFormVisible = false : true
        })
      } else {
        this.$message.warning('请先选择需要操作的条目')
      }
    },
    handleCreate(){
      this.resetGoodsFilter()
      this.dialogFormVisible = true
    },
    discountSubmit(){
      // console.log(this.batchData.discount);
      let len = this.batchData.oids.length
      setDiscountAPI(this.batchData).then(res => {
        operationMsg.apply(this,[res.data.code,`设置${len}项折扣`])
        res.data.code === 0 ? this.dialogPvVisible = false : true
      })
    },
    batchDiscount(){
      if(this.multipleSelection.length>0){
        this.batchData.discount = 10
        this.dialogPvVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      } else {
        this.$message.warning('请先选择需要操作的条目')
      }
    },
    singleDiscount(row){
      console.log(row.discount);
      row.discount === 0 ? this.batchData.discount = 10 : this.batchData.discount = row.discount
      // this.batchData.discount = row.discount
      this.batchData.oids = [row.id]
      this.dialogPvVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    singleDelete(id){
      confirm.apply(this,['确定要删除选择的推荐商品吗?']).then(() => {
        deleteAPI([id], this.groupId).then(res => {
          operationMsg.apply(this,[res.data.code,`删除`])
        })
      })
    },
    massDelete(){
      if(this.multipleSelection.length>0){
        confirm.apply(this,['确定要删除选择的推荐商品吗?']).then(() => {
          deleteAPI(this.batchData.oids, this.groupId).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
          })
        })
      } else {
        this.$message.warning('请先选择需要删除的条目')
      }
    },
    goodsSelectionChange(val){
      this.goodsSelection = val
    },
    resetGoodsFilter(){
      this.goodsQuery = {
        promotionId: this.groupId,
        code: null,
        pageNum: 1,
        pageSize: 10
      }
      this.getGoods()
    },
    handleGoodsFilter() {
      this.goodsQuery.pageNum = 1;
      this.getGoods();
    },
    handleGoodsChange(val){
      this.goodsQuery.pageNum = val
      this.getGoods()
    },
    getGoods() {
      this.goods.listLoading = true;
      getGoodsAPI(this.goodsQuery).then(res => {
        if(res.data.code === 0){
          this.goods.list = res.data.data.list
          this.goods.total = res.data.data.total
        } else {
          this.$message.error('获取商品失败')
        }
        this.goods.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.batchData.oids = getMultipleSelectionIDs(this.multipleSelection) : true
    },
    // checkChange、clearCheckedKeys搜索单选树
    checkChange(data, obj){
      // let [code] = obj.checkedKeys
      if (this.popoverVisible) {
        this.listQuery.code = data.code
        this.popoverVisible = false
      } else {
        this.goodsQuery.code = data.code
        this.goodsVisible = false
      }
    },
    clearCheckedKeys(){
      this.$refs.searchTree.setCheckedKeys([])
    },
    clearGoodsCheckedKeys() {
      this.$refs.goodsTree.setCheckedKeys([])
    },
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false;
      });
    },
    resetFilter(){
      this.listQuery = {
        promotionId: this.groupId,
        pageNum: 1,
        pageSize: this.listQuery.pageSize
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取树形分类失败')
      })
    },
    getOption(){
      getOptionAPI().then(res => {
        res.data.code === 0 ? this.options = res.data.data : this.$message.error(`获取分类选择器选项失败`)
      })
    },
    getInfo() {
      getInfoAPI(this.groupId).then(res => {
        res.data.code === 0 ? this.saleGroup = res.data.data : this.$message.error('获取促销组信息失败')
      })
    }
  }
};
</script>
