/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Form} from 'antd';
import {injectIntl} from "react-intl";
import WAN from "./subComponents/WAN";
import LAN from "./subComponents/LAN";
import Domain from "./subComponents/Domain";
import Router from "./subComponents/Router";
import WIFI from "./subComponents/WIFI";



class Check extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuId:0,
            click:false,
            menu:["WAN","LAN","Wi-Fi","@静态路由","DNS"]
        }
    }

    componentDidMount=()=>{
        this.get_physical_ports_info()
    }
    menu = ()=>{
        switch (parseInt(this.state.menuId) ) {
            case 0:
                return <WAN id={this.props.id} vm={this}/>
            case 1:
                return <LAN id={this.props.id} vm={this}/>        
            case 2:
                return <WIFI id={this.props.id} vm={this}/>
            case 3:
                return <Router id={this.props.id} vm={this}/> 
            case 4:
                return <Domain id={this.props.id} vm={this}/>
            default:
                return ""
        }
    }
    get_physical_ports_info=()=>{
        this.props.dispatch({
            type: "ci2802Info/get_physical_ports_info",
            payload: {
                cta_id:this.props.id
            }
        });
    }
    change=()=>{
        this.props.vm.change(false)
    };
    Click = (e) => {
                let index = e.target.getAttribute('data-index'); 

                this.setState({menuId: index},function(){this.menu()})
            }
    render() {
        return <div style={{position:"relative"}}>
            {/* <Button style={{top:20,right:0,position:"absolute"}} type="primary" onClick={()=>{this.change()}}>修改配置</Button> */}
            <ul className="CheckMenu" style={{marginBottom:"20px"}}>
                {this.state.menu.map((item, i) => (
                    <li key={i} className={parseInt(this.state.menuId) ===i ?"button Active":"button"}><span onClick={this.Click} data-index={i} className={parseInt(this.state.menuId) ===i ? "name nameActive ":"name"}>{item}</span></li>
                ))}
            </ul>
            {this.menu()}
        </div>
    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Check)));