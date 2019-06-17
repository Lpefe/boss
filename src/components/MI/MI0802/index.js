/*@运维-版本汇总*/
import React from 'react';
import './index.scss';
import {Button, Card, Input} from 'antd';
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import {withRouter,Link} from "react-router-dom"
class MI0802 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company_id: '',
            type: "",
            name: "",
            sn_list: [],
            companyList: [],
            version: "",
        }
    }

    componentDidMount() {
        this.get_device_version_stat()
    }

    get_device_version_stat = () => {
        this.props.dispatch({
            type: "mi0802Info/get_device_version_stat",
            payload: {}
        })
    };
    searchBySn = () => {
        this.props.dispatch({
            type: "mi0802Info/get_device_version_stat",
            payload: {
                name: this.state.name,
            }
        })
    };
    changeSn = (e) => {
        const value = e.target.value;
        this.setState({
            name: value.replace(/(^\s*)|(\s*$)/g, "")
        }, function () {
            if (value === "") {
                this.props.dispatch({
                    type: "mi0802Info/get_device_version_stat",
                    payload: {
                        name: this.state.name,
                    }
                })
            }
        })
    };

    render() {
        let arr = [];
        arr.push({title: '@企业名称', dataIndex: 'company_abbr', key: 'company_abbr',fixed:'left',width:200,});
        arr.push({title: '@设备型号', dataIndex: 'model', key: 'model',width:200,});
        for (let i = 0; i < this.props.mi0802Info.versions.length; i++) {
            const obj = {
                title: this.props.mi0802Info.versions[i],
                dataIndex: this.props.mi0802Info.versions[i],
                key: this.props.mi0802Info.versions[i],
                width:200,
                render: (index, record) => {
                    if (index === 0) {
                        return "-"
                    } else {
                        return <Link to={{
                            pathname: "/main/mi0801",
                            search: "?version=" + this.props.mi0802Info.versions[i] + "&company_id=" + record.company_id + "&model=" + record.model
                        }}>{index}</Link>
                    }
                }
            };
            if(i===this.props.mi0802Info.versions.length-1){
                obj.fixed='right';
            }
            arr.push(obj)
        }
        const pagination = {
            pageSize: 20
        };
        return (
            <div>
                <Card className="card">
                    <header className="header" style={{marginBottom: "54px"}}>
                        <div className="right-header">
                            <Input style={{width: 180}} className="input" placeholder="@请输入关键字"
                                   onChange={this.changeSn}
                                   onPressEnter={this.searchBySn}/>
                            <Button size="default" className="input" onClick={this.searchBySn} icon="search">{"@搜索"}</Button>
                        </div>
                    </header>
                    <BossTable pagination={pagination} columns={arr}
                               dataSource={this.props.mi0802Info.dataSource} scroll={{x:(this.props.mi0802Info.versions.length+2)*200}}/>
                </Card>
            </div>
        )
    }
}

export default withRouter(injectIntl(MI0802));




