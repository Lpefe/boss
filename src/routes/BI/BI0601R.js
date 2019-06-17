
import {connect} from 'dva';
import BI0601C from '../../components/BI/BI0601/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1401Info }) {
    return {ci1401Info};
}

const BI0601R = Form.create()(BI0601C);

export default connect(mapDispatchToProps)(BI0601R);