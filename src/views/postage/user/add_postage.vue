<template>
  <div class="app-container calendar-list-container">
    <el-form inline class="form-inline" :model="postage" ref="dataForm" :rules="rules">
      <el-form-item label="模板名称：" style="display:block" label-width="100px" prop="name"> 
        <el-input v-model="postage.name" class="name"></el-input>
        <el-checkbox v-model="postage.defaultVal">设置默认</el-checkbox>
      </el-form-item>
      <el-form-item label="快递介绍：" style="display:block" label-width="100px">
        <el-input type="textarea" v-model="postage.description" :autosize="{ minRows: 2}" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="状态：" style="display:block" label-width="100px" v-if="postage.allowStatus ==0">
        <!-- 是否允許禁用 0 不允许被禁用   1 允许被禁用 -->
        <el-radio-group v-model="postage.status" disabled>
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态：" style="display:block" label-width="100px" v-if="postage.allowStatus ==1" >
        <!-- 是否允許禁用 0 不允许被禁用   1 允许被禁用 -->
        <el-radio-group v-model="postage.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否包邮：" style="display:block" label-width="100px" >
        <el-radio-group v-model="postage.pinkageStatus">
          <el-radio label="1">自定义计费</el-radio>
          <el-radio label="0">包邮</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="postage.pinkageStatus == 1">
      <el-form-item label="计价方式：" style="display:block" label-width="100px" >
        <el-radio-group v-model="postage.priceType">
          <el-radio label="0">按件数</el-radio>
          <el-radio label="1">按重量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="运送方式：" style="display:block" label-width="100px" >
        <el-checkbox v-model="postage.type" disabled>快递</el-checkbox>
      </el-form-item>
      <div class="bottom">普通地区邮费计算方式：</div>
      <div v-if="postage.priceType == 0">
        <el-form-item label-width="100px">
          <el-input v-model="postage.basicNum" class="small" type="number"></el-input>
        </el-form-item>
        <span>件运费,</span>
        <el-form-item label-width="100px">
          <el-input v-model="postage.basicPrice" class="small" type="number"></el-input>
        </el-form-item>
        <span>元，续件</span>
        <el-form-item label-width="100px">
          <el-input v-model="postage.addNum" class="small" type="number"></el-input>
        </el-form-item>
        <span>件，增加运费</span>
        <el-form-item label-width="100px">
          <el-input v-model="postage.addPrice" class="small" type="number"></el-input>
        </el-form-item>
        <span>元</span>
      </div>
      <div v-if="postage.priceType == 1">
        <el-form-item label-width="100px">
          <el-input v-model="postage.basicWeight" class="small" type="number"></el-input>
        </el-form-item>
        <span>kg运费,</span>
        <el-form-item label-width="100px">
          <el-input v-model="postage.basicWeightPrice" class="small" type="number"></el-input>
        </el-form-item>
        <span>元，续重</span>
        <el-form-item label-width="100px">
          <el-input v-model="postage.addWeight" class="small" type="number"></el-input>
        </el-form-item>
        <span>kg，增加运费</span>
        <el-form-item label-width="100px">
          <el-input v-model="postage.addWeightPrice" class="small" type="number"></el-input>
        </el-form-item>
        <span>元</span>
      </div>
      <div class="bottom">特殊地区邮费计算方式：<el-button class="right" @click="addSpecial">新增特殊地区邮费</el-button></div>
      <el-table :key='tableKey' :data="special" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe v-if="postage.priceType == 0">
        <el-table-column label="地区" align="center" width="400px">
          <template slot-scope="scope">
            <span>{{(scope.row.city).join(",")}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设置计费条件" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.basicVal" class="small" type="number" @blur="baseNum(scope.row.id,scope.row.basicVal)"></el-input>件运费
            <el-input v-model="scope.row.basicPriceVal" class="small" type="number" @blur="basePrice(scope.row.id,scope.row.basicPriceVal)"></el-input>元，续件 
            <el-input v-model="scope.row.addVal" class="small" type="number" @blur="baseAddNum(scope.row.id,scope.row.addVal)"></el-input>件，增加运费
            <el-input v-model="scope.row.addPriceVal" class="small" type="number" @blur="baseAddPrice(scope.row.id,scope.row.addPriceVal)"></el-input>元
          </template>
        </el-table-column>
        <el-table-column class-name="small-padding fixed-width" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <i class="el-icon-edit" title="编辑地址" @click="editSpecialNumProvince(scope.row.id,scope.row.city)"></i>
            <i class="el-icon-error" title="删除" @click="deleteSpecial(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="specialList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe v-if="postage.priceType == 1">
        <el-table-column label="地区" align="center" width="400px">
          <template slot-scope="scope">
            <span>{{(scope.row.city).join(",")}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设置计费条件" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.basicVal" class="small" type="number" @blur="baseNum(scope.row.id,scope.row.basicVal)"></el-input>kg运费
            <el-input v-model="scope.row.basicPriceVal" class="small" type="number" @blur="basePrice(scope.row.id,scope.row.basicPriceVal)"></el-input>元，续重 
            <el-input v-model="scope.row.addVal" class="small" type="number" @blur="baseAddNum(scope.row.id,scope.row.addVal)"></el-input>kg，增加运费
            <el-input v-model="scope.row.addPriceVal" class="small" type="number" @blur="baseAddPrice(scope.row.id,scope.row.addPriceVal)"></el-input>元
          </template>
        </el-table-column>
        <el-table-column class-name="small-padding fixed-width" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <i class="el-icon-edit" title="编辑地址" @click="editSpecialWeightProvince(scope.row.id,scope.row.city)"></i>
            <i class="el-icon-error" title="删除" @click="deleteSpecial(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="bottom">指定条件免邮费：<el-button class="right" @click="addFree">新增免邮地区</el-button></div>
      <el-table :data="freeData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe v-if="postage.priceType == 0">
        <el-table-column label="地区" align="center" width="400px">
          <template slot-scope="scope">
            <span>{{(scope.row.city).join(",")}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设置免邮条件" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.freeType" label="3" class="radio">按件数，在<el-input type="number" class="small" v-model="scope.row.num"></el-input> 件内免邮费</el-radio>
            <el-radio v-model="scope.row.freeType" label="1" class="radio">按金额，满<el-input type="number" class="small"  v-model="scope.row.price"></el-input> ，元免邮</el-radio>
            <el-radio v-model="scope.row.freeType" label="4" class="radio">按件数+金额，满<el-input type="number" class="small" v-model="scope.row.freeNum"></el-input>件,<el-input type="number" class="small" v-model="scope.row.freePrice"></el-input>元以上免邮</el-radio>
          </template>
        </el-table-column>
        <el-table-column class-name="small-padding fixed-width" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <i class="el-icon-edit" title="编辑地址" @click="editFreeProvince(scope.row.id,scope.row.city)"></i>
            <i class="el-icon-error" title="删除" @click="deleteFree(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      
      <el-table :data="freeDataList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe v-if="postage.priceType == 1">
        <el-table-column label="地区" align="center" width="400px">
          <template slot-scope="scope">
            <span>{{(scope.row.city).join(",")}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设置免邮条件" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.freeType" label="0" class="radio">按重量，在<el-input type="number" class="small" v-model="scope.row.weight"></el-input> kg内免邮费</el-radio>
            <el-radio v-model="scope.row.freeType" label="1" class="radio">按金额，满<el-input type="number" class="small" v-model="scope.row.price"></el-input> ，元免邮</el-radio>
            <el-radio v-model="scope.row.freeType" label="2" class="radio">按重量+金额，满<el-input type="number" class="small" v-model="scope.row.freeWeight"></el-input>kg,<el-input type="number" class="small" v-model="scope.row.freePrice"></el-input>元以上免邮</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <i class="el-icon-edit" title="编辑地址" @click="editFreeProvince(scope.row.id,scope.row.city)"></i>
            <i class="el-icon-error" title="删除" @click="deleteFree(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>

      </div>

    </el-form>
    
    <el-form align="center" style="margin:50px">
      <el-form-item>
        <el-button @click="submit">提交</el-button><el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="选择省份" :visible.sync="dialogVisible" width="50%">
      <template>
        <el-checkbox-group v-model="province">
          <el-checkbox v-for="name in provinceList" :label="name" :key="name" style="margin-left:30px">{{name}}</el-checkbox>
        </el-checkbox-group>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="specialCity">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    
  </div>    
</template>

<style scoped>
  .el-form-item div{
    margin-left: 0 !important;
  }
  span{
    display: inline-block;
    line-height: 36px;
    margin-right: 10px;
    font-size: 14px;
  }
  .bottom{
    margin:40px 0 20px 0;
  }
  .small{
    width: 80px !important;
    text-align: center;
    margin:0 20px;
  }
  .right{
    float: right;
  }
  .radio{
    display: block;
    text-align: left;
    margin: 10px 60px;
  }
  .name{
    width: auto;
    margin-right: 20px;
  }
</style>

<script>
  import { getListAPI, deleteAPI, saveAPI, getUpdataListAPI, updataSaveAPI } from '@/api/postage/index'
  import { operationMsg, confirm } from '@/utils/publicFunctions'
  import { province } from '@/utils/region'
  import { deleteString, deleteItems } from '@/filters/getIds'

  export default{
    data() {
      var validateParam = (rule, value, callback) => {
        if( value.replace(/\s+/g,"") == '' ){
          callback(new Error('未填写'));
        } else {
          callback()
        }
      };
      return{
        rules: {
          name: [{ type: 'string', required: true, trigger: 'change', validator: validateParam}],
        },
        postage:{
          name: "",
          defaultVal: null,
          description: null,
          allowStatus:null,  //是否允許禁用 0 不允许被禁用   1 允许被禁用 ,
          status: '1',
          type: true,
          pinkageStatus: '1',
          priceType: '0',
          basicNum: null,
          basicPrice: null,
          addNum: null,
          addPrice: null,
          basicWeight: null,
          basicWeightPrice: null,
          addWeight: null,
          addWeightPrice: null,
        },
        provinceType: null,//特殊地区1-免邮地区2
        province:[], //省份--绑定v-model
        provinceList: [],  //所有省份
        dialogVisible: false,
        tableKey: 0,
        listLoading: false,
        special: [], //特殊地区-按件数
        specialList: [], //特殊地区-按重量
        hasProvinceNum: [], //已存在的省份-按价格
        hasProvinceWeight:[], //已存在的省份-按重量
        freeData:[],
        freeDataList: [],
        changeProvinceId: null, //选择地址的行Id
        changeProvinceVal: null, //选择地址的行Val
      }
    },
    mounted() {
      this.provinceList = province;
      const editId = this.$route.query.editId
      if(editId){//页面编辑
        this.$route.meta.title = '修改配送方式'
        getUpdataListAPI(editId).then(res => {
          const data = res.data.data
          this.postage.name = data.name
          this.postage.allowStatus = data.allowStatus
          this.postage.description = data.description
          this.postage.pinkageStatus = String(data.freeStatus) 
          this.postage.status = String(data.status)
          this.postage.priceType = String(data.priceType) 
          this.postage.basicNum = data.basicNum 
          this.postage.basicPrice = data.basicPrice 
          this.postage.addNum = data.addNum 
          this.postage.addPrice = data.addPrice
          this.postage.basicWeight = data.basicWeight 
          this.postage.basicWeightPrice = data.basicWeightPrice
          this.postage.addWeight = data.addWeight
          this.postage.addWeightPrice = data.addWeightPrice
          this.postage.defaultVal = !!(data.isdefault)
          //express.expressType = this.postage.type
          if(this.postage.priceType == 0){//按照件数
            data.freeCondition.map((i,v) => { //免邮费
              if(i.freetype == 1){
                this.freeData.push({
                  freeType: String(i.freetype),
                  price: i.price,
                  city: i.province.split(','),
                })
              }else if(i.freetype == 3){
                this.freeData.push({
                  freeType: String(i.freetype),
                  num: i.num,
                  city: i.province.split(','),
                })
              }else if(i.freetype == 4){
                this.freeData.push({
                  freeType: String(i.freetype),
                  freeNum: i.num,
                  freePrice: i.price,
                  city: i.province.split(','),
                })
              }
            })
            data.specialArea.map((i,v) => {//特殊地区
              const cityArr = i.province.split(",")
              this.special.push({
                addVal: i.addNum,
                addPriceVal: i.addPrice,
                basicVal: i.basicNum,
                basicPriceVal:i.basicPrice,
                basicid: i.basicid,
                city: cityArr,
              })
              cityArr.map((i,v) => { this.hasProvinceNum.push(i) })
              
            })
          } else{//按照重量
            data.freeCondition.map((i,v) => { //免邮费
              if(i.freetype == 0){
                this.freeDataList.push({
                  freeType: String(i.freetype),
                  weight : i.weight,
                  city: i.province.split(','),
                })
              }else if(i.freetype == 1){
                this.freeDataList.push({
                  freeType: String(i.freetype),
                  price: i.price,
                  city: i.province.split(','),
                })
              }else if(i.freetype == 2){
                this.freeDataList.push({
                  freeType: String(i.freetype),
                  freeWeight: i.weight,
                  freePrice: i.price,
                  city: i.province.split(','),
                })
              }
            })
            data.specialArea.map((i,v) => {//特殊地区
              const cityArr = i.province.split(",")
              this.specialList.push({
                addVal: i.addWeight,
                addPriceVal: i.addWeightPrice,
                basicVal: i.basicWeight,
                basicPriceVal:i.basicWeightPrice,
                city: cityArr,
              })
              cityArr.map((i,v) => { this.hasProvinceWeight.push(i) })
            })
          }
        })
      }
    },
    methods: {
      addSpecial() {//新增特殊地区邮费
        if(this.postage.priceType == "0"){//价格
          const val = this.special.length;
          this.special.push({
            id: val,
            city: ['未添加地区'],
            basicVal: null,
            basicPriceVal: null,
            addVal: null,
            addPriceVal: null,
          })
        } else{//重量
          const val = this.specialList.length;
          this.specialList.push({
            id: val,
            city: ['未添加地区'],
            basicVal: null,
            basicPriceVal: null,
            addVal: null,
            addPriceVal: null,
          })
        }
      },
      addFree() {//新增免邮费地区
        if(this.postage.priceType == "0"){//价格
          const val = this.freeData.length;
          this.freeData.push({
            id:val,
            city: ['未添加地区'],
            num: null,
            price: null,
            weight: null,
            freeNum: null,
            freeWeight:null,
            freePrice: null,
            freeType:null,
          })
        } else{//重量
          const val = this.freeDataList.length;
          this.freeDataList.push({
            id:val,
            city: ['未添加地区'],
            num: null,
            price: null,
            weight: null,
            freeNum: null,
            freeWeight:null,
            freePrice: null,
            freeType:null,
          })
        }
      },
      editSpecialNumProvince(id,val) {//选择特殊邮费--件数的城市
        if(val[0] == "未添加地区"){
          const newProvince = deleteString(province,this.hasProvinceNum);
          this.provinceList = newProvince;
          this.province = []
        } else{
          const currentCity = deleteString(this.hasProvinceNum,val);
          const newProvince = deleteString(province,currentCity);
          this.provinceList = newProvince;
          this.province = val
        } 
        this.dialogVisible = true
        this.provinceType = 1
        this.changeProvinceId = id
        this.changeProvinceVal = val
      },
      editSpecialWeightProvince(id,val) {//选择特殊邮费--重量的城市
        if(val[0] == "未添加地区"){
          const newProvince = deleteString(province,this.hasProvinceWeight);
          this.provinceList = newProvince;
          this.province = []
        } else{
          const currentCity = deleteString(this.hasProvinceWeight,val);
          const newProvince = deleteString(province,currentCity);
          this.provinceList = newProvince;
          this.province = val
        } 
        this.dialogVisible = true
        this.provinceType = 1
        this.changeProvinceId = id
        this.changeProvinceVal = val
      },
      editFreeProvince(id,val) {//选择免邮费的城市
        if(val[0] == "未添加地区"){
          this.province = []
        } else{
          this.province = val
        } 
        this.provinceList = province
        this.dialogVisible = true
        this.provinceType = 2
        this.changeProvinceId = id
        this.changeProvinceVal = val
      },
      specialCity() {//确认地区
        if(this.province.length >0){
          this.dialogVisible = false
          if(this.provinceType == 1){//特殊地区
            if(this.postage.priceType == 0){//件数
              this.hasProvinceNum = deleteString(this.hasProvinceNum,this.changeProvinceVal);//删除本条在已选全部的数据
              this.province.map((i,v) => {//重新把本条数据加入全部已选数据中
                this.hasProvinceNum.push(i);  
              })
              this.special.map((i,v) =>{
                if(this.changeProvinceId == i.id){
                    i.city = this.province
                }
              })
              
            } else if(this.postage.priceType == 1){//重量
                this.hasProvinceWeight = deleteString(this.hasProvinceWeight,this.changeProvinceVal); //筛选-排重

                this.province.map((i,v) => {
                  this.hasProvinceWeight.push(i);  
                })

                this.specialList.map((i,v) =>{
                  if(this.changeProvinceId == i.id){
                    i.city = this.province
                  } 
                })
            }
          } else if(this.provinceType == 2){//免邮地区
            if(this.postage.priceType == 0){//件数
              this.freeData.map((i,v) =>{
                if(this.changeProvinceId == i.id){
                  i.city = this.province
                }
              })
            } else{//按重量
              this.freeDataList.map((i,v) =>{
                if(this.changeProvinceId == i.id){
                  i.city = this.province
                }
              })
            }
          }
        } else{
          this.$message.error('请选择至少一个省份');
        }
      },
      deleteSpecial(row) {//删除
        if(this.postage.priceType == 0){
          const data = [];
          data.push(row);
          this.special = deleteItems(this.special,data);
        } else{
          const data = [];
          data.push(row);
          this.specialList = deleteItems(this.specialList,data);
        }
      },
      deleteFree(row) {//删除
        if(this.postage.priceType == 0){
          const data = [];
          data.push(row);
          this.freeData = deleteItems(this.freeData,data);
        } else{
          const data = [];
          data.push(row);
          this.freeDataList = deleteItems(this.freeDataList,data);
        }
      },
      baseNum(id,val) {
        if(this.postage.priceType == 0){
          this.special.map((i,v) =>{
            if(i.id == id){
              i.basicVal = val
            }
          })
        } else{
          this.specialList.map((i,v) =>{
            if(i.id == id){
              i.basicVal = val
            }
          })
        }
      },
      basePrice(id,val) {
        if(this.postage.priceType == 0){
          this.special.map((i,v) =>{
            if(i.id == id){
              i.basicPriceVal = val
            }
          })
        } else{
          this.specialList.map((i,v) =>{
            if(i.id == id){
              i.basicPriceVal = val
            }
          })
        }
      },
      baseAddNum(id,val) {
        if(this.postage.priceType == 0){
          this.special.map((i,v) =>{
            if(i.id == id){
              i.addVal = val
            }
          })
        } else{
          this.specialList.map((i,v) =>{
            if(i.id == id){
              i.addVal = val
            }
          })
        }
      },
      baseAddPrice(id,val) {
        if(this.postage.priceType == 0){
          this.special.map((i,v) =>{
            if(i.id == id){
              i.addPriceVal = val
            }
          })
        } else{
          this.specialList.map((i,v) =>{
            if(i.id == id){
              i.addPriceVal = val
            }
          })
        }
      },
      submit() {//提交邮费方式
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var isdefault = "";
            if(this.postage.defaultVal == true){
              isdefault = 1 
            }else {
              isdefault = 0
            }
            var express = {}
            var special = []
            var free =[]

            express.description = this.postage.description,
            express.expressType = this.postage.type,
            express.freeStatus = this.postage.pinkageStatus,
            express.name = this.postage.name,
            express.priceType = this.postage.priceType,
            express.status = this.postage.status,
            express.isdefault = isdefault,
            express.addNum = this.postage.addNum, 
            express.addPrice = this.postage.addPrice, 
            express.addWeight = this.postage.addWeight, 
            express.addWeightPrice = this.postage.addWeightPrice, 
            express.basicNum = this.postage.basicNum,
            express.basicPrice = this.postage.basicPrice, 
            express.basicWeight = this.postage.basicWeight,
            express.basicWeightPrice = this.postage.basicWeightPrice
            
            if(this.postage.priceType == "0" && this.postage.pinkageStatus == 1){//按照件数
              if(this.postage.addNum == null || this.postage.addPrice == null || this.postage.basicNum == null || this.postage.basicPrice == null){
                this.$message.error('请将普通地区的计费条件补全');
              }else{
                //特殊地区邮费计费数据
                const specialVal = this.special.every(i => i.city != "未添加地区" && i.basicVal !== null && i.basicPriceVal !== null && i.addVal !== null && i.addPriceVal !== null)
                const freeVal = this.freeData.every(i => i.city != "未添加地区" && i.freeType !== null)
                const freeNextVal = this.freeData.every(i => (i.freeType == 1 && i.price != null) || (i.freeType == 3 && i.num != null) || (i.freeType == 4 && i.freeNum != null && i.freePrice != null))

                const editId = this.$route.query.editId
                if(editId){//编辑--修改保存
                  express.id = editId
                  if(specialVal == true){//特殊地区判断是否补全
                    special = this.special.map(i => {
                      return {
                        addNum: i.addVal,
                        addPrice: i.addPriceVal,
                        basicNum: i.basicVal,
                        basicPrice: i.basicPriceVal,
                        province: i.city.join(","),
                      }
                    })
                    if(freeVal == true && freeNextVal == true){//免邮地区判断是否补全
                      this.freeData.map((i,v) => {
                        if(i.freeType == 1){
                          free.push({
                            freetype: i.freeType,
                            price: i.price,
                            province: i.city.join(','),
                          })
                        }else if(i.freeType == 3){
                          free.push({
                            freetype: i.freeType,
                            num: i.num,
                            province: i.city.join(','),
                          })
                        }else if(i.freeType == 4){
                          free.push({
                            freetype: i.freeType,
                            num: i.freeNum,
                            price: i.freePrice,
                            province: i.city.join(','),
                          })
                        }
                        
                      })
                      const dataVal = { express, special, free }
                      updataSaveAPI(dataVal).then(res => {
                        if(res.data.code === 0){
                          this.$message.success('保存成功');
                          this.$router.go(-1);
                        } else {
                          this.$message.error('保存失败');
                        }
                      })
                    } else{
                      this.$message.error('请将免邮地区的条件补全');
                    }
                  } else{
                    this.$message.error('请将特殊地区的计费条件补全');
                  }

                } else{//新增保存
                  if(specialVal == true){//特殊地区判断是否补全
                    special = this.special.map(i => {
                       return {
                        addNum: i.addVal,
                        addPrice: i.addPriceVal,
                        basicNum: i.basicVal,
                        basicPrice: i.basicPriceVal,
                        province: i.city.join(","),
                      }
                    })

                    if(freeVal == true && freeNextVal == true){//免邮地区判断是否补全
                      this.freeData.map((i,v) => {
                        if(i.freeType == 1){
                          free.push({
                            freetype: i.freeType,
                            price: i.price,
                            province: i.city.join(','),
                          })
                        }else if(i.freeType == 3){
                          free.push({
                            freetype: i.freeType,
                            num: i.num,
                            province: i.city.join(','),
                          })
                        }else if(i.freeType == 4){
                          free.push({
                            freetype: i.freeType,
                            num: i.freeNum,
                            price: i.freePrice,
                            province: i.city.join(','),
                          })
                        }
                        
                      })
                      const dataVal = { express, special, free }
                      saveAPI(dataVal).then(res => {
                        if(res.data.code === 0){
                          this.$message.success('保存成功');
                          this.$router.go(-1);
                        } else {
                          this.$message.error('保存失败');
                        }
                      })

                    } else{
                      this.$message.error('请将免邮地区的条件补全');
                    }
                  } else{
                    this.$message.error('请将特殊地区的计费条件补全');
                  }
                }
              }
            } else if(this.postage.priceType == "1" && this.postage.pinkageStatus == 1){//按照重量
              if(this.postage.addWeight == null || this.postage.addWeightPrice == null || this.postage.basicWeight == null || this.postage.basicWeightPrice == null){
                this.$message.error('请将普通地区的计费条件补全');
              }else{
                const specialVal = this.specialList.every(i => i.city != "未添加地区" && i.basicVal !== null && i.basicPriceVal !== null && i.addVal !== null && i.addPriceVal !== null)
                const freeVal = this.freeDataList.every(i => i.city != "未添加地区" && i.freeType !== null)
                const freeNextVal = this.freeDataList.every(i => (i.freeType == 0 && i.weight != null) || (i.freeType == 1 && i.price != null) || (i.freeType == 2 && i.freeWeight != null && i.freePrice != null))

                const editId = this.$route.query.editId
                if(editId) {
                  express.id = editId
                  if(specialVal == true){//特殊地区判断是否补全
                    special = this.specialList.map(i => {
                      return {
                        addWeight: i.addVal,
                        addWeightPrice: i.addPriceVal,
                        basicWeight: i.basicVal,
                        basicWeightPrice: i.basicPriceVal,
                        province: i.city.join(","),
                      }
                    })

                    if(freeVal == true && freeNextVal == true){
                      this.freeDataList.map(i => {
                        if(i.freeType == 0){
                          free.push({
                            freetype: i.freeType,
                            weight : i.weight,
                            province: i.city.join(','),
                          })
                        }else if(i.freeType == 1){
                          free.push({
                            freetype: i.freeType,
                            price: i.price,
                            province: i.city.join(','),
                          })
                        }else if(i.freeType == 2){
                          free.push({
                            freetype: i.freeType,
                            weight: i.freeWeight,
                            price: i.freePrice,
                            province: i.city.join(','),
                          })
                        }
                      })

                      const dataVal = { express, special, free }
                      updataSaveAPI(dataVal).then(res => {
                        if(res.data.code === 0){
                          this.$message.success('保存成功');
                          this.$router.go(-1);
                        } else {
                          this.$message.error('保存失败');
                        }
                      })

                    } else{
                      this.$message.error('请将免邮地区的条件补全');
                    }
                  } else{
                    this.$message.error('请将特殊地区的计费条件补全');
                  }
                } else{
                  if(specialVal == true){//特殊地区判断是否补全
                    this.specialList.map((i,v) => {
                      special.push({
                        addWeight: i.addVal,
                        addWeightPrice: i.addPriceVal,
                        basicWeight: i.basicVal,
                        basicWeightPrice: i.basicPriceVal,
                        province: i.city.join(","),
                      })
                    })

                    if(freeVal == true && freeNextVal == true){
                      this.freeDataList.map((i,v) => {
                        if(i.freeType == 0){
                          free.push({
                            freetype: i.freeType,
                            weight : i.weight,
                            province: i.city.join(','),
                          })
                        }else if(i.freeType == 1){
                          free.push({
                            freetype: i.freeType,
                            price: i.price,
                            province: i.city.join(','),
                          })
                        }else if(i.freeType == 2){
                          free.push({
                            freetype: i.freeType,
                            weight: i.freeWeight,
                            price: i.freePrice,
                            province: i.city.join(','),
                          })
                        }
                      })

                      const dataVal = { express, special, free }
                      saveAPI(dataVal).then(res => {
                        if(res.data.code === 0){
                          this.$message.success('保存成功');
                          this.$router.go(-1);
                        } else {
                          this.$message.error('保存失败');
                        }
                      })

                    } else{
                      this.$message.error('请将免邮地区的条件补全');
                    }
                  } else{
                    this.$message.error('请将特殊地区的计费条件补全');
                  }
                }
              }
            } else{//免邮费
              const specialVal = this.specialList.every(i => i.city != "未添加地区" && i.basicVal !== null && i.basicPriceVal !== null && i.addVal !== null && i.addPriceVal !== null)
              const editId = this.$route.query.editId
              if(editId) {
                express.id = editId
                if(specialVal == true){//特殊地区判断是否补全
                  const dataVal = { express }
                  updataSaveAPI(dataVal).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('保存成功');
                      this.$router.go(-1);
                    } else {
                      this.$message.error('保存失败');
                    }
                  })
                  }
                } else {
                  const dataVal = { express }
                  saveAPI(dataVal).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('保存成功');
                      this.$router.go(-1);
                    } else {
                      this.$message.error('保存失败');
                    }
                  })
                } 
            }
          }
        })
      }
    }
  }
</script>