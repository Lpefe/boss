/*@运维-黑名单配置*/
import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import {Popconfirm, Icon, Modal, Form, Input, Button, Upload,message,Card} from 'antd';
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {domain} from "../../../utils/commonConsts";
const FormItem = Form.Item;


class MI0401 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blackListLines: [],
            ifAddUrlModalShow: false,
            uploadModalShow: false,
            importResultModalShow:false,
            importResult:[],
            success:0,
            fail:0,
            selectedRecords:[],
        }
    }

    componentDidMount() {
        this.get_black_list()
    }

    get_black_list() {
        this.props.dispatch({
            type: "mi0401Info/get_black_list",
            payload: {
                start: 0,
                limit: 20
            }
        })
    }

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

    delete_black_list = (record) => {
        this.props.dispatch({
            type: "mi0401Info/delete_black_list",
            payload: {
                lines: [record.url],
                records:[record]
            }
        })
    };

    delete_black_list_batch = () => {
        this.props.dispatch({
            type: "mi0401Info/delete_black_list",
            payload: {
                lines: this.state.blackListLines,
                records:this.state.selectedRecords
            }
        })
    };

    handleSubmitAddUrl = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "mi0401Info/create_black_list",
                    payload: {
                        line: values.url,
                    }
                })
            }
        });
        this.setState({
            ifAddUrlModalShow: false,
        })
    };

    searchBlackList = (value) => {
        this.props.dispatch({
            type: "mi0401Info/get_black_list",
            payload: {
                name: value,
                start: 0,
                limit: 20
            }
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

    handleUploadComplete=({file})=>{
        if(file.status==="done"){
            this.setState({
                uploadModalShow: false,
                importResultModalShow:true,
                importResult:file.response.result.fail,
                success:file.response.result.success_count,
                fail:file.response.result.fail.length
            })
        }
    };

    handleCloseImportModal=()=>{
        this.setState({
            importResultModalShow: false
        })
    };

    checkBeforeUpload=(file)=>{
        if(file.type!=="text/plain"){
            message.error("@请上传txt格式文件")
            return false;
        }
    };


    render() {
        const columns = [
            {
                title: '@域名',
                dataIndex: 'url',
                key: 'url',
            }, {
                title: '@操作',
                dataIndex: 'has_special',
                key: 'has_special',
                width: 75,
                align: "center",
                render: (index, record) => {
                    return <Popconfirm title={"@确认删除该项吗?"} onConfirm={() => this.delete_black_list(record)}><Icon
                        type="delete"/></Popconfirm>
                }
            },
        ];
        const importResultColumns=[
            {
                title: '@域名',
                dataIndex: 'url',
                key: 'url',
                render:(index,record)=>{
                    return <span className="fail">{record.url}</span>
                }
            },{
                title: '@导入失败原因',
                dataIndex: 'reason',
                key: 'reason',
                render:(index,record)=>{
                    return <span className="fail">{record.reason}</span>
                }
            }];
        const pagination = {
            total: this.props.mi0401Info.total,
            pageSize: 20,
            onChange: (current) => {
                this.props.dispatch({
                    type: 'mi0401Info/get_black_list',
                    payload: {
                        start: (current - 1) * 20,
                        limit: 20,
                    }
                })
            },
        };

        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys, selectedRows) => {
                let lines;
                lines = selectedRows.map((item) => {
                    return item.url
                });
                this.setState({
                    blackListLines: lines,
                    selectedRecords:selectedRows
                })
            }
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
        return (
            <Card className="card">
                <HeaderBar hasAdd={true} hasDelete={true} hasSearch={true}
                           delete={this.delete_black_list_batch} selectedKeys={this.state.blackListLines}
                           add={this.handleOpenAddUrlModal} submit={this.searchBlackList}
                           hasModalStyelUpload={true} modal={this.handelUploadModalShow}/>
                <BossTable columns={columns} dataSource={this.props.mi0401Info.dataSource}
                       pagination={pagination} rowSelection={rowSelection} rowKey={record => record.url}/>
                <Modal maskClosable={false} visible={this.state.ifAddUrlModalShow} onCancel={this.handleCloseAddUrlModal}
                       onOk={this.handleSubmitAddUrl} title={"@添加黑名单"} destroyOnClose>
                    <Form>
                        <FormItem label={"@域名"} {...modalFormLayout}>
                            {getFieldDecorator('url', {
                                rules: [{required: true, message: "@请输入域名"},],
                            })(
                                <Input placeholder={"@请输入域名"}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                <Modal maskClosable={false} title={<span>{"@提示:批量导入的文件必须使用提供的模板才能成功"}</span>} onCancel={this.handelUploadModalClose}
                       destroyOnClose
                       visible={this.state.uploadModalShow} style={{textAlign: "center"}} width={525} footer={null}>
                    <div style={{height: 200}}>
                        <Upload showUploadList={false} action="/v1/company/import_black_list_info/"
                                data={{company_id: sessionStorage.getItem("companyId")}} onChange={this.handleUploadComplete} beforeUpload={this.checkBeforeUpload}>
                            <Button style={{marginTop: 64}}
                                    type="primary">{"@上传文件"}</Button>
                        </Upload>
                        <div style={{marginTop: 16}}>{"@没有模板"},<a href={domain + '/v1/company/download_blacklist_template'}>{"@点击下载"}</a></div>
                    </div>
                </Modal>
                <Modal maskClosable={false} footer={null} title={"@导入结果"} visible={this.state.importResultModalShow} onCancel={this.handleCloseImportModal}>
                    <div style={{marginBottom:16}}><span className="result">{"@导入成功"}:{this.state.success}</span><span className={this.state.fail===0?"result":"fail"}>{"@导入失败"}:{this.state.fail}</span></div>
                    <BossTable columns={importResultColumns} dataSource={this.state.importResult} rowKey={record=>record.url}/>
                </Modal>
            </Card>
        )
    }
}

export default injectIntl(MI0401);