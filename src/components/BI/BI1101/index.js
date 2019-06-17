/*@技术支持-链路管理*/
import React from 'react';
import './index.scss';
import {Card, Dropdown, Icon, Menu, Modal, Select,} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {withRouter} from 'react-router-dom';
import BossEditModal from "../../Common/BossEditModal";
import moment from 'moment';
import {injectIntl} from "react-intl";
import BossDataHeader from "../../Common/BossDataHeader";
import {domain} from "../../../utils/commonConsts";
import {statusMap} from "../../../utils/commonUtilFunc";
import {editModalOptionsGenerator, HAModalOptionsGenerator, multipleAddModalOptionsGenerator,multipleEditModalOptionsGenerator} from "./modalOptions";
const Option = Select.Option;
const page_size=20;
const page_no=1;
class BI1101 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifEditModalShow: false,
            editId: "",
            editRecord: {
                charge_type: "固定计费",
            },
            ifMultipleAddModalShow: false,
            ifMultipleEditModalShow:false,
            company_id: "",
            name: "",
            link_type: "",
            status: "",
            selectedIds: [],
            selectedRecords: [],
            ifBackUpLine: false,
            addModalInitialCompanyId: undefined,
            ifEditHAModalShow: false,
            ifCenterHA: false,
            editHARecord: {},
            editHAId:"",
            page_no:page_no,
            page_size:page_size,
            ifEditGrade:false,
            ifEditBandwidth:false
        }
    }

    componentDidMount() {
        this.get_company_list();
        this.get_link_list();
        this.get_link_stat();
    }

    checkLink = (status) => {
        this.setState({
            page_no:page_no,
            page_size:page_size,
            status:status
        },()=>{
            this.get_link_list();
        })

    };

    get_link_stat = () => {
        this.props.dispatch({
            type: "bi1101Info/get_link_stat",
            payload: {}
        })
    };

    get_link_list = () => {
        this.props.dispatch({
            type: "bi1101Info/get_link_list",
            payload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: this.state.status,
                company_id: this.state.company_id,
                page_no:this.state.page_no,
                page_size:this.state.page_size
            }
        })
    };

    get_company_list = () => {
        this.props.dispatch({
            type: "bi1101Info/get_company_list",
            payload: {}
        })
    };

    handleSelectStatus = (value) => {
        this.setState({
            status: value || ""
        }, () => {
            this.get_link_list();
        })
    };


    handleSelectType = (value) => {
        this.setState({
            link_type: value || ""
        }, () => {
            this.get_link_list();
        })
    };
    //添加时获取中心节点
    get_center_agency_list = (company_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_agency_list",
            payload: {
                company_id: company_id,
                type: "CSTEP",
            }
        })
    };
    //添加时获取边缘节点
    get_edge_agency_list = (company_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_agency_list",
            payload: {
                company_id: company_id
            }
        })
    };
    //批量添加是获取中心节点
    get_center_agency_list_batch = (company_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_agency_list_batch",
            payload: {
                company_id: company_id,
                type: "CSTEP",
            }
        })
    };
    //批量添加时获取边缘节点
    get_edge_agency_list_batch = (company_id,center_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_agency_list_batch",
            payload: {
                company_id: company_id,
                //has_link: 0,
                has_device: 1,
                no_link_with:center_id
            }
        })
    };

    get_device_list = (agency_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_device_list",
            payload: {
                agency_id: agency_id,
                type:"STEP,CSTEP"
            }
        })
    };

    get_speed_rule = (company_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_speed_rule",
            payload: {
                company_id: company_id
            }
        })
    };

    closeAddModal = () => {
        this.setState({
            ifEditModalShow: false,
            editId: "",
            editRecord: {
                charge_type: "固定计费"
            },
            ifBackUpLine: false,
        })
    };

    closeMultipleAddModal = () => {
        this.setState({
            ifMultipleAddModalShow: false,
        })
    };
    handleOpenAddCompanyModal = (record) => {
        if (record.company_id) {
            this.get_edge_agency_list(record.company_id);
            this.get_center_agency_list(record.company_id);
            this.get_device_list(record.edge_id);
            this.get_speed_rule(record.company_id)
        }
        if(this.state.company_id){
            this.get_edge_agency_list(this.state.company_id);
            this.get_center_agency_list(this.state.company_id);
            this.get_speed_rule(this.state.company_id)
        }
        this.setState({
            ifEditModalShow: true,
            editId: record.id || "",
            editRecord: record.company_id ? record : {
                charge_type: "固定计费",
                company_id: this.state.addModalInitialCompanyId,
            },
        })
    };
    handleOpenMultipleAddModal = () => {
        this.setState({
            ifMultipleAddModalShow: true,
        })
    };

    handleSearchCompany = (value) => {
        this.setState({
            company_id: value || "",
            addModalInitialCompanyId: value || undefined,
        }, () => {
            this.get_link_list()
        })
    };

    handleSubmit = (value) => {
        this.setState({
            name: value || ""
        }, () => {
            this.get_link_list();
        })
    };
    //批量删除链路
    deleteLink = () => {
        this.props.dispatch({
            type: "bi1101Info/delete_link_batch",
            payload: {
                deleteEmpty: {
                    ids: this.state.selectedIds.filter((id) => {
                        return id < 0
                    }),
                    records: this.state.selectedRecords.filter((record) => {
                        return record.device_id === undefined
                    }),
                },
                delete: {
                    ids: this.state.selectedIds.filter((id) => {
                        return id > 0
                    }),
                    records: this.state.selectedRecords.filter((record) => {
                        return record.device_id !== undefined
                    }),
                },
                init: {
                    link_type: this.state.link_type,
                    name: this.state.name,
                    status: this.state.status,
                    company_id: this.state.company_id
                }
            }
        })
    };
    deleteLinkSingle = (record) => {
        Modal.confirm({
            title: "@确定要删除该条链路吗?",
            onOk: () => {
                this.props.dispatch({
                    type: "bi1101Info/delete_link",
                    payload: {
                        delete: {
                            ids: [record.id],
                            records: [record]
                        },
                        init: {
                            link_type: this.state.link_type,
                            name: this.state.name,
                            status: this.state.status,
                            company_id: this.state.company_id
                        }
                    }
                })
            }
        })

    };

    gotoLink = (record) => {
        if (!record.device_id) {
            return;
        }
        window.open(domain + "/index." + window.appLocale.locale + ".html#/main/bi0401/bi0402?id=" + record.id + "&from=link&bandwidth=" + record.bandwidth + "&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id)
    };

    handleOpenEditHAModal = (record, ifCenterHA) => {
        this.setState({
            ifEditHAModalShow: true,
            ifCenterHA: ifCenterHA,
            editHARecord: record,
            editHAId:record.id
        },()=>{
            if(ifCenterHA){
                this.getHACenterLinkList();
            }else{
                this.getHAEdgeLinkList();
            }
        })
    };
    closeEditHAModal = () => {
        this.setState({
            ifEditHAModalShow: false,
            ifCenterHA: false,
            editHARecord: {},
            editHAId:""
        })
    };

    getHACenterLinkList = () => {
        this.props.dispatch({
            type: "bi1101Info/get_link_list_HA_center",
            payload: {
                company_id: this.state.editHARecord.company_id,
                device_id:this.state.editHARecord.device_id,
                exc_agency_id: this.state.editHARecord.agency_id,
            }
        })
    };

    getHAEdgeLinkList = () => {
        this.props.dispatch({
            type: "bi1101Info/get_link_list_HA_edge",
            payload: {
                edge_id: this.state.editHARecord.edge_id,
                agency_id: this.state.editHARecord.agency_id,
                exc_device_id:this.state.editHARecord.device_id,
                company_id: this.state.editHARecord.company_id,
            }
        })
    };


    operationMenuRender = (index, record) => {
        return <Menu>
            <Menu.Item key="1" onClick={() => this.handleOpenAddCompanyModal(record)}>{'@编辑'}</Menu.Item>
            <Menu.Item key="2"
                       onClick={() => this.handleOpenEditHAModal(record, true)}>{'@中心HA'}</Menu.Item>
            <Menu.Item key="3"
                       onClick={() => this.handleOpenEditHAModal(record, false)}>{'@边缘HA'}</Menu.Item>
            <Menu.Item key="4" onClick={() => this.deleteLinkSingle(record)}>{"@删除"}</Menu.Item>
        </Menu>
    };

    handleOpenEditLinkBathModal=()=>{
        if (this.state.selectedIds.length > 0) {
            this.setState({
                ifMultipleEditModalShow:true
            })
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }

    };
    handleCloseEditLinkBathModal=()=>{
        this.setState({
            ifMultipleEditModalShow:false,
            ifEditGrade:false,
            ifEditBandwidth:false
        })
    };

    render() {
        const columns = [{
            title: '@创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            fixed: "left",
            width:200,
            render: (index, record) => {
                return record.create_time ? moment(record.create_time).format("YYYY-MM-DD HH:mm:ss") : ""
            }
        }, {
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
            width:300,
            render: (text, record) => {
                return <span onClick={() => this.gotoLink(record)}
                             className={record.device_id ? "common-link-icon" : ""}>{record.name}</span>
            }
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            width:100,
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
            width:300,
        }, {
            title: '@边缘节点',
            dataIndex: 'branch',
            key: 'branch',
            width:300,
        }, {
            title: '@服务等级',
            dataIndex: 'grade',
            key: 'grade',
            width:200,
            render: (text, record) => {
                return record.grade === "CLOUD_VPN" ? "@云VPN" : (record.grade === "CLOUD_SPLINE" ? "@云专线" : "@超级云专线")
            }
        }, {
            title: '@链路类型',
            dataIndex: 'type',
            key: 'type',
            width:100,
            render:(text)=>{
                switch(text){
                    case "国内组网":
                        return "@国内组网";
                    case "全球组网":
                        return "@全球组网";
                    case "国内SaaS加速":
                        return "@国内SaaS加速";
                    case "全球SaaS加速":
                        return "@全球SaaS加速";
                    default:
                        return ""
                }

            }

        }, {
            title: '@带宽(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
            width:100,
        }, {
            title: '@RTT基准值(ms)',
            dataIndex: 'rtt_limit',
            key: 'rtt_limit',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed: "right",
            width:75,
            render: (index, record) => {
                return <Dropdown overlay={this.operationMenuRender(index, record)}>
                    <Icon type="ellipsis"/>
                </Dropdown>
            }
        }];

        const ModalOptions = editModalOptionsGenerator(this);
        const multipleAddModalOptions = multipleAddModalOptionsGenerator(this);
        const HAModalOptions = HAModalOptionsGenerator(this);
        const multipleEditModalOptions=multipleEditModalOptionsGenerator(this);
        const options = this.props.bi1101Info.companyList.map((item) => {
            return <Option key={item.id} value={item.id}>{item.company_abbr}</Option>
        });
        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords,
                })
            }
        };
        const optionsTwo = [
            <Option value="ONLINE" key="ONLINE">@在线</Option>,
            <Option value="INIT" key="INIT">@离线</Option>,
            <Option value="OFFLINE" key="OFFLINE">@未激活</Option>,
        ];

        const optionsThree = [
            <Option value="国内组网" key="国内组网">{"@国内组网"}</Option>,
            <Option value="全球组网" key="全球组网">{"@全球组网"}</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">{"@国内SaaS加速"}</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">{"@全球SaaS加速"}</Option>
        ];
        return <div className="BI1101">
            <BossDataHeader offLine={this.props.bi1101Info.linkStat.OFFLINE}
                            init={this.props.bi1101Info.linkStat.INIT}
                            onLine={this.props.bi1101Info.linkStat.ONLINE}
                            total={this.props.bi1101Info.total}
                            checkLink={this.checkLink}
                            TotalLink="@链路总数"
                            changeImg={true}
            />
            <Card className='card'>
                <HeaderBar hasAdd={true} hasSelect={true} hasSearch={true} selectPlaceHolder={"@请选择企业"}
                           add={this.handleOpenAddCompanyModal} hasExtraBtnThree={true}
                           extraBtnNameThree={"@批量添加"} hasDelete={true}
                           btnThreeFunc={this.handleOpenMultipleAddModal}
                           options={options} selectOneMethod={this.handleSearchCompany} submit={this.handleSubmit}
                           delete={this.deleteLink} selectedKeys={this.state.selectedIds} hasSelectTwo={true}
                           hasSelectThree={true} selectTwoMethod={this.handleSelectStatus}
                           selectThreeMethod={this.handleSelectType} selectThreePlaceHolder={"@请选择链路类型"}
                           selectTwoPlaceHolder={'@请选择状态'} optionsTwo={optionsTwo}
                           optionsThree={optionsThree} selectOneWidth={120} selectTwoWidth={120}
                           selectThreeWidth={140} hasExtraBtnFour={true} btnFourFunc={this.handleOpenEditLinkBathModal} extraBtnNameFour="@批量编辑"/>
                <BossTable component={this} columns={columns} dataSource={this.props.bi1101Info.linkList} rowSelection={rowSelection}
                           scroll={{x: 'max-content'}}  getData={this.get_link_list} paging={true} total={this.props.bi1101Info.total}/>
                <BossEditModal {...ModalOptions}/>
                <BossEditModal {...multipleAddModalOptions}/>
                <BossEditModal {...HAModalOptions}/>
                <BossEditModal {...multipleEditModalOptions}/>
            </Card>
        </div>
    }
}

export default withRouter(injectIntl(BI1101));