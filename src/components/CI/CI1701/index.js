/*@客户-端口分组*/
import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import {commonTranslate, validatePort} from '../../../utils/commonUtilFunc';
import {Card} from 'antd';
import {injectIntl} from "react-intl";
class CI1701 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifEditModalShow: false,
            editId: "",
            editRecord: {},
            ids:[],
            selectedRecords:[],
        } 
    }

    componentDidMount(){
        this.getIpGroups();
    }

    getIpGroups = () => {
        this.props.dispatch({
            type: "ci1701Info/get_port_groups",
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
            type: "ci1701Info/delete_port_group",
            payload: {
                delete: {ids: [record.id],records:[record]},
                init: {
                    company_id: sessionStorage.getItem("companyId")
                },
            }
        })
    };

    handleDeleteBatch=()=>{
        this.props.dispatch({
            type: "ci1701Info/delete_port_group",
            payload: {
                delete: {ids:this.state.ids,records:this.state.selectedRecords},
                init: {
                    company_id: sessionStorage.getItem("companyId")
                },
            }
        })
    };

    render(){
        const __=commonTranslate(this);
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
            title: '@端口',
            dataIndex: 'port',
            key: 'port',
            width:200
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            fixed:'right',
            align:"center",
            render:(Index,record)=>{
                return <Operations hasDelete={true} hasEdit={true} edit={() => this.handleEditModelShow(record)}
                                   delete={() => this.handleDelete(record)}/>
            }
        },];


        const ModalOptions = {
            title: this.state.editId ? "@编辑端口分组" : "@新增端口分组",
            visible: this.state.ifEditModalShow,
            onCancel: this.handleCloseEditModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci1701Info/update_port_group" : "ci1701Info/create_port_group",
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
                    placeholder: "@请输入端口分组名称"
                },
                rules: [{required: true, message: "@请输入端口分组名称"}, {max: 50, message: "@端口分组名称最多输入50字符"}],
            }, {
                type: "TextArea",
                labelName: "@描述",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入端口分组描述",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{required: true, message: "@请输入端口分组描述"}, {max: 255, message: "@端口分组描述最多输入255字符"}],
            }, {
                type: "GroupInput",
                labelName: "@端口",
                valName: "port",
                nativeProps: {
                    placeholder: "@请输入端口"
                },
                rules: [{required: true, message: "@请输入端口"},{validator:validatePort}],
            },]
        };
        const rowSelection={
            fixed:"left",
            onChange:(selectedRowKeys,selectedRecords)=>{
                this.setState({
                    ids:selectedRowKeys,
                    selectedRecords:selectedRecords
                })
            }
        };
        return <Card className="card">
            <HeaderBar selectedKeys={this.state.ids} hasAdd={true} hasDelete={true} add={this.handleEditModelShow} delete={this.handleDeleteBatch} />
            <BossTable columns={columns} dataSource={this.props.ci1701Info.portGroupList} rowSelection={rowSelection}/>
            <BossEditModal {...ModalOptions}/>
        </Card>
    }
}

export default injectIntl(CI1701);