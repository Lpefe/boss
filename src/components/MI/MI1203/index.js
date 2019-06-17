/*@运维-流量去重分析*/
import React from 'react';
import {Card, Icon, Modal, Select} from 'antd';
import BossTable from "../../Common/BossTable";
import {commonTranslate, parse} from '../../../utils/commonUtilFunc';
import moment from 'moment';
import BossLineChart from "../../Common/Charts/Line/BossLineChart";
import {injectIntl} from "react-intl";
const Option = Select.Option;

class MI1203 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: "5",
            chartModalShow: false,
            start_tm: moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().format("YYYY-MM-DD HH:mm:ss"),
            appName: "",
            modalStartTm: moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            modalEndTm: moment().format("YYYY-MM-DD HH:mm:ss"),
            selectedDstIp: "",
            selectedDstPort: "",
            selectedProtocol: ""
        }
    }

    componentDidMount() {
        this.get_dedup_rank();
    }

    get_dedup_rank = () => {
        this.props.dispatch({
            type: "mi1201Info/get_dedup_rank",
            payload: {
                companyid: parse(this.props.location.search).id,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.top
            }
        })
    };

    get_deduplicate = () => {
        this.props.dispatch({
            type: "mi1201Info/get_deduplicate",
            payload: {
                companyid: parse(this.props.location.search).id,
                start_tm: this.state.modalStartTm,
                end_tm: this.state.modalEndTm,
                dst_port: this.state.selectedDstPort,
                dst_ip: this.state.selectedDstIp,
                protocol: this.state.selectedProtocol,
            }
        })
    };
    selectTop = (value) => {
        let vm = this;
        this.setState({
            top: value,

        }, function () {
            vm.get_dedup_rank();
        })
    };

    selectTimeInterval = (type) => {
        let vm = this;
        let start_tm = "";
        let end_tm = moment().format("YYYY-MM-DD HH:mm:ss");
        switch (type) {
            case "0":
                start_tm = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "1":
                start_tm = moment().subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "2":
                start_tm = moment().subtract(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "3":
                start_tm = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "4":
                start_tm = moment().subtract(1, 'months').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm = moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
        }
        this.setState({
            start_tm: start_tm,
            end_tm: end_tm,
        }, function () {
            vm.get_dedup_rank();
        })
    };

    selectModalTimeInterval = (value) => {
        let vm = this;
        let start_tm = "";
        let end_tm = moment().format("YYYY-MM-DD HH:mm:ss");
        switch (value) {
            case "0":
                start_tm = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "1":
                start_tm = moment().subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "2":
                start_tm = moment().subtract(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm = moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
        }
        this.setState({
            modalStartTm: start_tm,
            modalEndTm: end_tm,
        }, function () {
            vm.get_deduplicate();
        })
    };

    handleChartModalShow = (record) => {
        let vm = this;
        this.setState({
            chartModalShow: true,
            appName: record.name,
            selectedDstIp: record.dst_ip,
            selectedDstPort: record.dst_port,
            selectedProtocol: record.protocol
        }, function () {
            vm.get_deduplicate();
        })
    };

    handleCancelModal = () => {
        this.setState({
            chartModalShow: false,
            appName: "",
            modalStartTm: moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            modalEndTm: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
    };


    render() {
        const option = [
            <Option value="5" key="5">@5条</Option>,
            <Option value="10" key="10">@10条</Option>,
            <Option value="20" key="20">@20条</Option>,
            <Option value="50" key="50">@50条</Option>,
            <Option value="100" key="100">@100条</Option>,
        ];

        const columns = [{
            title: '@应用名称',
            dataIndex: 'name',
            key: 'name',

        }, {
            title: '@目标地址',
            dataIndex: 'dst_ip',
            key: 'dst_ip',
        }, {
            title: '@目标端口',
            dataIndex: 'dst_port',
            key: 'dst_port',
        }, {
            title: '@协议',
            dataIndex: 'protocol',
            key: 'protocol',
        }, {
            title: '@去重前流量(M)',
            dataIndex: 'before',
            key: 'before',
            render: (index, record) => {
                return (record.before / 1024 / 1024).toFixed(4)
            }
        }, {
            title: '@去重率(%)',
            dataIndex: 'percent',
            key: 'percent',
        }, {
            title: '@去重后流量(M)',
            dataIndex: 'after',
            key: 'after',
            render: (index, record) => {
                return (record.after / 1024 / 1024).toFixed(4)
            }
        }, {
            title: '@去重节省流量(M)',
            dataIndex: 'save',
            key: 'save',
            render: (index, record) => {
                return (record.save / 1024 / 1024).toFixed(4)
            }
        }, {
            title: '@历史流量',
            dataIndex: 'historyFlow',
            key: 'historyFlow',
            align: "center",
            render: (text, record) => {
                return <Icon type="dot-chart" onClick={() => this.handleChartModalShow(record)}/>
            }
        },];

        const chartOptions = {
            id: "depuChart",
            containerWidth: 700,
            containerHeight: 500,
            option: {
                tooltip: {
                    trigger: 'axis',
                },
                grid: {
                    left: '8%',
                    right: '5%',
                    bottom: '14%',
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    min: this.state.modalStartTm,
                    max: this.state.modalEndTm,
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
                legend: {
                    left: "center",
                    bottom: 0,
                    icon: "circle",
                },
                yAxis: [
                    {type: 'value', name: "@流量(MB)", axisLine: {show: false}, axisTick: {show: false}},
                    {type: 'value', name: "@去重率(%)", max: 100, axisLine: {show: false}, axisTick: {show: false}}
                ],
                series: [
                    {
                        name: '@去重前流量(MB)',
                        type: 'line',
                        yAxisIndex: 0,
                        data: this.props.mi1201Info.dedupBefore,
                        showSymbol: false,
                        smoothMonotone: "x",
                        smooth: true,
                        color:"#EB1A1A"
                    },
                    {
                        name: '@去重后流量(MB)',
                        type: 'line',
                        yAxisIndex: 0,
                        data: this.props.mi1201Info.dedupAfter,
                        showSymbol: false,
                        smoothMonotone: "x",
                        smooth: true,
                        color:"#27BB28"
                    },
                    {
                        name: '@去重率(%)',
                        type: 'line',
                        yAxisIndex: 1,
                        lineStyle: {
                            normal: {
                                type: 'dashed'
                            }
                        },
                        showSymbol: false,
                        data: this.props.mi1201Info.dedupPercent,
                        smoothMonotone: "x",
                        smooth: true,
                        color: '#FFA100',
                    },
                ]
            }
        };
        return <Card className="card">
            <div className="chart-title"><span
                className="title-company-abbr">{parse(this.props.location.search).company_abbr}</span><span
                className="title-status">{parse(this.props.location.search).status}</span></div>
            <section style={{marginBottom: 16}}>
                <Select style={{width: 150, marginRight: 8}} defaultValue="5" onChange={this.selectTop}>
                    {option}
                </Select>
                <Select style={{width: 150}} placeholder={"@请选择时间间隔"}
                        onChange={this.selectTimeInterval} defaultValue="0">
                    <Option value="0" key='0'>{"@最近30分钟"}</Option>
                    <Option value="1" key='1'>{"@最近六小时"}</Option>
                    <Option value="2" key='2'>{"@最近24小时"}</Option>
                    <Option value="3" key='3'>{"@最近一周"}</Option>
                </Select>
            </section>
            <BossTable columns={columns} dataSource={this.props.mi1201Info.dedupList}/>
            <Modal title={"@流量去重日统计"} visible={this.state.chartModalShow} width={750} footer={null}
                   onCancel={this.handleCancelModal} destroyOnClose>
                <div style={{position: "relative"}}>
                    <span>{this.state.appName}{"@应用流量去重日统计"}:</span>
                    <Select style={{width: 150}} placeholder={"@请选择时间间隔"}
                            onChange={this.selectModalTimeInterval} defaultValue="0">
                        <Option value="0" key='0'>{"@最近30分钟"}</Option>
                        <Option value="1" key='1'>{"@最近六小时"}</Option>
                        <Option value="2" key='2'>{"@最近24小时"}</Option>
                    </Select>
                </div>
                <BossLineChart {...chartOptions}/>
            </Modal>
        </Card>
    }
}

export default injectIntl(MI1203);