import React from 'react';
import {Modal, Form, Switch, Radio} from 'antd';
import {connect} from 'dva';
import {injectIntl} from "react-intl";

const FormItem = Form.Item;
const RadioGrp = Radio.Group;

class SetupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: true,
        }
    }

    componentDidMount() {

    }

    handelSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let types = [];
                types.push({type: values.ifOversea, rule: values.ifOversea==="oversea"?values.strategy:"none"});
                if(values.ifOversea==="none"){
                    types=[];
                }
                this.props.dispatch({
                    type: "bi0101Info/update_speed_rule",
                    payload: {
                        list: {
                            company_id: this.props.editId,
                            types: types,
                            record:[{type:this.props.bi0101Info.speedRule[0].type,rule:this.props.bi0101Info.speedRule[0].rule,}],
                        },
                        shrink: {
                            company_id: this.props.editId,
                            enable_activity: values.ifShrink,
                            record:{enable_activity:this.props.bi0101Info.ifShrink}
                        }
                    }
                })
            }
            this.props.cancel();
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
        return <Modal maskClosable={false} visible={this.props.visible} title={"@功能配置"} onCancel={this.props.cancel}
                      onOk={this.handelSubmit} destroyOnClose>
            <Form>
                <FormItem label={"@开启加速"} {...modalFormLayout}>
                    {getFieldDecorator('ifOversea', {initialValue: this.props.bi0101Info.speedRule[0].type||'none'})(
                        <RadioGrp>
                            <Radio value="oversea">{"@海外加速"}</Radio>
                            <Radio value="domestic">{"@国内加速"}</Radio>
                            <Radio value="none">{"@组网"}</Radio>
                        </RadioGrp>
                    )}
                </FormItem>
                {this.props.form.getFieldValue("ifOversea") === "oversea" ?
                    <FormItem label={"@安全策略"} {...modalFormLayout}>
                        {getFieldDecorator('strategy', {
                            rules: [{required: true, message: "@请选择安全策略"},],
                            initialValue: this.props.bi0101Info.speedRule[0].rule
                        })(
                            <RadioGrp>
                                <Radio value="blacklist">{"@黑名单"}</Radio>
                                <Radio value="whitelist">{"@黑白名单"}</Radio>
                                <Radio value="none">{"@不限制"}</Radio>
                            </RadioGrp>
                        )}
                    </FormItem> : ""}
                <FormItem label={"@智能压缩"} {...modalFormLayout}>
                    {getFieldDecorator('ifShrink', {
                        valuePropName: 'checked', initialValue: this.props.bi0101Info.ifShrink
                    })(
                        <Switch checkedChildren={"@开启"} unCheckedChildren={"@关闭"}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    }
}

function mapDispatchToProps({bi0101Info}) {
    return {bi0101Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(SetupModal)));