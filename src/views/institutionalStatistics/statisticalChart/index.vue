<template>
    <div>
        <h2>统计图表</h2>
        <!-- 饼状图 -->
        <div class="left">
            <el-form inline class="form-inline">
                <el-form-item label="民族" label-width="80px">
                    <el-select v-model="listQuery.nationsType" placeholder="请选择">
                        <el-option v-for="(value,key) in nationList" :key="key" :label="value" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-button @click="handleFilter">检索</el-button>
                    <el-button @click="resetFilter">重置</el-button>
                </el-form-item>
            </el-form>
            <div id="chart_example"></div>
        </div>
        <div class="right">
            <el-form inline class="form-inline">
                <el-form-item label="日期"  label-width="80px">
                <el-date-picker placeholder="请选择日期" v-model="date" value-format="yyyy-MM" type="month" 
                    @keyup.enter.native="handleFilter">
                </el-date-picker>
                </el-form-item>
                <el-form-item >
                    <el-button @click="handleDateFilter">检索</el-button>
                    <el-button @click="resetDateFilter">重置</el-button>
                </el-form-item>
            </el-form>
            <div id="chart"></div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import { getCakeAPI, getBrokenAPI } from '@/api/institutional/statistical'
import { nationsListAPI } from '@/api/website-management/position'

export default {
    data() {
        return {
            cakeSeriesData: [], //饼状数据
            brokenSeriesData: [], //折线图数据
            listQuery: {
                nationsType:'',
            },
            date:'',
            nationList:[],
        }
    },
    mounted() {
        const nowDate = new Date()
        const year = nowDate.getFullYear() //获取年份
        let month = nowDate.getMonth() + 1
        month = month < 10 ? '0' + month : month
        this.date = year + '-' + month
        this.getCake()
        this.getCountDays()
        this.getBroken()  //折线图
        this.resetFilter()
        this.getNationList()
    },
    methods: {
        getNationList() {
            nationsListAPI().then(res => {
                res.data.code === 0 ? this.nationList = res.data.data : this.$message.error('获取数据失败');
            })
        },
        // 获取饼状图数据
        getCake() {
            getCakeAPI(this.listQuery).then(res => {
                if(res.data.code == 0) {
                    this.cakeSeriesData = []
                    let chartData = res.data.data
                    let that = this
                    chartData.map(el => {
                        let outObj = {}
                        outObj.value = el.num
                        outObj.name = el.resourceTypeName
                        this.cakeSeriesData.push(outObj)
                    })
                    // 数据加载完毕，去渲染饼图
                    let myChart = echarts.init(document.getElementById('chart_example'))
                    let option = {
                        title : {
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                        },
                        series : [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data: this.cakeSeriesData, //动态获取后台返回的数据
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
            })
        },
        // 获取折线图数据
        getBroken() {
            getBrokenAPI({date:this.date}).then(res => {
                if(res.data.code == 0) {
                    this.brokenSeriesData = []
                    let brokenData = res.data.data
                    let brokenNum = []
                    brokenData.map(item => {
                        this.brokenSeriesData.push(item.time) //折线图横向数据
                        brokenNum.push(item.num) //折线图纵向数据
                    })
                    // 数据加载完，去渲染
                    let myChart = echarts.init(document.getElementById('chart'))
                    let option = {
                        xAxis: {
                            type: 'category',
                            data: this.brokenSeriesData //动态获取横向数据
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: brokenNum, //动态获取纵向数据
                            type: 'line'
                        }]
                    };
                    myChart.setOption(option)
                }
            })
        },
        getCountDays() {
            const curDate = new Date()
            const curMonth = curDate.getMonth()
            curDate.setMonth(curMonth + 1);
            curDate.setDate(0);
            // 返回当月的天数
            return curDate.getDate()
        },
        handleFilter(){//检索
            this.getCake()
        },
        handleDateFilter() { //折线图检索
            this.getBroken()
        },
        resetFilter(){//重置
            this.listQuery = { nationsType: null}
            this.getCake()
        },
        resetDateFilter(){//折线图重置
            this.data = ''
            this.getBroken()
        },
    }
    
}
</script>

<style scoped>
.left{
    width: 50%;
    float: left;
    border-right: 1px solid #ccc;
    margin-top: 40px;
}
.right{
    width: 48%;
    float: left;
    margin-top: 40px;
}
h2 {
    width: 9%;
    margin: 20px auto 0;
}
#chart_example{
    width: 80%;
    height: 500px;
    margin-top: 30px;
    margin-left: 10%;
}
#chart{
    width: 80%;
    height: 500px;
    margin-top: 30px;
    margin-left: 10%;

}
</style>