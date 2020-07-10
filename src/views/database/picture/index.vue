<template>
  <el-container>
    <el-aside width="200px" class="tree-aside">
      <el-tree  :data="navTree"  :props="defaultProps"  @node-click="handleNodeClick"  :expand-on-click-node= 'false' :highlight-current= 'true'>
      </el-tree>
    </el-aside>
    <el-main>
    <div class="nav-buttons-container search_btn">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('uploadBtn') >= 0" @click="upload">
        {{authBtns.filter(i => i.idName=='uploadBtn')[0].name}}
        <i v-if="authBtns.filter(i => i.idName=='uploadBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('uploadBtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <router-link :to="{ path:`picture/create`}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0">
        <el-button > {{authBtns.filter(i => i.idName=='addBtn')[0].name}}
          <i v-if="authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i>
        </el-button>
      </router-link>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDeleteBtn') >= 0" @click="batchDelete">
        {{authBtns.filter(i => i.idName=='batchDeleteBtn')[0].name}}
        <i v-if="authBtns.filter(i => i.idName=='batchDeleteBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDeleteBtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-form inline class="form-inline search_top">
      <el-form-item label="资源名称" label-width="82px">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属图书" label-width="82px">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.bookName" v-if="listQuery.bookName != null" clearable></el-input>
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.source" v-else clearable></el-input>
      </el-form-item>
      <el-form-item label="上传时间" class="uploadTimes" label-width="82px">
        <el-date-picker v-model="timeLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="listSatus">
        <el-tab-pane label="所有图片" name="books"></el-tab-pane>
        <el-tab-pane v-for="(item) in status" :key="item" :label="item" :name="item"></el-tab-pane>
      </el-tabs>
    </template>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" @sort-change="handleSort" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column label="缩略图" align="center">
        <template slot-scope="scope">
          <img style="width:50px;height:50px;" :src="`${uploadUrl}?fileName=${scope.row.image}&isOnLine=true`" alt="">
        </template>
      </el-table-column>
      <el-table-column label="资源名称" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属图书" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.bookName != null">{{scope.row.bookName}}</span>
          <span v-else>{{scope.row.source}}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" align="center" prop="uploadTime" sortable="custom"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0" >{{status[scope.row.status]}}</span>
          <span v-if="scope.row.status == 1" class="putawayColor">{{status[scope.row.status]}}</span>
          <span v-if="scope.row.status == 2" class="soldColor">{{status[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path:`picture/create`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i>
          </router-link>
          <router-link :to="{ path:`picture/create`, query:{detailsId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='review').length > 0">
            <i :class="authBtns.filter(i => i.idName=='review')[0].icon" :title="authBtns.filter(i => i.idName=='review')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0 && scope.row.bookStatus!=4"  @click="deleteBtn(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>
    </el-main>
    <el-dialog title="导入图片" :visible.sync="dialogFormVisible" class="backgroundDialog">
        <p class="info">操作提示:单次上传最多10个文件,全部上传完成前请勿关闭窗口,避免数据丢失!</p>
        <el-upload class="upload-demo" ref="myupload" multiple :limit="10" :action="`${uploadUrl}${uploadPath}/info`" :on-exceed="handleExceed" :file-list="fileList"  :on-success="handleSuccess" :before-upload="beforeUpload" accept=".jpg,.jpeg,.bmp,.png,.gif">
          <el-button size="small" type="primary" plain >选择文件(可多选)</el-button>
        </el-upload>
        <el-form :model="resourceForm" label-width="60px" label-position="right" inline style="margin-top:20px;" :rules="rules" ref="resourceForm">
            <el-form-item label="来源" >
              <el-input v-model="resourceForm.source" ></el-input>
            </el-form-item>
            <el-form-item label="售价" prop="realPrice" >
              <el-input v-model="resourceForm.realPrice" ></el-input>
            </el-form-item>
            <el-form-item label="关键词" >
              <el-input v-model="resourceForm.keywords" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialogbtns">
          <el-button type="primary" size="small" @click="allUpload" :loading="sending" style="width:84px;float:left;">全部上传</el-button>
          <el-button size="small" @click="cancelFiles">全部取消</el-button>
        </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" width="30%" title="设置销售方式">
      <el-form>
        <el-form-item label="批量设置销售方式：" >
          <el-radio v-model="readType" :label="0">游客可见</el-radio>
          <el-radio v-model="readType" :label="1">会员可见</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="editRead">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量修改价格" :visible.sync="dialogPrice" width="20%">
      <template >
        <span>统一售价：</span>
        <el-radio v-model="priceType" :label="1">付费</el-radio>
        <el-radio v-model="priceType" :label="0">免费</el-radio>
        <el-form :model="dataForm" v-if="priceType == 1" :rules="moneyRules" class="aa" ref="dataForm" style="margin-top:24px;margin-left:60px;width:200px;">
          <el-form-item label="" prop="money">
            <el-input v-model="dataForm.money" style="min-width: 100%"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <span slot="footer">
        <el-button type="primary" @click="editPrice">确 定</el-button>
        <el-button @click="dialogPrice = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--修改分类//1-->
    <el-dialog title="修改分类" width="456px" :visible.sync="typeDialog" class="updatePriceDialog" style="height:auto !important;">
      <treeselect
        v-model="treeSelectValue"
        placeholder="请选择"
        :multiple="false"
        :options="treeSelectOptions"
        data-vv-scope="baseInfo"
        :normalizer="normalizer"
        v-validate="'required'"
        @select="selectFun"
        @deselect="deselectFun"
      />
      <div slot="footer" class="specialFooter">
        <el-button type="primary" @click="confirmType">确 定</el-button>
        <el-button @click="typeDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import '../../../../static/common.css'
import {getNavAPI} from '@/api/database/theory'
import { getListAPI, batchExamineAPI, editPriceTypeAPI, editReadTypeAPI, editStatusAPI, batchDeleteAPI, importAPI} from '@/api/database/picture'
import queryString from 'query-string'
import { uploadPath, requestPath, uploadUrl } from '@/utils/global.js'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import tinymce from '@/components/Tinymce'
import store from '@/store'
import { mapGetters } from 'vuex'
import {getTreeAPI ,updateTypeAPI} from '@/api/database/article' //2
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";//7

export default {
  data() {
    return {
      typeDialog:false,
      treeSelectOptions: [],
      treeSelectValue: null,
      typeform: {
        ids: [],
        diyTypeCode: [],
        diyTypeId: [],
        objectType:4
      },
      sending: false,
      uploadUrl: uploadUrl,
      uploadPath: uploadPath,
      authBtns: [],
      tableKey: 0,
      list: [],
      total: null,
      price: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        diyTypeId: null,
        diyTypeCode: null
      },
      timeLimit: null,
      batchList: [],
      activeName: 'books',
      status:[
        '待审核',
        '已上架',
        '已下架',
      ],
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      ids:[],
      dialogVisible: false,
      dialogPrice:false,
      dialogFormVisible:false,
      fileList:[],
      readType:0,//阅读权限-游客
      priceType:0,
      dataForm: {
        money: '',
      },
      rules: {
        realPrice:[
          { required: true, message: '请输入价格', trigger: 'change'},
          { pattern:/^(^[1-9](\d{1,4})?(\.[1-9]{1,2})?$)|(^\d{1,4}\.\d{1,2}$)$/,message: '请输入价格,范围在0.1-99999之间', trigger: 'change' }
        ]
      },
      moneyRules: {
        money: [
          { required: true,  trigger: 'change', message: '请输入价格'},
          { trigger: 'change', message: '请输入0.1-99999之间的数字，最多保留两位小数', pattern: /^(^[1-9](\d{1,4})?(\.[1-9]{1,2})?$)|(^\d{1,4}\.\d{1,2}$)$/ }
        ]
      },
      resourceForm: {
        images: [],
        imagesName: [],
        names: [],
        size: [],
        formats: []
      }
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList()
    this.getNav()
  },
  methods: {
    //批量修改分类//4
    editType() {
      if (this.batchList.length > 0) {
        this.typeDialog = true;
        this.getTree();
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    getTree() {
      getNavAPI().then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list
      };
    },
    selectFun(node) {
      this.typeform.diyTypeId=[];
      this.typeform.diyTypeCode=[];
      this.typeform.diyTypeId.push(node.id);
      this.typeform.diyTypeCode.push(node.code);
    },
    deselectFun(node) {
      for (var i = 0; i < this.typeform.diyTypeId.length; i++) {
        if (this.typeform.diyTypeId[i] == node.id) {
          this.typeform.diyTypeId.splice(i, 1);
          this.typeform.diyTypeCode.splice(i, 1);
        }
      }
    },
    //确认修改分类
    confirmType() {
      if(!this.treeSelectValue){
        this.$message.warning('请选择分类')
      }else{
        this.typeform.ids = this.batchList.map(item => item.id);
        updateTypeAPI(this.typeform).then(res => {
          if(res.data.code == 0){
            this.$message.success('修改成功')
            this.typeDialog = false;
            this.treeSelectValue = null;
          }else{
            operationMsg.apply(this, [res.data, `批量修改`]);
          }
        })
      }
    },
    getNav() {
      getNavAPI('图片').then(res => {
        res.data.code == 0 ? this.navTree = [{ showName: "全部"}].concat(res.data.data) : this.$message.error('获取数据失败')
      });
    },
    handleNodeClick(data){ //点击树节点获取table数据
      this.listQuery.diyTypeId = data.id
      this.listQuery.diyTypeCode = data.code
      this.getList()
    },

    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code == 0){
          this.list = res.data.data.list
          this.total = Number(res.data.data.total)
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
        this.listQuery.status = null
      } else{
        this.listQuery.status = tab.index-1
      }
      this.getList();
    },
    // 导入图片
    upload() {
      const id = this.listQuery.diyTypeId
      this.$nextTick(() => {
        this.$refs['resourceForm'].clearValidate()
      });
      if(id) {
        this.dialogFormVisible = true
      } else {
        this.$message.warning('请选择自定义分类!')
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`单次上传最多10个文件`);
    },
    beforeUpload(file){ //beforeUpload、handleSuccess上传图片相关
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF/JPEG/BMP 格式!');
        return isJPG
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return isLt2M
      }
      this.uploading = true
      this.$message.warning('上传中');
    },
    handleSuccess(response, file, fileList){
      this.$message.success('上传成功')
      // 转换大小
      var fileSize = response.size
      var convertFileSize = Math.round((fileSize / 1024 / 1024) * 100)/100.0
      var size =  convertFileSize + 'M'

      this.resourceForm.names.push(response.originalFileName)
      this.resourceForm.imagesName.push(response.originalFileName)
      this.resourceForm.images.push(response.fileName)
      this.resourceForm.formats.push(response.suffixName)
      this.resourceForm.size.push(size)
    },
    // 全部上传
    allUpload() {
      this.resourceForm.diyType = {
        code: this.listQuery.diyTypeCode,
        dtId: this.listQuery.diyTypeId
      }
      // this.audioList.push(this.resourceForm)
      if(this.resourceForm.names.length > 0) {
        this.$refs['resourceForm'].validate((valid) => {
          if(valid) {
            this.sending = true
            importAPI(this.resourceForm).then(res => {
              if(res.data.code == 0) {
                this.$message.success('导入成功')
                this.resourceForm = {
                  names: [],
                  imagesName: [],
                  images: [],
                  formats: [],
                  size: []
                }
                this.$refs['myupload'].clearFiles()
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('导入失败')
              }
              this.sending = false
            })
          }
        })
      }else {
        this.$message.error('请选择图片资源并且填入售价!')
      }
    },
    // 全部取消
    cancelFiles() {
      this.$refs['myupload'].clearFiles();
      this.fileList = []
    },
    batchExamine(){//批量审核
      if(this.batchList.length > 0){
        const status = this.batchList.every(el => el.status == 0)
        if (status) {
          confirm.apply(this,['确定审核通过已选图片吗？']).then(() => {
            const ids = getMultipleSelectionIDs(this.batchList);
            batchExamineAPI(ids).then(res => {
              if(res.data.code == 0){
                this.$message.success('操作成功');
                this.getList();
              }
            })
          })
        } else{
          this.$message.error('只有未审核状态数据才能进行审核哦');
        }
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },
    editReadDialog() {//修改阅读权限
      if(this.batchList.length > 0){
        this.dialogVisible = true
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },
    editRead() {//确认修改销售方式
        const ids = getMultipleSelectionIDs(this.batchList);
        const data = {
          readTextPower: this.readType,
          ids:ids
        }
        editReadTypeAPI(data).then(res => {
          this.dialogVisible = false
          if(res.data.code == 0){
            this.$message.success('操作成功');
            this.getList();
          } else{
            this.$message.success('修改失败');
          }
        })
    },
    editPriceDialog() {//修改价格弹窗
      if(this.batchList.length > 0){
        this.dataForm.money = ''
        this.priceType = 0
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
          this.dialogPrice = true
        } else{
          this.$message.error('请至少选择一条数据进行操作');
      }
    },
    editPrice() {//确认修改价格
      const ids = getMultipleSelectionIDs(this.batchList);
      const data = {
        ids:ids
      }
      if(this.priceType == 1 && this.dataForm.money != null){//付费
          data.realPrice = this.dataForm.money
          this.$refs['dataForm'].validate((valid) => {
            if(valid) {
              editPriceTypeAPI(data).then(res =>{
                if(res.data.code == 0){
                  this.$message.success('操作成功');
                  this.dialogPrice = false
                  this.getList();
                } else {
                  this.$message.error('操作失败');
                }
              })
            }
          })
      } else{
        data.realPrice = 0
        editPriceTypeAPI(data).then(res =>{//免费
          if(res.data.code == 0){
            this.$message.success('操作成功');
            this.dialogPrice = false
            this.getList();
          } else{
            this.$message.error('操作失败');
          }
        })
      }
    },
    editStatus(status) {//批量上下架--已下架才能批量上架-已上架才能批量下架
      if(this.batchList.length > 0){
        const ids = getMultipleSelectionIDs(this.batchList);
        const data = {
            ids: ids,
            status: status
          }
        if(status == 1) {//批量上架
          const type = this.batchList.every(data => data.status == 2)
          if(type){
            confirm.apply(this,['确定上架已选内容吗？']).then(() => {
              editStatusAPI(data).then(res => {
                if(res.data.code == 0){
                  this.$message.success('操作成功');
                  this.getList();
                }
              })
            })
          } else{
            this.$message.error('您选择的状态数据不能执行此操作，请重新选择');
          }
        } else{//批量下架
          const type = this.batchList.every(data => data.status == 1)
          if(type){
            confirm.apply(this,['确定下架已选内容吗？']).then(() => {
              editStatusAPI(data).then(res => {
                if(res.data.code == 0){
                  this.$message.success('操作成功');
                  this.getList();
                }
              })
            })
          } else{
            this.$message.error('您选择的状态数据不能执行此操作，请重新选择');
          }
        }
      } else{
        this.$message.error('请至少选择一条数据进行操作');
      }
    },
    deleteBtn(id){//单条删除
      const ids = [];
      ids.push(id);
      confirm.apply(this,['确定要删除选择的图片信息吗？']).then(() => {
        batchDeleteAPI(ids).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
          this.getList()
        })
      })
    },
    batchDelete(){//批量删除--不能删除已上架的资源
      if(this.batchList.length == 0){
        this.$message.error('请选择至少一条记录进行操作')
      } else{
        const dataType = this.batchList.every(data => data.status != 1)
        if(dataType){
          const ids = getMultipleSelectionIDs(this.batchList);
          confirm.apply(this,['确定要删除选择的图片信息吗？']).then(() => {
            batchDeleteAPI(ids).then(res => {
              requestMsg.apply(this,[res.data,'删除'])
              this.getList()
            })
          })
        } else{
          this.$message.warning('已上架数据不能删除')
        }
      }
    },
    chioceList(val) {
      this.batchList = val;
    },
    handleFilter(){
      if(this.timeLimit){
        this.listQuery.beginTime = this.timeLimit[0]
        this.listQuery.endTime = this.timeLimit[1]
      } else {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }
      this.listQuery.pageNum = 1
      this.listQuery.status = this.listQuery.status
      this.getList()
    },
    resetFilter(){//重置
      this.timeLimit = []
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        resourceType: 32,//文章类型 31 研究集成  32 学术活动 33 其他
        status: this.listQuery.status,
        diyTypeId: this.listQuery.diyTypeId,
        diyTypeCode: this.listQuery.diyTypeCode
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.listQuery.status = this.listQuery.status
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.listQuery.status = this.listQuery.status
      this.getList()
    }
  },
  components: {Treeselect}//6
}
</script>

<style lang="less">
.el-tabs__header,.el-tabs--card>.el-tabs__header{
  border: 0;
  margin-bottom: 0;
}
// .aa{
//   margin-left: 80px;
//   width: 300px;
//   margin-top: 20px;
// }
// .aa input{
//   height: 30px;
// }
.el-tree-node__content {
  height: 30px;
}
// 上架颜色
.putawayColor {
  color: #088B49;
}
// 下架颜色
.soldColor {
  color: #E88403;
}

</style>
