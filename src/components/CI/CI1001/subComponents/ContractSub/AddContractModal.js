/*@客户-企业信息*/
import React from 'react';
import {connect} from 'dva';

import {DatePicker,Input,Modal, Form} from 'antd';
import moment from 'moment';


const FormItem = Form.Item;

class AddContractForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.isBusiness = sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin"

    }

    create_company_contract = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.props.recordId) {
                    this.props.dispatch({
                        type: "ci1001Info/update_contract",
                        payload: {
                            company_id:this.isBusiness?this.props.id:sessionStorage.getItem("companyId"),
                            id: this.props.record.id,
                            name: values.name,
                            begin_time: values.begin_time.format("YYYY-MM-DD HH:mm:ss"),
                            end_time: values.end_time.format("YYYY-MM-DD HH:mm:ss"),
                            time: values.time.format("YYYY-MM-DD HH:mm:ss"),
                            record:this.props.record,
                        }
                    });
                    this.props.cancel();
                } else {
                    this.props.dispatch({
                        type: "ci1001Info/create_company_contract",
                        payload: {
                            company_id: this.isBusiness?this.props.id:sessionStorage.getItem("companyId"),
                            name: values.name,
                            begin_time: values.begin_time.format("YYYY-MM-DD HH:mm:ss"),
                            end_time: values.end_time.format("YYYY-MM-DD HH:mm:ss"),
                            time: values.time.format("YYYY-MM-DD HH:mm:ss"),
                        }
                    });
                    this.props.cancel();
                }
            }
        })
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
        let editRecord = this.props.record || {};
        return (
            <Modal visible={this.props.visible} onCancel={this.props.cancel} onOk={this.create_company_contract}>
                <Form>
                    <FormItem label="@合同名称" {...modalFormLayout}>
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: "@请输入合同名称"}], initialValue: editRecord.name
                        })(
                            <Input placeholder="@请输入合同名称"/>
                        )}
                    </FormItem>
                    <FormItem label="@合同开始时间" {...modalFormLayout}>
                        {getFieldDecorator('begin_time', {
                            rules: [{required: true, message: "@请选择合同开始时间"}],initialValue: moment(editRecord.begin_time),
                        })(
                            <DatePicker placeholder="@请选择合同开始时间"/>
                        )}
                    </FormItem>
                    <FormItem label="@合同结束时间" {...modalFormLayout}>
                        {getFieldDecorator('end_time', {
                            rules: [{required: true, message: "@请选择合同结束时间"}],initialValue: moment(editRecord.end_time),
                        })(
                            <DatePicker placeholder="@请选择合同结束时间"/>
                        )}
                    </FormItem>
                    <FormItem label="@合同签订时间" {...modalFormLayout}>
                        {getFieldDecorator('time', {
                            rules: [{required: true, message: "@请选择合同签订时间"}],initialValue: moment(editRecord.time),
                        })(
                            <DatePicker placeholder="@请选择合同签订时间"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

function mapDispatchToProps({ci1001Info}) {
    return {ci1001Info};
}

export default connect(mapDispatchToProps)(Form.create()(AddContractForm))