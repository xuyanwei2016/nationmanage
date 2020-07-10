<template>
  <div class="app-container calendar-list-container thesaurus">
    <div class="nav-buttons-container">
      <div class="buttons">
        <!--导入主题词-->
        <el-button v-if="authBtns.map(i => i.idName).indexOf('uploadBtn') >= 0" @click="uploadBtn">{{authBtns.filter(i => i.idName=='uploadBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='uploadBtn').length>0 && authBtns.filter(i => i.idName=='uploadBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('uploadBtn')].icon, 'el-icon--right']"></i></el-button>
        <!--添加-->
        <router-link :to="{path:`thesaurus/edit_thesaurus`}" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0">
          <el-button v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button>
        </router-link>
        <!--批量审核-->
        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchAuditBtn') >= 0" @click="batchAuditBtn">{{authBtns.filter(i => i.idName=='batchAuditBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchAuditBtn').length>0 && authBtns.filter(i => i.idName=='batchAuditBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchAuditBtn')].icon, 'el-icon--right']"></i></el-button>

        <!--批量删除-->
        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDeleteBtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='batchDeleteBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchDeleteBtn').length>0 && authBtns.filter(i => i.idName=='batchDeleteBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDeleteBtn')].icon, 'el-icon--right']"></i></el-button>

        <!--<el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon&#45;&#45;right']"></i></el-button>-->
      </div>
      <!--导入主题词-->
      <el-form inline class="demo-form-inline">
        <el-form-item><!-- label="检索"-->
          <el-input @keyup.enter.native="handleFilter" style="width: 400px;" @clear="clear" placeholder="" class="filter-item" v-model="listQuery.title" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" icon="el-icon-search" @click="handleFilter">检索</el-button>
        </el-form-item>
      </el-form>
    </div>


    <template>

      <el-tabs v-model="activeName" type="card" @tab-click="listSatus">
        <el-tab-pane label="所有主题词" name="all"></el-tab-pane>
        <el-tab-pane v-for="(item) in status" :key="item" :label="item" :name="item"></el-tab-pane>
      </el-tabs>
    </template>
    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @current-change="handleCurChange" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column align="center" min-width="150px" label="链接标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150px" label="链接地址">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="点击量" min-width="30px">
        <template slot-scope="scope">
          <span v-if="scope.row.clickNum">{{scope.row.clickNum}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" min-width="30px">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="40px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{path:`thesaurus/edit_thesaurus`,query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name"></i>
          </router-link>
          <i :class="authBtns.filter(i => i.idName=='lookBtn')[0].icon" v-if="authBtns.filter(i => i.idName=='lookBtn').length > 0" :title="authBtns.filter(i => i.idName=='lookBtn')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px" style='margin-left:50px;'>
        <el-form-item label="链接标题：" prop="title">
          <el-col :span="11">
            <el-input v-model="temp.title" placeholder="请输入链接标题"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="链接地址：" prop="url">
          <el-col :span="11">
            <el-input v-model="temp.url"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="链接图片：" prop="img">
          <el-col :span="11">
            <el-input v-model="temp.img" disabled></el-input>
          </el-col>
          <el-col :span="13" style="padding-left:15px;">
            <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess">
              <el-button :disabled="uploading">上传图片</el-button>
              <img v-if="temp.img" style="height:36px;vertical-align: middle;" :src="`${domain}${requestPath.file}?fileName=${temp.img}&isOnLine=true`" :alt="`${temp.title}`">
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="排序号：" prop="sort">
          <el-col :span="5">
            <el-input type="input" placeholder="请输入内容" v-model="temp.sort" clearable></el-input>
          </el-col>
          <el-col :span="19" style="color:gray; padding-left:15px;">当前最大排序号为{{maxSort}}，修改排序号会将当前内容插入到对应排序位置</el-col>
        </el-form-item>
        <el-form-item label="链接介绍：">
          <el-col :span="11">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" class="form-submit" @click="createData">保存</el-button>
        <el-button v-else class="form-submit" @click="updateData">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { requestPath, uploadPath } from '@/utils/global.js'
import { getFriendlink, deleteFriendlink, updateFriendlink, addFriendlink } from "@/api/website-management/friendlinkManagement"
import {operationMsg, confirm} from '@/utils/publicFunctions'
import { getMultipleSelectionIDs, getMaxSort } from '@/filters/getIds'
import store from '@/store'

export default {
  name: "complexTable",
  data() {
    const validateUrl = (rule, value, callback) => {
      let urlreg = /^(http(s)?:\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
      if ( !urlreg.test(value) ){
        callback(new Error('请输入真实合法的url，以http://或https://开始'));
      } else {
        callback()
      }
    };
    const validateSort = (rule, value, callback) => {
      let reg = /^([1-9]\d*|0)$/;
      if ( !reg.test(value) ){
        callback(new Error('请输入0及正整数表示的排序号'));
      } else {
        callback()
      }
    };
    return {
      status:[// 0：录入中 1：待审核 2：审核中 3：审核不通过 4：已上架 5：已下架 ,
        '已录入',
        '审核通过',
        '审核未通过',
      ],
      activeName:'all',
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 100,
        title: ''
      },
      massQuery: {
        ids: []
      },
      maxSort: 0,
      temp: {
        id: null,
        url: 'http://',
        img: '',
        title: '',
        sort: null,
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新主题词",
        create: "添加主题词"
      },
      dialogPvVisible: false,
      rules: {
        title: [{ type: 'string', required: true, trigger: 'blur', message: '标题必填' }],
        url: [{ required: true, validator: validateUrl }],
        sort: [{ required: true, validator: validateSort }]
      },
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      uploading: false,
      multipleSelection:[]
    };
  },
  mounted() {
    if( ifUndefined(store.getters.friendlink_managementSerKeys.pageNum) ){
      this.listQuery = store.getters.friendlink_managementSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getList();
  },
  methods: {
    clear() {
      this.getList()
    },
    beforeUpload(file){
      this.uploading = true
    },
    handleSuccess(response, file, fileList){
      this.temp.img = response
      this.uploading = false
    },
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    massDelete(){
      if(this.multipleSelection.length>0){
        confirm.apply(this,['确定要删除选择的主题词吗?']).then(() => {
          deleteFriendlink(this.massQuery.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项主题词`])
          })
        })
      } else {
        this.$message.warning('请先选择需要删除的主题词')
      }
    },
    /*批量审核*/
    batchAuditBtn(){
      if(this.multipleSelection.length>0){
        confirm.apply(this,['确定审核通过主题词？']).then(() => {
          /*deleteFriendlink(this.massQuery.ids).then(res => {
            operationMsg.apply(this,[res.data.code,`批量删除${this.multipleSelection.length}项主题词`])
          })*/
        })
      } else {
        this.$message.warning('请先选择需要审核的主题词')
      }
    },
    singleDelete(id) {
      confirm.apply(this,['确定要删除选择的广告位吗?']).then(() => {
        deleteFriendlink([id]).then(res => {
          operationMsg.apply(this,[res.data.code,'删除'])
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection) : true
    },
    getList() {
      this.listLoading = true;
      getFriendlink(this.listQuery).then(response => {
        console.log(response)
        if(response.data.code === 0){
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false;
      });
    },
    handleFilter() {
      store.dispatch('SetFriendlinkManagementSerKeys',this.listQuery).then(res => {
        console.log(res,'保存查询成功')
      })
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        id: null,
        url: 'http://',
        img: '',
        title: '',
        sort: parseInt(this.maxSort)+1,
        description: ''
      };
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // console.log(this.temp);
          addFriendlink(this.temp).then(res => {
            operationMsg.apply(this,[res.data.code,'主题词创建'])
            this.dialogFormVisible = false
          })
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateFriendlink(tempData).then(res => {
            operationMsg.apply(this,[res.data.code,'主题词更新'])
            this.dialogFormVisible = false
          });
        }
      });
    },
    listSatus(tab,event) { //0待审核，1已上架，2已下架Tab切换
      if (tab.index == 0) {
        this.listQuery.bookStatus = null
      } else{
        this.listQuery.bookStatus = tab.index-1
      }
      this.getList();
    },
    /*导入主题词*/
    uploadBtn(){
      this.$message('导入主题词')
    },
  }
};
</script>
<style></style>
