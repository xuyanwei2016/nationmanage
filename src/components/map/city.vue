<template>
    <div class="city-select">
        <el-select v-model="selectedProvince" name="province">
            <el-option v-for="item in provinces" v-if="item.level == 'province'" :key="item.value" :label="item.name" :value="item.value" @change="provincesChange"></el-option>
        </el-select>
        <el-select v-model="selectedCity" name="city">
            <el-option v-for="(item, index) in cities" :value="item">{{ item.name }}</el-option>
        </el-select>
        <el-select v-model="selectedBlock" name="block">
            <el-option v-for="(item, index) in blocks" :value="item">{{ item.name }}</el-option>
        </el-select>
    </div>
</template>
<script>
/**
 * 省 市 区/县城 三联动选择器
*/
import mapList from '../../../static/gaode.json'
import Vue from 'vue'
export default {
 name: 'app',
    data() {
        return {
            selectedProvince: mapList.districtList.sort(this._sortNumber)[0].adcode,
            selectedCity: 0,
            selectedBlock: 0,
            cities: 0,
            provinces:[],
            blocks: 0
        }
    },
    created() {
        console.log(this.selectedProvince);

        this.provinces = mapList.districtList.sort(this._sortNumber)
        // let beijing = this.provinces[0].districtList
        // this.cities = beijing.filter(item => {
        //     if (item.level == "city") {
        //         return true
        //     }
        // })
        // this.selectedCity = this.cities[0]
        // this.blocks = beijing.filter(item => {
        //     if (item.level == "district") {
        //         return true
        //     }
        // })
        // this.selectedBlock = this.blocks[0]
    },
    watch: {
        // selectedProvince(newVal, oldVal) {
        //     console.log(newVal,'Province')
        //     // 港澳台数据只有一级,特殊处理
        //     // this.cities = newVal.districtList
        //     if (newVal.citycode === "1853" || newVal.citycode === "1852" || newVal.citycode === "1886") {
        //         this.cities = [newVal]
        //         // this.blocks = [newVal.districtList]
        //     } else {
        //         this.cities = newVal.districtList
        //         // this.cities = this.provinces.filter(item => {
        //             // if (item.level == "district" && item.citycode && item.citycode == newVal.citycode) {
        //             //     return true
        //             // }
        //             // if (item.level == "district" && item.citycode && item.citycode == newVal.citycode && item.name !== "天津城区" && item.name !== '北京城区'&& item.name !== '重庆城区') {
        //             //     return true
        //             // }
        //         // })
        //         // console.log(this.cities,1246)
        //     }
        //     // console.log(this.cities,1246)
        //     var _this = this
        //     // 此时在渲染DOM,渲染结束之后再选中第一个
        //     Vue.nextTick(() => {
        //         // _this.selectedCity = _this.cities[0]
        //         _this.selectedCity = []
        //         _this.$emit('input', _this.info)
        //         })
        //     this.$emit('checkProvince',newVal)
        // },
        
        selectedCity(newVal) {
            console.log(newVal,'city')
            // this.blocks = newVal.districtList
            // 选择了一个市,要选择区了 di是城市的代表,sheng
            if (newVal.citycode === "1886") {
                this.blocks = [newVal]
            //     this.cities = [newVal.districtList]
            } else {
                this.blocks = newVal.districtList
            //     console.log(this.cities,115)
            //     this.blocks = this.cities.filter(item => {
            //         console.log(item)
            //         if (item.level == "district" && item.citycode && item.citycode == newVal.citycode && item.name !== "天津城区" && item.name !== '北京城区'&& item.name !== '重庆城区') {
            //             // console.log(item,132)
            //             return true
            //         }
            //     })
            //     // console.log(this.blocks,12646)
            }
            var _this = this
            Vue.nextTick(() => {
                // _this.selectedBlock = _this.blocks[0]
                _this.selectedBlock = []
                // 触发与 v-model相关的 input事件
                _this.$emit('input', _this.info)
            })
            this.$emit('checkCity',newVal)
        },
        selectedBlock(newVal) {
             console.log(newVal,'block')
            var _this = this
            Vue.nextTick(() => {
                _this.$emit('input', _this.info)
            })
            this.$emit('checkBlock',newVal)
        }
    },
    methods:{
        provincesChange(){
            
        },
        _sortNumber(a,b){
            return a.adcode - b.adcode
        }
    },
    computed: {
        info() {
            return {
                province: this.selectedProvince,
                city: this.selectedCity,
                block: this.selectedBlock
            }
        }
    },
    
}
</script>
<style  scoped>
 .city-select select{
    min-width: 100px;
    margin-right: 10px;
 }
</style>