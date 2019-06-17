/*
* 去重设置*/
import React from 'react';
import '../../CI/CI0101New/index.scss';
import {Tooltip, Checkbox, Form, InputNumber, Button, Modal, Icon} from 'antd';
import {commonTranslate, parse} from '../../../utils/commonUtilFunc';
import BossLineChart from "../../Common/Charts/Line/BossLineChart";
import moment from 'moment';
import './index.scss';
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

class MI0504 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disableText: false,
        }
    }

    componentDidMount() {
        this.get_deduplication();
        this.get_system();
    }

    get_deduplication = () => {
        this.props.dispatch({
            type: "mi0501Info/get_deduplication",
            payload: {
                link_id: parse(this.props.location.search).id,
            }
        })
    };

    get_system = () => {
        this.props.dispatch({
            type: "mi0501Info/get_system",
            payload: {
                start_tm: moment().subtract(24, 'hours').format("YYYY-MM-DD HH:mm:ss"),
                end_tm: moment().format("YYYY-MM-DD HH:mm:ss"),
                company_id: parse(this.props.location.search).company_id,
                sn: parse(this.props.location.search).SN,
            }
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const search=parse(this.props.location.search);
        const {form, dispatch} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: "mi0501Info/update_deduplication",
                    payload: {
                        update:
                            {
                                company_id: search.company_id,
                                link_id: search.id,
                                rules: values.rules,
                                volume: values.volume,
                                record:{
                                    company_id:search.company_id,
                                    name:search.name
                                }
                            },
                        vm: this,
                    }
                })
            }
        });
    };

    isJSON = (str) => {
        const __=commonTranslate(this);
        if (typeof str === 'string') {
            try {
                let obj = JSON.parse(str);
                return (typeof obj === 'object') && obj
            } catch (e) {
                Modal.warning({
                    title: "@人工选路配置格式错误!"
                });
                return false;
            }
        }
    };

    get_manual_link_path_example = () => {
        this.props.dispatch({
            type: "mi0501Info/get_manual_link_path_example",
            payload: {
                link_id: parse(this.props.location.search).id
            }
        })
    };

    handleCheckboxChange = (values) => {
        this.props.dispatch({
            type: "mi0501Info/handelCheckboxChange",
            payload: {
                values: values,
                memory:this.props.form.getFieldValue("volume")
            }
        })
    };
    handleCancel = () => {
        this.props.history.push("/main/mi0501")
    };

    handleMemoryChange=(value)=>{
        this.props.dispatch({
            type:"mi0501Info/handelCheckboxChange",
            payload:{
                memory:value,
                values: this.props.form.getFieldValue("rules"),
            }
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const options = [
            {label: '@中心去重', value: 'center'},
            {label: '@边缘去重', value: 'edge'},
        ];
        const modalFormLayout = {
            labelCol: {
                xs: {span: 1},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        const chartOptionII = {
            id: "branchMemory",
            containerHeight: 400,
            containerWidth: (document.body.clientWidth - 160) / 2.2,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    name: "@时间",
                    min: moment().subtract(24, 'hours').format("HH:mm:ss"),
                    max: moment().format("HH:mm:ss"),
                    axisTick:{show:false},
                    splitLine:{
                        show:false
                    },
                    axisLine:{
                        lineStyle: {
                            color:"rgba(0,0,0,0.45)"
                        }
                    }
                },
                dataZoom: [],
                yAxis: [
                    {type: 'value', name: "%", min: 0, max: 100,axisLine:{show:false},axisTick:{show:false}},
                ],
                series: [
                    {
                        type: "line",
                        name: "@内存使用率",
                        data:this.props.mi0501Info.memory
                    }
                ],
                grid: [{
                    x: '7%'
                }]
            }
        };
        return (
            <div>
                <div style={{background: "#FAFAFA", padding: 16}}>
                    <Form>
                        <FormItem>
                            {getFieldDecorator('rules', {
                                initialValue: this.props.mi0501Info.rules
                            })(
                                <CheckboxGroup options={options} onChange={this.handleCheckboxChange}/>
                            )}
                        </FormItem>
                        <FormItem {...modalFormLayout}>
                            <div>
                                <span>内存(M):&nbsp;&nbsp;</span>
                                <Tooltip trigger="click" title={this.props.mi0501Info.toolTipContent}
                                         placement="bottom">
                                    {getFieldDecorator('volume', {
                                        initialValue: this.props.mi0501Info.volume,
                                    })(
                                        <InputNumber style={{width: 150}} min={0} onChange={this.handleMemoryChange}/>
                                    )}
                                </Tooltip>
                                &nbsp;&nbsp;<Icon type="question-circle-o"/>
                                <span>{"@内存要大于50M，小于空闲内存的50%"}</span>
                            </div>
                        </FormItem>
                    </Form>
                    <Button onClick={this.handleCancel}
                            style={{marginRight: 8, marginTop: 80, marginBottom: 8}}>{"@取消"}</Button>
                    <Button onClick={this.handleSubmit} type="primary">{"@确定"}</Button>
                </div>
                <div style={{display: "inline-block"}}>
                    <div className="chart-title-container">
                        <span className="chart-title">{"@分支CPE内存使用率曲线图"}</span>
                        <span className="chart-sub-title">{"@总内存"}:{parse(this.props.location.search).ram==="null"?0:parse(this.props.location.search).ram}MB</span></div>
                    <BossLineChart {...chartOptionII}/>
                </div>
            </div>
        )
    }
}

export default injectIntl(MI0504);