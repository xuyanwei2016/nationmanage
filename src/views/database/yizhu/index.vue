<template>
  <div class="yizhu">
    <el-container>
      <el-aside width="200px" class="tree-aside">
        <el-tree :data="navTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>

      <el-main>
        <div class="nav-buttons-container">
          <el-button v-if="authBtns.map(i => i.idName).indexOf('uploadBtn') >= 0" @click="upload"> {{authBtns.filter(i => i.idName=='uploadBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='uploadBtn').length>0 && authBtns.filter(i => i.idName=='uploadBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('uploadBtn')].icon, 'el-icon--right']"></i></el-button>
          <router-link :to="{ path:`yizhu/create_yizhu`}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0"><el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button></router-link>
          <el-button v-if="authBtns.map(i => i.idName).indexOf('uploadExcelBtn') >= 0" @click="uploadExcel"> {{authBtns.filter(i => i.idName=='uploadExcelBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='uploadExcelBtn').length>0 && authBtns.filter(i => i.idName=='uploadExcelBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('uploadExcelBtn')].icon, 'el-icon--right']"></i></el-button>
          <el-button v-if="authBtns.map(i => i.idName).indexOf('examineBtn') >= 0" @click="submitReview"> {{authBtns.filter(i => i.idName=='examineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='examineBtn').length>0 && authBtns.filter(i => i.idName=='examineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('examineBtn')].icon, 'el-icon--right']"></i></el-button>
          <el-button v-if="authBtns.map(i => i.idName).indexOf('batchExamineBtn') >= 0" @click="batchExamine"> {{authBtns.filter(i => i.idName=='batchExamineBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchExamineBtn').length>0 && authBtns.filter(i => i.idName=='batchExamineBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchExamineBtn')].icon, 'el-icon--right']"></i></el-button>
          <el-button v-if="authBtns.map(i => i.idName).indexOf('showonBtn') >= 0" @click="editStatus(4)"> {{authBtns.filter(i => i.idName=='showonBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='showonBtn').length>0 && authBtns.filter(i => i.idName=='showonBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('showonBtn')].icon, 'el-icon--right']"></i></el-button>
          <el-button v-if="authBtns.map(i => i.idName).indexOf('setoutBtn') >= 0" @click="editStatus(5)"> {{authBtns.filter(i => i.idName=='setoutBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='setoutBtn').length>0 && authBtns.filter(i => i.idName=='setoutBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('setoutBtn')].icon, 'el-icon--right']"></i></el-button>
        </div>
        <el-form inline class="form-inline">
          <el-form-item v-if="!moreFilter">
            <el-input @keyup.enter.native="handleFilter" v-model="listQuery.nai" clearable placeholder="图书名称/作者/ISBN"></el-input>
          </el-form-item>
          <template v-if="moreFilter">
            <el-form-item label="图书名称">
              <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="作者">
              <el-input @keyup.enter.native="handleFilter" v-model="listQuery.author" clearable></el-input>
            </el-form-item>
            <el-form-item label="ISBN">
              <el-input @keyup.enter.native="handleFilter" v-model="listQuery.isbn" clearable></el-input>
            </el-form-item>
            <el-form-item label="筛选">
              <el-select v-model="listQuery.option" placeholder="请选择活书刊类型" >
                <el-option :value="null" label="全部"></el-option>
                <el-option :value="index" :label="typeItem" v-for="(typeItem,index) in typeList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传时间">
              <el-date-picker v-model="timeLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="书刊类型">
              <el-select v-model="listQuery.type" placeholder="请选择活书刊类型" >
                <el-option label="全部" :value="null"></el-option>
                <el-option value='0' label="外版书"></el-option>
                <el-option value='1' label="本版书"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="销售状态">
              <el-select v-model="listQuery.status" placeholder="请选择活书刊类型" >
                <el-option :value="null" label="全部"></el-option>
                <el-option value='1' label="可售"></el-option>
                <el-option value='0' label="不可售"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
          </el-form-item>
          <el-button @click="changeFilter">{{moreFilter ?  '简洁' : '更多' }}<i :class="moreFilter ?  'el-icon-arrow-up' : 'el-icon-arrow-down' "></i></el-button>
        </el-form>

        <template>
          <el-tabs v-model="activeName" type="card" @tab-click="listSatus">
            <el-tab-pane label="所有图书" name="books"></el-tab-pane>
            <el-tab-pane v-for="(item) in status" :key="item" :label="item" :name="item"></el-tab-pane>
          </el-tabs>
        </template>
        <el-table :key='tableKey' :data="list" v-loading="listLoading" @sort-change="handleSort" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
          <el-table-column label="图书名称" min-width="160" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="作者" min-width="180" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{scope.row.author}}</span>
            </template>
          </el-table-column>
          <el-table-column label="ISBN" min-width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.isbn}}</span>
            </template>
          </el-table-column>
          <el-table-column label="售价" min-width="180" align="center" prop="price" sortable="custom">
          </el-table-column>
          <el-table-column label="上传时间" min-width="180" align="center" prop="uploadTime" sortable="custom">
          </el-table-column>
          <el-table-column label="修改时间" min-width="180" align="center" prop="updateTime" sortable="custom">
          </el-table-column>
          <el-table-column label="状态" min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{status[scope.row.bookStatus]}}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <router-link :to="{ path:`yizhu/create_yizhu`, query:{detailsId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='review').length > 0"><i :class="authBtns.filter(i => i.idName=='review')[0].icon" :title="authBtns.filter(i => i.idName=='review')[0].name"></i></router-link>
              <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0 && scope.row.bookStatus!=4" @click="deleteData(scope.row.id)"></i>
              <router-link :to="{ path:`yizhu/create_yizhu`, query:{detailsId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='relevant').length > 0"><i :class="authBtns.filter(i => i.idName=='relevant')[0].icon" :title="authBtns.filter(i => i.idName=='relevant')[0].name"></i></router-link>
              <router-link :to="{ path:`yizhu/create_yizhu`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i></router-link>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
          </el-pagination>
        </div>
      </el-main>

      <el-dialog title="审核信息" :visible.sync="checkVisible" width="25%">
        <template>
          <el-radio v-model="reviewVal" :label="2">审核中</el-radio>
          <el-radio v-model="reviewVal" :label="4">审核通过并上架</el-radio>
          <el-radio v-model="reviewVal" :label="3">审核未通过</el-radio>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reviewConfirm">确 定</el-button>
          <el-button @click="checkVisible = false">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog title="导入Epub图书" :visible.sync="dialogFormVisible" class="backgroundDialog">
        <p class="info">操作提示:单次上传最多10个文件,全部上传完成前请勿关闭窗口,避免数据丢失!</p>
        <el-upload v-model="listQuery.audio" class="upload-demo" ref="myupload" multiple :limit="10" :action="`${uploadEbook}epub/${uploadPath}?code=${listQuery.diyTypeCode}&dtId=${listQuery.diyTypeId}&nationsType=${listQuery.nationsType}`" :on-exceed="handleExceed" :file-list="fileList"  :on-success="handleSuccess" :before-upload="beforeUpload" accept=".epub">
          <el-button size="small" type="primary" plain >选择文件（可多选）</el-button>
        </el-upload>
        <div slot="footer" class="dialogbtns">
          <el-button size="small" type="primary" @click="allUpload" :loading="uploading" style="width:84px;float:left;">全部上传</el-button>
          <el-button size="small" @click="cancelFiles">全部取消</el-button>
        </div>
      </el-dialog>

    </el-container>
  </div>
</template>

<script>
import '../../../../static/common.css'
import { getNavAPI } from '@/api/database/theory'
import { uploadPath,uploadEbook } from '@/utils/global.js'
import { getListAPI, editStatusAPI, reviewAPI, submitReviewAPI, deleteAPI, optionListAPI, importAPI } from '@/api/database/yizhu'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      uploadPath:uploadPath,
      uploadEbook:uploadEbook,
      uploading:false,
      checkVisible:false,
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible:false,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        option: null,
        type: null,
        status: null,
        nationsType: this.$store.getters.getNation
      },
      batchList: [],
      activeName: 'books',
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      navTree: [],
      status:[// 0：录入中 1：待审核 2：审核中 3：审核不通过 4：已上架 5：已下架 ,
        '录入中',
        '待审核',
        '审核中',
        '审核不通过',
        '已上架',
        '已下架'
      ],
      reviewVal:2,
      moreFilter:false,
      timeLimit: null,
      typeList:[],
      fileList:[],
      tokens:[],
      token:null
    }
  },
  computed: {
    ...mapGetters([
      'getNation'
    ])
  },
  watch: {
    getNation: function (val) {
      this.listQuery.nationsType = val
      this.getList()
    },
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList()
    this.getNav()
    this.getoptionList()
  },
  methods: {
    getNav(){
      getNavAPI('医著').then(res => {
        //res.data.data = [{showName:'全部'}].concat(res.data.data)
        // res.data.code === 0 ? this.navTree = res.data.data[0].list : this.$message.error('获取nav数据失败')
        if (res.data.code === 0) {
          let treeList = [];
          res.data.data.map(el => {
            treeList = treeList.concat(el.list);
          });
          this.navTreeDia = treeList;
          this.navTree = [{ showName: "全部" }].concat(treeList);
        }
      })
    },
    getoptionList() {//筛选列表
      optionListAPI().then(res => {
        res.data.code === 0 ? this.typeList = res.data.data : this.$message.error('获取数据失败')
      })
    },
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
    handleSort({column, prop, order}) {
      if (order) {
        this.listQuery.orderBy = `${prop} ${order.substring(0,order.length-6)}`
      } else {
        this.listQuery.orderBy = null
      }
      this.getList()
    },
    listSatus(tab,event) { //0待审核，1已上架，2已下架Tab切换
      if (tab.index == 0) {
        this.listQuery.bookStatus = null
      } else{
        this.listQuery.bookStatus = tab.index-1
      }
      this.getList();
    },
    changeFilter() {//更多和简洁
      this.moreFilter = !this.moreFilter
      this.resetFilter()
    },
    handleNodeClick(data){ //点击树节点获取table数据
      this.listQuery.diyTypeId = data.id
      this.listQuery.diyTypeCode = data.code
      this.getList()
    },
    deleteData(id) {//删除
      confirm.apply(this,['确认删除吗？']).then(() => {
        const ids = [id]
        deleteAPI(ids).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
          this.getList()
        })
      })
    },
    editStatus(status) {//批量上下架
      if(this.batchList.length > 0){
        const ids = getMultipleSelectionIDs(this.batchList);
        const data = {
          bookStatus: status,
          ids:ids
        }
        if(status == 4) {//批量上架 ---已下架状态
          const type = this.batchList.every(data => data.bookStatus == 5)
          if(type){
            editStatusAPI(data).then(res => {
              if(res.data.code === 0){
                this.$message.success('操作成功');
                this.getList();
              }
            })
          } else{
            this.$message.error('您选择的状态数据不能执行此操作，请重新选择');
          }
        } else{//批量下架 ---已上架状态
          const type = this.batchList.every(data => data.bookStatus == 4)
          if(type){
            editStatusAPI(data).then(res => {
              if(res.data.code === 0){
                this.$message.success('操作成功');
                this.getList();
              }
            })
          } else{
            this.$message.error('您选择的状态数据不能执行此操作，请重新选择');
          }
        }
      } else{
        this.$message.error('至少选择一条数据进行操作');
      }
    },
    batchExamine() {//批量审核
      if(this.batchList.length > 0){//0：录入中 1：待审核 2：审核中 3：审核不通过 4：已上架 5：已下架
        const type = this.batchList.every(data => data.bookStatus == 1 || data.bookStatus == 2 || data.bookStatus == 3) //已录入
        if(type) {
          this.checkVisible = true;
        } else{
          this.$message.error('请选择正确状态的数据进行批量审核操作');
        }
      } else{
        this.$message.error('至少选择一条数据进行操作');
      }
    },
    reviewConfirm (){//审核通过/审核不通过
      const ids = getMultipleSelectionIDs(this.batchList);
      const data = {
        bookStatus:this.reviewVal,
        ids:ids
      }
      reviewAPI(data).then(res => {
        console.log(res);
        if(res.data.code === 0){
          this.$message.success('操作成功');
          this.checkVisible = false
          this.getList();
        }
      })
    },
    submitReview() {//提交审核
      if(this.batchList.length > 0){
        const ids = getMultipleSelectionIDs(this.batchList);
        const type = this.batchList.every(data => data.bookStatus == 0) //已录入
        if(type){
          submitReviewAPI(ids).then(res => {
            if(res.data.code === 0){
              this.$message.success('操作成功');
              this.getList();
            }
          })
        } else{
          this.$message.error('请选择录入中数据进行提交审核操作');
        }
      } else{
        this.$message.error('至少选择一条数据进行操作');
      }
    },
    upload(){//导入图书
      const id = this.listQuery.diyTypeId
      if(id) {
        this.dialogFormVisible = true
      } else {
        this.$message.warning('请先选择自定义分类')
      }
    },
    // 上传图书有关
    beforeUpload(file){ //beforeUpload、handleSuccess上传图书相关
      let type = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase()
      const isEpub = type === 'epub';
      if (!isEpub) {
        this.$message.error('上传图书只能是 epub 格式!');
        return isEpub
      } else {
        this.$message.warning('上传中')
        this.uploading = true
      }
    },
    handleSuccess(response, file, fileList){
      this.$message.success('上传成功')
      this.tokens.push(response)
      this.uploading = false
    },
    handleExceed(files, fileList) {
      this.$message.warning(`单次上传最多10个文件`);
    },
    // 全部上传
    allUpload() {

      if(this.tokens.length > 0) {
        this.uploading = true;
        importAPI(this.tokens).then(res => {
          if(res.data.code == 0) {
            this.$message.success('导入成功')
            this.$refs['myupload'].clearFiles()
            this.dialogFormVisible = false;
            this.fileList=[];
            this.tokens = [];
            this.getList();

          } else {
            this.$message.error('导入失败')
          }
          this.uploading = false;
        })
      }else {
        this.$message.warning('请先选择epub文件!')
      }
    },
    // 全部取消
    cancelFiles() {
      this.$refs['myupload'].clearFiles();
      this.fileList = []
      this.tokens = []
      this.uploading = false

    },
    uploadExcel(){//导入Excel
      console.log(12);

    },
    batchDeleteBtn(){//批量删除
      if(this.batchList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
          const ids = getMultipleSelectionIDs(this.batchList);
          batchDeleteAPI(ids).then(res => {
            if(res.data.code === 0){
              console.log(res.data);
              this.$message.success('批量删除成功');
              this.getList();
            } else {
              this.$message.error('批量删除失败');
            }
          })
      }
    },
    uploadBtn(){//导入
      console.log(1112);
    },
    chioceList(val) {
      this.batchList = val;
    },
    handleFilter(){//检索
      if(this.timeLimit){
        this.listQuery.beginTime = this.timeLimit[0]
        this.listQuery.endTime = this.timeLimit[1]
      } else {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }
      // this.listQuery.diyTypeId = [];
      // this.listQuery.diyTypeCode = this.$refs.tree.getCheckedNodes().map(node => node.code).join(',');
      // this.$refs.tree.getCheckedNodes().map(el => {//自定义标签
      //   console.log(el.id);
      //   this.listQuery.diyTypeId.push(el.id)
      // })
      //console.log(this.listQuery.diyTypeId);
      // this.listQuery.diyTypeId = this.$refs.tree.getCheckedNodes().map(node => this.listQuery.diyTypeId.push(node.id))
      store.dispatch('SetSupplierSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1
      this.listQuery.bookStatus = this.listQuery.bookStatus
      this.getList()
    },
    resetFilter(){//重置
      this.timeLimit = []
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        bookStatus: this.listQuery.bookStatus,
        nationsType: this.listQuery.nationsType,
        diyTypeId: this.listQuery.diyTypeId,
        diyTypeCode: this.listQuery.diyTypeCode,
        option: null,
        type: null,
        status: null,
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.listQuery.bookStatus = this.listQuery.bookStatus
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.listQuery.bookStatus = this.listQuery.bookStatus
      this.getList()
    }
  }
}
</script>

<style>
.el-tabs__header,.el-tabs--card>.el-tabs__header{
  border: 0;
  margin-bottom: 0;
}

.yizhu .el-dialog__body {
  display: flex;
  justify-content: center;
  flex-direction: column;
  /*padding: 30px 55px !important;*/
}
</style>

