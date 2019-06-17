/*@客户-CPE模板*/
import React from 'react';
import BossTable from "../../Common/BossTable";
import HeaderBar from "../../Common/HeaderBar";
import BossEditModal from "../../Common/BossEditModal";
import Operations from "../../MI/MI1901/subComponents/Operations";
import {Card, Icon, Select} from 'antd'

const Option = Select.Option;

class CI3101C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editRecord: {},
            editId: "",
            editModalShow: false,
            selectedModel: "",
            lanDisabled: true,
            name: "",
            hasWifi: false,
            company_id: sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxptechadmin" ? "" : parseInt(sessionStorage.getItem("companyId")),
            payloadCompanyId: sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxptechadmin" ? "" : parseInt(sessionStorage.getItem("companyId"))

        };
        this.isTech = sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxptechadmin"

    }

    componentDidMount() {
        this.get_cpe_template();
        this.get_device_model();
        this.get_lan_template();
        this.getCompanyList()
    }

    handleEditModalShow = (record) => {
        const modelList = this.props.ci3101Info.modelList;
        for (let key in modelList) {
            if (modelList[key].model === record.model) {
                this.setState({
                    hasWifi: modelList[key].wifi_no !== 0
                })
            }
        }

        if (record.id) {
            this.setState({
                selectedModel: record.model
            }, () => {
                this.get_wifi_template()
                this.props.dispatch({
                    type: "ci3101Info/get_lan_template",
                    payload: {
                        company_id: record.company_id
                    }
                })
            })
        }
        this.setState({
            editModalShow: true,
            editRecord: record.id ? record : {},
            editId: record.id,
        }, () => {
            if (this.modalComponent.props.form.getFieldValue('in_type') === 'bypass') {
                this.modalComponent.props.form.setFieldsValue({
                    net_id: this.props.ci3101Info.lanId
                })
            }
            this.setState({
                lanDisabled: this.modalComponent.props.form.getFieldValue('in_type') === 'bypass'
            })
        })
    };
    getCompanyList = () => {
        this.props.dispatch({
            type: "ci3101Info/get_company_list",
            payload: {}
        });
    };
    onRef = (modalComponent) => {
        this.modalComponent = modalComponent
    };

    get_cpe_template = () => {
        this.props.dispatch({
            type: "ci3101Info/get_cpe_template",
            payload: {
                company_id: this.state.company_id,
                name: this.state.name
            }
        })
    };

    handleEditModalClose = () => {
        this.setState({
            editModalShow: false,
            editRecord: {},
            editId: "",
            lanDisabled: true,
        })
    };

    get_device_model = () => {
        this.props.dispatch({
            type: "ci3101Info/get_device_model",
            payload: {
                hardware_type: "CPE"
            }
        })
    };
    get_wifi_template = () => {
        this.props.dispatch({
            type: "ci3101Info/get_wifi_template",
            payload: {
                company_id: this.state.payloadCompanyId,
                model: this.state.selectedModel
            }
        })
    };

    get_lan_template = () => {
        this.props.dispatch({
            type: "ci3101Info/get_lan_template",
            payload: {
                company_id: this.state.payloadCompanyId
            }
        })
    };

    duplicate_cpe_template = (record) => {
        this.props.dispatch({
            type: "ci3101Info/duplicate_cpe_template",
            payload: {
                init: {
                    company_id: this.state.company_id
                },
                update: {
                    id: record.id
                }
            }
        })
    };

    delete_cpe_template = (record) => {
        this.props.dispatch({
            type: "ci3101Info/delete_cpe_template",
            payload: {
                ids: [record.id],
                records: [record],
                init: {company_id: this.state.company_id}
            }
        })

    };
    handleSelectCompany = (value) => {
        this.setState({
            company_id: value || "",
        }, () => {
            this.get_cpe_template();
        })
    };

    handleSubmit=(value)=>{
        this.setState({
            name:value
        },()=>{
            this.get_cpe_template()
        })
    };

    render() {
        const option = this.props.ci3101Info.companyList.map((item) => {
            return <Option key={item.id} value={item.id}>{item.company_abbr}</Option>
        });
        const columns = [{
            title: "@模板名称",
            dataIndex: 'name',
            key: 'name',
            width:200,
            fixed:'left'
        }, {
            title: "@适用型号",
            dataIndex: 'model',
            key: 'model',
        }, {
            title: "@接入模式",
            dataIndex: 'in_type',
            key: 'in_type',
            render: (text) => {
                return text === 'router' ? "@路由" : "@旁路"
            }
        }, {
            title: "WAN",
            dataIndex: 'WAN',
            key: 'WAN',
        }, {
            title: "@网段",
            dataIndex: 'lan_name',
            key: 'lan_name',
        }, {
            title: "@物理端口",
            dataIndex: 'physical_port',
            key: 'physical_port',
        }, {
            title: "@SSID名称",
            dataIndex: 'st_ids',
            key: 'st_ids',
            render: (text, record) => {
                return record.st_names
            }
        }, {
            title: "@备注",
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: "@操作",
            dataIndex: '',
            key: 'operation',
            fixed:'right',
            width:150,
            align:'center',
            render:(text,record)=>{
                return <Operations hasDelete={true} edit={()=>this.handleEditModalShow(record)} delete={()=>this.delete_cpe_template(record)} hasEdit={true} hasExtraPopConfirm={true} extraPopConfirmTitle="@确定要复制该模板吗?" extraPopConfirmToolTip="@复制模板" extraPopConfirmMethod={()=>this.duplicate_cpe_template(record)} extraPopConfirmName={<Icon type="copy"/>}/>
            }
        },];
        const techColumns = [{
            title: "@企业名称",
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: "@模板名称",
            dataIndex: 'name',
            key: 'name',
        }, {
            title: "@适用型号",
            dataIndex: 'model',
            key: 'model',
        }, {
            title: "@接入模式",
            dataIndex: 'in_type',
            key: 'in_type',
            render: (text) => {
                return text === 'router' ? "@路由" : "@旁路"
            }
        }, {
            title: "WAN",
            dataIndex: 'WAN',
            key: 'WAN',
        }, {
            title: "@网段",
            dataIndex: 'lan_name',
            key: 'lan_name',
        }, {
            title: "@物理端口",
            dataIndex: 'physical_port',
            key: 'physical_port',
        }, {
            title: "@SSID名称",
            dataIndex: 'st_ids',
            key: 'st_ids',
            render: (text, record) => {
                return record.st_names
            }
        }, {
            title: "@备注",
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: "@操作",
            dataIndex: '',
            key: 'operation',
            fixed:'right',
            align: "center",
            width:150,
            render:(text,record)=>{
                return <Operations hasDelete={true} edit={()=>this.handleEditModalShow(record)} delete={()=>this.delete_cpe_template(record)} hasEdit={true} hasExtraPopConfirm={true} extraPopConfirmTitle="@确定要复制该模板吗?"  extraPopConfirmMethod={()=>this.duplicate_cpe_template(record)} extraPopConfirmToolTip="@复制模板" extraPopConfirmName={<Icon type="copy"/>}/>
            }
        },];
        const modalOptions = {
            title: this.state.editId ? '@修改配置模板' : "@添加配置模板",
            visible: this.state.editModalShow,
            onCancel: this.handleEditModalClose,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci3101Info/update_cpe_template" : "ci3101Info/create_cpe_template",
            extraUpdatePayload: this.isTech ? {id: this.state.editId} : {
                id: this.state.editId,
                company_id: sessionStorage.getItem('companyId')
            },
            initialValues: this.state.editId ? this.state.editRecord : {in_type: "bypass"},
            initPayload: {
                company_id: this.state.company_id
            },
            InputItems: this.isTech ? [{
                type: "Select",
                labelName: "@企业名称",
                valName: "company_id",
                nativeProps: {
                    placeholder: "@请选择企业",
                    disabled: this.state.editId!==undefined,
                },
                rules: [{required: true, message: "@请选择企业"}],
                children: this.props.ci3101Info.companyList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.company_abbr}
                    }
                }),
                onChange: (value) => {
                    this.setState({
                        payloadCompanyId: value
                    }, () => {
                        this.get_lan_template()
                    })
                }
            }, {
                type: "Select",
                labelName: "@设备型号",
                valName: "model",
                nativeProps: {
                    placeholder: "@请选择设备型号",
                },
                onChange: (value, vm) => {
                    this.setState({
                        selectedModel:value
                    },()=>{
                        const modelList=this.props.ci3101Info.modelList;
                        for(let key in modelList){
                            if(modelList[key].model===value){
                                this.setState({
                                    hasWifi:modelList[key].wifi_no!==0
                                })
                            }
                        }
                        this.get_wifi_template();
                        vm.props.form.setFieldsValue({"st_ids":[]})
                    })
                },
                rules: [{required: true, message: "@请选择设备型号"}],
                children: this.props.ci3101Info.modelList.map((model) => {
                    return {name: model.model, value: model.model, key: model.id}
                })
            }, {
                type: "Input",
                labelName: "@模板名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入模板名称",
                },
                rules: [{required:true,message:"@请输入模板名称"}],
            },this.state.hasWifi?{
                type: "Select",
                labelName: "@SSID模板",
                valName: "st_ids",
                nativeProps: {
                    mode: "multiple",
                    placeholder: "@请选择SSID模板",
                },
                children: this.props.ci3101Info.wifiTemplateList.map((template) => {
                    return {name: template.ssid, value: template.id, key: template.id}
                })
            }:{},{
                type: "Radio",
                labelName: "@接入模式",
                valName: "in_type",
                nativeProps: {
                    placeholder: "@请选择接入模式",
                },
                onChange: (e, vm) => {
                    if (e.target.value === 'bypass') {
                        vm.props.form.setFieldsValue({
                            net_id: this.props.ci3101Info.lanId
                        })
                    }
                    this.setState({
                        lanDisabled: e.target.value === 'bypass'
                    });
                },
                children: [{value: "bypass", name: "@旁路(Bypass)", key: "bypass"}, {
                    value: "router",
                    name: "@路由(Router)",
                    key: "router"
                }],
                rules: [{required: true, message: "@请选择接入模式"}],
            }, {
                type: "Select",
                labelName: "@网段",
                valName: "net_id",
                nativeProps: {
                    placeholder: "@请选择网段",
                    disabled: this.state.lanDisabled
                },
                rules: [{required: true, message: ""}],
                children: this.props.ci3101Info.lanList.map((lan) => {
                    return {name: lan.name, value: lan.id, key: lan.id}
                })
            }, {
                type: "Input",
                labelName: "@备注",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入备注",
                },
            },] : [{
                type: "Select",
                labelName: "@设备型号",
                valName: "model",
                nativeProps: {
                    placeholder: "@请选择设备型号",
                },
                onChange: (value, vm) => {
                    this.setState({
                        selectedModel:value
                    },()=>{
                        const modelList=this.props.ci3101Info.modelList;
                        for(let key in modelList){
                            if(modelList[key].model===value){
                                this.setState({
                                    hasWifi: modelList[key].wifi_no !== 0
                                })
                            }
                        }
                        this.get_wifi_template();
                        vm.props.form.setFieldsValue({"st_ids": []})
                    })
                },
                rules: [{required: true, message: "@请选择设备型号"}],
                children: this.props.ci3101Info.modelList.map((model) => {
                    return {name: model.model, value: model.model, key: model.id}
                })
            }, {
                type: "Input",
                labelName: "@模板名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入模板名称",
                },
                rules: [{required:true,message:"@请输入模板名称"}],
            },this.state.hasWifi?{
                type: "Select",
                labelName: "@SSID模板",
                valName: "st_ids",
                nativeProps: {
                    mode: "multiple",
                    placeholder: "@请选择SSID模板",
                },
                children: this.props.ci3101Info.wifiTemplateList.map((template) => {
                    return {name: template.ssid, value: template.id, key: template.id}
                })
            } : {}, {
                type: "Radio",
                labelName: "@接入模式",
                valName: "in_type",
                nativeProps: {
                    placeholder: "@请选择接入模式",
                },
                onChange: (e, vm) => {
                    if (e.target.value === 'bypass') {
                        vm.props.form.setFieldsValue({
                            net_id: this.props.ci3101Info.lanId
                        })
                    }
                    this.setState({
                        lanDisabled: e.target.value === 'bypass'
                    });
                },
                children: [{value: "bypass", name: "@旁路(Bypass)", key: "bypass"}, {
                    value: "router",
                    name: "@路由(Router)",
                    key: "router"
                }],
                rules: [{required: true, message: "@请选择接入模式"}],
            }, {
                type: "Select",
                labelName: "@网段",
                valName: "net_id",
                nativeProps: {
                    placeholder: "@请选择网段",
                    disabled: this.state.lanDisabled
                },
                rules: [{required: true, message: ""}],
                children: this.props.ci3101Info.lanList.map((lan) => {
                    return {name: lan.name, value: lan.id, key: lan.id}
                })
            }, {
                type: "Input",
                labelName: "@备注",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入备注",
                },
            },]
        };
        return (
            <Card className="card">
                <HeaderBar selectPlaceHolder="@请选择公司"
                           hasSelect={this.isTech}
                           options={option}
                           selectOneMethod={this.handleSelectCompany} hasAdd={true} addAlias="@添加模板" hasSearch={true} submit={this.handleSubmit} add={this.handleEditModalShow}/>
                <BossTable columns={this.isTech?techColumns:columns} dataSource={this.props.ci3101Info.cpeTemplateList}/>
                <BossEditModal {...modalOptions} refs={this.onRef}/>
            </Card>
        )
    }
}

export default CI3101C;