/*@运维-运维首页*/
import React from 'react';
import {Card, Col, Row} from 'antd';
import BossTable from "../../Common/BossTable";
import "./Index.scss";
import * as echarts from "echarts";
import warningIcon from "../../../assets/img/warning-icon.png";
import criticalIcon from "../../../assets/img/critical-icon.png";
import {MomentFormatter} from "../../../utils/commonUtilFunc";
import {chartColor} from "../../../utils/commonConsts";
import {Link,withRouter} from 'react-router-dom';
import moment from 'moment';
import {injectIntl} from "react-intl";

class MI0001C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {
        this.linkStatPie = echarts.init(document.getElementById("link-stat-pie"));
        this.linkBandwidthBar = echarts.init(document.getElementById("link-bandwidth-bar"));
        this.linkLoadBar = echarts.init(document.getElementById("link-load-bar"));
        this.deviceStatPie = echarts.init(document.getElementById("device-stat-pie"));
        this.deviceTypeBar = echarts.init(document.getElementById("device-type-bar"));
        this.deviceModelBar = echarts.init(document.getElementById("device-model-bar"));
        this.linkStatPie.on('click', (params) => {
            this.props.history.push("/main/mi0501?status=" + params.name)
        });
        this.linkBandwidthBar.on('click', (params) => {
            let bandwidthMap = {
                "<10": "0,10",
                "10-50": "10,50",
                "50-100": "50,100",
                ">=100": "100,"
            };
            this.props.history.push("/main/mi0501?bandwidth=" + bandwidthMap[params.name])
        });
        this.linkLoadBar.on('click', (params) => {
            this.props.history.push("/main/mi1401?range=" + params.name)
        });
        this.deviceStatPie.on('click', (params) => {
            this.props.history.push("/main/mi0101?status=" + params.name)
        });
        this.deviceTypeBar.on('click', (params) => {
            if (params.name === "TWS") {
                this.props.history.push("/main/mi0601")
            } else {
                this.props.history.push("/main/mi0101?type=" + params.name)
            }
        });
        this.deviceModelBar.on('click', (params) => {
            this.props.history.push("/main/mi0101?model=" + params.name)
        });
        window.addEventListener('resize', this.onWindowResize);
        this.get_device_stat();
        this.get_link_stat();
        this.get_band_load_all();
        this.get_bandwidth_stat_all();
        this.get_device_model_stat();
        this.get_device_type_stat();
        this.get_stock_stat();
        this.get_redis_alarm_stat()
    }

    componentDidUpdate() {
        this.renderChart();
    }

    onWindowResize = () => {
        this.renderChart();
    };

    renderChart = () => {
        this.renderBar(this.linkBandwidthBar, "horizontal", this.props.mi0001Info.band_stat, '#719AFA', "@链路带宽","",true,"M","@数量");
        this.renderBar(this.linkLoadBar, "horizontal", this.props.mi0001Info.load_stat, "#728CDB", "@链路峰值负载率", "@时间" + ":" + MomentFormatter(moment().subtract(1, 'day'), "YYYY-MM-DD"),true,"%",'@数量');
        this.renderBar(this.deviceTypeBar, "vertical", this.props.mi0001Info.device_type_stat, "#6994A7", "@设备类型");
        this.renderPie(this.linkStatPie, "@链路状态", this.props.mi0001Info.link_stat, false,false);
        this.renderPie(this.deviceStatPie, "@设备状态", this.props.mi0001Info.device_stat, false,false);
        this.renderPie(this.deviceModelBar, "@设备型号", this.props.mi0001Info.device_model_stat, true,true);
    };


    //get data

    get_redis_alarm_stat = () => {
        this.props.dispatch({
            type: "mi0001Info/get_redis_alarm_stat",
            payload: {}
        })
    };
    get_link_stat = () => {
        this.props.dispatch({
            type: "mi0001Info/get_link_stat",
            payload: {}
        })
    };

    get_device_stat = () => {
        this.props.dispatch({
            type: "mi0001Info/get_device_stat",
            payload: {}
        })
    };

    get_band_load_all = () => {
        this.props.dispatch({
            type: "mi0001Info/get_band_load_all",
            payload: {
                start_tm: MomentFormatter(moment().subtract(1, 'day'), 'YYYY-MM-DD 00:00:00'),
                end_tm: MomentFormatter(moment().subtract(1, 'day'), 'YYYY-MM-DD 23:59:59'),
                company_status: "正式,试用",
                order: 'top'
            }
        })
    };

    get_bandwidth_stat_all = () => {
        this.props.dispatch({
            type: "mi0001Info/get_bandwidth_stat_all",
            payload: {}
        })
    };
    get_device_type_stat = () => {
        this.props.dispatch({
            type: "mi0001Info/get_device_type_stat",
            payload: {}
        })
    };
    get_device_model_stat = () => {
        this.props.dispatch({
            type: "mi0001Info/get_device_model_stat",
            payload: {}
        })
    };

    get_stock_stat = () => {
        this.props.dispatch({
            type: "mi0001Info/get_stock_stat",
            payload: {
                status: "IN"
            }
        })
    };


    renderBar = (el, type, data, color, title, subTitle,ySplitLine,unit,yUnit) => {
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
                    interval: 0
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
                }(),
                name:unit||""
            },
            yAxis: {
                minInterval:1,
                //inverse:true,
                type: type === "horizontal" ? "value" : "category",
                axisLabel: {
                    show: true,
                    //让Y轴数据不显示
                },
                axisTick: {
                    show: false, //隐藏Y轴刻度
                },
                axisLine: {
                    show: false, //隐藏Y轴线段
                },
                splitLine: {
                    show: ySplitLine
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
                }(),
                name:yUnit||""
            },
            grid: {
                id: "chart",
                left: "15%",
                top: "30%",
                right: "10%"
            },
            color: chartColor,
            series: [
                {
                    show: true,
                    type: 'bar',
                    barCategoryGap: "50px",
                    barMinHeight: 10,
                    barMaxWidth:32,
                    barWidth: "70%",
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

    renderPie = (el, title, data, ifSolid,showContent) => {
        let option = {
            title: {
                text: title
            },
            color: function (params) {
                const statusArr = ["未激活", "在线", "离线"];
                const colorMap = {
                    "未激活": "#FFD02D",
                    "在线": "#3B9FF7",
                    "离线": "#FF395C"
                };
                return statusArr.indexOf(params.name) > -1 ? colorMap[params.name] : chartColor[params.dataIndex % chartColor.length]
            },
            tooltip :{                                      
                trigger: 'item',           
                triggerOn:"mousemove",     
                showContent:showContent,                      
                alwaysShowContent:false,  
                showDelay:0,                                  
                hideDelay:100,        
                enterable:false,    
                confine:false,               
                transitionDuration:0.4,                      
                backgroundColor:"rgba(38,38,38,0.6)",            
                borderColor:"#ccc",                       
                borderWidth:0,                             
            },
            legend: {
                type:"scroll",
                orient: 'vertical',
                right: 20,
                top: 'middle',
                itemGap: 24,
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
                    radius: ifSolid ? ['0', '55%'] : ['40%', '55%'],
                    center: ifSolid ? ["20%", "50%"]:["30%", "50%"],
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

    render() {
        const stockStatColumns = [];
        for(let key in this.props.mi0001Info.stock_stat[0]){
            stockStatColumns.push({
                title:key==="title"?"":key==="total"?"@合计":key,
                dataIndex:key,
                key:key
            })
        }
        const alarmStat = this.props.mi0001Info.alarmStat;
        return (
            <div>
                {/* <Card bodyStyle={{height: 114}}>
                    <Row gutter={32}>
                        <Col span={12}>
                            <div style={{borderRight: "1px solid rgba(216,216,216,0.60)"}}>
                                <Row>
                                    <Col span={8}>
                                        <Link to={{
                                            pathname: "/main/mi1801",
                                            search: "?alarm_type=link"
                                        }}>
                                            <div className="alert-label">{"@链路警告"}</div>
                                        </Link>
                                    </Col>
                                    <Col span={8}>
                                        <Link to={{
                                            pathname: "/main/mi1801",
                                            search: "?alarm_type=link&alarm_level=Warning&from=dashboard"
                                        }}>
                                            <div className="alert-count-container">
                                                <img src={warningIcon} alt="" className="img"/><span
                                                className="title">Warning</span><span
                                                className="count">{alarmStat.link.Warning}</span>
                                            </div>
                                        </Link>
                                    </Col>
                                    <Col span={8}>
                                        <Link to={{
                                            pathname: "/main/mi1801",
                                            search: "?alarm_type=link&alarm_level=Critical&from=dashboard"
                                        }}>
                                            <div className="alert-count-container">
                                                <img src={criticalIcon} alt="" className="img"/> <span
                                                className="title">Critical</span><span
                                                className="count">{alarmStat.link.Critical}</span>
                                            </div>
                                        </Link>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Col span={8}>
                                    <Link to={{
                                        pathname: "/main/mi1801",
                                        search: "?alarm_type=device"
                                    }}>
                                        <div className="alert-label">{"@设备警告"}</div>
                                    </Link>
                                </Col>
                                <Col span={8}>
                                    <Link to={{
                                        pathname: "/main/mi1801",
                                        search: "?alarm_type=device&alarm_level=Warning&from=dashboard"
                                    }}>
                                        <div className="alert-count-container">
                                            <img src={warningIcon} alt="" className="img"/><span
                                            className="title">Warning</span><span
                                            className="count">{alarmStat.device.Warning}</span>
                                        </div>
                                    </Link>
                                </Col>
                                <Col span={8}>
                                    <Link to={{
                                        pathname: "/main/mi1801",
                                        search: "?alarm_type=device&alarm_level=Critical&from=dashboard"
                                    }}>
                                        <div className="alert-count-container">
                                            <img src={criticalIcon} alt="" className="img"/><span
                                            className="title">Critical</span><span
                                            className="count">{alarmStat.device.Critical}</span>
                                        </div>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card> */}
                <Row gutter={8} style={{marginTop: 16}}>
                    <Col span={7}>
                        <Card>
                            <div id="link-stat-pie" className="MI0001-chart-container"/>
                        </Card>
                    </Col>
                    <Col span={7}>
                        <Card>
                            <div id="link-bandwidth-bar" className="MI0001-chart-container"/>
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card>
                            <div id="link-load-bar" className="MI0001-chart-container"/>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={8} style={{marginTop: 16}}>
                    <Col span={7}>
                        <Card>
                            <div id="device-stat-pie" className="MI0001-chart-container"/>
                        </Card>
                    </Col>
                    <Col span={7}>
                        <Card>
                            <div id="device-type-bar" className="MI0001-chart-container"/>
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card>
                            <div id="device-model-bar" className="MI0001-chart-container"/>
                        </Card>
                    </Col>
                </Row>
                <Card style={{marginTop: 16}}>
                    <div className="device-stock-title">{"@设备库存"}</div>
                    <BossTable columns={stockStatColumns} dataSource={this.props.mi0001Info.stock_stat} pagination={false}/>
                </Card>
            </div>
        )
    }
}

export default withRouter(injectIntl(MI0001C));