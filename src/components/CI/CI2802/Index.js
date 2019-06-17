/*@客户-配置管理*/
import React from 'react';
import {Button, Card, Col, Form, Icon, Input, Modal, Row} from 'antd';
import {parse} from '../../../utils/commonUtilFunc';

import Access from "./subComponents/Access";
import Lan from "./subComponents/Lan";
import Wan from "./subComponents/Wan";
import DNS from "./subComponents/DNS";
import G4 from "./subComponents/G4";
import Check from "./subComponents/Check";
import Router from "./subComponents/Router";
import WIFI from "./subComponents/WIFI";
import FirewallWan from "./subComponents/Firewall";
import WAN from "../../../assets/img/WAN2.png";
import NONE from "../../../assets/img/NONE.png";
import LAN from "../../../assets/img/LAN2.png";
import pc from "../../../assets/img/pc.png";
import internet from "../../../assets/img/internet.png";
import {injectIntl} from "react-intl";
import {connect} from 'dva';
import './index.scss';

const FormItem = Form.Item;


class CI2802 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id ? this.props.id : parse(this.props.location.search).id,
            agency_id: this.props.agency_id ? this.props.agency_id : parse(this.props.location.search).agency_id,
            menuId: 0,
            // menu:["WAN","LAN","Wi-Fi","4G","静态路由","防火墙","DNS","私网IP"],
            menu: ["WAN", "LAN", "Wi-Fi", "4G", "@静态路由", "@防火墙", "DNS"],
            Check: false,
            header: true,
            uploadModalShow: false,
        };
        this.ref = {};
    }

    componentDidMount() {
        this.get_cpe_template_agency()
        this.get_physical_ports_info()
        this.setState({
            Check: this.props.Check,
            header: this.props.header === undefined ? true : this.props.header,
        })
    }

    onRef = (vm) => {
        this.ref = vm;
    };
    change = (value) => {
        this.setState({
            Check: value
        })
    }
    get_cpe_template_agency = () => {
        this.props.dispatch({
            type: "ci2802Info/get_cpe_template_agency",
            payload: {
                id: this.state.id
            }
        });
    }
    handelUploadModalShow = () => {
        this.setState({
            uploadModalShow: true
        })
    };
    handelUploadModalClose = () => {
        this.setState({
            uploadModalShow: false
        })
    };

    get_physical_ports_info = () => {
        this.props.dispatch({
            type: "ci2802Info/get_physical_ports_info",
            payload: {
                cta_id: this.state.id
            }
        });
    }
    Submit = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let value = this.props.form.getFieldsValue();
                this.props.dispatch({
                    type: "ci2802Info/update_cpe_template_agency",
                    payload: {
                        id: this.state.id,
                        name: value.name,
                    }
                });

            }
        })
    };
    menu = () => {
        switch (parseInt(this.state.menuId)) {
            // case 0:
            //     return <Access cta_id={this.state.id} vm={this}/>
            case 0:
                return <Wan cta_id={this.state.id} vm={this}/>
            case 1:
                return <Lan cta_id={this.state.id} vm={this}/>
            case 2:
                return <WIFI wifi_no={this.props.ci2802Info.cpeTemplate[0].wifi_no} cta_id={this.state.id} vm={this}/>

            case 3:
                return <G4 on={this.props.ci2802Info.cpeTemplate[0].lte} cta_id={this.state.id} vm={this}/>
            case 4:
                return <Router cta_id={this.state.id} vm={this}/>
            // case 6:
            //     return <NAT cta_id={this.state.id} vm={this}/>
            case 5:
                return <FirewallWan cta_id={this.state.id} vm={this}/>
            case 6:
                return <DNS cta_id={this.state.id} vm={this}/>
            // case 7:
            //     return <IP cta_id={this.state.id} agency_id={this.state.agency_id} vm={this}/> 
            default:
                return ""
        }
    };
    Click = (e) => {
        let index = e.target.getAttribute('data-index');
        this.setState({
            menuId: index
        }, () => {
            this.menu()
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const inEnglish = window.appLocale.locale === "en-US";
        return (
            <div>
                <Modal maskClosable={false} title={<span>{"@接入模式修改"}</span>}
                       onCancel={this.handelUploadModalClose}
                       destroyOnClose
                       onOk={this.ref.Submit}
                       visible={this.state.uploadModalShow} width="710px">
                    <Access onRef={this.onRef} cta_id={this.state.id} vm={this}/>
                </Modal>
                <Card className="card">
                    {this.state.header ? <Row gutter={16} className="ci2802buttonLine">
                        {/* <div className="ci2802AgencyName">节点名称：{this.props.ci2802Info.cpeTemplate[0]?this.props.ci2802Info.cpeTemplate[0].agency_name:""}</div> */}
                        <Form layout="inline" style={{marginTop: "20px", float: "left"}}>
                            <FormItem label="@节点名称" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                {getFieldDecorator('client', {
                                    initialValue: this.props.ci2802Info.cpeTemplate[0] ? this.props.ci2802Info.cpeTemplate[0].agency_name : ""
                                })(
                                    <span style={{
                                        display: "inline-block",
                                        width: "200px",
                                        fontSize: "15px"
                                    }}>{this.props.ci2802Info.cpeTemplate[0] ? this.props.ci2802Info.cpeTemplate[0].agency_name : ""}</span>
                                )}
                            </FormItem>
                            <FormItem label="@配置名称" labelCol={{span: 11,}} wrapperCol={{span: 13,}}>
                                {getFieldDecorator('name', {
                                    initialValue: this.props.ci2802Info.cpeTemplate[0] ? this.props.ci2802Info.cpeTemplate[0].name : ""
                                })(
                                    <Input placeholder="@配置名称"/>
                                )}
                            </FormItem>
                        </Form>
                        <Button style={{float: "right", marginTop: "23px"}} type="primary" onClick={() => {
                            this.Submit()
                        }}>@保存</Button>

                    </Row> : ""}
                    <Row gutter={64} style={{marginTop: 20}}>
                        <Col span={6} style={{borderRight: "1px solid rgba(0,0,0,0.1)"}}>
                            <p className="ci2802model">{this.props.ci2802Info.cpeTemplate[0] ? this.props.ci2802Info.cpeTemplate[0].model : ""}</p>
                            <Row>
                                <span
                                    className={inEnglish?"ci2802EnSpan1":"ci2802span1"}>@接入模式：</span><span>{this.props.ci2802Info.cpeTemplate[0] ? (this.props.ci2802Info.cpeTemplate[0].in_type === "bypass" ? "@旁路" : "@路由") : ""}</span>
                                {sessionStorage.getItem("role") === "supercxptechnology" ? "" :
                                    <Icon style={{marginLeft: 10}} type="edit" onClick={() => {
                                        this.handelUploadModalShow()
                                    }}/>}
                            </Row>
                            {this.props.ci2802Info.cpeTemplate[0] ? this.props.ci2802Info.cpeTemplate[0].wifi_no === 0 ? "" :
                                <Row><span className={inEnglish?"ci2802EnSpan1":"ci2802span1"} style={{float: "left"}}>Wi-Fi:</span>
                                    <div
                                        style={{marginLeft: "70px"}}>{this.props.ci2802Info.cpeTemplate[0] ? this.props.ci2802Info.cpeTemplate[0].wifi.map((item) => {
                                        return <Col key={item} style={{margin: "0"}}>{item}</Col>
                                    }) : ""}</div>
                                </Row> : ""}
                            <Row><span
                                className={inEnglish?"ci2802EnSpan1":"ci2802span1"}>@4G信息:</span><span>{this.props.ci2802Info.cpeTemplate[0] ? (this.props.ci2802Info.cpeTemplate[0].lte ? (this.props.ci2802Info.cpeTemplate[0].lte === "ON" ? "@开启" : "@关闭") : "@无4G模块") : ""}</span></Row>
                            <Row><span
                                className={inEnglish?"ci2802EnSpan1":"ci2802span1"}>@防火墙:</span><span>{this.props.ci2802Info.cpeTemplate[0] ? (this.props.ci2802Info.cpeTemplate[0].firewall === "ON" ? "@开启" : "@关闭") : ""}</span></Row>
                        </Col>
                        <Col span={18}>
                            <p className="ci2802model">@端口信息</p>
                            <ul className="ci2802ul">
                                {this.props.ci2802Info.physical.map((item, i) => (
                                    <li key={i}>
                                        {item.port_type === "lan" ? (item.up_down === "up" ?
                                            <img src={pc} alt=""/> : "") : ""}
                                        {item.port_type === "wan" ? (item.up_down === "up" ?
                                            <img src={internet} alt=""/> : "") : ""}
                                        <div>
                                            {item.port_type === "wan" ? <img src={WAN} alt=""/> : ""}
                                            {item.port_type === "lan" ? <img src={LAN} alt=""/> : ""}
                                            {item.port_type === "empty" ? <img src={NONE} alt=""/> : ""}
                                            <div style={{paddingLeft: 5}}>{item.name === "" ? <p>@未使用</p> :
                                                <p>{item.name}</p>}<p>{item.port_name}</p></div>
                                        </div>
                                        {item.connect_type==="dhcp"?"IP：- -":(item.connect_type==="pppoe"?"IP：- -":(item.ip===""?"IP：- -":<section>IP：{item.ip}</section>))}
                                    </li>
                                ))}
                            </ul>

                        </Col>
                    </Row>

                </Card>

                {sessionStorage.getItem("role") === "supercxptechnology" ?
                    <Card><Check id={this.state.id} vm={this} key={this.state.id}/></Card> : ""}

                {sessionStorage.getItem("role") === "supercxptechnology" ? "" : <Card>
                    <div style={{position: "relative"}}>
                        {/* <Button style={{top:20,right:0,position:"absolute"}} type="primary" onClick={()=>{this.change()}}>修改配置</Button> */}
                        <ul className="CheckMenu" style={{marginBottom: "20px"}}>
                            {this.state.menu.map((item, i) => (
                                <li key={i} className={parseInt(this.state.menuId) === i ? "button Active" : "button"}>
                                    <span onClick={this.Click} data-index={i}
                                          className={parseInt(this.state.menuId) === i ? "name nameActive " : "name"}>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div style={{clear:"both"}}></div> 
                        {this.menu()}
                    </div>
                </Card>}
            </div>
        )
    }
}


function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(CI2802)));