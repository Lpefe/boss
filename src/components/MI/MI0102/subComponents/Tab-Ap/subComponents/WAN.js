import React from 'react';
import {connect} from 'dva';
import {Row, Form,Col,} from 'antd';
import WAN2 from "../../../../../../assets/img/WAN2.png";

import {injectIntl} from "react-intl";


class WAN extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalShow:false,
            selectedRowKeys:[],
            editRecord:{},
            editId:""
        }
    }

    componentDidMount =()=>{
        //this.props.onRef(this)
        this.get_cta_wan()
    }
    get_cta_wan =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_wan",
            payload: {
                cta_id:this.props.id
            }
        });
    };
    render() {


        return <div className="CheckWAN"> 
            <p>@WAN口配置</p>
            {this.props.ci2802Info.dataWan.map((item)=>{
                return <Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                        <Col span={6} style={{position:"relative"}}>
                            <div style={{position:"absolute",top:"30px",left:"30%"}}>
                            <img src={WAN2} alt=""/>
                            <div style={{float:"right",width:"60px",height:"35px"}}><span >{item.name}</span><span className="ci2802span" style={{display:"block"}}>{item.physical_port}</span></div>
                            </div>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@线路类型：</span><span>{item.net_type}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@带宽：</span><span>{item.bandwidth}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@运营商：</span><span>{item.isp_name}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@连接方式：</span><span>{item.connect_type}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@账号：</span><span>{item.username}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@密码：</span><span>{item.password}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@IP地址：</span><span>{item.ip}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@子网掩码：</span><span>{item.net_mask}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@网关地址：</span><span>{item.gateway}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@DNS服务器：</span><span>{item.dns}</span><span>{item.dns_backup}</span></Row>
                        </Col>
                </Row>

            })}
        </div>
                    

    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(WAN)));