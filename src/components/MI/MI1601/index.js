/*@运维-出库统计*/
import React from 'react';
import {Card, Select} from 'antd';
import BossTable from "../../Common/BossTable";
import HeaderBar from "../../Common/HeaderBar";
import './index.scss';
import BossEditModal from "../../Common/BossEditModal";
import {injectIntl} from "react-intl";
import * as echarts from 'echarts';
import {deviceTypeMap} from "../../../utils/commonUtilFunc";

const Option = Select.Option;

class MI1601C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "OUT",
            model: "",
            name: "",
            type: "",
            showEditInput: true,
            ifDeliveryModalShow: false,
            editId: "",
            editRecord: {},
        };

    }

    componentDidMount() {
        this.get_stock_stat();
        this.get_stock_list();
        this.get_device_model();
        this.linkStat2 = echarts.init(document.getElementById("deviceStat"));
        this.renderBar(this.linkStat2,this.props.mi1601Info.deviceStatDataSource)
    }
    componentDidUpdate(){
        this.renderBar(this.linkStat2,this.props.mi1601Info.deviceStatDataSource)

    }
    renderBar = (el,data)=>{
        let dataX = []
        let dataY1 = []//BCPE
        let dataY2 = []//HCPE
        let dataY3 = []//AP
        let dataY4 = []//总计
        //data[0]未预定
        for(let prop in data[0]){
            if (prop!=="title"&&prop!=="total"){
                dataX.push(prop)
                dataY1.push(data[0][prop])
            }
        }
        //data[1]预定
        for(let prop in data[1]){
            if (prop!=="title"&&prop!=="total"){
                dataY2.push(data[1][prop])
            }
        }        
        for(let prop in data[2]){
            if (prop!=="title"&&prop!=="total"){
                dataY3.push(data[2][prop])
            }
        }
        for(let prop in data[3]){
            if (prop!=="title"&&prop!=="total"){
                dataY4.push(data[3][prop])
            }
        }
        let option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
                },
                // formatter: function(params) {
                //     console.log(params)
                //     return "<span style='display:inline-block; width:12px; height:12px;background:#f60;'></span>" +
                //                     "总量" + (params[1].value+params[0].value) + "<br />" +
                //                     "<span style='display:inline-block; width:12px; height:12px;background:#8FACC6;'></span>" +
                //                     "已预定：" + params[1].value + "<br />" +
                //                     "<span style='display:inline-block; width:12px; height:12px;background:#3B9FF7;'></span>" +
                //                     "可用量：" + params[0].value + "<br />" 
                //    // console.log(p)
                // }<span style="display:inline-block; width:12px; height:12px;background:#8FACC6;"></span>//<span style="display:inline-block; width:12px; height:12px;background:#3B9FF7;"></span>
                //formatter:'{a2}: {c2}<br />{a0}: {c0}<br />{a1}: {c1}'
            },
            legend: {
                x: 'center',
                top: '90%',
                textStyle: {
                    color: '#90979c',
                },
                data: ['BCPE', 'HCPE',"AP"]
            },
            grid: {
                top:"10%",
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis : [{
                    type : 'category',
                    data : dataX,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {  
                        interval:0,  
                        //rotate:40,
                    } 
                    },


            ],
            yAxis : [
                {type : 'value'}
            ],
            series : [
                {
                    "name": "@总量",
                    "type": "bar",
                    "barMaxWidth": 1,
                    "itemStyle": {
                        "opacity":0,
                    },
                    "data": dataY4
                },
                {
                    "name": "BCPE",
                    "type": "bar",
                    "stack": "总量",
                    "barMaxWidth": 70,
                    "barGap": "10%",
                    "itemStyle": {
                        "normal": {
                            "color": "#7CD7D7",

                        }
                    },
                    "data": dataY1,
                },{
                    "name": "HCPE",
                    "type": "bar",
                    "stack": "总量",
                    "barMaxWidth": 70,
                    "barGap": "10%",
                    "itemStyle": {
                        "normal": {
                            "color": "#A16AC2",
                            "barBorderRadius": 0,
                        }
                    },
                    "data": dataY2
                },{
                    "name": "AP",
                    "type": "bar",
                    "stack": "总量",
                    "barMaxWidth": 70,
                    "barGap": "10%",
                    "itemStyle": {
                        "normal": {
                            "color": "#3B9FF7",
                            "barBorderRadius": 0,
                        }
                    },
                    "data": dataY3
                },
            ]
        };
        el.setOption(option);
        el.resize({width: "auto", height: "auto"});
    };
    get_stock_stat = () => {
        this.props.dispatch({
            type: "mi1601Info/get_stock_stat",
            payload: {
                status: "OUT",
            }
        })
    };

    get_device_model=()=>{
        this.props.dispatch({
            type:"mi1601Info/get_device_model",
            payload:{

            }
        })
    };

    //获取库存列表
    get_stock_list = () => {
        this.props.dispatch({
            type: "mi1601Info/get_stock_list",
            payload: {
                status: this.state.status,
                model: this.state.model,
                name: this.state.name,
                type: this.state.type
            }
        })
    };

    handleOpenDeliveryInfoModal = (record) => {
        this.setState({
            ifDeliveryModalShow: true,
            editId: record.id,
            editRecord: record,
        })
    };

    handleCloseDeliveryInfoModal = () => {
        this.setState({
            ifDeliveryModalShow: false,
            editId: "",
            editRecord: {},
        })
    };

    handleSelectDeviceType = (value) => {
        let vm = this;
        this.setState({
            type: value || ""
        }, function () {
            vm.get_stock_list();
        })
    };
    handleSelectDeviceModel = (value) => {
        let vm = this;
        this.setState({
            model: value || ""
        }, function () {
            vm.get_stock_list();
        })
    };


    handleSubmit = (value) => {
        let vm = this;
        this.setState({
            name: value
        }, function () {
            vm.get_stock_list();
        })
    };

    render() {

        const stockStatColumnsD = [];
        for(let key in this.props.mi1601Info.deviceStatDataSource[0]){
            stockStatColumnsD.push({
                title:key==="title"?"":key==="total"?"合计":key,
                dataIndex:key,
                key:key
            })
        }
        const columns = [{
            title: '@出库时间',
            dataIndex: 'out_time',
            key: 'out_time',

        }, {
            title: "@硬件ID",
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: "@序列号",
            dataIndex: 'hard_sn',
            key: 'hard_sn',
        }, {
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',
        }, {
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@设备类型',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                return deviceTypeMap(text)
            }
        }, {
            title: '@操作系统',
            dataIndex: 'os',
            key: 'os',
        }, /*{
            title: '@快递单号',
            dataIndex: 'delivery_number',
            key: 'delivery_number',
        }, {
            title: '@快递公司',
            dataIndex: 'delivery_company',
            key: 'delivery_company',
        }, */{
            title: '@经办人',
            dataIndex: 'user',
            key: 'user',
        }, /*{
            title: '@物流信息',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            render: (text, record) => {
                return <Icon type="edit" onClick={() => this.handleOpenDeliveryInfoModal(record)}/>
            }
        }*/];

        const ModalOptions = {
            title: "@编辑物流信息",
            visible: this.state.ifDeliveryModalShow,
            onCancel: this.handleCloseDeliveryInfoModal,
            dispatch: this.props.dispatch,
            submitType: "mi1601Info/update_stock",
            extraUpdatePayload: {id: this.state.editId},
            initialValues: this.state.editRecord,
            bodyHeight: 160,
            initPayload: {
                status: this.state.status,
                model: this.state.model,
                name: this.state.name,
                type: this.state.type
            },
            InputItems: [{
                type: "Input",
                labelName: "@物流公司",
                valName: "delivery_company",
                nativeProps: {
                    placeholder: "@请输入物流公司",
                },
                rules: [{max: 128, message: "@物流公司最多输入128字符"}],
            }, {
                type: "Input",
                labelName: "@物流单号",
                valName: "delivery_number",
                nativeProps: {
                    placeholder: "@请输入物流单号",
                },
                rules: [{max: 64, message: "@物流单号最多输入64字符"}],
            }]
        };
        //
        const optionOne = [
            <Option value="STEP" key="STEP">BCPE</Option>,
            <Option value="CSTEP" key="CSTEP">HCPE</Option>,
            <Option value="AP" key="AP">AP</Option>,
        ];

        const optionTwo=this.props.mi1601Info.modelList.map((item)=>{
            return <Option value={item.model} key={item.id}>{item.model}</Option>
        });

        return (
            <div>
                <Card className="card">
                <div id="deviceStatTitle">
                        <div style={{float:"left"}}>
                            <span className="deviceText">@出库统计</span>
                        </div>
                        <div style={{float:"right"}}>
                            <span className="deviceText2">@总计:</span><span className="deviceText3">{this.props.mi1601Info.deviceStatDataSource[3]?this.props.mi1601Info.deviceStatDataSource[3].total:""}</span>
                            <span className="deviceText2">BCPE:</span><span className="deviceText3">{this.props.mi1601Info.deviceStatDataSource[0]?this.props.mi1601Info.deviceStatDataSource[0].total:""}</span>
                            <span className="deviceText2">HCPE:</span><span className="deviceText3">{this.props.mi1601Info.deviceStatDataSource[1]?this.props.mi1601Info.deviceStatDataSource[1].total:""}</span>
                            <span className="deviceText2">AP:</span><span className="deviceText3">{this.props.mi1601Info.deviceStatDataSource[2]?this.props.mi1601Info.deviceStatDataSource[2].total:""}</span>
                        </div>
                    </div>
                    <div id="deviceStat"></div>
                    {/* <BossTable columns={stockStatColumnsD} style={{marginBottom: 32}}
                               dataSource={this.props.mi1601Info.deviceStatDataSource} pagination={false}/> */}
                </Card>
                <Card className="card">
                    <HeaderBar hasSelect={true} hasSelectTwo={true} hasSearch={true}
                               selectPlaceHolder={"@请选择设备类型"}
                               selectTwoPlaceHolder={"@请选择设备型号"} options={optionOne}
                               optionsTwo={optionTwo} selectOneMethod={this.handleSelectDeviceType}
                               submit={this.handleSubmit}
                               selectTwoMethod={this.handleSelectDeviceModel}/>
                    <BossTable columns={columns} dataSource={this.props.mi1601Info.deviceList}/>
                    <BossEditModal {...ModalOptions}/>
                </Card>
            </div>
        )
    }
}

export default injectIntl(MI1601C);