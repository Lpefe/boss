/*@客户-IP分组*/
import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import {validateIp} from "../../../utils/commonUtilFunc";
import {Card} from 'antd';
import {injectIntl} from "react-intl";

class CI1601 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifEditModalShow: false,
            editId: "",
            editRecord: {},
            ids: [],
            selectedRecords:[]
        }
    }

    componentDidMount() {
        this.getIpGroups();
    }

    getIpGroups = () => {
        this.props.dispatch({
            type: "ci1601Info/get_ip_groups",
            payload: {
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    handleEditModelShow = (record) => {
        this.setState({
            ifEditModalShow: true,
            editRecord: record,
            editId: record.id,
        })
    };

    handleCloseEditModal = () => {
        this.setState({
            ifEditModalShow: false,
            editRecord: {},
            editId: "",
        })
    };
    handleDelete = (record) => {
        this.props.dispatch({
            type: "ci1601Info/delete_ip_group",
            payload: {
                delete: {ids: [record.id],records:[record]},
                init: {
                    company_id: sessionStorage.getItem("companyId")
                },
            }
        })
    };

    handleDeleteBatch = () => {
        this.props.dispatch({
            type: "ci1601Info/delete_ip_group",
            payload: {
                delete: {ids: this.state.ids,records:this.state.selectedRecords},
                init: {
                    company_id: sessionStorage.getItem("companyId")
                },
            }
        })
    };


    render() {
        const columns = [{
            title: '@名称',
            dataIndex: 'name',
            key: 'name',
            width:150
        }, {
            title: '@描述',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '@IP/IP段',
            dataIndex: 'ip',
            key: 'ip',
            width:200
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            fixed:'right',
            align: "center",
            render: (Index, record) => {
                return <Operations hasDelete={true} hasEdit={true} edit={() => this.handleEditModelShow(record)}
                                   delete={() => this.handleDelete(record)}/>
            }
        },];
        const ModalOptions = {
            title: this.state.editId ? "@编辑IP分组" : "@新增IP分组",
            visible: this.state.ifEditModalShow,
            onCancel: this.handleCloseEditModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci1601Info/update_ip_group" : "ci1601Info/create_ip_group",
            extraUpdatePayload: {company_id: sessionStorage.getItem("companyId"), id: this.state.editId},
            initialValues: Object.assign({},this.state.editRecord),
            initPayload: {
                company_id: sessionStorage.getItem("companyId")
            },
            InputItems: [{
                type: "Input",
                labelName: "@名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入IP分组名称"
                },
                rules: [{required: true, message: "@请输入IP分组名称"}, {max: 50, message: "@IP分组名称最多输入50字符"}],
            }, {
                type: "TextArea",
                labelName: "@描述",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入IP分组描述",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{required: true, message: "@请输入IP分组描述"}, {max: 255, message: "@IP分组描述最多输入255字符"}],
            }, {
                type: "GroupInput",
                labelName: "@IP/IP段",
                valName: "ip",
                nativeProps: {
                    placeholder: "@请输入IP/IP段"
                },
                rules: [{required: true, message: "@请输入IP/IP段"}, {validator: validateIp}],
            },]
        };
        const rowSelection = {
            fixed: "left",
            onChange: (selectedRowKeys,selectedRecords) => {
                this.setState({
                    ids: selectedRowKeys,
                    selectedRecords:selectedRecords
                })
            }
        };
        return <Card className="card">
            <HeaderBar selectedKeys={this.state.ids} hasAdd={true} hasDelete={true} add={this.handleEditModelShow}
                       delete={this.handleDeleteBatch}/>
            <BossTable columns={columns} dataSource={this.props.ci1601Info.ipGroupList} rowSelection={rowSelection}/>
            <BossEditModal {...ModalOptions}/>
        </Card>
    }
}

export default injectIntl(CI1601);