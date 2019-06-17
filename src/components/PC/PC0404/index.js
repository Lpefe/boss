/*@账号管理员-大区设置*/
import React from 'react';
import {Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import BossEditModal from "../../Common/BossEditModal";
import Operations from "../../Common/Operations";
import mapMessages from "../../../locales/mapMessages";
import {commonTranslate} from "../../../utils/commonUtilFunc";


class PC0404C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editModalShow: false,
            editRecord: {},
            editId: "",
            name: ""

        };

    }

    componentDidMount() {
        this.get_area();
    }

    get_area = () => {
        this.props.dispatch({
            type: "pc0404Info/get_area",
            payload: {
                name: this.state.name
            }
        })
    };
    //level=1获取国家,level=2获取省份
    get_address = (level, parent_id) => {
        this.props.dispatch({
            type: "pc0404Info/get_address",
            payload: {
                level: level,
                parent_id: parent_id || ""
            }
        })
    };

    handleSelectCountry = (value, vm) => {
        this.get_address(2, value);
        vm.props.form.setFieldsValue({"level2_ids": []})
    };

    handleSubmit = (value) => {
        this.setState({
            name: value
        }, () => {
            this.get_area()
        })
    };
    handleEditModalShow = (record) => {
        this.setState({
            editModalShow: true,
            editRecord: record.id ? record : {},
            editId: record.id
        }, () => {
            this.get_address(1);
            if (record.id) {
                this.get_address(1);
                this.get_address(2, record.level1_id)
            }
        })
    };

    handleEditModalClose = () => {
        this.setState({
            editModalShow: false,
            editRecord: {},
            editId: ""
        })
    };
    delete_area = (record) => {
        this.props.dispatch({
            type: "pc0404Info/delete_area",
            payload: {
                update:{
                    ids: [record.id],
                    records:[record]
                },
                init:{
                    name:this.state.name
                }
            }
        })
    };

    render() {
        const __=commonTranslate(this);
        const columns = [{
            title: '@国家(地区)',
            dataIndex: 'level1_name',
            key: 'level1_name',
            render:(text)=>{
                return __(mapMessages[text])
            }
        }, {
            title: '@大区',
            dataIndex: 'name',
            key: 'name',

        }, {
            title: '@包含省市',
            dataIndex: 'level2_names',
            key: 'level2_names',
            render:(text)=>{
                let textArr=text.split('、');
                for(let key in textArr){
                    textArr[key]=__(mapMessages[textArr[key]],textArr[key])
                }
                return textArr.join('、')
            }
        }, {
            title: '@说明',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            fixed:'right',
            render: (text, record) => {
                return <Operations hasDelete={true} hasEdit={true} edit={() => this.handleEditModalShow(record)}
                                   delete={() => this.delete_area(record)}/>
            }
        },];

        const modalOption = {
            title: this.state.editId ? "@编辑大区" : "@新增大区",
            visible: this.state.editModalShow,
            onCancel: this.handleEditModalClose,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "pc0404Info/update_area" : "pc0404Info/create_area",
            extraUpdatePayload: {id: this.state.editId},
            initialValues: this.state.editRecord,
            initPayload: {
                name:this.state.name
            },
            InputItems: [{
                type: "Select",
                labelName: "@国家(地区)",
                valName: "level1_id",
                nativeProps: {
                    placeholder: "@请选择国家(地区)",
                    showSearch: true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                },
                onChange: this.handleSelectCountry,
                rules: [{required: true, message: "@请选择国家(地区)"}],
                children: this.props.pc0404Info.countryList.map((child) => {
                    return {value: child.id, name:__(mapMessages[child.name],child.name), key: child.id}
                })
            }, {
                type: "Input",
                labelName: "@大区名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入大区名称"
                },
                rules: [{required: true, message: "@请输入大区名称"}],
            }, {
                type: "Select",
                labelName: "@包含省市",
                valName: "level2_ids",
                nativeProps: {
                    placeholder: "@请选择包含省市",
                    mode: "multiple",
                    showSearch:true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                children: this.props.pc0404Info.provinceList.map((child) => {
                    return {value: child.id, name: __(mapMessages[child.name],child.name), key: child.id}
                }),
                rules: [{required: true, message: "@请选择包含省市"}],
            }, {
                type: "Input",
                labelName: "@说明",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入说明"
                },
                rules: [{required: true, message: "@请输入说明"}],
            },]
        };
        return (
            <Card className="card">
                <HeaderBar hasAdd={true} hasSearch={true} add={this.handleEditModalShow} submit={this.handleSubmit}/>
                <BossTable columns={columns} dataSource={this.props.pc0404Info.areaList}/>
                <BossEditModal {...modalOption}/>
            </Card>
        )
    }
}

export default injectIntl(PC0404C);