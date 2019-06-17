/*@账号管理员-账号管理*/
import React from 'react';

import {Card, Icon, Layout, Menu, Modal, Popconfirm, Select, Switch, Tooltip} from 'antd';

import Operations from '../../Common/Operations';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import messages from './LocaleMsg/messages';
import {localeMap, MomentFormatter, roleMap} from '../../../utils/commonUtilFunc';
import moment from "moment";
import {injectIntl} from "react-intl";
import BossEditModal from "../../Common/BossEditModal";

const Option = Select.Option;
const {Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;

class PC0101C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company_id: "",
            name: "",
            role: "",
            is_active: null,
            editModalShow: false,
            editPersonId: "",
            editPersonRecord: {},
            userNm: "",
            addTreeNodeModalShow: false,
            parent_id: null,
            selectedDepartmentId: 1,
            editDepartmentId: "",
            editDepartmentRecord: {},
            changePasswordShow: false,
            selectedLang: localeMap(window.appLocale.locale),
            theme: localStorage.getItem("theme"),
            rightSiderCollapse: true,
            department_id: "",
            ifAdd: true
        };
        this.roleMap = [
            {label: "@管理员", value: "supercxpadmin"},
            {label: "@运维", value: "supercxptechnology"},
            {label: "@商务", value: "supercxpbusiness"},
            {label: "@技术支持", value: "supercxptechsupport"},
            {label: "@商务主管", value: "supercxpbizadmin"},
            {label: "@技术支持主管", value: "supercxptechadmin"},
        ]
    }

    componentWillMount() {
        const ifLogin = sessionStorage.getItem("ifLogin");
        const userNm = sessionStorage.getItem("userNm");
        if (ifLogin === "false" || !ifLogin) {
            this.props.history.push("/")
        } else {
            this.setState({
                userNm: userNm
            })
        }
    }


    componentDidMount() {
        /*this.get_company_list();*/
        this.get_dep_tree();
        this.get_related_person_list();
    }

    componentDidUpdate() {
        if (this.props.layoutInfo.ifChangedPwd) {
            const model = Modal.success({
                title: "@密码已修改,请重新登录",
            });
            setTimeout(() => {
                model.destroy();
                this.props.history.push("/");
                this.props.layoutInfo.ifChangedPwd = false;
            }, 2000);
        }
    }

    get_related_person_list = () => {
        this.props.dispatch({
            type: "pc0101Info/getRelatedPersonList",
            payload: {
                department_id: this.state.selectedDepartmentId,
                role: this.state.role,
                is_active: this.state.is_active,
                name: this.state.name
            }
        });
    };

    /*get_company_list = () => {
        this.props.dispatch({
            type: "pc0101Info/get_company_list",
            payload: {}
        });
    };*/

    get_dep_tree = () => {
        this.props.dispatch({
            type: "pc0101Info/get_dep_tree",
            payload: {}
        });
    };


    edit = (record) => {
        this.setState({
            editModalShow: true,
            editPersonId: record.id,
            editPersonRecord: record
        });
    };

    closeEditRelatedPersonModal = () => {
        this.setState({
            editModalShow: false,
            editPersonId: "",
            editPersonRecord: {}
        })
    };

    addRelatedPerson = () => {
        this.setState({
            editModalShow: true
        })
    };
    deleteRelatedPerson = (record) => {
        this.props.dispatch({
            type: "pc0101Info/deleteRelatedPerson",
            payload: {
                delete: {id: record.id, records: [record]},
                reload: {
                    department_id: this.state.selectedDepartmentId,
                    name: this.state.name,
                    role: this.state.role
                }
            }
        })
    };


    add_department_root = () => {
        this.setState({
            addTreeNodeModalShow: true,
            parent_id: null
        })
    };

    deleteTreeNode = (id, name) => {
        this.props.dispatch({
            type: "pc0101Info/delete_department",
            payload: {
                id: id,
                records: [{name: name}]
            }
        });
    };
    editTreeNode = (e, node) => {
        node.name = node.label;
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            addTreeNodeModalShow: true,
            editDepartmentId: node.value,
            editDepartmentRecord: node,
            ifAdd: false
        })
    };

    addTreeNode = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            addTreeNodeModalShow: true,
            editDepartmentId: id,
            ifAdd: true
        })
    };
    closeAddDepartmentModal = () => {
        this.setState({
            addTreeNodeModalShow: false,
            parent_id: null,
            editDepartmentId: "",
            editDepartmentRecord: {}
        })
    };

    selectDepartment = (obj, id) => {
        obj.domEvent.stopPropagation();
        obj.domEvent.preventDefault();
        this.setState({
            selectedDepartmentId: id,
        }, () => {
            this.get_related_person_list();
        })
    };


    renderMenu = (data) => {
        let {theme} = this.props.layoutInfo;
        return data.map(item => {
            if (item.children) {
                return <SubMenu key={item.value} onTitleClick={(obj) => this.selectDepartment(obj, item.value)}
                                title={<div className="editable-tree-node">
                                    <Icon type="folder-open" className="icon"/>{item.label.length > 6 ?
                                    <Tooltip title={item.label}>&nbsp;<span
                                        style={theme === "dark" ? {color: "#fff"} : {color: "rgba(0,0,0,0.65)"}}>&nbsp;{(item.label.substring(0, 6) + "...")}</span></Tooltip> :
                                    <span
                                        style={theme === "dark" ? {color: "#fff"} : {color: "rgba(0,0,0,0.65)"}}>&nbsp;{item.label}</span>}
                                    <div className="tree-node-operation">
                                        <Icon type="plus" className="btn"
                                              onClick={(e) => this.addTreeNode(e, item.value)}/>
                                        <Icon type="edit" className="btn"
                                              onClick={(e) => this.editTreeNode(e, item)}/>
                                        <Popconfirm title="确定删除该部门吗?"
                                                    onConfirm={() => this.deleteTreeNode(item.value, item.label)}><Icon
                                            type="delete" className="btn"/></Popconfirm>
                                    </div>
                                </div>}>
                    {this.renderMenu(item.children)}
                </SubMenu>
            } else {
                return <Menu.Item key={item.value} onClick={(e) => this.selectDepartment(e, item.value)}>
                    <div className="editable-tree-node">
                        <Icon type="folder-open" className="icon"/>
                        <Tooltip title={item.label}>
                            <span
                                style={theme === "dark" ? {color: "#fff"} : {color: "rgba(0,0,0,0.65)"}}>&nbsp;{item.label.length > 6 ? (item.label.substring(0, 6) + "...") : item.label}</span>
                        </Tooltip>
                        <div className="tree-node-operation">
                            {item.level === 3 ? "" :
                                <Icon type="plus" className="btn"
                                      onClick={(e) => this.addTreeNode(e, item.value)}/>}
                            <Icon type="edit" className="btn" onClick={(e) => this.editTreeNode(e, item)}/>
                            <Popconfirm title={"@确定删除该部门吗" + "?"}
                                        onConfirm={() => this.deleteTreeNode(item.value, item.label)}><Icon
                                type="delete" className="btn"/>
                            </Popconfirm>
                        </div>
                    </div>
                </Menu.Item>
            }
        })
    };

    change_activity = (value, record) => {
        record.is_active = !value;
        this.props.dispatch({
            type: "pc0101Info/change_activity",
            payload: {
                id: record.id,
                is_active: value,
                record: record
            }
        })
    };

    selectRole = (value) => {
        this.setState({
            role: value || ""
        }, function () {
            this.props.dispatch({
                type: "pc0101Info/getRelatedPersonList",
                payload: {
                    department_id: this.state.selectedDepartmentId || this.props.pc0101Info.selectedDepartmentId,
                    role: this.state.role,
                    is_active: this.state.is_active,
                    name: this.state.name
                }
            })
        })
    };

    selectStatus = (value) => {
        this.setState({
            is_active: value === undefined ? "" : value
        }, function () {
            this.props.dispatch({
                type: "pc0101Info/getRelatedPersonList",
                payload: {
                    department_id: this.state.selectedDepartmentId || this.props.pc0101Info.selectedDepartmentId,
                    role: this.state.role,
                    is_active: this.state.is_active,
                    name: this.state.name
                }
            })
        })
    };


    searchName = (value) => {
        this.setState({
            name: value || ""
        }, function () {
            this.props.dispatch({
                type: "pc0101Info/getRelatedPersonList",
                payload: {
                    department_id: this.state.selectedDepartmentId || this.props.pc0101Info.selectedDepartmentId,
                    role: this.state.role,
                    is_active: this.state.is_active,
                    name: this.state.name
                }
            })
        })
    };

    resetPassword = (record) => {
        this.props.dispatch({
            type: "pc0101Info/reset_password",
            payload: {
                id: record.id,
                record: record
            }
        })
    };


    handleTabChange = (key) => {
        if (key === "3") {
            this.props.dispatch({
                type: "pc0101Info/get_request_log",
                payload: {
                    start_time: MomentFormatter(moment().subtract(1, 'week')),
                    end_time: MomentFormatter(moment()),
                    name: "",
                    page_no: 1,
                    page_size: 20
                }
            })
        }
    };

    handleRightSiderCollapse = () => {
        this.setState({
            rightSiderCollapse: !this.state.rightSiderCollapse
        })
    };

    render() {
        const columns = [{
            title: '@账号',
            dataIndex: 'mail',
            key: 'mail',
            width: 150
        }, {
            title: '@角色',
            dataIndex: 'role',
            key: 'role',
            width: 100,
            render: (index, record) => {
                return <span>{roleMap(record.role)}</span>
            }
        }, {
            title: '@姓名',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        }, {
            title: '@所属部门',
            dataIndex: 'department_name',
            key: 'department_name',
            width: 200,

        }, {
            title: '@联系方式',
            dataIndex: 'tel',
            key: 'tel',
            width: 200,
        }, {
            title: '@状态',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            render: (index, record) => {
                return (
                    <Switch disabled={record.mail === sessionStorage.getItem("userNm")}
                            unCheckedChildren={"@禁用"}
                            checkedChildren={'@启用'} defaultChecked={record.is_active}
                            onChange={(value) => this.change_activity(value, record)}/>
                )
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:150,
            fixed:'right',
            align: "center",
            render: (index, record) => {
                return (<Operations extraToolTip={"@密码重置"} hasDelete={true} hasEdit={true}
                                    edit={() => this.edit(record)}
                                    delete={() => this.deleteRelatedPerson(record)} hasExtra={true} extraIcon="key"
                                    extra={() => this.resetPassword(record)}/>)
            }
        }];

        const pagination = {
            pageSize: 20,
            onChange: () => {
                this.get_related_person_list();
            }
        };
        const options = [
            <Option key="supercxpadmin" value="supercxpadmin">{"@管理员"}</Option>,
            <Option key="supercxpbusiness" value="supercxpbusiness">{"@商务"}</Option>,
            <Option key="supercxptechnology" value="supercxptechnology">{"@运维"}</Option>,
            <Option key="supercxptechsupport" value="supercxptechsupport">{"@技术支持"}</Option>,
            <Option key="supercxpbizadmin" value="supercxpbizadmin">{"@商务主管"}</Option>,
            <Option key="supercxptechadmin" value="supercxptechadmin">{"@技术支持主管"}</Option>,
        ];

        const optionsTwo = [
            <Option key="1" value={1}>{"@启用"}</Option>,
            <Option key="0" value={0}>{"@禁用"}</Option>
        ];

        const departmentModalOptions = {
            title: !this.state.ifAdd ? "@编辑部门" : "@新增部门",
            visible: this.state.addTreeNodeModalShow,
            onCancel: this.closeAddDepartmentModal,
            bodyHeight: 150,
            dispatch: this.props.dispatch,
            submitType: !this.state.ifAdd ? "pc0101Info/update_department" : "pc0101Info/add_department",
            extraUpdatePayload: this.state.ifAdd ? {parent_id: this.state.editDepartmentId} : {id: this.state.editDepartmentId},
            initialValues: Object.assign({}, this.state.editDepartmentRecord),
            initPayload: {},
            InputItems: [{
                type: "Input",
                labelName: "@部门名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入部门名称"
                },
                rules: [{required: true, message: "@请输入部门名称"},],
            },]
        };

        const relatedPersonModalOptions = {
            title: this.state.editPersonId ? "@编辑联系人" : "@新增联系人",
            visible: this.state.editModalShow,
            onCancel: this.closeEditRelatedPersonModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editPersonId ? "pc0101Info/update_related_person" : "pc0101Info/create_related_person",
            extraUpdatePayload: this.state.editPersonId ? {id: this.state.editPersonId} : {department_id: this.state.selectedDepartmentId},
            initialValues: Object.assign({}, this.state.editPersonRecord),
            initPayload: {
                department_id: this.state.selectedDepartmentId,
                role: this.state.role,
                is_active: this.state.is_active,
                name: this.state.name
            },
            InputItems: [this.state.editPersonId ? {
                type: "Cascader",
                labelName: "@所属部门",
                valName: "department_path",
                nativeProps: {
                    placeholder: "@请选择所属部门",
                    options: this.props.pc0101Info.dep_tree,
                    showSearch: true
                },
                rules: [{required: true, message: "@请选择所属部门"},],
            } : {
                type: "Input",
                labelName: "@账号",
                valName: "mail",
                nativeProps: {
                    placeholder: "@请输入联系人邮箱",
                },
                rules: [{
                    required: true,
                    message: "@请输入联系人邮箱"
                }, {
                    pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                    message: "@请输入正确邮箱格式"
                }],
            }, {
                type: "Select",
                labelName: "@角色",
                valName: "role",
                nativeProps: {
                    placeholder: "@请选择角色",
                },
                rules: [{required: true, message: "@请选择角色"},],
                children: this.roleMap.map((role) => {
                    return {name: role.label, value: role.value, key: role.value}
                })
            }, {
                type: "Input",
                labelName: "@姓名",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入联系人姓名",
                },
                rules: [{required: true, message: "@请输入联系人姓名"},],
            }, {
                type: "Input",
                labelName: "@联系方式",
                valName: "tel",
                nativeProps: {
                    placeholder: "@请输入联系人电话",
                },
                rules: [{required: true, message: "@请输入联系人电话"},],
            },]
        };

        return (
            <div className="pc0101">
                <Layout>
                    <Layout>
                        <div className="bread">@账号管理</div>
                        <Content style={{marginRight: 24}}>
                            <Card className="card" id="pc0101-card">
                                <HeaderBar hasDelete={false} hasAdd={true} hasSelect={true} hasSelectTwo={true}
                                           selectPlaceHolder={"@请选择角色"}
                                           selectTwoPlaceHolder={"@请选择状态"} hasSearch={true}
                                           add={this.addRelatedPerson}
                                           options={options} optionsTwo={optionsTwo}
                                           selectOneMethod={this.selectRole}
                                           selectTwoMethod={this.selectStatus}
                                           submit={this.searchName} hasExtraBtnThree={true} extraBtnNameThree="@组织架构"
                                           btnThreeFunc={this.handleRightSiderCollapse}/>
                                <BossTable columns={columns}
                                           dataSource={this.props.pc0101Info.relatedPersonList}
                                           pagination={pagination} id="pc0101-table"/>
                                <BossEditModal {...relatedPersonModalOptions}/>
                                <BossEditModal {...departmentModalOptions}/>
                            </Card>
                        </Content>
                    </Layout>
                    <Sider className="right-sider" width={300} collapsedWidth={56}
                           collapsed={this.state.rightSiderCollapse}>
                        <Menu className="department-tree" mode="inline" theme={this.props.layoutInfo.theme}>
                            <Menu.Item disabled={true} key="header" style={{cursor: "default"}}>
                                {!this.state.rightSiderCollapse ?
                                    <div>
                                        <Icon type="menu-unfold" style={{
                                            color: this.props.layoutInfo.theme === 'dark' ? '#fff' : "rgba(0,0,0,0.65)",
                                            cursor: "pointer",
                                            fontSize: 16
                                        }} onClick={this.handleRightSiderCollapse}/>
                                        <span
                                            style={this.props.layoutInfo.theme === 'dark' ? {color: '#fff'} : {color: "rgba(0,0,0,0.65)"}}>{"@组织架构"}</span>
                                        <a style={{float: "right", marginRight: 16}}
                                           onClick={this.add_department_root}>{"@添加公司"}</a>
                                    </div> :
                                    <Tooltip placement="left" title="@组织架构"><Icon
                                        style={this.props.layoutInfo.theme === 'dark' ? {
                                            color: '#fff',
                                            cursor: "pointer"
                                        } : {color: "rgba(0,0,0,0.65)", cursor: "pointer"}}
                                        onClick={this.handleRightSiderCollapse}
                                        type="menu-fold"/></Tooltip>}
                            </Menu.Item>
                            {this.renderMenu(this.props.pc0101Info.dep_tree)}
                        </Menu>
                    </Sider>
                </Layout>
            </div>
        )
    }
}

export default injectIntl(PC0101C);
