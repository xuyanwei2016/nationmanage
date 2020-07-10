<template>
  <div class="app-container calendar-list-container">
    <el-form inline :model="storageSave" :rules="rules" ref="dataForm">
      <el-form-item label="入库单号：" v-if="pageType == 2">
        <span>{{code}}</span>
        <!-- <el-input v-model="code" readonly="readonly"></el-input> -->
      </el-form-item>
      <el-form-item label="入库类型：" prop="type">
        <el-select v-model="storageSave.type" placeholder="请选择图库类型" value-key="type">
          <el-option :label="item" :value="val" v-for='(item,val) in storageType' :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库区：" prop="ware">
        <el-select v-model="storageSave.ware" placeholder="请选择库区" @change="wareChange" value-key="id">
          <el-option :label="item.name" :value="item" v-for='item in wareList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库位：" prop="warePlace">
        <el-select v-model="storageSave.warePlace" placeholder="请选择库位" value-key="id">
          <el-option :label="item.name" :value="item" v-for='item in warePlaceList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- <div class="filter-container top"> -->
      <div class="nav-buttons-container">
        <div class="topTitle">商品清单</div>
        <el-button @click="addGoods">添加商品</el-button>
      </div>
    <!-- </div> -->

    <el-table :data="newGoodsList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
      <el-table-column prop="date" label="书代号"  align="center">
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
          <input v-model="scope.row.num" @blur="changeNum(scope.row.id,scope.row.num)" class="input" @focus="getVal(scope.row.num)">
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
          <input type="number" v-model='scope.row.discount' @input="changeDiscount(scope.row.id,scope.row.discount)" class="input" @focus="getVal(scope.row.discount)">
        </template>
      </el-table-column>
      <el-table-column prop="date" label="进货价" align="center">
        <template slot-scope="scope">
          <span v-if='refresh== 3'>{{refresh}}</span>
          <input type="number" v-model="scope.row.storagePrice" @input="changePrice(scope.row.id,scope.row.storagePrice)" class="input" @focus="getVal(scope.row.storagePrice)">
        </template>
      </el-table-column>
      <el-table-column prop="date" label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num*scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="实洋" align="center">
        <template slot-scope="scope">
          <span>{{Math.round(scope.row.num*scope.row.price*scope.row.discount*100)/100}}</span>
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
              <el-input type="textarea" v-model="textarea" :autosize="{ minRows: 4}" ></el-input>
            </el-form-item>
          </el-form>
      </div>
    </div>

    <el-dialog title="选择商品" :visible.sync="dialogGoodsVisible">
      <el-form inline>
        <el-form-item label="商品分类">
          <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
            <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
            <el-select v-model="goodsListQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
            </el-select>
          </el-popover>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsListQuery.name" clearable placeholder="请输入商品名称"></el-input>
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
        <el-pagination @current-change="goodsHandleCurrentChange" :current-page="goodsListQuery.pageNum" :page-size="goodsListQuery.pageSize" layout="total, prev, pager, next, jumper" :total="goodsTotal" align="center">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="chioceGoods">确定</el-button>
        <el-button @click="dialogGoodsVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-form align="center">
      <el-form-item v-if="pageType == 1">
        <el-button @click="submit(1)">提交</el-button><el-button @click="submit(2)">保存</el-button>
      </el-form-item>
      <el-form-item v-if="pageType == 2">
        <el-button @click="updateSubmit(1)">提交</el-button><el-button @click="updateSubmit(2)">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<style scoped>
  .topTitle{
    float: left;
    margin-right: 10px;
    line-height: 36px;
    font-size: 14px;
  }
  .top{
    margin-top: 20px;
  }
  .tip{
    font-size: 14px;
    line-height: 36px;
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
  import { getMultipleSelectionIDs, removeDuplicates } from '@/filters/getIds'
  import { getCodeAPI, goodsListAPI, storageCanuseTypeAPI, getWareAPI, getWarePlace, submitAPI, saveAPI, updataList, updataSubmitAPI, updataSaveAPI } from '@/api/stock-management/storage'
  import { getNavAPI, getOptionAPI } from '@/api/stock-management/purchase'

  export default{
    data(){
      return{
        code: '',
        newGoodsList: [],
        goodsListQuery:{
          pageNum: 1,
          code: null,
          pageSize: 10
        },
        goodsTotal: null,
        dialogGoodsVisible: false,
        listLoading: false,
        googsTableKey: 0,
        goodsList: [],
        goodsIds: [],
        discountArr: [],
        multipleGoodsSelection: [],
        discountStatus: {},
        priceStatus: {},
        refresh: 0,
        textarea: '',
        storageType: '',
        wareList: '',
        warePlaceList: '',
        rules:{
          type: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          ware:[
            { required: true, message: '请选择库区', trigger: 'change' }
          ],
          warePlace:[
            { required: true, message: '请选择库位', trigger: 'change' }
          ]
        },
        storageSave:{
          type: '',
          ware: '',
          warePlace: '',
        },
        wareArr: [],
        warePlaceArr: [],
        pageType:1,
        lastVal: null,
        navTree: [],
        options: [],
        defaultProps: {
          children: 'list',
          label: 'showName'
        },
        popoverVisible: false,
        queryId: null
      }
    },
    mounted() {
      this.getNav()
      this.getOption()
      this.queryId = this.$route.query.id
      this.$route.query.id ? this.getInfo() : this.getCode()
      this.getStorageType() //入库类型
      this.getWare() //获取库区
    },
    methods: {
      getInfo() {
        this.$route.meta.title = '修改入库单'
        updataList(this.queryId).then(res => {
          this.pageType = 2
          const books = res.data.data.books
          const note = res.data.data.note
          this.code = note.code
          this.textarea = note.note
          this.storageSave.type = note.type
          this.storageSave.ware = {
            name: note.warehouseName,
            id: note.warehouseId
          }
          this.storageSave.warePlace = {
            name: note.storageBinName,
            id: note.storageBinId
          }
          this.multipleGoodsSelection = books
          this.newGoodsList = books
          this.getWarePlace()//获取库位
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
      },
      getCode() {//创建code单号
        getCodeAPI().then(res => {
          res.data.status ? this.code = res.data.data: this.$message.error('获取入库单号失败')
          this.listLoading = false
        })
      },
      getStorageType() {//类型列表
        storageCanuseTypeAPI().then(res => {
          res.data.status ? this.storageType = res.data.data : this.$message.error('获取库区类型列表失败')
        })
      },
      getWare(){//库区列表
        getWareAPI().then(res => {
          res.data.status ? this.wareList = res.data.data : this.$message.error('获取库区列表失败')
        })
      },
      getWarePlace() {//库位列表
        getWarePlace(this.storageSave.ware.id).then(res => {
          res.data.status ? this.warePlaceList = res.data.data : this.$message.error('获取库位列表失败')
        })
      },
      wareChange(){
        this.storageSave.warePlace = ''
        this.getWarePlace()
      },
      addGoods() {//添加商品
        this.listLoading = true;
        goodsListAPI(this.goodsListQuery).then(res => {
          if(res.data.status){
            this.goodsList = res.data.data.list
            this.goodsTotal = res.data.data.total
          } else {
            this.$message.error('获取数据失败')
          }
        })
        this.listLoading = false
        this.dialogGoodsVisible= true
      },
      chioceGoods() {//选择商品
        if(this.multipleGoodsSelection.length != 0){
          this.multipleGoodsSelection.forEach(i => {
            i.bookName = i.name
            i.num = 1
            i.discount = 1
            i.bookId = i.pbookid
            i.storagePrice = i.num*i.price
            this.newGoodsList.push(i)
          })
          this.newGoodsList = removeDuplicates(this.newGoodsList,'bookId')
          this.goodsIds = Array.from(new Set(this.goodsIds))
          this.dialogGoodsVisible= false
        }
      },
      getVal(val) {
        this.lastVal = val
      },
      changeDiscount(id,val) {//改变折扣
        this.refresh == 0 ? this.refresh = 1 : this.refresh = 0
        if(val == "") {
          this.$message.error('请输入折扣值');
          this.newGoodsList.map((i,v) => {
            if(i.id == id){
              i.discount = this.lastVal
            }
          })
        } else{
          this.newGoodsList.map((i,v) => {
            if(i.id == id){
              i.discount = val
              i.storagePrice = Math.round(i.price*val*100)/100
            }
          })
        }
      },
      changePrice(id,val) {//改变价格
        this.refresh == 0 ? this.refresh = 1 : this.refresh = 0
        if(val == "") {
          this.$message.error('请输入折扣值');
          this.newGoodsList.map((i,v) => {
            if(i.id == id){
              i.storagePrice = this.lastVal
            }
          })
        } else{
          this.newGoodsList.map((i,v) => {
            if(i.id == id){
              i.storagePrice = val
              i.discount = Math.round(val/i.price*100)/100
            }
          })
        }
      },
      changeNum(id,val) {//改变数量
        this.refresh == 0 ? this.refresh = 1 : this.refresh = 0
        const numType = val.indexOf(".")
        if(val == "" || numType != -1) {
          this.$message.error('请输入正确的数量');
          this.newGoodsList.map((i,v) => {
            if(i.id == id){
              i.num = this.lastVal
            }
          })
        }
      },
      deleteGoods(id) {//删除所选商品
        this.newGoodsList = this.newGoodsList.filter(i => i.bookId !== id)
        this.multipleGoodsSelection = this.newGoodsList
      },
      submit(val) {//提交
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.newGoodsList.length >0 ){
              let note  = {
                code: this.code,
                type: this.storageSave.type,
                note: this.textarea,
                warehouseId: this.storageSave.ware.id,
                warehouseName: this.storageSave.ware.name,
                storageBinId: this.storageSave.warePlace.id,
                storageBinName: this.storageSave.warePlace.name
              }
                let books = this.newGoodsList.map(i =>{
                  let { storagePrice, ...temp } = i
                  return { storagePrice:i.price*i.discount, ...temp }
                })
                const saveData = { note, books }
                if(val == 1){//提交
                  submitAPI(saveData).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('提交成功')
                      this.$router.back()
                    } else if(res.data.code === -2) {
                      this.$message.error(`提交失败：${res.data.data}`)
                    } else {
                      this.$message.error('提交失败')
                    }
                  })
                } else{
                  saveAPI(saveData).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('保存成功')
                      this.$router.back()
                    } else if(res.data.code === -2) {
                      this.$message.error(`保存失败：${res.data.data}`)
                    } else {
                      this.$message.error('保存失败')
                    }
                  })
                }
            } else{
              this.$message.error('请选择至少一件商品')
            }
          }
        })
      },
      updateSubmit(val) {//修改后提交
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.newGoodsList.length >0 ){
              let note  = {
                code: this.code,
                type: this.storageSave.type,
                note: this.textarea,
                id: this.queryId,
                warehouseId: this.storageSave.ware.id,
                warehouseName: this.storageSave.ware.name,
                storageBinId: this.storageSave.warePlace.id,
                storageBinName: this.storageSave.warePlace.name
              }
              let books = this.newGoodsList.map(i =>{
                let { storagePrice, ...temp } = i
                return { storagePrice: i.price*i.discount, ...temp }
              })
              const saveData = { note, books }
              if(val == 1){//提交
                updataSubmitAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('提交成功')
                    this.$router.back()
                  } else if(res.data.code === -2) {
                    this.$message.error(`提交失败：${res.data.data}`)
                  } else {
                    this.$message.error('提交失败')
                  }
                })
              } else{
                updataSaveAPI(saveData).then(res => {
                  if(res.data.code === 0){
                    this.$message.success('保存成功')
                    this.$router.back()
                  } else if(res.data.code === -2) {
                    this.$message.error(`保存失败：${res.data.data}`)
                  } else {
                    this.$message.error('保存失败')
                  }
                })
              }
            } else{
              this.$message.error('请选择至少一件商品')
            }
          }
        })
      },
      getNav(){
        getNavAPI().then(res => {
          res.data.status ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
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
      goodsHandleSelectionChange(val) {
        this.multipleGoodsSelection = val;
        this.goodsIds = getMultipleSelectionIDs(this.multipleGoodsSelection);
      },
      goodsHandleCurrentChange(val) {
        this.goodsListQuery.pageNum = val;
        this.addGoods();
      },
      handleGoodsFilter() {
        this.goodsListQuery.pageNum = 1;
        this.addGoods();
      },
      resetGoodsFilter() {
        this.goodsListQuery = {
          pageNum: 1,
          code: null,
          pageSize: this.goodsListQuery.pageSize
        }
        this.addGoods();
      },
    }
  }
</script>
