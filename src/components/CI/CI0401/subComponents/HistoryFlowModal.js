/*@客户-日流量*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Select, DatePicker} from 'antd';
import * as echarts from 'echarts'
import moment from 'moment';
import {chartColor} from "../../../../utils/commonConsts";
import { injectIntl} from 'react-intl';
import noWan from "../../../../assets/img/noWan.png";
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class HistoryFlowModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            link_id: "",
            start_time:moment().subtract(7,"days").format("YYYY-MM-DD"),
            end_time:moment().format("YYYY-MM-DD")
        }
    }

    componentDidUpdate() {
        let el;
        if (document.getElementById("history-flow-chart")) {
            el = echarts.init(document.getElementById("history-flow-chart"));
            this.renderChart(el, this.props.ci0401Info.modalDataSource)
        }
    }

    handleSelectTopoName = (value) => {
        this.setState({
            link_id: value,
        }, function () {
            this.props.dispatch({
                type: "ci0401Info/getHistoryRate",
                payload: {
                    link_id: this.state.link_id || this.props.link_id,
                    start_time: this.state.start_time,
                    end_time: this.state.end_time
                }
            })
        })
    };

    handleSelectDate = (dates) => {
        this.setState({
            start_time: dates[0].format("YYYY-MM-DD"),
            end_time: dates[1].format("YYYY-MM-DD"),
        }, function () {
            this.props.dispatch({
                type: "ci0401Info/getHistoryRate",
                payload: {
                    link_id: this.state.link_id || this.props.link_id,
                    start_time: this.state.start_time,
                    end_time: this.state.end_time
                }
            })
        })
    };

    disabledDate = (current) => {
        return  current > moment().endOf('day');
    };

    renderChart = (el, dataSource) => {
        let dateList = dataSource.map((item) => {
            return item.date
        });
        let originRate = dataSource.map((item) => {
            return (item.origin / 1024 / 1024).toFixed(2)
        });
        let compressedPercent = dataSource.map((item) => {
            return item.rate === 0 ? 0 : parseInt(100 * (item.rate - item.drate) / item.rate,10).toFixed(2)
        });

        let tunnelRate=dataSource.map((item)=>{
            if(this.props.deduplication==="ON"){
                let dedupPercent=item.dedup_raw === 0 ? 0 : parseInt(100 * (item.dedup_raw - item.dedup) / item.dedup_raw,10).toFixed(2);
                let compressedPercent=item.rate === 0 ? 0 : parseInt(100 * (item.rate - item.drate) / item.rate,10).toFixed(2);
                return ((item.origin / 1024 / 1024).toFixed(2)*(1-dedupPercent/100)*(1-compressedPercent/100)).toFixed(2)

            }else{
                let compressedPercent=item.rate === 0 ? 0 : parseInt(100 * (item.rate - item.drate) / item.rate,10).toFixed(2);
                return ((item.origin/1024/1024)*(1-compressedPercent/100)).toFixed(2)
            }
        });
        let dedupSeries=[];
        if(this.props.deduplication==="ON"){
            let dedupPercent = dataSource.map((item) => {
                return item.dedup_raw === 0 ? 0 : parseInt(100 * (item.dedup_raw - item.dedup) / item.dedup_raw,10).toFixed(2)
            });
            dedupSeries=[
                {
                    name: '@去重率(%)',
                    type: 'line',
                    yAxisIndex: 1,
                    lineStyle: {
                        normal: {
                            type: 'dashed'
                        }
                    },
                    data: dedupPercent,
                    smoothMonotone:"x",
                    smooth:true
                },
            ]
        }
        let compressSeries=[
            {
                name: '@原始流量',
                type: 'line',
                yAxisIndex: 0,
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: originRate,
                smoothMonotone:"x",
                smooth:true
            },
            {
                name: '@隧道流量',
                type: 'line',
                yAxisIndex: 0,
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: tunnelRate,
                smoothMonotone:"x",
                smooth:true
            },
            {
                name: '@压缩率(%)',
                type: 'line',
                yAxisIndex: 1,
                lineStyle: {
                    normal: {
                        type: 'dashed'
                    }
                },
                data: compressedPercent,
                smoothMonotone:"x",
                smooth:true
            },
        ];

        let series=compressSeries.concat(dedupSeries);
        let option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: "#333",
                extraCssText: 'box-shadow: 0 2px 2px 0 rgba(24,24,24,0.60);border-radius: 2px 2px 0 0 0 2px 2px;',
                formatter: function (data) {
                    let res = '';
                    for (let i = 0; i < data.length; i++) {
                        res += ('<tr><td><span style="font-size:32px;color:'+data[i].color+'">&middot;</span>' + data[i].seriesName + '</td><td>' + data[i].data + '<td/><td>'+data[i].axisValue+'</td></tr>')
                    }
                    return '<div class="line-tooltip"><table class="line-tooltip-table" style="border-bottom: none">'+res+'<table/></div>'
                }
            },
            grid: {
                left: '10%',
                right: '5%',
                bottom: '15%',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dateList,
                min: this.state.start_tm,
                max: this.state.end_tm,
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
                left:"center",
                bottom:0,
                icon:"circle",
            },
            yAxis: [
                {type: 'value', name: '@流量(MB)',axisTick:{show:false},axisLine:{show:false}},
                {type: 'value', name: "%", max: 100,axisLine:{show:false},axisTick:{show:false}}],
            series: series,
            color: chartColor
        };
        el.setOption(option);
    };

    render() {
        return <Modal maskClosable={false} visible={this.props.ifModalShow} title={'@历史流量'} onCancel={this.props.cancel}
                      width={800}
                      footer={null} destroyOnClose>
            <Select style={{width: 250, marginRight: 8}} placeholder="@请选择链路名称" onChange={this.handleSelectTopoName}
                    defaultValue={this.props.link_id}>
                {this.props.ci0401Info.dataSource.map((item) => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                })}
            </Select>
            <RangePicker onChange={this.handleSelectDate}  disabledDate={this.disabledDate} defaultValue={[moment(this.state.start_time),moment(this.state.end_time)]}/>
            {this.props.ci0401Info.modalDataSource.length>0?<div id="history-flow-chart" style={{height: 450, marginTop: 24}}/>:<div style={{textAlign: "center"}}>
                <img src={noWan} alt="" style={{marginTop: 60}}/>
            </div>}
        </Modal>
    }
}

function mapDispatchToProps({ci0401Info}) {
    return {ci0401Info};
}

export default connect(mapDispatchToProps)(injectIntl(HistoryFlowModal))