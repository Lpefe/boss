/*@商务-链路信息*/
import React from 'react';
import '../../CI/CI0101New/index.scss';
import { Select, Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {domain} from '../../../utils/commonConsts'
import {commonTranslate, parse, statusMap} from '../../../utils/commonUtilFunc';
import BossDataHeader from "../../Common/BossDataHeader";


const Option = Select.Option;

class BI0401 extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            link_type: "",
            name: "",
            status: search.status||"",
            id: search.id||"",
            page_no:1,
            page_size:20,
        }
    }

    componentDidMount() {
        this.get_link_list();
        this.get_link_stat();
        this.get_company_list();
    }

    get_company_list=()=>{
        this.props.dispatch({
            type:"ci0201Info/get_company_list",
            payload:{

            }
        })
    }

    get_link_list = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_list",
            payload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: this.state.status,
                company_id:this.state.id,
                page_no:this.state.page_no,
                page_size:this.state.page_size

            }
        })
    };

    checkLink = (status) => {
        this.props.dispatch({
            type: "ci0201Info/get_link_list",
            payload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: status,
                deduplication: this.state.deduplication,
                assign_type: this.state.assign_type,
                page_no:1,
                page_size:20
            }
        })
    };

    get_link_stat = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_stat",
            payload: {}
        })
    };

    handleSelectStatus = (value) => {
        this.setState({
            status: value || "",
            page_no:1,
            page_size:20
        }, () => {
            this.get_link_list();
        })
    };


    handleSelectType = (value) => {
        this.setState({
            link_type: value || "",
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

    //根据去重方式筛选
    handleSelectCompany = (value) => {
        this.setState({
            id:value||"",
            page_no:1,
            page_size:20
        }, () => {
            this.get_link_list();
        })
    };

    //根据人工选路筛选
    handleSelectManualLink = (value) => {
        this.setState({
            assign_type: value || "",
            page_no:1,
            page_size:20
        }, () => {
            this.get_link_list();
        })
    };

    gotoLink = (record) => {
        if(!record.device_id){
            return;
        }
        window.open(domain+"/index."+window.appLocale.locale+ ".html#/main/bi0401/bi0402?id=" + record.id + "&from=link&bandwidth=" + record.bandwidth+"&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id)
    };
    render() {
        const columns = [{
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span onClick={()=>this.gotoLink(record)} className={record.device_id?"common-link-icon":""}>{record.name}</span>
            }
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: '@节点名称',
            dataIndex: 'branch',
            key: 'branch',
        }, {
            title: '@服务等级',
            dataIndex: 'grade',
            key: 'grade',
            render: (index, record) => {
                return record.grade === "CLOUD_VPN" ? "@云VPN" : (record.grade === "CLOUD_SPLINE" ? "@云专线" : "@超级云专线")
            }

        }, {
            title: '@链路类型',
            dataIndex: 'link_type',
            key: 'link_type',
        }, {
            title: '@带宽(M)',
            dataIndex: 'bandwidth',
            key: 'charge_type',
        }, {
            title: '@RTT基准值'+'(ms)',
            dataIndex: 'rtt_limit',
            key: 'rtt_limit',
        }, ];

        const option = [
            <Option value="ONLINE" key="ONLINE">@在线</Option>,
            <Option value="INIT" key="INIT">@未激活</Option>,
            <Option value="OFFLINE" key="OFFLINE">@离线</Option>,
        ];

        const optionTwo = [
            <Option value="国内组网" key="国内组网">{"@国内组网"}</Option>,
            <Option value="全球组网" key="全球组网">{"@全球组网"}</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">{"@国内SaaS加速"}</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">{"@全球SaaS加速"}</Option>
        ];

        const optionThree = this.props.ci0201Info.companyList.map((company)=>{
            return <Option key={company.id} value={company.id}>{company.company_abbr}</Option>
        });

        const optionFour = [
            <Option value="manual" key="manual">{"@人工选路"}</Option>,
            <Option value="auto" key="auto">{"@自动选路"}</Option>,
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
                <Card>
                    <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={true}
                               hasSearch={true}
                               selectPlaceHolder={'@请选择状态'} selectTwoPlaceHolder={"@请选择链路类型"}
                               selectOneMethod={this.handleSelectStatus} selectTwoMethod={this.handleSelectType}
                               optionsTwo={optionTwo} options={option} submit={this.handleSearchSubmit}
                               hasSelectThree={true} selectThreePlaceHolder={"@请选择公司"}
                               selectThreeMethod={this.handleSelectCompany}
                               optionsThree={optionThree}
                               selectFourMethod={this.handleSelectManualLink} optionsFour={optionFour}/>
                    <BossTable columns={columns}
                               dataSource={this.props.ci0201Info.dataSource} paging={true} component={this} getData={this.get_link_list} total={this.props.ci0201Info.linkTotal} />
                </Card>
            </div>
        )
    }
}

export default injectIntl(BI0401);