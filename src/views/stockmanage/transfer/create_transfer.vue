<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline class="form-inline" :model="transferSave" :rules="rules" ref="dataForm">
        <el-form-item label="调拨单号：">
          <span>{{code}}</span>
          <!-- <el-input v-model="code" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="调出库区：" prop="ware">
          <el-select v-model="transferSave.ware" placeholder="请选择库区" @change="wareChange" value-key="id">
            <el-option :label="item.name" :value="item" v-for='item in wareList' :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调出库位：" prop="warePlace">
          <el-select v-model="transferSave.warePlace" placeholder="请选择库位" value-key="id" @change="warePlaceChange">
            <el-option :label="item.name" :value="item" v-for='item in warePlaceList' :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container top">
      <div class="nav-buttons-container">
        <div class="topTitle">商品清单</div>
        <el-button @click="resetGoodsFilter">添加商品</el-button>
      </div>
    </div>

    <el-table :data="newGoodsList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe>
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
      <el-table-column prop="date" label="库存数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.stockNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="调拨数量" align="center">
        <template slot-scope="scope">
          <span v-if='refresh== 3'>{{refresh}}</span>
          <input v-model="scope.row.num" @blur="handleChange(scope.row.id,scope.row.num)" class="input" @focus="changeVal(scope.row.num)">
        </template>
      </el-table-column>
      <el-table-column prop="date" label="单价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num*scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="deleteGoods(scope.row.id)" title="删除"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="filter-container new">
      <el-form inline class="form-inline" :model="toTransferSave" :rules="rules" ref="dataFormVal">
        <el-form-item label="调入库区：" prop="toWare">
          <el-select v-model="toTransferSave.toWare" placeholder="请选择库区" @change="toWareChange" value-key="id">
            <el-option :label="item.name" :value="item" v-for='item in toWareList' :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调入库位：" prop="toWarePlace">
          <el-select v-model="toTransferSave.toWarePlace" placeholder="请选择库位" value-key="id" @change="getToWarePlaceId">
            <el-option :label="item.name" :value="item" v-for='item in toWarePlaceList' :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container top">
      <div class="nav-buttons-container">
        <div class="tip">备注</div>
          <el-form class="demo-ruleForm">
            <el-form-item>
              <el-input type="textarea" v-model="textarea" :autosize="{ minRows: 4}" maxlength=100></el-input>
            </el-form-item>
          </el-form>
      </div>
    </div>

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
        <el-table-column prop="date" label="商品主分类" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.diytypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="实际库存数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.num}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="锁定库存数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.lockNum}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="goodsHandleCurrentChange" :current-page="goodsListQuery.pageNum" :page-size="goodsListQuery.pageSize" layout="total, prev, pager, next, jumper" :total="goodsTotal" align="center">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chioceGoods">确定</el-button>
        <el-button @click="dialogGoodsVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-form align="center">
      <el-form-item v-if = 'pageType == 1'>
        <el-button @click="createSubmit(1)">提交</el-button><el-button @click="createSubmit(2)">保存</el-button>
      </el-form-item>
      <el-form v-if = 'pageType == 2'>
        <el-button @click="updateSubmit(1)">提交</el-button><el-button @click="updateSubmit(2)">保存</el-button>
      </el-form>
    </el-form>

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
  .inputClass,.input{
    height: 20px;
    width:80%;
    border: solid 1px #ccc;
    display: block;
    margin: 0 auto;
    line-height: 20px;
    text-align: center;
  }
  .new{
    margin-top: 40px;
  }
</style>


<script>
  import { getUpdataList, getCodeAPI, goodsListAPI, discountAPI, getWareAPI, getWarePlace, saveTransferAPI, submitTransferAPI, updataSaveAPI, updataSubmitAPI }from '@/api/stock-management/transfer'
  import { getNavAPI, getOptionAPI } from '@/api/stock-management/purchase'
  import { getMultipleSelectionIDs } from '@/filters/getIds'
  export default{
    data() {
      return{
        code: null,
        listLoading:false,
        textarea: null,
        goodsList: [],
        goodsTotal: null,
        googsTableKey:0,
        goodsListQuery:{
          pageNum: 1,
          pageSize: 10,
          code: null
        },
        dialogGoodsVisible: false,
        goodsPushList: [],
        refresh: 0,
        newGoodsList: [],
        multipleGoodsSelection: [],
        rules:{
          ware:[
            { required: true, message: '请选择调出库区', trigger: 'change' }
          ],
          warePlace:[
            { required: true, message: '请选择调出库位', trigger: 'change' }
          ],
          toWare:[
            { required: true, message: '请选择调入库区', trigger: 'change' }
          ],
          toWarePlace:[
            { required: true, message: '请选择调入库位', trigger: 'change' }
          ]
        },
        relId: null,
        wareList: [],
        wareArr: [],
        warePlaceArr: [],
        warePlaceList: [],
        toWareList: [],
        toWareArr: [],
        toWarePlaceArr: [],
        toWarePlaceList: [],
        transferSave:{
          ware: '',
          warePlace: '',
        },
        toTransferSave:{
          toWare: '',
          toWarePlace: '',
        },
        pageType:1,
        navTree: [],
        options: [],
        defaultProps: {
          children: 'list',
          label: 'showName'
        },
        popoverVisible: false,
        lastVal :''
      }
    },
    mounted() {
      this.getNav()
      this.getOption()
      // const edit = this.$route.query.bookId;
      this.getWare()
      this.$route.query.bookId ? this.getInfo() : this.getCode()
    },
    methods: {
      getInfo() {
        this.$route.meta.title = '修改调拨单'
        getUpdataList(this.$route.query.bookId).then(res => {
          this.pageType = 2
          this.relId = res.data.data.books[0].id
          const note = res.data.data.note
          this.code = note.code
          this.textarea = note.note
           //显示值
          this.transferSave.ware = {
            name: note.fromWarehouseName,
            id: note.fromWarehouseId
          }
          this.transferSave.warePlace = {
            name: note.fromStorageBinName,
            id: note.fromStorageBinId
          }
          this.toTransferSave.toWare = {
            name: note.toWarehouseName,
            id: note.toWarehouseId
          }
          this.toTransferSave.toWarePlace = {
            name: note.toStorageBinName,
            id: note.toStorageBinId
          }
          this.newGoodsList = res.data.data.books
          this.getStorage(this.transferSave.ware.id, 1)
          this.getStorage(this.toTransferSave.toWare.id, 2)
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
            this.$refs['dataFormVal'].clearValidate()
          })
        })
      },
      getCode() {
        getCodeAPI().then(res => {
          if(res.data.code === 0){
            this.code = res.data.data
          } else {
            this.$message.error('获取调拨单号失败')
          }
        })
      },
      getWare(){//库区列表
        getWareAPI().then(res => {
          if(res.data.code === 0){
            this.wareList = res.data.data
            this.toWareList = res.data.data
          } else {
            this.$message.error('获取库区失败')
          }
        })
      },
      wareChange() {
        this.transferSave.warePlace = ''
        this.warePlaceChange()
        this.getStorage(this.transferSave.ware.id, 1)
      },
      getStorage(id, type) {//库位列表
        getWarePlace(id).then(res => {
          if(res.data.code === 0){
            type === 1 ? this.warePlaceList = res.data.data : this.toWarePlaceList = res.data.data
          } else {
            type === 1 ? this.$message.error('获取调出库位失败') : this.$message.error('获取调入库位失败')
          }
        })
      },
      warePlaceChange() {
        this.newGoodsList = []
      },
      toWareChange() {
        this.toTransferSave.toWarePlace = ''
        this.getStorage(this.toTransferSave.toWare.id, 2)
      },
      getToWarePlaceId() {
        this.toWarePlaceArr = this.toTransferSave.toWarePlace
      },
      addGoods() {//商品列表
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.dialogGoodsVisible= true
            this.listLoading = true
            this.goodsListQuery.warehouseId = this.transferSave.ware.id
            this.goodsListQuery.storageBinId = this.transferSave.warePlace.id
            goodsListAPI(this.goodsListQuery).then(res => {
              if(res.data.code === 0){
                this.goodsList = res.data.data.list
                this.goodsTotal = res.data.data.total
              } else if(res.data.code === -2) {
                this.$message.error(res.data.data)
              } else {
                this.$message.error('获取数据失败')
              }
              this.listLoading = false
            })
          }
        })
      },
      chioceGoods() {//选择商品
        if(this.goodsPushList.length != 0){
          if (this.goodsPushList.every(i => i.num > 0)) {
            let addGoodsList = this.goodsPushList.map(i => {
              let {num, ...temp} = i
              return { stockNum: num, num: 1, ...temp }
            })
            let tempGoodsList = this.newGoodsList.concat(addGoodsList)
            this.newGoodsList = removeDuplicates(tempGoodsList,'id')
            this.dialogGoodsVisible= false
            function removeDuplicates(myArr, prop) {
              return myArr.filter((obj, index, arr) => {
                return arr.map(item => item[prop]).indexOf(obj[prop]) === index
              })
            }
          } else {
            this.$message.warning('只能选择实际库存数大于0的商品')
          }
        }
      },
      handleChange(id,val) {//调拨数量的检测
        if(this.refresh == 0) {
          this.refresh = 1
        } else {
          this.refresh = 0
        }
        if(val == "") {
          this.$message.error('请输入数量')
          this.newGoodsList.forEach(i => {
            if(i.id == id){
              i.num = this.lastVal
            }
          })
        }else{
          this.newGoodsList.forEach(i => {
            if(i.id == id){
              if(i.stockNum < val){
                this.$message.error('调拨数量不得超过库存总数量')
                i.num = this.lastVal
              }else {
                i.num = val
              }
            }
          })
        }
      },
      deleteGoods(id) {//删除所选商品
        this.newGoodsList = this.newGoodsList.filter(i => i.id !== id)
      },
      createSubmit(val) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$refs['dataFormVal'].validate((valid) => {
              if(valid){
                if(this.newGoodsList.length >0 ){
                  if(this.transferSave.ware.id !== this.toTransferSave.toWare.id || this.transferSave.warePlace.id !== this.toTransferSave.toWarePlace.id){
                    let note  = {
                      code: this.code,
                      note: this.textarea,
                      fromWarehouseId: this.transferSave.ware.id,
                      fromWarehouseName: this.transferSave.ware.name,
                      fromStorageBinId: this.transferSave.warePlace.id,
                      fromStorageBinName: this.transferSave.warePlace.name,
                      toWarehouseId: this.toTransferSave.toWare.id,
                      toWarehouseName: this.toTransferSave.toWare.name,
                      toStorageBinId: this.toTransferSave.toWarePlace.id,
                      toStorageBinName: this.toTransferSave.toWarePlace.name
                    }
                    let books = this.newGoodsList.map(i => {
                      let {id, ...temp} = i
                      return { bookId: id, ...temp }
                    })
                    const saveData = { note, books }
                    if(val == 1){//提交
                      console.log(saveData)
                      submitTransferAPI(saveData).then(res => {
                        if(res.data.code === 0){
                          this.$message.success('提交成功')
                          this.$router.go(-1)
                        } else if (res.data.code === -2) {
                          this.$message.error(res.data.data)
                        } else {
                          this.$message.error('提交失败')
                        }
                      })
                    } else{
                      saveTransferAPI(saveData).then(res => {
                        if(res.data.code === 0){
                          this.$message.success('保存成功')
                          this.$router.go(-1);
                        } else if (res.data.code === -2) {
                          this.$message.error(res.data.data)
                        }else{
                          this.$message.error('保存失败')
                        }
                      })
                    }
                  } else{
                    this.$message.error('调出库区和调入库区不能相同')
                  }
                } else{
                  this.$message.error('请选择至少一件商品')
                }
              }
            })
          }
        })
      },
      updateSubmit(val) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$refs['dataFormVal'].validate((valid) => {
              if(valid){
                if(this.newGoodsList.length >0 ){
                  if(this.transferSave.ware.id !== this.toTransferSave.toWare.id || this.transferSave.warePlace.id !== this.toTransferSave.toWarePlace.id){
                    const edit = Number(this.$route.query.bookId)
                    let note  = {
                      id: edit,
                      code: this.code,
                      note: this.textarea,
                      fromWarehouseId: this.transferSave.ware.id,
                      fromWarehouseName: this.transferSave.ware.name,
                      fromStorageBinId: this.transferSave.warePlace.id,
                      fromStorageBinName: this.transferSave.warePlace.name,
                      toWarehouseId: this.toTransferSave.toWare.id,
                      toWarehouseName: this.toTransferSave.toWare.name,
                      toStorageBinId: this.toTransferSave.toWarePlace.id,
                      toStorageBinName: this.toTransferSave.toWarePlace.name
                    }
                    let books = this.newGoodsList.map(i => {
                      let {id, ...temp} = i
                      return { bookId: id, ...temp }
                    })
                    const saveData = { note, books }
                    if(val == 1){//提交
                      updataSubmitAPI(saveData).then(res => {
                        if(res.data.code === 0){
                          this.$message.success('提交成功')
                          this.$router.go(-1);
                        } else if(res.data.code === -2) {
                          this.$message.error(res.data.data)
                        } else{
                          this.$message.error('提交失败')
                        }
                      })
                    } else{
                      updataSaveAPI(saveData).then(res => {
                        if(res.data.code === 0){
                          this.$message.success('保存成功')
                          this.$router.go(-1);
                        }  else if(res.data.code === -2) {
                          this.$message.error(res.data.data)
                        }else{
                          this.$message.error('保存失败')
                        }
                      })
                    }
                  } else{
                    this.$message.error('调出库区和调入库区不能相同')
                  }
                } else{
                  this.$message.error('请选择至少一件商品')
                }
              }
            })
          }
        })
      },
      changeVal(val) {
        this.lastVal = val
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
          if (res.data.code === 0) {
            this.options = res.data.data
          } else {
            this.$message.error(`获取分类选择器选项失败`)
          }
        })
      },
      goodsHandleSelectionChange(val) {
        this.goodsPushList = val
      },
      goodsHandleCurrentChange(val) {
        this.goodsListQuery.pageNum = val
        this.addGoods()
      },
      handleGoodsFilter() {
        this.goodsListQuery.pageNum = 1
        this.addGoods()
      },
      resetGoodsFilter() {
        this.goodsListQuery = {
          pageNum: 1,
          pageSize: this.goodsListQuery.pageSize,
          code: null
        }
        this.addGoods()
      }
    }
  }
</script>
