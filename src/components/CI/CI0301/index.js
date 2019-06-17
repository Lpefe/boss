import React from 'react';
import './index.scss';
import {Select, Tabs, Card} from 'antd';
import * as echarts from 'echarts'
import moment from "moment";
import AgencyFlowStat from "./subComponents/AgencyFlowStat";
import AppFlowStat from "./subComponents/AppFlowStat";
import CustomAppFlowStat from "./subComponents/CustomAppFlowStat";
import {parse} from '../../../utils/commonUtilFunc';
import {chartColor} from "../../../utils/commonConsts";
import {injectIntl} from "react-intl";
const Option = Select.Option;
const TabPane = Tabs.TabPane;


class CI0301 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_tm: moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().format("YYYY-MM-DD HH:mm:ss"),
            timeInterval: "",
            data_num: 5,
            appName: "",
            tabSelected: "1"
        };
        let companyid = "";
        if (parse(this.props.location.search).id) {
            companyid = parse(this.props.location.search).id
        } else {
            companyid = sessionStorage.getItem("companyId")
        }
        this.companyid = companyid;

    }

    componentDidMount() {
        this.histogramElA = echarts.init(document.getElementById("chartA"));
        this.renderBandLine(this.histogramElA, "带宽(Mbps)");
        this.getDataA();
    }

    componentDidUpdate() {
        this.renderBandLine(this.histogramElA, "带宽(Mbps)");
    }

    getDataA() {
        this.props.dispatch({
            type: "ci0301Info/getStatisticsA",
            payload: {
                item: "appBand",
                companyid: this.companyid,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.data_num,
            }
        })
    }

    getDataB() {
        this.props.dispatch({
            type: "ci0301Info/getStatisticsB",
            payload: {
                item: "steps",
                companyid: this.companyid,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.data_num,
            }
        })
    }

    getDataC() {
        this.props.dispatch({
            type: "ci0301Info/getStatisticsC",
            payload: {
                item: "appBand",
                companyid: this.companyid,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.data_num,
                defined: true,
            }
        })
    }


    renderBandLine(el) {
        const __ = this.props.intl.formatMessage;
        let histogram = el;
        histogram.clear();
        let option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: "#333",
                extraCssText: 'box-shadow: 0 2px 2px 0 rgba(24,24,24,0.60);border-radius: 2px 2px 0 0 0 2px 2px;',
                formatter: function (data) {
                    let res = '';
                    for (let i = 0; i < data.length; i++) {
                        res += ('<tr><td><span style="font-size:32px;color:'+data[i].color+'">&middot;</span>' + data[i].seriesName + '</td><td>' + data[i].data[1] + '<td/><td>'+data[i].data[0]+'</td></tr>')
                    }
                    return '<div class="line-tooltip"><table class="line-tooltip-table" style="border-bottom: none">'+res+'<table/></div>'
                }
            },
            grid: {
                bottom: '20%',
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
                min: this.state.start_tm,
                max: this.state.end_tm,
                axisTick: {
                    show: false
                },
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle: {
                        color:"rgba(0,0,0,0.45)"
                    }
                }
            },
            legend: {
                left: "center",
                bottom: 0,
                icon: "circle"
            },
            yAxis: [{
                type: 'value',
                name: '@速率'+"(Mbps)",
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }],
            series: this.props.ci0301Info.lineSeriesA,
            color: chartColor,
        };
        histogram.setOption(option);
    }


    selectTimeInterval = (value) => {
        let start_tm_temp = "";
        let end_tm_temp = moment().format("YYYY-MM-DD HH:mm:ss");
        switch (value) {
            case "0":
                start_tm_temp = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "1":
                start_tm_temp = moment().subtract(6, "hours").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "2":
                start_tm_temp = moment().subtract(24, "hours").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "3":
                start_tm_temp = moment().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "4":
                start_tm_temp = moment().subtract(1, "months").format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm_temp = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
        }
        this.setState({
            start_tm: start_tm_temp,
            end_tm: end_tm_temp,
        }, function () {
            switch (this.state.tabSelected) {
                case "1":
                    this.getDataA();
                    break;
                case "2":
                    this.getDataB();
                    break;
                case "3":
                    this.getDataC();
                    break;
                default:
                    break;
            }
        });
    };

    selectTimeRange = (dateValue) => {
        this.setState({
            start_tm: dateValue[0].format("YYYY-MM-DD HH:mm:ss"),
            end_tm: dateValue[1].format("YYYY-MM-DD HH:mm:ss"),
        }, function () {
            switch (this.state.tabSelected) {
                case "1":
                    this.getDataA();
                    break;
                case "2":
                    this.getDataB();
                    break;
                case "3":
                    this.getDataC();
                    break;
                default:
                    break;
            }
        });
    };

    selectDataNum = (value) => {
        this.setState({
            data_num: value
        }, function () {
            switch (this.state.tabSelected) {
                case "1":
                    this.getDataA();
                    break;
                case "2":
                    this.getDataB();
                    break;
                case "3":
                    this.getDataC();
                    break;
                default:
                    break;
            }
        });
    };
    tabChange = (activeKey) => {
        switch (activeKey) {
            case "1":
                this.getDataA();
                this.setState({
                    tabSelected: "1"
                });
                break;
            case "2":
                this.getDataB();
                this.setState({
                    tabSelected: "2"
                });
                break;
            case "3":
                this.getDataC();
                this.setState({
                    tabSelected: "3"
                });
                break;
            default:
                break;
        }
    };

    render() {
        const __ = this.props.intl.formatMessage;
        return (
            <div>
                <Card className="card">
                    <header>
                        <Select placeholder={"@请选择时间间隔"} style={{width: 200, marginRight: 8}} className="input"
                                onChange={this.selectTimeInterval} defaultValue="0">
                            <Option value="0" key="0">@最近30分钟</Option>
                            <Option value="1" key="1">@最近6小时</Option>
                            <Option value="2" key="2">@最近一天</Option>
                            <Option value="3" key="3">@最近一周</Option>
                        </Select>
                        <Select placeholder={"@请选择数据条数"} style={{width: 120, marginRight: 8}} className="input"
                                onChange={this.selectDataNum} defaultValue="5">
                            <Option value="5">@5条</Option>
                            <Option value="10">@10条</Option>
                            <Option value="15">@15条</Option>
                            <Option value="20">@20条</Option>
                        </Select>
                    </header>
                    {/* <RangePicker style={{marginRight: 8}} onChange={this.selectTimeRange} showTime
                                 format="YYYY-MM-DD HH:mm:ss"
                                 value={[moment(this.state.start_tm), moment(this.state.end_tm)]}/>*/}
                    <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                        <TabPane tab={"@中心节点"} key="1">
                            <AppFlowStat start_tm={this.state.start_tm} end_tm={this.state.end_tm}
                                         data_num={this.state.data_num} companyid={this.companyid}/>
                        </TabPane>
                        <TabPane tab={"@边缘节点"} key="2">
                            <AgencyFlowStat start_tm={this.state.start_tm} end_tm={this.state.end_tm}
                                            data_num={this.state.data_num} companyid={this.companyid}/>
                        </TabPane>
                        <TabPane tab={"@自定义"} key="3">
                            <CustomAppFlowStat start_tm={this.state.start_tm} end_tm={this.state.end_tm}
                                               data_num={this.state.data_num} companyid={this.companyid}/>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        )
    }
}

export default injectIntl(CI0301);