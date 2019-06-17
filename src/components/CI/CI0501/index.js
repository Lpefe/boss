/*@客户-安全配置*/
import React from 'react';
import './index.scss';
import {Switch, Select, Modal, Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import Operations from "../../Common/Operations";
import BossTable from "../../Common/BossTable";
import BossEditModal from '../../Common/BossEditModal';
import {validateIp, validatePort} from "../../../utils/commonUtilFunc";
import messages from './LocaleMsg/messages';
import {injectIntl} from 'react-intl';
import {BossMessage} from "../../Common/BossMessages";

const Option = Select.Option;

class CI0501 extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            room_id: "",
            name: "", 
            aclConfigId: "",
            editModalShow: false,
            editRecord: {},
            selectedIds: [],
            selectedRecords:[],
            srcIpType: "1",
            dstIpType: "1",
            srcPortType: "1",
            dstPortType: "1",
            hasPort: "1",
        }
    }

    componentDidMount() {
        this.getAclConfigList();
        this.get_ip_groups();
        this.get_port_groups();
    }

    getAclConfigList=()=>{
        this.props.dispatch({
            type:"ci0501Info/getAclConfigList",
            payload:this.state.is_active === undefined ? {
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.name,
            } : {
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.name,
                is_active: this.state.is_active,
            }
        })
    };

    get_ip_groups=()=>{
        this.props.dispatch({
            type:"ci0501Info/get_ip_groups",
            payload:{
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    get_port_groups=()=>{
        this.props.dispatch({
            type:"ci0501Info/get_port_groups",
            payload:{
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };


    addAclConfig = () => {
        let vm = this;
        this.setState({
            editModalShow: true
        });
        setTimeout(function () {
            vm.setState({
                srcIpType: "1",
                dstIpType: "1",
                srcPortType: "1",
                dstPortType: "1",
                hasPort: "1",
            })
        }, 0)

    };

    editAclConfig = (record) => {
        let vm = this;
        this.setState({
            editModalShow: true,
            aclConfigId: record.id,
            editRecord: record,
        });
        setTimeout(function () {
            vm.setState({
                srcIpType: record.srcIpType,
                dstIpType: record.dstIpType,
                srcPortType: record.srcPortType,
                dstPortType: record.dstPortType,
                hasPort: record.hasPort,
            })
        }, 0)//这四个参数控制表单的两类输入项的切换,因为setState的异步属性,如果写在一个setState中可能在打开modal之后才会切换type,导致validator报错,故使用setTimeout保证执行顺序,可能把这三个参数写在modal里会好一点.
    };

    cancelModal = () => {
        this.props.form.resetFields();
        this.setState({
            editModalShow: false,
            aclConfigId: "",
            editRecord: {},
        })
    };


    deleteAclConfig = (record) => {
        if (record.is_active) {
            BossMessage(false, "@删除失败:仅能删除禁用状态安全配置")
        } else {
            this.props.dispatch({
                type: "ci0501Info/deleteAclConfig",
                payload: {
                    ids: [record.id],
                    company_id: sessionStorage.getItem("companyId"),
                    records:[record]
                }
            })
        }

    };

    searchAclConfig = (value) => {
        this.setState({
            name: value || "",
        }, ()=> {
            this.getAclConfigList();
        })

    };

    handleSelectStatus = (value) => {
        this.setState({
            is_active: value
        },  ()=> {
            this.getAclConfigList();
        })
    };
    switchStatus = (checked, record) => {
        let vm = this;
        Modal.confirm({
            title: '@确认要修改所选中安全配置吗?',
            onOk() {
                vm.props.dispatch({
                    type: "ci0501Info/switchStatus",
                    payload: {
                        is_active: checked,
                        id: record.id,
                        record:record,
                    }
                })
            },
            onCancel() {

            },
        });

    };

    deleteAclConfigBatch = () => {
        this.props.dispatch({
            type: "ci0501Info/deleteAclConfig",
            payload: {
                ids: this.state.selectedIds,
                company_id: sessionStorage.getItem("companyId"),
                records:this.state.selectedRecords,
            }
        })
    };

    batch_change_acl_activity_on = () => {
        this.props.dispatch({
            type: "ci0501Info/batch_change_acl_activity",
            payload: {
                ids: this.state.selectedIds,
                company_id: sessionStorage.getItem("companyId"),
                is_active: true,
                records:this.state.selectedRecords,
            }
        })
    };

    batch_change_acl_activity_off = () => {
        this.props.dispatch({
            type: "ci0501Info/batch_change_acl_activity",
            payload: {
                ids: this.state.selectedIds,
                company_id: sessionStorage.getItem("companyId"),
                is_active: false,
                records:this.state.selectedRecords,
            }
        })
    };

    render() {
        const columns = [{
            title: "@优先级",
            dataIndex: 'priority',
            key: 'priority',
            width: 75,
        }, {
            title: "@策略名称",
            dataIndex: 'name',
            key: 'name',
            width: 250
        }, {
            title: "@源IP地址",
            dataIndex: 'src_ip_rule',
            key: 'src_ip_rule',
            render: (index, record) => {
                if (record.src_ip_group.length > 0) {
                    return record.src_ip_group_names.join(',')
                } else {
                    return record.src_ip_rule
                }
            }
        }, {
            title: "@目的IP地址",
            dataIndex: 'dst_ip_rule',
            key: 'dst_ip_rule',
            render: (index, record) => {
                if (record.dst_ip_group.length > 0) {
                    return record.dst_ip_group_names.join(',')
                } else {
                    return record.dst_ip_rule;
                }
            }
        }, {
            title: "@源端口号",
            dataIndex: 'src_port',
            key: 'src_port',
            width: 100,
            render: (index, record) => {
                if (record.src_port_group.length > 0) {
                    return record.src_port_group_names.join(',')
                } else {
                    return record.src_port
                }
            }
        }, {
            title: "@目的端口号",
            dataIndex: 'dst_port',
            key: 'dst_port',
            width: 100,
            render: (index, record) => {
                if (record.dst_port_group.length > 0) {
                    return record.dst_port_group_names.join(',')
                } else {
                    return record.dst_port
                }
            }
        }, {
            title:"@协议",
            dataIndex: 'protocol',
            key: 'protocol',
            width: 75,
        }, {
            title: "@动作",
            dataIndex: 'action',
            key: 'action',
            width: 75,
        }, {
            title:"@状态",
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (index, record) => {
                return <Switch checkedChildren={"@开启"} unCheckedChildren={"@关闭"}
                               checked={record.is_active}
                               onChange={(checked) => this.switchStatus(checked, record)}/>
            }
        }, {
            title: "@操作",
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            fixed:'right',
            align: "center",
            render: (index, record) => {
                return (
                    <Operations hasExtra={false} hasDelete={true} hasEdit={true}
                                edit={() => this.editAclConfig(record)} delete={() => this.deleteAclConfig(record)}/>
                )
            }
        }];


        const pagination = {
            pageSize: 20
        };

        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys,selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords:selectedRecords
                })
            }
        };
        const options = [
            <Option key="1" value={1}>{'@启用'}</Option>,
            <Option key="0" value={0}>{'@禁用'}</Option>
        ];

        const ModalOptions = {
            title: this.state.aclConfigId ? "@编辑应用配置" : "@新增应用配置",
            visible: this.state.editModalShow,
            onCancel: this.cancelModal,
            dispatch: this.props.dispatch,
            submitType: this.state.aclConfigId ? "ci0501Info/editAclConfig" : "ci0501Info/createAclConfig",
            extraUpdatePayload: {company_id: sessionStorage.getItem("companyId"), id: this.state.aclConfigId,},
            initialValues: this.state.aclConfigId?Object.assign({}, this.state.editRecord):{srcIpType:'1',srcPortType:'1',dstIpType:'1',dstPortType:'1'},
            initPayload: {
                company_id: sessionStorage.getItem("companyId")
            },
            InputItems: [{
                type: "InputNumber",
                labelName:"@优先级",
                valName: "priority",
                nativeProps: {
                    placeholder: "@请输入优先级",//priorityInput
                    min: 1,
                    max: 65535,
                    style: {width: 130}
                },
                rules: [{required: true, message: "@请输入优先级"}],
            }, {
                type: "Input",
                labelName: "@策略名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入策略名称"
                },
                rules: [{required: true, message:  "@请输入策略名称"}, {
                    max: 50,
                    message: "@策略名称最大输入50字符"
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
                nativeProps: {},
                rules: [{required: true}],
                children: [{key: "1", value: "1", name: "@IP段"}, {key: "2", value: "2", name: "@IP组"}],
                onChange: (e) => {
                    this.setState({
                        srcIpType: e.target.value,
                    })
                }
            }, this.state.srcIpType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "src_ip_rule",
                nativeProps: {
                    placeholder:"@请输入源IP地址"
                },
                rules: [{required: true, message:"@请输入源IP地址"}, {validator: validateIp}],
            } : {
                type: "Select",
                labelName: "",
                valName: "src_ip_group",
                nativeProps: {
                    placeholder: "@请选择源IP组",
                    mode: "multiple"
                },
                rules: [{required: true, message: "@请选择源IP组"}],
                children: this.props.ci0501Info.ipGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })
            }, this.state.hasPort === "1" ? {
                type: "Radio",
                labelName:"@源端口号",
                valName: "srcPortType",
                nativeProps: {},
                rules: [{required: true}],
                children: [{key: "1", value: "1", name: "@Port段"}, {
                    key: "2",
                    value: "2",
                    name: "@Port组"
                }],
                onChange: (e) => {
                    this.setState({
                        srcPortType: e.target.value,
                    })
                }
            } : {}, this.state.hasPort === "1" ? this.state.srcPortType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "src_port",
                nativeProps: {
                    placeholder: "@请输入源端口"
                },
                rules: [{required: true, message: "@请输入源端口"}, {validator: validatePort}],
            } : {
                type: "Select",
                labelName: "",
                valName: "src_port_group",
                nativeProps: {
                    placeholder: "@请选择源端口组",
                    mode: "multiple"
                },
                rules: [{required: true, message: "@请选择源端口组"}],
                children: this.props.ci0501Info.portGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })
            } : {}, {
                type: "Radio",
                labelName:"@目的IP地址",
                valName: "dstIpType",
                nativeProps: {},
                rules: [{required: true}],
                children: [{key: "1", value: "1", name: "@IP段"}, {key: "2", value: "2", name:"@IP组"}],
                onChange: (e) => {
                    this.setState({
                        dstIpType: e.target.value,
                    })
                }
            }, this.state.dstIpType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "dst_ip_rule",
                nativeProps: {
                    placeholder:"@请输入目标IP/IP段"
                },
                rules: [{required: true, message:"@请输入目标IP/IP段"}, {validator: validateIp}],
            } : {
                type: "Select",
                labelName: "",
                valName: "dst_ip_group",
                nativeProps: {
                    placeholder: "@请选择目标IP组",
                    mode: "multiple"
                },
                rules: [{required: true, message: "@请选择目标IP组",}],
                children: this.props.ci0501Info.ipGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })

            }, this.state.hasPort === "1" ? {
                type: "Radio",
                labelName:"@目的端口号",//dstPort
                valName: "dstPortType",
                nativeProps: {},
                rules: [{required: true}],
                children: [{key: "1", value: "1", name:"@Port段"}, {key: "2", value: "2", name:"@Port组"}],
                onChange: (e) => {
                    this.setState({
                        dstPortType: e.target.value,
                    })
                }
            } : {}, this.state.hasPort === "1" ? this.state.dstPortType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "dst_port",
                nativeProps: {
                    placeholder: "@请输入目标端口"//dstPortInput
                },
                rules: [{required: true, message: "@请输入目标端口"}, {validator: validatePort}],
            } : {
                type: "Select",
                labelName: "",
                valName: "dst_port_group",
                nativeProps: {
                    placeholder: "@请选择目标端口组",
                    mode: "multiple"
                },
                rules: [{required: true, message: "@请选择目标端口组"}],
                children: this.props.ci0501Info.portGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })

            } : {}, {
                type: "Select",
                labelName: "@动作",
                valName: "action",
                nativeProps: {
                    placeholder:"@动作",
                },
                rules: [{required: true, message: "@动作",}],
                children: [
                    {key: "ACCEPT", value: "ACCEPT", name: "ACCEPT"}, {key: "DROP", value: "DROP", name: "DROP"}
                ]
            },]
        };

        return (

            <Card className="card">
                <HeaderBar hasAdd={true} hasDelete={true} hasSearch={true} hasSelect={true} selectPlaceHolder='@请选择状态'
                           add={this.addAclConfig} submit={this.searchAclConfig}
                           selectOneMethod={this.handleSelectStatus} options={options}
                           delete={this.deleteAclConfigBatch} selectedKeys={this.state.selectedIds} hasExtraBtn={true}
                           extraBtnName={"@批量禁用"} hasExtraBtnTwo={true}
                           extraBtnNameTwo={"@批量启用"}
                           extraConfirmMethodTwo={this.batch_change_acl_activity_on}
                           extraConfirmMethod={this.batch_change_acl_activity_off}
                           confirmTitle={"@确认要禁用选中的安全配置吗?"} confirmContent="" confirmContentTwo=""
                           confirmTitleTwo={"@确认要启用选中的安全配置吗"}
                />
                <BossTable pagination={pagination} columns={columns}
                           dataSource={this.props.ci0501Info.dataSource} rowSelection={rowSelection}/>
                <BossEditModal {...ModalOptions}/>
            </Card>
        )
    }
}

export default injectIntl(CI0501);