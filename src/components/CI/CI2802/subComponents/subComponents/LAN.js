/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Row, Form, Modal, Col,Table,} from 'antd';
import LAN2 from "../../../../../assets/img/LAN2.png";
import noWan from '../../../../../assets/img/noWan.png';

import {injectIntl} from "react-intl";
import {commonTranslate} from "../../../../../utils/commonUtilFunc";
const FormItem = Form.Item;

class LAN extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalShow:false,
            selectedRowKeys:[],
            record:{},
            editId:"",
            visible:false,
            DHCPvisible:false
        }
    }

    componentDidMount =()=>{
        //this.props.onRef(this)
        this.get_cta_lan()
    }
    get_cta_lan=()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_lan",
            payload: {
                cta_id:this.props.id
            }
        });
    }
    DHCPcancel=()=>{
        this.setState({
            DHCPvisible:false
        })
    }
    DHCPSubmit=()=>{
        this.setState({
            DHCPvisible:false
        })
    }
    gotoDHCP=(item)=>{
        this.setState({
            DHCPvisible:true,
            record:item
        })
    }
    gotoARP=(item)=>{
        this.props.dispatch({
            type:"ci2802Info/get_cta_static_ip",
            payload:{
                net_id:item.cta_id,
                cta_lan_id:item.id
            }
        }).then(()=>{
            this.setState({
                visible:true
            })
        })
    }
    cancel=()=>{
        this.setState({
            visible:false
        })
    }
    Submit=()=>{
        this.setState({
            visible:false
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const Columns = [
            {
                title: "静态IP",
                dataIndex: 'ip',
                key: 'ip',
            },
            {
                title: "Mac",
                dataIndex: 'mac_address',
                key: 'mac_address',
            }];

        return <div className="CheckWAN"> 
            <p className="p">LAN口配置</p>
            {this.props.ci2802Info.dataLan.length > 0 ?this.props.ci2802Info.dataLan.map((item)=>{
                return <Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                        <Col span={6} style={{position:"relative"}}>
                            <div style={{position:"absolute",top:"30px",left:"4%"}}>
                            <img src={LAN2} alt=""/>
                            <div style={{float:"right",width:"60px",height:"35px",paddingLeft:5}}><span >{item.name}</span><span className="ci2802span" style={{display:"block"}}>{item.physical_port.join(",")}</span></div>
                            </div>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">SSID：</span><span>{item.ssid}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">IP地址：</span><span>{item.ip}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">子网掩码：</span><span>{item.net_mask}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">访问互联网：</span><span>{item.internet_strategy==="allowed"?"开启":"关闭"}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">DHCP：</span><span onClick={()=>this.gotoDHCP(item)} className='common-link-icon'>配置详情</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">ARP静态绑定：</span><span onClick={() => this.gotoARP(item)} className='common-link-icon'>静态IP</span></Row>
                        </Col>
                        <Modal width="483px" maskClosable={false} visible={this.state.visible} title="ARP静态绑定"
                            onCancel={this.cancel} onOk={this.Submit} destroyOnClose >
                            <Table bordered size="middle" rowKey={record => record.id} pagination={false}
                             columns={Columns} dataSource={this.props.ci2802Info.ctaStatic}/>
                        </Modal>
                        <Modal width="483px" maskClosable={false} visible={this.state.DHCPvisible} title="DHCP详情"
                            onCancel={this.DHCPcancel} onOk={this.DHCPSubmit} destroyOnClose >
                        <Form layout="horizontal"  >
                                <FormItem  label="IP池"  labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_ip_pool', {
                                    })(
                                        <text>{this.state.record.dhcp_ip_pool}</text>
                                    )}
                                </FormItem>
                                <FormItem label="租期(h)" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_lease_time', {
                                    })(
                                        <text>{this.state.record.dhcp_lease_time}</text>
                                    )}
                                </FormItem>                                
                                <FormItem  label="子网掩码" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('net_mask', {
                                    })(
                                        <text>{this.state.record.net_mask}</text>
                                    )}
                                </FormItem>
                                <FormItem label="网关" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_gateway', {
                                    })(
                                        <text>{this.state.record.dhcp_gateway}</text>
                                    )}
                                </FormItem>                                
                                <FormItem  label="首选DNS" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_dns', {
                                    })(
                                        <text>{this.state.record.dhcp_dns}</text>
                                    )}
                                </FormItem>
                                <FormItem label="备用DNS" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_dns_backup', {
                                    })(
                                        <text>{this.state.record.dhcp_dns_backup}</text>
                                    )}
                                </FormItem>
                        </Form>
                        </Modal>
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

export default connect(mapDispatchToProps)(Form.create()(injectIntl(LAN)));