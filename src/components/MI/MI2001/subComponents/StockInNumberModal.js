/*@运维-设备出/入库*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Form,Table,Row,Col} from 'antd';
import {injectIntl} from "react-intl";
import {commonTranslate} from "../../../../utils/commonUtilFunc";
class StockInNumberModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount =()=>{
    }
    render() {
        const __=commonTranslate(this);
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
                title: "@设备名称",
                dataIndex: 'name',
                key: 'name',

            }, {
                title: "@备注",
                dataIndex: 'remark',
                key: 'remark',
            },];
        return <Modal width="900px" maskClosable={false} visible={this.props.visible} title={"@设备入库信息"}
                      onCancel={this.props.cancel} onOk={this.props.cancel} destroyOnClose >
                    <Row gutter={16}>
                        <Col span={12}>{"@供应商"}：{this.props.mi2001Info.StockInNumberDataSource.client}</Col>
                        <Col span={12}>{"@说明"}：{this.props.mi2001Info.StockInNumberDataSource.remark}</Col>
                    </Row>
                    <Table bordered size="middle" pagination={false}
                    rowClassName="normal" columns={Columns} dataSource={this.props.mi2001Info.StockInNumberDataSource.stocks}/>
        </Modal>
    }

}

function mapDispatchToProps({mi2001Info}) {
    return {mi2001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(StockInNumberModal)));