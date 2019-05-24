<template>
    <div class="pay">
        <div id="header">
            <h1>临停缴费</h1>
            <p><i class="iconfont icon-zuo"></i>返回</p>
        </div>
        <div id="container">
            <div id="content">
                <div class="title">
                    <span>{{carMsg.id}}</span>
                    <button>{{isNotPay ? stateArr[0] : stateArr[1]}}</button>
                </div>
                <div class="detail">
                    <div class="time">
                        <div>
                            <p>进场时间：</p>
                            {{carMsg.inTime}}
                        </div>
                        <div>
                            <p>出场时间：</p>
                            {{carMsg.outTime}}
                        </div>
                    </div>
                    <div class="price">
                        <p><span>￥</span>{{carMsg.price}}</p>   
                    </div>
                </div>
            </div>
        </div>
        <div id="payWay" v-show="isNotPay">
            <ul>
                <li>
                    <p><span class="gray"></span></p>
                    <div>
                        <p class="name">微信支付</p>
                        <p class="extra">推荐安装微信5.0及以上版本用户使用银行</p>
                    </div>
                    <p><span :class="['white',btnClass[0]?'whiteClick':'']" @click="chooseWay(1)"></span></p>
                </li>
                <li>
                    <p><span class="gray"></span></p>
                    <div>
                        <p class="name">支付宝</p>
                        <p class="extra">推荐有支付宝账号的用户使用</p>
                    </div>
                    <p><span :class="['white',btnClass[1]?'whiteClick':'']"  @click="chooseWay(2)"></span></p>
                </li>
                <li>
                    <p><span class="gray"></span></p>
                    <div>
                        <p class="name">浦发银行</p>
                        <p class="extra">推荐有浦发银行账号的用户使用</p>
                    </div>
                    <p><span :class="['white',btnClass[2]?'whiteClick':'']" @click="chooseWay(3)"></span></p>
                </li>
                <li>
                    <p><span class="gray"></span></p>
                    <div>
                        <p class="name">运达一卡通</p>
                        <p class="extra">推荐运达一卡通的用户使用</p>
                    </div>
                    <p><span :class="['white',btnClass[3]?'whiteClick':'']" @click="chooseWay(4)"></span></p>
                </li>
                <li>
                    <p><span class="gray"></span></p>
                    <div>
                        <p class="name">银行卡支付</p>
                        <p class="extra">推荐有我家云钱包账号的用户使用</p>
                    </div>
                    <p><span :class="['white',btnClass[4]?'whiteClick':'']" @click="chooseWay(5)"></span></p>
                </li>
            </ul>
            <button @click="clickPay">支付</button>
        </div>
        <div id="toast" v-show="isShow">{{msg}}</div>
    </div>
</template>

<script>
import check from '../../src/utils/checkType.js'
import axios from 'axios' 
export default {
    name: 'pay',
    data(){
        return{
            stateArr: ["未缴费","已缴费"],
            carMsg: {
                id: "未知车牌号",
                inTime: "",
                outTime: "",
                price: 0
            },
            msg: "无法支付",
            isNotPay: true,
            isShow: false,
            btnClass: [false,false,false,false,false],
            chooseIndex: 0
        }
    },
    methods: {
        /**
         * 选择支付方式
         */
        chooseWay(index){
            this.btnClass.fill(false)
            this.$set(this.btnClass,index - 1,!this.btnClass[index-1]);
            this.chooseIndex = index;
        },
        /**
         * 点击支付按钮
         */
        clickPay(){
            if(this.chooseIndex === 1 && this.carMsg !== null) {
                this.updateStorage('carMsg',1);
                this.msg = "支付成功";
                this.isNotPay = false;
                this.showToast();
            }else if(this.chooseIndex === 2) {
                this.msg = "无法支付";
                this.showToast();
            }
        },
        /**
         * 控制消息提示框
         */
        showToast(){
            this.isShow = true;
            setTimeout(()=>{
                this.isShow = false;
            },2000);
        },
        /**
         * 获取参数
         */
        GETParams() {  
            let url = location.href; //获取url中"?"符后的字串  
            let theRequest = {};  
            if (url.indexOf("?") != -1) {  
                let str = url.substr(url.indexOf("?")+1);     //获取“?”之后的字符串  
                let arr = str.split("&");  
                for(var i = 0; i < arr.length; i ++) {  
                    theRequest[arr[i].split("=")[0]] = decodeURI(arr[i].split("=")[1]);  
                }  
            }
            return theRequest;
        },
        /**
         * 发送请求
         */
        sendRequest(key,flag){
            let _this = this,resObj;
            axios.get('https://www.easy-mock.com/mock/5ce74bb32a70062eacfc0e7d/payer/data.json')
            .then((res)=>{
                console.log(res);
                resObj = res.data.data;
                resObj.flag = flag;
                localStorage.setItem(key,JSON.stringify(resObj));
                _this.carMsg = resObj;
                _this.updateStorage(key,flag);
            })
        },
        /**
         * 更新缓存中数据
         */
        updateStorage(key,flag){
            let store = localStorage.getItem(key);
            if(store !== "") {
                store = JSON.parse(store);
                store.flag = flag;
                localStorage.setItem(key,JSON.stringify(store));
            }
        }
    },
    mounted(){
        let reqObj = this.GETParams(),
            boo = JSON.stringify(reqObj) === "{}";
        // 请求是否有带参数id
        if(!boo) {
            let carMsg = localStorage.getItem('carMsg');
            if(carMsg === "") {
                this.sendRequest('carMsg',0);
            } else {
                carMsg = JSON.parse(carMsg);
                // 缓存中的id是否等于请求的id
                if(check.checkType(carMsg) === "object" && carMsg.id && carMsg.id === reqObj.id) {
                    this.carMsg = carMsg;
                    this.isNotPay = this.carMsg.flag === 0;
                }else {
                    this.sendRequest('carMsg',0);
                }
            }
        }else {
            this.isNotPay = false;
        }
    }
}
</script>

<style lang="less" scoped>
    @import url(http://at.alicdn.com/t/font_1182221_h6ig0nrny6m.css);
    @scale: 0.133vw;
    #header,#container,#payWay {
        width: 100%;
        box-sizing: border-box;
        padding: 0 32*@scale;
    }
    #header {
        text-align: center;
        line-height: @scale*93;
        position: relative;
        background: #FFFFFF;
    }
    #header p {
        position: absolute;
        top: 0;
        left: @scale*32;
    }
    #header p,#header .iconfont {
        font-size: @scale*32;
    }
    #header h1 {
        font-size: @scale*34;
    }
    #container {
        padding: @scale*32;
    }
    #content {
        width: 100%;
        box-sizing: border-box;
        color: #fff;
        font-size: @scale*26;
        background-image: linear-gradient(-180deg, #40BCF9 0%, #1E87F0 100%),linear-gradient(-187deg, #40BCF9 28%, rgba(30,135,240,0.00) 100%);
        box-shadow: 0 @scale*15 @scale*59 0 rgba(30,135,240,0.20);
        border-radius: @scale*8;
    }
    #content .title {
        height: @scale*84.5;
        line-height: @scale*84.5;
        border-bottom: @scale*2 solid #fff;
        padding: 0 @scale*32;
        position: relative;
    }
    #content .title button {
        width: @scale*100;
        height: @scale*41;
        color: #1890FF;
        background: #fff;
        font-size: @scale*24;
        border: none;
        border-radius: @scale*66;
        position: absolute;
        right: @scale*32;
        top: @scale*20;
    }
    #content .detail {
        padding: 0 @scale*32;
        font-size: @scale*26;
        line-height: @scale*37;
        color: #FFFFFF;
        padding: @scale*23.5 @scale*32 @scale*32 @scale*32;
        display: flex;
        flex-direction: row;
    }
    #content .detail p {
        opacity: 0.8;
    }
    #content .detail .time {
        flex: 1;
    }
    #content .detail .time div:first-child {
        margin-bottom: @scale*32;
    }
    #content .detail .price {
        font-size: @scale*96;
        flex: 1;
        position: relative;
    }
    #content .detail .price p{
        position: absolute;
        right: 0;
        bottom: @scale*32;
    }
    #content .detail .price span {
        font-size: @scale*60;
    }
    #payWay {
        background: #fff;
    }
    #payWay ul li {
        width: 100%;
        height: @scale*128;
        box-sizing: border-box;
        display: flex;
        padding: @scale*24 0 @scale*31;
        border-bottom: 1px solid #EEE;
    }
    #payWay ul li:last-child {
        border: none;
    }
    #payWay ul li>p {
        width: @scale*70;
    }
    #payWay ul li div {
        flex-grow: 1;
    }
    #payWay .gray,.white{
        width: @scale*44;
        height: @scale*44;
        display: block;
        border-radius: 50%;
        background: #FFF;
    }
    #payWay .gray {
        background: #D8D8D8;
    }
    #payWay .white {
        border: 1px solid #999999;
    }
    #payWay .whiteClick {
        border: 1px solid #999999;
        background: #21C4B3;
    }
    #payWay .name {
        font-size: @scale*32;
        line-height: @scale*45;
    }
    #payWay .extra {
        font-size: @scale*20;
        line-height: @scale*28;
        color: #999999;
    }
    #payWay button {
        width: 100%;
        height: @scale*88;
        border: none;
        background: #21C4B3;
        border-radius: @scale*4;
        font-size: @scale*36;
        color: #FFFFFF;
        letter-spacing: 0.58px;
        margin: @scale*52 0 @scale*16;
    }
    #toast {
        width: @scale*250;
        height: @scale*80;
        border-radius: @scale*10;
        line-height: @scale*80;
        text-align: center;
        font-size: @scale*22;
        color: #fff;
        background: #333;
        opacity: 0.5;
        position: fixed;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
    }
</style>


