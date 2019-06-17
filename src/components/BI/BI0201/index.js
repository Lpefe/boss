/*@技术支持-合同信息*/
import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import {Card,Icon,Modal} from 'antd';
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {domain} from '../../../utils/commonConsts';
class BI0201 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifAttachmentModalShow: false,
            record: {},
            name:""
        }
    }
    componentDidMount(){
        this.get_contract_list();
    }

    get_contract_list=()=>{
        this.props.dispatch({
            type:"bi0201Info/get_contract_list",
            payload:{

            }
        })
    };
    handleOpenCheckAttachmentModal = (record) => {
        this.setState({
            ifAttachmentModalShow: true,
            record: record,
        },)
    };
    handleCloseCheckAttachmentModal = () => {
        this.setState({
            ifAttachmentModalShow: false,
            record: {},
        })
    };

    handleSearchContract=(value)=>{
        this.setState({
            name:value
        },function(){
            this.props.dispatch({
                type:"bi0201Info/get_contract_list",
                payload:{
                    name:this.state.name
                }
            })
        })
    };
    render() {
        let columns = [{
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: '@合同名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@开始时间',
            dataIndex: 'begin_time',
            key: 'begin_time',
        }, {
            title: '@结束时间',
            dataIndex: 'end_time',
            key: 'end_time',
        }, {
            title: '@签订时间',
            dataIndex: 'time',
            key: 'time',
        },{
            title: '@附件',
            dataIndex: 'attachment',
            key: 'attachment',
            render: (index, record) => {
                return <Icon type="file-text" className="common-link-icon" onClick={() => this.handleOpenCheckAttachmentModal(record)}/>
            }
        },];
        return (
            <Card className="card">
                <HeaderBar hasDelete={false} hasSearch={true} submit={this.handleSearchContract}/>
                <BossTable columns={columns} dataSource={this.props.bi0201Info.contractList}/>
                <Modal visible={this.state.ifAttachmentModalShow} title={"@合同详情"}
                       onCancel={this.handleCloseCheckAttachmentModal} bodyStyle={{textAlign:"center"}} footer={null}>
                    {
                        this.state.record.file_list?this.state.record.file_list.map((item)=>{
                            return <div style={{display:"inline-block",}}><Icon type="paper-clip"/><span style={{marginRight:32}}>{item}</span> <a href={domain+"/v1/company/download_attachment/?company_id="+this.state.record.company_id+"&contract_id="+this.state.record.id+"&filename="+item}>{"@下载"}</a></div>
                        }):""
                    }
                </Modal>
            </Card>
        )
    }
}

export default injectIntl(BI0201);