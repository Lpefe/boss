/*@运维-链路信息*/
import React from 'react';
import '../../CI/CI0101New/index.scss';
import {Button, Card, Dropdown, Icon, Menu, Modal, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {domain} from '../../../utils/commonConsts';
import {parse, statusMap} from '../../../utils/commonUtilFunc';
import BossDataHeader from "../../Common/BossDataHeader";
import BossEditModal from "../../Common/BossEditModal";

const Option = Select.Option;

class MI0501 extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            link_type: "",
            name: "",
            status: (search.status==='在线'?"ONLINE":search.status==="离线"?"OFFLINE":search.status==="未激活"?"INIT":"") || "",
            deduplication: "",
            assign_type: "",
            bandwidth: search.bandwidth || "",
            editModalShow: false,
            edit_id: "",
            editRecord: {},
            selectedRecords: [],
            batchEditModalShow: false,
            protocolEditModalShow: false,
            page_no: 1,
            page_size: 20,
            company_id: ""

        }
    }

    componentDidMount() {
        this.get_link_list();
        this.get_link_stat();
        this.get_company_list();
    }

    get_company_list = () => {
        this.props.dispatch({
            type: "mi0501Info/get_company_list",
            payload: {}
        })
    };

    //获取链路列表
    get_link_list = () => {
        this.props.dispatch({
            type: "mi0501Info/get_link_list",
            payload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: this.state.status,
                deduplication: this.state.deduplication,
                assign_type: this.state.assign_type,
                bandwidth: this.state.bandwidth,
                company_id: this.state.company_id,
                page_no: this.state.page_no,
                page_size: this.state.page_size
            }
        })
    };
    //获取链路统计数据
    get_link_stat = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_stat",
            payload: {}
        })
    };
    //根据状态筛选链路
    handleSelectStatus = (value) => {
        this.setState({
            status: value || "",
            page_no: 1,
        }, () => {
            this.get_link_list()
        })
    };

    //根据类型筛选链路
    handleSelectType = (value) => {
        this.setState({
            link_type: value || "",
            page_no: 1,
        }, () => {
            this.get_link_list()
        })
    };

    handleSelectBandwidth = (value) => {
        let vm = this;
        this.setState({
            bandwidth: value || "",
            page_no: 1,
        }, function () {
            vm.get_link_list();
        })
    };

    handleSelectCompany = (value) => {
        this.setState({
            company_id: value || "",
            page_no: 1,
        }, () => {
            this.get_link_list();
        })
    };

    //根据关键字搜索链路
    handleSearchSubmit = (value) => {
        this.setState({
            name: value,
            page_no: 1,
        }, () => {
            this.get_link_list();
        })

    };

    //根据统计栏数字筛选链路
    checkLink = (status) => {
        this.setState({
            status: status,
            page_no: 1
        }, () => this.get_link_list())
    };

    gotoLink = (record) => {
        if (!record.device_id) {
            return;
        }
        window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0501/mi0502?id=" + record.id + "&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id + "&from=link&bandwidth=" + record.bandwidth)
    };

    gotoManualSelect = (record) => {
        window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0501/mi0503?id=" + record.id + "&branch=" + record.branch + "&main=" + record.main + "&assign_type=" + record.assign_type + '&name=' + record.name + "&company_id=" + record.company_id)
    };

    gotoDedup = (record) => {
        window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0501/mi0504?id=" + record.id + "&company_id=" + record.company_id + "&SN=" + record.device_sn + "&ram=" + record.device_ram + '&name=' + record.name)
    };

    handleOpenRttModal = (record) => {
        this.setState({
            editModalShow: true,
            editId: record.id,
            editRecord: record
        })
    };

    handleCloseRttModal = () => {
        this.setState({
            editModalShow: false,
            editId: "",
            editRecord: {}
        })
    };
    handleOpenRttModalBatch = () => {
        if (this.state.ids.length > 0) {
            this.setState({
                batchEditModalShow: true,
            })
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }

    };

    handleCloseRttModalBatch = () => {
        this.setState({
            batchEditModalShow: false,
        })
    };

    handleOpenProtocolModalBatch = () => {
        if (this.state.ids.length > 0) {
            this.setState({
                protocolEditModalShow: true,
            })
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }
    };
    handleOpenProtocolModal = (record) => {
        this.setState({
            editId: record.id,
            editRecord: record,
            protocolEditModalShow: true
        })
    };
    handleCloseProtocolModal = () => {
        this.setState({
            editId: "",
            editRecord: {},
            protocolEditModalShow: false
        })
    };

    operationMenuRender = (index, record) => {
        return <Menu>
            <Menu.Item key="1" onClick={() => this.gotoManualSelect(record)}>{'@人工选路'}</Menu.Item>
            <Menu.Item key="2" onClick={() => this.gotoDedup(record)}>{'@智能去重'}</Menu.Item>
            <Menu.Item key="3" onClick={() => this.handleOpenRttModal(record)}>{'@RTT设置'}</Menu.Item>
            <Menu.Item key="4" onClick={() => this.handleOpenProtocolModal(record)}>{'@协议设置'}</Menu.Item>
        </Menu>
    };

    render() {
        const search = parse(this.props.location.search);
        const columns = [{
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span className={record.device_id ? "common-link-icon" : ""}
                             onClick={() => this.gotoLink(record)}>
                   {record.name}
                </span>
            }
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: '@边缘节点',
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
            title: '@带宽' + '(M)',
            dataIndex: 'bandwidth',
            key: 'charge_type',
        }, {
            title: '@RTT基准值' + '(ms)',
            dataIndex: 'rtt_limit',
            key: 'rtt_limit',
        }, {
            title: "@操作",
            dataIndex: 'operation',
            key: 'operation',
            width:75,
            fixed:'right',
            align: 'center',
            render: (index, record) => {
                return <Dropdown overlay={this.operationMenuRender(index, record)}>
                    <Icon type="ellipsis"/>
                </Dropdown>
            }
        }];

        const option = [
            <Option value="ONLINE" key="ONLINE">@在线</Option>,
            <Option value="INIT" key="INIT">@未激活</Option>,
            <Option value="OFFLINE" key="OFFLINE">@离线</Option>
        ];

        const optionTwo = [
            <Option value="国内组网" key="国内组网">{"@国内组网"}</Option>,
            <Option value="全球组网" key="全球组网">{"@全球组网"}</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">{"@国内SaaS加速"}</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">{"@全球SaaS加速"}</Option>
        ];
        const optionsThree = this.props.mi0501Info.companyList.map((company) => {
            return <Option value={company.id} key={company.id}>{company.company_abbr}</Option>
        });

        const optionFive = [
            <Option value="0,10" key="manual">&lt;10M</Option>,
            <Option value="10,50" key="auto">10-50M</Option>,
            <Option value="50,100" key="auto">50-100M</Option>,
            <Option value="100," key="auto">@大于等于100M</Option>,
        ];

        const rttModalOptions = {
            title: "@RTT基准值",
            visible: this.state.editModalShow,
            onCancel: this.handleCloseRttModal,
            dispatch: this.props.dispatch,
            submitType: "mi0501Info/update_link",
            extraUpdatePayload: {id: this.state.editId},
            initialValues: this.state.editRecord,
            bodyHeight: 200,
            initPayload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: this.state.status,
                deduplication: this.state.deduplication,
                assign_type: this.state.assign_type,
                bandwidth: this.state.bandwidth,
                company_id: this.state.company_id,
                page_no: this.state.page_no,
                page_size: this.state.page_size
            },
            InputItems: [{
                type: "InputNumber",
                labelName: "@RTT基准值" + "(ms)",
                valName: "rtt_limit",
                nativeProps: {

                    placeholder: "@请输入RTT基准值",
                    max: 1000,
                    style: {
                        width: 200
                    }
                },
                rules: [{pattern: /^\d+$/, message: "@只能输入正整数"}],
            },]
        };
        const rttBatchModalOptions = {
            title: "@RTT基准值",
            visible: this.state.batchEditModalShow,
            onCancel: this.handleCloseRttModalBatch,
            dispatch: this.props.dispatch,
            submitType: "mi0501Info/update_link_batch",
            extraUpdatePayload: {ids: this.state.ids},
            initialValues: {},
            bodyHeight: 200,
            initPayload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: this.state.status,
                deduplication: this.state.deduplication,
                assign_type: this.state.assign_type,
                bandwidth: this.state.bandwidth,
                company_id: this.state.company_id,
                page_no: this.state.page_no,
                page_size: this.state.page_size
            },
            InputItems: [{
                type: "InputNumber",
                labelName: "@RTT基准值" + "(ms)",
                valName: "rtt_limit",
                nativeProps: {
                    max: 1000,
                    placeholder: "@请输入RTT基准值",
                    style: {
                        width: 200
                    }
                },
                rules: [{pattern: /^\d+$/, message: "@只能输入正整数"}],
            },]
        };

        const protocolModalOptions = {
            title: "@协议",
            visible: this.state.protocolEditModalShow,
            onCancel: this.handleCloseProtocolModal,
            dispatch: this.props.dispatch,
            submitType: "mi0501Info/update_link_batch",
            extraUpdatePayload: {ids: this.state.editId ? [this.state.editId] : this.state.ids},
            initialValues: this.state.editRecord,
            bodyHeight: 100,
            initPayload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: this.state.status,
                deduplication: this.state.deduplication,
                assign_type: this.state.assign_type,
                bandwidth: this.state.bandwidth,
                company_id: this.state.company_id,
                page_no: this.state.page_no,
                page_size: this.state.page_size
            },
            InputItems: [{
                type: "Radio",
                labelName: "@协议",
                valName: "path_proto",
                nativeProps: {
                    placeholder: "@请选择协议", defaultValue: 1
                },
                rules: [{required: true, message: "@请选择协议",}],
                children: [{value: 1, name: "TCP", key: "1"}, {
                    value: 2,
                    name: "UDP",
                    key: "2"
                }, {
                    value: 3,
                    name: "TCP+UDP",
                    key: "3"
                }]
            },]
        };
        const rowSelection = {
            fixed: "left",
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    ids: selectedRowKeys,
                    selectedRecords: selectedRecords
                })
            }
        };
        return (
            <div>
                <BossDataHeader offLine={this.props.ci0201Info.linkStat.OFFLINE}
                                init={this.props.ci0201Info.linkStat.INIT}
                                onLine={this.props.ci0201Info.linkStat.ONLINE}
                                total={this.props.ci0201Info.total}
                                checkLink={this.checkLink}
                                TotalLink="@链路总数"
                                changeImg={true}
                />
                <Card className="card">
                    <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={true}
                               hasSearch={true}
                               selectPlaceHolder={'@请选择状态'}
                               selectTwoPlaceHolder={"@请选择链路类型"}
                               selectOneMethod={this.handleSelectStatus} selectTwoMethod={this.handleSelectType}
                               optionsTwo={optionTwo} options={option} submit={this.handleSearchSubmit}
                               selectFiveMethod={this.handleSelectBandwidth}
                               optionsFive={optionFive}
                               hasSelectFive={true} selectFivePlaceHolder={"@带宽"}
                               selectFiveDefaultValue={search.bandwidth}
                               selectOneDefaultValue={search.status} hasExtraBtnThree={true}
                               extraBtnNameThree={"@批量RTT设置"}
                               hasSelectThree={true} selectThreePlaceHolder="@请选择企业"
                               selectThreeMethod={this.handleSelectCompany}
                               btnThreeFunc={this.handleOpenRttModalBatch} extraSlot={<Button
                        onClick={this.handleOpenProtocolModalBatch}>{"@批量协议设置"}</Button>}
                               selectOneWidth={120} selectTwoWidth={140} selectThreeWidth={120}
                               optionsThree={optionsThree} selectFiveWidth={120}
                    />
                    <BossTable paging={true} component={this} getData={this.get_link_list} columns={columns}
                               dataSource={this.props.mi0501Info.linkList} total={this.props.mi0501Info.total}
                               rowSelection={rowSelection}/>
                </Card>
                <BossEditModal {...rttModalOptions}/>
                <BossEditModal {...rttBatchModalOptions}/>
                <BossEditModal {...protocolModalOptions}/>
            </div>
        )
    }
}

export default injectIntl(MI0501)