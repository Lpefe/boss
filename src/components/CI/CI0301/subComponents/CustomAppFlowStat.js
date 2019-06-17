import React from 'react';
import {connect} from 'dva';
import {Input, Modal, Popover, Icon} from 'antd';
import * as echarts from 'echarts'
import BossTable from "../../../Common/BossTable";
import {chartColor} from "../../../../utils/commonConsts";
import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';
class CustomAppFlowStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.histogramElC = echarts.init(document.getElementById('chartC'));
       /* this.getDataC();*/
    }

    componentDidUpdate() {
        this.renderHistogramC(this.histogramElC, "应用名称");
    }

    /*getDataC() {
        this.props.dispatch({
            type: "ci0301Info/getStatisticsC",
            payload: {
                item: "appBand",
                companyid: this.props.companyid,
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
                top: this.props.data_num,
                defined: true,
            }
        })
    }*/

    renderHistogramC(el, yName) {
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
                min: this.props.start_tm,
                max: this.props.end_tm,
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
            legend: {
                left: "center",
                bottom: 0,
                icon:"circle",
            },
            yAxis: [
                {type: 'value', name: '@速率'+"(Mbps)",axisLine: {
                        show: false
                    },axisTick:{show:false}}],
            series: this.props.ci0301Info.lineSeriesC,
            color:chartColor
        };
        histogram.setOption(option);
    }

    editAppName = (e) => {
        this.setState({
            appName: e.target.value
        })
    };

    submitAppNameEditC = (visible, record) => {
        if (visible) {
            this.setState({
                appName: record.name
            })
        } else {
            this.props.dispatch({
                type: "ci0301Info/update_app_nameC",
                payload: {
                    edit: {
                        id: record.id,
                        name: this.state.appName,
                    },
                    refresh: {
                        item: "appBand",
                        companyid: this.props.companyid,
                        start_tm: this.props.start_tm,
                        end_tm: this.props.end_tm,
                        top: this.props.data_num,
                        defined: true
                    }
                }
            })
        }
    };
    handleCheckSrcIpModalShow = (record) => {
        this.setState({
            srcIpModalShow: true,
            selectedDstIp: record.dst_ip,
            selectedDstPort: record.dst_port,
        }, function () {
            this.props.dispatch({
                type: "ci0301Info/get_srcip_list",
                payload: {
                    start_tm: this.props.start_tm,
                    end_tm: this.props.end_tm,
                    companyid: this.props.companyid,
                    dst_ip: this.state.selectedDstIp,
                    dst_port: this.state.selectedDstPort,
                    name: record.name
                }
            })
        })
    };

    handleCloseCheckSrcIpModal = () => {
        this.setState({
            srcIpModalShow: false
        })
    };


    render() {
        const __ = this.props.intl.formatMessage;
        const pagination = {
            pageSize: 20
        };
        const columnsC = [{
            title: '@应用程序',
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
                                 onVisibleChange={(visible) => this.submitAppNameEditC(visible, record)}>
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
            render: (index, record) => {
                return <span onClick={() => this.handleCheckSrcIpModalShow(record)}>any</span>
            }

        }, {
            title:  '@目标地址',
            dataIndex: 'dst_ip',
            key: 'dst_ip',
        }, {
            title:  '@目标端口',
            dataIndex: 'dst_port',
            key: 'dst_port',
        },{
            title:  '@协议',
            dataIndex: 'protocol',
            key: 'protocol',
        }];
        const srcIpColumns = [{
            title: '应用程序名称',
            dataIndex: 'name',
            key: 'name',
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
        },];
        return <div>
            <section>
                <div style={{height: 500, width:document.body.clientWidth - 300}} id="chartC">

                </div>
            </section>
            <section>
                <BossTable pagination={pagination} columns={columnsC} dataSource={this.props.ci0301Info.tableDataC}/>
            </section>
            <Modal title={'@源地址'} onCancel={this.handleCloseCheckSrcIpModal} visible={this.state.srcIpModalShow}
                   footer={null}>
                <BossTable columns={srcIpColumns} dataSource={this.props.ci0301Info.srcIpList}/>
            </Modal>
        </div>
    }
}

function mapDispatchToProps({ci0301Info}) {
    return {ci0301Info};
}

export default connect(mapDispatchToProps)(injectIntl(CustomAppFlowStat));