/*@客户-首页*/
import React from 'react';
import {Button, Card, Checkbox, Col, Radio, Row} from 'antd';
import {connect} from 'dva';
import worldMapData from '../../MapData/world';
import zoomChinaData from '../../MapData/zoomChina';
import * as echarts from 'echarts';
import './index.scss';
import CountUp from 'react-countup';
import {chartColor} from "../../../../../utils/commonConsts";
import {injectIntl} from 'react-intl';
import {withRouter} from "react-router-dom";
import {commonTranslate} from "../../../../MI/MI1902/subComponents/commonUtilFunc";

const RadioGrp = Radio.Group;
const RadioButton = Radio.Button;

class MapView extends React.Component {
    constructor(props) {
        super(props);
        let dashBoardWidth = document.body.clientWidth > 1366 ? document.body.clientWidth : 1366;
        let dashBoardHeight = document.body.clientHeight - 108;
        let ifMenuCollapse = !(localStorage.getItem("collapse") === null || localStorage.getItem("collapse") === "false");
        this.state = {
            //适配地图满屏显示,以及在窗口缩放时自动调整地图容器宽高
            mapWidth: 3 * (dashBoardWidth - (ifMenuCollapse ? 192 : 336)) / 4,
            mapHeight: dashBoardHeight - 92,
            tableWidth: (dashBoardWidth - 192) / 4 - 24,
            tableHeight: (dashBoardHeight - 64) / 3 - 70,
            tableHeightBar: 2 * ((document.body.clientHeight - 108) - 64) / 9 - 70,
            ifCityDisplay: false,
            dashBoardWidth: dashBoardWidth,
            dashBoardHeight: dashBoardHeight,
        };
    }

    componentDidMount() {
        let vm = this;
        setTimeout(function () {
            vm.get_stat();
            vm.get_city_stat();
            vm.get_redis_alarm_stat();
        }, 0);
        echarts.registerMap('world', worldMapData);
        echarts.registerMap('china', zoomChinaData);
        this.map = echarts.init(document.getElementById("map"));
        this.linkStat = echarts.init(document.getElementById("link-stat-map"));
        this.stepDeviceStat = echarts.init(document.getElementById("device-stat-map"));
        this.nodesStat = echarts.init(document.getElementById("nodes-stat"));
        window.addEventListener('resize', this.onWindowResize)
    }

    componentDidUpdate() {
        let stat = this.props.ci0801Info;
        this.renderMap(this.map);
        this.renderChart(this.linkStat, "@链路状态统计", stat.linkStat.data, stat.linkStat.legend);
        this.renderChart(this.stepDeviceStat, "@step设备状态统计", stat.deviceStat.data, stat.deviceStat.legend);
        this.renderBar(this.nodesStat, stat.agencyStat);
    }

    get_stat = () => {
        this.props.dispatch({
            type: "ci0801Info/get_stat",
            payload: {
                company_id: (sessionStorage.getItem("companyId")) || '',
            }
        })
    };

    get_agency_stat = () => {
        this.props.dispatch({
            type: "ci0801Info/get_agency_stat",
            payload: {
                company_id: (sessionStorage.getItem("companyId")) || ''
            }
        })
    };

    get_city_stat = () => {
        const __=commonTranslate(this);
        this.props.dispatch({
            type: "ci0801Info/get_city_stat",
            payload: {
                company_id: (sessionStorage.getItem("companyId")) || '',
                translate:__
            }
        })
    };

    get_redis_alarm_stat = () => {
        this.props.dispatch({
            type: "ci0801Info/get_redis_alarm_stat",
            payload: {
                company_id: (sessionStorage.getItem("companyId")) || ''
            }
        })
    };

    onWindowResize = () => {
        let vm = this;
        let ifMenuCollapse = !(localStorage.getItem("collapse") === null || localStorage.getItem("collapse") === "false");
        //在窗口缩放时自动调整地图容器宽高
        this.setState({
            dashBoardWidth: document.body.clientWidth - 200,
            dashBoardHeight: document.body.clientHeight - 108,
            mapWidth: 3 * ((document.body.clientWidth > 1366 ? document.body.clientWidth : 1366) - (ifMenuCollapse ? 192 : 336)) / 4,
            mapHeight: (document.body.clientHeight - 108) - 92,
            tableWidth: ((document.body.clientWidth > 1366 ? document.body.clientWidth : 1366) - 216) / 4 - 24,
            tableHeight: ((document.body.clientHeight - 108) - 64) / 3 - 70,
            tableHeightBar: 2 * ((document.body.clientHeight - 108) - 64) / 9 - 70,
        }, function () {
            let stat = vm.props.ci0801Info;
            vm.renderMap(vm.map);
            vm.renderChart(vm.linkStat, "@链路统计", stat.linkStat.data, stat.linkStat.legend);
            vm.renderChart(vm.stepDeviceStat, "@设备统计", stat.deviceStat.data, stat.deviceStat.legend);
            vm.renderBar(vm.nodesStat, stat.agencyStat);
        });

    };

    handleCityDisplayMode = (e) => {
        this.setState({
            ifCityDisplay: e.target.checked
        })
    };

    renderBar = (el, data) => {
        let option = {
            xAxis: {
                show: false,
                max: (data.data ? data.data[0].value : 0 + data.data ? data.data[1].value : 0) * 2,
                axisTick: {show: false},
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "rgba(0,0,0,0.45)"
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: ["@边缘节点", "@中心节点"],
                axisLabel: {
                    show: true, //让Y轴数据不显示
                },
                axisTick: {
                    show: false, //隐藏Y轴刻度
                },
                axisLine: {
                    show: false, //隐藏Y轴线段
                },
                inverse:true,
            },
            grid: {
                id: "chart",
                left: "25%",
                top: "1%",
                height: this.state.tableHeightBar
            },
            color: chartColor,
            series: [
                {
                    show: true,
                    type: 'bar',
                    barGap: "60%",
                    barMinHeight: "5",
                    barMaxWidth: 32,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                const colorMap = {
                                    "1": "#2772A3",
                                    "0": "#47CACA"
                                };
                                return colorMap[params.dataIndex]
                            }
                        },
                    },
                    data: [data.data ? data.data[0].value : 0, data.data ? data.data[1].value : 0]
                }]
        };
        el.resize({width: this.state.tableWidth - 32, height: this.state.tableHeightBar});
        el.setOption(option);
    };

    renderChart = (el, title, data) => {
        let option = {
            title: {
                show: false
            },
            color: function (params) {
                const colorMap = {
                    "@未激活": "#FFD02D",
                    "@在线": "#3B9FF7",
                    "@离线": "#FF395C",
                    "@暂无数据":"#CBCBCB"
                };
                return colorMap[params.name]
            },
            series: [
                {
                    name: "",
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ["50%", "60%"],
                    label: {
                        normal: {
                            formatter: function (data) {
                                if(data.data.name==="@暂无数据"){
                                    return data.data.name
                                }
                                return data.data.name + "\n" + data.data.value
                            },
                            color: "#000",
                            fontSize: 12,
                            position: data.length>0?(data[0].name==="@暂无数据"?"center":"outside"):""
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 1.5,
                            borderColor: '#ffffff',
                        },
                    },
                    data: data,
                }
            ]
        };
        el.resize({width: this.state.tableWidth - 32, height: this.state.tableHeight})
        el.setOption(option);
    };


    renderMap = (el) => {
        let option = {
            title: {
                text: "",
            },
            tooltip: {
                trigger: "item"
            },
            grid: {
                top: '10%',
            },
            geo: {
                show: true,
                map: !this.props.ci0801Info.ifDomestic ? 'world' : 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    areaColor: "#B5D4EF",
                    borderColor: "#fff",
                    borderWidth: 1
                },
                emphasis: {
                    itemStyle: {
                        areaColor:"#B5D4EF",
                        borderColor: "#fff",
                        borderWidth: 1
                    }
                },
                silent: true,
                roam: true,
                layoutCenter: ['50%', '50%'],
                layoutSize: "150%",
                zoom: !this.props.ci0801Info.ifDomestic ? 1 : 4,
                center: !this.props.ci0801Info.ifDomestic ? null : [96, 36]//切换地图至中国中心经纬度
            },
            series: [{
                name: 'node',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: this.props.ci0801Info.nodeData,
                symbolSize: 10,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: this.state.ifCityDisplay
                    },
                    emphasis: {
                        show: true
                    }
                },
                rippleEffect: {
                    period: 4,
                    brushType: "stroke",
                    scale: 2
                },
            }, {
                name: '@在线',
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 2,
                large: true,
                effect: {
                    show: true,
                    constantSpeed: 30,
                    symbol: 'circle',
                    symbolSize: 6,
                    trailLength: 0,
                },
                lineStyle: {
                    normal: {
                        color: "#3B9FF7",
                        width: 3,
                        opacity: 0.5,
                        curveness: 0.1,
                    }
                },
                data: this.props.ci0801Info.linkDataOnline
            }, {
                name: '@未激活',
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 2,
                large: true,
                effect: {
                    show: true,
                    constantSpeed: 30,
                    symbol: 'circle',
                    symbolSize: 6,
                    trailLength: 0,
                },
                lineStyle: {
                    normal: {
                        color: "#FFD02D",
                        width: 3,
                        opacity: 0.5,
                        curveness: 0.2,
                    }
                },
                data: this.props.ci0801Info.linkDataInit
            }, {
                name: '@离线',
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 2,
                large: true,
                label: {
                    show: true
                },
                effect: {
                    show: true,
                    constantSpeed: 30,
                    symbol: 'circle',
                    symbolSize: 6,
                    trailLength: 0,
                },
                lineStyle: {
                    normal: {
                        color: "#FF395C",
                        width: 3,
                        opacity: 0.5,
                        curveness: 0.3,
                    }
                },
                data: this.props.ci0801Info.linkDataOffline
            }]
        };
        el.resize({width: this.state.mapWidth, height: this.state.mapHeight});
        el.setOption(option);

    };

    goto_alarm_info = (alarm_level) => {
        this.props.history.push("/main/ci2501?alarm_level=" + alarm_level + "&from=dashboard")
    };
    handleChangeMapView = (e) => {
        this.props.dispatch({
            type: "ci0801Info/changeMapView",
            payload: {
                ifDomestic: e.target.value
            }
        })
    };

    render() {
        return <div>
            <Row gutter={{xs: 16, sm: 16, md: 16, lg: 16}}>
                <Col span={18}>
                    <Card className="card" style={{height: this.state.dashBoardHeight}}>
                        <div className="table-chart-header">
                            <span
                                className="head-sub-title">@总带宽:</span>&nbsp;&nbsp;
                            <span
                                className="head-sub-value"><CountUp className="head-sub-value" start={0}
                                                                    end={this.props.ci0801Info.bandwidthTotal}
                                                                    suffix="M"/></span>
                            <span
                                className="head-sub-title">@国内组网:</span>&nbsp;&nbsp;
                            <span
                                className="head-sub-value"><CountUp className="head-sub-value" start={0}
                                                                    end={this.props.ci0801Info.bandwidthStat["国内组网"] || 0}
                                                                    suffix="M"/></span>
                            <span
                                className="head-sub-title">@全球组网:</span>&nbsp;&nbsp;
                            <span
                                className="head-sub-value"><CountUp className="head-sub-value" start={0}
                                                                    end={this.props.ci0801Info.bandwidthStat["全球组网"] || 0}
                                                                    suffix="M"/></span>
                            <span
                                className="head-sub-title">@全球SaaS加速:</span>&nbsp;&nbsp;
                            <span
                                className="head-sub-value"><CountUp className="head-sub-value" start={0}
                                                                    end={this.props.ci0801Info.bandwidthStat["全球SaaS加速"] || 0}
                                                                    suffix="M"/></span>
                           {/* <span
                                className="head-sub-title"><FormattedMessage {...messages.domesticSaas}/>:</span>&nbsp;&nbsp;*/}
                            {/*<span
                                className="head-sub-value"><CountUp className="head-sub-value" start={0}
                                                                    end={this.props.ci0801Info.bandwidthStat["国内SaaS加速"] || 0}
                                                                    suffix="M"/></span>*/}
                            <span className="switch"
                                  onClick={() => this.props.switch("table")}>
                                <Button icon="swap" size="small">@表格</Button>
                            </span>
                        </div>
                        <div id="map"/>
                        <RadioGrp size="small" buttonStyle="solid" style={{marginRight: 8}}
                                  value={this.props.ci0801Info.ifDomestic} onChange={this.handleChangeMapView}>
                            <RadioButton value={false}>@全球</RadioButton>
                            <RadioButton value={true}>@中国</RadioButton>
                        </RadioGrp>
                        <Checkbox
                            onChange={this.handleCityDisplayMode}>@城市</Checkbox>
                    </Card>
                </Col>
                <Col span={6} className="right-section">
                    {/* <Card className="sub-section card"
                          style={{marginBottom: 16, height: ((this.state.dashBoardHeight - 48) / 9)}} bodyStyle={{
                        padding: "0 24px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row"
                    }}>
                        <div id="leftbox" className="alarm-section" style={{
                            height: ((this.state.dashBoardHeight - 48) / 9),
                            lineHeight: ((this.state.dashBoardHeight - 48) / 9) + 'px'
                        }} onClick={() => this.goto_alarm_info('Warning')}>
                            <img src={warningIcon} alt="" className="warning-icon"/>
                            <div className="alarm-section-content">
                                <div
                                    id="leftbox-left">{this.props.ci0801Info.alarmStat.device.Warning || 0 + this.props.ci0801Info.alarmStat.link.Warning || 0}</div>
                                <div id="leftbox-right">Warning</div>
                            </div>
                        </div>
                        <div id="rightbox" className="alarm-section" style={{
                            height: ((this.state.dashBoardHeight - 48) / 9),
                            lineHeight: ((this.state.dashBoardHeight - 48) / 9) + 'px'
                        }} onClick={() => this.goto_alarm_info("Critical")}>
                            <img src={criticalIcon} alt="" className="critical-icon"/>
                            <div className="alarm-section-content">
                                <div
                                    id="rightbox-left">{this.props.ci0801Info.alarmStat.device.Critical || 0 + this.props.ci0801Info.alarmStat.link.Critical || 0}</div>
                                <div id="rightbox-right">Critical</div>
                            </div>
                        </div>
                    </Card> */}
                    <Card className="sub-section card"
                          style={{marginBottom: 16, height: ((this.state.dashBoardHeight - 48) / 3)}}
                          bodyStyle={{padding: 16}}>
                        <h3 style={{marginBottom:10}}>
                            <div className="front-dec"/>
                            &nbsp;&nbsp;
                            {"@设备统计"}&nbsp;&nbsp;{this.props.ci0801Info.deviceSum}
                        </h3>
                        <div id="device-stat-map"
                             style={{
                                 width: this.state.tableWidth,
                                 height: ((this.state.dashBoardHeight - 48) / 3 - 86)
                             }}/>
                    </Card>
                    <Card className="sub-section card"
                          style={{marginBottom: 16, height: ((this.state.dashBoardHeight - 48) / 3)}}
                          bodyStyle={{padding: 16}}>
                        <h3 style={{marginBottom:10}}>
                            <div className="front-dec"/>
                            &nbsp;&nbsp;
                            {"@链路统计"}&nbsp;&nbsp;{this.props.ci0801Info.linkSum}</h3>
                        <div id="link-stat-map" style={{
                            width: this.state.tableWidth,
                            height: ((this.state.dashBoardHeight - 48) / 3 - 86)
                        }}/>
                    </Card>
                    <Card className="sub-section-last "
                          style={{
                            //marginBottom: 16, 
                            // height: 2 * ((this.state.dashBoardHeight - 48) / 9)
                            borderRadius: "5px",
                            height: ((this.state.dashBoardHeight - 48) / 3 +16)
                        }}
                          bodyStyle={{padding: 16}}>
                        <h3>
                            <div className="front-dec"/>
                            &nbsp;&nbsp;
                            {"@节点汇总"}&nbsp;&nbsp;{this.props.ci0801Info.agencySum}</h3>
                        <div id="nodes-stat" style={{
                            width: this.state.tableWidth,
                            height: (2 * (this.state.dashBoardHeight - 48) / 9 - 86)
                        }}/>
                    </Card>
                </Col>
            </Row>
        </div>
    }
}

function mapDispatchToProps({ci0801Info}) {
    return {ci0801Info};
}

export default connect(mapDispatchToProps)(withRouter(injectIntl(MapView)));