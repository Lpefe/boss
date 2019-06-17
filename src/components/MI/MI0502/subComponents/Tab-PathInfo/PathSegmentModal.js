/*@运维-链路信息*/
import React from 'react';
import {Form, Modal, Steps} from 'antd';
import BossLineChart from "../../../../Common/Charts/Line/BossLineChart";
import {withRouter} from "react-router-dom";
import {injectIntl} from "react-intl";
import {connect} from "dva";
import moment from "moment";
import './index.scss'
const Step = Steps.Step;

class PathSegmentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {

    }


    render() {
        const mi0102Info = this.props.mi0102Info;

        const chartPropsOption = mi0102Info.pathSeg.map((line, index) => {
            return {
                id: index,
                containerHeight: 400,
                option: {
                    title: {
                        text: line.path,
                        textStyle: {
                            fontSize: 16,
                            color: "rgba(0,0,0,0.85)",
                            fontWeight: 500
                        },
                    },
                    xAxis: {
                        type: 'time',
                        boundaryGap: true,
                        name: '@时间',
                    },
                    yAxis: [{type: 'value', name: "@网络延迟", axisLine: {show: false}}, {
                        type: 'value',
                        name: '@网络丢包',
                        axisLine: {show: false}
                    }],
                    series: [{
                        type: "line",
                        name: "@网络延迟",
                        data: line.info.map((info) => {
                            return [moment(info.time*1000).format("YYYY-MM-DD HH:mm:ss"), info.rtt]
                        }),
                        yAxisIndex: 0,
                        showSymbol: false,
                        smoothMonotone: "x",
                        smooth: true,
                        animation: false
                    }, {
                        type: "line",
                        name: "@上行丢包率",
                        data: line.info.map((info) => {
                            return [moment(info.time*1000).format("YYYY-MM-DD HH:mm:ss"), info.umiss]
                        }),
                        yAxisIndex: 1,
                        showSymbol: false,
                        smoothMonotone: "x",
                        smooth: true,
                        animation: false
                    }, {
                        type: "line",
                        name: "@下行丢包率",
                        data: line.info.map((info) => {
                            return [moment(info.time*1000).format("YYYY-MM-DD HH:mm:ss"), info.dmiss]
                        }),
                        yAxisIndex: 1,
                        showSymbol: false,
                        smoothMonotone: "x",
                        smooth: true,
                        animation: false
                    }],
                    grid: {
                        left: "10%"
                    }
                }
            }
        });
        const intervalMap={
            "0":"@30分钟",
            "1":"@6小时",
            "2":"@一天",
            "3":"@7天",
            "4":"@前后15分钟",
            "5":"@前后30分钟",
            "6":"@前后3小时",
            "7":"@前后12小时",
        };

        return (
            <Modal visible={this.props.visible} onCancel={this.props.cancel} title="@路径分段信息" width={950}
                   bodyStyle={{padding: 0}} footer={null}>
                <div style={{padding: 24}}>
                    <Steps>
                        <Step title={mi0102Info.pathInfo.src_info.name} status="finish" description={<div>
                            {mi0102Info.pathInfo.src_info.ip_table_list.map((item) => {
                                return <div>{item}</div>
                            })}
                        </div>}/>
                        {
                            mi0102Info.pathInfo.path_info.map((item) => {
                                return <Step title={item.name} status="finish" description={<div>
                                    <div>IP:{item.ip}</div>
                                    <div>@端口:{item.port}</div>
                                </div>}/>
                            })
                        }
                        <Step title={mi0102Info.pathInfo.dst_info.name} status="finish" description={<div>
                            <div>IP:{mi0102Info.pathInfo.dst_info.ip}</div>
                            <div>@端口:{mi0102Info.pathInfo.dst_info.port}</div>
                        </div>}/>
                    </Steps>
                </div>
                <div style={{height: 1, backgroundColor: "rgba(0,0,0,0.1)"}}/>
                <div className="time-range-icon">{intervalMap[this.props.intervalType]}</div>
                <div style={{padding: 24}}>
                    <div>{this.props.time}</div>
                    {mi0102Info.pathSeg.map((item, index) => {
                        return <div style={{width: '50%', display: "inline-block"}}>
                            <BossLineChart containerWidth={"100%"} {...chartPropsOption[index]}/>
                        </div>
                    })}
                </div>
            </Modal>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}

let PathSegmentModalF = Form.create()(withRouter(injectIntl(PathSegmentModal)));

export default connect(mapDispatchToProps)(PathSegmentModalF);