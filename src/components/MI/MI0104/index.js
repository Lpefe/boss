/*@运维-APP设备详情*/
import React from 'react';
import {Card, Modal} from 'antd';
import * as echarts from "echarts";
import {parse} from "../../../utils/commonUtilFunc";
import BossEditModal from "../MI1902/subComponents/BossEditModal";
import TunnelInfo from "./subComponents/TunnelInfo";


class MI0104C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeDetailModalShow: false,
            appDetailModalShow: false,
            checkRecord: {},
            linkInfoModalShow: false,
            link_id: "",
            company_id: "",
            bandwidth: "",
            sn: ""
        };
        this.search = parse(this.props.location.search)

    }

    componentDidMount() {
        this.topoGraph = echarts.init(document.getElementById("topo-graph"));
        this.get_app_device();
        this.topoGraph.on('click', (params) => {
            if (params.dataType === 'edge') {
                if (params.data.status === 'ONLINE' || params.data.status === 'OFFLINE') {
                    this.setState({
                        linkInfoModalShow: true,
                        link_id: params.data.link_id,
                        company_id: params.data.company_id,
                        bandwidth: params.data.bandwidth,
                        sn: params.data.sn
                    })
                }
            } else if (params.dataType === 'node') {
                if (params.data.node_type === 'center') {
                    this.setState({
                        nodeDetailModalShow: true,
                        checkRecord: params.data
                    })
                } else if (params.data.node_type === 'edge') {
                    this.setState({
                        appDetailModalShow: true,
                        checkRecord: params.data
                    })
                }
            }
        })
    }

    componentDidUpdate() {
        this.renderChart();
    }

    handleCloseLinkInfoModal = () => {
        this.setState({
            linkInfoModalShow: false
        })
    };

    get_app_device = () => {
        this.props.dispatch({
            type: "mi0104Info/get_app_device",
            payload: {
                device_id: this.search.id
            }
        })
    };

    handleCloseNodeDetailModal = () => {
        this.setState({
            nodeDetailModalShow: false
        })
    };

    handleCloseAppDetailModal = () => {
        this.setState({
            appDetailModalShow: false
        })
    };

    renderChart = () => {
        let option = {
            series: [{
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                circular: {
                    rotateLabel: true
                },
                force: {
                    edgeLength: 200,
                    repulsion: 800,
                },
                data: this.props.mi0104Info.nodes,
                links: this.props.mi0104Info.links,
                roam: true,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: "#000",
                        fontSize: 14,
                        fontFamily: "PingFangSC-Regular",
                    },
                },
                lineStyle: {
                    normal: {
                        color: 'source',
                        curveness: 0
                    }
                },
            }
            ]
        };
        this.topoGraph.setOption(option)
    };

    render() {
        const edgeModalOption = {
            title: "@基本信息",
            visible: this.state.appDetailModalShow,
            onCancel: this.handleCloseAppDetailModal,
            footer: null,
            bodyHeight: 300,
            InputItems: [{
                type: "Plain",
                labelName: "@账号",
                valName: "type",
                content: this.state.checkRecord.account,
                height: 32,
            }, {
                type: "Plain",
                labelName: "@硬件ID",
                valName: "type",
                content: this.state.checkRecord.sn,
                height: 32,
            }, {
                type: "Plain",
                labelName: "@姓名",
                valName: "type",
                content: this.state.checkRecord.client_name,
                height: 32,
            }, {
                type: "Plain",
                labelName: "@最近登录时间",
                valName: "type",
                content: this.state.checkRecord.last_login_time,
                height: 32,
            }, {
                type: "Plain",
                labelName: "@终端类型",
                valName: "type",
                content: this.state.checkRecord.os_type,
                height: 32,
            }, {
                type: "Plain",
                labelName: "VIP",
                valName: "type",
                content: this.state.checkRecord.vip,
                height: 32,
            }]
        };
        const centerModalOption = {
            title: "@基本信息",
            visible: this.state.nodeDetailModalShow,
            onCancel: this.handleCloseNodeDetailModal,
            footer: null,
            bodyHeight: 200,
            InputItems: [{
                type: "Plain",
                labelName: "@节点名称",
                valName: "type",
                content: this.state.checkRecord.name,
                height: 32,
            }, {
                type: "Plain",
                labelName: "@IP/IP段",
                valName: "type",
                content: this.state.checkRecord.ipset,
                height: 32,
            }, {
                type: "Plain",
                labelName: "@所属城市",
                valName: "type",
                content: this.state.checkRecord.level3_name,
                height: 32,
            },]
        };
        return (
            <Card className="card">
                <div id="topo-graph" style={{width: '100%', height: 800}}>

                </div>
                <BossEditModal {...edgeModalOption}/>
                <BossEditModal {...centerModalOption}/>
                <Modal visible={this.state.linkInfoModalShow} onCancel={this.handleCloseLinkInfoModal} width={1200}
                       footer={null} title="@链路信息" destroyOnClose={true}>
                    <TunnelInfo bandwidth={this.state.bandwidth} sn={this.state.sn} link_id={this.state.link_id}
                                company_id={this.state.company_id}/>
                </Modal>
            </Card>
        )
    }
}

export default MI0104C;