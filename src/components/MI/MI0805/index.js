/*@运维-客户端升级*/
import React from 'react';
import {Card, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import BossEditModal from "../MI1902/subComponents/BossEditModal";
import Operations from "../MI1901/subComponents/Operations";

const Option = Select.Option;

class MI0805C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editModalShow: false,
            editRecord: {},
            editId: "",
            name: "",
            company_id: "",
            selectedOS: "",
            selectedIds: [],
            records: [],
        };

    }

    componentDidMount() {
        this.get_app_version_company();
        this.get_company_list();
    }

    get_app_version = () => {
        this.props.dispatch({
            type: "mi0805Info/get_app_version",
            payload: {
                os: this.state.selectedOS
            }
        })
    };

    handleSelectCompany = (value) => {
        this.setState({
            company_id: value || ""
        }, () => {
            this.get_app_version_company()
        })
    };

    get_os_list = () => {
        this.props.dispatch({
            type: "mi0805Info/get_os_list",
            payload: {
                os_list: 1
            }
        })
    };

    get_app_version_company = () => {
        this.props.dispatch({
            type: "mi0805Info/get_app_version_company",
            payload: {
                company_id: this.state.company_id,
                name: this.state.name
            }
        })
    };

    get_company_list = () => {
        this.props.dispatch({
            type: "mi0805Info/get_company_list",
            payload: {}

        })
    };

    handleEditModalShow = (record) => {
        this.setState({
            editModalShow: true,
            editRecord: record.id ? record : {},
            editId: record.id,
        }, () => {
            this.get_os_list();
        })
    };

    handleEditModalClose = () => {
        this.setState({
            editModalShow: false,
            editRecord: {},
            editId: "",
        })
    };

    handleDelete = (record) => {
        this.props.dispatch({
            type: "mi0805Info/delete_app_version_company",
            payload: {
                delete: {
                    ids: [record.id],
                    records: [record]
                },
                init: {
                    company_id: this.state.company_id,
                    name: this.state.name
                }
            }
        })
    };

    handleMultipleSelect = (selectedIds, selectedRecords) => {
        this.setState({
            selectedIds: selectedIds,
            records: selectedRecords
        })
    };

    delete_app_version_company_batch = () => {
        this.props.dispatch({
            type: "mi0805Info/delete_app_version_company",
            payload: {
                delete: {
                    ids: this.state.selectedIds,
                    records: this.state.records
                },
                init: {
                    company_id: this.state.company_id,
                    name: this.state.name
                }
            }
        })
    };

    handleSubmit = (value) => {
        this.setState({
            name: value
        }, () => {
            this.get_app_version_company();
        })
    };

    render() {
        const columns = [{
            title: '@日期',
            dataIndex: 'create_time',
            key: 'create_time',
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: '@版本号',
            dataIndex: 'version',
            key: 'version',
        }, {
            title: '@客户端类型',
            dataIndex: 'os',
            key: 'os',
        }, {
            title: '@备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
                return <Operations edit={() => this.handleEditModalShow(record)} hasEdit={true} hasDelete={true}
                                   delete={() => this.handleDelete(record)}/>
            }
        }];
        const ModalOptions = {
            title: this.state.editId ? "@编辑设置" : "@升级设置",
            visible: this.state.editModalShow,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "mi0805Info/update_app_version_company" : "mi0805Info/create_app_version_company",
            extraUpdatePayload: {id: this.state.editRecord.id,},
            onCancel: this.handleEditModalClose,
            initPayload: {
                company_id: this.state.company_id,
                name: this.state.name
            },
            InputItems: [{
                type: "Select",
                labelName: "@企业名称",
                valName: "company_ids",
                nativeProps: {
                    placeholder: "@请选择企业",
                    mode: this.state.editId ? "" : "multiple"
                },
                rules: [{required: true, message: "@请选择企业"}],
                children: this.props.mi0805Info.companyList.map((item) => {
                    return {key: item.id, value: item.id, name: item.company_abbr}
                })
            }, {
                type: "Select",
                labelName: "@客户端类型",
                valName: "os",
                nativeProps: {
                    placeholder: "@请选择客户端类型",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{required: true, message: "@请选择客户端类型"}],
                children: [/*{key: "ANDROID", value: "ANDROID", name: "Android"},
                    {key: "MAC", value: "MAC", name: "MAC"},
                    {key: "IOS", value: "IOS", name: "iOS"},*/
                    {key: "WINDOWS", value: "WINDOWS", name: "Windows"}],
                onChange: (value, component) => {
                    this.setState({
                        selectedOS: value
                    }, () => {
                        this.get_app_version();
                        component.props.form.setFieldsValue({version: undefined})
                    })
                }
            }, {
                type: "Select",
                labelName: "@请选择版本号",
                valName: "version",
                nativeProps: {
                    placeholder: "@请选择版本号",
                },
                rules: [{required: true, message: "@请选择版本号"}],
                children: this.props.mi0805Info.versionList.map((item) => {
                    return {key: item.id, value: item.version, name: item.version}
                })

            }, {
                type: "TextArea",
                labelName: "@备注",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入备注",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{max: 256, message: "@备注最大长度为256字符"}]
            }]
        };

        const rowSelection = {
            fixed: true,
            onChange: this.handleMultipleSelect
        };

        const options = this.props.mi0805Info.companyList.map((item) => {
            return <Option value={item.id} key={item.id}>{item.company_abbr}</Option>
        });
        return (
            <Card className="card">
                <HeaderBar selectedKeys={this.state.selectedIds} hasAdd={true} add={this.handleEditModalShow}
                           selectPlaceHolder="@请选择企业"
                           selectOneMethod={this.handleSelectCompany}
                           delete={this.delete_app_version_company_batch} hasSelect={true} options={options}
                           addAlias="@升级设置" hasDelete={true}
                           hasSearch={true} submit={this.handleSubmit}/>
                <BossTable rowSelection={rowSelection} columns={columns}
                           dataSource={this.props.mi0805Info.versionCompanyList}/>
                <BossEditModal {...ModalOptions} />
            </Card>
        )
    }
}

export default MI0805C;