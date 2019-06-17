/*@技术支持-系统应用识别*/
import React from 'react';
import {Select,Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
const Option=Select.Option;
class BI1301C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            appidb:""
        };

    }

    componentDidMount() {
        this.get_dpi_apps();
        this.get_app_category();
    }

    get_dpi_apps = () => {
        this.props.dispatch({
            type: "bi1301Info/get_dpi_apps",
            payload: {
                name:this.state.name,
                appidb:this.state.appidb
            }
        })
    };

    get_app_category = () => {
        this.props.dispatch({
            type: "bi1301Info/get_app_category",
            payload: {}
        })
    };

    handleSelectAppIdb = (value) => {
        this.setState({
            appidb: value===undefined?"":value
        }, () => {
            this.get_dpi_apps();
        })
    };

    handleSubmitSearch = (value) => {
        this.setState({
            name: value
        }, () => {
            this.get_dpi_apps();
        })
    };

    render() {
        const columns = [{
            title: 'APPID',
            dataIndex: 'appids',
            key: 'name',

        }, {
            title: '@应用名称',
            dataIndex: 'app_name',
            key: 'origin2',
        }, {
            title: '@类别',
            dataIndex: 'app_category_name',
            key: 'dedup_percent1',
        }];
        const options=this.props.bi1301Info.appCategory.map((item)=>{
            return <Option value={item.appidb} key={item.appidb}>{item.app_category_name}</Option>
        });
        return (
            <Card className="card">
                <HeaderBar hasSelect={true} selectPlaceHolder={"@请选择应用类别"} hasSearch={true} options={options} submit={this.handleSubmitSearch} selectOneMethod={this.handleSelectAppIdb}/>
                <BossTable columns={columns} dataSource={this.props.bi1301Info.dataSource} />
            </Card>
        )
    }
}

export default injectIntl(BI1301C);