/*@客户-客户端账号*/
import React from 'react';
import {Button, Card, Icon, Modal, Switch, Upload} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import BossEditModal from "../../MI/MI1902/subComponents/BossEditModal";
import Operations from "../../MI/MI1901/subComponents/Operations";
import {domain} from "../../../utils/commonConsts";
import Cookies from 'js-cookie'
import {BossMessage} from "../../Common/BossMessages";

class CI0702C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editModalShow: false,
            editRecord: {},
            editId: "",
            uploadModalShow: false,
            importResultModalShow: false,
            name: ""
        };

    }

    componentDidMount() {
        this.get_app_account();

    }


    get_agency_group = () => {
        this.props.dispatch({
            type: "ci0702Info/get_agency_group",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                name:this.state.name
            }
        })
    };

    get_app_account = () => {
        this.props.dispatch({
            type: "ci0702Info/get_app_account",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.name
            }
        })
    };


    handleEditModalShow = (record) => {
        this.setState({
            editModalShow: true,
            editRecord: record.id ? record : {},
            editId: record.id,
        }, () => {
            this.get_agency_group();
        })
    };

    handleEditModalClose = () => {
        this.setState({
            editModalShow: false,
            editRecord: {},
            editId: "",
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

    handleCloseImportModal = () => {
        this.setState({
            importResultModalShow: false
        }, () => {

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
            },()=>{
                this.get_app_account()
            })
        }
    };

    checkBeforeUpload = (file) => {
        const name = file.name;
        let index1 = name.lastIndexOf(".");
        let index2 = name.length;
        let suffix = name.substring(index1 + 1, index2);
        const isValidFile = suffix === "xlsx" || suffix === 'xls';
        if (!isValidFile) {
            BossMessage(false, "@请上传EXCEL类型文件")
        }
        return isValidFile;
    };

    switchStatus = (checked, record) => {
        let vm = this;
        Modal.confirm({
            title: "@确认要修改授权配置状态?",
            onOk() {
                vm.props.dispatch({
                    type: "ci0702Info/switchStatus",
                    payload: {
                        update: {
                            is_active: checked,
                            id: record.id,
                            record: record
                        },
                        init: {
                            company_id: sessionStorage.getItem("companyId"),
                            name: vm.state.name
                        }
                    }
                })
            },
            onCancel() {

            },
        });
    };

    delete_app_account=(record)=>{
        if (record.is_active) {
            BossMessage(false,"@删除失败:仅能删除禁用状态账号");
        } else {
            this.props.dispatch({
                type: "ci0702Info/delete_app_account",
                payload: {
                    update: {
                        ids: [record.id],
                        records: [record]
                    },
                    init: {
                        company_id: sessionStorage.getItem("companyId"),
                        name: this.state.name
                    }
                }
            })
        }
    };

    reset_password=(record)=>{
        this.props.dispatch({
            type:"ci0702Info/update_app_account",
            payload:{
                update:{
                    id:record.id,
                    reset_password:true,
                    record:record
                },
                init:{
                    company_id: parseInt(sessionStorage.getItem("companyId"))
                }
            }
        })
    };

    handleSubmit=(value)=>{
        this.setState({
            name:value
        },()=>{
            this.get_app_account();
        })
    };

    render() {
        const columns = [{
            title: '@创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        }, {
            title: '@账号',
            dataIndex: 'account',
            key: 'account',
        }, {
            title: '@硬件ID',
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: '@姓名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@可访问的总部',
            dataIndex: 'agency_group_name',
            key: 'agency_group_name',
        }, {
            title: '@带宽',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, {
            title: '@状态',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (text, record) => {
                return <Switch checkedChildren="@启用" unCheckedChildren="@禁用"
                               checked={record.is_active}
                               onChange={(checked) => this.switchStatus(checked, record)}/>
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
                return <Operations extraPopConfirmTitle="@确认要重置密码吗?" hasDelete={true} hasEdit={true}
                                   edit={() => this.handleEditModalShow(record)} delete={()=>this.delete_app_account(record)}
                                   extraPopConfirmToolTip="@重置密码" hasExtraPopConfirm={true} name={<Icon type="key"/>}
                                   extraPopConfirmName={<Icon type="key"/>}  extraPopConfirmMethod={()=>this.reset_password(record)}/>
            }
        },];

        const ModalOptions = {
            title: this.state.editId ? "@编辑客户端账号" : "@添加客户端账号",
            visible: this.state.editModalShow,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci0702Info/update_app_account" : "ci0702Info/create_app_account",
            extraUpdatePayload: {
                id: this.state.editRecord.id,
                company_id: parseInt(sessionStorage.getItem('companyId'))
            },
            onCancel: this.handleEditModalClose,
            initPayload: {
                company_id: parseInt(sessionStorage.getItem("companyId"))
            },
            InputItems: [{
                type: "Input",
                labelName: "@账号",
                valName: "account",
                nativeProps: {
                    placeholder: "@请输入账号",
                    disabled: !!this.state.editId
                },
                rules: [{required: true, message: "@请输入账号"}, {max: 64, message: "@账号长度不超过64个字符"}, {
                    pattern: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$|^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                    message: "@账号只能输入邮箱或者手机号"
                }]
            }, {
                type: "Input",
                labelName: "@姓名",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入姓名",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{max: 64, message: "@姓名长度不超过64个字符"},{required: true, message: "@请输入姓名"}]
            }, {
                type: "Select",
                labelName: "@可访问的总部",
                valName: "agency_group_id",
                nativeProps: {
                    placeholder: "@可访问的总部",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{required: true, message: "@可访问的总部"}],
                children: this.props.ci0702Info.agencyGroupList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                })
            }, {
                type: "InputNumber",
                labelName: "@带宽",
                valName: "bandwidth",
                nativeProps: {
                    placeholder: "@请输入带宽",
                    style: {
                        width: 150
                    },
                    min: 1,
                    max: 512
                },
                unit: "M",
                rules: [{required: true, message: "@请输入带宽"}, {
                    pattern: /^[1-9]\d*$/, message: "@只能输入正整数"
                }],
            }]
        };

        const importResultColumns = [
            {
                title: '@账号',
                dataIndex: 'url',
                key: 'url',
                render: (index, record) => {
                    return <span className="fail">{record['账号']}</span>
                }
            }, {
                title: '@姓名',
                dataIndex: 'reason',
                key: 'reason',
                render: (index, record) => {
                    return <span className="fail">{record['姓名']}</span>
                }
            }, {
                title: '@总部组别',
                dataIndex: 'reason',
                key: 'reason',
                render: (index, record) => {
                    return <span className="fail">{record['总部组别']}</span>
                }
            }, {
                title: '@带宽' + '(M)',
                dataIndex: 'reason',
                key: 'reason',
                render: (index, record) => {
                    return <span className="fail">{record['带宽']}</span>
                }
            }, {
                title: '@导入失败原因',
                dataIndex: 'reason',
                key: 'reason',
                render: (index, record) => {
                    return <span className="fail">{record['原因']}</span>
                }
            }];
        return (
            <Card className="card">
                <HeaderBar hasAdd={true} hasExtraBtnThree={true} extraBtnNameThree="@批量导入"
                           btnThreeFunc={this.handelUploadModalShow} hasSearch={true}
                           add={this.handleEditModalShow} submit={this.handleSubmit}/>
                <BossTable columns={columns} dataSource={this.props.ci0702Info.accountList}/>
                <BossEditModal {...ModalOptions}/>
                <Modal maskClosable={false} title={<span>{"@提示:批量导入的文件必须使用提供的模板才能成功"}</span>}
                       onCancel={this.handelUploadModalClose}
                       destroyOnClose
                       visible={this.state.uploadModalShow} style={{textAlign: "center"}} width={525}
                       footer={null}>
                    <div style={{height: 200}}>
                        <Upload showUploadList={false} action="/v1/company/import_app_account_info/"
                                onChange={this.handleUploadComplete} beforeUpload={this.checkBeforeUpload}
                                headers={{'X-CSRFToken': Cookies.get('csrftoken')}}>
                            <Button style={{marginTop: 64}}
                                    type="primary">{"@上传文件"}</Button>
                        </Upload>
                        <div style={{marginTop: 16}}>{"@没有模板"},<a
                            href={domain + "/v1/company/download_app_account_template"}>{"@点击下载"}</a>
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
            </Card>
        )
    }
}

export default CI0702C;