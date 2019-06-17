/*@商务-商务首页*/
import React from 'react';
import {Button, Form, Radio, Switch,Select} from 'antd';
import {connect} from 'dva';
import {injectIntl} from "react-intl";
import {commonTranslate} from "../../../../utils/commonUtilFunc";
const Option = Select.Option;

const FormItem = Form.Item;
const RadioGrp = Radio.Group

class SetupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: true,
        }
    }

    componentDidMount = () => {
        // 把this传到父组件使其changeId的时候调用resetFields，从而改变initialValue
        this.props.onRef(this);
        this.props.getLogo()
        this.get_os_version()
    };
    get_os_version=()=>{
        this.props.dispatch({
            type: "bi0001Info/get_os_version",
            payload: {}
        })
    }
    handelSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let types = [];
                types.push({type: values.ifOversea, rule: values.ifOversea === "oversea" ? values.strategy : "none"});
                if (values.ifOversea === "none") {
                    types = [];
                }
                this.props.dispatch({
                    type: "bi0001Info/update_speed_rule",
                    payload: {
                        list: {
                            company_id: this.props.editId,
                            types: types,
                        },
                        shrink: {
                            company_id: this.props.editId,
                            enable_activity: values.ifShrink,
                        },
                        logo: {
                            id: this.props.editId,
                            logo: values.logo,
                        },
                        version:{
                            id: this.props.editId,
                            version:values.version
                        }
                    }
                }).then(() => {
                    this.props.dispatch({
                        type: "bi0001Info/get_speed_rule",
                        payload: {
                            company_id: this.props.editId,
                        }
                    })
                    this.props.dispatch({
                        type: "bi0001Info/getLogo",
                        payload: {
                            company_id: this.props.editId,
                        }
                    })
                    this.props.dispatch({
                        type: "bi0001Info/get_os_version",
                        payload: {
                            
                        }
                    })
                })

            }
            this.props.cancel();
        })


    };

    render() {
        const versions = this.props.bi0001Info.versionList.map((item) => {
            return <Option key={item.version} value={item.version}>{item.version}</Option>
        })
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        return <Form>
            <FormItem label={"@SaaS加速"} {...modalFormLayout}>
                {getFieldDecorator('ifOversea', {initialValue: this.props.bi0001Info.speedRule[0].type || 'none'})(
                    <RadioGrp>
                        <Radio value="oversea">{"@全球"}</Radio>
                        <Radio value="domestic">{"@国内"}</Radio>
                        <Radio value="none">{"@无"}</Radio>
                    </RadioGrp>
                )}
            </FormItem>
            {this.props.form.getFieldValue("ifOversea") === "oversea" ?
                <FormItem label={"@海外域名限制"} {...modalFormLayout}>
                    {getFieldDecorator('strategy', {
                        rules: [{required: true, message: "@请选择安全策略"},],
                        initialValue: this.props.bi0001Info.speedRule[0].rule
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
                    valuePropName: 'checked', initialValue: this.props.bi0001Info.ifShrink === 1
                })(
                    <Switch checkedChildren={"@开启"} unCheckedChildren={"@关闭"}/>
                )}
            </FormItem>
            <FormItem label={"@Logo设置"} {...modalFormLayout}>
                {getFieldDecorator('logo', {initialValue: this.props.bi0001Info.logo})(
                    <RadioGrp>
                        <Radio value="default">{"@默认"}</Radio>
                        <Radio value="white">{"@白板"}</Radio>
                        <Radio value="custom">{"@企业自定义"}</Radio>
                    </RadioGrp>
                )}
            </FormItem>
            <FormItem label={"@基础版本"} {...modalFormLayout}>
                {getFieldDecorator('version', {initialValue: this.props.bi0001Info.companyInfo.version})(
                    <Select style={{width:"250px"}}>
                       {versions}
                    </Select>
                )}
            </FormItem>
            <Button type="primary" htmlType="submit" className="confirmBtn" onClick={() => {
                this.handelSubmit()
            }}><span
                style={{color: "#fff"}}>{"@保存"}</span></Button>
        </Form>
    }
}

function mapDispatchToProps({bi0001Info}) {
    return {bi0001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(SetupModal)));