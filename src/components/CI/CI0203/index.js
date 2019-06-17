import React from 'react';
import './index.scss';
import {Select,Card} from 'antd';
import * as echarts from 'echarts'
import {parse} from '../../../utils/commonUtilFunc';
import moment from 'moment';
const Option = Select.Option;

class CI0203 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_tm: moment().subtract(30, 'minute').format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().format("YYYY-MM-DD HH:mm:ss")
        };
        this.tid = parse(this.props.location.search).id;
        this.isBusiness = sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin"
    }

    componentDidMount() {
        this.getMultiBandData();
        this.getRttData();
        this.firstChart = echarts.init(document.getElementById("firstChart"));
        this.secondChart = echarts.init(document.getElementById("secondChart"));
    };

    componentDidUpdate() {
        let vm = this;
        setTimeout(function () {
            vm.renderChart(vm.firstChart, vm.props.ci0203Info.multiBandData, "速率", "(Mbps)");
            vm.renderChart(vm.secondChart, vm.props.ci0203Info.rttData, "网络延时", "(ms)")
        }, 0)
        console.log("s")

    }

    getMultiBandData = () => {
        this.props.dispatch({
            type: "ci0203Info/get_multi_band",
            payload: {
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                companyid: this.isBusiness ? parse(this.props.location.search).company_id : sessionStorage.getItem("companyId"),
                tid: this.tid,
                bandwidth: parse(this.props.location.search).bandwidth
            }
        })
    };

    getRttData = () => {
        this.props.dispatch({
            type: "ci0203Info/get_rtt_data",
            payload: {
                item: "tunnel_rtt",
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                tid: this.tid,
                companyid: this.isBusiness ? parse(this.props.location.search).company_id : sessionStorage.getItem("companyId"),
            }
        })
    };

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
        }, ()=> {
            this.getMultiBandData();
            this.getRttData();
        });
    };

    selectTimeRange = (dateValue) => {
        this.setState({
            start_tm: dateValue[0].format("YYYY-MM-DD HH:mm:ss"),
            end_tm: dateValue[1].format("YYYY-MM-DD HH:mm:ss"),
        }, ()=> {
            this.getMultiBandData();
            this.getRttData();
        });
    };


    renderChart = (el, dataSource, title, yUnit) => {
        let option = {
            title: {
                text: ""
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: "#333",
                formatter: function (data) {
                    let res = '';
                    for (let i = 0; i < data.length; i++) {

                        res += ('<li class="trigger-item" style="color:' + data[i].color + '"><span class="app-item">' + data[i].seriesName + '</span><span class="flow-item">' + data[i].data[1] + '</span></li>')
                    }
                    return '<div class="trigger-container"><div class="content"><li class="trigger-item" style="color:#000"><span class="app-item">日期</span><span class="flow-item">' + moment.unix(data[0].axisValue / 1000).format("YYYY-MM-DD HH:mm:ss") + '</span></li>' + res + '</div></div>'

                }
            },
            legend: {
                right: "50%",
                bottom: 0,
                icon:"circle",
            },
            dataZoom: [
                {
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'none',
                    bottom: 25
                },
            ],
            grid: {
                left: '3%',
                right: '20%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'time',
                boundaryGap: true,
                min: this.state.start_tm,
                max: this.state.end_tm,
                name: "时间",
                axisTick:{show:false},
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle: {
                        color:"rgba(0,0,0,0.45)"
                    }
                }
            },
            yAxis: [{type: 'value', name: title + yUnit,axisTick:{show:false},axisLine:{show:false},}],
            series: dataSource,
            color: ['#E57E74 ', '#128F07', '#FFCA25', '#0476FF',]
        };
        el.setOption(option);
    };


    render() {
        return (
            <div>
                <header>
                    <Select style={{width: 150, marginRight: 8}} placeholder="请选择时间间隔"
                            onChange={this.selectTimeInterval} defaultValue="0">
                        <Option value="0">最近30分钟</Option>
                        <Option value="1">最近六小时</Option>
                        <Option value="2">最近24小时</Option>
                        <Option value="3">最近一周</Option>
                    </Select>
                </header>
                <div className="divide-line"/>
                <Card style={{marginBottom: 16}}>
                    <div className="chart-dom" id="firstChart">

                    </div>
                </Card>
                <Card>
                    <div className="chart-dom" id="secondChart">

                    </div>
                </Card>
            </div>
        )
    }
}

export default CI0203;