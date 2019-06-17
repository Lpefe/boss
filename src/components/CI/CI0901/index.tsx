/*@客户-黑白名单*/
import React from 'react';
import './index.scss';
import {Button, Card, Form, Icon, Input, message, Modal, Popconfirm, Tabs, Upload} from 'antd'
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {domain} from "../../../utils/commonConsts";
import {injectIntl} from "react-intl";
import {CI0901ModelState} from "../../../model/CI/CI0901M";
import {WrappedFormUtils} from "antd/lib/form/Form";
import Cookies from 'js-cookie'

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const function_off = require('../../../assets/img/function_off.png');

interface WhiteListItem {
    url: string;
    is_active: boolean;
    id: number;
    company_id: number;
}

interface CI0901ComponentState {
    ifAddUrlModalShow: boolean,
    selectedIds: string[],
    uploadModalShow: boolean,
    uploadModalShowBlack: boolean,
    importResultModalShow: boolean,
    importResult: any[],
    success: number,
    fail: number,
    records: WhiteListItem[],
    selectedBlackListIds: string[],
    blackListRecords: any[],
    ifAddBlackListUrlModalShow: boolean,
    importResultModalShowBlack: boolean,
    ifAddBlackUrlModalShow: boolean

}

class CI0901 extends React.Component<{ dispatch: any, ci0901Info: CI0901ModelState, form: WrappedFormUtils }, CI0901ComponentState> {
    constructor(props) {
        super(props);
        this.state = {
            ifAddUrlModalShow: false,
            selectedIds: [],
            uploadModalShow: false,
            importResultModalShow: false,
            importResult: [],
            success: 0,
            fail: 0,
            records: [],
            blackListRecords: [],
            selectedBlackListIds: [],
            ifAddBlackListUrlModalShow: false,
            uploadModalShowBlack: false,
            importResultModalShowBlack: false,
            ifAddBlackUrlModalShow: false
        }
    }

    componentDidMount() {
        this.get_white_list();

    }

    get_white_list = (value?: string) => {
        this.props.dispatch({
            type: "ci0901Info/get_white_list",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                name: value || ""
            }
        })
    };

    get_black_list_company = (value?: string) => {
        this.props.dispatch({
            type: "ci0901Info/get_black_list_company",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                name: value || ""
            }
        })
    };

    handleOpenAddUrlModal = () => {
        this.setState({
            ifAddUrlModalShow: true,
        })
    };

    handleCloseAddUrlModal = () => {
        this.setState({
            ifAddUrlModalShow: false,
        })
    };

    handleCloseAddBlackUrlModal = () => {
        this.setState({
            ifAddBlackUrlModalShow: false,
        })
    };


    handleOpenAddBlackUrlModal = () => {
        this.setState({
            ifAddBlackUrlModalShow: true,
        })
    };
    handleSubmitAddUrl = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "ci0901Info/create_white_list",
                    payload: {
                        company_id: sessionStorage.getItem("companyId"),
                        url: values.url,
                    }
                });
                this.setState({
                    ifAddUrlModalShow: false,
                })

            }
        });

    };

    handleSubmitAddBlackUrl = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "ci0901Info/create_black_list_company",
                    payload: {
                        company_id: sessionStorage.getItem("companyId"),
                        url: values.url,
                    }
                });
                this.setState({
                    ifAddBlackUrlModalShow: false,
                })
            }
        });

    };

    update_white_list = (checked, record) => {
        this.props.dispatch({
            type: "ci0901Info/update_white_list",
            payload: {
                id: record.id,
                is_active: checked,
                record: record,
            }
        }).then(() => {
            const selectedRecords = this.state.records;
            for (let key in selectedRecords) {
                if (selectedRecords[key].id === record.id) {
                    selectedRecords[key].is_active = checked;
                }
            }
            this.setState({
                records: selectedRecords
            })
        })

    };

    delete_white_list = (record) => {
        let ids: number[] = [];
        ids.push(record.id);
        this.props.dispatch({
            type: "ci0901Info/delete_white_list",
            payload: {
                ids: ids,
                records: [record]
            }
        })
    };
    delete_white_list_batch = () => {
        for (let key in this.state.records) {
            if (this.state.records[key].is_active) {
                Modal.warning({
                    title: "@只能删除禁用状态项"
                });
                return 0;
            }
        }
        this.props.dispatch({
            type: "ci0901Info/delete_white_list",
            payload: {
                ids: this.state.selectedIds,
                records: this.state.records
            }
        })
    };
    delete_black_list_company = (record) => {
        let ids: number[] = [];
        ids.push(record.id);
        this.props.dispatch({
            type: "ci0901Info/delete_black_list_company",
            payload: {
                ids: ids,
                records: [record]
            }
        })
    };

    delete_black_list_company_batch = () => {
        for (let key in this.state.records) {
            if (this.state.records[key].is_active) {
                Modal.warning({
                    title: "@只能删除禁用状态项"
                });
                return 0;
            }
        }
        this.props.dispatch({
            type: "ci0901Info/delete_black_list_company",
            payload: {
                ids: this.state.selectedBlackListIds,
                records: this.state.blackListRecords
            }
        })
    };

    handleMultipleSelect = (selectedIds, selectedRecords) => {
        this.setState({
            selectedIds: selectedIds,
            records: selectedRecords
        })
    };

    handleMultipleSelectBlackList = (selectedIds, selectedRecords) => {
        this.setState({
            selectedBlackListIds: selectedIds,
            blackListRecords: selectedRecords
        })
    };

    handelUploadModalShow = () => {
        this.setState({
            uploadModalShow: true
        })
    };
    handelUploadModalClose = () => {
        this.setState({
            uploadModalShow: false
        })
    };
    handelUploadModalShowBlack = () => {
        this.setState({
            uploadModalShowBlack: true
        })
    };
    handelUploadModalCloseBlack = () => {
        this.setState({
            uploadModalShowBlack: false
        })
    };

    handleUploadComplete = ({file}) => {
        if (file.status === "done") {
            this.setState({
                uploadModalShow: false,
                importResultModalShow: true,
                importResult: file.response.result.fail,
                success: file.response.result.success_count,
                fail: file.response.result.fail.length
            }, () => {
                this.get_white_list();
            })
        }
    };

    handleUploadCompleteBlack = ({file}) => {
        if (file.status === "done") {
            this.setState({
                uploadModalShowBlack: false,
                importResultModalShow: true,
                importResult: file.response.result.fail,
                success: file.response.result.success_count,
                fail: file.response.result.fail.length
            }, () => {
                this.get_black_list_company();
            })
        }
    };

    handleCloseImportModal = () => {
        this.setState({
            importResultModalShow: false
        })
    };
    handleCloseImportModalBlack = () => {
        this.setState({
            importResultModalShowBlack: false
        })
    };
    checkBeforeUpload = (file) => {
        if (file.type !== "text/plain") {
            message.error("请上传txt格式文件");
            return false;
        }
        return true
    };

    handleTabChange = (key) => {
        if (key === 'black') {
            this.get_black_list_company()
        }
    };

    render() {
        const columns = [{
            title: '@域名',
            dataIndex: 'url',
            key: 'url',
        }, /*{
            title: __(messages['状态']),
            dataIndex: 'is_active',
            key: 'is_active',
            render: (index, record) => {
                return <Switch checkedChildren={"@启用"} unCheckedChildren={"@禁用"}
                               defaultChecked={record.is_active}
                               onChange={(checked) => this.update_white_list(checked, record)}/>
            }
        }, */{
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:150,
            fixed:'right',
            align: "center",
            render: (index, record) => {
                return (
                    <Popconfirm title={"@确认删除该项吗?"} onConfirm={() => this.delete_white_list(record)}>
                        <Icon type="delete" style={{border: 0}} className="operations-delete-btn"/>
                    </Popconfirm>
                )

            }
        },];

        const columnsBlack = [{
            title: '@域名',
            dataIndex: 'url',
            key: 'url',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:150,
            fixed:'right',
            align: "center",
            render: (index, record) => {
                return (
                    <Popconfirm title={"@确认删除该项吗?"} onConfirm={() => this.delete_black_list_company(record)}>
                        <Icon type="delete" style={{border: 0}} className="operations-delete-btn"/>
                    </Popconfirm>
                )

            }
        },];
        const rowSelection = {
            fixed: true,
            onChange: this.handleMultipleSelect
        };

        const rowSelectionBlackList = {
            fixed: true,
            onChange: this.handleMultipleSelectBlackList
        };
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        const importResultColumns = [
            {
                title: '@域名',
                dataIndex: 'url',
                key: 'url',
                render: (index, record) => {
                    return <span className="fail">{record.url}</span>
                }
            }, {
                title: '@导入失败原因',
                dataIndex: 'reason',
                key: 'reason',
                render: (index, record) => {
                    return <span className="fail">{record.reason}</span>
                }
            }];
        return <Card className="card ci0901">
            <Tabs onChange={this.handleTabChange}>
                <TabPane tab="@白名单" key="white">
                    {this.props.ci0901Info.ifAllowed ? <div>
                        <HeaderBar hasSearch={true} hasDelete={true} hasAdd={true}
                                   inputPlaceHolder={"@请输入域名"}
                                   delete={this.delete_white_list_batch} submit={this.get_white_list}
                                   add={this.handleOpenAddUrlModal} selectedKeys={this.state.selectedIds}
                                   hasModalStyelUpload={true}
                                   modal={this.handelUploadModalShow}/>
                        <BossTable columns={columns} rowSelection={rowSelection}
                                   dataSource={this.props.ci0901Info.dataSource}/>
                        <Modal maskClosable={false} visible={this.state.ifAddUrlModalShow}
                               onCancel={this.handleCloseAddUrlModal}
                               onOk={this.handleSubmitAddUrl} title={"@添加白名单"} destroyOnClose>
                            <Form>
                                <FormItem label={"@域名"} {...modalFormLayout}>
                                    {getFieldDecorator('url', {
                                        rules: [{
                                            required: true,
                                            message: "@请输入域名"
                                        }, {
                                            pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
                                            message: "@域名格式不正确"
                                        }],
                                    })(
                                        <Input placeholder={"@请输入域名"}/>
                                    )}
                                </FormItem>
                            </Form>
                        </Modal>
                        <Modal maskClosable={false} title={<span>{"@提示:批量导入的文件必须使用提供的模板才能成功"}</span>}
                               onCancel={this.handelUploadModalClose}
                               destroyOnClose
                               visible={this.state.uploadModalShow} style={{textAlign: "center"}} width={525}
                               footer={null}>
                            <div style={{height: 200}}>
                                <Upload showUploadList={false} action="/v1/company/import_white_list_info/"
                                        data={{company_id: sessionStorage.getItem("companyId"),}}
                                        onChange={this.handleUploadComplete} beforeUpload={this.checkBeforeUpload}
                                        headers={{'X-CSRFToken': Cookies.get('csrftoken')}}>
                                    <Button style={{marginTop: 64}}
                                            type="primary">{"@上传文件"}</Button>
                                </Upload>
                                <div style={{marginTop: 16}}>{"@没有模板"},<a
                                    href={domain + "/v1/company/download_whitelist_template"}>{"@点击下载"}</a>
                                </div>
                            </div>
                        </Modal>
                        <Modal maskClosable={false} footer={null} title={"@导入结果"}
                               visible={this.state.importResultModalShow}
                               onCancel={this.handleCloseImportModal}>
                            <div style={{marginBottom: 16}}><span
                                className="result">{"@导入成功"}:{this.state.success}</span><span
                                className={this.state.fail === 0 ? "result" : "fail"}>{"@导入失败"}:{this.state.fail}</span>
                            </div>
                            <BossTable columns={importResultColumns} dataSource={this.state.importResult}/>
                        </Modal>
                    </div> : <div className="function-off-container">
                        <img src={function_off} alt=""/>
                        <div>{"@未开启海外加速，无法配置白名单"}</div>
                    </div>}
                </TabPane>
                <TabPane tab="@黑名单" key='black'>
                    {this.props.ci0901Info.ifAllowed ? <div>
                        <HeaderBar hasSearch={true} hasDelete={true} hasAdd={true}
                                   inputPlaceHolder={"@请输入域名"}
                                   delete={this.delete_black_list_company_batch} submit={this.get_black_list_company}
                                   add={this.handleOpenAddBlackUrlModal} selectedKeys={this.state.selectedBlackListIds}
                                   hasModalStyelUpload={true}
                                   modal={this.handelUploadModalShowBlack}/>
                        <BossTable columns={columnsBlack} rowSelection={rowSelectionBlackList}
                                   dataSource={this.props.ci0901Info.blackList}/>
                        <Modal maskClosable={false} visible={this.state.ifAddBlackUrlModalShow}
                               onCancel={this.handleCloseAddBlackUrlModal}
                               onOk={this.handleSubmitAddBlackUrl} title="@添加黑名单" destroyOnClose>
                            <Form>
                                <FormItem label={"@域名"} {...modalFormLayout}>
                                    {getFieldDecorator('url', {
                                        rules: [{
                                            required: true,
                                            message: "@请输入域名"
                                        }, {
                                            pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
                                            message: "@域名格式不正确"
                                        }],
                                    })(
                                        <Input placeholder={"@请输入域名"}/>
                                    )}
                                </FormItem>
                            </Form>
                        </Modal>
                        <Modal maskClosable={false} title={<span>{"@提示:批量导入的文件必须使用提供的模板才能成功"}</span>}
                               onCancel={this.handelUploadModalCloseBlack}
                               destroyOnClose
                               visible={this.state.uploadModalShowBlack} style={{textAlign: "center"}} width={525}
                               footer={null}>
                            <div style={{height: 200}}>
                                <Upload showUploadList={false} action="/v1/company/import_black_list_company_info/"
                                        data={{company_id: sessionStorage.getItem("companyId"),}}
                                        onChange={this.handleUploadCompleteBlack} beforeUpload={this.checkBeforeUpload}
                                        headers={{'X-CSRFToken': Cookies.get('csrftoken')}}>
                                    <Button style={{marginTop: 64}}
                                            type="primary">{"@上传文件"}</Button>
                                </Upload>
                                <div style={{marginTop: 16}}>{"@没有模板"},<a
                                    href={domain + "/v1/company/download_whitelist_template"}>{"@点击下载"}</a>
                                </div>
                            </div>
                        </Modal>
                        <Modal maskClosable={false} footer={null} title={"@导入结果"}
                               visible={this.state.importResultModalShowBlack}
                               onCancel={this.handleCloseImportModalBlack}>
                            <div style={{marginBottom: 16}}><span
                                className="result">{"@导入成功"}:{this.state.success}</span><span
                                className={this.state.fail === 0 ? "result" : "fail"}>{"@导入失败"}:{this.state.fail}</span>
                            </div>
                            <BossTable columns={importResultColumns} dataSource={this.state.importResult}/>
                        </Modal>
                    </div> : <div className="function-off-container">
                        <img src={function_off} alt=""/>
                        <div>{"@未开启海外加速，无法配置白名单"}</div>
                    </div>}
                </TabPane>
            </Tabs>

        </Card>

    }
}

export default injectIntl(CI0901);