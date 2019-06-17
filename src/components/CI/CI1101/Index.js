import React from 'react';
import './index.scss';
import {Card, Layout, Menu, Icon, Modal, Input, Form, Popconfirm, Transfer} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {deviceTypeMap} from "../../../utils/commonUtilFunc";

const {Sider, Content} = Layout;
const FormItem = Form.Item;

class CI1101 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifCreateGroupModalShow: false,
            editGroupId: "",
            ifCreateAgencyModalShow: false,
            targetKeys: [],
            selectedKeys: [],
            selectedGroupId: "",
            ifCheckDeviceModalShow: false,
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: "ci1101Info/get_agency_group",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
            }
        });
    }

    create_agency_group = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.editGroupId) {
                    this.props.dispatch({
                        type: "ci1101Info/update_agency_group",
                        payload: {
                            id: this.state.editGroupId,
                            name: values.name,
                            record: {name: this.state.editGroupName}
                        }
                    });
                } else {
                    this.props.dispatch({
                        type: "ci1101Info/create_agency_group",
                        payload: {
                            company_id: sessionStorage.getItem("companyId"),
                            name: values.name
                        }
                    });
                }
                this.setState({
                    ifCreateGroupModalShow: false,
                    editGroupId: "",
                    editGroupName: ""
                })
            }
        })
    };

    handleOpenCreateGroupModal = () => {
        this.setState({
            ifCreateGroupModalShow: true,
        })
    };

    handelCloseCreateGroupModal = () => {
        this.setState({
            ifCreateGroupModalShow: false,
            editGroupId: "",
            editGroupName: ""
        })
    };

    handelOpenUpdateGroupModal = (id, name) => {
        this.setState({
            ifCreateGroupModalShow: true,
            editGroupId: id,
            editGroupName: name
        })
    };

    handleDeleteGroup = (id, name) => {
        this.props.dispatch({
            type: "ci1101Info/delete_agency_group",
            payload: {
                ids: [id],
                records: [{name: name}]
            }
        })
    };

    handleOpenCreateAgencyModal = () => {
        let targetKeys = [];
        for (let key in this.props.ci1101Info.agencyOfGroupData) {
            targetKeys.push(this.props.ci1101Info.agencyOfGroupData[key].id.toString())
        }
        this.setState({
            ifCreateAgencyModalShow: true,
            targetKeys: targetKeys
        })
    };

    handelCloseCreateAgencyModal = () => {
        this.setState({
            ifCreateAgencyModalShow: false,
        })
    };

    agencyTransfer = (nextTargetKeys,) => {
        this.setState({
            targetKeys: nextTargetKeys
        })
    };

    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({
            selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]
        });
    };


    update_agency_of_group = () => {
        if(!!this.state.selectedGroupId){
            this.props.dispatch({
                type: "ci1101Info/update_agency_of_group",
                payload: {
                    id:this.state.selectedGroupId,
                    agency_ids: this.state.targetKeys,
                }
            });
        }else{
            this.props.dispatch({
                type: "ci1101Info/update_agency_of_group",
                payload: {
                    id: this.props.ci1101Info.initialGroupId,
                    agency_ids: this.state.targetKeys,
                }
            });
        }

        this.handelCloseCreateAgencyModal();
    };

    get_agency_list = (item) => {
        this.props.dispatch({
            type: "ci1101Info/get_agency_list",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                group_id: item.key
            }
        });

        this.setState({
            selectedGroupId: item.key
        })
    };

    handleOpenCheckDeviceModal = (record) => {
        this.setState({
            ifCheckDeviceModalShow: true,
        }, function () {
            this.props.dispatch({
                type: "ci1101Info/get_device_list",
                payload: {
                    agency_id: record.id
                }
            })
        })
    };

    handleCloseCheckDeviceModal = () => {
        this.setState({
            ifCheckDeviceModalShow: false,
        })
    };


    render() {
        const columns = [{
            title: '@节点名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@IP/IP段',
            dataIndex: 'ip',
            key: 'ip',
            render: (index, record) => {
                return <span>{record.iptables.join(", ")}</span>
            }
        }, {
            title: '@节点类型',
            dataIndex: 'type',
            key: 'type',
            render: (index, record) => {
                switch (record.type) {
                    case "STEP":
                        return <span>@边缘</span>;
                    case "CSTEP":
                        return <span>@中心</span>
                    default:
                        return <span>{record.type}</span>
                }
            }
        }, {
            title: '@设备信息',
            dataIndex: 'deviceinfo',
            key: 'deviceinfo',
            align: "center",
            render: (index, record) => {
                return (
                    <Icon type="file-text" style={{
                        border: 0
                    }} className="operations-delete-btn" onClick={() => this.handleOpenCheckDeviceModal(record)}/>
                )
            }
        },];

        const deviceInfoColumns = [
            {
                title: '@设备名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '@设备类型',
                dataIndex: 'type',
                key: 'type',
                render: (text) => {
                    return deviceTypeMap(text)
                }
            }, {
                title: '@设备型号',
                dataIndex: 'model',
                key: 'model',
            }, {
                title: "@硬件ID",
                dataIndex: 'sn',
                key: 'sn',
            },
        ];

        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        return (
            <Card className="card">
                <Layout style={{backgroundColor: "#fff"}}>
                    <Sider style={{backgroundColor: "#fff"}}>
                        <div className="menu-header">
                            <span className="titleL">{"@分组"}</span><span className="titleR"
                                                                                      onClick={this.handleOpenCreateGroupModal}>{"@添加组"}</span>
                        </div>
                        <Menu style={{backgroundColor: "#fff", minHeight: 900}}
                              onSelect={this.get_agency_list}
                              selectedKeys={[this.props.ci1101Info.menuSelectedKey]}>
                            {this.props.ci1101Info.groupData.map((item) => {
                                return <Menu.Item key={item.id} className="menu-item">
                                <span
                                    className="itemL">{item.name.length > 8 ? item.name.substring(0, 8) + "..." : item.name}</span>
                                    <span className="itemR">
                                    <Icon type="edit"
                                          onClick={() => this.handelOpenUpdateGroupModal(item.id, item.name)}/>
                                    <Popconfirm onConfirm={() => this.handleDeleteGroup(item.id, item.name)}
                                                title={"@确认删除该分组吗?"}><Icon type="delete"/></Popconfirm>
                                </span>
                                </Menu.Item>
                            })}
                        </Menu>
                    </Sider>
                    <Layout style={{backgroundColor: "#fff"}}>
                        <Content className="ci1101-content">
                            <HeaderBar hasAdd={true} hasDelete={false} add={this.handleOpenCreateAgencyModal}
                                       addBtnDisabled={this.props.ci1101Info.groupData.length === 0}
                                       addAlias={"@节点分组"}/>
                            <BossTable columns={columns}
                                       dataSource={this.props.ci1101Info.agencyOfGroupData}/>
                        </Content>
                    </Layout>
                    <Modal maskClosable={false} destroyOnClose
                           title={this.state.editGroupId ? "@添加组" : "@编辑组名"}
                           visible={this.state.ifCreateGroupModalShow} onOk={this.create_agency_group}
                           onCancel={this.handelCloseCreateGroupModal}>
                        <Form>
                            <FormItem label={"@组名"} {...modalFormLayout}>
                                {getFieldDecorator('name', {
                                    rules: [{required: true, message: "@请输入组名"}, {
                                        max: 50,
                                        message: "@组名最多不超过50个字符"
                                    }],
                                    initialValue: this.state.editGroupName
                                })(
                                    <Input placeholder={"@请输入组名"}/>
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                    <Modal maskClosable={false} destroyOnClose visible={this.state.ifCreateAgencyModalShow}
                           title={"@添加节点"}
                           onOk={this.update_agency_of_group}
                           onCancel={this.handelCloseCreateAgencyModal}>
                        <Transfer titles={['@源列表', '@目的列表']}
                                  dataSource={this.props.ci1101Info.srcAgencyData}
                                  targetKeys={this.state.targetKeys} selectedKeys={this.state.selectedKeys}
                                  render={item => item.title} onChange={this.agencyTransfer}
                                  onSelectChange={this.handleSelectChange}
                        />
                    </Modal>
                    <Modal maskClosable={false} visible={this.state.ifCheckDeviceModalShow} footer={null}
                           title={"@设备信息"}
                           width={700} onCancel={this.handleCloseCheckDeviceModal} destroyOnClose>
                        <BossTable columns={deviceInfoColumns} dataSource={this.props.ci1101Info.deviceData}/>
                    </Modal>
                </Layout>
            </Card>
        )
    }
}

export default injectIntl(CI1101);