import React from 'react';
import {connect} from 'dva';
import * as echarts from 'echarts'
import {chartColor} from "../../../../utils/commonConsts";
import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';
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
        /*this.getDataB();*/
        this.renderHistogramB(this.histogramElB, "节点名称", this.props.ci0301Info.lineSeriesB);
    }

    componentDidUpdate() {
        this.renderHistogramB(this.histogramElB, "节点名称", this.props.ci0301Info.lineSeriesB);
    }


   /* getDataB = () => {
        this.props.dispatch({
            type: "ci0301Info/getStatisticsB",
            payload: {
                item: "steps",
                companyid: this.props.companyid,
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
                top: this.props.data_num,
            }
        })
    };*/
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
            type: "ci0301Info/getTableB",
            payload: {
                tableFlag: true,
                item: "apprank",
                companyid: this.props.companyid,
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

    renderHistogramB(el, yName,lineData) {
        const __ = this.props.intl.formatMessage;
        let histogram = el;
        histogram.clear();
        let option ={
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
                min:this.props.start_tm,
                max:this.props.end_tm,
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
                left:"center",
                bottom:0,
                icon:"circle",
            },
            yAxis: [{type: 'value', name: '@速率'+"(Mbps)",axisTick: {
                    show: false
                },axisLine: {
                    show: false
                },}],
            series: lineData,
            color:chartColor,
        };
        histogram.setOption(option);
       /* histogram.off("mouseover");//防止累计触发
        histogram.on("mouseover", function (params) {
            vm.getTableB(vm.props.ci0301Info.step_sn_b[params.dataIndex]);
        });*/
    }

    getTableB(step_sn) {
        this.setState({
            selectedStepSn: step_sn
        });
        this.props.dispatch({
            type: "ci0301Info/getTableB",
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
                type: "ci0301Info/update_app_nameB",
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
        return <div>
            <section>
                <div style={{height: 500,width:document.body.clientWidth - 300}} id="chartB">

                </div>
            </section>
        </div>
    }
}

function mapDispatchToProps({ci0301Info}) {
    return {ci0301Info};
}

export default connect(mapDispatchToProps)(injectIntl(AgencyFlowStat));