/*@用户-总部分组*/
import React from 'react';
import {Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import BossEditModal from "../../MI/MI1902/subComponents/BossEditModal";
import Operations from "../../MI/MI1901/subComponents/Operations";


class CI1502C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editModalShow: false,
            editRecord: {},
            editId: "",
        };

    }

    componentDidMount() {
        this.get_agency_group();
    }

    get_agency_list = () => {
        this.props.dispatch({
            type: "ci1502Info/get_agency_list",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                type: "CSTEP"
            }
        })
    };

    get_agency_group = () => {
        this.props.dispatch({
            type: "ci1502Info/get_agency_group",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
            }
        })
    };

    handleEditModalShow = (record) => {
        this.setState({
            editModalShow: true,
            editRecord: record.id ? record : {},
            editId: record.id,
        }, () => {
            this.get_agency_list()
        })
    };

    handleEditModalClose = () => {
        this.setState({
            editModalShow: false,
            editRecord: {},
            editId: "",
        })
    };

    delete_agency_group = (record) => {
        this.props.dispatch({
            type: "ci1502Info/delete_agency_group",
            payload: {
                update: {
                    ids: [record.id],
                    records: [record]
                },
                init: {
                    company_id: sessionStorage.getItem("companyId"),
                }
            }
        })
    };

    render() {
        const columns = [{
            title: '@名称',
            dataIndex: 'name',
            key: 'name',
            width: 120,
        }, {
            title: '@总部节点',
            dataIndex: 'agency_names',
            key: 'agency_names',
            width: 120,
        }, {
            title: '@备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 120,
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 120,
            render: (text, record) => {
                return <Operations edit={() => this.handleEditModalShow(record)} hasEdit={true} hasDelete={true}
                                   delete={() => this.delete_agency_group(record)}/>
            }
        }];
        const ModalOptions = {
            title: this.state.editId ? "@编辑总部分组" : "@新增总部分组",
            visible: this.state.editModalShow,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci1502Info/update_agency_group" : "ci1502Info/create_agency_group",
            extraUpdatePayload: {id: this.state.editRecord.id, company_id: sessionStorage.getItem("companyId")},
            onCancel: this.handleEditModalClose,
            initPayload: {
                company_id: sessionStorage.getItem("companyId"),
            },
            InputItems: [{
                type: "Input",
                labelName: "@名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入名称",
                },
                rules: [{required: true, message: "请输入名称"}, {max: 50, message: "@名称最大长度为50字符"}]
            }, {
                type: "Select",
                labelName: "@总部节点",
                valName: "agency_ids",
                nativeProps: {
                    placeholder: "@选择请总部节点",
                    mode: 'multiple'
                },
                children: this.props.ci1502Info.agencyList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                }),
                rules: [{required: true, message: "@选择请总部节点"},]
            }, {
                type: "TextArea",
                labelName: "@备注",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入备注",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{max: 128, message: "@备注最大长度为128字符"}]
            }]
        };
        return (
            <Card className="card">
                <HeaderBar hasAdd={true} add={this.handleEditModalShow}/>
                <BossTable columns={columns} dataSource={this.props.ci1502Info.agencyGroupList}/>
                <BossEditModal {...ModalOptions}/>
            </Card>
        )
    }
}

export default CI1502C;