import {connect} from 'dva';
import BI0703C from '../../components/BI/BI0703/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0703Info }) {
    return {bi0703Info};
}

const BI0703R = Form.create()(BI0703C);

export default connect(mapDispatchToProps)(BI0703R);