<template>
  <div class="app-container">
    <h3>{{textMap[dialogStatus]}}</h3>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" class="double-column-form clearfix">
      <el-form-item label="商品分类：" prop="diytype">
        <el-popover popper-class="category-popover" placement="bottom-start" trigger="click">
          <el-tree :data="navTree" ref="tree" show-checkbox check-strictly node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps"  @check="setSelect" ></el-tree>
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
      <el-form-item label="商品名称：" prop="book.name">
        <el-input v-model="temp.book.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="基础销量：" prop="pbook.basicOrderCount">
        <el-col :span="16">
          <el-input v-model="temp.pbook.basicOrderCount" clearable></el-input>
        </el-col>&nbsp; 万本
      </el-form-item>
      <el-form-item label="商品副标题：" prop="pbook.subTitle">
        <el-input v-model="temp.pbook.subTitle" clearable></el-input>
      </el-form-item>
      <el-form-item label="实际销量：">
        <span>{{temp.pbook.realOrderCount}}本</span>
        <!-- <el-col :span="16">
          <el-input v-model="temp.pbook.realOrderCount" disabled></el-input>
        </el-col>&nbsp; 本 -->
      </el-form-item>
      <el-form-item label="关键词：" prop="pbook.keywords">
        <el-input v-model="temp.pbook.keywords" placeholder="多个关键词用英文逗号隔开" clearable></el-input>
      </el-form-item>
      <el-form-item label="定价：" prop="pbook.price">
        <el-input-number v-model="temp.pbook.price" :precision="2" :min="0" :max="99999" @change="priceChange"></el-input-number>&nbsp; 元
      </el-form-item>
      <el-form-item label="书代号：" prop="pbook.bookNo">
        <el-input v-model="temp.pbook.bookNo" clearable></el-input>
      </el-form-item>
      <el-form-item label="折扣：" prop="pbook.discount">
        <el-input-number v-model="temp.pbook.discount" :precision="2" :step="0.01" :min="0" :max="1" @change="discountChange"></el-input-number>
      </el-form-item>
      <el-form-item label="ISBN：" prop="book.isbn">
        <el-input v-model="temp.book.isbn" clearable></el-input>
      </el-form-item>
      <el-form-item label="销售价：" prop="pbook.salePrice">
        <el-input-number v-model="temp.pbook.salePrice" :precision="2" :min="0" :max="temp.pbook.price" @change="salePriceChange"></el-input-number>&nbsp; 元
      </el-form-item>
      <el-form-item label="作者：" prop="book.author">
        <el-input v-model="temp.book.author" clearable></el-input>
      </el-form-item>
      <el-form-item label="出版日期：" prop="publishTime">
        <el-date-picker v-model="temp.book.publishTime" type="date" value-format="yyyy-MM-dd" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="卖点：" prop="pbook.salePoint">
        <el-input v-model="temp.pbook.salePoint" clearable></el-input>
      </el-form-item>
      <el-form-item label="预售提示语：" prop="pbook.prompt">
        <el-input v-model="temp.pbook.prompt" clearable></el-input>
      </el-form-item>
      <el-form-item label="图片集：" prop="picList" class="width100">
        <el-upload :action="`${domain}${requestPath.file}${uploadPath}`" list-type="picture-card" :file-list="temp.picList" :on-preview="handlePicPreview" :before-upload="beforePicUpload" :on-remove="handleRemove" :on-success="handleSuccess" :disabled="uploading">
          <i class="el-icon-plus"></i>
        </el-upload>
        &nbsp; 封面图片将显示在第一位，请预览时手动设置
      </el-form-item>
      <el-form-item label="" class="width100">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="商品简介" name="intro">
            <tinymce v-model="temp.pbook.summary" style="width:800px"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="详细介绍" name="detail">
            <tinymce v-model="temp.pbook.introduce" style="width:800px"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="商品视频：" prop="video" class="width100">
        <el-col :span="12">
          <el-upload class="video-uploader clearfix" :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :on-success="handleVideoSuccess" :before-upload="beforeVideoUpload">
            <video v-if="temp.pbook.video" :src="`${domain}${requestPath.file}?fileName=${temp.pbook.video}&isOnLine=true`" controls>
              抱歉，您的浏览器不支持内嵌视频，你可以<a :href="`${domain}${requestPath.file}?fileName=${temp.pbook.video}&isOnLine=true`" style="text-decoration:underline;">点击下载</a>查看
            </video>
            <i v-else class="el-icon-plus video-uploader-icon"></i>
            <!-- <el-button v-if="temp.pbook.video">上传视频</el-button> -->
          </el-upload>
        </el-col>
        <el-col :span="12">
          1.时长：60秒以内<br>2.尺寸：建议1:1,16:9,利于消费者前台体验
        </el-col>
      </el-form-item>
      <el-form-item label="关联图片：" prop="relationPicture" class="width100">
        <!-- <el-upload class="relative-uploader" :action="`${domain}${requestPath.file}${uploadPath}`" :show-file-list="false" :on-success="handlePicSuccess" :before-upload="beforePicUpload" :disabled="uploading">
          <img class="relatedPic" v-if="temp.pbook.relationPic" :src="`${domain}${requestPath.file}?fileName=${temp.pbook.relationPic}&isOnLine=true`" :alt="temp.pbook.relationPic">
          <i v-else class="el-icon-plus pic-uploader-icon"></i>
        </el-upload> -->
        <tinymce v-model="temp.pbook.relationPicture" style="width:800px"></tinymce>
        
      </el-form-item>
      <!-- <el-form-item label="相关描述：" prop="pbook.relationPicDescribe">
        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" v-model="temp.pbook.relationPicDescribe" placeholder="最多100字"></el-input>
      </el-form-item>
      <el-form-item label="链接地址：" prop="pbook.relationPicUrl">
        <el-input v-model="temp.pbook.relationPicUrl" placeholder="最多100字" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="上传附件：" v-if="temp.pbook.fileStatus===1 || temp.pbook.fileStatus===2">
        <a v-if="temp.pbook.fileStatus===1" :href="`${domain}${requestPath.file}?fileName=${temp.pbook.file}&isOnLine=true`" style="text-decoration:underline;color:#409EFF;" target="_blank">点击查看</a>
        <span v-else-if="temp.pbook.fileStatus===2">{{temp.pbook.fileLink}}</span>
      </el-form-item>
      <el-form-item label="SKU编号：" prop="pbook.skuNo">
        <el-input v-model="temp.pbook.skuNo" clearable></el-input>
      </el-form-item>
      <el-form-item label="重量：" prop="pbook.weight">
        <el-col :span="16">
          <el-input v-model="temp.pbook.weight" clearable></el-input>
        </el-col>&nbsp; kg
      </el-form-item>
      <el-form-item label="邮费选择：" prop="pbook.postage">
        <el-select v-model="temp.pbook.postage" style="width:100%;" placeholder="请选择">
          <el-option v-for="express in expresses" :key="express.id" :label="express.name" :value="express.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品权重：" prop="pbook.bookWeight">
        <el-input v-model="temp.pbook.bookWeight" clearable></el-input>
      </el-form-item>
      <el-form-item label="销售状态：" prop="pbook.saleStatus">
        <el-radio-group v-model="temp.pbook.saleStatus">
          <el-radio :label="1">可售</el-radio><el-radio :label="0">不可售</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上下架状态：" prop="pbook.bookstatus">
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
        <el-input v-model="temp.pbook.bookpackage" clearable></el-input>
      </el-form-item>
      <div class="line dashed"></div>
      <el-form-item label="编室编号：" prop="pbook.roomNo">
        <el-input v-model="temp.pbook.roomNo" clearable></el-input>
      </el-form-item>
      <el-form-item label="责任编辑：" prop="book.executiveEditor">
        <el-input v-model="temp.book.executiveEditor" clearable></el-input>
      </el-form-item>
      <el-form-item label="最后印刷时间：" prop="lastPublishTime">
        <el-date-picker v-model="temp.pbook.lastPublishTime" type="date" value-format="yyyy-MM-dd" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="策划编辑：" prop="pbook.schemeEditor">
        <el-input v-model="temp.pbook.schemeEditor" clearable></el-input>
      </el-form-item>
      <el-form-item label="版印次：" prop="book.revision">
        <el-input v-model="temp.book.revision" clearable></el-input>
      </el-form-item>
      <el-form-item label="字数：" prop="book.fontCount">
        <el-col :span="16">
        <el-input v-model="temp.book.fontCount" clearable></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="制品类型：" prop="pbook.goodstype">
        <el-input v-model="temp.pbook.goodstype" clearable></el-input>
      </el-form-item>
      <el-form-item label="装帧：" prop="pbook.binding">
        <el-input v-model="temp.pbook.binding" clearable></el-input>
      </el-form-item>
      <el-form-item label="丛书名：" prop="book.bookSeries">
        <el-input v-model="temp.book.bookSeries" clearable></el-input>
      </el-form-item>
      <el-form-item label="开本：" prop="pbook.bookformat">
        <el-input v-model="temp.pbook.bookformat" clearable></el-input>
      </el-form-item>
      <el-form-item label="防伪码正版提示语：" prop="pbook.securitycodeGenuine">
        <el-input v-model="temp.pbook.securitycodeGenuine" :autosize="{ minRows: 4 }" type="textarea" placeholder="最多200字" clearable></el-input>
      </el-form-item>
      <el-form-item label="防伪码盗版提示语：" prop="pbook.securitycodePiracy">
        <el-input v-model="temp.pbook.securitycodePiracy" :autosize="{ minRows: 4 }" type="textarea" placeholder="最多200字" clearable></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dataSubmit" >保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>

    <el-dialog :title="dialogImage.name" :visible.sync="dialogPvVisible" custom-class="image-preview">
      <img :src="`${dialogImage.url}`" :alt="`${dialogImage.name}`">
      <div slot="footer" class="dialog-footer">
        <span v-if="isCover">封面图片</span>
        <el-button v-else @click="handleCover">设为封面</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js'
import { getPublisherAPI, addAPI, updateAPI, getNavAPI, getInfoAPI, getOptionAPI, getExpressAPI,relatePicAPI } from '@/api/book-infomation/goodsInfo'
import tinymce from '@/components/Tinymce'
import { errorMsg } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs } from '@/filters/getIds'

export default {
  components:{tinymce},
  data() {    
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
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
      ids: [],
      temp: {
        book: {},
        picList: [],
        diytype: [],
        cover: [],
        pbook: {}
      },
      textMap: {
        update: '修改图书信息',
        create: '添加图书信息'
      },
      rules: {
        diytype: [{ required: true, message: "未选择", trigger: 'change' }],
        book:{
          type: 'object',
          publisherid: { required: true,message:"未选择", trigger: 'change'},
          name: [
            { type: 'string', required: true,whitespace: true , message:"未填写", trigger: 'change',},
            { max:100,message:"最多100个字符", trigger: 'change' }
          ],
          isbn: [
            { type: 'string', required: true, trigger: 'change', message:"未填写", whitespace: true },
            { max:100,message:"最多100个字符", trigger: 'change'} 
          ],
          author:[
            { type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
            { whitespace: true , message:"未填写", trigger:'change' }
          ],
          revision: [
            { type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
            { whitespace: true , message:"未填写", trigger:'change' }
          ],
          bookSeries: [
            { type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
            { whitespace: true , message:"未填写", trigger:'change' }
          ],
          executiveEditor: [
            { type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
            { whitespace: true , message:"不可只填写空格", trigger:'change' }
          ],
          // fontCount: [{pattern: /^\w{1,100}$/, message: "最多100个字符", trigger: "change"}],
        },
        pbook: {
          type: 'object',
          subTitle: [
            { type : 'string', trigger: 'change', max: 500, message: "最多500个字符" },
            { whitespace: true, message: "不可只填写空格", trigger: 'change' }
          ],
          salePoint: [
            { type: 'string', trigger: 'change', message: "不可只填写空格", whitespace: true},
            { max: 100, message: "最多100个字符", trigger: 'change'}
          ],
          price: { type:'number', trigger: 'change', required: true, message: '请输入0-99999之间的数字' },
          discount: [{ required: true, trigger: 'blur', message: '请输入0-1之间的两位小数' }],
          bookNo: [
            { type: 'string', required: true, trigger: 'change', message:"未填写", whitespace: true},
            { max:100, message:"最多100个字符", trigger: 'change'}
          ],
          salePrice: { type: 'number', trigger: 'change', required: true, message: '请输入大于0小于定价的数字' },
          prompt: [
            { type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
            { whitespace: true , message:"不可只填写空格", trigger:'change' }
          ],
          relationPicDescribe: [
            { type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
            { whitespace: true , message:"不可只填写空格", trigger:'change' }
          ],
          relationPicUrl: [
            { type : 'string' ,trigger:'change',max:100,message:"最多100个字符" },
            { whitespace: true , message:"不可只填写空格", trigger:'change' }
          ],
          skuNo: [
            { type: 'string', required: true, trigger: 'change', message:"未填写", whitespace: true},
            { pattern: /^\S{1,100}$/, message: '不能输入空字符，最多100字', trigger: 'change'}
          ],
          postage: { required: true, message: '未选择', trigger:'change' },
          bookWeight: [
            { required: true, trigger: 'change', message: "未填写" },
            { pattern: /^\S{1,100}$/, message: '不能输入空字符，最多100字', trigger: 'change'}
          ],
          weight: [
            { trigger: 'change', required: true, message: '未填写' },
            { pattern: /^\d{1,4}(\.\d{1,3})?$/,message: '请输入0.00-9999.99之间的数字', trigger: 'change'}
          ],
          saleStatus: { required:true },
          presaleStatus: { required:true },
          bookstatus: { required:true },
          foreignJournalsStatus: { required:true },
          bookpackage: { pattern: /^\d{1,4}$/, message: "请输入0-9999之间的数字", trigger: 'change' },
          basicOrderCount: { required:true , trigger: 'change', pattern: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|[1-9]\d*|0$/, message: '请输入大于等于零的数' },
          roomNo: [
            { type: 'string', trigger: 'change', max: 100, message: '最多100个字符' },
            { whitespace: true, message: '不可只填写空格', trigger: 'change' }
          ],
          goodstype: [
            { type: 'string', trigger: 'change', max: 100, message: '最多100个字符' },
            { whitespace: true, message: '不可只填写空格', trigger: 'change' }
          ],
          schemeEditor: [
            { type : 'string', trigger: 'change', max: 100, message: '最多100个字符' },
            { whitespace: true, message: '不可只填写空格', trigger: 'change' }
          ],
          binding: [
            { type : 'string', trigger: 'change', max: 100, message: '最多100个字符' },
            { whitespace: true, message: '不可只填写空格', trigger: 'change' }
          ],
          bookformat: [
            { type: 'string', trigger: 'change', max: 100, message: '最多100个字符' },
            { whitespace: true, message: '不可只填写空格', trigger: 'change' }
          ],
          securitycodeGenuine: [{ type: 'string', trigger: 'change', max: 200, message: '最多200个字符' }, { whitespace: true, message: '不可只填写空格', trigger: 'change' }],
          securitycodePiracy: [{ type: 'string', trigger: 'change', max: 200, message: '最多200个字符' }, { whitespace: true, message: '不可只填写空格', trigger: 'change' }],
          keywords: [
            { type: 'string', trigger: 'change', max: 100, message: '最多100个字符' },
            { whitespace: true, message: '不可只填写空格', trigger: 'change' }
          ]
        },
        picList: {type: 'array', required: true, message: '请至少上传一张图片'}
      },
      uploadUrl: '',
      uploadPath: uploadPath,
      dialogImage: {},
      isCover: false,
      uploading: false,
      dialogStatus: '',
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
    //beforeVideoUpload、handleVideoSuccess上传视频相关
    beforeVideoUpload(file){
      // console.log(file);
      let type = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase()
      const isVideo = type === 'mp4';
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
      // let {name, response} = file
      this.temp.picList = fileList
      // console.log(this.temp.picList)
    },
    handleRemove(file, fileList) { // 图片集删除
      // console.log(file, fileList);
      fileList.length<5 ? document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block':fileList
      // this.temp.picList = JSON.parse(JSON.stringify(fileList))
      // this.temp.picList = this.temp.picList.filter(pic => pic.response!==file.response)
      this.temp.picList = fileList
      // this.temp.picList.length>0 ? this.temp.picList[0].flag = 1 : this.temp.picList
      // console.log(this.temp.picList)
    },
    handlePicPreview(file){ //图片预览
      // console.log(file);
      this.dialogImage = file
      this.dialogImage.response === this.temp.picList[0].response ? this.isCover = true : this.isCover = false
      this.dialogPvVisible = true
    },
    // 改变Tree选中节点时修改select
    setSelect(data, obj){
      this.temp.diytype = obj.checkedNodes.map(node => {
        return {diytypeid: node.id, code: node.code}
      })
      // console.log(this.temp.diytype)
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
      // console.log(file)
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
          postage: null,
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
          securitycodeGenuine: '',
          securitycodePiracy: '',
          skuNo: '',
          subTitle: '',
          summary: '',
          video: '',
          weight: 0
        }
      };
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    dataSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const {picList, ...tempData} = this.temp
          tempData.cover = this.temp.picList.map(pic => {
            return {name: pic.name, url: pic.response, flag: 0}
          })
          tempData.cover[0].flag = 1
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
        } else {
          errorMsg.apply(this, [ res.data, this.textMap[this.dialogStatus] ])
          // res.data.code === -2 ? this.$message.error(`${this.textMap[this.dialogStatus]}失败：${res.data.msg}`) : this.$message.error(`${this.textMap[this.dialogStatus]}失败`)
        }
      })
    },
    getInfo(){
      getInfoAPI(this.$route.query.id).then(res => {
        if (res.data.code === 0) {
          this.temp = res.data.data
          this.temp.picList = this.temp.cover.map(item => { // 图片集数组
            return {url:`${this.domain}${this.requestPath.file}?fileName=${item.url}&isOnLine=true`, response: item.url, name: item.name}
          })
          this.checkedKeys = getMultipleSelectionIDs(this.temp.diytype,'diytypeid')
        } else {
          this.$message.error(`获取商品数据失败`)
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
        if (res.data.code === 0) {
          this.options = res.data.data.map(item => {
            let { id: diytypeid, ...temp } = item
            return {diytypeid, ...temp}
          })
          // console.log(this.options)
        } else {
          this.$message.error(`获取分类选择器选项数据失败`)
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
        // res.data.code === 0 ? this.expresses = res.data.data : this.$message.error('获取邮费模板失败')
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