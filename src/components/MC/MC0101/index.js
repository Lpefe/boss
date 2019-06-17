/*@运维-任务*/
import React from 'react';
import './index.scss';
import {Modal, Card, Button, Icon} from 'antd';
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import HeaderBar from "../../Common/HeaderBar";
import {statusMap} from "../../../utils/commonUtilFunc";

class MC0101 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task_uuid: "",
            checkTaskId: "",
            primaryModalShow: false,
            taskModalShow: false,
            taskModalData: {},
            logType:""
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: "mc0101Info/init",
        })
    }

    searchByUuid = (value) => {
        this.setState({
            uuid:value
        },()=>{
            this.props.dispatch({
                type: "mc0101Info/init",
                payload: {
                    task_uuid: this.state.uuid
                }
            })
        })

    };

    checkTask = (record) => {
        this.setState({
            taskModalShow: true,
            taskModalData: record
        })
    };

    checkLog = (record) => {
        const logId = record.id;
        const type = record.type;
        this.setState({
            checkTaskId: logId,
            primaryModalShow: true,
            logType:type
        }, function () {
            this.props.dispatch({
                type: "mc0101Info/getLogTaskList",
                payload: {
                    task_id: logId,
                    type: type
                }
            })
        })
    };

    cancelCheckPrimary = () => {
        this.setState({
            primaryModalShow: false
        })
    };

    cancelTaskModal = () => {
        this.setState({
            taskModalShow: false,
            taskModalData: {},
        })
    };
    showReason = (record) => {
        Modal.warning({
            title: "@原因详情",
            content: record.message
        })
    };


    render() {
        const columns = [{
            title: '@任务uuid',
            dataIndex: 'task_uuid',
            key: 'task_uuid',
        }, {
            title: '@开始时间',
            dataIndex: 'begin_time',
            key: 'begin_time',
        }, {
            title: '@结束时间',
            dataIndex: 'end_time',
            key: 'end_time',
            render: (index, record) => {
                return (
                    <span>{record.end_time || "--"}</span>
                )
            }
        }, {
            title: '@类型',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@详情',
            dataIndex: 'model',
            key: 'model',
            align: "center",
            width: 100,
            render: (index, record) => {
                return (
                    <Icon type="file-text" onClick={() => this.checkLog(record)}/>
                )
            }
        },];

        const column1 = [
            {
                title: "@硬件ID",
                dataIndex: 'sn',
                key: 'sn',
                fixed: 'left',
                width: 200,
            }, {
                title: '@日期',
                dataIndex: 'date',
                key: 'date',
            }, {
                title: '@日志类型',
                dataIndex: 'type',
                key: 'type',
            }, this.state.logType?{
                title: "@命令",
                dataIndex: 'cmd',
                key: 'cmd',
            }:"",{
                title: '@开始时间',
                dataIndex: 'begin_time',
                key: 'begin_time',
            }, {
                title: '@结束时间',
                dataIndex: 'end_time',
                key: 'end_time',
            }, {
                title: '@状态',
                dataIndex: 'status',
                key: 'status',
                render: (text) => {
                    return statusMap(text)
                }
            }, {
                title: '@信息',
                dataIndex: 'message',
                key: 'message',
            }, {
                title: '@详情',
                dataIndex: 'model',
                key: 'model',
                align: "center",
                width: 100,
                fixed: 'right',
                render: (index, record) => {
                    return (
                        <Icon type="file-text" onClick={() => this.checkTask(record)}/>
                    )
                }
            }
        ];
        const columns2 = [{
            title: '@路径',
            dataIndex: 'path',
            key: 'path',
        }, {
            title: '@原因',
            dataIndex: 'reason',
            key: 'reason',
            render: (index, record) => {
                return (<Button onClick={() => this.showReason(record)} size="samll">{"@原因"}</Button>)
            }
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
        },];
        const pagination = {
            pageSize: 20
        };
        const pagination1 = {
            pageSize: 10
        };

        return (
            <Card className="card">
                <HeaderBar hasSearch={true} submit={this.searchByUuid} searchInputWidth={250}/>
                <BossTable pagination={pagination} columns={columns}
                           dataSource={this.props.mc0101Info.dataSource}/>
                <Modal maskClosable={false} visible={this.state.primaryModalShow} onCancel={this.cancelCheckPrimary}
                       width={900}
                       title={"@log详情_" + this.state.checkTaskId} footer={null}>
                    <BossTable pagination={pagination1} columns={column1}
                               dataSource={this.props.mc0101Info.taskLogDataSource} scroll={{ x: 'max-content'}}/>
                </Modal>
                <Modal maskClosable={false} visible={this.state.taskModalShow} footer={null}
                       title={"@日志详情" + this.state.taskModalData.id} onCancel={this.cancelTaskModal}>
                    <BossTable pagination={pagination} columns={columns2}
                               dataSource={this.state.taskModalData.result ? JSON.parse(this.state.taskModalData.result) : ""}/>
                </Modal>
            </Card>

        )
    }
}

export default injectIntl(MC0101);