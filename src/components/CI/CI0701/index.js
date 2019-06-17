/*@客户-账号管理*/
import React from 'react';
import './index.scss';
import {Card, Icon, Switch, Select, Tooltip} from 'antd';
import Operations from "../../Common/Operations";
import HeaderBar from "../../Common/HeaderBar";
import EditModal from "./subComponents/EditModal";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {BossMessage} from "../../Common/BossMessages";

const Option = Select.Option;

class CI0701 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            editRecord: {},
            recordId: "",
            status: "",
            name: "",
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: "ci0701Info/init",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
            }
        });
    }

    changeEditMode = (record) => {
        this.setState({
            editMode: true,
            editRecord: record || {},
            recordId: record ? record.id : ""
        })
    };

    cancelEdit = () => {
        this.setState({
            editMode: false,
        })
    };

    handleSubmit = (value) => {
        this.setState({
            name: value
        }, function () {
            this.props.dispatch({
                type: "ci0701Info/init",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    name: this.state.name||"",
                    is_active: this.state.is_active===undefined?"":this.state.is_active
                }
            })
        })
    };

    reset_password = (record) => {
        this.props.dispatch({
            type: "ci0701Info/reset_password",
            payload: {
                id: record.id,
                record: record
            }
        })
    };

    delete_related_person = (record) => {
        if(record.is_active){
            BossMessage(false,"@删除失败:仅能删除禁用状态账号");
        }else{
            this.props.dispatch({
                type: "ci0701Info/delete_related_person",
                payload: {
                    id: record.id,
                    records: [record]
                }
            })
        }

    };
    handleSelectStatus = (value) => {
        this.setState({
            is_active: value
        }, function () {
            this.props.dispatch({
                type: "ci0701Info/init",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    name: this.state.name||"",
                    is_active: this.state.is_active===undefined?"":this.state.is_active
                }
            })
        })
    };

    change_activity = (value, record) => {
        this.props.dispatch({
            type: "ci0701Info/change_activity",
            payload: {
                update: {
                    id: record.id,
                    is_active: value,
                    record: record,
                },
                init: {
                    company_id: sessionStorage.getItem("companyId"),
                    name: this.state.name,
                    is_active: this.state.is_active===undefined?"":this.state.is_active
                }
            }
        });
    };


    render() {
        const columns = [{
            title: '@账号',
            dataIndex: 'mail',
            key: 'mail',
        }, {
            title: '@昵称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@角色',
            dataIndex: 'role',
            key: 'role',
            render: (index, record) => {
                switch (record.role) {
                    case "company":
                        return <span>{"@超级管理员"}</span>;
                    case "companystaff":
                        return <span>{"@普通用户"}</span>;
                    default:
                        return <span>{record.role}</span>

                }
            }
        }, {
            title: '@状态',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (index, record) => {
                return <Switch disabled={record.mail === sessionStorage.getItem("userNm")}
                               checkedChildren={"@启用"}
                               unCheckedChildren={"@禁用"} defaultChecked={record.is_active}
                               onChange={(value) => this.change_activity(value, record)}/>
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 200,
            fixed:'right',
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Operations hasExtra={false} hasDelete={record.mail !== sessionStorage.getItem("userNm")}
                                    hasEdit={true} edit={() => this.changeEditMode(record)}
                                    delete={() => this.delete_related_person(record)}/>
                        {record.mail !== sessionStorage.getItem("userNm") ?
                            <Tooltip placement="right" trigger="hover" title={"@密码重置"}><Icon
                                onClick={() => this.reset_password(record)} type="key"
                                className="operations-delete-btn"/></Tooltip> : ""}
                    </div>
                )
            }
        },];
        const pagination = {
            pageSize: 20,
        };

        const options = [
            <Option key="1" value={1}>{'@启用'}</Option>,
            <Option key="0" value={0}>{"@禁用"}</Option>
        ];


        return (
            <Card className="card">
                <HeaderBar hasSearch={true} hasAdd={true} hasDelete={false} add={this.changeEditMode}
                           submit={this.handleSubmit} hasUpload={false} options={options}
                           hasSelect={true} selectPlaceHolder={'@请选择状态'}
                           selectOneMethod={this.handleSelectStatus}/>
                <BossTable columns={columns} pagination={pagination}
                           dataSource={this.props.ci0701Info.relatedPersonList}/>
                <EditModal cancel={this.cancelEdit} recordId={this.state.recordId} editRecord={this.state.editRecord}
                           editModalShow={this.state.editMode}/>
            </Card>
        )
    }
}

export default injectIntl(CI0701);