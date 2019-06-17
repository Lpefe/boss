/*@通用页面-忘记密码*/
import React from 'react';
import {Form, Select,Card,Input,Icon,Button} from 'antd';
import {injectIntl} from "react-intl";
import localeList from "../../../locales/_localeList";
import {domain} from "../../../utils/commonConsts";
const FormItem=Form.Item;
const Option=Select.Option;
class RememberPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getCaptcha();
    }

    getCaptcha=()=>{
        this.props.dispatch({
            type:"rememberPassword/getCaptcha",
            payload:{}
        })
    };

    handleSubmit=()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "rememberPassword/resend_password",
                    payload: {
                        email: values.email.replace(/(^\s*)|(\s*$)/g, ""),
                        captcha_code: values.captcha
                    }
                });
            }
        })
    };
    handleSelectLanguage = (value) => {
        window.location.href = domain + '/index.' + value + '.html#' + this.props.location.pathname + this.props.location.search
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const inEnglish=window.appLocale.locale==="en-US";
        return (
            <div className="loginMainContainer">
                <header className="headerContainer">
                    <div>
                        <span className="back" style={{marginRight: 8}}><a
                            href={domain + '/index.' + window.appLocale.locale + '.html#'}>{"@继续登录"}</a></span>
                        <div style={{display:"inline-block",float:"right"}}>
                            <Icon type="global" style={{fontSize:16,marginRight: 8,marginTop: 20,}}/>
                            <Select style={{width: 100, marginRight: 16, clear: 'both'}}
                                    onChange={this.handleSelectLanguage} value={window.appLocale.locale}>
                                {localeList.map((lang) => {
                                    return <Option value={lang.name} key={lang.name}>{lang.label}</Option>
                                })}
                            </Select>
                        </div>
                    </div>
                </header>
                <div className="dash"/>
                <div style={{marginTop: 24}}>
                    <Card className="loginContainer">
                        <div className="title" style={inEnglish?{fontSize:20}:{}}>{"@SD-WAN综合管理平台"}</div>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem className="FormItem">
                                {getFieldDecorator('email', {
                                    rules: [{required: true, message: '@请输入邮箱',}],
                                })(
                                    <Input size="large" placeholder={"@请输入邮箱"} className="input"/>
                                )
                                }
                            </FormItem>
                            <FormItem className="FormItem">
                                {getFieldDecorator('captcha', {
                                    rules: [{required: true, message: '@请输入验证码',}],
                                })(
                                    <Input size="large" style={{width: 150}} placeholder={"@请输入验证码"} className="input"/>
                                )
                                }
                                <img src={this.props.rememberPassword.captchaUrl} alt="" style={{width:60,height:40,marginLeft:58}}/>
                                <Icon type="reload" style={{fontSize:16,marginLeft:12}} onClick={this.getCaptcha}/>
                            </FormItem>
                            <Button type="primary" htmlType="submit" className="confirmBtn"><span
                                style={{color: "#fff"}}>{"@立即验证"}</span></Button>
                            <div style={{textAlign: "center", marginTop: 8}}>
                                <span>© 2018 {"@极致互联"} | {"@浙ICP备17059766号"}</span>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

export default injectIntl(RememberPassword);