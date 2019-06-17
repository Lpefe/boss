/*@商务-客户管理*/
import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Card, Input, Modal, Select} from 'antd';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
import {_crypto} from "../../../utils/commonUtilFunc";

const Option = Select.Option;

class BI0101C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company: "",
            status: "",
            isRendered: false,
            companyModalShow: false,
            editRecord: {},
            passwordConfirmShow: false,
            password: "",
            deleteId: "",
            record: {},
            editId: "",
            testVisible: false,
            SelectValue: "",
            judgePerson: false,
            judgePersontechnology: true
        }
    }

    componentDidMount() {
        this.getCompanyStatistics();
        this.getCompanyList();
        this.judgePerson()
    }

    componentDidUpdate() {
        if (this.props.bi0101Info.stats.status && !this.state.isRendered) {
            this.setState({
                isRendered: true
            })
        }
    }

    judgePerson = () => {
        if (sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "商务主管") {
            this.props.dispatch({
                type: "bi0101Info/get_related_person_list_technology",
                payload: {
                    sub: 2
                }
            });
            this.props.dispatch({
                type: "bi0101Info/get_related_person_list_business",
                payload: {
                    sub: 1
                }
            });
            this.setState({
                judgePerson: true,
            })
        } else if (sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "技术支持") {
            this.props.dispatch({
                type: "bi0101Info/get_related_person_list_technology",
                payload: {
                    role: "supercxptechsupport,supercxptechadmin"
                }
            });
            this.props.dispatch({
                type: "bi0101Info/get_related_person_list_business",
                payload: {
                    role: "supercxpbusiness,supercxpbizadmin"
                }
            });
            this.setState({
                judgePerson: false,
                judgePersontechnology: false
            })
        } else if (sessionStorage.getItem("role") === "supercxptechadmin" || sessionStorage.getItem("role") === "技术支持主管") {
            this.props.dispatch({
                type: "bi0101Info/get_related_person_list_technology",
                payload: {
                    sub: 1
                }
            });
            this.props.dispatch({
                type: "bi0101Info/get_related_person_list_business",
                payload: {
                    role: "supercxpbusiness,supercxpbizadmin"
                }
            });
            this.setState({
                judgePerson: false,
                judgePersontechnology: true,
            })
        }
        else {
            this.props.dispatch({
                type: "bi0101Info/get_related_person_list_technology",
                payload: {
                    sub: 3
                }
            });
            this.props.dispatch({
                type: "bi0101Info/get_related_person_list_business",
                payload: {
                    role: "supercxpbusiness,supercxpbizadmin"
                }
            });
            this.setState({
                judgePerson: false,
            })
        }
    };


    getCompanyList() {
        this.props.dispatch({
            type: "bi0101Info/getCompanyList",
            payload: {
                company: this.state.company,
                status: this.state.status,
            }
        })
    }

    getCompanyStatistics = () => {
        this.props.dispatch({
            type: "bi0101Info/get_company_stat",
            payload: {}
        })
    };

    closeAddModal = () => {
        this.setState({
            companyModalShow: false,
            editId: "",
            editRecord: {},
        })
    };

    handleOpenAddCompanyModal = () => {
        if (sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "@商务主管") {
            this.setState({
                companyModalShow: true,
            })
        } else if (sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "@商务") {
            this.setState({
                companyModalShow: true,
                editRecord: {
                    business_related_id: parseInt(sessionStorage.getItem("person_id"), 10)
                }
            })

        }
    };


    search = (value) => {
        this.setState({
            company: value || ""
        }, () => {
            this.getCompanyList();
        })
    };

    handleSelectCompanyStatus = (value) => {
        this.setState({
            status: value || "",
            SelectValue: value,
        }, () => {
            this.getCompanyList();
        })
    };


    deleteCompany = (record) => {
        this.setState({
            deleteId: record.id,
            passwordConfirmShow: true,
            record: record

        })
    };

    cancelPasswordConfirm = () => {
        this.setState({
            deleteId: "",
            passwordConfirmShow: false,
            password: ""
        })
    };

    deleteCompanyConfirm = () => {
        this.props.dispatch({
            type: "bi0101Info/delete_company",
            payload: {
                id: this.state.deleteId,
                password: _crypto(this.state.password),
                records: [this.state.record]
            }
        });
        this.setState({
            deleteId: "",
            passwordConfirmShow: false,
            password: "",
            record: {},
        })
    };

    handleInputPassword = (e) => {
        this.setState({
            password: e.target.value
        })
    };
    handleOpenEditCompanyModal = (record) => {
        this.setState({
            companyModalShow: true,
            editId: record.id,
            editRecord: record
        })
    };

    render() {
        const columns = [{
            title: '@状态',
            dataIndex: 'type',
            key: 'type',
            render: (index, record) => {
                switch (record.type) {
                    case "stoping":
                        return <span style={{color: "#FF1904",cursor:"pointer"}} onClick={()=>this.handleSelectCompanyStatus("停用")}>{"@停用"}</span>
                    case "trying":
                        return <span style={{color: "#FFD02D",cursor:"pointer"}} onClick={()=>this.handleSelectCompanyStatus("试用")}>{"@试用"}</span>
                    case "formal":
                        return <span style={{color: "#17C700",cursor:"pointer"}} onClick={()=>this.handleSelectCompanyStatus("正式")}>{"@正式"}</span>
                    default:
                        break;
                }
            }
        }, {
            title: '@客户数',
            dataIndex: 'nums',
            key: 'nums',
        }, {
            title: '@设备数',
            dataIndex: 'devices',
            key: 'devices',
        }, {
            title:'@总带宽(M)',
            dataIndex: 'total_bandwidth',
            key: 'total_bandwidth',
        }, {
            title: '@总链路',
            dataIndex: 'links',
            key: 'links',
        }, {
            title: '@云VPN',
            dataIndex: 'cloud_vpn',
            key: 'cloud_vpn',
        }, {
            title: '@云专线',
            dataIndex: 'cloud_spline',
            key: 'cloud_spline',
        }, {
            title: '@超级云专线',
            dataIndex: 'super_cloud_spline',
            key: 'super_cloud_spline',
        },];

        const linkColumns = [{
            title: '@创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        }, {
            title: '@企业名称',
            dataIndex: 'company',
            key: 'company',
            width: 300,
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/bi0101/bi0001",
                    search: "?id=" + record.id + "&name=" + this.state.SelectValue + "&selectvalue=" + this.state.company + "&firstName=" + record.company
                }}>{record.company}</Link>
            }
        }, {
            title: '@企业简称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            width: 50,
            render: (index, record) => {
                switch (record.status) {
                    case "停用":
                        return <span style={{color: "#FF1904"}}>{"@停用"}</span>
                    case "试用":
                        return <span style={{color: "#FFD02D"}}>{"@试用"}</span>
                    case "正式":
                        return <span style={{color: "#17C700"}}>{"@正式"}</span>
                    default:
                        break;
                }
            }
        }, {
            title: "@商务",
            dataIndex: 'business',
            key: 'business',
            width: 60
        }, {
            title: "@技术支持",
            dataIndex: 'techsupport',
            key: 'techsupport',
        }, {
            title: "@公司",
            dataIndex: 'business_department',
            key: 'business_department',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:100,
            fixed:'right',
            render: (index, record) => {
                return <Operations 
                                   hasEdit={true} hasDelete={true} edit={() => this.handleOpenEditCompanyModal(record)}
                                   delete={() => this.deleteCompany(record)}/>
            }
        },];
        const rowSelection = {
            fixed: 'left'
        };

        const options = [
            <Option key="正式" value="正式">{"@正式"}</Option>,
            <Option key="试用" value="试用">{"@试用"}</Option>,
            <Option key="停用" value="停用">{"@停用"}</Option>,
        ];
        const ModalOptions = {
            title: this.state.editId ? "@编辑企业" : "@新增企业",
            visible: this.state.companyModalShow,
            onCancel: this.closeAddModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "bi0101Info/update_company" : "bi0101Info/create_company",
            extraUpdatePayload: {id: this.state.editId},
            initPayload:{
                company: this.state.company,
                status: this.state.status,
            },
            initialValues: this.state.editRecord,
            InputItems: [{
                type: "Input",
                labelName: "@企业名称",
                valName: "company",
                nativeProps: {
                    placeholder: "@请输入企业名称"
                },
                rules: [{required: true, message: "@请输入企业名称"}, {
                    max: 128,
                    message: "@企业名称最多输入128字符"
                }],
            }, {
                type: "Input",
                labelName: "@企业简称",
                valName: "company_abbr",
                nativeProps: {
                    placeholder: "@请输入企业简称"
                },
                rules: [{required: true, message: "@请输入企业简称"}, {
                    max: 20,
                    message: "@企业简称最多输入20字符"
                }],
            }, {
                type: "Select",
                labelName: "@客户状态",
                valName: "status",
                nativeProps: {
                    placeholder: "@请选择客户状态"
                },
                children: [{name: "@正式", value: "正式", key: "正式"}, {
                    name: "@试用",
                    value: "试用",
                    key: "试用"
                }, {
                    name: "@停用",
                    value: "停用",
                    key: "停用"
                }],
                rules: [{required: true, message: "@请选择客户状态"}]
            }, {
                type: "Input",
                labelName: "@管理员账号",
                valName: "company_admin",
                nativeProps: {
                    placeholder: "@请输入企业管理员账号",
                    disabled: this.state.editId !== ""
                },
                rules: [{required: true, message: "@请输入企业管理员账号"}, {
                    type: 'email',
                    message: "@请输入正确邮箱地址"
                }],
            }, {
                type: "Select",
                labelName: "@商务",
                valName: "business_related_id",
                nativeProps: {
                    disabled: !this.state.judgePerson,
                    placeholder: "@请选择商务",
                },
                rules: [{required: true, message: "@请选择商务"}],
                children: this.props.bi0101Info.businessList.map((item) => {
                    return {key: item.id, value: item.id, name: item.name}
                })
            }, {
                type: "Select",
                labelName: "@技术支持",
                valName: "technology_related_id",
                nativeProps: {
                    disabled: !this.state.judgePersontechnology,
                    placeholder: "@请选择技术支持"
                },
                rules: [{required: true, message: "@请选择技术支持"}],
                children: this.props.bi0101Info.personList.map((item) => {
                    return {key: item.id, value: item.id, name: item.name}
                })
            }, {
                type: "TextArea",
                labelName: "@备注",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入备注"
                },
                rules: [{required: false, message: "@请输入备注"}, {
                    max: 128,
                    message: "@备注最多输入128字符"
                }],
            },]
        };
        return (
            <div>
                <Card className="card">
                    <section className="linkContainer">
                        <BossTable pagination={false} columns={columns}
                                   dataSource={this.props.bi0101Info.stats} rowKey={record => record.type}/>
                    </section>
                </Card>
                <Card className="card">
                    <HeaderBar hasSearch={true} hasSelect={true}
                               hasAdd={sessionStorage.getItem("role") !== "supercxptechsupport" && sessionStorage.getItem("role") !== "supercxptechadmin"}
                               hasDelete={false}
                               selectPlaceHolder={"@请选择客户状态"}
                               add={this.handleOpenAddCompanyModal} options={options}
                               selectOneMethod={this.handleSelectCompanyStatus} submit={this.search}/>
                    <BossTable columns={linkColumns} dataSource={this.props.bi0101Info.companyList}
                               rowSelection={rowSelection}/>
                    <Modal title={"@如需删除企业,请输入账户密码"} visible={this.state.passwordConfirmShow}
                           onCancel={this.cancelPasswordConfirm} onOk={this.deleteCompanyConfirm}
                           bodyStyle={{textAlign: "center"}} destroyOnClose>
                        <span style={{color: "rgba(0,0,0,.85)"}}>{"@请输入密码"}:  </span>
                        <input type="password" style={{opacity: 0, height: 1, width: 1}}/>{/*//无用input,防止chrome自动填充*/}
                        <Input type="password" style={{width: 200}} onChange={this.handleInputPassword}
                               name="fakepasswordremembered"/>
                    </Modal>
                    <BossEditModal {...ModalOptions}/>
                </Card>
            </div>
        )
    }
}

export default withRouter(injectIntl(BI0101C));
