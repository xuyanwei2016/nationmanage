<template>
  <div class="app-container calendar-list-container">
    <el-form inline class="form-inline" :model="deliverySave" :rules="rules" ref="dataForm">
      <el-form-item label="出库类型：" label-width="100px" prop="type">
        <el-select v-model="deliverySave.type" placeholder="请选择出库类型" value-key="type">
          <el-option :label="item" :value="val" v-for='(item,val) in storageType' :key="val"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="库区：" label-width="100px" prop="ware">
        <el-select v-model="deliverySave.ware" placeholder="请选择库区" @change="wareChange" value-key="ware">
          <el-option :label="item.name" :value="`${item.name},${item.id}`" v-for='item in wareList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库位：" label-width="100px" prop="warePlace">
        <el-select v-model="deliverySave.warePlace" placeholder="请选择库位" value-key="warePlace" @change="warePlaceChange">
          <el-option :label="item.name" :value="`${item.name},${item.id}`" v-for='item in warePlaceList' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="filter-container top">
      <div class="nav-buttons-container">
        <div class="topTitle">商品清单</div>
        <el-button @click="addGoods">添加商品</el-button>
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
          <input type="number" v-model='scope.row.discount' @blur="changeDiscount(scope.row.id,scope.row.discount)" class="input" @focus="getVal(scope.row.discount)">
        </template>
      </el-table-column>
      <el-table-column prop="date" label="售价" align="center">
        <template slot-scope="scope">
          <span v-if='refresh== 3'>{{refresh}}</span>
          <input type="number" v-model="scope.row.salePrice" @blur="changePrice(scope.row.id,scope.row.salePrice)" class="input" @focus="getVal(scope.row.salePrice)">
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
          <i class="el-icon-delete" @click="deleteGoods(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <template v-if="deliverySave.type === '0'">
      <h3>收货人信息：</h3>
      <el-form :model="consigneeForm" ref="consigneeForm" :rules="rules" label-position="right" label-width="110px" style="width: 60%;">
        <el-form-item label="收货人：" prop="receiver">
          <el-input v-model="consigneeForm.receiver"></el-input>
        </el-form-item>
        <el-form-item label="收货地址：" prop="province" class="inline-block">
          <el-select v-model="consigneeForm.province" value-key="code" @change="handleProvince" placeholder="省">
            <el-option v-for="item in provinces" :label="item.name" :key="item.code" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="city" class="inline-block">
          <el-select v-model="consigneeForm.city" value-key="code" @change="handleCity" placeholder="市">
            <el-option v-for="item in cities" :label="item.name" :key="item.code" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="area" class="inline-block">
          <el-select v-model="consigneeForm.area" placeholder="区">
            <el-option v-for="el in areas" :label="el.name" :key="el.code" :value="el.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input v-model="consigneeForm.address"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input v-model="consigneeForm.phone"></el-input>
        </el-form-item>
      </el-form>
    </template>

    <div class="filter-container top">
      <div class="nav-buttons-container">
        <div class="tip">备注</div>
          <el-form class="demo-ruleForm">
            <el-form-item>
              <el-input type="textarea" v-model="textarea" :autosize="{ minRows: 4}"></el-input>
            </el-form-item>
          </el-form>
      </div>
    </div>

    <el-dialog title="选择商品" :visible.sync="dialogGoodsVisible">
      <div class="filter-container">
        <el-form inline class="form-inline">
          <el-form-item label="商品分类" label-width="100px">
            <el-popover popper-class="category-popover" placement="bottom-start" trigger="click" v-model="popoverVisible" @show="clearCheckedKeys">
              <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
              <el-select v-model="goodsListQuery.code" slot="reference" popper-class="hidden-selection" clearable @clear="clearCheckedKeys" placeholder="请选择">
                <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>
          <el-form-item label="商品名称：" label-width="100px">
            <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsListQuery.bookName" clearable placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="书代号：" label-width="100px">
            <el-input @keyup.enter.native="handleGoodsFilter" v-model="goodsListQuery.bookNo" clearable placeholder="请输入书代号"></el-input>
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
        <el-button  @click="chioceGoods">确定</el-button>
        <el-button @click="dialogGoodsVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-form align="center">
      <el-form-item v-if="pageType == 1">
        <el-button @click="submit(1)">提交</el-button><el-button @click="submit(2)">保存</el-button>
      </el-form-item>
      <el-form-item v-if="pageType == 2">
        <el-button @click="updataSubmit(1)">提交</el-button><el-button @click="updataSubmit(2)">保存</el-button>
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
    margin-top: 50px;
  }
  .tip{
    font-size: 14px;
    line-height: 36px;
  }
</style>

<script>
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { getNavAPI, getOptionAPI } from '@/api/stock-management/purchase'
import { goodsListAPI, deliveryCanuseTypeAPI, getWareAPI, getWarePlace, submitAPI, saveAPI, updataList, updataSubmitAPI, updataSaveAPI } from '@/api/stock-management/delivery'
import axios from 'axios'

  export default{
    data (){
      return{
        consigneeForm: {
          // province: {children: []},
          // city: {children: []},
          area: null
        },
        addressCode: [],
        provinces: [],
        allCities:[],
        cities: [],
        allAreas:[],
        areas: [],
        mapJson: '../src/utils/map.json', //mapJson,//'{"110000":"北京市"}',
        newGoodsList: [],
        goodsListQuery:{
          pageNum: 1,
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
          receiver: [{ required: true, message: '请填写', whitespace: true, trigger: 'blur' }],
          province: [{ required: true, message: '请选择', trigger: 'blur' }],
          city: [{ required: true, message: '请选择', trigger: 'blur' }],
          area: [{ required: true, message: '请选择', trigger: 'blur' }],
          address: [{ required: true, message: '请填写', trigger: 'blur',  whitespace: true }],
          phone: [{ required: true, trigger: 'blur', pattern: /^(13\d|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18\d|19[89])\d{8}$/, message: '请填写真实有效的手机号' }],
          type: [
            { required: true, message: '请选择出库类型', trigger: 'change' }
          ],
          ware:[
            { required: true, message: '请选择库区', trigger: 'change' }
          ],
          warePlace:[
            { required: true, message: '请选择库位', trigger: 'change' }
          ]
        },
        deliverySave:{
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
      }
    },
    mounted() {
      this.getNav()
      this.getOption()
      this.getDeliveryType()
      this.getWare()
      this.getCityData().then(() => {
        console.log(this.provinces);
        const edit = this.$route.query.bookId
        if(edit){
          this.$route.meta.title = '修改出库单'
          updataList(edit).then(res => {
            this.pageType = 2
            const books = res.data.data.books
            const note = res.data.data.note
            this.textarea = note.note
            this.deliverySave.type = note.type
            this.deliverySave.ware = (note.warehouseName+","+note.warehouseId)
            this.deliverySave.warePlace = (note.storageBinName+","+note.storageBinId)
            this.wareArr = [note.warehouseName, note.warehouseId]
            this.warePlaceArr = [note.storageBinName, note.storageBinId]
            this.multipleGoodsSelection = books
            this.newGoodsList = books
            this.consigneeForm = {
              receiver: note.receiver,
              area: note.area,
              address: note.address,
              phone: note.phone,
            }
            this.consigneeForm.province = this.provinces.filter(item => item.name == note.provice)[0]
            console.log(this.consigneeForm.province);
            this.cities = this.allCities.filter(el => el.code.slice(0,2) === this.consigneeForm.province.code.slice(0,2))
            this.consigneeForm.city = this.cities.filter(i => i.name == note.city)[0]
            this.areas = this.allAreas.filter(el => el.code.slice(0,4) === this.consigneeForm.city.code.slice(0,4))
            // this.consigneeForm.area = note.area
            this.wareChange()
          })
        }
      })
    },
    methods: {
      getCityData(){
        return axios.get(this.mapJson).then(res => {
          if (res.status==200) {
            let data = res.data, cities = [], areas = []
            // 省市区数据分类
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                if (key.match(/0000$/)) { //省
                  this.provinces.push({code: key, name: data[key]})
                } else if (key.match(/00$/)) { //市
                  this.allCities.push({code: key, name: data[key]})
                } else {//区
                  this.allAreas.push({code: key, name: data[key]})
                }
              }
            }
            // cities.forEach(item => { //区数据放入所属市children
            //   item.children = areas.filter(el => el.code.slice(0,4) === item.code.slice(0,4))
            // })
            // this.addressCode.forEach(item => { //市数据放入所属省children
            //   item.children = cities.filter(el => el.code.slice(0,2) === item.code.slice(0,2))
            // })
          } else {
            this.$message.error('获取省市区数据失败')
          }
        })
      },
      handleProvince() {
        this.consigneeForm.city = null
        this.consigneeForm.area = null
        this.cities = this.allCities.filter(el => el.code.slice(0,2) === this.consigneeForm.province.code.slice(0,2))
        this.areas = []
        // console.log(this.consigneeForm);
        // console.log(this.cities, this.areas);
      },
      handleCity() {
        this.consigneeForm.area = null
        this.areas = this.allAreas.filter(el => el.code.slice(0,4) === this.consigneeForm.city.code.slice(0,4))
        // console.log(this.consigneeForm);
        // console.log(this.cities, this.areas);
      },
      getDeliveryType() {//类型列表
        deliveryCanuseTypeAPI().then(res => {
          if(res.data.code === 0){
            this.storageType = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      getWare(){//库区列表
        getWareAPI().then(res => {
          if(res.data.code === 0){
            this.wareList = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      wareChange() {//库位列表
        //this.deliverySave.warePlace = ''
        //this.warePlaceArr = ''
        this.wareArr = (this.deliverySave.ware).split(",")

        getWarePlace(this.wareArr[1]).then(res => {
          if(res.data.code === 0){
            this.warePlaceList = res.data.data
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      warePlaceChange() {//库位更改
        this.newGoodsList = []
        this.warePlaceArr = (this.deliverySave.warePlace).split(",")
      },
      addGoods() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true;
            this.goodsListQuery.warehouseId = this.wareArr[1]
            this.goodsListQuery.storageBinId = this.warePlaceArr[1]
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
          }
        })
      },
      chioceGoods() {//选择商品
        this.listLoading = true;
        if(this.multipleGoodsSelection.length != 0){
          this.multipleGoodsSelection.map((i,v) => {
            i.num = 1
            this.newGoodsList.push(i);
          })
          this.listLoading = false;
        }

        function removeDuplicates(myArr, prop) {
          return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
          });
        }

        this.newGoodsList = removeDuplicates(this.newGoodsList,'id');
        this.goodsIds = Array.from(new Set(this.goodsIds));
        this.dialogGoodsVisible= false;
      },
      getVal(val) {
        this.lastVal = val
      },
      changeDiscount(id,val) {//改变折扣
        if(this.refresh == 0) {
          this.refresh = 1
        }else {
          this.refresh = 0
        }
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
              i.salePrice = Math.round(i.price*val*100)/100
            }
          })
        }
      },
      changePrice(id,val) {//改变价格
        if(this.refresh == 0) {
          this.refresh = 1
        }else {
          this.refresh = 0
        }
        if(val == "") {
          this.$message.error('请输入折扣值');
          this.newGoodsList.map((i,v) => {
            if(i.id == id){
              i.salePrice = this.lastVal
            }
          })
        } else{
          this.newGoodsList.map((i,v) => {
            if(i.id == id){
              i.salePrice = val
              i.discount = Math.round(val/i.price*100)/100
            }
          })
        }
      },
      changeNum(id,val) {
        if(this.refresh == 0) {
          this.refresh = 1
        }else {
          this.refresh = 0
        }
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
      deleteGoods(row) {//删除所选商品
        const deleteArr = [];
        this.newGoodsList.map((v, i) => {
          if(row.id != v.id){
            deleteArr.push(v);
          }
        })
        this.multipleGoodsSelection = deleteArr;
        this.newGoodsList = deleteArr;
      },
      submit(val) {//提交
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.newGoodsList.length >0 ){

              let note  = {}
                note.type = this.deliverySave.type
                note.note = this.textarea
                note.warehouseId  = this.wareArr[1]
                note.warehouseName = this.wareArr[0]
                note.storageBinId = this.warePlaceArr[1]
                note.storageBinName  = this.warePlaceArr[0]
              let isType0=false;
              if(this.deliverySave.type==0){
                if(this.consigneeForm.receiver&&this.consigneeForm.receiver!=''&&this.consigneeForm.province.name&&this.consigneeForm.province.name!=''&&this.consigneeForm.city.name&&this.consigneeForm.city.name!=''&&this.consigneeForm.area&&this.consigneeForm.area!=''&&this.consigneeForm.address&&this.consigneeForm.address!=''&&this.consigneeForm.phone&&this.consigneeForm.phone!=''){
                  isType0=true;
                  note.receiver = this.consigneeForm.receiver//收货人
                  note.provice = this.consigneeForm.province.name//省份
                  note.city = this.consigneeForm.city.name//市
                  note.area = this.consigneeForm.area//区
                  note.address = this.consigneeForm.address//详细地址
                  note.phone = this.consigneeForm.phone//手机号
                }

              }
                var books = []
                this.newGoodsList.map((i,v) =>{
                  books.push({
                    bookId: i.bookId,
                    bookName: i.bookName,
                    bookNo: i.bookNo,
                    discount: i.discount,
                    num: i.num,
                    price: i.price,
                    salePrice:i.salePrice
                  })
                })
                var saveData = {
                  note,
                  books
                }
              if(this.deliverySave.type==0&&isType0){//通过
                if(val == 1){//提交

                  submitAPI(saveData).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('提交成功');
                      this.$router.go(-1);
                    } else if(res.data.code === -2) {
                      this.$message.error('提交失败：'+res.data.data);
                    }else{
                      this.$message.error('提交失败');
                    }
                  })
                } else{
                  saveAPI(saveData).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('保存成功');
                      this.$router.go(-1);
                    }  else if(res.data.code === -2) {
                      this.$message.error('保存失败：'+res.data.data);
                    } else{
                      this.$message.error('保存失败');
                    }
                  })
                }
              }else if(this.deliverySave.type!=0){
                if(val == 1){//提交

                  submitAPI(saveData).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('提交成功');
                      this.$router.go(-1);
                    } else if(res.data.code === -2) {
                      this.$message.error('提交失败：'+res.data.data);
                    }else{
                      this.$message.error('提交失败');
                    }
                  })
                } else{
                  saveAPI(saveData).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('保存成功');
                      this.$router.go(-1);
                    }  else if(res.data.code === -2) {
                      this.$message.error('保存失败：'+res.data.data);
                    } else{
                      this.$message.error('保存失败');
                    }
                  })
                }
              }else if(this.deliverySave.type==0&&!isType0){
                this.$message.error('请填写收货人信息');
              }

            } else{
              this.$message.error('请选择至少一件商品');
            }
          }
        })
      },
      updataSubmit(val) {//修改后提交
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.newGoodsList.length >0 ){
               const edit = this.$route.query.bookId;
              let note  = {}
                note.type = this.deliverySave.type
                note.note = this.textarea
                note.id = edit
                note.warehouseId  = this.wareArr[1]
                note.warehouseName = this.wareArr[0]
                note.storageBinId = this.warePlaceArr[1]
                note.storageBinName  = this.warePlaceArr[0]
                note.receiver = this.consigneeForm.receiver
                note.provice = this.consigneeForm.province.name
                note.city = this.consigneeForm.city.name
                note.area = this.consigneeForm.area
                note.address = this.consigneeForm.address
                note.phone = this.consigneeForm.phone
                var books = []
                this.newGoodsList.map((i,v) =>{
                  books.push({
                    bookId: i.bookId,
                    bookName: i.bookName,
                    bookNo: i.bookNo,
                    discount: i.discount,
                    num: i.num,
                    price: i.price,
                    salePrice:i.salePrice,
                    storageNoteId: i.storageNoteId,
                    id: i.id
                  })
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
                    }  else if(res.data.code === -2) {
                      this.$message.error('提交失败：'+res.data.data);
                    } else{
                      this.$message.error('提交失败');
                    }
                  })
                } else{
                  updataSaveAPI(saveData).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('保存成功');
                      this.$router.go(-1);
                    }  else if(res.data.code === -2) {
                      this.$message.error('保存失败：'+res.data.data);
                    } else{
                      this.$message.error('保存失败');
                    }
                  })
                }
            } else{
              this.$message.error('请选择至少一件商品');
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
          if (res.data.code === 0) {
            this.options = res.data.data
          } else {
            this.$message.error(`获取分类选择器选项失败`);
          }
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
          pageSize: this.goodsListQuery.pageSize
        }
        this.addGoods();
      },
    }
  }
</script>
