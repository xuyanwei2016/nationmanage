<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline :model="purchaseSave" :rules="rules" class="form-inline" ref="dataForm">
        <el-form-item label="供应商单号：" prop="pcode">
          <el-input clearable placeholder="请输入供应商单号" v-model="purchaseSave.pcode"></el-input>
        </el-form-item>
        <el-form-item label="采购单号：">
          <span>{{purchaseSave.pcode}}</span>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="topTitle">供应商信息</div>
        <el-button @click="resetFilter">选择供应商</el-button>
      </div>
    </div>
    <el-table :data="newSupportList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column prop="date" label="供应商编码" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="供应商名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="联系人" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.personName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="联系电话" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="供应商地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="邮政编码" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.zipCode}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="filter-container top">
      <div class="nav-buttons-container">
        <div class="topTitle">商品清单</div>
        <el-button @click="resetGoodsFilter">添加商品</el-button>
      </div>
    </div>
    <el-table :data="newGoodsList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column prop="date" label="书代号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.bookNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="商品名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="数量" align="center">
        <template slot-scope="scope">
          <span v-if='refresh== 3'>{{refresh}}</span>
          <input v-model="scope.row.bookNum" @input="changeNum(scope.row.id,scope.row.bookNum)" class="input" @focus="getVal(scope.row.bookNum)">
        </template>
      </el-table-column>
      <el-table-column prop="date" label="单价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="折扣值" align="center">
        <template slot-scope="scope">
          <span v-if='refresh== 3'>{{refresh}}</span>
          <input type="number" v-model='scope.row.bookDiscount' min="0" max="1" @input="changeDiscount(scope.row.id,scope.row.bookDiscount)" class="input" @focus="getVal(scope.row.bookDiscount)">
        </template>
      </el-table-column>
      <el-table-column prop="date" label="采购价" align="center">
        <template slot-scope="scope">
          <span v-if='refresh== 3'>{{refresh}}</span>
          <input type="number" v-model="scope.row.purchasePrice" :min="0" @input="changePrice(scope.row.id,scope.row.purchasePrice)" class="input" @focus="getVal(scope.row.purchasePrice)">
        </template>
      </el-table-column>
      <el-table-column prop="date" label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNum*scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="实洋" align="center">
        <template slot-scope="scope">
          <span>{{Math.round(scope.row.bookNum*scope.row.price*scope.row.bookDiscount*100)/100}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="deleteGoods(scope.row.bookId)" title="删除"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="filter-container top">
      <div class="nav-buttons-container">
        <div class="tip">备注</div>
          <el-form class="demo-ruleForm">
            <el-form-item>
              <el-input type="textarea" v-model="purchaseSave.textarea" :autosize="{ minRows: 4}"></el-input>
            </el-form-item>
          </el-form>
      </div>
    </div>

    <el-dialog title="选择供应商" :visible.sync="dialogSupportVisible">
      <div class="filter-container">
        <el-form inline class="form-inline">
          <el-form-item label="供应商编号">
            <el-input @keyup.enter.native="handleFilter" v-model="listQuery.code" clearable placeholder="请输入供应商编号"></el-input>
          </el-form-item>
          <el-form-item label="供应商名称">
            <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable placeholder="请输入供应商名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleFilter">检索</el-button><el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :key='tableKey' :data="supportList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column prop="date" label="供应商编号" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="供应商名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="联系人" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.personName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="联系电话" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="供应商地址" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="邮政编码" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.zipCode}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-size="listQuery.pageSize" layout="total, prev, pager, next, jumper" :total="total" align="center">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="chooseSuppliers">确定</el-button>
        <el-button @click="dialogSupportVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择商品" :visible.sync="dialogGoodsVisible">
      <div class="filter-container">
        <el-form inline class="form-inline">
          <el-form-item label="商品名称">
            <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsListQuery.name" clearable placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="书代号">
            <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsListQuery.bookNo" clearable placeholder="请输入书代号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
              <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
              <el-select v-model="goodsListQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="请选择">
                <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleGoodsFilter">检索</el-button><el-button @click="resetGoodsFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :key='googsTableKey' :data="goodsList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="goodsHandleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column prop="date" label="商品名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="书代号" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.bookNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="定价" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="goodsHandleCurrentChange" :current-page="goodsListQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="goodsListQuery.pageSize" layout="total, prev, pager, next, jumper" :total="goodsTotal" align="center">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="chioceGoods">确定</el-button>
        <el-button @click="dialogGoodsVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <div slot="footer" class="dialog-footer">
      <template v-if='pageStatus == 2'>
        <el-button @click="updataSubmit(1)">提交</el-button><el-button @click="updataSubmit(2)">保存</el-button>
      </template>
      <template v-else>
        <el-button @click="submit(1)" v-if="pageStatus == 1">提交</el-button><el-button @click="submit(2)">保存</el-button>
      </template>
    </div>
  </div>

</template>

<style scoped>
  .tip{
    font-size: 14px;
    line-height: 36px;
  }
  .topTitle{
    float: left;
    margin-right: 10px;
    line-height: 36px;
    font-size: 14px;
  }
  .top{
    margin-top: 20px;
  }
  .inputClass,.input{
    height: 20px;
    width:80%;
    border: solid 1px #ccc;
    display: block;
    margin: 0 auto;
    line-height: 20px;
    text-align: center;
  }
</style>


<script>
import { supportListAPI, goodsListAPI, testCodeAPI, discountAPI, saveAPI, submitAPI, getUpdataListAPI, updataSubmitAPI, updataSaveAPI, getNavAPI, getOptionAPI } from '@/api/stock-management/purchase'
import { getMultipleSelectionIDs, removeDuplicates } from '@/filters/getIds'

export default {
  data() {
    const validateParam = (rule, value, callback) => {
      if( value.replace(/\s+/g,"") == '' ){
        callback(new Error('未填写'));
      } else {
        let params = { code: this.purchaseSave.pcode }
        this.$route.query.id ? params.id = this.noteId : true
        testCodeAPI(params).then(res => {
          res.data.data ? callback(new Error('供应商单号已存在')) : callback()
        })
      }
    };
    return {
      purchaseSave: {
        pcode:'',
        code:'',
        textarea:''
      },
      listLoading: false,
      dialogSupportVisible: false,
      tableKey: 0,
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      supportList: [],
      newSupportList: [],
      ids: [],
      multipleSelection:[],
      rules: {
        pcode: [{ type: 'string', required: true, trigger: 'change', validator: validateParam}],
      },
      dialogGoodsVisible: false,
      googsTableKey: 0,
      goodsTotal: null,
      goodsListQuery: {
        pageNum: 1,
        code: null,
        pageSize: 10
      },
      goodsList: [],
      newGoodsList: [],
      goodsIds: [],
      multipleGoodsSelection:[],
      bookNum: {},
      refresh:0,
      priceStatus:{},
      discountArr:[],
      pageStatus:1,
      noteId: null,
      lastVal: null,
      navTree: [],
      options: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      popoverVisible: false,
    }
  },
  mounted() {//判断新增还是修改
    this.$route.meta.title = '新增采购单'
    const bookId = this.$route.query.id;
    this.getNav()
    this.getOption()
    if(bookId){//修改
      this.$route.meta.title = '修改采购单'
      this.pageStatus = 2
      getUpdataListAPI(bookId).then(res => {
        this.purchaseSave.pcode =  res.data.data.note.pcode
        this.purchaseSave.code =  res.data.data.note.code
        this.purchaseSave.textarea = res.data.data.note.note
        this.noteId = res.data.data.note.id
        var arr = []
        arr.push ({
          id: res.data.data.supplier.id,
          name: res.data.data.supplier.name,
          code: res.data.data.supplier.code,
          personName: res.data.data.supplier.personName,
          phone: res.data.data.supplier.phone,
          address: res.data.data.supplier.address,
          zipCode: res.data.data.supplier.zipCode
        })
        this.newSupportList = arr
        this.ids = getMultipleSelectionIDs(this.newSupportList)
        this.newGoodsList = res.data.data.books.map(i => {
          i.name = i.bookName
          i.bookNum = i.num
          i.bookDiscount = i.discount
          return i
        })
      })
    }
  },
  methods: {
    getSupportList() {//供应商列表
      this.listLoading = true;
      supportListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.supportList = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
      })
      this.listLoading = false;
      this.dialogSupportVisible= true;
    },
    chooseSuppliers() {//选择供应商
      if(this.multipleSelection.length == 1){
        this.dialogSupportVisible= false;
        this.newSupportList = this.multipleSelection;
      }else if(this.multipleSelection.length == 0){
        this.$message.warning('请选择一个供应商来创建采购单')
      }else if(this.multipleSelection.length > 1){
        this.$message.warning('创建采购单每次只能选择一个供应商!')
      }
    },
    getGoodsList() {//商品列表
      this.listLoading = true;
      goodsListAPI(this.goodsListQuery).then(res => {
        if(res.data.code === 0){
          this.goodsList = res.data.data.list;
          this.goodsTotal = res.data.data.total;
        } else {
          this.$message.error('获取数据失败');
        }
      })
      this.listLoading = false;
      this.dialogGoodsVisible= true;
    },
    chioceGoods() {//选择商品
      if(this.multipleGoodsSelection.length != 0){
        discountAPI(this.goodsIds).then(res => {
          if(res.data.code === 0){
            this.discountArr = res.data.data
            this.multipleGoodsSelection.forEach((i, v) => {
              i.bookId = i.pbookid
              i.bookNum = 1
              i.bookDiscount = this.discountArr[v]
              i.purchasePrice = this.discountArr[v]*i.price
              this.newGoodsList.push(i);
            })
            this.newGoodsList = removeDuplicates(this.newGoodsList,'bookId');
            this.goodsIds = Array.from(new Set(this.goodsIds));
            this.dialogGoodsVisible= false;
          } else{
            this.$message.error('折扣值获取失败')
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = getMultipleSelectionIDs(this.multipleSelection);
    },
    goodsHandleSelectionChange(val) {
      this.multipleGoodsSelection = val;
      this.goodsIds = getMultipleSelectionIDs(this.multipleGoodsSelection);
    },
    deleteGoods(id) {//删除所选商品
      this.multipleGoodsSelection = this.newGoodsList.filter(i => i.bookId !== id)
      this.newGoodsList = this.multipleGoodsSelection
    },
    getVal(val) {
      this.lastVal = val
    },
    changeNum(id,val) {//数量改变
      this.refresh == 0 ? this.refresh = 1 : this.refresh = 0
      const numType = val.indexOf(".")
      if(val == "" || numType != -1) {
        this.$message.error('请输入正确的数量');
        this.newGoodsList.map((i,v) => {
          if(i.id == id){
            i.bookNum = this.lastVal
          }
        })
      }
    },
    changeDiscount(id,val) {//改变折扣
      val =val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      this.refresh == 0 ? this.refresh = 1 : this.refresh = 0
      if(val == "") {
        this.$message.error('请输入折扣值')
        this.newGoodsList.forEach(i => {
          if(i.id == id){
            i.bookDiscount = this.lastVal
          }
        })
      } else{
        this.newGoodsList.forEach(i => {
          if(i.id == id){
            i.bookDiscount = val
            // i.purchasePrice = 0
            i.purchasePrice = Math.round(i.price*val*100)/100
            // console.log(i.price,val,i.price*val);

          }
        })
      }
    },
    changePrice(id,val) {//改变价格
      val =val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      this.refresh == 0 ? this.refresh = 1 : this.refresh = 0
      if(val == "") {
        this.$message.error('请输入折扣值')
        this.newGoodsList.forEach(i => {
          if(i.id == id){
            i.purchasePrice = this.lastVal
          }
        })
      } else{
        this.newGoodsList.forEach(i => {
          if(i.id == id){
            i.purchasePrice = val
            i.bookDiscount = Math.round(val/i.price*100)/100
          }
        })
      }
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
      })
    },
    checkChange(data, obj){
      this.goodsListQuery.code = data.code
      this.popoverVisible = false
    },
    clearCheckedKeys(){
      this.$refs.searchTree.setCheckedKeys([])
    },
    getOption(){
      getOptionAPI().then(res => {
        res.data.status ? this.options = res.data.data : this.$message.error(`获取分类选择器选项失败`)
      })
    },
    submit(val) {//新建采购单
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.ids.length != 0){
            if(this.newGoodsList.length >0){
              let note = {
                code: this.purchaseSave.pcode,
                note: this.purchaseSave.textarea,
                supplierId: this.ids[0]
              }
              let books = this.newGoodsList.map(i =>{
                return { bookId: i.bookId, discount: i.bookDiscount, bookNo: i.bookNo, bookName: i.name, num: i.bookNum, price: i.price, purchasePrice: i.purchasePrice }
              })
              var saveData = { note, books }
              if(val == 1){//提交
                submitAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('提交成功');
                    this.$router.go(-1);
                  } else if(res.data.code === -2) {
                    this.$message.error(`提交失败：${res.data.data}`)
                  } else {
                    this.$message.error('提交失败');
                  }
                })
              } else {
                saveAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('保存成功');
                    this.$router.go(-1);
                  } else if(res.data.code === -2) {
                    this.$message.error(`保存失败：${res.data.data}`)
                  } else {
                    this.$message.error('保存失败');
                  }
                })
              }
            } else {
              this.$message.warning('请选择至少一件商品')
            }
          } else {
            this.$message.error('请选择供应商');
          }
        }
      })
    },
    updataSubmit(val) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.ids.length != 0){
            if(this.newGoodsList.length >0){
              let note = {
                code: this.purchaseSave.pcode,
                note: this.purchaseSave.textarea,
                id: this.noteId,
                supplierId: this.ids[0]
              }
              let books = this.newGoodsList.map(i =>{
                 return {
                  bookId: i.bookId,
                  discount: i.bookDiscount,
                  bookNo: i.bookNo,
                  bookName: i.name,
                  num: i.bookNum,
                  price: i.price,
                  purchasePrice: i.purchasePrice
                }
              })
              let saveData = { note, books }
              if(val == 1){//提交
                updataSubmitAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('提交成功');
                    this.$router.go(-1);
                  } else if(res.data.code === -2) {
                    this.$message.error(`提交失败：${res.data.data}`)
                  } else{
                    this.$message.error('提交失败');
                  }
                })
              } else{
                console.log(saveData,'好了好了好了好了好了好了好了好了好了好了TMD');

                updataSaveAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('保存成功');
                    this.$router.go(-1);
                  } else if(res.data.code === -2) {
                    this.$message.error(`保存失败：${res.data.data}`)
                  } else{
                    this.$message.error('保存失败');
                  }
                })
              }
            } else {
              this.$message.warning('请选择至少一件商品')
            }
          } else{
            this.$message.error('请选择供应商');
          }
        }
      })
    },
    handleFilter(){
      this.listQuery.pageNum = 1;
      this.getSupportList();
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: 10
      }
      this.getSupportList();
    },
    handleGoodsFilter() {
      this.goodsListQuery.pageNum = 1;
      this.getGoodsList();
    },
    resetGoodsFilter() {
      this.goodsListQuery = {
        pageNum: 1,
        code: null,
        pageSize: 10
      }
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getSupportList();
    },
    goodsHandleCurrentChange(val) {
      this.goodsListQuery.pageNum = val;
      this.getGoodsList();
    },
  }
}
</script>
