import {connect} from 'dva';
import BI1901C from '../../components/BI/BI1901/Index';
import {Form} from 'antd';

function mapDispatchToProps({ bi1901Info }) {
    return {bi1901Info};
}

const BI1901R = Form.create()(BI1901C);

export default connect(mapDispatchToProps)(BI1901R);