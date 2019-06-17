/*@商务-中心ISP设置*/
import React from 'react';
import './index.scss';
import { Card, Icon} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import ISPModal from "./subComponents/ISPModal";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {deviceTypeMap} from "../../../utils/commonUtilFunc";


class BI0601 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifIspModalShow: false,
            selectedSn: "",
            selectedId:""
        }
    }

    componentDidMount() {
        this.get_device_list();
    }

    get_device_list = () => {
        this.props.dispatch({
            type: "ci1401Info/get_device_list",
            payload: {
                type: "CSTEP",
                docker_group_id:0,
                company_id:sessionStorage.getItem("role")==='company'||sessionStorage.getItem("role")==="companystaff"?sessionStorage.getItem("companyId"):""
            }
        })
    };

    handleOpenIspModal = (record) => {
        this.setState({
            ifIspModalShow: true,
            selectedSn: record.sn,
            selectedId:record.id
        },  ()=> {
            this.get_isp_of_cstep();
            this.props.dispatch({
                type:"ci1401Info/set_out_ip",
                payload:{
                    out_ip:record.out_ip
                }
            })
        })
    };
    get_isp_of_cstep = () => {
        this.props.dispatch({
            type: "ci1401Info/get_isp_of_cstep",
            payload: {
                sn: this.state.selectedSn
            }
        })
    };

    submit=(value)=>{
        this.props.dispatch({
            type: "ci1401Info/get_device_list",
            payload: {
                type: "CSTEP",
                name:value,
                docker_group_id:0,
            }
        })
    };
    handleCloseIspModal = () => {
        this.setState({
            ifIspModalShow: false,
        })
    };



    render() {
        const columns = [{
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: '@设备类型',
            dataIndex: 'type',
            key: 'type',
            render:(text)=>{
                return deviceTypeMap(text)
            }
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: "@硬件ID",
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: '@ISP配置',
            dataIndex: 'isp',
            key: 'isp',
            align: "center",
            render: (index, record) => {
                return (<Icon type="file-text" className="operations-edit-btn" style={{border: 0,color:"#439fff"}}
                              onClick={() => this.handleOpenIspModal(record)}/>)
            }
        },];
        let companyName = {
            title:'@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',

        };
        if (sessionStorage.getItem("role") !== "company" && sessionStorage.getItem("role") !== "companystaff") {
            columns.splice(1, 0, companyName);
        }
        return <Card className="card">
            <HeaderBar hasDelete={false} hasSearch={true} submit={this.submit}/>
            <BossTable columns={columns} dataSource={this.props.ci1401Info.dataSource}/>
            <ISPModal visible={this.state.ifIspModalShow} sn={this.state.selectedSn} cancel={this.handleCloseIspModal}
                      destroyOnClose id={this.state.selectedId} getData={this.get_isp_of_cstep}/>
        </Card>
    }
}

export default injectIntl(BI0601);