import React from 'react';
import {connect} from 'dva';
import {Input, Button, Popover, Icon} from 'antd';
import * as echarts from 'echarts'
import BossTable from "../../../Common/BossTable";

class AgencyFlowStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStepSn: "",
            srcIpB: "",
            desIpB: "",
            desPortB: "",
        }
    }

    componentDidMount() {
        this.histogramElB = echarts.init(document.getElementById("chartB"));
        this.getDataB();
        this.renderHistogramB(this.histogramElB, "节点名称");
    }

    componentDidUpdate() {
        this.renderHistogramB(this.histogramElB, "节点名称");
    }


    getDataB = () => {
        this.props.dispatch({
            type: "ci1301Info/getStatisticsB",
            payload: {
                item: "steps",
                companyid: sessionStorage.getItem("companyId"),
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
                top: this.props.data_num,
            }
        })
    };
    changeSrcIpB = (e) => {
        this.setState({
            srcIpB: e.target.value,
        })
    };

    changeDesIpB = (e) => {
        this.setState({
            desIpB: e.target.value,
        })
    };


    changeDesPortB = (e) => {
        this.setState({
            desPortB: e.target.value,
        })
    };
    searchB = () => {
        this.props.dispatch({
            type: "ci1301Info/getTableB",
            payload: {
                tableFlag: true,
                item: "apprank",
                companyid: sessionStorage.getItem("companyId"),
                start_tm: this.props.start_tm,
                step_sn: this.state.selectedStepSn,
                end_tm: this.props.end_tm,
                top: this.props.data_num,
                src_ip: this.state.srcIpB,
                dst_ip: this.state.desIpB,
                dst_port: this.state.desPortB,
            }
        })
    };

    renderHistogramB(el, yName) {
        let vm = this;
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
                }
            },
            yAxis: {
                inverse:true,
                type: 'category',
                data: this.props.ci1301Info.yNameB,
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
                },
                axisLine:{show:false},axisTick:{show:false}
            },
            grid: {
                x: 80
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    barMaxWidth:32,
                    data: this.props.ci1301Info.xDataB,
                    barMinHeight: 10,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                let colorList = [
                                    '#657fe7', '#59c351', '#f7bd62', '#ee534a'
                                ];
                                return colorList[params.dataIndex % 4]
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
        histogram.off("mouseover");//防止累计触发
        histogram.on("mouseover", function (params) {
            vm.getTableB(vm.props.ci1301Info.step_sn_b[params.dataIndex]);
        });
    }

    getTableB(step_sn) {
        this.setState({
            selectedStepSn: step_sn
        });
        this.props.dispatch({
            type: "ci1301Info/getTableB",
            payload: {
                item: "apprank",
                companyid: sessionStorage.getItem("companyId"),
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
                top: this.props.data_num,
                step_sn: step_sn
            }
        })
    }

    editAppName = (e) => {
        this.setState({
            appName: e.target.value
        })
    };

    submitAppNameEditB = (visible, record) => {
        if (visible) {
            this.setState({
                appName: record.name
            })
        } else {
            this.props.dispatch({
                type: "ci1301Info/update_app_nameB",
                payload: {
                    edit: {
                        id: record.id,
                        name: this.state.appName,
                    },
                    refresh: {
                        item: "apprank",
                        companyid: sessionStorage.getItem("companyId"),
                        start_tm: this.props.start_tm,
                        step_sn: this.state.selectedStepSn,
                        end_tm: this.props.end_tm,
                        top: this.props.data_num,
                        src_ip: this.state.srcIpB,
                        dst_ip: this.state.desIpB,
                        dst_port: this.state.desPortB,
                    }
                }
            })
        }
    };


    render() {
        const columnsB = [{
            title: '应用程序',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (index, record) => {
                return (
                    <div>
                        <span style={{marginRight: 8}}>{record.name}</span>
                        <Popover trigger="click" title="修改应用程序名称"
                                 content={<Input placeholder="请输入应用程序名称" onChange={this.editAppName}
                                                 defaultValue={record.name}/>}
                                 onVisibleChange={(visible) => this.submitAppNameEditB(visible, record)}>
                            <Icon style={{color: "rgb(24, 144, 255)"}}
                                  type="edit"/>
                        </Popover>
                    </div>
                )
            }
        }, {
            title: '源地址',
            dataIndex: 'src_ip',
            key: 'src_ip',
        }, {
            title: '目标地址',
            dataIndex: 'dst_ip',
            key: 'dst_ip',
        }, {
            title: '目标端口',
            dataIndex: 'dst_port',
            key: 'dst_port',
        }, {
            title: '流量(MB)',
            dataIndex: 'flow',
            key: 'flow',
        },];
        const pagination = {
            pageSize: 20
        };
        return <div>
            <section>
                <div style={{height: 400}} id="chartB">

                </div>
            </section>
            <div className="divide-line" style={{height: 1}}/>
            <section>
                <div style={{textAlign: 'right', marginBottom: 16}}>
                    <Input className="input" style={{width: 200, marginRight: 8}} placeholder="请输入源地址"
                           onChange={this.changeSrcIpB}/>
                    <Input className="input" style={{width: 200, marginRight: 8}} placeholder="请输入目标地址"
                           onChange={this.changeDesIpB}/>
                    <Input className="input" style={{width: 200, marginRight: 8}} placeholder="请输入目标端口"
                           onChange={this.changeDesPortB}/>
                    <Button onClick={this.searchB} icon="search">搜索</Button>
                </div>
                <BossTable pagination={pagination} columns={columnsB}
                           dataSource={this.props.ci1301Info.dataSourceB}/>
            </section>
        </div>
    }
}

function mapDispatchToProps({ci1301Info}) {
    return {ci1301Info};
}

export default connect(mapDispatchToProps)(AgencyFlowStat);