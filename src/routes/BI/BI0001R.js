
import {connect} from 'dva';
import BI0001C from '../../components/BI/BI0001/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0001Info }) {
    return {bi0001Info};
}

const BI0001R = Form.create()(BI0001C);

export default connect(mapDispatchToProps)(BI0001R);


