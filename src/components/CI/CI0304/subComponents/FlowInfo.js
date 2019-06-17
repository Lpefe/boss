/*@客户-设备流量*/
import React from 'react';
import {Button, Input, Modal, Select} from 'antd';
import * as echarts from "echarts";
import {parse} from "../../../../utils/commonUtilFunc";
import {addComma} from "../../../../utils/commonUtilFunc";
import {pieChartColor} from "../../../../utils/commonConsts";
import {withRouter} from "react-router-dom";
import AppFlowDetailInfo from "./FlowInfoSubs/AppFlowDetailInfo";
import {connect} from "dva";
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
const Option = Select.Option;


class FlowInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifFlowDetailModalShow: false,
            selectedAppFlow: "0",
            top: "5",
            selectedIdB: "",
            name: "",
            selectedAppName:""
        };
        let search = parse(this.props.location.search);
        this.sn = search.sn;
        this.start_tm = search.start_tm;
        this.end_tm = search.end_tm;
        this.tunnel_dir = search.tunnel_dir;
        this.tunnel_dir_id = search.tunnel_dir_id;
        this.company_id=search.id;
        this.ifCompany=(sessionStorage.getItem("role") === 'supercxpbusiness' || sessionStorage.getItem("role") === 'supercxptechnology' || sessionStorage.getItem("role") === 'supercxptechsupport' || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin")
    }

    componentDidMount() {
        let vm = this;
        this.get_step_class();
        this.element = echarts.init(document.getElementById('flow-info'));
        this.element.on('click', function (params) {
            vm.setState({
                ifFlowDetailModalShow: true,
                selectedAppFlow: params.data.value,
                selectedIdB: params.data.idb,
                selectedAppName:params.name,
            }, () => {
                vm.get_step_apps();
            })
        });
        window.addEventListener('resize', this.onWindowResize)
    }

    componentDidUpdate() {
        this.renderChart(this.element);
    }

    onWindowResize = () => {
        this.setState({
            chartWidth: (document.body.clientWidth > 1366 ? document.body.clientWidth - 320 : 1366 - 320)
        })
    };

    get_step_class = () => {
        this.props.dispatch({
            type: "ci0303Info/get_step_class",
            payload: {
                start_tm: this.start_tm,
                end_tm: this.end_tm,
                tunnel_dir: this.tunnel_dir_id,
                sn: this.sn,
            }
        })
    };
    //获取具体app排行数据
    get_step_apps = () => {
        this.props.dispatch({
            type: 'ci0303Info/get_step_apps',
            payload: {
                start_tm: this.start_tm,
                end_tm: this.end_tm,
                tunnel_dir: this.tunnel_dir_id,
                sn: this.sn,
                top: this.state.top,
                name: this.state.name,
                company_id:this.ifCompany?this.company_id:sessionStorage.getItem("companyId"),
                idb: this.state.selectedIdB
            }
        })
    };

    handleInputChange = (e) => {
        let vm = this;
        this.setState({
            name: e.target.value
        }, function () {
            if (this.state.name === "") {
                vm.get_step_apps();
            }
        })
    };

    cancelFlowDetailModal = () => {
        this.setState({
            ifFlowDetailModalShow: false,
            top:"5",
            name:""
        })
    };

    selectDataNum = (value) => {
        this.setState({
            top: value
        }, () => {
            this.get_step_apps();
        })
    };

    renderChart = (element) => {
        const __=this.props.intl.formatMessage;
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
            },
            grid: {
                left: '3%',
                containLabel: true,

            },
            legend: {
                orient: 'vertical',
                right: '30%',
                data: this.props.ci0303Info.legendNm,
                top: "10%",
                formatter: function (name) {
                    return name;
                }
            },
            series: [
                {
                    name: '@流量',
                    type: 'pie',
                    data: this.props.ci0303Info.step_class_flow,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return pieChartColor[params.dataIndex % pieChartColor.length]
                            },
                            borderWidth: 2,
                            borderColor: '#ffffff',
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: "{b} {d}%"
                        }
                    },
                    center: ["30%", "50%"],
                    minAngle:3,
                },
            ],
            color: ["red", "yellow"]
        };
        element.setOption(option);
        element.resize({width: this.state.chartWidth, height: 500})
    };

    render() {
        const __=this.props.intl.formatMessage;
        const search = parse(this.props.location.search);
        return (
            <div>
                <div id="flow-info"/>
                <Modal destroyOnClose visible={this.state.ifFlowDetailModalShow} title={this.state.selectedAppName+"-"+"@应用流量排行"} footer={null}
                       onCancel={this.cancelFlowDetailModal} width={925}>
                    <header>
                        <div className="title-device-name">{"@设备名称"}:{parse(this.props.location.search).device_name}</div>
                        <div className="title-device-info">
                            <span>{"@时间段"}:&nbsp;&nbsp;{search.start_tm}&nbsp;{"@至"}&nbsp;{search.end_tm}</span><span>{"@流量类型"}:&nbsp;&nbsp;{search.tunnel_dir}</span><span>{"@流量大小"}:&nbsp;{addComma(this.state.selectedAppFlow)}&nbsp;&nbsp;MB</span>
                        </div>
                    </header>
                    <Select placeholder={"@请选择数据条数"} style={{width: 120, marginRight: 8, marginTop: 16}} className="input"
                            onChange={this.selectDataNum} defaultValue="5">
                        <Option value="5">@5条</Option>
                        <Option value="10">@10条</Option>
                        <Option value="15">@15条</Option>
                        <Option value="20">@20条</Option>
                    </Select>
                    <Input placeholder={"@请输入关键字"} style={{width: 240, marginRight: 8}} className="input"
                           onChange={this.handleInputChange}/>
                    <Button onClick={this.get_step_apps}>{"@搜索"}</Button>
                    <AppFlowDetailInfo/>
                </Modal>
            </div>
        )
    }
}

function mapDispatchToProps({ci0303Info}) {
    return {ci0303Info};
}

export default connect(mapDispatchToProps)(withRouter(injectIntl(FlowInfo)));