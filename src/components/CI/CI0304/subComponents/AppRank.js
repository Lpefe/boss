/*@客户-设备流量*/
import React from 'react';
import * as echarts from "echarts";
import {Select} from "antd";
import {Input} from "antd";
import {Button} from "antd";
import {Modal, Tabs} from "antd";
import {commonTranslate, parse} from "../../../../utils/commonUtilFunc";
import {addComma} from "../../../../utils/commonUtilFunc";
import {chartColor, pieChartColor} from '../../../../utils/commonConsts';
import {withRouter} from "react-router-dom";
import UserFlowRankTab from "./AppRankSubs/UserFlowRankTab";
import DayFlowChart from "./AppRankSubs/DayFlowChart";
import {connect} from "dva";
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
import DesIpFlowChart from "./AppRankSubs/DesIpFlowChart";
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class AppRank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartWidth: (document.body.clientWidth > 1366 ? document.body.clientWidth - 320 : 1366 - 320),
            ifAppFlowDetailModalShow: false,
            selectedAppId: "",
            selectedAppNm: "",
            selectedAppFlow: "0",
            top:'5',
            name:"",
        };
        let search = parse(this.props.location.search);
        this.sn = search.sn;
        this.start_tm = search.start_tm;
        this.end_tm = search.end_tm;
        this.tunnel_dir = search.tunnel_dir;
        this.tunnel_dir_id=search.tunnel_dir_id;
        this.company_id=search.id;
        this.ifCompany=(sessionStorage.getItem("role") === 'supercxpbusiness' || sessionStorage.getItem("role") === 'supercxptechnology' || sessionStorage.getItem("role") === 'supercxptechsupport' || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin")
    }

    componentDidMount() {
        let vm = this;
        this.get_step_apps();
        this.element = echarts.init(document.getElementById('app-rank'));
        this.element.on('click', function (params) {
            vm.setState({
                ifAppFlowDetailModalShow: true,
                selectedAppNm: params.data[3],
                selectedAppId: params.data[2],
                selectedAppFlow: params.data[0],
            })
        });
        this.props.onRef(this)
    }

    componentDidUpdate() {
        this.renderChart(this.element)
    }


    get_step_apps = () => {
        this.props.dispatch({
            type: "ci0303Info/get_step_apps",
            payload: {
                start_tm: this.start_tm,
                end_tm: this.end_tm,
                tunnel_dir: this.tunnel_dir_id,
                sn:this.sn,
                top:this.state.top,
                name:this.state.name,
                company_id:this.ifCompany?this.company_id:sessionStorage.getItem("companyId"),
            }
        })
    };

    selectDataNum=(value)=>{
        let vm=this;
        vm.setState({
            top:value
        },function(){
            vm.get_step_apps();
        })
    };

    handleInputChange=(e)=>{
        let vm=this;
        this.setState({
            name:e.target.value
        },()=>{
            if(this.state.name===""){
                vm.get_step_apps();
            }
        })
    };

    handleCloseAppFlowDetailModal = () => {
        this.setState({
            ifAppFlowDetailModalShow: false,
            selectedAppId: "",
            selectedAppNm: "",
            selectedAppFlow: "0",
        })
    };

    renderChart = (element) => {
        const __=this.props.intl.formatMessage;
        let option = {
            grid: {
                left: '3%',
                right: '6%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisTick:{show:false},
                name:"MB",
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
                type: 'category',
                axisTick:{
                    show:false
                },
                axisLine:{
                    lineStyle: {
                        type:"dashed",
                        color:"rgba(0,0,0,0.45)"
                    }
                },
                nameTextStyle:{
                    fontSize:8
                },
                axisLabel:{
                    interval:0
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
                            position: 'right',
                        }
                    },
                    barCategoryGap: "60%",
                    barMinHeight: "10",
                    barMaxWidth:32
                },
            ],
            color: ["red", "yellow"],
        };
        element.setOption(option);
        element.resize({width: this.state.chartWidth, height: 500})
    };

    render() {
        const search = parse(this.props.location.search);
        return (
            <div>
                <Select placeholder={"@请选择数据条数"} style={{width: 120, marginRight: 8, marginTop: 16}} className="input"
                        onChange={this.selectDataNum} defaultValue="5">
                    <Option value="5">@5条</Option>
                    <Option value="10">@10条</Option>
                    <Option value="15">@15条</Option>
                    <Option value="20">@20条</Option>
                </Select>
                <Input placeholder={"@请输入关键字"} style={{width: 240, marginRight: 8}} className="input" onChange={this.handleInputChange}/>
                <Button onClick={this.get_step_apps}>{"@搜索"}</Button>
                <div id="app-rank"/>

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

export default connect(mapDispatchToProps)(withRouter(injectIntl(AppRank)));