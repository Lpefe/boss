/*@技术支持-自定义平台应用*/
import React from 'react';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {commonTranslate, validateIp, validatePort} from "../../../utils/commonUtilFunc";
import BossEditModal from "../../Common/BossEditModal";
import {Select,Card} from 'antd';
import Operations from "../../Common/Operations";
import {withRouter} from "react-router-dom";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";

const Option = Select.Option;

class CI2301C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editModalShow: false,
            editRecord: {},
            editId: "",
            appidb: "",
            name: "",
            company_id: ""
        };
        this.appPageType = this.props.location.pathname === "/main/bi1401" ? "1" : "2"; //1代表自定义平台应用,2代表自定义企业应用,1,2均是技术支持角色页面
        if (sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "companystaff") {
            this.appPageType = "3"//3代表客户企业自定义企业应用
        }
    }

    componentDidMount() {
        this.get_dpi_apps_custom();
        this.get_app_category();
        if (this.appPageType === "2") {
            this.get_company_list();
        }
    }

    get_company_list = () => {
        this.props.dispatch({
            type: "ci2301Info/get_company_list",
            payload: {}
        })
    };

    handleSelectCompany = (value) => {
        this.setState({
            company_id: value || ""
        }, () => {
            this.get_dpi_apps_custom();
        })
    };


    get_dpi_apps_custom = () => {
        let payload = {
            appidb: this.state.appidb,
            name: this.state.name,
            company_id: this.state.company_id
        };
        if (this.appPageType === "1") {
            payload.company_id = "0"
        } else if (this.appPageType === "3") {
            payload.company_id = sessionStorage.getItem("companyId")
        }
        this.props.dispatch({
            type: "ci2301Info/get_dpi_apps_custom",
            payload: payload
        })
    };

    get_app_category = () => {
        this.props.dispatch({
            type: "ci2301Info/get_app_category",
            payload: {}
        })
    };

    handleSelectAppIdb = (value) => {
        this.setState({
            appidb: value===undefined?"":value
        }, () => {
            this.get_dpi_apps_custom();
        })
    };

    handleSubmitSearch = (value) => {
        this.setState({
            name: value
        }, () => {
            this.get_dpi_apps_custom();
        })
    };


    addApp = () => {
        let vm = this;
        this.setState({
            editModalShow: true
        });
        setTimeout(function () {
            vm.setState({
                srcIpType: "1",
                dstIpType: "1",
                srcPortType: "1",
                dstPortType: "1",
                hasPort: "1",
            })
        }, 0)

    };

    handleUpdateDpiAppsCustom = (record) => {
        let vm = this;
        this.setState({
            editModalShow: true,
            editId: record.id,
            editRecord: record,
        });
        setTimeout(function () {
            vm.setState({
                srcIpType: record.srcIpType,
                dstIpType: record.dstIpType,
                srcPortType: record.srcPortType,
                dstPortType: record.dstPortType,
                hasPort: record.hasPort,
            })
        }, 0)//这四个参数控制表单的两类输入项的切换,因为setState的异步属性,如果写在一个setState中可能在打开modal之后才会切换type,导致validator报错,故使用setTimeout保证执行顺序,可能把这三个参数写在modal里会好一点.
    };

    cancelModal = () => {
        this.props.form.resetFields();
        this.setState({
            editModalShow: false,
            editId: "",
            editRecord: {},
        })
    };

    handleDelete = (record) => {
        this.props.dispatch({
            type: "ci2301Info/delete_dpi_apps_custom",
            payload: {
                delete: {ids: [record.id],records:[record]},
                init: {company_id: this.appPageType === "1" ? "0" : (this.appPageType === "2" ? this.state.company_id : sessionStorage.getItem("companyId")),}
            }
        })
    };


    render() {
        const columns = [{
            title: 'APPID',
            dataIndex: 'appids',
            key: 'appids',
        }, {
            title: '@应用名称',
            dataIndex: 'app_name',
            key: 'app_name',
        }, {
            title:'@类别',
            dataIndex: 'app_category_name',
            key: 'app_category_name',

        }, {
            title: '@源地址',
            dataIndex: 'src_ip',
            key: 'src_ip',

        }, {
            title: '@源端口',
            dataIndex: 'src_port',
            key: 'src_port',

        }, {
            title: '@目标地址',
            dataIndex: 'dst_ip',
            key: 'dst_ip',

        }, {
            title: '@目标端口',
            dataIndex: 'dst_port',
            key: 'dst_port',

        }, {
            title: '@协议',
            dataIndex: 'protocol',
            key: 'protocol',

        }, {
            title: '@备注',
            dataIndex: 'remark',
            key: 'remark',

        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:100,
            fixed:'right',
            render: (text, record) => {
                return <Operations hasEdit={true} hasDelete={true} edit={() => this.handleUpdateDpiAppsCustom(record)}
                                   delete={() => this.handleDelete(record)}/>
            }
        },];
        const companyCol = {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        };
        if (this.appPageType === "2") {
            columns.splice(3, 0, companyCol)
        }
        const ModalOptions = {
            title: this.state.appConfigId ? "@编辑自定义应用" : "@添加自定义应用",
            visible: this.state.editModalShow,
            onCancel: this.cancelModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci2301Info/update_dpi_apps_custom" : "ci2301Info/create_dpi_apps_custom",
            extraUpdatePayload: {
                company_id: this.appPageType === "1" ? 0 : sessionStorage.getItem("companyId"),
                id: this.state.editId,
            },
            initialValues: Object.assign({}, this.state.editRecord),
            initPayload: {
                company_id: this.appPageType === "1" ? 0 : (this.appPageType === "2" ? this.state.company_id : sessionStorage.getItem("companyId")),
                appidb: this.state.appidb,
                name: this.state.name,
            },
            InputItems: [this.appPageType === "2" ? {
                type: "Select",
                labelName: "@企业名称",
                valName: "company_id",
                nativeProps: {
                    placeholder: "@请选择企业"
                },
                rules: [{required: true, message: "@请选择企业"}],
                children: this.props.ci2301Info.companyList.map((item) => {
                    return {value: item.id, key: item.id, name: item.company_abbr}
                }),
            } : {}, {
                type: "Input",
                labelName: "@应用名称",
                valName: "app_name",
                nativeProps: {
                    placeholder: "@请输入应用名称",
                },
                rules: [{required: true, message: "@请输入应用名称"}],
            }, {
                type: "Select",
                labelName: "@类别",
                valName: "appidb",
                nativeProps: {
                    placeholder: "@请选择类别"
                },
                rules: [{required: true, message: "@请选择类别"}],
                children: this.props.ci2301Info.appCategory.map((item) => {
                    return {value: item.appidb, key: item.appidb, name: item.app_category_name}
                }),
            }, {
                type: "Select",
                labelName: "@协议",
                valName: "protocol",
                nativeProps: {
                    placeholder: "@请选择协议",
                },
                rules: [{required: true, message: "@请选择协议"}],
                children: [{key: "IP", value: "IP", name: "IP"}, {key: "TCP", value: "TCP", name: "TCP"}, {
                    key: "UDP",
                    value: "UDP",
                    name: "UDP"
                }, {key: "ICMP", value: "ICMP", name: "ICMP"}],
                onChange: (value) => {
                    if (value === "IP" || value === "ICMP") {
                        this.setState({
                            hasPort: "0"
                        })
                    } else {
                        this.setState({
                            hasPort: "1"
                        })
                    }
                }
            }, {
                type: "GroupInput",
                labelName: "@源地址",
                valName: "src_ip",
                nativeProps: {
                    placeholder: "@请输入源IP/IP段"
                },
                rules: [{required: true, message: "@请输入源IP/IP段"}, {validator: validateIp}],
            },
                this.state.hasPort === "1" ? {
                    type: "GroupInput",
                    labelName: "@源端口",
                    valName: "src_port",
                    nativeProps: {
                        placeholder: "@请输入源端口"
                    },
                    rules: [{required: true, message: "@请输入源端口"}, {validator: validatePort}],
                } : {},
                {
                    type: "GroupInput",
                    labelName: "@目标地址",
                    valName: "dst_ip",
                    nativeProps: {
                        placeholder: "@请输入目标IP/IP段"
                    },
                    rules: [{required: true, message: "@请输入目标IP/IP段"}, {validator: validateIp}],
                },
                this.state.hasPort === "1" ? {
                    type: "GroupInput",
                    labelName: "@目标端口",
                    valName: "dst_port",
                    nativeProps: {
                        placeholder: "@请输入目标端口"
                    },
                    rules: [{required: true, message: "@请输入目标端口"}, {validator: validatePort}],
                } : {}, {
                    type: "TextArea",
                    labelName: "@备注",
                    valName: "remark",
                    nativeProps: {
                        placeholder: "@请输入备注",
                        autosize: {minRows: 6, maxRows: 12},
                    },
                    rules: [],
                },]
        };
        if (this.appPageType === "2") {
            ModalOptions.extraUpdatePayload = {id: this.state.editId}
        }
        const optionOne = this.props.ci2301Info.appCategory.map((item) => {
            return <Option value={item.appidb} key={item.appidb}>{item.app_category_name}</Option>
        });
        const companyListOption = this.props.ci2301Info.companyList.map((item) => {
            return <Option value={item.id} key={item.id}>{item.company_abbr}</Option>
        });
        return (
            <Card className="card">
                <HeaderBar hasAdd={true} hasSelect={true} hasSearch={true} selectPlaceHolder="@请选择应用类别"
                           add={this.addApp} options={optionOne}
                           hasSelectTwo={true} selectTwoPlaceHolder="@请选择企业名称"
                           selectOneMethod={this.handleSelectAppIdb} submit={this.handleSubmitSearch}
                           optionsTwo={companyListOption} selectTwoMethod={this.handleSelectCompany}/>
                <BossTable columns={columns} dataSource={this.props.ci2301Info.dataSource}/>
                <BossEditModal {...ModalOptions}/>
            </Card>
        )
    }
}

export default withRouter(injectIntl(CI2301C));