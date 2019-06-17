/*@运维-设备出/入库*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Form,Table,Row,Col} from 'antd';
import {injectIntl} from "react-intl";
class StockOutNumberModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount =()=>{

    };
    render() {
        const Columns = [
            {
                title: "@序列号",
                dataIndex: 'hard_sn',
                key: 'hard_sn',

            }, {
                title: "@设备型号",
                dataIndex: 'model',
                key: 'model',

            }, {
                title: "@硬件ID",
                dataIndex: 'sn',
                key: 'sn',

            }, {
                title: "@设备名称",
                dataIndex: 'name',
                key: 'name',
            }, {
                title: "@备注",
                dataIndex: 'remark',
                key: 'remark',
            },];
        return <Modal width="900px" maskClosable={false} visible={this.props.visible} title={"@设备出库信息"}
                      onCancel={this.props.cancel} onOk={this.props.cancel} destroyOnClose >
                    <Row gutter={16}>
                        <Col span={8}>{"@设备类型"}：{this.props.mi2001Info.StockInNumberDataSource.device_type}</Col>
                        <Col span={8}>{"@企业名称"}：{this.props.mi2001Info.StockInNumberDataSource.company_abbr}</Col>
                        <Col span={8}>{"@快递公司"}：{this.props.mi2001Info.StockInNumberDataSource.delivery_company}</Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>{"@备注"}：{this.props.mi2001Info.StockInNumberDataSource.remark}</Col>
                        <Col span={8}>{"@操作系统"}：{this.props.mi2001Info.StockInNumberDataSource.os}</Col>
                        <Col span={8}>{"@节点名称"}：{this.props.mi2001Info.StockInNumberDataSource.agency_name}</Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>{"@快递单号"}：{this.props.mi2001Info.StockInNumberDataSource.delivery_number}</Col>
                        <Col span={8}>ZTP：{this.props.mi2001Info.StockInNumberDataSource.by_ztp?"@启用":"@未启用"}</Col>

                    </Row>

                    <Table bordered size="middle" pagination={false}
                    rowClassName="normal" columns={Columns} dataSource={this.props.mi2001Info.StockInNumberDataSource.stocks}/>
        </Modal>
    }

}

function mapDispatchToProps({mi2001Info}) {
    return {mi2001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(StockOutNumberModal)));