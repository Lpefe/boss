/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Popconfirm, Form, Row,Col, Button} from 'antd';
import BossEditModal from "../../../Common/BossEditModal";
import WAN2 from "../../../../assets/img/WAN2.png";
import {commonTranslate} from "../../../../utils/commonUtilFunc";
import {BossMessage} from "../../../Common/BossMessages";

import {injectIntl} from "react-intl";


class Wan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editRecord: {},
            editId: "",
            static:false,
            PPPOE:false,
            connect_type : [{key: "static", value: "static", name: "Static"},{key: "dhcp", value: "dhcp", name: "DHCP"},{key: "pppoe", value: "pppoe", name: "PPPoE"}]
        }
        this.ignoreModalComponent={}
    }
    componentDidMount() {
        this.get_cta_wan()
    }
    get_cta_wan =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_wan",
            payload: {
                cta_id:this.props.cta_id
            }
        });
    }
    get_isp_dict =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_isp_dict",
            payload: {
                
            }
        });
    }
    get_available_ports_for_wan =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_available_ports_for_wan",
            payload: {
                cta_id:this.props.cta_id
            }
        });
    }
    check_lan_only =(value)=>{
        this.props.dispatch({
            type: "ci2802Info/check_lan_only",
            payload: {
                cta_id:this.props.cta_id,
                physical_port:value
            }
        });
    }
    handleOpenAdd=()=>{
        if(this.props.ci2802Info.dataWan.length>2){
            BossMessage(false, "@WAN最多只能添加三个，请删除后再添加");
        }else{
            this.get_available_ports_for_wan()
            this.get_isp_dict()

            this.setState({
                visible: true,
                static:true,
                PPPOE:false,
                connect_type : [{key: "static", value: "static", name: "Static"},{key: "dhcp", value: "dhcp", name: "DHCP"},{key: "pppoe", value: "pppoe", name: "PPPoE"}]
            },()=>{

                
            })
        }
            
        
    }
    closeAddModal = () => {
        this.setState({
            visible: false,
            editRecord: {},
            editId: "",
        },()=> {
            this.props.dispatch({
                type: "ci2802Info/reset_lan_only",
                payload: {}
            });
        })
    }
    isEqualIPAddress = (rule, value, callback)=>{
        let that = this.ignoreModalComponent.props.form
        let addr1 = that.getFieldValue("ip")
        let addr2 = that.getFieldValue("gateway")
        let mask = that.getFieldValue("net_mask")
        if(addr1===addr2){
            return  callback("@网关地址不能和IP地址相同")
        }else{
            if (addr2) {
                var  regNum = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
                if (regNum.test(addr2)) {
                    if(!addr1 || !addr2 || !mask){
                        return false;
                    }
                    var res1 = [],res2 = [];
                    addr1 = addr1.split(".");
                    addr2 = addr2.split(".");
                    mask  = mask.split(".");
                    for(var i = 0,ilen = addr1.length; i < ilen ; i += 1){
                      res1.push(parseInt(addr1[i]) & parseInt(mask[i]));
                      res2.push(parseInt(addr2[i]) & parseInt(mask[i]));
                    }
                    if(res1.join(".") == res2.join(".")){
                        
                        return callback();
                    }else{
                      return  callback("@网关地址必须和IP地址在相同网段")
                    }
    
                }else{
                    return callback("@请输入正确的网关地址");
                }
            }
        }
        return callback();
    }    
    edit = (record)=>{
        this.get_available_ports_for_wan()
        this.get_isp_dict()
        if(record.connect_type==="static"){
            this.setState({
                static:true
            })
        }else{
            this.setState({
                static:false
            })
        }
        if(record.connect_type==="pppoe"){
            this.setState({
                PPPOE:true
            })
        }else{
            this.setState({
                PPPOE:false
            })
        }
        if(record.net_type==="MPLS"){
            this.setState({
                connect_type : [{key: "static", value: "static", name: "Static"},{key: "dhcp", value: "dhcp", name: "DHCP"}]
            })
        }else{
            this.setState({
                connect_type : [{key: "static", value: "static", name: "Static"},{key: "dhcp", value: "dhcp", name: "DHCP"},{key: "pppoe", value: "pppoe", name: "PPPoE"}]
            })
        }
        this.setState({
            visible: true,
            editRecord: record,
            editId: record.id,
        }, ()=> {
            //this.get_cta_wan()
        })
    }
    onRef = (ignoreModalComponent) => {
        this.ignoreModalComponent = ignoreModalComponent;
    };
   delete = (record) => {
        this.props.dispatch({
            type: "ci2802Info/delete_cta_wan",
            payload: {
                records:[record],
                ids: [record.id],
                cta_id:this.props.cta_id
            }
        }).then(()=>{
            this.props.vm.get_physical_ports_info()
        })
    };
    render() {
        const modalFormLayout = {
            labelCol: {
                xs: {span: 7},
            },
            wrapperCol: {
                xs: {span: 14},
            },
        };
        const __ = commonTranslate(this);
        const initialValues = {net_type:"INTERNET",connect_type:"static",net_mask:"255.255.255.0"}
        this.props.ci2802Info.dataWan.map((item)=>{
            if(item.name==="WAN2"){
                initialValues.physical_port="ETH3"
                initialValues.name="WAN3"
            }else{
                initialValues.physical_port="ETH2"
                initialValues.name="WAN2"
            }
        })
        const ModalOptions = {
            title: this.state.editId ? "@编辑" :"@新增",
            visible: this.state.visible,
            initialValues: this.state.editId ?this.state.editRecord:initialValues,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci2802Info/update_cta_wan" : "ci2802Info/create_cta_wan",
            onCancel: this.closeAddModal,
            hasSubmitCancel: this.state.editId === undefined,
            extraUpdatePayload: {cta_id:this.props.cta_id,id:this.state.editId,physical_port:this.state.editId ?this.state.editRecord.physical_port:initialValues.physical_port},
            initPayload: {},
            parentVm: this,
            InputItems: [{
                type: "Input",
                labelName: "@名称",
                valName: "name",
                nativeProps: {
                    disabled:true,
                    placeholder: "@请输入名称"
                },
                customerFormLayout:modalFormLayout,
                rules: [{required: true, message: "@请输入名称"}],
            },
            // {
            //     type: "Select",
            //     labelName: '@物理端口',
            //     valName: "physical_port",
            //     help:this.props.ci2802Info.checkLan,
            //     validateStatus:this.props.ci2802Info.checkLans,
            //     nativeProps: {
            //         placeholder: '@请选择物理端口',
            //     },
            //     rules: [{required: true,}],
            //     customerFormLayout:modalFormLayout,
            //     children: this.props.ci2802Info.portsList.map((item) => {
            //         if (item) {
            //             return {key: item, value: item, name: item}
            //         }
            //     }),
            //     onChange: (value, vm) => {
            //         this.check_lan_only(value)
            //         vm.props.form.setFieldsValue({
            //             agency_ids: undefined,
            //         });
            //     }
            // },
            {
                type: "Select",
                labelName: '@线路类型',
                valName: "net_type",
                nativeProps: {
                    placeholder: '@请选择线路类型'
                },
                customerFormLayout:modalFormLayout,
                rules: [{required: true,message: "@请选择线路类型"}],
                children: [{key: "internet", value: "INTERNET", name: "Internet"},{key: "MPLS", value: "MPLS", name: "MPLS/MSTP"}],
                onChange: (value, vm) => {
                    if(value==="MPLS"){
                        this.setState({
                            connect_type : [{key: "static", value: "static", name: "Static"},{key: "dhcp", value: "dhcp", name: "DHCP"}]
                        })
                    }else{
                        this.setState({
                            connect_type : [{key: "static", value: "static", name: "Static"},{key: "dhcp", value: "dhcp", name: "DHCP"},{key: "pppoe", value: "pppoe", name: "PPPoE"}]
                        })

                    }
                    vm.props.form.setFieldsValue({
                        connect_type: undefined,
                    });
                }
            }, {
                type: "InputNumber",
                labelName: "@带宽大小(M)",
                valName: "bandwidth",
                nativeProps: {
                    placeholder: "@请输入带宽大小",
                    style:{width:"135px"}
                },
                rules: [{
                    pattern: /^(204[0-8]|20[0-3][0-9]|1[0-9][0-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9]|[1-9])$/,
                    message: "@带宽配置范围为1-2048M"
                }],
                customerFormLayout:modalFormLayout,
            },{
                type: "Select",
                labelName: '@运营商',
                valName: "isp",
                nativeProps: {
                    placeholder: '@请选择运营商'
                },
                //rules: [{required: true,message: "@请输入运营商"}],
                customerFormLayout:modalFormLayout,
                children: this.props.ci2802Info.ispList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.code, name: item.name}
                    }
                }),
                // onChange: (value, vm) => {
                //     this.getAgencyList(value)
                //     vm.props.form.setFieldsValue({
                //         agency_ids: undefined,
                //     });
                // }
            },{
                type: "Select",
                labelName: '@接入方式',
                valName: "connect_type",
                nativeProps: {
                    placeholder: '@请选择接入方式'
                },
                rules: [{required: true,message: "@请选择接入方式"}],
                customerFormLayout:modalFormLayout,
                children: this.state.connect_type,
                onChange: (value, vm) => {
                    if(value==="static"){
                        this.setState({
                            static:true
                        })
                    }else{
                        this.setState({
                            static:false
                        })
                    }
                    if(value==="pppoe"){
                        this.setState({
                            PPPOE:true
                        })
                    }else{
                        this.setState({
                            PPPOE:false
                        })
                    }
                    // vm.props.form.setFieldsValue({
                    //     agency_ids: undefined,
                    // });
                }
            },this.state.static?{
                type: "Input",
                labelName: "@IP地址",
                valName: "ip",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入IP地址",
                    onChange: () => {
                        console.log(this.ignoreModalComponent)
                        this.ignoreModalComponent.props.form.setFieldsValue({
                            gateway: undefined,
                        });
                    }
                },
                rules: [{required: true, message: "@请输入IP地址"},{
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确IP格式"
                }],
            }:"",  this.state.static? {
                type: "Input",
                labelName: "@子网掩码",
                valName: "net_mask",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入子网掩码"
                },
                rules: [{required: true, message: "@请输入子网掩码"},{
                    pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/,
                    message: "@请输入正确掩码格式"
                }],

            }:"",this.state.static?{
                type: "Input",
                labelName: "@网关地址",
                valName: "gateway",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入网关地址",

                },
                rules: [{required: true, message: "@请输入网关地址"},{validator: this.isEqualIPAddress}],

            }:"", this.state.static?{
                type: "Input",
                labelName: "@首选DNS服务器",
                valName: "dns",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入首选DNS服务器"
                },
                rules: [{required: true, message: "@请输入首选DNS服务器"},{
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确的服务器地址"
                }],
            }:"", this.state.static?{
                type: "Input",
                labelName: "@备用DNS服务器",
                valName: "dns_backup",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入备用DNS服务器"
                },
                rules: [{required: true, message: "@请输入备用DNS服务器"},{
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确的服务器地址"
                }],
            }:"",  this.state.PPPOE?{
                type: "Input",
                labelName: "@账号",
                valName: "username",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入账号"
                },
                rules: [{required: true, message: "@请输入账号"},{max:32,message: "@最大长度32位"}],
            }:"", this.state.PPPOE?{
                type: "Input",
                labelName: "@密码",
                valName: "password",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入密码"
                },
                rules: [{required: true, message: "@请输入密码"},{max:16,message: "@最大长度16位"},{
                    pattern:/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/,
                    message:"@只能输入英文及常用符号"
                }],
            }:"",
        ]
        };
        // const columns = [{
        //     title: '@名称',
        //     dataIndex: 'name',
        //     key: 'name',
        //     fixed:"left",
            
        // }, {
        //     title: '@物理端口',
        //     dataIndex: 'physical_port',
        //     key: 'physical_port',            
        // }, {
        //     title:  '@线路类型',
        //     dataIndex: 'net_type',
        //     key: 'net_type',
            
        //     render:(text)=>{
        //         switch (text) {
        //             case "static":
        //                 return "专线"
        //             case "internet":
        //                 return "互联网"   
        //             default:
        //                 return "-"
        //         } 
        //     }
        // }, {
        //     title: '@带宽(M)',
        //     dataIndex: 'bandwidth',
            
        //     key: 'bandwidth',
        // }, {
        //     title: '@运营商',
        //     dataIndex: 'isp_name',
            
        //     key: 'isp_name',
        // }, {
        //     title: '@连接方式',
        //     dataIndex: 'connect_type',
        //     key: 'connect_type',
            
        //     render:(text)=>{
        //         switch (text) {
        //             case "static":
        //                 return "固定IP"
        //             case "dhcp":
        //                 return "DHCP"   
        //             case "pppoe":
        //                 return "PPPOE"
        //             default:
        //                 return "-"
        //         } 
        //     }
        // }, {
        //     title: '@账号',
        //     dataIndex: 'username',
        //     key: 'username',
            
        //     // render:(text)=>{
        //     //     return text?"有":"无"
        //     // }
        // }, {
        //     title: '@密码',
        //     dataIndex: 'password',
        //     key: 'password',
            
        // },{
        //     title: '@IP地址',
        //     dataIndex: 'ip',
        //     key: 'ip',
            
        // },{
        //     title: '@子网掩码',
        //     dataIndex: 'net_mask',
        //     key: 'net_mask',
            
        // },{
        //     title: '@网关地址',
        //     dataIndex: 'gateway',
        //     key: 'gateway',
            
        // },{
        //     title: '@DNS服务器',
        //     dataIndex: 'dns',
        //     key: 'dns',
            
        // }, {
        //     title: '@操作',
        //     dataIndex: 'operation',
        //     key: 'operation',
        //     align: "center",
        //     fixed:"right",
        //     render: (index, record) => {
        //         return <div>
        //         <Operations 
        //         hasEdit={true} hasDelete={record.name==="WAN"?false:true} 
        //         delete={() => this.delete(record)}
        //         edit={() => this.edit(record)}
        //         />
        //     </div>
        //     }
        // },];
        // return <div>
        //         <HeaderBar  hasAdd={true} add={this.handleOpenAdd}/>
        //         <BossTable columns={columns} dataSource={this.props.ci2802Info.dataWan} scroll={{ x: 1000}}/>
        //         <BossEditModal {...ModalOptions} />
        // </div>
        return <div className="CheckWAN"> 
        <p className="p">@WAN口配置</p>
        {sessionStorage.getItem("companyId")==1?<Button icon="file-add" style={{marginRight: 8,marginBottom:20}} onClick={()=>{this.handleOpenAdd()} }>{'@添加'}</Button>:""}        
        {this.props.ci2802Info.dataWan.map((item)=>{
            return <Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                    <Col span={5} style={{position:"relative"}}>
                        <div style={{position:"absolute",top:"30px",left:"5%"}}>
                        <img src={WAN2} alt=""/>
                        <div style={{float:"right",width:"60px",height:"35px",paddingLeft:5}}><span >{item.name}</span><span className="ci2802span" style={{display:"block"}}>{item.physical_port}</span></div>
                        </div>
                    </Col>
                    <Col span={5}>
                        <Row className="CheckWANrow"><span className="ci2802span">@线路类型：</span><span>{item.net_type==="MPLS"?"MPLS/MSTP":(item.net_type==="INTERNET"?"Internet":(item.net_type==="static"?"Static":item.net_type))}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@带宽(M)：</span><span>{item.bandwidth}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@运营商：</span><span>{item.isp_name}</span></Row>
                    </Col>
                    <Col span={4}>
                        <Row className="CheckWANrow"><span className="ci2802span">@连接方式：</span><span>{item.connect_type==="dhcp"?"DHCP":(item.connect_type==="static"?"Static":"PPPoE")}</span></Row>
                        {item.connect_type==="dhcp"?"":(item.connect_type==="static"?"":<Row className="CheckWANrow"><span className="ci2802span">@账号：</span><span>{item.username}</span></Row>)}
                        {item.connect_type==="dhcp"?"":(item.connect_type==="static"?"":<Row className="CheckWANrow"><span className="ci2802span">@密码：</span><span>{item.password}</span></Row>)}
                    </Col>
                    <Col span={6}>
                        {item.connect_type==="dhcp"?"":(item.connect_type==="pppoe"?"":<Row className="CheckWANrow"><span className="ci2802span">@IP地址：</span><span>{item.ip}</span></Row>)}
                        {item.connect_type==="dhcp"?"":(item.connect_type==="pppoe"?"":<Row className="CheckWANrow"><span className="ci2802span">@子网掩码：</span><span>{item.net_mask}</span></Row>)}
                        {item.connect_type==="dhcp"?"":(item.connect_type==="pppoe"?"":<Row className="CheckWANrow"><span className="ci2802span">@网关地址：</span><span>{item.gateway}</span></Row>)}
                        {item.connect_type==="dhcp"?"":(item.connect_type==="pppoe"?"":<Row className="CheckWANrow"><span className="ci2802span">DNS：</span><span>{item.dns}  ,  </span><span>{item.dns_backup}</span></Row>)}
                    </Col>
                    {sessionStorage.getItem("companyId")==1?<Col span={4}>

                            <Button style={{marginRight:10}} onClick={() => this.edit(item)} type="primary" >@修改配置</Button>
                            
                            {item.name==="WAN"?"":<Popconfirm title={"@确定删除当前信息?"} onConfirm={() => this.delete(item)}>
                                <Button  shape="circle" icon="delete" />
                            </Popconfirm>}


                    </Col>:""}
                    <BossEditModal {...ModalOptions} refs={this.onRef}/>
            </Row>

        })}
    </div>
    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Wan)));