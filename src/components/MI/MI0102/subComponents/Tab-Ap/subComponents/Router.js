import React from 'react';
import {connect} from 'dva';
import {Row, Form, Select, Input, Card,Col,Table,Upload,Button} from 'antd';
import messages from '../../LocaleMsg/messages';
import {injectIntl} from "react-intl";
import {commonTranslate} from "../../../../../utils/commonUtilFunc";

class Router extends React.Component {
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
        this.get_cta_static_route()
    }  
    get_cta_static_route =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_static_route",
            payload: {
                cta_id:this.props.id
            }
        });
    }
    render() {
        const __=commonTranslate(this);


        return <div className="CheckWAN"> 
            <p>静态路由</p>
            {this.props.ci2802Info.routeList.map((item)=>{
                return <Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                        <Col span={6} style={{position:"relative"}}>
                            <div style={{position:"absolute",top:"0",left:"30%"}}>
                            <div  style={{float:"right",width:"60px",height:"35px"}}><span id="ssid">{item.ipset}</span></div>
                            </div>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">IP段：</span><span>{item.ipset}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">下一跳：</span><span>{item.gateway}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">跃点数：</span><span>{item.metric}</span></Row>
                        </Col>
                </Row>

            })}
        </div>
                    

    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Router)));