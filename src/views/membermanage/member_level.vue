<template>
  <div class="app-container calendar-list-container">
    <!--<<<<<<< HEAD
        <div class="nav-buttons-container">
          <el-button v-waves icon="el-icon-setting" @click="massSetting">批量设置</el-button>
          <el-button v-waves icon="el-icon-delete" @click="massCharge">批量充值</el-button>
        </div>

        <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @current-change="handleCurChange" ref="multipleTable"
          @selection-change="handleSelectionChange">
          <el-table-column  align="center">
    =======-->
    <div class="nav-buttons-container">
      <el-button type="primary" v-waves  v-if="authBtns.map(i => i.idName).indexOf('setbtn') >= 0" @click="massSetting">{{authBtns.filter(i => i.idName=='setbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='setbtn').length>0 && authBtns.filter(i => i.idName=='setbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('setbtn')].icon, 'el-icon--right']"></i></el-button>
      <!--<el-button type="primary" v-waves icon="el-icon-delete" @click="massCharge">批量充值</el-button>-->
    </div>

    <el-table stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row @current-change="handleCurChange" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange"><!--:key='tableKey' -->
      <el-table-column width="60" align="center">
        <!--&gt;>>>>>> xyw-->
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column min-width="150px" align="center" label="会员等级名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成长值要求" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.growthValue}}</span>
        </template>
      </el-table-column>
      <el-table-column width="130" align="center" label="结算折扣（折）">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="积分提成（%）">
        <template slot-scope="scope">
          <span>{{scope.row.scorePercentage}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" label="扣除">
        <template slot-scope="scope">
          <span>{{scope.row.annuallySubScore}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="简介">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" align="center" label="会员数">
        <template slot-scope="scope">
          <span>{{scope.row.memberCount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" style="color:#008000;">启用</span>
          <span v-else style="color:#CC6600;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-mobile-phone" @click="topUp(scope.row)"></i><!--
          <i class="el-icon-delete" @click="singleDelete(scope.row.id)"></i> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="update(scope.row)"></i><!--
          <i class="el-icon-delete" @click="singleDelete(scope.row.id)"></i> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改会员等级对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="150px" style="margin-right:20px;">
        <el-form-item label="会员等级：" prop="name">
          <el-col :span="12">
            <span>{{temp.name}}</span>
            <!--<el-input v-model="temp.name" placeholder="普通会员" editable="false" disabled></el-input>-->
          </el-col>
        </el-form-item>
        <el-form-item label="成长值要求：" prop="growthValue">
          <el-col :span="12" style="margin-right:5px;">
            <el-input v-model="temp.growthValue" placeholder="0"></el-input>
          </el-col>
          点
        </el-form-item>
        <el-form-item label="结算折扣：" prop="discount">
          <el-col :span="12" style="margin-right:5px;">
            <el-input v-model.number="temp.discount" placeholder="10"></el-input>
          </el-col>
          折
        </el-form-item>
        <el-form-item label="积分提成：" prop="scorePercentage">
          <el-col :span="12" style="margin-right:5px;">
            <el-input v-model.number="temp.scorePercentage" placeholder="10"></el-input>
          </el-col>
          %
        </el-form-item>
        <el-form-item label="满一年后扣除积分：" prop="annuallySubScore">
          <el-col :span="12">
            <el-input v-model="temp.annuallySubScore" placeholder="0"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="等级排序：" prop="sort">
          <el-col :span="12">
            <el-input v-model.number="temp.sort" placeholder="1" readonly="readonly"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="简介：" prop="description">
          <el-col :span="16">
            <el-input type="textarea" :autosize="{ minRows: 7}" v-model="temp.description" placeholder="注册既可以成为普通会员，永久有效"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <!--<<<<<<< HEAD
            <div slot="footer" class="dialog-footer"  align="center">
              &lt;!&ndash; <el-button class="form-submit" @click="dialogFormVisible = false">保存</el-button> &ndash;&gt;
              <el-button class="form-submit" @click="updateData">保存</el-button>
      =======-->
      <div slot="footer" class="dialog-footer">
        <!-- <el-button class="form-submit" type="primary" @click="dialogFormVisible = false">保存</el-button> -->
        <el-button class="form-submit" @click="updateData">保存</el-button>
        <!--&gt;>>>>>> xyw-->
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 批量充值对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPvVisible" width="40%" style="padding-left:15px;">
      <el-form v-if="dialogStatus==='charge'" ref="massForm" :model="charge" label-position="right" label-width="100px" style='margin-right:20px;'>
        <el-form-item>
          <el-col>
            已选择
            <!-- <p>{{charge.id}}</p> -->
            等级，操作执行后不可逆转，扣除积分或成长值不足时则清空记录。
          </el-col>
        </el-form-item>

        <el-form-item label="充值类型:">
          <el-checkbox-group v-model="charge.rechargeTypes">
            <el-checkbox label="0" v-model="charge.rechargeTypes[0]">积分</el-checkbox>
            <el-checkbox label="1" v-model="charge.rechargeTypes[1]">成长值</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="充值设置">
          <el-radio v-model="charge.type" label="1">增加</el-radio>
          <el-radio v-model="charge.type" label="0">减少</el-radio>
        </el-form-item>
        <el-form-item label="充值数量:">
          <el-col :span="12">
            <el-input v-model="charge.info" placeholder="建议输入正整数" clearable v-validate="'numeric'" data-vv-as="field" name="numeric_field"></el-input>
            <!--<p v-show="errors.has('numeric_field')" style="">请输入正确的数值</p>-->
          </el-col>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-col :span="16">
            <el-input type="textarea" :autosize="{ minRows: 7}" v-model="charge.remark"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <el-form v-else-if="dialogStatus==='setting'" label-position="right" label-width="100px" style='margin-right:20px;'>
        <el-form-item label="会员状态：">
          <el-radio-group v-model="memberStatus.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <!--<<<<<<< HEAD
                <el-button class="form-submit" v-if="dialogStatus==='charge'" @click="massChargeSubmit">确定充值</el-button>
                <el-button class="form-submit" v-else-if="dialogStatus=='setting'" @click="massSettingSubmit" >确定</el-button>
              </div>
            </el-dialog>
            <div class="pagination-container">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
        =======-->
        <el-button class="form-submit" v-if="dialogStatus==='charge'" type="primary" @click="massChargeSubmit">确定充值
        </el-button>
        <el-button class="form-submit" v-else-if="dialogStatus=='setting'" type="primary" @click="massSettingSubmit">
          确定
        </el-button>
        <el-button class="form-submit" @click="dialogPvVisible=false" type="primary">取消</el-button>
      </div>
    </el-dialog>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
        <!--&gt;>>>>>> xyw-->
      </el-pagination>
    </div>

  </div>
</template>
<script>
  /* import { getData, deleteData, changeType } from "@/api/website-management/errorCorrection"; */
  import waves from "@/directive/waves"; // 水波纹指令
  import {operationMsg} from "@/utils/publicFunctions";
  import {getMultipleSelectionIDs, getMaxSort} from "@/filters/getIds";
  import {
    getListAPI,
    batchStatusAPI,
    batchChargeAPI,
    updateAPI
  } from "@/api/member/memberLevel";
  import store from '@/store'
/*
  <<<<<<<
  HEAD
  export default {
    name: "complexTable",
    directives: {
      waves
    },
    data() {
      return {
        rules: {
          name: [{type: "string", message: '会员等级不能为空', required: true, trigger: 'change'}],
          growthValue: [{type: "number", message: '成长值不能为空,只能为整数', required: true, trigger: 'blur'}],
          discount: [{
            type: "number",
            message: '结算折扣不能为空，且为0.1-10的数字',
            required: true,
            trigger: 'blur',
            min: 0.1,
            max: 10
          }],
          scorePercentage: [{
            type: "number",
            message: '积分提成不能为空，且为0.1-10的数字',
            required: true,
            trigger: 'blur',
            min: 0.1,
            max: 10
          }],
          annuallySubScore: [{
            type: "number",
            message: '扣除积分不能为空且需为0-999999的数字',
            required: true,
            trigger: 'blur',
            min: 0.1,
            max: 999999
          }],
          sort: [{type: "number", message: '等级排序不能为空', required: true, trigger: 'blur'}],
          description: [{type: "string", message: '描述不能为空，且小于100字', required: true, trigger: 'blur', min: 1, max: 100}]
        },
        ids: [],
        tableKey: 0,
        list: null,
        total: null,
        value0: "",
        chargeType: ["积分"],
        radio: "1",
        listLoading: true,
        listQuery: {
          id: "",
          pageNum: 1,
          pageSize: 100,
          user: null,
          status: null,
          title: null,
          biginCommitTimeTime: null,
          endCommitTimeTime: null,
          type: null
        },
        userStatus: 0,
        memberStatus: {
          id: [],
          status: null
        },
        temp: {
          id: "",
          name: "",
          growthValue: "",
          discount: "",
          scorePercentage: "",
          annuallySubScore: "",
          sort: "",
          description: "string"
        },
        charge: {
          id: 0,
          info: 0,
          rechargeTypes: [],
          remark: "",
          type: 0
        },
        dialogFormVisible: false,
        dialogPvVisible: false,
        dialogStatus: "",
        textMap: {
          update: "修改会员等级",
          charge: "批量充值",
          setting: "设置状态"
        },
        multipleSelection: []
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      handleCurChange(val) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val);
      ======
        =*/
        export default {
        data(){
          return {
            authBtns: [],
            rules: {
              name: [{type: "string", message: '会员等级不能为空', required: true, trigger: 'change'}],
              growthValue: [{
                /*type: "number",*/
                message: '成长值不能为空,只能为0-999999整数',
                required: true,
                trigger: 'blur'
              },
                {
                  validator: (rule, value, callback) => {
                    if (value != "") {
                      if ((/^\d{1,6}?$/).test(value) == false) {
                        callback(new Error("成长值不能为空,只能为0-999999整数"));
                      } else {
                        callback();
                      }
                    } else {
                      callback();
                    }

                  },
                  trigger: 'blur',
                },
              ],
              discount: [{
                type: "number",
                message: '结算折扣不能为空，且为0.1-10的数字',
                required: true,
                trigger: 'blur',
                min: 0.1,
                max: 10
              }, {
                validator: (rule, value, callback) => {
                  if (value != "") {
                    if ((/^[0-9]+([.]{1}[0-9]{1})?$/).test(value) == false) {
                      callback(new Error("结算折扣不能为空，且为0.1-10的数字"));
                    } else {
                      callback();
                    }
                  } else {
                    callback();
                  }

                },
                trigger: 'blur',
              },],
              scorePercentage: [{
                type: "number",
                message: '积分提成不能为空，且为0.1-10的数字',
                required: true,
                trigger: 'blur',
                min: 0.1,
                max: 10
              }],
              annuallySubScore: [{
                /*type: "number",*/
                message: '扣除积分不能为空且需为0-999999的数字',
                required: true,
                trigger: 'blur',
                min: 0,
                max: 999999
              },
                {
                  validator: (rule, value, callback) => {
                    if (value != "") {
                      if ((/^\d{1,6}?$/).test(value) == false) {
                        callback(new Error("扣除积分不能为空且需为0-999999的数字"));
                      } else {
                        callback();
                      }
                    } else {
                      callback();
                    }

                  },
                  trigger: 'blur',
                },],
              sort: [{type: "number", message: '等级排序不能为空', required: true, trigger: 'blur'}],
              description: [{
                type: "string",
                message: '描述不能为空，且小于100字',
                required: true,
                trigger: 'blur',
                min: 1,
                max: 100
              }]
            },
            ids: [],
            tableKey: 0,
            list: null,
            total: null,
            value0: "",
            chargeType: ["积分"],
            radio: "1",
            listLoading: true,
            listQuery: {
              id: "",
              pageNum: 1,
              pageSize: 100,
              user: null,
              status: null,
              title: null,
              biginCommitTimeTime: null,
              endCommitTimeTime: null,
              type: null
            },
            userStatus: 0,
            memberStatus: {
              id: [],
              status: null
            },
            temp: {
              id: "",
              name: "",
              growthValue: "",
              discount: "",
              scorePercentage: "",
              annuallySubScore: "",
              sort: "",
              description: "string"
            },
            charge: {
              id: 0,
              info: '',
              rechargeTypes: ['0'],
              remark: "",
              type: '1'
            },
            dialogFormVisible: false,
            dialogPvVisible: false,
            dialogStatus: "",
            textMap: {
              update: "修改会员等级",
              charge: "批量充值",
              setting: "设置状态"
            },
            multipleSelection: []
          };
        },
        mounted(){
          this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
          this.getList();
        },
        methods: {
          handleCurChange(val){
            this.$refs.multipleTable.clearSelection();
            this.$refs.multipleTable.toggleRowSelection(val);
          },
          getList(){
            this.listLoading = true;
            getListAPI(this.listQuery).then(res => {
              if (res.data.code === 0) {
                this.list = res.data.data.list
                this.total = res.data.data.total
              } else {
                this.$message.error("获取数据失败")
              }
              this.listLoading = false
            })
          },
          handleSelectionChange(val){
            this.multipleSelection = val;
            this.ids = getMultipleSelectionIDs(this.multipleSelection);
            this.memberStatus.id = this.ids;
            this.id = this.ids;
          },
          /**
           * 充值
           * */
          topUp(row) {
            let self = this;
            this.charge = {
              id: row.id,
              info: '',
              rechargeTypes: ['0'],
              remark: "",
              type: '1'
            };
            this.dialogStatus = "charge";
            this.dialogPvVisible = true;
          },
          massChargeSubmit(){
            this.$validator.validateAll().then((result) => {
              if (result) {
                this.charge.id = this.charge.id;
                this.charge.info = parseInt(this.charge.info);
                this.charge.type = parseInt(this.charge.type);
                this.charge.rechargeTypes.map((item, index) => {
                  this.charge.rechargeTypes[index] = parseInt(item);
                });
                batchChargeAPI(this.charge).then(response => {
                  if (response.data.code === 0) {
                    this.getList();
                    this.$message.success(`批量充值${this.multipleSelection.length}成功`)
                  } else {
                    this.$message.error("批量充值失败")
                  }
                })
                this.dialogPvVisible = false
              } else {
                this.$message.error("请输入正确的充值数量！")
              }
            })
          },
          massSettingSubmit(){
            if (this.memberStatus.status !== null) {
              batchStatusAPI(this.memberStatus).then(response => {
                if (response.data.code === 0) {
                  this.getList();
                  this.$message.success("批量设置" + this.multipleSelection.length + "项成功")
                } else {
                  this.$message.error("批量设置失败")
                }
              })
              this.dialogPvVisible = false
            } else {
              this.$message.error("请选择批量设置状态后提交！")
            }
          },
          massSetting(){
            if (this.multipleSelection.length != 0) {
              this.dialogStatus = "setting";
              this.userStatus = 0;
              this.dialogPvVisible = true;
              this.memberStatus.status = null;
            } else {
              this.$message.warning("请先选择需要设置的内容")
            }
          },
          handleFilter(){
            this.listQuery.pageNum = 1
            this.getList()
          },
          handleSizeChange(val){
            this.listQuery.pageSize = val
            this.getList()
          },
          handleCurrentChange(val){
            this.listQuery.pageNum = val
            this.getList()
          },
          singleDelete(id){
            this.$confirm("确定要删除这条纠错吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              deleteData(id).then(res => {
                operationMsg.apply(this, [res.data.code, "删除"]);
              });
            });
          },
          update(row){
            this.temp = Object.assign({}, row); // copy obj
            this.temp.endTime ? (this.checked = true) : (this.checked = false);
            this.maxSort = getMaxSort(this.list);
            this.dialogStatus = "update";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
              this.$refs["dataForm"].clearValidate();
            });
          },
          updateData(){
            /* 接口暂无 */
            document.getElementsByClassName("form-submit").disabled = true;
            this.$refs["dataForm"].validate(valid => {
              if (valid) {
                const tempData = Object.assign({}, this.temp);
                tempData.updateTime = new Date();
                tempData.updateTime = +new Date(tempData.updateTime); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464 */
                updateAPI(tempData).then(response => {
                  if (response.data.code === 0) {
                    this.getList();
                    this.$notify({
                      title: "成功",
                      message: "用户更新成功",
                      type: "success",
                      duration: 3000
                    });
                  } else {
                    this.$notify.error({
                      title: "错误",
                      message: "用户更新失败"
                    });
                  }
                  this.dialogFormVisible = false;
                  document.getElementsByClassName("form-submit").disabled = false;
                });
              }
            });
          }
        }
      }
</script>
