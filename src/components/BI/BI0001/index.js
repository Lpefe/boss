/*@商务-商务首页*/
import React from 'react';
import {withRouter, } from 'react-router-dom'
import {Card, Tabs, Select, Divider, Col,Row,Icon} from 'antd';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import {injectIntl} from "react-intl";
import {chartColor} from "../../../utils/commonConsts";
import * as echarts from 'echarts';
import {parse, statusMap} from '../../../utils/commonUtilFunc';
import BossTableNew from "./subComponent/BossTableNew";
import { MomentFormatter} from "../../../utils/commonUtilFunc";
import BaseInfo from './subComponent/BaseInfo';
import moment from 'moment';
import ContactInfo from "./subComponent/ContactInfo";
import ContractInfo from "./subComponent/ContractInfo";
import SetupModal from "./subComponent/SetupModal"
import {domain} from '../../../utils/commonConsts'
import band_width_img1 from "../../../assets/img/24*24-1.png";
import band_width_img2 from "../../../assets/img/24*24-2.png";
import band_width_img3 from "../../../assets/img/24*24-3.png";
import band_width_img4 from "../../../assets/img/24*24-4.png";
import upDown from "../../../assets/img/upDown.png";
import {deviceTypeMap} from "../../../utils/commonUtilFunc";
const TabPane = Tabs.TabPane;
const Option = Select.Option;
class BI0001 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabKey: "1",
            changeTable:false,
            type: "STEP,CSTEP,AP,APP",
            name: "",
            status: "",
            statusName:"",
            deduplication: "",
            assign_type: "",
            changeTable2:true,
            company:'',
            net_type: "",
            activeKey:"1",
            bandwidth:"",
            page_no:"",
            model:"",
            id:parse(this.props.location.search).id,
            location_name:parse(this.props.location.search).firstName,
            selectvalue:parse(this.props.location.search).firstName,
            editId:"",
            link_type:""
        };
        this.ref={};
    }

    componentDidMount() {
        this.handleSelectCompanyStatus()
        this.get_band_load_all()
        this.get_bandwidth_stat_all()
        this.get_device_model_stat()
        this.get_bandwidth_stat()
        this.getStatistics()
        this.get_stat() 
        this.get_company_list() 
        this.get_link_list();
        this.get_link_stat();
        this.get_device_stat();
        this.get_device_list();
        this.get_company_contact();
        this.get_contract_list();
        this.handleOpenSetupModal();

        this.linkStat2 = echarts.init(document.getElementById("link-stat-2"));
        this.linkStat3 = echarts.init(document.getElementById("link-stat-3"));
        this.linkStat4 = echarts.init(document.getElementById("link-stat-4"));
        this.linkStat5 = echarts.init(document.getElementById("link-stat-5"));
        this.linkStat6 = echarts.init(document.getElementById("link-stat-6"));
        this.linkStat7 = echarts.init(document.getElementById("link-stat-7"));
        this.linkStat8 = echarts.init(document.getElementById("link-stat-8"));
        this.linkStat2.on('click', (params) => {
            this.props.history.push("/main/mi1401?range=" + params.name+"&company_id="+this.state.id)

        });
        this.linkStat3.on('click', (params) => {
            this.setState({activeKey:"1"})
            this.handleSelectBandwidth(params.name.replace("-",",").replace(">=100","100,"))
            this.scrollToHead()
        });
        this.linkStat4.on('click', (params) => {
            this.setState({activeKey:"1"})
            this.props.dispatch({
                type: "bi0001Info/get_link_list",
                payload: {
                    company_id: this.state.id,
                    status: (params.name==='在线'?"ONLINE":params.name==="离线"?"OFFLINE":params.name==="未激活"?"INIT":"") || "",
                }
            });
            this.scrollToHead()
        });
        this.linkStat5.on('click', (params) => {
            this.setState({activeKey:"2"})
            this.handleChangeStatus(params.name)
            this.scrollToHead()
        });
        this.linkStat6.on('click', (params) => {
            this.setState({activeKey:"2"})
            if(params.data.name==="中心节点"){
                this.props.dispatch({
                    type: "bi0001Info/getDeviceList",
                    payload: {
                        one_device:1,
                        company_id:this.state.id,
                        type: "CSTEP",
                    }
                })
            }else{
                this.props.dispatch({
                    type: "bi0001Info/getDeviceList",
                    payload: {
                        company_id:this.state.id,
                        type: "STEP",
                    }
                })
            }
            this.scrollToHead()
        });
        this.linkStat7.on('click', (params) => {
            this.props.history.push("/main/ci0302?id=" + this.state.id)
        });
        this.linkStat8.on('click', (params) => {
            this.setState({activeKey:"2"})
                this.props.dispatch({
                    type: "bi0001Info/getDeviceList",
                    payload: {
                        company_id:this.state.id,
                        model: params.name,
                        page_no: 1
                    }
                });
            this.scrollToHead()
        });
        
    }
    
    componentDidUpdate() {
        let stat = this.props.bi0001Info;
        this.renderBar2(this.linkStat2, "horizontal", this.props.bi0001Info.companyList, "#975FE4", );
        this.renderBar(this.linkStat3, "horizontal", this.props.bi0001Info.band_stat,"#3B9FF7","24px","","",false);
        this.renderChart(this.linkStat4, "",stat.link_stat,false,"",false);
        this.renderChart(this.linkStat5, "", stat.device_stat,false,"",false);
        this.renderChart(this.linkStat6, "", stat.agencyStat.data,false,['#2772A3', '#47CACA'],false);
        this.renderBar(this.linkStat7,"vertical",this.props.bi0001Info.steps_beta_flow,"","20px","","",true);
        this.renderChart(this.linkStat8,"",stat.device_model_stat,true,chartColor,true)
    }
    handleSelectBandwidth = (value) => {
        let vm = this;
        this.setState({
            bandwidth: value||"",
            status:""
        }, function () {
            vm.get_link_list();
        })
    };
    //获取联系人信息
    get_company_contact = () => {
        this.props.dispatch({
            type: "bi0001Info/get_company_contact",
            payload: {
                company_id: this.state.id
            }
        })
    };
    renderBar2 = (el, type, data, color, title, subTitle) => {
        let option = {
            title: [{
                text: title,
            }, {
                text: subTitle,
                right: "0",
                textStyle: {
                    fontSize: 14,
                    color: "rgba(0,0,0,0.65)",
                    fontWeight: 'normal'
                }
            }],
            xAxis: {
                type: type === "horizontal" ? "category" : "value",
                show: true,
                name: "(%)",
                nameGap:8,
                nameTextStyle:{color:"rgba(0,0,0,0.45)"},
                axisTick: {show: false},
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: type === "horizontal",
                    formatter: (value) => {
                        return value
                    },
                    interval:0
                },
                data: function () {
                    if (type === "horizontal") {
                        let xLabel = [];
                        for (let key in data) {
                            for (let objKey in data[key]) {
                                xLabel.push(objKey);
                            }
                        }
                        return xLabel
                    } else {
                        return []
                    }
                }()
            },
            yAxis: {
                //inverse:true,
                type: type === "horizontal" ? "value" : "category",
                axisLabel: {
                    show: type !== "horizontal", //让Y轴数据不显示
                },
                axisTick: {
                    show: false, //隐藏Y轴刻度
                },
                axisLine: {
                    show: false, //隐藏Y轴线段
                },
                splitLine: {
                    show: false
                },
                data: function () {
                    if (type === "vertical") {
                        let yLabel = [];
                        for (let key in data) {
                            for (let objKey in data[key]) {
                                yLabel.push(objKey);
                            }
                        }
                        return yLabel
                    } else {
                        return []
                    }
                }()
            },
            grid: {

                id: "chart",
                top:"15%",
                left: "0%",
                bottom: "15%",
                right: "15%"
            },
            color: chartColor,
            series: [
                {
                    show: true,
                    type: 'bar',
                    barCategoryGap: "50px",
                    barMinHeight: 10,
                    barMaxWidth:32,
                    barWidth: "57%",
                    itemStyle: {
                        normal: {
                            color: color
                        },
                    },
                    label: {
                        show: true,
                        position: type !== "vertical" ? 'top' : "right",
                        color: "rgba(0,0,0,0.85)"
                    },
                    data: function () {
                        let yData = [];
                        for (let key in data) {
                            for (let objKey in data[key]) {
                                yData.push(data[key][objKey]);
                            }
                        }
                        return yData
                    }()
                }]
        };
        el.resize({width: "auto", height: "auto"});
        el.setOption(option);

    };
    
    renderChart = (el, title, data,ifSolid,color,showContent) => {
        let option = {
            title: {
                text: title
            },
            tooltip :{                                      //提示框组件
                trigger: 'item',                            //触发类型,'item'数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。 'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
                triggerOn:"mousemove",                      //提示框触发的条件,'mousemove'鼠标移动时触发。'click'鼠标点击时触发。'mousemove|click'同时鼠标移动和点击时触发。'none'不在 'mousemove' 或 'click' 时触发
                showContent:showContent,                           //是否显示提示框浮层
                alwaysShowContent:false,                     //是否永远显示提示框内容
                showDelay:0,                                  //浮层显示的延迟，单位为 ms
                hideDelay:100,                                //浮层隐藏的延迟，单位为 ms
                enterable:false,                             //鼠标是否可进入提示框浮层中
                confine:false,                               //是否将 tooltip 框限制在图表的区域内
                transitionDuration:0.4,                      //提示框浮层的移动动画过渡时间，单位是 s,设置为 0 的时候会紧跟着鼠标移动
                //position:['50%', '50%'],                    //提示框浮层的位置，默认不设置时位置会跟随鼠标的位置,[10, 10],回掉函数，inside鼠标所在图形的内部中心位置，top、left、bottom、right鼠标所在图形上侧，左侧，下侧，右侧，
                //formatter:"{b0}: {c0}<br />{b1}: {c1}",     //提示框浮层内容格式器，支持字符串模板和回调函数两种形式,模板变量有 {a}, {b}，{c}，{d}，{e}，分别表示系列名，数据名，数据值等
                backgroundColor:"rgba(38,38,38,0.6)",            //标题背景色
                borderColor:"#ccc",                        //边框颜色
                borderWidth:0,                              //边框线宽
                //padding:5,                                  //图例内边距，单位px  5  [5, 10]  [5,10,5,10]
            },
            color:color?color:function (params) {
                const statusArr = ["未激活", "在线", "离线"];
                const colorMap = {
                    "未激活": "#FFD02D",
                    "在线": "#3B9FF7",
                    "离线": "#FF395C"
                };
                return statusArr.indexOf(params.name) > -1 ? colorMap[params.name] : chartColor[params.dataIndex % chartColor.length]
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'middle',
                itemGap: 25,
                itemHeight: 8,
                itemWidth: 12,
                selectedMode: false,
                textStyle: {
                    fontFamily: "PingFangTC-Regular",
                    fontSize: 14,
                    color: "rgba(0,0,0,0.65)"
                },
                formatter: function (name) {
                    let value;
                    for (let key in data) {
                        if (data[key].name === name) {
                            value = data[key].value
                        }
                    }
                    switch(name){
                        case "在线":
                            name="@在线";
                            break;
                        case "离线":
                            name="@离线";
                            break;
                        case "未激活":
                            name="@未激活";
                            break;
                        case "边缘节点":
                            name="@边缘节点";
                            break;
                        case "中心节点":
                            name="@中心节点";
                            break;
                        default:
                            break;
                    }
                    if(name==="暂无数据"){
                        return "@暂无数据"
                    }else{
                        return name + "：" + value
                    }
                }
            },
            series: [
                {
                    name: "",
                    type: 'pie',
                    radius: ifSolid ? ['0', '55%']:['40%', '55%'],
                    center: ["30%", "50%"],
                    minAngle: 10,
                    label: {
                        normal: {
                            show: !ifSolid,
                            position: 'center',
                            color: "rgba(0,0,0,0.85)",
                            fontSize: 16,
                            fontFamily: " PingFangSC-Regular",
                            formatter: function (params) {
                                if (params.dataIndex === 1) {
                                    let sum = 0;
                                    for (let key in data) {
                                        sum += data[key].value
                                    }
                                    return sum
                                } else {
                                    return ""
                                }
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 2,
                            borderColor: '#ffffff',
                        },
                    },
                    data: data,
                }
            ]
        };
        el.resize({width: "auto", height: "auto"});
        el.setOption(option);

    };

    renderBar = (el, type, data, color,width, title, subTitle,flag) => {
        let option = {
            title: [{
                text: title,
    
            }, {
                text: subTitle,
                right: "0",
                textStyle: {
                    //文字颜色
                    color:'rgba(0,0,0,0.65)',
                    //字体风格,'normal','italic','oblique'
                    fontStyle:'normal',
                    //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                    fontWeight:'lighter',
                    //字体系列
                    fontFamily:'PingFangSC-Regular',
                    //字体大小
            　　　　 fontSize:"14px"
                }
            }],
            xAxis: {
                type: type === "horizontal" ? "category" : "value",
                show: true,
                axisTick: {show: false},
                name:flag?"":"(Mbps)",
                nameTextStyle:{color:"rgba(0,0,0,0.45)"},
                nameGap:-6,
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: type === "horizontal",
                    formatter: (value) => {
                        return value
                    }
                },
                data: function () {
                    
                    if (type === "horizontal") {
                        let xLabel = [];
                        for (let key in data) {
                            for (let objKey in data[key]) {
                                xLabel.push(objKey);
                            }
                        }
                        return xLabel
                    } else {
                        return []
                    }
                }()
            },
            yAxis: {
               // inverse:true,
               triggerEvent: true,
                type: type === "horizontal" ? "value" : "category",
                axisLabel: {
                    show: type !== "horizontal", //让Y轴数据不显示
                    textStyle: {
                        color:function(params) {
                            if(params=="暂无数据") {return 'rgba(166,166,166,0.75)'}
                            else {return 'rgba(107,107,107,0.95)'}},
                    },
                    formatter: el._dom.id==="link-stat-7"?function (params){  
                        var index = 10;
                        var newstr = '';
                        //判断ask
                        function len(s) {
                            var l = 0;
                            var a = s.split("");
                            for (var i=0;i<a.length;i++) {
                                if (a[i].charCodeAt(0)<299) {
                                    l++;
                                } else {
                                    l+=2;
                                }
                            }
                            return l;
                        }
                        function len2(s) {
                            var l = 0;
                            var p = 0;
                            var a = s.split("");
                            for (var i=0;l<14;i++) {
                                if (a[i].charCodeAt(0)<299) {
                                    l++;
                                    p++
                                } else {
                                    l+=2;
                                    p++
                                }
                            }
                            return p;
                        }
                        for(var i=0;i<params.length;i+=index){
                            var tmp=params.substring(i, i+index);
                            newstr+=tmp;
                        }
                        if( len(newstr) > 14)
                            return newstr.substring(0,len2(newstr)) + '..';
                        else
                            return newstr;
                    }:"",

                },
                axisTick: {
                    show: false, //隐藏Y轴刻度
                },
                axisLine: {
                    show: false, //隐藏Y轴线段
                },
                splitLine: {
                    show: false
                },
                data: function () {
                    if(el._dom.id==="link-stat-7"){
                        let yLabel = [];
                        for (let key in data) {
                            yLabel.push(data[key].key);
                        }
                        if(yLabel.length<5){
                            for(let i =yLabel.length; i<5; i++ ){
                                yLabel.push("@暂无数据");
                            }
                        }
                        return yLabel.reverse()

                    }else{
                    if (type === "vertical") {
                        let yLabel = [];
                        for (let key in data) {
                            for (let objKey in data[key]) {
                                yLabel.push(objKey);
                            }
                        }
                        return yLabel
                    } else {
                        return []
                    }}
                }()
            },
            grid: flag?{
                id: "chart",
                top:"15%",
                left: "15%",
                bottom: "15%",
                right: "5%"
            }:{
                id: "chart",
                top:"15%",
                left: "0%",
                bottom: "15%",
                right: "15%"
            },
            color: chartColor,
            series: [
                {
                    show: true,
                    type: 'bar',
                    barMaxWidth:32,
                    barCategoryGap: "50px",
                    barMinHeight: el._dom.id==="link-stat-7"?15:5,
                    barWidth: width,
                    itemStyle: {
                        color:el._dom.id==="link-stat-7"? function(params) {
                            if(params.value==0) {return '#EFEFEF'}
                            else {return '#83AED5'}}:color,
                    },

                    label: {
                        show: true,
                        position: type !== "vertical" ? 'top' : "right",
                        color: "rgba(0,0,0,0.85)"
                    },
                    data: function () {
                        if(el._dom.id==="link-stat-7"){
                            let yLabel = [];
                            for (let key in data) {
                                yLabel.push(data[key].value);
                            }
                            if(yLabel.length<5){
                                for(let i =yLabel.length; i<5; i++ ){
                                    yLabel.push("0");
                                }
                            }
                            return yLabel.reverse()
    
                        }else{
                        let yData = [];
                        for (let key in data) {
                            for (let objKey in data[key]) {
                                yData.push(data[key][objKey]);
                            }
                        }
                        return yData
                    }}()
                }]
        };
        el.resize({width: "auto", height: "auto"});
        el.setOption(option);
        if(el._dom.id==="link-stat-7"){
            el.on('mouseover', function (params) {    //鼠标经过图表时候判断参数  ---请开始你的表演
                if( params.componentType === 'yAxis' ){
                    //var tt = $('#tip');
                    var tt = document.querySelector("#tip")
                    //tt.html(params.value);
                    tt.innerHTML = params.value;
                    tt.style.left = params.event.event.layerX+10+"px"
                    tt.style.top = params.event.event.layerY+20+"px"
                    tt.style.display = "block"
                }
            });
            el.on('mouseout', function (params) {
                document.querySelector("#tip").style.display="none"
            })
        }
    
    };
    //进入页面时调用，给搜索框添加默认option
    handleSelectCompanyStatus(){
        this.setState({
            statusName:parse(this.props.location.search).name,
            selectvalue:parse(this.props.location.search).selectvalue
        }, ()=> {
            this.getCompanyList()
        })
    }

    //改变搜索框id时调用，重新渲染页面
    changeId=(newId,newName)=>{
          this.setState({
            id:newId,
            location_name:newName
        },()=>{
            this.handleSelectCompanyStatus()
            this.get_band_load_all()
            this.get_bandwidth_stat_all()
            this.get_device_model_stat()
            this.get_bandwidth_stat()
            this.getStatistics()
            this.get_company_list();
            this.get_stat() 
            this.get_link_list();
            this.get_link_stat();
            this.get_device_stat();
            this.get_device_list();
            this.get_company_contact();
            this.get_contract_list();
            this.handleOpenSetupModal();
            this.get_logo()
            //刷新子组件SetupModal的initialValue
            if(typeof(this.ref.props)!=="undefined"){
                this.ref.props.form.resetFields()
            }
        }) 
    }
    get_logo = () =>{
        this.props.dispatch({
            type: "bi0001Info/getLogo",
            payload: {
                    company_id: this.state.id,
                },
            })
    }
    handleOpenSetupModal = () => {
            this.props.dispatch({
                type: "bi0001Info/get_speed_rule",
                payload: {
                    company_id: this.state.id
                }
            })
            this.props.dispatch({
                type: "bi0001Info/get_shrink",
                payload: {
                    company_id: this.state.id
                }
            })
    };
    //获取合同列表
    get_contract_list = () => {
        this.props.dispatch({
            type: "bi0001Info/get_contract_list",
            payload: {
                company_id: this.state.id
            }
        })
    };
    //status筛选设备列表
    handleChangeStatus = (value) => {
        this.setState({
            status: value || "",
        }, function () {
            this.props.dispatch({
                type: "bi0001Info/getDeviceList",
                payload: {
                    net_type: this.state.net_type,
                    name: this.state.name,
                    status:(this.state.status==='在线'?"ONLINE":this.state.status==="离线"?"OFFLINE":this.state.status==="未激活"?"INIT":"") || "",
                    type: this.state.type,
                    company_id:this.state.id
                }
            })
        })
    };
    //name筛选设备列表
    searchDevice = (value) => {
        this.setState({
            name: value || ""
        }, function () {
            this.props.dispatch({
                type: "bi0001Info/getDeviceList",
                payload: {
                    net_type: this.state.net_type,
                    name: this.state.name,
                    status: this.state.status,
                    type: this.state.type,
                     company_id:this.state.id
                }
            })
        })
    };
    //获取option页面公司列表
    getCompanyList() {
        this.props.dispatch({
            type: "bi0001Info/getCompanyList",
            payload: {
                company: this.state.selectvalue,
                status: this.state.statusName,
            }
        })
    }
    //获取当前id公司信息
    get_company_list = () => {
        this.props.dispatch({
            type: "bi0001Info/get_company_list",
            payload: {
                company_id: this.state.id
            }
        })
    };
    gotoLink = (record) => {
        if(!record.device_id){
            return;
        }
        window.open(domain+"/index."+window.appLocale.locale+ ".html#/main/bi0401/bi0402?id=" + record.id + "&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id)
    };
    //获取所有带宽
    get_band_load_all = ()=>{
        this.props.dispatch({
            type:"bi0001Info/get_band_load_all",
            payload: {
                start_tm: MomentFormatter(moment().subtract(1, 'day'),'YYYY-MM-DD 00:00:00'),
                end_tm: MomentFormatter(moment().subtract(1,'day'),'YYYY-MM-DD 23:59:59'),
                company_status: "正式,试用",
                order: 'top',
                company_id: this.state.id
            }
        })
    }
    //获取当前id链路信息
    get_link_stat = ()=>{
        this.props.dispatch({
            type:"bi0001Info/get_link_stat",
            payload: {
                company_id: this.state.id
            }
        })
    }
    //获取设备信息
    get_device_stat = ()=>{
        this.props.dispatch({
            type:"bi0001Info/get_device_stat",
            payload: {
                company_id: this.state.id
            }
        })
    }
    get_bandwidth_stat_all = () => {
        this.props.dispatch({
            type: "bi0001Info/get_bandwidth_stat_all",
            payload: {
                company_id: this.state.id
            }
        })
    };
    gotoDevice = (record) => {
        if(record.type!=='APP') {
            window.open(domain+"/index."+window.appLocale.locale+ ".html#/main/bi0301/bi0302?id=" + record.id + "&sn=" + record.sn + "&type=" + record.type + "&from=device")
        }else{
            window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0101/mi0104?id="+record.id)
        }
       
    };

    get_device_model_stat = () => {
        this.props.dispatch({
            type: "bi0001Info/get_device_model_stat",
            payload: {
                company_id: this.state.id
            }
        })
    };
        //获取设备流量排行
    getStatistics = () => {
        this.props.dispatch({
            type: "bi0001Info/getStatistics",
            payload: {
                item:"steps",
                start_tm: MomentFormatter(moment().subtract(30, 'minutes'),'YYYY-MM-DD HH:mm:ss'),
                end_tm: MomentFormatter(moment(),'YYYY-MM-DD HH:mm:ss'),
                companyid: this.state.id,
                counts: 100,
                top: "5"
            }
        })
    };
    get_stat = () => {
        this.props.dispatch({
            type: "bi0001Info/get_stat",
            payload: {
                company_id: this.state.id
            }
        })
    };
    get_bandwidth_stat = ()=>{
        this.props.dispatch({
            type: "bi0001Info/get_bandwidth_stat",
            payload: {
                company_id: this.state.id
            }
        })
    }
    get_link_list = () => {
        this.props.dispatch({
            type: "bi0001Info/get_link_list",
            payload: {
                link_type: this.state.link_type,//国内组网
                name: this.state.name,
                status: this.state.status,
                deduplication: this.state.deduplication,
                assign_type: this.state.assign_type,
                company_id: this.state.id,
                bandwidth: this.state.bandwidth
            }
        })
    };
    handleSelectStatus = (value) => {
        this.setState({
            status: value || ""
        }, () => {
            this.get_link_list()
        })
    };
    get_device_list = () => {
        this.props.dispatch({
            type: "bi0001Info/getDeviceList",
            payload: {
                type: this.state.type,//STEP,CSTEP,AP
                net_type: this.state.net_type || "",
                name: this.state.name || "",
                status: this.state.status || "",
                company_id:this.state.id,
                model: this.state.model,
                page_no: this.state.page_no,
            }
        })
    };
    handleSelectType = (value) => {
        this.setState({
            link_type: value || ""
        }, () => {
            this.get_link_list()
        })
    };
    handleSelectTypeTwo = (value) => {
        this.setState({
            type: value || "STEP,CSTEP,AP,APP"
        }, function () {
            this.props.dispatch({
                type: "bi0001Info/getDeviceList",
                payload: {
                    net_type: this.state.net_type || "",
                    name: this.state.name || "",
                    status: this.state.status,
                    type: this.state.type,
                    company_id:this.state.id,
                }
            })
        })
    };
    handleSearchSubmit = (value) => {
        this.setState({
            name: value
        }, () => {
            this.get_link_list()
        })
    };
    handleTabChange = (key) => {
        switch (key) {
            case "1":
                this.setState({
                    tabKey: key,
                    changeTable2:true
                }, function () {
                });
                break;
                case "2":
                this.setState({
                    tabKey: key,
                    changeTable2:false
                }, function () {
                });
                break;
                case "3":
                this.setState({
                    tabKey: key,
                    changeTable2:false
                }, function () {
                });
                break;
            default:
                break;
        }

    };
    handleTabChange2 = () => {
        if(this.state.activeKey==="1"){
            this.setState({activeKey:"2"})
        }else{
            this.setState({activeKey:"1"})
        }
    };
    scrollToHead = () => {
        document.getElementById("targetTable").scrollIntoView(true);
    };

    onRef1 = (vm) => {
        this.ref1 = vm;
    };
    onRef2 = (vm) => {
        this.ref2 = vm;
    };
    onRef = (vm) =>{
        this.ref = vm
    };
    handleCloseSetupModal = () => {
        this.setState({
            editId: "",
        })
    };
    render(){
        const pagination = {
            pageSize: 20
        };
        const columns = [{
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span onClick={()=>this.gotoLink(record)} className={record.device_id?"common-link-icon":""}>{record.name}</span>
            }
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@节点名称',
            dataIndex: 'branch',
            key: 'branch',
        }, {
            title: '@服务等级',
            dataIndex: 'grade',
            key: 'grade',
            render: (index, record) => {
                return record.grade === "CLOUD_VPN" ? "云VPN" : (record.grade === "CLOUD_SPLINE" ? "云专线" : "超级云专线")
            }

        }, {
            title: '@链路类型',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '@带宽'+'(M)',
            dataIndex: 'bandwidth',
            key: 'charge_type',
        }, {
            title: '@人工选路',
            dataIndex: 'manual-select',
            key: 'manual-select',
            width: 100,
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Icon type="fork"
                              style={record.assign_type === "auto" ? {color: "rgba(0,0,0,0.25)"} : {color: "rgba(0,0,0,0.65)"}}/> {record.assign_type === "auto" ? "未启用" : "已启用"}
                    </div>

                )
            }
        }, {
            title: '@智能去重',
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            align: "center",
            fixed:'right',
            render: (index, record) => {
                return (
                    <div>
                        <Icon type="safety"
                              style={record.deduplication === "OFF" ? {color: "rgba(0,0,0,0.25)"} : {color: "rgba(0,0,0,0.65)"}}/> {record.deduplication === "OFF" ? "未启用" : "已启用"}
                    </div>

                )
            }
        },];
        const columns2 = [{
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span onClick={()=>this.gotoDevice(record)} className='common-link-icon'>{record.name}</span>
            }
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@设备类型',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                return deviceTypeMap(text)
            }
        },  {
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',
        },{
            title: "@硬件ID",
            dataIndex: 'sn',
            key: 'sn',
        }];
        const option = [
            <Option value="ONLINE" key="ONLINE">@在线</Option>,
            <Option value="INIT" key="INIT">@未激活</Option>,
            <Option value="OFFLINE" key="OFFLINE">@离线</Option>
        ];
        const optionTwo = [
            <Option value="国内组网" key="国内组网">{"@国内组网"}</Option>,
            <Option value="全球组网" key="全球组网">{"@全球组网"}</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">{"@国内SaaS加速"}</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">{"@全球SaaS加速"}</Option>
        ];
        const optionThree = [
            <Option value="ONLINE" key="ONLINE">@在线</Option>,
            <Option value="INIT" key="INIT">@未激活</Option>,
            <Option value="OFFLINE" key="OFFLINE">@离线</Option>
        ];
        const optionFour = [
            <Option value="STEP" key="STEP">BCPE</Option>,
            <Option value="CSTEP" key="CSTEP">HCPE</Option>,
        ];
    return (
        <div>    
            <Row  gutter={16}>
                <Col className="statSect" span={24}>
                    <Card>
                        <Col className="statSect" span={24}>
                            <Select style={{width:230}} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder={this.state.location_name}>
                                {this.props.bi0001Info.companyListHeader.map( (item)=> {
                                    return (
                                        <Option key={item.id} onClick={()=>{this.changeId(item.id,item.name) }}>{item.name}</Option>
                                    )})
                                }
                            </Select>
                            <span className="Dropdown_span">({this.props.bi0001Info.companyInfo.status==="试用"?"@试用":this.props.bi0001Info.companyInfo.status==="正式"?"@正式":"@停用"})</span>
                        </Col>

                    </Card>
                </Col>
            </Row>
            <div style={this.state.changeTable? {display: "none"} : {display: "block"}}>
                <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                    <TabPane tab="@数据汇总" key="1" forceRender >
                    <Row className="Container" gutter={16}>
                        <Col className="statSect" span={8}>
                            <Card className="">
                                <Row><span className="BI0001_title">{"@总带宽"}</span><span className="BI0001_bandwidthTotal">{this.props.bi0001Info.bandwidthTotal}MB</span></Row>
                                <Divider className="BI0001_Divider"></Divider>
                                <Row className="link2" >
                                    <div className="BI0001_bandwidth"><img src={band_width_img1} alt=""/><span className="BI0001_span">{"@国内组网"}：</span><span className="BI0001_span2">{(this.props.bi0001Info.bandwidthStat["国内组网"?(this.props.bi0001Info.bandwidthStat["国内组网"]):"0"])}</span></div>
                                    <div className="BI0001_bandwidth"><img src={band_width_img2} alt=""/><span className="BI0001_span">{"@国内SaaS加速"}：</span><span className="BI0001_span2">{(this.props.bi0001Info.bandwidthStat["国内SaaS加速"?(this.props.bi0001Info.bandwidthStat["国内SaaS加速"]):"0"])}</span></div>
                                    <div className="BI0001_bandwidth"><img src={band_width_img3} alt=""/><span className="BI0001_span">{"@全球组网"}：</span><span className="BI0001_span2">{(this.props.bi0001Info.bandwidthStat["全球组网"?(this.props.bi0001Info.bandwidthStat["全球组网"]):"0"])}</span></div>
                                    <div className="BI0001_bandwidth"><img src={band_width_img4} alt=""/><span className="BI0001_span">{"@全球SaaS加速"}：</span><span className="BI0001_span2">{(this.props.bi0001Info.bandwidthStat["全球SaaS加速"?(this.props.bi0001Info.bandwidthStat["全球SaaS加速"]):"0"])}</span></div>


                                    {/* <Row className=""  gutter={0}>
                                    <Col className="BI0001_bandwidth" span={12}><img src={band_width_img1} alt=""/><span className="BI0001_span">{"@国内组网"}：</span><span className="BI0001_span2">{(this.props.bi0001Info.bandwidthStat["国内组网"?(this.props.bi0001Info.bandwidthStat["国内组网":"0"}</span></Col>
                                    <Col className="BI0001_bandwidth" span={12}><img src={band_width_img2} alt=""/><span className="BI0001_span">{"@国内SaaS加速"}：</span><span className="BI0001_span2">{(this.props.bi0001Info.bandwidthStat["国内SaaS加速"?(this.props.bi0001Info.bandwidthStat["国内SaaS加速":"0"}</span></Col>
                                    </Row>
                                    <Row className=""  gutter={0}>
                                    <Col className="BI0001_bandwidth" span={12}><img src={band_width_img3} alt=""/><span className="BI0001_span">{"@全球组网"}：</span><span className="BI0001_span2">{(this.props.bi0001Info.bandwidthStat["全球组网"?(this.props.bi0001Info.bandwidthStat["全球组网":"0"}</span></Col>
                                    <Col className="BI0001_bandwidth" span={12}><img src={band_width_img4} alt=""/><span className="BI0001_span">{"@全球SaaS加速"}：</span><span className="BI0001_span2">{(this.props.bi0001Info.bandwidthStat["全球SaaS加速"?(this.props.bi0001Info.bandwidthStat["全球SaaS加速":"0"}</span></Col>
                                    </Row> */}
                                </Row>
                            </Card>
                        </Col>
                        <Col className="statSect" span={8}><Card><Row ><span className="BI0001_title">{"@链路峰值负载率"}</span><span style={{textAlign:'right'}}>{moment().subtract(1,'day').format("YYYY-MM-DD")}</span></Row><Row><div id="link-stat-2" className="link"></div></Row></Card></Col>
                        <Col className="statSect" span={8}><Card><Row ><span className="BI0001_title">{"@链路带宽"}</span></Row><Row><div id="link-stat-3" className="link"></div></Row></Card></Col>
                    </Row>
                    <Row className="Container" gutter={16}>
                        <Col className="statSect" span={16}><Card><Row ><span className="BI0001_title">{"@设备流量"}TOP5(MB)</span><div className="BI0001_div"><span id="BI0001_div">@30分钟</span></div></Row><Row><div id="link-stat-7" className="link_l"></div><div id="tip" className="BI0001_tipname BI0001_hide"></div></Row></Card></Col>
                        <Col className="statSect" span={8}><Card><Row ><span className="BI0001_title">{"@设备型号"}</span></Row><Row><div id="link-stat-8" className="link_l"></div></Row></Card></Col>
                    </Row>
                    <Row className="bi0001Container" gutter={16}>
                        <Col className="statSect" span={8}><Card><Row ><span className="BI0001_title">{"@链路状态"}</span></Row><Row><div id="link-stat-4" className=" BI0001_link_stat_456"></div></Row></Card></Col>
                        <Col className="statSect" span={8}><Card><Row ><span className="BI0001_title">{"@设备状态"}</span></Row><Row><div id="link-stat-5" className=" BI0001_link_stat_456"></div></Row></Card></Col>
                        <Col className="statSect" span={8}><Card><Row ><span className="BI0001_title">{"@节点汇总"}</span></Row><Row><div id="link-stat-6" className=" BI0001_link_stat_456"></div></Row></Card></Col>
                    </Row>
                    </TabPane>
                    <TabPane tab={"@基本信息"} key="2" forceRender>
                        <Row className="Bi0001Container">
                            <BaseInfo id={this.state.id}/>
                        </Row>
                        <Card className="card">
                            <Tabs defaultActiveKey='1'>
                                <TabPane tab={'@联系人信息'} key="1">
                                    <ContactInfo id={this.state.id}/>
                                </TabPane>
                                <TabPane tab={'@合同'} key="2">
                                    <ContractInfo id={this.state.id}/>
                                </TabPane>

                            </Tabs>
                        </Card>
                    </TabPane>
                    <TabPane tab="@功能设置" key="3">
                        <Card className="card">
                            <SetupModal getLogo={this.get_logo} onRef={this.onRef} cancel={this.handleCloseSetupModal} editId={this.state.id}/>
                        </Card>
                    </TabPane>
                </Tabs>
            </div>
            <div style={this.state.changeTable2? {display: "block"} : {display: "none"}}>
                <div style = {{width:"100%",display:"flex",alignItems:"center"}} onClick={()=>{ this.setState((changeTable)=>(changeTable.changeTable=!changeTable.changeTable))}}><img src={upDown}  alt="" style={this.state.changeTable? {margin:"0 auto",transform: "rotate(180deg)"} : {margin:"0 auto"}}/></div>
                <Card className="card" id="targetTable">
                    <Tabs activeKey={this.state.activeKey} onChange={this.handleTabChange2}>
                        <TabPane tab={"@链路"} key="1" forceRender>
                        <HeaderBar 
                                    hasDelete={false} hasSelect={true} hasSelectTwo={true}
                                    hasSearch={true}
                                    selectPlaceHolder={'@请选择状态'} selectOneWidth={120} selectTwoWidth={140}
                                    selectThreeWidth={140} selectFourWidth={140}
                                    selectTwoPlaceHolder={"@请选择链路类型"}
                                    selectOneMethod={this.handleSelectStatus} selectTwoMethod={this.handleSelectType}
                                    optionsTwo={optionTwo} options={option} submit={this.handleSearchSubmit}
                                    selectOneDefaultValue={this.state.status}/>
                                    
                        <BossTableNew onRef1={this.onRef1} tabKey="1" pagination={pagination} columns={columns} dataSource={this.props.bi0001Info.dataSource}/>
                        </TabPane>
                        <TabPane tab={"@设备"} key="2" forceRender>
                            <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={true}
                               hasSearch={true} selectOneMethod={this.handleChangeStatus}
                               selectTwoMethod={this.handleSelectTypeTwo}
                               selectPlaceHolder={'@请选择状态'} submit={this.searchDevice} selectTwoPlaceHolder={"@请选择设备类型"}
                               options={optionThree} optionsTwo={optionFour}/>
                            <BossTableNew onRef2={this.onRef2}  tabKey="2" pagination={pagination} columns={columns2} dataSource={this.props.bi0001Info.deviceData}/>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        </div>
    )
    
}

    
}

export default withRouter(injectIntl(BI0001));

