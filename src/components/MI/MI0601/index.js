/*@运维-POP点管理*/
import React from 'react';
import './index.scss';
import {Card, Select} from 'antd';
import Operations from "../../Common/Operations";
import BossTable from "../../Common/BossTable";
import HeaderBar from "../../Common/HeaderBar";
import {injectIntl} from "react-intl";
import BossEditModal from "../../Common/BossEditModal";
import {commonTranslate, statusMap} from "../../../utils/commonUtilFunc";

const Option = Select.Option;


class MI0601 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room_id: "",
            status: "",
            name: "",
            TWSId: "",
            editModalShow: false,
            editRecord: {},
            selectedIds: "",
            selectedRecords: [],
            type: "TWS",
            level2_id: "",
            page_size:20,
            page_no:1
        }
    }

    componentDidMount() {
        this.getDeviceList();
        this.getRoomList();
        this.get_address();
    }

    get_address = () => {
        this.props.dispatch({
            type: "mi0601Info/get_address",
            payload: {
                level: 2
            }
        })
    };

    getDeviceList = () => {
        this.props.dispatch({
            type: "mi0601Info/getDeviceList",
            payload: {
                type: this.state.type,
                level2_id: this.state.level2_id,
                room_id: this.state.room_id,
                status: this.state.status,
                name: this.state.name,
                page_no:this.state.page_no,
                page_size: this.state.page_size
            }
        });

    };

    getRoomList = () => {
        this.props.dispatch({
            type: "mi0601Info/getRoomList",
            payload: {}
        })
    };

    selectRoom = (value) => {
        this.setState({
            room_id: value || "",
            page_size:20,
            page_no:1
        }, () => {
            this.getDeviceList();
        })
    };

    selectAddress = (value) => {
        this.setState({
            level2_id: value || "",
            page_size:20,
            page_no:1
        }, () => {
            this.getDeviceList();
        })
    };

    selectStatus = (value) => {
        this.setState({
            status: value || "",
            page_size:20,
            page_no:1
        }, () => {
            this.getDeviceList();
        })
    };

    searchByTWSName = (value) => {
        this.setState({
            name: value,
            page_size:20,
            page_no:1
        }, () => {
            this.getDeviceList();
        })
    };


    addTWS = () => {
        this.setState({
            editModalShow: true
        })
    };

    editTWS = (record) => {
        this.setState({
            editModalShow: true,
            TWSId: record.id,
            editRecord: record,
        })
    };

    cancelModal = () => {
        this.setState({
            editModalShow: false,
            TWSId: "",
            editRecord: {}
        })
    };

    deleteTWS = (record) => {
        this.props.dispatch({
            type: "mi0601Info/deleteTWS",
            payload: {
                ids: [record.id],
                records: [record]
            }
        })
    };

    delete_device_batch = () => {
        this.props.dispatch({
            type: "mi0601Info/delete_device_batch",
            payload: {
                ids: this.state.selectedIds,
                records: this.state.selectedRecords,
            }
        })
    };

    render() {
        const columns = [{
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
            width:200,
            fixed:"left"
        }, {
            title: '@节点IP',
            dataIndex: 'ip',
            key: 'ip',
        }, {
            title: "@区域",
            dataIndex: 'room_level2_name',
            key: 'room_level2_name',
        }, {
            title: '@版本',
            dataIndex: 'version',
            key: 'version',
        }, {
            title: '@机房',
            dataIndex: 'room_name',
            key: 'room_name',
        }, {
            title: '@型号',
            dataIndex: 'model',
            key: 'model'
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@硬件ID',
            dataIndex: 'sn',
            key: 'sn'
        }, {
            title: '@自动分配',
            dataIndex: 'assign_type',
            key: 'assign_type',
            render: (index, record) => {
                return record.assign_type === "auto" ? "@支持" : "@不支持"
            }
        }, {
            title: '@挂起',
            dataIndex: 'is_suspend',
            key: 'is_suspend',
            render: (index, record) => {
                return record.is_suspend ? "@是" : "@否"
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:100,
            fixed:'right',

            render: (index, record) => {
                return (
                    <div>
                        <Operations hasDelete={true} hasEdit={true} edit={() => this.editTWS(record)}
                                    delete={() => this.deleteTWS(record)}/>
                    </div>
                )
            }
        },];

        const options = this.props.mi0601Info.roomList.map((item) => {
            return (<Option value={item.id} key={item.id}>{item.name}</Option>)
        });

        const optionTwo = [
            <Option key="1" value="INIT">@未激活</Option>,
            <Option key="3" value="ONLINE">@在线</Option>,
            <Option key="4" value="OFFLINE">@离线</Option>,
        ];

        const optionThree = this.props.mi0601Info.addressList.map((item) => {
            return <Option key={item.id} value={item.id}>{item.name}</Option>
        });


        const modalOptions = {
            title: this.state.TWSId ? "@编辑TWS" : "@新增TWS",
            visible: this.state.editModalShow,
            onCancel: this.cancelModal,
            dispatch: this.props.dispatch,
            submitType: this.state.TWSId ? "mi0601Info/editTWS" : "mi0601Info/createTWS",
            extraUpdatePayload: {id: this.state.TWSId, company_id: 1,type:"TWS"},
            initialValues: this.state.TWSId?this.state.editRecord:{
                is_suspend:false,
                assign_type:'auto'
            },
            initPayload: {
                type: this.state.type,
                level2_id: this.state.level2_id,
                page_no:this.state.page_no,
                page_size: this.state.page_size
            },
            InputItems: [{
                type: "Input",
                labelName: "@TWS名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入TWS名称"
                },
                rules: [{required: true, message: "@请输入TWS名称"}],
            }, {
                type: "Select",
                labelName: "@机房",
                valName: "room_id",
                nativeProps: {
                    placeholder: "@请选择机房"
                },
                rules: [
                    {required: true, message: "@请选择机房"},
                ],
                children: this.props.mi0601Info.roomList.map((room) => {
                    return {name: room.name, value: room.id, key: room.id}
                })
            }, {
                type: "Input",
                labelName: "SN",
                valName: "sn",
                nativeProps: {
                    placeholder: "@请输入硬件ID"
                },
                rules: [{required: true, message: "@请输入硬件ID"}, {
                    pattern: /^[A-Za-z0-9]{32}$/,
                    message: "@请输入32位的字母或数字组合"
                }],
            }, {
                type: "Input",
                labelName: "@型号",
                valName: "model",
                nativeProps: {
                    placeholder: "@请输入型号"
                },
                rules: [{required: true, message: "@请输入型号"}],
            }, {
                type: "Radio",
                labelName: "@自动分配",
                valName: "assign_type",
                nativeProps: {
                    placeholder: "@请选择是否自动分配"
                },
                rules: [{required: true, message: "@请选择是否自动分配"}],
                children: [{value: "auto", name: "@支持", key: "auto"}, {
                    value: "manual",
                    name: "@不支持",
                    key: "manual"
                }]
            },{
                type: "Radio",
                labelName: "@挂起",
                valName: "is_suspend",
                nativeProps: {
                    placeholder: "@请选择是否挂起"
                },
                rules: [{required: true, message: "@请选择是否自动分配"}],
                children: [{value: true, name: "@是", key: "true"}, {
                    value:false,
                    name: "@否",
                    key: "false"
                }]
            },]
        };

        return (
            <Card className="card">
                <HeaderBar hasSearch={true}
                           submit={this.searchByTWSName} hasAdd={true} add={this.addTWS}
                           hasSelect={true} hasSelectTwo={true} hasSelectThree={true} selectThreePlaceHolder="@请选择区域"
                           selectPlaceHolder={"@请选择机房"} selectTwoPlaceHolder={"@请选择状态"}
                           selectOneMethod={this.selectRoom}
                           selectTwoMethod={this.selectStatus}
                           selectThreeMethod={this.selectAddress}
                           options={options} optionsTwo={optionTwo} optionsThree={optionThree}
                           selectThreeIfSearch={true}/>
                <BossTable columns={columns} paging={true}
                           dataSource={this.props.mi0601Info.dataSource} total={this.props.mi0601Info.total} component={this} getData={this.getDeviceList}/>
                <BossEditModal {...modalOptions}/>
            </Card>
        )
    }
}

export default injectIntl(MI0601);