import React from 'react';
import {connect} from 'dva';
import {Input,Popover, Icon,Modal} from 'antd';
import BossTable from "../../../Common/BossTable";
import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';

class AppFlowStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            srcIpA: "",
            desIpA: "",
            desPortA: "",
            srcIpModalShow:false
        }
    }



    searchA = () => {
        this.props.dispatch({
            type: "ci0301Info/getStatisticsA",
            payload: {
                tableFlag: true,
                item: "appBand",
                companyid: this.props.companyid,
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
                top: this.props.data_num,
                dst_ip: this.state.desIpA,
                dst_port: this.state.desPortA,
            }
        })
    };
    changeSrcIpA = (e) => {
        this.setState({
            srcIpA: e.target.value,
        })
    };

    changeDesIpA = (e) => {
        this.setState({
            desIpA: e.target.value,
        })
    };


    changeDesPortA = (e) => {
        this.setState({
            desPortA: e.target.value,
        })
    };
    editAppName = (e) => {
        this.setState({
            appName: e.target.value
        })
    };

    submitAppNameEditA = (visible, record) => {
        if (visible) {
            this.setState({
                appName: record.name
            })
        } else {
            this.props.dispatch({
                type: "ci0301Info/update_app_nameA",
                payload: {
                    edit: {
                        id: record.id,
                        name: this.state.appName,
                    },
                    refresh: {
                        tableFlag: true,
                        item: "appBand",
                        companyid: this.props.companyid,
                        start_tm: this.props.start_tm,
                        end_tm: this.props.end_tm,
                        top: this.props.data_num,
                        src_ip: this.state.srcIpA,
                        dst_ip: this.state.desIpA,
                        dst_port: this.state.desPortA,
                    }
                }
            })
        }
    };

    handleCheckSrcIpModalShow=(record)=>{
        this.setState({
            srcIpModalShow:true,
            selectedDstIp:record.dst_ip,
            selectedDstPort:record.dst_port,
        },function(){
            this.props.dispatch({
                type:"ci0301Info/get_srcip_list",
                payload:{
                    start_tm:this.props.start_tm,
                    end_tm:this.props.end_tm,
                    companyid:this.props.companyid,
                    dst_ip:this.state.selectedDstIp,
                    dst_port:this.state.selectedDstPort,
                    name:record.name
                }
            })
        })
    };

    handleCloseCheckSrcIpModal=()=>{
        this.setState({
            srcIpModalShow:false
        })
    };

    render() {
        const __ = this.props.intl.formatMessage;
        const pagination = {
            pageSize: 20
        };
        const columnsA = [{
            title: '@应用程序',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (index, record) => {
                return (
                    <div>
                        <span style={{marginRight: 8}}>{record.name}</span>
                        <Popover trigger="click" title="修改应用程序名称"
                                 content={<Input placeholder="请输入应用程序名称" onChange={this.editAppName}
                                                 defaultValue={record.name}/>}
                                 onVisibleChange={(visible) => this.submitAppNameEditA(visible, record)}>
                            <Icon style={{color: "rgb(24, 144, 255)"}}
                                  type="edit"/>
                        </Popover>
                    </div>
                )
            }
        }, {
            title: '@源地址',
            dataIndex: 'src_ip',
            key: 'src_ip',
            render:(index,record)=>{
                return <span onClick={()=>this.handleCheckSrcIpModalShow(record)}>any</span>
            }
        }, {
            title: '@目标地址',
            dataIndex: 'dst_ip',
            key: 'dst_ip',
        }, {
            title: '@目标端口',
            dataIndex: 'dst_port',
            key: 'dst_port',
        },{
            title:'@协议',
            dataIndex: 'protocol',
            key: 'protocol',
        } ];
        const srcIpColumns=[{
            title: '@应用程序',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@源地址',
            dataIndex: 'src_ip',
            key: 'src_ip',
        }, {
            title: '@目标地址',
            dataIndex: 'dst_ip',
            key: 'dst_ip',
        }, {
            title: '@目标端口',
            dataIndex: 'dst_port',
            key: 'dst_port',
        }, ];
        return <div>
            <section>
                <div style={{height: 500,width:document.body.clientWidth - 300,}} id="chartA">

                </div>
            </section>
            <section>
                {/*<div style={{textAlign: 'right', marginBottom: 16}}>
                    <Input style={{width: 200, marginRight: 8}} placeholder="请输入目标地址" onChange={this.changeDesIpA}
                    />
                    <Input style={{width: 200, marginRight: 8}} placeholder="请输入目标端口" onChange={this.changeDesPortA}
                    />
                    <Button onClick={this.searchA} icon="search">查找</Button>
                </div>*/}
                <BossTable pagination={pagination} columns={columnsA}
                       dataSource={this.props.ci0301Info.tableDataA}/>
            </section>
            <Modal title={"@源地址"} onCancel={this.handleCloseCheckSrcIpModal} visible={this.state.srcIpModalShow} footer={null}>
                <BossTable columns={srcIpColumns} bordered={true} size="small" dataSource={this.props.ci0301Info.srcIpList}/>
            </Modal>
        </div>
    }
}

function mapDispatchToProps({ci0301Info}) {
    return {ci0301Info};
}

export default connect(mapDispatchToProps)(injectIntl(AppFlowStat));