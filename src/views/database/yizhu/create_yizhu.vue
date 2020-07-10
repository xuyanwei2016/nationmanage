<template>
  <div class="app-container inputCss" @click="authorStatus=1,translatorStatus=1">
    <el-form :model="resourceForm" ref="resourceForm" :rules="rules" label-position="right" label-width="120px" class="ib">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <div class="title">基本信息</div>
      <div style="overflow: hidden">
        <div style="float:left;min-width:300px;margin-right:40px" >
          <el-form-item label="图书名称：" prop="name">
            <el-input v-model="resourceForm.name" placeholder="建议在14个字以内，最多不超过50个字" style="width:300px !important"></el-input>
          </el-form-item>
          <el-form-item label="译者：" prop="translator" >
            <div style="position:relative" class="authoryizhu">
              <el-input v-model="resourceForm.translator" clearable placeholder="请输入作者" style="width:300px !important"  @input="translatorLibrary" :disabled="pageStatus==1"></el-input>
              <ul
                style="position:absolute;top:30px;left:0;width:250px;background:#f5f5f5;list-style:none;max-height:200px;z-index:20;overflow-y:scroll;padding-left:0px;"
                v-if="translatorList && translatorList.length>0 && translatorStatus == 0">
                <li style="cursor: pointer" v-for="item in translatorList" :key='item.id'
                    @click.stop="choiceTranslator(item.name,item.id)">{{item.name}}
                </li>
              </ul>
            </div>
          </el-form-item>
          <el-form-item label="责任编辑：" prop="executiveEditor">
            <el-input v-model="resourceForm.executiveEditor" clearable style="width:300px !important" :disabled="pageStatus==1"></el-input>
          </el-form-item>
          <el-form-item label="出版单位：" prop="publisher" style="clear:both">
            <el-input v-model="resourceForm.publisher" clearable placeholder="请输入出版单位" style="width:300px !important" :disabled="pageStatus==1"></el-input>
          </el-form-item>
          <el-form-item label="版次：" prop="revision" style="clear:both">
            <el-input v-model="resourceForm.revision" clearable style="width:300px !important" :disabled="pageStatus==1"></el-input>
          </el-form-item>
        </div>
        <!-- 右侧字段 -->
        <div style="float:left;min-width:300px">
          <el-form-item label="作者：" prop="author">
            <div style="position:relative" class="authoryizhu">
              <el-input v-model="resourceForm.author" clearable placeholder="请输入作者" style="width:300px !important" @input="authorLibrary" :disabled="pageStatus==1"></el-input>
              <ul
                style="position:absolute;top:30px;left:0;width:250px;background:#f5f5f5;list-style:none;padding-left:0px;max-height:200px;z-index:20;overflow-y:scroll"
                v-if="authorList && authorList.length>0 && authorStatus == 0">
                <li style="cursor: pointer" v-for="item in authorList" :key='item.id'
                    @click.stop="choiceAuthor(item.name,item.id)">{{item.name}}
                </li>
              </ul>
            </div>
          </el-form-item>
          <el-form-item label="ISBN：" prop="isbn">
            <el-input v-model="resourceForm.isbn" clearable style="width:300px !important" :disabled="pageStatus==1"></el-input>
          </el-form-item>
          <el-form-item label="丛书名称：" prop="executiveEditor">
            <el-select v-model="resourceForm.bookSeries" style="width:300px" clearable placeholder="请选择丛书名称" :disabled="pageStatus==1">
              <el-option
                v-for="item in bookSeriesList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字数：" prop="fontCount">
            <el-input v-model="resourceForm.fontCount" clearable style="width:300px !important" :disabled="pageStatus==1"></el-input><span>千字</span>
          </el-form-item>
          <el-form-item label="关键词：" prop="keywords">
            <el-input v-model="resourceForm.keywords" clearable placeholder="多个关键词用逗号隔开" style="width:300px !important" :disabled="pageStatus==1"></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="出版时间：" prop="publishTime">
        <el-date-picker type="date" v-model="resourceForm.publishTime"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd" :disabled="pageStatus==1"> </el-date-picker>
      </el-form-item>
      <el-form-item label="自定义分类：" style="clear:both;width:800px">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" :disabled="pageStatus==1">
          <el-tree :data="navTree" ref="tree" show-checkbox node-key="id" :default-checked-keys="checkedKeys"
                   :props="defaultProps" @check="setSelect" :disabled="pageStatus==1"></el-tree>
          <el-select v-model="diyTypeCode" value-key="diytypeid" multiple @remove-tag="setTree"
                     popper-class="hidden-selection" slot="reference" style="width:100%;" placeholder="请选择" :disabled="pageStatus==1">
            <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item" :disabled="pageStatus==1"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item :label='item.name' v-for="(item,index) in labelList" :key="index" style="clear:both;width:800px">
        <el-select multiple placeholder="请选择" v-model="item.selectId" style="width:100%;" :disabled="pageStatus==1">
          <el-option v-for="info in item.list" :key="info.id" :label="info.labelContent" :value="info.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电子书封面：">
        <el-upload :disabled="$route.query.detailsId?true:false"
                   class="avatar-uploader"
                   :action="`${uploadUrl}${uploadPath}`"
                   :show-file-list="false"
                   :on-remove="handleRemove"
                   :on-preview="handlePicPreview"
                   :on-success="handlePicSuccess"
                   :before-upload="beforePicUpload">
          <img :src="`${uploadUrl}?fileName=${resourceForm.bookCover}&isOnLine=true`"
               style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc"
               v-if="resourceForm.bookCover"
               class="avatar">
          <img src="../../../assets/img/bookDefault.png" v-else class="avatar-uploader-icon"
               style="width: 100%; height: 100%;">
        </el-upload>
        <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span>
      </el-form-item>
      <el-form-item label="PDF图书：">
        <span v-if="pageStatus" style="color: #606266; font-size: 14px;font-weight: normal">{{resourceForm.pdfFile?resourceForm.pdf_zh:'未上传文件'}}</span>
        <el-radio-group v-model="resourceForm.pdfType" @change="changePdf" :disabled="pageStatus==1"  v-if="!pageStatus">
          <el-radio :label="0">上传PDF资源</el-radio>
          <el-radio :label="1">绑定已有PDF资源</el-radio>
        </el-radio-group>
        <el-upload :disabled="$route.query.detailsId?true:false" :action="`${uploadUrl}${uploadPath}/info`"
                   :before-upload="beforeUpload" :on-success="handleSuccess" v-if="resourceForm.pdfType == 0&&!pageStatus"
                   :on-remove="handleRemovePdf" :on-exceed="handleExceed" :limit="1">
          <el-button :loading="uploading">上传文件</el-button>
          <span>{{resourceForm.pdf_zh}}</span>
        </el-upload>
        <el-button v-if="resourceForm.pdfType == 1" @click="changePdf" style="display:block">选择文件</el-button>
        <div>
          <el-button v-if="resourceForm.pdf_zh " @click="queryPDF">查看</el-button>
          <span v-if="resourceForm.pdfType == 1">{{resourceForm.pdf_zh}}</span>
        </div>


      </el-form-item>
      <el-form-item label="图书简介：" style="width:800px">
        <tinymce :height=300 ref="editor" v-model="resourceForm.summary" style="width:800px" readonly="true"></tinymce>
      </el-form-item>
      <el-form-item label="图书目录：" style="width:800px">
        <tinymce :height=300 ref="bookCatalog" v-model="resourceForm.bookCatalog" style="width:800px"></tinymce>
      </el-form-item>
      <div class="title">商品信息</div>
      <el-form-item label="书刊类型：" prop="type">
        <el-radio v-model="resourceForm.type" :label=1 :disabled="pageStatus==1">本版书</el-radio>
        <el-radio v-model="resourceForm.type" :label=0 :disabled="pageStatus==1">外版书</el-radio>
      </el-form-item>
      <el-form-item label="销售状态：" prop="status">
        <el-radio v-model="resourceForm.status" :label=1 :disabled="pageStatus==1">可售</el-radio>
        <el-radio v-model="resourceForm.status" :label=0 :disabled="pageStatus==1">不可售</el-radio>
      </el-form-item>
      <p style="margin-left:120px;color:#ccc" v-if="!pageStatus">设置为可售商品在前台可以在线销售和阅读，设置为不可售前台仅展示介绍信息</p>
      <el-form-item label="定价：" prop="pricing">
        <el-input v-model="resourceForm.pricing" clearable placeholder="请输入定价"
                  style="width:250px;margin-right:10px" :disabled="pageStatus==1"></el-input>
        <span style="margin-right:30px">元</span>
        <span class="tip" v-if="!pageStatus">在前台展示为划线价格</span>
      </el-form-item>
      <el-form-item label="售价：" prop="priceOption">
        <el-radio v-model="resourceForm.priceOption" :label=1 :disabled="pageStatus==1">付费</el-radio>
        <el-radio v-model="resourceForm.priceOption" :label=0 :disabled="pageStatus==1">免费</el-radio>
      </el-form-item>
      <el-form-item prop="price">
        <el-input v-model="resourceForm.price" clearable placeholder="请输入售价" v-if="resourceForm.priceOption == 1"
                  style="width:250px;margin-right:10px" :disabled="pageStatus==1"></el-input>
        <span v-if="resourceForm.priceOption == 1">元</span>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-if="pageStatus == 0">
      <el-button @click="dataSubmit">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

    <el-dialog title="选择资源" :visible.sync="dialogVisible" width="900px">
      <el-form inline class="form-inline">
        <el-form-item label="资源名称">
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="上传时间">
          <el-date-picker v-model="timeLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期" @keyup.enter.native="handleFilter">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :key='1' stripe :data="pdfList" element-loading-text="给我一点时间" border highlight-current-row
                ref="goodsTable" @selection-change="goodsSelectionChange">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column label="资源名称" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="作者" min-width="55" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.author}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" min-width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.uploadTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNum"
                       :page-size="listQuery.pageSize" layout="total, prev, pager, next" :total="total"
                       align="center"></el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="selectSubmit">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js'
  import queryString from 'query-string'
  import {getOptionAPI, getNavAPI} from '@/api/database/video'
  import {commonUploadAPI} from '@/api/database/theory' //接口
  import {authorLibraryAPI, translatorLibraryAPI} from '@/api/database/article' //接口
  import {saveAPI, detailsAPI, pdfListAPI, bookSeriesListAPI, labelListAPI} from '@/api/database/yizhu'
  import {requestMsg, confirm} from '@/utils/publicFunctions'
  import {getMultipleSelectionIDs} from '@/filters/getIds'
  import {stitchData} from '@/utils/format'
  import {mapGetters} from 'vuex'

  export default {
    components: {Tinymce},
    data() {
      return {
        authorStatus:1,
        resourceForm: {
          priceOption: 0,
          status: 1,
          type: 1,
          pdfType: 0,
          label: [],
          price: null,
          bookSeries: null,
          nationsType: this.$store.getters.getNation,
          publishTime:null,
        },
        labelQuery: {
          dataType: '医著',
          nationsType: this.$store.getters.getNation
        },
        dialogVisible: false,
        uploading: false,
        pageStatus: 0,
        diyTypeCode: [],
        //自定义标签
        labelList: [],
        defaultProps: {
          children: 'list',
          label: 'showName'
        },
        labelProps: {
          children: 'list',
          label: 'labelContent'
        },
        options: [],
        navTree: [],
        timeLimit: null,
        rules: {
          name: [
            {required: true, pattern: /^.{1,50}$/, message: '请输入图书名称', trigger: 'change'}, {message: '图书名称在50字以内'}
          ],
          author: [
            {required: true, pattern: /^.{1,70}$/, message: '作者长度必须小于70位', trigger: 'change'},
          ],
          isbn: [
            {required: true, message: '请输入纯数字或数字和连字符-', trigger: 'change'}
          ],
          translator: [
            {required: false, pattern: /^.{1,10}$/, message: '请输入10字以内的译者', trigger: 'change'},
          ],
          executiveEditor: [
            {required: false, pattern: /^.{1,10}$/, message: '请输入10字以内的责任编辑', trigger: 'change'},
          ],
          publisher: [
            {required: false, pattern: /^.{1,20}$/, message: '请输入20字以内的出版单位', trigger: 'change'},
          ],
          revision: [
            {required: true, message: '请输入版次', trigger: 'change'},
            {max: 30, message: '请输入30字以内的版次', trigger: 'change'}
          ],
          keywords: [
            {required: false, pattern: /^.{1,30}$/, message: '请输入30字以内的关键词', trigger: 'change'},
          ],
          publishTime: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择书刊类型', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请选择销售状态', trigger: 'change'}
          ],
          priceOption: [
            {required: true, message: '请选择售价类型', trigger: 'change'}
          ],
          pricing: [
            {
              required: false,
              pattern: /^(^[1-9](\d{1,4})?(\.\d{1,2})?$)|(^\d{0,4}\.\d{0,2})|0?$/,
              message: '请输入价格,范围在0-99999之间的定价',
              trigger: 'change'
            },
          ],
          price: [
            {
              required: false,
              pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
              message: '请输入价格,范围在0.1-99999之间',
              trigger: 'change'
            },
          ],
          fontCount: [
            {max: 10, message: '字数输入长度小于10位', trigger: 'change'}
          ]
        },
        checkedKeys: [],
        pdfList: [],
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },
        multiSelection: null,
        total: null,
        code: null,
        resourceList: [],
        authorList: [],
        translatorList: [],
        translatorStatus: 1,
        bookSeriesList: []
      }
    },
    computed: {
      ...mapGetters([
        'getNation'
      ])
    },
    watch: {
      getNation: function (val) {
        this.resourceForm.nationsType = val
        this.listQuery.nationsType = val
        // this.labelQuery.nationsType = val
        // this.getLabel()
      },
    },
    created() {
      this.resourceForm.nationsType = this.$store.getters.getNation
      this.listQuery.nationsType = this.$store.getters.getNation
      this.uploadUrl = uploadUrl
      this.uploadPath = uploadPath
    },
    mounted() {
      this.getbookSeriesList()
      this.getNav();
      this.getOption();
      this.getLabel()
      this.resourceForm.pdfType = 0
    },
    methods: {

      getbookSeriesList() {
        const data = {
          code: 'BOOKSERIES',
          pageNum: 1,
          pageSize: 100
        }
        bookSeriesListAPI(data).then(res => {
          res.data.code === 0 ? this.bookSeriesList = res.data.data.list : this.$message.error('获取丛书数据失败');
        })
      },
      getOption() {
        getOptionAPI().then(res => {
          if (res.data.code === 0) {
            // this.options = res.data.data.map(item => {
            //   let { id: diytypeid, ...temp } = item
            //   return {diytypeid, ...temp}
            // })
            this.options = res.data.data.map(item => {
              let showName = stitchData(res.data.data, item)
              let obj = {
                diytypeid: item.id,
                showName: showName,
                code: item.code,
                typeName: item.typeName,
                oldCode: item.oldCode,
                parentId: item.parentId,
                sort: item.sort
              }
              return obj
            })
            this.isEdit();
          } else {
            this.$message.error(`获取分类选择器选项数据失败`)
          }
        })
      },
      getNav() {
        getNavAPI('医著').then(res => {
          res.data.code === 0 ? this.navTree = res.data.data[0].list : this.$message.error('获取nav数据失败');
        })
      },
      queryPDF() {// 查看pdf
        window.open(uploadUrl + "?fileName=" + this.resourceForm.pdfFile + "&isOnLine=true")
      },
      authorLibrary() {//查询
        this.authorList = [];
        this.resourceForm.authorId = '';
        if (this.resourceForm.author.split(" ").join("").length != 0) {
          this.authorStatus = 0
          authorLibraryAPI(this.resourceForm.author.split(" ").join("")).then(res => {

            if (res.data.code === 0) {
              this.authorList = res.data.data;
              this.resourceForm.authorNameAndId=this.resourceForm.author.trim();
            } else {
              this.$message.error('获取数据失败');
            }
          })
        }
      },
      loseFocus(n){
        n==0?this.authorStatus = 1:this.translatorStatus=1;
      },
      translatorLibrary() {//查询
        this.translatorList = [];
        this.resourceForm.translatorId = '';
        if (this.resourceForm.translator.split(" ").join("").length != 0) {
          this.translatorStatus = 0
          translatorLibraryAPI(this.resourceForm.translator.split(" ").join("")).then(res => {
            if(res.data.code === 0){
              this.translatorList = res.data.data;
              this.resourceForm.translatorNameAndId=this.resourceForm.translator.trim();
            }else{
              this.$message.error('获取数据失败');
            }
          })
        }
      },
      // 自定义标签
      getLabel() {
        labelListAPI(this.labelQuery).then(res => {
          if (res.data.code == 0) {
            if (this.resourceForm.labelContentDiyTypeIds && this.resourceForm.labelContentDiyTypeIds.length > 0) {//查看或者修改
              res.data.data.list.map(el => {
                el.list.map(item => {
                  this.resourceForm.labelContentDiyTypeIds.map(info => {
                    if (item.id == info) {
                      if (el.selectId && el.selectId.length > 0) {
                        el.selectId.push(info)
                      } else {
                        el.selectId = []
                        el.selectId.push(info)
                      }
                    } else {
                      if (!el.selectId) {
                        el.selectId = []
                      }
                    }
                  })
                })
              })
              if (this.$route.query.detailsId) {//查看
                res.data.data.list = res.data.data.list.filter(item => (item.selectId && item.selectId.length > 0))
              }
            } else {
              res.data.data.list.map(el => {
                if (!el.selectId) {
                  el.selectId = []
                }
              })
            }
            this.labelList = res.data.data.list
          }
        })
      },
      choiceTranslator(name, id) {//选择模糊查询的译者
        this.resourceForm.translator = name;
        this.resourceForm.translatorId = id;
        this.resourceForm.translatorNameAndId = `${name},${id}`;
        this.translatorStatus = 1
      },
      choiceAuthor(name, id) {//选择模糊查询的作者
        this.resourceForm.author = name;
        this.resourceForm.authorId = id;
        this.resourceForm.authorNameAndId = `${name},${id}`;
        this.authorStatus = 1
      },
      isEdit() {
        this.$route.meta.title = '添加医著'
        const id = this.$route.query.id; //修改id
        const detailsId = this.$route.query.detailsId; //查看id
        //this.resourceForm.bookStatus = 0; //0：录入中 1：待审核 2：审核中 3：审核不通过 4：已上架 5：已下架 ,
        if (id) {//修改
          this.$route.meta.title = '修改医著'
          this.pageDetails(id);
        }
        if (detailsId) {//查看
          this.pageStatus = 1
          this.$route.meta.title = '查看医著'
          this.pageDetails(detailsId);
        }
      },
      // 提交公共资源
      commonUpload() {
        if (this.resourceList.length != 0) {
          commonUploadAPI(this.resourceList).then(res => {
          })
        }
      },
      pageDetails(id) {//查看和修改的页面信息
        detailsAPI(id).then(res => {
          if (res.data.code === 0) {
            this.resourceForm = res.data.data;
            let diyArr = res.data.data.diyType.map(el => {//自定义分类
              let {diyTypeCode: code, diyTypeId: diytypeid} = el
              return {code, diytypeid}
            })
            this.diyTypeCode = diyArr;//自定义分类
            this.checkedKeys = getMultipleSelectionIDs(res.data.data.diyType, 'diyTypeId')
            this.getLabel()
          } else {
            this.$message.error('加载失败')
          }
        })
      },
      setSelect(data, obj) {// 改变Tree选中节点时修改select
        this.diyType = obj.checkedNodes.map(node => {
          return {diytypeid: node.id, code: node.code}
        })
        this.diyTypeCode = this.diyType.filter(item => item.code.length > 4)
      },

      setTree(tag) {// 删除多选标签设置Tree的选中节点
        if (this.diyTypeCode.length > 0) {
          const checkedKeys = getMultipleSelectionIDs(this.diyTypeCode, 'diytypeid')
          this.$refs.tree.setCheckedKeys(checkedKeys)
        } else {
          this.$refs.tree.setCheckedKeys([])
        }
      },
      clearCheckedKeys() {//清除分类
        this.$refs.searchTree.setCheckedKeys([])
      },
      //图片
      beforePicUpload(file) {
        const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG/JPEG/BMP/GIF 格式!');
          return isJPG
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return isLt2M
        }
        this.uploading = true
        this.$message.warning('上传中');
      },
      handlePicSuccess(response, file, fileList) {
        this.uploading = false
        this.$message.success('上传成功');
        this.resourceForm.bookCover = response
      },
      handlePicPreview(file) { // 图片预览
        this.dialogImage = file
        this.dialogPvVisible = true
      },

      handleRemove() { // 图片删除
        this.resourceForm.bookCover = ''
      },
      changePdf() {
        if (this.resourceForm.pdfType == 1) {
          //弹窗
          this.getList();
          this.dialogVisible = true;
        }
      },
      goodsSelectionChange(val) {
        this.multiSelection = val
      },
      getList() { //pdf列表
        pdfListAPI(this.listQuery).then(res => {
          if (res.data.code === 0) {
            this.pdfList = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      selectSubmit() {//勾选pdf
        if (this.multiSelection.length == 1) {
          this.dialogVisible = false;
          this.resourceForm.pdfFile = this.multiSelection[0].pdf
        } else {
          this.$message.error('请选择一个pdf资源哦');
        }
      },
      //pdf上传
      beforeUpload(file) {
        const isPDF = file.type === 'application/pdf'
        if (!isPDF) {
          this.$message.error('附件文件只能是 PDF 格式!')
          return isPDF;
        }
        this.uploading = true
      },
      handleSuccess(response, file, fileList) {
        this.resourceForm.pdfFile = response.fileName
        this.resourceForm.pdf_zh = response.originalFileName
        const pdf = {
          keywords: this.resourceForm.keywords,
          name: response.originalFileName,
          nationsType: this.resourceForm.nationsType,
          resourceCode: response.fileName,
          resourceType: 66,
          author: this.resourceForm.author,
          source: this.resourceForm.source,
        }
        this.resourceList.push(pdf);
        this.uploading = false
      },
      handleExceed(files, fileList) {
        this.$message.warning(`单次上传最多1个文件`);
      },
      handleRemovePdf() {//删除pdf
        this.resourceForm.pdfFile = null;
      },
      //保存
      dataSubmit() {
        this.resourceForm.label = []
        this.labelList.map(el => {//自定义标签
          if (el.selectId && el.selectId.length > 0) {//有选中label
            el.selectId.map((item, index) => {
              this.resourceForm.label.push({
                labelId: el.id, //父类Id
                labelContentDiyTypeId: item,  //子类Id
                labelContentDiyTypeCode: el.list[index].code
              });
            })
          }
        })
        this.$refs['resourceForm'].validate((valid) => {
          if (valid) {//必填字段验证
            if ((this.resourceForm.priceOption == 1 && this.resourceForm.price != null && this.resourceForm.price != '') || this.resourceForm.priceOption == 0) {//售价---必填
              this.sending = true
              const data = this.diyTypeCode.map(el => {//自定义分类
                let {diytypeid: diyTypeId, code: diyTypeCode} = el
                return {diyTypeId, diyTypeCode}
              })
              this.resourceForm.diyType = data;
              const id = this.$route.query.id; //修改id
              delete this.resourceForm.author;
              delete this.resourceForm.authorId;
              delete this.resourceForm.translator;
              delete this.resourceForm.translatorId;
              if (id) {//修改
                this.resourceForm.id = id
                saveAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('编辑成功')
                    this.$router.push({path: '/database/theory'});
                    this.commonUpload()
                    this.$router.go(-1);
                  } else {
                    this.$message.error('编辑失败')
                  }
                  this.sending = false
                })
              } else {
                saveAPI(this.resourceForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('添加成功')
                    this.$router.push({path: '/database/theory'});
                    this.commonUpload()
                    this.$router.go(-1);
                  } else {
                    this.$message.error('添加失败')
                  }
                  this.sending = false
                })
              }
            } else {
              this.$message.error('请填写售价哦');
            }
          } else {
            this.$message.error('请将信息补全!');
          }
        })
      },
      cancel() {//取消
        this.$router.go(-1);
      },
      handleFilter() {
        if (this.timeLimit) {
          this.listQuery.beginTime = this.timeLimit[0]
          this.listQuery.endTime = this.timeLimit[1]
        } else {
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }
        this.listQuery.pageNum = 1
        this.getList()
      },
      resetFilter() {
        this.timeLimit = []
        this.listQuery = {
          pageNum: 1,
          pageSize: this.listQuery.pageSize
        }
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      }
    }
  }
</script>

<style scoped lang="less">
  .ib {
    display: inline-block;
  }

  .el-input {
    width: 300px !important;
  }

  .tip {
    color: #ccc;
  }

  .title {
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: 10px;
  }

  .el-input[data-v-454fbfb6] {
    width: 400px !important;
  }

  .el-button {
    margin-bottom: 10px;
  }

  .el-upload--picture-card {
    margin-bottom: 20px !important;
  }
  .el-form-item__content{

  }

</style>
