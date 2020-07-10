<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
       <el-button  v-if="authBtns.map(i => i.idName).indexOf('addConBtn') >= 0" @click="addContent">{{authBtns.filter(i => i.idName=='addConBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addConBtn').length>0 && authBtns.filter(i => i.idName=='addConBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addConBtn')].icon, 'el-icon--right']"></i></el-button>
      <el-button  v-if="authBtns.map(i => i.idName).indexOf('batchCancel') >= 0" @click="batchDelete">{{authBtns.filter(i => i.idName=='batchCancel')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchCancel').length>0 && authBtns.filter(i => i.idName=='batchCancel')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchCancel')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-form inline class="form-inline">
      <el-form-item label="名称">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="商品名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属分类" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.diytypeid}}</span>
        </template>
      </el-table-column>
      <el-table-column label="ISBN" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isbn}}</span>
        </template>
      </el-table-column>
      <el-table-column label="定价" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价" min-width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.price && discountType == 1">{{scope.row.price*discount}}</span>
          <!-- 统一售价 -->
          <span v-if="scope.row.price && discountType == 2">{{discount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.resType_zh}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

   <!-- 弹窗 -->
    <el-dialog title="选择商品" :visible.sync="dialogVisible" width="80%">
      <el-form inline class="form-inline">
        <el-form-item label="资源名称">
          <el-input @keyup.enter.native="handleConFilter" v-model="conListQuery.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据类型：">
          <el-select v-model="dataType" placeholder="请选择活动区域">
            <el-option :label="typeItem" :value="index" v-for="(typeItem,index) in typeList" :key="index" v-if="index != '0' && index != '49' && index != '50' && index != '2'"></el-option>
          </el-select>
       </el-form-item>
        <el-form-item>
          <el-button @click="handleConFilter">检索</el-button>
        </el-form-item>
      </el-form>

      <el-table :key='tableKey' :data="conlist" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="contentList" >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column label="作者姓名" min-width="160" align="center" v-if="conListQuery.resourceType == 2">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源名称" min-width="160" align="center" v-else>
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构" min-width="160" align="center" v-if="conListQuery.resourceType == 2">
          <template slot-scope="scope">
            <span>{{scope.row.institutionName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="作者" min-width="160" align="center" v-else>
          <template slot-scope="scope">
            <span>{{scope.row.author}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" min-width="180" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.uploadTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="180" align="center">
          <template slot-scope="scope">
            <span v-if="conListQuery.resourceType == 1">{{EbookStatus[scope.row.status]}}</span>
            <span v-else>{{status[scope.row.status]}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination @size-change="handleConSizeChange" @current-change="handleConCurrentChange" :current-page="conListQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="conListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="conTotal" align="center">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="createData" >确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getConListAPI, ConRestListAPI, saveConAPI, deleteConAPI } from '@/api/marketing-management/activity'
import { resourceListAPI } from '@/api/database/article'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  data() {
    return {
      authBtns: [],
      sortForm:{},
      tableKey: 0,
      list: null,
      dialogVisible:false,
      conlist:[],
      total: null,
      conTotal:null,
      listLoading: false,
      sortVisible:false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
      },
      conListQuery:{
        pageNum: 1,
        pageSize: 10,
        resourceType:1
      },
      batchList:[],
      batchConList:[],
      discount:null,
      discountType:null,
      typeList:[],
      dataType:"1",
      status:[//0待审核，1已上架，2已下架 ,
        '待审核','已上架','已下架'
      ],
      EbookStatus:[//0：录入中 1：待审核 2：审核中 3：审核不通过 4：已上架 5：已下架 Ebook
        '录入中','待审核','审核中','审核不通过','已上架','已下架'
      ],
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.listQuery.id = this.$route.query.id; //促销活动ID
    this.conListQuery.prId = this.$route.query.id; //促销活动ID
    this.discount = this.$route.query.discount //折扣或固定价格
    this.discountType = this.$route.query.discountType //类型
    this.getList()
    this.getResource()
  },
  methods: {
    getList() {//内容列表
      this.listLoading = true
      getConListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    getResource() {
      resourceListAPI({isMedia:0}).then(res => {
        if(res.data.code === 0){
          this.typeList = res.data.data
        } else {
          this.$message.error('获取数据失败');
        }
      })
    },
    addContent() {//资源列表
      this.getConList();
      this.dialogVisible = true;
    },
    getConList() {//全部资源列表
      this.listLoading = true
      //判断类型-----医著-医家-文章
      ConRestListAPI(this.conListQuery).then(res => {
        if(res.data.code === 0){
          if(this.conListQuery.resourceType == 1){//医著
            this.conlist  = res.data.data.list.map(el => {
              let {name:title,bookstatus:status,...rest} = el
              return {title,status,...rest}
            })
          }else{
            this.conlist = res.data.data.list
          }
          this.conTotal = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    createData() {//确定
      if(this.batchConList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        this.dialogVisible = false;
        const id = this.$route.query.id; //促销活动ID
        var newList = {};
        if(this.conListQuery.resourceType == 1){//医著
          newList = this.batchConList.map(el => {
            let { author, isbn, title: name, id:resourceId, price } = el
            return { author,isbn,name,resourceId,price,prid:id,resourceType:this.conListQuery.resourceType }
          })
        }else{
          newList = this.batchConList.map(el => {
            let { author, title:name, realPrice:price, id:resourceId } = el
            return { author,name,price,prid:id,resourceId,resourceType:this.conListQuery.resourceType }
          })
        }
        saveConAPI(newList).then(res => {
          if(res.data.code === 0){
            this.getList();
            this.$message.success('添加成功');
          } else {
            this.$message.error('添加失败');
          }
        })
      }
    },
    chioceList(val) {
      this.batchList = val;
    },
    contentList(val) {
      this.batchConList = val;
    },
    batchDelete(){//批量删除-取消
      if(this.batchList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const ids = getMultipleSelectionIDs(this.batchList);
        confirm.apply(this,['确认删除吗？']).then(() => {
          deleteConAPI(ids).then(res => {
            requestMsg.apply(this,[res.data,'删除'])
            this.getList()
          })
        })
      }
    },
    handleConFilter() {
      this.conListQuery.resourceType = this.dataType
      this.conListQuery.pageNum = 1
      this.getConList()
    },
    handleConSizeChange(val) {
      this.conListQuery.pageSize = val
      this.getConList();
    },
    handleConCurrentChange(val) {
      this.conListQuery.pageNum = val
      this.getConList();
    },
    handleFilter(){
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){//重置
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        id: this.$route.query.id, //促销活动ID
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
