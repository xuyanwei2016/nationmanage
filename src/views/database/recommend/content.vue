<template>
  <div class="app-container calendar-list-container">
    <el-form inline class="form-inline" v-if="typeStatus== '2'">
      <el-form-item label="资源类型：">
        <el-select v-model="listQuery.resType" placeholder="请选择活动区域" >
          <el-option :label="typeItem" :value="index" v-for="(typeItem,index) in typeList" :key="index" v-if="index != '49' && index != '50'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="nav-buttons-container">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <el-button  v-if="authBtns.map(i => i.idName).indexOf('addConBtn') >= 0" @click="getContent">{{authBtns.filter(i => i.idName=='addConBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addConBtn').length>0 && authBtns.filter(i => i.idName=='addConBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addConBtn')].icon, 'el-icon--right']"></i></el-button>
       <el-button  v-if="authBtns.map(i => i.idName).indexOf('editSort') >= 0" @click="changeSort">{{authBtns.filter(i => i.idName=='editSort')[0].name}}<i v-if="authBtns.filter(i => i.idName=='editSort').length>0 && authBtns.filter(i => i.idName=='editSort')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('editSort')].icon, 'el-icon--right']"></i></el-button>
      <el-button  v-if="authBtns.map(i => i.idName).indexOf('cancelBtn') >= 0" @click="batchDelete">{{authBtns.filter(i => i.idName=='cancelBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='cancelBtn').length>0 && authBtns.filter(i => i.idName=='cancelBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('cancelBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="缩略图" width="100" height="200" align="center">
        <template slot-scope="scope">
          <img :src="`${uploadUrl}?fileName=${scope.row.resImg}&isOnLine=true`" v-if="scope.row.resImg" class="avatar" style="object:fit;border:dashed 1px #ccc" onerror="javascript:this.src='../../../static/bookDefault.png';">
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon"
               style="width: 90%; height: 90%;">
        </template>
      </el-table-column>
      <el-table-column label="推荐内容" min-width="160" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.resName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序号" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加人" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.resType_zh}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`edit`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i></router-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <!-- 弹窗 -->
    <el-dialog :title="(listQuery.recomId == 103)?'大师内容':'推荐内容'" :visible.sync="dialogVisible" width="80%">
      <el-form inline class="form-inline">
        <el-form-item label="资源名称">
          <el-input @keyup.enter.native="handleConFilter" v-model="conListQuery.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据类型："  v-if="listQuery.recomId !=103 ">
          <el-select v-model="dataType" placeholder="请选择活动区域">
            <el-option :label="typeItem" :value="index" v-for="(typeItem,index) in typeList" :key="typeItem" v-if="index != 0 && index != '49' && index != '50'"></el-option>
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
        <el-table-column label="姓名" min-width="160" align="center" v-else-if="typeStatus == '1'">
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
        <el-table-column label="认证类型" min-width="160" align="center" v-else-if="typeStatus == '1'">
          <template slot-scope="scope">
            <span>{{autType[scope.row.authenticationType]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="作者" min-width="160" align="center" v-else>
          <template slot-scope="scope">
            <span>{{scope.row.author}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" min-width="180" align="center" v-if="typeStatus == '1'">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" min-width="180" align="center" v-else>
          <template slot-scope="scope">
            <span>{{scope.row.uploadTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="180" align="center" v-if="typeStatus == '1'">
          <template slot-scope="scope">
            <span>{{(scope.row.status =='1')?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="180" align="center" v-else>
          <template slot-scope="scope">
            <span>{{scope.row.status_zh}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination @size-change="handleConSizeChange" @current-change="handleConCurrentChange" :current-page="conListQuery.pageNum" :page-sizes="[10,50,100,200,500]" :page-size="conListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="conTotal" align="center">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="createData" >确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改排序号" :visible.sync="sortVisible" width="420px">
      <el-form inline class="form-inline" :rules="rules" :model="sortForm" ref="sortForm">
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="sortForm.sort" clearable style="width: 270px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="updateSort" >确定</el-button>
        <el-button @click="sortVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getConListAPI, batchDeleteAPI, ConRestListAPI, createContenAPI, updateSortAPI } from '@/api/database/recommend'
import { resourceListAPI } from '@/api/database/article'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  data() {
    const validateSort = (rule, value, callback) => {
      let reg = /^([1-9]\d{0,8}|0)$/;
      if ( !reg.test(value) ){
        callback(new Error('请输入0-999999999之间的整数'));
      } else {
        callback()
      }
    };
    return {
      rules:{
        sort:[
          { required: true,  trigger: 'change', validator: validateSort }
        ]
      },
      authBtns: [],
      sortForm:{
        sort: null
      },
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
        resType:"0",//0全部 1理论 2药物 3方剂 4临床 5医案 6文化 7机构 8医论 9其他 10医著 11医家 注：1-9与文章类型一致 ,
        nationsType: this.$store.getters.getNation
      },
      conListQuery:{
        pageNum: 1,
        pageSize: 10,
        resourceType:"1",//1理论 2药物 3方剂 4临床 5医案 6文化 7机构 8医论 9其他 10医著 11医家 注：1-9与文章类型一致 ,
        nationsType: this.$store.getters.getNation
      },
      batchList:[],
      batchConList:[],
      typeList:[],
      dataType:"1",
      typeStatus:'2', // 小程序推荐位1   其他为2
      autType:{
        '0':"医师资格认证",
        '1':"医学院师生认证",
        '2':"实名认证",
      }
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
      this.conListQuery.nationsType = val
    },
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.uploadUrl = uploadUrl
    this.uploadPath = uploadPath
    if(this.$route.query.code == 'MINI_PROGRAM_HOME_01'){
      this.typeStatus = '1'
      this.conListQuery.resourceType = '51'
    }else{
      this.typeStatus = '2'
      this.conListQuery.resourceType = '1'

    }
  },
  mounted() {
    if(this.$route.query.id){
      this.listQuery.recomId = this.$route.query.id; //推荐位id
    }
    if(this.$route.query.type){
      this.listQuery.nationsType = this.$route.query.type; //民族
      this.conListQuery.nationsType = this.$route.query.type; //民族
    }

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
    getConList() {//剩余资源列表
      this.listLoading = true
      //判断类型-----医著-医家-文章
      this.conListQuery.recomId = this.$route.query.id; //推荐位id
      ConRestListAPI(this.conListQuery).then(res => {
        if(res.data.code == 0){
          if(this.conListQuery.resourceType == 1){//医著
            this.conlist  = res.data.data.list.map(el => {
              let {name:title,bookstatus:status,...rest} = el
              return {title,status,...rest}
            })
          }else{
            this.conlist = res.data.data?res.data.data.list:[];
          }
          this.conTotal = res.data.data? res.data.data.total:0;
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    getContent() {//内容
    console.log(this.typeStatus)
      this.getConList();
      if(this.typeStatus == '2'){
        this.dataType = '1'
      }else{
        this.dataType = '51'
      }
      this.dialogVisible = true;
    },
    createData() {//确定
      this.dialogVisible = false;
      if(this.batchConList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
        this.dialogVisible = true
      } else{
        const id = this.listQuery.recomId;//推荐位id
        var newList = {};
        if(this.conListQuery.resourceType == 1){//医著
          newList = this.batchConList.map(el => {
            let { bookstatus:status, title:resName, id:resId, bookCover:resImg } = el
            return { status,resId,recomId:id,nationsType:this.conListQuery.nationsType,resType:this.conListQuery.resourceType,resImg,resName }
          })
        } else if(this.conListQuery.resourceType == 2){//医家
          newList = this.batchConList.map(el => {
            let { status, name:resName, id:resId, faceImg:resImg } = el
            return { status,resName,resImg,resId,recomId:id,nationsType:this.conListQuery.nationsType,resType:this.conListQuery.resourceType }
          })
        } else{
          newList = this.batchConList.map(el => {//其他文章
            let { status, title:resName, id:resId, img:resImg } = el
            return { status,resName,resImg,resId,recomId:id,nationsType:this.conListQuery.nationsType,resType:this.conListQuery.resourceType }
          })
        }
        createContenAPI(newList).then(res => {
          console.log(newList);
          if(res.data.code === 0){
            this.getList();
            this.$message.success('添加成功');
          } else {
            this.$message.error('添加失败');
          }
        })
      }
    },
    changeSort() {//修改序号
      if(this.batchList.length != 1){
        this.$message.error('请选择一条记录进行操作')
      } else{
        this.sortForm.oid = this.batchList[0].id
        this.sortForm.sort =  this.batchList[0].sort
        this.sortVisible = true;
      }
    },
    updateSort() {//确认修改排序号
      this.$refs['sortForm'].validate((valid) => {
        if (valid) {//必填名称--规则
          updateSortAPI(this.sortForm).then(res => {
            if(res.data.code === 0){
              this.getList();
              this.$message.success('修改成功');
              this.sortVisible = false
            } else {
              this.$message.error('修改失败');
            }
          })
        }
      })
    },
    chioceList(val) {
      this.batchList = val;
    },
    contentList(val) {
      this.batchConList = val;
    },
    batchDelete(){//批量删除--不能删除已上架的资源
      if(this.batchList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const ids = getMultipleSelectionIDs(this.batchList);
        confirm.apply(this,['确认取消吗？']).then(() => {
          batchDeleteAPI(ids).then(res => {
            requestMsg.apply(this,[res.data,'取消'])
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
      this.conListQuery.resourceType = this.dataType
      this.conListQuery.pageSize = val
      this.getConList();
    },
    handleConCurrentChange(val) {
      this.conListQuery.resourceType = this.dataType
      this.conListQuery.pageNum = val
      this.getConList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        recomId: this.$route.query.id,
        resType: '0',
        nationsType: this.$route.query.type
      }
      this.getList()
    },
    handleFilter() {
      store.dispatch('SetUserManagementSerKeys',this.listQuery).then(res => {
      })
      this.listQuery.pageNum = 1
      this.listQuery.recomId = this.$route.query.id
      this.listQuery.nationsType = this.$route.query.type
      this.getList()
    },
  }
}
</script>

<style lang="less" scoped>
  .el-table .cell img {
    vertical-align: middle;
    width: 50px;
    height: 50px;
  }
</style>
