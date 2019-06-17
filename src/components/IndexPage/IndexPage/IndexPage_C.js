/*@通用页面-登录首页*/
import React from 'react';
import './IndexPage.scss';
import {Card, Form, Input, Checkbox, Button, Icon, Select} from 'antd';
import {withRouter} from 'react-router-dom'
import logo from '../../../assets/img/logo-index.png'
import {_crypto} from '../../../utils/commonUtilFunc';
import {domain, IconFont} from '../../../utils/commonConsts';
import localeList from "../../../locales/_localeList";
import {injectIntl} from "react-intl";

const FormItem = Form.Item;
const Option=Select.Option;
class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.get_logo();
    }

    componentDidUpdate() {
        if (this.props.indexPage.result) {
            let menuInfo = this.props.indexPage.menuInfo;
            let path = "";
            if (menuInfo[0].sub) {
                path = menuInfo[0].sub[0].path
            } else {
                path = menuInfo[0].path
            }//登陆后定位到菜单第一项为默认首页
            sessionStorage.setItem("ifLogin", true);
            this.props.history.push("/main/" + path);
            this.props.indexPage.result = false
        }
    }

    get_logo=()=>{
        this.props.dispatch({
            type:"indexPage/get_logo",
            payload:{
                url:window.location.protocol+"//"+ window.location.hostname
            }
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.rememberPassword) {
                    localStorage.setItem(values.userNm.replace(/(^\s*)|(\s*$)/g, ""), values.password)
                } else {
                    localStorage.removeItem(values.userNm)
                }
                sessionStorage.setItem("userNm", values.userNm.replace(/(^\s*)|(\s*$)/g, ""));
                this.props.dispatch({
                    type: "indexPage/login",
                    payload: {
                        username: values.userNm.replace(/(^\s*)|(\s*$)/g, ""),
                        password: _crypto(values.password),
                        captcha_code: values.captcha
                    }
                }).then(()=>{
                    if(sessionStorage.getItem("role")==="company"||sessionStorage.getItem("role")==="companystaff") {
                        this.props.dispatch({
                            type: "layoutInfo/get_logo",
                            payload: {
                                company_id: sessionStorage.getItem("companyId")
                            }
                        })
                    }
                });
            }
        })
    };

    userNmOnBlur = () => {
        let userNm = this.props.form.getFieldValue("userNm");
        userNm = userNm ? userNm.replace(/(^\s*)|(\s*$)/g, "") : "";
        let password = localStorage.getItem(userNm);
        if (password) {
            this.props.form.setFieldsValue({
                password: localStorage.getItem(userNm),
                rememberPassword: true,
            })
        }
    };

    handleForgetPassword = () => {
        this.props.form.setFieldsValue({
            rememberPassword: false
        });
        this.props.history.push("/rememberPwd")

    };

    reloadCaptcha=()=>{
        this.props.dispatch({
            type:"indexPage/reloadCaptcha",
            payload:{}
        })
    };

    handleSelectLanguage = (value) => {
        window.location.href = domain + '/index.' + value + '.html#' + this.props.location.pathname + this.props.location.search
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const inEnglish=window.appLocale.locale==="en-US";
        return (
            <div className="loginMainContainer" >
                <header className="headerContainer">
                    <div>
                        {this.props.indexPage.logo_url?<img src={this.props.indexPage.logo_url==="default"?logo:domain+this.props.indexPage.logo_url} alt="" className="logo" style={{marginTop: 10, marginLeft: 8,width:118,height:40}}/>:""}
                        {/*<span className="back" style={{marginRight: 8}}><a
                            href="https://www.globalsdn.com/">{"@返回官网"}</a></span>*/}
                        <div style={{display:"inline-block",float:"right"}}>
                            <IconFont type="icon-diqiu1" style={{fontSize:24,marginRight: 8,marginTop: 20,}}/>
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
                <div >
                    <Card className="loginContainer" >
                        <div className="title" style={inEnglish?{fontSize:20}:{}}>{"@SD-WAN综合管理平台"}</div>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem className="FormItem">
                                {getFieldDecorator('userNm', {
                                    rules: [{required: true, message: '@请输入用户名',}],
                                })(
                                    <Input size="large" placeholder={"@请输入用户名"} className="input"
                                           onBlur={this.userNmOnBlur}/>
              
                                           )
                                }
                            </FormItem>
                            <FormItem className="FormItem">
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '@请输入密码',}],
                                })(
                                    <Input size="large" placeholder={"@请输入密码"} className="input" type="password"/>
                                )
                                }
                            </FormItem>
                            {this.props.indexPage.ifCaptchaShow?<FormItem className="FormItem">
                                {getFieldDecorator('captcha', {
                                    rules: [{required: true, message: '@请输入验证码',}],
                                })(
                                    <Input size="large" style={{width: 120}} placeholder={"@请输入验证码"} className="input"/>
                                )
                                }
                                <img src={this.props.indexPage.captchaUrl} alt="" style={{width:100,height:40,marginLeft:48}}/>
                                <Icon type="reload" style={{fontSize:16,marginLeft:8}} onClick={this.reloadCaptcha}/>
                            </FormItem>:""}
                            <FormItem>
                                {getFieldDecorator('rememberPassword', {
                                    valuePropName: 'checked',
                                    initialValue: false,
                                })(
                                    <Checkbox>{"@记住密码"}</Checkbox>
                                )
                                }
                                <span style={{marginLeft: inEnglish?5:140, color: "#1990ff"}}
                                      onClick={this.handleForgetPassword}>{"@忘记密码"}</span>
                            </FormItem>
                            <Button type="primary" htmlType="submit" className="confirmBtn"><span
                                style={{color: "#fff"}}>{"@登录"}</span></Button>
                            {/*<div style={{textAlign: "center", marginTop: 8}}>
                                <span>© 2018 {"@极致互联"} | {"@浙ICP备17059766号"}</span>
                            </div>*/}
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

export default withRouter(injectIntl(IndexPage));