/*@运维-设备出/入库*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Form, Select, Input, Card,Col,Table,Checkbox,Icon,Row,message} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
import {injectIntl} from "react-intl";
import {commonTranslate} from "../../../../utils/commonUtilFunc";
const FormItem = Form.Item;
const Option = Select.Option;

class StockOutModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadModalShow:false,
            selectedRowKeys:[],
            selectedRecords:{},
            ztp:false,
            //比对sn看是否重复
            sn:[],
            osDisabled:false
        }
        this.lastValueSn=""
    }

    componentDidMount =()=>{
        this.get_company_list()
        this.props.onRef(this)
    }
    onRow = (record) => {
        return {
            onMouseEnter: (event) => {
                this.setState({
                    selectedRowKeys:this.state.selectedRowKeys
                })
            },  // 鼠标移入行
            onMouseLeave: (event) => {
                this.setState({
                    selectedRowKeys:this.state.selectedRowKeys
                })
            }
        };
    }
    handleScan = (e) => {
        if (e.keyCode === 13) {
        var values = e.target.value
        let sn = this.props.mi2001Info.snArr
        let dataSources = this.props.mi2001Info.dataSource
            // if(dataSources.indexOf({key:})===-1){

            // }
            //判断序列号是否为空
            if(values===""){
                message.error("@请输入序列号");
            }else{
                //判断序列号是否重复
                if(sn.indexOf(values)===-1){
                    let value=this.props.form.getFieldsValue();
                    //防抖
                    if(this.lastValueSn===e.target.value){
                        console.log("相等")
                    }else{ 
                        this.lastValueSn=e.target.value
                        this.get_stock_list(e.target.value,value["os"])
                    }
                }else{
                    message.error("@此序列号已存在，无需重复添加");
                }
            }
       
        }

    };
    // Blur = (e) => {
    //     var values = e.target.value
    //     console.log(this.state.sn)
    //     let sn = this.state.sn.concat()
    //         //判断序列号是否为空
    //         if(values===""){
    //             const __=commonTranslate(this);
    //             message.error(__(messages["请输入序列号"]));
    //         }else{
    //             //判断序列号是否重复
    //             if(this.state.sn.indexOf(values)===-1){
    //                 let values = e.target.value
    //                 sn.push(values)
    //                 this.setState({
    //                     sn:sn
    //                 })
    //                 let value=this.props.form.getFieldsValue();
    //                 console.log(this.state.sn)
    //                 this.get_stock_list(e.target.value,value["os"])
    //             }else{
    //                 message.error("无此序列号");
    //             }
    //         }
    // };
    hostChange=(value)=>{
        this.setState({
            selectedName:value,
        })
    }
    remark=(e)=>{
        const value=e.target.value
        this.setState({
            selectedRemark:value,
        })
    }
    Submit=(e)=>{
        let value=this.props.form.getFieldsValue();
        let hardware_type=value["device_type"];
        let ztpOn=value["by_ztp"];
        let dataSources = this.props.mi2001Info.dataSource
        let datalength = dataSources.length
        var wrong = 0

        //进行出库操作
        var stockOut=()=>{
            this.props.form.validateFields((err, values) => {
                let that = this
                if (!err) {
                    let value=this.props.form.getFieldsValue();
                    let a = this.props.mi2001Info.dataSource.length;
                    let arr= []
                    //i<a-1,最后一行空数据不会push到arr里面
                    for(var i = 0 ; i < a-1;i++){
                        const object={};
                        object.id=this.props.mi2001Info.dataSource[i].id
                        object.serial_number=i+1
                        object.hard_sn=value["hard_sn"+this.props.mi2001Info.dataSource[i].key]
                        object.model=value["model"+this.props.mi2001Info.dataSource[i].key]
                        object.sn=value["sn"+this.props.mi2001Info.dataSource[i].key]
                        object.name=value["name"+this.props.mi2001Info.dataSource[i].key]
                        arr.push(object)
                    }
                    this.props.dispatch({
                        type: "mi2001Info/out_stock_batch",
                        payload: {
                            init:{
                                device_type:value["device_type"],
                                company_id:value["company_id"],
                                delivery_company:value["delivery_company"],
                                remark:value["remark"],
                                os:value["os"],
                                agency_id:value["agency_id"],
                                delivery_number:value["delivery_number"],
                                by_ztp:value["by_ztp"],
                                stocks:arr,
                            },
                            select:this.props.select,
                            vm:that,
                        }
                    })
                }
            })
        }
        //判断设备型号CPE设备不能作为AP来出库
        var TypeJudge  = ()=>{
            let dataSources = this.props.mi2001Info.dataSource
            console.log(dataSources)
            if(hardware_type==="AP"){
                dataSources.map((item)=>{
                    if(item.hardware_type){
                        if(item.hardware_type!=="AP"){
                            message.error("@序列号为"+item.hard_sn+"@的设备不能作为AP出库") 
                            wrong++
                        }
                    }
                })
                if(!wrong){
                    stockOut()
                }
            }else{
                dataSources.map((item)=>{
                    if(item.hardware_type){
                        if(item.hardware_type==="AP"){
                            message.error("@序列号为"+item.hard_sn+"@的设备不能作为BCPE/HCPE出库")
                            wrong++
                        }
                    }
                })
                if(!wrong){
                    stockOut()
                }
            }
        }
        //判断开启ztp，设备型号不允许有docker，vm
        var ztpJudge = ()=>{
            let dataSources = this.props.mi2001Info.dataSource
            if(ztpOn){
                console.log(ztpOn)
                dataSources.map((item)=>{
                    if(item.hardware_type){
                        if(item.hardware_type==="Docker"||item.hardware_type==="VM"){
                            message.error("@序列号为"+item.hard_sn+"@的"+item.model+"@设备,暂不支持ZTP流程") 
                            wrong++
                        }
                    }
                })
                if(!wrong){
                    TypeJudge()
                }
            }else{
                TypeJudge()
            }
        }
        //删除最后一项空数据
        // if(!dataSources[datalength-1].hard_sn){
        //     this.props.dispatch({
        //         type: "mi2001Info/submitDeleteOutDataSource",
        //         payload: {
        //             deleteIds:[datalength-1]
        //         }
        //     }).then(()=>{
        //         TypeJudge()
        //     })
        // }else{
            ztpJudge()
        //}



    };


    delete=()=>{
        let vm = this

        this.props.dispatch({
            type: "mi2001Info/deleteOutDataSource",
            payload: {
                deleteIds:this.state.selectedRowKeys
            }
        }).then(()=>{
            let dataSources = this.props.mi2001Info.dataSource
            if(dataSources.length=1){
                this.setState({
                    osDisabled:false
                })
            }
            this.lastValueSn=""
            // console.log(this.state.sn)
            // console.log(this.state.selectedRecords)
            // let deleteSn = this.state.sn
            // this.state.selectedRecords.map((item)=>{
            //     console.log(item.hard_sn)
            //     if(deleteSn.indexOf(item.hard_sn)===-1){
            //         console.log(this.state.sn)
            //     }else{
            //         deleteSn.splice(deleteSn.indexOf(item.hard_sn),1)
            //         console.log(deleteSn)
            //         this.setState({
            //             sn:deleteSn
            //         })
            //         //message.error("无此序列号");
            //     }
            // })
            this.setState({
                selectedRecords:{},
                selectedRowKeys:[]
            },
            )
            }
        )
    }
    get_company_list = () => {
        this.props.dispatch({
            type: "mi2001Info/get_company_list",
            payload: {}
        })
    };
    get_agency_list = (value) => {
        this.props.dispatch({
            type: "mi2001Info/get_agency_list",
            payload: {
                company_id:value,
                //type:"CSTEP"
            }
        });
    };
    get_stock_list = (value,os)=>{
        this.props.dispatch({
            type: "mi2001Info/get_stock_list",
            payload: {
                hard_sn:{hard_sn:value},
                os:os,
            }
        }).then(()=>{
            let dataSources = this.props.mi2001Info.dataSource
            if(dataSources.length>1){
                this.setState({
                    osDisabled:true
                })
            }
            
        });
    }
    handleChange = (e) => {
        this.setState({
            ztp:!this.state.ztp
        })
      }
    changeCompany=(a)=>{
        this.get_agency_list(a)
        this.props.form.setFieldsValue({"agency_id":undefined,})
    }
    render() {
        const __=commonTranslate(this);
        const {getFieldDecorator} = this.props.form;
        const inEnglish = window.appLocale.locale === "en-US";
        const rowSelection = {
            fixed: true,
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: (selectedIds,selectedRecords) => {
                this.setState({
                    selectedRowKeys:selectedIds,
                    selectedRecords:selectedRecords
                })
            }
        };
        const modalFormLayout = {
            labelCol: {
                xs: {span: 7},
            },
            wrapperCol: {
                xs: {span: 14},
            },
        };
        const options = this.props.mi2001Info.companyList.map((item) => {
            return (<Option value={item.id} key={item.id}>{item.company_abbr}</Option>)
        });
        const Columns = [
            {
                title: "@序号",
                dataIndex: 'index',
                key: 'index',
                render:(index,record,a)=>{
                    return <span>{a+1}</span>
                }
            },
            {
                title: <span style={{color:"red"}}>*  <span style={{color:"black"}}>{"@序列号"}</span></span>,
                dataIndex: 'hard_sn',
                key: 'hard_sn',
                render: (index, record,a) => {
                    return <FormItem className="mi2001Input" style={{padding:0,margin:0}}>
                        {getFieldDecorator("hard_sn"+record.key,  {
                            rules: [{required: a==0?true:this.props.mi2001Info.dataSource.length-1!==a, message: "@请输入序列号"},{
                                pattern: /^[A-Za-z0-9]+$/,
                                message: "@只可输入英文和数字"
                            },{max: 64, message: "@最大长度64位"}],
                            initialValue:record.hard_sn

                        })(
                            <Input  disabled={record.disabled}
                            onKeyDown={this.props.mi2001Info.dataSource.length-1===a?(e) => this.handleScan(e):()=>{}}  
                            autoFocus={this.props.mi2001Info.dataSource.length-1===a}
                            //onBlur={this.props.mi2001Info.dataSource.length-1===a?(e) => this.Blur(e,index):()=>{}}
                            />
                        )}
                    </FormItem>
                },
            }, {
                title: "@设备型号",
                dataIndex: 'model',
                key: 'model',
                render: (index, record,a) => {
                    return <FormItem className="mi2001Input" style={{padding:0,margin:0}}>
                        {getFieldDecorator("model"+record.key, {
                            //rules: [{required: true, message: "请选择设备型号"},],
                            rules: [{required:a==0?true:this.props.mi2001Info.dataSource.length-1!==a,  message: "@请输入设备型号"}],
                            initialValue:record.model

                        })(
                            <Input disabled={true} onChange={this.props.mi2001Info.dataSource.length-1===a?this.hostChange:""}/>

                        )}
                    </FormItem>
                }
            }, {
                title: "@硬件ID",
                dataIndex: 'sn',
                key: 'sn',
                render: (index, record,a) => {
                    return <FormItem className="mi2001Input" style={{padding:0,margin:0}}>
                        {getFieldDecorator("sn"+record.key, {
                            rules: [{required:a==0?true:this.props.mi2001Info.dataSource.length-1!==a,  message: "@请输入硬件ID"}],
                            initialValue:record.sn

                        })(
                            <Input disabled={true} onChange={this.props.mi2001Info.dataSource.length-1===a?this.hostChange:""} />
                        )}
                    </FormItem>
                }
            }, {
                title: <span style={{color:"red"}}>*  <span style={{color:"black"}}>{"@设备名称"}</span></span>,
                dataIndex: 'name',
                key: 'name',
                render: (index, record,a) => {
                    return <FormItem className="mi2001Input" style={{padding:0,margin:0}}>
                        {getFieldDecorator("name"+record.key, {
                            initialValue:record.name,
                            rules: [{required:a==0?true:this.props.mi2001Info.dataSource.length-1!==a,  message: "@请输入设备名称"},{
                            },{max: 64, message: "@最大长度64位"}],
                        })(
                            <Input  onChange={this.props.mi2001Info.dataSource.length-1===a?this.remark:""}/>
                        )}
                    </FormItem>
                }
            },];
        return <Modal width="1063px" maskClosable={false} visible={this.props.visible} title={"@设备出库"}
                      onCancel={this.props.cancel} onOk={this.Submit} destroyOnClose >
                       
                    <Form  layout="horizontal" >
                        {inEnglish?<Row style={{background:"#F0F2F5",padding:"20px",height:"220px"}}>
                            <Col span={12}>  
                                <FormItem label={"@设备类型"}  {...modalFormLayout}>
                                    {getFieldDecorator("device_type", {
                                        rules: [{required: true, message: "@请选择设备类型"},],
                                        initialValue:"STEP"
                                    })(
                                        //<Input key={record.id}/>
                                    <Select placeholder={"@请选择设备类型"}>
                                        <Option key="STEP" value="STEP">BCPE</Option>
                                        <Option key="CSTEP" value="CSTEP">HCPE</Option>
                                        <Option kkey="AP" value="AP">AP</Option>
                                    </Select>,
                                    )}
                                </FormItem>
                                <FormItem label={"@操作系统"} {...modalFormLayout}>
                                    {getFieldDecorator("os", {
                                        rules: [{required: true, message: "@请选择操作系统"},],
                                        initialValue:"Openwrt-Mips",
                                    })(
                                        //<Input key={record.id}/>
                                    <Select  disabled={this.state.osDisabled} placeholder={"@请选择操作系统"} >
                                        <Option value="Openwrt-Mips">Openwrt-Mips</Option>
                                        <Option value="Openwrt-x86">Openwrt-x86</Option>
                                        <Option value="CentOS">CentOS</Option>
                                    </Select>,
                                    )}
                                </FormItem>
                                <FormItem label={"@快递公司"} {...modalFormLayout}>
                                    {getFieldDecorator('delivery_company', {
                                       rules: [{max: 128, message: "@最大长度128位"}],

                                    })(
                                        <Input  placeholder={"@请输入快递公司"}/>
                                    )}
                                </FormItem>
                                <FormItem label={"@快递单号"} {...modalFormLayout}>
                                    {getFieldDecorator('delivery_number', {
                                       rules: [{max: 64, message: "@最大长度64位"}],
                                        // rules: [{required: true, message: "请输入说明"},],
                                    })(
                                        <Input  placeholder={"@请输入快递单号"}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>

                                <Form.Item label="@ZTP流程" {...modalFormLayout}>
                                    {getFieldDecorator('by_ztp', {
                                        initialValue: false,
                                    })(
                                        <Checkbox checked={this.state.ztp} onChange={this.handleChange}>@启用ZTP流程</Checkbox>
                                    )}
                                </Form.Item>
                                <FormItem label={"@企业名称"} {...modalFormLayout}>
                                    {getFieldDecorator("company_id", {
                                        rules: [{required: true, message: "@请选择企业名称"},],
                                        // initialValue:record.is_reserved
                                    })(
                                        //<Input key={record.id}/>
                                    <Select  placeholder={"@请选择企业名称"}
                                    showSearch={true}
                                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                     onChange={(value) => this.changeCompany(value, this)} >
                                        {options}
                                    </Select>,
                                    )}
                                </FormItem>
                                <FormItem label={"@节点名称"} {...modalFormLayout}>
                                    {getFieldDecorator("agency_id", {
                                        rules: [{required:this.state.ztp?false:true, message: "@请选择节点"},],
                                        //rules: [{required:true, message: "请选择节点"},],
                                    })(
                                        //<Input key={record.id}/>
                                     <Select  
                                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                     showSearch={true} placeholder={"@请选择节点名称"}>
                                        {this.props.mi2001Info.agencyList?this.props.mi2001Info.agencyList.map((item) => {
                                            return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                                        }):""}
                                    </Select>,
                                    )}
                                </FormItem>
                                <FormItem label={"@备注"} {...modalFormLayout}>
                                    {getFieldDecorator('remark', {
                                        rules: [{max: 128, message: "@最大长度128位"}],                                        
                                    })(
                                        <Input  placeholder={"@请输入备注"}/>
                                    )}
                                </FormItem>

                            </Col>
                        </Row>:<Row style={{background:"#F0F2F5",padding:"20px",height:"210px"}}>
                            <Col span={8}>  
                                <FormItem label={"@设备类型"}  {...modalFormLayout}>
                                    {getFieldDecorator("device_type", {
                                        rules: [{required: true, message: "@请选择设备类型"},],
                                        initialValue:"STEP"
                                    })(
                                        //<Input key={record.id}/>
                                    <Select placeholder={"@请选择设备类型"}>
                                        <Option key="STEP" value="STEP">BCPE</Option>
                                        <Option key="CSTEP" value="CSTEP">HCPE</Option>
                                        <Option kkey="AP" value="AP">AP</Option>
                                    </Select>,
                                    )}
                                </FormItem>
                                <FormItem label={"@操作系统"} {...modalFormLayout}>
                                    {getFieldDecorator("os", {
                                        rules: [{required: true, message: "@请选择操作系统"},],
                                        initialValue:"Openwrt-Mips"
                                    })(
                                        //<Input key={record.id}/>
                                    <Select disabled={this.state.osDisabled} placeholder={"@请选择操作系统"} >
                                        <Option value="Openwrt-Mips">Openwrt-Mips</Option>
                                        <Option value="Openwrt-x86">Openwrt-x86</Option>
                                        <Option value="CentOS">CentOS</Option>
                                    </Select>,
                                    )}
                                </FormItem>
                                
                            </Col>
                            <Col span={8}>

                                <Form.Item label="@ZTP流程" {...modalFormLayout}>
                                    {getFieldDecorator('by_ztp', {
                                        initialValue: false,
                                    })(
                                        <Checkbox checked={this.state.ztp} onChange={this.handleChange}>@启用ZTP流程</Checkbox>
                                    )}
                                </Form.Item>
                                <FormItem label={"@企业名称"} {...modalFormLayout}>
                                    {getFieldDecorator("company_id", {
                                        rules: [{required: true, message: "@请选择企业名称"},],
                                        // initialValue:record.is_reserved
                                    })(
                                        //<Input key={record.id}/>
                                    <Select  placeholder={"@请选择企业名称"}
                                     showSearch={true}
                                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                     onChange={(value) => this.changeCompany(value, this)} >
                                        {options}
                                    </Select>,
                                    )}
                                </FormItem>
                                <FormItem label={"@节点名称"} {...modalFormLayout}>
                                    {getFieldDecorator("agency_id", {
                                        rules: [{required:this.state.ztp?false:true, message: "@请选择节点"},],
                                        //rules: [{required:true, message: "请选择节点"},],
                                    })(
                                        //<Input key={record.id}/>
                                    <Select  placeholder={"@请选择节点名称"} 
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    showSearch={true}>
                                        {this.props.mi2001Info.agencyList?this.props.mi2001Info.agencyList.map((item) => {
                                            return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                                        }):""}
                                    </Select>,
                                    )}
                                </FormItem>


                            </Col>
                            <Col span={8}>
                            <FormItem label={"@快递公司"} {...modalFormLayout}>
                                    {getFieldDecorator('delivery_company', {
                                       rules: [{max: 128, message: "@最大长度128位"}],

                                    })(
                                        <Input  placeholder={"@请输入快递公司"}/>
                                    )}
                                </FormItem>
                                <FormItem label={"@快递单号"} {...modalFormLayout}>
                                    {getFieldDecorator('delivery_number', {
                                       rules: [{max: 64, message: "@最大长度64位"}],
                                        // rules: [{required: true, message: "请输入说明"},],
                                    })(
                                        <Input  placeholder={"@请输入快递单号"}/>
                                    )}
                                </FormItem>
                                <FormItem label={"@备注"} {...modalFormLayout}>
                                    {getFieldDecorator('remark', {
                                        rules: [{max: 128, message: "@最大长度128位"}],                                        
                                    })(
                                        <Input  placeholder={"@请输入备注"}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>}
                    </Form>
                    <div style={{clear:"both"}}></div> 
                    <Card className="card" style={{position:"relative"}}>
                            <span style={{position:"absolute",top:"37px",right:"32px",color:"#1890FF",fontSize:"14px"}}>
                            <Icon type="info-circle" />@在【序列号】单元格内按回车键，可新增一行</span>
                        <HeaderBar hasDelete={true} selectedKeys={this.state.selectedRowKeys} delete={this.delete}/>
                        <Form>
                        <Table bordered size="middle" rowKey={record => record.index} pagination={false} onRow={this.onRow}
                rowClassName="normal" rowSelection={rowSelection} columns={Columns} dataSource={this.props.mi2001Info.dataSource}/>
                        </Form>
                    </Card>
        </Modal>
    }

}

function mapDispatchToProps({mi2001Info}) {
    return {mi2001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(StockOutModal)));