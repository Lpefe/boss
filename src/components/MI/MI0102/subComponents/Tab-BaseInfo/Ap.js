/*@运维-设备信息*/
import React from 'react';
import BossTable from "../../../../Common/BossTable";
import {Card, Form, Modal} from 'antd';
import {connect} from 'dva';
import {injectIntl} from "react-intl";
import {commonTranslate, deviceTypeMap, parse} from "../../../../../utils/commonUtilFunc";
import {withRouter} from "react-router-dom";


class Ap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifCheckModelShow: false,
        }
    }

    componentDidMount() {
        this.get_wifi();
    }

    handleSelectLink = (e) => {
        this.props.dispatch({
            type: "mi0102Info/handleSelectLink",
            payload: {
                link_id: e.target.value
            }
        })
    };

    get_wifi = () => {
        this.props.dispatch({
            type: "mi0102Info/get_wifi",
            payload: {
                sn: parse(this.props.location.search).sn
            }
        })
    };

    get_wifi_config_file = () => {
        this.props.dispatch({
            type: "mi0102Info/get_wifi_config_file",
            payload: {
                sn: parse(this.props.location.search).sn
            }
        })
    };

    handleOpenCheckModel = () => {
        this.setState({
            ifCheckModelShow: true,
        }, () => {
            this.get_wifi_config_file();
        })
    };
    handleCloseCheckModel = () => {
        this.setState({
            ifCheckModelShow: false
        })
    };

    render() {
        const deviceInfoColumns = [{
            title: '@设备类型',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                return deviceTypeMap(text)
            }
        }, {
            title: '@型号',
            dataIndex: 'model',
            key: 'model',
        }, {
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@所在节点',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: "@上次启动时间",
            dataIndex: 'run_time',
            key: 'run_time',
        }, {
            title: '@序列号',
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: '@设备描述',
            dataIndex: 'model_desc',
            key: 'model_desc',
        },];


        const wifiInfoColumns = [{
            title: 'SSID',
            dataIndex: 'ssid',
            key: 'ssid',
        }, {
            title: "@认证方式",
            dataIndex: 'encryption',
            key: 'encryption',
        }, {
            title: "@密码",
            dataIndex: 'key',
            key: 'key',
        }, {
            title: '@信道',
            dataIndex: 'chanel',
            key: 'chanel',
        }, {
            title: "@频段",
            dataIndex: 'hwmode',
            key: 'hwmode',
        }, {
            title: "@配置文件",
            dataIndex: 'file',
            key: 'file',
            render: () => {
                return <text className="common-link-icon" onClick={this.handleOpenCheckModel}>@查看</text>
            }
        }];
        return (
            <div>

                <h3 style={{marginTop: 16}}>{"@设备信息"}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={deviceInfoColumns}
                               dataSource={this.props.type === "STEP" ? (this.props.mi0102Info.deviceList.length > 0 ? this.props.mi0102Info.deviceList : [this.props.mi0102Info.deviceInfo]) : [this.props.mi0102Info.deviceInfo]}/>
                </Card>
                <h3 style={{marginTop: 16}}>{"@WI-FI配置"}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={wifiInfoColumns}
                               dataSource={this.props.mi0102Info.wifiInfo}/>
                </Card>
                <Modal title="@查看模板文件" visible={this.state.ifCheckModelShow} onCancel={this.handleCloseCheckModel}>
                    <div dangerouslySetInnerHTML={{__html: this.props.mi0102Info.wifiFile}}>

                    </div>
                </Modal>
            </div>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(injectIntl(withRouter(Ap))));