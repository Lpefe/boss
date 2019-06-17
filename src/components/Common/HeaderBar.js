/*@通用组件-头部导航栏*/
/**
 * 默认的表格头部筛选栏组件
 * API:
 *       hasAdd: PropTypes.bool. 是否有添加按钮
 *       hasDelete: PropTypes.bool. 是否有批量删除按钮
 hasSearch: PropTypes.bool. 是否有搜索输入框
 hasUpload: PropTypes.bool. 是否有上传按钮
 inputPlaceHolder: PropTypes.string. 搜索输入框的placeholder
 add: PropTypes.func.   添加按钮点击后的回调
 delete: PropTypes.func. 批量删除按钮点击后的回调
 submit: PropTypes.func.  搜索框点击搜索后的回调
 hasSelect: PropTypes.bool. 是否有第一个下拉框
 hasSelectTwo: PropTypes.bool. 是否有第二个下拉框
 hasSelectThree: PropTypes.bool. 是否有第三个下拉框
 hasSelectThree: PropTypes.bool. 是否有第四个下拉框
 options: PropTypes.array.  第一个下拉框列表
 optionsTwo: PropTypes.array.
 optionsThree: PropTypes.array.
 optionsFour: PropTypes.array.
 selectOneMethod: PropTypes.func.
 selectTwoMethod: PropTypes.func.
 selectThreeMethod: PropTypes.func.
 selectFourMethod: PropTypes.func.
 selectPlaceHolder: PropTypes.string.
 selectTwoPlaceHolder: PropTypes.string.
 selectThreePlaceHolder: PropTypes.string.
 selectFourPlaceHolder: PropTypes.string.
 uploadUrl: PropTypes.string. 上传按钮所需URL
 uploadData: PropTypes.object.  上传所需额外参数
 hasModalStyelUpload: PropTypes.bool.   是否需要弹窗形式的上传交互
 modal: PropTypes.func.
 addAlias: PropTypes.string.
 addBtnDisabled: PropTypes.bool.
 hasExtraBtn: PropTypes.bool.
 extraBtnName: PropTypes.string.
 extraSelectedKeys: PropTypes.array.
 hasExtraBtnTwo: PropTypes.bool.
 showExtraConfirmTwo: PropTypes.bool.
 extraBtnNameTwo: PropTypes.string.
 selectedKeys: PropTypes.array.
 extraConfirmMethodTwo: PropTypes.func.
 extraConfirmMethod: PropTypes.func.
 confirmTitleTwo: PropTypes.string.
 confirmTitle: PropTypes.string.
 confirmContent: PropTypes.string.
 confirmContentTwo: PropTypes.string.
 hasExtraBtnThree: PropTypes.bool.
 btnThreeFunc: PropTypes.func.
 extraBtnNameThree: PropTypes.string.
 hasSelectFour: PropTypes.bool.
 * */


import React from 'react';
import PropTypes from 'prop-types';
import {Button, DatePicker, Input, Modal, Select, Upload, Switch} from 'antd';
import "./HeaderBar.scss";
import {injectIntl} from 'react-intl';

const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const selectionDefaultWidth = 180;

class HeaderBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: ""
        }
    }

    showDeleteConfirm = () => {
        let vm = this;
        if (this.props.selectedKeys.length > 0) {
            confirm({
                title: '@确认要删除选中项吗?',
                onOk() {
                    vm.props.delete();
                },
            });
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }
    };

    showExtraConfirmTwo = () => {
        let vm = this;
        if (this.props.selectedKeys.length > 0) {
            confirm({
                title: this.props.confirmTitleTwo,
                content: this.props.confirmContentTwo,
                onOk() {
                    vm.props.extraConfirmMethodTwo();
                },
            });
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }
    };

    showExtraConfirm = () => {
        let vm = this;
        if (this.props.selectedKeys.length > 0) {
            confirm({
                title: this.props.confirmTitle,
                content: this.props.confirmContent,
                onOk() {
                    vm.props.extraConfirmMethod();
                },
            });
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }
    };

    handleSearchContentChange = (e) => {
        let vm = this;
        this.setState({
            searchValue: e.target.value.replace(/(^\s*)|(\s*$)/g, "")
        }, function () {
            if (vm.state.searchValue === "") {
                vm.props.submit(vm.state.searchValue)
            }
        })
    };

    render() {
        return <header className="header" style={{height: 32}}>
            <div className="left-header">
                {this.props.hasAdd ?
                    <Button icon="file-add" style={{marginRight: 8}} onClick={this.props.add}
                            disabled={this.props.addBtnDisabled}>{this.props.addAlias || "@添加"}</Button> : ""}
                {this.props.hasDelete ?
                    <Button style={{marginRight: 8}} icon="delete"
                            onClick={this.showDeleteConfirm}>@批量删除</Button> : ""}
                {this.props.hasUpload ? <Upload action={this.props.uploadUrl} data={this.props.uploadData}>
                    <Button icon="folder-add">@批量上传</Button>
                </Upload> : ""}
                {this.props.hasModalStyelUpload ?
                    <Button onClick={this.props.modal} icon="folder-add">@批量上传</Button> : ""}
                {this.props.hasExtraBtn ? <Button onClick={this.showExtraConfirm}
                                                  style={{marginRight: 8}}>{this.props.extraBtnName}</Button> : ""}
                {this.props.hasExtraBtnTwo ? <Button onClick={this.showExtraConfirmTwo}
                                                     style={{marginRight: 8}}>{this.props.extraBtnNameTwo}</Button> : ""}
                {this.props.hasExtraBtnThree ? <Button onClick={this.props.btnThreeFunc}
                                                       style={{marginRight: 8}}>{this.props.extraBtnNameThree}</Button> : ""}
                {this.props.hasExtraBtnFour ? <Button onClick={this.props.btnFourFunc}
                                                      style={{marginRight: 8}}>{this.props.extraBtnNameFour}</Button> : ""}
                {this.props.hasDownload ? <Button style={{marginRight: 8}}><a
                    href={this.props.downloadUrl}>{this.props.downloadBtnNm}</a></Button> : ""}
                {this.props.extraSlot}
            </div>
            {this.props.hasSearch ? <div className="right-header">
                {this.props.hasRangePicker ?
                    <RangePicker style={{width: 210, marginRight: 8}} onChange={this.props.rangePickerMethod} allowClear
                                 defaultValue={this.props.dateRange}/> : ""}
                {this.props.hasSelect ?
                    <Select style={{width: this.props.selectOneWidth || selectionDefaultWidth, marginRight: 8}}
                            placeholder={this.props.selectPlaceHolder}
                            onChange={this.props.selectOneMethod} showSearch={true}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            allowClear defaultValue={this.props.selectOneDefaultValue || undefined}>
                        {this.props.options}
                    </Select> : ""}
                {this.props.hasSelectTwo ?
                    <Select style={{width: this.props.selectTwoWidth || selectionDefaultWidth, marginRight: 8}}
                            placeholder={this.props.selectTwoPlaceHolder}
                            onChange={this.props.selectTwoMethod} allowClear
                            defaultValue={this.props.selectTwoDefaultValue || undefined}
                            showSearch={true}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {this.props.optionsTwo}
                    </Select> : ""}
                {this.props.hasSelectThree ?
                    <Select style={{width: this.props.selectThreeWidth || selectionDefaultWidth, marginRight: 8}}
                            placeholder={this.props.selectThreePlaceHolder}
                            onChange={this.props.selectThreeMethod} allowClear
                            defaultValue={this.props.selectThreeDefaultValue || undefined}
                            showSearch={true}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {this.props.optionsThree}
                    </Select> : ""}
                {this.props.hasSelectFour ?
                    <Select style={{width: this.props.selectFourWidth || selectionDefaultWidth, marginRight: 8}}
                            placeholder={this.props.selectFourPlaceHolder}
                            onChange={this.props.selectFourMethod} allowClear
                            showSearch={true}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            defaultValue={this.props.selectFourDefaultValue || undefined}>
                        {this.props.optionsFour}
                    </Select> : ""}
                {this.props.hasSelectFive ?
                    <Select style={{width: this.props.selectFiveWidth || selectionDefaultWidth, marginRight: 8}}
                            placeholder={this.props.selectFivePlaceHolder}
                            onChange={this.props.selectFiveMethod} allowClear
                            showSearch={true}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            defaultValue={this.props.selectFiveDefaultValue || undefined}>
                        {this.props.optionsFive}
                    </Select> : ""}
                {this.props.hasNotSearchInput ?"":<Input style={{width: this.props.searchInputWidth || 160, marginRight: 8}}
                       placeholder={this.props.inputPlaceHolder || "@请输入关键字"}
                       onChange={this.handleSearchContentChange}
                       onPressEnter={() => this.props.submit(this.state.searchValue)} name="fakepasswordremembered"/>}
                {this.props.hasNotSearchInput ?"":<Button icon="search"
                        onClick={() => this.props.submit(this.state.searchValue)}>@搜索</Button>}
                {this.props.hasSwitch ?<Switch  style={{marginLeft: 8}} checkedChildren={this.props.checkedChildren} unCheckedChildren={this.props.unCheckedChildren} checked={this.props.checked}  onChange={this.props.handleSwitchtChange}/>:""}
                {this.props.hasSwitch ?this.props.switchName:""}

            </div> : ""}
            
            
            <Modal/>
        </header>
    }
}


HeaderBar.propTypes = {
    hasAdd: PropTypes.bool,
    hasDelete: PropTypes.bool,
    hasSearch: PropTypes.bool,
    hasUpload: PropTypes.bool,
    inputPlaceHolder: PropTypes.string,
    add: PropTypes.func,
    delete: PropTypes.func,
    submit: PropTypes.func,
    options: PropTypes.array,
    optionsTwo: PropTypes.array,
    optionsThree: PropTypes.array,
    optionsFour: PropTypes.array,
    optionsFive: PropTypes.array,
    selectPlaceHolder: PropTypes.string,
    selectTwoPlaceHolder: PropTypes.string,
    selectThreePlaceHolder: PropTypes.string,
    selectFourPlaceHolder: PropTypes.string,
    selectFivePlaceHolder: PropTypes.string,
    selectOneShowSearch: PropTypes.bool,
    hasSelect: PropTypes.bool,
    hasSelectTwo: PropTypes.bool,
    hasSelectThree: PropTypes.bool,
    hasSelectFive: PropTypes.bool,
    selectOneMethod: PropTypes.func,
    selectTwoMethod: PropTypes.func,
    selectThreeMethod: PropTypes.func,
    selectFourMethod: PropTypes.func,
    selectFiveMethod: PropTypes.func,
    uploadUrl: PropTypes.string,
    uploadData: PropTypes.object,
    hasModalStyelUpload: PropTypes.bool,
    modal: PropTypes.func,
    addAlias: PropTypes.string,
    addBtnDisabled: PropTypes.bool,
    hasExtraBtn: PropTypes.bool,
    extraBtnName: PropTypes.string,
    extraSelectedKeys: PropTypes.array,
    hasExtraBtnTwo: PropTypes.bool,
    showExtraConfirmTwo: PropTypes.bool,
    extraBtnNameTwo: PropTypes.string,
    selectedKeys: PropTypes.array,
    extraConfirmMethodTwo: PropTypes.func,
    extraConfirmMethod: PropTypes.func,
    confirmTitleTwo: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    confirmContentTwo: PropTypes.string,
    hasExtraBtnThree: PropTypes.bool,
    btnThreeFunc: PropTypes.func,
    extraBtnNameThree: PropTypes.string,
    hasSelectFour: PropTypes.bool,
    hasRangePicker: PropTypes.bool,
    rangePickerMethod: PropTypes.func,
    dateRange: PropTypes.array,
    selectOneWidth: PropTypes.number,
    selectTwoWidth: PropTypes.number,
    selectThreeWidth: PropTypes.number,
    selectFourWidth: PropTypes.number,
    selectFiveWidth: PropTypes.number,
    searchInputWidth: PropTypes.number,
    selectFiveDefaultValue: PropTypes.string,
    selectFourDefaultValue: PropTypes.string,
    selectThreeDefaultValue: PropTypes.string,
    selectTwoDefaultValue: PropTypes.string,
    selectOneDefaultValue: PropTypes.string,
    hasDownload: PropTypes.bool,
    downloadBtnNm: PropTypes.string,
    downloadUrl: PropTypes.string,
    selectThreeIfSearch: PropTypes.bool,
    extraSlot: PropTypes.object,

};
HeaderBar.defaultProps = {
    hasAdd: false,
    hasDelete: false,
    hasSearch: false,
    hasUpload: false,
    addBtnDisabled: false,
    extraSelectedKeys: [],
    selectedKeys: []

};

export default injectIntl(HeaderBar);