<template>
  <div class="app-container calendar-list-container">
    <el-form inline>
      <el-form-item label="ISBN">
        <el-input v-model="listQuery.isbn" clearable></el-input>
      </el-form-item>
      <el-form-item label="书代号">
        <el-input v-model="listQuery.bookNo" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品分类">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
          <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
          <el-select v-model="listQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="全部">
            <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="图书名称">
        <el-input v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="上下架状态">
        <el-select v-model="listQuery.bookstatus">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="上架" :value="1"></el-option>
          <el-option label="下架" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="是否低于下限值" prop="lowerNumZh" min-width="60" align="center"></el-table-column>
      <el-table-column label="预售数量 " prop="presaleNumber" min-width="60" align="center"></el-table-column>
      <el-table-column label="锁定数" prop="lockNum" min-width="60" align="center"></el-table-column>
      <el-table-column label="书代号" prop="bookNo" min-width="70" align="center"></el-table-column>
      <el-table-column label="上下架状态" prop="bookstatusZh" min-width="70" align="center"></el-table-column>
      <el-table-column label="ISBN" prop="isbn" min-width="110" align="center"></el-table-column>
      <el-table-column label="书名" prop="name" min-width="170" align="center"></el-table-column>
      <el-table-column label="库存" prop="num" min-width="60" align="center"></el-table-column>
      <el-table-column label="实洋" prop="realOcean" min-width="55" align="center"></el-table-column>
      <el-table-column label="码洋" prop="ministrial" min-width="55" align="center"></el-table-column>
      <el-table-column label="定价" prop="price" min-width="55" align="center"></el-table-column>
      <el-table-column label="作者" prop="author" min-width="100" align="center"></el-table-column>
      <el-table-column label="出版社" prop="publisherZh" min-width="120" align="center"></el-table-column>
      <el-table-column label="备注" prop="memo" min-width="120" align="center"></el-table-column>
    </el-table>
    <div class="summary-data">
      总码洋: {{summaryData.ministrial}}、总实洋: {{summaryData.realOcean}}、总数量: {{summaryData.num}}、总锁定数: {{summaryData.lockNum}}
    </div>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getListAPI, getNavAPI, getOptionAPI, getSummaryAPI } from '@/api/stock-management/wdbstorage'
import { errorMsg } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  data() {
    return {
      // shelfMap: ['下架','上架'],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        isbn: null,
        bookNo: null,
        code: null,
        name: null,
        bookstatus: null
      },
      summaryData: {},
      navTree: [],
      options: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      popoverVisible: false
    }
  },
  mounted() {
    if( ifUndefined(store.getters.wdbStorageSerKeys.pageNum) ){
      this.listQuery = store.getters.wdbStorageSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.getNav()
    this.getOption()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.status){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          errorMsg.apply(this, [ res.data, `获取表格数据` ])
        }
        this.listLoading = false
      })
      getSummaryAPI(this.listQuery).then(res => {
        if(res.data.status){
          this.summaryData = res.data.data
        } else {
          errorMsg.apply(this, [ res.data, `获取总数据` ])
        }
      })
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        isbn: null,
        bookNo: null,
        code: null,
        name: null,
        bookstatus: null
      }
      this.getList()
    },
    handleFilter() {
      store.dispatch('SetWdbStorageSerKeys',this.listQuery).then(res => {
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
    checkChange(data, obj){
      // console.log(data, obj);
      // const [code] = obj.checkedKeys
      this.listQuery.code = data.code
      this.popoverVisible = false
    },
    clearCheckedKeys(){
      this.$refs.searchTree.setCheckedKeys([])
    },
    getNav() {
      getNavAPI().then(res => {
        res.data.status ? this.navTree = res.data.data : errorMsg.apply(this, [ res.data, `获取树形自定义分类` ])
      })
    },
    getOption() {
      getOptionAPI().then(res => {
        res.data.status ? this.options = res.data.data : errorMsg.apply(this, [ res.data, `获取分类选择器选项` ])
      })
    }
  }
}
</script>
