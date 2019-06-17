/*@技术支持-wifi设备*/
import React from 'react';
import {Card, Select,Modal} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import messages from './LocaleMsg/messages';
import {commonTranslate} from "../../../utils/commonUtilFunc";
import {injectIntl} from "react-intl";
const Option = Select.Option;
class BI1904 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            editRecord: {},
            editId: "",
            disabled:false,
            configvisible:false,
            selectStatus:"",
            searchName:"",
            CPE:true,
        };

    }
    componentDidMount() {
        this.get_wifi();
        this.props.dispatch({
            type: "bi1904Info/get_company_list",
            payload: {

            }
        });
     }
    get_wifi=()=>{
        this.props.dispatch({
            type: this.state.CPE?"bi1904Info/get_cta_wifi":"bi1904Info/get_ap_wifi",
            payload: {
                is_active:1,
            }
        });
    }
    edit = (record)=>{
        if(record.encryption==="None"){
            this.setState({
                disabled:true,
            })
        }
        this.props.dispatch({
            type: "bi1904Info/get_cta_lan",
            payload: {
                cta_id:record.cta_id
            }
        });
        this.props.dispatch({
            type: "bi1904Info/get_ap_lan",
            payload: {
                device_id:record.cta_id
            }
        });
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
            this.get_wifi()
        })
    }
    search = (value) => {
        this.setState({
            searchName:value?value:""
        },function(){
            this.get_wifi()
        })
    };
    changeCPE = (value)=>{
        console.log(value)
        this.setState({
            CPE:value==="ap"?false:true
        },function(){
            this.get_wifi()
        })
    }
    configCancel=()=>{
        this.setState({
            configvisible:false
        },function(){
            this.get_wifi()
        })
    }
    gotoConfig = (value) =>{
        this.props.dispatch({
            type: "bi1904Info/get_wifi_config_file",
            payload: {
                sn:value.sn
            }}).then(
                this.setState({
                    configvisible:true
                })
            )
    }
    configSubmit = ()=>{
        this.setState({
            configvisible:false
        })
    }
    handleSelectStatus = (value) => {
        this.setState({
            selectStatus:value?value:""
        },  function(){
                this.get_wifi()
            }
        )

    };
    render() {
        var option = []
        this.props.bi1904Info.companyList.map((item) => {
                return option.push(<Option value={item.id} key={item.id}>{item.company_abbr}</Option>)
            })
        var optionsTwo = [<Option value="cpe" key="cpe">CPE</Option>,<Option value="ap" key="ap">AP</Option>]
        const columns = [{
            title: '@设备名称',
            dataIndex: 'model',
            key: 'model',
            // render: (index, record) => {
            //     return <span className="common-link-icon" onClick={() => this.gotoConfig(record)}>{record.model}</span>
            // }
        },{
            title: '@SSID',
            dataIndex: 'ssid',
            key: 'ssid',
        },{
            title: '@认证方式',
            dataIndex: 'encryption',
            key: 'encryption',
        },{
            title: '@密码',
            dataIndex: 'password',
            key: 'password',
        },{
            title: '@隐藏SSID',
            dataIndex: 'ssid_is_hidden',
            key: 'ssid_is_hidden',
            render: (index, record) => {
                return index?"@是":"@否"
            }
        },{
            title: '@频段',
            dataIndex: 'band',
            key: 'band',
        },{
            title: '@信道',
            dataIndex: 'channel',
            key: 'channel',
            render: (index, record) => {
                return index==="none"?"AUTO":index
            }
        },{
            title: '@网段名称',
            dataIndex: 'cta_lan_name',
            key: 'cta_lan_name',
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        },{
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        },{
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',
        },{
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:75,
            fixed:'right',
            render: (index, record) => {
                return (
                    <div>
                        <Operations 
                        hasEdit={true} edit={() => this.edit(record)}
                        />
                    </div>
                )
            }
        },]
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
        const templateOptions = this.props.bi1904Info.dataLan[0]?this.props.bi1904Info.dataLan.map((item) => {
            return  {key:item.id, value:item.id, name:item.name}
        }):""
        const aptemplateOptions = this.props.bi1904Info.apLan[0]?this.props.bi1904Info.apLan.map((item)=>{
            return {key:item.id, value:item.id, name:item.name}
        }):""
        const ModalOptions={
            title: "@个性化配置",
            visible: this.state.visible,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType:this.state.CPE?"bi1904Info/update_cta_wifi":"bi1904Info/update_ap_wifi" ,
            onCancel: this.closeAddModal,
            hasSubmitCancel: this.state.editId === undefined,
            extraUpdatePayload: {
                id:this.state.editRecord.id,
            },
            initPayload: {
                company_id:this.state.selectStatus,
                name:this.state.searchName
            },
            parentVm: this,
            InputItems: [{
                type: "Input",
                labelName: "@SSID",
                valName: "ssid",
                nativeProps: {
                    placeholder: "@请输入SSID",
                    disabled:this.state.editId ?true:false
                },
                rules: [{required: true, message:"@请输入SSID"},{max: 32, message: '@SSID最多输入32字符'},{min: 8, message: '@SSID最少输入8字符'}],
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
                rules: [{required: !this.state.disabled, message:"@请输入密码"},{max: 32, message: '@密码最多输入16字符'},{min: 8, message: '@密码最少输入8字符'}],
            }, {
                type: "Radio",
                labelName: "@隐藏SSID",
                valName: "ssid_is_hidden",
                nativeProps: {
                    placeholder: "@请选择VLAN"
                },
                rules: [{required: true, message: "@请选择VLAN"}],
                children: [{value: true, name: "@是", key: "1"}, {
                    value: false,
                    name: "@否",
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
                valName: "cta_lan_id",
                nativeProps: {
                    placeholder:"@请选择网段"
                },
                rules: [{required: true, message: "@请选择网段"}],
                children:this.state.CPE?templateOptions:aptemplateOptions

            },
        ]
        };
        return (
            <Card className="card">
 <HeaderBar hasSearch={true} 
                            hasSelect={true}
                            hasSelectTwo={true}
                            selectTwoMethod={this.changeCPE}
                            selectTwoDefaultValue="cpe"
                            optionsTwo={optionsTwo}
                            selectPlaceHolder={'@请选择企业名称'}
                            selectOneWidth={220}
                            selectOneMethod={this.handleSelectStatus}
                            options={option}
                            hasDelete={false}
                            submit={this.search}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            selectOneShowSearch={true}/> 
                <BossTable columns={columns} dataSource={this.props.bi1904Info.dataSource} />
                <BossEditModal {...ModalOptions} />
                {/* 点击设备名称弹出wifi配置 */}
                <Modal          
                title="WIFI Config"
                visible={this.state.configvisible}
                onOk={this.configSubmit}
                onCancel={this.configCancel}>
                    <div dangerouslySetInnerHTML={{__html:this.props.bi1904Info.configSource}}></div>
                </Modal>
            </Card>
        )
    }
}

export default injectIntl(BI1904);