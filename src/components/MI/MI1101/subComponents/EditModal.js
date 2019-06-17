/*@运维-运营商信息*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Form, Input,} from 'antd';
import messages from '../LocaleMsg/messages';
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
                        type: "mi1101Info/update_isp_dict",
                        payload: {
                            name:values.name,
                            code:values.code,
                            remark:values.remark,
                            id:this.props.recordId,
                            record:this.props.record
                        }
                    })
                } else {
                    this.props.dispatch({
                        type: "mi1101Info/add_isp_dict",
                        payload: {
                            name:values.name,
                            code:values.code,
                            remark:values.remark,
                        }
                    })
                }
                this.cancelModal();
            }
        });

    };

    cancelModal = () => {
        this.props.cancel();
    };


    render() {
        const __=this.props.intl.formatMessage;
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        let record = this.props.record;
        return <Modal maskClosable={false} title={this.props.recordId ? "@编辑账号" : "@新增账号"} onCancel={this.props.cancel}
                      visible={this.props.visible} onOk={this.aclConfigSubmit} destroyOnClose>
            <Form>
                <FormItem label={"@名称"} {...modalFormLayout}>
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: "@请输入名称"}],
                        initialValue: record.name
                    })(
                        <Input placeholder={"@请输入名称"} />
                    )}
                </FormItem>
                <FormItem label={"@代码"} {...modalFormLayout}>
                    {getFieldDecorator('code', {
                        rules: [{required: true, message: "@请输入代码"},],
                        initialValue: record.code
                    })(
                        <Input placeholder={"@请输入代码"} disabled={this.props.recordId!==undefined}/>
                    )}
                </FormItem>
                <FormItem label={"@备注"} {...modalFormLayout}>
                    {getFieldDecorator('remark', {
                        rules: [],
                        initialValue: record.remark
                    })(
                        <Input placeholder={"@请输入备注"}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    }
}

function mapDispatchToProps({mi1101Info}) {
    return {mi1101Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(EditModal)));