<template>
  <div class="app-container calendar-list-container">
    <div class="nav-buttons-container">
      <el-button  v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="addNewUser">{{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i></el-button>

      <el-button v-if="authBtns.map(i => i.idName).indexOf('setbtn') >= 0" @click="massSetting">{{authBtns.filter(i => i.idName=='setbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='setbtn').length>0 && authBtns.filter(i => i.idName=='setbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('setbtn')].icon, 'el-icon--right']"></i></el-button>

      <!-- <el-button v-if="authBtns.map(i => i.idName).indexOf('chargebtn') >= 0" @click="massCharge">{{authBtns.filter(i => i.idName=='chargebtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='chargebtn').length>0 && authBtns.filter(i => i.idName=='chargebtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('chargebtn')].icon, 'el-icon--right']"></i></el-button> -->

      <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">{{authBtns.filter(i => i.idName=='delbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"></i></el-button>

      <!-- <el-button  v-if="authBtns.map(i => i.idName).indexOf('exportbtn') >= 0" @click="exportMemberInfo">{{authBtns.filter(i => i.idName=='exportbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportbtn').length>0 && authBtns.filter(i => i.idName=='exportbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportbtn')].icon, 'el-icon--right']"></i></el-button> -->

    </div>
    <el-form inline :model="listQuery">
      <el-form-item label="会员名称">
        <el-input v-model="listQuery.account" placeholder="请输入会员名称"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="listQuery.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.status" placeholder="请选择状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" :key='key' v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" @current-change="handleCurChange" ref="multipleTable">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column label="UID" min-width="100" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="会员名" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.account}}</template>
      </el-table-column>
      <el-table-column label="手机号" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="注册时间" min-width="135" align="center" width="250">
        <template slot-scope="scope">{{ scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status=== 1" style="color: green">启用</span>
          <span v-else style="color: red">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" min-width="90" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:`person_member/balance_check`,query:{account:scope.row.id, accountName:scope.row.account }}">
            <el-button class="query_button">查询</el-button>
          </router-link>
        </template>
      </el-table-column>
      <!-- <el-table-column label="积分" min-width="90" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:`person_member/score_check`,query:{account:scope.row.account }}">
            {{ scope.row.score }}
          </router-link>
        </template>
      </el-table-column> -->
      <el-table-column class-name="small-padding fixed-width" width="120" label="操作" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="update(scope.row)"></i>
          <i :class="authBtns.filter(i => i.idName=='infobtn')[0].icon" v-if="authBtns.filter(i => i.idName=='infobtn').length > 0" :title="authBtns.filter(i => i.idName=='infobtn')[0].name" @click="viewUserInfo(scope.row)"></i>
          <i :class="authBtns.filter(i => i.idName=='removebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='removebtn').length > 0"  :title="authBtns.filter(i => i.idName=='removebtn')[0].name" @click="singleDelete(scope.row.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <el-form :rules="rules" ref="dataForm" :model="temp" :disabled="dialogStatus==='view'" label-position="right" label-width="120px" style="margin-right:20px">
            <el-form-item label="用户名：" prop="account">
              <el-col :span="12">
                <el-input v-model="temp.account" :disabled="dialogStatus==='update'" @blur="isExist"></el-input>
              </el-col>
              <el-col :span="12" style="padding-left: 15px; color:#d8d2d2;">唯一、不可修改，建议为英文字母</el-col>
            </el-form-item>
            <el-form-item label="昵称：" prop="nickName">
              <el-col :span="12">
                <el-input v-model="temp.nickName"></el-input>
              </el-col>
              <el-col :span="12" style="padding-left: 15px; color:#d8d2d2;">支持中文、字母、数字、符号，8字以内</el-col>
            </el-form-item>
            <el-form-item label="登录密码：" prop="password">
              <el-col :span="12">
                <el-input v-model="temp.password" :disabled="dialogStatus==='update'" placeholder="w123456"></el-input>
              </el-col>
              <el-col :span="12" style="padding-left: 15px; color:#d8d2d2;">建议设置不少于六位</el-col>
            </el-form-item>
            <el-form-item label="电子邮件：" prop="email">
              <el-col :span="12">
                <el-input v-model="temp.email"></el-input>
              </el-col>
              <el-col :span="12" style="padding-left: 15px; color:#d8d2d2;">例如：173090567@qq.com</el-col>
            </el-form-item>
            <el-form-item label="手机号码：" prop="phone">
              <el-col :span="12">
                <el-input v-model="temp.phone"></el-input>
              </el-col>
              <el-col :span="12" style="padding-left: 15px; color:#d8d2d2;">电话号码长度11位，且必须属于正常区段</el-col>
            </el-form-item>
            <el-form-item label="会员状态：" prop="status">
              <el-radio-group v-model="temp.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-col :span="16">
                <el-input type="textarea" :autosize="{ minRows: 7}" v-model="temp.remark" placeholder="备注"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="自定义信息" name="second">
          <el-form :rules="rule" ref="formAddInfo" :model="temp" :disabled="dialogStatus==='view'" label-position="right" label-width="150px" style="margin-right:20px">
            <el-form-item label="真实姓名：" prop="name">
              <el-input v-model="temp.name" clearable placeholder="请输入真实姓名" style="width:250px;margin-right:10px" @input="authorLibrary"></el-input>
              <ul style="width:250px;background:#f5f5f5;list-style:none;padding-left:20px;max-height:200px;overflow-y:scroll" v-if="authorList && authorList.length>0 && authorStatus == 0">
                <li style="cursor: pointer" v-for="item in authorList" :key='item.id' @click.stop="choiceAuthor(item)">{{item.name}}</li>
              </ul>
            </el-form-item>
            <el-form-item label="机构名称：" prop="organName">
              <el-col :span="12" style="margin-right:5px">
                <el-input v-model="temp.organName" placeholder="机构名称"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio-group v-model="temp.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
                <el-radio :label="2">保密</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="会员头像：" prop="img">
              <el-col :span="12" style="margin-right:5px">
                <el-upload lass="avatar-uploader" :action="`${domain}${requestPath.file}${uploadPath}`"
                  :on-success="handleAvatarSuccess" :show-file-list="false" :before-upload="beforeAvatarUpload">
                  <template v-if="temp.img">
                    <img v-if="temp.img" :src="`${domain}${requestPath.file}?fileName=${temp.img}&isOnLine=true`" class="avatar">
                  </template>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-col>
              <el-col :span="12" style="color:#d8d2d2">仅支持jpg、jpeg、png、gifl格式，不超过2M</el-col>
              <el-col>
                <el-button size="small" type="primary" style="border-radius:5px" @click="resetAvatar">重置</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button class="form-submit" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
        <el-button class="form-submit" v-else-if="dialogStatus=='update'" type="primary" @click="updateData">保存
        </el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPvVisible" width="25%" style="padding-left:15px">
      <!-- <el-form v-if="dialogStatus==='charge'" ref="massForm" label-position="right" label-width="100px" style='margin-right:20px'>
        <el-form-item>
          <el-col>批量操作执行后不可逆转，扣除积分或成长值不足时则清空记录。</el-col>
        </el-form-item>
        <el-form-item label="充值类型：">
          <el-checkbox-group v-model="charge.rechargeTypes">
            <el-checkbox label="0" v-model="charge.rechargeTypes[0]">积分</el-checkbox>
            <el-checkbox label="1" v-model="charge.rechargeTypes[1]">成长值</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="充值设置：">
          <el-radio v-model="charge.type" label="1">增加</el-radio>
          <el-radio v-model="charge.type" label="0">减少</el-radio>
        </el-form-item>
        <el-form-item label="充值数量:">
          <el-col :span="12">
            <el-input v-model="charge.info" placeholder="1000" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注：">
          <el-col :span="16">
            <el-input type="textarea" :autosize="{ minRows: 7}" v-model="charge.remark"></el-input>
          </el-col>
        </el-form-item>
      </el-form> -->

      <el-form :model="memberStatus" label-position="right" label-width="100px" style='margin-right:20px'>
        <el-form-item label="会员状态：">
          <el-radio-group v-model="memberStatus.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <!-- <el-button class="form-submit" v-if="dialogStatus==='charge'" type="primary" @click="massChargeSubmit">确定充值</el-button> -->
        <el-button class="form-submit" type="primary" @click="massSettingSubmit">确定</el-button>
        <el-button class="form-submit" @click="dialogPvVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  // const defaultFormThead = ['UID', '会员名', '手机号', '会员级别', '会员组', '最后登录IP', '最后登录时间', '余额', '积分']
  /* import { getData, deleteData, changeType } from "@/api/website-management/errorCorrection" */
  import {operationMsg, confirm} from "@/utils/publicFunctions"
  import _ from 'lodash'
  import md5 from 'blueimp-md5'
  import {getMultipleSelectionIDs, getMaxSort} from "@/filters/getIds"
  import {
    getListAPI,
    batchDeleteAPI,
    addAPI,
    updateAPI,
    changeAPI,
    batchRechargeAPI,
    getUserByIdAPI,
    searchExistAPI,
    authorLibraryAPI

  } from "@/api/member/expert"
  import { uploadPath, requestPath} from '@/utils/global'
  import {cities as citiesArrJSON} from '@/utils/region.js'
  import queryString from 'query-string'
  import store from '@/store'

  export default {
    data() {
      const validateChinese = (rule, value, callback) => {
        let reg = /^[\u4e00-\u9fa5]{0,}$|^$/
        if (!reg.test(value)||value==''||value==null) {
          callback(new Error("请输入真实姓名"))
        } else {
          callback()
        }
      }
      const validateValue = (rule, value, callback) => {
        let reg = /^[0-9A-Za-z]{6,10}$/
        if (!reg.test(value)) {
          callback(new Error("请输入以字母或数字开头，英文、数字组成的6-10位密码"))
        } else {
          callback()
        }
      }
      const validatePhone = (rule, value, callback) => {
        let reg = /^1[3|5|7|8]\d{9}$/gi
        if (!reg.test(value)) {
          callback(new Error("请输入有效的11位数字电话号码"))
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        let reg = /(^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$)|^$/
        if (!reg.test(value)) {
          callback(new Error("请输入英文、数字开头的邮箱"))
        } else {
          callback()
        }
      }

      return {
        activeName: '',
        authBtns: [],
        domain: process.env.BASE_API,
        requestPath: requestPath,
        uploadPath: uploadPath,
        rules: {
          // name: [{required: true, type: "string", message: '请输入真实姓名', trigger: "change", validator: validateChinese }],
          account: [{ type: "string", required: true, message: '用户名必填', trigger: "change" }],
          password: [{ required: true, trigger: "change", validator: validateValue }],
          phone: [{ type: "string", required: true, trigger: "change", validator: validatePhone }],
          email: [{trigger: "change", validator: validateEmail}],
          status: [{required: true, message: "状态必选", trigger: "change"}],
          nickName: [{required: false,trigger: "change",pattern: /^[\w\u4e00-\u9fa5]{1,8}$/, message: '请输入8字以内的昵称'}]
        },
        rule: {
          name: [{ required: true, type: 'string', message: '请输入真实姓名', trigger: 'change', pattern: /^[\u4e00-\u9fa5]{0,}$|^$/}]
        },
        time: [],
        id: "",
        ids: [],
        account: "",
        accounts: [],
        imageUrl: "",
        score: ["积分"],
        radio: "1",
        list: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogPvVisible: false,
        dialogStatus: "",
        total: null,
        listQuery: {
          pageNum: 1,
          pageSize: 100,
          status: null,
          level: 1
        },
        memberStatus: {
          id: [],
          status: 1
        },
        charge: {
          accounts: [],
          info: 0,
          rechargeTypes: ['0'],
          remark: "",
          type: '1'
        },
        temp: {
          name: '',
          sex: 1,
          account: '',
          password: '',
          img: '',
          email: '',
          phone: '',
          remark: '',
          status: 1,
          nickName: '',
          organName: '',
          authorId: 101016,
        },
        options: [],
        textMap: {
          create: "添加新用户",
          update: "修改会员信息",
          view: "查看用户信息",
          charge: "批量充值",
          setting: "设置状态"
        },
        multipleSelection: [],
        key: 1,
        authorList:[],
        authorStatus:0

      }
    },
    mounted() {
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
      this.getList() //获取table列表
    },
    methods: {
      exportMemberInfo() {
        let {pageNum, pageSize, ...params} = this.listQuery
        let tempParams = {}
        for (const key in params) {
          if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
            tempParams[key] = params[key]
          }
        }
        let paramStr = queryString.stringify(tempParams)
        paramStr ? window.open(`${process.env.BASE_API}${requestPath.common}/member/export?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.common}/member/export`)
      },

      // 检测用户名是否存在
      isExist() {
        if (this.temp.account !== '') {
          searchExistAPI({ account: this.temp.account }).then(res => {
            console.log(res);
            if (res.data.data) {
              this.temp.account = ''
              this.$message.error('用户名已存在')
            }
          })
        }
      },
      authorLibrary() {//查询
        this.authorList = [];
        this.temp.authorId = '';
        this.temp.organName = '';
        this.temp.sex = '';
        if(this.temp.name.split(" ").join("").length != 0){
          this.authorStatus = 0
          authorLibraryAPI(this.temp.name.split(" ").join("")).then(res => {
            res.data.code === 0 ? this.authorList = res.data.data : this.$message.error('获取数据失败');
          })
        }
      },
      choiceAuthor(item) {//选择模糊查询的作者
        console.log(item, '25252525252');

        this.temp.name = item.name;
        this.temp.authorId = item.id;
        this.temp.organName = item.institutionName;
        this.temp.sex = item.sex;
        this.temp.img = item.faceImg;
        this.imageUrl = this.temp.img
        console.log(this.temp.img, '52525252');

        this.authorStatus = 1
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.ids = getMultipleSelectionIDs(this.multipleSelection)
        this.accounts = getMultipleSelectionIDs(
          this.multipleSelection,
          "account"
        )
        this.memberStatus.id = this.ids
      },

      // 添加新用户按钮
      addNewUser() {
        this.dialogStatus = "create"
        this.activeName = 'first'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['formAddInfo'].clearValidate()
          this.$refs['dataForm'].clearValidate()
        })
        this.resetTemp()
      },

      // 添加新用户对话框保存按钮
      createData() {
        document.getElementsByClassName("form-submit").disabled = true
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$refs["formAddInfo"].validate(valid => {
              if (valid) {
                console.log(valid,'validvalidvalidvalid')
                this.temp.password = md5(this.temp.password)
                addAPI(this.temp).then(res => {
                  operationMsg.apply(this, [res.data.code, "创建会员"])
                  this.dialogFormVisible = false
                  document.getElementsByClassName("form-submit").disabled = false
                })
              } else {
                this.$message.warning("自定义信息有未通过的验证")
              }
            })
          } else {
            this.$message.warning("基础信息有未通过的验证")
          }
        })
      },
      // 批量设置状态
      massSettingSubmit() {
        if (this.memberStatus.status !== null) {
          updateAPI(this.memberStatus).then(response => {
            if (response.data.code === 0) {
              this.getList()
              this.$message.success(`批量设置${this.multipleSelection.length}项成功`)
            } else {
              this.$message.error("批量设置失败")
            }
          })
          this.dialogPvVisible = false
        } else {
          this.$message.error("请选择批量设置状态后提交！")
        }
      },
      massSetting() {
        if (this.multipleSelection.length != 0) {
          this.dialogStatus = "setting"
          this.dialogPvVisible = true
        } else {
          this.$message.warning("请先选择需要设置的内容")
        }
      },
      massCharge() {
        if (this.multipleSelection.length != 0) {
          this.charge = {
            accounts: [],
            info: 0,
            rechargeTypes: ['0'],
            remark: "",
            type: '1'
          }
          this.dialogStatus = "charge"
          this.dialogPvVisible = true
        } else {
          this.$message.warning("请先选择需要设置的内容")
        }
      },

      // massChargeSubmit(){
      //   if (this.charge.type === "") {
      //     this.$message.error("请先选择充值类型再提交！")
      //   } else {
      //     this.charge.accounts = this.accounts
      //     this.charge.info = parseInt(this.charge.info)
      //     this.charge.type = parseInt(this.charge.type)
      //     this.charge.rechargeTypes.map((item, index) => {
      //       this.charge.rechargeTypes[index] = parseInt(item)
      //     })
      //     batchRechargeAPI(this.charge).then(response => {
      //       if (response.data.code === 0) {
      //         this.getList()
      //         this.$message.success(`批量充值${this.multipleSelection.length}成功`)
      //       } else {
      //         this.$message.error("批量充值失败")
      //       }
      //     })
      //     this.dialogPvVisible = false
      //   }
      // },

      // 批量删除
      massDelete() {
        if (this.multipleSelection.length != 0) {
          this.$confirm("确定要删除选择的数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            batchDeleteAPI(this.ids).then(response => {
              if (response.data.code === 0) {
                this.getList()
                this.$message.success(`批量删除${this.multipleSelection.length}项成功`)
              } else {
                this.$message.error("批量删除失败")
              }
            })
          })
        } else {
          this.$message.warning("请先选择需要删除的内容")
        }
      },

      // 单条删除
      singleDelete() {
         confirm.apply(this,['确定要删除这条数据吗？']).then(() => {
          batchDeleteAPI(this.ids).then(res => {
            operationMsg.apply(this,[res.data.code,'删除'])
          })
        })
      },

      resetAvatar(){
        this.imageUrl = ''
        this.temp.img = ''
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.temp.img = file.response
      },
      beforeAvatarUpload(file) {
        /*if(file.type == 'image/jpeg||image/png'){
          console.log("正确")
        }*/
        let isJPG = file.type.toLocaleLowerCase() == 'image/jpeg' || 'image/jpg' || 'image/png' || 'image/gif'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是JPG、PNG、GIF、JPEG格式！')
        }
        if (!isLt2M) {
          this.$message.error('Avatar picture size can not exceed 2MB!')
        }
        return isJPG && isLt2M
      },
      // 查看当前信息
      viewUserInfo(row){
        getUserByIdAPI(row.id).then(response => {
          if (response.data.code === 0) {
            this.temp = response.data.data
            this.temp.password = md5(this.temp.password)
            this.imageUrl = this.temp.img
            this.dialogStatus = "view"
            this.activeName = 'first'
            this.dialogFormVisible = true
          } else {
            this.$message.error("获取数据失败")
          }
          this.listLoading = false
        })
      },
      // 编辑
      update(row){
        getUserByIdAPI(row.id).then(response => {
          if (response.data.code === 0) {
            this.temp = response.data.data
            // this.temp.password = md5(this.temp.password)
            this.imageUrl = this.temp.img
            this.dialogStatus = "update"
            this.activeName = 'first'
            this.dialogFormVisible = true
          } else {
            this.$message.error("获取数据失败")
          }
          this.listLoading = false
        })
      },
      // 编辑保存
      updateData(){
        document.getElementsByClassName("form-submit").disabled = true
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$refs["formAddInfo"].validate(valid => {
              if (valid) {
                addAPI(this.temp).then(res => {
                  operationMsg.apply(this, [res.data.code, "用户更新"])
                  this.dialogFormVisible = false
                  document.getElementsByClassName("form-submit").disabled = false
                })
              } else {
                this.$message.warning("自定义信息有未通过的验证")
              }
            })
          } else {
            this.$message.warning('基础信息有未通过的验证')
          }
        })
      },

      resetTemp() {
        this.temp = {
          name: "",
          sex: 1,
          createTime: "",
          account: "",
          password: "",
          img: "",
          email: "",
          nickName: "",
          phone: "",
          remark: "",
          status:1,
          organName: '',
          authorId: 101016
        }
      },
      getList() {
        this.listLoading = true
        getListAPI(this.listQuery).then(response => {
          if (response.data.code === 0) {
            this.list = response.data.data.list
            this.total = response.data.data.total
          } else {
            this.$message.error("获取数据失败")
          }
          this.listLoading = false
        })
      },
      resetFilter() {
        this.listQuery = {
          pageNum: 1,
          status: null,
          level:1,
          pageSize: this.listQuery.pageSize
        }
        this.time = null
        this.getList()
      },
      handleFilter() {
        store.dispatch('SetPersonMemberSerKeys',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        if (this.time) {
          this.listQuery.beginTime = this.time[0]
          this.listQuery.endTime = this.time[1]
        } else {
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      },
      handleCurChange(val) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val)
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .query_button {
    border-radius: 5px;
  }

  .xyw .filter-container .el-form--inline .el-form-item--medium .el-form-item__content .el-button:not(:last-child) {
    margin-right: 10px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  }
</style>
