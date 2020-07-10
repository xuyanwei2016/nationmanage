<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline :model="returnPurchase" :rules="rules" class="form-inline" ref="dataForm">
        <el-form-item label="采购退货单号：" prop="code" v-if='pageStatus == 2'>
          <span>{{returnPurchase.code}}</span>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="topTitle">供应商信息</div>
        <el-button @click="handleSupplier">选择供应商</el-button>
      </div>
    </div>
    <el-table :data="newSupportList" v-loading="supplierLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
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
        <el-button @click="handleGoods" v-if="supplierId != null">添加商品</el-button>
      </div>
    </div>
    <el-table :data="newGoodsList" v-loading="goodsLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column prop="date" label="书代号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="商品名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="数量" align="center">
        <template slot-scope="scope">
          <span v-if='refresh== 3'>{{refresh}}</span>
          <input v-model="scope.row.bookNum" @blur="changeNum(scope.row.sign,scope.row.bookNum)" class="input">
        </template>
      </el-table-column>
      <el-table-column prop="date" label="单价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="退货价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price*scope.row.discountVal}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="折扣值" align="center">
        <template slot-scope="scope">
          <span v-if='refresh== 3'>{{refresh}}</span>
          <el-select v-model="scope.row.discountVal" @change="changeDiscount(scope.row.sign,scope.row.discountVal)">
            <el-option :label="val" :value="val" v-for='val in scope.row.discounts' :key="val"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="可退货数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.returnNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNum*scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="实洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.bookNum*scope.row.price*scope.row.discountVal}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="库区" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="库位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageBinName}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="deleteGoods(scope.row.sign)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="filter-container top">
      <div class="nav-buttons-container">
        <div class="tip">备注</div>
          <el-form class="demo-ruleForm">
            <el-form-item>
              <el-input type="textarea" v-model="returnPurchase.textarea" :autosize="{ minRows: 4}" maxlength=100></el-input>
            </el-form-item>
          </el-form>
      </div>
    </div>

    <el-form align="center">
      <el-form-item v-if='pageStatus == 2'>
        <el-button @click="updataSubmit(1)">提交</el-button><el-button @click="updataSubmit(2)">保存</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button @click="submit(1)" v-if="pageStatus == 1">提交</el-button><el-button @click="submit(2)">保存</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="选择供应商" :visible.sync="dialogSupportVisible">
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
      <el-table :key='tableKey' :data="supportList" v-loading="addSupplierLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange">
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
        <el-button @click="chooseSuppliers">确定</el-button>
        <el-button @click="dialogSupportVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择商品" :visible.sync="dialogGoodsVisible">
      <el-form inline class="form-inline">
        <el-form-item label="商品分类">
          <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
            <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
            <el-select v-model="goodsListQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
            </el-select>
          </el-popover>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsListQuery.bookName" clearable placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="书代号">
          <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsListQuery.bookNo" clearable placeholder="请输入书代号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleGoodsFilter">检索</el-button><el-button @click="resetGoodsFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :key='googsTableKey' :data="goodsList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="goodsHandleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column prop="date" label="商品名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.bookName}}</span>
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
        <el-pagination @current-change="goodsHandleCurrentChange" :current-page="goodsListQuery.pageNum" :page-size="goodsListQuery.pageSize" layout="total, prev, pager, next, jumper" :total="goodsTotal" align="center">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="chooseGoods">确定</el-button>
        <el-button @click="dialogGoodsVisible = false">取消</el-button>
      </div>
    </el-dialog>

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
    margin-top: 50px;
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
import { supportListAPI, goodsListAPI, testCodeAPI, saveAPI, submitAPI, getUpdataListAPI, updataSubmitAPI, updataSaveAPI, getCodeAPI } from '@/api/stock-management/returnpurchase'
import { getNavAPI, getOptionAPI } from '@/api/stock-management/purchase'
import { removeDuplicates } from '@/filters/getIds'

export default {
  data () {
    var validateParam = (rule, value, callback) => {
      if( value.replace(/\s+/g,"") == '' ){
        callback(new Error('未填写'));
      } else {
        let { code } = this.returnPurchase;
        let params = {
          code: code
        }
        if(this.pageStatus == 2){
          var params = {
            code:code,
            oid: this.noteId
          }
        }
        testCodeAPI(params).then(res => {
          if(res.data.data == false){
            callback(new Error('供应商单号已存在'));
          }else{
            callback()
          }
        })
      }
    };
    return {
      returnPurchase:{
        code: null,
        textarea: null,
      },
      rules: {
        code: [{ type: 'string', required: true, trigger: 'change', validator: validateParam}],
      },
      supplierLoading: true,
      goodsLoading: true,
      addSupplierLoading: true,
      listLoading: true,
      dialogSupportVisible:false,
      multipleSelection: [],
      supportList: [],
      newSupportList: [],
      tableKey: 0,
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      supplierId: null,
      dialogGoodsVisible: false,
      multipleGoodsSelection: [],
      goodsList: [],
      newGoodsList: [],
      googsTableKey: 0,
      goodsTotal: null,
      goodsListQuery: {
        pageNum: 1,
        code: null,
        pageSize: 10
      },
      pageStatus: 1,
      refresh:1,
      noteId: null,
      navTree: [],
      options: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      popoverVisible: false,
    }
  },
  mounted() {
    this.getNav()
    this.getOption()
    const id = this.$route.query.id;
    if(id){
      this.$route.meta.title = '修改采购退货单'
      this.pageStatus = 2
      this.supplierLoading = this.goodsLoading = true
      getUpdataListAPI(id).then(res => {
        if (res.data.status) {
          this.returnPurchase.code =  res.data.data.note.code
          this.returnPurchase.textarea = res.data.data.note.note
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
          this.supplierId = arr[0].id

          this.newGoodsList = res.data.data.books.map(i => {
            i.discountVal = i.discount
            i.bookNum = i.num
            i.discounts = i.discounts.split(',');
            i.sign = `${i.bookId}${i.warehouseId}${i.storageBinId}`
            return i
          })
          // this.newGoodsList = res.data.data.books
        } else {
          this.$message.error('获取采购退货详情失败')
        }
        this.supplierLoading = this.goodsLoading = false
      })
    } else{
      this.supplierLoading = this.goodsLoading = false
      this.getCode()
    }
  },
  methods: {
    getCode() {//退款单号
      getCodeAPI().then(res => {
        res.data.status ? this.returnPurchase.code = res.data.data : this.$message.error('获取退款单号失败')
      })
    },
    handleSupplier() {
      this.resetFilter()
      this.dialogSupportVisible= true
    },
    getSupportList() {//供应商列表
      this.addSupplierLoading = true
      supportListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.supportList = res.data.data.list
          this.total = res.data.data.total
        } else if(res.data.code === -2){
          this.$message.error(res.data.data);
        } else {
          this.$message.error('获取数据失败');
        }
        this.addSupplierLoading = false
      })
    },
    chooseSuppliers() {//选择供应商
      if(this.multipleSelection.length == 1){
        this.dialogSupportVisible= false;
        this.newSupportList = this.multipleSelection
        this.supplierId = this.newSupportList[0].id
        this.newGoodsList = []
      }else if(this.multipleSelection.length == 0){
        this.$message.warning('请选择一个供应商来创建采购单')
      }else if(this.multipleSelection.length > 1){
        this.$message.warning('只能一个供应商来创建采购单')
      }
    },
    handleGoods(){
      this.resetGoodsFilter()
      this.dialogGoodsVisible= true
    },
    getGoodsList() {//商品列表
      this.listLoading = true
      this.goodsListQuery.oid = this.supplierId
      goodsListAPI(this.goodsListQuery).then(res => {
        if(res.data.status){
          if (res.data.data) {
            this.goodsList = res.data.data.list
            this.goodsTotal = res.data.data.total
          } else {
            this.goodsList = null
            this.goodsTotal = 0
          }
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    chooseGoods() {//选择商品
      if(this.multipleGoodsSelection.length != 0){
        this.multipleGoodsSelection.forEach(i => {
          let addArr = i.pageVos.map(item => {
            let {discounts, ...tempData} = item
            return { bookNum: 1, discounts: discounts.split(','), discountVal: discounts.split(',')[0], ...tempData }
          })
          this.newGoodsList = this.newGoodsList.concat(addArr)
        })
        console.log(this.newGoodsList);
        // this.multipleGoodsSelection.forEach(i => {
        //   i.bookNum = 1
        //   i.discounts = i.discounts.split(',');
        //   i.discountVal = i.discounts[0];
        //   this.newGoodsList.push(i);
        // })
        this.newGoodsList = removeDuplicates(this.newGoodsList,'sign');
        this.dialogGoodsVisible= false
      } else {
        this.$message.warning('未选择任何商品')
      }
    },
    changeNum(sign,val) {//改变数量
      if(this.refresh == 0) {
        this.refresh = 1
      } else {
        this.refresh = 0
      }
      if(val == "") {
        this.$message.error('请输入数量');
        this.newGoodsList.forEach(i => {
          if(i.sign == sign){
            i.bookNum = 1
          }
        })
      }else{
        this.newGoodsList.forEach(i => {
          if(i.sign == sign){
            if(i.returnNum < val){
              this.$message.error('退货数量不得超过可退货数量');
              i.bookNum = 1
            }else {
              i.bookNum = val
            }
          }
        })
      }
    },
    changeDiscount(sign,val) {//改变折扣
      if(this.refresh == 0) {
        this.refresh = 1
      } else {
        this.refresh = 0
      }
      this.newGoodsList.forEach(i => {
        if(i.sign == sign){
          i.discountVal = val
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    goodsHandleSelectionChange(val) {
      this.multipleGoodsSelection = val;
    },
    deleteGoods(sign) {//删除所选商品
      this.newGoodsList = this.newGoodsList.filter(i => i.sign != sign)
    },
    submit(val) {//提交
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.supplierId){
            if(this.newGoodsList.length >0){
              let note = {};
              note.rcode = this.returnPurchase.code
              note.note = this.returnPurchase.textarea
              note.supplierId = this.supplierId
              var books = this.newGoodsList.map(i => {
                 return {
                  bookId: i.bookId,
                  discount: i.discountVal,
                  discounts: i.discounts,
                  bookNo: i.bookNo,
                  bookName: i.bookName,
                  price: i.price,
                  returnNum: i.returnNum,
                  num: i.bookNum,
                  storageBinName: i.storageBinName,
                  warehouseName: i.warehouseName,
                  storageBinId: i.storageBinId,
                  warehouseId: i.warehouseId,
                  returnPrice: i.price*i.discountVal,
                  realOcean: i.price*i.bookNum*i.discountVal,
                  ministrial: i.price*i.bookNum
                }
              })

              var saveData = {
                note,
                books
              }
              console.log(saveData);

              if(val == 1){//提交
                submitAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('提交成功');
                    this.$router.go(-1);
                  } else if(res.data.code === -2){
                    this.$message.error(res.data.data);
                  } else{
                    this.$message.error('提交失败');
                  }
                })
              } else{
                saveAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('保存成功');
                    this.$router.go(-1);
                  } else if(res.data.code === -2){
                    this.$message.error(res.data.data);
                  } else{
                    this.$message.error('保存失败');
                  }
                })
              }
            } else{
              this.$message.error('请选择至少一条退货商品')
            }
          } else{
            this.$message.error('请选择供应商')
          }
        }
      })
    },
    updataSubmit(val) {//修改-提交
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.supplierId){
            if(this.newGoodsList.length >0){
              let note = {};
              note.rcode = this.returnPurchase.code
              note.note = this.returnPurchase.textarea
              note.supplierId = this.supplierId
              note.id = this.$route.query.id;
              var books = this.newGoodsList.map(i =>{
                 return {
                  bookId: i.bookId,
                  discount: i.discountVal,
                  discounts: i.discounts,
                  bookNo: i.bookNo,
                  bookName: i.bookName,
                  price: i.price,
                  returnNum: i.returnNum,
                  num: i.bookNum,
                  storageBinName: i.storageBinName,
                  warehouseName: i.warehouseName,
                  storageBinId: i.storageBinId,
                  warehouseId: i.warehouseId,
                  returnPrice: i.price*i.discountVal,
                  realOcean: i.price*i.bookNum*i.discountVal,
                  ministrial: i.price*i.bookNum,
                  id: i.id
                }
              })
              var saveData = {
                note,
                books
              }
              if(val == 1){//提交
                updataSubmitAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('提交成功');
                    this.$router.go(-1);
                  } else if(res.data.code === -2){
                    this.$message.error(res.data.data);
                  } else{
                    this.$message.error('提交失败');
                  }
                })
              } else{
                updataSaveAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('保存成功');
                    this.$router.go(-1);
                  } else if(res.data.code === -2){
                    this.$message.error(res.data.data);
                  } else{
                    this.$message.error('保存失败');
                  }
                })
              }
            } else{
              this.$message.error('请选择至少一条退货商品')
            }
          } else{
            this.$message.error('请选择供应商')
          }
        }
      })
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败');
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
    handleFilter(){
      this.listQuery.pageNum = 1;
      this.getSupportList();
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize
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
        pageSize: this.goodsListQuery.pageSize
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
    }
  }
}
</script>
