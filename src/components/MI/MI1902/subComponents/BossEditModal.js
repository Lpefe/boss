import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Cascader,
    Checkbox,
    DatePicker,
    Form,
    Icon,
    Input,
    InputNumber,
    Modal,
    Radio,
    Select,
    Switch,
    Upload,
    Divider
} from 'antd';
import "./BossEditModal.scss";
import {emptyFunction} from "./commonUtilFunc";
import Cookies from 'js-cookie'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;
const CheckboxGrp = Checkbox.Group;
const {RangePicker} = DatePicker;

class BossEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: []
        };
        for (let key in props.InputItems) {
            if (props.InputItems[key].type === 'GroupInput') {
                this[`${props.InputItems[key].valName}Id`] = 1;
            }
        }
        this.flag = false;//初始化时候,确保groupInput标识ID只初始化一次
    };

    componentDidMount() {
        this.onRef();
    }

    componentDidUpdate() {
        this.onRef();
    }

    handleSubmit = () => {
        let {InputItems, initialValues} = this.props;
        let groupItems = [];
        for (let key in InputItems) {
            if (InputItems[key].type === 'GroupInput') {
                groupItems.push(InputItems[key].valName)
            }
        }
        this.props.form.validateFields((err, value) => {
            if (!err) {
                for (let index in groupItems) {
                    let temp = [];
                    for (let key in value) {
                        if (key.indexOf(groupItems[index]) === 0 && key !== groupItems[index] + 'Keys') {
                            temp.push(value[key]);
                            delete value[key]
                        } else if (key === groupItems[index] + 'Keys') {
                            delete value[key]
                        }
                    }
                    value[groupItems[index]] = temp.join(",");
                }
                /*给后端提供日志所需信息,结构:record:{initRecord:{label[string]:value[any],updateRecord:{label[string]:value:[any]},_title[string]}}*/
               /* const initRecord = {};
                const updateRecord = {};
                for (let key in initialValues) {
                    for (let inputItem of InputItems) {
                        if (inputItem.valName === key) {
                            initRecord[inputItem.labelName] = value[key]
                        }
                    }
                }
                for (let key in value) {
                    for (let inputItem of InputItems) {
                        if (inputItem.valName === key) {
                            updateRecord[inputItem.labelName] = value[key]
                        }
                    }
                }*/

                this.props.dispatch({
                    type: this.props.submitType || "",
                    payload: {
                        init: this.props.initPayload,
                        /*update: {
                            ...value, ...this.props.extraUpdatePayload, ...{
                                record: Object.assign({}, {
                                    /!*initRecord: initRecord,
                                    updateRecord: updateRecord*!/
                                }, {_title: this.props.title})
                            }
                        }, //extraUpdatePayload除了表单数据之外的参数,e.g.数据ID,常量;*/
                        update: {...value, ...this.props.extraUpdatePayload, ...{record: this.props.initialValues}}, //extraUpdatePayload除了表单数据之外的参数,e.g.数据ID,常量;传入record,用来作为警告消息的消息源
                        vm: this,//bossEditModal this
                    },
                });
                if (this.props.hasSubmitCancel) {
                    this.props.submitCancel(this);//submitCancel 默认情况下为undefined,提交后自动关闭弹出窗,若有特殊需求,可使用submitCancel做指定操作,传出this,用于调用this.props.form相关方法
                } else {
                    this.props.onCancel();
                    this.props.form.resetFields();
                }
            }
        })
    };

    handleClose = () => {
        this.props.form.resetFields();
    };


    addInput = (item) => {
        const {form} = this.props;
        const keys = form.getFieldValue(`${item.valName}Keys`);
        const nextKeys = keys.concat(this[`${item.valName}Id`]++);
        let tempValObject = {};
        tempValObject[`${item.valName}Keys`] = nextKeys;
        form.setFieldsValue(tempValObject)
    };

    deleteInput = (item, index) => {
        const {form} = this.props;
        const keys = form.getFieldValue(`${item.valName}Keys`);
        if (keys.length === 1) {
            return;
        }
        let tempValObject = {};
        tempValObject[`${item.valName}Keys`] = keys.filter(key => key !== index);
        form.setFieldsValue(tempValObject);
    };

    onRef = () => {
        if (this.props.refs) {
            this.props.refs(this);
        }
    };
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return [e.file];
    };

    handleBeforeUpload = (file) => {
        this.setState({
            file: file
        });
        return false;
    };

    render() {
        let {initialValues, InputItems} = this.props;
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const inEnglish = window.appLocale.locale === "en-US";
        let keys = {};
        for (let key in InputItems) {
            if (InputItems[key].type === 'GroupInput') {
                let initialKeys = [0];
                let groupInputInitialValue = initialValues[InputItems[key].valName];
                if (groupInputInitialValue) {
                    initialKeys = [];
                    if (typeof groupInputInitialValue === 'string') {
                        groupInputInitialValue = groupInputInitialValue.split(',')
                    }
                    for (let i = 0; i < groupInputInitialValue.length; i++) {
                        initialKeys.push(i)
                    }
                    if (!this.flag) {
                        this[`${InputItems[key].valName}Id`] = groupInputInitialValue.length;
                        this.flag = true
                    }

                }
                getFieldDecorator(`${InputItems[key].valName}Keys`, {initialValue: initialKeys});
                keys[`${InputItems[key].valName}Keys`] = getFieldValue(`${InputItems[key].valName}Keys`);

            }
        }

        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        const modalFormLayoutHasBtn = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 19},
            },
        };
        const modalFormLayoutWithoutLabel = {
            wrapperCol: {
                xs: {span: 19, offset: 5},
            }
        };
        return (
            <Modal footer={this.props.hasFooter} {...this.props} onOk={this.handleSubmit} destroyOnClose
                   bodyStyle={{height: this.props.bodyHeight || 450, overflow: "scroll"}} maskClosable={false}
                   width={inEnglish ? 700 : 550} afterClose={this.handleClose}>
                <Form>
                    {InputItems.map((item, index) => {
                        switch (item.type) {
                            case "Divider":
                                return  <Divider orientation="left">{item.labelName}</Divider>
                                case "Span":
                                return <div className="mi1902bgpSpan"><span>
                                    @若有填写IP段，BGP收路由明细以这里输入的IP段为准，忽略BGP收到的路由明细；若没有填写，则以BGP收到的数据为准。
                                </span></div> 
                            case "Plain":
                                return <FormItem style={{height: item.height || 16}}
                                                 label={item.labelName} {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 key={index}>
                                    <div>{item.content}</div>
                                </FormItem>;
                            case "Input":
                                return <FormItem{...(item.customerFormLayout ? item.customerFormLayout : (item.labelName ? modalFormLayout : modalFormLayoutWithoutLabel))}
                                                extra={item.nativeProps.extra} label={item.labelName} key={index}
                                                style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <Input {...item.nativeProps}/>
                                    )}
                                </FormItem>;
                            case "InputNumber":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : (item.labelName ? modalFormLayout : modalFormLayoutWithoutLabel))}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <InputNumber {...item.nativeProps} />
                                    )}&nbsp;&nbsp;{item.unit}
                                </FormItem>;
                            case "Select":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : (item.labelName ? modalFormLayout : modalFormLayoutWithoutLabel))}
                                                 label={item.labelName} key={index} style={item.style} help={item.help}
                                                 validateStatus={item.validateStatus}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] !== undefined ? initialValues[item.valName] : undefined
                                    })(
                                        <Select {...item.nativeProps}
                                                onChange={item.onChange ? (value) => item.onChange(value, this) : ""}
                                                showSearch={true}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {item.children ? item.children.map(child => <Option
                                                value={child.value} key={child.key}>{child.name}</Option>) : ""
                                            }
                                        </Select>
                                    )}
                                </FormItem>;
                            case "Cascader":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : (item.labelName ? modalFormLayout : modalFormLayoutWithoutLabel))}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <Cascader {...item.nativeProps}
                                                  onChange={item.onChange ? (value) => item.onChange(value, this) : ""}/>
                                    )}
                                </FormItem>;
                            case "Radio":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : (item.labelName ? modalFormLayout : modalFormLayoutWithoutLabel))}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName]
                                    })(
                                        <RadioGroup  {...item.nativeProps}
                                                     onChange={item.onChange ? (value) => item.onChange(value, this) : ""}>
                                            {item.children.map(child => <Radio
                                                value={child.value} key={child.key}>{child.name}</Radio>)}
                                        </RadioGroup>
                                    )}
                                </FormItem>;
                            case "DatePicker":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <DatePicker  {...item.nativeProps}/>
                                    )}
                                </FormItem>;
                            case "RangePicker":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <RangePicker {...item.nativeProps}
                                                     onChange={item.onChange ? (value) => item.onChange(value, this) : ""}/>
                                    )}
                                </FormItem>;
                            case "Switch":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        valuePropName: 'checked',
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || item.initialValue
                                    })(
                                        <Switch  {...item.nativeProps}
                                                 onChange={item.onChange ? (value) => item.onChange(value, this) : ""}/>
                                    )}
                                </FormItem>;
                            case "TextArea":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <TextArea  {...item.nativeProps}/>
                                    )}
                                </FormItem>;
                            case "GroupInput":
                                let valueGroups = [];
                                if (typeof initialValues[item.valName] === "string" && initialValues[item.valName]) {
                                    valueGroups = initialValues[item.valName].split(',');
                                } else if (Array.isArray(initialValues[item.valName])) {
                                    valueGroups = initialValues[item.valName]
                                }
                                return <div key={index}>{keys[`${item.valName}Keys`].map((key, subIndex) => {
                                    return <FormItem
                                        label={subIndex === 0 ? item.labelName : ""}
                                        {...((subIndex === 0 && item.labelName !== '') ? modalFormLayoutHasBtn : modalFormLayoutWithoutLabel)}
                                        key={subIndex} style={item.style}>
                                        <div key={item.valName + key}>
                                            {getFieldDecorator(item.valName + key, {
                                                rules: item.rules,
                                                initialValue: valueGroups[key]
                                            })(
                                                <Input  {...item.nativeProps} style={{width: 313, marginRight: 8}}
                                                        disabled={item.disabled}/>
                                            )}
                                            {keys[`${item.valName}Keys`].length > 1 ?
                                                <Button shape="circle" icon="minus"
                                                        onClick={() => this.deleteInput(item, key)}
                                                        disabled={item.disabled}/> : ""}
                                        </div>
                                    </FormItem>
                                })}
                                    <Form.Item {...modalFormLayoutWithoutLabel}>
                                        <Button type="dashed" onClick={() => this.addInput(item)}>
                                            <Icon type="plus"/>@添加输入项
                                        </Button>
                                    </Form.Item>
                                </div>;
                            /*return <div key={index}>
                                <FormItem
                                    label={item.labelName} {...(item.labelName ? modalFormLayoutHasBtn : modalFormLayoutWithoutLabel)}
                                    key={index} style={item.style}>
                                    <div>
                                        {getFieldDecorator(item.valName || index, {
                                            rules: item.rules,
                                            initialValue: valueGroups[0]
                                        })(
                                            <Input  {...item.nativeProps} style={{width: 313, marginRight: 8}} disabled={item.disabled}/>
                                        )}
                                        <Button icon="plus" shape="circle" onClick={() => this.addInput(item)} disabled={item.disabled}/>
                                    </div>
                                </FormItem>
                                {valueGroups.map((groupItems, groupIndex) => {
                                    if (!groupIndex) {
                                        return "";
                                    }
                                    return <FormItem  key={groupIndex} {...modalFormLayoutWithoutLabel}
                                                     style={Object.assign({},item.style,{display:item.disabled?"none":"block"})}>
                                        <div>{getFieldDecorator((item.valName || index) + groupIndex, {
                                            rules: item.rules,
                                            initialValue: groupItems
                                        })(
                                            <Input  {...item.nativeProps} style={{width: 313, marginRight: 8}}
                                                    disabled={item.disabled}/>
                                        )}
                                            <Button shape="circle" icon="minus"
                                                    onClick={() => this.deleteInput(item, groupIndex)} disabled={item.disabled}/>
                                        </div>
                                    </FormItem>
                                })}
                            </div>;*/
                            case "CheckBox":
                                return <FormItem {...item.customerFormLayout ? item.customerFormLayout : modalFormLayout}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || item.initialValue,//前者是编辑时整体传入的initial value,后者是添加时可能需要独立的initialValue
                                        valuePropName: 'checked',
                                    })(
                                        <Checkbox
                                            onChange={item.onChange ? (value) => item.onChange(value, this) : ""} {...item.nativeProps}>{item.checkBoxName}</Checkbox>
                                    )}
                                </FormItem>;
                            case "CheckboxGroup":
                                return <FormItem {...item.customerFormLayout ? item.customerFormLayout : modalFormLayout}
                                                 extra={item.nativeProps.extra} label={item.labelName} key={index}
                                                 style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || item.initialValue,//前者是编辑时整体传入的initial value,后者是添加时可能需要独立的initialValue
                                    })(
                                        <CheckboxGrp
                                            onChange={item.onChange ? (value) => item.onChange(value, this) : emptyFunction()} {...item.nativeProps}
                                            options={item.children}/>
                                    )}
                                </FormItem>;
                            case "Upload":
                                return <FormItem {...item.customerFormLayout ? item.customerFormLayout : modalFormLayout}
                                                 label={item.labelName} key={index} style={item.style}
                                >
                                    {getFieldDecorator(item.valName || index, {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFile,
                                    })(
                                        <Upload name="logo" listType="picture" beforeUpload={this.handleBeforeUpload}
                                                headers={{'X-CSRFToken': Cookies.get('csrftoken')}}>
                                            <Button disabled={item.disabled}>
                                                <Icon type="upload"/>@上传文件
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>;
                            default:
                                return ""
                        }
                    })}
                </Form>
            </Modal>
        );
    }
}

BossEditModal.propTypes = {
    InputItems: PropTypes.array,
    hasFooter: PropTypes.bool,
    title: PropTypes.string,
    submitType: PropTypes.string,
    extraUpdatePayload: PropTypes.object,
    initPayload: PropTypes.object,
    initialValues: PropTypes.object,
    namespace: PropTypes.string,
    hasSubmitCancel: PropTypes.bool,
    submitCancel: PropTypes.func,
    bodyHeight: PropTypes.number,
    bodyWidth: PropTypes.number,
};

BossEditModal.defaultProps = {
    InputItems: [],
    hasFooter: undefined,
    title: "",
    initialValue: {},
    extraUpdatePayload: {},
    initPayload: {},
    namespace: "",
    submitType: "",
    hasSubmitCancel: false,
};

export default Form.create()(BossEditModal);
