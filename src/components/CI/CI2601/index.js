/*@客户-告警配置*/
import React from 'react';
import {Card, Checkbox, Form,Input,Button,Modal} from 'antd';
import "./index.scss"
import wechat_help from "../../../assets/img/wechat_help.png"
import {commonTranslate} from "../../../utils/commonUtilFunc";
import {injectIntl} from "react-intl";
const FormItem=Form.Item;


class CI2601 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifHelpModalShow:false
        };

    }

    componentDidMount() {
        this.get_company_info();
    }
    get_company_info=()=>{
        this.props.dispatch({
            type:"ci2601Info/get_company_info",
            payload:{
                company_id:sessionStorage.getItem("companyId")
            }
        })
    };

    handleShowHelpModal=()=>{
       this.setState({
           ifHelpModalShow:true
       })
    };

    handleColseHelpModal=()=>{
        this.setState({
            ifHelpModalShow:false
        })
    };
    handleActiveWechat=(e)=>{
        this.props.dispatch({
            type:"ci2601Info/handleActiveWechat",
            payload:{
                ifWechat:e.target.checked
            }
        })
    };
    handleActiveDing=(e)=>{
        this.props.dispatch({
            type:"ci2601Info/handleActiveDing",
            payload:{
                ifDing:e.target.checked
            }
        })
    };

    update_company=()=>{
        const {ci2601Info}=this.props;
        this.props.form.validateFields((err,values)=>{
            if(!ci2601Info.ifWechat){
                if(err&&err.wx_id)delete err.wx_id;
                if(err&&err.wx_secret)delete err.wx_secret;
                if(err&&err.wx_agent_id)delete err.wx_agent_id;
            }
            if(!ci2601Info.ifDing){
                if(err&&err.dingding_token)delete err.dingding_token;
            }
            if(!err||JSON.stringify(err)==="{}"){
                this.props.dispatch({
                    type:"ci2601Info/update_company",
                    payload:{
                        id:sessionStorage.getItem("companyId"),
                        wx_id:ci2601Info.ifWechat?values.wx_id:"",
                        wx_agent_id:ci2601Info.ifWechat?values.wx_agent_id:"",
                        wx_secret:ci2601Info.ifWechat?values.wx_secret:"",
                        dingding_token:ci2601Info.ifDing?values.dingding_token:""
                    }
                })
            }
        })
    };

    handleOpenWexinUrl=()=>{
        window.open("https://work.weixin.qq.com")
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const {ci2601Info}=this.props;
        const companyInfo=ci2601Info.companyInfo;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 4},
            },
            wrapperCol: {
                xs: {span: 20},
            },
        };
        const modalFormLayoutWithoutLabel = {
            wrapperCol: {
                xs: {span: 20, offset: 4},
            }
        };
        return (
            <Card className="card ci2601">
                <Form style={{width:700}} onSubmit={this.update_company}>
                    <FormItem label={<span className="main-title">{"@企业微信群"}</span>}  key="ifWechat" style={{}} {...modalFormLayout}>
                        {getFieldDecorator("ifWechat", {
                            rules: [],
                            initialValue: ci2601Info.ifWechat,
                            valuePropName: 'checked',
                        })(
                            <Checkbox onChange={this.handleActiveWechat} >{"@启用"}</Checkbox>
                        )}
                        <span className="help-title" onClick={this.handleShowHelpModal} >{"@如何设置企业微信接受告警消息"}</span>
                    </FormItem>
                    <FormItem label={"@企业ID"} {...modalFormLayout} key="companyId">
                        {getFieldDecorator("wx_id", {
                            rules: [{required:ci2601Info.ifWechat,message:"@请输入企业ID"},{max:32,message:"@最多输入32字符"}],
                            initialValue: companyInfo.wx_id,
                        })(
                            <Input disabled={!ci2601Info.ifWechat} />
                        )}
                    </FormItem>
                    <FormItem label="AgentId" {...modalFormLayout} key="agentId">
                        {getFieldDecorator("wx_agent_id", {
                            rules: [{required:ci2601Info.ifWechat,message:"@请输入AgentId"},{max:16,message:"@最多输入16字符"}],
                            initialValue: companyInfo.wx_agent_id,
                        })(
                            <Input disabled={!ci2601Info.ifWechat}/>
                        )}
                    </FormItem>
                    <FormItem label="Secret" {...modalFormLayout} key="secret">
                        {getFieldDecorator("wx_secret", {
                            rules: [{required:ci2601Info.ifWechat,message:"@请输入Secret"},{max:128,message:"@最多输入128字符"}],
                            initialValue: companyInfo.wx_secret,
                        })(
                            <Input disabled={!ci2601Info.ifWechat}/>
                        )}
                    </FormItem>
                    <FormItem label={<span className="CI2601-main-title">{"@钉钉群"}</span>}  key="ifDing" style={{}} {...modalFormLayout}>
                        {getFieldDecorator("ifDing", {
                            rules: [],
                            initialValue: ci2601Info.ifDing,
                            valuePropName: 'checked',
                        })(
                            <Checkbox onChange={this.handleActiveDing}>{"@启用"}</Checkbox>
                        )}
                    </FormItem>
                    <FormItem label="Token" {...modalFormLayout} key="token">
                        {getFieldDecorator("dingding_token", {
                            rules: [{required:ci2601Info.ifDing,message:"Token"},{max:128,message:"@最多输入128字符"}],
                            initialValue: companyInfo.dingding_token,
                        })(
                            <Input disabled={!ci2601Info.ifDing}/>
                        )}
                    </FormItem>
                    <FormItem label="" {...modalFormLayoutWithoutLabel}>
                        <Button type="primary" htmlType="submit">{"@立即应用"}</Button>
                    </FormItem>
                </Form>
                <Modal visible={this.state.ifHelpModalShow} title={"@企业微信接受告警消息配置"} width={900} footer={null} onCancel={this.handleColseHelpModal}>
                    <img src={wechat_help}/>
                    <div style={{height:20,width:189,position:"absolute",left:160,top:142,backgroundColor:"#fff",footSize:14}}>
                        <a onClick={this.handleOpenWexinUrl}>&nbsp;&nbsp;https://work.weixin.qq.com</a>
                    </div>
                </Modal>
            </Card>
        )
    }
}

export default injectIntl(CI2601);