<template>
  <div class="app-container calendar-list-container">
    <el-form inline class="form-inline" :model="settle" ref="dataForm" :rules="rules">
      <el-form-item label="规则名称：" style="display:block" label-width="100px" prop="name"> 
        <el-input v-model="settle.name" class="name"></el-input>
        <el-checkbox v-model="settle.defaultVal">设置默认</el-checkbox>
      </el-form-item>
      <el-form-item label="状态：" style="display:block" label-width="100px" >
        <el-radio v-model="settle.status" label="1">启用</el-radio>
        <el-radio v-model="settle.status" label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item label="运送方式：" style="display:block" label-width="100px" >
        <el-select v-model="settle.type" placeholder="请选择运送方式">
          <el-option :label="item.name" :value="item.id" v-for='item in typeText' :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计价方式：" style="display:block" label-width="100px" >
        <el-radio v-model="settle.priceType" label="0">按件数</el-radio>
        <el-radio v-model="settle.priceType" label="1">按重量</el-radio>
        <el-radio v-model="settle.priceType" label="2">固定金额</el-radio>
      </el-form-item>
      <div class="bottom" v-if="settle.priceType == 0">
        <p>普通地区邮费计算方式：</p>
        <el-form-item label-width="100px">
          <el-input v-model="settle.basicNum" class="small" type="number"></el-input>
        </el-form-item>
        <span>件运费,</span>
        <el-form-item label-width="100px">
          <el-input v-model="settle.basicPrice" class="small" type="number"></el-input>
        </el-form-item>
        <span>元，续件</span>
        <el-form-item label-width="100px">
          <el-input v-model="settle.addNum" class="small" type="number"></el-input>
        </el-form-item>
        <span>件，增加运费</span>
        <el-form-item label-width="100px">
          <el-input v-model="settle.addPrice" class="small" type="number"></el-input>
        </el-form-item>
        <span>元</span>
      </div>
      <div class="bottom" v-if="settle.priceType == 1">
        <p>普通地区邮费计算方式：</p>
        <el-form-item label-width="100px">
          <el-input v-model="settle.basicWeight" class="small" type="number"></el-input>
        </el-form-item>
        <span>kg运费,</span>
        <el-form-item label-width="100px">
          <el-input v-model="settle.basicWeightPrice" class="small" type="number"></el-input>
        </el-form-item>
        <span>元，续重</span>
        <el-form-item label-width="100px">
          <el-input v-model="settle.addWeight" class="small" type="number"></el-input>
        </el-form-item>
        <span>kg，增加运费</span>
        <el-form-item label-width="100px">
          <el-input v-model="settle.addWeightPrice" class="small" type="number"></el-input>
        </el-form-item>
        <span>元</span>
      </div>
      <div v-if="settle.priceType == 2"> 
        <el-form-item label-width="100px" label="固定金额：">
          <el-input v-model="settle.fixPrice" class="long" type="number"></el-input>
        </el-form-item>
        <span>元</span>
      </div>

      <div class="bottom" v-if="settle.priceType == 0">特殊地区邮费计算方式：<el-button class="right" @click="addSpecial">新增特殊地区邮费</el-button>
        <el-table :key='tableKey' :data="special" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe >
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
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <i class="el-icon-edit" title="编辑地址" @click="editSpecialNumProvince(scope.row.id,scope.row.city)"></i>
              <i class="el-icon-error" title="删除" @click="deleteSpecial(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="bottom" v-if="settle.priceType == 1">特殊地区邮费计算方式：<el-button class="right" @click="addSpecial">新增特殊地区邮费</el-button>
        <el-table :key='tableKey' :data="specialList" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe >
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
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <i class="el-icon-edit" title="编辑地址" @click="editSpecialWeightProvince(scope.row.id,scope.row.city)"></i>
              <i class="el-icon-error" title="删除" @click="deleteSpecial(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-form>

    <el-form align="center" style="margin:50px">
      <el-form-item>
        <el-button @click="submit">提交</el-button><el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="选择省份" :visible.sync="dialogVisible" width="50%">
      <template>
        <el-checkbox-group v-model="province">
          <el-checkbox v-for="name in provinceList" :label="name" :key="name" style="margin-left:30px">{{name}}</el-checkbox>
        </el-checkbox-group>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseCity">确 定</el-button>
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
  .long{
    width: 200px;
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
  import { saveAPI, getUpdataListAPI, updataSaveAPI } from '@/api/postage/settle'
  import { operationMsg, confirm } from '@/utils/publicFunctions'
  import { province } from '@/utils/region'
  import { deleteString, deleteItems } from '@/filters/getIds'
  export default {
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
        settle:{
          name: '',
          defaultVal: null,
          type: 0,
          priceType: '0',
          basicNum: null,
          basicPrice: null,
          addNum: null,
          addPrice: null,
          basicWeight: null,
          basicWeightPrice: null,
          addWeight: null,
          addWeightPrice: null,
          fixPrice: null,
          status: '1',
        },
        tableKey: 0,
        listLoading: false,
        provinceList: null,
        dialogVisible: null,
        province: [],
        special: [],
        specialList: [],
        changeProvinceId: null,
        changeProvinceVal: [],
        hasProvinceNum: [],
        hasProvinceWeight: [],
        typeText: [{
          name: '面向百世',
          id:0
        }],
      }
    },
    mounted() {
      this.provinceList = province;
      const editId = this.$route.query.editId
      if(editId){//页面编辑
        this.$route.meta.title = '修改邮费方式'
        getUpdataListAPI(editId).then(res => {
          const data = res.data.data
          this.settle.name = data.name
          this.settle.status = String(data.status)
          this.settle.priceType = String(data.priceType) 
          this.settle.basicNum = data.basicNum 
          this.settle.basicPrice = data.basicPrice 
          this.settle.addNum = data.addNum 
          this.settle.addPrice = data.addPrice
          this.settle.basicWeight = data.basicWeight 
          this.settle.basicWeightPrice = data.basicWeightPrice
          this.settle.addWeight = data.addWeight
          this.settle.addWeightPrice = data.addWeightPrice
          this.settle.defaultVal = !!(data.isdefault)
          this.settle.type = data.expressType
          this.settle.fixPrice = data.price
          if(this.settle.priceType == 0){//按照件数
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
          } else if(this.settle.priceType == 1){//按照重量
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
        if(this.settle.priceType == "0"){//价格
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
        this.changeProvinceId = id
        this.changeProvinceVal = val
      },
      chooseCity() {
        if(this.province.length >0){
          this.dialogVisible = false
          if(this.settle.priceType == 0){//件数
            this.hasProvinceNum = deleteString(this.hasProvinceNum,this.changeProvinceVal);//删除本条在已选全部的数据
            this.province.map((i,v) => {//重新把本条数据加入全部已选数据中
              this.hasProvinceNum.push(i);  
            })
            this.special.map((i,v) =>{
              if(this.changeProvinceId == i.id){
                  i.city = this.province
              }
            })
            
          } else if(this.settle.priceType == 1){//重量
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
        }
      },
      submit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var isdefault = "";
            if(this.settle.defaultVal == true){
              isdefault = 1 
            }else {
              isdefault = 0
            }
            var expressRule = {}
            var special = []
            expressRule.expressType  = this.settle.type,
            expressRule.price = this.settle.fixPrice
            expressRule.name = this.settle.name,
            expressRule.priceType = this.settle.priceType,
            expressRule.isdefault = isdefault,
            expressRule.addNum = this.settle.addNum, 
            expressRule.addPrice = this.settle.addPrice, 
            expressRule.addWeight = this.settle.addWeight, 
            expressRule.addWeightPrice = this.settle.addWeightPrice, 
            expressRule.basicNum = this.settle.basicNum,
            expressRule.basicPrice = this.settle.basicPrice, 
            expressRule.basicWeight = this.settle.basicWeight,
            expressRule.basicWeightPrice = this.settle.basicWeightPrice
            expressRule.status = this.settle.status

            if(this.settle.priceType == 0){//按照件数
              const specialVal = this.special.every(i => i.city != "未添加地区" && i.basicVal !== null && i.basicPriceVal !== null && i.addVal !== null && i.addPriceVal !== null)
              if(this.settle.addNum == null || this.settle.addPrice == null || this.settle.basicNum == null || this.settle.basicPrice == null){
                this.$message.error('请将普通地区的计费条件补全');
              }else{
                if(specialVal == true){//特殊地区判断是否补全
                  this.special.map((i,v) => {
                    special.push({
                      addNum: i.addVal,
                      addPrice: i.addPriceVal,
                      basicNum: i.basicVal,
                      basicPrice: i.basicPriceVal,
                      province: i.city.join(","),
                    })
                  })
                  const dataVal = {
                    expressRule: expressRule,
                    special: special,
                  }
                  const editId = this.$route.query.editId
                  if(editId){//修改
                    expressRule.id = editId
                    updataSaveAPI(dataVal).then(res => {
                      if(res.data.code === 0){
                        this.$message.success('保存成功');
                        this.$router.go(-1);
                      } else {
                        this.$message.error('保存失败');
                      }
                    })
                  } else{
                    saveAPI(dataVal).then(res => {
                      if(res.data.code === 0){
                        this.$message.success('保存成功');
                        this.$router.go(-1);
                      } else {
                        this.$message.error('保存失败');
                      }
                    })
                  }
                } else{
                  this.$message.error('请将特殊地区的计费条件补全');
                }
              }
            } else if(this.settle.priceType == 1){//按照质量
              const specialVal = this.specialList.every(i => i.city != "未添加地区" && i.basicVal !== null && i.basicPriceVal !== null && i.addVal !== null && i.addPriceVal !== null)
              if(this.settle.addWeight == null || this.settle.addWeightPrice == null || this.settle.basicWeight == null || this.settle.basicWeightPrice == null){
                this.$message.error('请将普通地区的计费条件补全');
              }else{
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
                  const dataVal = {
                    expressRule: expressRule,
                    special: special,
                  }
                  const editId = this.$route.query.editId
                  if(editId){//修改
                    expressRule.id = editId
                    updataSaveAPI(dataVal).then(res => {
                      if(res.data.code === 0){
                        this.$message.success('保存成功');
                        this.$router.go(-1);
                      } else {
                        this.$message.error('保存失败');
                      }
                    })
                  } else{
                    saveAPI(dataVal).then(res => {
                      if(res.data.code === 0){
                        this.$message.success('保存成功');
                        this.$router.go(-1);
                      } else {
                        this.$message.error('保存失败');
                      }
                    })
                  }
                  
                } else{
                  this.$message.error('请将特殊地区的计费条件补全');
                }
              }
            } else{//固定金额 
              if(this.settle.fixPrice == null){
                this.$message.error('请填写固定金额');
              } else{
                const dataVal = {
                  expressRule: expressRule,
                }
                const editId = this.$route.query.editId
                if(editId){
                  expressRule.id = editId
                  updataSaveAPI(dataVal).then(res => {
                    if(res.data.code === 0){
                      this.$message.success('保存成功');
                      this.$router.go(-1);
                    } else {
                      this.$message.error('保存失败');
                    }
                  })
                } else{
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
          }
        })
      },
      deleteSpecial(row) {//删除
        if(this.settle.priceType == 0){
          const data = [];
          data.push(row);
          this.special = deleteItems(this.special,data);
        } else{
          const data = [];
          data.push(row);
          this.specialList = deleteItems(this.specialList,data);
        }
      },
      baseNum(id,val) {
        if(this.settle.priceType == 0){
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
        if(this.settle.priceType == 0){
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
        if(this.settle.priceType == 0){
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
        if(this.settle.priceType == 0){
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
      cancel() {//取消保存
        confirm.apply(this,['确定要取消吗？']).then(() => {
          this.$router.go(-1);
        })
      },
    }
  }
</script>
    