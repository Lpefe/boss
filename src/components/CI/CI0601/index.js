/*@客户-QoS配置*/
import React from 'react';
import './index.scss';
import {Modal, Switch, Select, Card} from 'antd';
import PriorityRatioSetup from './subComponents/PriorityRatioSetup'
import HeaderBar from "../../Common/HeaderBar";
import Operations from "../../Common/Operations";
import BossTable from "../../Common/BossTable";
import BossEditModal from "../../Common/BossEditModal";
import {validateIp, validatePort} from "../../../utils/commonUtilFunc";
import LTEPrioritySetup from './subComponents/LTEPrioritySetup';
import {BossMessage} from "../../Common/BossMessages";
import {injectIntl} from "react-intl";

const Option = Select.Option;

class CI0601 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appConfigId: "",
            editModalShow: false,
            editRecord: {},
            selectedIds: [],
            is_active: "",
            name: "",
            srcIpType: "1",
            ipType: "1",
            portType: "1",
            hasPort: "1",
            selectedRecords: [],
        }
    }

    componentDidMount() {
        this.getAppConfigList();
        this.get_app_priority();
        this.get_ip_groups();
        this.get_port_groups();
        this.get_lte_allowed();
    }

    getAppConfigList=()=>{
        this.props.dispatch({
            type: "ci0601Info/getAppConfigList",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                name:this.state.name,
                is_active:this.state.is_active
            }
        })
    };

    get_app_priority=()=>{
        this.props.dispatch({
            type: "ci0601Info/get_app_priority",
            payload: {
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    get_lte_allowed=()=>{
        this.props.dispatch({
            type: "ci0601Info/get_lte_allowed",
            payload: {
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    get_ip_groups=()=>{
        this.props.dispatch({
            type: "ci0601Info/get_ip_groups",
            payload: {
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    get_port_groups=()=>{
        this.props.dispatch({
            type: "ci0601Info/get_port_groups",
            payload: {
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };
    addAppConfig = () => {
        let vm = this;
        this.setState({
            editModalShow: true
        });
        setTimeout(function () {
            vm.setState({
                srcIpType: "1",
                ipType: "1",
                portType: "1",
                hasPort: "1",
            })
        }, 0)
    };

    editAppConfig = (record) => {
        let vm = this;
        this.setState({
            editModalShow: true,
            appConfigId: record.id,
            editRecord: record,
        });
        setTimeout(function () {
            vm.setState({
                srcIpType: record.srcIpType,
                ipType: record.ipType,
                portType: record.portType,
                hasPort: record.hasPort
            })
        }, 0)//这三个参数控制表单的两类输入项的切换,因为setState的异步属性,如果写在一个setState中可能在打开modal之后才会切换type,导致validator报错,故使用setTimeout保证执行顺序,可能把这三个参数写在modal里会好一点.
    };

    cancelModal = () => {
        this.setState({
            editModalShow: false,
            appConfigId: "",
            editRecord: {}
        })
    };


    deleteAppConfig = (record) => {
        if (record.is_active) {
            BossMessage(false,"@删除失败:仅能删除禁用状态应用配置");
        } else {
            this.props.dispatch({
                type: "ci0601Info/deleteAppConfig",
                payload: {
                    ids: [record.id],
                    records: [record]
                }
            })
        }
    };

    switchStatus = (checked, record) => {
        let vm = this;
        Modal.confirm({
            title: '@确认要修改所选中QoS状态吗?',
            onOk() {
                vm.props.dispatch({
                    type: "ci0601Info/switchStatus",
                    payload: {
                        is_active: checked,
                        id: record.id,
                        record:record
                    }
                })
            },
            onCancel() {
            },
        });
    };

    delete = () => {
        this.props.dispatch({
            type: "ci0601Info/deleteAppConfig",
            payload: {
                ids: this.state.selectedIds,
                company_id: sessionStorage.getItem("companyId"),
                records: this.state.selectedRecords
            }
        })
    };

    searchAppConfig = (value) => {
        this.setState({
            name: value
        }, ()=> {
            this.getAppConfigList();
        })

    };
    selectStatus = (value) => {
        this.setState({
            is_active: value === undefined ? "" : value
        }, ()=> {
            this.getAppConfigList();
        })
    };

    batch_change_app_activity_off = () => {
        this.props.dispatch({
            type: "ci0601Info/batch_change_app_activity",
            payload: {
                ids: this.state.selectedIds,
                company_id: sessionStorage.getItem("companyId"),
                is_active: false,
                records: this.state.selectedRecords
            }
        })
    };

    batch_change_app_activity_on = () => {
        this.props.dispatch({
            type: "ci0601Info/batch_change_app_activity",
            payload: {
                ids: this.state.selectedIds,
                company_id: sessionStorage.getItem("companyId"),
                is_active: true,
                records: this.state.selectedRecords
            }
        })
    };

    render() {
        const columns = [{
            title: '@应用名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title:'@源IP地址',
            dataIndex: 'srcip_rule',
            key: 'srcip_rule',
            render: (index, record) => {
                if (record.srcip_group.length > 0) {
                    return record.srcip_group_names.join(',')
                } else {
                    return record.srcip_rule
                }

            }
        }, {
            title:'@目的IP地址',
            dataIndex: 'ip_rule',
            key: 'ip_rule',
            render: (index, record) => {
                if (record.ip_group.length > 0) {
                    return record.ip_group_names.join(',')
                } else {
                    return record.ip_rule
                }
            }
        }, {
            title:'@目的端口号',
            dataIndex: 'ports',
            key: 'ports',
            render: (index, record) => {
                if (record.port_group.length > 0) {
                    return record.port_group_names.join(',')
                } else {
                    if (record.ports) {
                        return record.ports
                    } else {
                        return ""
                    }
                }
            }
        }, {
            title: '@协议',
            dataIndex: 'protocol',
            key: 'protocol',
        }, {
            title: '@应用级别',
            dataIndex: 'priority',
            key: 'priority',
            render: (index, record) => {
                switch (record.priority) {
                    case "urgent":
                        return <span>{"@紧急"}</span>;
                    case "high":
                        return <span>{"@高"}</span>;
                    case "medium":
                        return <span>{"@中"}</span>;
                    case "low":
                        return <span>{"@低"}</span>;
                    default:
                        return <span>{record.priority}</span>
                }
            }
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render: (index, record) => {
                return <Switch checkedChildren={'@启用'} unCheckedChildren={"@禁用"}
                               checked={record.is_active}
                               onChange={(checked) => this.switchStatus(checked, record)}/>
            }
        }, {
            title: '@优先走MPLS线路',
            dataIndex: 'is_mpls',
            key: 'is_mpls',
            render: (index, record) => {
                return (
                    <span>{record.is_mpls === 0 ? <span style={{color: '#000'}}>{"@否"}</span> :
                        <span style={{color: '#23871e'}}>{"@是"}</span>}</span>
                )
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            align: "center",
            fixed:'right',
            render: (index, record) => {
                return (
                    <Operations hasEdit={true} hasDelete={true} edit={() => this.editAppConfig(record)}
                                delete={() => this.deleteAppConfig(record)}/>
                )
            }
        }];


        const pagination = {
            pageSize: 20
        };

        const rowSelection = {
            fixed: 'left',
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords,
                })
            }
        };
        const options = [<Option key="1" value={1}>{"@启用"}</Option>,
            <Option key="0" value={0}>{"@禁用"}</Option>];
        const ModalOptions = {
            title: this.state.appConfigId ? "@编辑应用配置" : "@新增应用配置",
            visible: this.state.editModalShow,
            onCancel: this.cancelModal,
            dispatch: this.props.dispatch,
            submitType: this.state.appConfigId ? "ci0601Info/editAppConfig" : "ci0601Info/createAppConfig",
            extraUpdatePayload: {company_id: sessionStorage.getItem("companyId"), id: this.state.appConfigId,},
            initialValues: this.state.appConfigId?Object.assign({}, this.state.editRecord):{srcIpType:'1',ipType:'1',portType:'1'},
            initPayload: {
                company_id: sessionStorage.getItem("companyId")
            },
            InputItems: [{
                type: "Input",
                labelName: "@应用名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入应用名称"
                },
                rules: [{required: true, message: "@请输入应用名称"}, {
                    max: 50,
                    message: "@应用名称最多输入50字符"
                }],
            }, {
                type: "Select",
                labelName: "@协议",
                valName: "protocol",
                nativeProps: {
                    placeholder: "@请选择协议",
                },
                rules: [{required: true, message: "@请选择协议"}],
                children: [{key: "IP", value: "IP", name: "IP"}, {key: "TCP", value: "TCP", name: "TCP"}, {
                    key: "UDP",
                    value: "UDP",
                    name: "UDP"
                }, {key: "ICMP", value: "ICMP", name: "ICMP"}],
                onChange: (value) => {
                    if (value === "IP" || value === "ICMP") {
                        this.setState({
                            hasPort: "0"
                        })
                    } else {
                        this.setState({
                            hasPort: "1"
                        })
                    }
                }
            }, {
                type: "Radio",
                labelName: "@源IP地址",
                valName: "srcIpType",
                nativeProps: "",
                rules: [{required: true}],
                children: [{key: "1", value: "1", name: "@IP段"}, {
                    key: "2",
                    value: "2",
                    name: "@IP组"
                }],
                onChange: (e) => {
                    this.setState({
                        srcIpType: e.target.value,
                    })
                }
            }, this.state.srcIpType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "srcip_rule",
                nativeProps: {
                    placeholder:"@请输入源IP"
                },
                rules: [{required: true, message: "@请输入源IP"}, {validator: validateIp}],
            } : {
                type: "Select",
                labelName: "",
                valName: "srcip_group",
                nativeProps: {
                    placeholder:"@请选择源IP组",
                    mode: "multiple"
                },
                rules: [{required: true, message: "@请选择源IP组"}],
                children: this.props.ci0601Info.ipGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })
            }, {
                type: "Radio",
                labelName: "@目的IP地址",
                valName: "ipType",
                nativeProps: "",
                rules: [{required: true}],
                children: [{key: "1", value: "1", name: "@IP段"}, {key: "2", value: "2", name: "@IP组"}],
                onChange: (e) => {
                    this.setState({
                        ipType: e.target.value,
                    })
                }
            }, this.state.ipType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "ip_rule",
                nativeProps: {
                    placeholder: "@请输入目标IP"
                },
                rules: [{required: true, message: "@请输入目标IP"}, {validator: validateIp}],
            } : {
                type: "Select",
                labelName: "",
                valName: "ip_group",
                nativeProps: {
                    placeholder: "@请选择目标IP组",
                    mode: "multiple"
                },
                rules: [{required: true, message: "@请选择目标IP组"}],
                children: this.props.ci0601Info.ipGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })
            }, this.state.hasPort === "1" ? {
                type: "Radio",
                labelName: "@目的端口号",
                valName: "portType",
                nativeProps: "",
                rules: [{required: true}],
                children: [{key: "1", value: "1", name: "@Port段"}, {
                    key: "2",
                    value: "2",
                    name: "@Port组"
                }],
                onChange: (e) => {
                    this.setState({
                        portType: e.target.value,
                    })
                }
            } : "", this.state.hasPort === "1" ? this.state.portType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "ports",
                nativeProps: {
                    placeholder: "@请输入目标端口"
                },
                rules: [{required: true, message: "@请输入目标端口"}, {validator: validatePort}],
            } : {
                type: "Select",
                labelName: "",
                valName: "port_group",
                nativeProps: {
                    placeholder: "@请选择目标端口组",
                    mode: "multiple"
                },
                rules: [{required: true, message: "@请选择目标端口组"}],
                children: this.props.ci0601Info.portGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })
            } : "", {
                type: "Select",
                labelName: "@应用级别",
                valName: "priority",
                nativeProps: {
                    placeholder: "@请选择应用级别",
                },
                rules: [{required: true, message: "@请选择应用级别"}],
                children: [
                    {key: "urgent", value: "urgent", name: "@紧急"},
                    {key: "high", value: "high", name: "@高"},
                    {key: "medium", value: "medium", name: "@中"},
                    {key: "low", value: "low", name: "@低"}
                ]
            }, {
                type: "Select",
                labelName: "@MPLS优先",
                valName: "is_mpls",
                nativeProps: {
                    placeholder: "@请选择是否优先走MPLS线路",
                },
                rules: [{required: true, message: "@请选择是否优先走MPLS线路"}],
                children: [{key: "0", value: 0, name: "@否"},
                    {key: "1", value: 1, name: "@是"}]
            },]
        };
        return (
            <div>
                <Card className="card">
                    <PriorityRatioSetup/><LTEPrioritySetup/>
                </Card>
                <Card className="card">
                    <HeaderBar selectedKeys={this.state.selectedIds} hasDelete={true} hasSearch={true} hasAdd={true}
                               add={this.addAppConfig} delete={this.delete} submit={this.searchAppConfig} se
                               hasSelect={true} selectOneMethod={this.selectStatus} options={options}
                               selectPlaceHolder={'@请选择状态'} hasExtraBtn={true}
                               extraBtnName={"@批量禁用"} hasExtraBtnTwo={true}
                               extraBtnNameTwo={"@批量启用"}
                               extraConfirmMethod={this.batch_change_app_activity_off}
                               extraConfirmMethodTwo={this.batch_change_app_activity_on}
                               confirmContent={"@禁用后的应用仍可在Qos列表中查看和启用"}
                               confirmContentTwo={"@启用后的Qos在列表中将显示为启用状态"}
                               confirmTitle={"@确认要禁用所选中的QoS吗?"}
                               confirmTitleTwo={"@确认要启用所选中QoS吗?"}
                    />
                    <BossTable pagination={pagination} columns={columns}
                               dataSource={this.props.ci0601Info.dataSource} rowSelection={rowSelection}/>
                    <BossEditModal {...ModalOptions}/>
                </Card>
            </div>
        )
    }
}

export default injectIntl(CI0601);