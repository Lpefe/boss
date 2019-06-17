/*@客户-链路信息*/
import React from 'react';
import '../CI0101New/index.scss';
import {Card, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {domain} from "../../../utils/commonConsts";
import BossDataHeader from "../../Common/BossDataHeader";
import {statusMap} from "../../../utils/commonUtilFunc";

const Option = Select.Option;
class CI0201 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            type: "",
            name: "",
            status: "",
            page_no:1,
            page_size:20
        }
    }

    componentDidMount() {
        this.get_link_list();
        this.get_link_stat();
    }


    get_link_list = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_list",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                type: this.state.type,
                name: this.state.name,
                status: this.state.status,
                page_no:this.state.page_no,
                page_size:this.state.page_size
            }
        })
    };

    get_link_stat = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_stat",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
            }
        })
    };

    handleSelectStatus = (value) => {
        this.setState({
            status: value || "",
            page_no:1,
            page_size:20
        }, () => {
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,

                }
            })
        })
    };


    handleSelectType = (value) => {
        this.setState({
            type: value || "",
            page_no:1,
            page_size:20
        }, () => {
            this.get_link_list();
        })
    };

    handleSearchSubmit = (value) => {
        this.setState({
            name: value,
            page_no:1,
            page_size:20
        }, () => {
            this.get_link_list();
        })

    };

    checkLink = (status) => {
        this.setState({
            page_no:1,
            page_size:20
        },()=>{
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    type: this.state.type,
                    name: this.state.name,
                    status: status,
                    page_no:this.state.page_no,
                    page_size:this.state.page_size
                }
            })
        })

    };

    gotoLink=(record)=>{
        if(!record.device_id){
            return;
        }
        window.open(domain+"/index."+window.appLocale.locale+".html#/main/mi0501/mi0502?id=" + record.id +"&from=link&bandwidth=" + record.bandwidth+ "&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id)
    };

    render() {
        const __ = this.props.intl.formatMessage;
        const columns = [{
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span onClick={()=>this.gotoLink(record)} className={record.device_id?"common-link-icon":""}>
                    {record.name}
                </span>
            }
        }, {
            title: "@状态",
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@节点名称',
            dataIndex: 'branch',
            key: 'branch',
        }, {
            title: "@链路类型",
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '@带宽(M)',
            dataIndex: 'bandwidth',
            key: 'charge_type',
        }];
        
        const option = [
            <Option value="ONLINE" key="ONLINE">@在线</Option>,
            <Option value="INIT" key="INIT">@未激活</Option>,
            <Option value="OFFLINE" key="OFFLINE">@离线</Option>
        ];

        const optionTwo = [
            <Option value="国内组网" key="国内组网">@国内组网</Option>,
            <Option value="全球组网" key="全球组网">@全球组网</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">@国内SaaS加速</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">@全球SaaS加速</Option>
        ];

        return (
            <div>
                <BossDataHeader offLine={this.props.ci0201Info.linkStat.OFFLINE}
                                init={this.props.ci0201Info.linkStat.INIT}
                                onLine={this.props.ci0201Info.linkStat.ONLINE}
                                total={this.props.ci0201Info.total}
                                checkLink={this.checkLink}
                                TotalLink="@链路总数"
                                changeImg = {true}
                />
                <Card className="card" style={{marginBottom: 32}}>
                    <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={true}
                               hasSearch={true}
                               selectPlaceHolder='@请选择状态' selectTwoPlaceHolder='@请选择链路类型'
                               selectOneMethod={this.handleSelectStatus} selectTwoMethod={this.handleSelectType}
                               optionsTwo={optionTwo} options={option} submit={this.handleSearchSubmit}/>
                    <BossTable paging={true} columns={columns} component={this} getData={this.get_link_list} total={this.props.ci0201Info.linkTotal}
                               dataSource={this.props.ci0201Info.dataSource}/>
                </Card>
            </div>
        )
    }
}

export default injectIntl(CI0201);