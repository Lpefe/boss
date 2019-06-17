import {connect} from 'dva';
import BI0901C from '../../components/BI/BI0901/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0901Info }) {
    return {bi0901Info};
}

const BI0901R = Form.create()(BI0901C);

export default connect(mapDispatchToProps)(BI0901R);