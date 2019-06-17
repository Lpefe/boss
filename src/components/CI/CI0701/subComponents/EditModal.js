/*@客户-账号管理*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Form, Input, } from 'antd';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;


class EditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    aclConfigSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.props.recordId) {
                    this.props.dispatch({
                        type: "ci0701Info/update_related_person",
                        payload: {
                            company_id: sessionStorage.getItem("companyId"),
                            password:values.password,
                            name:values.name,
                            id:this.props.recordId,
                            record:this.props.editRecord
                        }
                    })
                } else {
                    this.props.dispatch({
                        type: "ci0701Info/create_related_person",
                        payload: {
                            company_id: sessionStorage.getItem("companyId"),
                            mail:values.mail,
                            password:values.password,
                            name:values.name,
                        }
                    })
                }
                this.cancelAclConfigModal();
            }
        });

    };

    cancelAclConfigModal = () => {
        this.props.cancel();
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        let record = this.props.editRecord;
        return <Modal maskClosable={false} title={this.props.recordId ? "@编辑账号" : "@新增账号"} onCancel={this.cancelAclConfigModal}
                      visible={this.props.editModalShow} onOk={this.aclConfigSubmit} destroyOnClose>
            <Form>
                <FormItem label={"@账号"} {...modalFormLayout}>
                    {getFieldDecorator('mail', {
                        rules: [{required: true, message: "@请输入账号"},{type:"email",message:"@请输入正确格式邮箱地址"},{max:100,message:"@账号最多输入100个字符"}],
                        initialValue: record.mail
                    })(
                        <Input placeholder={"@请输入账号"} disabled={this.props.recordId?true:false}/>
                    )}
                </FormItem>
                <FormItem label={"@昵称"} {...modalFormLayout}>
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: "@请输入昵称"},{max:50,message:"@昵称最多输入50个字符"}],
                        initialValue: record.name
                    })(
                        <Input placeholder={"@请输入昵称"}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    }
}

function mapDispatchToProps({ci0701Info}) {
    return {ci0701Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(EditModal)));