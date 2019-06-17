/*@客户-配置管理*/
import React from 'react';
import {Button, Col, Form, Icon, Popconfirm, Row} from 'antd';
import '../index.scss';
import BossEditModal from "../../../Common/BossEditModal";
import ARPModal from "./subComponents/ARPModal";
import LAN2 from "../../../../assets/img/LAN2.png";
import noWan from '../../../../assets/img/noWan.png';
import {injectIntl} from "react-intl";
import {connect} from 'dva';


class Lan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            status: "",
            visible: false,
            DHCPvisible: false,
            editRecord: {},
            DHCPRecord: {},
            DHCPid: "",
            ARPvisible: false,
            ARPRecord: {},
            ARPid: "",
            editId: "",
            disabled:false,
            selectName:"",
            band:"",
            lanID:"",
            dhcpOn:true
        };

    }

    componentDidMount() {
        this.get_cta_lan();
        this.get_cpe_template_agency()
    }

    onRef = (ignoreModalComponent) => {
        this.ignoreModalComponent = ignoreModalComponent;
    };
    get_cpe_template_agency = () => {
        this.props.dispatch({
            type: "ci2802Info/get_cpe_template_agency",
            payload: {
                id: this.props.cta_id
            }
        })
    }
    get_cta_lan = () => {
        this.props.dispatch({
            type: "ci2802Info/get_cta_lan",
            payload: {
                cta_id: this.props.cta_id
            }
        });
    }
    get_cta_wifi = () => {
        this.props.dispatch({
            type: "ci2802Info/get_cta_wifi",
            payload: {
                cta_id: this.props.cta_id
            }
        });
    }

    handleOpenAdd = () => {
        this.get_cta_wifi()
        this.get_available_ports_for_wan()
        this.get_cpe_template_agency()
        this.check_lan_only("")
        this.setState({
            visible: true,
        })
    }

    isEqualIPAddress = (rule, value, callback)=>{
        let mask = this.state.DHCPRecord.net_mask
        let ip = this.state.DHCPRecord.ip
        this.props.dispatch({
            type: "ci2802Info/get_start_end_ip",
            payload: {
                ip:ip,
                net_mask:mask
            }
        }).then(()=>{
            let ipPool = this.props.ci2802Info.ipPool
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
                        return  callback('IP的池范围不能包含网关地址')  
                    }else{
                      if(parseInt(addr1[0])>=parseInt(ipPool1[0])&&(addr1[1])>=parseInt(ipPool1[1])&&(addr1[2])>=parseInt(ipPool1[2])&&(addr1[3])>=parseInt(ipPool1[3])&&
                      parseInt(addr2[0])<=parseInt(ipPool2[0])&& parseInt(addr2[1])<=parseInt(ipPool2[1])&& parseInt(addr2[2])<=parseInt(ipPool2[2])&& parseInt(addr2[3])<=parseInt(ipPool2[3])){
                        if(parseInt(addr1[0])<=parseInt(addr2[0])&&parseInt(addr1[1])<=parseInt(addr2[1])&&parseInt(addr1[2])<=parseInt(addr2[2])&&parseInt(addr1[3])<parseInt(addr2[3])){
                            return callback();
                        }else{
                            return  callback('IP池填写的范围前面的值应小于后面的值')                              
                        }
                      }else{
                        return  callback('IP池范围'+this.props.ci2802Info.ipPool[0]+'-'+this.props.ci2802Info.ipPool[1])
                      }
                    }
                }else{
                    //return callback("IP池格式例如：192.168.1.1-192.168.1.30");
                    return  callback('IP池范围'+this.props.ci2802Info.ipPool[0]+'-'+this.props.ci2802Info.ipPool[1])
                }
            }
        });
    }    
    gotoDHCP=(record)=>{
       
        this.setState({
            DHCPvisible:true,
            DHCPRecord:record,
            DHCPid:record.id,
            dhcpOn:record.dhcp_is_active
        },()=>{
        })
    }
    gotoARP = (record) => {
        this.setState({
            ARPvisible: true,
            ARPRecord: record,
            ARPid: record.cta_id,
            lanID: record.id
        }, function () {
            this.get_static_ip()
        })
    }
    get_static_ip = () => {
        this.props.dispatch({
            type: "ci2802Info/get_cta_static_ip",
            payload: {
                net_id: this.state.ARPid,
                cta_lan_id: this.state.lanID
            }
        })
    }
    // search = (value) => {
    //     this.setState({
    //         selectName:value||""
    //     },function(){
    //        this.get_cta_lan()
    //     })
    // };
    edit = (record) => {
        this.get_cta_wifi()
        this.get_available_ports_for_wan()
        this.check_lan_only("")
        this.setState({
            visible: true,
            editRecord: record,
            editId: record.id,
        })
    }
    closeAddModal = () => {
        this.setState({
            visible: false,
            editRecord: {},
            editId: "",
            disabled: false,
        }, function () {
            //this.get_cta_lan()
            //this.props.vm.get_physical_ports_info()
        })
    }
    closeDHCPModal = () => {
        this.setState({
            DHCPvisible: false,
            DHCPRecord: {},
            DHCPid: ""
        }, function () {
            this.get_cta_lan()
        })
    }
    closeARPModal = () => {
        this.setState({
            ARPvisible: false,
            ARPPRecord: {},
            ARPid: ""
        }, function () {
            this.get_cta_lan()
        })
    }
    delete = (record) => {
        this.props.dispatch({
            type: "ci2802Info/delete_cta_lan",
            payload: {
                ids: [record.id], record: [record], cta_id: this.props.cta_id,
            }
        }).then(() => {
            this.props.vm.get_physical_ports_info()
        })
    };
    get_available_ports_for_wan = () => {
        this.props.dispatch({
            type: "ci2802Info/get_available_ports_for_wan",
            payload: {
                cta_id: this.props.cta_id
            }
        });
    }
    check_lan_only = (value) => {
        var port
        if (value !== "") {
            port = value.join(",")
        } else {
            port = value
        }
        this.props.dispatch({
            type: "ci2802Info/check_lan_only",
            payload: {
                cta_id: parseInt(this.props.cta_id),
                exc_cta_lan_id: this.state.editId ? this.state.editRecord.id : "",
                physical_port: port
            }
        });
    }


    render() {
        const ModalOptions = {
            title: this.state.editId ? "@编辑" : "@新增",
            visible: this.state.visible,
            //:{name:this.props.ci2802Info.cpeTemplate}
            initialValues: this.state.editId ? this.state.editRecord : {
                name: this.props.ci2802Info.cpeTemplate[0].latest_lan_name,
                dhcp_is_active: true
            },
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci2802Info/update_cta_lan" : "ci2802Info/create_cta_lan",
            onCancel: this.closeAddModal,
            extraUpdatePayload: {cta_id: this.props.cta_id, id: this.state.editId},
            initPayload: {selectName: this.state.selectName},
            InputItems: [{
                type: "Input",
                labelName: "@网段名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入网段名称",
                    disabled: true
                },
                rules: [{required: true, message:"@请输入网段名称"},{max:16,message:"@网段名称最多输入16字符"}],
            },{
                type: "Select",
                labelName: '@物理端口',
                valName: "physical_port",
                help: this.props.ci2802Info.checkLan,
                validateStatus: this.props.ci2802Info.checkLans,
                nativeProps: {
                    placeholder: '@请选择物理端口', mode: "multiple"
                },
                //     rules: [{required: true,message: "@请选择物理端口"}],
                children: this.props.ci2802Info.portsList.map((item) => {
                    if (item) {
                        return {key: item, value: item, name: item}
                    }
                }),
                onChange: (value, vm) => {
                    this.check_lan_only(value)
                }
            },
            {
                type: "Select",
                labelName:"@SSID名称",
                valName: "wifi_ids",
                nativeProps: {
                    placeholder:"@请选择SSID名称",mode:"multiple",
                    disabled:!!this.state.editId
                },
                rules: [{required: false, message: "@请选择SSID名称"}],
                children:this.props.ci2802Info.wifiList.map((item)=>{
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
            }, 
            // {
            //     type: "Radio",
            //     labelName: __(messages["DHCP服务"]),
            //     valName: "dhcp_is_active",
            //     nativeProps: {
            //         placeholder: __(messages["请选择DHCP服务"])
            //     },
            //     rules: [{required: true, message: __(messages["请选择DHCP服务"])}],
            //     children: [{value: true, name: "开启", key: "1"}, {value: false,name: "关闭",key: "0"}],
            // }
        ]}
        const ModalDHCPOptions = {
            title: "@DHCP设置",
            visible: this.state.DHCPvisible,
            initialValues: this.state.DHCPRecord,
            dispatch: this.props.dispatch,
            submitType: "ci2802Info/update_cta_lan",
            onCancel: this.closeDHCPModal,
            extraUpdatePayload: {id:this.state.DHCPid,cta_id:this.props.cta_id,},
            initPayload: {selectName:this.state.selectName},
            InputItems: this.state.dhcpOn?[{
                type: "Radio",
                labelName: "@DHCP服务",
                valName: "dhcp_is_active",
                nativeProps: {
                    placeholder: "@请选择DHCP"
                },

                rules: [{required: true, message: "@请选择DHCP"}],
                children: [{value: true, name: "@开启", key: "1"}, {value: false,name: "@关闭",key: "0"}],
                onChange: (value, vm) => {
                    this.setState({
                        dhcpOn:value.target.value
                    })
                }
            },{
                type: "Input",
                labelName: "@IP池",
                valName: "dhcp_ip_pool",
                nativeProps: {
                    placeholder: "@请输入IP池",
                    disabled:!!this.state.editId,
                    //extra:'IP池范围'+this.props.ci2802Info.ipPool[0]+'-'+this.props.ci2802Info.ipPool[1]
                },
                rules: [{required: true, message:"@请输入IP池"},{validator: this.isEqualIPAddress}],
            },{
                type: "InputNumber",
                labelName: "@租期"+"(h)",
                valName: "dhcp_lease_time",
                nativeProps: {
                    placeholder: this.state.disabled ? "" : "@请输入租期",
                    max: 48,
                    disabled: this.state.disabled,
                },
                rules: [{required:true, message:"@请输入租期"},{pattern:/^([1-9]|[1-4][0-8])$/,message: "@租期配置范围为1-48h"}],
            },
            // {
            //     type: "Input",
            //     labelName: __(messages["子网掩码"]),
            //     valName: "net_mask",
            //     nativeProps: {
            //         placeholder: this.state.disabled?"":__(messages["请输入子网掩码"]),
            //         disabled:this.state.disabled,
            //     },
            //     rules: [{required:true, message:__(messages["请输入子网掩码"])},{
            //         pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/,
            //         message: __(messages["请输入正确的子网掩码格式"])
            //     }],
            // },
            {
                type: "Input",
                labelName: "@网关",
                valName: "dhcp_gateway",
                nativeProps: {
                    placeholder: this.state.disabled?"":"@请输入网关",
                    disabled:true
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
                    message:"@请输入正确的DNS格式"
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
        ]:[{
            type: "Radio",
            labelName: "@DHCP服务",
            valName: "dhcp_is_active",
            nativeProps: {
                placeholder: "@请选择DHCP"
            },
            rules: [{required: true, message: "@请选择DHCP"}],
            children: [{value: true, name: "@开启", key: "1"}, {value: false,name: "@关闭",key: "0"}],
            onChange: (value) => {
                this.setState({
                    dhcpOn:value.target.value
                })
            }
        }]
       
    }

        const columns = [{
            title: '@网段名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@物理端口',
            dataIndex: 'physical_port',
            key: 'physical_port',
        }, {
            title: '@SSID名称',
            dataIndex: 'wifi_ids',
            key: 'wifi_ids',
        }, {
            title: '@IP地址',
            dataIndex: 'ip',
            key: 'ip',
        }, {
            title: '@掩码',
            dataIndex: 'net_mask',
            key: 'net_mask',

        }, {
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
        }, {
            title: 'DHCP',
            dataIndex: 'dhcp_is_active',
            key: 'dhcp_is_active',
            render: (index, record) => {
                return index ?
                    <span onClick={() => this.gotoDHCP(record)} className='common-link-icon'>DHCP设置</span> : "关闭"
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed:'right',
            width:100,
            render: (index, record) => {
                return (
                    <div style={{display: "inline-block"}}>
                        {/* <Operations 
                        hasCustom={true} customIcon={"copy"} messages={"确认复制模板？"} cunsom={() => this.coppy(record)}
                        hasEdit={true} edit={() => this.edit(record)}
                        hasDelete={true} delete={() => this.delete(record)}
                        /> */}
                        <span onClick={() => this.gotoARP(record)}
                              className='ci3301operations-delete-btn'>{"@ARP静态绑定"}</span>
                        <Icon type="edit" onClick={() => this.edit(record)} className="operations-edit-btn"/>
                        <Popconfirm title={"@确定删除当前信息?"} onConfirm={() => this.delete(record)}><Icon type="delete"
                                                                                                     style={{}}
                                                                                                     className="operations-delete-btn"/></Popconfirm>
                    </div>
                )
            }
        },]

        // return (
        //     <Card className="card">
        //                     <HeaderBar 
        //                     //hasSearch={true} 
        //                     selectPlaceHolder={'@请选择状态'}
        //                     selectOneWidth={220}
        //                    // options={option}
        //                     hasAdd={true}
        //                     hasDelete={false}
        //                     add={this.handleOpenAdd}
        //                     //submit={this.search}
        //                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        //                     selectOneShowSearch={true}/>
        //         <BossTable columns={columns} dataSource={this.props.ci2802Info.dataLan} />
        //         <BossEditModal {...ModalOptions} />
        //         <BossEditModal {...ModalDHCPOptions} />
        //         <ARPModal record={this.state.ARPRecord} cta_lan_id={this.state.lanID} id={this.state.ARPid} select={{name:this.state.getName,operation_type:this.state.getType}}  cancel={this.closeARPModal} 
        //                     visible={this.state.ARPvisible} vm ={this}/>
        //     </Card>

        // )

        return <div className="CheckWAN"> 
        <p className="p">@LAN口配置</p>
        <Button icon="file-add" style={{marginRight: 8,marginBottom:20}} onClick={()=>{this.handleOpenAdd()} }>@添加</Button>
        {this.props.ci2802Info.dataLan.length > 0 ?this.props.ci2802Info.dataLan.map((item)=>{
            return <Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                    <Col span={6} style={{position:"relative"}}>
                        <div style={{position:"absolute",top:"30px",left:"0"}}>
                        <img src={LAN2} alt=""/>
                        <div style={{float:"right",width:"60px",height:"35px",paddingLeft:5}}><span >{item.name}</span><span className="ci2802span" style={{display:"block"}}>{(item.physical_port).join(",")}</span></div>
                        </div>
                    </Col>
                    <Col span={6}>
                    {this.props.ci2802Info.cpeTemplate[0].wifi_no===0?<Row className="CheckWANrow"><span style={{display:"inline-block",height:0}} className="ci2802span"></span></Row>:<Row className="CheckWANrow"><span className="ci2802span">SSID：</span><span>{item.ssid}</span></Row>}
                        <Row className="CheckWANrow"><span className="ci2802span">@IP地址：</span><span>{item.ip}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@子网掩码：</span><span>{item.net_mask}</span></Row>
                    </Col>
                    <Col span={4}>
                        <Row className="CheckWANrow"><span style={{display: "inline-block", height: 0}}
                                                           className="ci2802span"></span></Row>
                        <Row className="CheckWANrow"><span
                            className="ci2802span">@访问互联网：</span><span>{item.internet_strategy === "allowed" ? "@开启" : "@关闭"}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@DHCP服务：</span><span
                            onClick={() => this.gotoDHCP(item)}
                            className='common-link-icon'>{item.dhcp_is_active ? "@开启" : "@关闭"}</span></Row>
                    </Col>
                    <Col span={4}>
                        <Row className="CheckWANrow"><span style={{display: "inline-block", height: 0}}
                                                           className="ci2802span">  </span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@ARP静态绑定：</span><span
                            onClick={() => this.gotoARP(item)} className='common-link-icon'>@静态IP</span></Row>
                    </Col>
                    <Col span={4}>

                        <Button style={{marginRight: 5}} onClick={() => this.edit(item)} type="primary">@修改配置</Button>

                        {item.name === "lan" ? "" :
                            <Popconfirm title="@确定删除当前信息?" onConfirm={() => this.delete(item)}>
                                <Button shape="circle" icon="delete"/>
                            </Popconfirm>}
                    </Col>
                    <BossEditModal {...ModalOptions} />
                    <BossEditModal {...ModalDHCPOptions} refs={this.onRef}/>
                    <ARPModal record={this.state.ARPRecord} cta_lan_id={this.state.lanID} id={this.state.ARPid}
                              select={{name: this.state.getName, operation_type: this.state.getType}}
                              get_static_ip={this.get_static_ip} cancel={this.closeARPModal}
                              visible={this.state.ARPvisible} vm={this}/>
                </Row>

            }) : <div style={{textAlign: "center"}}>
                <img src={noWan} alt="" style={{marginTop: 60}}/>
            </div>}
        </div>


    }
}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Lan)));