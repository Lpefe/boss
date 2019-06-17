/*@账号管理员-CPE设置*/
import React from 'react';
import {Card, Modal} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import messages from "./LocaleMsg/messages";
import {injectIntl} from "react-intl";
import BossEditModal from "../../Common/BossEditModal";
import Operations from "../../Common/Operations";
import {commonTranslate} from "../../../utils/commonUtilFunc";


class PC0402C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editRecord: {},
            editModalShow: false,
            editId: "",
            ifCheckModelShow: false,
            checkModelRecord: {},
            ifWifi:false,
            ifLte:false,
        };

    }

    componentDidMount() {
        this.get_device_model();
    }


    get_device_model = () => {
        this.props.dispatch({
            type: "pc0402Info/get_device_model",
            payload: {}
        })
    };
    handleEditModalShow = (record) => {
        this.setState({
            editModalShow: true,
            editRecord: record.id ? record : {},
            editId: record.id,
            ifWifi:record.ifWifi,
            ifLte:record.ifLte
        })
    };

    handleEditModalClose = () => {
        this.setState({
            editModalShow: false,
            editRecord: {},
            editId: ""
        })
    };
    delete_device_model = (record) => {
        this.props.dispatch({
            type: "pc0402Info/delete_device_model",
            payload: {
                ids: [record.id],
                records: [record]
            }
        })
    };

    get_wifi_config_file = () => {
        this.props.dispatch({
            type: "pc0402Info/get_wifi_config_file",
            payload: {
                model: this.state.checkModelRecord.model
            }
        })
    };

    handleOpenCheckModel = (record) => {
        this.setState({
            ifCheckModelShow: true,
            checkModelRecord: record,
        }, () => {
            this.get_wifi_config_file();
        })
    };
    handleCloseCheckModel = () => {
        this.setState({
            ifCheckModelShow: false
        })
    };


    render() {
        const columns = [{
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',
        }, {
            title: '@硬件标识',
            dataIndex: 'hardware_code',
            key: 'hardware_code',
        }, {
            title: '@硬件类型',
            dataIndex: 'hardware_type',
            key: 'hardware_type',
        },{
            title: 'Wi-Fi',
            dataIndex: 'wifi_no',
            key: 'wifi_no',
        }, {
            title: "LTE(4G)",
            dataIndex: 'lte_no',
            key: 'lte_no',
        }, {
            title: '@内存',
            dataIndex: 'ram',
            key: 'ram',
            render: (text) => {
                if (text) {
                    return text === 'big' ? '@大端' : '@小端'
                }

            }
        }, {
            title: '@说明',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            fixed:'right',
            render: (text, record) => {
                return <Operations edit={() => this.handleEditModalShow(record)}
                                   delete={() => this.delete_device_model(record)} hasEdit={true} hasDelete={true}/>
            }
        },];

        const modalOption = {
            title: this.state.editId ? "@编辑设备型号" : "@添加设备型号",
            visible: this.state.editModalShow,
            onCancel: this.handleEditModalClose,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "pc0402Info/update_device_model" : "pc0402Info/create_device_model",
            extraUpdatePayload: {id: this.state.editId},
            initialValues: this.state.editId ?this.state.editRecord:{
                wifi_bands:"",
                lte_no:0,
                wifi_no:0,
                remark:"",
                ram:'big'
            },
            initPayload: {},
            InputItems: [{
                type: "Input",
                labelName: "@设备型号",
                valName: "model",
                nativeProps: {
                    placeholder: "@请选择设备型号",
                    disabled:!!this.state.editId
                },
                rules: [{required: true, message: "@请选择设备型号"}],
            }, {
                type: "Input",
                labelName: "@硬件标识",
                valName: "hardware_code",
                nativeProps: {
                    placeholder: "@请输入硬件标识",
                    disabled:!!this.state.editId
                },
                rules: [
                    {required: true, message: "@请输入硬件标识"},
                    /*{
                        pattern: /^[0-3][0-9A-Fa-f]$/,
                        message: "@硬件标识只能输入01-3F之间的16进制的数字"
                    }*/
                ],
            }, {
                type: "Select",
                labelName: "@硬件类型",
                valName: "hardware_type",
                nativeProps: {
                    placeholder: "@请选择硬件类型",
                },
                rules: [
                    {required: true, message: "@请选择硬件类型"},
                ],
                children: [{value: "CPE", key: "CPE", name: "CPE"}, {value: "AP", key: "AP", name: "AP"}, {
                    value: "Docker",
                    key: "Docker",
                    name: "Docker"
                }, {value: "VM", key: "VM", name: "VM"}]
            }, {
                type: "CheckBox",
                labelName: '',
                valName: "ifWifi",
                checkBoxName: "@支持WIFI",
                nativeProps: {},
                customerFormLayout: {
                    wrapperCol: {
                        xs: {span: 16, offset: 5},
                    }
                },
                onChange:(e,modalComponent)=>{
                    this.setState({
                        ifWifi:e.target.checked
                    },()=>{
                        modalComponent.props.form.validateFields(["wifi_no","wifi_bands"], { force: true });
                        if(!this.state.ifWifi){
                            modalComponent.props.form.setFieldsValue({"wifi_no":0,wifi_bands:[]});

                        }else{
                            modalComponent.props.form.setFieldsValue({"wifi_no":1});
                        }

                    })
                }
            }, {
                type: "Select",
                labelName: "@数量",
                valName: "wifi_no",
                nativeProps: {
                    placeholder: "@请选择数量",
                    style: {
                        width: 150
                    },
                    disabled:!this.state.ifWifi
                },
                rules: [{required: this.state.ifWifi, message: "@请选择数量"}],
                children: [{value: 1, key: "1", name: "1"}, {value: 2, key: "2", name: "2"}, {
                    value: 3,
                    key: "3",
                    name: "3"
                }, {value: 4, key: "4", name: "4"}]
            }, {
                type: "CheckboxGroup",
                labelName: '@频段',
                valName: "wifi_bands",
                nativeProps: {
                    disabled:!this.state.ifWifi
                },
                rules: [{required: this.state.ifWifi, message: "@请选择频段"}],
                children: [{label: '2.4GHz', value: '2.4GHz', key: '2.4GHz'}, {
                    label: '5GHz',
                    value: '5GHz',
                    key: '5GHz',
                }]
            }, {
                type: "CheckBox",
                labelName: '',
                valName: "ifLte",
                checkBoxName: "@支持LTE(4G)",
                customerFormLayout: {
                    wrapperCol: {
                        xs: {span: 16, offset: 5},
                    }
                },
                onChange:(e,modalComponent)=>{
                    this.setState({
                        ifLte:e.target.checked
                    },()=>{
                        modalComponent.props.form.validateFields(["lte_no"], { force: true });
                        if(!this.state.ifLte){
                            modalComponent.props.form.setFieldsValue({"lte_no":0});
                        }else{
                            modalComponent.props.form.setFieldsValue({"lte_no":1});
                        }
                    })
                }
            }, {
                type: "Select",
                labelName: "@数量",
                valName: "lte_no",
                nativeProps: {
                    placeholder: "@请选择数量",
                    style: {
                        width: 150
                    },
                    disabled:!this.state.ifLte
                },
                rules: [{required: this.state.ifLte, message: "@请选择数量"}],
                children:  [{value: 1, key: "1", name: "1"}, {value: 2, key: "2", name: "2"}, {
                    value: 3,
                    key: "3",
                    name: "3"
                }, {value: 4, key: "4", name: "4"}]
            }, {
                type: "Radio",
                labelName: "@内存",
                valName: "ram",
                rules: [{required: true, message: "@请选择内存类型",}],
                children: [{value: "big", name: "@大端", key: "big"}, {
                    value: "small",
                    name: "@小端",
                    key: "small"
                }]
            }, {
                type: "TextArea",
                labelName: "@说明",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入说明"
                },
                rules: [],
            },]
        };
        return (
            <Card className="card">
                <HeaderBar hasAdd={true} add={this.handleEditModalShow}/>
                <BossTable columns={columns} dataSource={this.props.pc0402Info.deviceModelList}/>
                <BossEditModal {...modalOption}/>
                <Modal title="@查看模板文件" visible={this.state.ifCheckModelShow} onCancel={this.handleCloseCheckModel}>
                    <div dangerouslySetInnerHTML={{__html: this.props.pc0402Info.checkFile}}>

                    </div>
                </Modal>
            </Card>
        )
    }
}

export default injectIntl(PC0402C);