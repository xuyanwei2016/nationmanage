<template>
  <div class="app-container calendar-list-container">
    <h3>{{diytype.showName}}推荐商品</h3>
    <div class="nav-buttons-container">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <el-button icon="el-icon-circle-plus" @click="handleCreate">添加商品</el-button>
      <el-button icon="el-icon-delete" @click="massDelete">批量删除</el-button>
      <el-button icon="el-icon-sort-up" @click="setTop(1)">置顶</el-button>
      <el-button icon="el-icon-sort-down" @click="setTop(0)">取消置顶</el-button>
    </div>

    <el-table :key='tableKey' :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" stripe element-loading-text="给我一点时间" border highlight-current-row>
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="商品名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="书代号" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售价" min-width="55" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.salePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售状态" min-width="65" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.saleStatus===0" style="color:#CC6600;">不可售</span>
          <span v-else-if="scope.row.saleStatus===1" style="color:#008000;">可售</span>
        </template>
      </el-table-column>
      <el-table-column label="预售状态" min-width="65" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.presaleStatus===0" style="color:#CC6600;">不预售</span>
          <span v-else-if="scope.row.presaleStatus===1" style="color:#008000;">预售</span>
        </template>
      </el-table-column>
      <el-table-column label="书刊类型" min-width="70" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.foreignJournalsStatus===0">非外刊</span>
          <span v-else-if="scope.row.foreignJournalsStatus===1" style="color:#008000;">外刊</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog title="添加推荐商品" :visible.sync="dialogFormVisible">
      <el-form inline>
        <el-form-item label="商品分类">
          <span>{{diytype.showName}}</span>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input @keyup.enter.native="handleFilter" v-model="goodsQuery.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="书代号">
          <el-input @keyup.enter.native="handleFilter" v-model="goodsQuery.bookNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input @keyup.enter.native="handleFilter" v-model="goodsQuery.isbn" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :key='1' stripe :data="goods.list" v-loading="goods.listLoading" element-loading-text="给我一点时间" border highlight-current-row ref="goodsTable" @selection-change="goodsSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column label="商品名称" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="书代号" min-width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.bookNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售价" min-width="55" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.salePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售状态" min-width="65" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.saleStatus===0" style="color:#CC6600;">不可售</span>
            <span v-else-if="scope.row.saleStatus===1" style="color:#008000;">可售</span>
          </template>
        </el-table-column>
        <el-table-column label="预售状态" min-width="65" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.presaleStatus===0" style="color:#CC6600;">不预售</span>
            <span v-else-if="scope.row.presaleStatus===1" style="color:#008000;">预售</span>
          </template>
        </el-table-column>
        <el-table-column label="书刊类型" min-width="70" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.foreignJournalsStatus===0">非外刊</span>
            <span v-else-if="scope.row.foreignJournalsStatus===1" style="color:#008000;">外刊</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="handleGoodsChange" :current-page.sync="goodsQuery.pageNum" :page-size="10" layout="total, prev, pager, next" :total="goods.total" align="center"></el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="selectSubmit" >确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getInfoAPI, getListAPI, addAPI, deleteAPI, topStatusAPI, getGoodsAPI } from '@/api/book-infomation/recommendedGoods'
import {operationMsg, confirm} from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        code: null,
        pageNum: 1,
        pageSize: 100
      },
      massQuery: {
        isTop: 0,
        id: []
      },
      temp: {
        goodsId: [],
        diyTypeId: parseInt(this.$route.query.id)
      },
      diytype:{},
      goods: {
        list: null,
        total: null,
        listLoading: true,
      },
      goodsQuery: {
        code: null,
        pageNum: 1,
        pageSize: 10
      },
      dialogFormVisible: false,
      goodsSelection: [],
      multipleSelection:[]
    };
  },
  mounted() {
    this.getDiytype().then(()=>{
      this.listQuery.code = this.goodsQuery.code = this.temp.code = this.diytype.code
      this.getList()
    });
  },
  methods: {
    selectSubmit(){
      if (this.goodsSelection.length>0) {
        addAPI(this.temp).then(res => {
          operationMsg.apply(this,[res.data.code,`添加${this.goodsSelection.length}项商品`])
          res.data.status ? this.dialogFormVisible = false : true
        })
      } else {
        this.$message.warning('请先选择需要添加的条目');
      }
    },
    handleCreate(){
      this.resetFilter()
      this.dialogFormVisible = true
    },
    setTop(type){
      if(this.multipleSelection.length>0){
        let len = this.multipleSelection.length
        this.massQuery.isTop = type
        topStatusAPI(this.massQuery).then(res => {
          type===0 ? operationMsg.apply(this,[res.data.code,`取消置顶${len}项`]) : operationMsg.apply(this,[res.data.code,`置顶${len}项`])
        })
      } else {
        this.$message.warning('请先选择需要操作的条目');
      }
    },
    massDelete(){
      if(this.multipleSelection.length>0){
        confirm.apply(this,['确定要删除选择的推荐商品吗?']).then(() => {
          deleteAPI(this.massQuery.id).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项`])
          })
        })
      } else {
        this.$message.warning('请先选择需要删除的条目');
      }
    },
    goodsSelectionChange(val){
      this.goodsSelection = val
      this.goodsSelection.length>0 ? this.temp.goodsId = getMultipleSelectionIDs(this.goodsSelection) : true
    },
    resetFilter(){
      this.goodsQuery = {
        code: this.diytype.code,
        pageNum: 1,
        pageSize: 10
      }
      this.getGoods()
    },
    handleFilter() {
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
          this.$message.error('获取分类商品失败');
        }
        this.goods.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.massQuery.id = getMultipleSelectionIDs(this.multipleSelection) : true
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
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    getDiytype() {
      return getInfoAPI(this.$route.query.id).then(res => {
        res.data.code === 0 ? this.diytype = res.data.data : this.$message.error('获取分类信息失败');
      })
    }
  }
};
</script>
