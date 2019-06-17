/*@客户-设备流量*/
import React from 'react';
import * as echarts from "echarts";
import {withRouter} from "react-router-dom";
import {addComma, parse} from "../../../../../utils/commonUtilFunc";
import {connect} from "dva";
import {chartColor, pieChartColor} from "../../../../../utils/commonConsts";
import messages from "../../LocaleMsg/messages";
import {Modal, Tabs} from "antd";
import UserFlowRankTab from "../AppRankSubs/UserFlowRankTab";
import DayFlowChart from "../AppRankSubs/DayFlowChart";
import {injectIntl} from "react-intl";
import DesIpFlowChart from "../AppRankSubs/DesIpFlowChart";
const TabPane = Tabs.TabPane;

class AppFlowDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifAppFlowDetailModalShow: false,
            selectedAppId: "",
            selectedAppNm: "",
            selectedAppFlow: "0",
        };
        let search = parse(this.props.location.search);
        this.sn = search.sn;
        this.start_tm = search.start_tm;
        this.end_tm = search.end_tm;
        this.tunnel_dir = search.tunnel_dir;
        this.tunnel_dir_id = search.tunnel_dir_id;


    }

    componentDidMount() {
        let vm = this;
        this.element = echarts.init(document.getElementById('app-flow-detail-chart'));
        this.element.on('click', function (params) {
            vm.setState({
                ifAppFlowDetailModalShow: true,
                selectedAppNm: params.data[3],
                selectedAppId: params.data[2],
                selectedAppFlow: params.data[0],
            })
        });
    }

    componentDidUpdate() {
        this.renderChart(this.element);
    }

    handleCloseAppFlowDetailModal = () => {
        this.setState({
            ifAppFlowDetailModalShow: false,
            selectedAppId: "",
            selectedAppNm: "",
            selectedAppFlow: "0",
        })
    };


    renderChart = (el) => {
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '5%',
                right: '6%',
                bottom: '10%',
                top: "5%",
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisTick: {show: false},
                splitLine: {
                    lineStyle: {
                        type: "dashed"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "rgba(0,0,0,0.45)"
                    }
                },
                name: "MB",

            },
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        type: "dashed",
                        color: "rgba(0,0,0,0.45)"
                    }
                },
                inverse:true
            },
            series: [
                {
                    name: '@流量',
                    type: 'bar',
                    data: this.props.ci0303Info.step_apps_flow,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return pieChartColor[params.dataIndex % chartColor.length]
                            }
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right'
                        }
                    },
                    barCategoryGap: "60%",
                    barMinHeight: "10",
                    barMaxWidth:32
                },
            ],
            color: ["red", "yellow"]
        };
        el.setOption(option);
    };

    render() {
        const search = parse(this.props.location.search);
        return (
            <div>
                <div id="app-flow-detail-chart" style={{width: 900, height: 400}}/>
                <Modal title={"@应用流量详情"} footer={null} visible={this.state.ifAppFlowDetailModalShow} width={925}
                       onCancel={this.handleCloseAppFlowDetailModal} destroyOnClose>
                    <header>
                        <div className="title-device-name">{"@应用名称"}:{this.state.selectedAppNm}</div>
                        <div className="title-device-info">
                            <span>{"@时间段"}:&nbsp;&nbsp;{search.start_tm}&nbsp;{"@至"}&nbsp;{search.end_tm}</span><span>{"@流量类型"}:&nbsp;&nbsp;{search.tunnel_dir}</span><span>{"@流量大小"}:&nbsp;{addComma(this.state.selectedAppFlow)}&nbsp;&nbsp;MB</span>
                        </div>
                    </header>
                    <Tabs>
                        <TabPane tab={"@用户排名"} key="1">
                            <UserFlowRankTab ids={this.state.selectedAppId} flow={this.state.selectedAppFlow}/>
                        </TabPane>
                        <TabPane tab={"@日流量趋势图"} key="2">
                            <DayFlowChart ids={this.state.selectedAppId}/>
                        </TabPane>
                        <TabPane tab={"@目标IP流量"} key="3">
                            <DesIpFlowChart ids={this.state.selectedAppId} flow={this.state.selectedAppFlow}/>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}

function mapDispatchToProps({ci0303Info}) {
    return {ci0303Info};
}

export default connect(mapDispatchToProps)(withRouter(injectIntl(AppFlowDetailInfo)));