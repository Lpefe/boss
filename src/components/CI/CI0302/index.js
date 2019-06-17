/*@客户-分时流量*/
import React from 'react';
import './index.scss';
import { Select, Tabs,Card,DatePicker} from 'antd';
import * as echarts from 'echarts'
import moment from "moment";
import AgencyFlowStat from "./subComponents/AgencyFlowStat";
import CustomAppFlowStat from "./subComponents/CustomAppFlowStat";
import {parse} from "../../../utils/commonUtilFunc";
import {chartColor} from "../../../utils/commonConsts";
import {injectIntl} from "react-intl";
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RangePicker=DatePicker.RangePicker;


class CI0302 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_tm: moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().format("YYYY-MM-DD HH:mm:ss"),
            timeInterval: "",
            data_num: 5,
            appName: "",
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
        // if(sessionStorage.getItem("role")==="company"||sessionStorage.getItem("role")==="companystaff"){
            this.histogramElA = echarts.init(document.getElementById("chartB"));

        // }else{
        //     this.histogramElA = echarts.init(document.getElementById("chartA"));
        // }
        this.getDataA();
        this.getDataB();
        this.getDataC();
    }

    componentDidUpdate() {
        //this.renderHistogramA(this.histogramElA, '@应用名称'); 
    }

    getDataA(){
        this.props.dispatch({
            type: "ci0302Info/getStatisticsA",
            payload: {
                item: "apprank",
                companyid:  this.companyid,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.data_num,
                counts:100
            }
        })
    }

    getDataB() {
        this.props.dispatch({
            type: "ci0302Info/getStatisticsB",
            payload: {
                item: "steps",
                companyid: this.companyid,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.data_num,
                counts:100
            }
        })
    }

    getDataC() {
        this.props.dispatch({
            type: "ci0302Info/getStatisticsC",
            payload: {
                item: "apprank",
                companyid:  this.companyid,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.data_num,
                defined: true,
                counts:100
            }
        })
    }

    renderHistogramA(el, yName) {
        let histogram = el;
        let option = {
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                name: "MB",
                axisTick:{show:false},
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle: {
                        color:"rgba(0,0,0,0.45)"
                    }
                },

            },
            yAxis: {
                inverse:true,
                type: 'category',
                data: this.props.ci0302Info.yNameA,
                name: yName,
                axisLabel: {
                    fontSize: 14,
                    align: "right",
                    formatter: function (params) {
                        let newParamsName = "";
                        let paramsNameNumber = params.length;
                        let provideNumber = 6;
                        let rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                        if (paramsNameNumber > provideNumber) {
                            for (let p = 0; p < rowNumber; p++) {
                                let tempStr = "";
                                let start = p * provideNumber;
                                let end = start + provideNumber;
                                if (p === rowNumber - 1) {
                                    tempStr = params.substring(start, paramsNameNumber);
                                } else {
                                    tempStr = params.substring(start, end) + "\n";
                                }
                                newParamsName += tempStr;
                            }
                        } else {
                            newParamsName = params;
                        }
                        return newParamsName
                    }
                },axisLine:{show:false},axisTick:{show:false}
            },
            grid: {
                x: 120
            },
            series: [
                {
                    type: 'bar',
                    data: this.props.ci0302Info.xDataA,
                    barMinHeight: 10,
                    barMaxWidth:32,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return chartColor[params.dataIndex % chartColor.length]
                            }
                        },
                        emphasis: {
                            color: "#5D9AE6",
                            label: {
                                color: "#5D9AE6"
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{c} MB',
                            color: "#E4E4E4"
                        },
                    },
                },]
        };
        histogram.setOption(option);
    }


    selectTimeIntervalA = (value) => {
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
        },  ()=> {
            this.getDataA();
            this.getDataB();
            this.getDataC();
        });
    };

    selectTimeRangeA = (dateValue) => {
        this.setState({
            start_tm: dateValue[0].format("YYYY-MM-DD HH:mm:ss"),
            end_tm: dateValue[1].format("YYYY-MM-DD HH:mm:ss"),
        }, ()=> {
            this.getDataA();
            this.getDataB();
            this.getDataC();
        });
    };

    selectDataNumA = (value) => {
        this.setState({
            data_num: value
        }, ()=> {
            this.getDataA();
            this.getDataB();
            this.getDataC();
        });
    };

    disabledDate=(current)=>{
        return (current.diff(this.state.start_tm, 'days') < -5) || (current.diff(this.state.start_tm, 'days') > 6)
    };
    handleRangeChange=(moment)=>{
        if(moment.length===1){
            this.setState({
                start_tm:moment[0].format("YYYY-MM-DD HH:mm:ss")
            })
        }else if(moment.length===2){
            this.setState({
                start_tm:moment[0].format("YYYY-MM-DD HH:mm:ss"),
                end_tm:moment[1].format("YYYY-MM-DD HH:mm:ss")
            },()=>{
                this.getDataA();
                this.getDataB();
                this.getDataC();
            })
        }
    };

    render() {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss'
        return (
            <Card className="card">
                <header style={{marginBottom:16}}>
                    <Select placeholder="@请选择时间间隔" style={{width: 200, marginRight: 8}} className="input"
                            onChange={this.selectTimeIntervalA} defaultValue="0">
                        <Option value="0">@最近30分钟</Option>
                        <Option value="1">@最近6小时</Option>
                        <Option value="2">@最近一天</Option>
                        <Option value="3">@最近一周</Option>
                    </Select>
                    <RangePicker 
                            style={{width:350,marginRight: 8}} showTime
                            value={[moment(this.state.start_tm, dateFormat), moment(this.state.end_tm, dateFormat)]}
                            disabledDate={this.disabledDate} onCalendarChange={this.handleRangeChange} />
                    <Select placeholder="@请选择数据条数" style={{width: 120, marginRight: 8}} className="input"
                            onChange={this.selectDataNumA} defaultValue="5">
                        <Option value="5">@5条</Option>
                        <Option value="10">@10条</Option>
                        <Option value="15">@15条</Option>
                        <Option value="20">@20条</Option>
                    </Select>
                </header>
                <section>
                    <Tabs defaultActiveKey="2" onChange={this.tabChange}>
                        <TabPane tab={'@边缘节点流量分析'} key="2">
                            <AgencyFlowStat start_tm={this.state.start_tm} end_tm={this.state.end_tm}
                                            data_num={this.state.data_num} companyid={this.companyid}/>
                        </TabPane>
                        <TabPane tab={'@自定义应用程序'} key="3">
                            <CustomAppFlowStat start_tm={this.state.start_tm} end_tm={this.state.end_tm}
                                               data_num={this.state.data_num} companyid={this.companyid}/>
                        </TabPane>
                    </Tabs>
                </section>
            </Card>
        )
    }
}

export default injectIntl(CI0302);