import {connect} from 'dva';
import BI1903C from '../../components/BI/BI1903/Index';
import {Form} from 'antd';

function mapDispatchToProps({ bi1903Info }) {
    return {bi1903Info};
}

const BI1903R = Form.create()(BI1903C);

export default connect(mapDispatchToProps)(BI1903R);