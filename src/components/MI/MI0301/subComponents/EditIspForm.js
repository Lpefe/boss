/*@运维-设备管理*/
import React from 'react';
import {Form, Button, Select, InputNumber, Input} from 'antd';
import {validateIp} from "../../../../utils/commonUtilFunc";
import {connect} from 'dva';
const Option = Select.Option;
const FormItem = Form.Item;

class EditIspForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    update_isp = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "mi0301Info/update_isp",
                    payload: {
                        room_id: this.props.room_id,
                        isp: values.isp,
                        bandwidth: values.bandwidth,
                        speed: values.speed,
                        id: this.props.record.id,
                        record:this.props.record,
                        ip:values.ip
                    }
                });
                this.props.cancel();
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
        return (<Form onSubmit={this.update_isp}>
            <FormItem label={"@运营商"}{...modalFormLayout}>
                {getFieldDecorator('isp', {
                    rules: [{required: true, message: "@请选择运营商"}],
                    initialValue:this.props.record.isp
                })(
                    <Select placeholder={"@请选择运营商"}>
                        {this.props.mi0301Info.ispOptionList.map((item)=>{
                            return <Option value={item.code} key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                )}
            </FormItem>
            <FormItem label={"@带宽"}{...modalFormLayout}>
                {getFieldDecorator('bandwidth', {
                    rules: [{required: true, message:"@请输入带宽"},{pattern: /^[1-9]\d*$/, message: "@只能输入正整数"}],

                    initialValue:this.props.record.bandwidth
                })(
                    <InputNumber placeholder={"@请输入带宽"} min={0} style={{width:315}}/>
                )}
            </FormItem>
            <FormItem label="IP" {...modalFormLayout}>
                {getFieldDecorator('ip', {
                    rules: [{required: true, message: "@请输入IP地址"},{validator: validateIp}],
                    initialValue:this.props.record.ip
                })(
                    <Input placeholder={"@请输入IP地址"} style={{width:315}}/>

                )}
            </FormItem>
            <Button htmlType="submit">{"@确认修改"}</Button>
        </Form>)
    }
}


function mapDispatchToProps({mi0301Info}) {
    return {mi0301Info};
}

export default connect(mapDispatchToProps)(Form.create()(EditIspForm));