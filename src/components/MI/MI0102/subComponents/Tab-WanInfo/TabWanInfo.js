/*@运维-设备信息*/
import React from 'react';
import {Form, Radio,Card} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import Wan4G from "./Wan4G";
import Wan from "./Wan";
import noWan from '../../../../../assets/img/noWan.png'
import {parse} from "../../../../../utils/commonUtilFunc";
import {withRouter} from "react-router-dom";

const RadioGrp = Radio.Group;

class TabWanInfo extends React.Component {
    constructor(props) {
        super(props);
        const search=parse(this.props.location.search);
        this.state = {
            end_tm: search.from === "load"||search.ifAlarm==='true' ? moment(parse(this.props.location.search).time).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
            start_tm: search.from === "load"||search.ifAlarm==='true' ? moment(parse(this.props.location.search).time).subtract(15, 'minutes').format("YYYY-MM-DD HH:mm:ss") : moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            intervalType: search.from === "load"||search.ifAlarm==='true' ? "4" : "0",
        }
    }

    componentDidMount() {
        this.get_wan_info();
    }

    get_wan_info() {
        this.props.dispatch({
            type: "mi0102Info/get_wan_info",
            payload: {
                sn: parse(this.props.location.search).sn
            }
        }).then(()=>{
            this.get_wans();
        })
    }

    get_wans = () => {
        const {deviceInfo, selectedWanInfo} = this.props.mi0102Info;
        this.props.dispatch({
            type: "mi0102Info/get_wans",
            payload: {
                sn: deviceInfo.sn,
                companyid: deviceInfo.company_id,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                iface: selectedWanInfo.interface
            }
        });
        if (selectedWanInfo.name === "4g") {
            this.props.dispatch({
                type: "mi0102Info/get_days4g",
                payload: {
                    sn: deviceInfo.sn,
                    companyid: deviceInfo.company_id,
                    month: moment().format("YYYY-MM") + "-01 00:00:00"
                }
            })
        }
    };


    handleSelectWanType = (e) => {
        //如果有自动刷新,去掉自动刷新
        let offId = sessionStorage.getItem("wanOffId");
        clearInterval(offId);
        const {wanInfo} = this.props.mi0102Info;
        this.props.mi0102Info.timeInterval4G = "0";
        this.props.mi0102Info.wanTimeInterval = "0";
        this.props.mi0102Info.refreshType = "0";
        for (let key in wanInfo) {
            if (e.target.value === wanInfo[key].id) {
                this.props.dispatch({
                    type: "mi0102Info/changeWan",
                    payload: {
                        selectedWanInfo: wanInfo[key],
                        selectedWan: e.target.value
                    }
                }).then(()=>{
                    this.get_wans();
                })
            }
        }
    };


    render() {
        const {mi0102Info} = this.props;
        return (
            <Card className="card">
                {mi0102Info.wanInfo.length > 0 ? <div>
                    <RadioGrp style={{marginBottom: 16}} onChange={this.handleSelectWanType}
                              value={mi0102Info.selectedWan}>
                        {mi0102Info.wanInfo.map((item) => {
                            return <Radio key={item.id} value={item.id}>{item.name}</Radio>
                        })}
                    </RadioGrp>
                    {this.props.mi0102Info.selectedWanInfo.name === "4g" ? <Wan4G/> : <Wan/>}
                </div> : <div style={{textAlign: "center"}}>
                    <img src={noWan} alt="" style={{marginTop: 60}}/>
                </div>}
            </Card>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(withRouter(TabWanInfo)));