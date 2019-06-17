/*@运维-设备出/入库*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Form, Select, Input, Card,Col,Table,Upload,Button,Icon,message} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
import {domain} from '../../../../utils/commonConsts';
import {commonTranslate} from "../../../../utils/commonUtilFunc";
import Cookies from 'js-cookie'
const FormItem = Form.Item;
const Option = Select.Option;

class StockInModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadModalShow:false,
            selectedRowKeys:[],
            sn:[],
            require:false
        }
    }

    componentDidMount =()=>{
        this.props.onRef(this)
        this.get_device_model()
    }
    handleScan = (e) => {
        if (e.keyCode === 13) {
            this.props.form.validateFields((err, values) => {
            if (!err) {
            if(e.target.value===""){
                message.error("@请输入序列号");
            }else{
                /*取消判断单条录入重复，会导致删除单条记录无法增加*/ 
                // if(sn.indexOf(value)===-1){
                    let a = this.props.mi2001Info.dataSourceScan.length;
                    let key = this.props.mi2001Info.dataSourceScan[a-1].key
                    let object = {}
                    let value=this.props.form.getFieldsValue();
                    object.hard_sn=value["hard_sn"+key]
                    object.model=value["model"+key]
                    object.name=value["name"+key]
                    object.remark=value["remark"+key]
                    this.props.dispatch({
                        type: "mi2001Info/addDataSource",
                        payload: {
                            Object:object
                        }
                    });
                // }else{
                //     message.error("此序列号已存在，无需重复添加");
                // }

            }
            }
        }) 
        }
    };
    get_device_model = () => {
        this.props.dispatch({
            type: "mi2001Info/get_device_model",
            payload: {}
        })
    };
    handleChange=(value) =>{
        let that = this
        let num = this.props.mi2001Info.dataSourceScan.length;
        let key = this.props.mi2001Info.dataSourceScan[num-1].key
        this.setState({
            selectedModel:value,
            selectedName:value,
        },()=>{
            let a = {}
            a["name"+key]=value
            that.props.form.setFieldsValue(a)
        })
      }
      hostChange=(value)=>{
        this.setState({
            selectedName:value,
        })
      }
    remark=(e)=>{
    const value=e.target.value
    this.setState({
        selectedRemark:value,
        //selectedName:value,
    })
    }
    create_stock_batch=(value,arr,that)=>{
        this.props.dispatch({
            type: "mi2001Info/create_stock_batch",
            payload: {
                init:{
                    client:value["client"],
                    remark:value["remark"],
                    stocks:arr,
                },
                select:this.props.select,
                vm:that,
            }
        })
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
    Submit=(e)=>{
            this.props.form.validateFields((err, values) => {
                let that = this
                let a = this.props.mi2001Info.dataSourceScan.length;
                let value=this.props.form.getFieldsValue();
                //判断提交时是否有重复sn
                let b=new Set();
                let snArr = []
                for(let i = 0 ; i < a;i++){
                    snArr.push(value["hard_sn"+this.props.mi2001Info.dataSourceScan[i].key])
                }
                let c=snArr.map((item)=>{
                    let result=b.has(item)?item:""
                    b.add(item);
                    return result;
                }).filter((item)=>{
                    return item!==""
                });
                //没有重复的情况下进行保存判断
                if(c.length===0){
                    let arr= []
                    //判断是否是最后一行sn字段没有输入，如果没有输入将不会push到object中，并且client字段必须输入
                    if(a===1){
                        if (!err) {
                            for(let i = 0 ; i < a;i++){
                                const object={};
                                object.serial_number=i+1
                                // object.is_reserved=value["is_reserved"+i]
                                object.hard_sn=value["hard_sn"+this.props.mi2001Info.dataSourceScan[i].key]
                                object.model=value["model"+this.props.mi2001Info.dataSourceScan[i].key]
                                object.name=value["name"+this.props.mi2001Info.dataSourceScan[i].key]
                                object.remark=value["remark"+this.props.mi2001Info.dataSourceScan[i].key]?value["remark"+this.props.mi2001Info.dataSourceScan[i].key]:""
                                arr.push(object)
                            }
    
                            this.create_stock_batch(value,arr,that)
                        }
                    }else{
                        if(err?err["hard_sn"+this.props.mi2001Info.dataSourceScan[a-1].key]:""&&err["client"]){
                            for(let i = 0 ; i < a-1;i++){
                                const object={};
                                object.serial_number=i+1
                                // object.is_reserved=value["is_reserved"+i]
                                object.hard_sn=value["hard_sn"+this.props.mi2001Info.dataSourceScan[i].key]
                                object.model=value["model"+this.props.mi2001Info.dataSourceScan[i].key]
                                object.name=value["name"+this.props.mi2001Info.dataSourceScan[i].key]
                                object.remark=value["remark"+this.props.mi2001Info.dataSourceScan[i].key]?value["remark"+this.props.mi2001Info.dataSourceScan[i].key]:""
                                arr.push(object)
                            }
    
                            this.create_stock_batch(value,arr,that)
    
                        }
                        if (!err) {
                            for(let i = 0 ; i < a;i++){
                                const object={};
                                object.serial_number=i+1
                                // object.is_reserved=value["is_reserved"+i]
                                object.hard_sn=value["hard_sn"+this.props.mi2001Info.dataSourceScan[i].key]
                                object.model=value["model"+this.props.mi2001Info.dataSourceScan[i].key]
                                object.name=value["name"+this.props.mi2001Info.dataSourceScan[i].key]
                                object.remark=value["remark"+this.props.mi2001Info.dataSourceScan[i].key]?value["remark"+this.props.mi2001Info.dataSourceScan[i].key]:""
                                arr.push(object)
                            }
                            this.create_stock_batch(value,arr,that)
    
                        }
                    }
                }else{
                    message.error("@请勿重复输入序列号"+c);
                }
            })

    };
    //批量上传
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
    handleUploadComplete = ({file}) => {
        if (file.status === "done") {
            this.props.dispatch({
                type: "mi2001Info/batchAddDataSource",
                payload: {
                    Object:file.response.result
                }
            }).then(()=>{
                this.setState({
                    uploadModalShow: false,
                })
            });
        }
    };
    checkBeforeUpload = (file) => {
        const name = file.name;
        let index1 = name.lastIndexOf(".");
        let index2 = name.length;
        let suffix = name.substring(index1 + 1, index2);
        const isXls = suffix === "xls";
        if (!isXls) {
            Modal.error({
                title: "@请上传xls类型文件"
            })
        }
        return isXls;
    };
    delete=()=>{
        this.props.dispatch({
            type: "mi2001Info/deleteDataSource",
            payload: {
                deleteIds:this.state.selectedRowKeys
            }
        }).then(()=>{
            this.setState({
                selectedRowKeys:[]
            },
            // ()=>{
                    
            //     let value = this.props.mi2001Info.dataSourceScan
            //     let object={}
            //     for(let i=0;i<this.props.mi2001Info.dataSourceScan.length;i++){
            //         object.serial_number=i+1
            //         // object["is_reserved"+i]=value[i].is_reserved
            //         object["hard_sn"+i]=value[i].hard_sn
            //         object["model"+i]=value[i].model
            //         object["name"+i]=value[i].name
            //         object["remark"+i]=value[i].remark
            //     }
                
            //     vm.props.form.setFieldsValue(
            //         object
            //     );
            // }
            )
        }
        )
    }
    render() {
        const inEnglish = window.appLocale.locale === "en-US";
        const {getFieldDecorator} = this.props.form;
        const rowSelection = {
            fixed: true,
            selectedRowKeys:this.state.selectedRowKeys,
            columnWidth:"20px",
            onChange: (selectedIds,selectedRecords) => {
                this.setState({
                    selectedRowKeys:selectedIds
                })
            }
        };
        const Columns = [
            {
                title: "@序号",
                dataIndex: 'id',
                key: 'id',
                width:"45px",
                render:(index,record,a)=>{
                    return <span>{a+1}</span>
                }
            },
            {
                title: <span style={{color:"red"}}>*  <span style={{color:"black"}}>{"@设备型号"}</span></span>,
                dataIndex: 'model',
                key: 'model',
                render: (index, record,a) => {
                    return <FormItem className="mi2001Input" style={{padding:0,margin:0}}>
                        {getFieldDecorator("model"+record.key, {
                            rules: [{required: true, message:"@请选择设备型号"},],
                            initialValue:record.model
                        
                        })(
                            <Select style={{ width: 150 }} onChange={this.props.mi2001Info.dataSourceScan.length-1===a?this.handleChange:""}>
                                {this.props.mi2001Info.deviceModelList.map((model) => {
                                    return <Option value={model.model} key={model.id}>{model.model}</Option>
                                })}
                            </Select>,
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
                            rules: [{required: true, message: "@请输入设备名称"},{max: 64, message: "@最大长度64位"}],
                            initialValue:record.name

                        })(
                            <Input onChange={this.props.mi2001Info.dataSourceScan.length-1===a?this.hostChange:""} key={a}/>
                        )}
                    </FormItem>
                }
            },
            {
                title: "@备注",
                dataIndex: 'remark',
                key: 'remark',
                render: (index, record,a) => {
                    return <FormItem className="mi2001Input" style={{padding:0,margin:0}}>
                        {getFieldDecorator("remark"+record.key, {
                            initialValue:record.remark,
                            rules: [{max:128,message: "@最大长度128位"}],
                        })(
                            <Input  onChange={this.props.mi2001Info.dataSourceScan.length-1===a?this.remark:""}/>
                        )}
                    </FormItem>
                }
            },{
                title: <span style={{color:"red"}}>*  <span style={{color:"black"}}>{"@序列号"}</span></span>,
                dataIndex: 'hard_sn',
                key: 'hard_sn',
                render: (index, record,a) => {
        
                    return <FormItem className="mi2001Input" style={{padding:0,margin:0}}>
                        {getFieldDecorator("hard_sn"+record.key,  {
                            rules: [{required: true, message: "@请输入序列号"},{
                                pattern: /^[A-Za-z0-9]+$/,
                                message: "@只可输入英文和数字"
                            },{max: 64, message: "@最大长度64位"}],
                            initialValue:record.hard_sn

                        })(
                            <Input  onKeyDown={this.props.mi2001Info.dataSourceScan.length-1===a?(e) => this.handleScan(e):()=>{}}  autoFocus={this.props.mi2001Info.dataSourceScan.length-1===a&&this.props.mi2001Info.dataSourceScan.length!==1?true:false}/>
                        )}
                    </FormItem>
                },
            }, ];
        return <Modal width="900px" maskClosable={false} visible={this.props.visible} title={"@设备入库"}
                      onCancel={this.props.cancel} onOk={this.Submit} destroyOnClose >
                    <div>
                        <Col style={{background:"#F0F2F5",padding:"20px",height:inEnglish?"120px":"80px"}}>
                            <Form layout="inline"  >
                                <FormItem label={"@供应商"} labelCol={{span: 7, offset: 0}} wrapperCol={{span: 16, offset: 0}}>
                                    {getFieldDecorator('client', {
                                        rules: [{required: true, message: "@请输入供应商"},{max: 64, message: "@最大长度64位"}],
                                    })(
                                        <Input placeholder={"@请输入供应商"}/>
                                    )}
                                </FormItem>
                                <FormItem label={"@说明"} >
                                    {getFieldDecorator('remark', {
                                        rules: [{max:128,message: "@最大长度128位"}],
                                    })(
                                        <Input style={{width:485}} placeholder={"@请输入说明"}/>
                                    )}
                                </FormItem>
                            </Form>
                        </Col>
                        <Card className="card" style={{position:"relative"}}>
                            <span style={{position:"absolute",top:"37px",right:"22px",color:"#1890FF",fontSize:"14px"}}>
                            <Icon type="info-circle" /> {"@在【序列号】单元格内按回车键，可新增一行"}</span>
                            <HeaderBar hasAdd={true} addAlias={"@批量导入"} add={this.handelUploadModalShow} hasDelete={true} selectedKeys={this.state.selectedRowKeys} delete={this.delete}/>
                            <Form >
                            <Table bordered size="middle" rowKey={record => record.id} pagination={false} onRow={this.onRow}
                    rowClassName="normal" rowSelection={rowSelection} columns={Columns} dataSource={this.props.mi2001Info.dataSourceScan}/>
                            </Form>
                        </Card>
                    </div>
                <Modal maskClosable={false} title={<span>{"@提示:批量导入的文件必须使用提供的模板才能成功"}</span>}
                       onCancel={this.handelUploadModalClose}
                       destroyOnClose
                       visible={this.state.uploadModalShow} style={{textAlign: "center"}} width={525} footer={null}>
                    <div style={{height: 200}}>
                        <Upload showUploadList={false} action="/v1/company/import_stock_info/"
                                onChange={this.handleUploadComplete} beforeUpload={this.checkBeforeUpload}
                                headers= {{"X-CSRFToken": Cookies.get('csrftoken')}}
                                >
                            <Button style={{marginTop: 64}}
                                    type="primary">{"@上传文件"}</Button>
                        </Upload>
                       <div style={{marginTop: 16}}>{"@没有模板"},<a href={domain + "/v1/company/download_stock_template/"}>{"点击下载"}</a></div>

                    </div>
                </Modal>
        </Modal>
    }

}

function mapDispatchToProps({mi2001Info}) {
    return {mi2001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(StockInModal)));