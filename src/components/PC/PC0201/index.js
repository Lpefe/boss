/*@账号管理员-密码管理组件*/
import React from 'react';
import {Card, Icon, Input, Modal, Popconfirm, Tooltip} from 'antd';
import {_crypto} from "../../../utils/commonUtilFunc";
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";


class PC0201C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            selectedIds: [],
            passwordConfirmShow: false,
            password: '',
            selectedRecords: [],
            page_no: 1,
            page_size: 20
        }
    }

    componentDidMount() {
        this.get_device_list();
    }

    get_device_list = () => {
        this.props.dispatch({
            type: "pc0101Info/get_device_list",
            payload: {
                company_id: sessionStorage.getItem('role') !== 'supercxpadmin' ? sessionStorage.getItem("companyId") : "",
                page_no: this.state.page_no,
                page_size: this.state.page_size,
                name:this.state.name
            }
        })
    };

    update_password = (record) => {
        this.props.dispatch({
            type: "pc0101Info/update_password",
            payload: {
                update: {
                    ids: [record.id],
                    update_all: false,
                    records: [record]
                },
                init: {
                    name: this.state.name
                }
            }
        })
    };

    update_multiple_password = () => {
        this.props.dispatch({
            type: "pc0101Info/update_password",
            payload: {
                update: {
                    ids: this.state.selectedIds,
                    update_all: false,
                    records: this.state.selectedRecords
                },
                init: {
                    name: this.state.name
                }
            }
        })
    };

    update_passwrod_all_show = () => {
        this.setState({
            passwordConfirmShow: true
        })
    };

    update_password_all = () => {
        this.props.dispatch({
            type: "pc0101Info/update_password",
            payload: {
                update: {
                    update_all: true,
                    password: _crypto(this.state.password),
                    ids: [],
                },
                init: {
                    name: this.state.name
                }
            }
        });
        this.setState({
            passwordConfirmShow: false,
            password: ""
        })
    };
    cancelPasswordConfirm = () => {
        this.setState({
            passwordConfirmShow: false,
            password: ""
        })
    };

    handleInputPassword = (e) => {
        this.setState({
            password: e.target.value
        })
    };


    search = (value) => {
        this.setState({
            name: value
        }, () => {
            this.get_device_list();
        })

    };

    render() {
        const columns = [{
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: "@硬件ID",
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title:'@ROOT密码',
            dataIndex: 'root_sn',
            key: 'root_sn',
        }, {
            title: '@最后一次更新时间asd',
            dataIndex: 'root_sn_update_time',
            key: 'root_sn_update_time',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:100,
            fixed:'right',
            render: (index, record) => {
                return <Tooltip title={"@修改密码"}><Popconfirm title={"@确认要更新该设备密码吗?"}
                                                                         onConfirm={() => this.update_password(record)}><Icon
                    type="key"/></Popconfirm></Tooltip>
            }
        }];

        const rowSelection = {
            fixed: "left",
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords
                })
            }
        };
        return <Card className="card">
            <HeaderBar hasExtraBtn={true} extraBtnName={"@批量更新密码"}
                       extraConfirmMethod={this.update_multiple_password} hasSearch={true} hasExtraBtnThree={true}
                       extraBtnNameThree={"@手动更新全部密码"}
                       submit={this.search} selectedKeys={this.state.selectedIds}
                       confirmContent={"@确认需要更新选中设备密码?"} btnThreeFunc={this.update_passwrod_all_show}/>
            <BossTable columns={columns} dataSource={this.props.pc0101Info.deviceList} rowSelection={rowSelection}
                       component={this} getData={this.get_device_list}
                       paging={true} total={this.props.pc0101Info.total}/>
            <Modal title={"@如需更新所有设备密码,请输入账户密码"} visible={this.state.passwordConfirmShow}
                   onCancel={this.cancelPasswordConfirm} onOk={this.update_password_all}
                   bodyStyle={{textAlign: "center"}} destroyOnClose>
                <span style={{color: "rgba(0,0,0,.85)"}}>{"@请输入密码"}:  </span>
                <input type="password" style={{opacity: 0, height: 1, width: 1}}/>
                <Input type="password" style={{width: 200}} onChange={this.handleInputPassword}/>
            </Modal>
        </Card>
    }
}

export default injectIntl(PC0201C);