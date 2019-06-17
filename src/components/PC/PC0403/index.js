/*@账号管理员-区域设置*/
import React from 'react';
import {Card} from 'antd';
import messages from "./LocaleMsg/messages";
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import BossEditModal from "../../Common/BossEditModal";
import {injectIntl} from "react-intl";
import Operations from "../../Common/Operations";
import {commonTranslate} from "../../../utils/commonUtilFunc";
import mapMessages from "../../../locales/mapMessages";


class PC0403C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editRecord: {},
            editModalShow: false,
            editId: "",
            name: ""
        };

    }

    componentDidMount() {
        this.get_address();
    }

    get_address = () => {
        this.props.dispatch({
            type: "pc0403Info/get_address",
            payload: {
                name: this.state.name
            }
        })
    };

    get_address_options = (level, parent_id) => {
        this.props.dispatch({
            type: "pc0403Info/get_address_options",
            payload: {
                level: level,
                parent_id: parent_id || ""
            }
        })
    };

    handleEditModalShow = (record) => {
        this.setState({
            editModalShow: true,
            editRecord: record.id ? record : {},
            editId: record.id
        }, () => {
            this.get_address_options(1);
            if (record.id) {
                this.get_address_options(2, record.level1_id)
            }
        })
    };

    handle_select_country = (value, vm) => {
        this.get_address_options(2, value);
        vm.props.form.setFieldsValue({"level2_id": []});
    };

    closeEditModal = () => {
        this.setState({
            editModalShow: false,
            editRecord: {},
            editId: ""
        })
    };

    searchAddress = (value) => {
        this.setState({
            name: value
        }, () => {
            this.get_address();
        })
    };

    delete_address = (record) => {
        this.props.dispatch({
            type: "pc0403Info/delete_address",
            payload: {
                update: {
                    ids: [record.id],
                    records: [record]
                },
                init: {
                    name: this.state.name
                }
            }
        })
    };

    render() {
        const __=commonTranslate(this);
        const columns = [{
            title: '@国家(地区)',
            dataIndex: 'level1_name',
            key: 'level1_name',
            render: (text) => {
                return __(mapMessages[text], text)
            }
        }, {
            title: '@省(直辖市)',
            dataIndex: 'level2_name',
            key: 'level2_name',
            render: (text) => {
                return __(mapMessages[text], text)
            }
        }, {
            title: '@地级市(省会)',
            dataIndex: 'level3_name',
            key: 'level3_name',
            render: (text) => {
                return __(mapMessages[text], text)
            }

        }, {
            title: '@经度',
            dataIndex: 'log',
            key: 'log',
        }, {
            title: '@纬度',
            dataIndex: 'lat',
            key: 'lat',
        }, {
            title: '@说明',
            dataIndex: 'remarks',
            key: 'remarks',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            render: (text, record) => {
                return <Operations hasDelete={true} hasEdit={true} edit={() => this.handleEditModalShow(record)}
                                   delete={() => this.delete_address(record)}/>
            }
        },];

        const modalOption = {
            title: this.state.editId ? "@编辑区域" : "@添加区域",
            visible: this.state.editModalShow,
            onCancel: this.closeEditModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "pc0403Info/update_address" : "pc0403Info/create_address",
            extraUpdatePayload: {id: this.state.editId},
            initialValues: this.state.editRecord,
            initPayload: {
                name: this.state.name
            },
            InputItems: [{
                type: "Select",
                labelName: "@国家(地区)",
                valName: "level1_id",
                nativeProps: {
                    placeholder: "@请选择国家(地区)",
                    showSearch: true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                onChange: this.handle_select_country,
                rules: [{required: true, message: "@请选择国家(地区)"}],
                children: this.props.pc0403Info.countryList.map((child) => {
                    return {value: child.id, name: __(mapMessages[child.name], child.name), key: child.id}
                })
            }, {
                type: "Select",
                labelName: "@省(直辖市)",
                valName: "level2_id",
                nativeProps: {
                    placeholder: "@请选择省(直辖市)",
                    showSearch: true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                rules: [{required: true, message: "@请选择省(直辖市)"}],
                children: this.props.pc0403Info.provinceList.map((child) => {
                    return {value: child.id, name: __(mapMessages[child.name]), key: child.id}
                }),
            }, {
                type: "Input",
                labelName: "@地级市(省会)",
                valName: "level3_name",
                nativeProps: {
                    placeholder: "@请输入地级市(省会)",
                    showSearch: true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                rules: [{required: true, message: "@请输入地级市(省会)"}],
            }, {
                type: "InputNumber",
                labelName: "@经度",
                valName: "log",
                nativeProps: {
                    placeholder: "@请输入经度",
                    style: {width: 130}
                },
                rules: [{required: true, message: "@请输入经度"}],
            }, {
                type: "InputNumber",

                labelName: "@纬度",
                valName: "lat",
                nativeProps: {
                    placeholder: "@请输入纬度",
                    style: {width: 130}
                },
                rules: [{required: true, message: "@请输入纬度"}],
            },]
        };
        return (
            <Card className="card">
                <HeaderBar hasAdd={true} add={this.handleEditModalShow} hasSearch={true} submit={this.searchAddress}/>
                <BossTable columns={columns} dataSource={this.props.pc0403Info.addressList}/>
                <BossEditModal {...modalOption}/>
            </Card>
        )
    }
}

export default injectIntl(PC0403C);