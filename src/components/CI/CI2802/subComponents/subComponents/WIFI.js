/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Row, Form, Select, Input, Card,Col,Table,Upload,Button} from 'antd';
import {injectIntl} from "react-intl";
import {commonTranslate} from "../../../../../utils/commonUtilFunc";
import noWan from '../../../../../assets/img/noWan.png';

class WIFI extends React.Component {
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
        this.get_cta_wifi()
    }

    get_cta_wifi=()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_wifi",
            payload: {
                cta_id:this.props.id
            }
        });
    }
    render() {
        return <div className="CheckWAN"> 
            <p className="p"> SSID</p>
            {this.props.ci2802Info.wifiList.length > 0 ?this.props.ci2802Info.wifiList.map((item)=>{
                return <Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                        <Col span={6} style={{position:"relative"}}>
                            <div style={{position:"absolute",top:"20px",left:"5%",width:"100%"}}>
                            <div  style={{float:"right",width:"100%",height:"35px"}}><span id="ssid">{item.ssid}</span></div>
                            </div>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@认证方式：</span><span>{item.encryption}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@密码：</span><span>{item.password}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@隐藏SSID：</span><span>{item.ssid_is_hidden?"@是":"@否"}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@网段名称：</span><span>{item.cta_lan_name}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@关联频段：</span><span>{item.band}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@信道：</span><span>{item.channel==="none"?"AUTO":item.channel}</span></Row>
                        </Col>
                </Row>

            }):<div style={{textAlign: "center"}}>
            <img src={noWan} alt="" style={{marginTop: 60}}/>
        </div>
        }
        </div>
                    

    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(WIFI)));