/*@客户-客户端IP段*/
import React from 'react';
import {Form,Icon,Input} from 'antd';
import {connect} from 'dva';
import './DNS.scss';
import {injectIntl} from "react-intl";

const FormItem = Form.Item;


class DNS extends React.Component {
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
                this.props.dispatch({
                    type:"ci3701Info/update_app_dns",
                    payload:{
                        update:{
                            id:this.props.ci3701Info.dns.id,
                            dns:values.dns,
                            dns_backup:values.dns_backup,
                        },
                        init:{
                            company_id:sessionStorage.getItem("companyId")
                        }
                    }
                }).then(()=>{
                    this.setState({
                        isEdit:false,
                    })
                })
                // Modal.warning({title:""})
            }
        });
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 6},
            },
            wrapperCol: {
                xs: {span: 18},
            },
        };
        const modalFormLayoutUrgent = {
            labelCol: {
                xs: {span: 8},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        return <div style={{marginBottom: 16,display:"inline-block",marginRight:80,width:"100%"}}>
            <div style={{marginBottom: 16}}>
                <span className="priority-title">{"@DNS配置"}</span><Icon onClick={this.changeMode} type="edit"/>
            </div>
            <Form layout="inline">
                {this.state.isEdit ?<div className="ci0601float">  
                <FormItem label={"@主DNS"}style={{margin:0}} {...modalFormLayoutUrgent}>
                    {getFieldDecorator('dns', {
                        rules: [{
                            required: true,
                            message: "@请输入主DNS"
                        },{
                            pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                            message: "@请输入正确IP格式"
                        }],initialValue:this.props.ci3701Info.dns.dns
                    })(
                        <Input style={{width:160}} />
                    )}
                </FormItem>
               </div>  : <FormItem style={{width:200,marginLeft:-10}} label={"@主DNS"} {...modalFormLayoutUrgent}>
                        &nbsp;{this.props.ci3701Info.dns.dns}
                </FormItem>}
                {this.state.isEdit ?<div  className="ci0601float">
                <FormItem label={"@备选DNS"}style={{marginLeft:10}} {...modalFormLayoutUrgent}>
                    {getFieldDecorator('dns_backup', {
                        rules: [{
                            required: true,
                            message: "@请输入备选DNS"
                        },{
                            pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                            message: "@请输入正确IP格式"
                        }],initialValue:this.props.ci3701Info.dns.dns_backup
                    })(
                        <Input style={{width:160}} />
                    )}
                </FormItem>
                 </div>: <FormItem style={{width:200,marginLeft:-10}} label={"@备选DNS"} {...modalFormLayoutUrgent}>
                    &nbsp;{this.props.ci3701Info.dns.dns_backup}&nbsp;
                </FormItem>}
                {this.state.isEdit ? <div className="ratio-confirm">
                    <FormItem {...modalFormLayoutUrgent}>
                        <Icon type="check" className="check" onClick={this.update_app_priority}/>
                    </FormItem>
                    <FormItem {...modalFormLayoutUrgent}>
                        <Icon type="close" className="close" onClick={this.closeEditMode}/>
                    </FormItem>
                </div> : ""}
            </Form>
        </div>
    }
}

function mapDispatchToProps({ci3701Info}) {
    return {ci3701Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(DNS)))
