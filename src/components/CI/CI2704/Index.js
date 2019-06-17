/*@客户-wifi设备*/
import React from 'react';
import {Card, Modal, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import {commonTranslate} from "../../../utils/commonUtilFunc";
import {injectIntl} from "react-intl";


class CI2704 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editRecord: {},
            editId: "",
            disabled: false,
            configvisible: false,
            selectStatus: "",
            searchName: ""
        };

    }

    componentDidMount() {
        this.get_wifi();
    }

    get_wifi = () => {
        this.props.dispatch({
            type: "ci2704Info/get_wifi",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.searchName
            }
        });
    };
    edit = (record) => {
        if (record.encryption === "None") {
            this.setState({
                disabled: true,
            })
        }
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
        }, function () {
            this.get_wifi()
        })
    }
    search = (value) => {
        this.setState({
            searchName: value ? value : ""
        }, function () {
            this.get_wifi()
        })
    };
    configCancel = () => {
        this.setState({
            configvisible: false
        }, function () {
            this.get_wifi()
        })
    }
    gotoConfig = (value) => {
        this.props.dispatch({
            type: "ci2704Info/get_wifi_config_file",
            payload: {
                sn: value.sn
            }
        }).then(
            this.setState({
                configvisible: true
            })
        )
    }
    configSubmit = () => {
        this.setState({
            configvisible: false
        })
    }

    render() {
        const columns = [{
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
            width:200,
            fixed:'left',
            render: (index, record) => {
                return <span className="common-link-icon" onClick={() => this.gotoConfig(record)}>{record.name}</span>
            }
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
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
            dataIndex: 'key',
            key: 'key',
        }, {
            title: '@信道',
            dataIndex: 'channel',
            key: 'channel',
        }, {
            title: '@频段',
            dataIndex: 'hwmode',
            key: 'hwmode',
        }, {
            title: 'VLAN',
            dataIndex: 'network',
            key: 'network',
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',
        }, {
            title: "@硬件ID",
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:75,
            fixed:'right',
            render: (index, record) => {
                return (
                    <div>
                        <Operations
                            hasEdit={true} edit={() => this.edit(record)}
                        />
                    </div>
                )
            }
        },]
        const ghzChannel2_4 = [
            {key: "channel", value: "none", name: "AUTO"},
            {key: "channel", value: "1", name: "1"},
            {key: "channel", value: "2", name: "2"},
            {key: "channel", value: "3", name: "3"},
            {key: "channel", value: "4", name: "4"},
            {key: "channel", value: "5", name: "5"},
            {key: "channel", value: "6", name: "6"},
            {key: "channel", value: "7", name: "7"},
            {key: "channel", value: "8", name: "8"},
            {key: "channel", value: "9", name: "9"},
            {key: "channel", value: "10", name: "10"},
            {key: "channel", value: "11", name: "11"}]

        const ghzChannel5 = [
            {key: "channel", value: "none", name: "AUTO"},
            {key: "channel", value: "36", name: "36"},
            {key: "channel", value: "40", name: "40"},
            {key: "channel", value: "44", name: "44"},
            {key: "channel", value: "48", name: "48"},
            {key: "channel", value: "149", name: "149"},
            {key: "channel", value: "153", name: "153"},
            {key: "channel", value: "157", name: "157"},
            {key: "channel", value: "161", name: "161"},
            {key: "channel", value: "165", name: "165"},
        ]
        const ModalOptions = {
            title: "@个性化配置",
            visible: this.state.visible,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: "ci2704Info/update_wifi",
            onCancel: this.closeAddModal,
            hasSubmitCancel: this.state.editId === undefined,
            extraUpdatePayload: {
                ids: [this.state.editRecord.id],
                records: [this.state.editRecord]
            },
            initPayload: {
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.searchName
            },
            parentVm: this,
            InputItems: [{
                type: "Input",
                labelName: '@SSID',
                valName: "ssid",
                rules: [{required: true,}],
                nativeProps: {
                    disabled: true,
                },
            }, {
                type: "Input",
                labelName: '@频段',
                valName: "hwmode",
                rules: [{required: true,}],
                nativeProps: {
                    disabled: true,
                },
            }, {
                type: "Select",
                labelName: "@认证方式",
                valName: "encryption",
                nativeProps: {
                    placeholder: "@请选择认证方式"
                },
                rules: [{required: true, message: "@请选择认证方式"}],
                children: [
                    {key: "1", value: "None", name: "None"},{key: "encryption", value: "WPA2-PSK", name: "WPA2-PSK"},
                    {key: "2", value: "WPA-PSK", name: "WPA-PSK"},
                    {key: "3", value: "WPA-PSK/WPA2-PSK", name: "WPA-PSK/WPA2-PSK"},],
                onChange: (value, vm) => {
                    if (value === "None") {
                        this.setState({
                            disabled: true
                        }, vm.props.form.setFieldsValue({
                            key: "",
                        }))
                    } else {
                        this.setState({
                            disabled: false
                        }, vm.props.form.setFieldsValue({
                            key: this.state.editRecord.key,
                        }))
                    }
                }
            }, {
                type: "Input",
                labelName: '@密码',
                valName: "key",
                rules: [{required: !this.state.disabled,}, {min: 8, message: '@密码长度不得小于8位'},{max: 32, message: '@密码长度不得大于32位'}],
                nativeProps: {
                    disabled: this.state.disabled,
                },
            }, {
                type: "Select",
                labelName: "@信道",
                valName: "channel",
                nativeProps: {
                    placeholder: "@请选择信道"
                },
                rules: [{required: true, message: "@请选择信道"}],
                children: this.state.editRecord.channel === 2.4 ? ghzChannel2_4 : ghzChannel5,

            },
            ]
        };
        return (
            <Card className="card">
                <HeaderBar hasSearch={true}
                           hasDelete={false}
                           submit={this.search}
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                           selectOneShowSearch={true}/>
                <BossTable columns={columns} dataSource={this.props.ci2704Info.dataSource}/>
                <BossEditModal {...ModalOptions} />
                {/* 点击设备名称弹出wifi配置 */}
                <Modal
                    title="WIFI Config"
                    visible={this.state.configvisible}
                    onOk={this.configSubmit}
                    onCancel={this.configCancel}>
                    <div dangerouslySetInnerHTML={{__html: this.props.ci2704Info.configSource}}></div>
                </Modal>
            </Card>
        )
    }
}

export default injectIntl(CI2704);