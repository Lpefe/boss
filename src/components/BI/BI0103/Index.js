/*@商务-链路信息*/
import React from 'react';
import '../../CI/CI0101New/index.scss';
import {Modal, Icon} from 'antd';
import {Link} from 'react-router-dom'
import HeaderBar from "../../Common/HeaderBar";
import Operations from "../../Common/Operations";
import {parse} from "../../../utils/commonUtilFunc";
import AddLinkModal from "./subComponents/AddLinkModal";
import moment from 'moment'
import BossTable from "../../Common/BossTable";


class BI0103 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            type: "",
            name: "",
            status: "",
            ifAAddModalShow: false,
            recordId: "",
            record: {},
            alertModalShow: false,
            topo_id: parse(this.props.location.search).id,
            company_id: parse(this.props.location.search).company_id,
            agency_id_0: parse(this.props.location.search).agency_id_0,
            agency_id_1: parse(this.props.location.search).agency_id_1
        };
    }

    componentDidMount() {
        this.get_link_list();
        this.get_topo_list();
    }


    get_link_list = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_list",
            payload: {
                topo_id: this.state.topo_id,
            }
        })
    };

    get_topo_list = () => {
        this.props.dispatch({
            type: "ci0201Info/get_topo_list",
            payload: {
                company_id: this.state.company_id
            }
        })
    };

    handleOpenAddModal = (record) => {
        this.setState({
            ifAAddModalShow: true,
            recordId: record.id,
            record: record,
        })
    };
    handleCloseAddModal = () => {
        this.setState({
            ifAAddModalShow: false,
            recordId: "",
            record: {},
        })
    };

    selectTopo = (value) => {
        this.setState({
            topo_id: JSON.parse(value).topo_id,
            agency_id_0: JSON.parse(value).agency_id_0
        }, function () {
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    topo_id: this.state.topo_id
                }
            })
        })
    };

    handleAlertModalShow = (record) => {
        this.setState({
            alertModalShow: true
        }, function () {
            this.props.dispatch({
                type: "ci0201Info/get_link_alarm_list",
                payload: {
                    link_id: record.id,
                    begin_time: moment().subtract(24, "hour").format("YYYY-MM-DD HH:mm:ss"),
                    end_time: moment().format("YYYY-MM-DD HH:mm:ss"),
                }
            })
        })
    };
    handleAlertModalDispear = () => {
        this.setState({
            alertModalShow: false
        })
    };

    delete_link = (record) => {
        this.props.dispatch({
            type: "ci0201Info/delete_link",
            payload: {
                id: record.id,
                topo_id: this.state.topo_id
            }
        })
    };


    render() {
        const columns = [{
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@分支设备',
            dataIndex: 'device_name',
            key: 'device_name',
        }, {
            title: '@节点名称',
            dataIndex: 'branch',
            key: 'branch',
        }, {
            title: '@服务等级',
            dataIndex: 'grade',
            key: 'grade',
            render: (index, record) => {
                return record.grade === "CLOUD_VPN" ? "@云VPN" : (record.grade === "CLOUD_SPLINE" ? "@云专线" : "@超级云专线")
            }
        }, {
            title: '@计费模式',
            dataIndex: 'charge_type',
            key: 'charge_type',
        }, {
            title: '@带宽(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, {
            title: '@链路类型',
            dataIndex: 'type',
            key: 'type',
        }, /*{
            title: '24小时报警',
            dataIndex: 'alarm',
            key: 'alarm',
            align: "center",
            render: (index, record) => {
                return (
                    <Icon className="common-link-icon" type="file-text" onClick={() => this.handleAlertModalShow(record)}/>
                )
            }
        },*/ {
            title: '@流量图',
            dataIndex: 'chart',
            key: 'chart',
            width: 100,
            align: "center",
            render: (index, record) => {
                return (
                    <Link to={{
                        pathname: "/main/ci0201/ci0203",
                        search: "?id=" + record.id + "&company_id=" + this.state.company_id
                    }}><Icon type="line-chart"/></Link>
                )
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            fixed:'right',
            align: "center",
            render: (index, record) => {
                return <Operations hasEdit={true} hasDelete={true} delete={() => this.delete_link(record)}
                                   edit={() => this.handleOpenAddModal(record)}/>
            }
        }];

        const pagination = {
            pageSize: 20
        };
        const alertColumns = [
            {
                title: '@开始时间',
                dataIndex: 'begin_time',
                key: 'begin_time',
            }, {
                title: '@结束时间',
                dataIndex: 'end_time',
                key: 'end_time',
            }, {
                title: '@类型',
                dataIndex: 'type',
                key: 'type',
            },
        ]
        return (
            <div>
                {/*链路: <Select style={{width: 200, marginBottom: 16}} placeholder="请选择拓扑" onChange={this.selectTopo}>
                {this.props.ci0201Info.topoList.map((item) => {
                    return <Option key={item.id} value={JSON.stringify({
                        topo_id: item.id,
                        agency_id: item.agency_id_0
                    })}>{item.name}</Option>
                })}
            </Select>*/}
                <HeaderBar hasDelete={false} hasAdd={true}
                           hasSearch={false} add={this.handleOpenAddModal}/>
                <BossTable pagination={pagination} columns={columns}
                           dataSource={this.props.ci0201Info.dataSource}/>
                <AddLinkModal recordId={this.state.recordId} record={this.state.record}
                              agency_id_1={this.state.agency_id_1} agency_id_0={this.state.agency_id_0}
                              topo_id={this.state.topo_id} company_id={this.state.company_id}
                              visible={this.state.ifAAddModalShow} cancel={this.handleCloseAddModal}/>
                <Modal maskClosable={false} visible={this.state.alertModalShow} onCancel={this.handleAlertModalDispear}
                       title="@24小时警报"
                       size="middle" bordered footer={null}>
                    <BossTable columns={alertColumns} dataSource={this.props.ci0201Info.alarmList}/>
                </Modal>
            </div>
        )
    }
}

export default BI0103;