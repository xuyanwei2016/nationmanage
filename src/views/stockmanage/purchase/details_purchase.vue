<template>
  <div class="app-container calendar-list-container">
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="采购单号">
        <span>{{ note.pcode }}</span>
      </el-form-item>
      <el-form-item label="供应商单号">
        <span>{{ note.pcode }}</span>
      </el-form-item>
    </el-form>
    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="topTitle">供应商信息</div>
      </div>
    </div>
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="供应商编码">
        <span>{{ supplier.code }}</span>
      </el-form-item>
      <el-form-item label="供应商名称">
        <span>{{ supplier.name }}</span>
      </el-form-item>
      <el-form-item label="联系人">
        <span>{{ supplier.personName }}</span>
      </el-form-item>
      <el-form-item label="联系电话">
        <span>{{ supplier.phone  }}</span>
      </el-form-item>
      <el-form-item label="供应商地址">
        <span>{{ supplier.address  }}</span>
      </el-form-item>
      <el-form-item label="邮政编码">
        <span>{{ supplier.zipCode  }}</span>
      </el-form-item>
    </el-form>
    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="listTitle">商品清单</div>
        <el-button @click="handleStorage" v-if='pageStatus == 2'>入库</el-button>
      </div>
    </div>
    <el-table :data="bookList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe v-if="pageStatus == 1">
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
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="单价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="折扣值" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="采购价" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.purchasePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="码洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ministrial}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="实洋" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realOcean}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table :key='tableKey' :data="storageList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe v-if="pageStatus == 2" @selection-change="chioceStorage">
      <el-table-column align="center" :selectable='checkboxT' type="selection" width="50" disabled='true'></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
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
      <el-table-column prop="date" label="总数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="本次入库数量" align="center">
        <template slot-scope="scope">
          <input v-model="scope.row.number" @blur="handleChange(scope.row.id,scope.row.number,scope.row.num)" class="input">
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
          <input type="number" v-if='discountStatus[scope.row.id] == 1' v-model='scope.row.discount' @input="changeDiscount(scope.row.id,scope.row.discount)" class="input">
          <span class="inputClass" v-else-if="discountStatus[scope.row.id] == 2" @click='changeDiscount(scope.row.id,scope.row.purchasePrice/scope.row.price)'>{{scope.row.purchasePrice/scope.row.price}}</span>
          <span class="inputClass" v-else @click='changeDiscount(scope.row.id,scope.row.discount)'>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="采购价" align="center">
        <template slot-scope="scope">
          <span v-if='refresh== 3'>{{refresh}}</span>
          <span class="inputClass" v-if='priceStatus[scope.row.id] == 1' @click="changePrice(scope.row.id,scope.row.discount*scope.row.price)">{{scope.row.discount*scope.row.price}}</span>
          <input type="number" v-else-if="priceStatus[scope.row.id] == 2" v-model="scope.row.purchasePrice" @input="changePrice(scope.row.id,scope.row.purchasePrice)" class="input">
          <span class="inputClass" v-else @click="changePrice(scope.row.id,scope.row.discount*scope.row.price)">{{scope.row.discount*scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="已入库" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="未入库" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.notStorageNum}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="filter-container">
      <div class="nav-buttons-container">
        <div class="topTitle">备注</div>
        <el-input type="textarea" v-model="note.note" :autosize="{ minRows: 2}" readonly="readonly"></el-input>
      </div>
    </div>

    <el-form align="center" v-if='pageStatus == 2' class="top">
      <el-form-item>
        <el-button @click="closePage">关闭</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="采购单确认入库" :visible.sync="dialogVisible">
      <div class="filter-container">
        <el-table :data="newStorageList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe >
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
        <el-table-column prop="date" label="本次入库数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.number}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-form inline ref="dataForm" :rules="rules" :model="storageForm">
        <el-form-item label="库区：" label-width="100px" prop="wareStatus">
          <el-select v-model="storageForm.wareStatus" placeholder="请选择库区" @change="choiceWare">
            <el-option :label="item.name" :value="item.id" v-for='item in wareList' :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库位：" label-width="100px" prop="warePlaceStatus">
          <el-select v-model="storageForm.warePlaceStatus" placeholder="请选择库位">
            <el-option :label="item.name" :value="item.id" v-for='item in warePlaceList' :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <span class="notes">备注：</span>
        <el-form class="demo-ruleForm noteInput form-inline">
          <el-form-item>
            <el-input type="textarea" v-model="newNote" :autosize="{ minRows: 2}"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmStorage">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    width: 20%;
    padding-left: 20px;
    border: solid 1px #ccc;
  }
  .topTitle,.listTitle{
    margin-right: 10px;
    line-height: 36px;
    font-size: 14px;
  }
  .listTitle{
    float: left;
  }
  .el-table{
    margin-bottom: 20px;
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
  .noteInput{
    display: inline-block;
    width: 30% !important;
  }
  .notes{
    width: 90px;
    display: inline-block;
    text-align: right;
    margin-right: 5px;
    font-size: 14px;
    font-weight: 700;
  }
  .top{
    margin-top: 40px;
  }
</style>

<script>
  import { getUpdataListAPI , wareListAPI, warePlaceListAPI, confirmStorageAPI } from '@/api/stock-management/purchase'
  import { getMultipleSelectionIDs } from '@/filters/getIds'
  import { requestMsg, confirm, errorMsg } from '@/utils/publicFunctions'
  export default{
    data(){
      return {
        listLoading: true,
        note: {},
        supplier: {},
        bookList: [],
        storageList: [],
        newStorageList:[],
        pageStatus: 1,
        tableKey:0,
        discountStatus:{},
        priceStatus:{},
        refresh:0,
        dialogVisible: false,
        wareList:{},
        warePlaceList:{},
        storageForm:{
          wareStatus:'',
          warePlaceStatus:'',
        },
        newNote:'',
        rules: {
          wareStatus: [{ required: true, message: '请选择库区', trigger: 'change'}],
          warePlaceStatus: [{ required: true, message: '请选择库位', trigger: 'change'}],
        },
      }
    },
    mounted() {
      const pageType = this.$route.query.pageType;
      if(pageType == 1){//查看
        this.$route.meta.title = '查看采购单'
        this.getList()
      }
      if(pageType == 2){//入库
        this.$route.meta.title = '采购单入库'
        this.pageStatus = 2
        this.getStorageList()
      }
    },
    methods:{
      getList() {
        this.listLoading = true;
        const oldId = this.$route.query.bookId;
        getUpdataListAPI(oldId).then(res => {
          if(res.data.code === 0){
            this.note = res.data.data.note
            this.supplier = res.data.data.supplier
            this.bookList = res.data.data.books
          } else {
            this.$message.error('获取数据失败')
          }
          this.listLoading = false;
        })
      },
      getStorageList() {
        const oldId = this.$route.query.bookId;
        this.listLoading = true;
        getUpdataListAPI(oldId).then(res => {
          if(res.data.code === 0){
            this.note = res.data.data.note
            this.supplier = res.data.data.supplier
            res.data.data.books.map((i,v) => {
              i.number = i.notStorageNum
            })
            this.storageList = res.data.data.books
          } else {
            this.$message.error('获取数据失败')
          }
          this.listLoading = false;
        })
      },
      handleChange(id,val,totalVal) {
        if(this.refresh == 0) {
            this.refresh = 1
          }else {
            this.refresh = 0
          }
        if(val == "") {
          this.$message.error('请输入数量');
          this.storageList.map((i,v) => {
            if(i.id == id){
              i.number  = 1
            }
          })
        }
        if(val > totalVal){
          this.$message.error('本次入库数量不能大于总数量');
          this.storageList.map((i,v) => {
            if(i.id == id){
              i.number  = 1
            }
          })
        }
      },
      chioceStorage(val) {
        this.newStorageList = val;
      },
      changeDiscount(id,val) {//改变折扣
        if(this.refresh == 0) {
          this.refresh = 1
        }else {
          this.refresh = 0
        }
        this.discountStatus[id] = 1;
        this.priceStatus[id] = 1;
        this.storageList.map((i,v) => {
          if(i.id == id){
            i.purchasePrice  = i.price*val
          }
        })
      },
      changePrice(id,val) {//改变价格
        if(this.refresh == 0) {
          this.refresh = 1
        }else {
          this.refresh = 0
        }
        this.discountStatus[id] = 2;
        this.priceStatus[id] = 2;
        this.storageList.map((i,v) => {
          if(i.id == id){
            i.discount = val/i.price
          }
        })
      },
      handleStorage() {//入库渲染库区列表
        if(this.newStorageList.length > 0){
          const numLimit = this.newStorageList.every(data => data.number <= data.notStorageNum)
          if(numLimit == true){
            this.dialogVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            wareListAPI().then(res => {
              if(res.data.code === 0){
                this.wareList = res.data.data
              } else {
                errorMsg.apply(this, [ res.data, `获取全部库区` ])
              }
            })
          } else{
            this.$message.warning('本次入库数量必须少于未入库数量')
          }
        } else {
          this.$message.warning('请先选择商品的条目')
        }
      },
      choiceWare() {//库位(根据库区的变化而改变)
        this.storageForm.warePlaceStatus = ''
        warePlaceListAPI(this.storageForm.wareStatus).then(res => {
          if(res.data.code === 0){
            this.warePlaceList = res.data.data
          } else {
            errorMsg.apply(this, [ res.data, `获取所属库位` ])
          }
        })
      },
      confirmStorage() {//确认入库
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            const storages = this.newStorageList.map(i =>{
               return {
                discount: i.discount,
                num: i.number,
                purchaseBookId: i.id,
                purchasePrice: i.purchasePrice
              }
            })
            const oid = this.$route.query.bookId;

            const list={
              storages,
              note:this.newNote,
              warehouseId:this.storageForm.wareStatus,
              storageBinId:this.storageForm.warePlaceStatus,
              oid
            }
            confirmStorageAPI(list).then(res => {
              if(res.data.code === 0){
                this.$message.success('入库成功');
                this.$router.back()
              } else{
                errorMsg.apply(this, [ res.data, `入库` ])
              }
              this.storageForm = {
                wareStatus:'',
                warePlaceStatus:'',
              }
              this.newNote = ''
            })
          }
        })
      },
      checkboxT(row,index){//复选框是否禁用
    		if(row.notStorageNum > 0){
    			return 1;
    		}else{
    			return 0;
    		}
      },
      closePage() {
        const close = this.storageList.every(data => data.notStorageNum == 0)
        if(close == true){
          this.$router.go(-1);
        } else{
          confirm.apply(this,['采购单尚未全部入库，是否确定退出？']).then(() => {
            this.$router.go(-1);
          })
        }
      },
    }
  }
</script>
