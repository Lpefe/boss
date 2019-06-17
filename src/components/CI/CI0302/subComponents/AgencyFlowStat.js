/*@客户-分时流量*/
import React from 'react';
import {connect} from 'dva';
import {Input, Button,  Popover, Icon} from 'antd';
import * as echarts from 'echarts'
import BossTable from "../../../Common/BossTable";
import {chartColor} from "../../../../utils/commonConsts";
import {injectIntl} from "react-intl";
class AgencyFlowStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStepSn:"",
            srcIpB: "",
            desIpB: "",
            desPortB: "",
        }
    }

    componentDidMount() {
        this.histogramElB = echarts.init(document.getElementById("chartB"));
        this.getDataB();
        this.renderHistogramB(this.histogramElB, "@节点名称");
    }

    componentDidUpdate() {
        this.renderHistogramB(this.histogramElB,  "@节点名称");
    }


    getDataB = () => {
        this.props.dispatch({
            type: "ci0302Info/getStatisticsB",
            payload: {
                item: "steps",
                companyid: this.props.companyid,
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
                top: this.props.data_num,
                counts:100
            }
        })
    };
    changeSrcIpB = (e) => {
        this.setState({
            srcIpB: e.target.value,
        })
    }

    changeDesIpB = (e) => {
        this.setState({
            desIpB: e.target.value,
        })
    }


    changeDesPortB = (e) => {
        this.setState({
            desPortB: e.target.value,
        })
    };
    searchB = () => {
        this.props.dispatch({
            type: "ci0302Info/getTableB",
            payload: {
                tableFlag: true,
                item: "apprank",
                companyid:this.props.companyid,
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
                }
                ,axisLine:{
                    lineStyle: {
                        color:"rgba(0,0,0,0.45)"
                    }
                }
            },
            yAxis: {
                type: 'category',
                inverse:true,
                data: this.props.ci0302Info.yNameB,
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
                axisTick:{show:false},
                axisLine:{show:false},
            },
            grid: {
                x: 120
            },
            series: [
                {
                    type: 'bar',
                    data: this.props.ci0302Info.xDataB,
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
        histogram.setOption(option,{notMerge: true});
        histogram.off("mouseover");//防止累计触发
        histogram.on("mouseover", function (params) {
            vm.getTableB(vm.props.ci0302Info.step_sn_b[params.dataIndex]);
        });
    }

    getTableB(step_sn) {
        console.log(this.props)
        this.setState({
            selectedStepSn: step_sn
        });
        this.props.dispatch({
            type: "ci0302Info/getTableB",
            payload: {
                item: "apprank",
                companyid: this.props.companyid,
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
                type: "ci0302Info/update_app_nameB",
                payload: {
                    edit: {
                        id: record.id,
                        name: this.state.appName,
                    },
                    refresh: {
                        item: "apprank",
                        companyid:this.props.companyid,
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
        const __=this.props.intl.formatMessage;
        const columnsB = [{
            title: '@应用程序',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            className:"normal",
            render: (index, record) => {
                return (
                    <div>
                        <span style={{marginRight: 8}}>{record.name}</span>
                        <Popover trigger="click" title={'@修改应用程序名称'}
                                 content={<Input placeholder={'@请输入应用程序名称'} onChange={this.editAppName}
                                                 defaultValue={record.name}/>}
                                 onVisibleChange={(visible) => this.submitAppNameEditB(visible, record)}>
                            <Icon style={{color: "rgb(24, 144, 255)"}}
                                  type="edit"/>
                        </Popover>
                    </div>
                )
            }
        }, {
            title: '@源地址',
            dataIndex: 'src_ip',
            key: 'src_ip',
            className:"normal",
        }, {
            title: '@目标地址',
            dataIndex: 'dst_ip',
            key: 'dst_ip',
            className:"normal",
        }, {
            title: '@目标端口',
            dataIndex: 'dst_port',
            key: 'dst_port',
            className:"normal",
        }, {
            title: '@流量'+'(MB)',
            dataIndex: 'flow',
            key: 'flow',
            className:"normal",
        },{
            title: '@协议',
            dataIndex: 'protocol',
            key: 'protocol',
            className:"normal",
        }];
        return <div>
            <section>
                <div style={{height: 400,width:document.body.clientWidth - 200}} id="chartB">

                </div>
            </section>
            <section>
                <div style={{textAlign: 'right', marginBottom: 16}}>
                    <Input className="input" style={{width: 200, marginRight: 8}} placeholder={'@请输入源地址'}
                           onChange={this.changeSrcIpB}/>
                    <Input className="input" style={{width: 200, marginRight: 8}} placeholder={'@请输入目标地址'}
                           onChange={this.changeDesIpB}/>
                    <Input className="input" style={{width: 200, marginRight: 8}} placeholder={'@请输入目标端口'}
                           onChange={this.changeDesPortB}/>
                    <Button onClick={this.searchB} icon="search">@搜索</Button>
                </div>
                <BossTable columns={columnsB} dataSource={this.props.ci0302Info.dataSourceB}/>
            </section>
        </div>
    }
}

function mapDispatchToProps({ci0302Info}) {
    return {ci0302Info};
}

export default connect(mapDispatchToProps)(injectIntl(AgencyFlowStat));