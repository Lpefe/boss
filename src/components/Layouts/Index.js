/*@通用页面-页面框架*/
/**********基础组件***********/
import React from 'react';
import {Route, Switch,} from 'dva/router';
import {Avatar, Breadcrumb, Button, Col, Dropdown, Form, Icon, Input, Layout, Menu, Modal, Row} from 'antd';
import {Link, withRouter} from 'react-router-dom';

import 'moment/locale/zh-cn'; //日期国际化
import {menuDict} from './Menu/menuData';
import AvatarCustomer from 'react-avatar';
import {injectIntl} from 'react-intl';
import mMessages from './locales/menuMessages';
/**********自有组件***********/
import MenuBar from './Menu/MenuBar';
/**********自有方法,assets***********/
import logoDark from '../../assets/img/logo.png';
import logoLight from '../../assets/img/logo-index.png';
import './index.scss';
import CI0301R from "../../routes/CI/CI0301R";
import CI0302R from "../../routes/CI/CI0302R";
import CI0401R from "../../routes/CI/CI0401R";
import CI0303R from "../../routes/CI/CI0303R";
import CI0304R from "../../routes/CI/CI0304R";
import CI0001R from "../../routes/CI/CI0001R";
import localeList from "../../locales/_localeList";
import {_crypto, localeMap} from '../../utils/commonUtilFunc';
import {domain, IconFont} from '../../utils/commonConsts';

/**********变量***********/
const {Sider, Content,} = Layout;
const FormItem = Form.Item;

class LayoutC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuInfo: [],
            userNm: '',
            changePasswordShow: false,
            firstLoginModalShow: false,
            collapsed: !(localStorage.getItem("collapse") === null || localStorage.getItem("collapse") === "false"),
            selectedLang: localeMap(window.appLocale.locale),
            theme: localStorage.getItem("theme"),
            confirmDirty: false,
        }
    }

    componentWillMount() {
        const ifLogin = sessionStorage.getItem("ifLogin");
        const userNm = sessionStorage.getItem("userNm");
        if (ifLogin === "false" || !ifLogin) {
            this.props.history.push("/")
        } else {
            this.setState({
                userNm: userNm
            })
        }
    }

    componentDidUpdate() {
        if (this.props.layoutInfo.ifChangedPwd) {
            const model = Modal.success({
                title: "@修改密码成功",
            });
            setTimeout(() => {
                model.destroy();
                this.props.history.push("/");
                this.props.layoutInfo.ifChangedPwd = false;
            }, 2000);
        }
        const firstLogin = sessionStorage.getItem("first_login");
        if (firstLogin === 'true') {
            this.setState({
                firstLoginModalShow: true
            },()=>{
                sessionStorage.setItem("first_login",'false');
            })
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff") {
            this.get_logo();
        }

        //登陆后首屏渲染
        const frontPage = ["/main/ci0801", "/main/bi0101", "/main/mi0001", "/main/pc0101"];
        if (frontPage.indexOf(this.props.location.pathname) > -1) {
            this.props.history.push(this.props.location.pathname)
        }


        this.props.dispatch({
            type: "layoutInfo/changeTheme"
        })
    }

    get_logo = () => {
        this.props.dispatch({
            type: "layoutInfo/get_logo",
            payload: {
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    quit = () => {
        sessionStorage.clear();
        this.props.dispatch({
            type: "layoutInfo/logout",
            payload: {}
        })
    };

    changePasswordModal = () => {
        this.setState({
            changePasswordShow: true,
        })
    };

    cancelChangePassword = () => {
        this.setState({
            changePasswordShow: false,
        })
    };

    handleCloseFirstLoginModal = () => {
        this.setState({
            firstLoginModalShow: false
        })
    };

    handleChangePassword = () => {
        this.setState({
            changePasswordShow: true,
            firstLoginModalShow: false
        })
    };

    update_password = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "layoutInfo/changepwd",
                    payload: {
                        newpassword: _crypto(values.newpassword),
                        oldpassword: _crypto(values.oldpassword),
                    }
                })
            }
        })
    };
    /**
     * 根据后台menu数据获取path列表
     * */
    getPath = (menuInfo) => {
        let pathList = [];
        for (let key in menuInfo) {
            if (menuInfo[key].path) {
                pathList.push(menuInfo[key].path);
            }
            if (menuInfo[key].sub) {
                let subPathList = this.getPath(menuInfo[key].sub);
                pathList = pathList.concat(subPathList);
            }
        }
        return pathList;
    };

    handleSelectLanguage = (value, label) => {
        this.setState({
            selectedLang: label
        }, () => {
            window.location.href = domain + '/index.' + value + '.html#' + this.props.location.pathname + this.props.location.search
        })
    };

    setCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        }, () => {
            localStorage.setItem("collapse", this.state.collapsed)
        })
    };

    selectTheme = () => {
        this.setState({
            theme: this.state.theme === "light" || this.state.theme === null ? "dark" : "light"
        }, () => {
            localStorage.setItem("theme", this.state.theme);
            this.props.dispatch({
                type: "layoutInfo/changeTheme"
            })
        });

    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newpassword')) {
            callback('@两次密码不一致');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirmPassword'], { force: true });
        }
        callback();
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    render() {
        const __ = this.props.intl.formatMessage;
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };

        /**
         * 布局面包屑组件名称
         * */

        const {location} = this.props;
        const pathSnippets = location.pathname.split('/').filter(i => i);
        const extraBreadcrumbItems = <Breadcrumb.Item key={pathSnippets[1]}>
            <Link to={"/main/" + pathSnippets[1]} key={menuDict[pathSnippets[1]]}>
                {menuDict[pathSnippets[1]] ? (menuDict[pathSnippets[1]].name === "@首页" && pathSnippets[1] === "ci0801" ? "" : __(mMessages[menuDict[pathSnippets[1]].name])) : ""}
            </Link>
        </Breadcrumb.Item>;
        const breadcrumbItems = [(
            <Breadcrumb.Item key="home">
                {(sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff") ?
                    <Link to={"/main/ci0801"}>
                        {"@首页"}
                    </Link> : ""}
            </Breadcrumb.Item>
        )].concat(extraBreadcrumbItems);

        /**
         * 通过对比后台传的menu数据,控制路由渲染
         * */
        const menuInfo = JSON.parse(sessionStorage.getItem("menuInfo"));

        let menuList = this.getPath(menuInfo);
        let Routes = [];
        for (let key in menuDict) {
            if (menuList.indexOf(key) > -1) {
                Routes.push(<Route exact path={"/main/" + key} component={menuDict[key].component} key={key}/>)
                if (menuDict[key].sub) {
                    for (let i = 0; i < menuDict[key].sub.length; i++) {
                        Routes.push(<Route exact path={"/main" + menuDict[key].sub[i].path}
                                           component={menuDict[key].sub[i].component} key={menuDict[key].sub[i].path}/>)
                    }
                }
            }
        }
        if (sessionStorage.getItem("role") === 'supercxpbusiness' || sessionStorage.getItem("role") === 'supercxptechnology' || sessionStorage.getItem("role") === 'supercxptechsupport' || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin") {
            Routes.push(<Route exact path={"/main/ci0301"} component={CI0301R} key="ci0301"/>);
            Routes.push(<Route exact path={"/main/ci0302"} component={CI0302R} key="ci0302"/>);
            Routes.push(<Route exact path={"/main/ci0303"} component={CI0303R} key="ci0303"/>);
            Routes.push(<Route exact path={"/main/ci0303/ci0304"} component={CI0304R} key="ci0304"/>);
            Routes.push(<Route exact path={"/main/ci0401"} component={CI0401R} key="ci0401"/>);
        }
        if(sessionStorage.getItem("role") === 'company'||sessionStorage.getItem("role") === 'companystaff'){
            Routes.push(<Route exact path={"/main/ci0001"} component={CI0001R} key="ci0001"/>);
        }


        let role = this.props.indexPage.role || sessionStorage.getItem("roleName");
        let roleColor = this.props.indexPage.roleColor || sessionStorage.getItem("roleColor");
        let userNm = this.state.userNm;
        const roleMap={
            "企业管理员":"@企业管理员",
            "普通用户":"@普通用户",
            "商务":"@商务",
            "运维":"@运维",
            "技术支持":"@技术支持",
            "商务主管":"@商务主管",
            "账号管理员":"@账号管理员",
            "技术支持主管":"@技术支持主管",
        };
        const userInfoMenu = (
            <Menu style={{
                width: 306,
                marginTop: 1,
                padding: "0px",
                borderTop: this.state.theme === "dark" ? "3px solid #4C81E1" : ""
            }} theme={this.state.theme}>
                <Menu.Item style={{
                    height: 80,
                    backgroundColor: this.state.theme === "dark" ? "rgba(0,21,42,0.65)" : "#F6F7FB"
                }}>
                    <Row>
                        <Col span={6}>
                            <div style={{textAlign: "center", height: 64, marginTop: 5}}>
                                <AvatarCustomer size={62} round={true}
                                                textSizeRatio={6}
                                                color={roleColor}
                                                name={roleMap[role]}/>
                            </div>
                        </Col>
                        <Col span={18} style={{paddingTop: 8}}>
                            <div style={{
                                textAlign: "left",
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginTop: 5,
                                marginLeft: 5,
                                color: this.state.theme === "dark" ? "#fff" : "rgb(0,0,0)",
                            }}>{userNm}</div>
                            <div style={{
                                marginLeft: 5,
                                marginTop: 5,
                                textAlign: "left",
                                fontSize: 14,
                                fontWeight: 'regular',
                                color: this.state.theme === "dark" ? "#fff" : "rgb(153,153,153)",
                            }}>
                                {/*{companyNm === "极致" ? "极致互联" : companyNm}-*/}{roleMap[role]}
                            </div>
                        </Col>
                    </Row>
                </Menu.Item>
                <Menu.Item style={{height: 45}}>
                    <Row size="small" onClick={this.changePasswordModal} style={{
                        color: this.state.theme === "dark" ? "#fff" : "rgb(144,144,144)",
                        fontFamily: "PingFangSC-Regular",
                        fontWeight: "normal",
                        marginLeft: 8,
                        lineHeight: "35px",
                    }}>
                        <IconFont type="icon-mima" theme="outlined"/>&nbsp;&nbsp;
                        {"@修改密码"}
                    </Row>

                </Menu.Item>
               {sessionStorage.getItem("role") === 'company'||sessionStorage.getItem("role") === 'companystaff'?<Menu.Item style={{height: 45,borderBottom:"1px solid rgba(0,0,0,0.1)"}}>
                    <Link to={{
                    pathname: "/main/ci0001",
                }} style={{
                        color: this.state.theme === "dark" ? "#fff" : "rgb(144,144,144)",
                        fontWeight: "normal",
                        lineHeight: "35px",
                    }}>
                        <Row size="large"  style={{padding: 0,}}>
                        <Icon type="appstore" style={{marginLeft: 8}}/>&nbsp;&nbsp;
                        {"@客户端下载"}
                        </Row>
                    </Link>
                </Menu.Item>:""}
                <Menu.Item style={{height: 45}}>
                    <Link to="/" style={{
                        color: this.state.theme === "dark" ? "#fff" : "rgb(144,144,144)",
                        fontWeight: "normal",
                        lineHeight: "35px",
                    }}>
                        <Row size="large" onClick={this.quit} style={{padding: 0}}>
                            <IconFont type="icon-tuichu5"
                                      theme="outlined" style={{marginLeft: 8}}/>
                            &nbsp;&nbsp;{"@登出"}

                        </Row>
                    </Link>
                </Menu.Item>
            </Menu>
        );

        const languageMenu = <Menu theme={this.state.theme}
                                   style={{borderTop: this.state.theme === "dark" ? "3px solid #4C81E1" : ""}}>
            {localeList.map((lang) => {
                return <Menu.Item key={lang.name}
                                  onClick={() => this.handleSelectLanguage(lang.name, lang.label)}>{lang.label}</Menu.Item>
            })}
        </Menu>;

        return (
            <div className="mainContainer">
                <header className={this.state.theme === "dark" ? "headerContainer-dark" : "headerContainer-light"}
                        id="main-header">
                    <div style={{height: 50}}>
                        <div className="header-left">
                            <div style={{
                                width: 56,
                                cursor: "pointer",
                                display: "inline-block",
                                marginRight: 8,
                                verticalAlign: "16%"
                            }} onClick={this.setCollapse}
                            >
                                <Icon className="icon" type={this.state.collapsed ? "menu-unfold" : "menu-fold"}/>
                            </div>
                            {sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff" ?
                                <img
                                    src={this.props.layoutInfo.logo_url === "default" ? (this.state.theme === "dark" ? logoDark : logoLight) : domain + this.props.layoutInfo.logo_url + "&temp=" + Math.random().toString()}
                                    alt=""
                                    className="logo"/> :
                                this.state.theme === "dark" ? <img src="../pic/logo-dark.png" alt=""/> : <img src="../pic/logo-white.png" alt=""/>}

                        </div>
                        <div className="header-widget">
                            <Dropdown overlay={userInfoMenu} placement="bottomCenter">
                                        <span style={{marginRight: 16}} className="title">
                                            <Avatar size="default" style={{
                                                marginRight: 8,
                                                backgroundColor: roleColor
                                            }} color={roleColor}>{role}</Avatar>
                                            @你好
                                            ,{userNm}
                                            </span>
                            </Dropdown>
                        </div>
                        <div className="header-widget">
                            <IconFont type="icon-diqiu1" className="icon"/>
                            <Dropdown overlay={languageMenu} placement="bottomCenter">
                                        <span className="title">
                                            {this.state.selectedLang}
                                            </span>
                            </Dropdown>
                        </div>
                        <div className="header-widget" onClick={this.selectTheme}>
                            <IconFont type="icon-yifu" className="icon"/>
                            <span className="title">{this.state.theme === "dark" ? "@深色" : "@浅色"}</span>
                        </div>
                    </div>
                </header>
                {this.state.theme !== "dark" ? <div className="dash"/> : ""}
                <Layout className="contentContainer" style={{backgroundColor: "#fff"}} id="main-content">
                    <Sider className="sider" collapsed={this.state.collapsed} trigger={null} collapsedWidth={56}>
                        <MenuBar menuInfo={this.state.menuInfo} collapsed={this.state.collapsed}
                                 theme={this.state.theme}/>
                    </Sider>
                    <Layout style={{backgroundColor: "#f0f2f5"}}>
                        <Content className="route-view"
                                 style={{paddingRight: this.props.location.pathname === "/main/pc0101" ? 0 : 24}}>
                            {this.props.location.pathname === "/main/ci0801" || this.props.location.pathname === "/main/pc0101" ? "" :
                                <div className="breadCrumbBar">
                                    <Breadcrumb separator=">">
                                        {breadcrumbItems}
                                    </Breadcrumb>
                                </div>}
                            <div>
                                <Switch>
                                    {Routes}
                                </Switch>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
                <Modal maskClosable={false} title="@修改密码"
                       visible={this.state.changePasswordShow}
                       onCancel={this.cancelChangePassword} onOk={this.update_password}>
                    <Form>
                        <FormItem label="@原密码" {...modalFormLayout}>
                            {getFieldDecorator('oldpassword', {
                                rules: [{
                                    required: true,
                                    message: "@请输入原密码"
                                },],
                            })(
                                <Input autocomplete="false" type='password' placeholder="@请输入原密码"/>
                            )}
                        </FormItem>
                        <FormItem label="@新密码" {...modalFormLayout}>
                            {getFieldDecorator('newpassword', {
                                rules: [{
                                    required: true,
                                    message:"@请输入新密码"
                                },{
                                    validator: this.validateToNextPassword
                                }],
                            })(
                                <Input autocomplete="false" type='password' placeholder="@请输入新密码"/>
                            )}
                        </FormItem>
                        <FormItem label="@确认密码" {...modalFormLayout}>
                            {getFieldDecorator('confirmPassword', {
                                rules: [{
                                    required: true,
                                    message: "@请确认密码"
                                }, {
                                    validator: this.compareToFirstPassword
                                }],
                            })(
                                <Input autocomplete="false" onBlur={this.handleConfirmBlur} type='password' placeholder="@请确认密码"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                <Modal footer={null} maskClosable={false} visible={this.state.firstLoginModalShow}
                       onCancel={this.handleCloseFirstLoginModal}>
                    <div className="first-login-modal-title">{"@为了您的账户安全，请及时修改登录密码"}</div>
                    <div className="first-login-modal-btn">
                        <Button type="primary" onClick={this.handleChangePassword}>{"@前往修改密码"}</Button>
                    </div>
                    <div className="first-login-modal-return"
                         onClick={this.handleCloseFirstLoginModal}>{"@返回管理页面"}
                    </div>
                </Modal>
            </div>
        )
    }
}

export default injectIntl(withRouter(LayoutC));