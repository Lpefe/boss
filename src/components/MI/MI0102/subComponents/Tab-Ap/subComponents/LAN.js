/*@运维-设备信息*/
import React from 'react';
import {connect} from 'dva';
import {Icon, Form,Table,Popconfirm,Row,Col,Modal,Button} from 'antd';

import messages from '../../../LocaleMsg/messages';
import {injectIntl} from "react-intl";
import noWan from '../../../../../../assets/img/noWan.png';
import Lan from "../../../../../CI/CI2802/subComponents/Lan"
import ARPModal from "./ARPModal"
import BossEditModal from "../../../../../Common/BossEditModal";
import {commonTranslate,validateIp} from "../../../../../../utils/commonUtilFunc";
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
            DHCPvisible:false,
            editRecord:{},
            DHCPRecord:{},
            DHCPid:"",
            ARPvisible:false,
            ARPRecord:{},
            ARPid:"",
            lanID:"",
        }
        this.isTechnology=sessionStorage.getItem("role") === "supercxptechnology" 
    }

    componentDidMount =()=>{
        //this.props.onRef(this)
        this.get_ap_lan()
        this.get_ap_template_agency()
    }

    get_ap_wifi=()=>{
        this.props.dispatch({
            type: "mi0102Info/get_ap_wifi",
            payload: {
                device_id:this.props.id
            }
        });
    }
    get_ap_template_agency=()=>{
         this.props.dispatch({
             type:"mi0102Info/get_ap_template_agency",
             payload:{
                device_id:this.props.id
             }
         })
     }


     
     handleOpenAdd=()=>{
         this.get_ap_wifi()
         this.setState({
             visible:true,
         }) 
     }

     get_static_ip=()=>{
         this.props.dispatch({
             type:"mi0102Info/get_ap_static_ip",
             payload:{
                 net_id:this.state.ARPid,
                 ap_lan_id:this.state.lanID
             }
         })
     }
     // search = (value) => {
     //     this.setState({
     //         selectName:value||""
     //     },function(){
     //        this.get_ap_lan()
     //     })
     // };
     edit = (record)=>{
         this.get_ap_wifi()
         this.setState({
             visible:true,
             editRecord: record,
             editId: record.id,
         })
     }
     closeAddModal=()=>{
         this.setState({
             visible:false,
             editRecord:{},
             editId: "",
             disabled:false,
         },function(){
             this.get_ap_lan()
         })
     }
     closeDHCPModal=()=>{
         this.setState({
             DHCPvisible:false,
             DHCPRecord:{},
             DHCPid:""
         },function(){
             this.get_ap_lan()
         })
     }
     closeARPModal=()=>{
         this.setState({
             ARPvisible:false,
             ARPPRecord:{},
             ARPid:""
         },function(){
             this.get_ap_lan()
         })
     }
     delete = (record) => {
         this.props.dispatch({
             type: "mi0102Info/delete_ap_lan",
             payload: {
                 ids: [record.id],record:[record],device_id:this.props.id,
             }
         })
     };
    get_ap_lan=()=>{
        this.props.dispatch({
            type: "mi0102Info/get_ap_lan",
            payload: {
                device_id:this.props.id
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
        this.isTechnology?this.setState({
            DHCPvisible:true,
            record:item
        }):         this.setState({
            DHCPvisible:true,
            DHCPRecord:item,
            DHCPid:item.id
        }) 
    }
    gotoARP=(item)=>{
        this.isTechnology?this.props.dispatch({
            type:"mi0102Info/get_ap_static_ip",
            payload:{
                //net_id:item.cta_id,
                ap_lan_id:item.id
            }
        }).then(()=>{
            this.setState({
                visible:true
            })
        }):this.setState({
            ARPvisible:true,
            ARPRecord:item,
            ARPid:item.device_id,
            lanID:item.id
        },function(){
            this.get_static_ip()
        }) 
    }
    onRef = (ignoreModalComponent) => {
        this.ignoreModalComponent = ignoreModalComponent;
    };
    isEqualIPAddress = (rule, value, callback)=>{
        let mask = this.state.DHCPRecord.net_mask
        let ip = this.state.DHCPRecord.ip
        this.props.dispatch({
            type: "mi0102Info/get_start_end_ip",
            payload: {
                ip:ip,
                net_mask:mask
            }
        }).then(()=>{
            let ipPool = this.props.mi0102Info.ipPool
            let that = this.ignoreModalComponent.props.form
            let addr = that.getFieldValue("dhcp_ip_pool")
            console.log(addr)
            console.log(ipPool)
            if (ipPool) {
                var arr = addr.split('-')
                var  regNum = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))-((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
                if (regNum.test(addr)) {
                    if(!arr[0] || !arr[1]|| !ipPool[0]||!ipPool[1]){
                        return false;
                    }
                    let addr1 = arr[0].split(".");
                    let addr2 = arr[1].split(".");
                    let ipPool1 = ipPool[0].split(".")
                    let ipPool2 = ipPool[1].split(".")
                    let ip = this.state.DHCPRecord.ip.split(".")
                    if(parseInt(addr1[0])<=parseInt(ip[0])&&(addr1[1])<=parseInt(ip[1])&&(addr1[2])<=parseInt(ip[2])&&(addr1[3])<=parseInt(ip[3])&&
                    parseInt(addr2[0])>=parseInt(ip[0])&& parseInt(addr2[1])>=parseInt(ip[1])&& parseInt(addr2[2])>=parseInt(ip[2])&& parseInt(addr2[3])>=parseInt(ip[3])){
                        return  callback('@IP的池范围不能包含网关地址')  
                    }else{
                      if(parseInt(addr1[0])>=parseInt(ipPool1[0])&&(addr1[1])>=parseInt(ipPool1[1])&&(addr1[2])>=parseInt(ipPool1[2])&&(addr1[3])>parseInt(ipPool1[3])&&
                      parseInt(addr2[0])<=parseInt(ipPool2[0])&& parseInt(addr2[1])<=parseInt(ipPool2[1])&& parseInt(addr2[2])<=parseInt(ipPool2[2])&& parseInt(addr2[3])<parseInt(ipPool2[3])){
                        if(parseInt(addr1[0])<=parseInt(addr2[0])&&parseInt(addr1[1])<=parseInt(addr2[1])&&parseInt(addr1[2])<=parseInt(addr2[2])&&parseInt(addr1[3])<parseInt(addr2[3])){
                            return callback();
                        }else{
                            return  callback('@IP池填写的范围前面的值应小于后面的值')                              
                        }
                      }else{
                        return  callback('@IP池范围'+this.props.mi0102Info.ipPool[0]+'-'+this.props.mi0102Info.ipPool[1])
                      }
                    }
                }else{
                    //return callback("IP池格式例如：192.168.1.1-192.168.1.30");
                    return  callback('@IP池范围'+this.props.mi0102Info.ipPool[0]+'-'+this.props.mi0102Info.ipPool[1])
                }
            }
        });
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
        const __=commonTranslate(this);
        const {getFieldDecorator} = this.props.form;
    
        const ModalOptions = {
            title:this.state.editId ? "@编辑" :"@新增",
            visible:this.state.visible,
            //:{name:this.props.mi0102Info.cpeTemplate}
            initialValues:this.state.editId ?this.state.editRecord:{name:this.props.mi0102Info.apTemplate,dhcp_is_active:true},
            // {name:this.props.mi0102Info.apTemplate[0].result},
            dispatch:this.props.dispatch,
            submitType:this.state.editId ?"mi0102Info/update_ap_lan":"mi0102Info/create_ap_lan",
            onCancel: this.closeAddModal,
            extraUpdatePayload: {device_id:this.props.id,id:this.state.editId},
            initPayload: {selectName:this.state.selectName},
            InputItems: [{
                type: "Input",
                labelName: "@网段名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入网段名称",
                    disabled:true
                },
                rules: [{required: true, message:"@请输入网段名称"},{max:16,message:"@网段名称最多输入16字符"}],                
            },
            {
                type: "Select",
                labelName: "@SSID名称",
                valName: "wifi_ids",
                nativeProps: {
                    placeholder:"@请选择SSID名称",mode:"multiple"
                },
                rules: [{required: false, message: "@请选择SSID名称"}],
                children:this.props.mi0102Info.wifiList.map((item)=>{
                    if (item) {
                        return {key: item.id, value: item.id, name: item.ssid}
                    }
                })
            },{
                type: "Input",
                labelName: "@IP地址",
                valName: "ip",
                nativeProps: {
                    placeholder: this.state.disabled?"":"@请输入IP地址",
                    disabled:this.state.disabled,
                },
                rules: [{required:true,message:"@请输入IP地址"},{
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确IP格式"
                },]
            },{
                type: "Input",
                labelName: "@掩码",
                valName: "net_mask",
                nativeProps: {
                    placeholder: this.state.disabled?"":"@请输入掩码",
                    disabled:this.state.disabled,
                },
                rules: [{required:true,message:"@请输入掩码"},{
                    pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/,
                    message: "@请输入正确掩码格式"
                },]
            }, {
                type: "Radio",
                labelName: "@DHCP服务",
                valName: "dhcp_is_active",
                nativeProps: {
                    placeholder: "@请选择DHCP服务"
                },
                rules: [{required: true, message: "@请选择DHCP服务"}],
                children: [{value: true, name: "@开启", key: "1"}, {value: false,name: "@关闭",key: "0"}],
            }
        ]
        }
        const ModalDHCPOptions = {
            title:"@DHCP设置",
            visible:this.state.DHCPvisible,
            initialValues:this.state.DHCPRecord,
            dispatch:this.props.dispatch,
            submitType:"mi0102Info/update_ap_lan",
            onCancel: this.closeDHCPModal,
            extraUpdatePayload: {id:this.state.DHCPid},
            initPayload: {selectName:this.state.selectName},
            InputItems: [{
                type: "Radio",
                labelName: "@DHCP服务",
                valName: "dhcp_is_active",
                nativeProps: {
                    placeholder: "@请选择DHCP"
                },
                rules: [{required: true, message: "@请选择DHCP"}],
                children: [{value: true, name: "@开启", key: "1"}, {value: false,name: "@关闭",key: "0"}],
            },{
                type: "Input",
                labelName: "@IP池",
                valName: "dhcp_ip_pool",
                nativeProps: {
                    placeholder: "@请输入IP池",
                    disabled:this.state.editId ?true:false
                },
                rules: [{required: true, message:"@请输入IP池"},{validator: this.isEqualIPAddress}],
            },{
                type: "Input",
                labelName: "@租期"+"(h)",
                valName: "dhcp_lease_time",
                nativeProps: {
                    placeholder: this.state.disabled?"":"@请输入租期",
                    disabled:this.state.disabled,
                },
                rules: [{required:true, message:"@请输入租期"},{pattern:/^([1-9]|[1-4][0-8])$/,message: "@租期配置范围为1-48h"}],
            },
            // {
            //     type: "Input",
            //     labelName: "@子网掩码",
            //     valName: "net_mask",
            //     nativeProps: {
            //         placeholder: this.state.disabled?"":"@请输入子网掩码",
            //         disabled:this.state.disabled,
            //     },
            //     rules: [{required:true, message:"@请输入子网掩码"},{
            //         pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/,
            //         message: "@请输入正确的子网掩码格式"
            //     }],
            // },
            {
                type: "Input",
                labelName: "@网关",
                valName: "dhcp_gateway",
                nativeProps: {
                    placeholder: this.state.disabled?"":"@请输入网关",
                    disabled:true,
                },
                rules: [{required:true, message:"@请输入网关"},{
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确的网关格式"
                }],
            },{
                type: "Input",
                labelName: "@首选DNS",
                valName: "dhcp_dns",
                nativeProps: {
                    placeholder: this.state.disabled?"":"@请输入首选DNS",
                    disabled:this.state.disabled,
                },
                rules: [{
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确的DNS格式"
                }],
            },{
                type: "Input",
                labelName: "@备用DNS",
                valName: "dhcp_dns_backup",
                nativeProps: {
                    placeholder: this.state.disabled?"":"@请输入备用DNS",
                    disabled:this.state.disabled,
                },
                rules: [{
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确的DNS格式"
                }],
            },{
                type: "Input",
                labelName: "@DHCP选项",
                valName: "dhcp_option",
                nativeProps: {
                    placeholder: this.state.disabled?"":"@请输入DHCP选项",
                    disabled:this.state.disabled,
                    extra:'@例如设定 "6,192.168.1.1,192.168.1.2"'
                }
            }
        ]
       
    }
        
        const columns = [{
            title: '@网段名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '@物理端口',
            dataIndex: 'physical_port',
            key: 'physical_port',
        },{
            title: '@SSID名称',
            dataIndex: 'wifi_ids',
            key: 'wifi_ids',
        },{
            title: '@IP地址',
            dataIndex: 'ip',
            key: 'ip',
        },{
            title: '@掩码',
            dataIndex: 'net_mask',
            key: 'net_mask',
    
        },{
            title: '@访问互联网',
            dataIndex: 'internet_strategy',
            key: 'internet_strategy',
            render: (index, record) => {
                switch (index) {
                    case "whitelist":
                        return "@白名单";
                    case "blacklist":
                        return "@黑名单";
                    case "allowed":
                        return "@允许";
                    case "disallowed":
                        return "@不允许";
                    default:
                        return ""
                }
            }
        },{
            title: 'DHCP',
            dataIndex: 'dhcp_is_active',
            key: 'dhcp_is_active',
            render: (index, record) => {
                return index?<span onClick={()=>this.gotoDHCP(record)} className='common-link-icon'>@DHCP设置</span>:"@关闭"
            }
        },{
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed:'right',
            width:100,
            render: (index, record) => {
                return (
                    <div style={{display:"inline-block"}}>
                        {/* <Operations 
                        hasCustom={true} customIcon={"copy"} messages={"确认复制模板？"} cunsom={() => this.coppy(record)}
                        hasEdit={true} edit={() => this.edit(record)}
                        hasDelete={true} delete={() => this.delete(record)}
                        /> */}
                        <span onClick={() => this.gotoARP(record)}  className='ci3301operations-delete-btn'>{"@ARP静态绑定"}</span>
                        <Icon type="edit" onClick={() => this.edit(record)} className="operations-edit-btn"/>
                        <Popconfirm title={"@确定删除当前信息?"} onConfirm={() => this.delete(record)}><Icon type="delete" style={{}} className="operations-delete-btn"/></Popconfirm> 
                    </div>
                )
            }
        },]
        const Columns = [
            {
                title: "@静态IP",
                dataIndex: 'ip',
                key: 'ip',
            },
            {
                title: "Mac",
                dataIndex: 'mac_address',
                key: 'mac_address',
            }];
        return <div className="CheckWAN"> 
            <p className="p">@LAN口配置</p>
        {this.isTechnology?"":<Button icon="file-add" style={{marginRight: 8,marginBottom:20}} onClick={()=>{this.handleOpenAdd()} }>{'@添加'}</Button> }
            {this.props.mi0102Info.dataLan.length > 0 ?this.props.mi0102Info.dataLan.map((item)=>{
                return <div>
                    {this.isTechnology?<Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                        <Col span={6} style={{position:"relative"}}>
                            <div style={{position:"absolute",top:"30px",left:"30%"}}>
                            <div style={{float:"right",width:"60px",height:"35px"}}><span >{item.name}</span><span className="ci2802span" style={{display:"block"}}>{item.physical_port}</span></div>
                            </div>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@SSID：</span><span>{item.ssid}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@IP地址：</span><span>{item.ip}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@子网掩码：</span><span>{item.net_mask}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@访问互联网：</span><span>{item.internet_strategy}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">DHCP：</span><span onClick={()=>this.gotoDHCP(item)} className='common-link-icon'>@配置详情</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@ARP静态绑定：</span><span onClick={() => this.gotoARP(item)} className='common-link-icon'>@静态IP</span></Row>
                        </Col>
                        <Modal width="483px" maskClosable={false} visible={this.state.visible} title="@ARP静态绑定"
                            onCancel={this.cancel} onOk={this.Submit} destroyOnClose >
                            <Table bordered size="middle" rowKey={record => record.id} pagination={false}
                             columns={Columns} dataSource={this.props.mi0102Info.apStatic}/>
                        </Modal>
                        <Modal width="483px" maskClosable={false} visible={this.state.DHCPvisible} title="@DHCP详情"
                            onCancel={this.DHCPcancel} onOk={this.DHCPSubmit} destroyOnClose >
                        <Form layout="horizontal"  >
                                <FormItem  label="@IP池"  labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_ip_pool', {
                                    })(
                                        <span>{this.state.record.dhcp_ip_pool}</span>
                                    )}
                                </FormItem>
                                <FormItem label="@租期" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_lease_time', {
                                    })(
                                        <span>{this.state.record.dhcp_lease_time}</span>
                                    )}
                                </FormItem>                                
                                <FormItem  label="@子网掩码" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('net_mask', {
                                    })(
                                        <span>{this.state.record.net_mask}</span>
                                    )}
                                </FormItem>
                                <FormItem label="@网关" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_gateway', {
                                    })(
                                        <span>{this.state.record.dhcp_gateway}</span>
                                    )}
                                </FormItem>                                
                                <FormItem  label="@首选DNS" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_dns', {
                                    })(
                                        <span>{this.state.record.dhcp_dns}</span>
                                    )}
                                </FormItem>
                                <FormItem label="@备用DNS" labelCol={{span: 7, offset: 1}} wrapperCol={{span: 15, offset: 1}}>
                                    {getFieldDecorator('dhcp_dns_backup', {
                                    })(
                                        <span>{this.state.record.dhcp_dns_backup}</span>
                                    )}
                                </FormItem>
                        </Form>
                        </Modal>
                        
                </Row>:<Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                    <Col span={5} style={{position:"relative"}}>
                    <div style={{position:"absolute",top:"30px",left:"30%"}}>
                            <div style={{float:"right",width:"60px",height:"35px"}}><span >{item.name}</span><span className="ci2802span" style={{display:"block"}}>{item.physical_port}</span></div>
                            </div>
                    </Col>
                    <Col span={7}>
                        <Row className="CheckWANrow"><span className="ci2802span">@SSID：</span><span>{item.ssid}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@IP地址：</span><span>{item.ip}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@子网掩码：</span><span>{item.net_mask}</span></Row>
                    </Col>
                    <Col span={4}>
                        <Row className="CheckWANrow"><span style={{display:"inline-block",height:0}} className="ci2802span"></span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@访问互联网：</span><span>{item.internet_strategy==="allowed"?"@开启":"@关闭"}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@DHCP服务：</span><span onClick={()=>this.gotoDHCP(item)} className='common-link-icon'>{item.dhcp_is_active?"@开启":"@关闭"}</span></Row>
                    </Col>
                    <Col span={4}>
                        <Row className="CheckWANrow"><span style={{display:"inline-block",height:0}} className="ci2802span">  </span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@ARP静态绑定：</span><span onClick={() => this.gotoARP(item)} className='common-link-icon'>@静态IP</span></Row>
                    </Col>
                    <Col span={4}>
    
                        <Button style={{marginRight:5}} onClick={() => this.edit(item)} type="primary" >@修改配置</Button>
                            
                            {item.name==="lan"?"":<Popconfirm title={"@确定删除当前信息?"} onConfirm={() => this.delete(item)}>
                                <Button  shape="circle" icon="delete" />
                            </Popconfirm>}
                    </Col>
                    <BossEditModal {...ModalOptions} />
                    <BossEditModal {...ModalDHCPOptions} refs={this.onRef}/>
                     <ARPModal record={this.state.ARPRecord} cta_lan_id={this.state.lanID} id={this.state.ARPid} select={{name:this.state.getName,operation_type:this.state.getType}} get_static_ip={this.get_static_ip} cancel={this.closeARPModal} 
                                visible={this.state.ARPvisible} vm ={this}/>
            </Row>}
            </div>
            }):<div style={{textAlign: "center"}}>
            <img src={noWan} alt="" style={{marginTop: 60}}/>
        </div>}
        </div>
    
    }

}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(LAN)));