/*@运维-客户端版本*/
import React from 'react';
import {Card} from 'antd';
import BossTable from "../../Common/BossTable";
import Operations from "../MI1901/subComponents/Operations";
import BossEditModal from "../MI1902/subComponents/BossEditModal";
import HeaderBar from "../../Common/HeaderBar";
import { centerIcon } from '../../../assets/svg/appDeviceIcon';


class MI0804C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editModalShow: false,
            editRecord: {},
            editId: "",
            name:''
        };

    }

    componentDidMount() {
        this.get_app_version();
    }

    get_app_version = () => {
        this.props.dispatch({
            type: "mi0804Info/get_app_version",
            payload: {
                name:this.state.name
            }
        })
    };

    handleEditModalShow = (record) => {
        this.setState({
            editModalShow: true,
            editRecord: record,
            editId: record.id,
        })
    };

    handleEditModalClose = () => {
        this.setState({
            editModalShow: false,
            editRecord: {},
            editId: "",
        })
    };

    handleSubmit=(value)=>{
        this.setState({
            name:value
        },()=>{
            this.get_app_version();
        })
    };



    render() {
        const columns = [{
            title: '@版本号',
            dataIndex: 'version',
            key: 'version',
            width:200

        }, {
            title: '@涉及的客户端',
            dataIndex: 'os',
            key: 'os',
        }, {
            title: '@版本说明',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed:"right",
            width:80,
            render: (text, record) => {
                return <Operations edit={() => this.handleEditModalShow(record)}  hasEdit={true}/>
            }
        }];
        const ModalOptions = {
            title: "@编辑版本",
            visible: this.state.editModalShow,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: "mi0804Info/update_app_version",
            extraUpdatePayload: {id: this.state.editRecord.id,},
            onCancel: this.handleEditModalClose,
            InputItems: [{
                type: "Input",
                labelName: "@版本号",
                valName: "version",
                nativeProps: {
                    placeholder: "@请输入版本号",
                    disabled: true
                },
                rules: [{max: 20, message: "@版本号最大长度为20字符"}]
            }, {
                type: "Select",
                labelName: "@涉及的客户端",
                valName: "os",
                nativeProps: {
                    placeholder: "@选择请涉及的客户端",
                    disabled: true
                },
                children: [/*{key: "ANDROID", value: "ANDROID", name: "Android"},
                    {key: "MAC", value: "MAC", name: "MAC"},
                    {key: "IOS", value: "IOS", name: "iOS"},*/
                    {key: "WINDOWS", value: "WINDOWS", name: "Windows"}]
            }, {
                type: "TextArea",
                labelName: "@版本说明",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入版本说明",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{max: 5120, message: "@说明最大长度为5120字符"}]
            }]
        };
        return (
            <Card className="card">
               {/* <HeaderBar hasSearch={true} submit={this.handleSubmit}/>*/}
                <BossTable columns={columns} dataSource={this.props.mi0804Info.versionList}/>
                <BossEditModal {...ModalOptions}/>
            </Card>
        )
    }
}

export default MI0804C;