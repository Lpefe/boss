/*@运维-Docker管理*/
import React from 'react';
import {withRouter} from 'react-router-dom'
import {Card, Select} from 'antd';
import { parse, validateIp} from '../../../utils/commonUtilFunc';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import BossEditModal from "../../Common/BossEditModal";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {domain} from '../../../utils/commonConsts';
import BGPModal from './subComponents/BGPModal'
import Operations from "../../Common/Operations";

const url = domain;

const Option = Select.Option;

class MI1902C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            docker_group_id: parse(this.props.location.search).id,
            dockerName: parse(this.props.location.search).name,
            name: "",
            //docker添加修改
            companyModalShow: false,
            editRecord: {},
            edit: "",
            status: "",
            ModalShow: false,
            converged: false,
            BGPRecord: {},
            bgp: {}
        }
    }

    componentDidMount() {
        this.getDocker();
        this.getCompanyList()
    }


    getDocker = () => {
        this.props.dispatch({
            type: "mi1902Info/getDocker",
            payload: {
                docker_group_id: this.state.docker_group_id,
                name: this.state.name,
                status: this.state.status
            }
        });
    };

    onRef = (vm) => {
        this.ref = vm
    };
    //获取设备类型
    get_device_model = () => {
        this.props.dispatch({
            type: "mi1902Info/get_device_model",
            payload: {}
        });
    };
    //获取节点列表
    get_agency_list = (value) => {
        this.props.dispatch({
            type: "mi1902Info/get_agency_list",
            payload: {
                company_id: value,
                type: "CSTEP"
            }
        });
    };

    //获取企业名称
    getCompanyList() {
        this.props.dispatch({
            type: "mi1902Info/getCompanyList",
            payload: {}
        })
    }

    //获取sn列表
    get_sn_list(xx) {
        this.props.dispatch({
            type: "mi1902Info/getDeviceList",
            payload: {
                agency_id: xx,
                docker_group_id: 0
            }
        })
    }

    get_cloud_application(xx) {
        this.props.dispatch({
            type: "mi1902Info/get_cloud_application",
            payload: {
                agency_id: xx,
            }
        })
    }

    handleOpenAddCompanyModal = () => {
        this.setState({
            companyModalShow: true,
        }, () => {
            this.getCompanyList();
            this.get_device_model()
        })
    };

    delete = (record) => {
        this.props.dispatch({
            type: "mi1902Info/deleteDocker",
            payload: {
                sns: [record.sn],
            }
        }).then(() => {
            this.getDocker()
        })
    };

    edit = (record) => {
        this.setState({
            companyModalShow: true,
            editRecord: record,
            edit: record.sn,
            converged: record.converged
        }, () => {
            this.getCompanyList();
            this.get_device_model();
            this.get_agency_list(record.id);
        })
    };


    search = (value) => {
        this.setState({
            name: value || ""
        }, () => {
            this.getDocker();
        })
    };
    closeAddModal = () => {
        this.setState({
            companyModalShow: false,
            edit: "",
            editRecord: {},
            converged: false
        }, () => {
            this.getDocker();
        })
    };
    gotoDevice = (record) => {
        window.open(url + "/index." + window.appLocale.locale + ".html#/main/mi1901/mi1902/mi0102?id=" + record.id + "&sn=" + record.sn + "&type=CSTEP&from=device")
    };

    closeModal = () => {
        this.setState({
            ModalShow: false
        }, () => {
            //this.getDockerGroup()
        })
    };
    deploy = (record) => {
        this.setState({
            BGPRecord: record,
            bgp: this.props.mi1902Info.bgp,
            ModalShow: true,
        }, () => {
            this.props.dispatch({
                type: "mi1902Info/get_bgp",
                payload: {
                    sn: record.sn,
                    company_id: record.company_id
                }
            })
        })
    }

    render() {
        //docker添加修改
        const option = [
            <Option value="ONLINE" key="ONLINE">@在线</Option>,
            <Option value="INIT" key="INIT">@未激活</Option>,
            <Option value="OFFLINE" key="OFFLINE">@离线</Option>
        ];
        const modalFormLayout = {
            labelCol: {
                xs: {span: 8},
            },
            wrapperCol: {
                xs: {span: 14},
            },
        };
        const ModalOptions = {
            title: this.state.edit ? "@编辑" : "@新增",
            visible: this.state.companyModalShow,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.edit ? "mi1902Info/updateDocker" : "mi1902Info/creatDocker",
            extraUpdatePayload: {docker_group_id: this.state.docker_group_id,},
            onCancel: this.closeAddModal,
            InputItems: [{
                type: "Select",
                labelName: "@企业名称",
                valName: this.state.edit ? "company_abbr" : "company_id",
                customerFormLayout: modalFormLayout,

                nativeProps: {
                    placeholder: "@请选择企业名称",
                    disabled: !!this.state.edit,
                },
                rules: [{required: true, message: "@请选择企业名称"}],
                children: this.props.mi1902Info.companyList.map((item) => {
                    return {key: item.id, value: item.id, name: item.company}
                }),
                onChange: (value, vm) => {
                    this.get_agency_list(value);
                    vm.props.form.setFieldsValue({"device_name": undefined,})
                    vm.props.form.setFieldsValue({"agency_id": undefined,})
                    vm.props.form.setFieldsValue({"converged": undefined,})
                },
            }, {
                type: "Select",
                labelName: "@节点名称",
                valName: this.state.edit ? "agency_name" : "agency_id",
                customerFormLayout: modalFormLayout,

                nativeProps: {
                    placeholder: "@请选择节点",
                    disabled: !!this.state.edit,
                },
                rules: [{required: true, message: "@请选择节点"}],
                children: this.props.mi1902Info.agencyList.map((item) => {
                    return {key: item.id, value: item.id, name: item.name}
                }),
                onChange: (value, vm) => {
                    let id = value;
                    let name = "";
                    let converged = ""
                    let agencyList = this.props.mi1902Info.agencyList
                    let that = this
                    this.get_sn_list(value)
                    vm.props.form.setFieldsValue({"ipaddr1": undefined})
                    vm.props.form.setFieldsValue({"vlan": undefined,})
                    this.props.dispatch({
                        type: "mi1902Info/get_cloud_application",
                        payload: {
                            agency_id: value,
                        }
                    }).then(() => {
                        if (this.props.mi1902Info.say.length !== 0) {
                            vm.props.form.setFieldsValue({"ipaddr1": this.props.mi1902Info.say[0].client_ip,})
                            vm.props.form.setFieldsValue({"vlan": this.props.mi1902Info.say[0].vlan_id,})
                        }
                    })
                    //console.log(this.state.converged)
                    if (id) {
                        for (let key in agencyList) {
                            if (agencyList[key].id === id) {
                                name = agencyList[key].name
                                converged = agencyList[key].converged
                            }
                        }
                        vm.props.form.setFieldsValue({"device_name": name,})
                        vm.props.form.setFieldsValue({"converged": converged,})
                        that.setState({
                            converged: converged
                        })
                    }

                    //function isBigEnough(agencyList) {return agencyList;}
                    //  var filtered = this.props.mi1902Info.agencyList.filter(isBigEnough);
                },
            }, {
                type: "Select",
                labelName: "@序列号",
                valName: "sn",
                customerFormLayout: modalFormLayout,
                nativeProps: {
                    placeholder: "@请选择序列号",
                    disabled: !!this.state.edit,
                },
                rules: [{required: true, message: "@请选择序列号"}],
                children: this.props.mi1902Info.sn.map((item) => {
                    return {key: item, value: item, name: item}
                })
            }, 
            // {
            //     type: "Input",
            //     labelName: "Docker ID",
            //     valName: "name",
            //     customerFormLayout:modalFormLayout,
            //     nativeProps: {
            //         placeholder: __(messages["请输入Docker Name"]),
            //         disabled:!!this.state.edit,
            //     },
            //     rules: [{required: true, message:__(messages["请输入Docker Name"])},{
            //         pattern: /^[A-Za-z0-9]+$/,
            //         message: __(messages["只可输入英文和数字"])
            //     }],

            // },
            {
                type: "Input",
                labelName: "@vCPE名称",
                valName: "device_name",
                customerFormLayout: modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入vCPE名称"
                },
                rules: [{required: true, message: "@请输入vCPE名称"}],

            }, {
                type: "Input",
                labelName: "VlanID",
                valName: "vlan",
                customerFormLayout: modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入VlanID"
                },
                rules: [{required: true, message: "@请输入VlanID"}],

            }, {
                type: "Input",
                labelName: "vCPE Lan IP",
                valName: "ipaddr1",
                customerFormLayout: modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入上联IP"
                },
                rules: [{required: true}, {validator: validateIp}],
            }, {
                type: "Input",
                labelName: "vCPE Lan Gateway IP",
                valName: "ipaddr2",
                customerFormLayout: modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入下联IP"
                },
                rules: [{required: true}, {validator: validateIp}],

            }, {
                type: "Input",
                labelName: "@数据服务端口",
                valName: "port",
                customerFormLayout: modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入数据服务端口"
                },
                rules: [{required: true, message: "@请输入数据服务端口"}],
            },],

        };

        //docker
        const columns = [{
            title: '@创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            fixed:"left",
            width:200
        },{
            title: "Docker ID",
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@vCPE名称',
            width: 210,

            dataIndex: 'device_name',
            key: 'device_name',
            render: (index, record) => {
                return <span className="common-link-icon"
                             onClick={() => this.gotoDevice(record)}>{record.device_name}</span>
            }
        },
            {
                title: "@企业名称",
                dataIndex: 'company_abbr',
                key: 'company_abbr',
                width: 210,
            }, {
                title: "@节点名称",
                dataIndex: 'agency_name',
                key: 'agency_name',
                width: 310,
            }, {
                title: 'vLanID',
                dataIndex: 'vlan',
                key: 'vlan',
                width: 120,
            }, {
                title: "vCPE Lan IP",
                dataIndex: 'ipaddr1',
                width: 210,
                key: 'ipaddr1'
            }, {
                title: "vCPE Lan Gateway IP",
                dataIndex: 'ipaddr2',
                width: 210,
                key: 'ipaddr2'
            }, {
                title: '@数据服务端口',
                dataIndex: 'port',
                width: 110,
                key: 'port',
            }, {
                title: '@序列号',
                dataIndex: 'sn',
                key: 'sn',
                width: 330,
            }, {
                title: '@汇聚点',
                dataIndex: 'converged',
                key: 'converged',
                width: 130,
                render: (text) => {
                    switch (text) {
                        case true:
                            return "@是"
                        case false:
                            return "@否"
                        case null:
                            return "-"
                        default:
                            break;
                    }
                }
            }, {
                title: "BGP",
                dataIndex: 'BGP',
                key: 'BGP',
                render: (index, record) => {
                    return record.converged === true ?
                        <span className="common-link-icon" onClick={() => this.deploy(record)}>@配置</span> :
                        <span className="MI902link-icon">@配置</span>
                }
            }, {
                title: '@操作',
                dataIndex: 'operation',
                key: 'operation',
                align: "center",
                fixed: "right",
                width:100,
                render: (index, record) => {
                    return (
                        <div>
                            <Operations
                                // hasExtra={true} extra={() => this.showModal(record)}
                                // name="静态路由"
                                extraIcon="profile"
                                hasDelete={record.can_delete} hasEdit={record.can_update} edit={() => this.edit(record)}
                                delete={() => this.delete(record)}/>
                        </div>
                    )
                }
            },];
        return (
            <div className="MI1902">
                <Card className="card">
                    <span className="dockerName">@设备名称：{this.state.dockerName}</span>
                </Card>
                <Card className="card">
                    <HeaderBar hasSearch={true}
                               options={option}
                               hasAdd={true}
                               hasDelete={false}
                               add={this.handleOpenAddCompanyModal}
                               submit={this.search}/>
                    <BossTable columns={columns} dataSource={this.props.mi1902Info.dataSource} scroll={{x: 'max-content'}}
                    />
                    <BossEditModal {...ModalOptions} />
                    <BGPModal cancel={this.closeModal}
                              visible={this.state.ModalShow}
                              record={this.state.BGPRecord}
                              bgp={this.state.bgp}
                              id={this.state.selectedId}
                              groupId={this.state.editId}
                              onRef={this.onRef}/>
                </Card>
            </div>
        )
    }
}

export default withRouter(injectIntl(MI1902C));
