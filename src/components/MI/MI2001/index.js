/*@运维-设备出/入库*/
import React from 'react';
import { withRouter} from 'react-router-dom'
import {Card,Popconfirm,Select} from 'antd';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import StockInModal from "./subComponents/StockInModal";
import StockInNumberModal from "./subComponents/StockInNumberModal";
import StockOutModal from "./subComponents/StockOutModal";
import BossEditModal from "../../Common/BossEditModal";
import StockOutNumberModal from "./subComponents/StockOutNumberModal";
import {commonTranslate} from "../../../utils/commonUtilFunc";
const Option = Select.Option;
class MI2001C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleStockIn:false,
            visibleStockOut:false,
            visibleStockInNumber:false,
            visibleStockOutNumber:false,
            getName:"",
            getType:"",
            editRecord:{},
            deliveryModalShow:false,
        };
        this.ref={};
        this.ref2={}
    }

    componentDidMount() {
        this.get_stock_operation();
        this.get_company_list();
    }
    delete = (record) => {
        this.props.dispatch({
            type: "mi2001Info/undo_stock_operation",
            payload: {
                id:{id:record.id},
                init:{name:this.state.getName,operation_type:this.state.getType}
            }
        })
    };
    get_company_list = () => {
        this.props.dispatch({
            type: "mi2001Info/get_company_list",
            payload: {}
        })
    };
    get_stock_operation = () => {
        this.props.dispatch({
            type: "mi2001Info/get_stock_operation",
            payload: {
                name:this.state.getName,
                operation_type:this.state.getType
            }
        });
    };
    search = (value) => {
        this.setState({
            getName: value || ""
        }, ()=>{
            this.get_stock_operation();
        })
    };
    handleSelect=(value)=>{
        this.setState({
            getType:value||""
        },()=>{
            this.get_stock_operation();
        })
    }
    showModal = (record) =>{
        this.setState({
            editRecord:record,
            deliveryModalShow:true
        })
    };
    closeAddModal = ()=>{
        this.setState({
            editRecord:{},
            deliveryModalShow:false
        },()=>{
            this.get_stock_operation();
        })
    }
    onRef=(vm)=>{
        this.ref=vm;
    };
    onRef2=(vm)=>{
        this.ref2=vm;
    };
    handleOpenStockIn = (record) =>{
        this.ref2.setState({
            sn:[],
        },()=>{
            //改变selectedRowKeys使选择框对齐
            this.ref2.setState({
                selectedRowKeys:[]
            })
            this.ref2.get_device_model()
        })
        this.setState({
            visibleStockIn: true,
        })
    };
    closeStockIn = () => {
        this.setState({
            visibleStockIn:false,
        },()=>{
            this.props.dispatch({
                type: "mi2001Info/closeDataSourceScan",
                payload: {
                  
                }
            });
        })
    };
    closeStockInNumber = () => {
        this.setState({
            visibleStockInNumber:false,
        })
    };
    closeStockOutNumber = () => {
        this.setState({
            visibleStockOutNumber:false,
        })
    };

    showStockInNumber = (record) => {
        this.setState(record.operation_type==="IN"?{
            visibleStockInNumber:true,
        }:{
            visibleStockOutNumber:true,
        },()=>{
            this.props.dispatch({
                type:"mi2001Info/get_stock_operation_record",
                payload:{
                    so_id:record.id
                }
            })
            
        })
    };
    handleOpenStockOut = (record) =>{
        this.ref.setState({
            sn:[],
            ztp:false,
            selectedRowKeys:[]
        })
        this.setState({
            visibleStockOut: true,
        },()=>{
            this.ref.get_company_list()
        })
    };
    closeStockOut = () => {
        this.ref.lastValueSn=""
        this.ref.setState({
            osDisabled:false
        })  
        this.setState({
            visibleStockOut:false,
        },()=>{
            this.props.dispatch({
                type: "mi2001Info/addOutDataSource",
                payload: {
                    Object:[{}]
                }
            })
            this.props.dispatch({
                type: "mi2001Info/closeStockOut",
                payload: {

                }
            });
        })
    };
    render() {
        const __=commonTranslate(this);
        const options = [<Option value="IN" key="IN">@入库</Option>,
        <Option value="OUT" key="OUT">@出库</Option>]
        const columns = [{
            title: '@日期',
            dataIndex: 'create_time',
            key: 'create_time',
        },{
            title: '@出/入库',
            dataIndex: 'operation_type',
            key: 'operation_type',
            render: (text, record) => {
                return text==="OUT"?<div  className="MI2001out">@出库</div>:<div className="MI2001in">@入库</div>
            }
        }, {
            title: '@客户/供应商',
            dataIndex: 'client',
            key: 'client',
        }, {
            title: "@数量",
            dataIndex: 'number',
            key: 'number',
            render: (text, record) => {
                return <span style={{cursor: "pointer"}} onClick={()=>this.showStockInNumber(record)} className="MI2001text">{text}</span>
            }
        }, {
            title: '@说明',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '@经办人',
            dataIndex: 'username',
            key: 'username'
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed:'right',
            align: "center",
            width:100,
            render: (index, record) => {
                return (
                    <div>
                         <Popconfirm title={"@确定删除当前信息?"} onConfirm={()=>this.delete(record)}><span className="operations-edit-btn" style={{cursor:"pointer", color:"#1890FF"}}  >@撤销</span></Popconfirm>
                        {record.operation_type==="OUT"?<span className="operations-ellipsis-btn" style={{cursor:"pointer", color:"#1890FF"}}  onClick={()=>this.showModal(record)}>@物流信息</span>:""}
                    </div>
                )
            }
        },];
        const ModalOptions = {
            title: "@编辑物流信息",
            bodyHeight:200,
            visible: this.state.deliveryModalShow,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: "mi2001Info/update_stock_operation" ,
            extraUpdatePayload: {id:this.state.editRecord.id,},
            onCancel: this.closeAddModal,
            InputItems: [{
                type: "Input",
                labelName: "@物流公司",
                valName: "delivery_company",
                nativeProps: {
                    placeholder: "@请输入物流公司"
                },
            },{
                type: "Input",
                labelName: "@物流单号",
                valName: "delivery_number",
                nativeProps: {
                    placeholder: "@请输入物流单号"
                },
            }]
        }
        return (
            <div>
                <Card className="card">
                    <HeaderBar hasSearch={true}
                                hasExtraBtnThree={true}
                                hasExtraBtnFour={true}
                                extraBtnNameThree={"@设备入库"}
                                extraBtnNameFour={"@设备出库"}
                                submit={this.search}
                                hasSelect={true}
                                options={options}
                                selectPlaceHolder={"@请选择出/入库状态"}
                                btnFourFunc={this.handleOpenStockOut}
                                btnThreeFunc={this.handleOpenStockIn}
                                selectOneMethod={this.handleSelect}
                                />
                    <BossTable columns={columns} dataSource={this.props.mi2001Info.stockOperation}
                              />

                    <StockInModal select={{name:this.state.getName,operation_type:this.state.getType}} onRef={this.onRef2} cancel={this.closeStockIn} 
                            visible={this.state.visibleStockIn} />
                    <StockOutModal select={{name:this.state.getName,operation_type:this.state.getType}}  onRef={this.onRef} cancel={this.closeStockOut} 
                            visible={this.state.visibleStockOut} />
                    <StockInNumberModal  cancel={this.closeStockInNumber} 
                            visible={this.state.visibleStockInNumber}/>
                    <StockOutNumberModal  cancel={this.closeStockOutNumber} 
                            visible={this.state.visibleStockOutNumber}/>
                    <BossEditModal {...ModalOptions} />
                </Card>
            </div>
        )
    }
}

export default withRouter(injectIntl(MI2001C));
