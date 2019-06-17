/*@客户-分时流量*/
import React from 'react';
import {connect} from 'dva';
import {Input, Button, Popover, Icon} from 'antd';

import BossTable from "../../../Common/BossTable";
import {injectIntl} from "react-intl";
class AppFlowStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            srcIpA: "",
            desIpA: "",
            desPortA: "",
        }
    }

    searchA = () => {
        this.props.dispatch({
            type: "ci0302Info/getStatisticsA",
            payload: {
                tableFlag: true,
                item: "apprank",
                companyid: this.props.companyid,
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
                top: this.props.data_num,
                src_ip: this.state.srcIpA,
                dst_ip: this.state.desIpA,
                dst_port: this.state.desPortA,
            }
        })
    };
    changeSrcIpA = (e) => {
        this.setState({
            srcIpA: e.target.value,
        })
    }

    changeDesIpA = (e) => {
        this.setState({
            desIpA: e.target.value,
        })
    }


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
                type: "ci0302Info/update_app_nameA",
                payload: {
                    edit: {
                        id: record.id,
                        name: this.state.appName,
                    },
                    refresh: {
                        tableFlag: true,
                        item: "apprank",
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

    render() {
        const __=this.props.intl.formatMessage;
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
                        <Popover trigger="click" title={'@修改应用程序名称'}
                                 content={<Input placeholder={'@请输入应用程序名称'} onChange={this.editAppName}
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
        }, {
            title: '@目标地址',
            dataIndex: 'dst_ip',
            key: 'dst_ip',
        }, {
            title: '@目标端口',
            dataIndex: 'dst_port',
            key: 'dst_port',
        }, {
            title: '@流量'+'(MB)',
            dataIndex: 'flow',
            key: 'flow',
        },{
            title: '@协议',
            dataIndex: 'protocol',
            key: 'protocol',
        }];
        return <div>
            <section>
                <div style={{height: 400,width:document.body.clientWidth - 200}} id="chartA"/>
            </section>
            <section>
                <div style={{textAlign: 'right', marginBottom: 16}}>
                    <Input style={{width: 200, marginRight: 8}} placeholder={'@请输入源地址'} onChange={this.changeSrcIpA}
                    />
                    <Input style={{width: 200, marginRight: 8}} placeholder={'@请输入目标地址'} onChange={this.changeDesIpA}
                    />
                    <Input style={{width: 200, marginRight: 8}} placeholder={'@请输入目标端口'} onChange={this.changeDesPortA}
                    />
                    <Button onClick={this.searchA} icon="search">@搜索</Button>
                </div>
                <BossTable pagination={pagination} columns={columnsA}
                       dataSource={this.props.ci0302Info.dataSourceA}/>
            </section>
        </div>
    }
}

function mapDispatchToProps({ci0302Info}) {
    return {ci0302Info};
}

export default connect(mapDispatchToProps)(injectIntl(AppFlowStat));