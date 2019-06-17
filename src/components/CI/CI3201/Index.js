/*@客户-SSID模板*/
import React from 'react';
import {Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import {injectIntl} from "react-intl";


class CI3201 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            status: "",
            visible: false,
            editRecord: {},
            editId: "",
            disabled: false,
            selectName: "",
            band: ""
        };

    }

    componentDidMount() {
        this.get_wifi_template();
    }

    get_wifi_template = () => {
        this.props.dispatch({
            type: "ci3201Info/get_wifi_template",
            payload: {
                name: this.state.selectName,
                company_id: parseInt(sessionStorage.getItem("companyId"))
            }
        });
    };

    handleOpenAdd = () => {
        this.props.dispatch({
            type: "ci3201Info/get_lan_template",
            payload: {
                company_id: parseInt(sessionStorage.getItem("companyId"))
            }
        })
        this.props.dispatch({
            type: "ci3201Info/get_device_model",
            payload: {
                has_wifi: 1
            }
        }).then(
            this.setState({
                visible: true,
            })
        );

    }

    search = (value) => {
        this.setState({
            selectName: value || ""
        }, () => {
            this.get_wifi_template()
        })
    };
    coppy = (record) => {
        console.log(record)
        this.props.dispatch({
            type: "ci3201Info/duplicate_wifi_template",
            payload: {
                data: {id: record.id},
                init: {selectName: this.state.selectName}
            }
        })
    }
    edit = (record) => {
        this.props.dispatch({
            type: "ci3201Info/get_lan_template",
            payload: {
                company_id: parseInt(sessionStorage.getItem("companyId"))
            }
        })
        this.props.dispatch({
            type: "ci3201Info/get_device_model",
            payload: {
                has_wifi: 1
            }
        }).then(
            this.setState({
                visible: true,
                editRecord: record,
                editId: record.id,
            }))
        if (record.encryption === "None") {
            this.setState({
                disabled: true,
            })
        }

    }
    closeAddModal = () => {
        this.setState({
            visible: false,
            editRecord: {},
            editId: "",
            disabled: false,
        }, () => {
            this.get_wifi_template()
        })
    }
    delete = (record) => {
        this.props.dispatch({
            type: "ci3201Info/delete_wifi_template",
            payload: {
                init: {ids: [record.id], record: [record], selectName: this.state.selectName},
            }
        })
    };

    render() {
        const ghzChannel2_4 = [
            {key: "channel", value: "none", name: "AUTO"},
            {key: "1", value: "1", name: "1"},
            {key: "2", value: "2", name: "2"},
            {key: "3", value: "3", name: "3"},
            {key: "4", value: "4", name: "4"},
            {key: "5", value: "5", name: "5"},
            {key: "6", value: "6", name: "6"},
            {key: "7", value: "7", name: "7"},
            {key: "8", value: "8", name: "8"},
            {key: "9", value: "9", name: "9"},
            {key: "0", value: "10", name: "10"},
            {key: "11", value: "11", name: "11"}]

        const ghzChannel5 = [
            {key: "1", value: "none", name: "AUTO"},
            {key: "2", value: "36", name: "36"},
            {key: "3", value: "40", name: "40"},
            {key: "4", value: "44", name: "44"},
            {key: "5", value: "48", name: "48"},
            {key: "6", value: "149", name: "149"},
            {key: "7", value: "153", name: "153"},
            {key: "8", value: "157", name: "157"},
            {key: "9", value: "161", name: "161"},
            {key: "0", value: "165", name: "165"},
        ]

        const options = this.props.ci3201Info.deviceList.map((item) => {
            return {key: item.id, value: item.model, name: item.model}
        })
        const templateOptions = this.props.ci3201Info.templateList.map((item) => {
            return {key: item.id, value: item.id, name: item.name}
        })
        const ModalOptions = {
            title: this.state.editId ? "@编辑" : "@新增",
            visible: this.state.visible,
            initialValues: this.state.editId ? this.state.editRecord : {
                encryption: "WPA-PSK/WPA2-PSK",
                ssid_is_hidden: false
            },
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci3201Info/update_wifi_template" : "ci3201Info/create_wifi_template",
            onCancel: this.closeAddModal,
            extraUpdatePayload: {id: this.state.editId, company_id: parseInt(sessionStorage.getItem("companyId"))},
            initPayload: {selectName: this.state.selectName},
            InputItems: [{
                type: "Select",
                labelName: "@设备型号",
                valName: "model",
                nativeProps: {
                    placeholder: "@请选择设备型号",
                    disabled: !!this.state.editId
                },
                rules: [{required: true, message: "@请选择设备型号"}],
                children: options
            }, {
                type: "Input",
                labelName: "@SSID",
                valName: "ssid",
                nativeProps: {
                    placeholder: "@请输入SSID",
                    disabled: !!this.state.editId

                },
                rules: [{required: true, message: "@请输入SSID"}, {max: 32, message: '@SSID最多输入32字符'}, {
                    min: 8,
                    message: '@SSID最少输入8字符'
                }],
            }, {
                type: "Select",
                labelName: "@认证方式",
                valName: "encryption",
                nativeProps: {
                    placeholder: "@请选择认证方式"
                },
                rules: [{required: true, message: "@请选择认证方式"}],
                children: [{key: "1", value: "None", name: "None"}, {
                    key: "encryption",
                    value: "WPA2-PSK",
                    name: "WPA2-PSK"
                },
                    {key: "2", value: "WPA-PSK", name: "WPA-PSK"},
                    {key: "3", value: "WPA-PSK/WPA2-PSK", name: "WPA-PSK/WPA2-PSK"},],
                onChange: (value, vm) => {
                    if (value === "None") {
                        this.setState({
                            disabled: true
                        }, vm.props.form.setFieldsValue({
                            password: "",
                        }))
                    } else {
                        this.setState({
                            disabled: false
                        }, vm.props.form.setFieldsValue({
                            password: this.state.editRecord.password,
                        }))
                    }
                },
            }, {
                type: "Input",
                labelName: "@密码",
                valName: "password",
                nativeProps: {
                    placeholder: this.state.disabled ? "" : "@请输入密码",
                    disabled: this.state.disabled,
                },
                rules: [{required: !this.state.disabled, message: "@请输入密码"}, {max: 32, message: '@密码最多输入16字符'}, {
                    min: 8,
                    message: '@密码最少输入8字符'
                }],
            }, {
                type: "Radio",
                labelName: "@隐藏SSID",
                valName: "ssid_is_hidden",
                nativeProps: {},
                rules: [{required: true, message: "@请选择是否隐藏SSID"}],
                children: [{value: true, name: "@是", key: "1"}, {
                    value: false,
                    name: "@否",
                    key: "0"
                }],

            }, {
                type: "Radio",
                labelName: "@频段",
                valName: "band",
                nativeProps: {
                    placeholder: "@请选择频段"
                },
                rules: [{required: true, message: "@请选择频段"}],
                children: [{value: "2.4G", name: "2.4G", key: "1"}, {
                    value: "5G",
                    name: "5G",
                    key: "0"
                }],
                onChange: (value, vm) => {
                    this.setState({
                        band: value.target.value
                    }, vm.props.form.setFieldsValue({
                        channel: "",
                    }))
                },
            }, {
                type: "Select",
                labelName: "@信道",
                valName: "channel",
                nativeProps: {
                    placeholder: "@请选择信道"
                },
                rules: [{required: true, message: "@请选择信道"}],
                children: this.state.band === "2.4G" ? ghzChannel2_4 : ghzChannel5,

            }, {
                type: "Select",
                labelName: "@网段",
                valName: "net_id",
                nativeProps: {
                    placeholder: "@请选择网段"
                },
                rules: [{required: true, message: "@请选择网段"}],
                children: templateOptions

            },
            ]

        };
        const columns = [{
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',
        }, {
            title: '@SSID',
            dataIndex: 'ssid',
            key: 'ssid',
        }, {
            title: '@认证方式',
            dataIndex: 'encryption',
            key: 'encryption',
        }, {
            title: '@密码',
            dataIndex: 'password',
            key: 'password',
        }, {
            title: '@隐藏SSID',
            dataIndex: 'ssid_is_hidden',
            key: 'ssid_is_hidden',
            render: (index, record) => {
                return index ? "@是" : "@否"
            }
        }, {
            title: '@关联频段',
            dataIndex: 'band',
            key: 'band',
        }, {
            title: '@信道',
            dataIndex: 'channel',
            key: 'channel',
            render: (index) => {
                return index === "none" ? "AUTO" : index
            }
        }, {
            title: '@网段',
            dataIndex: 'lan_name',
            key: 'lan_name',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed:'right',
            width:100,
            render: (index, record) => {
                return (
                    <div>
                        <Operations
                            hasCustom={true} customIcon={"copy"} messages={"@确认复制模板？"} cunsom={() => this.coppy(record)}
                            hasEdit={true} edit={() => this.edit(record)}
                            hasDelete={true} delete={() => this.delete(record)}
                        />
                    </div>
                )
            }
        },]

        return (
            <Card className="card">
                <HeaderBar hasSearch={true}
                           selectPlaceHolder={'@请选择状态'}
                           selectOneWidth={220}
                           hasAdd={true}
                           hasDelete={false}
                           add={this.handleOpenAdd}
                           submit={this.search}
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                           selectOneShowSearch={true}/>
                <BossTable columns={columns} dataSource={this.props.ci3201Info.dataSource}/>
                <BossEditModal {...ModalOptions} />
            </Card>
        )
    }
}

export default injectIntl(CI3201);