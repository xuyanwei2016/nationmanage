<template>
    <div class="dashboard-container">
        <img :src="welcomeImg" alt="" class="welcome-img">
        <div class="dashboard-editor-container">

          <el-row class="panel-group" :gutter="40">
            <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
            <div class='card-panel'>

                <div class="card-panel-description">
                <div class="card-panel-text">已支付订单</div>
                <count-to class="card-panel-num" :startVal="0" :endVal="this.paidNum" :duration="6000"></count-to>
                </div>
            </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
            <div class="card-panel">

                <div class="card-panel-description">
                <div class="card-panel-text">已确认订单</div>
                <count-to class="card-panel-num" :startVal="0" :endVal="this.ensuredNum" :duration="6000"></count-to>
                </div>
            </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
            <div class="card-panel">

                <div class="card-panel-description">
                <div class="card-panel-text">待发货订单</div>
                <count-to class="card-panel-num" :startVal="0" :endVal="this.hangingNum" :duration="6000"></count-to>
                </div>
            </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
            <div class="card-panel">

                <div class="card-panel-description">
                <div class="card-panel-text">已缺货订单</div>

                <count-to class="card-panel-num" :startVal="0" :endVal="this.soldNum" :duration="6000"></count-to>
                </div>
            </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
            <div class="card-panel">

                <div class="card-panel-description">
                <div class="card-panel-text">今日新订单</div>

                <count-to class="card-panel-num" :startVal="0" :endVal="this.newOrderNum" :duration="6000"></count-to>
                </div>
            </div>
            </el-col>

          </el-row>
        </div>
    </div>
</template>
<script>
    import welcomeImg from '@/assets/img/welcome.jpg'
    import CountTo from 'vue-count-to'
    import { getDashboard } from '@/api/login'

    export default{
        name : 'welcome',
        components: {
            CountTo
        },
        handleSetLineChartData(type) {
            this.$emit('handleSetLineChartData', type)
        },
        data(){
            return {
                welcomeImg:welcomeImg,
                paidNum:9999,
                ensuredNum:9999,
                hangingNum:9999,
                soldNum:9999,
                newOrderNum:9999
            }
        },
        created(){
            getDashboard().then(res => {
                if(res.data.code === 0){
                    console.log(res.data);

                    this.paidNum = res.data.data.paidNum
                    this.ensuredNum = res.data.data.ensuredNum
                    this.hangingNum = res.data.data.hangingNum
                    this.soldNum = res.data.data.soldNum
                    this.newOrderNum = res.data.data.newOrderNum
                }
            })
        }
    }
</script>
<style scoped>

@keyframes hideImg {
    0% {
        width: 800px;
    }
    50% {
        width: 800px;
    }
    100%{
        display: none;
        width: 0;
    }
}


    .welcome-img{
        display: block;
        margin: 0 auto;
        animation: hideImg 3s;
        animation-fill-mode: forwards;
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container{
    margin: 20px;
}
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: rgb(243, 208, 208);
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    // box-shadow: 4px 4px 40px rgb(243, 218, 218);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      font-weight: bold;
      margin: 26px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>

