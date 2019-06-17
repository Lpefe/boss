/**
 * 商务-链路信息*/
import React from 'react';
import {Modal, Form,Input, Select} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;

class AddLinkModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            type: "",
            name: "",
            status: "",
        }
    }

    componentDidMount(){
            this.get_device_list();
            this.get_speed_rule();

    }

    handelSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.props.recordId) {
                    this.props.dispatch({
                        type: "ci0201Info/update_link",
                        payload: {
                            grade: values.grade,
                            device_id: values.device_id,
                            name: values.name,
                            charge_type: values.charge_type,
                            bandwidth: values.bandwidth,
                            type:values.type,
                            id:this.props.recordId,
                            topo_id:this.props.topo_id

                        }})
                } else {
                    this.props.dispatch({
                        type: "ci0201Info/create_link",
                        payload: {
                            company_id:this.props.company_id,
                            grade: values.grade,
                            agency_id: this.props.agency_id_1,
                            device_id: values.device_id,
                            topo_id: this.props.topo_id,
                            name: values.name,
                            charge_type: values.charge_type,
                            bandwidth: values.bandwidth,
                            type:values.type,
                        }
                    })
                }
                this.props.cancel();
            }
        });
    };

    get_device_list=()=>{
        this.props.dispatch({
            type:"ci0201Info/get_device_list",
            payload:{
                topo_id: this.props.topo_id,
                company_id: this.props.company_id,
                agency_id: this.props.agency_id_0
            }
        })
    };
    get_speed_rule=()=>{
        this.props.dispatch({
            type:"ci0201Info/get_speed_rule",
            payload:{
                company_id: this.props.company_id,
            }
        })
    };
    render(){
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        return (<Modal  visible={this.props.visible} title={this.props.recordId?"@编辑链路":"@新增链路"} onOk={this.handelSubmit} onCancel={this.props.cancel}>
            <Form>
                <FormItem label="@分支设备" {...modalFormLayout}>
                    {getFieldDecorator('device_id', {
                        rules: [{required: true, message: "@请选择分支设备"},],
                        initialValue: this.props.record.device_id
                    })(
                        <Select placeholder="@请选择分支设备" disabled={this.props.recordId}>
                            {this.props.ci0201Info.deviceList.map((item)=>{
                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="@链路名称" {...modalFormLayout}>
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: "@请输入链路名称"},],
                        initialValue: this.props.record.name
                    })(
                        <Input placeholder="@请输入链路名称"/>

                    )}
                </FormItem>
                <FormItem label="@服务等级" {...modalFormLayout}>
                    {getFieldDecorator('grade', {
                        rules: [{required: true, message: "@请选择服务等级"},],
                        initialValue: this.props.record.grade
                    })(
                        <Select placeholder="@请选择服务等级">
                            <Option value="CLOUD_VPN">@云VPN</Option>
                            <Option value="CLOUD_SPLINE">@云专线</Option>
                            <Option value="SUPER_CLOUD_SPLINE">@超级云专线</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label="计费模式" {...modalFormLayout}>
                    {getFieldDecorator('charge_type', {
                        rules: [{required: true, message: "@请选择计费模式"},],
                        initialValue: this.props.record.charge_type
                    })(
                        <Select placeholder="@请选择计费模式">
                            <Option value="固定带宽">@固定带宽</Option>
                            <Option value="流量计费">@流量计费</Option>
                        </Select>

                    )}
                </FormItem>
                <FormItem label="@带宽(M)" {...modalFormLayout}>
                    {getFieldDecorator('bandwidth', {
                        rules: [{required: true, message: "@请输入带宽"},],
                        initialValue: this.props.record.bandwidth
                    })(
                        <Input placeholder="@请输入带宽"/>
                    )}
                </FormItem>
                <FormItem label="@链路类型" {...modalFormLayout}>
                    {getFieldDecorator('type', {
                        rules: [{required: true, message: "@请选择链路类型"},],
                        initialValue: this.props.record.type
                    })(
                        <Select placeholder="@请选择链路类型">
                            {this.props.ci0201Info.speedRule.map((item)=>{
                                return <Option value={item} key={item}>{item}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
            </Form>
        </Modal>)
    }
}

function mapDispatchToProps({ci0201Info}) {
    return {ci0201Info};
}

const AddLinkModalF = Form.create()(AddLinkModal);


export default connect(mapDispatchToProps)(AddLinkModalF);