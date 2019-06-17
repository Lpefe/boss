/*@客户-QoS配置*/
import React from 'react';
import {Modal, Form, InputNumber,Icon,Select} from 'antd';
import {connect} from 'dva';
import './PriorityRatioSetup.scss';
import {injectIntl} from "react-intl";

const FormItem = Form.Item;


class PriorityRatioSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
        }
    }




    changeMode = () => {
        this.setState({
            isEdit: true
        })
    };

    closeEditMode=()=>{
        this.setState({
            isEdit:false,
        })
    };

    update_app_priority=()=>{
        this.props.form.validateFields((err,values)=>{
            if(!err){
                if(values.urgent+values.high+values.medium+values.low===100){
                    const valueChecked = [values.urgentspeed,values.highspeed,values.mediumspeed,values.lowspeed]
                    let checked = []
                    for(let i = 0;i<valueChecked.length;i++){
                        if(valueChecked[i]){
                            checked.push(i+1)
                        }
                    }
                    console.log(values)
                    this.props.dispatch({
                        type:"ci0601Info/update_app_priority",
                        payload:{
                            company_id:sessionStorage.getItem("companyId"),
                            urgent:values.urgent,
                            high:values.high,
                            medium:values.medium,
                            low:values.low,
                            checked:checked.join(",")
                        }
                    })
                }else{
                    Modal.warning({title:"优先级配置比例累计需100%"})

                }
            }
        });
        this.setState({
            isEdit:false,
        })
    };


    render() {
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 8},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        const modalFormLayoutUrgent = {
            labelCol: {
                xs: {span: 9},
            },
            wrapperCol: {
                xs: {span: 15},
            },
        };
        return <div style={{marginBottom: 16,display:"inline-block",marginRight:80,width:this.state.isEdit?"100%":600}}>
            <div style={{marginBottom: 16}}>
                <span className="priority-title">{"@优先级资源配置比例"}</span><Icon onClick={this.changeMode} type="edit"/>
            </div>
            <Form layout="inline">
                {this.state.isEdit ?<div className="ci0601float">  
                <FormItem label={"@紧急"}style={{margin:0}} {...modalFormLayoutUrgent}>
                    {getFieldDecorator('urgent', {
                        rules: [{
                            required: true,
                            message: "@请输入优先级比例"
                        },],initialValue:this.props.ci0601Info.priorityData.urgent
                    })(
                        <InputNumber style={{width:70}} formatter={value => `${value}%`}
                                     parser={value => value.replace('%', '')}
                                     min={0} max={100}/>
                    )}
                </FormItem>
                <FormItem label={""} style={{marginLeft:-5}} {...modalFormLayout}>
                    {getFieldDecorator('urgentspeed', {
                        rules: [{
                            required: true,
                            message: "@请输入优先级比例"
                        },],initialValue:this.props.ci0601Info.urgentspeed
                    })(
                        <Select style={{width:100}}>
                            <Option value={false} key={"不限速"}>不限速</Option>
                            <Option value={true} key={"限速"}>限速</Option>
                        </Select>
                    )}
                </FormItem></div>  : <FormItem style={{width:130}} label={"@紧急"} {...modalFormLayout}>
                        &nbsp;{this.props.ci0601Info.priorityData.urgent}%&nbsp;{this.props.ci0601Info.urgentspeed?"@限速":"@不限速"}
                </FormItem>}
                {this.state.isEdit ?<div  className="ci0601float">
                <FormItem label={"@高"}style={{margin:0}} {...modalFormLayout}>
                    {getFieldDecorator('high', {
                        rules: [{
                            required: true,
                            message: "@请输入优先级比例"
                        },],initialValue:this.props.ci0601Info.priorityData.high
                    })(
                        <InputNumber style={{width:70}} formatter={value => `${value}%`}
                                     parser={value => value.replace('%', '')}
                                     min={0} max={100}/>
                    )}
                </FormItem>
                 <FormItem label={""} {...modalFormLayout}>
                    {getFieldDecorator('highspeed', {
                        rules: [{
                            required: true,
                            message: "@请输入优先级比例"
                        },],initialValue:this.props.ci0601Info.highspeed
                    })(
                    <Select style={{width:100}}>
                        <Option value={false} key={"不限速"}>不限速</Option>
                        <Option value={true} key={"限速"}>限速</Option>
                    </Select>
                    )}
                </FormItem></div>: <FormItem style={{width:130}} label={"@高"} {...modalFormLayout}>
                    &nbsp;{this.props.ci0601Info.priorityData.high}%&nbsp;{this.props.ci0601Info.highspeed?"@限速":"@不限速"}
                </FormItem>}
                {this.state.isEdit ?<div  className="ci0601float"> 
                <FormItem label={"@中"}style={{margin:0}} {...modalFormLayout}>
                    {getFieldDecorator('medium', {
                        rules: [{
                            required: true,
                            message: "@请输入优先级比例"
                        },],initialValue:this.props.ci0601Info.priorityData.medium
                    })(
                        <InputNumber style={{width:70}} formatter={value => `${value}%`}
                                     parser={value => value.replace('%', '')}
                        min={0} max={100}/>
                    )}
                </FormItem> 
                <FormItem label={""} {...modalFormLayout}>
                    {getFieldDecorator('mediumspeed', {
                        rules: [{
                            required: true,
                            message: "@请输入优先级比例"
                        },],initialValue:this.props.ci0601Info.mediumspeed
                    })(
                    <Select style={{width:100}}>
                        <Option value={false} key={"不限速"}>不限速</Option>
                        <Option value={true} key={"限速"}>限速</Option>
                    </Select>
                    )}
                </FormItem> </div>: <FormItem style={{width:130}} label={"@中"} {...modalFormLayout}>
                    &nbsp;{this.props.ci0601Info.priorityData.medium}% &nbsp;{this.props.ci0601Info.mediumspeed?"@限速":"@不限速"}
                </FormItem>}
                {this.state.isEdit ?<div  className="ci0601float"> 
                <FormItem label={"@低"}style={{margin:0}} {...modalFormLayout}>
                    {getFieldDecorator('low', {
                        rules: [{
                            required: true,
                            message: "@请输入优先级比例"
                        },],initialValue:this.props.ci0601Info.priorityData.low
                    })(
                        <InputNumber style={{width:70}} formatter={value => `${value}%`}
                                     parser={value => value.replace('%', '')}
                                     min={0} max={100}/>
                    )}
                </FormItem>
                <FormItem label={""} {...modalFormLayout}>
                {getFieldDecorator('lowspeed', {
                    rules: [{
                        required: true,
                        message: "@请输入优先级比例"
                    },],initialValue:this.props.ci0601Info.lowspeed
                })(
                <Select style={{width:100}}>
                    <Option value={false} key={"不限速"}>不限速</Option>
                    <Option value={true} key={"限速"}>限速</Option>
                </Select>
                )}
            </FormItem> </div>: <FormItem style={{width:130}} label={"@低"} {...modalFormLayout}>
                    &nbsp;{this.props.ci0601Info.priorityData.low}%&nbsp;{this.props.ci0601Info.lowspeed?"@限速":"@不限速"}
                </FormItem>}
                {this.state.isEdit ? <div className="ratio-confirm">
                    <FormItem {...modalFormLayout}>
                        <Icon type="check" className="check" onClick={this.update_app_priority}/>
                    </FormItem>
                    <FormItem {...modalFormLayout}>
                        <Icon type="close" className="close" onClick={this.closeEditMode}/>
                    </FormItem>
                </div> : ""}
            </Form>
        </div>
    }
}

function mapDispatchToProps({ci0601Info}) {
    return {ci0601Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(PriorityRatioSetup)))
