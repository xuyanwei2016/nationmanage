<template>
  <el-container>
    <el-aside width="200px" class="tree-aside">
      <el-tree :data="navTree" ref="tree" :props="defaultProps" @node-click="handleNodeClick" node-key="id" show-checkbox check-on-click-node highlight-current :expand-on-click-node="false"></el-tree>
    </el-aside>

    <el-main>
      <div class="nav-buttons-container">
        <router-link to="package_management/add_edit_package?type=create" v-if="authBtns.filter(i => i.idName=='addbtn').length > 0">
          <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>
        </router-link>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('upbtn') >= 0" @click="handleSetting('bookstatus', 1)">{{authBtns.filter(i => i.idName=='upbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='upbtn').length>0 && authBtns.filter(i => i.idName=='upbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('upbtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('downbtn') >= 0" @click="handleSetting('bookstatus', 0)">{{authBtns.filter(i => i.idName=='downbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='downbtn').length>0 && authBtns.filter(i => i.idName=='downbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('downbtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('exportbtn') >= 0" @click="exportExcel">{{authBtns.filter(i => i.idName=='exportbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportbtn').length>0 && authBtns.filter(i => i.idName=='exportbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportbtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('salebtn') >= 0" @click="handleSetting('saleStatus', 1)">{{authBtns.filter(i => i.idName=='salebtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='salebtn').length>0 && authBtns.filter(i => i.idName=='salebtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('salebtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('cancelbtn') >= 0" @click="handleSetting('saleStatus', 0)">{{authBtns.filter(i => i.idName=='cancelbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='cancelbtn').length>0 && authBtns.filter(i => i.idName=='cancelbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('cancelbtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('salebtn2') >= 0" @click="massPresale">{{authBtns.filter(i => i.idName=='salebtn2')[0].name}}<i v-if="authBtns.filter(i => i.idName=='salebtn2').length>0 && authBtns.filter(i => i.idName=='salebtn2')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('salebtn2')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('cancel') >= 0" @click="handleSetting('presaleStatus', 0)">{{authBtns.filter(i => i.idName=='cancel')[0].name}}<i v-if="authBtns.filter(i => i.idName=='cancel').length>0 && authBtns.filter(i => i.idName=='cancel')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('cancel')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('uploadbtn') >= 0" @click="handleUpload">{{authBtns.filter(i => i.idName=='uploadbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='uploadbtn').length>0 && authBtns.filter(i => i.idName=='uploadbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('uploadbtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('editbtn1') >= 0" @click="handleSubtitle">{{authBtns.filter(i => i.idName=='editbtn1')[0].name}}<i v-if="authBtns.filter(i => i.idName=='editbtn1').length>0 && authBtns.filter(i => i.idName=='editbtn1')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('editbtn1')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('picbtn') >= 0" @click="handlePic">{{authBtns.filter(i => i.idName=='picbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='picbtn').length>0 && authBtns.filter(i => i.idName=='picbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('picbtn')].icon, 'el-icon--right']"></i></el-button>

        <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>

      </div>

      <el-form inline class="filter-form-inline">
        <el-form-item label="商品名称">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name"  clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('name')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="书代号">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.bookNo" clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('bookNo')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.isbn" clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('isbn')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="出版社">
          <el-select clearable v-model="listQuery.publisherid">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="publisher in publishers" :key="publisher.publisherid" :label="publisher.name" :value="publisher.publisherid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上下架状态">
          <el-select v-model="listQuery.bookstatus">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架时间" v-if="listQuery.bookstatus===1">
          <el-date-picker v-model="shelvesTime" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="下架时间" v-if="listQuery.bookstatus===0">
          <el-date-picker v-model="offShelvesTime" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.subTitle" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售状态">
          <el-radio-group v-model="listQuery.saleStatus">
            <el-radio :label="1">可售</el-radio>
            <el-radio :label="0">不可售</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="书刊类型">
          <el-radio-group v-model="listQuery.foreignJournalsStatus">
            <el-radio :label="1">外版书</el-radio>
            <el-radio :label="0">本版书</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预售状态">
          <el-radio-group v-model="listQuery.presaleStatus">
            <el-radio :label="1">预售</el-radio>
            <el-radio :label="0">不预售</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有无附件">
          <el-radio-group v-model="listQuery.fileStatus">
            <el-radio :label="1">有附件</el-radio>
            <el-radio :label="0">无附件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :key="tableKey" :data="list" @selection-change="handleSelectionChange" border highlight-current-row v-loading="listLoading" stripe element-loading-text="给我一点时间">
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
        <el-table-column label="定价" min-width="55" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.price}}</span>
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
            <span v-if="scope.row.foreignJournalsStatus===0">本版书</span>
            <span v-else-if="scope.row.foreignJournalsStatus===1" style="color:#008000;">外版书</span>
          </template>
        </el-table-column>
        <el-table-column label="上下架状态" min-width="75" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bookstatus===0" style="color:#CC6600;">下架</span>
            <span v-else-if="scope.row.bookstatus===1" style="color:#008000;">上架</span>
          </template>
        </el-table-column>
        <el-table-column label="上下架时间" min-width="140" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bookstatus===0">{{scope.row.offShelvesTime}}</span>
            <span v-else-if="scope.row.bookstatus===1">{{scope.row.shelvesTime}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="small-padding fixed-width" label="操作" width="140" align="center">
          <template slot-scope="scope">
            <router-link :to="`package_management/add_edit_package?type=update&id=${scope.row.id}`" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0">
              <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
            </router-link><!--
             --><a :href="`/#/bookItem?id=${scope.row.id}`" target="_blank" ><i :class="authBtns.filter(i => i.idName=='viewbtn')[0].icon" :title="authBtns.filter(i => i.idName=='viewbtn')[0].name"></i></a><!--
             --><i v-if="authBtns.filter(i => i.idName=='downbtn2').length > 0 || authBtns.filter(i => i.idName=='upbtn2').length > 0" :class="scope.row.bookstatus===1 ? authBtns.filter(i => i.idName=='downbtn2')[0].icon : authBtns.filter(i => i.idName=='upbtn2')[0].icon" @click="singleSetting(scope.row)" :title=" scope.row.bookstatus===1 ? authBtns.filter(i => i.idName=='downbtn2')[0].name : authBtns.filter(i => i.idName=='upbtn2')[0].name "></i><!--
             --><i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" :title="authBtns.filter(i => i.idName=='removebtn')[0].name"  v-if="authBtns.filter(i => i.idName=='removebtn').length > 0 && scope.row.bookstatus===0" @click="singleDelete(scope.row.id)" ></i>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
        </el-pagination>
      </div>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" v-if="dialogFormVisible">
        <el-form :model="presale" ref="massForm" v-if="dialogStatus==='presale'">
          <el-form-item label="预售数量：" :rules="{required: true, message: '未填写', trigger: 'change'}">
            <el-input-number v-model="presale.presaleNumber" :min="1" :max="99999"></el-input-number>&nbsp; 本
          </el-form-item>
          <el-form-item label="预售提示语：" style="margin-bottom: 0;" :rules="{ max: 100, message: '最多100字', trigger: 'change' }">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="presale.prompt" placeholder="最多100个字符"></el-input>
          </el-form-item>
        </el-form>

        <el-form :model="subtitleData" ref="massForm" v-else-if="dialogStatus==='subtitle'">
          <el-form-item label="副标题名称：" style="margin-bottom: 0;" :rules="{ max: 500, message: '最多500字', trigger: 'change' }">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="subtitleData.subTitle" placeholder="最多500个字符"></el-input>
          </el-form-item>
        </el-form>

        <el-form :model="fileTemp" ref="massForm" v-else-if="dialogStatus==='upload'" label-width="100px" style='margin-right:10px;'>
          <el-form-item label="资源类型：" prop="fileStatus" :rules="{required: true, message: '未选择', trigger: 'change'}">
            <el-radio-group v-model="fileTemp.fileStatus">
              <el-radio :label="1">文件</el-radio><el-radio :label="2">链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传文件：" prop="file" v-if="fileTemp.fileStatus===1" :rules="{required: true, message: '未上传', trigger: 'change'}">
            <el-col :span="12">
              <el-input v-model="fileTemp.file" disabled></el-input>
            </el-col>
            <el-col :span="12" style="padding-left:15px;">
              <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess">
                <el-button :loading="uploading">选择文件</el-button>
              </el-upload>
            </el-col>
          </el-form-item>
          <el-form-item label="链接地址：" prop="fileLink" v-else-if="fileTemp.fileStatus===2" :rules="{required: true, message: '未填写', trigger: 'change'}">
            <el-input v-model="fileTemp.fileLink"></el-input>
          </el-form-item>
        </el-form>

        <el-form :model="picTemp" ref="massForm" v-else-if="dialogStatus==='relate'" label-width="100px" style='margin-right:20px;'>
          <!-- <el-form-item label="添加图片：" prop="relationPic">
            <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" list-type="picture-card" :on-preview="handlePicPreview" :on-success="handlePicSuccess" :before-upload="beforePicUpload" :on-remove="handleRemove" :disabled="uploading">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="相关描述：" prop="relationPicDescribe" :rules="{ max: 100, trigger: 'change'}">
            <el-input v-model="picTemp.relationPicDescribe" placeholder="最多100字"></el-input>
          </el-form-item>
          <el-form-item label="链接地址：" prop="relationPicUrl" :rules="{ max: 100, trigger: 'change'}">
            <el-input v-model="picTemp.relationPicUrl" placeholder="最多100字"></el-input>
          </el-form-item> -->
          <tinymce v-model="picTemp.relationPicture" style="width:800px"></tinymce>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button v-if="dialogStatus==='presale'" @click="presaleSubmit" >确定</el-button>
          <el-button v-else-if="dialogStatus==='subtitle'" @click="subtitleSubmit" >确定</el-button>
          <el-button v-else-if="dialogStatus==='upload'" @click="uploadValid" >确定</el-button>
          <el-button v-else-if="dialogStatus==='relate'" @click="relateSubmit" >确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </span>
      </el-dialog>

      <!-- <el-dialog :title="dialogImage.name" :visible.sync="dialogPvVisible" custom-class="image-preview">
        <img :src="`${dialogImage.url}`" :alt="`${dialogImage.name}`">
      </el-dialog> -->

      <el-dialog :title="`输入查询的${textTitle[titleStatus]}`" :visible.sync="showTextVisible">
        <el-input type="textarea" v-model="textarea" :autosize="{minRows: 6}" placeholder="请用回车enter键隔开"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="submitText">确定</el-button>
          <el-button @click="showTextVisible = false">取消</el-button>
        </span>
      </el-dialog>

    </el-main>

  </el-container>
</template>

<script>
import queryString from 'query-string'
import { uploadPath, requestPath } from '@/utils/global.js'
import { getListAPI, getNavAPI, getPublisherAPI, massShelvesAPI, massSaleAPI, presaleAPI, deleteAPI, subtitleAPI, uploadFileAPI, relatePicAPI } from '@/api/book-infomation/package'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import tinymce from '@/components/Tinymce'
import store from '@/store'

export default {
  components:{tinymce},
  data() {
    return {
      authBtns: [],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      textarea:'',
      showTextVisible:false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        code: null,
        pageNum: 1,
        pageSize: 100,
        name: '',
        bookNo: '',
        isbn: '',
        publisherid: null,
        subTitle: '',
        saleStatus: null,
        foreignJournalsStatus: null,
        presaleStatus: null,
        fileStatus: null,
        bookstatus: null
      },
      navTree: [],
      publishers: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      shelvesTime: [],
      offShelvesTime: [],
      ids: [],
      temp: {},
      textMap: {
        relate: '关联图片',
        upload: '上传附件',
        subtitle: '修改副标题',
        presale: '设置预售'
      },
      dialogStatus: '',
      textTitle: {
        name: '商品名称',
        bookNo: '书代号',
        isbn: 'ISBN'
      },
      titleStatus: '',
      presale:{},
      subtitleData: {},
      fileTemp: {},
      picTemp: {},
      // dialogImage: {},
      uploadPath: uploadPath,
      uploading: false,
      dialogFormVisible: false,
      dialogPvVisible: false,
      multipleSelection:[]
    }
  },
  mounted() {
    if( ifUndefined(store.getters.packageManagementSerKeys.pageNum) ){
      this.listQuery = store.getters.packageManagementSerKeys
      if(ifUndefined(this.listQuery.beginshelvesTime) || ifUndefined(this.listQuery.endshelvesTime)){
        this.shelvesTime = []
        this.shelvesTime[0] = this.listQuery.beginshelvesTime
        this.shelvesTime[1] = this.listQuery.endshelvesTime
      }
      if(ifUndefined(this.listQuery.beginoffShelvesTime) || ifUndefined(this.listQuery.endoffShelvesTime)){
        this.offShelvesTime = []
        this.offShelvesTime[0] = this.listQuery.beginoffShelvesTime
        this.offShelvesTime[1] = this.listQuery.endoffShelvesTime
      }
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getNav()
    this.getList()
    this.getPublisher()
  },
  methods: {
    showTextarea(type){//显示文本域
      this.showTextVisible = true
      this.titleStatus = type
      this.textarea = this.listQuery[type]
    },
    submitText(){
      this.listQuery[this.titleStatus] = this.textarea
      this.showTextVisible = false
    },
    relateSubmit(){
      relatePicAPI(this.picTemp).then(res => {
        requestMsg.apply(this, [res.data, '关联图片'])
        res.data.status ? this.dialogFormVisible = false : true
        this.getList()
      })
    },
    handlePic(){
      if(this.multipleSelection.length!=0){
        this.picTemp = {
          id: this.ids,
          relationPicture:''
          // relationPic: '',
          // relationPicDescribe: '',
          // relationPicUrl: ''
        }
        this.dialogStatus = 'relate'
        this.dialogFormVisible = true

      } else {
        this.$message.warning('请先选择需要设置的条目')
      }
    },
    //beforePicUpload、handlePicSuccess关联图片传图相关
    // beforePicUpload(file){
    //   const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
    //   const isLt3M = file.size / 1024 / 1024 < 3
    //   if (!isJPG) {
    //     this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
    //     return isJPG
    //   }
    //   if (!isLt3M) {
    //     this.$message.error('上传图片大小不能超过 3MB!')
    //     return isLt3M
    //   }
    //   this.uploading = true
    //   this.$message.warning('上传中')
    // },
    // handlePicSuccess(response, file, fileList){
    //   this.uploading = false
    //   this.$message.success('上传成功')
    //   document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
    //   this.picTemp.relationPic = response
    // },
    // handlePicPreview(file){ // 图片预览
    //   this.dialogImage = file
    //   this.dialogPvVisible = true
    // },
    // handleRemove(){ // 图片删除
    //   document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
    //   this.picTemp.relationPic = ''
    // },
    uploadValid(){
      this.$refs['massForm'].validate((valid) => {
        if (valid) {
          if (this.multipleSelection.some(item => item.fileStatus !== 0)) {
            confirm.apply(this,['所选条目中部分套餐已经有附件，如果继续将会覆盖，是否继续?']).then(() => {
              this.uploadSubmit()
            });
          } else {
            this.uploadSubmit()
          }
        }
      })
    },
    uploadSubmit(){
      let { file, fileLink, ...tempData } = this.fileTemp
      tempData.fileStatus === 1 ? tempData.file = this.fileTemp.file : tempData.fileLink = this.fileTemp.fileLink
      uploadFileAPI(tempData).then(res => {
        operationMsg.apply(this,[res.data.code,'上传附件'])
        res.data.status ? this.dialogFormVisible = false : true
      })
    },
    //beforeUpload、handleSuccess附件上传相关
    beforeUpload(file){
      const isPDF = file.type === 'application/pdf'
      if (!isPDF) {
        this.$message.error('附件文件只能是 PDF 格式!')
        return isPDF;
      }
      this.uploading = true
    },
    handleSuccess(response, file, fileList){
      // this.$message.success('上传成功')
      this.fileTemp.file = response
      this.uploading = false
    },
    handleUpload(){
      if(this.multipleSelection.length!=0){
        this.fileTemp = {
          id: this.ids,
          fileStatus: 1,
          file: ''
        }
        this.dialogStatus = 'upload'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['massForm'].clearValidate()
        })
      } else {
        this.$message.warning('请先选择需要设置的条目')
      }
    },
    exportExcel(){
      let {pageNum, pageSize, ...params} = this.listQuery
      let tempParams = {}
      for (const key in params) {
        if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
          tempParams[key] = params[key]
        }
      }
      let paramStr = queryString.stringify(tempParams)
      paramStr ? window.open(`${process.env.BASE_API}${requestPath.book}/package/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.book}/package/export`)
      // console.log(`${process.env.BASE_API}${requestPath.book}/package/export?${paramStr}`)
    },
    massDelete(){
      this.multipleSelection.length!=0 ? this.massSetting('确定删除选择的条目吗？', deleteAPI, this.ids, `批量删除${this.multipleSelection.length}项`)
       : this.$message.warning('请先选择需要设置的条目')
    },
    singleDelete(id){
      this.massSetting('确定删除选择的条目吗？', deleteAPI, [id], `删除`)
    },
    singleSetting(row){
      let data= { bookIds: [row.id] }
      if (row.bookstatus === 1) {
        data.bookstatus = 0
        this.massSetting('确定下架此套餐吗？', massShelvesAPI, data, `下架`)
      } else {
        data.bookstatus = 1
        this.massSetting('确定上架此套餐吗？', massShelvesAPI, data, `上架`)
      }
    },
    subtitleSubmit(){
      this.$refs['massForm'].validate((valid) => {
        if (valid) {
          subtitleAPI(this.subtitleData).then(res => {
            operationMsg.apply(this,[res.data.code, `批量设置${this.multipleSelection.length}项副标题`])
            res.data.status ? this.dialogFormVisible = false : true
          })
        }
      })
    },
    handleSubtitle(){
      if(this.multipleSelection.length!=0){
        this.subtitleData = {
          bookIds: this.ids,
          subTitle: ''
        }
        this.dialogStatus = 'subtitle'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['massForm'].clearValidate()
        })
      } else {
        this.$message.warning('请先选择需要设置的条目')
      }
    },
    presaleSubmit(){
      this.$refs['massForm'].validate((valid) => {
        if (valid) {
          presaleAPI(this.presale).then(res => {
            operationMsg.apply(this,[res.data.code, `批量设置${this.multipleSelection.length}项预售`])
            res.data.status ? this.dialogFormVisible = false : true
          })
        }
      })
    },
    massPresale(){
      if(this.multipleSelection.length!=0){
        this.presale = {
          bookIds: this.ids,
          presaleNumber: 99999,
          presaleStatus: 1,
          prompt: ''
        }
        this.dialogStatus = 'presale'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['massForm'].clearValidate()
        })
      } else {
        this.$message.warning('请先选择需要设置的条目')
      }
    },
    massSetting(msg, api, data, msgName){
      confirm.apply(this,[msg]).then(() => {
        api(data).then(res => {
          operationMsg.apply(this,[res.data.code, msgName])
        })
      });
    },
    handleSetting(statusKey, value){ //批量设置
      let length = this.multipleSelection.length
      if(length!=0){
        let data= { bookIds: this.ids }
        data[statusKey] = value
        if (statusKey === 'bookstatus') {
          value === 1 ? this.massSetting('确定上架此这个/这些套餐吗？', massShelvesAPI, data, `批量上架${length}项`) : this.massSetting('确定下架这个/这些套餐吗？', massShelvesAPI, data, `批量下架${length}项`)
        } else if (statusKey === 'saleStatus') {
          value === 1 ? this.massSetting('确定设置这个/这些套餐可售吗？', massSaleAPI, data, `批量可售${length}项`) : this.massSetting('确定设置这个/这些套餐不可售吗？', massSaleAPI, data, `批量不可售${length}项`)
        } else {
          this.massSetting('确定取消这个/这些套餐的预售吗？', presaleAPI, data, `批量取消${length}项预售`)
        }
      } else {
        this.$message.warning('请先选择需要设置的条目')
      }
    },
    handleNodeClick(data, node, tree){ //点击树节点获取table数据
      // console.log(data, node, tree);
      this.listQuery.code = data.code
      this.$refs.tree.setCheckedKeys([data.id])
      this.getList()
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
      })
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        // console.log(res)
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.ids = getMultipleSelectionIDs(this.multipleSelection) : this.multipleSelection
    },
    resetFilter(){
      this.listQuery = {
        code: this.listQuery.code,
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        name: '',
        bookNo: '',
        isbn: '',
        publisherid: null,
        subTitle: '',
        saleStatus: null,
        foreignJournalsStatus: null,
        presaleStatus: null,
        fileStatus: null,
        bookstatus: null
      }
      this.shelvesTime = []
      this.offShelvesTime = []
      this.getList()
    },
    handleFilter(){
      this.listQuery.code = this.$refs.tree.getCheckedNodes().map(node => node.code).join(' ')
      let {beginoffShelvesTime, endoffShelvesTime, beginshelvesTime, endshelvesTime, ...tempQuery} = this.listQuery
      this.listQuery = tempQuery
      if (this.listQuery.bookstatus === 1) {
        if (this.shelvesTime) {
          this.listQuery.beginshelvesTime = this.shelvesTime[0]
          this.listQuery.endshelvesTime = this.shelvesTime[1]
        } else {
          this.listQuery.beginshelvesTime = null
          this.listQuery.endshelvesTime = null
        }
      } else if (this.listQuery.bookstatus === 0) {
        if (this.offShelvesTime) {
          this.listQuery.beginoffShelvesTime = this.offShelvesTime[0]
          this.listQuery.endoffShelvesTime = this.offShelvesTime[1]
        } else {
          this.listQuery.beginoffShelvesTime = null
          this.listQuery.endoffShelvesTime = null
        }
      }
      store.dispatch('SetPackageManagementSerKeys',this.listQuery).then(res => {
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
    getPublisher(){
      getPublisherAPI().then(res => {
        res.data.code === 0 ? this.publishers = res.data.data : this.$message.error('获取出版社数据失败')
      })
    }
  }
}
</script>
