/*@客户-LAN模板*/
import React from 'react';
import {Card, Icon, Popconfirm, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import './index.scss';
import BossEditModal from "../../Common/BossEditModal";
import ARPModal from "./subComponents/ARPModal";
import {injectIntl} from "react-intl";

const Option = Select.Option;

class CI3301 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            status: "",
            visible: false,
            DHCPvisible: false,
            editRecord: {},
            DHCPRecord: {},
            DHCPid: "",
            ARPvisible: false,
            ARPRecord: {},
            ARPid: "",
            editId: "",
            disabled: false,
            selectName: "",
            band: "",
            payloadCompanyId: "",
            company_id: sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxptechadmin" ? "" : parseInt(sessionStorage.getItem("companyId")),
            dhcpOn: true
        };
        this.isTech = sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxptechadmin"

    }

    componentDidMount() {
        this.get_lan_template();
        this.getCompanyList()
    }

    get_lan_template = () => {
        this.props.dispatch({
            type: "ci3301Info/get_lan_template",
            payload: {
                name: this.state.selectName,
                company_id: this.state.company_id
            }
        });
    }

    handleOpenAdd = () => {
        this.setState({
            visible: true,
        })
    }
    gotoDHCP = (record) => {
        this.setState({
            DHCPvisible: true,
            DHCPRecord: record,
            DHCPid: record.id,
            dhcpOn: record.dhcp_is_active
        })
    }
    gotoARP = (record) => {
        this.setState({
            ARPvisible: true,
            ARPRecord: record,
            ARPid: record.id
        }, () => {
            this.get_static_ip()
        })
    }
    get_static_ip = () => {
        this.props.dispatch({
            type: "ci3301Info/get_static_ip",
            payload: {
                net_id: this.state.ARPid
            }
        })
    }
    search = (value) => {
        this.setState({
            selectName: value || ""
        }, () => {
            this.get_lan_template()
        })
    };
    getCompanyList = () => {
        this.props.dispatch({
            type: "ci3301Info/get_company_list",
            payload: {}
        });
    }
    coppy = (record) => {
        this.props.dispatch({
            type: "ci3301Info/duplicate_wifi_template",
            payload: {
                data: {id: record.id},
                init: {selectName: this.state.selectName}
            }
        })
    }
    edit = (record) => {
        this.setState({
            visible: true,
            editRecord: record,
            editId: record.id,
        })
    }
    closeAddModal = () => {
        this.setState({
            visible: false,
            editRecord: {},
            editId: "",
            disabled: false,
        }, () => {
            this.get_lan_template()
        })
    }
    closeDHCPModal = () => {
        this.setState({
            DHCPvisible: false,
            DHCPRecord: {},
            DHCPid: ""
        }, () => {
            this.get_lan_template()
        })
    }
    closeARPModal = () => {
        this.setState({
            ARPvisible: false,
            ARPPRecord: {},
            ARPid: ""
        }, () => {
            this.get_lan_template()
        })
    }
    delete = (record) => {
        this.props.dispatch({
            type: "ci3301Info/delete_lan_template",
            payload: {
                init: {
                    ids: [record.id],
                    record: [record],
                    selectName: this.state.selectName,
                    companyId: this.state.company_id
                },
            }
        })
    };
    handleSelectCompany = (value) => {
        this.setState({
            company_id: value || "",
        }, () => {
            this.get_lan_template();
        })
    };
    onRef = (ignoreModalComponent) => {
        this.ignoreModalComponent = ignoreModalComponent;
    };
    isEqualIPAddress = (rule, value, callback) => {
        let mask = this.state.DHCPRecord.net_mask
        let ip = this.state.DHCPRecord.ip
        this.props.dispatch({
            type: "ci3301Info/get_start_end_ip",
            payload: {
                ip: ip,
                net_mask: mask
            }
        }).then(() => {
            let ipPool = this.props.ci3301Info.ipPool
            let that = this.ignoreModalComponent.props.form
            let addr = that.getFieldValue("dhcp_ip_pool")
            console.log(addr)
            console.log(ipPool)
            if (ipPool) {
                var arr = addr.split('-')
                var regNum = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))-((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
                if (regNum.test(addr)) {
                    if (!arr[0] || !arr[1] || !ipPool[0] || !ipPool[1]) {
                        return false;
                    }
                    let addr1 = arr[0].split(".");
                    let addr2 = arr[1].split(".");
                    let ipPool1 = ipPool[0].split(".")
                    let ipPool2 = ipPool[1].split(".")
                    let ip = this.state.DHCPRecord.ip.split(".")
                    if (parseInt(addr1[0]) <= parseInt(ip[0]) && (addr1[1]) <= parseInt(ip[1]) && (addr1[2]) <= parseInt(ip[2]) && (addr1[3]) <= parseInt(ip[3]) &&
                        parseInt(addr2[0]) >= parseInt(ip[0]) && parseInt(addr2[1]) >= parseInt(ip[1]) && parseInt(addr2[2]) >= parseInt(ip[2]) && parseInt(addr2[3]) >= parseInt(ip[3])) {
                        return callback('IP的池范围不能包含网关地址')
                    } else {
                        if (parseInt(addr1[0]) >= parseInt(ipPool1[0]) && (addr1[1]) >= parseInt(ipPool1[1]) && (addr1[2]) >= parseInt(ipPool1[2]) && (addr1[3]) >= parseInt(ipPool1[3]) &&
                            parseInt(addr2[0]) <= parseInt(ipPool2[0]) && parseInt(addr2[1]) <= parseInt(ipPool2[1]) && parseInt(addr2[2]) <= parseInt(ipPool2[2]) && parseInt(addr2[3]) <= parseInt(ipPool2[3])) {
                            if (parseInt(addr1[0]) <= parseInt(addr2[0]) && parseInt(addr1[1]) <= parseInt(addr2[1]) && parseInt(addr1[2]) <= parseInt(addr2[2]) && parseInt(addr1[3]) < parseInt(addr2[3])) {
                                return callback();
                            } else {
                                return callback('IP的范围前面的值应小于后面的值')
                            }
                        } else {
                            return callback('IP池范围' + this.props.ci3301Info.ipPool[0] + '-' + this.props.ci3301Info.ipPool[1])
                        }
                    }
                } else {
                    //return callback("IP池格式例如：192.168.1.1-192.168.1.30");
                    return callback('IP池范围' + this.props.ci3301Info.ipPool[0] + '-' + this.props.ci3301Info.ipPool[1])
                }
            }
        });
    }

    render() {
        const option = this.props.ci3301Info.companyList.map((item) => {
            return <Option key={item.id} value={item.id}>{item.company_abbr}</Option>
        });
        const ModalOptions = {
            title: this.state.editId ? "@编辑" : "@新增",
            visible: this.state.visible,
            initialValues: this.state.editId ? this.state.editRecord : {dhcp_is_active: true},
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci3301Info/update_lan_template" : "ci3301Info/create_lan_template",
            onCancel: this.closeAddModal,
            bodyHeight: 350,
            extraUpdatePayload: {
                id: this.state.editId,
                company_id: this.state.payloadCompanyId ? this.state.payloadCompanyId : this.state.company_id
            },
            initPayload: {selectName: this.state.selectName,},
            InputItems: this.isTech ? [{
                type: "Select",
                labelName: "@企业名称",
                valName: "company_id",
                nativeProps: {
                    placeholder: "@请选择企业",
                    disabled: this.state.editId !== "",
                },
                rules: [{required: true, message: "@请选择企业"}],
                children: this.props.ci3301Info.companyList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.company_abbr}
                    }
                }),
                onChange: (value, vm) => {
                    this.setState({
                            payloadCompanyId: value
                        }
                        // ,()=>{
                        //     this.get_lan_template()
                        // }
                    )
                }
            }, {
                type: "Input",
                labelName: "@网段名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入网段名称",
                    disabled: !!this.state.editId
                },
                rules: [{required: true, message: "@请输入网段名称"}, {max: 16, message: "@网段名称最多输入16字符"}],
            }, {
                type: "Input",
                labelName: "@IP地址",
                valName: "ip",
                nativeProps: {
                    placeholder: this.state.disabled ? "" : "@请输入IP地址",
                    disabled: this.state.disabled,
                },
                rules: [{required: true, message: "@请输入IP地址"}, {
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确IP格式"
                },],
            }, {
                type: "Input",
                labelName: "@掩码",
                valName: "net_mask",
                nativeProps: {
                    placeholder: this.state.disabled ? "" : "@请输入掩码",
                    disabled: this.state.disabled,
                },
                rules: [{required: true, message: "@请输入掩码"}, {
                    pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/,
                    message: "@请输入正确掩码格式"
                }],
            },
                // {
                //     type: "Select",
                //     labelName: "@访问互联网",
                //     valName: "internet_strategy",
                //     nativeProps: {
                //         placeholder:"@请选择认证方式"
                //     },
                //     rules: [{required: true, message: "@请选择认证方式"}],
                //     children:[{key: "1", value: "allowed", name: "允许"},
                //     {key: "2", value: "disallowed", name: "禁止"},
                //     {key: "3", value: "whitelist", name: "白名单"},
                //     {key: "4", value: "blacklist", name: "黑名单"},],
                // },
                // {
                //     type: "Radio",
                //     labelName: __(messages["DHCP服务"]),
                //     valName: "dhcp_is_active",
                //     nativeProps: {
                //         placeholder: __(messages["请选择DHCP服务"])
                //     },
                //     rules: [{required: true, message: __(messages["请选择VLAN"])}],
                //     children: [{value: true, name: "开启", key: "1"}, {value: false,name: "关闭",key: "0"}],
                // },
                {
                    type: "Input",
                    labelName: "@备注",
                    valName: "remark",
                    nativeProps: {
                        placeholder: "@请输入备注"
                    },
                    rules: [{required: false, message: "@请输入备注"}, {max: 64, message: "@备注最多输入64字符"}],
                },
            ] : [{
                type: "Input",
                labelName: "@网段名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入网段名称",
                    disabled: !!this.state.editId
                },
                rules: [{required: true, message: "请输入网段名称"}, {max: 16, message: "网段名称最多输入16字符"}],
            }, {
                type: "Input",
                labelName: "@IP地址",
                valName: "ip",
                nativeProps: {
                    placeholder: this.state.disabled ? "" : "@请输入IP地址",
                    disabled: this.state.disabled,
                },
                rules: [{required: true, message: "@请输入IP地址"}, {
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确IP格式"
                },],
            }, {
                type: "Input",
                labelName: "@掩码",
                valName: "net_mask",
                nativeProps: {
                    placeholder: this.state.disabled ? "" : "@请输入掩码",
                    disabled: this.state.disabled,
                },
                rules: [{required: true, message: "@请输入掩码"}, {
                    pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/,
                    message: "@请输入正确掩码格式"
                }],
            },
                // {
                //     type: "Select",
                //     labelName: "@访问互联网",
                //     valName: "internet_strategy",
                //     nativeProps: {
                //         placeholder:"@请选择认证方式"
                //     },
                //     rules: [{required: true, message: "@请选择认证方式"}],
                //     children:[{key: "1", value: "allowed", name: "允许"},
                //     {key: "2", value: "disallowed", name: "禁止"},
                //     {key: "3", value: "whitelist", name: "白名单"},
                //     {key: "4", value: "blacklist", name: "黑名单"},],
                // },
                // {
                //     type: "Radio",
                //     labelName: __(messages["DHCP服务"]),
                //     valName: "dhcp_is_active",
                //     nativeProps: {
                //         placeholder: __(messages["请选择DHCP服务"])
                //     },
                //     rules: [{required: true, message: __(messages["请选择VLAN"])}],
                //     children: [{value: true, name: "开启", key: "1"}, {value: false,name: "关闭",key: "0"}],
                // },
                {
                    type: "Input",
                    labelName: "@备注",
                    valName: "remark",
                    nativeProps: {
                        placeholder: "@请输入备注"
                    },
                    rules: [{required: false, message: "@请输入备注"}, {max: 64, message: "@备注最多输入64字符"}],
                },
            ]
        }
        const ModalDHCPOptions = {
            title: "@DHCP设置",
            visible: this.state.DHCPvisible,
            initialValues: this.state.DHCPRecord,
            dispatch: this.props.dispatch,
            submitType: "ci3301Info/update_lan_template",
            onCancel: this.closeDHCPModal,
            extraUpdatePayload: {id: this.state.DHCPid},
            initPayload: {selectName: this.state.selectName},
            InputItems: this.state.dhcpOn ? [{
                type: "Radio",
                labelName: "@DHCP服务",
                valName: "dhcp_is_active",
                nativeProps: {
                    placeholder: "@请选择DHCP"
                },
                rules: [{required: true, message: "@请选择DHCP"}],
                children: [{value: true, name: "@开启", key: "1"}, {value: false, name: "@关闭", key: "0"}],
                onChange: (value, vm) => {
                    this.setState({
                        dhcpOn: value.target.value
                    })
                }
            }, {
                type: "Input",
                labelName: "@IP池",
                valName: "dhcp_ip_pool",
                nativeProps: {
                    placeholder: "@请输入IP池",
                    disabled: !!this.state.editId
                },
                rules: [{required: true, message: "@请输入IP池"}, {validator: this.isEqualIPAddress}],
            }, {
                type: "InputNumber",
                labelName: "@租期" + "(h)",
                valName: "dhcp_lease_time",
                nativeProps: {
                    max: 48,
                    placeholder: this.state.disabled ? "" : "@请输入租期",
                    disabled: this.state.disabled,
                },
                rules: [{required: true, message: "请输入租期"}, {pattern: /^([1-9]|[1-4][0-8])$/, message: "租期配置范围为1-48h"}],
            },
                // {
                //     type: "Input",
                //     labelName: __(messages["子网掩码"]),
                //     valName: "net_mask",
                //     nativeProps: {
                //         placeholder: this.state.disabled?"":__(messages["请输入子网掩码"]),
                //         disabled:this.state.disabled,
                //     },
                //     rules: [{required:true, message:__(messages["请输入子网掩码"])},{
                //         pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/,
                //         message: __(messages["请输入正确的子网掩码格式"])
                //     }],
                // },
                {
                    type: "Input",
                    labelName: "@网关",
                    valName: "dhcp_gateway",
                    nativeProps: {
                        placeholder: this.state.disabled ? "" : "请输入网关",
                        disabled: true,

                    },
                    rules: [{required: true, message: "@请输入网关"}, {
                        pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                        message: "@请输入正确的网关格式"
                    }],
                }, {
                    type: "Input",
                    labelName: "@首选DNS",
                    valName: "dhcp_dns",
                    nativeProps: {
                        placeholder: this.state.disabled ? "" : "@请输入首选DNS",
                        disabled: this.state.disabled,
                    },
                    rules: [{
                        pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                        message: "@请输入正确的DNS格式"
                    }],
                }, {
                    type: "Input",
                    labelName: "@备用DNS",
                    valName: "dhcp_dns_backup",
                    nativeProps: {
                        placeholder: this.state.disabled ? "" : "@请输入备用DNS",
                        disabled: this.state.disabled,
                    },
                    rules: [{
                        pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                        message: "@请输入正确的DNS格式"
                    }],
                }, {
                    type: "Input",
                    labelName: "@DHCP选项",
                    valName: "dhcp_option",
                    nativeProps: {
                        placeholder: this.state.disabled ? "" : "@请输入DHCP选项",
                        disabled: this.state.disabled,
                        extra: '@例如设定 "6,192.168.1.1,192.168.1.2"'
                    }
                }
            ] : [{
                type: "Radio",
                labelName: "@DHCP服务",
                valName: "dhcp_is_active",
                nativeProps: {
                    placeholder: "@请选择DHCP"
                },
                rules: [{required: true, message: "@请选择DHCP"}],
                children: [{value: true, name: "@开启", key: "1"}, {value: false, name: "@关闭", key: "0"}],
                onChange: (value) => {
                    this.setState({
                        dhcpOn: value.target.value
                    })
                }
            }]
        };
        const columns = [{
            title: '@网段名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@IP地址',
            dataIndex: 'ip',
            key: 'ip',
        }, {
            title: '@掩码',
            dataIndex: 'net_mask',
            key: 'net_mask',

        }, {
            title: '@备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: 'DHCP',
            dataIndex: 'dhcp_is_active',
            key: 'dhcp_is_active',
            render: (index, record) => {
                return <span onClick={() => this.gotoDHCP(record)}
                             className='common-link-icon'>{index ? "@开启" : "@关闭"}</span>
            }
        }, {
            title: "@ARP绑定",
            dataIndex: 'arp',
            key: 'arp',
            render: (index, record) => {
                return <span onClick={() => this.gotoARP(record)} className='common-link-icon'>@静态IP</span>
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:100,
            fixed: 'right',
            render: (index, record) => {
                return (
                    <div style={{display: "inline-block"}}>
                        {/* <Operations 
                        hasCustom={true} customIcon={"copy"} messages={"确认复制模板？"} cunsom={() => this.coppy(record)}
                        hasEdit={true} edit={() => this.edit(record)}
                        hasDelete={true} delete={() => this.delete(record)}
                        /> */}
                        {/* <span onClick={() => this.gotoARP(record)}  className='ci3301operations-delete-btn'>{"@ARP静态绑定"}</span> */}
                        <Icon type="edit" onClick={() => this.edit(record)} className="operations-edit-btn"/>
                        {record.name === "lan" ?
                            <Icon type="delete" style={{color: "rgba(0,0,0,0.2)"}} className="operations-delete-btn"/> :
                            <Popconfirm title={"@确定删除当前信息?"} onConfirm={() => this.delete(record)}><Icon type="delete"
                                                                                                         style={{}}
                                                                                                         className="operations-delete-btn"/></Popconfirm>}
                    </div>
                )
            }
        },];
        const techColumns = [{
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: '@网段名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@IP地址',
            dataIndex: 'ip',
            key: 'ip',
        }, {
            title: '@掩码',
            dataIndex: 'net_mask',
            key: 'net_mask',

        }, {
            title: '@备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: 'DHCP',
            dataIndex: 'dhcp_is_active',
            key: 'dhcp_is_active',
            render: (index, record) => {
                return <span onClick={() => this.gotoDHCP(record)}
                             className='common-link-icon'>{index ? "@开启" : "@关闭"}</span>
            }
        }, {
            title: "@ARP绑定",
            dataIndex: 'arp',
            key: 'arp',
            render: (index, record) => {
                return <span onClick={() => this.gotoARP(record)} className='common-link-icon'>@静态IP</span>
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right',
            width:100,
            render: (index, record) => {
                return (
                    <div style={{display: "inline-block"}}>
                        {/* <Operations 
                        hasCustom={true} customIcon={"copy"} messages={"确认复制模板？"} cunsom={() => this.coppy(record)}
                        hasEdit={true} edit={() => this.edit(record)}
                        hasDelete={true} delete={() => this.delete(record)}
                        /> */}
                        {/* <span onClick={() => this.gotoARP(record)}  className='ci3301operations-delete-btn'>{"@ARP静态绑定"}</span> */}
                        <Icon type="edit" onClick={() => this.edit(record)} className="operations-edit-btn"/>
                        {record.name === "lan" ?
                            <Icon type="delete" style={{color: "rgba(0,0,0,0.2)"}} className="operations-delete-btn"/> :
                            <Popconfirm title={"@确定删除当前信息?"} onConfirm={() => this.delete(record)}><Icon type="delete"
                                                                                                         style={{}}
                                                                                                         className="operations-delete-btn"/></Popconfirm>}
                    </div>
                )
            }
        },];

        return (

            <Card className="card">
                <HeaderBar hasSearch={true}
                           selectPlaceHolder={"@请选择公司"}
                           hasSelect={this.isTech}
                           options={option}
                           selectOneMethod={this.handleSelectCompany}
                           hasAdd={true}
                           hasDelete={false}
                           add={this.handleOpenAdd}
                           submit={this.search}
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                           selectOneShowSearch={true}/>
                <BossTable columns={this.isTech ? techColumns : columns} dataSource={this.props.ci3301Info.dataSource}/>
                <BossEditModal {...ModalOptions} />
                <BossEditModal {...ModalDHCPOptions} refs={this.onRef}/>
                <ARPModal record={this.state.ARPRecord} id={this.state.ARPid}
                          select={{name: this.state.getName, operation_type: this.state.getType}}
                          cancel={this.closeARPModal}
                          visible={this.state.ARPvisible} vm={this}/>
            </Card>
        )
    }
}

export default injectIntl(CI3301);