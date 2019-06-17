/*@运维-设备更新*/
import React from 'react';
import './index.scss';
import {Button, Card, Input, Modal, Popover, Select, Tooltip} from 'antd';
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {deviceTypeMap, parse, statusMap} from "../../../utils/commonUtilFunc";

const Option = Select.Option;

class MI0801 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company_id: parse(this.props.location.search).company_id ? parse(this.props.location.search).company_id : undefined,
            type: "",
            name: "",
            sn_list: [],
            companyList: [],
            model: parse(this.props.location.search).model ? parse(this.props.location.search).model : undefined,
            version: parse(this.props.location.search).version ? parse(this.props.location.search).version : undefined,
            updateVersion: "",
            page_no: 1,
            page_size: 20

        }
    }

    componentDidMount() {
        this.get_device_list();
        this.get_device_model();
        this.get_device_version_list();
        this.props.dispatch({
            type: "mi0801Info/getCompanyList"
        });
        this.props.dispatch({
            type: "mi0801Info/getOsList"
        })
    }

    get_device_version_list = () => {
        this.props.dispatch({
            type: "mi0801Info/get_device_version_list",
            payload: {}
        })
    };

    get_device_list = () => {
        this.props.dispatch({
            type: "mi0801Info/get_device_list",
            payload: {
                type: "STEP,CSTEP",
                name: this.state.name || "",
                company_id: this.state.company_id || "",
                model: this.state.model || "",
                version: this.state.version || "",
                page_no: this.state.page_no,
                page_size: this.state.page_size
            }
        })
    };

    get_device_model = () => {
        this.props.dispatch({
            type: "mi0801Info/get_device_model",
            payload: {}
        })
    };

    selectCompany = (value) => {
        this.setState({
            company_id: value || "",
        }, () => {
            this.get_device_list()
        })
    };

    selectType = (value) => {
        this.setState({
            type: value || "",
        }, () => {
            this.get_device_list()
        })
    };

    changeSn = (e) => {
        const value = e.target.value;
        this.setState({
            name: value.replace(/(^\s*)|(\s*$)/g, "") || ""
        }, () => {
            if (this.state.name === "") {
                this.get_device_list()
            }
        })
    };


    create_update_task = () => {
        const companyList = this.state.companyList;
        for (let i = 0; i < companyList.length; i++) {
            if (companyList[i] !== companyList[0]) {
                Modal.warning({
                    title: "@一次任务只可以是同一个企业"
                });
                return 0;
            }
        }
        if (this.state.updateVersion !== "") {
            this.props.dispatch({
                type: "mi0801Info/create_update_task",
                payload: {
                    company_id: companyList[0],
                    sn_list: this.state.sn_list,
                    version: this.state.updateVersion,
                }
            })
        } else {
            Modal.warning({
                title: "@请选择升级版本"
            });
        }

    };

    selectUpdateVersion = (value) => {
        this.setState({
            updateVersion: value
        })
    };

    selectVersion = (value) => {
        this.setState({
            version: value || "",
        }, () => {
            this.get_device_list();
        })
    };

    get_update_task_list = (record) => {
        this.props.dispatch({
            type: "mi0801Info/get_update_task_list",
            payload: {
                sn: record.sn,
                status: "FINISHED"
            }
        });
    };
    selectModel = (value) => {
        this.setState({
            model: value || "",
        }, () => {
            this.get_device_list()
        })
    };

    render() {
        const taskColumns = [{
            title: "@升级时间",
            dataIndex: 'end_time',
            key: 'end_time',
        }, {
            title: "@版本号",
            dataIndex: 'old_version',
            key: 'old_version',
        }, {
            title: "@操作者",
            dataIndex: 'user_name',
            key: 'user_name',
        },];

        const columns = [{
            title: '@版本',
            dataIndex: 'version',
            key: 'version',
            render: (text, record) => {
                return <Popover placement="bottom" content={<BossTable columns={taskColumns}
                                                                       dataSource={this.props.mi0801Info.versionList}/>}
                                trigger="click"><span onClick={() => this.get_update_task_list(record)}
                                                      className="common-link-icon">{text}</span></Popover>
            }
        }, {
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@企业',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: "@节点名称",
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@类型',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                return deviceTypeMap(text)
            }
        }, {
            title: '@型号',
            dataIndex: 'model',
            key: 'model',
        }, {
            title: '@硬件ID',
            dataIndex: 'sn',
            key: 'sn',
        },];

        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKey, selectedRowRecords) => {
                let sn_list = selectedRowRecords.map((item) => {
                    return {
                        sn: item.sn,
                        old_version: item.version
                    }
                });
                let companyList = selectedRowRecords.map((item) => {
                    return item.company_id;
                });
                this.setState({
                    sn_list: sn_list,
                    companyList: companyList
                })
            }
        };
        return (
            <Card className="card">
                <header className="header">
                    <div className="left-header">
                        <Select style={{width: 150, marginRight: 8}} className="input" placeholder="@请选择升级版本"
                                onChange={this.selectUpdateVersion}>
                            {
                                this.props.mi0801Info.osList.map((item) => {
                                    return <Option value={item.version} key={item.id}><Tooltip key={item}
                                                                                               placement="right"
                                                                                               title={item.remark}><span
                                        style={{
                                            display: "block",
                                            width: "100%"
                                        }}>{item.version}</span></Tooltip></Option>
                                })
                            }
                        </Select>
                        <Button icon="export" onClick={this.create_update_task}>{"@下发升级任务"}</Button>
                    </div>
                    <div className="right-header">
                        <Select style={{width: 150}} className="input" placeholder={"@请选择版本"}
                                onChange={this.selectVersion} allowClear defaultValue={this.state.version}>
                            {
                                this.props.mi0801Info.deviceVersionList.map((item) => {
                                    return (<Option value={item} key={item}>{item}</Option>)
                                })
                            }
                        </Select>
                        <Select style={{width: 150}} className="input" placeholder={"@请选择搜索企业"}
                                onChange={this.selectCompany} showSearch={true}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                defaultValue={parseInt(this.state.company_id, 10) !== parseInt(this.state.company_id, 10) ? undefined : parseInt(this.state.company_id, 10)}
                                allowClear>
                            {
                                this.props.mi0801Info.companyList.map((item) => {
                                    return (<Option value={item.id} key={item.id}>{item.company_abbr}</Option>)
                                })
                            }
                        </Select>
                        <Select style={{width: 150}} className="input" placeholder={"@请选择设备型号"}
                                onChange={this.selectModel} allowClear defaultValue={this.state.model}>
                            {this.props.mi0801Info.modelList.map((item) => {
                                return <Option value={item.model} key={item.id}>{item.model}</Option>
                            })}
                        </Select>
                        <Input style={{width: 150}} className="input" placeholder={"@请输入关键字"}
                               onChange={this.changeSn}
                               onPressEnter={this.get_device_list}/>
                        <Button size="default" className="input" onClick={this.get_device_list}
                                icon="search">{"@搜索"}</Button>
                    </div>
                </header>
                <BossTable component={this} paging={true} total={this.props.mi0801Info.total}
                           getData={this.get_device_list} rowSelection={rowSelection} columns={columns}
                           dataSource={this.props.mi0801Info.dataSource}/>
            </Card>
        )
    }
}

export default injectIntl(MI0801);