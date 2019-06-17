/*@客户-首页*/
import React from 'react';
import { Icon, Select,Modal} from 'antd';
import './agency.scss';
import {Link} from 'react-router-dom';
import {connect} from 'dva';
import HeaderBar from "../../../Common/HeaderBar";
import moment from 'moment';
import BossTable from "../../../Common/BossTable";
import messages from '../LocaleMsg/message';
import {injectIntl} from 'react-intl';
import {statusMap} from "../../../../utils/commonUtilFunc";
const Option = Select.Option;

class Device extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            net_type: "",
            name: "",
            status: "",
        }
    }

    componentDidMount() {
        this.props.onRef2(this);
    }

    get_device_list = () => {
        this.props.dispatch({
            type: "ci0101Info/getDeviceList",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                net_type: this.state.net_type || "",
                name: this.state.name || "",
                status: this.state.status || "",
            }
        })
    };

    handleSelectStatus = (value) => {
        this.setState({
            status:value||"",
        },()=>{
            this.props.dispatch({
                type: "ci0101Info/getDeviceList",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    net_type: this.state.net_type || "",
                    name: this.state.name || "",
                    status: this.state.status || "",
                }
            })
        })
    };
    handleSelectType = (value) => {
        this.setState({
            net_type:value||'',
        },()=>{
            this.props.dispatch({
                type: "ci0101Info/getDeviceList",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    net_type: this.state.net_type || "",
                    name: this.state.name || "",
                    status: this.state.status || "",
                }
            })
        })
    };
    handleSubmit = (value) => {
        this.setState({
            name:value,
        },()=>{
            this.props.dispatch({
                type: "ci0101Info/getDeviceList",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    net_type: this.state.net_type || "",
                    name: this.state.name || "",
                    status: this.state.status || "",
                }
            })
        })
    };
    handleAlertModalShow = (record) => {
        this.props.dispatch({
            type: "ci0101Info/get_alarm_list",
            payload: {
                sn: record.sn,
                begin_time: moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss"),
                end_time: moment().format("YYYY-MM-DD HH:mm:ss")
            }
        })
    };

    handleCloseAlertModal = () => {
        this.props.dispatch({
            type:"ci0101Info/closeAlertModal"
        })
    };


    render() {
        const columns = [{
            title: "@设备名称",
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <Link
                    to={{
                        pathname: "/main/mi0101/mi0102",
                        search: "?id=" + record.id + "&sn=" + record.sn+"&type="+record.type+"&from=device"
                    }}>{record.name}</Link>
            }
        }, {
            title:"@设备状态",
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title:"@节点名称",
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: "@硬件ID",
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: "@24小时告警",
            dataIndex: 'alert',
            key: 'alert',
            align:"center",
            render: (index, record) => {
                return <a><Icon className="common-link-icon" type="exception" onClick={()=>this.handleAlertModalShow(record)}/></a>
            }
        }, ];
        const pagination = {
            pageSize: 20
        };
        const option = [
            <Option value="ONLINE" key="ONLINE">{"@在线"}</Option>,
            <Option value="INIT" key="INIT">{"@未激活"}</Option>,
            <Option value="OFFLINE" key="OFFLINE">{"@离线"}</Option>
        ];
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
        ];
        return (
            <div>
                <HeaderBar hasAdd={false} hasDelete={false} hasUpload={false} hasSearch={true}
                           hasSelect={true} selectPlaceHolder={"@请选择状态"}
                           selectOneMethod={this.handleSelectStatus}
                           submit={this.handleSubmit} options={option}/>
                <BossTable pagination={pagination} columns={columns} dataSource={this.props.ci0101Info.deviceData}/>
                <Modal maskClosable={false} visible={this.props.ci0101Info.alertModalShow} onCancel={this.handleCloseAlertModal} title="@24小时警报"
                       size="middle" bordered>
                    <BossTable columns={alertColumns} dataSource={this.props.ci0101Info.alarmList}/>
                </Modal>
            </div>
        )
    }
}

function mapDispatchToProps({ci0101Info}) {
    return {ci0101Info};
}

export default connect(mapDispatchToProps)(injectIntl(Device));