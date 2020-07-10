<template>
  <div class="app-container addCaseBank" @click="authorStatus=1,translatorStatus=1">
    <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
    <el-form :model="dataFrom" ref="dataFrom" :rules="rules" label-position="right" label-width="140px" class="ib">
      <el-row>
        <el-col :span="14">
          <el-form-item label="会员名称：" prop="memberId" class="float"  v-if="title == '添加认证信息'">
            <el-select v-model="dataFrom.memberId" style="width:300px" clearable placeholder="请选择会员" :disabled="title == '查看认证信息'">
              <el-option
                v-for="item in memberList"
                :key="item.memberId"
                :label="item.userName"
                :value="item.memberId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名：" prop="name" class="float">
            <el-input v-model="dataFrom.name" clearable placeholder=""  style="width:300px !important"  :disabled="title == '查看认证信息'"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex" :rules="[{ required: dataFrom.authenticationType==2?true:false, message: `请输入性别`, trigger: 'change' }]">
            <el-radio-group v-model="dataFrom.sex"  :disabled="title == '查看认证信息'">
              <el-radio label="1">男</el-radio>
              <el-radio label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="省份：" prop="province" class="float" style="clear:both">
            <el-select v-model="dataFrom.province" placeholder="请输入省份"  @change="provinceChanged" style="width:300px"  :disabled="title == '查看认证信息'">
                <el-option v-for="item in mapData.provinceList" :key="item.adcode" :label="item.name" :value="item.adcode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市区：" prop="city" class="float" style="clear:both">
            <el-select v-model="dataFrom.city" placeholder="请输入市" @change="cityChanged" style="width:300px"  :disabled="title == '查看认证信息'">
                <el-option v-for="item in mapData.cityList" :key="item.adcode" :label="item.name" :value="item.adcode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区：" prop="district" class="float" style="clear:both">
            <el-select v-model="dataFrom.district" placeholder="请输入地区"  @change="areaChanged" style="width:300px"  :disabled="title == '查看认证信息'">
                <el-option v-for="item in mapData.areaList" :key="item.adcode" :label="item.name" :value="item.adcode"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="学校：" class="float" prop="school"  v-if="typeStatus === '1'" ref="school">
            <el-input v-model="dataFrom.school" clearable style="width:300px !important"  :disabled="title == '查看认证信息'"></el-input>
          </el-form-item>
          <el-form-item label="专业：" class="float" prop="major" v-if="typeStatus === '1'"  ref="major">
            <el-input v-model="dataFrom.major" clearable style="width:300px !important"  :disabled="title == '查看认证信息'"></el-input>
          </el-form-item>
          <el-form-item label="规培医院：" class="float" prop="hospital"  v-if="typeStatus === '1'" ref="hospital">
            <el-input v-model="dataFrom.hospital" clearable style="width:300px !important"  :disabled="title == '查看认证信息'"></el-input>
          </el-form-item>

          <el-form-item label="师承：" class="float" prop="master" v-if="typeStatus === '0'||typeStatus === '2'" ref="master">
            <el-input v-model="dataFrom.master" clearable style="width:300px !important"  :disabled="title == '查看认证信息'"></el-input>
          </el-form-item>
          <el-form-item label="医疗机构：" class="float" prop="medicalInstitution"  v-if="typeStatus === '0'" ref="medicalInstitution">
            <el-input v-model="dataFrom.medicalInstitution" clearable style="width:300px !important"  :disabled="title == '查看认证信息'"></el-input>
          </el-form-item>
          <el-form-item label="标签：" class="float" prop="label" ref="label">
            <el-input v-model="dataFrom.label" clearable style="width:300px !important"  :disabled="title == '查看认证信息'"></el-input>
          </el-form-item>
          <el-form-item label="科室：" class="float" prop="departmentId"  v-if="typeStatus === '0'" ref="departmentId">
            <el-select v-model="dataFrom.departmentId" style="width:300px" clearable placeholder="请选择科室"  :disabled="title == '查看认证信息'">
              <el-option
                v-for="item in departmentList"
                :key="item.enkey"
                :label="item.cnkey"
                :value="item.enkey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称：" class="float" prop="professionalTitle"  v-if="typeStatus === '0'" ref="professionalTitle">
            <el-select v-model="dataFrom.professionalTitle" style="width:300px" clearable placeholder="请选择职称"  :disabled="title == '查看认证信息'">
              <el-option
                v-for="item in titleList"
                :key="item.enkey"
                :label="item.cnkey"
                :value="item.enkey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="认证类型：" prop="authenticationType">
            <el-radio-group v-model="dataFrom.authenticationType"  @change="changeType"  :disabled="title == '查看认证信息'">
              <el-radio label="0">医师资格认证</el-radio>
              <el-radio label="1">医学院师生认证</el-radio>
              <el-radio label="2">实名认证</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>
        <el-col :span="10" class="form-line-three">
          <el-form-item label="身份证正面：" prop="idcardImgFront" style="height:100px">
            <div class="upload-item" v-if="!dataFrom.idcardImgFront">
                <div class="item-con">
                    <img :src="addImg" alt="">
                    <span class="upload-text">上传照片</span>
                </div>
                <input name="idcardImgFront" @change="uploadLogo($event,'1')" ref="file" type="file" class="upLoad-img">
            </div>
            <div v-if="dataFrom.idcardImgFront" class="showPic">
                <img class="showImg"  :src="imgUrl(dataFrom.idcardImgFront)" alt="" @mouseenter="hoverIndex = '1'">
                <div class="hover-img" v-show="hoverIndex == '1'" @mouseenter="hoverIndex = '1'" @mouseleave="hoverIndex = ''">
                    <div class="hover-img-text">
                        <div class="upload-again"  v-if="title != '查看认证信息'">
                            重新上传
                        </div>
                        <input name="idcardImgFront" @change="uploadLogo($event,'1')" ref="file" type="file" class="again-img">
                    </div>
                    <span class="hover-img-text" @click="lookImg(dataFrom.idcardImgFront)">查看照片</span>
                    <img class="hasimg" :src="hasSuccess" alt="">
                </div>
            </div>
          </el-form-item>
          <el-form-item label="身份证反面：" prop="idcardImgBack" style="height:100px">
            <div class="upload-item" v-if="!dataFrom.idcardImgBack">
                <div class="item-con">
                    <img :src="addImg" alt="">
                    <span class="upload-text">上传照片</span>
                </div>
                <input name="idcardImgBack" @change="uploadLogo($event,'2')" ref="file" type="file" class="upLoad-img">
            </div>
            <div v-if="dataFrom.idcardImgBack" class="showPic">
                <img class="showImg"  :src="imgUrl(dataFrom.idcardImgBack)" alt="" @mouseenter="hoverIndex = '2'">
                <div class="hover-img" v-show="hoverIndex == '2'" @mouseenter="hoverIndex = '2'" @mouseleave="hoverIndex = ''">
                    <div class="hover-img-text">
                        <div class="upload-again" v-if="title != '查看认证信息'">
                            重新上传
                        </div>
                        <input name="idcardImgBack" @change="uploadLogo($event,'2')" ref="file" type="file" class="again-img">
                    </div>
                    <span class="hover-img-text" @click="lookImg(dataFrom.idcardImgBack)">查看照片</span>
                    <img class="hasimg" :src="hasSuccess" alt="">
                </div>
            </div>
          </el-form-item>
          <el-form-item :label="labelOne" prop="physicianImgOne" style="height:100px" v-if="dataFrom.authenticationType !== '2'">
            <div class="upload-item" v-if="!dataFrom.physicianImgOne">
                <div class="item-con">
                    <img :src="addImg" alt="">
                    <span class="upload-text">上传照片</span>
                </div>
                <input name="physicianImgOne" @change="uploadLogo($event,'3')" ref="file" type="file" class="upLoad-img">
            </div>
            <div v-if="dataFrom.physicianImgOne" class="showPic">
                <img class="showImg"  :src="imgUrl(dataFrom.physicianImgOne)" alt="" @mouseenter="hoverIndex = '3'">
                <div class="hover-img" v-show="hoverIndex == '3'" @mouseenter="hoverIndex = '3'" @mouseleave="hoverIndex = ''">
                    <div class="hover-img-text">
                        <div class="upload-again" v-if="title != '查看认证信息'">
                            重新上传
                        </div>
                        <input name="physicianImgOne" @change="uploadLogo($event,'3')" ref="file" type="file" class="again-img">
                    </div>
                    <span class="hover-img-text" @click="lookImg(dataFrom.physicianImgOne)">查看照片</span>
                    <img class="hasimg" :src="hasSuccess" alt="">
                </div>
            </div>
          </el-form-item>
          <el-form-item :label="labelTwo" prop="physicianImgTwo" style="height:100px" v-if="dataFrom.authenticationType !== '2'">
            <div class="upload-item" v-if="!dataFrom.physicianImgTwo">
                <div class="item-con">
                    <img :src="addImg" alt="">
                    <span class="upload-text">上传照片</span>
                </div>
                <input name="physicianImgTwo" @change="uploadLogo($event,'4')" ref="file" type="file" class="upLoad-img">
            </div>
            <div v-if="dataFrom.physicianImgTwo" class="showPic">
                <img class="showImg"  :src="imgUrl(dataFrom.physicianImgTwo)" alt="" @mouseenter="hoverIndex = '4'">
                <div class="hover-img" v-show="hoverIndex == '4'" @mouseenter="hoverIndex = '4'" @mouseleave="hoverIndex = ''">
                    <div class="hover-img-text">
                        <div class="upload-again" v-if="title != '查看认证信息'">
                            重新上传
                        </div>
                        <input name="physicianImgTwo" @change="uploadLogo($event,'4')" ref="file" type="file" class="again-img">
                    </div>
                    <span class="hover-img-text" @click="lookImg(dataFrom.physicianImgTwo)">查看照片</span>
                    <img class="hasimg" :src="hasSuccess" alt="">
                </div>
            </div>
          </el-form-item>
          <el-form-item label="医师职称证正面：" prop="tittleImgOne" style="height:100px" v-if="dataFrom.authenticationType === '0'&&dataFrom.idcard === '0'">
            <div class="upload-item" v-if="!dataFrom.tittleImgOne">
                <div class="item-con">
                    <img :src="addImg" alt="">
                    <span class="upload-text">上传照片</span>
                </div>
                <input name="tittleImgOne" @change="uploadLogo($event,'5')" ref="file" type="file" class="upLoad-img">
            </div>
            <div v-if="dataFrom.tittleImgOne" class="showPic">
                <img class="showImg"  :src="imgUrl(dataFrom.tittleImgOne)" alt="" @mouseenter="hoverIndex = '5'">
                <div class="hover-img" v-show="hoverIndex == '5'" @mouseenter="hoverIndex = '5'" @mouseleave="hoverIndex = ''">
                    <div class="hover-img-text">
                        <div class="upload-again" v-if="title != '查看认证信息'">
                            重新上传
                        </div>
                        <input name="tittleImgOne" @change="uploadLogo($event,'5')" ref="file" type="file" class="again-img">
                    </div>
                    <span class="hover-img-text" @click="lookImg(dataFrom.tittleImgOne)">查看照片</span>
                    <img class="hasimg" :src="hasSuccess" alt="">
                </div>
            </div>
          </el-form-item>
          <el-form-item label="医师职称证反面：" prop="tittleImgTwo" style="height:100px" v-if="dataFrom.authenticationType === '0'&&dataFrom.idcard === '0'">
            <div class="upload-item" v-if="!dataFrom.tittleImgTwo">
                <div class="item-con">
                    <img :src="addImg" alt="">
                    <span class="upload-text">上传照片</span>
                </div>
                <input name="tittleImgTwo" @change="uploadLogo($event,'6')" ref="file" type="file" class="upLoad-img">
            </div>
            <div v-if="dataFrom.tittleImgTwo" class="showPic">
                <img class="showImg"  :src="imgUrl(dataFrom.tittleImgTwo)" alt="" @mouseenter="hoverIndex = '6'">
                <div class="hover-img" v-show="hoverIndex == '6'" @mouseenter="hoverIndex = '6'" @mouseleave="hoverIndex = ''">
                    <div class="hover-img-text">
                        <div class="upload-again" v-if="title != '查看认证信息'">
                            重新上传
                        </div>
                        <input name="tittleImgTwo" @change="uploadLogo($event,'6')" ref="file" type="file" class="again-img">
                    </div>
                    <span class="hover-img-text" @click="lookImg(dataFrom.tittleImgTwo)">查看照片</span>
                    <img class="hasimg" :src="hasSuccess" alt="">
                </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="证件类型" prop="idcard" v-show="typeStatus === '0'">
        <el-radio-group v-model="dataFrom.idcard"  @change="changeCard"  :disabled="title == '查看认证信息'">
          <el-radio label="0">执业/助理医师资格证</el-radio>
          <el-radio label="1">医师佩戴医院胸牌半身照</el-radio>
          <el-radio label="2">从业人员资格证书</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="擅长：" class="float" prop="good" :rules="[{ required: dataFrom.authenticationType==2?true:false, message: `请输入擅长`, trigger: 'change' },{max:50,message: '请输入50字以内的擅长内容'}]">
        <el-col :span="20">
          <el-input v-model="dataFrom.good" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" clearable :disabled="title == '查看认证信息'"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="简介：" class="float" prop="synopsis" :rules="[{ required: dataFrom.authenticationType==2?true:false, message: `请输入简介`, trigger: 'change' },{max:100,message: '请输入100字以内的简介'}]">
        <el-col :span="20">
          <el-input v-model="dataFrom.synopsis"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" clearable :disabled="title == '查看认证信息'"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="备注：" class="float" prop="remark">
        <el-col :span="20">
          <el-input v-model="dataFrom.remark"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" clearable :disabled="title == '查看认证信息'"></el-input>
        </el-col>
      </el-form-item>
      <div class="dialog-footer" v-if="title != '查看认证信息'">
        <el-button @click="dataSubmit">保存</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </el-form>
    <el-dialog title="查看大图" :visible.sync="showImg" width="736px" @close="showImg = false">
            <div class="img-center">
                <!-- <pic-zoom v-if="showImg" :url="fileUrl(imgPath)" :showEidt="true" :showScale="true" :scale="scaleNum" :big-url="fileUrl(imgPath)"></pic-zoom> -->
                <img class="showBigImg"  :src="imgUrl(imgPath)" alt="">
            </div>
        </el-dialog>
  </div>
</template>

<script>
import {saveAPI, detailsAPI, uploadSchoolAPI , getMemberListAPI ,editAPI ,getDataAPI} from '@/api/member/authentication'
import {requestMsg, confirm} from '@/utils/publicFunctions'
import {getMultipleSelectionIDs} from '@/filters/getIds'
import mapList from '../../../../static/gaode.json'
import hasSuccess from '@/assets/img/entry/success.png';
import addImg from '@/assets/img/entry/addImg.png';
import { baseUrl } from "@/utils/global.js";

export default {
  data() {
    return {
      hasSuccess:hasSuccess,
      addImg:addImg,
      baseUrl:baseUrl,
      dataFrom: {
        memberId:'', // 会员名称
        name:'',    // 姓名
        sex:'1',    // 性别 男1  女0
        province:'',  // 省
        city:'', // 市
        district:'',   //区
        master:"",   // 师承
        medicalInstitution:'', // 医疗机构
        label:"", // 标签
        departmentId:'',       // 科室
        professionalTitle:'',   // 职称
        authenticationType:'0',  // 认证类型
        good:"",   // 擅长
        synopsis:'', // 简介
        remark:"",  // 备注
        hospital:'', // 规培医院
        school:'',  // 学校
        major:'', // 专业

        idcard:"0",   // 证件类型（医师资格认证时使用） 0：执业/助理医师资格证 1：医师佩戴医院胸牌半身照 2：从业人员资格证书
        idcardImgFront:"",  // 身份证正面
        idcardImgBack:"",  // 身份证反面
        physicianImgOne:"", // 医师执业证第一页 OR 手持医院胸牌照 OR 从业证书 OR 教师或学生证
        physicianImgTwo:"",  // 医师执业证第二页 OR 手持医院胸牌照 OR 从业证书
        tittleImgOne:"",  // 职称照片1
        tittleImgTwo:"",  // 职称照片2
      },
      typeStatus:'0',  // 认证类型
      memberList:[
      ], // 会员列表
      departmentList:[
        {
          name:'科室1',
          value:'456'
        }
      ], // 科室列表
      titleList:[
        {
          name:'职称1',
          value:'4522446'
        }
      ], // 职称列表
      rules: {
        memberId:[{required: true,  message: '请选择会员', trigger: 'change'}],
        name: [{required: true,  message: '请输入姓名', trigger: 'change'}, { max:10,message: '请输入10字以内的姓名'}],
        master:[{required: false,  message: '请输入师承', trigger: 'change'}, { max:20,message: '请输入20字以内的师承'}],
        medicalInstitution:[{required: false,  message: '请输入医疗机构', trigger: 'change'}, { max:30,message: '请输入30字以内的医疗机构'}],
        label: [{required: false,  message: '请输入标签', trigger: 'change'}, { max:30,message: '请输入30字以内的标签'}],
        departmentId:[{required: false,  message: '请选择科室', trigger: 'change'}],
        professionalTitle:[{required: false,  message: '请选择职称', trigger: 'change'}],
        province:[{required: true,  message: '请选择省份', trigger: 'change'}],
        city:[{required: true,  message: '请选择市区', trigger: 'change'}],
        district:[{required: true,  message: '请选择地区', trigger: 'change'}],
         /*good: [ { max:50,message: '请输入50字以内的擅长内容'}],
         synopsis: [{ max:100,message: '请输入100字以内的简介'}],*/
        remark: [{required: false,  message: '请输入备注', trigger: 'change'}, { max:50,message: '请输入50字以内的备注'}],
        hospital: [{required: false,  message: '请输入规培医院', trigger: 'change'}, { max:20,message: '请输入20字以内的规培医院'}],
        school: [{required: false,  message: '请输入学校', trigger: 'change'}, { max:20,message: '请输入20字以内的学校'}],
        major: [{required: false,  message: '请输入专业', trigger: 'change'}, { max:20,message: '请输入20字以内的专业'}],
        idcardImgFront:[{ required: true, trigger: "change blur", message: "请选择照片" }],  // 身份证正面
        idcardImgBack:[{ required: true, trigger: "change blur", message: "请选择照片" }],  // 身份证反面
        physicianImgOne:[{ required: true, trigger: "change blur", message: "请选择照片" }], // 医师执业证第一页 OR 手持医院胸牌照 OR 从业证书 OR 教师或学生证
        physicianImgTwo:[{ required: true, trigger: "change blur", message: "请选择照片" }],  // 医师执业证第二页 OR 手持医院胸牌照 OR 从业证书
        tittleImgOne:[{ required: false, trigger: "change blur", message: "请选择照片" }], // 职称照片1
        tittleImgTwo:[{ required: false, trigger: "change blur", message: "请选择照片" }],  // 职称照片2
      },
      labelOne:'医师执业证第一页:',
      labelTwo:'医师执业证第二页:',
      hoverIndex:'',
      showImg:false,
      imgPath:'',
      checkedKeys: [],

      /* 地图 */
      mapData:{
          provinceList:[],
          cityList:[],
          areaList:[]
      },
      map:{},
      query:{
        pageNum:1,
        pageSize:100,
        code:''
      },
      depQuery:{
        pageNum:1,
        pageSize:100,
        code:''
      },
      validStatus:false,
      title:'添加认证信息'
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
    this.map = this._initData(mapList.districtList)
    this.getMember()
    this.getDep()
    this.getTitle()
    this.getProvinceList()
  },
  mounted() {
    let query = this.$route.query
    if(query.detailsId){
      this.title = '修改认证信息'
      this.pageDetails(query.detailsId)
    }else if(query.id){
      this.title = '查看认证信息'
      this.pageDetails(query.id)
    }
  },
  methods: {
    getDep(){
      this.depQuery.code = 'YDCCSECTIONOFFICE'
      getDataAPI(this.depQuery).then(res =>{
        if(res.data.code == 0){
          this.departmentList = res.data.data.list
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    getTitle(){
      this.query.code = 'YDCCTITLETYPE'
      getDataAPI(this.query).then(res =>{
        if(res.data.code == 0){
          this.titleList = res.data.data.list
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    pageDetails(id){
      let oid = id +''
      detailsAPI(oid).then(res =>{
        if(res.data.code == 0){
          let data = res.data.data
          this.dataFrom = data
          this.mapData.cityList = this._getData('provinceList',data.province)
          this.dataFrom.city = data.city
          this.mapData.areaList =this._getData('cityList',data.city)
          this.dataFrom.area = data.area
          this.changeType(this.dataFrom.authenticationType)


        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    getMember(){
      getMemberListAPI().then(res =>{
        if(res.data.code == 0){
          this.memberList = res.data.data
        }
      })
    },
    /* 地图数据 */
    _initData(data){
      let list ={
          provinceList:[],
          cityList:[],
          areaList:[]
      }
      function fun(data){
          data.forEach(el => {
              const obj = {
                  adcode:el.adcode,
                  districtList:el.districtList,
                  name:el.name
              }
              switch(el.level){
                  case "province":
                      list.provinceList.push(obj)
                  break;
                  case "city":
                      list.cityList.push(obj)
                  break;
                  case "district":
                      list.areaList.push(obj)
                  break;
              }
              if(el.districtList&&el.districtList.length > 0){
                  fun(el.districtList)
              }
          });
      }
      fun(data)
      list.provinceList.sort(this._sortNumber)
      list.cityList.sort(this._sortNumber)
      list.areaList.sort(this._sortNumber)
      return list
    },
    _sortNumber(a,b){
        return a.adcode - b.adcode
    },
    getProvinceList(){
        this.map.provinceList.sort(this._sortNumber)
        this.mapData.provinceList=this.map.provinceList
    },
    _getData(data,index){
        return this.map[data].filter(item=>item.adcode == index)[0].districtList
    },
    provinceChanged(value){
        this.dataFrom.city='',
        this.dataFrom.district='',
        this.mapData.areaList = ''
        this.mapData.cityList = this._getData('provinceList',value)
    },
    cityChanged(value){
        this.dataFrom.district='',
        this.mapData.areaList =this._getData('cityList',value)
    },
    areaChanged(value){
      console.log(this.dataFrom);
    },



    /* 照片上传 */
    uploadLogo(e,index){
        let file = e.target.files[0];
        let that = this;
        let isJPG = (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/bmp' || file.type == 'image/gif');
        if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/JPEG/PNG/GIF/BMP 格式!');
        return isJPG
        }
        let formData = new FormData()
        formData.append('file', file)
        uploadSchoolAPI(formData).then(res => {
            if(res.status == '200'){
                this.$message.success('上传图片成功')
                console.log(res.data);
                this._picture(res.data,index)
                if(this.validStatus){
                  this.$refs["dataFrom"].validate((valid) => {});
                }
            }else{
                this.$message.error('图片上传失败')
            }
        })
    },
    _picture(path,index){
      console.log(index);
        switch (index) {
            case '1':
                this.dataFrom.idcardImgFront = path
                break;
            case '2':
                this.dataFrom.idcardImgBack = path
                break;
            case '3':
                this.dataFrom.physicianImgOne = path
                break;
            case'4':
                this.dataFrom.physicianImgTwo = path
                break;
            case '5':
                this.dataFrom.tittleImgOne = path
                break;
            case '6':
                this.dataFrom.tittleImgTwo = path
                break;
            default:
                break;
        }
    },
    // 查看大图
    lookImg(path){
        this.showImg = true
        this.imgPath = path
    },


    // 切换认证类型
    changeType(value){
      // let refs = []
      let clear = []
      if(value == '0'){
        this.dataFrom.idcard = '0'
        this.labelOne = '医师执业证第一页:'
        this.labelTwo = '医师执业证第二页:'
        if(this.typeStatus == '1'){
          clear = ['school','major','hospital','label']
        }else{
          clear = ['master','label']
        }
        // refs=['master','medicalInstitution','label','departmentId','professionalTitle']
        this.clearV(clear)
        this.typeStatus = value
        // this.validate(refs)
      }else if(value == '1'){
        this.labelOne = '教师或学生证:'
        this.labelTwo = '教师或学生证:'
        if(this.typeStatus == '0'){
          clear = ['master','medicalInstitution','departmentId','professionalTitle','label']
        }else{
          clear = ['master','label']
        }
        // refs=['school','major','hospital','label']
        this.clearV(clear)
        this.typeStatus = value
        // this.validate(refs)
      }else if(value == '2'){
        if(this.typeStatus == '1'){
          clear = ['school','major','hospital']
        }else{
          clear = ['master','medicalInstitution','departmentId','professionalTitle','label']
        }
        // refs=['master','label']
        this.clearV(clear)
        this.typeStatus = value
        // this.validate(refs)
      }
    },
    clearV(clear){
      for(var i = 0; i < clear.length; i++){
        console.log(clear[i]);
        this.$refs[clear[i]].clearValidate()
      }
    },
    // validate(refs){
    //   for(var i = 0; i < refs.length; i++){
    //     console.log(refs[i]);
    //     this.$refs[refs[i]].validate((valid) => {});
    //   }
    // },

    // 切换证件类型
    changeCard(value){
      if(value == '0'){
        this.labelOne = '医师执业证第一页:'
        this.labelTwo = '医师执业证第二页:'
      }else if(value == '1'){
        this.labelOne = '手持医院胸牌照:'
        this.labelTwo = '手持医院胸牌照:'
      }else if(value == '2'){
        this.labelOne = '从业证书:'
        this.labelTwo = '从业证书:'
      }
    },

    //保存
    dataSubmit() {
      this.$refs['dataFrom'].validate((valid) => {
        this.validStatus = true
        if (valid) {//必填字段验证
          const id = this.$route.query.detailsId
          if(id){
            editAPI(this.dataFrom).then(res =>{
              if (res.data.code === 0) {
                this.$message.success('修改成功')
                this.$router.push({ path: '/membermanage/authentication' });
              } else{
                this.$message.error(res.data.msg)
              }
              this.isSubmit=true;
            })
          }else{
            saveAPI(this.dataFrom).then(res =>{
              if (res.data.code === 0) {
                this.$message.success('添加成功')
                this.$router.push({ path: '/membermanage/authentication' });
              } else{
                this.$message.error(res.data.msg)
              }
              this.isSubmit=true;
            })
          }
        }
      })
    },
    cancel() {//取消
      this.$router.go(-1);
    },

  },
}
</script>

<style lang="less" scoped>
.upload-item{
  position: relative;
  .upLoad-img{
      width: 168px;
      height: 98px;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
  }
  .upLoad-img:hover{
      cursor: pointer;
  }
  .item-con{
      display: flex;
      flex-direction: column;
      text-align: center;
      width: 168px;
      height: 98px;
      background: #fff;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      position: absolute;
      left: 0;
      top: 0;
      img{
          margin: 20px auto 16px;;
          height: 30px;
          width: 30px;
      }
      .upload-text{
          line-height: 14px;
          color: #A9AFBC;
          font-size: 14px;
      }
  }

}
.showPic{
  position: relative;
  display: flex;
  width: 165px;
  height: 98px;
  .showImg{
      margin: auto;
      text-align: center;
      max-width: 165px;
      max-height: 98px;
  }
  .hover-img{
      position: absolute;
      top: 0;
      left: 0;
      width: 165px;
      height: 98px;
      background: rgba(152, 153, 152, 0.5);
      display: flex;
      flex-direction: column;
      text-align: center;
      padding: 20px 0 ;
      .hover-img-text{
          line-height: 17px;
          padding: 5px 0;
          font-size: 14px;
          color:#fff;
          position: relative;
          .upload-again{
              position: relative;
          }
          .again-img{
              width: 168px;
              height: 17px;
              position: absolute;
              left: 0;
              top: 0;
              opacity: 0;
          }
          .again-img:hover{
              cursor: pointer;
          }
      }
      .hover-img-text:hover{
          cursor: pointer;
      }
      .hasimg{
          position: absolute;
          right: 0;
          top: 0;
      }
  }
  .showImg:hover{
      cursor: pointer;
  }
}
.img-center{
  height: 500px;
  width: 600px;
  text-align: center;
  display: flex;
  justify-content: center;
  .showBigImg{
    max-height: 500px;
    max-width: 600px;

  }
}
</style>
<style lang="less" >
  .form-line-three{
    .el-form-item{
        .el-form-item__content{
            .el-form-item__error{
                padding-top:65px;
            }
        }
    }
  }
</style>

