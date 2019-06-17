/*@商务-设备信息*/
import React from 'react';
import './index.scss';
import {Card, Dropdown, Icon, Menu, Modal, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {deviceTypeMap, parse, statusMap} from "../../../utils/commonUtilFunc";
import {domain} from "../../../utils/commonConsts";
import BossDataHeader from "../../Common/BossDataHeader";
import BossEditModal from "../../Common/BossEditModal";

const Option = Select.Option;

class BI0301 extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            net_type: "",
            name: "",
            alertModalShow: false,
            type: "STEP,CSTEP,AP,APP",
            status: search.status || "",
            id: search.id || "",
            model: "",
            page_size: 20,
            page_no: 1,
            ModifyNameModalShow: false,
            selectedCompanyId: "",
            selectedAgencyId: "",
            editId: "",
            editRecord: {},
            exchangeDeviceModalShow: false,
        }
    }

    componentDidMount() {
        this.get_device_list();
        this.get_device_stat();
        this.get_device_model();
        this.get_company_list();
    }

    get_company_list = () => {
        this.props.dispatch({
            type: "ci0101Info/get_company_list",
            payload: {}
        })
    };

    get_device_model = () => {
        this.props.dispatch({
            type: "ci0101Info/get_device_model",
            payload: {}
        })
    };


    get_device_list = () => {
        this.props.dispatch({
            type: "ci0101Info/getDeviceList",
            payload: {
                company_id: this.state.id,
                net_type: this.state.net_type,
                name: this.state.name,
                status: this.state.status,
                type: this.state.type,
                model: this.state.model,
                page_size: this.state.page_size,
                page_no: this.state.page_no,

            }
        })
    };


    searchDevice = (value) => {
        this.setState({
            name: value || "",
            page_size: 20,
            page_no: 1,
        }, () => {
            this.get_device_list();
        })
    };

    get_device_stat = () => {
        this.props.dispatch({
            type: "ci0101Info/get_device_stat",
            payload: {}
        })
    };

    handleChangeStatus = (value) => {
        this.setState({
            status: value || "",
            page_size: 20,
            page_no: 1,
        }, () => {
            this.get_device_list();
        })
    };

    handleSelectType = (value) => {
        this.setState({
            type: value || "STEP,CSTEP,AP,APP",
            page_size: 20,
            page_no: 1,
        }, () => {
            this.get_device_list();
        })
    };

    handleSelectModel = (value) => {
        this.setState({
            model: value || "",
            page_size: 20,
            page_no: 1,
        }, () => {
            this.get_device_list();
        })
    };


    handleCloseAlertModal = () => {
        this.props.dispatch({
            type: "ci0101Info/closeAlertModal"
        })
    };
    checkLink = (status) => {
        this.setState({
            status: status,
            page_size: 20,
            page_no: 1,
        }, () => {
            this.get_device_list()
        })
    };

    gotoDevice = (record) => {
        if (record.type !== 'APP') {
            window.open(domain + "/index." + window.appLocale.locale + ".html#/main/bi0301/bi0302?id=" + record.id + "&sn=" + record.sn + "&type=" + record.type + "&from=device")
        } else {
            window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0101/mi0104?id="+record.id)
        }
    };

    operationMenuRender = (index, record) => {
        if (record.type !== 'APP') {
            return <Menu>
                <Menu.Item key="5"
                           onClick={() => this.handleOpenModifyNameModal(record)}>@名称修改</Menu.Item>
                {record.has_link ? "" : <Menu.Item key="3"
                                                   onClick={() => this.handleOpenDeviceMoveModal(record)}>@设备迁移</Menu.Item>}
                <Menu.Item key="6" onClick={() => this.push_config(record)}>@推送配置</Menu.Item>
            </Menu>
        } else {
            return <Menu>
                <Menu.Item key="5"
                           onClick={() => this.handleOpenModifyNameModal(record)}>@名称修改</Menu.Item>
            </Menu>
        }

    };

    handleOpenModifyNameModal = (record) => {
        this.setState({
            ModifyNameModalShow: true,
            editRecord: record,
            editId: record.id
        })
    };

    handleCloseModifyNameModal = () => {
        this.setState({
            ModifyNameModalShow: false,
            editRecord: {},
            editId: ""
        })
    };

    push_config = (record) => {
        this.props.dispatch({
            type: "ci0101Info/push_config",
            payload: {
                id: record.id
            }
        })
    };

    handleOpenDeviceMoveModal = (record) => {
        this.setState({
            deviceModalShow: true,
            editRecord: record,
            editId: record.id,
        }, () => {
            this.get_agency_list()
        })
    };

    handleCloseDeviceMoveModal = () => {
        this.setState({
            deviceModalShow: false,
            editRecord: {},
            editId: "",
        })
    };
    get_agency_list = () => {
        this.props.dispatch({
            type: "ci0101Info/get_agency_list",
            payload: {
                company_id: this.state.selectedCompanyId
            }
        })
    };
    get_cpe_template_agency = () => {
        this.props.dispatch({
            type: "ci0101Info/get_cpe_template_agency",
            payload: {
                company_id: this.state.selectedCompanyId,
                agency_id: this.state.selectedAgencyId,
                model: this.state.editRecord.model,
                device_id: 0,
            }
        })
    };


    render() {
        const columns = [{
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span onClick={() => this.gotoDevice(record)} className='common-link-icon'>{record.name}</span>
            }
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
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
            title: "操作",
            dataIndex: 'operation',
            key: 'operation',
            width:75,
            fixed:'right',
            align: 'center',
            render: (index, record) => {
                return <Dropdown overlay={this.operationMenuRender(index, record)}>
                    <Icon type="ellipsis"/>
                </Dropdown>
            }
        }];

        const option = [
            <Option value="ONLINE" key="ONLINE">@在线</Option>,
            <Option value="INIT" key="INIT">@未激活</Option>,
            <Option value="OFFLINE" key="OFFLINE">@离线</Option>
        ];

        const optionTwo = [
            <Option value="STEP" key="STEP">BCPE</Option>,
            <Option value="CSTEP" key="CSTEP">HCPE</Option>,
        ];

        const optionsThree = this.props.ci0101Info.deviceModelList.map((model) => {
            return <Option value={model.model} key={model.id}>{model.model}</Option>
        });

        const alertColumns = [{
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
        },];
        const modifyNameModalOption = {
            title: "@名称修改",
            visible: this.state.ModifyNameModalShow,
            onCancel: this.handleCloseModifyNameModal,
            dispatch: this.props.dispatch,
            submitType: "ci0101Info/update_device",
            bodyHeight: 150,
            initPayload: {
                company_id: this.state.id,
                net_type: this.state.net_type,
                name: this.state.name,
                status: this.state.status,
                type: this.state.type,
                model: this.state.model,
                page_size: this.state.page_size,
                page_no: this.state.page_no,
            },
            initialValues: {
                name: this.state.editRecord.name
            },
            extraUpdatePayload: {id: this.state.editRecord.id},
            InputItems: [{
                type: "Input",
                labelName: "@名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入名称",
                },
                rules: [{max: 64, messages: "@设备名称最多64字符"}]
            },]
        };

        const modalOptions = {
            title: "@设备迁移",
            visible: this.state.deviceModalShow,
            onCancel: this.handleCloseDeviceMoveModal,
            dispatch: this.props.dispatch,
            submitType: "ci0101Info/move_device",
            extraUpdatePayload: {id: this.state.editRecord.id},
            initialValues: {name: this.state.editRecord.name, type: this.state.editRecord.type},
            initPayload: {
                company_id: this.state.id,
                net_type: this.state.net_type,
                name: this.state.name,
                status: this.state.status,
                type: this.state.type,
                model: this.state.model,
                page_size: this.state.page_size,
                page_no: this.state.page_no,
            },
            InputItems: [{
                type: "Plain",
                labelName: "@硬件ID",
                content: this.state.editRecord.sn,
                height: 32
            }, {
                type: "Radio",
                labelName: "@设备类型",
                valName: "type",
                rules: [{required: true, message: "@请选择设备类型",}],
                children: [{value: "CSTEP", name: "HCPE", key: "HCPE"}, {
                    value: "STEP",
                    name: "BCPE",
                    key: "BCPE"
                }]
            }, {
                type: "Input",
                labelName: "@设备名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入设备名称",
                },
                rules: [{required: true, message: "@请输入设备名称"}, {
                    max: 128,
                    message: "@请输入设备名称最多输入128字符"
                }],
            }, {
                type: "Plain",
                labelName: "@当前所属企业",
                content: this.state.editRecord.company_abbr,
                height: 32
            }, {
                type: "Plain",
                labelName: "@目前节点名称",
                content: this.state.editRecord.agency_name,
                height: 32
            }, {
                type: "Select",
                labelName: "@目标企业",
                valName: "target_company_id",
                nativeProps: {
                    placeholder: "@请选择目标企业",
                },
                onChange: (value, modalComponent) => {
                    this.setState({
                        selectedCompanyId: value
                    }, () => {
                        this.get_agency_list();
                        modalComponent.props.form.setFieldsValue({
                            agency_id: undefined,
                            cta_id: undefined,
                        })
                    });
                },
                rules: [{required: true, message: "@请选择目标节点名称"}],
                children: this.props.ci0101Info.companyList.map((item) => {
                    return {name: item.company_abbr, value: item.id, key: item.id}
                })
            }, {
                type: "Select",
                labelName: "@目标节点名称",
                valName: "agency_id",
                nativeProps: {
                    placeholder: "@请选择目标节点名称",
                },
                onChange: (value, ModalComponent) => {
                    this.setState({
                        selectedAgencyId: value
                    }, () => {
                        if (!(this.state.editRecord.type === 'AP' || !this.state.editRecord.by_ztp)) {
                            this.get_cpe_template_agency();
                            ModalComponent.props.form.setFieldsValue({
                                cta_id: undefined,
                            })
                        }
                    })
                },
                rules: [{required: true, message: "@请选择目标节点名称"}],
                children: this.props.ci0101Info.agencyList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                })
            }, this.state.editRecord.type === 'AP' || !this.state.editRecord.by_ztp ? {} : {
                type: "Select",
                labelName: "@目标配置名称",
                valName: "cta_id",
                nativeProps: {
                    placeholder: "@请选择目标配置名称",
                },
                rules: [{required: true, message: "@请选择目标配置名称"}],
                children: this.props.ci0101Info.ctaList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                })
            },]
        };

        return (
            <div>
                <BossDataHeader offLine={this.props.ci0101Info.OFFLINE}
                                init={this.props.ci0101Info.INIT}
                                onLine={this.props.ci0101Info.ONLINE}
                                total={this.props.ci0101Info.INIT + this.props.ci0101Info.OFFLINE + this.props.ci0101Info.ONLINE}
                                checkLink={this.checkLink}
                                TotalLink="@设备总数"
                                changeImg={false}
                />
                <Card className="card">
                    <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={true}
                               hasSearch={true} selectOneMethod={this.handleChangeStatus}
                               selectTwoMethod={this.handleSelectType}
                               selectPlaceHolder={'@请选择状态'} submit={this.searchDevice}
                               selectTwoPlaceHolder={"@请选择设备类型"}
                               options={option} optionsTwo={optionTwo} hasSelectThree={true} optionsThree={optionsThree}
                               selectThreePlaceHolder="@请选择设备型号" selectThreeMethod={this.handleSelectModel}/>
                    <BossTable paging={true} getData={this.get_device_list} component={this}
                               total={this.props.ci0101Info.total} columns={columns}
                               dataSource={this.props.ci0101Info.deviceData} scroll={{x: 'max-content'}}/>
                </Card>
                <Modal maskClosable={false} visible={this.props.ci0101Info.alertModalShow}
                       onCancel={this.handleCloseAlertModal} title={"@24小时警报"}
                       size="middle" bordered>
                    <BossTable columns={alertColumns} dataSource={this.props.ci0101Info.alarmList}/>
                </Modal>
                <BossEditModal {...modifyNameModalOption}/>
                <BossEditModal {...modalOptions}/>
            </div>
        )
    }
}

export default injectIntl(BI0301);