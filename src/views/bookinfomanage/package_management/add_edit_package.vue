<template>
  <div class="app-container">
    <h3>{{textMap[dialogStatus]}}</h3>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px"  class="double-column-form clearfix">
      <el-form-item label="套餐分类：" prop="diytype">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click">
          <el-tree :data="navTree" ref="tree" show-checkbox check-strictly node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps"  @check="setSelect"></el-tree>
          <el-select v-model="temp.diytype" value-key="diytypeid" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" style="width:100%;" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item"></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="出版社：" prop="book.publisherid">
        <el-select v-model="temp.book.publisherid" style="width:100%;" placeholder="请选择">
          <el-option v-for="publisher in publishers" :key="publisher.publisherid" :label="publisher.name" :value="publisher.publisherid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="套餐名称：" prop="book.name">
        <el-input v-model="temp.book.name"></el-input>
      </el-form-item>
      <el-form-item label="基础销量：" prop="pbook.basicOrderCount">
        <el-col :span="16">
          <el-input v-model="temp.pbook.basicOrderCount"></el-input>
        </el-col>&nbsp; 万本
      </el-form-item>
      <el-form-item label="套餐副标题：" prop="pbook.subTitle">
        <el-input v-model="temp.pbook.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="实际销量：">
        <span>{{temp.pbook.realOrderCount}}本</span>
      </el-form-item>
      <el-form-item label="关键词：" prop="pbook.keywords">
        <el-input v-model="temp.pbook.keywords" placeholder="多个关键词用英文逗号隔开"></el-input>
      </el-form-item>
      <el-form-item label="定价：" prop="pbook.price">
        <el-input-number v-model="temp.pbook.price" :precision="2" :min="0" :max="99999" @change="priceChange"></el-input-number>&nbsp; 元
      </el-form-item>
      <el-form-item label="书代号：" prop="pbook.bookNo">
        <el-input v-model="temp.pbook.bookNo"></el-input>
      </el-form-item>
      <el-form-item label="折扣：" prop="pbook.discount">
        <el-input-number v-model="temp.pbook.discount" :precision="2" :step="0.01" :min="0" :max="1" @change="discountChange"></el-input-number>
      </el-form-item>
      <el-form-item label="ISBN：" prop="book.isbn">
        <el-input v-model="temp.book.isbn"></el-input>
      </el-form-item>
      <el-form-item label="销售价：" prop="pbook.salePrice">
        <el-input-number v-model="temp.pbook.salePrice" :precision="2" :min="0" :max="99999" @change="salePriceChange"></el-input-number>&nbsp; 元
      </el-form-item>
      <el-form-item label="作者：" prop="book.author">
        <el-input v-model="temp.book.author"></el-input>
      </el-form-item>
      <el-form-item label="出版日期：" prop="book.publishTime">
        <el-date-picker v-model="temp.book.publishTime" type="date" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="卖点：" prop="pbook.salePoint">
        <el-input v-model="temp.pbook.salePoint"></el-input>
      </el-form-item>
      <el-form-item label="预售提示语：" prop="pbook.prompt">
        <el-input v-model="temp.pbook.prompt"></el-input>
      </el-form-item>
      <el-form-item label="图片集：" prop="picList" class="width100">
        <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" list-type="picture-card" :file-list="temp.picList" :on-preview="handlePicPreview" :before-upload="beforePicUpload" :on-remove="handleRemove" :on-success="handleSuccess" :disabled="uploading">
          <i class="el-icon-plus"></i>
        </el-upload>
        &nbsp; 封面图片将显示在第一位，请预览时手动设置
      </el-form-item>
      <el-form-item label="" class="width100">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="套餐简介" name="intro">
            <tinymce v-model="temp.pbook.summary" style="width:800px"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="详细介绍" name="detail">
            <tinymce v-model="temp.pbook.introduce" style="width:800px"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="套餐视频：" prop="video" class="width100">
        <el-col :span="12">
          <el-upload class="video-uploader clearfix" :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :on-success="handleVideoSuccess" :before-upload="beforeVideoUpload">
            <video v-if="temp.pbook.video" :src="`${domain}${requestPath.file}?fileName=${temp.pbook.video}&isOnLine=true`" controls>
              抱歉，您的浏览器不支持内嵌视频，你可以<a :href="`${domain}${requestPath.file}?fileName=${temp.pbook.video}&isOnLine=true`" style="text-decoration:underline;">点击下载</a>查看
            </video>
            <i v-else class="el-icon-plus video-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="12">
          1.时长：60秒以内<br>2.尺寸：建议1:1,16:9,利于消费者前台体验
        </el-col>
      </el-form-item>
      <el-form-item label="关联图片：" prop="relationPicture" class="width100">
        <!-- <el-upload class="relative-uploader" :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :on-success="handlePicSuccess" :before-upload="beforePicUpload" :disabled="uploading">
          <img class="relatedPic" v-if="temp.pbook.relationPic" :src="`${domain}${requestPath.file}?fileName=${temp.pbook.relationPic}&isOnLine=true`" :alt="`${temp.pbook.relationPic}`">
          <i v-else class="el-icon-plus pic-uploader-icon"></i>
        </el-upload> -->
        <tinymce v-model="temp.pbook.relationPicture" style="width:800px"></tinymce>
      </el-form-item>
      <!-- <el-form-item label="相关描述：" prop="pbook.relationPicDescribe">
        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" v-model="temp.pbook.relationPicDescribe" placeholder="最多100字"></el-input>
      </el-form-item>
      <el-form-item label="链接地址：" prop="pbook.relationPicUrl">
        <el-input v-model="temp.pbook.relationPicUrl" placeholder="最多100字"></el-input>
      </el-form-item> -->
      <el-form-item label="上传附件：" v-if="temp.pbook.fileStatus===1 || temp.pbook.fileStatus===2">
        <a v-if="temp.pbook.fileStatus===1" :href="`${domain}${requestPath.file}?fileName=${temp.pbook.file}&isOnLine=true`"  style="text-decoration:underline;color:#409EFF;" target="_blank">点击查看</a>
        <span v-else-if="temp.pbook.fileStatus===2">{{temp.pbook.fileLink}}</span>
      </el-form-item>
      <el-form-item label="SKU编号：" prop="pbook.skuNo">
        <el-input v-model="temp.pbook.skuNo"></el-input>
      </el-form-item>
      <el-form-item label="重量：" prop="pbook.weight">
        <el-col :span="16">
          <el-input v-model="temp.pbook.weight"></el-input>
        </el-col>&nbsp; kg
      </el-form-item>
      <el-form-item label="邮费选择：" prop="pbook.postage">
        <el-select v-model="temp.pbook.postage" style="width:100%;" placeholder="请选择">
          <el-option v-for="express in expresses" :key="express.id" :label="express.name" :value="express.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品权重：" prop="pbook.bookWeight">
        <el-input v-model="temp.pbook.bookWeight"></el-input>
      </el-form-item>
      <el-form-item label="销售状态：" prop="pbook.saleStatus">
        <el-radio-group v-model="temp.pbook.saleStatus">
          <el-radio :label="1">可售</el-radio><el-radio :label="0">不可售</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上下架状态" prop="pbook.bookstatus">
        <el-select v-model="temp.pbook.bookstatus" style="width:100%;">
          <el-option label="上架" :value="1"></el-option>
          <el-option label="下架" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预售状态：" prop="pbook.presaleStatus" class="width100">
        <el-col :span="12">
          <el-radio-group v-model="temp.pbook.presaleStatus">
            <el-radio :label="1">预售</el-radio><el-radio :label="0">不预售</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="12" v-if="temp.pbook.presaleStatus===1">
          <el-input-number v-model="temp.pbook.presaleNumber" :min="1" :max="99999"></el-input-number>&nbsp; 本
        </el-col>
      </el-form-item>
      <el-form-item label="书刊类型：" prop="pbook.foreignJournalsStatus">
        <el-radio-group v-model="temp.pbook.foreignJournalsStatus">
          <el-radio :label="1">外版书</el-radio><el-radio :label="0">本版书</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="包册：" prop="pbook.bookpackage">
        <el-input v-model="temp.pbook.bookpackage"></el-input>
      </el-form-item>
      <div class="line dashed"></div>
      <el-form-item label="编室编号：" prop="pbook.roomNo">
        <el-input v-model="temp.pbook.roomNo"></el-input>
      </el-form-item>
      <el-form-item label="责任编辑：" prop="pbook.executiveEditor">
        <el-input v-model="temp.book.executiveEditor"></el-input>
      </el-form-item>
      <el-form-item label="最后印刷时间：" prop="lastPublishTime">
        <el-date-picker v-model="temp.pbook.lastPublishTime" type="date" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="策划编辑：" prop="pbook.schemeEditor">
        <el-input v-model="temp.pbook.schemeEditor"></el-input>
      </el-form-item>
      <el-form-item label="版印次：" prop="book.revision">
        <el-input v-model="temp.book.revision"></el-input>
      </el-form-item>
      <el-form-item label="字数：" prop="book.fontCount">
        <el-col :span="16">
        <el-input v-model="temp.book.fontCount"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="制品类型：" prop="pbook.goodstype">
        <el-input v-model="temp.pbook.goodstype"></el-input>
      </el-form-item>
      <el-form-item label="装帧：" prop="pbook.binding">
        <el-input v-model="temp.pbook.binding"></el-input>
      </el-form-item>
      <el-form-item label="丛书名：" prop="book.bookSeries">
        <el-input v-model="temp.book.bookSeries"></el-input>
      </el-form-item>
      <el-form-item label="开本：" prop="pbook.bookformat">
        <el-input v-model="temp.pbook.bookformat"></el-input>
      </el-form-item>
    </el-form>

    <section class="related-goods">
      <h3>套餐关联商品</h3>
      <div class="nav-buttons-container" v-if="temp.pbook.realOrderCount===0">
        <el-button @click="handleRelatedGoods">关联商品</el-button>
        <el-button icon="el-icon-delete" @click="massDelete">批量删除</el-button>
      </div>
      <el-table :key="tableKey" :data="list" @selection-change="handleSelectionChange" border highlight-current-row v-loading="listLoading" stripe element-loading-text="给我一点时间">
        <el-table-column type="selection" align="center" v-if="temp.pbook.realOrderCount===0"></el-table-column>
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
            <span v-if="scope.row.foreignJournalsStatus===0">本版书</span>
            <span v-else-if="scope.row.foreignJournalsStatus===1" style="color:#008000;">外版书</span>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dataSubmit">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

    <el-dialog :title="dialogImage.name" :visible.sync="dialogPvVisible" custom-class="image-preview">
      <img :src="`${dialogImage.url}`" :alt="`${dialogImage.name}`">
      <div slot="footer" class="dialog-footer">
        <span v-if="isCover">封面图片</span>
        <el-button v-else @click="handleCover">设为封面</el-button>
      </div>
    </el-dialog>

    <el-dialog title="关联商品" :visible.sync="dialogFormVisible">
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

      <el-table :key='1' stripe :data="goods.list" v-loading="goods.listLoading" element-loading-text="给我一点时间" border highlight-current-row ref="goodsTable" @selection-change="goodsSelectionChange">
        <el-table-column align="center" type="selection" ></el-table-column>
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
            <span v-if="scope.row.foreignJournalsStatus===0">本版书</span>
            <span v-else-if="scope.row.foreignJournalsStatus===1" style="color:#008000;">外版书</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNum" :page-size="10" layout="total, prev, pager, next" :total="goods.total" align="center"></el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="selectSubmit" >确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadPath, requestPath } from '@/utils/global.js'
import { getPublisherAPI, addAPI, updateAPI, getNavAPI, getInfoAPI, getOptionAPI, getExpressAPI, getRelatedBooksAPI, getBooksAPI, relatePicAPI } from '@/api/book-infomation/package'
import tinymce from '@/components/Tinymce'
import { errorMsg, confirm  } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs, deleteItems } from '@/filters/getIds'

export default {
  components:{tinymce},
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      tableKey: 0,
      list: [],
      // total: null,
      listLoading: true,
      listQuery: {
        code: null,
        pageNum: 1,
        pageSize: 10
      },
      goods:{
        listLoading: true,
        list: null,
        total: null,
        multiSelection:[]
        // ids: []
      },
      // getRowKeys(row){
      //   return row.id;
      // },
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      expresses: [],
      options: [],
      publishers: [],
      checkedKeys: [],
      activeTab: 'intro',
      shelvesTime: [],
      offShelvesTime: [],
      multipleSelection: [],
      ids: [],
      temp: {
        book: {},
        picList: [],
        diytype: [],
        cover: [],
        pbook: {}
      },
      textMap: {
        update: '修改套餐信息',
        create: '添加套餐信息'
      },
      rules: {
        diytype: [{  required: true,message:"未选择",trigger:'change'}],
        book:{
          type:"object",
          publisherid:{ required: true,message:"未选择", trigger: 'change'},
          name:[{ type: 'string', required: true,whitespace: true , message:"未填写", trigger: 'change',},
                { max:100,message:"最多100个字符", trigger: 'change' } ] ,
          isbn: [{ type: 'string', trigger: 'change', message:"未填写", whitespace: true },
                 { max:100,message:"最多100个字符", trigger: 'change'}
                ],
          author:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          revision:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          bookSeries:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          executiveEditor:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          // fontCount: [{pattern:/^\w{1,100}$/,message:"最多100个字符",trigger:"change"}],
        },
        pbook:{
          type:'object',
          subTitle:[{ type : 'string' ,trigger:'change',max:500,message:"最多500个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          salePoint:[{ type: 'string', trigger: 'change', message:"未填写", whitespace: true},
                  { max:100,message:"最多100个字符", trigger: 'change'}
          ],
          price:{ type:'number',trigger:'change',required:true,message:'请输入0-99999之间的数字' },
          discount: [{ required: true, trigger: 'blur', message: '请输入0-1之间的两位小数' }],
          bookNo:[{ type: 'string', required: true, trigger: 'change', message:"未填写", whitespace: true},
                  { max:100,message:"最多100个字符", trigger: 'change'}
          ],
          salePrice: { type: 'number', trigger: 'change', required: true, message: '请输入大于0小于定价的数字' },
          prompt:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          // relationPicDescribe:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
          //         { whitespace: true , message:"未填写", trigger:'change' }
          // ],
          // relationPicUrl:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
          //         { whitespace: true , message:"未填写", trigger:'change' }
          // ],
          skuNo:[{ type: 'string', required: true, trigger: 'change', message:"未填写", whitespace: true},
            { max:100,message:"最多100个字符", trigger: 'change'}
          ],
          postage:{ required: true,message:"未选择",trigger:'change' },
          bookWeight:[
            {required:true,message:"未填写",trigger:"change"},
            {pattern:/^\S{1,100}$/,message:"最多100个字符",trigger:"change"}
          ],
          weight:[{ trigger:'change',required:true,message:"未填写" },
                  { pattern:/^\d{1,4}(\.\d{1,3})?$/,message:"请输入0.00-9999.99之间的数字",trigger:'change'}
          ],
          saleStatus:{ required:true },
          presaleStatus:{ required:true },
          bookstatus:{ required:true },
          foreignJournalsStatus:{ required:true},
          bookpackage:{ pattern:/^\d{1,4}$/, message:"请输入0-9999之间的数字", trigger:'change' },
          basicOrderCount:{ trigger:'change',pattern:/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|[1-9]\d*|0$/,message:"请输入大于等于零的数" },
          roomNo:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          goodstype:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          schemeEditor:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          binding:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          bookformat:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ],
          keywords:[{ type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
                  { whitespace: true , message:"未填写", trigger:'change' }
          ]
        },
        picList:{type:'array',required:true,message:"请至少上传一张图片"}
      },
      uploadPath: uploadPath,
      dialogImage: {},
      isCover: false,
      uploading: false,
      dialogStatus: '',
      popoverVisible: false,
      dialogFormVisible: false,
      dialogPvVisible: false
    }
  },
  created(){
    this.dialogStatus = this.$route.query.type
  },
  mounted() {
    this.getOption()
    this.getNav()
    this.getPublisher()
    this.getExpress()
    this.dialogStatus === 'update' ? this.getInfo() : this.resetTemp()
  },
  methods: {
    salePriceChange() {
      if (this.temp.pbook.price && this.temp.pbook.salePrice) {
        this.temp.pbook.discount = this.temp.pbook.salePrice/this.temp.pbook.price
      }
    },
    discountChange() {
      if (this.temp.pbook.discount && this.temp.pbook.price) {
        this.temp.pbook.salePrice = this.temp.pbook.price*this.temp.pbook.discount
      }
    },
    priceChange() {
      // console.log(this.temp.pbook.price)
      if (this.temp.pbook.price && this.temp.pbook.discount) {
        this.temp.pbook.salePrice = this.temp.pbook.price*this.temp.pbook.discount
      } else if (this.temp.pbook.price && this.temp.pbook.salePrice) {
        this.temp.pbook.discount = this.temp.pbook.salePrice/this.temp.pbook.price
      }
    },
    massDelete(){
      if (this.multipleSelection.length>0) {
        confirm.apply(this,['确定删除所选商品与此套餐的关联吗?']).then(() => {
          let tempList = deleteItems(this.list, this.multipleSelection)
          this.list = tempList
          //在这计算删除商品时总重量  总定价 总销售价
          this.temp.pbook.weight = 0  //重置重量
          this.temp.pbook.price = 0   //重置定价
          this.temp.pbook.salePrice = 0   //重置售价
          this.list.forEach(i => {
            this.temp.pbook.weight += parseFloat(i.weight)
            this.temp.pbook.price += parseFloat(i.price)
            this.temp.pbook.salePrice += parseFloat(i.salePrice)
          })
          isNaN(this.temp.pbook.weight) ?this.temp.pbook.weight = 0 :this.temp.pbook.weight;
          this.temp.pbook.price>0 ? this.temp.pbook.discount = this.temp.pbook.salePrice/this.temp.pbook.price : true
        })
      } else {
        this.$message.warning('请先选择需要设置的条目')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectSubmit(){
      this.list = this.goods.multiSelection.concat(deleteItems(this.list, this.goods.list))
      //在这计算添加商品时总重量  总定价 总销售价
      this.temp.pbook.weight = 0  //重置重量
      this.temp.pbook.price = 0   //重置定价
      this.temp.pbook.salePrice = 0   //重置售价
      this.list.forEach(i => {
        this.temp.pbook.weight += parseFloat(i.weight)
        this.temp.pbook.price += parseFloat(i.price)
        this.temp.pbook.salePrice += parseFloat(i.salePrice)
      })
      isNaN(this.temp.pbook.weight)? this.temp.pbook.weight = 0 :this.temp.pbook.weight;
      this.temp.pbook.price>0 ? this.temp.pbook.discount = this.temp.pbook.salePrice/this.temp.pbook.price : true
      this.dialogFormVisible = false
    },
    goodsSelectionChange(val){
      this.goods.multiSelection = val
    },
    handleRelatedGoods(){
      this.dialogFormVisible = true
      this.resetFilter()
      this.getGoods().then(()=>{
      })
      // console.log(this.list);
    },
    // checkChange、clearCheckedKeys搜索单选树
    checkChange(data, obj){
      // console.log(data, obj);
      // const [code] = obj.checkedKeys
      this.listQuery.code = data.code
      this.popoverVisible = false
    },
    clearCheckedKeys(){
      this.$refs.searchTree.setCheckedKeys([])
    },
    //beforeVideoUpload、handleVideoSuccess上传视频相关
    beforeVideoUpload(file){
      // console.log(file);
      let type = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase()
      const isVideo = type === 'mp4'
      if (!isVideo) {
        this.$message.error('上传视频只能是 mp4 格式!')
        return isVideo
      }
      this.$message.warning('上传中')
    },
    handleVideoSuccess(response, file, fileList){
      this.$message.success('上传成功')
      this.temp.pbook.video = response
    },
    handleCover(){ //设为封面
      this.dialogPvVisible = false
      let picList = this.temp.picList.filter(pic => pic.response !== this.dialogImage.response)
      picList.unshift(this.dialogImage)
      this.temp.picList = picList
    },
    handleSuccess(res, file, fileList){ // 图片集上传成功
      // console.log(res, file, fileList);
      this.uploading = false
      fileList.length>4 ? document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none' : fileList
      this.temp.picList = fileList
      // console.log(this.temp.picList);
    },
    handleRemove(file, fileList) { // 图片集删除
      // console.log(file, fileList);
      fileList.length<5 ? document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block':fileList
      this.temp.picList = fileList
      // console.log(this.temp.picList);
    },
    handlePicPreview(file){ //图片预览
      // console.log(file);
      this.dialogImage = file;
      this.dialogImage.response === this.temp.picList[0].response ? this.isCover = true : this.isCover = false
      this.dialogPvVisible = true;
    },
    // 改变Tree选中节点时修改select
    setSelect(data, obj){
      this.temp.diytype = obj.checkedNodes.map(node => {
        return {diytypeid: node.id, code: node.code}
      })
    },
    // 删除多选标签设置Tree的选中节点
    setTree(tag){
      if (this.temp.diytype.length>0) {
        const checkedKeys = getMultipleSelectionIDs(this.temp.diytype,'diytypeid')
        this.$refs.tree.setCheckedKeys(checkedKeys)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    //beforePicUpload、handlePicSuccess关联图片传图相关
    beforePicUpload(file){
      // console.log(file);
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
        return isJPG
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!')
        return isLt3M
      }
      this.uploading = true
    },
    handlePicSuccess(response, file, fileList){
      this.uploading = false
      this.temp.pbook.relationPic = response
    },
    resetTemp() {
      this.temp = {
        book: {
          author: '',
          executiveEditor: '',
          fontCount: 0,
          isbn: '',
          name: '',
          publishTime: '',
          publisherid: '',
          revision: ''
        },
        picList:[],
        cover: [],
        diytype: [],
        pbook: {
          basicOrderCount: 0,
          binding: '',
          bookNo: '',
          bookWeight: 0,
          bookformat: '',
          bookpackage: 0,
          bookstatus: 0,
          discount: 1,
          foreignJournalsStatus: 0,
          goodstype: '',
          introduce: '',
          keywords:'',
          lastPublishTime: '',
          postage: '',
          presaleNumber: 99999,
          presaleStatus: 0,
          price: 0,
          prompt: '',
          realOrderCount: 0,
          relationPicture: '',
          roomNo: '',
          salePoint: '',
          salePrice: 0,
          saleStatus: 1,
          schemeEditor: '',
          skuNo: '',
          subTitle: '',
          summary: '',
          video: '',
          weight: 0
        }
      };
      this.listLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    dataSubmit(){
      if(this.list.length==0){
        this.$message.error("未选择套餐关联商品")
        return false
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const {picList, ...tempData} = this.temp
          tempData.cover = this.temp.picList.map(pic => {
            return {name: pic.name, url: pic.response, flag: 0}
          })
          tempData.cover[0].flag = 1
          // tempData.book.publishTime && tempData.book.publishTime.length===7 ? tempData.book.publishTime = `${this.temp.book.publishTime}-01` : tempData.book.publishTime
          // tempData.pbook.lastPublishTime && tempData.pbook.lastPublishTime.length===7 ? tempData.pbook.lastPublishTime = `${this.temp.pbook.lastPublishTime}-01` : tempData.pbook.lastPublishTime
          tempData.bookId = getMultipleSelectionIDs(this.list)
          console.log(tempData);
          this.dialogStatus === 'create' ? this.invokeAPI(addAPI, tempData) : this.invokeAPI(updateAPI, tempData)
        } else {
          this.$message.warning("有未通过的验证")
        }
      })
    },
    invokeAPI(api, data){ //添加、修改调接口
      api(data).then(res => {
        if(res.data.status){
          this.$message.success(`${this.textMap[this.dialogStatus]}成功`)
          this.$router.go(-1)
        } else{
          errorMsg.apply(this, [ res.data, this.textMap[this.dialogStatus] ])
        }
      })
    },
    getGoods(){
      this.goods.listLoading = true
      return getBooksAPI(this.listQuery).then(res => {
        // console.log(res)
        if(res.data.code === 0){
          this.goods.list = res.data.data.list
          this.goods.total = res.data.data.total
          this.$nextTick(() => {
            // 已关联商品显示勾选状态
            if (this.list) {
              this.goods.list.forEach(item => {
                this.list.map(el => el.id).indexOf(item.id)>-1 ? this.$refs.goodsTable.toggleRowSelection(item,true) : item
              })
            } else {
              this.$refs.goodsTable ? this.$refs.goodsTable.clearSelection() : true
            }
          })
        } else {
          this.$message.error('获取商品数据失败')
        }
        this.goods.listLoading = false
      })
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        code: null
      }
      this.getGoods()
    },
    handleFilter(){
      this.listQuery.pageNum = 1
      this.getGoods()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getGoods()
    },
    getList(){
      this.listLoading = true
      getRelatedBooksAPI({id:this.$route.query.id}).then(res => {
        res.data.code === 0 ? this.list = res.data.data : this.$message.error('获取关联商品失败')
        this.listLoading = false
      })
    },
    getInfo(){
      getInfoAPI(this.$route.query.id).then(res => {
        if (res.data.code === 0) {
          this.temp = res.data.data
          this.getList()
          this.temp.picList = this.temp.cover.map(item => { // 图片集数组
            return {url:`${this.domain}${this.requestPath.file}?fileName=${item.url}&isOnLine=true`, response: item.url, name: item.name}
          })
          this.checkedKeys = getMultipleSelectionIDs(this.temp.diytype,'diytypeid')
        } else {
          this.$message.error(`获取套餐数据失败`)
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
      })
    },
    getOption(){
      getOptionAPI().then(res => {
        if (res.data.status) {
          this.options = res.data.data.map(item => {
            let { id: diytypeid, ...temp } = item
            return {diytypeid, ...temp}
          })
        } else {
          this.$message.error(`获取分类选择器选项失败`)
        }
      })
    },
    getExpress(){
      getExpressAPI().then(res => {
        if (res.data.status) {
          this.expresses = res.data.data
          this.temp.pbook.postage = this.expresses.some(item => item.isdefault === 1) ? this.expresses.filter(item => item.isdefault === 1)[0].id : null
        } else {
          errorMsg.apply(this, [ res.data, '获取邮费模板' ])
        }
      })
    },
    getPublisher(){
      getPublisherAPI().then(res => {
        res.data.code === 0 ? this.publishers = res.data.data : this.$message.error('获取出版社数据失败')
      })
    }
  }
}
</script>
