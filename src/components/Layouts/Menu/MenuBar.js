import React from 'react';
import {Icon, Menu} from 'antd';
import {Link} from 'react-router-dom';
import {connect} from 'dva';
import {injectIntl} from 'react-intl';
import mMessages from '../locales/menuMessages';
import {commonTranslate} from "../../../utils/commonUtilFunc";

const SubMenu = Menu.SubMenu;

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        if (JSON.stringify(this.props.indexPage.menuInfo) !== "{}") {
            sessionStorage.setItem("menuInfo", JSON.stringify(this.props.indexPage.menuInfo));
            sessionStorage.setItem("role", this.props.indexPage.role);
            sessionStorage.setItem("companyNm", this.props.indexPage.companyNm)
        }
    }

    scrollToHead = () => {
        document.getElementById("main-header").scrollIntoView(true);
    };

    render() {
        const __ = commonTranslate(this);
        let menuItemList = [];
        const menuInfo = JSON.parse(sessionStorage.getItem("menuInfo"));
        for (let key in menuInfo) {
            if (menuInfo[key].sub) {
                let subs = menuInfo[key].sub;
                let subMenuItemList = [];
                for (let subKey in subs) {
                    subMenuItemList.push(<Menu.Item key={subs[subKey].id}><Link
                        to={"/main/" + subs[subKey].path}>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{__(mMessages[subs[subKey].name])}</span></Link></Menu.Item>)
                }
                menuItemList.push(<SubMenu key={"menu" + key} title={<span><Icon style={{fontSize: 16}}
                                                                                 type={menuInfo[key].icon}/><span>{__(mMessages[menuInfo[key].name])}</span></span>}>{subMenuItemList}</SubMenu>)
            } else {
                menuItemList.push(<Menu.Item key={menuInfo[key].id}><Link
                    to={"/main/" + menuInfo[key].path}><Icon style={{fontSize: 16}}
                                                             type={menuInfo[key].icon}/><span>{__(mMessages[menuInfo[key].name])}</span></Link></Menu.Item>)
            }
        }
        return (
            <Menu mode="inline" key="menu" style={{height: '100%'}} inlineIndent={24}
                  inlineCollapsed={this.props.collapsed} onClick={this.scrollToHead} theme={this.props.theme}>
                {menuItemList}
            </Menu>
        )
    }
}

function mapDispatchToProps({indexPage}) {
    return {indexPage};
}

export default connect(mapDispatchToProps)(injectIntl(MenuBar));