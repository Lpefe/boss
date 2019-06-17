/*@运维-版本说明*/
import React from 'react';
import './index.scss';
import {Card, Input} from 'antd';
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {withRouter} from "react-router-dom"
import Operations from "../../Common/Operations";
import {commonTranslate} from "../../../utils/commonUtilFunc";
import BossEditModal from "../../Common/BossEditModal";

class MI0803 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalShow:false,
            selectedRowKeys:[],
            editRecord:{},
            editId:""
        }
    }

    componentDidMount() {
        this.get_os_version()
    }

    get_os_version = () => {
        this.props.dispatch({
            type: "mi0803Info/get_os_version",
            payload: {}
        })
    };
    edit = (record)=>{
        this.setState({
            ModalShow:true,
            editRecord: record,
            editId: record.id,
        })
    }
    closeAddModal=()=>{
        this.setState({
            ModalShow:false,
            editRecord:{},
            editId: "",
        },()=>{
            this.get_os_version()
        }
        )
    }

    render() {
        const ModalOptions = {
            title:"@编辑",
            visible:this.state.ModalShow,
            initialValues:this.state.editRecord,
            dispatch:this.props.dispatch,
            submitType:"mi0803Info/update_os_version",
            onCancel: this.closeAddModal,
            extraUpdatePayload: {id:this.state.editId },
            initPayload: {},
            InputItems: [{
                type: "Input",
                labelName: "@版本号",
                valName: "version",
                nativeProps: {
                    placeholder: "@请输入版本号",
                    disabled:true
                },
            },{
                type: "Input",
                labelName: "@版本说明",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入版本说明",
                },
                rules: [{max:256,message: "@最大长度256位"}],
            },
        ]
        }

        const Columns = [
            {
                title: "@版本号",
                dataIndex: 'version',
                key: 'version',
            },
            {
                title: "@版本说明",
                dataIndex: 'remark',
                key: 'remark',
            },{
                title: '@操作',
                dataIndex: 'operation',
                key: 'operation',
                fixed:'right',
                align: "center",
                width:75,
                render: (index, record) => {
                    return (
                        <div style={{display:"inline-block"}}>
                            <Operations 
                            hasEdit={true} edit={() => this.edit(record)}
                            />
                        </div>
                    )
                }
            } ];
        const pagination = false;
        return (
            <div>
                <Card className="card">
                    <BossTable pagination={pagination} columns={Columns} 
                               dataSource={this.props.mi0803Info.dataSource}/>
                </Card>
                <BossEditModal {...ModalOptions} />
            </div>
        )
    }
}

export default withRouter(injectIntl(MI0803));




