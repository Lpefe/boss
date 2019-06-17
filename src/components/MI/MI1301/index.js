
import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {Icon,Card} from 'antd';
import {Link} from 'react-router-dom';


class MI1301 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:""
        }
    }

    componentDidMount() {
        this.get_lte_4g();
    }

    get_lte_4g = () => {
        this.props.dispatch({
            type: "mi1301Info/get_lte_4g",
            payload: {
                name:this.state.name
            }
        })
    };
    search=(value)=>{
        let vm=this;
        this.setState({
            name:value
        },function () {
            vm.get_lte_4g();
        })
    };

    render() {
        let columns = [{
            title: '@设备名称',
            dataIndex: 'device_name',
            key: 'device_name',
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@4G运营商',
            dataIndex: 'isp_name',
            key: 'isp_name',
        }, {
            title: '@套餐类型',
            dataIndex: 'lte_type',
            key: 'lte_type',
        }, {
            title: '@流量大小(MB)',
            dataIndex: 'flow',
            key: 'flow',
        }, {
            title: '@本月流量(MB)',
            dataIndex: 'current_month_flow',
            key: 'current_month_flow',
            render: (index, record) => {
                return (record.current_month_flow/1024/1024).toFixed(2)
            }
        }, {
            title: '@累计流量(MB)',
            dataIndex: 'total_flow',
            key: 'total_flow',
            render: (index, record) => {
                return (record.total_flow/1024/1024).toFixed(2)
            }
        }, {
            title: '@备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '@历史流量',
            dataIndex: 'dayFlow',
            key: 'dayFlow',
            width: 100,
            align: "center",
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/mi1301/mi1302",
                    search: "?id=" + record.id + "&device_name=" + record.device_name + "&current_month_flow=" + record.current_month_flow + "&company_id=" + record.company_id + "&sn=" + record.sn
                }}><Icon style={{color: "rgba(0,0,0,0.65)"}} type="line-chart"/></Link>
            }
        },];
        return <Card className="card">
            <HeaderBar hasSearch={true} submit={this.search}/>
            <BossTable columns={columns} dataSource={this.props.mi1301Info.lteData}/>
        </Card>
    }
}

export default MI1301;