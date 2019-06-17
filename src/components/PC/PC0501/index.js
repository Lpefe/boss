/*@客户-授权管理*/
import React from 'react';
import {Card, Modal, Switch} from 'antd';
import BossTable from "../../Common/BossTable";
import BossEditModal from "../../MI/MI1902/subComponents/BossEditModal";
import HeaderBar from "../../Common/HeaderBar";
import Operations from "../../Common/Operations";
import moment from 'moment';
import {BossMessage} from "../../Common/BossMessages";


class PC0501 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editModalShow: false,
            editRecord: {},
            editId: "",
            start_time: moment(),
            end_time: ""
        };

    }

    componentDidMount() {
        this.get_client_auth();
    }

    get_client_auth = () => {
        this.props.dispatch({
            type: "pc0501Info/get_client_auth",
            payload: {}
        })
    };

    handleEditModalShow = (record) => {
        if (record.id) {
            record.start_time = moment(record.start_time);
            record.end_time = moment(record.end_time);
        }
        this.setState({
            editModalShow: true,
            editRecord: record.id ? record : {},
            editId: record.id,
            start_time: record.id ? record.start_time : moment(),
            end_time: record.id ? record.end_time : ""
        })
    };
    handleEditModalClose = () => {
        this.setState({
            editModalShow: false,
            editRecord: {},
            editId: "",
            start_time: moment(),
            end_time: ""
        })
    };

    switchStatus = (checked, record) => {
        let vm = this;
        Modal.confirm({
            title: "@确认要修改授权配置状态?",
            onOk() {
                vm.props.dispatch({
                    type: "pc0501Info/switchStatus",
                    payload: {
                        is_active: checked,
                        id: record.id,
                        record: record
                    }
                })
            },
            onCancel() {
            },
        });
    };

    delete_client_auth = (record) => {
        if (record.is_active) {
            BossMessage(false, "@只能删除处于禁用状态的记录")
        } else {
            this.props.dispatch({
                type: "pc0501Info/delete_client_auth",
                payload: {
                    ids: [record.id],
                    records: [record]
                }
            })
        }
    };

    disabledStartDate = (current) => {
        return current >= this.state.end_time
    };

    disabledEndDate = (current) => {
        return current <= this.state.start_time
    };

    handleSelectStartTime = (moment) => {
        this.setState({
            start_time: moment
        })
    };

    handleSelectEndTime = (moment) => {
        this.setState({
            end_time: moment
        })
    };


    render() {
        const columns = [{
            title: "@客户名称",
            dataIndex: 'name',
            key: 'name',
        }, {
            title: "@开始日期",
            dataIndex: 'start_time',
            key: 'start_time',
            render: (text) => {
                return moment(text).format("YYYY-MM-DD")
            }
        }, {
            title: "@有效期至",
            dataIndex: 'end_time',
            key: 'end_time',
            render: (text) => {
                return moment(text).format("YYYY-MM-DD")
            }
        }, {
            title: "@MAC地址",
            dataIndex: 'mac_address',
            key: 'mac_address',
        }, {
            title: "@说明",
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: "@状态",
            dataIndex: 'is_active',
            key: 'is_active',
            render: (text, record) => {
                return <Switch checkedChildren="@启用" unCheckedChildren="@禁用"
                               checked={record.is_active}
                               onChange={(checked) => this.switchStatus(checked, record)}/>
            }
        }, {
            title: "@操作",
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            align: "center",
            fixed:'right',
            width:100,
            render: (text, record) => {
                return <Operations hasDelete={true} hasEdit={true} edit={() => this.handleEditModalShow(record)}
                                   delete={() => this.delete_client_auth(record)}/>
            }
        },];

        const modalOption = {
            title: this.state.editId ? "@编辑授权信息" : "@新增授权信息",
            visible: this.state.editModalShow,
            onCancel: this.handleEditModalClose,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "pc0501Info/update_client_auth" : "pc0501Info/create_client_auth",
            extraUpdatePayload: {id: this.state.editId, is_active: this.state.editRecord.is_active},
            initialValues: this.state.editId ? this.state.editRecord : {start_time: moment()},
            initPayload: {},
            InputItems: [{
                type: "Input",
                labelName: "@客户名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入客户名称"
                },
                rules: [{required: true, message: "@请输入客户名称"}, {max: 64, message: "@客户名称最大长度不超过64字符"}],
            }, {
                type: "Input",
                labelName: "@MAC地址",
                valName: "mac_address",
                nativeProps: {
                    placeholder: "@请输入MAC地址"
                },
                rules: [{
                    required: true,
                    message: "@请输入MAC地址"
                }, {
                    pattern: /^[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}$/,
                    message: "@Mac输入格式："+"98:ee:cb:6a:08:a1"

                }],
            }, {
                type: "DatePicker",
                labelName: "@开始时间",
                valName: "start_time",
                nativeProps: {
                    placeholder: "@请选择开始时间",
                    disabledDate: this.state.end_time?this.disabledStartDate:undefined,
                    onChange: this.handleSelectStartTime
                },
                rules: [{required: true, message: "@请选择开始时间"}],
            }, {
                type: "DatePicker",
                labelName: "@有效期至",
                valName: "end_time",
                nativeProps: {
                    placeholder: "@请选择有效期至",
                    onChange: this.handleSelectEndTime,
                    disabledDate: this.disabledEndDate,
                },
                rules: [{required: true, message: "@请选择有效期至"}],
            }, {
                type: "Input",
                labelName: "@说明",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入说明"
                },
                rules: [{max: 128, message: "@说明最大长度不超过128字符"}]
            },]
        };
        return (
            <Card className="card">
                <HeaderBar hasAdd={true} add={this.handleEditModalShow}/>
                <BossTable columns={columns} dataSource={this.props.pc0501Info.clientAuthList}/>
                <BossEditModal {...modalOption}/>
            </Card>
        )
    }
}

export default PC0501;