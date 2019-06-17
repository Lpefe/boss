/*@运维-设备信息*/
import React from 'react';
import {connect} from 'dva';
import {Row, Form, Popconfirm,Col,Button} from 'antd';
import {injectIntl} from "react-intl";
import noWan from '../../../../../../assets/img/noWan.png';
import BossEditModal from "../../../../../Common/BossEditModal";
import {commonTranslate} from "../../../../../../utils/commonUtilFunc";
class WIFI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            status:"",
            visible:false,
            editRecord:{},
            editId: "",
            disabled:false,
            selectName:"",
            band:""
        };
        this.isTechnology=sessionStorage.getItem("role") === "supercxptechnology" 
    }

    componentDidMount() {
       this.get_ap_wifi();
    }
    get_ap_wifi=()=>{
        this.props.dispatch({
            type: "mi0102Info/get_ap_wifi",
            payload: {
                device_id:this.props.id
            }
        });
    }
    get_ap_lan=()=>{
        this.props.dispatch({
            type: "mi0102Info/get_ap_lan",
            payload: {
                device_id:this.props.id
            }
        });
    }
    handleOpenAdd=()=>{
        this.get_ap_lan()
        this.setState({
            visible:true,
        })   
    }


    edit = (record)=>{
        this.get_ap_lan()

        if(record.encryption==="None"){
            this.setState({
                disabled:true,
            })
        }
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
            this.get_ap_wifi()
        })
    }
    delete = (record) => {
        this.props.dispatch({
            type: "mi0102Info/delete_ap_wifi",
            payload: {
                ids: [record.id],
                record:[record],
                device_id:this.props.id
            }
        })
    };
    render() {
        const __ = commonTranslate(this);
        const ghzChannel2_4=[
            {key: "channel", value: "none", name: "AUTO"},
            {key: "1", value: "1", name: "1"},
            {key: "2", value: "2", name: "2"},
            {key: "3", value: "3", name: "3"},
            {key: "4", value: "4", name: "4"},
            {key: "5", value: "5", name: "5"},
            {key: "6", value: "6", name: "6"},
            {key: "7", value: "7", name: "7"},
            {key: "8", value: "8", name: "8"},
            {key: "9", value: "9", name: "9"},
            {key: "0", value: "10", name: "10"},
            {key: "11", value: "11", name: "11"}]

        const ghzChannel5=[
            {key: "1", value: "none", name: "AUTO"},
            {key: "2", value: "36", name: "36"},
            {key: "3", value: "40", name: "40"},
            {key: "4", value: "44", name: "44"},
            {key: "5", value: "48", name: "48"},
            {key: "6", value: "149", name: "149"},
            {key: "7", value: "153", name: "153"},
            {key: "8", value: "157", name: "157"},
            {key: "9", value: "161", name: "161"},
            {key: "0", value: "165", name: "165"},
           ]

        const templateOptions = this.props.mi0102Info.dataLan.map((item) => {
                return  {key:item.id, value:item.id, name:item.name}
            })
        const ModalOptions = {
            title:this.state.editId ? "@编辑" :"@新增",
            visible:this.state.visible,
            initialValues:this.state.editId ?this.state.editRecord:{encryption:"WPA-PSK/WPA2-PSK",ssid_is_hidden:false},
            dispatch:this.props.dispatch,
            submitType:this.state.editId ?"mi0102Info/update_ap_wifi":"mi0102Info/create_ap_wifi",
            onCancel: this.closeAddModal,
            extraUpdatePayload: {id:this.state.editId,device_id:this.props.id},
            initPayload: {selectName:this.state.selectName},
            InputItems: [{
                type: "Input",
                labelName: "@SSID",
                valName: "ssid",
                nativeProps: {
                    placeholder: "@请输入SSID",
                    disabled:this.state.editId ?true:false
                },
                rules: [{required: true, message:"@请输入SSID"},{max: 32, message: 'SSID最多输入32字符'},{min: 8, message: 'SSID最少输入8字符'}],
            }, {
                type: "Select",
                labelName: "@认证方式",
                valName: "encryption",
                nativeProps: {
                    placeholder:"@请选择认证方式"
                },
                rules: [{required: true, message: "@请选择认证方式"}],
                children:[{key: "1", value: "None", name: "None"},{key: "encryption", value: "WPA2-PSK", name: "WPA2-PSK"},
                {key: "2", value: "WPA-PSK", name: "WPA-PSK"},
                {key: "3", value: "WPA-PSK/WPA2-PSK", name: "WPA-PSK/WPA2-PSK"},],
                onChange: (value,vm) => {
                    if(value==="None"){
                        this.setState({
                            disabled:true
                        },vm.props.form.setFieldsValue({
                            password: "",
                        }))
                    }else{
                        this.setState({
                            disabled:false
                        },vm.props.form.setFieldsValue({
                            password: this.state.editRecord.password,
                        }))
                    }
                },
            },{
                type: "Input",
                labelName: "@密码",
                valName: "password",
                nativeProps: {
                    placeholder: this.state.disabled?"":"@请输入密码",
                    disabled:this.state.disabled,
                },
                rules: [{required: !this.state.disabled, message:"@请输入密码"},{max: 32, message: '密码最多输入16字符'},{min: 8, message: '密码最少输入8字符'},{
                    pattern:/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/,
                    message:"@只能输入英文及常用符号"
                }],
            }, {
                type: "Radio",
                labelName: "@隐藏SSID",
                valName: "ssid_is_hidden",
                nativeProps: {
                    placeholder: "@请选择是否隐藏SSID"
                },
                rules: [{required: true, message: "@请选择是否隐藏SSID"}],
                children: [{value: true, name: "是", key: "1"}, {
                    value: false,
                    name: "否",
                    key: "0"
                }],
        
            },{
                type: "Radio",
                labelName: "@频段",
                valName: "band",
                nativeProps: {
                    placeholder: "@请选择频段"
                },
                rules: [{required: true, message: "@请选择频段"}],
                children: [{value: "2.4G", name: "2.4G", key: "1"}, {
                    value: "5G",
                    name: "5G",
                    key: "0"
                }],
                onChange:(value,vm) => {
                    this.setState({
                        band:value.target.value
                    },vm.props.form.setFieldsValue({
                        channel: "",
                    }))
                },
            },{
                type: "Select",
                labelName: "@信道",
                valName: "channel",
                nativeProps: {
                    placeholder:"@请选择信道"
                },
                rules: [{required: true, message: "@请选择信道"}],
                children:this.state.band==="2.4G"?ghzChannel2_4:ghzChannel5,
        
            },{
                type: "Select",
                labelName: "@网段",
                valName: "ap_lan_id",
                nativeProps: {
                    placeholder:"@请选择网段"
                },
                rules: [{required: true, message: "@请选择网段"}],
                children:templateOptions
        
            },
        ]
        }
        
        return <div className="CheckWAN"> 
        <p className="p">SSID</p>
        {this.isTechnology?"":<Button icon="file-add" style={{marginRight: 8,marginBottom:20}} onClick={()=>{this.handleOpenAdd()} }>{'@添加'}</Button> }
        
        <BossEditModal {...ModalOptions} />
        {this.props.mi0102Info.wifiList.length > 0 ?this.props.mi0102Info.wifiList.map((item)=>{
            return <div>
            {this.isTechnology?<Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                        <Col span={6} style={{position:"relative"}}>
                            <div style={{position:"absolute",top:"20px",left:"5%"}}>
                            <div  style={{float:"right",width:"100%",height:"35px"}}><span id="ssid">{item.ssid}</span></div>
                            </div>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@认证方式：</span><span>{item.encryption}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@密码：</span><span>{item.password}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@隐藏SSID：</span><span>{item.ssid_is_hidden?"@是":"@否"}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@网段名称：</span><span>{item.ap_lan_name}</span></Row>
                        </Col>
                        <Col span={6}>
                            <Row className="CheckWANrow"><span className="ci2802span">@关联频段：</span><span>{item.band}</span></Row>
                            <Row className="CheckWANrow"><span className="ci2802span">@信道：</span><span>{item.channel==="none"?"AUTO":item.channel}</span></Row>
                        </Col>
                </Row>:<Row key={item.id} style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}} gutter={16}>
                    <Col span={5} style={{position:"relative"}}>
                        <div style={{position:"absolute",top:"20px",left:"5%",width:"100%"}}>
                        <div  style={{float:"right",width:"100%",height:"35px"}}><span id="ssid">{item.ssid}</span></div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <Row className="CheckWANrow"><span className="ci2802span">@认证方式：</span><span>{item.encryption}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@密码：</span><span>{item.password}</span></Row>
                    </Col>
                    <Col span={5}>
                        <Row className="CheckWANrow"><span className="ci2802span">@隐藏SSID：</span><span>{item.ssid_is_hidden?"@是":"@否"}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@网段名称：</span><span>{item.ap_lan_name}</span></Row>
                    </Col>
                    <Col span={4}>
                        <Row className="CheckWANrow"><span className="ci2802span">@关联频段：</span><span>{item.band}</span></Row>
                        <Row className="CheckWANrow"><span className="ci2802span">@信道：</span><span>{item.channel==="none"?"AUTO":item.channel}</span></Row>
                    </Col>
                    <Col span={4}>

                        <Button style={{marginRight:5}} onClick={() => this.edit(item)} type="primary" >@修改配置</Button>
                            
                            {item.name==="lan"?"":<Popconfirm title={"@确定删除当前信息?"} onConfirm={() => this.delete(item)}>
                                <Button  shape="circle" icon="delete" />
                            </Popconfirm>}
                    </Col>
            </Row>}
        </div>
        }):<div style={{textAlign: "center"}}>
        <img src={noWan} alt="" style={{marginTop: 60}}/>
    </div>
    }
    </div>
    }
}



function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(WIFI)));






