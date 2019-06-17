/*@客户-企业信息*/
import React from 'react';
import {Form,} from 'antd';
import './subStyle.scss';
import {connect} from 'dva';
import HeaderBar from "../../../Common/HeaderBar";
import BossTable from "../../../Common/BossTable";
import BossEditModal from "../../../Common/BossEditModal";
import Operations from "../../../Common/Operations";
import {injectIntl} from "react-intl";
class ContactInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyModalShow: false,
            editId: "",
            editRecord: {},

        };
        this.isBusiness = sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin"

    }

    componentDidMount() {
        this.get_company_contact();
    }

    get_company_contact = () => {
        this.props.dispatch({
            type: "ci1001Info/get_company_contact",
            payload: {
                company_id: this.props.id||sessionStorage.getItem("companyId")
            }
        })
    };

    closeAddModal = () => {
        this.setState({
            companyModalShow: false,
            editId: "",
            editRecord: {},
        })
    };

    handleOpenAddCompanyModal = (record) => {
        this.setState({
            companyModalShow: true,
            editId: record.id,
        })
    };

    handleOpenEditCompanyModal=(record)=>{
        this.setState({
            companyModalShow: true,
            editId: record.id,
            editRecord: record,
        })
    };

    delete_company_contact=(record)=>{
        this.props.dispatch({
            type:"ci1001Info/delete_company_contact",
            payload:{
                delete:{ids:[record.id],records:[record]},
                init:{
                    company_id: this.props.id||sessionStorage.getItem("companyId")
                }
            }
        })
    };

    render() {
        const __=this.props.intl.formatMessage;
        const columns = [
            {
                title: '@联系人姓名',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '@职务',
                dataIndex: 'title',
                key: 'title',
            }, {
                title: '@联系电话',
                dataIndex: 'tel',
                key: 'tel',
            }, {
                title: '@电子邮箱',
                dataIndex: 'mail',
                key: 'mail',
            }, {
                title: '@联系地址',
                dataIndex: 'address',
                key: 'address',
            }, {
                title: '@备注',
                dataIndex: 'remark',
                key: 'remark',
            }, {
                title: '@操作',
                dataIndex: 'operation',
                key: 'operation',
                width:100,
                fixed:'right',
                align: "center",
                render:(index,record)=>{
                    return <Operations hasEdit={true} hasDelete={true} edit={()=>this.handleOpenEditCompanyModal(record)} delete={()=>this.delete_company_contact(record)}/>
                }
            },
        ];
        const ModalOptions = {
            title: this.state.editId ?  '@编辑联系人' :  '@新增联系人',
            visible: this.state.companyModalShow,
            onCancel: this.closeAddModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci1001Info/update_company_contact" : "ci1001Info/create_company_contact",
            extraUpdatePayload: {id: this.state.editId, company_id: this.props.id||sessionStorage.getItem("companyId")},
            initPayload: {company_id: this.props.id||sessionStorage.getItem("companyId")},
            initialValues: this.state.editRecord,
            InputItems: [{
                type: "Input",
                labelName:  '@联系人姓名',
                valName: "name",
                nativeProps: {
                    placeholder:  '@请输入联系人姓名'
                },
                rules: [{required: true, message: '@请输入联系人姓名'}, {max: 50, message: '@联系人姓名最多输入50字符'}],
            }, {
                type: "Input",
                labelName:  '@职务',
                valName: "title",
                nativeProps: {
                    placeholder:  '@请输入职务'
                },
                rules: [{max: 50, message: '@职务最多输入50字符'}],
            }, {
                type: "Input",
                labelName:  '@联系电话',
                valName: "tel",
                nativeProps: {
                    placeholder:  '@请输入联系电话'
                },
                rules: [{required: true, message:  '@请输入联系电话'}, {max: 50, message: '@联系电话最多输入50字符'}],
            }, {
                type: "Input",
                labelName:  '@电子邮箱',
                valName: "mail",
                nativeProps: {
                    placeholder:  '@请输入电子邮箱'
                },
                rules: [{type: 'email', message: '@请输入正确格式邮箱地址',},
                    {max: 50, message: '@邮箱最多输入50字符'}],
            }, {
                type: "Input",
                labelName:  '@联系地址',
                valName: "address",
                nativeProps: {
                    placeholder:  '@请输入联系地址'
                },
                rules: [{max: 50, message: '@联系地址最多输入128字符'}],
            }, {
                type: "Input",
                labelName:  '@备注',
                valName: "remark",
                nativeProps: {
                    placeholder:  '@请输入备注'
                },
                rules: [{max: 50, message: '@备注最多输入128字符'}],
            },]
        };
        return <div>
            <HeaderBar hasSearch={false} hasSelect={false} hasAdd={true} hasDelete={false}
                       add={this.handleOpenAddCompanyModal}
                       selectOneMethod={this.handleSelectCompanyStatus} submit={this.search}/>
            <BossTable columns={columns} dataSource={this.props.ci1001Info.contactList}/>
            <BossEditModal {...ModalOptions}/>
        </div>
    }
}

function mapDispatchToProps({ci1001Info}) {
    return {ci1001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(ContactInfo)));